import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class GoogleMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lat: this.props.location.split(",")[0],
      lng: this.props.location.split(",")[1]
    }
  }
  render() {
    return (
      <Map google={this.props.google}
          style={{width: '400px', height: '400px', position: 'relative'}}
          className={'map'}
          initialCenter={{
            lat: this.state.lat,
            lng: this.state.lng
          }}
          zoom={14}>
          {console.log(typeof(this.props.location))}
        <Marker
          position={{
            lat: this.state.lat,
            lng: this.state.lng
          }} name={'Current location'} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyB3GzdWkIgLmw7Ei_QisqgPsjyIVTdX6CE")
})(GoogleMap)