import IObserver from "../interface/IObserver";

/**
 * Observer
 * 主要用途：观察者
 * @author henry lee
 * @date 2020.04.03   create
 */
export default class Observer implements IObserver {
    private _context: any = null;
    private _name: number | string = null;
    private _func: Function = null;

    /**请使用create方法来创建Observer */
    public static create(context: any, name: number | string, func: Function): Observer {
        let observer = new Observer();
        observer._name = name;
        observer._func = func;
        observer._context = context;
        return observer;
    }

    public execute(...param: any[]): Boolean {
        if (null == this._context || null == this._func || null == this._name) {
            return false;
        }

        this._func.call(this._context, param);
        return true;
    }

    public context(): any {
        return this._context;
    }

    public name(): string | number {
        return this._name;
    }

    public func(): Function {
        return this._func;
    }

    public destroy(): void {
        this._context = null;
        this._name = null;
        this._func = null;
    }
}