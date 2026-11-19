'use client'

import { ScrollPickerTileProps } from './ScrollPicker';
import './MonthTile.css';

interface MonthTileProps extends ScrollPickerTileProps {
    selectedFontSize?: number;      // (optional, default 18) the font size of the selected month
    unselectedFontSize?: number;    // (optional, default 12) the font size of the unselected month
}

/**
 * A tile to display the month.
 *
 * @param {MonthTileProps} props the props (contentData.date is the date to display; only the month is displayed)
 */
export default function MonthTile(props: MonthTileProps) {

    const selectedMonthFontSize = props.selectedFontSize ? props.selectedFontSize : 18;
    const unselectedMonthFontSize = props.unselectedFontSize ? props.unselectedFontSize : 12;
    const monthFontDiff = selectedMonthFontSize - unselectedMonthFontSize;

    const unselectedOpacity = 0.7;
    const selectedOpacity = 1.0;
    const opacityDiff = selectedOpacity - unselectedOpacity;

    const scale = props.scale ? props.scale : 0;
    let monthFontSize, opacity;

    if (props.selected) {
        monthFontSize = selectedMonthFontSize - (monthFontDiff * scale);
        opacity = selectedOpacity - (opacityDiff * scale);
    }
    else {
        monthFontSize = unselectedMonthFontSize + (monthFontDiff * scale);
        opacity = unselectedOpacity + (opacityDiff * scale);
    }

    return (
        <div className="month-tile">
            <div className="month-label" style={{ fontSize: monthFontSize, opacity: opacity }}>
                {props.contentData?.date.format('MMMM')}
            </div>
        </div>
    )
}
