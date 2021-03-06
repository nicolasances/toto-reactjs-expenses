import React, { Component } from 'react';
import moment from 'moment-timezone';
import './DateSelector.css';
import Popup from 'reactjs-popup';
import DatePicker from './datepicker/DatePicker';

export default class DateSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            date: moment()
        }

        this.selectDate = this.selectDate.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
    }

    onDateSelected(date) {
        this.setState({
            date: date,
            openHelpPopup: false
        })
    }

    selectDate() {
        this.setState({
            openHelpPopup: true
        })
    }

    render() {
        return (
            <div className="date-selector" onClick={this.selectDate}>
                <div className="date-display">
                    <div className="year">{this.state.date.format('YYYY')}</div>
                    <div className="day">{this.state.date.format('DD')}</div>
                    <div className="month">{this.state.date.format('MMMM')}</div>
                </div>

                <Popup
                    on='click'
                    open={this.state.openHelpPopup}
                    overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    contentStyle={{ padding: 0, backgroundColor: '#007c91', border: 'none' }}
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