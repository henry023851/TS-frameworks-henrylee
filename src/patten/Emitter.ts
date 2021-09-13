import IDestroyable from "./IDestroyable";
import Pool from "./Pool";

/**
 * 定义联合类型 string | number
 * 消息的类型可以是string也可以是number
 * 定义number类型的消息要注意避免ID冲突，最好是集中管理所有消息定义
 */
type U_EVENT_KEY_TYPE = string | number;

/**
 * IObserver
 * 主要用途：观察者接口
 * @author henry lee
 * @date 2020.04.03   create
 */
export interface IObserver extends IDestroyable {
  execute(...param: any[]): boolean;
  clear(): void;
  context(): any;
}

/**
 * 消息中心（观察者模式）
 * @author henry lee
 * @date 2020.4.3
 */
export class Emitter implements IDestroyable {
  private _listeners: { [key in U_EVENT_KEY_TYPE]: IObserver[] } = null;

  constructor() {
    this._listeners = {};
  }

  /**
   * 注册一个观察者
   * @param context
   * @param event
   * @param func
   * @returns true 创建成功    false已经有一个同类型的
   */
  public on(event: U_EVENT_KEY_TYPE, context: any, func: Function): boolean {
    if (null === context || null === func) {
      return false;
    }

    const observers: IObserver[] = this.getObserversByType(event);
    const len: number = observers.length;
    for (let index = 0; index < len; index++) {
      //检查是否同一个context已经注册过同类型侦听器
      if (observers[index].context() === context) {
        return false;
      }
    }
    observers.push(Observer.create(context, func));
    return true;
  }

  /**
   * 移除一个观察者
   * @param context
   * @param event
   */
  public off(event: U_EVENT_KEY_TYPE, context: any): void {
    const observers: IObserver[] = this.getObserversByType(event);
    let n: number = observers.length;
    while (--n > -1) {
      let observer = observers[n];
      if (observer.context() === context) {
        const observer: IObserver = observers.splice(n, 1)[0];
        observer.clear();
        Observer.recover(observer);
        break;
      }
    }
  }

  /**
   * 触发消息
   * @param event
   * @param params
   */
  public emit(event: U_EVENT_KEY_TYPE, ...params: any[]): void {
    const observers: IObserver[] = this.getObserversByType(event);
    //遍历过程中如果有插入和删除操作，会造成逻辑混乱，所以临时复制一份
    const array: IObserver[] = observers.concat();
    array.forEach((observer) => {
      observer.execute(event, ...params);
    });
  }

  /**
   * 获取事件的所有Observer
   * @param event
   * @returns
   */
  private getObserversByType(event: U_EVENT_KEY_TYPE): IObserver[] {
    return this._listeners[event] || (this._listeners[event] = []);
  }

  /**移除所有观察者 */
  public offAll(): void {
    for (let key in this._listeners) {
      if (this._listeners.hasOwnProperty(key)) {
        const array: IObserver[] = this._listeners[key];
        array.forEach((observer) => {
          observer.clear();
          Observer.recover(observer);
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
  /**存取键值 */
  public static POOL_SKEY: string = "PoolEmitterObserver";

  private _context: any = null;
  private _func: Function = null;

  /**
   * 请使用create方法来创建Observer
   * @param context
   * @param func
   * @returns
   *
   */
  public static create(context: any, func: Function): Observer {
    if (null === context || null === func) {
      return null;
    }

    const observer: Observer = Pool.getItemByClass(
      Observer.POOL_SKEY,
      Observer
    );
    observer._func = func;
    observer._context = context;
    func.bind(context);
    return observer;
  }

  /**
   * 回收对象
   * @param oberver
   */
  public static recover(oberver: IObserver): void {
    Pool.recover(Observer.POOL_SKEY, oberver);
  }

  public execute(...param: any[]): boolean {
    this._func.call(this._context, ...param);
    return true;
  }

  public context(): any {
    return this._context;
  }

  public clear(): void {
    this._context = null;
    this._func = null;
  }

  public destroy(): void {
    this.clear();
  }
}
