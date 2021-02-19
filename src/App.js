import React, { Component } from 'react';
import HomeScreen from './screens/HomeScreen';
import Cookies from 'universal-cookie';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

import './App.css';

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false
    };

    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);

  }

  componentDidMount() {

    let user = cookies.get('user');

    if (user != null) this.setState({ signedIn: true }, () => { console.log("Is user logged in: " + this.state.signedIn); })

  }

  handleLoginFailure() {

  }

  /**
   * Google sign in
   */
  signIn(response) {

    if (response.accessToken) {
      this.setState({
        signedIn: true
      });

      let profile = response.getBasicProfile();

      // Define the user
      let user = { name: profile.getName(), email: profile.getEmail() };

      // Set the cookies
      cookies.set('user', user, { path: '/' });
    }

  }


  /**
   * Sign out
   */
  signOut() {

    // Clear the cookies
    cookies.remove('user');

  }

  render() {
    let content;

    if (this.state.signedIn) content = (
      <HomeScreen />
    );
    else content = (
      <div className="toto-login">

        <GoogleLogin
          clientId='945392829583-vo2c7v1brbgerasn8iksduelm4k876mo.apps.googleusercontent.com'
          buttonText='Login with Google'
          onSuccess={this.signIn}
          onFailure={this.handleLoginFailure}
          cookiePolicy={'single_host_origin'}
          responseType='code,token'
        />
      </div>

    )

    return (
      <div className="toto-app">
        {content}
      </div>
    );
  }
}

export default App;
