'use client'

import React, { useEffect, useRef, useState } from 'react';
import moment, { Moment } from 'moment-timezone';
import './MonthNavigator.css';

const SELECTED_MONTH_FONT_SIZE = 16;
const SELECTED_YEAR_FONT_SIZE = 12;
const UNSELECTED_MONTH_FONT_SIZE = 11;
const UNSELECTED_YEAR_FONT_SIZE = 7;
const UNSELECTED_MONTH_OPACITY = 0.75;
const SELECTED_MONTH_OPACITY = 1.0;

/**
 * Font sizes and opacities of the previous, current and next month labels.
 */
interface Appearance {
    currentMonthFontSize: number;       // Font size of the current month
    previousMonthFontSize: number;      // Font size of the previous month
    nextMonthFontSize: number;          // Font size of the next month
    currentYearFontSize: number;        // Font size of the year of the current month
    previousYearFontSize: number;       // Font size of the year of the previous month
    nextYearFontSize: number;           // Font size of the year of the next month
    currentMonthOpacity: number;        // Opacity of the current month
    previousMonthOpacity: number;       // Opacity of the previous month
    nextMonthOpacity: number;           // Opacity of the next month
}

// Appearance when the bar is at rest
const restingAppearance: Appearance = {
    currentMonthFontSize: SELECTED_MONTH_FONT_SIZE,
    previousMonthFontSize: UNSELECTED_MONTH_FONT_SIZE,
    nextMonthFontSize: UNSELECTED_MONTH_FONT_SIZE,
    currentYearFontSize: SELECTED_YEAR_FONT_SIZE,
    previousYearFontSize: UNSELECTED_YEAR_FONT_SIZE,
    nextYearFontSize: UNSELECTED_YEAR_FONT_SIZE,
    currentMonthOpacity: SELECTED_MONTH_OPACITY,
    previousMonthOpacity: UNSELECTED_MONTH_OPACITY,
    nextMonthOpacity: UNSELECTED_MONTH_OPACITY,
}

interface MonthNavigatorProps {
    onMonthChange?: (month: Moment) => void;    // (OPT) called when the month is changed, with the month as a moment
}

/**
 * Touch navigator that allows the user to scroll through months.
 *
 * @param {MonthNavigatorProps} props the props
 */
export default function MonthNavigator(props: MonthNavigatorProps) {

    const [position, setPosition] = useState(0);
    const [currentMonth, setCurrentMonth] = useState<Moment>(() => moment());
    const [appearance, setAppearance] = useState<Appearance>(restingAppearance);
    const [windowWidth, setWindowWidth] = useState(0);

    // Touch tracking
    const touchStartPosition = useRef(0);
    const previousMousePosition = useRef(0);

    // The window is only known in the browser
    useEffect(() => {
        setWindowWidth(window.innerWidth);
    }, [])

    const elWidth = windowWidth / 3;
    const blockWidth = 3 * elWidth;

    // The sensitivity is how much the gesture has to travel (movement width) to scroll the months of "one block"
    const sensitivity = 0.7 * elWidth;

    /**
     * Moves the selector to the given month and notifies the change
     */
    const goToMonth = (month: Moment) => {

        setCurrentMonth(month);
        setPosition(0);
        setAppearance(restingAppearance);

        // Call the onMonthChange callback, if any
        if (props.onMonthChange) props.onMonthChange(month);
    }

    /**
     * Moves the selector to the next month
     */
    const goToNextMonth = () => goToMonth(currentMonth.clone().add(1, 'months'));

    /**
     * Moves the selector to the previous month
     */
    const goToPreviousMonth = () => goToMonth(currentMonth.clone().subtract(1, 'months'));

    /**
     * When the touch event starts
     */
    const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        touchStartPosition.current = event.nativeEvent.changedTouches[0].clientX;
        previousMousePosition.current = touchStartPosition.current;
    }

    /**
     * Follows the movement of the touch. The movement can only follow the x axis
     */
    const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {

        const mousePosition = event.nativeEvent.changedTouches[0].clientX;

        const delta = mousePosition - previousMousePosition.current;
        let movementWidthFromStart = Math.abs(mousePosition - touchStartPosition.current);
        const direction = mousePosition - touchStartPosition.current < 0 ? 'left' : 'right';

        // Reduce or increase the font based on the movement width
        if (movementWidthFromStart > sensitivity) movementWidthFromStart = sensitivity;
        // If I have moved of "sensitivity" => the font should be reduced to the unselectedMonthFontSize
        const monthMaxFontDiff = SELECTED_MONTH_FONT_SIZE - UNSELECTED_MONTH_FONT_SIZE;
        const opacityMaxDiff = SELECTED_MONTH_OPACITY - UNSELECTED_MONTH_OPACITY;
        const fontReduction = movementWidthFromStart * monthMaxFontDiff / sensitivity;
        const opacityReduction = movementWidthFromStart * opacityMaxDiff / sensitivity;

        setPosition(position + delta);
        setAppearance({
            currentMonthFontSize: SELECTED_MONTH_FONT_SIZE - fontReduction,
            previousMonthFontSize: (direction == 'right') ? (UNSELECTED_MONTH_FONT_SIZE + fontReduction) : UNSELECTED_MONTH_FONT_SIZE,
            nextMonthFontSize: (direction == 'left') ? (UNSELECTED_MONTH_FONT_SIZE + fontReduction) : UNSELECTED_MONTH_FONT_SIZE,
            currentYearFontSize: SELECTED_YEAR_FONT_SIZE - fontReduction,
            previousYearFontSize: (direction == 'right') ? (UNSELECTED_YEAR_FONT_SIZE + fontReduction) : UNSELECTED_YEAR_FONT_SIZE,
            nextYearFontSize: (direction == 'left') ? (UNSELECTED_YEAR_FONT_SIZE + fontReduction) : UNSELECTED_YEAR_FONT_SIZE,
            currentMonthOpacity: SELECTED_MONTH_OPACITY - opacityReduction,
            previousMonthOpacity: (direction == 'right') ? (UNSELECTED_MONTH_OPACITY + opacityReduction) : UNSELECTED_MONTH_OPACITY,
            nextMonthOpacity: (direction == 'left') ? (UNSELECTED_MONTH_OPACITY + opacityReduction) : UNSELECTED_MONTH_OPACITY,
        });

        previousMousePosition.current = mousePosition;
    }

    /**
     * When the touch event ends: moves to another month if the gesture traveled far enough
     */
    const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {

        // Where's the cursor?
        const mousePosition = event.nativeEvent.changedTouches[0].clientX;

        // Has the cursor moved past the boundaries of the element?
        const movementWidth = Math.abs(mousePosition - touchStartPosition.current);
        const direction = mousePosition - touchStartPosition.current > 0 ? 'left' : 'right';

        // If the cursor has moved enough, move the whole bar
        const hasMovedFarEnough = movementWidth > sensitivity;

        if (hasMovedFarEnough) {
            // Only when the movement is finished, update the current selected month
            if (direction == 'left') goToPreviousMonth();
            else goToNextMonth();
        }
        // If the cursor hasn't moved enough, bring the bar back to the original position
        else {
            setPosition(0);
            setAppearance(restingAppearance);
        }
    }

    return (
        <div className="month-navigator" style={{ width: windowWidth, overflow: 'hidden' }}>
            <div
                className="block"
                style={{ width: blockWidth, left: position }}
                draggable="true"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >

                <div className="month" style={{ width: elWidth }}>
                    <div className="month-label" style={{ fontSize: appearance.previousMonthFontSize, opacity: appearance.previousMonthOpacity }}>{currentMonth.clone().subtract(1, 'months').format('MMMM')}</div>
                    <div className="year-label" style={{ fontSize: appearance.previousYearFontSize, opacity: appearance.previousMonthOpacity }}>{currentMonth.clone().subtract(1, 'months').format('YYYY')}</div>
                </div>
                <div className="month current" style={{ width: elWidth }}>
                    <div className="month-label" style={{ fontSize: appearance.currentMonthFontSize, opacity: appearance.currentMonthOpacity }}>{currentMonth.clone().format('MMMM')}</div>
                    <div className="year-label" style={{ fontSize: appearance.currentYearFontSize, opacity: appearance.currentMonthOpacity }}>{currentMonth.clone().format('YYYY')}</div>
                </div>
                <div className="month" style={{ width: elWidth }}>
                    <div className="month-label" style={{ fontSize: appearance.nextMonthFontSize, opacity: appearance.nextMonthOpacity }}>{currentMonth.clone().add(1, 'months').format('MMMM')}</div>
                    <div className="year-label" style={{ fontSize: appearance.nextYearFontSize, opacity: appearance.nextMonthOpacity }}>{currentMonth.clone().add(1, 'months').format('YYYY')}</div>
                </div>
            </div>
            <div className="underline-block" style={{ width: blockWidth }}>
                <div style={{ width: elWidth + 90 }}></div>
                <div style={{ width: elWidth }} className="underline"></div>
                <div style={{ width: elWidth + 90 }}></div>
            </div>
        </div>
    )
}
