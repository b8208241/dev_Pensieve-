import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import stylesNail from "../../../stylesNail.module.css";
import ChainUpload from './ChainUpload.jsx';
import ChainMessage from './ChainMessage.jsx';
import NailBasic from '../../../../Components/Nails/NailBasic/NailBasic.jsx';
import NailShared from '../../../../Components/Nails/NailShared/NailShared.jsx';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import { submitChainList
} from "../../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class Chain extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      fetched: false,
      unitsBasic: {},
      marksBasic: {}
    };

    this.axiosSource = axios.CancelToken.source();
    this._set_ChainUnits = this._set_ChainUnits.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._render_ChainUnits = this._render_ChainUnits.bind(this);
    this._axios_get_chainlist = this._axios_get_chainlist.bind(this);
  }

  _submit_Share_New(dataObj){
    //Fetch list again
    this._set_ChainUnits();
  }

  _set_ChainUnits(params){
    const self = this;
    this.setState({axios: true});

    this._axios_get_chainlist(params)
    .then((resObj)=>{
      //(we don't update the 'axios' state, because there is another axios here, for units, right after the res)
      /*
      resObj.main: {
              userShared: false,
              resToShared: false,
              resToRespond: false,
              latestShared: false
              }
      */
      let displayOrder = [], displayInfo={};
      displayOrder.push(resObj.main['sharedPrimer'], resObj.main['userShared'], resObj.main['resToShared'],resObj.main['resToRespond'],resObj.main['latestShared']);
      displayOrder = displayOrder.filter((item, index)=> {return item}); //use the property the item would be 'false' if none
      Object.keys(resObj.main).forEach((key, index) => {
        displayInfo[resObj.main[key]] = key;
      });

      self.props._submit_list_Chain({
        listOrderedChain: displayOrder,
        listInfo: displayInfo
      });
      self.setState({
        fetched: true,
      });
      self.props._set_mountToDo('chainlist'); // and, after we get the list back, inform the parent we are done with the lastVisit time

      return axios_get_UnitsBasic(self.axiosSource.token, displayOrder); //and use the list to get the data of eahc unit
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
        });
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  _axios_get_chainlist(params){
    let paramObj = {};
    if(!!params) params.forEach((param, index) => {
      paramObj[param.key] = param.value;
    });

    return axios({
      method: 'get',
      url: '/router/feed/chainlist',
      params: paramObj,
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
      return resObj;
    }).catch(function (thrown) {
      throw thrown;
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    /*
    GET　chain list if! the belongsByType has changed
    */
    const recKeys = Object.keys(this.props.belongsByType);
    //it's very slow to compare 2 obj directly, so just compare by key pair we already set up
    let residenceify = (this.props.belongsByType['residence'] == prevProps.belongsByType['residence']) ? true:false;
    let homelandify = (this.props.belongsByType['homeland'] == prevProps.belongsByType['homeland']) ? true:false;
    if(recKeys.length > 0 && (!residenceify || !homelandify)){ //if Not the same
      this._set_ChainUnits();
    };
    //monitor flag for this comp.
    if(this.props.flagChainFetRespond && this.props.flagChainFetRespond != prevProps.flagChainFetRespond) this._set_ChainUnits([{key: 'respond',value:true}]);
  }

  componentDidMount(){
    /*
    if props.belongsByType has something,
    GET　chain list
    */
    const recKeys = Object.keys(this.props.belongsByType);
    if(recKeys.length> 0) this._set_ChainUnits();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_ChainUnits(){
    let nailsDOM = [];
    const props = this.props; //f() _nailTitle only under this _render_, could not link to "this"

    function _nailTitle(unitType){
      switch (unitType) {
        case 'userShared':
          return (
            <span>{props.i18nUIString.catalog['catagory_indexChain_NailTypes'][0]}</span>
            )
          break;
        case 'resToShared':
          return (
            <span>{props.i18nUIString.catalog['catagory_indexChain_NailTypes'][1]}</span>
          )
          break;
        case 'resToRespond':
          return (
            <span>{props.i18nUIString.catalog['catagory_indexChain_NailTypes'][2]}</span>
          )
          break;
        case 'latestShared':
          return (
            <span>{props.i18nUIString.catalog['catagory_indexChain_NailTypes'][3]}</span>
          )
          break;
        default:
          return null
      }

    }
    this.props.chainList.listOrderedChain.forEach((unitId, index) => {
      //render if there are something in the data
      if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch

      nailsDOM.push(
        <div>
          {_nailTitle(this.props.chainList.listInfo[unitId])}
          <div
            key={"key_ChainNail_"+index}
            className={classnames(stylesNail.boxNail, stylesNail.heightBasic, stylesNail.wideBasic)}>
            <NailBasic
              {...this.props}
              unitId={unitId}
              linkPath={'/unit'}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        </div>
      );

    });

    return nailsDOM;
  }

  render(){
    return (
      <div
        className={classnames(styles.comChain)}>
        <ChainMessage
          {...this.state}
          _submit_Share_New={this._submit_Share_New}
          _refer_von_cosmic={this.props._refer_von_cosmic}/>
        {
          (this.props.chainList.listOrderedChain.length > 0) &&
          <div
            className={classnames(styles.boxModule)}>
            {this._render_ChainUnits()}
            <div
              className={classnames(styles.boxChainUpload)}>
              <ChainUpload
                _submit_Share_New={this._submit_Share_New}
                _refer_von_cosmic={this.props._refer_von_cosmic}/>
            </div>
          </div>
        }

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    chainList: state.chainList,
    flagChainFetRespond: state.flagChainFetRespond
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_list_Chain: (obj) => { dispatch(submitChainList(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Chain));