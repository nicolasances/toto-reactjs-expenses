'use client'

import { MaskedSvgIcon } from 'toto-react';
import categoriesMap from '@/utils/CategoriesMap';
import { incomeCategoriesMap } from '@/utils/IncomeCategoriesMap';
import TouchableOpacity from '@/components/TouchableOpacity';
import TotoIconButton from '@/components/TotoIconButton';
import './CategoryPicker.css';

interface CategorySelectionPopupProps {
    income?: boolean;                                   // (OPT, default false) Pass true if you're picking Income categories
    category?: string;                                  // (OPT) the currently selected category code
    onCategoryChange?: (category: string) => void;      // (OPT) called when the user picks a category
    onPressClose?: () => void;                          // (OPT) when provided, a close button is shown and calls this on press
}

/**
 * Popup to select a category.
 * Differentiates between Payment categories and Income categories.
 *
 * @param {CategorySelectionPopupProps} props the props
 */
export default function CategorySelectionPopup(props: CategorySelectionPopupProps) {

    /**
     * When the category is changed
     */
    const onCategoryChange = (key: string) => {
        // Call callback if configured
        if (props.onCategoryChange) props.onCategoryChange(key);
    }

    // Categories buttons
    const categoryButtons: React.ReactNode[] = [];

    // Define which category map should be used: income or payment categories map
    const targetCategoryMap = props.income == true ? incomeCategoriesMap : categoriesMap;

    targetCategoryMap.forEach((value, key) => {

        const k = 'CatNewEx' + Math.random();

        categoryButtons.push(
            <Category key={k} icon={value.icon} label={value.label} selected={props.category === key} onPress={() => { onCategoryChange(key); }} />
        )
    })

    // Close button
    let closeButton;
    if (props.onPressClose) closeButton = (
        <div style={{ marginBottom: 24 }}>
            <TotoIconButton image="/images/close.svg" onPress={props.onPressClose} />
        </div>
    )

    return (
        <div className='category-selection-popup screen'>
            <div className='title'> Select a category </div>
            <div className='buttons-container'>
                {categoryButtons}
            </div>
            <div style={{ display: 'flex', flex: 1 }}></div>
            {closeButton}
        </div>
    )
}

interface CategoryProps {
    icon: string;           // Public path of the category icon
    label: string;          // Label of the category
    selected: boolean;      // True if this is the selected category
    onPress: () => void;    // Called when the user presses the category
}

/**
 * Category item
 *
 * @param {CategoryProps} props the props
 */
function Category(props: CategoryProps) {

    const selectedStyle = props.selected ? 'selected' : 'unselected';

    const mainStyle = 'cat-selector-container ' + selectedStyle;

    return (
        <div className={mainStyle}>
            <TouchableOpacity className='image-container' onPress={props.onPress}>
                <MaskedSvgIcon src={props.icon} alt={props.label} size="w-6 h-6" color="bg-black/70" />
            </TouchableOpacity>
            <div className='label'>{props.label}</div>
        </div>
    )
}
