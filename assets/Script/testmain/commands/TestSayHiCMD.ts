import BaseCommand from "../../frameworkHL/command/BaseCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestSayHiCMD extends BaseCommand {

    init(...params: any[]): void {
    }

    execute(...param: any[]): Boolean {
        console.log("TestSayHiCMD: hi, everybody");
        return true;
    }
}
