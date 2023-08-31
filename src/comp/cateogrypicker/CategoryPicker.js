import React from 'react';
import './CategoryPicker.css';
import Popup from 'reactjs-popup';
import CategorySelectionPopup from './CategorySelectionPopup';
import categoriesMap from '../../services/CategoriesMap';
import { variance } from 'd3-array';

/**
 * Form component to pick a payment category
 * 
 * Parameters:
 * 
 *  - initialValue              :   (OPT) the initial value that the selector should show
 *  - initialValueLoader        :   (OPT) a function that will load the initial value. 
 *  - category                  :   (MAND) the category (this is a managed component)
 *  - onCategoryChange          :   (OPT) callback to receive changes of selected category
 */
export default class CategoryPicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openPopup: false,
            category: this.props.initialValue ? this.props.initialValue : "VARIE"
        }

        this.onCategoryChange = this.onCategoryChange.bind(this);

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

    render() {

        let categoryComponent = categoriesMap.get(this.props.category);

        return (
            <div className="category-picker">

                <div className="label">
                    Payment category
                </div>

                <div className="category-container" onClick={() => { this.setState({ openPopup: true }) }}>
                    {categoryComponent.image}
                </div>

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