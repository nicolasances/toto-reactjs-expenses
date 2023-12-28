import './GenericGameScreen.css'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { LevelUpWidget } from './widgets/LevelUpWidget'

import GamesAPI from '../../services/GamesAPI'
import TitleBar from '../../comp/TitleBar'
import PlayerProgressWidget from './widgets/PlayerProgressWidget'

/**
 * Generic Game Screen
 * 
 * This screen is meant to act as a wrapper for game screen.
 * This screen will show the most common components of a game screen: 
 *  - the title bar
 *  - the player progress bar
 * 
 * It will also provide basic behaviour such as Level Up animations and loading of 
 * Games statuses
 * ------------------------------------------------------------------
 * Usage: 
 * <GenericGameScreen>
 *  <your screen goes here...>
 * </GenericGameScreen>
 * 
 * ------------------------------------------------------------------
 * Properties: 
 * 
 *  - title:        (string, mandatory) the title to put in the TitleBar
 * 
 */
export const GenericGameScreen = forwardRef(function GenericGameScreen(props, ref) {

    const [loading, setLoading] = useState(false);
    const [overview, setOverview] = useState()
    const [playerLevelId, setPlayerLevelId] = useState(null)
    const [levelUp, setLevelUp] = useState()

    const previousPlayerLevelId = useRef()

    useImperativeHandle(ref, () => ({
        loadOverview: loadOverview,
    }))

    /**
     * Load the game
     * Load the next round of the game
     */
    const initialLoad = async () => {

        // Get the Overall Player Level
        loadOverview();

    }

    /**
     * Loads the games overview, including the player's level
     */
    const loadOverview = async () => {

        const overview = await new GamesAPI().getGamesOverview();

        setOverview(overview)

        previousPlayerLevelId.current = playerLevelId

        setPlayerLevelId(overview.playerLevel.level.id)

    }

    /**
     * This method checks whether a level up animation is needed and controls it
     */
    const levelUpAnimation = () => {

        // If we just loaded for the first time the current status, no level up occurred
        if (previousPlayerLevelId.current == null) return;

        // If the player level did not change, no animation is needed
        if (previousPlayerLevelId.current == playerLevelId) return;

        console.log("Level Up occurred!");

        // Trigger the animation
        setLevelUp(true)

    }

    useEffect(initialLoad, [])
    useEffect(levelUpAnimation, [playerLevelId])

    return (
        <div className="screen game-screen">

            <TitleBar title={props.title} back={true}></TitleBar>

            <LevelUpWidget level={overview.playerLevel.level.title} show={levelUp} onClose={() => { setLevelUp(false) }} />

            {overview && overview.playerLevel &&
                <div className="progress-container">
                    <PlayerProgressWidget label="Your Overall Score" progress={overview.playerLevel.progress} levelPoints={overview.playerLevel.levelPoints} />
                </div>
            }

            {!loading &&
                <div className="game-body">

                    {props.children}

                </div>
            }

        </div>
    )

})