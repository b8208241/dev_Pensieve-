import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  SheetAccount,
  SheetBasic
} from './SheetCom.jsx';
import PasswordForm from '../../Components/PasswordForm.jsx';
import AccountPalette from '../../Components/AccountPalette.jsx';
import {mountUserSheet} from "../../redux/actions/front.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

const styleMiddle = {

}

  class Sheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_SheetView = this._render_SheetView.bind(this);
    this._submit_password_success = this._submit_password_success.bind(this);
    this.style={
      selfCom_Sheet_ProfileTitle_: {
        width: '100%',
        height: '115px',
        position: 'absolute',
        top: '11px',
        right: '0',
        boxSizing: 'border-box',
        boxShadow: '1px 0px 3px -2px',
        backgroundColor: '#ffffff'
      },
      selfCom_Sheet_ProfileTitle_name: {
        display: 'inline-block',
        position: 'absolute',
        bottom: '22%',
        left: '6%',
        boxSizing: 'border-box',
        color: '#000000'
      },
      selfCom_Sheet_display_: {
        width: '100%',
        position: 'absolute',
        top: '151px',
        left: '0',
        boxSizing: 'border-box',
      },
      selfCom_Sheet_display_basic_: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      selfCom_Sheet_display_settingform: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: '0px 0px 3px -2px',
        backgroundColor: '#FFFFFF'
      },
      selfCom_Sheet_display_basic_tempSetting: {
        width: '100%',
        height: '152px',
        position: 'relative',
        boxSizing: 'border-box',
        marginBottom: '2.5%',
        boxShadow: '0px 0px 3px -2px',
      },
      selfCom_Sheet_display_basic_blockGender: {
        width: '100%',
        height: '118px',
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: '0px 0px 3px -2px',
      },
    }
  }

  _submit_password_success(){
    window.location.assign('/self/profile/sheet');
  }

  componentDidMount(){
    //save in the reducer, so check if there are data: this.props.userSheet: ify?
    if(!this.props.userSheet.ify){
      //we combine 2 page to one at this moment, reflect the "lite version"
      //_set_store_userSheetMount(obj)；the action for accountSet has not yet builded
      const self = this;
      let _axios_getUserSheet = ()=>{
        return axios.get('/router/profile/sheet', {
          headers: {
            'charset': 'utf-8',
            'token': window.localStorage['token']
          },
          cancelToken: this.axiosSource.token
        });
      }, _axios_getAccountSet = ()=>{
        return axios.get('/router/account/setting', {
          headers: {
            'charset': 'utf-8',
            'token': window.localStorage['token']
          },
          cancelToken: this.axiosSource.token
        });
      };
      let axiosArr = [_axios_getUserSheet(),_axios_getAccountSet()];
      axios.all(axiosArr).then(
        axios.spread(function(sheetRes, accountRes){
          let sheetResObj = JSON.parse(sheetRes.data),
              accountResObj = JSON.parse(accountRes.data);
          sheetResObj['ify'] = true;
          self.setState({
            axios: false
          });
          self.props._set_store_userSheetMount(sheetResObj.main.sheetSet, accountResObj.main.accountSet);
        })
      ).catch(function (thrown) {
        self.setState({ axios: false });
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if (message) alert(message);
        }
      });
    }
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_SheetView(paramsStatus){
    switch (paramsStatus) {
      case 'password':
        return (
          <div
            style={this.style.selfCom_Sheet_display_settingform}>
            <span>{'change password'}</span><br/>
            <PasswordForm
              {...this.props}
              _submit_success={this._submit_password_success}/>
          </div>
        )
        break;
      default:
        return (
          <div
            style={this.style.selfCom_Sheet_display_basic_}>
            <div
              style={this.style.selfCom_Sheet_display_basic_tempSetting}>
              <SheetAccount {...this.props}/>
            </div>
            <div
              style={this.style.selfCom_Sheet_display_basic_blockGender}>
              <SheetBasic {...this.props}/>
            </div>
          </div>
        )
    };
  }

  render(){
    //let cx = cxBind.bind(styles);
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsStatus = params.get('status');

    return(
      <div>
        <div
          style={this.style.selfCom_Sheet_ProfileTitle_}>
          <div
            style={this.style.selfCom_Sheet_ProfileTitle_name}>
            <AccountPalette
              size={'large'}
              accountFirstName={this.props.userInfo.firstName}
              accountLastName={this.props.userInfo.lastName}
              styleFirst={{fontWeight: '600'}}/>
          </div>
        </div>
        <div
          style={this.style.selfCom_Sheet_display_}>
          {this._render_SheetView(paramsStatus)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    userSheet: state.userSheet,
    accountSet: state.accountSet
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_store_userSheetMount: (sheetObj, accountSet)=>{dispatch(mountUserSheet(sheetObj, accountSet));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sheet));