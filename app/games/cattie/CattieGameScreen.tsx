'use client';

import './CattieGameScreen.css';

import { GenericGameScreen, GenericGameScreenHandle } from '../GenericGameScreen';
import { useEffect, useRef, useState } from 'react';
import { MaskedSvgIcon } from 'toto-react';
import { GamesAPI } from '@/api/GamesAPI';
import { CattieRound } from '@/model/games';
import ExpenseListItem from '@/components/ExpenseListItem';

import categoriesMap from '@/utils/CategoriesMap';
import TouchableOpacity from '@/components/TouchableOpacity';
import Popup from 'reactjs-popup';
import CategorySelectionPopup from '@/components/categorypicker/CategorySelectionPopup';

/**
 * The Cattie game: the user confirms or corrects the category of a payment
 */
export function CattieGameScreen() {

    const [round, setRound] = useState<CattieRound | null>(null);
    const [openCategoryPicker, setOpenCategoryPicker] = useState(false);

    const genericScreenRef = useRef<GenericGameScreenHandle>(null);

    /**
     * Function to load the next round
     *
     * @param bypassReloadOverview (OPT, default false), pass true if you want to skip the reloading of the score
     */
    const loadNextRound = async (bypassReloadOverview?: boolean) => {

        // Load the status
        const nextRound = await new GamesAPI().getCattieNextRound();

        // Update the state
        setRound(nextRound);

        // Update the Generic Screen data
        if (!bypassReloadOverview) genericScreenRef.current?.loadOverview();
    };

    /**
     * Submit the user chosen category
     */
    const submitChoice = async (chosenCategory: string) => {

        // Submit the chosen category to the Game API
        await new GamesAPI().submitCattieChoice(round!.transaction, chosenCategory);

        // Load the next round
        await loadNextRound();
    };

    /**
     * Function that reacts to the user handpicking a category
     */
    const onCategoryHandPicked = async (categoryCode: string) => {

        // Close the popup
        setOpenCategoryPicker(false);

        // Submit the choice
        await submitChoice(categoryCode);
    };

    /**
     * Reacts to the user selecting one between the original or toto-suggested categories
     */
    const onCategorySelected = async (categoryCode: string) => {

        // Submit the choice
        await submitChoice(categoryCode);
    };

    /**
     * Passes to the next round, skipping this one
     */
    const onPass = () => {

        // Just load the next round
        loadNextRound(true);
    };

    // Loads the first round
    useEffect(() => {
        loadNextRound();
    }, []);

    return (
        <GenericGameScreen gameKey="cattie" title="The Cattie Game" ref={genericScreenRef}>

            {round &&
                <div className="cattie">

                    <div className="goal">This transaction was categorized as <b>{categoriesMap.get(round.transaction.category)!.label}</b></div>

                    <ExpenseListItem data={{
                        avatar: {
                            value: categoriesMap.get(round.transaction.category)!.icon,
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
                            onPress={() => { onCategorySelected(round.transaction.category); }}
                        />

                        <CattieOption
                            title="Choose Toto"
                            text="Toto's suggested category"
                            category={round.suggestedCategory}
                            onPress={() => { onCategorySelected(round.suggestedCategory); }}
                        />

                        <CattieOption
                            title="Choose yourself"
                            text="Choose yourself the category"
                            image="/images/touch.svg"
                            onPress={() => { setOpenCategoryPicker(true); }}
                        />

                        <CattieOption
                            title="Pass"
                            text="Not sure? You can skip this one"
                            image="/images/next.svg"
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
    );
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
];

/**
 * Props of the CattieOption
 */
interface CattieOptionProps {
    title: string;              // Title of the option
    text: string;               // Description of the option
    category?: string;          // Category code, whose icon is shown (alternative to image)
    image?: string;             // Public path of the icon to show (alternative to category)
    onPress: () => void;        // Called when the option is pressed
}

/**
 * An Option box
 */
function CattieOption({ title, text, category, image, onPress }: CattieOptionProps) {

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const bck = color.bck;
    const front = color.color;

    return (
        <TouchableOpacity className="cattie-option" style={{ backgroundColor: bck, color: front }} onPress={onPress}>

            {category &&
                <div className="icon-container">
                    <MaskedSvgIcon src={categoriesMap.get(category)!.icon} alt={title} size="w-10 h-10" color="bg-current" />
                </div>
            }

            {image &&
                <div className="icon-container">
                    <MaskedSvgIcon src={image} alt={title} size="w-10 h-10" color="bg-current" />
                </div>
            }

            <div className="option-title">{title}</div>
            <div className="option-text">{text}</div>

        </TouchableOpacity>
    );
}
