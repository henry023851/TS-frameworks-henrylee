import IDestroyable from "../interface/IDestroyable";
import { KEYS_UNION } from "../comm/FWConst";

/**
 * 严格定义可存储对象类型 Map
 * ECMAScript 6 已经提供了Map 可以使用系统库提供的
 * @author henry lee
 * @date 2020.4.3
 * 
 */
export default class StrictMap<U> implements IDestroyable {

    private _valDic: { [key in KEYS_UNION]: U } = null;

    constructor() {
        this._valDic = {};
    }

    public set(key: string | number, val: U): void {
        this._valDic[key] = val;
    }

    public get(key: string | number): U {
        return this._valDic[key];
    }

    public getAllVals(): U[] {
        const arr: U[] = new Array<U>();
        //当number作为键值时，需要测试是否有bug
        for (let key in this._valDic) {
            if (this._valDic.hasOwnProperty(key)) {
                arr.push(this._valDic[key]);
            }
        }
        return arr;
    }

    public delete(key: string | number): U {
        let val: U = null;
        if (this._valDic.hasOwnProperty(key)) {
            val = this._valDic[key];
            delete this._valDic[key];
        }
        return val;
    }

    public clear(): void {
        this._valDic = {};
    }

    public destroy(): void {
        this.clear();
    }
}