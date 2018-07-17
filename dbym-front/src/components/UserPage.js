import React, { Component } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import New from '../image/new.png';
import UserMeetups from './UserMeetups';
import _ from 'lodash';

class UserPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userId: this.props.userId,
      userName: this.props.userName
    }
  }

  render() {
    return (
      <div className="UserPage">
        <div>
          Hello {this.state.userName} !! <br/>
          {this.state.userName}님의 약속 <br/>
          <UserMeetups uid={this.state.userId}/>
          <Link to={`/${this.state.userId}/new`}>
            <input className="New" type="image" src={New} /> <br/>
            click this image for create new meetups!
          </Link>
        </div>
      </div>
    );
  }
}

export default UserPage
