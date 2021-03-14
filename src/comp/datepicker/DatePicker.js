import moment from 'moment-timezone';
import React, { Component } from 'react';
import DayPicker from './DayPicker';
import MonthTile from '../../picker/MonthTile';
import ScrollPicker from '../../picker/ScrollPicker';
import YearTile from '../../picker/YearTile';
import TotoIconButton from '../TotoIconButton';
import { ReactComponent as TickSVG } from '../../img/tick.svg';
import { ReactComponent as CloseSVG } from '../../img/close.svg';
import './DatePicker.css';

export default class DatePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            date: moment(),
            year: moment().format('YYYY'),
            month: moment().format('MM')
        }

        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);

    }

    confirm() {
        if (this.props.onConfirm) this.props.onConfirm(this.state.date);
    }

    cancel() {
        if (this.props.onCancel) this.props.onCancel();
    }

    onChangeDate(date) {
        this.setState({
            date: date
        }, () => {
            setTimeout(this.confirm, 50);
        });
    }

    onChangeYear(date) {
        this.setState({
            year: date.format('YYYY')
        })
    }

    onChangeMonth(date) {
        this.setState({
            month: date.format('MM')
        })
    }

    render() {

        return (
            <div className="date-picker screen">
                <div className="header">
                    <div className="label">Selected date</div>
                    <div className="value">{this.state.date.format("DD MMMM YYYY")}</div>
                </div>
                <div className="body">
                    <div>
                        <ScrollPicker
                            tile={<YearTile selectedFontSize={14} unselectedFontSize={10} />}
                            defaultValue={moment()}
                            previousValue={(currentValue) => currentValue.clone().subtract(1, 'years')}
                            nextValue={(currentValue) => currentValue.clone().add(1, 'years')}
                            onSelectionChange={this.onChangeYear}
                            height={40}
                            underline={false}
                        />
                    </div>
                    <div style={{ marginBottom: 12, marginTop: 12 }}>
                        <ScrollPicker
                            tile={<MonthTile selectedFontSize={16} unselectedFontSize={12} />}
                            defaultValue={moment()}
                            previousValue={(currentValue) => currentValue.clone().subtract(1, 'months')}
                            nextValue={(currentValue) => currentValue.clone().add(1, 'months')}
                            onSelectionChange={this.onChangeMonth}
                            height={50}
                            underline={false}
                            backgroundColor="#007c91"
                        />
                    </div>
                    <DayPicker year={this.state.year} month={this.state.month} defaultValue={moment()} onDateSelected={this.onChangeDate} />
                </div>
                <div className="footer">
                    <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={<CloseSVG className="icon" />} onPress={this.cancel} /></div>
                </div>
            </div>
        )
    }
}

