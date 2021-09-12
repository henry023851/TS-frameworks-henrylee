/**
 * 计算两点角度(rotation)
 * @param px1 
 * @param py1 
 * @param px2 
 * @param py2 
 */
export function getAngle(px1: number, py1: number, px2: number, py2: number): number {
    //两点的x轴、y值轴投影值
    const _x = px2 - px1;
    const _y = py2 - py1;
    //斜边长度
    const hypotenuse = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));

    const cos = _x / hypotenuse;
    const radian = Math.acos(cos);

    //求出弧度
    let angle = 180 / (Math.PI / radian);
    //用弧度算出rotation
    if (_y < 0) {
        angle = -angle;
    } else if ((_y == 0) && (_x < 0)) {
        angle = 180;
    }
    return angle;
}