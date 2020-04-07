import IDestroyable from "./IDestroyable";

export default interface IObserver extends IDestroyable {
    execute(...param: any[]): Boolean;
    context(): any;
    name(): string | number;
    func(): Function;
}