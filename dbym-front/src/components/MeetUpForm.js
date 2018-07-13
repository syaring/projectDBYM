import React, { Component } from 'react';
import placeData from '../data/placeData';
import _ from 'lodash';
import axios from 'axios';

class MeetUpForm extends Component {

  constructor(props) {
    super(props);

    this.state = ({
      places: [],
      selectedLineList: [],
      lineName: "",
      station: "",
      guests: [],
      category: "",
      myLocation: ""
    });
  }
  
  sendGroupInfo() {
    axios.post('http://localhost:8080/meetup', {
      hostId: this.props.hostId,
      hotPlaces: this.state.places,
      guests: this.state.guests,
      category: this.state.category,
      myLoctation: this.state.myLocation
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

  render() {
    return (
      <div className="MeetUpForm">
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

        <button onClick={this.sendGroupInfo.bind(this)}>createMeetup</button>
      </div>
    );
  }
}

export default MeetUpForm;