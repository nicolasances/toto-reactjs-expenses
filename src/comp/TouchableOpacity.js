import React, { Component } from 'react';

import './TouchableOpacity.css';

export default class TouchableOpacity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    }

    this.handleClick = this.handleClick.bind(this);

  }

  /**
   * Handles the click of the button
   */
  handleClick(event) {

    event.stopPropagation();

    // Update the state, to show the press action
    this.setState({pressed: true}, () => {
      setTimeout(() => {

        this.setState({pressed: false}, () => {

          // Call the onPress, if any
          if (this.props.onPress) this.props.onPress();

        })

      }, 100);
    });

  }


  render() {

    let style = 'touchable-opacity';
    if (this.props.className) style += ' ' + this.props.className;
    if (this.state.pressed) style += ' pressed';

    return (
      <div className={style} onClick={this.handleClick}>
        {this.props.children}
      </div>
    )
  }
}
