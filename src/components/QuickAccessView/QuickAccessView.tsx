import {
    PanelSection,
    PanelSectionRow,
    ButtonItem,
    Router,
    DropdownItem,
    ToggleField,
} from 'decky-frontend-lib';
import {
    clearCache,
    hideDetailsKey,
    statPreferencesKey,
    styleKey,
    updateCache,
} from '../../hooks/Cache';
import { usePreference, useStyle } from '../../hooks/useStyle';
import { useStatPreferences } from '../../hooks/useStatPreferences';

const styleOptions = [
    { data: 0, label: 'Default', value: 'default' },
    { data: 1, label: '"Clean"', value: 'clean' },
    { data: 2, label: '"Clean" Left', value: 'clean-left' },
    { data: 3, label: '"Clean" Default', value: 'clean-default' },
] as const;

export const QuickAccessView = () => {
    const handleClearCache = () => {
        clearCache();
        Router.CloseSideMenus();
    };
    const style = useStyle();
    // probably overkill for something so simple but it's fine :)
    const hideDetails = usePreference();

    const preferences = useStatPreferences();

    const toggleShowMain = () => {
        preferences.showMain = !preferences.showMain;
        updateCache(statPreferencesKey, preferences);
    };

    const toggleShowMainPlus = () => {
        preferences.showMainPlus = !preferences.showMainPlus;
        updateCache(statPreferencesKey, preferences);
    };

    const toggleShowComplete = () => {
        preferences.showComplete = !preferences.showComplete;
        updateCache(statPreferencesKey, preferences);
    };

    const toggleShowAllStyles = () => {
        preferences.showAllStyles = !preferences.showAllStyles;
        updateCache(statPreferencesKey, preferences);
    };
    return (
        <PanelSection>
            <PanelSectionRow>
                <DropdownItem
                    label="HLTB Style"
                    description='The "Clean" styles are intended to work with the CSS Loader Theme "Clean Gameview"'
                    menuLabel="HLTB Style"
                    rgOptions={styleOptions.map((o) => ({
                        data: o.data,
                        label: o.label,
                    }))}
                    selectedOption={
                        styleOptions.find((o) => o.value === style)?.data || 0
                    }
                    onChange={(newVal: { data: number; label: string }) => {
                        const newStyle =
                            styleOptions.find((o) => o.data === newVal.data)
                                ?.value || 'default';
                        updateCache(styleKey, newStyle);
                    }}
                />
            </PanelSectionRow>
            <PanelSectionRow>
                <ToggleField
                    label='Hide "View Details"'
                    description='Hides "View Details" button on HLTB Stats'
                    checked={hideDetails}
                    onChange={(checked) => updateCache(hideDetailsKey, checked)}
                />
            </PanelSectionRow>
            <PanelSectionRow>
                <ToggleField
                    label="Toggle main stat"
                    description="Shows/Hides just the main stat"
                    checked={preferences.showMain}
                    onChange={() => toggleShowMain()}
                />
            </PanelSectionRow>
            <PanelSectionRow>
                <ToggleField
                    label="Toggle main+ stat"
                    description="Shows/Hides just the main+ stat"
                    checked={preferences.showMainPlus}
                    onChange={() => toggleShowMainPlus()}
                />
            </PanelSectionRow>
            <PanelSectionRow>
                <ToggleField
                    label="Toggle completionist stat"
                    description="Shows/Hides just the completionist stat"
                    checked={preferences.showComplete}
                    onChange={() => toggleShowComplete()}
                />
            </PanelSectionRow>
            <PanelSectionRow>
                <ToggleField
                    label="Toggle 'all play styles' stat"
                    description="Shows/Hides just the all play styles stat"
                    checked={preferences.showAllStyles}
                    onChange={() => toggleShowAllStyles()}
                />
            </PanelSectionRow>
            <PanelSectionRow>
                <ButtonItem layout="below" onClick={handleClearCache}>
                    Clear Cache
                </ButtonItem>
            </PanelSectionRow>
        </PanelSection>
    );
};
