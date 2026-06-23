import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import type window from "@ohos:window";
import Logger from "@bundle:com.samples.arktscalc/entry/ets/model/Logger";
import { ContinuationManager } from "@bundle:com.samples.arktscalc/entry@common/index";
import type { WantParam } from "@bundle:com.samples.arktscalc/entry@common/index";
const TAG: string = 'EntryAbility';
export default class EntryAbility extends UIAbility {
    private continuationManager: ContinuationManager = ContinuationManager.getInstance();
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam) {
        Logger.info(TAG, 'EntryAbility onCreate');
        this.continuationManager.onCreate(want, launchParam);
    }
    onDestroy(): void {
        Logger.info(TAG, 'EntryAbility onDestroy');
        this.continuationManager.destroy();
    }
    onContinue(wantParam: WantParam): number {
        Logger.info(TAG, 'EntryAbility onContinue');
        return this.continuationManager.onContinue(wantParam);
    }
    onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        Logger.info(TAG, 'EntryAbility onNewWant');
        this.continuationManager.onNewWant(want, launchParam);
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
