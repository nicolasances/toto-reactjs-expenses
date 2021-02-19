import React, { Component } from 'react';

import './TitleBar.css';

export default class TitleBar extends Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="title-bar">
                <div className="title">{this.props.title}</div>
            </div>
        )
    }
}