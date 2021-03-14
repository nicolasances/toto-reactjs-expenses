import React, { Component } from 'react';
import './TextInput.css';

/**
 * Displays a controlled text input
 * 
 * Parameters:
 * 
 *  - initialValue              :   (OPT) the initial value that the selector should show
 *  - initialValueLoader        :   (OPT) a function that will load the initial value. 
 *  - placeholder               :   (OPTIONAL) the placeholder to put in the text field when empty
 *  - align                     :   (OPTIONAL, default 'left) the text alignment in the input. Can be ('left', 'center', 'right')
 *  - onTextChange              :   (OPT) callback to be notified of changes in the value
 */
export default class TextInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.initialValue ? this.props.initialValue : ''
        }

        this.changeValue = this.changeValue.bind(this);
    }

    componentDidMount() {

        if (this.props.initialValueLoader) this.props.initialValueLoader().then((data) => {
            this.setState({ value: data });
        })
    }

    changeValue(event) {
        this.setState({
            value: event.target.value
        }, () => {
            if (this.props.onTextChange) this.props.onTextChange(this.state.value);
        })
    }

    render() {

        let style = {
            textAlign: this.props.align ? this.props.align : 'left'
        }

        return (
            <div className="text-input">
                <input
                    style={style}
                    type="text"
                    placeholder={this.props.placeholder}
                    value={this.state.value}
                    onChange={this.changeValue}
                />
            </div>
        )
    }

}