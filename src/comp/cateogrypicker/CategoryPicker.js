import React from 'react';
import './CategoryPicker.css';
import Popup from 'reactjs-popup';
import CategorySelectionPopup from './CategorySelectionPopup';
import categoriesMap from '../../services/CategoriesMap';
import { variance } from 'd3-array';
import TouchableOpacity from '../TouchableOpacity';

/**
 * Form component to pick a payment category
 * 
 * Parameters:
 * 
 *  - initialValue              :   (OPT) the initial value that the selector should show
 *  - initialValueLoader        :   (OPT) a function that will load the initial value. 
 *  - category                  :   (MAND) the category (this is a managed component)
 *  - onCategoryChange          :   (OPT) callback to receive changes of selected category
 *  - onPress                   :   (OPT) callback to react to when the user clicks on the category
 *  - label                     :   (OPT) a label to override the default
 *  - size                      :   (OPT, default "m") supported: "s", "m"
 *  - color                     :   (OPT) pass a different color for the widget. Admitted values: "accent"
 *  - disableSelection          :   (OPT, default false) pass true to disable the selection of a category
 */
export default class CategoryPicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openPopup: false,
            category: this.props.initialValue ? this.props.initialValue : "VARIE"
        }

        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onCategoryPress = this.onCategoryPress.bind(this);

    }

    componentDidMount() {

        if (this.props.initialValueLoader) this.props.initialValueLoader().then((data) => {
            this.setState({ category: data });
        })
    }

    /**
     * Reacts to the category change by updating the state of the component and calling any listener to the state change
     * @param {string} category The category code
     */
    onCategoryChange(category) {

        this.setState({
            openPopup: false
        }, () => {
            if (this.props.onCategoryChange) this.props.onCategoryChange(category);
        })
    }

    /**
     * Reacts to the user clicking on the category
     */
    onCategoryPress() {

        // Define if selection is enabled
        let selectionEnabled = this.props.selectionDisabled == true ? false : true

        // If selection is enabled, open the popup
        if (selectionEnabled) this.setState({ openPopup: true })

        // If there's a callback, use it
        if (this.props.onPress) this.props.onPress()

    }

    render() {

        let categoryComponent = categoriesMap.get(this.props.category);

        // Define the size
        let size = this.props.size ? this.props.size : "m"

        // Define the color
        let color = this.props.color ? this.props.color : "grey"

        return (
            <div className="category-picker">

                <div className={`label ${size}`}>
                    {this.props.label ? this.props.label : "Payment category"}
                </div>

                <TouchableOpacity className={`category-container ${size} ${color}`} onPress={this.onCategoryPress}>
                    {categoryComponent.image}
                </TouchableOpacity>

                <Popup
                    on='click'
                    open={this.state.openPopup}
                    contentStyle={{ padding: 0, backgroundColor: '#00acc1', border: 'none' }}
                    arrow={false}
                    closeOnEscape={false}
                >

                    <CategorySelectionPopup onCategoryChange={this.onCategoryChange} />

                </Popup>

            </div>
        )
    }
}