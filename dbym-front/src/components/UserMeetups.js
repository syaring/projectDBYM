import React, { Component } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
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

  setMyLocation(mid) {
    navigator.geolocation.getCurrentPosition((p)=> {
      if(p){
        axios.post(`http://localhost:8080/meetups/setloca/${mid}`, {
          uid: this.state.userId,
          lat: p.coords.latitude,
          lng: p.coords.longitude
        });
        console.log(p.coords.latitude, p.coords.longitude);
      }
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
                  <li key={index}>
                    {data.isInvited ? <div>초대받은 모임</div> : <div>초대한 모임</div>}
                    방제 : {data.meetupsTitle} <br/>
                    멤버 :
                    {
                      data.MemberList.map((mem, index) => {
                        return (
                          mem+'님 '
                        )
                      })
                    } <br/>
                    모임 장소 : {data.meetupsPlace ? data.meetupsPlace : <div>정하는중</div>}
                    내 위치 : {data.isEntered ? <div>전송완료</div> : <button onClick={this.setMyLocation.bind(this, data.meetupsId)}>내 위치 보내기</button>}
                  </li>
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
