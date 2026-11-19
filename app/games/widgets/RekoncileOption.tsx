'use client';

import { MaskedSvgIcon } from 'toto-react';
import TouchableOpacity from '@/components/TouchableOpacity';

const PRIMARY_COLOR = { bck: "#FFCC70", color: "#22668D" };
const SECONDARY_COLOR = { bck: "#264653", color: "#e9c46a" };
const TERTIARY_COLOR = { bck: "#22668D", color: "#FFCC70" };

/**
 * Props of the RekoncileOption
 */
interface RekoncileOptionProps {
    title: string;              // Title of the option
    text: string;               // Description of the option
    image: string;              // Public path of the icon
    secondary?: boolean;        // Use the secondary colors
    tertiary?: boolean;         // Use the tertiary colors (ignored if secondary is true)
    onPress: () => void;        // Called when the option is pressed
}

/**
 * An Option box, used by the Rekoncile and Inkome games (styled by RekoncileGameScreen.css)
 */
export default function RekoncileOption({ title, text, image, secondary, tertiary, onPress }: RekoncileOptionProps) {

    let color = PRIMARY_COLOR;
    if (secondary) color = SECONDARY_COLOR;
    else if (tertiary) color = TERTIARY_COLOR;

    const bck = color.bck;
    const front = color.color;

    return (
        <TouchableOpacity className="rekoncile-option" style={{ backgroundColor: bck, color: front }} onPress={onPress}>

            <div className="icon-container">
                <MaskedSvgIcon src={image} alt={title} size="w-7 h-7" color="bg-current" />
            </div>

            <div className="option-title">{title}</div>
            <div className="option-text">{text}</div>

        </TouchableOpacity>
    );
}
