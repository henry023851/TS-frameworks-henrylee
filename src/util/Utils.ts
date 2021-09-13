/*
 //class类型传参参考
 public static getItemByClass<T>(sign: string, cls: { new(): T }): T {
     const pool: T[] = Pool.getPoolBySign(sign);
     const rst: T = pool.length ? pool.pop() : (new cls());
     return rst;
 }
*/
export type TYPE_CLASS<T> = { new (): T };

/**
 * 计算两点角度(rotation)
 * @param px1
 * @param py1
 * @param px2
 * @param py2
 */
export function getAngle(
  px1: number,
  py1: number,
  px2: number,
  py2: number
): number {
  //向量的x轴、y值轴分量
  const _x = px2 - px1;
  const _y = py2 - py1;
  //斜边长度
  const hypotenuse = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));

  const cos = _x / hypotenuse;
  //求出弧度
  const radian = Math.acos(cos);

  //用弧度算出rotation
  let angle = 180 / (Math.PI / radian);
  if (_y < 0) {
    angle = -angle;
  } else if (_y == 0 && _x < 0) {
    angle = 180;
  }
  return angle;
}
