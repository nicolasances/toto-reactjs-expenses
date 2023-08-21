import React, { Component } from 'react';
import HomeScreen from './screens/HomeScreen';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ls from 'local-storage';
import jwt from "jsonwebtoken";
import AuthAPI from './services/AuthaPI';

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

    this.googleSignIn = this.googleSignIn.bind(this);
    this.storeUser = this.storeUser.bind(this);
    this.isTokenStored = this.isTokenStored.bind(this);
    this.getTotoToken = this.getTotoToken.bind(this);

  }

  componentDidMount() {

    if (!this.isTokenStored()) {
      
      this.googleSignIn();

    }
    else {
      
      console.log(`User already signed in. User: ${JSON.stringify(cookies.get("user"))}`);

      this.setState({ signedIn: true });
      
    }

  }

  isTokenStored() {

    const user = cookies.get("user");

    return user && user.idToken;
  }

  async getTotoToken(googleToken) {

    return await new AuthAPI().getTotoToken(googleToken);

  }

  userFromToken(idToken) {

    const decodedToken = jwt.decode(idToken);

    return {
      name: decodedToken.user,
      email: decodedToken.user,
      idToken: idToken
    }
  }

  googleSignIn() {

    if (window.google) {

      console.log("Google API loaded!");

      window.google.accounts.id.initialize({
        client_id: googleClientID,
        auto_select: true,
        callback: (auth) => {

          console.log("Received auth response from Google SignIn");

          if (auth.credential) {

            console.log("The user is signed in!");

            this.getTotoToken(auth.credential).then((totoToken) => {

              const user = this.userFromToken(totoToken.token);

              console.log(user);

              this.storeUser(user);

            }, (error) => {
              console.log(error);
            })

          }
        }
      });

      window.google.accounts.id.prompt();
    }
    else {
      console.log("Google API not loaded... waiting..");
      setTimeout(this.googleSignIn, 50);
    }

  }

  storeUser(user) {

    // Set the cookies
    cookies.set('user', user, { path: '/' });

    this.setState({ signedIn: true });

  }

  // /**
  //  * Google sign in
  //  */
  // signIn() {

  //   window.google.accounts.id.prompt();

  // }

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
