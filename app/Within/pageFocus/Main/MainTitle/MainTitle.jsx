import React from 'react';
import {
  Route,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesMain from "../styles.module.css"; //Notice, we use shared css file here for easier control
import TodayUnit from './TodayUnit.jsx';
import DateConverter from '../../../../Component/DateConverter.jsx';
import CreateShare from '../../../../Component/CreateShare.jsx';
import SvgCreate from '../../../../Component/Svg/SvgCreate.jsx';

class MainTitle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      greet: false, //temp use, before the real customized render constructed
      onCreate: false
    };
    this.boxTitle = React.createRef();
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._handleMouseOn_Create = ()=> this.setState((prevState,props)=>{return {onCreate: prevState.onCreate?false:true}});
    this.style={

    }
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds/unit?theater&unitId='+dataObj.unitId);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //render greeting words after checking the visit status
    //mainlt to understand whether the user was new register or not
    if(prevProps.lastVisit!==this.props.lastVisit && this.props.lastVisit){
      let date = new Date(),
          i18n = '';
      let currentCourse = date.getHours();

      if(this.props.lastVisit=='newly') i18n = 'welcomeNew'
      else if(currentCourse> 17) i18n = 'greetNight'
      else if(currentCourse> 6 && currentCourse< 11) i18n = 'greetMorning'
      else i18n = 'welcomeBack';

      this.setState({
        greet: i18n
      });
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let date = new Date(); //be used to display present time

    return(
      <div
        ref={this.boxTitle}
        className={classnames(styles.comMainTitle)}>
        <div
          className={classnames(stylesMain.decoSeparationLine, styles.boxUnderline)}></div>
        <div
          className={classnames(styles.boxBasic)}>
          {
            this.state.greet &&
            <div
              className={styles.boxGreet}>
              <span className={classnames(styles.fontGreet)}>
                {this.props.i18nUIString.catalog[this.state.greet]}</span>
            </div>
          }
          <div
            className={classnames(styles.boxCreate)}
            onMouseEnter={this._handleMouseOn_Create}
            onMouseLeave={this._handleMouseOn_Create}>
            <SvgCreate
              black={this.state.onCreate}
              place={false}
              stretch={false}/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}
              _refer_von_Create={this.props._refer_von_cosmic}/>
          </div>
          <div
            className={classnames(styles.boxDate, 'fontGillSN')}>
            <DateConverter
              place={'title'}
              datetime={date.getTime()}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxToday)}>
          <TodayUnit/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
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
)(MainTitle));
