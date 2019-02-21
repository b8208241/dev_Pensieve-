import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import cxBind from 'classnames/bind';

export default class NavFront extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavFront_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavFront_link: {
        textDecoration: 'none',
        fontSize: '1.6rem',
        letterSpacing: '0.15rem',
        cursor: 'pointer'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        id="selfCom_NavFront_"
        style={this.style.selfCom_NavFront_}>
        <Link
          to={{
            pathname: "/profile/sheet",
            state: {from: this.props.location}
          }}
          style={this.style.selfCom_NavFront_link}>
          <span
            style={{cursor: 'pointer'}}>{'shelf'}</span>
        </Link>
      </div>
    )
  }
}
