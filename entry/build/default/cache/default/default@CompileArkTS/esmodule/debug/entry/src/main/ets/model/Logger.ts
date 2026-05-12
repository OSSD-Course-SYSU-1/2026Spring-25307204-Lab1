import hilog from "@ohos:hilog";
const DOMAIN = 0xFF00;
class Logger {
    private prefix: string = '';
    private format: string = '%{public}s, %{public}s';
    constructor(prefix: string) {
        this.prefix = prefix;
    }
    debug(...args: string[]): void {
        hilog.debug(DOMAIN, this.prefix, this.format, args);
    }
    info(...args: string[]): void {
        hilog.info(DOMAIN, this.prefix, this.format, args);
    }
    warn(...args: string[]): void {
        hilog.warn(DOMAIN, this.prefix, this.format, args);
    }
    error(...args: string[]): void {
        hilog.error(DOMAIN, this.prefix, this.format, args);
    }
}
export default new Logger('[Sample_etsdistributedcalc]');
