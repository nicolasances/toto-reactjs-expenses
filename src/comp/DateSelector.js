import React, {Component} from 'react';
import moment from 'moment-timezone';
import './DateSelector.css';
import { withRouter } from 'react-router-dom';

class DateSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            date: moment() 
        }

        this.selectDate = this.selectDate.bind(this);
    }

    selectDate() {
        this.props.history.push("/selectDate");
    }

    render() {
        return (
            <div className="date-selector" onClick={this.selectDate}>
                <div className="date-display">
                    <div className="year">{this.state.date.format('YYYY')}</div>
                    <div className="day">{this.state.date.format('DD')}</div>
                    <div className="month">{this.state.date.format('MMMM')}</div>
                </div>
            </div>
        )
    }
}
export default withRouter(DateSelector);