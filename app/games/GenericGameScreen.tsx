'use client';

import './GenericGameScreen.css';

import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LevelUpWidget } from './widgets/LevelUpWidget';

import { GamesAPI } from '@/api/GamesAPI';
import TitleBar from '@/components/TitleBar';
import PlayerProgressWidget from './widgets/PlayerProgressWidget';
import { GameFinished } from './widgets/GameFinished';
import { GamesOverview } from '@/model/games';

/**
 * Props of the GenericGameScreen
 */
export interface GenericGameScreenProps {
    title: string;              // The title to put in the TitleBar
    gameKey?: string;           // The id of the game (e.g. "rekoncile", or "cattie"). Used to know if the game is finished
    children?: ReactNode;       // The screen of the game
}

/**
 * Methods that the GenericGameScreen exposes through its ref
 */
export interface GenericGameScreenHandle {
    loadOverview: () => Promise<void>;      // Reloads the games overview (score, level and finished status)
}

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
 * <GenericGameScreen title="..." gameKey="...">
 *  <your screen goes here...>
 * </GenericGameScreen>
 */
export const GenericGameScreen = forwardRef<GenericGameScreenHandle, GenericGameScreenProps>(function GenericGameScreen(props, ref) {

    const [loading] = useState(false);
    const [overview, setOverview] = useState<GamesOverview>();
    const [playerLevelId, setPlayerLevelId] = useState<string | null>(null);
    const [levelUp, setLevelUp] = useState<boolean>();
    const [finished, setFinished] = useState(false);

    const previousPlayerLevelId = useRef<string | null | undefined>(undefined);

    /**
     * Loads the games overview, including the player's level
     */
    const loadOverview = async () => {

        const loadedOverview = await new GamesAPI().getGamesOverview();

        setOverview(loadedOverview);

        previousPlayerLevelId.current = playerLevelId;

        setPlayerLevelId(loadedOverview.playerLevel.level.id);

        // Check if the game is finished
        for (const game of loadedOverview.gamesStatuses) {

            if (game.gameKey == props.gameKey) {

                setFinished(!!game.gameStatus.finished);

                break;
            }
        }
    };

    useImperativeHandle(ref, () => ({
        loadOverview: loadOverview,
    }));

    // Loads the overall player level
    useEffect(() => {
        loadOverview();
    }, []);

    // Checks whether a level up animation is needed and controls it
    useEffect(() => {

        // If we just loaded for the first time the current status, no level up occurred
        if (previousPlayerLevelId.current == null) return;

        // If the player level did not change, no animation is needed
        if (previousPlayerLevelId.current == playerLevelId) return;

        console.log("Level Up occurred!");

        // Trigger the animation
        setLevelUp(true);
    }, [playerLevelId]);

    return (
        <div className="screen game-screen">

            <TitleBar title={props.title} back={true}></TitleBar>

            <LevelUpWidget level={overview ? overview.playerLevel.level.title : ""} show={levelUp} onClose={() => { setLevelUp(false); }} />

            {overview && overview.playerLevel &&
                <div className="progress-container">
                    <PlayerProgressWidget label="Your Overall Score" progress={overview.playerLevel.progress} levelPoints={overview.playerLevel.levelPoints} />
                </div>
            }

            {!loading &&
                <div className="game-body">

                    {!finished && props.children}

                    {finished && <GameFinished />}

                </div>
            }

        </div>
    );
});
