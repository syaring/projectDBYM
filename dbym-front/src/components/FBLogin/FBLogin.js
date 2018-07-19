import React, { Component } from 'react';
import loginImg from '../../image/fblogin.png';
import axios from 'axios';

class FBLogin extends Component {
  facebookLogin() {
    window.FB.login((response) => {
      if(response.status === 'connected') {
        window.FB.api('me?fields=id,name,email,friends', (data) => {
          console.log(data.friends.data);
          axios.post('http://localhost:8080/user', {
            userFbId: data.id,
            userName: data.name,
            userEmail: data.email,
            userFriends: data.friends.data
          }).then((user) => {
            this.props.setUserInfo(user.data);
            console.log(data);
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
        <input type="image"
          src={loginImg}
          onClick={this.login.bind(this)}
        />
      </div>
    );
  }
}

export default FBLogin;
