import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import Terrace from './Terrace.jsx'
import storeTerrace from "../redux/reducers/Terrace.js";
import {mountUserInfo} from "../redux/actions/general.js";

let loggedin = !!window.localStorage['token'];
if(loggedin){
  axios.get('/router/status', {
    headers: {
        'token': window.localStorage['token']
    }
  }).then(function(res){
    const store = createStore(storeTerrace, applyMiddleware(thunk));
    store.dispatch(mountUserInfo(res.data.userInfo));
    ReactDOM.hydrate(<Provider store={store}><Terrace/></Provider>, document.getElementById("root"));
  }).catch((err)=>{
    if (err.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.log("response status: "+ err.response.status);
      if(err.response.status < 500){
        window.location.assign('/login');
      }else{
        alert('Failed: '+err.response.data.message)
      }
    } else if (err.request) {
        // The request was made but no response was received
        // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
    }
    console.log("error config: "+err.config);
  })
}else{
  window.location.assign('/login')
}