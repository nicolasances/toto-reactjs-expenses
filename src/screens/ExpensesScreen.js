import React, { Component } from 'react';
import TitleBar from '../comp/TitleBar';

export default class ExpensesScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="screen">
                <TitleBar title="Payments list" back={true}/>
            </div>
        )
    }
}