import IDestroyable from "../interface/IDestroyable";
import { KEYS_UNION } from "../comm/FWConst";

/**
 * IObserver
 * 主要用途：观察者接口
 * @author henry lee
 * @date 2020.04.03   create
 */
export interface IObserver extends IDestroyable {
    execute(...param: any[]): boolean;
    context(): any;
    func(): CallBackFunc;
}

/**
 * 注册观察者回调函数
 */
export type CallBackFunc = (eventType: number | string, ...param: any[]) => void;


/**
 * 消息中心（观察者模式）
 * 1、on(context: any, name: number | string, func: Function): boolean;
 * 注册一个观察者
 * 2、off(context: any, name: number | string, func?: Function): void;
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
    public on(context: any, eventName: number | string, func: CallBackFunc): boolean {
        if (null == context || null == func) {
            return false;
        }

        const observers: IObserver[] = this._listeners[eventName];
        //检查是否有同类型的侦听器组
        if (null == observers) {
            this._listeners[eventName] = [Observer.create(context, func)];
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
    public off(context: any, eventName: number | string, func?: CallBackFunc): void {
        const observers: IObserver[] = this._listeners[eventName];
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
            delete this._listeners[eventName];
        }
    }

    /**触发消息 */
    public emit(eventName: number | string, ...params: any[]): void {
        const observers: IObserver[] = this._listeners[eventName];
        if (!observers) return;

        //遍历过程中如果有插入和删除操作，会造成逻辑混乱，所以临时复制一份
        const array: IObserver[] = observers.concat();
        array.forEach(observer => {
            observer.execute(eventName, ...params);
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
    private _func: CallBackFunc = null;

    /**请使用create方法来创建Observer */
    public static create(context: any, func: CallBackFunc): Observer {
        if (null == context || null == func) {
            return null;
        }

        const observer = new Observer();
        observer._func = func;
        observer._context = context;
        func.bind(context);
        return observer;
    }

    public execute(eventType: number | string, ...param: any[]): boolean {
        this._func(eventType, ...param);
        return true;
    }

    public context(): any {
        return this._context;
    }

    public func(): CallBackFunc {
        return this._func;
    }

    public destroy(): void {
        this._context = null;
        this._func = null;
    }
}