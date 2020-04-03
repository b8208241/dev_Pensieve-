const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_usersUnits = require('../../../db/models/index').users_units;
const _DB_unitsNodes_assign = require('../../../db/models/index').units_nodes_assign;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;

const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../../utils/reserrHandler.js');


async function _handle_GET_feedUnitslist_assigned(req, res){

  const userId = req.extra.tokenUserId;
  const lastVisit = new Date(req.query.timeBase); // param from query could only be parse as 'string', we need to turn it into time
  const userHomeland = await _DB_usersNodesHomeland.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    return !!result ? result: false;
  })
  .catch((err)=>{
    _handle_ErrCatched(new internalError("from _DB_usersNodesHomeland selection _handle_GET_feedUnitslist_assigned, "+err, 131), req, res);});
  const userResidence = await _DB_usersNodesResidence.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    return !!result ? result: false;
  })
  .catch((err)=>{
    _handle_ErrCatched(new internalError("from _DB_usersNodesResidence selection _handle_GET_feedUnitslist_assigned, "+err, 131), req, res);});

  const _find_assigned_unread = (userId, belongList)=>{
    return Promise.all([
      _DB_usersUnits.findAll({
        where: {
          id_user: userId,
        }
      }).then((result)=>{return result;}),
      _DB_unitsNodes_assign.findAll({
        where: {
          nodeAssigned: belongList,
        },
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ],
        limit: 32
      }).then((result)=>{return result;})
      .catch((err)=>{throw err})
    ])
    .then(([resultRead, resultNodesAssign])=>{
      //compare 2 selection, remove units read by the user from assignedList
      let readList = resultRead.map((row, index)=>{
        return row.id_unit;
      });
      let unreadList = resultNodesAssign.filter((row, index) => {
        return readList.indexOf(row.id_unit) < 0
      });

      if(unreadList.length > 0) return {status: 'unread', list: unreadList}
      else if(resultNodesAssign.length > 0){ //if all assigned were read, return the last one in selection(not the latest)
        let readOne = [];
        readOne.push(resultNodesAssign[resultNodesAssign.length-1]); //keep the instance in an arr
        return {status: 'allread', list: readOne};
      }
      else{ //which means no assigned to user's belong at all
        return _DB_unitsNodes_assign.findAll({
          where: {
            id_author: {[Op.ne]: userId} //any but not user him/herself
          },
          order: [
            Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
            //it would make an Error if we provide col name by 'arr'
          ],
          limit: 1 //because we use 'findAll' to keep form consistency, we set 'limit' to mimic 'findOne'
        })
        .then((result)=>{
          return {status: 'noneassigned', list: result};
        })
        .catch((err)=>{throw err})
      }

    }) //and we have to select from units for getting exposedId
    .then((selectResultObj)=>{
      let unitsList=[],
          unitsInfo={listStatus: selectResultObj.status} ; //status was for whole list, set directly
      selectResultObj.list.forEach((row,index)=>{
        /*
        it is possible that one unit has two assigned (for current situation, homeland & residence are both assigned),
        so we also need to distinguish it
        */
        if(!(row.id_unit in unitsInfo)) { //check if this row represent a new unit first
          unitsList.push(row.id_unit);
          unitsInfo[row.id_unit] = {};
          unitsInfo[row.id_unit][row.belongTypes] = row.nodeAssigned; // put assigned info into a unit-oriented obj
        }
        else unitsInfo[row.id_unit][row.belongTypes] = row.nodeAssigned;
      });
      return _DB_units.findAll({
        where: {
          id: unitsList
        }
      })
      .then((resultUnit)=>{
        //we need not only the selection from units, but also the previous result from units_nodes_assign
        let assignedUnits = resultUnit.map((row, index)=>{
          return {
            id_unit: row.id,
            exposedId: row.exposedId,
            createdAt: row.createdAt,
            assignedInfo: unitsInfo[row.id],
            listStatus: unitsInfo.listStatus //keep it in every unit, later would be check by foreach
          };
        });
        return assignedUnits;
      });

    })
    .catch((err)=>{throw err})
  };

  if(!userHomeland && !userResidence) {
    let sendingData={temp:{}}; //just an empty obj
    _res_success(res, sendingData, "GET: user feed/unitslist/assigned, complete.");
    return; //no need to go through any further
  };

  new Promise((resolve, reject)=>{
    let belongList = []; //list used to select from assign
    if(!!userResidence){ belongList.push(userResidence.id_node);};
    if(!!userHomeland){ belongList.push(userHomeland.id_node)};

    _find_assigned_unread(userId, belongList)
    .then((assignedUnits)=>{ // Notice! the resultAssign was 'Not' an instance, it's a plain js obj
      let sendingData={
        listUnread: [],
        listUnreadNew: [],
        noneassigned: false,
        allread: false,
        temp: {}
      };
      let newSetResi = (userResidence.createdAt > lastVisit)? true : false;
      let newSetHome = (userHomeland.createdAt > lastVisit)? true : false;
      
      assignedUnits.forEach((unitObj, index) => {
        /*
        distinguish: if the req are the 1st after belong set
        */
        if( unitObj.listStatus != 'noneassigned' && newSetResi || newSetHome){ // if one or both belong are new set, and! there is any assigned to it
          if(newSetResi && 'residence' in unitObj.assignedInfo) {sendingData.listUnreadNew.push({unitId: unitObj.exposedId});return;};
          if(newSetHome && 'homeland' in unitObj.assignedInfo) {sendingData.listUnreadNew.push({unitId: unitObj.exposedId});return;};
        };
        //and if none new set, we just pick the new created after last visit
        if(unitObj.createdAt < lastVisit ){
          sendingData.listUnread.push({unitId: unitObj.exposedId});
        }
        else sendingData.listUnreadNew.push({unitId: unitObj.exposedId});

        sendingData.noneassigned = (unitObj.listStatus =='noneassigned') ? true : false; //lazy way to use status pass in every row of unit
        sendingData.allread = (unitObj.listStatus =='allread') ? true : false;
      });
      return sendingData;

    })
    .then((sendingData)=>{
      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: user feed/unitslist/assigned, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: user feed/unitslist/assigned.');
  _handle_GET_feedUnitslist_assigned(req, res);
})

module.exports = execute;