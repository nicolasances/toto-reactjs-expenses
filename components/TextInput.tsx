'use client'

import { useEffect, useRef, useState } from 'react';
import './TextInput.css';

interface TextInputProps {
    initialValue?: string;                              // (OPT) the initial value that the input should show
    initialValueLoader?: () => Promise<string>;         // (OPT) loads the initial value asynchronously
    placeholder?: string;                               // (OPT) placeholder shown when the field is empty
    align?: 'left' | 'center' | 'right';                // (OPT, default 'left') text alignment
    onTextChange?: (value: string) => void;             // (OPT) called when the value changes
}

/**
 * A controlled text input.
 *
 * @param {TextInputProps} props the props
 */
export default function TextInput(props: TextInputProps) {

    const [value, setValue] = useState<string>(props.initialValue ? props.initialValue : '');

    // Keeps the loader given at mount, which is only used once
    const loaderRef = useRef(props.initialValueLoader);

    useEffect(() => {

        if (loaderRef.current) loaderRef.current().then((data) => {
            setValue(data);
        })
    }, [])

    /**
     * Updates the value and notifies the change
     */
    const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        if (props.onTextChange) props.onTextChange(event.target.value);
    }

    const style = {
        textAlign: props.align ? props.align : 'left'
    } as const;

    return (
        <div className="text-input">
            <input
                style={style}
                type="text"
                placeholder={props.placeholder}
                value={value}
                onChange={changeValue}
            />
        </div>
    )
}
