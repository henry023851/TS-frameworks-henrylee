/**
 * <p> <code>Pool</code> 是对象池类，用于对象的存贮、重复使用。</p>
 * <p>合理使用对象池，可以有效减少对象创建的开销，避免频繁的垃圾回收，从而优化游戏流畅度。</p>
 */
export default class Pool {
  /**@private  对象存放池。*/
  private static _poolDic: {} = {};

  /**
   * 根据对象类型标识字符，获取对象池。
   * @param sign 对象类型标识字符。
   * @return 对象池。
   */
  public static getPoolBySign(sign: string): any[] {
    return (Pool._poolDic[sign] || (Pool._poolDic[sign] = []));
  }

  /**
   * 清除对象池的对象。
   * @param sign 对象类型标识字符。
   */
  public static clearBySign(sign: string): void {
    if (Pool._poolDic[sign]) Pool._poolDic[sign].length = 0;
  }

  /**
   * 将对象放到对应类型标识的对象池中。
   * @param sign 对象类型标识字符。
   * @param item 对象。
   */
  public static recover(sign: string, item: any): void {
    Pool.getPoolBySign(sign).push(item);
  }

  /**
   * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
   * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
   * @param sign 对象类型标识字符。
   * @param cls 用于创建该类型对象的类。
   * @return 此类型标识的一个对象。
   */
  public static getItemByClass<T>(
    sign: string,
    cls: { new (...params: any[]): T }
  ): T {
    const pool: T[] = Pool.getPoolBySign(sign);
    const rst: T = pool.length ? pool.pop() : new cls();
    return rst;
  }

  /**
   * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
   * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
   * @param sign 对象类型标识字符。
   * @param createFun 用于创建该类型对象的方法。
   * @param caller this对象
   * @return 此类型标识的一个对象。
   */
  public static getItemByCreateFun(
    sign: string,
    createFun: Function,
    caller: any = null
  ): any {
    const pool: any[] = Pool.getPoolBySign(sign);
    const rst: any = pool.length ? pool.pop() : createFun.call(caller);
    return rst;
  }

  /**
   * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
   * @param sign 对象类型标识字符。
   * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
   */
  public static getItem(sign: string): any {
    const pool: any[] = Pool.getPoolBySign(sign);
    const rst: any = pool.length ? pool.pop() : null;
    return rst;
  }
}
