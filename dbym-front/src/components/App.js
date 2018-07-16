import React, { Component } from 'react';
import { Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import FBLogin from './FBLogin';
import Create from './Create';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoggedIn: false,
      fbId: '',
      userName: '',
      userEmail: '',
      friendList: '',
      uesrId:''
    };
  }

  setUserInfo(user){

    this.setState({
      isLoggedIn: true,
      fbId: user.UserFbId,
      userName: user.UserName,
      userEmail: user.UserEmail,
      friendList: user.friendList,
      uesrId: user.UserId
    });

  }

  componentDidUpdate() {
    console.log("updated");
  }

  render() {

    return(
      <div className="App">
        <Route exact path='/'
          render={()=>{ 
            return(
              !this.state.isLoggedIn ? 
                <FBLogin setUserInfo={this.setUserInfo.bind(this)} /> :
                <Redirect to={`/${this.state.fbId}`} />
            )
          }}
        /> 

        {
          this.state.isLoggedIn &&
          <Route exact path={`/${this.state.fbId}`}
            render={()=>{
              return(
                <Create hostId={this.state.fbId} />
              )
            }}
          />
        }
      </div>
    );
  }
}

export default App;
