import React, { Component } from 'react';
import loginImg from '../fblogin.png';
import axios from 'axios';

const FB = window.FB;

class FBLogin extends Component {

  constructor(props) {
    super(props);

    this.fbId;
    this.userName;
    this.userEmail;
    this.friendList = [];
  }

  login() {
    FB.login(function(response) {
      if(response.status === 'connected') {
        FB.api('me?fields=id,name,email,friends', (data) => {
          this.fbId = data.id;
          this.userName = data.name;
          this.userEmail = data.email;
          this.friendList = data.friends.data;
          console.log(this.friendList);
          
          axios.post('http://localhost:8080/user', {
            user_fbid: this.fbId,
            user_name: this.useName,
            user_email: this.userEmail,
            user_friends: this.friendList
          });
        }); 
      }
    }, {scope: 'public_profile,email,user_friends'});

  }

  render() {
    return (
      <div>
        <input type="image" src={loginImg} onClick={this.login.bind(this)} />
      </div>
    );
  }
}

export default FBLogin;