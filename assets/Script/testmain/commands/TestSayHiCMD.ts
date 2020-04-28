import BaseCommand from "../../frameworkHL/command/BaseCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestSayHiCMD extends BaseCommand {

    execute(...param: any[]): Boolean {
        console.log("TestSayHiCMD: hi, everybody");
        return true;
    }
}
