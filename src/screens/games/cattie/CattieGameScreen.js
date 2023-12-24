import './CattieGameScreen.css'

import { GenericGameScreen } from '../GenericGameScreen'
import { useEffect, useRef, useState } from 'react'
import GamesAPI from '../../../services/GamesAPI'
import ExpenseListItem from '../../../comp/ExpenseListItem'

import { ReactComponent as QuestionSVG } from '../../../img/question.svg'
import { ReactComponent as TouchSVG } from '../../../img/touch.svg'
import { ReactComponent as NextSVG } from '../../../img/next.svg'

import categoriesMap from '../../../services/CategoriesMap'
import CategoryPicker from '../../../comp/cateogrypicker/CategoryPicker'
import TouchableOpacity from '../../../comp/TouchableOpacity'
import Popup from 'reactjs-popup'
import CategorySelectionPopup from '../../../comp/cateogrypicker/CategorySelectionPopup'

export function CattieGameScreen(props) {

    const [round, setRound] = useState(null)
    const [handpickedCat, setHandpickedCat] = useState("VARIE")
    const [openCategoryPicker, setOpenCategoryPicker] = useState(false)

    const genericScreenRef = useRef()

    /**
     * Initial load of the data
     */
    const initialLoad = async () => {

        // Load the next round
        loadNextRound();

    }

    /**
     * Function to load the next round
     * 
     * @param bypassReloadOverview (OPT, default null), pass true if you want to skip the reloading of the score
     */
    const loadNextRound = async (bypassReloadOverview) => {

        // Load the status
        const round = await new GamesAPI().getCattieNextRound();

        // Update the state
        setRound(round)

        // Clear the category
        setHandpickedCat("VARIE")

        // Update the Generic Screen data
        if (!bypassReloadOverview) genericScreenRef.current.loadOverview()

    }

    /**
     * Submit the user chosen category
     */
    const submitChoice = async (chosenCategory) => {

        // Submit the chosen category to the Game API
        await new GamesAPI().submitCattieChoice(round.transaction, chosenCategory)

        // Load the next round
        await loadNextRound()

    }

    /**
     * Function that reacts to the user handpicking a category
     */
    const onCategoryHandPicked = async (categoryCode) => {

        // Update the handpicked category (for visuals)
        setHandpickedCat(categoryCode)

        // Close the popup
        setOpenCategoryPicker(false)

        // Submit the choice
        await submitChoice(categoryCode)

    }

    /**
     * Reacts to the user selecting one between the original or toto-suggested categories
     */
    const onCategorySelected = async (categoryCode) => {

        // Submit the choice
        await submitChoice(categoryCode)

    }

    /**
     * Passes to the next round, skipping this one
     */
    const onPass = () => {

        // Just load the next round
        loadNextRound(true)

    }


    useEffect(initialLoad, [])

    return (
        <GenericGameScreen title="The Cattie Game" ref={genericScreenRef}>

            {round &&
                <div className="cattie">

                    <div className="goal">This transaction was categorized as <b>{categoriesMap.get(round.transaction.category).label}</b></div>

                    <ExpenseListItem data={{
                        avatar: {
                            type: 'image',
                            value: categoriesMap.get(round.transaction.category).image,
                            size: 'l'
                        },
                        date: {
                            date: round.transaction.date,
                            showYear: true
                        },
                        title: round.transaction.description,
                        amount: round.transaction.amount
                    }} />

                    <div className="goal detach-from-top">Select the best matching category below...</div>

                    <div className="suggestions">

                        <CattieOption
                            title="Keep Original"
                            text="Current category of the payment"
                            category={round.transaction.category}
                            onPress={() => { onCategorySelected(round.transaction.category) }}
                        />

                        <CattieOption
                            title="Choose Toto"
                            text="Toto's suggested category"
                            category={round.suggestedCategory}
                            onPress={() => { onCategorySelected(round.suggestedCategory) }}
                        />

                        <CattieOption
                            title="Choose yourself"
                            text="Choose yourself the category"
                            image={<TouchSVG />}
                            onPress={() => { setOpenCategoryPicker(true) }}
                        />

                        <CattieOption
                            title="Pass"
                            text="Not sure? You can skip this one"
                            image={<NextSVG />}
                            onPress={onPass}
                        />

                    </div>

                    <Popup
                        on='click'
                        open={openCategoryPicker}
                        contentStyle={{ padding: 0, backgroundColor: '#00acc1', border: 'none' }}
                        arrow={false}
                        closeOnEscape={false}
                    >

                        <CategorySelectionPopup onCategoryChange={onCategoryHandPicked} />

                    </Popup>

                </div>

            }

        </GenericGameScreen>
    )

}


const COLORS = [
    { bck: "#FFCC70", color: "#22668D" },
    { bck: "#FFFADD", color: "#22668D" },
    { bck: "#8ECDDD", color: "#104D71" },
    { bck: "#22668D", color: "#FFCC70" },
    { bck: "#264653", color: "#e9c46a" },
    { bck: "#efd3d7", color: "#912c3b" },
    { bck: "#faa307", color: "#370617" },
    { bck: "#335c67", color: "#fff3b0" },
    { bck: "#136f63", color: "#f7dba7" }
]

/**
 * An Option box
 */
function CattieOption(props) {

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const bck = color.bck
    const front = color.color;

    return (
        <TouchableOpacity className="cattie-option" style={{ backgroundColor: bck, color: front }} onPress={props.onPress}>

            {props.category &&
                <div className="icon-container">
                    {categoriesMap.get(props.category).image}
                </div>
            }

            {props.image &&
                <div className="icon-container">
                    {props.image}
                </div>
            }

            <div className="option-title">{props.title}</div>
            <div className="option-text">{props.text}</div>

        </TouchableOpacity>
    )

}