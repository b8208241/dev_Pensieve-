import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import DisplayMarkPreview from '../../Draft/DisplayMarkPreview.jsx';

class NailMarksPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onCount: this.props.unitBasic.marksList[0] // default preview the first mark
    };
    this._render_MarkCounts = this._render_MarkCounts.bind(this);
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._handleEnter_MarkCount = this._handleEnter_MarkCount.bind(this);
    this._handleLeave_MarkCount = this._handleLeave_MarkCount.bind(this);
  }

  _handleEnter_MarkCount(e){
    e.stopPropagation();
    e.preventDefault(); // stop stopPropagation at this comp. could prevent the click e propagate to parent, and stop the 'open' of Unit
    this.setState({
      onCount: e.currentTarget.attributes.markkey.value
    });
  }

  _handleLeave_MarkCount(e){
    // it's strange but, currently we don't shift to any state if the mouse leave
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){

    return(
      <div
        className={classnames(styles.boxMarkPreview)}>
        <div
          className={styles.boxMarkPreviewCounts}
          style={!!this.props.smallCircle ? {marginBottom: '2rem'} : {}}>
          {this._render_MarkCounts()}
        </div>
        {this._render_nails_Marks()}
      </div>
    )
  }

  _render_MarkCounts(){
    let list = this.props.unitBasic.marksList;
    let countsDOM = [];
    const self = this;
    // modification for small screen
    let cssVW = window.innerWidth;

    for(let i=0 ; i< list.length && i< 5; i++){
      let key = list[i];
      countsDOM.push(
        <div
          key={"key_nailMarksCount_"+i}
          markkey={key}
          className={classnames(styles.boxOvalCount)}
          style={{
            backgroundColor: (self.state.onCount == key) ? "rgba(240, 151, 22, 0.45)": "rgba(84, 84, 84, 0.45)",
            width: self.props.smallCircle ? '24px' : '32px',
            height: self.props.smallCircle ? '24px' : '32px',
          }}
          onClick={(event)=>{ event.stopPropagation();event.preventDefault(); }}
          onTouchStart={self._handleEnter_MarkCount}
          onTouchEnd={self._handleLeave_MarkCount}
          onMouseEnter={self._handleEnter_MarkCount}
          onMouseLeave={self._handleLeave_MarkCount}>
          {
            (
              this.props.spotCount &&
              ( i== 0 || (cssVW >= 860 && i> 0) ) ? (
                <span className={classnames("fontContentPlain", "weightBold", "colorWhite")}>{i + 1}</span>
              ): (
                null
              )
            )
          }
        </div>
      )
    };
    return countsDOM;
  }

  _render_nails_Marks(){
    // we allow img without text content or any Mark, but that's means there was no marks. so we should distinguish them
    if(this.props.unitBasic.marksList.length == 0){
      return(
        <div
          key={"key_nail_" + this.props.unitId + "_mark"}
          className={classnames("fontContent", "colorGrey", "fontStyleItalic")}
          style={{textAlign: 'right'}}>
          {this.props.i18nUIString.catalog['descript_Nail_noMark']}
        </div>
      )
    };

    let key = (this.props.unitBasic.marksList.indexOf(parseInt(this.state.onCount)) != (-1)) ? this.state.onCount : this.props.unitBasic.marksList[0];

    return (
      <div
        key={"key_nail_"+this.props.unitId+"_mark"}
        className={classnames("fontContent", "colorEditBlack")}>
        <DisplayMarkPreview
          markId={key}
          multipleMark={this.props.unitBasic.marksList.length > 1 ? true : false}
          rawContent={this.props.marksBasic[key].editorContent}/>
      </div>
    );
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

export default connect(
  mapStateToProps,
  null
)(NailMarksPreview);
