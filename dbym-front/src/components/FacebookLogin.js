// import React, {Component } from 'react';
// import FBLogin from 'react-facebook-login';
// import axios from 'axios';

// export default class FacebookLogin extends Component {
//   state = {
//     isLoggedIn: false,
//     userID: '',
//     name: '',
//     email: '',
//     picture: ''
//   }

//   responseFacebook = response => {
//     console.log(response);
    
//     this.setState({
//       isLoggedIn: true,
//       userID: response.userID,
//       name: response.name,
//       email: response.email,
//       picture: response.picture.data.url,
//       accessToken: response.accessToken
//     });

//     axios.post('http://localhost:8080/user', {
//       user_email: this.state.email,
//       user_name: this.state.name,
//       user_fbid: this.state.userID,
//       user_token: this.state.accessToken
//     });
//   };

//   componentClicked = () => console.log('clicked!');
  
//   render () {
//     let fbContent;

//     if (this.state.isLoggedIn) {
//       fbContent = (
//         <div style={{
//           width: '400px',
//           margin: 'auto',
//           background: '#f4f4f4',
//           padding: '20px'
//         }}>
//           <img src={this.state.picture} alt={this.state.name} />
//           <h2>Welcome {this.state.name} !! </h2>
//           Email: {this.state.email}
//         </div>
//       );
//     } else {
//       fbContent = (
//         <FBLogin
//           appId="2038991019750039"
//           autoLoad={false}
//           fields="name,email,picture,friendlists{name, id}"
//           onClick={this.componentClicked}
//           callback={this.responseFacebook}
//         />
//       );

//     }

//     return (
//       <div>
//         {fbContent}
//       </div>
//     );
//   }
// }
