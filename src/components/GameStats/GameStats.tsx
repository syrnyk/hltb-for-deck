import { DialogButtonPrimary, Navigation, ServerAPI } from 'decky-frontend-lib';
import useHltb from '../../hooks/useHltb';
import { usePreference, useStyle } from '../../hooks/useStyle';
import style from './style';
import { useEffect, useState } from 'react';
import { useStatPreferences } from '../../hooks/useStatPreferences';

type GameStatsProps = {
    serverApi: ServerAPI;
    game: string;
    appId: number;
    id: string;
};

export const GameStats = ({ serverApi, game, appId, id }: GameStatsProps) => {
    const [gameLaunching, setGameLaunching] = useState<boolean>(false);
    const handleGameActionStart = (
        _actionType: number,
        strAppId: string,
        actionName: string
    ) => {
        const gameActionAppId = parseInt(strAppId);
        if (
            actionName == 'LaunchApp' &&
            appId == gameActionAppId &&
            !gameLaunching
        ) {
            setGameLaunching(true);
        } else {
            setGameLaunching(false);
        }
    };

    const onGameActionStart = SteamClient.Apps.RegisterForGameActionStart(
        handleGameActionStart
    );
    const onGameActionEnd = SteamClient.Apps.RegisterForGameActionEnd(
        handleGameActionStart
    );
    useEffect(() => {
        return function cleanup() {
            onGameActionStart.unregister();
            onGameActionEnd.unregister();
        };
    }, []);
    const {
        mainStat,
        mainPlusStat,
        completeStat,
        allStylesStat,
        gameId,
        showStats,
    } = useHltb(appId, game, serverApi);
    const { showMain, showMainPlus, showComplete, showAllStyles } =
        useStatPreferences();
    const hltbStyle = useStyle();
    const hideDetails = usePreference();
    const baseClass = hltbStyle === null ? 'hltb-info-absolute' : 'hltb-info';
    // Hide if there are no stats, show stats is false, all stats are hidden, or the game is launching
    const hide =
        (mainStat === mainPlusStat &&
            mainPlusStat === completeStat &&
            completeStat === allStylesStat &&
            allStylesStat === '--') ||
        !showStats ||
        gameLaunching;
    let hltbInfoStyle = '';
    switch (hltbStyle) {
        case 'clean':
        case 'clean-left':
            hltbInfoStyle = 'hltb-info-clean';
            break;
        case 'clean-default':
            hltbInfoStyle = 'hltb-info-clean-default';
            break;
    }
    const hltbInfoPosition =
        hltbStyle === 'clean-left' ? 'hltb-info-clean-left' : '';
    const btnStyle =
        hltbStyle === 'default' || hltbStyle === 'clean-default'
            ? ''
            : 'hltb-details-btn-clean';

    return (
        <div id={id} style={{ display: hide ? 'none' : 'block' }}>
            {style}
            <div
                className={`${baseClass} ${hltbInfoStyle} ${hltbInfoPosition}`}
            >
                <ul
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <li style={{ display: showMain ? 'block' : 'none' }}>
                        <p className="hltb-gametime">{mainStat} hours</p>
                        <p className="hltb-label">Main Story</p>
                    </li>
                    <li
                        style={{
                            display: showMainPlus ? 'block' : 'none',
                        }}
                    >
                        <p className="hltb-gametime">{mainPlusStat} hours</p>
                        <p className="hltb-label">Main + Extras</p>
                    </li>
                    <li
                        style={{
                            display: showComplete ? 'block' : 'none',
                        }}
                    >
                        <p className="hltb-gametime">{completeStat} hours</p>
                        <p className="hltb-label">Completionist</p>
                    </li>
                    <li
                        style={{
                            display: showAllStyles ? 'block' : 'none',
                        }}
                    >
                        <p className="hltb-gametime">{allStylesStat} hours</p>
                        <p className="hltb-label">All Styles</p>
                    </li>
                    {gameId && !hideDetails && (
                        <li>
                            <DialogButtonPrimary
                                className={`hltb-details-btn ${btnStyle}`}
                                onClick={() =>
                                    Navigation.NavigateToExternalWeb(
                                        `https://howlongtobeat.com/game/${gameId}`
                                    )
                                }
                            >
                                View Details
                            </DialogButtonPrimary>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};
