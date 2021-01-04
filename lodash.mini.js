;(function () {
  // 定义一些JS中的常量
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;
  
  var runInContext = (function runInContext(context) {

    // lodash函数
    function lodash(value) {
      
      return new LodashWrapper(value);
    }

    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    function isFunction(value) {
      if(!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value)
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    // 检查value是否为类数组
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
    }

    function baseKeys(object) {

    }

    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    var basecreate = (function() {
      // 这句放在函数外，是为了不用每次调用baseCreate都重复申明 object
      function object() {}
      return function(proto) {
        if(!isObject(proto)) {
          return {};
        }
        // 如果浏览器支持Object.create方法则返回Object.create
        if(Object.create) {
          return Object.create
        }
        // 如果不支持则使用ployfill new（这部分需要充分理解原型链）
        object.prototype = proto;
        var result = new object;  // new object在大部分情况下等同于new object()，加上括号的形式会提高new运算符的优先级。
        object.prototype = undefined;   // 还原prototype
        return result;
      }
    }());

    // mixin混入
    function mixin(object, source, options) {
      var props = keys(source),   // keys是一个工具函数
          
    }

    // 空函数
    function baseLodash () {

    }

    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;   // 存放参数value
      this.actions__ = [];  // 存放待执行的函数体func， 函数参数 args，函数执行的this 指向 thisArg。
      this.__chain__ = !!chainAll;  // chainAll值为undefined，两次取反转换成布尔值，默认不支持链式调用。
      this.__index__ = 0;   // 索引值默认为0
      this.values__ = undefined;    // 主要是clone是应用（暂时不太理解）
    }

    // 这一块原型的操作以后会做一个流程图

    lodash.prototype = baseLodash.prototype;
    // 修正constructor
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = basecreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    return lodash
  })

  // 暴露lodash，并定义别名_
  var _ = runInContext();
}).call(this)