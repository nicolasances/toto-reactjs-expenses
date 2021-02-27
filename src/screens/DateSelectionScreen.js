import React, { Component } from 'react';
import TitleBar from '../comp/TitleBar';
import { withRouter } from 'react-router-dom';
import './DateSelectionScreen.css';
import moment from 'moment-timezone';

class DateSelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            date: moment()
        }
    }

    render() {

        let days = [];
        for (var i = 1; i <= this.state.date.daysInMonth(); i++) {
            days.push((
                <div key={"day"+i} className="day">
                    {i}
                </div>
            ))
        }

        return (
            <div className="date-selection-screen screen">
                <div className="day-selector">
                    {days}
                </div>
            </div>
        )
    }
}

export default withRouter(DateSelectionScreen);

