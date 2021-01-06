; (function () {
  // 定义一些JS中的常量
  var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

  // 定义一些JS中的类型
  var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    domExcTag = '[object DOMException]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]',
    weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
  
  // 正则表达式
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  
  var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
    typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
    typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
    typedArrayTags[errorTag] = typedArrayTags[funcTag] =
    typedArrayTags[mapTag] = typedArrayTags[numberTag] =
    typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
    typedArrayTags[setTag] = typedArrayTags[stringTag] =
    typedArrayTags[weakMapTag] = false;

  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
  
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  // 用作全局对象的引用
  var root = freeGlobal || freeSelf || Function('return this')();

  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  var moduleExports = freeModule && freeModule.exports === freeExports;

  var freeProcess = moduleExports && freeGlobal.process;

  var nodeUtil = (function() {
    try {
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if(types) {
        return types;
      }

      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    }catch(e) {}
  }());

  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);
    
    while (++index < n) {
      result[index] = iteratee(index)
    }
    return result;
  }

  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    }
  }

  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];
    
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  var runInContext = (function runInContext(context) {
    // 指定上下文 runInContext函数不传参数时为this
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    // 用作内建方法的引用
    var objectProto = Object.prototype;

    // 内建构造函数的引用
    var Object = context.Object,
        Array = context.Array;

    // 内建值的引用
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    // 用作检查对象自身的属性
    var hasOwnProperty = objectProto.hasOwnProperty;

    var nativeObjectToString = objectProto.toString;

    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeKeys = overArg(Object.keys, Object)

    // lodash函数
    function lodash(value) {

      return new LodashWrapper(value);
    }

    function baseIsTypedArray(value) {
      return isObjectLike(value) && 
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)]
    }

    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];
      
      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if(unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    function objectToString(value) {
      return nativeObjectToString.call(value) 
    }

    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value)
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    function baseFunctions(object, props) {
      return arrayFilter(props, function() {
        return isFunction(object[key])
      })
    }

    // 检查value是否为类数组
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
    };

    var isArray = Array.isArray;

    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

        for (var key in value) {
          if((inherited || hasOwnProperty.call(value, key)) && 
              !(skipIndexes && (
                key == 'length' || 
                (isBuff && (key == 'offset' || key == 'parent')) || 
                (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
                isIndex(key, length)
              ))) {
            result.push(key);
          }
        }
        return result;
    }

    var isBuffer = nativeIsBuffer || stubFalse;

    function baseKeys(object) {
      if(!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if(hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto;

      return value === proto
    }

    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length && 
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))
        ) && (value > -1 && value % 1 == 0 && value < length);
    }

    var basecreate = (function () {
      // 这句放在函数外，是为了不用每次调用baseCreate都重复申明 object
      function object() { }
      return function (proto) {
        if (!isObject(proto)) {
          return {};
        }
        // 如果浏览器支持Object.create方法则返回Object.create
        if (Object.create) {
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
      var props = keys(source),
          methodNames = baseFunctions(source, props);
      
      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
            options = source;
            source = object;
            object = this;
            methodNames = baseFunctions(source, keys(source));
      }
    }

    // 空函数
    function baseLodash() {

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