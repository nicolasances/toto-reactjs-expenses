import React, { Component } from 'react';
import HomeScreen from './screens/HomeScreen';
import Cookies from 'universal-cookie';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

import './App.css';
import googleLogo from './img/google-logo.png';

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
    else content = (
      <GoogleLogin
        clientId='945392829583-vo2c7v1brbgerasn8iksduelm4k876mo.apps.googleusercontent.com'
        buttonText='Login'
        onSuccess={this.signIn}
        onFailure={this.handleLoginFailure}
        cookiePolicy={'single_host_origin'}
        responseType='code,token'
      />
    )

    return (
      <div className="toto-app">
        Welcome {cookies.get('user') ? cookies.get('user').email : ''}
        {content}
      </div>
    );
  }
}

export default App;
