'use client'

import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { MaskedSvgIcon } from 'toto-react';
import CategorySelectionPopup from './CategorySelectionPopup';
import categoriesMap from '@/utils/CategoriesMap';
import { incomeCategoriesMap } from '@/utils/IncomeCategoriesMap';
import TouchableOpacity from '@/components/TouchableOpacity';
import './CategoryPicker.css';

interface CategoryPickerProps {
    initialValue?: string;                              // (OPT) the initial value that the selector should show
    initialValueLoader?: () => Promise<string>;         // (OPT) a function that will load the initial value
    category?: string;                                  // (MAND) the category code (this is a managed component)
    onCategoryChange?: (category: string) => void;      // (OPT) callback to receive changes of selected category
    onPress?: () => void;                               // (OPT) callback to react to when the user clicks on the category
    label?: string;                                     // (OPT) a label to override the default
    hideLabel?: boolean;                                // (OPT, default false) pass true to hide the label
    size?: string;                                      // (OPT, default "m") supported: "xxs", "s", "m"
    color?: string;                                     // (OPT) pass a different color for the widget. Admitted values: "accent"
    selectionDisabled?: boolean;                        // (OPT, default false) pass true to disable the selection of a category
    income?: boolean;                                   // (OPT, default false) pass true if this category picker is for incomes
}

/**
 * Form component to pick a payment category
 *
 * @param {CategoryPickerProps} props the props
 */
export default function CategoryPicker(props: CategoryPickerProps) {

    const [openPopup, setOpenPopup] = useState(false)

    // Note: as in the legacy component, the loaded initial value is not used for rendering (the category is managed by the parent)
    useEffect(() => {
        if (props.initialValueLoader) props.initialValueLoader()
    }, [])

    /**
     * Reacts to the category change by closing the popup and calling any listener to the change
     */
    const onCategoryChange = (category: string) => {

        setOpenPopup(false)

        if (props.onCategoryChange) props.onCategoryChange(category);
    }

    /**
     * Reacts to the user clicking on the category
     */
    const onCategoryPress = () => {

        // Define if selection is enabled
        const selectionEnabled = props.selectionDisabled == true ? false : true

        // If selection is enabled, open the popup
        if (selectionEnabled) setOpenPopup(true)

        // If there's a callback, use it
        if (props.onPress) props.onPress()

    }

    const categoryInfo = props.category
        ? (props.income == true ? incomeCategoriesMap.get(props.category) : categoriesMap.get(props.category))
        : undefined;

    // Define the size
    const size = props.size ? props.size : "m"

    // Define the color
    const color = props.color ? props.color : "grey"

    // The icon size and color depend on the size and color of the picker
    const iconSize = size == 's' ? 'w-7 h-7' : (size == 'xxs' ? 'w-3 h-3' : 'w-10 h-10')
    const iconColor = color == 'accent' ? 'bg-accent' : 'bg-black/70'

    let label = (
        <div className={`label ${size}`}>
            {props.label ? props.label : (props.income == true ? "Income category" : "Payment category")}
        </div>
    );
    if (props.hideLabel === true) label = <></>

    return (
        <div className="category-picker">

            {label}

            <TouchableOpacity className={`category-container ${size} ${color}`} onPress={onCategoryPress}>
                {categoryInfo && <MaskedSvgIcon src={categoryInfo.icon} alt={categoryInfo.label} size={iconSize} color={iconColor} />}
            </TouchableOpacity>

            <Popup
                on='click'
                open={openPopup}
                contentStyle={{ padding: 0, backgroundColor: '#00acc1', border: 'none' }}
                arrow={false}
                closeOnEscape={false}
            >

                <CategorySelectionPopup income={props.income} onCategoryChange={onCategoryChange} />

            </Popup>

        </div>
    )
}
