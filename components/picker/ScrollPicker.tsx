'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Moment } from 'moment-timezone';
import './ScrollPicker.css';

/**
 * Props that ScrollPicker injects (cloning the prototype) into each of its tiles
 */
export interface ScrollPickerTileProps {
    contentData?: { date: Moment };     // The content of the tile: the date to display
    selected?: boolean;                 // True if this is the currently selected tile
    scale?: number | null;              // How far (0 to 1) the tile is into the transition between selected and unselected
}

interface ScrollPickerProps {
    tile: React.ReactElement<ScrollPickerTileProps>;                // (MANDATORY) a React element that serves as prototype for each of the tiles
    defaultValue: Moment;                                           // (MANDATORY) the value (content) of the default selected tile, provided as "contentData.date" to the tiles
    previousValue: (currentValue: Moment) => Moment;                // (MANDATORY) given the current value, generates the value that comes before it
    nextValue: (currentValue: Moment) => Moment;                    // (MANDATORY) given the current value, generates the value that comes after it
    onSelectionChange?: (value: Moment) => void;                    // (optional) called when the picked value is changed
    height?: number;                                                // (optional, default 60) the height of the component
    underline?: boolean;                                            // (optional, default true) show a line under the selected component
    backgroundColor?: string;                                       // (optional, default transparent) background color of the picker
}

/**
 * A scroll picker that displays a scrollable list of values from which people can choose.
 *
 * Example: a scroll picker that displays a selector for month and year
 *      <ScrollPicker
 *          tile={<YearMonthTile/>}
 *          defaultValue={moment()}
 *          previousValue={(currentValue) => currentValue.clone().subtract(1, 'months')}
 *          nextValue={(currentValue) => currentValue.clone().add(1, 'months')}
 *      />
 *
 * @param {ScrollPickerProps} props the props
 */
export default function ScrollPicker(props: ScrollPickerProps) {

    const [position, setPosition] = useState(0)
    const [currentValue, setCurrentValue] = useState<Moment>(props.defaultValue)
    const [currentTileScale, setCurrentTileScale] = useState<number | null>(null)
    const [previousTileScale, setPreviousTileScale] = useState<number | null>(null)
    const [nextTileScale, setNextTileScale] = useState<number | null>(null)
    const [windowWidth, setWindowWidth] = useState(0)

    // Always-fresh references, for the callbacks that outlive a render (timeouts)
    const propsRef = useRef(props)
    propsRef.current = props
    const currentValueRef = useRef<Moment>(props.defaultValue)

    // Touch gesture data
    const cursorStartPosition = useRef(0)
    const previousCursorPosition = useRef(0)

    useEffect(() => { setWindowWidth(window.innerWidth) }, [])

    const elWidth = windowWidth / 3;

    const blockNum = 3;
    const blockWidth = blockNum * elWidth;

    // The sensitivity is how much the gesture has to travel (movement width) to scroll the months of "one block"
    // For example, if the sensitivty = elWidth / 2, it means that if the finger moves more than that distance, then the month is going to be scrolled to either the previous or the next, based on the direction of the movement
    const sensitivity = 0.5 * elWidth;

    /**
     * Animates the container from a position towards a target position, then calls onComplete
     */
    const animateTowardsPosition = (containerPosition: number, targetContainerPosition: number, onComplete: () => void) => {
        const increment = 10;
        const frameSpeed = 10;
        let newPosition;

        // Make sure that the object doesn't start oscillating around the target position
        if (containerPosition < targetContainerPosition && containerPosition + increment > targetContainerPosition) newPosition = targetContainerPosition;
        else if (containerPosition > targetContainerPosition && containerPosition - increment < targetContainerPosition) newPosition = targetContainerPosition;
        else newPosition = containerPosition < targetContainerPosition ? containerPosition + increment : containerPosition - increment;

        setPosition(newPosition)

        if (newPosition == targetContainerPosition) {
            onComplete()
        }
        else {
            // Keep going towards the target position
            setTimeout(() => { animateTowardsPosition(newPosition, targetContainerPosition, onComplete) }, frameSpeed);
        }
    }

    /**
     * Resets the scales of the tiles
     */
    const resetScales = () => {
        setCurrentTileScale(null)
        setPreviousTileScale(null)
        setNextTileScale(null)
    }

    /**
     * Moves to the given value, resets the position and notifies the listener
     */
    const selectValue = (value: Moment) => {

        currentValueRef.current = value
        setCurrentValue(value)
        setPosition(0)
        resetScales()

        // Call the onSelectionChange callback, if any
        if (propsRef.current.onSelectionChange) propsRef.current.onSelectionChange(value);
    }

    /**
     * Moves the selector to the next month
     */
    const goToNextTile = (containerPosition: number) => {

        animateTowardsPosition(containerPosition, -elWidth, () => {
            selectValue(propsRef.current.nextValue(currentValueRef.current))
        })

    }

    /**
     * Moves the selector to the previous month
     */
    const goToPreviousTile = (containerPosition: number) => {

        animateTowardsPosition(containerPosition, elWidth, () => {
            selectValue(propsRef.current.previousValue(currentValueRef.current))
        })

    }

    /**
     * Bounces "back" the slider to its original position, to implement the effect of the user abandoning the gesture before it reached
     * far enough to move to the next tile
     */
    const bounceBackToOrigin = (containerPosition: number) => {

        animateTowardsPosition(containerPosition, 0, () => {
            resetScales()
        })

    }

    /**
     * When the touch event starts
     */
    const onTouchStart = (event: React.TouchEvent) => {
        // Save the position of the initial touch (cursor)
        cursorStartPosition.current = event.nativeEvent.changedTouches[0].clientX;

        // Save the current cursor position as the previous position
        previousCursorPosition.current = cursorStartPosition.current;
    }

    /**
     * Follows the movement of the touch.
     * Note that the movement can only follow the x axis
     */
    const onTouchMove = (event: React.TouchEvent) => {

        // Save the previous position of the tile
        const previousPosition = position;

        // Get the new position of the cursor
        const cursorPosition = event.nativeEvent.changedTouches[0].clientX;

        const delta = cursorPosition - previousCursorPosition.current;
        let movementWidthFromStart = Math.abs(cursorPosition - cursorStartPosition.current);
        const direction = cursorPosition - cursorStartPosition.current < 0 ? 'left' : 'right';

        // Reduce or increase the font based on the movement width
        if (movementWidthFromStart > sensitivity) movementWidthFromStart = sensitivity;

        const scale = movementWidthFromStart / sensitivity;

        setPosition(previousPosition + delta)
        setCurrentTileScale(scale)
        setPreviousTileScale(direction == 'right' ? scale : null)
        setNextTileScale(direction == 'left' ? scale : null)

        previousCursorPosition.current = cursorPosition;
    }

    /**
     * When the touch ends
     */
    const onTouchEnd = (event: React.TouchEvent) => {

        // Where's the cursor?
        const mousePosition = event.nativeEvent.changedTouches[0].clientX;

        // Has the cursor moved past the boundaries of the element?
        // This is the same as saying that the mouse has moved more than half the element width
        const movementWidth = Math.abs(mousePosition - cursorStartPosition.current);
        const direction = mousePosition - cursorStartPosition.current > 0 ? 'left' : 'right';

        // If the cursor has moved enough, move the whole bar
        const hasMovedFarEnough = movementWidth > sensitivity;

        if (hasMovedFarEnough) {
            if (direction == 'left') {
                // Move the bar left "1 block"
                goToPreviousTile(position);
            }
            else {
                // Move the bar right "1 block"
                goToNextTile(position);
            }
        }
        // If the cursor hasn't moved enough, bring the bar back to the original position
        else bounceBackToOrigin(position)

    }

    const height = props.height ? props.height : 60;

    const previousTile = React.cloneElement(props.tile, {
        contentData: { date: props.previousValue(currentValue) },
        selected: false,
        scale: previousTileScale
    });
    const currentTile = React.cloneElement(props.tile, {
        contentData: { date: currentValue.clone() },
        selected: true,
        scale: currentTileScale
    });
    const nextTile = React.cloneElement(props.tile, {
        contentData: { date: props.nextValue(currentValue) },
        selected: false,
        scale: nextTileScale
    });

    // Underline
    let underline = (
        <div className="underline-container" style={{ width: blockWidth }}>
            <div style={{ width: elWidth + 90 }}></div>
            <div style={{ width: elWidth }} className="underline"></div>
            <div style={{ width: elWidth + 90 }}></div>
        </div>
    )
    if (props.underline == false) underline = (<div></div>);

    // Styles
    let backgroundColor = "transparent";
    if (props.backgroundColor) backgroundColor = props.backgroundColor;

    return (
        <div className="scroll-picker" style={{ width: windowWidth, overflow: 'hidden', backgroundColor: backgroundColor }}>
            <div
                className="tiles-container"
                style={{ width: blockWidth, left: position, height: height }}
                draggable="true"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >

                <div className="tile" style={{ width: elWidth }}>
                    {previousTile}
                </div>
                <div className="tile" style={{ width: elWidth }}>
                    {currentTile}
                </div>
                <div className="tile" style={{ width: elWidth }}>
                    {nextTile}
                </div>

            </div>

            {underline}

        </div>
    )
}
