import IDestroyable from "../interface/IDestroyable";

/**定义联合类型 */
type KEYS_UNION = string | number;

/**
 * 严格定义可存储对象类型 Map
 * @author henry lee
 * @date 2020.4.3
 * 
 */
export default class StrictMap<U extends IDestroyable> implements IDestroyable {

    private _valDic: { [key in KEYS_UNION]: U } = null;

    constructor() {
        this._valDic = {};
    }

    public put(key: string | number, val: U): void {
        this._valDic[key] = val;
    }

    public get(key: string | number): U {
        return this._valDic[key];
    }

    public getAllVals(): U[] {
        let arr: U[] = new Array<U>();
        //当number作为键值时，需要测试是否有bug
        for (const key in this._valDic) {
            if (this._valDic.hasOwnProperty(key)) {
                arr.push(this._valDic[key]);
            }
        }
        return arr;
    }

    public getAll(): { [key in KEYS_UNION]: U } {
        //应该复制一份数据返回
        return this._valDic;
    }

    public delete(key: string | number): U {
        var val: U = null;
        if (this._valDic.hasOwnProperty(key)) {
            val = this._valDic[key];
            delete this._valDic[key];
        }
        return val;
    }

    /**
     * 清空所有键值对
     */
    public clear(): void {
        for (const key in this._valDic) {
            if (this._valDic.hasOwnProperty(key)) {
                this._valDic[key].destroy();
            }
        }
        this._valDic = {};
    }

    public destroy(): void {
        this.clear();
        this._valDic = null;
    }
}