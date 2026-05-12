import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import type window from "@ohos:window";
import Logger from "@bundle:com.samples.arktscalc/entry/ets/model/Logger";
const TAG: string = 'EntryAbility';
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam) {
        Logger.info(TAG, 'EntryAbility onCreate');
    }
    onDestroy(): void {
        Logger.info(TAG, 'EntryAbility onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        // Main window is created, set main page for this ability
        Logger.info(TAG, 'EntryAbility onWindowStageCreate');
        windowStage.loadContent('pages/Index', (err, data) => {
            if (err.code) {
                Logger.info(TAG, 'Failed to load the content. Cause: ${JSON.stringify(err)}');
                return;
            }
            Logger.info(TAG, 'Failed to load the content. Cause: ${JSON.stringify(data)}');
        });
    }
    onWindowStageDestroy(): void {
        // Main window is destroyed, release UI related resources
        Logger.info(TAG, 'MainAbility onWindowStageDestroy');
    }
    onForeground(): void {
        // Ability has brought to foreground
        Logger.info(TAG, 'MainAbility onForeground');
    }
    onBackground(): void {
        // Ability has back to background
        Logger.info(TAG, 'MainAbility onBackground');
    }
}
