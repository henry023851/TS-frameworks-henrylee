import IDestroyable from "./IDestroyable";

/**
 * ICommand
 * 实现类要继承cc.Component
 * @author henry lee
 * @date 2020.04.03   create
 */
export default interface ICommand extends IDestroyable {
    init(...params: any[]): void;
    execute(...param: any[]): Boolean;
}