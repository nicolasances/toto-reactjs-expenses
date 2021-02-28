import React, { Component } from 'react';

import moment from 'moment-timezone';

import './ScrollPicker.css';

/**
 * This class is a scroll picker that can display a scrollable list of values from which people can choose.
 * 
 * The following properties are supported: 
 * - onChange              :   (optional) a function to be called when the picked value is changed. 
 */
export default class ScrollPicker extends Component {

    constructor(props) {
        super(props);

        this.selectedMonthFontSize = 16;
        this.selectedYearFontSize = 12;
        this.unselectedMonthFontSize = 11;
        this.unselectedYearFontSize = 7;
        this.unselectedMonthOpacity = 0.75;
        this.selectedMonthOpacity = 1.0;

        this.state = {
            position: 0,
            currentMonth: moment(),
            currentMonthFontSize: this.selectedMonthFontSize, 
            previousMonthFontSize: this.unselectedMonthFontSize, 
            nextMonthFontSize: this.unselectedMonthFontSize, 
            currentYearFontSize: this.selectedYearFontSize, 
            previousYearFontSize: this.unselectedYearFontSize, 
            nextYearFontSize: this.unselectedYearFontSize, 
            currentMonthOpacity: this.selectedMonthOpacity, 
            previousMonthOpacity: this.unselectedMonthOpacity, 
            nextMonthOpacity: this.unselectedMonthOpacity
        }

        this.windowWidth = window.innerWidth;

        this.elWidth = this.windowWidth / 3;

        this.blockNum = 3;
        this.blockWidth = this.blockNum * this.elWidth;

        // The sensitivity is how much the gesture has to travel (movement width) to scroll the months of "one block"
        // For example, if the sensitivty = this.elWidth / 2, it means that if the finger moves more than that distance, then the month is going to be scrolled to either the previous or the next, based on the direction of the movement 
        this.sensitivity = 0.7 * this.elWidth;

        // Bindings
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.goToNextMonth = this.goToNextMonth.bind(this);
        this.goToPreviousMonth = this.goToPreviousMonth.bind(this);
    }

    /**
     * Moves the selector to the next month
     */
    goToNextMonth() {

        this.setState(() => ({
            currentMonth: this.state.currentMonth.clone().add(1, 'months'),
            position: 0,
            currentMonthFontSize: this.selectedMonthFontSize,
            previousMonthFontSize: this.unselectedMonthFontSize, 
            nextMonthFontSize: this.unselectedMonthFontSize, 
            currentYearFontSize: this.selectedYearFontSize, 
            previousYearFontSize: this.unselectedYearFontSize, 
            nextYearFontSize: this.unselectedYearFontSize,
            currentMonthOpacity: this.selectedMonthOpacity, 
            previousMonthOpacity: this.unselectedMonthOpacity, 
            nextMonthOpacity: this.unselectedMonthOpacity 
        }), () => {

            // Call the onMonthChange callback, if any
            if (this.props.onMonthChange) this.props.onMonthChange(this.state.currentMonth);
        });
    }

    /**
     * Moves the selector to the previous month
     */
    goToPreviousMonth() {

        this.setState(() => ({
            currentMonth: this.state.currentMonth.clone().subtract(1, 'months'),
            position: 0,
            currentMonthFontSize: this.selectedMonthFontSize, 
            previousMonthFontSize: this.unselectedMonthFontSize, 
            nextMonthFontSize: this.unselectedMonthFontSize, 
            currentYearFontSize: this.selectedYearFontSize, 
            previousYearFontSize: this.unselectedYearFontSize, 
            nextYearFontSize: this.unselectedYearFontSize, 
            currentMonthOpacity: this.selectedMonthOpacity, 
            previousMonthOpacity: this.unselectedMonthOpacity, 
            nextMonthOpacity: this.unselectedMonthOpacity
        }), () => {

            // Call the onMonthChange callback, if any
            if (this.props.onMonthChange) this.props.onMonthChange(this.state.currentMonth);
        });
    }

    /**
     * When the touch even starts
     * 
     * @param {} event 
     */
    onTouchStart(event) {
        this.touchStartPosition = event.nativeEvent.changedTouches[0].clientX;

        // Compute the relative position of the cursor to the element
        // All positions are positive numbers: they are distances
        let left = this.state.position;

        this.cursorRelativePos = {
            left: this.touchStartPosition - left,
            right: left + this.windowWidth - this.touchStartPosition
        }

        this.previousMousePosition = this.touchStartPosition;
    }

    /**
     * Follows the movement of the touch.
     * Note that the movement can only follow the x axis
     * @param {*} event 
     */
    onTouchMove(event) {

        let previousPosition = this.state.position;
        let mousePosition = event.nativeEvent.changedTouches[0].clientX;

        let delta = mousePosition - this.previousMousePosition;
        let movementWidthFromStart = Math.abs(mousePosition - this.touchStartPosition);
        let direction = mousePosition - this.touchStartPosition < 0 ? 'left' : 'right';

        // Reduce or increase the font based on the movement width
        if (movementWidthFromStart > this.sensitivity) movementWidthFromStart = this.sensitivity;
        // If I have moved of "sensitivity" => the font should be reduced to the unselectedMonthFontSize 
        let monthMaxFontDiff = this.selectedMonthFontSize - this.unselectedMonthFontSize;
        let opacityMaxDiff = this.selectedMonthOpacity - this.unselectedMonthOpacity;
        let fontReduction = movementWidthFromStart * monthMaxFontDiff / this.sensitivity;
        let opacityReduction = movementWidthFromStart * opacityMaxDiff / this.sensitivity;

        let currentMonthFontSize = this.selectedMonthFontSize - fontReduction;
        let previousMonthFontSize = (direction == 'right') ? (this.unselectedMonthFontSize + fontReduction) : this.unselectedMonthFontSize;
        let nextMonthFontSize = (direction == 'left') ? (this.unselectedMonthFontSize + fontReduction) : this.unselectedMonthFontSize;
        let currentYearFontSize = this.selectedYearFontSize - fontReduction;
        let previousYearFontSize = (direction == 'right') ? (this.unselectedYearFontSize + fontReduction) : this.unselectedYearFontSize;
        let nextYearFontSize = (direction == 'left') ? (this.unselectedYearFontSize + fontReduction) : this.unselectedYearFontSize;
        let currentMonthOpacity = this.selectedMonthOpacity - opacityReduction;
        let previousMonthOpacity = (direction == 'right') ? (this.unselectedMonthOpacity + opacityReduction) : this.unselectedMonthOpacity;
        let nextMonthOpacity = (direction == 'left') ? (this.unselectedMonthOpacity + opacityReduction) : this.unselectedMonthOpacity;

        this.setState({
            position: previousPosition + delta,
            currentMonthFontSize: currentMonthFontSize, 
            previousMonthFontSize:  previousMonthFontSize, 
            nextMonthFontSize: nextMonthFontSize, 
            currentYearFontSize: currentYearFontSize, 
            previousYearFontSize: previousYearFontSize, 
            nextYearFontSize: nextYearFontSize, 
            currentMonthOpacity: currentMonthOpacity, 
            previousMonthOpacity: previousMonthOpacity, 
            nextMonthOpacity: nextMonthOpacity
        })

        this.previousMousePosition = mousePosition;
    }

    onTouchEnd(event) {

        // Where's the cursor? 
        let mousePosition = event.nativeEvent.changedTouches[0].clientX;

        // Has the cursor moved past the boundaries of the element? 
        // This is the same as saying that the mouse has moved more than half the element width
        let movementWidth = Math.abs(mousePosition - this.touchStartPosition);
        let direction = mousePosition - this.touchStartPosition > 0 ? 'left' : 'right';

        // If the cursor has moved enough, move the whole bar
        let hasMovedFarEnough = movementWidth > this.sensitivity;

        if (hasMovedFarEnough) {
            if (direction == 'left') {
                // Move the bar left "1 block"
                this.setState({ position: this.elWidth }, () => {
                    // Only when the movement is finished, update the current selected month 
                    this.goToPreviousMonth();
                });
            }
            else {
                // Move the bar right "1 block"
                this.setState({ position: -this.elWidth }, () => {
                    // Only when the movement is finished, update the current selected month 
                    this.goToNextMonth();
                });
            }
        }
        // If the cursor hasn't moved enough, bring the bar back to the original position
        else this.setState({
            position: 0,
            currentMonthFontSize: this.selectedMonthFontSize,
            previousMonthFontSize: this.unselectedMonthFontSize, 
            nextMonthFontSize: this.unselectedMonthFontSize,
            currentYearFontSize: this.selectedYearFontSize, 
            previousYearFontSize: this.unselectedYearFontSize, 
            nextYearFontSize: this.unselectedYearFontSize, 
            currentMonthOpacity: this.selectedMonthOpacity, 
            previousMonthOpacity: this.unselectedMonthOpacity, 
            nextMonthOpacity: this.unselectedMonthOpacity
        })


    }

    render() {
        return (
            <div className="month-navigator" style={{ width: this.windowWidth, overflow: 'hidden' }}>
                <div
                    className="block"
                    style={{ width: this.blockWidth, left: this.state.position }}
                    draggable="true"
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                >

                    <div className="month" style={{ width: this.elWidth }}>
                        <div className="month-label" style={{ fontSize: this.state.previousMonthFontSize, opacity: this.state.previousMonthOpacity }}>{this.state.currentMonth.clone().subtract(1, 'months').format('MMMM')}</div>
                        <div className="year-label" style={{ fontSize: this.state.previousYearFontSize, opacity: this.state.previousMonthOpacity }}>{this.state.currentMonth.clone().subtract(1, 'months').format('YYYY')}</div>
                    </div>
                    <div className="month current" style={{ width: this.elWidth }}>
                        <div className="month-label" style={{ fontSize: this.state.currentMonthFontSize, opacity: this.state.currentMonthOpacity }}>{this.state.currentMonth.clone().format('MMMM')}</div>
                        <div className="year-label" style={{ fontSize: this.state.currentYearFontSize, opacity: this.state.currentMonthOpacity}}>{this.state.currentMonth.clone().format('YYYY')}</div>
                    </div>
                    <div className="month" style={{ width: this.elWidth }}>
                        <div className="month-label" style={{ fontSize: this.state.nextMonthFontSize, opacity: this.state.nextMonthOpacity }}>{this.state.currentMonth.clone().add(1, 'months').format('MMMM')}</div>
                        <div className="year-label" style={{ fontSize: this.state.nextYearFontSize, opacity: this.state.nextMonthOpacity }}>{this.state.currentMonth.clone().add(1, 'months').format('YYYY')}</div>
                    </div>
                </div>
                <div className="underline-block" style={{ width: this.blockWidth }}>
                    <div style={{ width: this.elWidth + 90 }}></div>
                    <div style={{ width: this.elWidth }} className="underline"></div>
                    <div style={{ width: this.elWidth + 90 }}></div>
                </div>
            </div>
        )
    }
}