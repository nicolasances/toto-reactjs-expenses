import React, { Component } from 'react'; 
import HomeScreen from './screens/HomeScreen';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="toto-app">
        <HomeScreen />
      </div>
    );
  }
}

export default App;
