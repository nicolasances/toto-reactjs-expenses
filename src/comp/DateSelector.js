import React, { Component } from 'react';
import moment from 'moment-timezone';
import './DateSelector.css';
import Popup from 'reactjs-popup';
import DatePicker from './datepicker/DatePicker';

/**
 * Form component for the date selection. 
 * 
 * Parameters: 
 * 
 *  - initialValue          :   (OPTIONAL) the initial value for the input element, if any
 *  - initialValueLoader    :   (OPT) a function that will load the initial value. 
 *  - onDateChange          :   (OPTIONAL) callback that will provide the date upon change. The date
 *                              The date will be provided as a moment object          
 */
export default class DateSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            date: this.props.initialValue
        }

        this.selectDate = this.selectDate.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
    }

    componentDidMount() {
        // Load the initial value if an async loader is provided
        if (this.props.initialValueLoader) this.props.initialValueLoader().then((data) => {
            this.setState({ date: data });
        })
    }

    /**
     * React to a change of date
     * @param {moment} date The selected date
     */
    onDateSelected(date) {

        this.setState({
            openHelpPopup: false,
            date: date
        });

        // Callback if any
        if (this.props.onDateChange) this.props.onDateChange(date);
    }

    selectDate() {
        this.setState({
            openHelpPopup: true
        })
    }

    render() {

        let value = this.state.date ? this.state.date : (this.props.initialValue ? this.props.initialValue : moment());

        return (
            <div className="date-selector" onClick={this.selectDate}>
                <div className="date-display">
                    <div className="year">{value.format('YYYY')}</div>
                    <div className="day">{value.format('DD')}</div>
                    <div className="month">{value.format('MMMM')}</div>
                </div>

                <Popup
                    on='click'
                    open={this.state.openHelpPopup}
                    overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    contentStyle={{ padding: 0, backgroundColor: '#00acc1', border: 'none' }}
                    arrow={false}
                >

                    <DatePicker
                        onCancel={() => { this.setState({ openHelpPopup: false }) }}
                        onConfirm={this.onDateSelected}
                    />

                </Popup>
            </div>
        )
    }
}