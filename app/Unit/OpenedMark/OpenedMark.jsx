import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgCircle from '../../Components/Svg/SvgCircle.jsx';
import {
  baseHorizonRatial,
} from '../props.js';
import { CognitoIdentityCredentials, Translate } from 'aws-sdk';


class OpenedMark extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onImgBlock: false
    };
    this._render_CircleGroup = this._render_CircleGroup.bind(this);
    this._handleEnter_ImgBlock = this._handleEnter_ImgBlock.bind(this);
    this._handleLeave_ImgBlock = this._handleLeave_ImgBlock.bind(this);
  }

  _render_CircleGroup (coordinateCurrent){
    if(!!this.props.editingModal){
      const self = this;
      let circlesArr = this.props.marksList.map(function(id, index){
        const coordinate = self.props.markCircles[id];
        return (
          <div
            key={"key_OpenedMark_Circle_"+index}
            id={id}
            className={'boxMarkSpot'}
            style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
            onClick={self.props._handleClick_ImgLayer_circle}>
            <SvgCircle
              current={(id== self.props.currentMark)? true: false}
              notify={false}
              serial={index+1}/>
          </div>
        )
      });
      return circlesArr;
    }
    else {
      /*
      data from props. are different from above, which called by editingModal,
      because they inherit from different system:
      editing is direct from list & circles the parent's 'state' had, while
      view like beneath, is from a reformed 'marksData' system designed for the children (historical reason)
      */
      return (
        <div
          key={"key_OpenedMark_Circle_"}
          id={this.props.currentMark}
          className={'boxMarkSpot'}
          style={{top: coordinateCurrent.top+"%", left: coordinateCurrent.left+'%'}}
          onClick={this.props._handleClick_ImgLayer_circle}>
          <SvgCircle
            current={true}
            notify={this.props.notify}
            serial={null}/>
        </div>
      )
    }
  }

  render(){
    /*
    Beneath we are going to calculate the position the MarkBlocks should be.
    Why it's so complicated due to at the beginning, the img is not position to the center,
    we didn't even know how 'left' the img was.
    */
    const markId = this.props.currentMark,
          imgWidth = this.props.imgWidthHeight.width,
          imgHeight = this.props.imgWidthHeight.height,
          imgLeft=this.props.imgPosition.left;
    const coordinate = {top: this.props.marksData.data[markId].top, left: this.props.marksData.data[markId].left};
    const downToMdidline = (coordinate.top > 50) ? true : false;
    const spotLeftPx = coordinate.left/100*imgWidth+imgLeft+imgWidth*(baseHorizonRatial/100);
      //the position of circle relative to img, position img original at in the frame, and transform/translate we set
      //--- due to offsetLeft wouldn't take the transform property

    //then cauculate position of opened mark here in render()
    //to make the mark would change the position when jumping between different spot
    let [blockLeft, blockRight, blockTop, blockTopTranslate] = ['16%','', 1, 0]; // set '16' as based position to the block

    if (coordinate.left < 50 && (spotLeftPx + 24 + 22) > this.props.boxWidth * 0.16) { // '0.16' followed based blockLeft
      blockLeft = spotLeftPx + 24+22;
      if((this.props.boxWidth - spotLeftPx - 24 -22) < 300){ blockLeft = ''; blockRight = 1;}
    }
    else if (coordinate.left > 50 && (this.props.boxWidth - spotLeftPx + 24 + 22) > this.props.boxWidth * 0.16){
      blockLeft = '';
      blockRight = this.props.boxWidth - spotLeftPx + 24+22;
      if((spotLeftPx - 24 -22) < 300){ blockLeft = 1; blockRight = '';}
    }
    if(!this.props.editingModal){
      if (coordinate.top > 1 && coordinate.top < 99) blockTop = coordinate.top
      else if(coordinate.top <= 1) blockTop = 1
      else if (coordinate.top >= 99) blockTop = 99;
      blockTopTranslate = ((coordinate.top-1) / 98)* 100 * (-1); // 98 is the max-height of .boxMarkBlock, minus 1 is to adjust 1% min top, (-1) is due to 'top' prop we use
    }

    // because we want to pass left/right status as props to Block, we need to add from here
    const childrenWithProps = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, {
        // could add required props here, like an obj
        // original props downToMdidline, and toCircleLeft have been rm
      })
    );

    return (
      <div>
        <div
          className={'boxAbsoluteFull'}
          onClick={this.props._handleClick_ImgLayer_circle}/>
        <div
          className={'boxImgPosition'}
          style={{
            width: imgWidth,
            height: imgHeight,
            right: baseHorizonRatial+'%',
            transform: 'translate('+baseHorizonRatial+'%, -50%)'
          }}
          onClick={this.props._handleClick_ImgLayer_circle}>
          {this._render_CircleGroup(coordinate)}
        </div>
        <div
          className={classnames(
            styles.boxMarkBlock,
            {
              [styles.boxMarkBlockEditing]: this.props.editingModal
            }
          )}
          style={Object.assign({},{
            left: blockLeft,
            right: blockRight,
            top: (blockTop + '%'),
            transform: 'translate(0,'+ blockTopTranslate + '%)'
          })}
          onClick={(e)=>{e.stopPropagation();}}
          onMouseEnter={this._handleLeave_ImgBlock}
          onMouseLeave={this._handleEnter_ImgBlock}>
          {childrenWithProps}
        </div>
      </div>
    )
  }

  _handleEnter_ImgBlock(e) {
    this.setState({ onImgBlock: true })
  }

  _handleLeave_ImgBlock(e) {
    this.setState({ onImgBlock: false })
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting,
  }
}

export default connect(
  mapStateToProps,
  null
)(OpenedMark);
