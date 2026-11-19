'use client';

import './GamesScreen.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaskedSvgIcon } from 'toto-react';

import monkeyZenAnimation from '@/assets/lottie/anim-zen-monkey.json';

import Lottie from "lottie-react";
import { GamesAPI } from '@/api/GamesAPI';
import { GamesOverview } from '@/model/games';
import TitleBar from "@/components/TitleBar";
import TouchableOpacity from '@/components/TouchableOpacity';
import PlayerLevelWidget from './widgets/PlayerLevelWidget';
import PlayerProgressWidget from './widgets/PlayerProgressWidget';

const COLORS = [
    { bck: "#FFCC70", color: "#22668D" },
    { bck: "#FFFADD", color: "#22668D" },
    { bck: "#8ECDDD", color: "#22668D" },
    { bck: "#22668D", color: "#FFCC70" },
    { bck: "#FFCC70", color: "#22668D" },
    { bck: "#A94438", color: "#E4DEBE" },
    { bck: "#B138D0", color: "#FFE7C1" },
];

const GAME_LABELS: Record<string, string> = {
    kupload: "The Kupload",
    rekoncile: "Rekoncile",
    cattie: "The Cattie",
    inkome: "Inkome"
};

const GAME_IMAGES: Record<string, string> = {
    kupload: '/images/games/games/kupload.svg',
    rekoncile: '/images/games/games/rekoncile.svg',
    cattie: '/images/cat.svg',
    inkome: '/images/games/games/inkome.svg'
};

/**
 * Screen with the list of the available games and the player's level
 */
export default function GamesScreen() {

    const [overview, setOverview] = useState<GamesOverview>();
    const [loading, setLoading] = useState(false);

    // Initial load of the games overview
    useEffect(() => {

        const initialLoad = async () => {

            const timer = setTimeout(() => { setLoading(true); }, 600);

            const loadedOverview = await new GamesAPI().getGamesOverview();

            clearTimeout(timer);

            setOverview(loadedOverview);

            setLoading(false);
        };

        initialLoad();
    }, []);

    return (
        <div className="screen games-screen">

            <TitleBar title="Toto Games" back={true} />

            {overview == null && loading &&
                <div className="content">
                    <div className="loading-container">
                        <Lottie animationData={monkeyZenAnimation} loop={true} autoplay={true} />
                    </div>
                    <div className="loading-title">Your games are loading..</div>
                </div>
            }

            {overview != null &&
                <div className="content">

                    <PlayerLevelWidget playerLevel={overview.playerLevel} />

                    <PlayerProgressWidget progress={overview.playerLevel.progress} levelPoints={overview.playerLevel.levelPoints} lottieOn={false} />

                    <div className="games-section">
                        <div className="title">Available Games</div>

                        <div className="games-container">
                            {overview.gamesStatuses.map((game) => {
                                if (!game.gameStatus.finished) {
                                    return (
                                        <Game gamePage={game.gameKey} gameName={GAME_LABELS[game.gameKey]} image={GAME_IMAGES[game.gameKey]} key={Math.random()} />
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}

/**
 * Props of the Game tile
 */
interface GameProps {
    gamePage?: string;      // The game id, which is also the sub-path of the game page (/games/<gamePage>)
    gameName: string;       // The name of the game
    image: string;          // Public path of the game's icon
}

/**
 * A game tile, that opens the game when pressed
 */
function Game({ gamePage, gameName, image }: GameProps) {

    const router = useRouter();

    /**
     * Opens the game
     */
    const onPress = () => {
        if (gamePage) router.push(`/games/${gamePage}`);
    };

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const bck = color.bck;
    const front = color.color;

    return (
        <TouchableOpacity className="game" onPress={onPress}  >

            <div className="image-container" style={{ color: front, backgroundColor: bck }}>
                <MaskedSvgIcon src={image} alt={gameName} size="w-8 h-8" color="bg-current" />
            </div>

            <div className="title-container" >
                <b>{gameName}</b> Game
            </div>

        </TouchableOpacity>
    );
}
