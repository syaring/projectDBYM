import React, { Component } from 'react';
import placeData from '../../data/placeData';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import './MeetUpForm.css';
import pin from '../../image/pin.png';

class MeetUpForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hostId: this.props.hostId,
      hostsFriends: [],
      title: "",
      lineName: "",
      selectedLineList: [],
      stations: [],
      places: [],
      friends: [],
      category: "",
      myLocation: {},
      myAddress: "",
      isLoaded: false
    };
  }

  componentDidMount() {
    this.getFriendsList();
  }
  
  getFriendsList() {
    axios.get(`http://sample-application-development.tzuwucqkx7.us-west-2.elasticbeanstalk.com/friends/${this.props.hostId}`).then((friends) => {
      this.setState({
        hostsFriends: friends.data,
        isLoaded: true
      });
    });
  }

  getMyLocation() {
    navigator.geolocation.getCurrentPosition((p)=> {
      if(p){
        this.setState({
          myLocation: {lat: p.coords.latitude, lng: p.coords.longitude}
        });
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${p.coords.latitude},${p.coords.longitude}&key=AIzaSyB3GzdWkIgLmw7Ei_QisqgPsjyIVTdX6CE`).then((add) => {
            this.setState({
              myAddress: add.data.results[0].formatted_address
            });
        });
      }
    });
  }
  
  sendGroupInfo() {
    axios.post('http://sample-application-development.tzuwucqkx7.us-west-2.elasticbeanstalk.com/meetups', {
      hostId: this.props.hostId,
      title: this.state.title,
      hotPlaces: this.state.places,
      guests: this.state.friends,
      myLocation: this.state.myLocation
    }, response => {
      if(response) {
      }
    });
  }

  setSelectedFriend(friend) {
    let friendsTmp = this.state.friends;

    if((!friendsTmp.includes(friend))) {
      friendsTmp.push(friend);
    } else {
      friendsTmp.splice(friendsTmp.indexOf(friend), 1);
    }

    this.setState({
      friends: [...friendsTmp]
    });
  }

  setSelectedStation(station) {
    let stationName = station+"역";
    let fullName = stationName + '+' + this.state.lineName;

    let placesTmp = this.state.places;
    let stationsTmp = this.state.stations;
    
    if ((placesTmp.length < 5) && (!placesTmp.includes(fullName))) {
      placesTmp.push(fullName);
    } else if(placesTmp.includes(fullName)) {
      placesTmp.splice(placesTmp.indexOf(fullName), 1);
    }

    if ((stationsTmp.length < 5) && (!stationsTmp.includes(stationName))) {
      stationsTmp.push(stationName);
    } else if(stationsTmp.includes(stationName)) {
      stationsTmp.splice(stationsTmp.indexOf(stationName), 1);
    }

    this.setState({
      places: [...placesTmp],
      stations: [...stationsTmp]
    });
  }

  deleteStation(station) {
    let stationName = station+"역";
    let fullName = stationName + '+' + this.state.lineName;

    let stationsTmp = this.state.stations;
    let placesTmp = this.state.places;
    
    stationsTmp.splice(stationsTmp.indexOf(stationName), 1);
    placesTmp.splice(placesTmp.indexOf(fullName), 1);

    this.setState({
      stations: [...stationsTmp],
      places: [...placesTmp]
    });
  }

  deleteFriend(friend) {
    let friendsTmp = this.state.friends;

    friendsTmp.splice(friendsTmp.indexOf(friend), 1);

    this.setState({
      friends: [...friendsTmp]
    });
  }

  setTitle(ev) {
    this.setState({
      title: ev.target.value
    });
  }

  showStationList(line) {
    this.setState({
      selectedLineList: line["station"],
      lineName: line["line"]
    });
  }
  
  render() {
    return (
      <div className="MeetUpForm">
        <div className="title">CREATE NEW MEETUPS</div>
        <div className="form-header">
          <input className="input-title" type="text" placeholder="INPUT MEETUP TITLE"
            value={this.state.title}
            onChange={this.setTitle.bind(this)}
          />
          <div>
            <img className="location-pin" onClick={this.getMyLocation.bind(this)} src={pin}/>
            <div className="address">{this.state.myAddress ? this.state.myAddress : ''}</div>
          </div>
        </div>
        <div>
          <div className="options">
            <ul className="navigation">
              <a className="metro">SELECT METRO</a>
                {
                  placeData.map((data, index) => {
                    return (
                      <li className="metro-line"
                        key={index}
                        onClick={this.showStationList.bind(this, data)}>
                        <a>{data.line}</a>
                      </li>
                    );
                  })
                }
            </ul>
          </div>

          <div className="options">
            <ul className="navigation">
              <a className="station">
                { this.state.lineName ?
                  this.state.lineName : 'STATION'}
              </a>
              {
                this.state.selectedLineList.map((data, index) => {
                  return (
                    <li className="station-name"
                      key={index}
                      onClick={this.setSelectedStation.bind(this, data)}>
                      <a>{data}</a>
                    </li>
                  );
                })
              }
            </ul>
          </div>

          <div className="options">
            <ul className="navigation">
              <a className="friend">MY FRIENDS</a>
                {
                  this.state.isLoaded &&
                  this.state.hostsFriends.friends.map((data, index) => {
                    return (
                      <li className="friend-name"
                        key={index}
                        onClick={this.setSelectedFriend.bind(this, data)}>
                        <a>{data.userName}</a>
                      </li>
                    );
                  })
                }
            </ul>
          </div>
        </div>

        <div className="selected-stations">
          {
            this.state.stations.map((station, index) => {
              return (
                <div key={index}
                  className="selected-station"
                  onClick={this.deleteStation.bind(this, station)}>
                  {station}
                </div>
              );
            })
          }
        </div>

        <div className="selected-friends">
          {
            this.state.friends.map((friend, index) => {
              return (
                <div key={index}
                  className="selected-friend"
                  onClick={this.deleteFriend.bind(this, friend)}>
                  {friend.userName}
                </div>
              );
            })
          }
        </div>
        <div className="create-new">
          <Link to='/'>
            <button className="create-new-meetups"
              onClick={this.sendGroupInfo.bind(this)}>
              CREATE
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default MeetUpForm;
