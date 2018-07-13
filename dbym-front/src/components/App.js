import React, { Component } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import FBLogin from './FBLogin';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoggedIn: true,
      fbId: this.fbId,
      userName: this.userName,
      userEmail: this.userEmail,
      friendList: this.friendList
    }
  }

  render() {
    return (
      <div className="App">
        <FBLogin />
      </div>
    );
  }
}

export default App;
