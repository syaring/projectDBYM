import React, { Component } from 'react';
import placeData from '../data/placeData';
import _ from 'lodash';
import axios from 'axios';

class MeetUpForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hostId: this.props.hostId,
      hostsFriends: [],
      lineName: "",
      selectedLineList: [],
      station: "",
      places: [],
      friends: [],
      category: "",
      myLocation: {}
    };
  }

  componentDidMount() {
    this.getFriendsList();
  }
  
  sendGroupInfo() {
    axios.post('http://localhost:8080/meetups', {
      hostId: this.props.hostId,
      hotPlaces: this.state.places,
      guests: this.state.friends,
      category: this.state.category,
      myLocation: this.state.myLocation
    });
    
  }

  showStationList(line) {
    this.setState({
      selectedLineList: line["station"],
      lineName: line["line"]
    });
  }
  
  setSelectedStation(station) {
    this.setState({
      station: station
    });

    let fullName = station + "역+" + this.state.lineName;

    if ((this.state.places.length < 5) && (!this.state.places.includes(fullName))) {
      this.setState({
        places: [...this.state.places, fullName]
      });
    } else if(this.state.places.includes(fullName)) {
      this.state.places.splice(this.state.places.indexOf(fullName), 1);
    }
  }

  setSelectedFriend(friend) {
    this.setState({
      friends: [...this.state.friends, friend]
    })
  }

  getFriendsList() {
    axios.get(`http://localhost:8080/friends/${this.props.hostId}`).then((friends) => {
     this.setState({
       hostsFriends: friends.data
     });
    });
  }

  getMyLocation() {
    navigator.geolocation.getCurrentPosition((p)=> {
      if(p){
        this.setState({
          myLocation: {lat: p.coords.latitude, lng: p.coords.longitude}
        });
        console.log(this.state.myLocation);

      }
    });
  }

  render() {
    return (
      <div className="MeetUpForm">
        ---------------------지하철 리스트---------------------
        <div>
          {
            placeData.map((data, index) => {
              return (
                <li className="metroLine" key={index} onClick={this.showStationList.bind(this, data)}>
                  ++{data.line}++
                </li>
              );
            })
          }
        </div>
          ---------------------{this.state.lineName} 리스트---------------------
        <div>
          {
            this.state.selectedLineList.map((data, index) => {
              return (
                <li key={index} onClick={this.setSelectedStation.bind(this, data)}>
                  {data}
                </li>
              );
            })
          }
        </div>
        ---------------------친구 리스트---------------------
        <div>
          {
            this.state.hostsFriends.map((data, index) => {
              return (
                <li key={data.id} onClick={this.setSelectedFriend.bind(this, data.id)}>
                  {data.name}
                </li>
              );
            })
          }
        </div>
        --------------------카테고리---------------------
        <div>
          <li>음식점</li>
          <li>술집</li>
          <li>카페</li>
        </div>
        <button onClick={this.getMyLocation.bind(this)}>내 위치 입력</button>
        <button onClick={this.sendGroupInfo.bind(this)}>createMeetups</button>
      </div>
    );
  }
}

export default MeetUpForm;