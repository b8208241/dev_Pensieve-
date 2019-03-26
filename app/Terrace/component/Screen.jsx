import React from 'react';
import {
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import SvgAround from '../../Component/Svg/SvgAround.jsx';

const styleMiddle = {
  base: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box',
  }
}

class Screen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      scroll: false
    };
    this._handleMouse_terraceFrame = this._handleMouse_terraceFrame.bind(this);
    this._handleClick_nav_expand = this._handleClick_nav_expand.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      terraceCom_Screen_plane_: {
        width: '100%',
        height: '53.5%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        boxShadow: 'inset 0px -0.24rem 0.3rem -0.28rem',
        backgroundColor: '#FAFAFA'
      },
      terraceCom_Screen_floor_: {
        width: '100%',
        height: '46.5%',
        position: 'absolute',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box',
        boxShadow: '0 0.24rem 0.5rem -0.28rem inset',
        backgroundColor: '#FFFFFF'
      },
      terraceCom_Screen_account_: {
        maxWidth: '40%',
        position: 'absolute',
        top: '51.5%',
        left: '30%',
        transform: 'translate(-36%,-50%)',
        boxSizing: 'border-box'
      },
      terraceCom_Screen_account_name: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: "3.9rem",
        letterSpacing: '0.3rem',
        fontWeight: '400',
        color: '#000000'
      },
      terraceCom_Screen_options_: {
        position: 'absolute',
        top: '48%',
        right: '24%',
        boxSizing: 'border-box'
      },
      terraceCom_Screen_options_expand: {
        display: 'inline',
        position: 'relative',
        boxSizing: 'border-box',
        fontWeight: '400',
        fontSize: "2.4rem",
        letterSpacing: '0.15rem',
        color: '#ff7a5f',
        cursor: 'pointer'
      },
      terraceCom_Screen_return_: {
        width: '6%',
        height: '11%',
        position: 'absolute',
        top: '37%',
        right: '29%',
        boxSizing: 'border-box',
      },
    }
  }

  _handleClick_nav_expand(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/cognition/embedded/inspireds');
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleMouse_terraceFrame(event){
    if(event.deltaY > 0){
      this.setState((prevState, props)=>{
        return {scroll: true}
      })
    };
  }

  render(){
    //let cx = cxBind.bind(styles);

    return(
      this.state.scroll?(
        <Redirect to="?watch=appearance"/>
      ):(
        <div
          ref={(element)=>{this.terrace_pagenav=element;}}
          style={styleMiddle.styleMiddle}
          onWheel={this._handleMouse_terraceFrame}>
          <div
            style={this.style.terraceCom_Screen_plane_}>
            <div style={this.style.terraceCom_Screen_account_}>
              <span style={this.style.terraceCom_Screen_account_name}>{this.props.userInfo.firstName+" "+this.props.userInfo.lastName}</span>
            </div>
            <div
              style={this.style.terraceCom_Screen_options_}>
              <div style={{display: 'inline',position: 'relative',top:'-0.24rem',marginRight:'8%',borderLeft: 'solid 0.2rem #e6e6e6'}}></div>
              <div
                style={this.style.terraceCom_Screen_options_expand}
                onClick={this._handleClick_nav_expand}>
                {'expand'}
              </div>
            </div>
          </div>
          <div
            style={this.style.terraceCom_Screen_floor_}>
            <div
              style={this.style.terraceCom_Screen_return_}
              onClick={this._handleClick_selfClose}>
              <SvgAround/>
            </div>
          </div>
        </div>
      )
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(Screen);
