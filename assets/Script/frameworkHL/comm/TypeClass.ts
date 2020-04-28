/**
 * TypeClass
 * 主要用途：解析类型名称
 * @author henry lee
 * @date 2020.04.09   create
 * 
 */
export default class TypeClass {
    static FUNC_NAME_REGEX: RegExp = /function (.+?)\(/;

    /**
     * 解析类型名称
     * @param inputClass 类或者实例的构造函数
     */
    static getType(inputClass: { new() } | Function): string {
        const result: RegExpExecArray = this.FUNC_NAME_REGEX.exec(inputClass.toString());
        return (result && result.length > 1) ? result[1] : null;
    }
}