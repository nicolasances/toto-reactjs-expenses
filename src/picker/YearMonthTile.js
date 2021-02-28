import React, { Component } from 'react';

import './YearMonthTile.css';

/**
 * A tile to display the month and year. 
 * 
 * Requires as props: 
 *  - contentData           :   an object containing:
 *                              - date: the date to display (only year and month are going to be displayed)
 */
export default class YearMonthTile extends Component {

    constructor(props) {
        super(props);

        this.selectedMonthFontSize = 16;
        this.unselectedMonthFontSize = 12;
        this.monthFontDiff = this.selectedMonthFontSize - this.unselectedMonthFontSize;

        this.selectedYearFontSize = 12;
        this.unselectedYearFontSize = 8;
        this.yearFontDiff = 12 - 7;

        this.unselectedOpacity = 0.7;
        this.selectedOpacity = 1.0;
        this.opacityDiff = this.selectedOpacity - this.unselectedOpacity;
    }

    render() {

        let scale = this.props.scale ? this.props.scale : 0;
        let monthFontSize, yearFontSize, opacity;

        if (this.props.selected) {
            monthFontSize = this.selectedMonthFontSize - (this.monthFontDiff * scale);
            yearFontSize = this.selectedYearFontSize - (this.yearFontDiff * scale);
            opacity = this.selectedOpacity - (this.opacityDiff * scale);
        }
        else {
            monthFontSize = this.unselectedMonthFontSize + (this.monthFontDiff * scale);
            yearFontSize = this.unselectedYearFontSize + (this.yearFontDiff * scale);
            opacity = this.unselectedOpacity + (this.opacityDiff * scale);
        }

        return (
            <div className="year-month-tile">
                <div className="month-label" style={{ fontSize: monthFontSize, opacity: opacity }}>
                    {this.props.contentData.date.format('MMMM')}
                </div>
                <div className="year-label" style={{ fontSize: yearFontSize, opacity: opacity }}>
                    {this.props.contentData.date.format('YYYY')}
                </div>
            </div>
        )
    }
}