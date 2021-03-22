import React, { Component } from 'react';
import HomeScreen from './screens/HomeScreen';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ls from 'local-storage';

import './App.css';

import googleLogo from './img/google-logo.png';
import ExpensesScreen from './screens/ExpensesScreen';
import NewExpenseScreen from './screens/NewExpenseScreen';
import ExpenseDetailScreen from './screens/ExpenseDetailScreen';
import SettingsScreen from './screens/SettingsScreen';

const cookies = new Cookies();
const googleClientID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false
    };

    this.signIn = this.signIn.bind(this);
    this.loadGoogleAPI = this.loadGoogleAPI.bind(this);
    this.signinChanged = this.signinChanged.bind(this);
    this.storeUser = this.storeUser.bind(this);

  }

  componentDidMount() {

    this.loadGoogleAPI();

  }

  loadGoogleAPI() {

    if (window.gapi) {

      console.log("Google API loaded!");

      window.gapi.load('auth2', () => {

        window.gapi.auth2.init({
          client_id: googleClientID
        }).then((auth) => {

          auth.isSignedIn.listen(this.signinChanged);

          if (auth.isSignedIn.get()) {

            console.log("The user is signed in!");

            this.storeUser(auth.currentUser.get());
          }

        });
      })
    }
    else {
      console.log("Google API not loaded... waiting..");
      setTimeout(this.loadGoogleAPI, 50);
    }
  }

  /**
   * Reacts to changes in the status of the user sign in 
   * @param {boolean} signedIn true if the user is signed in
   */
  signinChanged(signedIn) {

    console.log("Sign in status changed to: " + signedIn);

    if (!signedIn) {
      this.signIn();
    }
  }

  storeUser(googleUser) {

    let profile = googleUser.getBasicProfile();
    let authResponse = googleUser.getAuthResponse();

    // Define the user
    let user = { name: profile.getName(), email: profile.getEmail(), idToken: authResponse.id_token };

    // Set the cookies
    cookies.set('user', user, { path: '/' });

    this.setState({ signedIn: true });

  }

  /**
   * Google sign in
   */
  signIn() {

    if (!window.gapi) { console.log("ERROR! Google API hasn't been loaded for some reason!"); return; }

    window.gapi.auth2.getAuthInstance().signIn().then((googleUser) => {

      this.storeUser(googleUser);

    }, (err) => {
      console.log("Couldn't sign in with Google SignIn");
      console.log(err);
      this.setState({ signedIn: false, error: err });
    });

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
              <ExpensesScreen />
            </Route>
            <Route exact path="/newExpense">
              <NewExpenseScreen />
            </Route>
            <Route exact path="/expenses/:id">
              <ExpenseDetailScreen />
            </Route>
            <Route exact path="/settings">
              <SettingsScreen />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
