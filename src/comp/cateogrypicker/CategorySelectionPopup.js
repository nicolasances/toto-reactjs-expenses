import React, { Component } from 'react';
import categoriesMap from '../../services/CategoriesMap';
import { incomeCategoriesMap } from '../../services/IncomeCategoriesMap';
import './CategoryPicker.css';
import TouchableOpacity from '../TouchableOpacity';
import { ReactComponent as CloseSVG } from '../../img/close.svg';
import TotoIconButton from '../../comp/TotoIconButton';

/**
 * Popup to select a category
 * 
 * Now differentiates between Payment categories and Income categories.
 * 
 * Parameters: 
 * 
 *  - income          : (OPT, default false) Pass true if you're picking Income categories 
 */
export default class CategorySelectionPopup extends Component {

  constructor(props) {
    super(props);

    this.comp = React.createRef();

    // Bindings
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  /**
   * Calculates the measures
   */
  componentDidMount() {

    this.width = this.comp.current.offsetWidth;

  }

  /**
   * When the category is changed
   */
  onCategoryChange(key) {
    // CAll callback if configured
    if (this.props.onCategoryChange) this.props.onCategoryChange(key);
  }

  render() {

    // Categories buttons
    let categoryButtons = [];

    // Define which category map should be used: income or payment categories map
    let targetCategoryMap = this.props.income == true ? incomeCategoriesMap : categoriesMap;

    targetCategoryMap.forEach((value, key) => {

      let k = 'CatNewEx' + Math.random();

      let cat = (
        <Category key={k} image={value.image} label={value.label} selected={this.props.category === key} onPress={() => { this.onCategoryChange(key); }} />
      )

      categoryButtons.push(cat);
    })


    // Close button
    let closeButton;
    if (this.props.onPressClose) closeButton = (
      <div style={{ marginBottom: 24 }}>
        <TotoIconButton image={<CloseSVG class="icon" />} onPress={this.props.onPressClose} />
      </div>
    )


    return (
      <div className='category-selection-popup screen' ref={this.comp}>
        <div className='title'> Select a category </div>
        <div className='buttons-container'>
          {categoryButtons}
        </div>
        <div style={{ display: 'flex', flex: 1 }}></div>
        {closeButton}
      </div>
    )
  }
}

/**
 * Category item
 */
class Category extends Component {

  render() {

    let selectedStyle = this.props.selected ? 'selected' : 'unselected';

    let mainStyle = 'cat-selector-container ' + selectedStyle;

    return (
      <div className={mainStyle}>
        <TouchableOpacity className='image-container' onPress={this.props.onPress}>
          {this.props.image}
        </TouchableOpacity>
        <div className='label'>{this.props.label}</div>
      </div>
    )
  }

}