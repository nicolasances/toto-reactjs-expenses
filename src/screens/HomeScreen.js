import React, { Component } from 'react';

import MonthSpendingBubble from "../comp/MonthSpendingBubble";

import './HomeScreen.css'

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
        return (
            <div className="screen">
                <div className="home-screen-h1">
                    <div style={{flex: 1}}>Graph</div>
                    <div style={{flex: 0.5, alignItems: "center"}}><MonthSpendingBubble /></div>
                </div>
            </div>
        )
    }
}
