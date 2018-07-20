import React, { Component } from 'react';
import { Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import FBLogin from '../FBLogin/FBLogin';
import UserPage from '../UserPage/UserPage';
import MeetUpForm from '../MeetUpForm/MeetUpForm';
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

  checkLoginStatus() {
    if (window.FB) {
      window.FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          axios.get(`http://sample-application-development.tzuwucqkx7.us-west-2.elasticbeanstalk.com/userInfo/${response.authResponse.userID}`)
          .then(({ data })=> {
            if(data[0]){
              const user = data[0];

              this.setState({
                isLoggedIn: true,
                fbId: response.authResponse.userID,
                userName: user.UserName,
                userEmail: user.UserEmail,
                friendList: user.UserFriends,
                userId: user._id
              });
            }
          });
        } else {
          this.setState({
            isLoggedIn: false
          })
        }
      });
    } else {
      setTimeout(this.checkLoginStatus.bind(this), 300);
    }
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  componentDidUpdate() {
    console.log("updated");
  }

  onClickLogout() {
    window.FB.logout(response => {
      console.log(response)
      this.checkLoginStatus();
    });
  }

  render() {
    return(
      <div className="App">
        <div className="App-contents">
          <Switch>
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
            <Route exact path={`/:uid`}
              render={(props)=>{ 
                return(
                  this.state.isLoggedIn ?
                  <div>
                    <div className="log-out" onClick={this.onClickLogout.bind(this)}>facebook logout</div>
                    <UserPage userId={this.state.fbId} userName={this.state.userName} />
                  </div> :
                  <Redirect to='/' />
                )
              }}
            />
          }

            <Route exact path={`/:uid/new`}
              render={props => {
                return (
                  this.state.isLoggedIn ?
                  <div>
                  <div className="log-out" onClick={this.onClickLogout.bind(this)}>facebook logout</div>
                  <MeetUpForm hostId={props.match.params.uid} hostName={this.state.userName}/>
                  </div> :
                  <Redirect to='/' />
                );
              }}
            />
            </Switch>
          </div>
      </div>
    );
  }
}

export default App;
