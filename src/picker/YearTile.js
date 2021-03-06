import React, { Component } from 'react';

import './YearTile.css';

/**
 * A tile to display the year. 
 * 
 * Requires as props: 
 *  - contentData           :   an object containing:
 *                              - date: the date to display (only year is going to be displayed)
 *  - selectedFontSize      :   (optional) the font size of the selected month
 *  - unselectedFontSize    :   (optional) the font size of the unselected month
 */
export default class YearTile extends Component {

    constructor(props) {
        super(props);

        this.selectedYearFontSize = this.props.selectedFontSize ? this.props.selectedFontSize : 18;
        this.unselectedYearFontSize = this.props.unselectedFontSize ? this.props.unselectedFontSize : 12;
        this.yearFontDiff = this.selectedYearFontSize - this.unselectedYearFontSize;

        this.unselectedOpacity = 0.7;
        this.selectedOpacity = 1.0;
        this.opacityDiff = this.selectedOpacity - this.unselectedOpacity;
    }

    render() {

        let scale = this.props.scale ? this.props.scale : 0;
        let yearFontSize, opacity;

        if (this.props.selected) {
            yearFontSize = this.selectedYearFontSize - (this.yearFontDiff * scale);
            opacity = this.selectedOpacity - (this.opacityDiff * scale);
        }
        else {
            yearFontSize = this.unselectedYearFontSize + (this.yearFontDiff * scale);
            opacity = this.unselectedOpacity + (this.opacityDiff * scale);
        }

        return (
            <div className="year-tile">
                <div className="year-label" style={{ fontSize: yearFontSize, opacity: opacity }}>
                    {this.props.contentData.date.format('YYYY')}
                </div>
            </div>
        )
    }
}