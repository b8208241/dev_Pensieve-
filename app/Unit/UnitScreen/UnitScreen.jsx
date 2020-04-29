import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import Theater from '../Theater/Theater.jsx';
import SharedEdit from '../Editing/SharedEdit.jsx';
import CreateRespond from '../Editing/CreateRespond.jsx';
import {
  _axios_getUnitData,
  _axios_getUnitImgs,
  _axios_getUnitSrc,
  _axios_getUnitPrimer
} from '../utils.js';
import ModalBox from '../../Components/ModalBox.jsx';
import ModalBackground from '../../Components/ModalBackground.jsx';
import {
  setUnitView,
} from "../../redux/actions/unit.js";
import {
  setUnitCurrent,
  handleUsersList,
  updateNodesBasic,
  updateUsersBasic
} from "../../redux/actions/general.js";
import {unitCurrentInit} from "../../redux/states/constants.js";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

class UnitScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      close: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_switch = this._render_switch.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this._set_UnitCurrent = this._set_UnitCurrent.bind(this);
    this._set_UnitCurrentPrimer = this._set_UnitCurrentPrimer.bind(this);
    this._reset_UnitMount = this._reset_UnitMount.bind(this);
    this.style={

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  _close_modal_Unit(){
    //close the whole Unit Modal
    //different from the one in Theater, which used only for closing Theater
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  _reset_UnitMount(){
    //Don't worry about the order between state reset, due to the Redux would keep always synchronized
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    this._set_UnitCurrent();
  }

  _set_UnitCurrent(){
    const self = this;
    this.setState({axios: true});

    let promiseArr = [
      new Promise((resolve, reject)=>{_axios_getUnitData(this.axiosSource.token, this.unitId).then((result)=>{resolve(result);});}),
      new Promise((resolve, reject)=>{_axios_getUnitImgs(this.axiosSource.token, this.unitId).then((result)=>{resolve(result);});})
    ];
    Promise.all(promiseArr)
    .then(([unitRes, imgsBase64])=>{
      self.setState({axios: false});
      let resObj = JSON.parse(unitRes.data);
      //we compose the marksset here, but sould consider done @ server
      let keysArr = Object.keys(resObj.main.marksObj);//if any modified or update, keep the "key" as string
      let [coverMarks, beneathMarks] = [{list:[],data:{}}, {list:[],data:{}}];
      // due to some historical reason, the marks in unitCurrent has a special format
      keysArr.forEach(function(key, index){
        if(resObj.main.marksObj[key].layer==0){
          coverMarks.data[key]=resObj.main.marksObj[key];
          coverMarks.list[resObj.main.marksObj[key].serial] = key; //let the list based on order of marks, same as beneath
        }else{
          beneathMarks.data[key]=resObj.main.marksObj[key]
          beneathMarks.list[resObj.main.marksObj[key].serial] = key;
        }
      });
      // api GET unit data was totally independent, even the nodesBasic & userBasic
      //But we still update the info to redux state, for other comp. using
      let nodesBasic = {}, userBasic = {};
      resObj.main.nouns.list.forEach((nodeKey, index) => {
        nodesBasic[nodeKey] = resObj.main.nouns.basic[nodeKey];
      });
      userBasic[resObj.main.authorBasic.id] = resObj.main.authorBasic;
      self.props._submit_Nodes_insert(nodesBasic);
      self.props._submit_Users_insert(userBasic);

      //actually, beneath part might need to be rewritten to asure the state could stay consistency
      self.props._set_store_UnitCurrent({
        unitId:self.unitId,
        identity: resObj.main.identity,
        authorBasic: resObj.main.authorBasic,
        coverSrc: imgsBase64.cover,
        primerify: resObj.main.primerify,
        /*
        'beneath' was currently not used,
        and in order to 'not render' the beneath layer in the child component(which preserve most of its original structure),
        the best and simplest way is just rm the beneathSrc, like below,
        because all the 'check' for beneathify always ask the bool of this param.
        */
        //beneathSrc: imgsBase64.beneath,
        coverMarksList:coverMarks.list,
        coverMarksData:coverMarks.data,
        beneathMarksList:beneathMarks.list,
        beneathMarksData:beneathMarks.data,
        nouns: resObj.main.nouns,
        refsArr: resObj.main.refsArr,
        createdAt: resObj.main.createdAt
      });

      // this is a new add, req for a primer if (.primerify)
      if(resObj.main.primerify) self._set_UnitCurrentPrimer();
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

  _set_UnitCurrentPrimer(){
    //First, this is a token based req in a token free allowed comp.
    if( !window.localStorage['token'] ) return;

    const self = this;
    this.setState({axios: true});

    _axios_getUnitPrimer(this.axiosSource.token, this.unitId)
    .then((resObj)=>{
      self.props._submit_UsersList_new([resObj.main.authorId]); //still, get the user info
      self.props._set_store_UnitCurrent({ //pass the info about primer to redux state
        primer: {primerId: resObj.main.exposedId, authorPrimer: resObj.main.authorId}
      });
      // here we have next step to get the src of the cover img
      return _axios_getUnitSrc(this.axiosSource.token, resObj.main.exposedId);
    })
    .then((resObj)=>{
      self.setState({axios: false});
      self.props._set_store_UnitCurrent({ //pass the info about primer to redux state
        primerSrc: resObj.main['pic_layer0']
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

  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump to another Unit from Related but using the same component
    //so we check if the unit has changed
    //but Notice! always check the diff between the current & pre id from 'path search'
    //due to this is the only reliable and stable source (compare to the unitCurrent)
    let prevParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    if(this.unitId !== prevParams.get('unitId')){
      //reset UnitCurrent to clear the view
      this._reset_UnitMount();
    };
  }

  componentDidMount(){
    //because we fetch the data of Unit only from this file,
    //now we need to check if it was necessary to fetch or not in case the props.unitCurrent has already saved the right data we want
    this._set_UnitCurrent();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //reset UnitCurrent before leaving
    // It's Important !! next Unit should not have a 'coverSrc' to prevent children component render in UnitModal before Unit data response!
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    this.props._set_state_UnitView('theater'); // it's default for next view
    //last, recruit the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }

  _render_switch(){
    switch (this.props.unitView) {
      case 'theater':
        return (
          <Theater
            {...this.props}
            _reset_UnitMount={this._reset_UnitMount}
            _close_theaterHeigher={this._close_modal_Unit}/>
        )
        break;
      case 'editing':
        return (
          <SharedEdit
            {...this.props}
            _reset_UnitMount={this._reset_UnitMount}/>
        )
        break;
      case 'respond':
        return (
          <CreateRespond
            {...this.props}
            _reset_UnitMount={this._reset_UnitMount}
            _close_theaterHeigher={this._close_modal_Unit}/>
        )
        break;
      default:
        return null
    };
  }


  render(){
    if(this.state.close){let pathTo=this.props.location.pathname.replace("/unit","");return <Redirect to={pathTo}/>}
      //Notice !! beneath are remaining before there is a Related. Rm them only if Theater was no longer need a second comp.
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsTheater = params.has('theater'); //bool, true if there is 'theater'
    this.unitId = params.get('unitId');

    return(
      <ModalBox containerId="root">
        <ModalBackground
          onClose={()=>{this._close_modal_Unit();}}
          style={{
            position: "fixed",
            backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
          {this._render_switch()}
        </ModalBackground>
      </ModalBox>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitView: state.unitView,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _submit_Users_insert: (obj) => { dispatch(updateUsersBasic(obj)); },
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));},
    _set_store_UnitCurrent: (obj)=>{dispatch(setUnitCurrent(obj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitScreen));
