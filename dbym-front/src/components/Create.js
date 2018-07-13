import React, { Component } from 'react';
import New from '../image/new.png';
import MeetUpForm from './MeetUpForm';

class NewGroup extends Component {
  render() {
    return (
      <div className="NewGroup">
        <input className="New" type="image" src={New} />
        <MeetUpForm />
      </div>
    );
  }
}

export default NewGroup;