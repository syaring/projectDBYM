// import React, { Component } from 'react';
// import FBLoginButton from './FBLoginButton';

// const FB = window.FB;

// var auth_response_change_callback = function(response) {
//   console.log("auth_response_change_callback");
//   console.log(response);
// }

// FB.Event.subscribe('auth.authResponseChange', auth_response_change_callback);

// class Facebook extends Component {

//   facebookLogin() {
//     console.log('log');
//     FB.getLoginStatus(function(response) {
//       if(response.status === 'connected'){
//         console.log('logged in');
//       }
//     })
//   }
  
//   render() {
//     return (
//       <FBLoginButton />
//     )
//   }
// }

// export default Facebook;