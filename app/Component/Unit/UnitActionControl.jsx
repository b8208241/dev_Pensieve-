import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

class UnitActionControl extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: true,
      broaded: false,
      tracked: false
    };
    this._handler_eventGeneral = (event)=>{event.preventDefault();event.stopPropagation();};
    this.axiosSource = axios.CancelToken.source();
    this._axios_ErrHandler = this._axios_ErrHandler.bind(this);
    this._axios_broadHandler = this._axios_broadHandler.bind(this);
    this._axios_trackHandler = this._axios_trackHandler.bind(this);
    this._render_ActionControl_authorify = this._render_ActionControl_authorify.bind(this);
    this._handleClick_UnitAction_Author = this._handleClick_UnitAction_Author.bind(this);
    this._handleClick_UnitAction_Response = this._handleClick_UnitAction_Response.bind(this);
    this._handleClick_UnitAction_Broad = this._handleClick_UnitAction_Broad.bind(this);
    this._handleClick_UnitTrack = this._handleClick_UnitTrack.bind(this);
    this.style={
      Com_UnitActionControl_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1%, 5%'
      },
      Com_UnitActionControl_span: {
        display: 'block',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3% 0 3%',
        verticalAlign: 'middle',
        fontSize: '1.6rem',
        letterSpacing: '0.16rem',
        textAlign: 'right',
        fontWeight: '400',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    };
  }

  _axios_ErrHandler(thrown){
    if (axios.isCancel(thrown)) {
      console.log('Request canceled: ', thrown.message);
    } else {
      if (thrown.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        alert('Something went wrong: '+thrown.response.data.message)
        if(thrown.response.status == 403){
          window.location.assign('/login');
        }
      } else if (thrown.request) {
          // The request was made but no response was received
          // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(thrown.request);
      } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error: ', thrown.message);
      }
      console.log("Error config: "+thrown.config);
    }
  }

  _axios_broadHandler(){
    const self = this;
    let headers = {
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'token': window.localStorage['token']
    };
    axios.post('/router/units/'+this.props.unitCurrent.unitId+'/broad', {}, {headers: headers}).then((res)=>{
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false
      });
    }).catch(function (thrown) {
      self.setState({axios: false});
      this._axios_ErrHandler(thrown);
    })
  }

  _axios_trackHandler(){
    const self = this;
    let headers = {
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    _axios_trackMethod = ()=> {
      return this.state.tracked?(
        axios.post('/router/units/'+this.props.unitCurrent.unitId+'/track', {}, {headers: headers})
      ):(
        axios.patch('/router/units/'+this.props.unitCurrent.unitId+'/track', {}, {headers: headers})
      );
    };

    _axios_trackMethod().then((res)=>{
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false
      });
    }).catch(function (thrown) {
      self.setState({axios: false});
      this._axios_ErrHandler(thrown);
    })
  }

  _handleClick_UnitAction_Response(event){
    this._handler_eventGeneral(event);
    this.props._set_Modalmode(true);
  }

  _handleClick_UnitAction_Broad(event){
    this._handler_eventGeneral(event);
    this.setState((prevState,props)=>{
      return {
        axios: true,
        broaded: prevState.broaded?false:true
      }
    }, this._axios_broadHandler);
  }

  _handleClick_UnitAction_Author(event){
    this._handler_eventGeneral(event);
    this.props._set_Modalmode("editing");
  }

  _handleClick_UnitTrack(event){
    this._handler_eventGeneral(event);
    this.setState((prevState,props)=>{
      return {
        axios: true,
        tracked: prevState.tracked?false:true
      }
    }, this._axios_trackHandler);
  }

  _render_ActionControl_authorify(){
    let component =  this.props.unitCurrent.identity=="author" ?(
      <div>
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitAction_Response}>
          {"response"}
        </span>
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitAction_Author}>
          {"edit"}
        </span>
        <span
          style={this.style.Com_UnitActionControl_span}>
          {"statics"}
        </span>
        <span
          style={this.style.Com_UnitActionControl_span}>
          {"erase"}
        </span>
      </div>
    ):(
      <div>
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitAction_Response}>
          {"response"}
        </span>
        {
          this.state.broaded?(
            <span
              style={this.style.Com_UnitActionControl_span}
              style={{cursor: "auto"}}>
              {"broaded"}
            </span>
          ):(
            <span
              style={this.style.Com_UnitActionControl_span}
              onClick={this._handleClick_UnitAction_Broad}>
              {'broad'}
            </span>
          )
        }
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitTrack}>
          {
            this.state.tracked?'追蹤取消':'追蹤'
          }
        </span>
      </div>
    );
    return component;
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitActionControl_}>
        {this._render_ActionControl_authorify()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(UnitActionControl));
