'use client'

import { useRouter } from 'next/navigation';
import { MaskedSvgIcon } from 'toto-react';
import TouchableOpacity from '@/components/TouchableOpacity';
import './TotoIconButton.css';

/**
 * Button size, as understood by TotoIconButton.css.
 */
export type TotoIconButtonSize = 'xl' | 'l' | 'm' | 'ms' | 's' | 'ss';

interface TotoIconButtonProps {
  image: string;                    // (MAND) public path of the svg image (e.g. /images/plus.svg)
  size?: TotoIconButtonSize;        // (OPT, default 'm') size of the button
  label?: string;                   // (OPT) label shown under the button
  disabled?: boolean;               // (OPT, default false) true to disable the button
  marginHorizontal?: number;        // (OPT, default 0) horizontal margin (px) to apply to the button
  borders?: boolean;                // (OPT, default true) if false, won't show the border of the button (only the icon)
  onPress?: () => void;             // (OPT) called when the button has been clicked
  navigateTo?: string;              // (OPT) full URL (path and query) to navigate to
}

// Size of the icon, per size of the button
const iconSizes: Record<TotoIconButtonSize, string> = {
  xl: 'w-14 h-14',
  l: 'w-8 h-8',
  m: 'w-5 h-5',
  ms: 'w-4 h-4',
  s: 'w-3 h-3',
  ss: 'w-2 h-2',
};

// Size of the icon, per size of the button, when the button has no border
const noBorderIconSizes: Record<TotoIconButtonSize, string> = {
  xl: 'w-14 h-14',
  l: 'w-8 h-8',       // The legacy css rule for this case targeted a non-existing ".svg" element, so the regular size applied
  m: 'w-8 h-8',
  ms: 'w-7 h-7',
  s: 'w-5 h-5',
  ss: 'w-3 h-3',
};

/**
 * Displays a button with an icon inside.
 *
 * @param {TotoIconButtonProps} props the props
 */
export default function TotoIconButton(props: TotoIconButtonProps) {

  const router = useRouter();

  const size: TotoIconButtonSize = props.size ? props.size : 'm';

  /**
   * Handles the click of the button
   */
  const handleClick = () => {

    if (props.disabled) return;

    setTimeout(() => {

      // Call the onPress, if any
      if (props.onPress) props.onPress();

      // If there's a navigation involved:
      if (props.navigateTo) router.push(props.navigateTo);

    }, 20);
  }

  // Button class
  let buttonClass = "toto-icon-button";
  buttonClass += ' ' + size;
  if (props.disabled) buttonClass += ' disabled'
  if (props.borders === false) buttonClass += ' no-border'

  // Additional styles
  const style: React.CSSProperties = {};
  if (props.marginHorizontal) {
    style.marginLeft = props.marginHorizontal + 'px';
    style.marginRight = props.marginHorizontal + 'px';
  }

  const iconSize = props.borders === false ? noBorderIconSizes[size] : iconSizes[size];

  return (
    <div style={style} className="toto-icon-button-container">
      <TouchableOpacity className={buttonClass} onPress={handleClick} >
        <MaskedSvgIcon src={props.image} alt={props.label ? props.label : "icon"} size={iconSize} color="bg-accent" />
      </TouchableOpacity>
      {props.label && <div className="label">{props.label}</div>}
    </div>
  )
}
