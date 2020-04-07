import IDestroyable from "./IDestroyable";


export default interface ICommand extends IDestroyable {
    init(): void;
    execute(...param: any[]): Boolean;
}