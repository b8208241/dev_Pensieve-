import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import CreateShare from '../../../../Unit/Editing/CreateShare.jsx';
import SvgCreate from '../../../../Components/Svg/SvgCreate.jsx';

class ChainUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingOpen: false,
      onCreate: false,

    };
    this._handleClick_plainOpen = this._handleClick_plainOpen.bind(this);
    this._handleMouseOn_Create = ()=> this.setState((prevState,props)=>{return {onCreate: prevState.onCreate?false:true}});
  }

  _handleClick_plainOpen(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState({editingOpen: true});
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.comChainUpload)}>
        <div
          onClick={this._handleClick_plainOpen}
          onMouseEnter={this._handleMouseOn_Create}
          onMouseLeave={this._handleMouseOn_Create}>
          <SvgCreate
             black={this.state.onCreate}
             place={false}
             stretch={false}/>
        </div>
        <CreateShare
          forceCreate={this.state.editingOpen}
          _submit_Share_New={this.props._submit_Share_New}
          _refer_von_Create={this.props._refer_von_cosmic}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChainUpload));
