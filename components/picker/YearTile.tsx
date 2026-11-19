'use client'

import { ScrollPickerTileProps } from './ScrollPicker';
import './YearTile.css';

interface YearTileProps extends ScrollPickerTileProps {
    selectedFontSize?: number;      // (optional, default 18) the font size of the selected year
    unselectedFontSize?: number;    // (optional, default 12) the font size of the unselected year
}

/**
 * A tile to display the year.
 *
 * @param {YearTileProps} props the props (contentData.date is the date to display; only the year is displayed)
 */
export default function YearTile(props: YearTileProps) {

    const selectedYearFontSize = props.selectedFontSize ? props.selectedFontSize : 18;
    const unselectedYearFontSize = props.unselectedFontSize ? props.unselectedFontSize : 12;
    const yearFontDiff = selectedYearFontSize - unselectedYearFontSize;

    const unselectedOpacity = 0.7;
    const selectedOpacity = 1.0;
    const opacityDiff = selectedOpacity - unselectedOpacity;

    const scale = props.scale ? props.scale : 0;
    let yearFontSize, opacity;

    if (props.selected) {
        yearFontSize = selectedYearFontSize - (yearFontDiff * scale);
        opacity = selectedOpacity - (opacityDiff * scale);
    }
    else {
        yearFontSize = unselectedYearFontSize + (yearFontDiff * scale);
        opacity = unselectedOpacity + (opacityDiff * scale);
    }

    return (
        <div className="year-tile">
            <div className="year-label" style={{ fontSize: yearFontSize, opacity: opacity }}>
                {props.contentData?.date.format('YYYY')}
            </div>
        </div>
    )
}
