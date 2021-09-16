"use strict";
exports.__esModule = true;
exports.getAngle = void 0;
/**
 * 计算两点角度(rotation)
 * @param px1
 * @param py1
 * @param px2
 * @param py2
 */
function getAngle(px1, py1, px2, py2) {
    //向量的x轴、y值轴分量
    var _x = px2 - px1;
    var _y = py2 - py1;
    //斜边长度
    var hypotenuse = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));
    var cos = _x / hypotenuse;
    //求出弧度
    var radian = Math.acos(cos);
    //用弧度算出rotation
    var angle = 180 / (Math.PI / radian);
    if (_y < 0) {
        angle = -angle;
    }
    else if (_y == 0 && _x < 0) {
        angle = 180;
    }
    return angle;
}
exports.getAngle = getAngle;
