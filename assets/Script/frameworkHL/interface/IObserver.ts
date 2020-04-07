import IDestroyable from "./IDestroyable";

/**
 * IObserver
 * 主要用途：观察者
 * @author henry lee
 * @date 2020.04.03   create
 */
export default interface IObserver extends IDestroyable {
    execute(...param: any[]): Boolean;
    context(): any;
    name(): string | number;
    func(): Function;
}