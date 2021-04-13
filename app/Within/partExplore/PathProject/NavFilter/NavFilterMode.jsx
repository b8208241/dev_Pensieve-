import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgArrowStick from '../../../../Components/Svg/SvgArrowStick.jsx';

class NavFilterMode extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFilterNode: false,
      onSwitch: false
    };
    this._handleLeave_FilterNode = this._handleLeave_FilterNode.bind(this);
    this._handleEnter_FilterNode = this._handleEnter_FilterNode.bind(this);
    this._handleEnter_switchFilter = this._handleEnter_switchFilter.bind(this);
    this._handleLeave_switchFilter = this._handleLeave_switchFilter.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.viewFilterMap = urlParams.has('_filter_map');
    let toClose = new URLSearchParams(this.props.location.search); //we need value in URL query
    toClose.delete("_filter_nodes");
    toClose.delete("_filter_map");
    let filterCloseObj = {
      pathname: this.props.location.pathname,
      search: toClose.toString(),
      state: {from: this.props.location}
    };
    let toTabImg = new URLSearchParams(this.props.location.search); //we need value in URL query
    toTabImg.delete("_filter_nodes");
    toTabImg.delete("_filter_map");
    toTabImg.append("_filter_nodes", true);
    let filterImgObj = {
      pathname: this.props.location.pathname,
      search: toTabImg.toString(),
      state: {from: this.props.location}
    };
    let toTabMap = new URLSearchParams(this.props.location.search); //we need value in URL query
    toTabMap.delete("_filter_nodes");
    toTabMap.delete("_filter_map");
    toTabMap.append("_filter_nodes", true);
    toTabMap.append("_filter_map", true);
    let filterMapObj = {
      pathname: this.props.location.pathname,
      search: toTabMap.toString(),
      state: {from: this.props.location}
    };

    return(
      <div
        className={classnames(styles.comNavFilterMode)}>
        <Link
          btn={"image"}
          to={filterImgObj}
          className={classnames(
            'plainLinkButton',
            {[styles.linkInactive]: !this.viewFilterMap}
          )}
          onTouchStart={this._handleEnter_switchFilter}
          onTouchEnd={this._handleLeave_switchFilter}
          onMouseEnter={this._handleEnter_switchFilter}
          onMouseLeave={this._handleLeave_switchFilter}>
          <span
            className={classnames(
              "fontContent",
              {
                ["colorAssistOcean"]: (this.viewFilterMap && this.state.onSwitch != 'image'),
                ["colorStandard"]: (!this.viewFilterMap || this.state.onSwitch == 'image'),
              }
            )}>
            {this.props.i18nUIString.catalog['btn_filteNav_Feed'][0]}
          </span>
        </Link>
        <span
          className={classnames(
            "fontContent", "colorEditBlack")}
          style={{cursor: 'text', margin: '0 1rem'}}>
          {"．"}
        </span>
        <Link
          btn={"map"}
          to={filterMapObj}
          className={classnames(
            'plainLinkButton',
            {[styles.linkInactive]: this.viewFilterMap}
          )}
          onTouchStart={this._handleEnter_switchFilter}
          onTouchEnd={this._handleLeave_switchFilter}
          onMouseEnter={this._handleEnter_switchFilter}
          onMouseLeave={this._handleLeave_switchFilter}>
          <span
            className={classnames(
              "fontContent",
              {
                ["colorAssistOcean"]: (!this.viewFilterMap && this.state.onSwitch != 'map'),
                ["colorStandard"]: (this.viewFilterMap || this.state.onSwitch == 'map'),
              }
            )}>
            {this.props.i18nUIString.catalog['btn_filteNav_Feed'][1]}
          </span>
        </Link>
        <div
          className={classnames(styles.boxIconsBack)}>
          <Link
            to={filterCloseObj}
            className={classnames('plainLinkButton', styles.boxIconFilterNode)}
            style={{width: "18px"}}
            onTouchStart={this._handleEnter_FilterNode}
            onTouchEnd={this._handleLeave_FilterNode}
            onMouseEnter={this._handleEnter_FilterNode}
            onMouseLeave={this._handleLeave_FilterNode}>
            <SvgArrowStick
              customstyle={this.state.onFilterNode ? (
                {
                  cls1: "{fill:none;stroke:#ff8168;stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
                  cls2: "{fill:#ff8168}"
                }
              ) : (
                {
                  cls1: "{fill:none;stroke:rgb(69, 135, 160);stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
                  cls2: "{fill:rgb(69, 135, 160)}"
                }
              )} />
            </Link>
        </div>
      </div>
    )
  }

  _handleEnter_switchFilter(e){
    let currentBtn = e.currentTarget.getAttribute('btn');
    this.setState((prevState, props)=>{
      return {
        onSwitch: currentBtn
      }
    })
  }

  _handleLeave_switchFilter(e){
    this.setState((prevState, props)=>{
      return {
        onSwitch: false
      }
    })
  }

  _handleEnter_FilterNode(e){
    this.setState((prevState, props)=>{
      return {
        onFilterNode: true
      }
    })
  }

  _handleLeave_FilterNode(e){
    this.setState((prevState, props)=>{
      return {
        onFilterNode: false
      }
    })
  }

}

const mapStateToProps = (state)=>{
  return {
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
)(NavFilterMode));
