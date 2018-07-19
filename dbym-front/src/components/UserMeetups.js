import React, { Component } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import Meetups from './Meetups';
import axios from 'axios';

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
    axios.get(`http://localhost:8080/meetups/${this.props.uid}`).then((meet)=>{
      this.setState({
        meetupsList: meet.data,
        isLoaded: true
      });
    });
  }
  
  render() {
    return (
      <div className="UserMeetups">
        <div>
          {
            this.state.isLoaded ?
            (<div>
              {this.state.meetupsList.map((data, index) => {
                return(
                    <Meetups key={index} meetupInfo={data} uid={this.state.userId}/>
                )
              })}
            </div>) :
            (<div>
              받아오는중~
            </div>)
          }
        </div>
      </div>
    );
  }
}

export default UserMeetups;
