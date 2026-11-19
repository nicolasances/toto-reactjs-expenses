'use client'

import React from 'react';
import './TotoButton.css';
import TouchableOpacity from '@/components/TouchableOpacity';

interface TotoButtonProps {
    title?: React.ReactNode;    // The content of the button
    onPress?: () => void;       // (OPT) called when the button is pressed
}

/**
 * A button with a title.
 *
 * @param {TotoButtonProps} props the props
 */
export default function TotoButton(props: TotoButtonProps) {

    return (
        <div className="toto-button">
            <TouchableOpacity className="button-container" onPress={props.onPress}>
                {props.title}
            </TouchableOpacity>
        </div>
    )
}
