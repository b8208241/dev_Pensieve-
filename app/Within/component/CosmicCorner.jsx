import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

const commonStyle = {
  withinCom_CosmicCorner_options_: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '2vh 0 0 0',
    fontSize: '1.4rem',
    letterSpacing: '0.16rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    cursor: 'pointer'
  }
}

class CosmicCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
    this.style={
      withinCom_CosmicCorner_: {
        position: 'absolute',
        bottom: '0',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box'
      }
    }
  }

  _handleClick_cosmic_Self(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/screen');
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_CosmicCorner_}>
        <div
          style={Object.assign({marginBottom: '2vh'}, commonStyle.withinCom_CosmicCorner_options_)}>
          {"selector"}
        </div>
        <div
          style={ commonStyle.withinCom_CosmicCorner_options_}>
          {"focus"}
        </div>
        <div
          style={ commonStyle.withinCom_CosmicCorner_options_}>
          <Link
            to="/"
            style={{textDecoration: 'none', color: '#fc766a'}}>
            {"around"}
          </Link>
        </div>
        <div
          style={Object.assign({color: '#333333'}, commonStyle.withinCom_CosmicCorner_options_)}
          onClick={this._handleClick_cosmic_Self}>
          {this.props.userInfo.account}
        </div>
      </div>
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
)(CosmicCorner);
