import React, { Component } from 'react';
import HomeScreen from './screens/HomeScreen';
import Cookies from 'universal-cookie';

import './App.css';
import googleLogo from './img/google-logo.png';

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);

  }

  componentDidMount() {

    window.gapi.load('auth2', () => {

      let auth = window.gapi.auth2.init({
        client_id: '945392829583-vo2c7v1brbgerasn8iksduelm4k876mo.apps.googleusercontent.com'
      });
      // Check if the cookie is there
      let user = cookies.get('user');

      if (user != null) this.setState({ signedIn: true }, () => {console.log("Is user logged in: " + this.state.signedIn);})
      else {
        // Try to signin with google
        let signedIn = auth.isSignedIn.get();
        this.setState({ signedIn: signedIn }, () => {console.log("Is user logged in: " + this.state.signedIn);})
      }
      
    })
  }

  /**
   * Google sign in
   */
  signIn() {

    window.gapi.auth2.getAuthInstance().signIn().then((googleUser) => {

      let profile = googleUser.getBasicProfile();

      // Define the user
      let user = { name: profile.getName(), email: profile.getEmail() };

      // Set the cookies
      cookies.set('user', user, { path: '/' });

      // Update the state
      this.setState({ signedIn: true });

    }, (err) => { this.setState({ signedIn: false, error: err }) });
  }


  /**
   * Sign out
   */
  signOut() {

    window.gapi.auth2.getAuthInstance().signOut().then(() => {

      // Update the state
      this.setState({ signedIn: false })

      // Clear the cookies
      cookies.remove('user');
    });

  }

  render() {
    let content;

    let SignInContent = (
      <div className="toto-login" >
        login content:
        <div className="toto-login-button" onClick={this.signIn}>
          <div className="sign-in">Login</div>
          <img className="logo" src={googleLogo} alt="google-logo" />
        </div>
      </div>
    )

    if (this.state.signedIn) content = (
      <HomeScreen />
    );
    else content = <HomeScreen />

    return (
      <div className="toto-app">
        content:
        {content}
      </div>
    );
  }
}

export default App;
