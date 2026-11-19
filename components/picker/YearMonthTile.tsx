'use client'

import { ScrollPickerTileProps } from './ScrollPicker';
import './YearMonthTile.css';

/**
 * A tile to display the month and year.
 *
 * @param {ScrollPickerTileProps} props the props (contentData.date is the date to display; only year and month are displayed)
 */
export default function YearMonthTile(props: ScrollPickerTileProps) {

    const selectedMonthFontSize = 16;
    const unselectedMonthFontSize = 12;
    const monthFontDiff = selectedMonthFontSize - unselectedMonthFontSize;

    const selectedYearFontSize = 12;
    const unselectedYearFontSize = 8;
    const yearFontDiff = 12 - 7;

    const unselectedOpacity = 0.7;
    const selectedOpacity = 1.0;
    const opacityDiff = selectedOpacity - unselectedOpacity;

    const scale = props.scale ? props.scale : 0;
    let monthFontSize, yearFontSize, opacity;

    if (props.selected) {
        monthFontSize = selectedMonthFontSize - (monthFontDiff * scale);
        yearFontSize = selectedYearFontSize - (yearFontDiff * scale);
        opacity = selectedOpacity - (opacityDiff * scale);
    }
    else {
        monthFontSize = unselectedMonthFontSize + (monthFontDiff * scale);
        yearFontSize = unselectedYearFontSize + (yearFontDiff * scale);
        opacity = unselectedOpacity + (opacityDiff * scale);
    }

    return (
        <div className="year-month-tile">
            <div className="month-label" style={{ fontSize: monthFontSize, opacity: opacity }}>
                {props.contentData?.date.format('MMMM')}
            </div>
            <div className="year-label" style={{ fontSize: yearFontSize, opacity: opacity }}>
                {props.contentData?.date.format('YYYY')}
            </div>
        </div>
    )
}
