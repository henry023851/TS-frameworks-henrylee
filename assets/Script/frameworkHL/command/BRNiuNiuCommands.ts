import ICommand from "../interface/ICommand";
import StrictMap from "../util/StrictMap";
import BRNN_back2HallCommand from "./commands/BRNN_back2HallCommand";
import Emitter from "../observer/Emitter";

const { ccclass, property } = cc._decorator;

/**
 * 百人场牛牛 Command Monitor
 * 主要用途：作为业务处理逻辑(Commands)的管理者
 * Controller管理复杂业务逻辑，作为绑定脚本，绑定在场景的节点上,方便协同工作时其他程序员快速了解一个模块的业务逻辑;
 * cocos creator采用的是面向组件开发思路，尽量写组件(Component),不要写继承(extends)，才是cocos提倡的开发范式；
 * @author henry lee
 * @date 2020.04.03   create
 */
@ccclass
export default class BRNiuNiuCommands extends cc.Component {

    /**返回大厅业务处理 */
    public static BRNN_back2HallHandler: string = "BRNN_back2HallCommand";
    //...more
    
    private emitter: Emitter = null;

    /**Commands Map, 业务Map<ICommand> */
    private _cmdMap: StrictMap<ICommand> = null;


    public onLoad(): void {
        this.initialize();
    }


    public onDestroy(): void {
        this.emitter.onDestroy();
        this.emitter = null;

        this._cmdMap.getAllVals().forEach(element => {
            element.destroy();
        });
        this._cmdMap.destroy();
        this._cmdMap = null;
    }



    /**初始化 */
    private initialize(): void {
        this.emitter = new Emitter();
        this.registCommands();
    }



    /**绑定Commands */
    private registCommands(): void {
        this._cmdMap = new StrictMap<ICommand>();
        this._cmdMap.put(BRNiuNiuController.BRNN_back2HallHandler, (new BRNN_back2HallCommand()));
    }



    public excuteCMD(type: string, ...param: any[]): void {
        let _cmd: ICommand = this._cmdMap.get(type);
        _cmd && _cmd.excute.bind(this, ...param);
    }
}
