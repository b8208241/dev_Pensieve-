import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../Svg/SvgLogo.jsx';
import ServiceLinks from '../ServiceLinks.jsx';

class NavWithin extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){

    return(
      <div
        className={classnames(styles.comNavWithin)}>
        <div
          className={classnames(styles.boxLogo)}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/')}}>
          <SvgLogo/>
        </div>

        <div
          className={classnames(styles.boxFooter)}>
          <ServiceLinks />
          <div
            className={classnames(styles.boxRightsClaim)}>
            <span>{this.props.i18nUIString.catalog["Cornerth_inc"]}</span>
            <span>{this.props.i18nUIString.catalog["AllRights"]}</span>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

export default connect(
  mapStateToProps,
  null
)(NavWithin);
