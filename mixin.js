function mixin(object, source, options) {
  // source 对象中可以枚举的属性
  var props = keys(source),
    // source 对象中的方法名称数组
    methodNames = baseFunctions(source, props);

  if (options == null &&
    !(isObject(source) && (methodNames.length || !props.length))) {
    // 如果 options 没传为 undefined  undefined == null 为true
    // 且 如果source 不为 对象或者不是函数
    // 且 source对象的函数函数长度 或者 source 对象的属性长度不为0
    // 把 options 赋值为 source
    options = source;
    // 把 source 赋值为 object
    source = object;
    // 把 object 赋值为 this 也就是 _ (lodash)
    object = this;
    // 获取到所有的方法名称数组
    methodNames = baseFunctions(source, keys(source));
  }
  // 是否支持 链式调用
  // options  不是对象或者不是函数，是null或者其他值
  // 判断options是否是对象或者函数，如果不是或者函数则不会执行 'chain' in options 也就不会报错
  //  且 chain 在 options的对象或者原型链中
  // 知识点 in [MDN in :  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in
  // 如果指定的属性在指定的对象或其原型链中，则in 运算符返回true。

  // 或者 options.chain 转布尔值
  var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
    // object 是函数
    isFunc = isFunction(object);

  // 循环 方法名称数组
  arrayEach(methodNames, function (methodName) {
    // 函数本身
    var func = source[methodName];
    // object 通常是 lodash  也赋值这个函数。
    object[methodName] = func;
    if (isFunc) {
      // 如果object是函数 赋值到  object prototype  上，通常是lodash
      object.prototype[methodName] = function () {
        // 实例上的__chain__ 属性 是否支持链式调用
        // 这里的 this 是 new LodashWrapper 实例 类似如下
        /**
         {
            __actions__: [],
            __chain__: true
            __index__: 0
            __values__: undefined
            __wrapped__: []
         }
         **/

        var chainAll = this.__chain__;
        // options 中的 chain 属性 是否支持链式调用
        // 两者有一个符合链式调用  执行下面的代码
        if (chain || chainAll) {
          // 通常是 lodash
          var result = object(this.__wrapped__),
            // 复制 实例上的 __action__ 到 result.__action__ 和 action 上
            actions = result.__actions__ = copyArray(this.__actions__);

          // action 添加 函数 和 args 和 this 指向，延迟计算调用。
          actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
          //实例上的__chain__ 属性  赋值给 result 的 属性 __chain__
          result.__chain__ = chainAll;
          // 最后返回这个实例
          return result;
        }

        // 都不支持链式调用。直接调用
        // 把当前实例的 value 和 arguments 对象 传递给 func 函数作为参数调用。返回调用结果。
        return func.apply(object, arrayPush([this.value()], arguments));
      };
    }
  });

  // 最后返回对象 object
  return object;
}