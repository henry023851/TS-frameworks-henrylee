import ICommand from "../../frameworkHL/interface/ICommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChangeHelloWordCMD extends cc.Component implements ICommand {

    init(...params: any[]): void {
        //throw new Error("Method not implemented.");
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
