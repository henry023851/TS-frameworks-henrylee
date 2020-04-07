import Observer from "./Oberver";
import IDestroyable from "../interface/IDestroyable";
import IObserver from "../interface/IObserver";

/**定义联合类型 */
type KEYS_UNION = string | number;

/**
 * 消息中心（观察者模式）
 * @author henry lee
 * @date 2020.4.3
 */
export default class Emitter implements IDestroyable {

    private listeners: { [key in KEYS_UNION]: IObserver[] } = {};

    public on(context: any, name: number | string, func: Function): Boolean {
        const observers: IObserver[] = this.listeners[name];
        //检查是否有同类型的侦听器组
        if (null == observers) {
            this.listeners[name] = new Array<IObserver>();
        } else {
            //检查是否同一个context已经注册过同类型侦听器
            const len = observers.length;
            for (let index = 0; index < len; index++) {
                const element = observers[index];
                if (element.context() === context) {
                    return false;
                }
            }
        }
        this.listeners[name].push(Observer.create(context, name, func));
        return true;
    }

    public off(context: any, name: number | string, func?: Function): void {
        const observers: IObserver[] = this.listeners[name];
        if (!observers) return;

        let n: number = observers.length;
        while (--n > -1) {
            let observer = observers[n];
            if (observer.context() === context) {
                observer = observers.splice(n, 1)[0];
                break;
            }
        }

        if (observers.length == 0) {
            delete this.listeners[name];
        }
    }

    /**触发事件 */
    public emit(name: number | string, ...params: any[]): void {
        const observers: IObserver[] = this.listeners[name];
        if (!observers) return;

        //遍历过程中如果有插入和删除操作，会造成逻辑混乱，所以复制一份
        const arr: IObserver[] = observers.concat();
        arr.forEach(observer => {
            observer.execute(params);
        });
    }

    public offAll(): void {
        for (const key in this.listeners) {
            if (this.listeners.hasOwnProperty(key)) {
                const arr: IObserver[] = this.listeners[key];
                arr.forEach(observer => {
                    observer.destroy();
                });
            }
        }
        this.listeners = {};
    }

    public destroy(): void {
        this.offAll();
    }
}
