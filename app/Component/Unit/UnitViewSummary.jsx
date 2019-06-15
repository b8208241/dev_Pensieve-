import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import ImgPreview from '../ImgPreview.jsx';
import DateConverter from '../DateConverter.jsx';
import MarksArticle from '../MarksArticle.jsx';
import {NameLarge} from '../AccountPlate.jsx';

const styleMiddle = {
  boxInlineRelative: {
    display: 'inline-block',
    position: 'relative',
    boxSizing:'border-box',
  },
  imgBLockPreview: {
    display: 'inline-block',
    width: '46%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    marginRight: '3%',
    boxShadow: '0rem 0.1rem 0.5rem 0px',
    borderRadius: '0.5vw',
    overflow: 'hidden',
    cursor: 'pointer'
  },
}

class UnitSummaryNail extends React.Component {
  //assume there is a future requirement for animating to /related
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitViewSummaryNail_: {
        width: '100%',
        height: '20%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      }
    };
  }

  componentDidMount(){
    //there should be some animation to toggle between close and extend, as a refer hint
    this.props._close_modal_Unit(); //temp method, should refer to /relations after relations component was created
  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitViewSummaryNail_}>

      </div>
    )
  }
}

class UnitViewSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.marksArticle = React.createRef();
    this._set_layerstatus = this._set_layerstatus.bind(this);
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this._handleWheel_marksArticle = (event)=>{event.stopPropagation();};
    this.style={
      Com_UnitViewSummary_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_Marksarticle: {
        width: "41%",
        height: '77%',
        position: 'absolute',
        right: '3%',
        bottom: '6%',
        boxSizing: 'border-box',
        paddingBottom: '3%',
        backgroundColor: 'transparent',
        overflowY: 'auto'
      },
      Com_UnitViewSummary_thumbnails_: {
        width: '51%',
        height: '37%',
        position: 'absolute',
        top: '30%',
        left: '4%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_author_: {
        position: 'absolute',
        top: '8%',
        left: '6%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_author_name: {
        display: 'inline-block',
        boxSizing: 'border-box',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
      Com_UnitViewSummary_unitinfo_simple_: {
        position: 'absolute',
        top: '93%',
        left: '6%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_unitinfo_simple_date: {
        color: '#e6e6e6',
      }
    };
  }

  _set_layerstatus(layer, markKey){
    let moveCount = (layer=='cover')? 0 : 100;
    let marksStatus = markKey? {marksify: true, initMark: markKey}: {marksify: false, initMark: "all"};
    this.props._set_layerstatus(true, parseInt(moveCount), marksStatus);
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._handleClick_Account('user', this.props.unitCurrent.authorBasic.authorId);
  }

  componentDidMount(){
    this.marksArticle.current.addEventListener('wheel', this._handleWheel_marksArticle, {passive: false})
    //because the modern browser set the 'passive' property of addEventListener default to true,
    //so we could only add listener like this way to set the 'passive' manually.
    //and becuase we preventDefault in LayerScroll, the scroll will totally be ignore
    //so we need to stopPropagation if there is a scroll box in any child of LayerScroll
  }

  componentWillUnmount(){
    this.marksArticle.current.removeEventListener('wheel',this._handleWheel_marksArticle);
  }

  render(){
    //prepare beneath line for future, connecting to /related
    if(this.props.moveCount > 240) return (<UnitSummaryNail  _close_modal_Unit={this.props._close_modal_Unit}/>);

    return(
      <div
        style={this.style.Com_UnitViewSummary_}>
        <div
          style={this.style.Com_UnitViewSummary_author_}>
          <div
            onClick={this._handleClick_Account}
            style={this.style.Com_UnitViewSummary_author_name}>
            <NameLarge
              firstName={this.props.unitCurrent.authorBasic.firstName}
              lastName={this.props.unitCurrent.authorBasic.lastName}/>
          </div>
        </div>
        <div
          ref={this.marksArticle}
          style={this.style.Com_UnitViewSummary_Marksarticle}>
          <MarksArticle
            layer={'cover'}
            marksObj={{list: this.props.unitCurrent.coverMarksList, data: this.props.unitCurrent.coverMarksData}}
            _set_MarkInspect={this._set_layerstatus}/>
          <MarksArticle
            layer={'beneath'}
            marksObj={{list: this.props.unitCurrent.beneathMarksList, data: this.props.unitCurrent.beneathMarksData}}
            _set_MarkInspect={this._set_layerstatus}/>
        </div>
        <div
          style={this.style.Com_UnitViewSummary_thumbnails_}>
          <div
            style={Object.assign({}, styleMiddle.imgBLockPreview)}>
            <ImgPreview
              blockName={'cover'}
              previewSrc={this.props.unitCurrent.coverSrc}
              _handleClick_ImgPreview_preview={this._set_layerstatus}/>
          </div>
          {
            this.props.unitCurrent.beneathSrc &&
            <div
              style={Object.assign({}, styleMiddle.imgBLockPreview)}>
              <ImgPreview
                blockName={'beneath'}
                previewSrc={this.props.unitCurrent.beneathSrc}
                _handleClick_ImgPreview_preview={this._set_layerstatus}/>
            </div>
          }
        </div>
        <div
          style={this.style.Com_UnitViewSummary_unitinfo_simple_}>
          <div
            style={Object.assign({}, this.style.Com_UnitViewSummary_unitinfo_simple_date, styleMiddle.boxInlineRelative)}>
            <DateConverter
              datetime={this.props.unitCurrent.createdAt}/>
          </div>
        </div>
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
)(UnitViewSummary));
