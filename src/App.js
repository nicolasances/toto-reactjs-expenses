import React, { Component } from 'react';
import HomeScreen from './screens/HomeScreen';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import AuthAPI from './services/AuthaPI';
import ExpCatAPI from './services/ExpCatAPI';

import './App.css';

import googleLogo from './img/google-logo.png';
import ExpensesScreen from './screens/ExpensesScreen';
import NewExpenseScreen from './screens/NewExpenseScreen';
import ExpenseDetailScreen from './screens/ExpenseDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import TagScreen from './screens/tags/TagScreen';
import NewTagScreen from './screens/tags/NewTagScreen';
import EditTagScreen from './screens/tags/EditTagScreen';
import EditTagExpensesScreen from './screens/tags/EditTagExpensesScreen';
import InsightsScreen from './screens/insights/InsightsScreen';
import ConsolidationInsightsScreen from './screens/insights/consolidation/ConsolidationInsightsScreen';

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
    this.preStartAPIs = this.preStartAPIs.bind(this);

  }

  componentDidMount() {

    // Pre-start APIs
    this.preStartAPIs();

    if (!this.isTokenStored()) {

      this.googleSignIn();

    }
    else {

      this.setState({ signedIn: true });

    }

  }

  /**
   * This method starts APIs that need to be reactive, so that we don't have a cold start
   */
  async preStartAPIs() {

    console.log("Pre-starting APIs");

    await new ExpCatAPI().smoke();

  }

  isTokenStored() {

    // const user = cookies.get("user");
    const user = window.localStorage.getItem("user");

    console.log(`User found on local storage? [${user != null}]`);
    
    if (user) {
      cookies.set('user', JSON.parse(user), { path: '/' });
      console.log(`User: ${user}`);
    }

    return user;
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

      console.log("Initializing Google with Client ID " + googleClientID);

      window.google.accounts.id.initialize({
        client_id: googleClientID,
        auto_select: true,
        callback: (auth) => {

          console.log("Received auth response from Google SignIn");

          if (auth.credential) {

            console.log("Google Sign-in Successfull!");
            console.log(auth.credential);

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
    window.localStorage.setItem("user", JSON.stringify(user));

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
            <Route exact path="/tag">
              <TagScreen />
            </Route>
            <Route exact path="/newTag">
              <NewTagScreen />
            </Route>
            <Route exact path="/editTag">
              <EditTagScreen/>
            </Route>
            <Route exact path="/editTagExpenses">
              <EditTagExpensesScreen/>
            </Route>
            <Route exact path="/insights">
              <InsightsScreen/>
            </Route>
            <Route exact path="/insights/consolidation">
              <ConsolidationInsightsScreen/>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
