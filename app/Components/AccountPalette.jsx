import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

class Palette extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_classByProps = this._set_classByProps.bind(this);
  }

  _set_classByProps(){
    switch (this.props.size) {
      case 'regular':
        return 'spanNameRegular'
        break;
      case 'medium':
        return 'spanNameMedium'
        break;
      case 'title':
        return 'spanNameTitle'
        break;
      case 'large':
        return 'spanNameLarge'
        break;
      case 'layer':
        return 'spanNameLayer'
        break;
      default:
        return 'spanNameRegular'
    }
  }

  render(){
    let classSpan = this._set_classByProps(),
        propsStyle = [
          this.props.styleFirst ?　this.props.styleFirst: {},
          this.props.styleLast ? this.props.styleLast: {}
        ];

    return(
      <div
        style={{display: 'inline-block'}}>
        <span
          className={classnames(classSpan, 'spanNameFirstName')}
          style={propsStyle[0]}>
          {this.props.accountFisrtName+" "}
        </span>
        <span
          className={classSpan}
          style={propsStyle[1]}>
          {this.props.accountLastName}
        </span>
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

const reduxConnection = connect(
  mapStateToProps,
  null
);

export const AccountPlate = withRouter(reduxConnection(Palette));