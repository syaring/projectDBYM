import React, { Component } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import GoogleMap from '../GoogleMap/GoogleMap';
import './Meetups.css';

class Meetups extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uid: this.props.uid,
      isInvited: this.props.meetupInfo.isInvited,
      title: this.props.meetupInfo.meetupsTitle,
      member: this.props.meetupInfo.MemberList,
      place: this.props.meetupInfo.meetupsPlace,
      isEntered: this.props.meetupInfo.isEntered,
      meetupId: this.props.meetupInfo.meetupsId,
      
    }
  }

  setMyLocation(mid) {
    navigator.geolocation.getCurrentPosition((p)=> {
      if(p){
        axios.post(`http://sample-application-development.tzuwucqkx7.us-west-2.elasticbeanstalk.com/meetups/setloca/${mid}`, {
          uid: this.state.uid,
          lat: p.coords.latitude,
          lng: p.coords.longitude
        });
        this.setState({
          isEntered: true
        });
      }
    });
  }

  render() {
    return(
      <div className="Meetups">
        <div className="muTitle">
          {this.state.isInvited ? 'Invited' : 'Inviting'}
        </div>
        <li className="muInfos">
          <div className="category">TITLE</div>
          <div className="contents"> {this.state.title} </div>
        </li>
        <li className="muInfos">
          <div className="category">MEMEBER</div>
          <div className="contents">
            { this.state.member.map((mem, index) => {
              return mem+'님 ' ;
            })}
          </div>
        </li>
        <li className="muInfos">
          <div className="category">PLACE</div>
          <div className="contents">
            { this.state.place ?
              <Popup trigger={<button className="show-place">show our place !</button>}
                position="right center">
                <GoogleMap location={this.state.place}/>
              </Popup>
               :
              '정하는중'
            }
          </div>
        </li> 
        <li className="muInfos">
          <div className="category last">MY LOCATION</div>
          <div className="contents">
            { this.state.isEntered ? 
              '전송완료' :
              <button type="button"className="loca-button"
                onClick={this.setMyLocation.bind(this, this.state.meetupId)} >
                SEND MY LOCATION
              </button>
            }
          </div>
        </li>
      </div>
    );
  }
}

export default Meetups;
