import React, { Component } from 'react';

import MonthSpendingBubble from "../comp/MonthSpendingBubble";
import TitleBar from '../comp/TitleBar';
import LastDaysSpendingGraph from '../comp/LastDaysSpendingGraph';

import { ReactComponent as SettingsSVG } from '../img/settings.svg';
import { ReactComponent as AddSVG } from '../img/plus.svg';
import { ReactComponent as ListSVG } from '../img/list.svg';

import './Screen.css';
import './HomeScreen.css';
import TotoIconButton from '../comp/TotoIconButton';

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        console.log(require('../img/bank.svg'));
        
        return (
            <div className="screen">
                <TitleBar title="Payments"/>
                <div className="home-screen-h1">
                    <div style={{flex: 1}}><LastDaysSpendingGraph /></div>
                    <div style={{flex: 0.5, alignItems: "center"}}><MonthSpendingBubble /></div>
                </div>

                <div className="home-screen-h2">
                    <div className="button-container"> <TotoIconButton image={(<SettingsSVG className="icon" />)} /></div>
                    <div className="button-container"> <TotoIconButton image={(<AddSVG className="icon" />)} /></div>
                    <div className="button-container"> <TotoIconButton image={(<ListSVG className="icon" />)} navigateTo="/expenses" /></div>
                </div>
            </div>
        )
    }
}
