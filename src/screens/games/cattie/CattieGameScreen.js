import './CattieGameScreen.css'

import { GenericGameScreen } from '../GenericGameScreen'
import { useEffect, useRef, useState } from 'react'
import GamesAPI from '../../../services/GamesAPI'
import ExpenseListItem from '../../../comp/ExpenseListItem'

import { ReactComponent as QuestionSVG } from '../../../img/question.svg'
import categoriesMap from '../../../services/CategoriesMap'
import CategoryPicker from '../../../comp/cateogrypicker/CategoryPicker'

export function CattieGameScreen(props) {

    const [round, setRound] = useState(null)
    const [handpickedCat, setHandpickedCat] = useState("VARIE")

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
     */
    const loadNextRound = async () => {

        // Load the status
        const round = await new GamesAPI().getCattieNextRound();

        // Update the state
        setRound(round)

        // Clear the category
        setHandpickedCat("VARIE")

        // Update the Generic Screen data
        genericScreenRef.current.loadOverview()

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

    useEffect(initialLoad, [])

    return (
        <GenericGameScreen title="The Cattie Game" ref={genericScreenRef}>

            {round &&
                <div className="cattie">

                    <div className="goal">This transaction was categorized as <b>{categoriesMap.get(round.transaction.category).label}</b></div>

                    <ExpenseListItem data={{
                        avatar: {
                            type: 'image',
                            value: <QuestionSVG />,
                            size: 'l'
                        },
                        date: { date: round.transaction.date },
                        title: round.transaction.description,
                        amount: round.transaction.amount
                    }} />

                    <div className="goal detach-from-top">Select the best matching category among the current category, Toto's suggested category or choose one yourself</div>

                    <div className="suggestions">

                        <div className="suggestion">
                            <CategoryPicker
                                label="Original Category"
                                category={round.transaction.category}
                                size="s"
                                color="accent"
                                selectionDisabled={true}
                                onPress={() => { onCategorySelected(round.transaction.category) }}
                            />
                        </div>

                        <div className="suggestion">
                            <CategoryPicker
                                label="Toto Suggestion"
                                category={round.suggestedCategory}
                                size="s"
                                color="accent"
                                selectionDisabled={true}
                                onPress={() => { onCategorySelected(round.suggestedCategory) }}
                            />
                        </div>

                        <div className="suggestion">
                            <CategoryPicker
                                label="Or choose one.."
                                category={handpickedCat}
                                size="s"
                                color="accent"
                                onCategoryChange={onCategoryHandPicked}
                            />
                        </div>

                    </div>

                </div>

            }

        </GenericGameScreen>
    )

}