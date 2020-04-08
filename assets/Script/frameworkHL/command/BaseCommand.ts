import ICommand from "../interface/ICommand";
import InfoMSG from "../comm/InfoMSG";

const { ccclass, property } = cc._decorator;

/**
 * CommandMonitor
 * 主要用途：继承cc.Component的同时实现ICommand接口
 * @author henry lee
 * @date 2020.04.03   create
 * 
 */
@ccclass
export default abstract class BaseCommand extends cc.Component implements ICommand {

    public constructor() {
        super();
        this.init();
    }

    /**实例化时被调用一次 */
    init(...params: any[]): void {
        console.log("CMD<" + this.name + "> hasInit!");
    }

    execute(...param: any[]): Boolean {
        throw new Error(InfoMSG.ABSTRACT_CLASS_INIT);
    }
}
