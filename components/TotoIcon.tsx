'use client'

import { MaskedSvgIcon } from 'toto-react';
import './TotoIcon.css';

/**
 * Icon size, as understood by TotoIcon.css.
 */
export type TotoIconSize = 's' | 'ms' | 'm' | 'l' | 'xl';

interface TotoIconProps {
  image: string;            // Public path of the svg image (e.g. /images/plus.svg)
  size?: TotoIconSize;      // (OPT, default 'm') size of the icon
}

// Size of the inner icon, per size of the TotoIcon
const iconSizes: Record<TotoIconSize, string> = {
  s: 'w-3.5 h-3.5',
  ms: 'w-4 h-4',
  m: 'w-5 h-5',
  l: 'w-5 h-5',
  xl: 'w-5 h-5',
};

/**
 * Displays an icon contained in a circle.
 *
 * @param {TotoIconProps} props the props
 */
export default function TotoIcon(props: TotoIconProps) {

  let buttonClass = "toto-icon";
  if (props.size) buttonClass += ' ' + props.size;

  return (
    <div className={buttonClass}>
      <MaskedSvgIcon src={props.image} alt="icon" size={iconSizes[props.size ?? 'm']} color="bg-current" />
    </div>
  )
}
