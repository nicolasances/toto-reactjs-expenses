'use client'

import { useEffect, useRef, useState } from 'react';
import moment, { Moment } from 'moment-timezone';
import Popup from 'reactjs-popup';
import DatePicker from '@/components/datepicker/DatePicker';
import './DateSelector.css';

interface DateSelectorProps {
    initialValue?: Moment;                          // (OPT) the initial date
    initialValueLoader?: () => Promise<Moment>;     // (OPT) loads the initial date asynchronously
    onDateChange?: (date: Moment) => void;          // (OPT) called with the date (as a moment) upon change
}

/**
 * Form component for the date selection.
 *
 * @param {DateSelectorProps} props the props
 */
export default function DateSelector(props: DateSelectorProps) {

    const [date, setDate] = useState<Moment | undefined>(props.initialValue);
    const [openHelpPopup, setOpenHelpPopup] = useState(false);

    // Keeps the loader given at mount, which is only used once
    const loaderRef = useRef(props.initialValueLoader);

    useEffect(() => {
        // Load the initial value if an async loader is provided
        if (loaderRef.current) loaderRef.current().then((data) => {
            setDate(data);
        })
    }, [])

    /**
     * React to a change of date
     */
    const onDateSelected = (selected: Moment) => {

        setOpenHelpPopup(false);
        setDate(selected);

        // Callback if any
        if (props.onDateChange) props.onDateChange(selected);
    }

    const value = date ? date : (props.initialValue ? props.initialValue : moment());

    return (
        <div className="date-selector" onClick={() => setOpenHelpPopup(true)}>
            <div className="date-display">
                <div className="year">{value.format('YYYY')}</div>
                <div className="day">{value.format('DD')}</div>
                <div className="month">{value.format('MMMM')}</div>
            </div>

            <Popup
                on='click'
                open={openHelpPopup}
                overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                contentStyle={{ padding: 0, backgroundColor: '#00acc1', border: 'none' }}
                arrow={false}
            >

                <DatePicker
                    initialValue={value}
                    onCancel={() => { setOpenHelpPopup(false) }}
                    onConfirm={onDateSelected}
                />

            </Popup>
        </div>
    )
}
