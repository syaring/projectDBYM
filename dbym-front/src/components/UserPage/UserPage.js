import React, { Component } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import New from '../../image/plus.png';
import UserMeetups from '../UserMeetups/UserMeetups';
import './UserPage.css';

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
        <div className="user-title">
          Hello {this.state.userName} !!
        </div>
        <div className="user-contents">
          <UserMeetups uid={this.state.userId}/>
        </div>
        <div className="create">
          <Link to={`/${this.state.userId}/new`}>
            <img className="create-button" src={New} />
          </Link>
            ^^^<br/>
            click for new meetup!
        </div>
      </div>
    );
  }
}

export default UserPage
