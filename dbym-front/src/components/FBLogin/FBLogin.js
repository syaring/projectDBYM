import React, { Component } from 'react';
import axios from 'axios';
import './FBLogin.css';

class FBLogin extends Component {
  facebookLogin() {
    window.FB.login((response) => {
      if(response.status === 'connected') {
        window.FB.api('me?fields=id,name,email,friends', (data) => {
          axios.post('http://sample-application-development.tzuwucqkx7.us-west-2.elasticbeanstalk.com/user', {
            userFbId: data.id,
            userName: data.name,
            userEmail: data.email,
            userFriends: data.friends.data
          }).then((user) => {
            this.props.setUserInfo(user.data);
          });
        }); 
      }
    }, {scope: 'public_profile,email,user_friends'});
  }

  login() {
    if (!window.FB) {
      setTimeout(this.login.bind(this), 300);
    } else {
      this.facebookLogin();
    }
  }

  render() {
    return (
      <div>
        <div className="login-button"
          type="image"
          onClick={this.login.bind(this)}>
          START WITH FACEBOOK!
        </div>

      </div>
    );
  }
}

export default FBLogin;
