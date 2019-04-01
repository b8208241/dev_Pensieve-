import React from 'react';
import { connect } from "react-redux";
import AuthorBlock from './AuthorBlock.jsx';
import SvgCircle from '../../Svg/SvgCircle.jsx';
import SvgCircleSpot from '../../Svg/SvgCircleSpot.jsx';

class MarksAuthor extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.Com_ImgLayer=React.createRef();
    this._render_SpotsorMark = this._render_SpotsorMark.bind(this);
    this._handleClick_ImgLayer_circle = this._handleClick_ImgLayer_circle.bind(this);
    this._handleClick_SpotsLayer = this._handleClick_SpotsLayer.bind(this);
    this.style = {
      absolute_FullVersion: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left:'0',
        boxSizing: 'border-box'
      },
      Com_ImgLayer_MarkBlock_: {
        width: '42%',
        maxHeight: '88%',
        position: 'absolute',
        transform: 'translate(0,-50%)'
      },
      Com_ImgLayer_div: {
        position: 'absolute',
        top: '50%',
        right: this.props.baseHorizonRatial+'%',
        transform: 'translate('+this.props.baseHorizonRatial+'%,-50%)'
      },
      Com_ImgLayer_div_circle_svg: {
        width: '3vw',
        height: '3vw',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        cursor: 'pointer'
      },
    };
  }

  _render_SpotsorMark(){
    const self = this,
    imgWidth = this.props.imgWidthHeight.width,
    imgHeight = this.props.imgWidthHeight.height,
    imgLeft=this.props.imgPosition.left;

    if(this.props.markOpened && (this.props.marksData.list.indexOf(this.props.currentMark) > (-1))){
      const markId = this.props.currentMark;
      const coordinate = {top: this.props.marksData.data[markId].top, left: this.props.marksData.data[markId].left};
      let [left, top, right] = ['','',''],
          spotLeftPx = coordinate.left/100*imgWidth+imgLeft+imgWidth*(this.props.baseHorizonRatial/100);
          //the position relative to img, position img original at, and transform we set
          //--- due to offsetLeft wouldn't take the transform property

      (spotLeftPx) > (this.props.boxWidth/2) ? ( //check which side of the box the circle at
        right = this.props.boxWidth-(spotLeftPx)+this.props.boxWidth/20 //if circle st the right side, put the box 'left' to the circle
      ): (
        left = spotLeftPx+this.props.boxWidth/20
      );
        top = (22 + (coordinate.top) * (34) / (100)) + '%';

      return (
        <div>
          <div
            style={Object.assign({backgroundColor: 'rgba(30,30,30,0.2)'}, self.style.absolute_FullVersion)}
            onClick={self._handleClick_ImgLayer_circle}/>
          <div
            style={Object.assign(
              {width: imgWidth, height: imgHeight}, self.style.Com_ImgLayer_div)}
              onClick={self._handleClick_ImgLayer_circle}>
              <div
                id={markId}
                style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_ImgLayer_div_circle_svg)}
                onClick={self._handleClick_ImgLayer_circle}>
                <SvgCircle/>
              </div>
          </div>
          <div
            style={Object.assign({top: top, left: left, right: right}, self.style.Com_ImgLayer_MarkBlock_)}>
            <AuthorBlock
              markKey={markId}
              markData={self.props.marksData.data[markId]}/>
          </div>
        </div>
      ) // order, is important
    }else{
      let circlesArr = self.props.marksData.list.map(function(id, index){
        const coordinate = {top: self.props.marksData.data[id].top, left: self.props.marksData.data[id].left};
        return self.props.unitCurrent.marksInteraction[id].notify ? (
          <div
            id={id}
            key={"key_Mark_Circle_"+index}
            style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_ImgLayer_div_circle_svg)}
            onClick={self._handleClick_ImgLayer_circle}>
            <SvgCircleSpot/>
          </div>
        ):(
          <div
            id={id}
            key={"key_Mark_Circle_"+index}
            style={Object.assign({top: coordinate.top+"%", left: coordinate.left+'%'}, self.style.Com_ImgLayer_div_circle_svg)}
            onClick={self._handleClick_ImgLayer_circle}>
            <SvgCircle/>
          </div>
        )
      });
      return (
        <div
          style={Object.assign({width: imgWidth, height: imgHeight}, self.style.Com_ImgLayer_div)}>
            {circlesArr}
        </div>
      );
    }
  }

  _handleClick_ImgLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let param = this.props.markOpened ? (false) : (event.currentTarget.getAttribute('id'));
    this.props._set_Markvisible(param);
  }

  _handleClick_SpotsLayer(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_spotsVisible();
  }

  render(){
    return(
      <div
        style={this.style.absolute_FullVersion}
        ref={this.Com_ImgLayer}
        onClick={this._handleClick_SpotsLayer}>
        {
          this.props.spotsVisible &&
          this._render_SpotsorMark()
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(MarksAuthor);
