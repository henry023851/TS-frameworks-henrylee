//测试Emitter
var expect = require('chai').expect;
var assert = require('better-assert');
var Emitter = require('../src/pattern/Emitter.js').Emitter;
var Observer = require('../src/pattern/Emitter.js').Observer;
var Pool = require('../src/pattern/Pool.js');

var emitter = new Emitter();

const TEST_EVENT_1 = "testEvent1";

const TEST_EVENT_2 = "testEvent2";

const TEST_EVENT_3 = "30000";
const TEST_EVENT_4 = "40000";
const TEST_EVENT_5 = "50000";

describe('测试Emitter', function () {
    describe('测试事件类型：string | number', function () {
        it('SIGN typeof string', function (done1) {
            emitter.on(TEST_EVENT_1, this, (event) => {
                expect(event, "收到和SIGN一致").to.be.equal(TEST_EVENT_1);
                done1();
            });
            emitter.emit(TEST_EVENT_1);
        });
        it('SIGN typeof number', function (done2) {
            emitter.on(TEST_EVENT_3, this, (event) => {
                expect(event).to.be.equal(TEST_EVENT_3);
                done2();
            });
            emitter.emit(TEST_EVENT_3);
        });

        emitter.offAll();
        assert(emitter.getObserversBySign(TEST_EVENT_1).length == 0);
        assert(emitter.getObserversBySign(TEST_EVENT_3).length == 0);
    });

    describe('测试带参数', function () {
        const __MSGString = "EventSIGN";
        const __MSGNumber = 3.0;
        const __MSGJson = { "name": "henry" };
        it('带参数string', function (done3) {
            emitter.on(TEST_EVENT_2, this, (event, ...params) => {
                expect(params[0]).to.be.equal(__MSGString);
                done3();
            });
            emitter.emit(TEST_EVENT_2, __MSGString);
            emitter.off(TEST_EVENT_2, this);
        });
        it('带参数number', function (done3) {
            emitter.on(TEST_EVENT_2, this, (event, ...params) => {
                expect(params[0]).to.be.equal(__MSGNumber);
                done3();
            });
            emitter.emit(TEST_EVENT_2, __MSGNumber);
            emitter.off(TEST_EVENT_2, this);
        });
        it('带参数object', function (done3) {
            emitter.on(TEST_EVENT_2, this, (event, ...params) => {
                expect(params[0]).to.be.equal(__MSGJson);
                done3();
            });
            emitter.emit(TEST_EVENT_2, __MSGJson);
            emitter.off(TEST_EVENT_2, this);
        });
    });

    describe('测试添加/移除/动态移除', function () {
        it('添加一个观察者', function () {
            emitter.on(TEST_EVENT_2, this, (event, ...params) => {
            });
            assert(emitter.getObserversBySign(TEST_EVENT_2).length == 1);
        });

        it('移除一个观察者', function () {
            emitter.off(TEST_EVENT_2, this);
            assert(emitter.getObserversBySign(TEST_EVENT_2).length == 0);
        });

        it('动态移除一个观察者', function (done) {
            emitter.offAll();
            const self = this;
            emitter.on(TEST_EVENT_4, this, (event) => {
                emitter.off(TEST_EVENT_2, self);
            });
            emitter.on(TEST_EVENT_2, this, (event, ...params) => {
            });
            emitter.on(TEST_EVENT_5, this, (event) => {
                done();
            });
            assert(emitter.getObserversBySign(TEST_EVENT_2).length == 1);
            emitter.emit(TEST_EVENT_4);
            assert(emitter.getObserversBySign(TEST_EVENT_2).length == 0);
            emitter.emit(TEST_EVENT_5);
        });

        it('移除所有观察者', function () {
            emitter.offAll();
            assert(emitter.getObserversBySign(TEST_EVENT_1).length == 0);
            assert(emitter.getObserversBySign(TEST_EVENT_2).length == 0);
            assert(emitter.getObserversBySign(TEST_EVENT_3).length == 0);
            assert(emitter.getObserversBySign(TEST_EVENT_4).length == 0);
            assert(emitter.getObserversBySign(TEST_EVENT_5).length == 0);
            //每个测试单元添加的Observer都没有超过3个，所以对象池应该只有3个被回收
            assert(Pool["default"].getPoolBySign(Observer.POOL_SIGN).length == 3);
        });
    });
});