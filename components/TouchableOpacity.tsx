'use client'

import React, { useState } from 'react';
import './TouchableOpacity.css';

interface TouchableOpacityProps {
  className?: string;               // (OPT) additional css class(es) to put on the wrapper
  style?: React.CSSProperties;      // (OPT) inline style of the wrapper
  onPress?: () => void;             // (OPT) called shortly after the element has been pressed
  children?: React.ReactNode;       // The content to make touchable
}

/**
 * Wrapper that dims its content while pressed and calls onPress afterwards.
 *
 * @param {TouchableOpacityProps} props the props
 */
export default function TouchableOpacity(props: TouchableOpacityProps) {

  const [pressed, setPressed] = useState(false);

  /**
   * Handles the click: shows the press effect, then calls onPress
   */
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {

    event.stopPropagation();

    // Update the state, to show the press action
    setPressed(true);

    setTimeout(() => {

      setPressed(false);

      // Call the onPress, if any
      if (props.onPress) props.onPress();

    }, 100);
  }

  let style = 'touchable-opacity';
  if (props.className) style += ' ' + props.className;
  if (pressed) style += ' pressed';

  return (
    <div className={style} style={props.style} onClick={handleClick}>
      {props.children}
    </div>
  )
}
