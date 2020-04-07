import ICommand from "../../frameworkHL/interface/ICommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestSayHiCMD extends cc.Component implements ICommand {

    init(...params: any[]): void {
        //throw new Error("Method not implemented.");
    }

    execute(...param: any[]): Boolean {
        console.log("TestSayHiCMD: hi, everybody");
        return true;
    }
}
