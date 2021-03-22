import React, { Component } from 'react';

import './MonthTile.css';

/**
 * A tile to display the month. 
 * 
 * Properties: 
 *  - contentData           :   (optional) an object containing:
 *                              - date: the date to display (only the month is going to be displayed)
 *  - selectedFontSize      :   (optional) the font size of the selected month
 *  - unselectedFontSize    :   (optional) the font size of the unselected month
 */
export default class MonthTile extends Component {

    constructor(props) {
        super(props);

        this.selectedMonthFontSize = this.props.selectedFontSize ? this.props.selectedFontSize : 18;
        this.unselectedMonthFontSize = this.props.unselectedFontSize ? this.props.unselectedFontSize : 12;
        this.monthFontDiff = this.selectedMonthFontSize - this.unselectedMonthFontSize;

        this.unselectedOpacity = 0.7;
        this.selectedOpacity = 1.0;
        this.opacityDiff = this.selectedOpacity - this.unselectedOpacity;
    }

    render() {

        let scale = this.props.scale ? this.props.scale : 0;
        let monthFontSize, opacity;

        if (this.props.selected) {
            monthFontSize = this.selectedMonthFontSize - (this.monthFontDiff * scale);
            opacity = this.selectedOpacity - (this.opacityDiff * scale);
        }
        else {
            monthFontSize = this.unselectedMonthFontSize + (this.monthFontDiff * scale);
            opacity = this.unselectedOpacity + (this.opacityDiff * scale);
        }

        return (
            <div className="month-tile">
                <div className="month-label" style={{ fontSize: monthFontSize, opacity: opacity }}>
                    {this.props.contentData.date.format('MMMM')}
                </div>
            </div>
        )
    }
}