'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { MaskedSvgIcon } from 'toto-react';
import TotoIconButton from '@/components/TotoIconButton';
import './TitleBar.css';

interface TitleBarProps {
    title?: string;                     // (OPT) the title to show
    back?: boolean;                     // (OPT) true to show a back button on the left
    onBack?: () => void;                // (OPT) called before navigating back
    leftButton?: React.ReactNode;       // (OPT) custom left button (used when back is not set)
    newExpenseEnabled?: boolean;        // (OPT) true to show a button that opens the new expense screen
    selectedMonth?: string;             // (OPT) the YYYYMM month passed to the new expense screen
    newEnabled?: boolean;               // (OPT) true to show a plus button that navigates to navigateTo
    navigateTo?: string;                // (OPT) full URL the plus button navigates to (when newEnabled)
    rightButton?: React.ReactNode;      // (OPT) custom right button
}

/**
 * Title bar of a screen, with optional back and plus buttons.
 *
 * @param {TitleBarProps} props the props
 */
export default function TitleBar(props: TitleBarProps) {

    const router = useRouter();

    /**
     * Navigates back
     */
    const navigateBack = () => {

        if (props.onBack) props.onBack();

        router.back();
    }

    // Left button
    let leftButton = (
        <div className="button-container"></div>
    )
    if (props.back) leftButton = (
        <div className="button-container">
            <MaskedSvgIcon src="/images/left-arrow.svg" alt="back" size="w-6 h-6" color="bg-black" onClick={navigateBack} />
        </div>
    )
    else if (props.leftButton) leftButton = (<>{props.leftButton}</>)

    // Right button
    const rightButton = (
        <div className="button-container">
            {props.newExpenseEnabled &&
                <TotoIconButton image="/images/plus.svg" size="s" navigateTo={props.selectedMonth ? "/newExpense?yearMonth=" + props.selectedMonth : "/newExpense"} />
            }
            {props.newEnabled &&
                <TotoIconButton image="/images/plus.svg" size="ms" navigateTo={props.navigateTo} />
            }
            {props.rightButton}
        </div>
    )

    return (
        <div className="title-bar">
            {leftButton}
            <div className="title">{props.title}</div>
            {rightButton}
        </div>
    )
}
