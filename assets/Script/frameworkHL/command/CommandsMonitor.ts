import StrictMap from "../util/StrictMap";
import BaseCommand from "./BaseCommand";
import TypeClass from "../comm/TypeClass";

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
        type: [BaseCommand],
        tooltip: "编辑器绑定Command",
        displayName: "Commands"
    })
    bindCMD: BaseCommand[] = [];

    /**严格要求存储对象类型 */
    private _cmdMap: StrictMap<BaseCommand> = null;

    public constructor() {
        super();

        this._cmdMap = new StrictMap<BaseCommand>();
    }

    /**重新绑定一次Command */
    public onLoad(): void {
        this.retrieveCmd();
    }

    /**把编辑器绑定的Command重新注册一遍 */
    private retrieveCmd(): void {
        let n: number = this.bindCMD.length;
        while (--n > -1) {
            const cmd = this.bindCMD[n];
            //cmd是实例，获取构造函数作为参数
            const type: string = TypeClass.getType(cmd.constructor);
            if (cmd && "" != type) {
                this._cmdMap.set(type, cmd);
            }
        }
    }

    /**加载Command */
    //可以优化为类似注册观察者的方案，通过键值对来存储和访问
    public add(command: { new(): BaseCommand }): void {
        this._cmdMap.set(TypeClass.getType(command), new command());
    }

    /**卸载Command */
    public remove(command: { new(): BaseCommand }): BaseCommand {
        const type = TypeClass.getType(command);
        const cmd = this._cmdMap.delete(type);
        return cmd;
    }

    /**执行Command */
    public execute(command: { new(): BaseCommand }, ...param: any[]): Boolean {
        const type = TypeClass.getType(command);
        const cmd = this._cmdMap.get(type);
        const bRlt = (cmd && cmd.execute(...param));
        return bRlt;
    }

    public clear(): void {
        const _mpg = this._cmdMap.getAllVals();
        for (const key in _mpg) {
            if (_mpg.hasOwnProperty(key)) {
                _mpg[key].destroy();
            }
        }
        this._cmdMap.clear();
    }

    public onDestroy(): void {
        this.clear();
        this.bindCMD = [];
    }
}
