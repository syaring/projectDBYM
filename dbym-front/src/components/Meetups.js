import React, { Component } from 'react';
import axios from 'axios';
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
      <div>
        {this.state.isInvited ? <div>초대받은 모임</div> : <div>초대한 모임</div>}
        방제 : {this.state.title} <br/>
        멤버 :
        {
          this.state.member.map((mem, index) => {
            return (
              mem+'님 '
            )
          })
        } <br/>
        모임 장소 : {this.state.place ? <div>모임장소 보기</div> : <div>정하는중</div>}
        내 위치 : {this.state.isEntered ? <div>전송완료</div> : <button onClick={this.setMyLocation.bind(this, this.state.meetupId)}>내 위치 보내기</button>}
      </div>
    );
  }
}

export default Meetups;
