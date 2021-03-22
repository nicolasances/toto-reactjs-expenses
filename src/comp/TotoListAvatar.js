import React, { Component } from 'react';
import Popup from "reactjs-popup";

import TouchableOpacity from './TouchableOpacity';

import './TotoListAvatar.css';

import tick from '../img/tick.svg';

/**
 * Displays an avatar contained in a circle
 * Properties:
 * - image          : (optional) the svg image (loaded)
 * - text           : (optional) text of the avatar
 * - size           : (optional, default 'm') defines the size of the icon: ('s', 'ms', 'm', 'l', 'xl')
 * - selected       : (optional, default false) if the avatar is in a "selected" state, it will show a tick (removing any previous image if any)
 * - onPress        : (optional), callback() to the avatar click
 * - popup          : (optional) if passed, will override the onPress() and show a popup instead
 *                    the popup content is the one provided in this field
 *                    this field MUST CONTAINE a react component that will be used as popup content
 *                    that component will be responsible for the content and the reaction to events within it. The avatar is passive.
 */
export default class TotoListAvatar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      popupOpen: false,
    }

    // Bindings
    this.onPress = this.onPress.bind(this);
  }

  /**
   * Reacts the pressing the button
   * Will show a popup or call the props.onPress based on what was passed in the props
   */
  onPress() {

    // If there's a popup to display, that's the priority
    if (this.props.popup) {
      this.setState({popupOpen: true});
    }
    // Otherwise, if a onPress is provided use it
    else if (this.props.onPress) this.props.onPress();

  }

  render() {

    let buttonClass = "toto-list-avatar";
    if (this.props.size) buttonClass += ' ' + this.props.size;
    else buttonClass += ' m';
    if (this.props.selected) buttonClass += ' selected';

    let svgClass = 'icon';

    // Content of the avatar
    let content;
    if (this.props.image) content = (this.props.image)
    else if (this.props.text) content = (<div className='text'>{this.props.text}</div>)
    else content = (<div className='text'></div>)
    // Override content
    // if (this.props.selected) content = (<SVG src={tick} className={svgClass} />)

    return (
      <div>
        <TouchableOpacity onPress={this.onPress}>
          <div className={buttonClass} >
            {content}
          </div>
        </TouchableOpacity>


        <Popup
          closeOnDocumentClick={true}
          closeOnEscape={true}
          open={this.state.popupOpen}
          onClose={() => {this.setState({popupOpen: false})}}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          contentStyle={{backgroundColor: '#007c91', borderRadius: '3px', border: 'none', boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'}}
          arrow={false}
          >
          {this.props.popup}
        </Popup>
      </div>
    )
  }
}
