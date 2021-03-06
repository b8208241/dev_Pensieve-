import React from 'react';
import {
  Link,
  Switch,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import NavFeed from './NavFeed/NavFeed.jsx';
import TitlePath from './TitlePath/TitlePath.jsx';
import Steps from './Steps/Steps.jsx';
import SubcatesList from './Subcate/SubcatesList.jsx';
import {
  _axios_get_projectBasic,
} from './axios.js';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      savedPosition: null,
      pathName: false,
      projectName: '',
      projectInfo: {
        inspiredCount: 0,
        inspiredYou: false
      },
      subCatesInfo: {
        subCatesList: [],
        subCatesObj: {}
      },
    };
    this.axiosSource = axios.CancelToken.source();
    this.wrapperPathProject = React.createRef();
    this._render_tab = this._render_tab.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._set_projectBasic = this._set_projectBasic.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.match.params['pathName'] != prevProps.match.params['pathName']){ // jump to diff. pathProject
      this._set_projectBasic();
    };
    if(
      this.props.location.pathname != prevProps.location.pathname &&
      this.props.location.pathname.includes('/unit')
    ){
      let savedPosition = window.scrollY;
      this.setState((prevState, props)=>{
        return {
          savedPosition: savedPosition
        };
      }, ()=>{
        this.wrapperPathProject.current.style.display='none';
      });
    }
    else if(
      this.props.location.pathname != prevProps.location.pathname &&
      prevProps.location.pathname.includes('/unit') &&
      !this.props.location.pathname.includes('/unit')
    ){
      this.wrapperPathProject.current.style={};
      window.scroll(0, prevState.savedPosition);
      this.setState({
        savedPosition: null
      });
    };
  }

  componentDidMount(){
    this._set_projectBasic();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_tab(){
    switch (this.currentTab) {
      case "routes":
        return (
          <div
            style={{marginTop: '8px'}}>
            <SubcatesList
              {...this.props}
              subCatesInfo={this.state.subCatesInfo}/>
          </div>
        )
        break;
      case "steps":
        return (
          <div>
            <Steps
              {...this.props}/>
          </div>
        )
        break;
      default: // 'undefined' currentTab
        return (
          <div>
            <Feed
              {...this.props}/>
          </div>
        )
    }
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.currentTab = urlParams.get('tab'); // could be 'undefined'
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = false;
    let unitEntity = {
      subCate: this.currentSubCate ? 'pathProject' : false,
      pathSubCate: (this.currentSubCate && (this.currentSubCate in this.state.subCatesInfo.subCatesObj)) ? {
        subCateify: true,
        currentSubCateId: this.currentSubCate,
        currentSubcateObj: this.state.subCatesInfo.subCatesObj[this.currentSubCate],
        currentPathProject: this.state.pathName
      }: {}
    };

    return(
      <div>
        <div
          ref={this.wrapperPathProject}
          className={classnames(styles.comPathProject)}>
          <div
            className={classnames(styles.boxRow)}>
            <div
              className={classnames(styles.boxTitle)}>
              <TitlePath
                projectPath = {this.state.pathName}
                projectInfo={this.state.projectInfo}
                projectPath = {this.state.pathName}
                title={this.state.projectName}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxRowNav)}>
            <div
              className={classnames(styles.boxNavFeed)}>
              <NavFeed
                {...this.props}
                subCatesify={ (this.state.subCatesInfo.subCatesList.length > 0) ? true : false }/>
            </div>
          </div>
          <div>
            {
              /*
              render the view by search.tab
              */
              this._render_tab()
            }
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            // PathProject allow no token browse, so we have to use different Unit for both condition
            return (this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack') ? (
              <UnitUnsign
                {...props}
                unitEntity= {unitEntity}
                _refer_von_unit={this.props._refer_to}/>
            ):(
              <UnitScreen
                {...props}
                unitEntity= {unitEntity}
                _createdRespond= {()=>{/* no need to give any flad in AtNode*/ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_to}/>
            )
          }
        }/>
      </div>
    )
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "first", layer: 0};
    return unitInit;
  }

  _set_projectBasic(){
    const self = this;
    this.setState({axios: true});

    _axios_get_projectBasic(this.axiosSource.token, this.props.match.params['pathName'])
    .then((resObj)=>{
      self.setState((prevState, props)=>{
        return {
          axios: false,
          pathName: resObj.main.pathName,
          projectName: resObj.main.name,
          projectInfo: resObj.main.otherInfo,
          subCatesInfo: resObj.main.subCatesInfo
        };
      });

    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
