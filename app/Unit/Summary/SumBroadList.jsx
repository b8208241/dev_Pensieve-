import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import {AccountPlate} from '../../Component/AccountPlate.jsx';
import {
  handleUsersList
} from "../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class SumBroadList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      modalAll: false,
      usersList: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_broadList = this._render_broadList.bind(this);
    this._axios_get_listBroad = this._axios_get_listBroad.bind(this);
    this._handleClick_list_toggle = this._handleClick_list_toggle.bind(this);
    this.style={

    };
  }

  _handleClick_list_toggle(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{
      return {
        modalAll: prevState ? false : true
      }
    });
  }

  _axios_get_listBroad(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/broad/'+this.props.unitCurrent.unitId, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      //submit change to reducer
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.setState({
        axios: false,
        usersList: resObj.main.usersList
      });

    }).catch(function (thrown) {
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
    if( !(prevProps.unitCurrent.broad===this.props.unitCurrent.broad) ){ //unitCurrent.broad is a boolean, need compare by '===' to avoid complicated exceptions
      this._axios_get_listBroad();
    }
  }

  componentDidMount(){
    this._axios_get_listBroad();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  _render_broadList(){
    let listDOM = this.state.usersList.map((userId, index)=>{
      return (
        <div>
          {
            (userId in this.props.usersBasic) &&
            <AccountPlate
              size={'regular'}
              accountFisrtName={this.props.usersBasic[userId].firstName}
              accountLastName={this.props.usersBasic[userId].lastName}/>
          }
        </div>
      )
    });

    return listDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comSum_Broad)}>
        <div
          className={classnames(styles.comSum_boxList)}>
          {this._render_broadList()}
        </div>
        <div
          className={classnames(styles.comSum_boxOpenALl)}
          onClick={this._handleClick_list_toggle}>
          {"check all"}
        </div>
        {
          this.state.modalAll &&
          <div>
            {this._render_broadList()}
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    usersBasic: state.usersBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SumBroadList));
