import React, { Component } from 'react';
import SVG from 'react-svg';

import './TotoIcon.css';

/**
 * Displays an icon contained in a circle
 * Properties:
 * - image          : the svg image (loaded)
 * - size           : (optional, default 'm') defines the size of the icon: ('s', 'ms', 'm', 'l', 'xl')
 */
export default class TotoIcon extends Component {

  render() {

    let buttonClass = "toto-icon";
    if (this.props.size) buttonClass += ' ' + this.props.size;

    let svgClass = 'icon';

    return (
      <div className={buttonClass}>
        <SVG src={this.props.image} className={svgClass}/>
      </div>
    )
  }
}
