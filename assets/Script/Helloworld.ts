import Emitter from "./frameworkHL/observer/Emitter";
import CommandsMonitor from "./frameworkHL/command/CommandsMonitor";
import TestSayHiCMD from "./testmain/commands/TestSayHiCMD";
import ChangeHelloWordCMD from "./testmain/commands/ChangeHelloWordCMD";

const { ccclass, property } = cc._decorator;

export class Global {
    public static Emitter: Emitter = null;
}

export enum EVENTS {
    TEST_SAY = 'TEST_SAY',
    TEST_2 = 'TEST_2',
    TEST_MORE = 'TEST_MORE'
}


@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello   ddddd';

    start() {
        // init logic
        this.label.string = this.text;


        const self = this;
        //this.scheduleOnce(() => {
        self.callTestEmitter();
        //self.delayTestCommands();
        //}, 2);

        Set
    }

    private delayTestCommands(): void {

        // console.log("---------" + TypeClass.getType(CommandsMonitor));
        // console.log("---------" + TypeClass.getType(TestSayHiCMD));
        // console.log("---------" + TypeClass.getType(ChangeHelloWordCMD));
        const testMapKey = {};
        testMapKey[CommandsMonitor.toString()] = new CommandsMonitor();


        const monitor = this.node.getComponentInChildren(CommandsMonitor);
        monitor.add(ChangeHelloWordCMD);
        if (monitor) {
            monitor.execute(TestSayHiCMD);

            const lb = this.node.getComponentInChildren(cc.Label);
            monitor.execute(ChangeHelloWordCMD, lb);
        }

        //monitor
    }

    private callTestEmitter(): void {
        //---test
        Global.Emitter = new Emitter();

        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHiA);
        Global.Emitter.on(this, EVENTS.TEST_2, this.testSayHiB);
        Global.Emitter.on(this, EVENTS.TEST_MORE, this.testMore);
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHi2);

        //---endtest
    }

    private testSayHiA(...params: any[]): void {
        console.log("testSayHiA    hi " + params[1]);
        //Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHiA);
    }


    public testSayHiB(...params: any[]): void {
        console.log("testSayHiB    hi " + params[1]);
        Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHiA);
    }


    private testMore(...params: any[]): void {
        console.log("testMore    more " + params[1]);
        //Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHi);
    }


    private testSayHi2(...params: any[]): void {
        console.log("testSayHi2    hi " + params[1]);
        //Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHi);
    }
}
