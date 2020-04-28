// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Emitter from "../../frameworkHL/observer/Emitter";
import Helloworld, { EVENTS, Global } from "../../Helloworld";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestEmitter extends cc.Component {

    private _emitter: Emitter = null;

    onLoad(): void {

        //Global.Emitter = new Emitter();
    }

    onEnable(): void {

    }

    start(): void {

    }

    onDisable(): void {
        //Global.Emitter.offAll();
    }

    onDestroy(): void {
        //Global.Emitter = null;
    }

    private onClick(event: cc.Event.EventTouch): void {
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHiA);
        Global.Emitter.on(this, EVENTS.TEST_2, this.testSayHiB);
        Global.Emitter.on(this, EVENTS.TEST_MORE, this.testMore);
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHi2);

        //this.scheduleOnce(() => {
        Global.Emitter.emit(EVENTS.TEST_2, 'B');
        Global.Emitter.emit(EVENTS.TEST_SAY, 'A');
        Global.Emitter.emit(EVENTS.TEST_MORE, 'more@');
        Global.Emitter.emit(EVENTS.TEST_SAY, 'A');
        Global.Emitter.emit(EVENTS.TEST_2, 'B');
        //}, 3);

        this.scheduleOnce(() => {
            Global.Emitter.offAll();

            Global.Emitter.emit(EVENTS.TEST_SAY, 'A');
            Global.Emitter.emit(EVENTS.TEST_MORE, 'more@');
        }, 0.1);
    }

    private testSayHiA(...params: any[]): void {
        console.log("TestEmittertestSayHiA    hi " + params[0]);
    }


    private testSayHiB(...params: any[]): void {
        const comp: Helloworld = cc.director.getScene().getChildByName("Canvas").getComponent(Helloworld);
        Global.Emitter.off(comp, EVENTS.TEST_2, comp.testSayHiB);
        console.log("TestEmittertestSayHiB    hi " + params[0]);
    }


    private testMore(...params: any[]): void {
        console.log("TestEmittertestMore    more " + params[0]);
    }

    private testSayHi2(...params: any[]): void {
        console.log("TestEmittertestSayHi2    hi " + params[0]);
    }
}
