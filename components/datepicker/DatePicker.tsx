'use client'

import moment, { Moment } from 'moment-timezone';
import { useRef, useState } from 'react';
import DayPicker from './DayPicker';
import MonthTile from '@/components/picker/MonthTile';
import ScrollPicker from '@/components/picker/ScrollPicker';
import YearTile from '@/components/picker/YearTile';
import TotoIconButton from '@/components/TotoIconButton';
import './DatePicker.css';

interface DatePickerProps {
    initialValue?: Moment;                  // The initially selected date (default: now)
    onConfirm?: (date: Moment) => void;     // Called with the selected date when the user picks a day
    onCancel?: () => void;                  // Called when the user closes the picker
}

/**
 * A date picker: year and month scroll pickers plus a calendar grid to pick the day.
 *
 * @param {DatePickerProps} props the props
 */
export default function DatePicker(props: DatePickerProps) {

    const [initialValue] = useState<Moment>(() => props.initialValue ?? moment())

    const [date, setDate] = useState<Moment>(initialValue)
    const [year, setYear] = useState(initialValue.format('YYYY'))
    const [month, setMonth] = useState(initialValue.format('MM'))

    // Keeps the latest props, for the delayed confirmation
    const propsRef = useRef(props)
    propsRef.current = props

    /**
     * Confirms the selected date
     */
    const confirm = (selected: Moment) => {
        if (propsRef.current.onConfirm) propsRef.current.onConfirm(selected);
    }

    /**
     * Closes the picker without confirming
     */
    const cancel = () => {
        if (props.onCancel) props.onCancel();
    }

    /**
     * When a day is picked: stores it and confirms shortly after
     */
    const onChangeDate = (selected: Moment) => {
        setDate(selected)
        setTimeout(() => confirm(selected), 50);
    }

    /**
     * When the year scroll picker changes
     */
    const onChangeYear = (selected: Moment) => {
        setYear(selected.format('YYYY'))
    }

    /**
     * When the month scroll picker changes
     */
    const onChangeMonth = (selected: Moment) => {
        setMonth(selected.format('MM'))
    }

    return (
        <div className="date-picker screen">
            <div className="header">
                <div className="label">Selected date</div>
                <div className="value">{date.format("DD MMMM YYYY")}</div>
            </div>
            <div className="body">
                <div>
                    <ScrollPicker
                        tile={<YearTile selectedFontSize={14} unselectedFontSize={10} />}
                        defaultValue={date}
                        previousValue={(currentValue) => currentValue.clone().subtract(1, 'years')}
                        nextValue={(currentValue) => currentValue.clone().add(1, 'years')}
                        onSelectionChange={onChangeYear}
                        height={40}
                        underline={false}
                    />
                </div>
                <div style={{ marginBottom: 12, marginTop: 12 }}>
                    <ScrollPicker
                        tile={<MonthTile selectedFontSize={16} unselectedFontSize={12} />}
                        defaultValue={date}
                        previousValue={(currentValue) => currentValue.clone().subtract(1, 'months')}
                        nextValue={(currentValue) => currentValue.clone().add(1, 'months')}
                        onSelectionChange={onChangeMonth}
                        height={50}
                        underline={false}
                        backgroundColor="#007c91"
                    />
                </div>
                <DayPicker year={year} month={month} defaultValue={date} onDateSelected={onChangeDate} />
            </div>
            <div className="footer">
                <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image="/images/close.svg" onPress={cancel} /></div>
            </div>
        </div>
    )
}
