import Emitter from "./frameworkHL/observer/Emitter";

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
            self.callTest();
        }, 1);
    }
    
    private callTest():void {
        //---test
        Global.Emitter = new Emitter();
    
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHi);
        Global.Emitter.on(this, EVENTS.TEST_2, this.testSayHi);
        //console.log();//Global.Emitter.listeners
        
        Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHi);
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHi);
        Global.Emitter.offAll();

        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHi);
        Global.Emitter.on(this, EVENTS.TEST_2, this.testSayHi);
        Global.Emitter.on(this, EVENTS.TEST_SAY, this.testSayHi);


        this.scheduleOnce(() => {
            Global.Emitter.off(this, EVENTS.TEST_SAY, this.testSayHi);

            Global.Emitter.emit(EVENTS.TEST_2, 'B');
        }, 2);
    
        Global.Emitter.emit(EVENTS.TEST_SAY, 'A');
        //---endtest
    }

    private testSayHi(...params: any[]): void {
        console.log("test    hi " + params[0]);
    }
}
