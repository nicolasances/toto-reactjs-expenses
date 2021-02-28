import React, { Component } from 'react';
import TitleBar from '../comp/TitleBar';
import { withRouter } from 'react-router-dom';
import './DateSelectionScreen.css';
import moment from 'moment-timezone';
import ScrollPicker from '../picker/ScrollPicker';
import YearMonthTile from '../picker/YearMonthTile';

class DateSelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            date: moment()
        }

    }

    componentDidMount() {
    }

    render() {

        return (
            <div className="date-selection-screen screen">
                <ScrollPicker 
                    tile={<YearMonthTile/>}
                    defaultValue={moment()}
                    previousValue={(currentValue) => currentValue.clone().subtract(1, 'months')}
                    nextValue={(currentValue) => currentValue.clone().add(1, 'months')}
                />
            </div>
        )
    }
}

export default withRouter(DateSelectionScreen);

