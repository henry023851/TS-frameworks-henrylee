"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.Observer = exports.Emitter = void 0;
var Pool_1 = require("./Pool");
/**
 * 消息中心（观察者模式）
 * @author henry lee
 * @date 2020.4.3
 */
var Emitter = /** @class */ (function () {
    function Emitter() {
        this._listeners = null;
        this._listeners = {};
    }
    /**
     * 注册一个观察者
     * @param context
     * @param event
     * @param func
     * @returns true 创建成功    false已经有一个同类型的
     */
    Emitter.prototype.on = function (event, context, func) {
        if (null === context || null === func) {
            return false;
        }
        var observers = this.getObserversBySign(event);
        var len = observers.length;
        for (var index = 0; index < len; index++) {
            //检查是否同一个context已经注册过同类型侦听器
            if (observers[index].context() === context) {
                return false;
            }
        }
        observers.push(Observer.create(context, func));
        return true;
    };
    /**
     * 移除一个观察者
     * @param context
     * @param event
     */
    Emitter.prototype.off = function (event, context) {
        var observers = this.getObserversBySign(event);
        var n = observers.length;
        while (--n > -1) {
            var observer = observers[n];
            if (observer.context() === context) {
                observers.splice(n, 1);
                observer.clear();
                Observer.recover(observer);
                break;
            }
        }
    };
    /**
     * 触发消息
     * @param event
     * @param params
     */
    Emitter.prototype.emit = function (event) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var observers = this.getObserversBySign(event);
        //复制一份再遍历
        var array = observers.concat();
        array.forEach(function (observer) {
            observer.execute.apply(observer, __spreadArray([event], params));
        });
    };
    /**
     * 获取事件的所有Observer
     * @param event
     * @returns
     */
    Emitter.prototype.getObserversBySign = function (event) {
        return this._listeners[event] || (this._listeners[event] = []);
    };
    /**移除所有观察者 */
    Emitter.prototype.offAll = function () {
        for (var key in this._listeners) {
            if (this._listeners.hasOwnProperty(key)) {
                var array = this._listeners[key];
                array.forEach(function (observer) {
                    observer.clear();
                    Observer.recover(observer);
                });
            }
        }
        this._listeners = {};
    };
    Emitter.prototype.destroy = function () {
        this.offAll();
    };
    return Emitter;
}());
exports.Emitter = Emitter;
/**
 * Observer
 * 主要用途：观察者
 * @author henry lee
 * @date 2020.04.03   create
 */
var Observer = /** @class */ (function () {
    function Observer() {
        this._context = null;
        this._func = null;
    }
    /**
     * 请使用create方法来创建Observer
     * @param context
     * @param func
     * @returns
     *
     */
    Observer.create = function (context, func) {
        if (null === context || null === func) {
            return null;
        }
        var observer = Pool_1["default"].getItemByClass(Observer.POOL_SIGN, Observer);
        observer._func = func;
        observer._context = context;
        func.bind(context);
        return observer;
    };
    /**
     * 回收对象
     * @param oberver
     */
    Observer.recover = function (oberver) {
        Pool_1["default"].recover(Observer.POOL_SIGN, oberver);
    };
    Observer.prototype.execute = function () {
        var _a;
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        (_a = this._func).call.apply(_a, __spreadArray([this._context], param));
        return true;
    };
    Observer.prototype.context = function () {
        return this._context;
    };
    Observer.prototype.clear = function () {
        this._context = null;
        this._func = null;
    };
    Observer.prototype.destroy = function () {
        this.clear();
    };
    /**存取键值 */
    Observer.POOL_SIGN = "PoolEmitterObserver";
    return Observer;
}());
exports.Observer = Observer;
