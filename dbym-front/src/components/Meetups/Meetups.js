import React, { Component } from 'react';
import axios from 'axios';
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
      meetupId: this.props.meetupInfo.meetupsId
    }
  }

  setMyLocation(mid) {
    navigator.geolocation.getCurrentPosition((p)=> {
      if(p){
        axios.post(`http://localhost:8080/meetups/setloca/${mid}`, {
          uid: this.state.uid,
          lat: p.coords.latitude,
          lng: p.coords.longitude
        });
        console.log(p.coords.latitude, p.coords.longitude);
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
              <button className="show-place"> show our place ! </button> :
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
                send my Location!
              </button>
            }
          </div>
        </li>
      </div>
    );
  }
}

export default Meetups;
