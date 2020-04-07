import ICommand from "../interface/ICommand";
import StrictMap from "../util/StrictMap";

const { ccclass, property } = cc._decorator;

/**
 * CommandMonitor
 * 主要用途：作为Commands的管理者
 * @author henry lee
 * @date 2020.04.03   create
 * 
 */
@ccclass
export default class CommandsMonitor extends cc.Component {

    /**供编辑器外部绑定Commands */
    @property({
        type: [cc.Component],
        tooltip: "Bind commands"
    })
    mapComm: any[] = [];

    /**严格要求存储对象类型 */
    private _cmdMap: StrictMap<ICommand> = null;

    public constructor() {
        super();

        this._cmdMap = new StrictMap<ICommand>();
    }

    /**重新绑定一次Command */
    public onLoad(): void {
        this.retrieveCmd();
    }

    /**把编辑器绑定的Command重新注册一遍 */
    private retrieveCmd(): void {
        let n: number = this.mapComm.length;
        while (--n > -1) {
            const cmd = this.mapComm[n];
            const type: string = (cmd as cc.Component).node.name;
            if (cmd && "" != type) {
                this._cmdMap.put(type, cmd);
                console.log("add command: " + type);
            }
        }
    }

    /**加载Command */
    public add<T extends ICommand>(command: { new(): T }): T {
        const cmd = new command();
        cmd.init();
        this._cmdMap.put(command.name, cmd)
        console.log("add command: " + (command.name));
        return cmd;
    }

    /**卸载Command */
    public remove<T extends ICommand>(command: { new(): T }): T {
        const type = command.name;
        const cmd = this._cmdMap.delete(type);
        console.log("remove command: " + type);
        return (cmd as T);
    }

    public execute<T extends ICommand>(command: { new(): T }, ...param: any[]): Boolean {
        const type = command.name;
        const cmd = this._cmdMap.get(type);
        const bool = (cmd && cmd.execute(...param));
        console.log("execute command: " + type + " " + bool);
        return bool;
    }

    public clear(): void {
        this._cmdMap.clear();
    }

    public onDestroy(): void {
        super.onDestroy();
        this.clear();
        this.mapComm = [];
    }
}
