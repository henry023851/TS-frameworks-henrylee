import IDestroyable from "./IDestroyable";

/**
 * 定义联合类型 string | number
 * 消息的类型可以是string也可以是number
 * 定义number类型的消息要注意避免冲突，最好是集中管理消息定义
 */
export type KEYS_UNION = string | number;

/**
 * IObserver
 * 主要用途：观察者接口
 * @author henry lee
 * @date 2020.04.03   create
 */
export interface IObserver extends IDestroyable {
    execute(...param: any[]): boolean;
    context(): any;
}


/**
 * 消息中心（观察者模式）
 * 1、on(context: any, event: number | string, func: Function): boolean;
 * 注册一个观察者
 * 2、off(context: any, event: number | string, func?: Function): void;
 * 移除一个观察者
 * 3、emit(name: number | string, ...params: any[]): void;
 * 触发一个消息
 * 
 * @author henry lee
 * @date 2020.4.3
 */
export default class Emitter implements IDestroyable {

    private _listeners: { [key in KEYS_UNION]: IObserver[] } = null;

    constructor() {
        this._listeners = {};
    }

    /**注册一个观察者 */
    public on(context: any, event: number | string, func: (...param: any[]) => void): boolean {
        if (null == context || null == func) {
            return false;
        }

        const observers: IObserver[] = this._listeners[event];
        //检查是否有同类型的侦听器组
        if (null == observers) {
            this._listeners[event] = [Observer.create(context, func)];
        } else {
            //检查是否同一个context已经注册过同类型侦听器
            const len: number = observers.length;
            for (let index = 0; index < len; index++) {
                const observer: IObserver = observers[index];
                if (observer.context() === context) {
                    return false;
                }
            }
            observers.push(Observer.create(context, func));
        }
        return true;
    }

    /**移除一个观察者 */
    public off(context: any, event: number | string): void {
        const observers: IObserver[] = this._listeners[event];
        if (!observers) return;

        let n: number = observers.length;
        while (--n > -1) {
            let observer = observers[n];
            if (observer.context() === context) {
                observers.splice(n, 1);
                break;
            }
        }

        if (observers.length == 0) {
            delete this._listeners[event];
        }
    }

    /**触发消息 */
    public emit(event: number | string, ...params: any[]): void {
        const observers: IObserver[] = this._listeners[event];
        if (!observers) return;

        //遍历过程中如果有插入和删除操作，会造成逻辑混乱，所以临时复制一份
        const array: IObserver[] = observers.concat();
        array.forEach(observer => {
            observer.execute(event, ...params);
        });
    }

    /**移除所有观察者 */
    public offAll(): void {
        for (let key in this._listeners) {
            if (this._listeners.hasOwnProperty(key)) {
                const array: IObserver[] = this._listeners[key];
                array.forEach(observer => {
                    observer.destroy();
                });
            }
        }
        this._listeners = {};
    }

    public destroy(): void {
        this.offAll();
    }
}

/**
 * Observer
 * 主要用途：观察者
 * @author henry lee
 * @date 2020.04.03   create
 */
export class Observer implements IObserver {
    private _context: any = null;
    private _func: (...param: any[]) => void = null;

    /**请使用create方法来创建Observer */
    public static create(context: any, func: (...param: any[]) => void): Observer {
        if (null == context || null == func) {
            return null;
        }

        const observer = new Observer();
        observer._func = func;
        observer._context = context;
        func.bind(context);
        return observer;
    }

    public execute(...param: any[]): boolean {
        this._func(...param);
        return true;
    }

    public context(): any {
        return this._context;
    }

    public destroy(): void {
        this._context = null;
        this._func = null;
    }
}