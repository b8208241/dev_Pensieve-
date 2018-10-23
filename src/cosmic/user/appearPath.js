const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_res_success} = require('../../utils/resHandler.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _handle_cosmic_userAppearPath(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      //special process for this component
      let desiredUser = Number(req.query.id);// echo the type of userId from payload.
      if(!desiredUser){_handler_err_BadReq('invalid query.', res);return}//prevent the server crushing due to invalid query .
      if(userId == desiredUser){_handler_err_BadReq('Unmatch user token.', res);return}//cosmic should always browse someone "else"
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection in loading appearPath in Cosmic user.")
        }else{
          console.log('loading req: appearPath in Cosmic user.');
          let _promise_composeInspiresSet = (tempData)=>{
            return new Promise((resolve, reject)=>{
              let selectQuery = "SELECT * FROM marks WHERE (id) IN (?)";
              connection.query(selectQuery, [tempData.temp.marksList], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                if(rows.length> 0){
                  rows.forEach((row, index)=>{
                    let markSet = {
                      editorContent: JSON.parse(row.editor_content),
                      layer: row.layer
                    }
                    tempData.marksBasic[row.id] = markSet;
                    tempData.unitsBasic[row.id_unit] = {relation: 'inspired', marksList: [row.id]};
                    tempData.temp.unitsList.push([row.id_unit]);
                  })
                  resolve(tempData);
                }else{
                  _handler_err_Internal('data mismatch.', res);
                  reject('data mismatch.');
                }
              })
            }).then((tempData)=>{
              return new Promise((resolve, reject)=>{
                let selectQuery = "SELECT * FROM units WHERE (id) IN (?)";
                connection.query(selectQuery, [tempData.temp.unitsList], function(err, rows, fields){
                  if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                  if(rows.length> 0){
                    rows.forEach((row, index)=>{
                      tempData.unitsList.push(row.id);
                      Object.assign(tempData.unitsBasic[row.id], {
                        authorId: row.id_author,
                        pic_layer0: row.url_pic_layer0,
                        created: row.established
                      });
                    })
                    delete tempData.temp;
                    resolve(tempData);
                  }else{
                    _handler_err_Internal('data mismatch.', res);
                    reject('data mismatch.');
                  }
                })
              })
            })
          };
          let _promise_composeUnitsSet = (tempData)=>{
            return new Promise((resolve, reject)=>{
              let selectQuery = "SELECT * FROM marks WHERE (id_unit) IN (?)";
              connection.query(selectQuery, [tempData.temp.unitsList], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                if(rows.length> 0){
                  rows.forEach((row, index)=>{
                    tempData.unitsBasic[row.id_unit].marksList.push(row.id);
                    tempData.marksBasic[row.id] = {
                      editorContent: JSON.parse(row.editor_content),
                      layer: row.layer
                    }
                  })
                  delete tempData.temp;
                  resolve(tempData);
                }else{
                  resolve(tempData);
                }
              })
            })
          };

          let _db_selectShared = new Promise((resolve, reject)=>{
            console.log('loading req: appearPath in Cosmic user, select shared units.');
            let selectQuery = "SELECT * FROM units WHERE id_author = ?";
            connection.query(selectQuery, [desiredUser], function(err, rows, fields){
              if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
              let tempData = {
                unitsList: [],
                unitsBasic: {},
                marksBasic: {},
                temp: {unitsList: []}
              }
              if(rows.length> 0){
                rows.forEach((row, index)=>{
                  tempData.unitsList.push(row.id);
                  tempData.unitsBasic[row.id]={
                    authorId: row.id_author,
                    pic_layer0: row.url_pic_layer0,
                    created: row.established,
                    relation: "shared",
                    marksList: []
                  };
                  tempData.temp.unitsList.push([row.id]);
                })
                _promise_composeUnitsSet(tempData).then((tempData)=>{
                  resolve(tempData);
                });
              }else{
                console.log('loading req: appearPath in Cosmic user, there is not unit shared by this user.');
                resolve(tempData);
              }
            })
          })

          let _db_selectFromInspired = new Promise((resolve, reject)=>{
            console.log('loading req: appearPath in Cosmic user, select inspired marks.');
            let selectQuery = "SELECT * FROM inspired WHERE id_user = ?";
            connection.query(selectQuery, [desiredUser], function(err, rows, fields){
              if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
              let tempData = {
                unitsList: [],
                unitsBasic: {},
                marksBasic: {},
                temp: {marksList: [],  unitsList: [], inspiredTime: {}}
              }
              if(rows.length> 0){
                rows.forEach((row, index)=>{
                  tempData.temp.marksList.push([row.id_mark]);
                  tempData.temp.inspiredTime[row.id_mark] = row.created;
                })
                _promise_composeInspiresSet(tempData).then((tempData)=>{
                  resolve(tempData);
                });
              }else{
                console.log('loading req: appearPath in Cosmic user, there is not inspired marks from this user.');
                resolve(tempData);
              }
            })
          })

          Promise.all([_db_selectShared, _db_selectFromInspired]).then((results)=>{
            return new Promise((resolve, reject)=>{
              console.log('database connection: success.')
              let sendingData = {
                unitsList: [],
                unitsBasic: {},
                marksBasic: {},
                temp: {} //just due to the consistency for the function _res_success.
              }
              let sharedTemp = results[0];
              let inspiredTemp = results[1];
              sendingData.unitsList = sharedTemp.unitsList.concat(inspiredTemp.unitsList);//actually should ordered by the created time.
              Object.assign(sendingData.unitsBasic, inspiredTemp.unitsBasic, sharedTemp.unitsBasic)//unitBasic from sharedTemp contain a more complete marksList.
              Object.assign(sendingData.marksBasic, inspiredTemp.marksBasic, sharedTemp.marksBasic)
              resolve(sendingData);
            })
          }).then((sendingData)=>{
            _res_success(res, sendingData, "loading req: appearPath in Cosmic user, complete.");
            connection.release();
          }).catch((err)=>{
            console.log("error occured during appearPath in Cosmic user req promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
};

module.exports = _handle_cosmic_userAppearPath
