import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class SignBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onButton: false
    };
    this._handleEnter_button = this._handleEnter_button.bind(this);
    this._handleLeave_button = this._handleLeave_button.bind(this);
  }

  render(){
    return(
      <div
        className={classnames( styles.comSignBlock)}>
        <div style={{textAlign: 'center'}}>
          <span
            className={classnames( 'fontSubtitle', 'colorDescripBlack')}>
            {this.props.i18nUIString.catalog['guiding_Sign_signUpInvite']}
          </span>
        </div>
        <div
          className={classnames( styles.boxBtns)}>
          <Link
            value={'signin'}
            className={classnames( 'plainLinkButton', styles.boxNavBtn)}
            to={'/'}
            style={Object.assign({},
              {marginRight: '7%'},
              (this.state.onButton=="signin")? {backgroundColor: "#ff8168", cursor: 'pointer'}:{}
            )}
            onTouchStart={this._handleEnter_button}
            onTouchEnd={this._handleLeave_button}
            onMouseEnter={this._handleEnter_button}
            onMouseLeave={this._handleLeave_button}>
            <span
              className={classnames(
                'centerAlignChild', 'fontNodesEqual',
                {
                  ["colorDescripBlack"]: (this.state.onButton != "signin"),
                  ["colorWhite"]: (this.state.onButton == "signin")
                }
              )}
              style={{whiteSpace: 'nowrap'}}>
              {this.props.i18nUIString.catalog['submit_nav_Signin']}
            </span>
          </Link>
          <Link
            value={'signup'}
            className={classnames( 'plainLinkButton', styles.boxNavBtn)}
            to={'/signup'}
            style={Object.assign({},
              (this.state.onButton=="signup")? {backgroundColor: "#ff8168", cursor: 'pointer'}:
              {backgroundColor: '#4587A0'}
            )}
            onTouchStart={this._handleEnter_button}
            onTouchEnd={this._handleLeave_button}
            onMouseEnter={this._handleEnter_button}
            onMouseLeave={this._handleLeave_button}>
            <span
              className={classnames(
                'centerAlignChild',
                'colorWhite', 'fontNodesEqual'
              )}
              style={{whiteSpace: 'nowrap'}}>
              {this.props.i18nUIString.catalog['submit_nav_Signup']}
            </span>
          </Link>
        </div>
      </div>
    )
  }

  _handleEnter_button(e){
    this.setState({
      onButton: e.currentTarget.getAttribute('value')
    })
  }

  _handleLeave_button(e){
    this.setState({
      onButton: false
    })
  }
}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SignBlock));
