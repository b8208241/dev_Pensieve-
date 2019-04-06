import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import ImgImport from './ImgImport.jsx';
import EditingPanel from './EditingPanel.jsx';
import ContentModal from './ContentModal.jsx';
import NounsEditor from './NounsEditor.jsx';
import ImgPreview from '../ImgPreview.jsx';
import MarksArticle from '../MarksArticle.jsx';

const styleMiddle = {
  imgBLockDecoBack:{
    width: '18%',
    height: '100%',
    position: 'absolute',
    left: '0%',
    top: '0',
    boxSizing: 'border-box',
    backgroundColor: '#FAFAFA'
  },
  contentMarkInter: {
    width: '90%',
    height: '0',
    position: 'relative',
    marginLeft: '5%',
    borderTop: 'solid 1px #ABABAB',
    fontSize: '0.12rem',
    letterSpacing: '0.08rem',
    lineHeight: '1.7rem',
    color: '#ABABAB'
  }
}

class EditingModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contentInit: {focusBlock: null, markExpand: null},
      contentModalify: false,
      coverSrc: this.props.unitSet?this.props.unitSet.coverSrc:null,
      beneathSrc: this.props.unitSet?this.props.unitSet.beneathSrc:null,
      coverMarks: this.props.unitSet?this.props.unitSet.coverMarks:{list:[], data:{}},
      beneathMarks: this.props.unitSet?this.props.unitSet.beneathMarks:{list:[],data:{}},
      refsArr: this.props.unitSet?this.props.unitSet.refsArr:[],
      nouns: this.props.unitSet?this.props.unitSet.nouns:{list:[],basic:{}}
    };
    this._reset_modalState = () => {this.setState({contentInit: {focusBlock: null, markExpand: null}, contentModalify: false});};
    this._set_nouns = (nounSet) => {this.setState((prevState, props) => {return {nouns: nounSet}})};
    this._set_refsArr = ()=>{};
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._open_ContentModal = this._open_ContentModal.bind(this);
    this._close_img_Cancell = this._close_img_Cancell.bind(this);
    this._close_Mark_Complete = this._close_Mark_Complete.bind(this);
    this._render_importOrPreview = this._render_importOrPreview.bind(this);
    this._handleClick_Editing_Cancell = this._handleClick_Editing_Cancell.bind(this);
    this._handleClick_Editing_Submit = this._handleClick_Editing_Submit.bind(this);
    this.style={
      Com_Modal_Editing_: {
        width: '86%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#101010'
      },
      Com_Modal_Editing_imgBlocks_: {
        width: '25%',
        height: '78%',
        position: 'absolute',
        top: '0',
        left: '35%',
        boxSizing: 'border-box',
        backgroundColor: 'transparent'
      },
      Com_Modal_Editing_Panel_: {
        width: '100%',
        height: '5%',
        position: 'absolute',
        top: '89%',
        left:'0',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_Side_: {
        width: '24%',
        height: '32%',
        position: 'absolute',
        bottom: '22%',
        left: '11%',
        overflow: 'visible'
      },
      Com_Modal_Editing_imgBlocks_block_: {
        width: '80%',
        height: '34%',
        position: 'absolute',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_article_: {
        display: 'inline-block',
        width: '33%',
        height: '73%',
        position: 'absolute',
        top: '5%',
        right: '4%',
        boxSizing: 'border-box',
        borderRight: 'solid 2px', //then render in 'black' (initial one)
        backgroundColor: 'transparent',
        overflow: 'auto'
      },
    }
  }

  _set_newImgSrc(dataURL, forBlock){
    if(forBlock=='cover'){
      this.setState({coverSrc: dataURL, contentInit: {focusBlock: forBlock, markExpand: null}, contentModalify: true})
    }else if(forBlock=='beneath'){
      this.setState({beneathSrc: dataURL, contentInit: {focusBlock: forBlock, markExpand: null}, contentModalify: true})
    };
  }

  _open_ContentModal(focusBlock, markKey){
    this.setState((prevState, props)=>{
      return {
        contentInit: {focusBlock: focusBlock, markExpand: markKey?markKey:null},
        contentModalify: true
      };
    });
  }

  _close_Mark_Complete(markData, layer){
    switch (layer) {
      case 0:
        this.setState((prevState, props) => {return {coverMarks: markData}}, this._reset_modalState());
        break;
      case 1:
        this.setState((prevState, props) => {return {beneathMarks: markData}}, this._reset_modalState());
        break;
      default:
        break;
    }
  }

  _close_img_Cancell(){
    let focusBlock = this.state.contentInit.focusBlock;
    if(focusBlock=='cover'){
      this.setState({coverSrc: null, coverMarks:{list:[], data:{}},contentInit: {focusBlock: null, markExpand: null}, contentModalify: false})
    }else if(focusBlock=='beneath'){
      this.setState({beneathSrc: null, beneathMarks:{list:[], data:{}}, contentInit: {focusBlock: null, markExpand: null}, contentModalify: false})
    };
  }

  _handleClick_Editing_Cancell(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_Clear();
  }

  _handleClick_Editing_Submit(event){
    event.stopPropagation();
    event.preventDefault();
    if(this.props.unitSubmitting) return;

    //to prevent any main mutation during process
    //notice this could not stop the change in the 'children' of each value
    let newObj = Object.assign({}, this.state);

    this.props._set_Submit(newObj);
  }

  _render_importOrPreview(){
    if(!this.state.coverSrc && !this.state.beneathSrc){
      return(
        <div
          style={Object.assign({top: '8%'}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
          <ImgImport
            blockName={'cover'}
            _set_newImgSrc={this._set_newImgSrc}/>
        </div>
      )
    }else if(this.state.coverSrc && !this.state.beneathSrc){
      return(
        <div>
          <div
            style={Object.assign({top: '8%'}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
            <ImgPreview
              blockName={'cover'}
              previewSrc={this.state.coverSrc}
              _handleClick_ImgPreview_preview={this._open_ContentModal}/>
          </div>
          <div
            style={Object.assign({top: '54%'}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
            <ImgImport
              blockName={'beneath'}
              _set_newImgSrc={this._set_newImgSrc}/>
          </div>
        </div>
      )
    }else{
      return(
        <div>
          <div
            style={Object.assign({top: '8%'}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
            <ImgPreview
              blockName={'cover'}
              previewSrc={this.state.coverSrc}
              _handleClick_ImgPreview_preview={this._open_ContentModal}/>
          </div>
          <div
            style={Object.assign({top: '54%'}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
            <ImgPreview
              blockName={'beneath'}
              previewSrc={this.state.beneathSrc}
              _handleClick_ImgPreview_preview={this._open_ContentModal}/>
          </div>
        </div>
      )
    }
  }

  render(){
    return(
      <div
        id={'editingModal'}
        style={this.style.Com_Modal_Editing_}>
        <div
          style={this.style.Com_Modal_Editing_Side_}>
          <NounsEditor
            nouns={this.state.nouns}
            _set_nouns={this._set_nouns}/>
        </div>
        <article
          style={this.style.Com_Modal_Editing_article_}>
          <MarksArticle
            layer={'cover'}
            marksObj={this.state.coverMarks}
            _set_MarkInspect={this._open_ContentModal}/>
          <div
            style={styleMiddle.contentMarkInter}>
            {!this.state.coverSrc && "add a new picture to mark something!"}
          </div>
          <MarksArticle
            layer={'beneath'}
            marksObj={this.state.beneathMarks}
            _set_MarkInspect={this._open_ContentModal}/>
        </article>
        <div
          style={this.style.Com_Modal_Editing_imgBlocks_}>
          <div style={styleMiddle.imgBLockDecoBack}/>
          {this._render_importOrPreview()}
        </div>
        <div
          style={this.style.Com_Modal_Editing_Panel_}>
          <EditingPanel
            creating={this.props.unitSet?false:true}
            _refer_toandclose={this.props._refer_toandclose}
            _handleClick_Editing_Submit={this._handleClick_Editing_Submit}
            _handleClick_Editing_Cancell={this._handleClick_Editing_Cancell}/>
        </div>
        {
          this.state.contentModalify &&
          <ContentModal
            creating={this.props.unitSet?false:true}
            layer={this.state.contentInit.focusBlock=='cover'?0:1}
            imgSrc={this.state.contentInit.focusBlock=='cover'?this.state.coverSrc:this.state.beneathSrc}
            marks={this.state.contentInit.focusBlock=='cover'?this.state.coverMarks:this.state.beneathMarks}
            markExpand={this.state.contentInit.markExpand}
            _set_refsArr={this.props._set_refsArr}
            _close_Mark_Complete={this._close_Mark_Complete}
            _close_img_Cancell={this._close_img_Cancell}/>
        }
        {
          this.props.unitSubmitting &&
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '0',
              left:'0',
              backgroundColor: 'rgba(230,230,230,0.5)'
            }}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}>
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
    unitSubmitting: state.unitSubmitting
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(EditingModal));
