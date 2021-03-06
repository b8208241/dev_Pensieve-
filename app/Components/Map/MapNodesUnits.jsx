import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';

class MapNodesUnits extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNodeLink: false
    };
    this._render_Markers = this._render_Markers.bind(this);
    this._handleEnter_NodeLink = this._handleEnter_NodeLink.bind(this);
    this._handleLeave_NodeLink = this._handleLeave_NodeLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_Markers(){
    const coordvalidation = (coordinatesArr)=>{
      if(
        !coordinatesArr ||
        coordinatesArr.length < 2
      ) return false;
      // check type of items
      coordinatesArr[0] = Number(coordinatesArr[0]);
      coordinatesArr[1] = Number(coordinatesArr[1]);
      if(
        typeof coordinatesArr[0] != "number" ||
        typeof coordinatesArr[1] != "number"
      ) return false;
      // or if everything fine,
      return true;
    };

    let markersDOM = [];
    this.props.nodeMarkers.forEach((nodeObj, index)=>{
      const nodeId = nodeObj.nodeId;
      const coordinatesValidation = coordvalidation(nodeObj['coordinates']);
      if(!coordinatesValidation) return; // return if it was a invalid coordinates

      markersDOM.push(
        <Marker
          key={"key_MapNodesUnits_Marker_"+ index}
          position={nodeObj['coordinates']}>
          <Popup>
            {(nodeId in this.props.nounsBasic) &&
              <Link
                nodeid={nodeId}
                to={{
                  pathname: nodeObj.link.path,
                  search: nodeObj.link.search,
                  state: {from: this.props.location}
                }}
                className={classnames( 'plainLinkButton')}
                onMouseEnter={this._handleEnter_NodeLink}
                onMouseLeave={this._handleLeave_NodeLink}>
                <div
                  className={classnames(
                    styles.spanpopupNode,
                    {[styles.spanpopupNodeMouse]: this.state.onNodeLink == nodeId}
                  )}>
                  <span
                    className={classnames(
                      "fontContent", "weightBold", "colorEditBlack")}>
                    {this.props.nounsBasic[nodeId].name}
                  </span>
                  { (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                    <span
                      className={classnames("fontContent", "colorEditBlack")}>
                      { ", " + this.props.nounsBasic[nodeId].prefix}
                    </span>
                  }
                </div>
              </Link>
            }
          </Popup>
        </Marker>
      )
    });
    this.props.unitsMarkers.forEach((unitObj, index) => {
      const unitId = unitObj.nodeId;
      const coordinatesValidation = coordvalidation(unitObj['coordinates']);
      if(!coordinatesValidation) return; // return if it was a invalid coordinates

      markersDOM.push(
        <Marker
          key={"key_MapNodesUnits_Marker_unit_"+ index}
          position={unitObj['coordinates']}>
          <Popup>
            <Link
              to={{
                pathname: unitObj.link.path,
                search: unitObj.link.search,
                state: unitObj.link.state
              }}
              className={classnames( 'plainLinkButton')}>
              <img
                className={classnames(styles.popupMain)}
                src={unitObj.unitImgSrc}
                onClick={(e)=>{ /* do not stopPropagation, in case the <Link> would not work as predict */ }}/>
            </Link>
          </Popup>
        </Marker>
      )
    });


    return markersDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comMap)}
        style={{
          zIndex: this.props.styleZIndex,  /* this, is because the react-leaflet set the map at a very high z-index, need to be reset when content needed to put on it */
          position: 'relative' /* pair with the 'zIndex'. zIndex would be useless if no set */
        }}>
        <MapContainer
          center={this.props.coordCenter.length > 0 ? this.props.coordCenter : [20, 0]}
          zoom={this.props.zoomLevel}
          minZoom={!!this.props.minZoomLevel ? this.props.minZoomLevel : 1 }
          maxBounds={[[-90, -180], [90, 180]]}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap/>
          {this._render_Markers()}
        </MapContainer>
      </div>
    )
  }

  _handleEnter_NodeLink(e){
    let targetNode= e.currentTarget.getAttribute('nodeid');
    this.setState({onNodeLink: targetNode})
  }

  _handleLeave_NodeLink(e){
    this.setState({onNodeLink: false})
  }

}


const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MapNodesUnits));
