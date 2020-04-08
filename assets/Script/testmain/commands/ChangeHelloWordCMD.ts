import BaseCommand from "../../frameworkHL/command/BaseCommand";

const { ccclass, property } = cc._decorator;




@ccclass
export default class ChangeHelloWordCMD extends BaseCommand {

    init(...params: any[]): void {
    }

    execute(...param: any[]): Boolean {
        const lb: cc.Label = param[0];
        if (lb) {
            lb.string = "ChangeHelloWordCMD: hi";
            return true;
        }
        return false;
    }
}
