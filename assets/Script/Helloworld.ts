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
    TEST_2 = 'TEST_2'
}


@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start() {
        // init logic
        this.label.string = this.text;
        

        const self = this;
        this.scheduleOnce(()=>{
            // self.callTestEmitter();
            self.delayTestCommands();
        }, 1);
    }

    private delayTestCommands():void {
        const monitor = this.node.getComponentInChildren(CommandsMonitor);
        if (monitor) {
            monitor.execute(TestSayHiCMD);

            const lb = this.node.getComponentInChildren(cc.Label);
            monitor.execute(ChangeHelloWordCMD, lb);
        }
    }
    
    private callTestEmitter():void {
        //---test
        Global.Emitter = new Emitter();
    
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHiA);
        Global.Emitter.on(this, EVENTS.TEST_2, this.testSayHiB);
        
        Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHiA);
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHiA);
        Global.Emitter.offAll();

        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHiA);
        Global.Emitter.on(this, EVENTS.TEST_2, this.testSayHiB);
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHiA);


        this.scheduleOnce(() => {
            Global.Emitter.emit(EVENTS.TEST_SAY, 'A');
            Global.Emitter.emit(EVENTS.TEST_2, 'B');
        }, 2);
    
        Global.Emitter.emit(EVENTS.TEST_SAY, 'A');
        //---endtest
    }

    private testSayHiA(...params: any[]): void {
        console.log("test    hi " + params[0]);
        Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHiA);
    }

    
    private testSayHiB(...params: any[]): void {
        console.log("test    hi " + params[0]);
        //Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHi);
    }

    
    private testSayHi2(...params: any[]): void {
        console.log("test    hi " + params[0]);
        //Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHi);
    }
}
