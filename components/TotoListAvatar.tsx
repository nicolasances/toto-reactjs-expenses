'use client'

import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { MaskedSvgIcon } from 'toto-react';
import TouchableOpacity from '@/components/TouchableOpacity';
import './TotoListAvatar.css';

/**
 * Avatar size, as understood by TotoListAvatar.css.
 */
export type TotoListAvatarSize = 's' | 'ms' | 'm' | 'l' | 'xl';

interface TotoListAvatarProps {
  image?: string;                   // (OPT) public path of the svg image (e.g. /images/cat/FOOD.svg)
  text?: string | number;           // (OPT) text of the avatar
  size?: TotoListAvatarSize;        // (OPT, default 'm') size of the avatar
  selected?: boolean;               // (OPT, default false) if the avatar is in a "selected" state
  onPress?: () => void;             // (OPT) called when the avatar is clicked
  popup?: React.ReactNode;          // (OPT) if passed, overrides onPress and is shown in a popup instead. The avatar is passive: the content handles its own events
}

// Size of the icon, per size of the avatar
const iconSizes: Record<TotoListAvatarSize, string> = {
  xl: 'w-5 h-5',
  l: 'w-5 h-5',
  m: 'w-3 h-3',
  ms: 'w-2.5 h-2.5',
  s: 'w-2 h-2',
};

/**
 * Displays an avatar contained in a circle.
 *
 * @param {TotoListAvatarProps} props the props
 */
export default function TotoListAvatar(props: TotoListAvatarProps) {

  const [popupOpen, setPopupOpen] = useState(false);

  /**
   * Reacts to the press: shows the popup if there is one, otherwise calls onPress
   */
  const onPress = () => {

    // If there's a popup to display, that's the priority
    if (props.popup) setPopupOpen(true);
    // Otherwise, if a onPress is provided use it
    else if (props.onPress) props.onPress();
  }

  const size: TotoListAvatarSize = props.size ? props.size : 'm';

  let buttonClass = "toto-list-avatar";
  buttonClass += ' ' + size;
  if (props.selected) buttonClass += ' selected';

  // Content of the avatar
  let content;
  if (props.image) content = (
    <MaskedSvgIcon src={props.image} alt="avatar" size={iconSizes[size]} color={props.selected ? 'bg-toto-background' : 'bg-current'} />
  )
  else if (props.text) content = (<div className='text'>{props.text}</div>)
  else content = (<div className='text'></div>)

  return (
    <div>
      <TouchableOpacity onPress={onPress}>
        <div className={buttonClass} >
          {content}
        </div>
      </TouchableOpacity>

      <Popup
        closeOnDocumentClick={true}
        closeOnEscape={true}
        open={popupOpen}
        onClose={() => { setPopupOpen(false) }}
        overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        contentStyle={{ backgroundColor: '#007c91', borderRadius: '3px', border: 'none', boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)' }}
        arrow={false}
      >
        {props.popup}
      </Popup>
    </div>
  )
}
