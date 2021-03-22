import React, { Component } from 'react';

import moment from 'moment-timezone';

import './ScrollPicker.css';
import YearMonthTile from '../picker/YearMonthTile';
/**
 * This class is a scroll picker that can display a scrollable list of values from which people can choose.
 * 
 * The following properties are supported: 
 * - tile                           :   (MANDATORY) a React component that will serve as prototype for each of the tiles
 * - defaultValue                   :   (MANDATORY) the value (content) of the default selected tile. 
 *                                      This is an object that is going to be interpreted by the tile cloned from the one you provided in the "tile" field, 
 *                                      so it can be anything as long as it's understood by the provided tile prototype. 
 *                                      This value will be provided as "contentData" to the cloned instances of the prototype.
 * - previousValue                  :   (MANDATORY) a function that, given the currentValue, generates the value that should come before that in the picker
 * - nextValue                      :   (MANDATORY) a function that, given the currentValue, generates the value that should come after that in the picker
 * - onSelectionChange              :   (optional) a function to be called when the picked value is changed. 
 *                                      Will receive a moment() object
 * - height                         :   (optional, default 60) the height of the component
 * - underline                      :   (optional, default true) show a line under the selected component
 * 
 * An example of usage: a scroll picker that displays a selector for month and year
 *      <ScrollPicker 
 *          tile={<YearMonthTile/>}
 *          defaultValue={moment()}
 *          previousValue={(currentValue) => currentValue.clone().subtract(1, 'months')}
 *          nextValue={(currentValue) => currentValue.clone().add(1, 'months')}
 *      />
 */
export default class ScrollPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            position: 0,
            currentValue: this.props.defaultValue
        }

        this.windowWidth = window.innerWidth;

        this.elWidth = this.windowWidth / 3;

        this.blockNum = 3;
        this.blockWidth = this.blockNum * this.elWidth;

        // The sensitivity is how much the gesture has to travel (movement width) to scroll the months of "one block"
        // For example, if the sensitivty = this.elWidth / 2, it means that if the finger moves more than that distance, then the month is going to be scrolled to either the previous or the next, based on the direction of the movement 
        this.sensitivity = 0.5 * this.elWidth;

        // Bindings
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.goToNextTile = this.goToNextTile.bind(this);
        this.goToPreviousTile = this.goToPreviousTile.bind(this);
        this.bounceBackToOrigin = this.bounceBackToOrigin.bind(this);
        this.animateTowardsPosition = this.animateTowardsPosition.bind(this);
    }

    animateTowardsPosition(containerPosition, targetContainerPosition, onComplete) {
        let increment = 10;
        let frameSpeed = 10;
        let newPosition;

        // Make sure that the object doesn't start oscillating around the target position
        if (containerPosition < targetContainerPosition && containerPosition + increment > targetContainerPosition) newPosition = targetContainerPosition;
        else if (containerPosition > targetContainerPosition && containerPosition - increment < targetContainerPosition) newPosition = targetContainerPosition;
        else newPosition = containerPosition < targetContainerPosition ? containerPosition + increment : containerPosition - increment;

        if (newPosition == targetContainerPosition) {

            this.setState({
                position: targetContainerPosition
            }, onComplete);
        }
        else {
            this.setState({
                position: newPosition
            });

            // Keep going towards the target position
            setTimeout(() => { this.animateTowardsPosition(newPosition, targetContainerPosition, onComplete) }, frameSpeed);
        }
    }

    /**
     * Moves the selector to the next month
     */
    goToNextTile(containerPosition) {

        this.animateTowardsPosition(containerPosition, -this.elWidth, () => {

            this.setState(() => ({
                currentValue: this.props.nextValue(this.state.currentValue),
                position: 0,
                currentTileScale: null,
                previousTileScale: null,
                nextTileScale: null
            }), () => {

                // Call the onSelectionChange callback, if any
                if (this.props.onSelectionChange) this.props.onSelectionChange(this.state.currentValue);
            });
        })

    }

    /**
     * Moves the selector to the previous month
     */
    goToPreviousTile(containerPosition) {

        this.animateTowardsPosition(containerPosition, this.elWidth, () => {

            this.setState({
                currentValue: this.props.previousValue(this.state.currentValue),
                position: 0,
                currentTileScale: null,
                previousTileScale: null,
                nextTileScale: null
            }, () => {

                // Call the onSelectionChange callback, if any
                if (this.props.onSelectionChange) this.props.onSelectionChange(this.state.currentValue);

            })
        })

    }

    /**
     * This function bounces "back" the slider to its original position, to implement the effect of the user abandoning the gesture before it reached 
     * far enough to move to the next tile
     * 
     * @param {int} containerPosition 
     */
    bounceBackToOrigin(containerPosition) {

        this.animateTowardsPosition(containerPosition, 0, () => {

            this.setState({
                currentTileScale: null,
                previousTileScale: null,
                nextTileScale: null
            });
        })

    }

    /**
     * When the touch even starts
     * 
     * @param {} event 
     */
    onTouchStart(event) {
        // Save the position of the initial touch (cursor)
        this.cursorStartPosition = event.nativeEvent.changedTouches[0].clientX;

        // Compute the relative position of the cursor to the element
        // All positions are positive numbers: they are distances
        this.cursorRelativePos = {
            left: this.cursorStartPosition - this.state.position, // this.state.position is the position of the top left corner of the tile
            right: this.state.position + this.windowWidth - this.cursorStartPosition
        }

        // Save the current cursor position as the previous position
        this.previousCursorPosition = this.cursorStartPosition;
    }

    /**
     * Follows the movement of the touch.
     * Note that the movement can only follow the x axis
     * @param {*} event 
     */
    onTouchMove(event) {

        // Save the previous position of the tile
        let previousPosition = this.state.position;

        // Get the new position of the cursor
        let cursorPosition = event.nativeEvent.changedTouches[0].clientX;

        let delta = cursorPosition - this.previousCursorPosition;
        let movementWidthFromStart = Math.abs(cursorPosition - this.cursorStartPosition);
        let direction = cursorPosition - this.cursorStartPosition < 0 ? 'left' : 'right';

        // Reduce or increase the font based on the movement width
        if (movementWidthFromStart > this.sensitivity) movementWidthFromStart = this.sensitivity;

        let scale = movementWidthFromStart / this.sensitivity;

        this.setState({
            position: previousPosition + delta,
            currentTileScale: scale,
            previousTileScale: (direction == 'right') ? scale : null,
            nextTileScale: (direction == 'left') ? scale : null
        })

        this.previousCursorPosition = cursorPosition;
    }

    onTouchEnd(event) {

        // Where's the cursor? 
        let mousePosition = event.nativeEvent.changedTouches[0].clientX;

        // Has the cursor moved past the boundaries of the element? 
        // This is the same as saying that the mouse has moved more than half the element width
        let movementWidth = Math.abs(mousePosition - this.cursorStartPosition);
        let direction = mousePosition - this.cursorStartPosition > 0 ? 'left' : 'right';

        // If the cursor has moved enough, move the whole bar
        let hasMovedFarEnough = movementWidth > this.sensitivity;

        if (hasMovedFarEnough) {
            if (direction == 'left') {
                // Move the bar left "1 block"
                this.goToPreviousTile(this.state.position);
            }
            else {
                // Move the bar right "1 block"
                this.goToNextTile(this.state.position);
            }
        }
        // If the cursor hasn't moved enough, bring the bar back to the original position
        else this.bounceBackToOrigin(this.state.position)


    }

    render() {

        let height = this.props.height ? this.props.height : 60;

        let previousTile = React.cloneElement(this.props.tile, {
            contentData: { date: this.props.previousValue(this.state.currentValue) },
            selected: false,
            scale: this.state.previousTileScale
        });
        let currentTile = React.cloneElement(this.props.tile, {
            contentData: { date: this.state.currentValue.clone() },
            selected: true,
            scale: this.state.currentTileScale
        });
        let nextTile = React.cloneElement(this.props.tile, {
            contentData: { date: this.props.nextValue(this.state.currentValue) },
            selected: false,
            scale: this.state.nextTileScale
        });

        // Underline
        let underline = (
            <div className="underline-container" style={{ width: this.blockWidth }}>
                <div style={{ width: this.elWidth + 90 }}></div>
                <div style={{ width: this.elWidth }} className="underline"></div>
                <div style={{ width: this.elWidth + 90 }}></div>
            </div>
        )
        if (this.props.underline == false) underline = (<div></div>);

        // Styles
        let backgroundColor = "transparent";
        if (this.props.backgroundColor) backgroundColor = this.props.backgroundColor;

        return (
            <div className="scroll-picker" style={{ width: this.windowWidth, overflow: 'hidden', backgroundColor: backgroundColor }}>
                <div
                    className="tiles-container"
                    style={{ width: this.blockWidth, left: this.state.position, height: height }}
                    draggable="true"
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                >

                    <div className="tile" style={{ width: this.elWidth }}>
                        {previousTile}
                    </div>
                    <div className="tile" style={{ width: this.elWidth }}>
                        {currentTile}
                    </div>
                    <div className="tile" style={{ width: this.elWidth }}>
                        {nextTile}
                    </div>

                </div>

                {underline}

            </div>
        )
    }
}