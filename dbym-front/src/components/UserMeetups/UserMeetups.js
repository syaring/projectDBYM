import React, { Component } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import Meetups from '../Meetups/Meetups';
import { PulseLoader } from 'halogenium'
import axios from 'axios';
import './UserMeetups.css';

class UserMeetups extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userId: this.props.uid,
      meetupsList: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    this.getUserInfo();
  }
  
  getUserInfo() {
    axios.get(`http://sample-application-development.tzuwucqkx7.us-west-2.elasticbeanstalk.com/meetups/${this.props.uid}`).then((meet)=>{
      this.setState({
        meetupsList: meet.data,
        isLoaded: true
      });
    });
  }
  
  render() {
    return (
      <div className="UserMeetups">
        {
          this.state.isLoaded 
          ?
          (<div className="meetup-containser">
            {this.state.meetupsList.map((data, index) => {
              return(
                  <Meetups key={index} meetupInfo={data} uid={this.state.userId}/>
              )
            })}
          </div>)
          :
            <PulseLoader color="#990DA5" size="15px" margin="10px"/>
        }
      </div>
    );
  }
}

export default UserMeetups;
