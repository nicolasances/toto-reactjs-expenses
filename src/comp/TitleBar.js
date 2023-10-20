import React, { Component } from 'react';

import { ReactComponent as BackSVG } from '../img/left-arrow.svg';
import { ReactComponent as PlusSVG } from '../img/plus.svg';

import './TitleBar.css';
import { withRouter } from 'react-router-dom';
import TotoIconButton from './TotoIconButton';

class TitleBar extends Component {

    constructor(props) {
        super(props);

        this.navigateBack = this.navigateBack.bind(this);
    }

    navigateBack() {

        if (this.props.onBack) this.props.onBack();
        
        this.props.history.goBack();
    }

    render() {

        // Left button
        let leftButton = (
            <div className="button-container"></div>
        )
        if (this.props.back) leftButton = (
            <div className="button-container">
                <BackSVG className="icon" onClick={this.navigateBack} />
            </div>
        )

        // Right button
        let rightButton = (
            <div className="button-container">
                {this.props.newExpenseEnabled &&
                    <TotoIconButton image={<PlusSVG />} size="s" navigateTo="newExpense" navigationParams={{ selectedMonth: this.props.selectedMonth }} />
                }
            </div>
        )

        return (
            <div className="title-bar">
                {leftButton}
                <div className="title">{this.props.title}</div>
                {rightButton}
            </div>
        )
    }
}

export default withRouter(TitleBar);