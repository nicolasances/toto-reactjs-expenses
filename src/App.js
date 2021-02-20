import React, { Component } from 'react';
import HomeScreen from './screens/HomeScreen';
import Cookies from 'universal-cookie';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ls from 'local-storage';

import './App.css';

import googleLogo from './img/google-logo.png';
import ExpensesScreen from './screens/ExpensesScreen';

const cookies = new Cookies();
const googleClientID = '945392829583-vo2c7v1brbgerasn8iksduelm4k876mo.apps.googleusercontent.com';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false
    };

    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.loadGoogleAPI = this.loadGoogleAPI.bind(this);

  }

  componentDidMount() {

    this.loadGoogleAPI();

  }

  loadGoogleAPI() {

    if (window.gapi) {

      console.log("Google API loaded!");
      
      window.gapi.load('auth2', () => {

        let auth = window.gapi.auth2.init({
          client_id: googleClientID
        });

        // Check if the cookie is there
        let user = cookies.get('user');

        if (user != null) this.setState({ signedIn: true })
        else {
          // Try to signin with google
          let signedIn = auth.isSignedIn.get();
          this.setState({ signedIn: signedIn })
        }
      })
    }
    else {
      console.log("Google API not loaded... waiting..");
      setTimeout(this.loadGoogleAPI, 200);
    }
  }

  /**
   * Google sign in
   */
  signIn(response) {

    if (!window.gapi) { console.log("ERROR! Google API hasn't been loaded for some reason!"); return; }

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
        <div className="toto-login-button" onClick={this.signIn}>
          <div className="sign-in">Login</div>
          <img className="logo" src={googleLogo} alt="google-logo" />
        </div>
      </div>

    )

    return (
      <div className="toto-app">
        <Router>
          <Switch>
            <Route exact path="/">
              {content} 
            </Route>
            <Route exact path="/expenses">
              <ExpensesScreen/>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
