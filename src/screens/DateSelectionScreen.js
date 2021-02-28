import React, { Component } from 'react';
import TitleBar from '../comp/TitleBar';
import { withRouter } from 'react-router-dom';
import './DateSelectionScreen.css';
import moment from 'moment-timezone';
import ScrollPicker from '../comp/ScrollPicker';

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
                <ScrollPicker />
            </div>
        )
    }
}

export default withRouter(DateSelectionScreen);

