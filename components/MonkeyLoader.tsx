'use client'

import { MaskedSvgIcon } from 'toto-react';
import './MonkeyLoader.css';

interface MonkeyLoaderProps {
    size?: number;      // (OPT, default 32) size in px
    fill?: string;      // (OPT, default var(--color-dark-primary)) any css color
}

/**
 * Animated Monkey loading SVG.
 *
 * @param {MonkeyLoaderProps} props the props
 */
export default function MonkeyLoader(props: MonkeyLoaderProps) {

    const size = props.size ? props.size : 32;
    const fill = props.fill ? props.fill : 'var(--color-dark-primary)';

    return (
        <div className="monkey-loader">
            <div className="monkey-icon" style={{ width: `${size}px`, height: `${size}px`, color: fill }}>
                <MaskedSvgIcon src="/images/toto-monkey.svg" alt="loading" size="w-full h-full" color="bg-current" />
            </div>
        </div>
    )
}
