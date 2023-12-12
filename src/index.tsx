import { definePlugin, ServerAPI, staticClasses } from 'decky-frontend-lib';
import { FaGamepad } from 'react-icons/fa';
import { patchAppPage } from './patches/LibraryApp';
import { QuickAccessView } from './components/QuickAccessView/QuickAccessView';
import contextMenuPatch, {
    LibraryContextMenu,
} from './patches/LibraryContextMenu';
import { LoadingScreen } from './components/LoadingScreen';

export default definePlugin((serverAPI: ServerAPI) => {
    const libraryContextMenuPatch = contextMenuPatch(LibraryContextMenu); //patchAppPage(serverAPI);
    const libraryAppPagePatch = patchAppPage(serverAPI);
    serverAPI.routerHook.addRoute('/hltb-for-deck/loading', LoadingScreen);
    return {
        title: <div className={staticClasses.Title}>HLTB for Deck</div>,
        icon: <FaGamepad />,
        content: <QuickAccessView />,
        onDismount() {
            libraryContextMenuPatch?.unpatch();
            serverAPI.routerHook.removePatch(
                '/library/app/:appid',
                libraryAppPagePatch
            );
            serverAPI.routerHook.removeRoute('/hltb-for-deck/loading');
        },
    };
});
