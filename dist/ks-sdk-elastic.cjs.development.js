'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var JSBI = _interopDefault(require('jsbi'));
var ksSdkCore = require('@kyberswap/ks-sdk-core');
var abi$5 = require('@ethersproject/abi');
var address = require('@ethersproject/address');
var solidity = require('@ethersproject/solidity');
var invariant = _interopDefault(require('tiny-invariant'));
var ISelfPermit_json = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISelfPermit.sol/ISelfPermit.json');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

var _TICK_SPACINGS;

var FACTORY_ADDRESS = '0x0C7369F931a8D809E443c1d4A5DCe663fF888a73';
var ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
var POOL_INIT_CODE_HASH = '0xd71790a46dff0e075392efbd706356cd5a822a782f46e9859829440065879f81';

(function (FeeAmount) {
  FeeAmount[FeeAmount["STABLE"] = 8] = "STABLE";
  FeeAmount[FeeAmount["LOWEST"] = 10] = "LOWEST";
  FeeAmount[FeeAmount["LOW"] = 40] = "LOW";
  FeeAmount[FeeAmount["MEDIUM"] = 300] = "MEDIUM";
  FeeAmount[FeeAmount["HIGH"] = 1000] = "HIGH";
})(exports.FeeAmount || (exports.FeeAmount = {}));
/**
 * The default factory tick spacings by fee amount.
 */


var TICK_SPACINGS = (_TICK_SPACINGS = {}, _TICK_SPACINGS[exports.FeeAmount.STABLE] = 1, _TICK_SPACINGS[exports.FeeAmount.LOWEST] = 1, _TICK_SPACINGS[exports.FeeAmount.LOW] = 8, _TICK_SPACINGS[exports.FeeAmount.MEDIUM] = 60, _TICK_SPACINGS[exports.FeeAmount.HIGH] = 200, _TICK_SPACINGS['50'] = 10, _TICK_SPACINGS);
var MIN_LIQUIDITY = 100;

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */

function computePoolAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
      tokenA = _ref.tokenA,
      tokenB = _ref.tokenB,
      fee = _ref.fee,
      initCodeHashManualOverride = _ref.initCodeHashManualOverride;

  var _ref2 = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
      token0 = _ref2[0],
      token1 = _ref2[1]; // does safety checks


  return address.getCreate2Address(factoryAddress, solidity.keccak256(['bytes'], [abi$5.defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]), initCodeHashManualOverride != null ? initCodeHashManualOverride : POOL_INIT_CODE_HASH);
}

/**
 * This tick data provider does not know how to fetch any tick data. It throws whenever it is required. Useful if you
 * do not need to load tick data for your use case.
 */
var NoTickDataProvider = /*#__PURE__*/function () {
  function NoTickDataProvider() {}

  var _proto = NoTickDataProvider.prototype;

  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(_tick) {
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              throw new Error(NoTickDataProvider.ERROR_MESSAGE);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }

    return getTick;
  }();

  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(_tick, _lte, _tickSpacing) {
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              throw new Error(NoTickDataProvider.ERROR_MESSAGE);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }

    return nextInitializedTickWithinOneWord;
  }();

  _proto.nextInitializedTickWithinFixedDistance = /*#__PURE__*/function () {
    var _nextInitializedTickWithinFixedDistance = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(_tick, _lte, _distance) {
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              throw new Error(NoTickDataProvider.ERROR_MESSAGE);

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function nextInitializedTickWithinFixedDistance(_x5, _x6, _x7) {
      return _nextInitializedTickWithinFixedDistance.apply(this, arguments);
    }

    return nextInitializedTickWithinFixedDistance;
  }();

  return NoTickDataProvider;
}();
NoTickDataProvider.ERROR_MESSAGE = 'No tick data provider was given';

var NEGATIVE_ONE = /*#__PURE__*/JSBI.BigInt(-1);
var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1); // used in liquidity amount math

var Q96 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(96));
var Q192 = /*#__PURE__*/JSBI.exponentiate(Q96, /*#__PURE__*/JSBI.BigInt(2));

var TWO = /*#__PURE__*/JSBI.BigInt(2);
var POWERS_OF_2 = /*#__PURE__*/[128, 64, 32, 16, 8, 4, 2, 1].map(function (pow) {
  return [pow, JSBI.exponentiate(TWO, JSBI.BigInt(pow))];
});
function mostSignificantBit(x) {
  !JSBI.greaterThan(x, ZERO) ?  invariant(false, 'ZERO')  : void 0;
  !JSBI.lessThanOrEqual(x, ksSdkCore.MaxUint256) ?  invariant(false, 'MAX')  : void 0;
  var msb = 0;

  for (var _iterator = _createForOfIteratorHelperLoose(POWERS_OF_2), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
        power = _step$value[0],
        min = _step$value[1];

    if (JSBI.greaterThanOrEqual(x, min)) {
      x = JSBI.signedRightShift(x, JSBI.BigInt(power));
      msb += power;
    }
  }

  return msb;
}

function mulShift(val, mulBy) {
  return JSBI.signedRightShift(JSBI.multiply(val, JSBI.BigInt(mulBy)), JSBI.BigInt(128));
}

var Q32 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(32));
var TickMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function TickMath() {}
  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick the tick for which to compute the sqrt ratio
   */


  TickMath.getSqrtRatioAtTick = function getSqrtRatioAtTick(tick) {
    !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK && Number.isInteger(tick)) ?  invariant(false, 'TICK')  : void 0;
    var absTick = tick < 0 ? tick * -1 : tick;
    var ratio = (absTick & 0x1) != 0 ? JSBI.BigInt('0xfffcb933bd6fad37aa2d162d1a594001') : JSBI.BigInt('0x100000000000000000000000000000000');
    if ((absTick & 0x2) != 0) ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
    if ((absTick & 0x4) != 0) ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
    if ((absTick & 0x8) != 0) ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
    if ((absTick & 0x10) != 0) ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
    if ((absTick & 0x20) != 0) ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
    if ((absTick & 0x40) != 0) ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
    if ((absTick & 0x80) != 0) ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
    if ((absTick & 0x100) != 0) ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
    if ((absTick & 0x200) != 0) ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
    if ((absTick & 0x400) != 0) ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
    if ((absTick & 0x800) != 0) ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
    if ((absTick & 0x1000) != 0) ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
    if ((absTick & 0x2000) != 0) ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
    if ((absTick & 0x4000) != 0) ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
    if ((absTick & 0x8000) != 0) ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
    if ((absTick & 0x10000) != 0) ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
    if ((absTick & 0x20000) != 0) ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
    if ((absTick & 0x40000) != 0) ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
    if ((absTick & 0x80000) != 0) ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');
    if (tick > 0) ratio = JSBI.divide(ksSdkCore.MaxUint256, ratio); // back to Q96

    return JSBI.greaterThan(JSBI.remainder(ratio, Q32), ZERO) ? JSBI.add(JSBI.divide(ratio, Q32), ONE) : JSBI.divide(ratio, Q32);
  }
  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
   */
  ;

  TickMath.getTickAtSqrtRatio = function getTickAtSqrtRatio(sqrtRatioX96) {
    !(JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) && JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) ?  invariant(false, 'SQRT_RATIO')  : void 0;
    var sqrtRatioX128 = JSBI.leftShift(sqrtRatioX96, JSBI.BigInt(32));
    var msb = mostSignificantBit(sqrtRatioX128);
    var r;

    if (JSBI.greaterThanOrEqual(JSBI.BigInt(msb), JSBI.BigInt(128))) {
      r = JSBI.signedRightShift(sqrtRatioX128, JSBI.BigInt(msb - 127));
    } else {
      r = JSBI.leftShift(sqrtRatioX128, JSBI.BigInt(127 - msb));
    }

    var log_2 = JSBI.leftShift(JSBI.subtract(JSBI.BigInt(msb), JSBI.BigInt(128)), JSBI.BigInt(64));

    for (var i = 0; i < 14; i++) {
      r = JSBI.signedRightShift(JSBI.multiply(r, r), JSBI.BigInt(127));
      var f = JSBI.signedRightShift(r, JSBI.BigInt(128));
      log_2 = JSBI.bitwiseOr(log_2, JSBI.leftShift(f, JSBI.BigInt(63 - i)));
      r = JSBI.signedRightShift(r, f);
    }

    var log_sqrt10001 = JSBI.multiply(log_2, JSBI.BigInt('255738958999603826347141'));
    var tickLow = JSBI.toNumber(JSBI.signedRightShift(JSBI.subtract(log_sqrt10001, JSBI.BigInt('3402992956809132418596140100660247210')), JSBI.BigInt(128)));
    var tickHigh = JSBI.toNumber(JSBI.signedRightShift(JSBI.add(log_sqrt10001, JSBI.BigInt('291339464771989622907027621153398088495')), JSBI.BigInt(128)));
    return tickLow === tickHigh ? tickLow : JSBI.lessThanOrEqual(TickMath.getSqrtRatioAtTick(tickHigh), sqrtRatioX96) ? tickHigh : tickLow;
  };

  return TickMath;
}();
/**
 * The minimum tick that can be used on any pool.
 */

TickMath.MIN_TICK = -887272;
/**
 * The maximum tick that can be used on any pool.
 */

TickMath.MAX_TICK = -TickMath.MIN_TICK;
/**
 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
 */

TickMath.MIN_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('4295128739');
/**
 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
 */

TickMath.MAX_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('1461446703485210103287273052203988822378723970342');

/**
 * Determines if a tick list is sorted
 * @param list The tick list
 * @param comparator The comparator
 * @returns true if sorted
 */
function isSorted(list, comparator) {
  for (var i = 0; i < list.length - 1; i++) {
    if (comparator(list[i], list[i + 1]) > 0) {
      return false;
    }
  }

  return true;
}

function tickComparator(a, b) {
  return a.index - b.index;
}
/**
 * Utility methods for interacting with sorted lists of ticks
 */


var TickList = /*#__PURE__*/function () {
  /**
   * Cannot be constructed
   */
  function TickList() {}

  TickList.validateList = function validateList(ticks, tickSpacing) {
    !(tickSpacing > 0) ?  invariant(false, 'TICK_SPACING_NONZERO')  : void 0; // ensure ticks are spaced appropriately

    !ticks.every(function (_ref) {
      var index = _ref.index;
      return index % tickSpacing === 0;
    }) ?  invariant(false, 'TICK_SPACING')  : void 0; // ensure tick liquidity deltas sum to 0

    !JSBI.equal(ticks.reduce(function (accumulator, _ref2) {
      var liquidityNet = _ref2.liquidityNet;
      return JSBI.add(accumulator, liquidityNet);
    }, ZERO), ZERO) ?  invariant(false, 'ZERO_NET')  : void 0;
    !isSorted(ticks, tickComparator) ?  invariant(false, 'SORTED')  : void 0;
  };

  TickList.isBelowSmallest = function isBelowSmallest(ticks, tick) {
    !(ticks.length > 0) ?  invariant(false, 'LENGTH')  : void 0;
    return tick < ticks[0].index;
  };

  TickList.isAtOrAboveLargest = function isAtOrAboveLargest(ticks, tick) {
    !(ticks.length > 0) ?  invariant(false, 'LENGTH')  : void 0;
    return tick >= ticks[ticks.length - 1].index;
  };

  TickList.getTick = function getTick(ticks, index) {
    var tick = ticks[this.binarySearch(ticks, index)];
    !(tick.index === index) ?  invariant(false, 'NOT_CONTAINED')  : void 0;
    return tick;
  }
  /**
   * Finds the largest tick in the list of ticks that is less than or equal to tick
   * @param ticks list of ticks
   * @param tick tick to find the largest tick that is less than or equal to tick
   * @private
   */
  ;

  TickList.binarySearch = function binarySearch(ticks, tick) {
    !!this.isBelowSmallest(ticks, tick) ?  invariant(false, 'BELOW_SMALLEST')  : void 0;
    var l = 0;
    var r = ticks.length - 1;
    var i;

    while (true) {
      i = Math.floor((l + r) / 2);

      if (ticks[i].index <= tick && (i === ticks.length - 1 || ticks[i + 1].index > tick)) {
        return i;
      }

      if (ticks[i].index < tick) {
        l = i + 1;
      } else {
        r = i - 1;
      }
    }
  };

  TickList.nextInitializedTick = function nextInitializedTick(ticks, tick, lte) {
    if (lte) {
      !!TickList.isBelowSmallest(ticks, tick) ?  invariant(false, 'BELOW_SMALLEST')  : void 0;

      if (TickList.isAtOrAboveLargest(ticks, tick)) {
        return ticks[ticks.length - 1];
      }

      var index = this.binarySearch(ticks, tick);
      return ticks[index];
    } else {
      !!this.isAtOrAboveLargest(ticks, tick) ?  invariant(false, 'AT_OR_ABOVE_LARGEST')  : void 0;

      if (this.isBelowSmallest(ticks, tick)) {
        return ticks[0];
      }

      var _index = this.binarySearch(ticks, tick);

      return ticks[_index + 1];
    }
  };

  TickList.nextInitializedTickWithinOneWord = function nextInitializedTickWithinOneWord(ticks, tick, lte, tickSpacing) {
    var compressed = Math.floor(tick / tickSpacing); // matches rounding in the code

    if (lte) {
      var wordPos = compressed >> 8;
      var minimum = (wordPos << 8) * tickSpacing;

      if (TickList.isBelowSmallest(ticks, tick)) {
        return [minimum, false];
      }

      var index = TickList.nextInitializedTick(ticks, tick, lte).index;
      var nextInitializedTick = Math.max(minimum, index);
      return [nextInitializedTick, nextInitializedTick === index];
    } else {
      var _wordPos = compressed + 1 >> 8;

      var maximum = (_wordPos + 1 << 8) * tickSpacing - 1;

      if (this.isAtOrAboveLargest(ticks, tick)) {
        return [maximum, false];
      }

      var _index2 = this.nextInitializedTick(ticks, tick, lte).index;

      var _nextInitializedTick = Math.min(maximum, _index2);

      return [_nextInitializedTick, _nextInitializedTick === _index2];
    }
  };

  TickList.nextInitializedTickWithinFixedDistance = function nextInitializedTickWithinFixedDistance(ticks, tick, lte, distance) {
    if (distance === void 0) {
      distance = 480;
    }

    if (lte) {
      var minimum = tick - distance;

      if (TickList.isBelowSmallest(ticks, tick)) {
        return [minimum, false];
      }

      var index = TickList.nextInitializedTick(ticks, tick, lte).index;
      var nextInitializedTick = Math.max(minimum, index);
      return [nextInitializedTick, nextInitializedTick === index];
    } else {
      var maximum = tick + distance;

      if (this.isAtOrAboveLargest(ticks, tick)) {
        return [maximum, false];
      }

      var _index3 = this.nextInitializedTick(ticks, tick, lte).index;

      var _nextInitializedTick2 = Math.min(maximum, _index3);

      return [_nextInitializedTick2, _nextInitializedTick2 === _index3];
    }
  };

  return TickList;
}();

/**
 * Converts a big int to a hex string
 * @param bigintIsh
 * @returns The hex encoded calldata
 */

function toHex(bigintIsh) {
  var bigInt = JSBI.BigInt(bigintIsh);
  var hex = bigInt.toString(16);

  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }

  return "0x" + hex;
}

/**
 * Converts a route to a hex encoded path
 * @param route the v3 path to convert to an encoded path
 * @param exactOutput whether the route should be encoded in reverse, for making exact output swaps
 */

function encodeRouteToPath(route, exactOutput) {
  var firstInputToken = route.input.wrapped;

  var _route$pools$reduce = route.pools.reduce(function (_ref, pool, index) {
    var inputToken = _ref.inputToken,
        path = _ref.path,
        types = _ref.types;
    var outputToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0;

    if (index === 0) {
      return {
        inputToken: outputToken,
        types: ['address', 'uint24', 'address'],
        path: [inputToken.address, pool.fee, outputToken.address]
      };
    } else {
      return {
        inputToken: outputToken,
        types: [].concat(types, ['uint24', 'address']),
        path: [].concat(path, [pool.fee, outputToken.address])
      };
    }
  }, {
    inputToken: firstInputToken,
    path: [],
    types: []
  }),
      path = _route$pools$reduce.path,
      types = _route$pools$reduce.types;

  return exactOutput ? solidity.pack(types.reverse(), path.reverse()) : solidity.pack(types, path);
}

/**
 * Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 The numerator amount i.e., the amount of token1
 * @param amount0 The denominator amount i.e., the amount of token0
 * @returns The sqrt ratio
 */

function encodeSqrtRatioX96(amount1, amount0) {
  var numerator = JSBI.leftShift(JSBI.BigInt(amount1), JSBI.BigInt(192));
  var denominator = JSBI.BigInt(amount0);
  var ratioX192 = JSBI.divide(numerator, denominator);
  return ksSdkCore.sqrt(ratioX192);
}

var FullMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function FullMath() {}

  FullMath.mulDivRoundingUp = function mulDivRoundingUp(a, b, denominator) {
    var product = JSBI.multiply(a, b);
    var result = JSBI.divide(product, denominator);
    if (JSBI.notEqual(JSBI.remainder(product, denominator), ZERO)) result = JSBI.add(result, ONE);
    return result;
  };

  FullMath.mulDiv = function mulDiv(a, b, denominator) {
    var product = JSBI.multiply(a, b);
    return JSBI.divide(product, denominator);
  };

  FullMath.getSmallerRootOfQuadEqn = function getSmallerRootOfQuadEqn(a, b, c) {
    // smallerRoot = (b - sqrt(b * b - a * c)) / a;
    var tmp1 = JSBI.multiply(b, b);
    var tmp2 = JSBI.multiply(a, c);
    var tmp3 = ksSdkCore.sqrt(JSBI.subtract(tmp1, tmp2));
    var tmp4 = JSBI.subtract(b, tmp3);
    return JSBI.divide(tmp4, a);
  };

  return FullMath;
}();

var LiquidityMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function LiquidityMath() {}

  LiquidityMath.addDelta = function addDelta(x, y) {
    if (JSBI.lessThan(y, ZERO)) {
      return JSBI.subtract(x, JSBI.multiply(y, NEGATIVE_ONE));
    } else {
      return JSBI.add(x, y);
    }
  };

  return LiquidityMath;
}();

/**
 * Returns an imprecise maximum amount of liquidity received for a given amount of token 0.
 * This function is available to accommodate LiquidityAmounts#getLiquidityForAmount0 in the v3 periphery,
 * which could be more precise by at least 32 bits by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits. This imprecise calculation will likely be replaced in a future
 * v3 router contract.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, imprecise
 */

function maxLiquidityForAmount0Imprecise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref[0];
    sqrtRatioBX96 = _ref[1];
  }

  var intermediate = JSBI.divide(JSBI.multiply(sqrtRatioAX96, sqrtRatioBX96), Q96);
  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount0), intermediate), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Returns a precise maximum amount of liquidity received for a given amount of token 0 by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, precise
 */


function maxLiquidityForAmount0Precise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref2[0];
    sqrtRatioBX96 = _ref2[1];
  }

  var numerator = JSBI.multiply(JSBI.multiply(JSBI.BigInt(amount0), sqrtRatioAX96), sqrtRatioBX96);
  var denominator = JSBI.multiply(Q96, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
  return JSBI.divide(numerator, denominator);
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token1
 * @param sqrtRatioAX96 The price at the lower tick boundary
 * @param sqrtRatioBX96 The price at the upper tick boundary
 * @param amount1 The token1 amount
 * @returns liquidity for amount1
 */


function maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref3 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref3[0];
    sqrtRatioBX96 = _ref3[1];
  }

  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount1), Q96), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token0, token1,
 * and the prices at the tick boundaries.
 * @param sqrtRatioCurrentX96 the current price
 * @param sqrtRatioAX96 price at lower boundary
 * @param sqrtRatioBX96 price at upper boundary
 * @param amount0 token0 amount
 * @param amount1 token1 amount
 * @param useFullPrecision if false, liquidity will be maximized according to what the router can calculate,
 * not what core can theoretically support
 */


function maxLiquidityForAmounts(sqrtRatioCurrentX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref4 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref4[0];
    sqrtRatioBX96 = _ref4[1];
  }

  var maxLiquidityForAmount0 = useFullPrecision ? maxLiquidityForAmount0Precise : maxLiquidityForAmount0Imprecise;

  if (JSBI.lessThanOrEqual(sqrtRatioCurrentX96, sqrtRatioAX96)) {
    return maxLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (JSBI.lessThan(sqrtRatioCurrentX96, sqrtRatioBX96)) {
    var liquidity0 = maxLiquidityForAmount0(sqrtRatioCurrentX96, sqrtRatioBX96, amount0);
    var liquidity1 = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1);
    return JSBI.lessThan(liquidity0, liquidity1) ? liquidity0 : liquidity1;
  } else {
    return maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }
}

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */

function nearestUsableTick(tick, tickSpacing) {
  !(Number.isInteger(tick) && Number.isInteger(tickSpacing)) ?  invariant(false, 'INTEGERS')  : void 0;
  !(tickSpacing > 0) ?  invariant(false, 'TICK_SPACING')  : void 0;
  !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK) ?  invariant(false, 'TICK_BOUND')  : void 0;
  var rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK) return rounded + tickSpacing;else if (rounded > TickMath.MAX_TICK) return rounded - tickSpacing;else return rounded;
}

/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */

function tickToPrice(baseToken, quoteToken, tick) {
  var sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
  var ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);
  return baseToken.sortsBefore(quoteToken) ? new ksSdkCore.Price(baseToken, quoteToken, Q192, ratioX192) : new ksSdkCore.Price(baseToken, quoteToken, ratioX192, Q192);
}
/**
 * Returns tick for which the given price is closest to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 *
 * Solving this equation: `price = 1.0001 ^ tick` => tick = log_1.0001(price)
 */

function priceToClosestTick(price) {
  var sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);
  var sqrtRatioX96 = sorted ? encodeSqrtRatioX96(price.numerator, price.denominator) : encodeSqrtRatioX96(price.denominator, price.numerator);
  var tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  var lower2TickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, getCorrectTick(tick - 2));
  var lowerTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, getCorrectTick(tick - 1));
  var tickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick);
  var nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, getCorrectTick(tick + 1));
  var next2TickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, getCorrectTick(tick + 2));
  var nearestPrice = findNearestValue(price, [lower2TickPrice, lowerTickPrice, tickPrice, nextTickPrice, next2TickPrice]);
  if (nearestPrice != null && nearestPrice.equalTo(lower2TickPrice)) return getCorrectTick(tick - 2);
  if (nearestPrice != null && nearestPrice.equalTo(lowerTickPrice)) return getCorrectTick(tick - 1);
  if (nearestPrice != null && nearestPrice.equalTo(tickPrice)) return tick;
  if (nearestPrice != null && nearestPrice.equalTo(nextTickPrice)) return getCorrectTick(tick + 1);
  if (nearestPrice != null && nearestPrice.equalTo(next2TickPrice)) return getCorrectTick(tick + 2);
  return tick;
}

var getCorrectTick = function getCorrectTick(value) {
  if (value < TickMath.MIN_TICK) return TickMath.MIN_TICK;
  if (value > TickMath.MAX_TICK) return TickMath.MAX_TICK;
  return value;
};

var findNearestValue = function findNearestValue(current, prices) {
  if (!prices.length) return null;
  var best = prices[0];
  prices.forEach(function (price) {
    return best = findNearerValue(current, best, price);
  });
  return best;
};

var findNearerValue = function findNearerValue(current, val1, val2) {
  var lower = val1.lessThan(val2) ? val1 : val2;
  var upper = val1.lessThan(val2) ? val2 : val1;
  var middle = upper.add(lower).divide(2);
  return middle.lessThan(current) || middle.equalTo(current) ? upper : lower;
};

var MaxUint160 = /*#__PURE__*/JSBI.subtract( /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(160)), ONE);
var MAX_FEE = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(10), /*#__PURE__*/JSBI.BigInt(5));

function multiplyIn256(x, y) {
  var product = JSBI.multiply(x, y);
  return JSBI.bitwiseAnd(product, ksSdkCore.MaxUint256);
}

function addIn256(x, y) {
  var sum = JSBI.add(x, y);
  return JSBI.bitwiseAnd(sum, ksSdkCore.MaxUint256);
}

var SqrtPriceMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SqrtPriceMath() {}

  SqrtPriceMath.getAmount0Unlock = function getAmount0Unlock(sqrtRatioInitX96) {
    return FullMath.mulDivRoundingUp(JSBI.BigInt(MIN_LIQUIDITY), Q96, sqrtRatioInitX96);
  };

  SqrtPriceMath.getAmount1Unlock = function getAmount1Unlock(sqrtRatioInitX96) {
    return FullMath.mulDivRoundingUp(JSBI.BigInt(MIN_LIQUIDITY), sqrtRatioInitX96, Q96);
  } //L value = encodeSqrt = X96
  //Come from equation
  // (x + L/sqrt(Pb)).(y + L.sqrt(Pa)) = L^2
  ;

  SqrtPriceMath.getAmount0Delta = function getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    //getAmount0Delta equivalent when y= 0
    //X96(A) -> X96(B) | L
    // (L<<96).(X96(B) - X96(A))
    // __________________________
    //      X96(B) . X96(A)
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref[0];
      sqrtRatioBX96 = _ref[1];
    }

    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96));
    var numerator2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
    return roundUp ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96) : JSBI.divide(JSBI.divide(JSBI.multiply(numerator1, numerator2), sqrtRatioBX96), sqrtRatioAX96);
  };

  SqrtPriceMath.getAmount0DeltaFeeCompounding = function getAmount0DeltaFeeCompounding(sqrtRatioAX96, sqrtRatioBX96, liquidity, feePips, roundUp) {
    //getAmount0Delta equivalent when y= 0
    //  L_delta = x_delta.fee.x96(B) / 2            (1)
    //  X96(A) = (L + L_delta) / (x + x_delta)
    //            (L + L_delta) . X96(B)
    //         = ______________________
    //            (x + x_delta).X96(B)
    //
    //            (L + L_delta) . X96(B)
    //         =  ______________________            (2)
    //             L + x_delta.X96(B)
    // (1) + (2)
    //            2.(L<<96).(X96(B) - X96(A))
    // x_delta = ___________________________________
    //            X96(B).(2.X96(A) - fee.X96(B))
    // L_delta = x_delta.fee.x96(B) / 2 / Q96
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref2[0];
      sqrtRatioBX96 = _ref2[1];
    }

    var numerator1 = JSBI.multiply(JSBI.BigInt(2), JSBI.leftShift(liquidity, JSBI.BigInt(96)));
    var numerator2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
    var denominator = JSBI.subtract(JSBI.multiply(JSBI.BigInt(2), sqrtRatioAX96), JSBI.divide(JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioBX96), JSBI.subtract(MAX_FEE, JSBI.BigInt(0))));
    var amount0Delta = roundUp ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, denominator) : JSBI.divide(JSBI.divide(JSBI.multiply(numerator1, numerator2), sqrtRatioBX96), denominator);
    var Ldelta = roundUp ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(amount0Delta, JSBI.divide(JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioBX96), JSBI.subtract(MAX_FEE, JSBI.BigInt(0))), JSBI.BigInt(2)), ONE, Q96) : JSBI.divide(JSBI.divide(JSBI.multiply(amount0Delta, JSBI.divide(JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioBX96), JSBI.subtract(MAX_FEE, JSBI.BigInt(0)))), JSBI.BigInt(2)), Q96);
    return [amount0Delta, Ldelta];
  };

  SqrtPriceMath.getAmount1Delta = function getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    //getAmount1Delta equivalent when x = 0
    // (L<<96).(X96(B) - X96(A))
    //    L.(X96(B) - X96(A))
    // __________________________
    //            2^96
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref3 = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref3[0];
      sqrtRatioBX96 = _ref3[1];
    }

    return roundUp ? FullMath.mulDivRoundingUp(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96), Q96) : JSBI.divide(JSBI.multiply(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)), Q96);
  };

  SqrtPriceMath.getNextSqrtPriceFromInput = function getNextSqrtPriceFromInput(sqrtPX96, liquidity, amountIn, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ?  invariant(false)  : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ?  invariant(false)  : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true) : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
  };

  SqrtPriceMath.getNextSqrtPriceFromOutput = function getNextSqrtPriceFromOutput(sqrtPX96, liquidity, amountOut, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ?  invariant(false)  : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ?  invariant(false)  : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false) : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
  };

  SqrtPriceMath.getNextSqrtPriceFromAmount0RoundingUp = function getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amount, add) {
    // L <<96
    //amount . sqrtPX96
    if (JSBI.equal(amount, ZERO)) return sqrtPX96;
    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96));

    if (add) {
      //add amount 0, mean sqrtPX96 = Pb, need to calculate Pa
      //from equation of getAmount0Delta
      //                L<<96
      // -> Pa = ___________________
      //                      L
      //           amount+ _________
      //                    sqrtPX96
      var product = multiplyIn256(amount, sqrtPX96);

      if (JSBI.equal(JSBI.divide(product, amount), sqrtPX96)) {
        var denominator = addIn256(numerator1, product);

        if (JSBI.greaterThanOrEqual(denominator, numerator1)) {
          return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
        }
      }

      return FullMath.mulDivRoundingUp(numerator1, ONE, JSBI.add(JSBI.divide(numerator1, sqrtPX96), amount));
    } else {
      //remove amount 0, mean sqrtPX96 = Pa, need to calculate Pb
      //from equation of getAmount0Delta
      //              L.sqrtPX96
      // ->Pb = ______________________
      //          L - amount.sqrtPX96
      var _product = multiplyIn256(amount, sqrtPX96);

      !JSBI.equal(JSBI.divide(_product, amount), sqrtPX96) ?  invariant(false)  : void 0;
      !JSBI.greaterThan(numerator1, _product) ?  invariant(false)  : void 0;

      var _denominator = JSBI.subtract(numerator1, _product);

      return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, _denominator);
    }
  };

  SqrtPriceMath.getNextSqrtPriceFromAmount1RoundingDown = function getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amount, add) {
    if (add) {
      //add amount 1, means sqrtPX96 = Pa, need to calculate Pb
      //from equation of getAmount1Delta
      //         amount
      // Pb =  _________ + sqrtPX96
      //            L
      var quotient = JSBI.lessThanOrEqual(amount, MaxUint160) ? JSBI.divide(JSBI.leftShift(amount, JSBI.BigInt(96)), liquidity) : JSBI.divide(JSBI.multiply(amount, Q96), liquidity);
      return JSBI.add(sqrtPX96, quotient);
    } else {
      //remove amount 1, mean sqrtPX96 = Pb, need to calculate Pa
      //from equation of getAmount1Delta
      //                  amount
      //Pa = sqrtPX96 - __________
      //                    L
      var _quotient = FullMath.mulDivRoundingUp(amount, Q96, liquidity);

      !JSBI.greaterThan(sqrtPX96, _quotient) ?  invariant(false)  : void 0;
      return JSBI.subtract(sqrtPX96, _quotient);
    }
  };

  return SqrtPriceMath;
}();

var Tick = function Tick(_ref) {
  var index = _ref.index,
      liquidityGross = _ref.liquidityGross,
      liquidityNet = _ref.liquidityNet;
  !(index >= TickMath.MIN_TICK && index <= TickMath.MAX_TICK) ?  invariant(false, 'TICK')  : void 0;
  this.index = index;
  this.liquidityGross = JSBI.BigInt(liquidityGross);
  this.liquidityNet = JSBI.BigInt(liquidityNet);
};

var TickListDataProvider = /*#__PURE__*/function () {
  function TickListDataProvider(ticks, tickSpacing) {
    var ticksMapped = ticks.map(function (t) {
      return t instanceof Tick ? t : new Tick(t);
    });
    TickList.validateList(ticksMapped, tickSpacing);
    this.ticks = ticksMapped;
  }

  var _proto = TickListDataProvider.prototype;

  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(tick) {
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", TickList.getTick(this.ticks, tick));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }

    return getTick;
  }();

  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(tick, lte, tickSpacing) {
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }

    return nextInitializedTickWithinOneWord;
  }();

  _proto.nextInitializedTickWithinFixedDistance = /*#__PURE__*/function () {
    var _nextInitializedTickWithinFixedDistance = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(tick, lte, distance) {
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", TickList.nextInitializedTickWithinFixedDistance(this.ticks, tick, lte, distance));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function nextInitializedTickWithinFixedDistance(_x5, _x6, _x7) {
      return _nextInitializedTickWithinFixedDistance.apply(this, arguments);
    }

    return nextInitializedTickWithinFixedDistance;
  }();

  return TickListDataProvider;
}();

var BPS = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(10), /*#__PURE__*/JSBI.BigInt(5));
var TWO_BPS = /*#__PURE__*/JSBI.multiply(BPS, /*#__PURE__*/JSBI.BigInt(2));
var SwapMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapMath() {}

  SwapMath.computeSwapStepPromm = function computeSwapStepPromm(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips, exactIn, zeroForOne) {
    var returnValues = {
      sqrtRatioNextX96: ZERO,
      amountIn: ZERO,
      amountOut: ZERO,
      deltaL: ZERO
    };
    if (JSBI.equal(sqrtRatioCurrentX96, sqrtRatioTargetX96)) return [sqrtRatioCurrentX96, ZERO, ZERO, ZERO];
    var usedAmount = SwapMath.calcReachAmount(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, feePips, exactIn, zeroForOne);
    console.log("======usedAmount of tick 480,", usedAmount.toString());

    if (exactIn && JSBI.greaterThanOrEqual(usedAmount, amountRemaining) || !exactIn && JSBI.lessThanOrEqual(usedAmount, amountRemaining)) {
      usedAmount = amountRemaining;
    } else {
      returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
    }

    returnValues.amountIn = usedAmount;
    var absUsedAmount = JSBI.greaterThanOrEqual(usedAmount, ZERO) ? usedAmount : JSBI.multiply(usedAmount, JSBI.BigInt(-1));

    if (JSBI.equal(returnValues.sqrtRatioNextX96, ZERO)) {
      //last step 
      returnValues.deltaL = SwapMath.estimateIncrementalLiquidity(absUsedAmount, liquidity, sqrtRatioCurrentX96, feePips, exactIn, zeroForOne);
      returnValues.sqrtRatioNextX96 = SwapMath.calcFinalPrice(absUsedAmount, liquidity, returnValues.deltaL, sqrtRatioCurrentX96, exactIn, zeroForOne);
    } else {
      returnValues.deltaL = SwapMath.calcIncrementalLiquidity(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, absUsedAmount, exactIn, zeroForOne);
    }

    returnValues.amountOut = SwapMath.calcReturnedAmount(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, returnValues.deltaL, exactIn, zeroForOne);
    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.deltaL];
  };

  SwapMath.calcReachAmount = function calcReachAmount(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, feePips, exactIn, zeroForOne) {
    var absPriceDiff = sqrtRatioCurrentX96 >= sqrtRatioTargetX96 ? JSBI.subtract(sqrtRatioCurrentX96, sqrtRatioTargetX96) : JSBI.subtract(sqrtRatioTargetX96, sqrtRatioCurrentX96);
    var reachAmount;

    if (exactIn) {
      if (zeroForOne) {
        //exactInput + swap 0 -> 1
        var denominator = JSBI.subtract(JSBI.multiply(TWO_BPS, sqrtRatioTargetX96), JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioCurrentX96));
        var numerator = FullMath.mulDiv(liquidity, JSBI.multiply(TWO_BPS, absPriceDiff), denominator);
        reachAmount = FullMath.mulDiv(numerator, Q96, sqrtRatioCurrentX96);
      } else {
        //exactInput + swap 1 -> 0
        var _denominator = JSBI.subtract(JSBI.multiply(TWO_BPS, sqrtRatioCurrentX96), JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioTargetX96));

        var _numerator = FullMath.mulDiv(liquidity, JSBI.multiply(TWO_BPS, absPriceDiff), _denominator);

        reachAmount = FullMath.mulDiv(_numerator, sqrtRatioCurrentX96, Q96);
      }
    } else {
      if (zeroForOne) {
        //exactOut + swap 0 -> 1
        var _denominator2 = JSBI.subtract(JSBI.multiply(TWO_BPS, sqrtRatioCurrentX96), JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioTargetX96));

        var _numerator2 = JSBI.subtract(_denominator2, JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioCurrentX96));

        _numerator2 = FullMath.mulDiv(JSBI.leftShift(liquidity, JSBI.BigInt(96)), _numerator2, _denominator2);
        reachAmount = JSBI.divide(FullMath.mulDiv(_numerator2, absPriceDiff, sqrtRatioCurrentX96), sqrtRatioTargetX96);
        reachAmount = JSBI.multiply(reachAmount, JSBI.BigInt(-1));
      } else {
        var _denominator3 = JSBI.subtract(JSBI.multiply(TWO_BPS, sqrtRatioTargetX96), JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioCurrentX96));

        var _numerator3 = JSBI.subtract(_denominator3, JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioTargetX96));

        _numerator3 = FullMath.mulDiv(liquidity, _numerator3, _denominator3);
        reachAmount = FullMath.mulDiv(_numerator3, absPriceDiff, Q96);
        reachAmount = JSBI.multiply(reachAmount, JSBI.BigInt(-1));
      }
    }

    return reachAmount;
  };

  SwapMath.calcReturnedAmount = function calcReturnedAmount(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, deltaL, exactIn, zeroForOne) {
    var returnedAmount;

    if (zeroForOne) {
      if (exactIn) {
        returnedAmount = JSBI.add(FullMath.mulDivRoundingUp(deltaL, sqrtRatioTargetX96, Q96), JSBI.multiply(FullMath.mulDiv(liquidity, JSBI.subtract(sqrtRatioCurrentX96, sqrtRatioTargetX96), Q96), JSBI.BigInt(-1)));
      } else {
        returnedAmount = JSBI.add(FullMath.mulDivRoundingUp(deltaL, sqrtRatioTargetX96, Q96), FullMath.mulDivRoundingUp(liquidity, JSBI.subtract(sqrtRatioTargetX96, sqrtRatioCurrentX96), Q96));
      }
    } else {
      returnedAmount = JSBI.add(FullMath.mulDivRoundingUp(JSBI.add(liquidity, deltaL), Q96, sqrtRatioTargetX96), JSBI.multiply(FullMath.mulDivRoundingUp(liquidity, Q96, sqrtRatioCurrentX96), JSBI.BigInt(-1)));
    }

    if (exactIn && JSBI.equal(returnedAmount, JSBI.BigInt(1))) {
      returnedAmount = ZERO;
    }

    return returnedAmount;
  };

  SwapMath.calcIncrementalLiquidity = function calcIncrementalLiquidity(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, absAmount, exactIn, zeroForOne) {
    // this is when we reach the target, then we have target_X96
    if (zeroForOne) {
      var tmp1 = FullMath.mulDiv(liquidity, Q96, sqrtRatioCurrentX96);
      var tmp2 = exactIn ? JSBI.add(tmp1, absAmount) : JSBI.subtract(tmp1, absAmount);
      var tmp3 = FullMath.mulDiv(sqrtRatioTargetX96, tmp2, Q96);
      return JSBI.greaterThan(tmp3, liquidity) ? JSBI.subtract(tmp3, liquidity) : ZERO;
    } else {
      var _tmp = FullMath.mulDiv(liquidity, sqrtRatioCurrentX96, Q96);

      var _tmp2 = exactIn ? JSBI.add(_tmp, absAmount) : JSBI.subtract(_tmp, absAmount);

      var _tmp3 = FullMath.mulDiv(_tmp2, Q96, sqrtRatioTargetX96);

      return JSBI.greaterThan(_tmp3, liquidity) ? JSBI.subtract(_tmp3, liquidity) : ZERO;
    }
  };

  SwapMath.estimateIncrementalLiquidity = function estimateIncrementalLiquidity(absAmount, liquidity, sqrtRatioCurrentX96, feePips, exactIn, zeroForOne) {
    // this is when we didn't reach the target (last step before loop end), then we have to recalculate the target_X96, deltaL ...
    var deltaL;
    var fee = JSBI.BigInt(feePips);

    if (exactIn) {
      if (zeroForOne) {
        // deltaL = feeInBps * absDelta * currentSqrtP / 2
        deltaL = FullMath.mulDiv(sqrtRatioCurrentX96, JSBI.multiply(absAmount, fee), JSBI.leftShift(TWO_BPS, JSBI.BigInt(96)));
      } else {
        // deltaL = feeInBps * absDelta * / (currentSqrtP * 2)
        // Because nextSqrtP = (liquidity + absDelta / currentSqrtP) * currentSqrtP / (liquidity + deltaL)
        // so we round down deltaL, to round up nextSqrtP
        deltaL = FullMath.mulDiv(Q96, JSBI.multiply(absAmount, fee), JSBI.multiply(TWO_BPS, sqrtRatioCurrentX96));
      }
    } else {
      // obtain the smaller root of the quadratic equation
      // ax^2 - 2bx + c = 0 such that b > 0, and x denotes deltaL
      var a = fee;
      var b = JSBI.subtract(BPS, fee);
      var c = JSBI.multiply(JSBI.multiply(fee, liquidity), absAmount);

      if (zeroForOne) {
        b = JSBI.subtract(b, FullMath.mulDiv(JSBI.multiply(BPS, absAmount), sqrtRatioCurrentX96, Q96));
        c = FullMath.mulDiv(c, sqrtRatioCurrentX96, Q96);
      } else {
        b = JSBI.subtract(b, FullMath.mulDiv(JSBI.multiply(BPS, absAmount), Q96, sqrtRatioCurrentX96));
        c = FullMath.mulDiv(c, Q96, sqrtRatioCurrentX96);
      }

      deltaL = FullMath.getSmallerRootOfQuadEqn(a, b, c);
    }

    return deltaL;
  };

  SwapMath.calcFinalPrice = function calcFinalPrice(absAmount, liquidity, deltaL, sqrtRatioCurrentX96, exactIn, zeroForOne) {
    if (zeroForOne) {
      var tmp = FullMath.mulDiv(absAmount, sqrtRatioCurrentX96, Q96);

      if (exactIn) {
        return FullMath.mulDivRoundingUp(JSBI.add(liquidity, deltaL), sqrtRatioCurrentX96, JSBI.add(liquidity, tmp));
      } else {
        return FullMath.mulDiv(JSBI.add(liquidity, deltaL), sqrtRatioCurrentX96, JSBI.subtract(liquidity, tmp));
      }
    } else {
      var _tmp4 = FullMath.mulDiv(absAmount, Q96, sqrtRatioCurrentX96);

      if (exactIn) {
        return FullMath.mulDiv(JSBI.add(liquidity, _tmp4), sqrtRatioCurrentX96, JSBI.add(liquidity, deltaL));
      } else {
        return FullMath.mulDivRoundingUp(JSBI.subtract(liquidity, _tmp4), sqrtRatioCurrentX96, JSBI.add(liquidity, deltaL));
      }
    }
  };

  SwapMath.computeSwapStep = function computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips) {
    var returnValues = {}; //sqrtRatioCurrentX96 > sqrtRatioTargetX96 means direction = Pb -> Pa <=> add zero, remove one <=> zeroForOne true

    var zeroForOne = JSBI.greaterThanOrEqual(sqrtRatioCurrentX96, sqrtRatioTargetX96);
    var exactIn = JSBI.greaterThanOrEqual(amountRemaining, ZERO);

    if (exactIn) {
      //reduce fee
      var amountRemainingLessFee = JSBI.divide(JSBI.multiply(amountRemaining, JSBI.subtract(BPS, JSBI.BigInt(feePips))), BPS); // calculate amount in between 2 ticks
      // if zeroForOne -> calc the input amount of token0 -> getAmount0Delta,
      //               -> sqrtRatioCurrentX96 > sqrtRatioTargetX96 -> Pa = sqrtRatioTargetX96
      //                                                              Pb = sqrtRatioCurrentX96
      // if !zeroForOne -> calc the input amount of token1 -> getAmount1Delta
      //                -> sqrtRatioCurrentX96 < sqrtRatioTargetX96 -> Pa = sqrtRatioCurrentX96
      //                                                               Pb = sqrtRatioTargetX96

      returnValues.amountIn = zeroForOne ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true) : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);

      if (JSBI.greaterThanOrEqual(amountRemainingLessFee, returnValues.amountIn)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        // case amountIn calculated by next tick price > amountRemainingLessFee
        // so must to recalculate the sqrtRatioNextX96 by the amountRemainingLessFee
        // and update the amountin accordingly later, base on the recalculated sqrtRatioNextX96
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne);
      }
    } else {
      // exactOut
      // calculate amount out between 2 ticks
      // if zeroForOne -> calc the ouput amount of token1 -> getAmount1Delta
      //               -> sqrtRatioCurrentX96 > sqrtRatioTargetX96 -> Pa = sqrtRatioTargetX96
      //                                                              Pb = sqrtRatioCurrentX96
      // if !zeroForOne -> calc the ouput amount of token0 -> getAmount0Delta
      //                -> sqrtRatioCurrentX96 < sqrtRatioTargetX96 -> Pa = sqrtRatioCurrentX96
      //                                                               Pb = sqrtRatioTargetX96
      returnValues.amountOut = zeroForOne ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false) : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false);

      if (JSBI.greaterThanOrEqual(JSBI.multiply(amountRemaining, NEGATIVE_ONE), returnValues.amountOut)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, JSBI.multiply(amountRemaining, NEGATIVE_ONE), zeroForOne);
      }
    }

    var max = JSBI.equal(sqrtRatioTargetX96, returnValues.sqrtRatioNextX96); //recalculate amountIn/Out base on sqrtRatioNextX96 recalculated if needed

    if (zeroForOne) {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false);
    } else {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false);
    }

    if (!exactIn && JSBI.greaterThan(returnValues.amountOut, JSBI.multiply(amountRemaining, NEGATIVE_ONE))) {
      returnValues.amountOut = JSBI.multiply(amountRemaining, NEGATIVE_ONE);
    }

    if (exactIn && JSBI.notEqual(returnValues.sqrtRatioNextX96, sqrtRatioTargetX96)) {
      // we didn't reach the target, so take the remainder of the maximum input as fee
      returnValues.feeAmount = JSBI.subtract(amountRemaining, returnValues.amountIn);
    } else {
      returnValues.feeAmount = FullMath.mulDivRoundingUp(returnValues.amountIn, JSBI.BigInt(feePips), JSBI.subtract(BPS, JSBI.BigInt(feePips)));
    }

    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.feeAmount];
  };

  return SwapMath;
}();

/**
 * By default, pools will not allow operations that require ticks.
 */

var NO_TICK_DATA_PROVIDER_DEFAULT = /*#__PURE__*/new NoTickDataProvider();
/**
 * Represents a V3 pool
 */

var Pool = /*#__PURE__*/function () {
  /**
   * Construct a pool
   * @param tokenA One of the tokens in the pool
   * @param tokenB The other token in the pool
   * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
   * @param sqrtRatioX96 The sqrt of the current ratio of amounts of token1 to token0
   * @param liquidity The current value of in range liquidity
   * @param tickCurrent The current tick of the pool
   * @param ticks The current state of the pool ticks or a data provider that can return tick data
   */
  function Pool(tokenA, tokenB, fee, sqrtRatioX96, liquidity, reinvestLiquidity, tickCurrent, ticks) {
    if (ticks === void 0) {
      ticks = NO_TICK_DATA_PROVIDER_DEFAULT;
    }

    !(Number.isInteger(fee) && fee < 100000) ?  invariant(false, 'FEE')  : void 0;
    var tickCurrentSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent);
    var nextTickSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent + 1);
    !(JSBI.greaterThanOrEqual(JSBI.BigInt(sqrtRatioX96), tickCurrentSqrtRatioX96) && JSBI.lessThanOrEqual(JSBI.BigInt(sqrtRatioX96), nextTickSqrtRatioX96)) ?  invariant(false, 'PRICE_BOUNDS')  : void 0;

    var _ref = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

    this.token0 = _ref[0];
    this.token1 = _ref[1];
    this.fee = fee;
    this.sqrtRatioX96 = JSBI.BigInt(sqrtRatioX96);
    this.liquidity = JSBI.BigInt(liquidity);
    this.reinvestLiquidity = JSBI.BigInt(reinvestLiquidity);
    this.tickCurrent = tickCurrent;
    this.tickDataProvider = Array.isArray(ticks) ? new TickListDataProvider(ticks, TICK_SPACINGS[fee]) : ticks;
  }

  Pool.getAddress = function getAddress(tokenA, tokenB, fee, initCodeHashManualOverride) {
    return computePoolAddress({
      factoryAddress: FACTORY_ADDRESS,
      fee: fee,
      tokenA: tokenA,
      tokenB: tokenB,
      initCodeHashManualOverride: initCodeHashManualOverride
    });
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */
  ;

  var _proto = Pool.prototype;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pool.
   */
  ;

  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
   * @returns The output amount and the pool with updated state
   */
  _proto.getOutputAmount =
  /*#__PURE__*/
  function () {
    var _getOutputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(inputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap, outputAmount, sqrtRatioX96, liquidity, tickCurrent, outputToken;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              !this.involvesToken(inputAmount.currency) ?  invariant(false, 'TOKEN')  : void 0;
              zeroForOne = inputAmount.currency.equals(this.token0);
              _context.next = 4;
              return this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96);

            case 4:
              _yield$this$swap = _context.sent;
              outputAmount = _yield$this$swap.amountCalculated;
              sqrtRatioX96 = _yield$this$swap.sqrtRatioX96;
              liquidity = _yield$this$swap.liquidity;
              tickCurrent = _yield$this$swap.tickCurrent;
              outputToken = zeroForOne ? this.token1 : this.token0;
              return _context.abrupt("return", [ksSdkCore.CurrencyAmount.fromRawAmount(outputToken, JSBI.multiply(outputAmount, NEGATIVE_ONE)), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, 0, tickCurrent, this.tickDataProvider)]);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getOutputAmount(_x, _x2) {
      return _getOutputAmount.apply(this, arguments);
    }

    return getOutputAmount;
  }();

  _proto.getOutputAmountProMM = /*#__PURE__*/function () {
    var _getOutputAmountProMM = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(inputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swapProMM, outputAmount, sqrtRatioX96, baseL, reinvestL, tickCurrent, outputToken;

      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              !this.involvesToken(inputAmount.currency) ?  invariant(false, 'TOKEN')  : void 0;
              zeroForOne = inputAmount.currency.equals(this.token0);
              _context2.next = 4;
              return this.swapProMM(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96);

            case 4:
              _yield$this$swapProMM = _context2.sent;
              outputAmount = _yield$this$swapProMM.amountCalculated;
              sqrtRatioX96 = _yield$this$swapProMM.sqrtRatioX96;
              baseL = _yield$this$swapProMM.baseL;
              reinvestL = _yield$this$swapProMM.reinvestL;
              tickCurrent = _yield$this$swapProMM.tickCurrent;
              outputToken = zeroForOne ? this.token1 : this.token0;
              return _context2.abrupt("return", [ksSdkCore.CurrencyAmount.fromRawAmount(outputToken, JSBI.multiply(outputAmount, NEGATIVE_ONE)), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, baseL, reinvestL, tickCurrent, this.tickDataProvider)]);

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getOutputAmountProMM(_x3, _x4) {
      return _getOutputAmountProMM.apply(this, arguments);
    }

    return getOutputAmountProMM;
  }()
  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  ;

  _proto.getInputAmount =
  /*#__PURE__*/
  function () {
    var _getInputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(outputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap2, inputAmount, sqrtRatioX96, liquidity, tickCurrent, inputToken;

      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              !(outputAmount.currency.isToken && this.involvesToken(outputAmount.currency)) ?  invariant(false, 'TOKEN')  : void 0;
              zeroForOne = outputAmount.currency.equals(this.token1);
              _context3.next = 4;
              return this.swap(zeroForOne, JSBI.multiply(outputAmount.quotient, NEGATIVE_ONE), sqrtPriceLimitX96);

            case 4:
              _yield$this$swap2 = _context3.sent;
              inputAmount = _yield$this$swap2.amountCalculated;
              sqrtRatioX96 = _yield$this$swap2.sqrtRatioX96;
              liquidity = _yield$this$swap2.liquidity;
              tickCurrent = _yield$this$swap2.tickCurrent;
              inputToken = zeroForOne ? this.token0 : this.token1;
              return _context3.abrupt("return", [ksSdkCore.CurrencyAmount.fromRawAmount(inputToken, inputAmount), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, 0, tickCurrent, this.tickDataProvider)]);

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getInputAmount(_x5, _x6) {
      return _getInputAmount.apply(this, arguments);
    }

    return getInputAmount;
  }() // isToken0 = zeroForOne
  ;

  _proto.swapProMM =
  /*#__PURE__*/
  function () {
    var _swapProMM = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
      var exactInput, state, step, _yield$this$tickDataP, _SwapMath$computeSwap, liquidityNet;

      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              //zeroForOne . as long as swaping token 0->1, X96 of token 0 come to 0, then MIN_SQRT_RATIO is the limit
              //!zeroForOne . as long as swaping token 0->1, X96 of token 0 come to infinity, then MAX_SQRT_RATIO is the limit
              if (!sqrtPriceLimitX96) sqrtPriceLimitX96 = zeroForOne ? JSBI.add(TickMath.MIN_SQRT_RATIO, ONE) : JSBI.subtract(TickMath.MAX_SQRT_RATIO, ONE);

              if (zeroForOne) {
                !JSBI.greaterThan(sqrtPriceLimitX96, TickMath.MIN_SQRT_RATIO) ?  invariant(false, 'RATIO_MIN')  : void 0;
                !JSBI.lessThan(sqrtPriceLimitX96, this.sqrtRatioX96) ?  invariant(false, 'RATIO_CURRENT')  : void 0;
              } else {
                !JSBI.lessThan(sqrtPriceLimitX96, TickMath.MAX_SQRT_RATIO) ?  invariant(false, 'RATIO_MAX')  : void 0;
                !JSBI.greaterThan(sqrtPriceLimitX96, this.sqrtRatioX96) ?  invariant(false, 'RATIO_CURRENT')  : void 0;
              }

              exactInput = JSBI.greaterThanOrEqual(amountSpecified, ZERO);
              state = {
                amountSpecifiedRemaining: amountSpecified,
                amountCalculated: ZERO,
                baseL: this.liquidity,
                reinvestL: this.reinvestLiquidity,
                sqrtPriceX96: this.sqrtRatioX96,
                tick: this.tickCurrent
              };

            case 4:
              if (!(JSBI.notEqual(state.amountSpecifiedRemaining, ZERO) && state.sqrtPriceX96 != sqrtPriceLimitX96)) {
                _context4.next = 41;
                break;
              }

              console.log('===[s] 1.state', Object.fromEntries(Object.entries(state).map(function (_ref2) {
                var k = _ref2[0],
                    v = _ref2[1];
                return [k, v.toString()];
              })));
              step = {};
              step.sqrtPriceStartX96 = state.sqrtPriceX96;
              _context4.next = 10;
              return this.tickDataProvider.nextInitializedTickWithinFixedDistance(state.tick, zeroForOne, 480);

            case 10:
              _yield$this$tickDataP = _context4.sent;
              step.tickNext = _yield$this$tickDataP[0];
              step.initialized = _yield$this$tickDataP[1];

              // console.log("===[s1] 1.step", Object.fromEntries(Object.entries(step).map(([k, v]) => [k, !!v ? v.toString() : v])))
              if (step.tickNext < TickMath.MIN_TICK) {
                step.tickNext = TickMath.MIN_TICK;
              } else if (step.tickNext > TickMath.MAX_TICK) {
                step.tickNext = TickMath.MAX_TICK;
              }

              step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);
              console.log('===[s] 2.step', Object.fromEntries(Object.entries(step).map(function (_ref3) {
                var k = _ref3[0],
                    v = _ref3[1];
                return [k, !!v ? v.toString() : v];
              })));
              _SwapMath$computeSwap = SwapMath.computeSwapStepPromm(state.sqrtPriceX96, (zeroForOne ? JSBI.lessThan(step.sqrtPriceNextX96, sqrtPriceLimitX96) : JSBI.greaterThan(step.sqrtPriceNextX96, sqrtPriceLimitX96)) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96, JSBI.add(state.baseL, state.reinvestL), state.amountSpecifiedRemaining, this.fee, exactInput, zeroForOne);
              state.sqrtPriceX96 = _SwapMath$computeSwap[0];
              step.amountIn = _SwapMath$computeSwap[1];
              step.amountOut = _SwapMath$computeSwap[2];
              step.deltaL = _SwapMath$computeSwap[3];
              console.log('===[s] 3.step', Object.fromEntries(Object.entries(step).map(function (_ref4) {
                var k = _ref4[0],
                    v = _ref4[1];
                return [k, !!v ? v.toString() : v];
              })));
              state.amountSpecifiedRemaining = JSBI.subtract(state.amountSpecifiedRemaining, step.amountIn);
              state.amountCalculated = JSBI.add(state.amountCalculated, step.amountOut);
              state.reinvestL = JSBI.add(state.reinvestL, step.deltaL);

              if (!JSBI.equal(state.sqrtPriceX96, step.sqrtPriceNextX96)) {
                _context4.next = 37;
                break;
              }

              if (!step.initialized) {
                _context4.next = 34;
                break;
              }

              _context4.t0 = JSBI;
              _context4.next = 30;
              return this.tickDataProvider.getTick(step.tickNext);

            case 30:
              _context4.t1 = _context4.sent.liquidityNet;
              liquidityNet = _context4.t0.BigInt.call(_context4.t0, _context4.t1);
              // if we're moving leftward, we interpret liquidityNet as the opposite sign
              // safe because liquidityNet cannot be type(int128).min
              if (zeroForOne) liquidityNet = JSBI.multiply(liquidityNet, NEGATIVE_ONE);
              state.baseL = LiquidityMath.addDelta(state.baseL, liquidityNet);

            case 34:
              state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
              _context4.next = 38;
              break;

            case 37:
              state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);

            case 38:
              console.log('===[s] 4.state', Object.fromEntries(Object.entries(state).map(function (_ref5) {
                var k = _ref5[0],
                    v = _ref5[1];
                return [k, !!v ? v.toString() : v];
              })));
              _context4.next = 4;
              break;

            case 41:
              return _context4.abrupt("return", {
                amountCalculated: state.amountCalculated,
                sqrtRatioX96: state.sqrtPriceX96,
                baseL: state.baseL,
                reinvestL: state.reinvestL,
                tickCurrent: state.tick
              });

            case 42:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function swapProMM(_x7, _x8, _x9) {
      return _swapProMM.apply(this, arguments);
    }

    return swapProMM;
  }()
  /**
   * Executes a swap
   * @param zeroForOne Whether the amount in is token0 or token1
   * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns amountCalculated
   * @returns sqrtRatioX96
   * @returns liquidity
   * @returns tickCurrent
   */
  ;

  _proto.swap =
  /*#__PURE__*/
  function () {
    var _swap = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
      var exactInput, state, step, _yield$this$tickDataP2, _SwapMath$computeSwap2, liquidityNet;

      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              //zeroForOne . as long as swaping token 0->1, X96 of token 0 come to 0, then MIN_SQRT_RATIO is the limit
              //!zeroForOne . as long as swaping token 0->1, X96 of token 0 come to infinity, then MAX_SQRT_RATIO is the limit
              if (!sqrtPriceLimitX96) sqrtPriceLimitX96 = zeroForOne ? JSBI.add(TickMath.MIN_SQRT_RATIO, ONE) : JSBI.subtract(TickMath.MAX_SQRT_RATIO, ONE);

              if (zeroForOne) {
                !JSBI.greaterThan(sqrtPriceLimitX96, TickMath.MIN_SQRT_RATIO) ?  invariant(false, 'RATIO_MIN')  : void 0;
                !JSBI.lessThan(sqrtPriceLimitX96, this.sqrtRatioX96) ?  invariant(false, 'RATIO_CURRENT')  : void 0;
              } else {
                !JSBI.lessThan(sqrtPriceLimitX96, TickMath.MAX_SQRT_RATIO) ?  invariant(false, 'RATIO_MAX')  : void 0;
                !JSBI.greaterThan(sqrtPriceLimitX96, this.sqrtRatioX96) ?  invariant(false, 'RATIO_CURRENT')  : void 0;
              }

              exactInput = JSBI.greaterThanOrEqual(amountSpecified, ZERO); // keep track of swap state

              state = {
                amountSpecifiedRemaining: amountSpecified,
                amountCalculated: ZERO,
                sqrtPriceX96: this.sqrtRatioX96,
                tick: this.tickCurrent,
                liquidity: this.liquidity
              }; // interface StepComputations {
              //   sqrtPriceStartX96: JSBI
              //   tickNext: number
              //   initialized: boolean
              //   sqrtPriceNextX96: JSBI
              //   amountIn: JSBI
              //   amountOut: JSBI
              //   feeAmount: JSBI
              // }
              // start swap while loop

            case 4:
              if (!(JSBI.notEqual(state.amountSpecifiedRemaining, ZERO) && state.sqrtPriceX96 != sqrtPriceLimitX96)) {
                _context5.next = 35;
                break;
              }

              step = {};
              step.sqrtPriceStartX96 = state.sqrtPriceX96;
              _context5.next = 9;
              return this.tickDataProvider.nextInitializedTickWithinOneWord(state.tick, zeroForOne, this.tickSpacing);

            case 9:
              _yield$this$tickDataP2 = _context5.sent;
              step.tickNext = _yield$this$tickDataP2[0];
              step.initialized = _yield$this$tickDataP2[1];

              if (step.tickNext < TickMath.MIN_TICK) {
                step.tickNext = TickMath.MIN_TICK;
              } else if (step.tickNext > TickMath.MAX_TICK) {
                step.tickNext = TickMath.MAX_TICK;
              }

              step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);
              _SwapMath$computeSwap2 = SwapMath.computeSwapStep(state.sqrtPriceX96, (zeroForOne ? JSBI.lessThan(step.sqrtPriceNextX96, sqrtPriceLimitX96) : JSBI.greaterThan(step.sqrtPriceNextX96, sqrtPriceLimitX96)) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96, state.liquidity, state.amountSpecifiedRemaining, this.fee);
              state.sqrtPriceX96 = _SwapMath$computeSwap2[0];
              step.amountIn = _SwapMath$computeSwap2[1];
              step.amountOut = _SwapMath$computeSwap2[2];
              step.feeAmount = _SwapMath$computeSwap2[3];

              if (exactInput) {
                state.amountSpecifiedRemaining = JSBI.subtract(state.amountSpecifiedRemaining, JSBI.add(step.amountIn, step.feeAmount));
                state.amountCalculated = JSBI.subtract(state.amountCalculated, step.amountOut);
              } else {
                state.amountSpecifiedRemaining = JSBI.add(state.amountSpecifiedRemaining, step.amountOut);
                state.amountCalculated = JSBI.add(state.amountCalculated, JSBI.add(step.amountIn, step.feeAmount));
              } // TODO


              if (!JSBI.equal(state.sqrtPriceX96, step.sqrtPriceNextX96)) {
                _context5.next = 32;
                break;
              }

              if (!step.initialized) {
                _context5.next = 29;
                break;
              }

              _context5.t0 = JSBI;
              _context5.next = 25;
              return this.tickDataProvider.getTick(step.tickNext);

            case 25:
              _context5.t1 = _context5.sent.liquidityNet;
              liquidityNet = _context5.t0.BigInt.call(_context5.t0, _context5.t1);
              // if we're moving leftward, we interpret liquidityNet as the opposite sign
              // safe because liquidityNet cannot be type(int128).min
              if (zeroForOne) liquidityNet = JSBI.multiply(liquidityNet, NEGATIVE_ONE);
              state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);

            case 29:
              state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
              _context5.next = 33;
              break;

            case 32:
              if (state.sqrtPriceX96 != step.sqrtPriceStartX96) {
                // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
                state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
              }

            case 33:
              _context5.next = 4;
              break;

            case 35:
              return _context5.abrupt("return", {
                amountCalculated: state.amountCalculated,
                sqrtRatioX96: state.sqrtPriceX96,
                liquidity: state.liquidity,
                tickCurrent: state.tick
              });

            case 36:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function swap(_x10, _x11, _x12) {
      return _swap.apply(this, arguments);
    }

    return swap;
  }();

  _createClass(Pool, [{
    key: "token0Price",
    get: function get() {
      var _this$_token0Price;

      return (_this$_token0Price = this._token0Price) != null ? _this$_token0Price : this._token0Price = new ksSdkCore.Price(this.token0, this.token1, Q192, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96));
    }
    /**
     * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
     */

  }, {
    key: "token1Price",
    get: function get() {
      var _this$_token1Price;

      return (_this$_token1Price = this._token1Price) != null ? _this$_token1Price : this._token1Price = new ksSdkCore.Price(this.token1, this.token0, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96), Q192);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "tickSpacing",
    get: function get() {
      return TICK_SPACINGS[this.fee];
    }
  }]);

  return Pool;
}();

var Position = /*#__PURE__*/function () {
  /**
   * Constructs a position for a given pool with the given liquidity
   * @param pool For which pool the liquidity is assigned
   * @param liquidity The amount of liquidity that is in the position
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   */
  function Position(_ref) {
    var pool = _ref.pool,
        liquidity = _ref.liquidity,
        tickLower = _ref.tickLower,
        tickUpper = _ref.tickUpper;
    // cached resuts for the getters
    this._token0Amount = null;
    this._token1Amount = null;
    this._mintAmounts = null;
    !(tickLower < tickUpper) ?  invariant(false, 'TICK_ORDER')  : void 0;
    !(tickLower >= TickMath.MIN_TICK && tickLower % pool.tickSpacing === 0) ?  invariant(false, 'TICK_LOWER')  : void 0;
    !(tickUpper <= TickMath.MAX_TICK && tickUpper % pool.tickSpacing === 0) ?  invariant(false, 'TICK_UPPER')  : void 0;
    this.pool = pool;
    this.tickLower = tickLower;
    this.tickUpper = tickUpper;
    this.liquidity = JSBI.BigInt(liquidity);
  }
  /**
   * Returns the price of token0 at the lower tick
   */


  var _proto = Position.prototype;

  /**
   * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
   * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
   * @returns The sqrt ratios after slippage
   */
  _proto.ratiosAfterSlippage = function ratiosAfterSlippage(slippageTolerance) {
    var priceLower = this.pool.token0Price.asFraction.multiply(new ksSdkCore.Percent(1).subtract(slippageTolerance));
    var priceUpper = this.pool.token0Price.asFraction.multiply(slippageTolerance.add(1));
    var sqrtRatioX96Lower = encodeSqrtRatioX96(priceLower.numerator, priceLower.denominator);

    if (JSBI.lessThanOrEqual(sqrtRatioX96Lower, TickMath.MIN_SQRT_RATIO)) {
      sqrtRatioX96Lower = JSBI.add(TickMath.MIN_SQRT_RATIO, JSBI.BigInt(1));
    }

    var sqrtRatioX96Upper = encodeSqrtRatioX96(priceUpper.numerator, priceUpper.denominator);

    if (JSBI.greaterThanOrEqual(sqrtRatioX96Upper, TickMath.MAX_SQRT_RATIO)) {
      sqrtRatioX96Upper = JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1));
    }

    return {
      sqrtRatioX96Lower: sqrtRatioX96Lower,
      sqrtRatioX96Upper: sqrtRatioX96Upper
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
   * with the given slippage tolerance
   * @param slippageTolerance Tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  ;

  _proto.mintAmountsWithSlippage = function mintAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip = this.ratiosAfterSlippage(slippageTolerance),
        sqrtRatioX96Upper = _this$ratiosAfterSlip.sqrtRatioX96Upper,
        sqrtRatioX96Lower = _this$ratiosAfterSlip.sqrtRatioX96Lower; // construct counterfactual pools


    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0
    /* liquidity doesn't matter */
    , this.pool.reinvestLiquidity, TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0
    /* liquidity doesn't matter */
    , this.pool.reinvestLiquidity, TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper)); // because the router is imprecise, we need to calculate the position that will be created (assuming no slippage)

    var positionThatWillBeCreated = Position.fromAmounts(_extends({
      pool: this.pool,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }, this.mintAmounts, {
      useFullPrecision: false
    })); // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...

    var amount0 = new Position({
      pool: poolUpper,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount0; // ...and the lower for amount1

    var amount1 = new Position({
      pool: poolLower,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount1;
    return {
      amount0: amount0,
      amount1: amount1
    };
  }
  /**
   * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
   * position with the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  ;

  _proto.burnAmountsWithSlippage = function burnAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip2 = this.ratiosAfterSlippage(slippageTolerance),
        sqrtRatioX96Upper = _this$ratiosAfterSlip2.sqrtRatioX96Upper,
        sqrtRatioX96Lower = _this$ratiosAfterSlip2.sqrtRatioX96Lower; // construct counterfactual pools


    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0
    /* liquidity doesn't matter */
    , this.pool.reinvestLiquidity, TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0
    /* liquidity doesn't matter */
    , this.pool.reinvestLiquidity, TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper)); // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...

    var amount0 = new Position({
      pool: poolUpper,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount0; // ...and the lower for amount1

    var amount1 = new Position({
      pool: poolLower,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount1;
    return {
      amount0: amount0.quotient,
      amount1: amount1.quotient
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
   * the current price for the pool
   */
  ;

  /**
   * Computes the maximum amount of liquidity received for a given amount of token0, token1,
   * and the prices at the tick boundaries.
   * @param pool The pool for which the position should be created
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   * @param amount0 token0 amount
   * @param amount1 token1 amount
   * @param useFullPrecision If false, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The amount of liquidity for the position
   */
  Position.fromAmounts = function fromAmounts(_ref2) {
    var pool = _ref2.pool,
        tickLower = _ref2.tickLower,
        tickUpper = _ref2.tickUpper,
        amount0 = _ref2.amount0,
        amount1 = _ref2.amount1,
        useFullPrecision = _ref2.useFullPrecision;
    var sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    var sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
    return new Position({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      liquidity: maxLiquidityForAmounts(pool.sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision)
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token0, assuming an unlimited amount of token1
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount0 The desired amount of token0
   * @param useFullPrecision If true, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The position
   */
  ;

  Position.fromAmount0 = function fromAmount0(_ref3) {
    var pool = _ref3.pool,
        tickLower = _ref3.tickLower,
        tickUpper = _ref3.tickUpper,
        amount0 = _ref3.amount0,
        useFullPrecision = _ref3.useFullPrecision;
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: amount0,
      amount1: ksSdkCore.MaxUint256,
      useFullPrecision: useFullPrecision
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token1, assuming an unlimited amount of token0
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount1 The desired amount of token1
   * @returns The position
   */
  ;

  Position.fromAmount1 = function fromAmount1(_ref4) {
    var pool = _ref4.pool,
        tickLower = _ref4.tickLower,
        tickUpper = _ref4.tickUpper,
        amount1 = _ref4.amount1;
    // this function always uses full precision,
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: ksSdkCore.MaxUint256,
      amount1: amount1,
      useFullPrecision: true
    });
  };

  _createClass(Position, [{
    key: "token0PriceLower",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickLower);
    }
    /**
     * Returns the price of token0 at the upper tick
     */

  }, {
    key: "token0PriceUpper",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickUpper);
    }
    /**
     * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
     */

  }, {
    key: "amount0",
    get: function get() {
      if (this._token0Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token0Amount = ksSdkCore.CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token0Amount = ksSdkCore.CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else {
          this._token0Amount = ksSdkCore.CurrencyAmount.fromRawAmount(this.pool.token0, ZERO);
        }
      }

      return this._token0Amount;
    }
    /**
     * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
     */

  }, {
    key: "amount1",
    get: function get() {
      if (this._token1Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token1Amount = ksSdkCore.CurrencyAmount.fromRawAmount(this.pool.token1, ZERO);
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token1Amount = ksSdkCore.CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, false));
        } else {
          this._token1Amount = ksSdkCore.CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        }
      }

      return this._token1Amount;
    }
  }, {
    key: "mintAmounts",
    get: function get() {
      if (this._mintAmounts === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: ZERO
          };
        } else if (this.pool.tickCurrent < this.tickUpper) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, true)
          };
        } else {
          return {
            amount0: ZERO,
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true)
          };
        }
      }

      return this._mintAmounts;
    }
  }]);

  return Position;
}();

/**
 * Represents a list of pools through which a swap can occur
 * @template TInput The input token
 * @template TOutput The output token
 */

var Route = /*#__PURE__*/function () {
  /**
   * Creates an instance of route.
   * @param pools An array of `Pool` objects, ordered by the route the swap will take
   * @param input The input token
   * @param output The output token
   */
  function Route(pools, input, output) {
    this._midPrice = null;
    !(pools.length > 0) ?  invariant(false, 'POOLS')  : void 0;
    var chainId = pools[0].chainId;
    var allOnSameChain = pools.every(function (pool) {
      return pool.chainId === chainId;
    });
    !allOnSameChain ?  invariant(false, 'CHAIN_IDS')  : void 0;
    var wrappedInput = input.wrapped;
    !pools[0].involvesToken(wrappedInput) ?  invariant(false, 'INPUT')  : void 0;
    !pools[pools.length - 1].involvesToken(output.wrapped) ?  invariant(false, 'OUTPUT')  : void 0;
    /**
     * Normalizes token0-token1 order and selects the next token/fee step to add to the path
     * */

    var tokenPath = [wrappedInput];

    for (var _iterator = _createForOfIteratorHelperLoose(pools.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pool = _step$value[1];
      var currentInputToken = tokenPath[i];
      !(currentInputToken.equals(pool.token0) || currentInputToken.equals(pool.token1)) ?  invariant(false, 'PATH')  : void 0;
      var nextToken = currentInputToken.equals(pool.token0) ? pool.token1 : pool.token0;
      tokenPath.push(nextToken);
    }

    this.pools = pools;
    this.tokenPath = tokenPath;
    this.input = input;
    this.output = output != null ? output : tokenPath[tokenPath.length - 1];
  }

  _createClass(Route, [{
    key: "chainId",
    get: function get() {
      return this.pools[0].chainId;
    }
    /**
     * Returns the mid price of the route
     */

  }, {
    key: "midPrice",
    get: function get() {
      if (this._midPrice !== null) return this._midPrice;
      var price = this.pools.slice(1).reduce(function (_ref, pool) {
        var nextInput = _ref.nextInput,
            price = _ref.price;
        return nextInput.equals(pool.token0) ? {
          nextInput: pool.token1,
          price: price.multiply(pool.token0Price)
        } : {
          nextInput: pool.token0,
          price: price.multiply(pool.token1Price)
        };
      }, this.pools[0].token0.equals(this.input.wrapped) ? {
        nextInput: this.pools[0].token1,
        price: this.pools[0].token0Price
      } : {
        nextInput: this.pools[0].token0,
        price: this.pools[0].token1Price
      }).price;
      return this._midPrice = new ksSdkCore.Price(this.input, this.output, price.denominator, price.numerator);
    }
  }]);

  return Route;
}();

/**
 * Represents a trade executed against a set of routes where some percentage of the input is
 * split across each route.
 *
 * Each route has its own set of pools. Pools can not be re-used across routes.
 *
 * Does not account for slippage, i.e., changes in price environment that can occur between
 * the time the trade is submitted and when it is executed.
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 */

var Trade = /*#__PURE__*/function () {
  /**
   * Construct a trade by passing in the pre-computed property values
   * @param routes The routes through which the trade occurs
   * @param tradeType The type of trade, exact input or exact output
   */
  function Trade(_ref) {
    var routes = _ref.routes,
        tradeType = _ref.tradeType;
    var inputCurrency = routes[0].inputAmount.currency;
    var outputCurrency = routes[0].outputAmount.currency;
    !routes.every(function (_ref2) {
      var route = _ref2.route;
      return inputCurrency.wrapped.equals(route.input.wrapped);
    }) ?  invariant(false, 'INPUT_CURRENCY_MATCH')  : void 0;
    !routes.every(function (_ref3) {
      var route = _ref3.route;
      return outputCurrency.wrapped.equals(route.output.wrapped);
    }) ?  invariant(false, 'OUTPUT_CURRENCY_MATCH')  : void 0;
    var numPools = routes.map(function (_ref4) {
      var route = _ref4.route;
      return route.pools.length;
    }).reduce(function (total, cur) {
      return total + cur;
    }, 0);
    var poolAddressSet = new Set();

    for (var _iterator = _createForOfIteratorHelperLoose(routes), _step; !(_step = _iterator()).done;) {
      var route = _step.value.route;

      for (var _iterator2 = _createForOfIteratorHelperLoose(route.pools), _step2; !(_step2 = _iterator2()).done;) {
        var pool = _step2.value;
        poolAddressSet.add(Pool.getAddress(pool.token0, pool.token1, pool.fee));
      }
    }

    !(numPools == poolAddressSet.size) ?  invariant(false, 'POOLS_DUPLICATED')  : void 0;
    this.swaps = routes;
    this.tradeType = tradeType;
  }
  /**
   * @deprecated Deprecated in favor of 'swaps' property. If the trade consists of multiple routes
   * this will return an error.
   *
   * When the trade consists of just a single route, this returns the route of the trade,
   * i.e. which pools the trade goes through.
   */


  /**
   * Creates a trade without computing the result of swapping through the route. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  Trade.createUncheckedTrade = function createUncheckedTrade(constructorArguments) {
    return new Trade(_extends({}, constructorArguments, {
      routes: [{
        inputAmount: constructorArguments.inputAmount,
        outputAmount: constructorArguments.outputAmount,
        route: constructorArguments.route
      }]
    }));
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount out
   */
  ;

  var _proto = Trade.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance, amountOut) {
    if (amountOut === void 0) {
      amountOut = this.outputAmount;
    }

    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === ksSdkCore.TradeType.EXACT_OUTPUT) {
      return amountOut;
    } else {
      var slippageAdjustedAmountOut = new ksSdkCore.Fraction(ONE).add(slippageTolerance).invert().multiply(amountOut.quotient).quotient;
      return ksSdkCore.CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount in
   */
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance, amountIn) {
    if (amountIn === void 0) {
      amountIn = this.inputAmount;
    }

    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === ksSdkCore.TradeType.EXACT_INPUT) {
      return amountIn;
    } else {
      var slippageAdjustedAmountIn = new ksSdkCore.Fraction(ONE).add(slippageTolerance).multiply(amountIn.quotient).quotient;
      return ksSdkCore.CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
    }
  }
  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   * @returns The execution price
   */
  ;

  _proto.worstExecutionPrice = function worstExecutionPrice(slippageTolerance) {
    return new ksSdkCore.Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
  };

  _createClass(Trade, [{
    key: "route",
    get: function get() {
      !(this.swaps.length == 1) ?  invariant(false, 'MULTIPLE_ROUTES')  : void 0;
      return this.swaps[0].route;
    }
    /**
     * The input amount for the trade assuming no slippage.
     */

  }, {
    key: "inputAmount",
    get: function get() {
      if (this._inputAmount) {
        return this._inputAmount;
      }

      var inputCurrency = this.swaps[0].inputAmount.currency;
      var totalInputFromRoutes = this.swaps.map(function (_ref5) {
        var inputAmount = _ref5.inputAmount;
        return inputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, ksSdkCore.CurrencyAmount.fromRawAmount(inputCurrency, 0));
      this._inputAmount = totalInputFromRoutes;
      return this._inputAmount;
    }
    /**
     * The output amount for the trade assuming no slippage.
     */

  }, {
    key: "outputAmount",
    get: function get() {
      if (this._outputAmount) {
        return this._outputAmount;
      }

      var outputCurrency = this.swaps[0].outputAmount.currency;
      var totalOutputFromRoutes = this.swaps.map(function (_ref6) {
        var outputAmount = _ref6.outputAmount;
        return outputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, ksSdkCore.CurrencyAmount.fromRawAmount(outputCurrency, 0));
      this._outputAmount = totalOutputFromRoutes;
      return this._outputAmount;
    }
    /**
     * The price expressed in terms of output amount/input amount.
     */

  }, {
    key: "executionPrice",
    get: function get() {
      var _this$_executionPrice;

      return (_this$_executionPrice = this._executionPrice) != null ? _this$_executionPrice : this._executionPrice = new ksSdkCore.Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
    }
    /**
     * Returns the percent difference between the route's mid price and the price impact
     */

  }, {
    key: "priceImpact",
    get: function get() {
      if (this._priceImpact) {
        return this._priceImpact;
      }

      var spotOutputAmount = ksSdkCore.CurrencyAmount.fromRawAmount(this.outputAmount.currency, 0);

      for (var _iterator3 = _createForOfIteratorHelperLoose(this.swaps), _step3; !(_step3 = _iterator3()).done;) {
        var _step3$value = _step3.value,
            route = _step3$value.route,
            inputAmount = _step3$value.inputAmount;
        var midPrice = route.midPrice;
        spotOutputAmount = spotOutputAmount.add(midPrice.quote(inputAmount));
      }

      var priceImpact = spotOutputAmount.subtract(this.outputAmount).divide(spotOutputAmount);
      this._priceImpact = new ksSdkCore.Percent(priceImpact.numerator, priceImpact.denominator);
      return this._priceImpact;
    }
  }]);

  return Trade;
}();

var abi = [
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	}
];

var Multicall = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Multicall() {}

  Multicall.encodeMulticall = function encodeMulticall(calldatas) {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas];
    }

    return calldatas.length === 1 ? calldatas[0] : Multicall.INTERFACE.encodeFunctionData('multicall', [calldatas]);
  };

  return Multicall;
}();
Multicall.INTERFACE = /*#__PURE__*/new abi$5.Interface(abi);

var abi$1 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WETH",
				type: "address"
			},
			{
				internalType: "address",
				name: "_descriptor",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "additionalRTokenOwed",
				type: "uint256"
			}
		],
		name: "AddLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "ApprovalForAll",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "BurnPosition",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "rTokenBurn",
				type: "uint256"
			}
		],
		name: "BurnRToken",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "uint80",
				name: "poolId",
				type: "uint80"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "MintPosition",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "additionalRTokenOwed",
				type: "uint256"
			}
		],
		name: "RemoveLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "additionalRTokenOwed",
				type: "uint256"
			}
		],
		name: "SyncFeeGrowth",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "PERMIT_TYPEHASH",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "WETH",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "int24[2]",
						name: "ticksPrevious",
						type: "int24[2]"
					},
					{
						internalType: "uint256",
						name: "amount0Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct IBasePositionManager.IncreaseLiquidityParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "addLiquidity",
		outputs: [
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "additionalRTokenOwed",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "addressToPoolId",
		outputs: [
			{
				internalType: "uint80",
				name: "",
				type: "uint80"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "antiSnipAttackData",
		outputs: [
			{
				internalType: "uint32",
				name: "lastActionTime",
				type: "uint32"
			},
			{
				internalType: "uint32",
				name: "lockTime",
				type: "uint32"
			},
			{
				internalType: "uint32",
				name: "unlockTime",
				type: "uint32"
			},
			{
				internalType: "uint256",
				name: "feesLocked",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "burn",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct IBasePositionManager.BurnRTokenParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "burnRTokens",
		outputs: [
			{
				internalType: "uint256",
				name: "rTokenQty",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "uint160",
				name: "currentSqrtP",
				type: "uint160"
			}
		],
		name: "createAndUnlockPoolIfNecessary",
		outputs: [
			{
				internalType: "address",
				name: "pool",
				type: "address"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "getApproved",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			}
		],
		name: "isApprovedForAll",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "isRToken",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "token0",
						type: "address"
					},
					{
						internalType: "address",
						name: "token1",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "int24",
						name: "tickLower",
						type: "int24"
					},
					{
						internalType: "int24",
						name: "tickUpper",
						type: "int24"
					},
					{
						internalType: "int24[2]",
						name: "ticksPrevious",
						type: "int24[2]"
					},
					{
						internalType: "uint256",
						name: "amount0Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct IBasePositionManager.MintParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "deltaQty0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deltaQty1",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "mintCallback",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "nextPoolId",
		outputs: [
			{
				internalType: "uint80",
				name: "",
				type: "uint80"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "nextTokenId",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "ownerOf",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "positions",
		outputs: [
			{
				components: [
					{
						internalType: "uint96",
						name: "nonce",
						type: "uint96"
					},
					{
						internalType: "address",
						name: "operator",
						type: "address"
					},
					{
						internalType: "uint80",
						name: "poolId",
						type: "uint80"
					},
					{
						internalType: "int24",
						name: "tickLower",
						type: "int24"
					},
					{
						internalType: "int24",
						name: "tickUpper",
						type: "int24"
					},
					{
						internalType: "uint128",
						name: "liquidity",
						type: "uint128"
					},
					{
						internalType: "uint256",
						name: "rTokenOwed",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "feeGrowthInsideLast",
						type: "uint256"
					}
				],
				internalType: "struct IBasePositionManager.Position",
				name: "pos",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "address",
						name: "token0",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "address",
						name: "token1",
						type: "address"
					}
				],
				internalType: "struct IBasePositionManager.PoolInfo",
				name: "info",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "refundEth",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "uint128",
						name: "liquidity",
						type: "uint128"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct IBasePositionManager.RemoveLiquidityParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "removeLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "additionalRTokenOwed",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "setApprovalForAll",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4"
			}
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "syncFeeGrowth",
		outputs: [
			{
				internalType: "uint256",
				name: "additionalRTokenOwed",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "tokenByIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "tokenOfOwnerByIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "tokenURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "minAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "transferAllTokens",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "minAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWeth",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];

var abi$2 = [
	{
		inputs: [
		],
		name: "refundEth",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "transferAllTokens",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "transferAllTokensWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWeth",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "unwrapWethWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	}
];

var validateAndParseAddress = function validateAndParseAddress(address) {
  return ksSdkCore.validateAndParseAddress(address);
};

var Payments = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Payments() {}

  Payments.encodeFeeBips = function encodeFeeBips(fee) {
    return toHex(fee.multiply(10000).quotient);
  } // Unwraps the contract's WETH9 balance and sends it to recipient as ETH.
  // The amountMinimum parameter prevents malicious contracts from stealing WETH9 from users.
  ;

  Payments.encodeUnwrapWETH = function encodeUnwrapWETH(amountMinimum, recipient, feeOptions) {
    recipient = validateAndParseAddress(recipient);

    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('unwrapWethWithFee', [toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('unwrapWeth', [toHex(amountMinimum), recipient]);
    }
  } //Transfers the full amount of a token held by this contract to recipient
  //The amountMinimum parameter prevents malicious contracts from stealing the token from users
  ;

  Payments.encodeSweepToken = function encodeSweepToken(token, amountMinimum, recipient, feeOptions) {
    recipient = validateAndParseAddress(recipient);

    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('transferAllTokensWithFee', [token.address, toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('transferAllTokens', [token.address, toHex(amountMinimum), recipient]);
    }
  };

  Payments.encodeRefundETH = function encodeRefundETH() {
    return Payments.INTERFACE.encodeFunctionData('refundEth');
  };

  return Payments;
}();
Payments.INTERFACE = /*#__PURE__*/new abi$5.Interface(abi$2);

var _excluded = ["expectedCurrencyOwed0", "expectedCurrencyOwed1"];

function isMint(options) {
  return Object.keys(options).some(function (k) {
    return k === 'recipient';
  });
}

var NonfungiblePositionManager = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function NonfungiblePositionManager() {}

  NonfungiblePositionManager.encodeCreate = function encodeCreate(pool) {
    return NonfungiblePositionManager.INTERFACE.encodeFunctionData('createAndUnlockPoolIfNecessary', [pool.token0.address, pool.token1.address, pool.fee, toHex(pool.sqrtRatioX96)]);
  };

  NonfungiblePositionManager.createCallParameters = function createCallParameters(pool) {
    Multicall.encodeMulticall([this.encodeCreate(pool)]);
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(0)
    };
  };

  NonfungiblePositionManager.createCallParametersTest = function createCallParametersTest(pool, ethAmount) {
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(ethAmount)
    };
  };

  NonfungiblePositionManager.addCallParameters = function addCallParameters(position, ticks, options) {
    var _this = this;

    var positions = Array.isArray(position) ? position : [position];

    if (isMint(options) && options.createPool) {
      !(positions.length === 1) ?  invariant(false, 'CREATE_POOL_ONLY_ACCEPT_ONE_POSITION')  : void 0;
    }

    var ticksPrevious = Array.isArray(ticks[0]) ? ticks : [ticks];
    !(positions.length === ticksPrevious.length) ?  invariant(false, 'POSITIONS_AND_TICK_PREVIOUS_NOT_SAME_SIZE')  : void 0;
    positions.forEach(function (p) {
      !JSBI.greaterThan(p.liquidity, ZERO) ?  invariant(false, 'ZERO_LIQUIDITY')  : void 0;
    });
    var calldatas = [];
    var value = JSBI.BigInt(0);
    var refundValue = JSBI.BigInt(0);
    positions.forEach(function (p, index) {
      // get amounts
      var _p$mintAmounts = p.mintAmounts,
          amount0Desired = _p$mintAmounts.amount0,
          amount1Desired = _p$mintAmounts.amount1; // adjust for slippage

      var minimumAmounts = p.mintAmountsWithSlippage(options.slippageTolerance);
      var amount0Min = toHex(minimumAmounts.amount0);
      var amount1Min = toHex(minimumAmounts.amount1);
      var deadline = toHex(options.deadline); // create pool if needed

      if (isMint(options) && options.createPool) {
        calldatas.push(_this.encodeCreate(p.pool));
      } // permits if necessary
      // if (options.token0Permit) {
      //   calldatas.push(SelfPermit.encodePermit(position.pool.token0, options.token0Permit))
      // }
      // if (options.token1Permit) {
      //   calldatas.push(SelfPermit.encodePermit(position.pool.token1, options.token1Permit))
      // }
      // mint


      if (isMint(options)) {
        var recipient = validateAndParseAddress(options.recipient);
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('mint', [{
          token0: p.pool.token0.address,
          token1: p.pool.token1.address,
          fee: p.pool.fee,
          tickLower: p.tickLower,
          tickUpper: p.tickUpper,
          ticksPrevious: ticksPrevious[index],
          amount0Desired: toHex(amount0Desired),
          amount1Desired: toHex(amount1Desired),
          amount0Min: amount0Min,
          amount1Min: amount1Min,
          recipient: recipient,
          deadline: deadline
        }]));
      } else {
        // increase
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('addLiquidity', [{
          tokenId: toHex(options.tokenId),
          ticksPrevious: ticksPrevious[index],
          amount0Desired: toHex(amount0Desired),
          amount1Desired: toHex(amount1Desired),
          amount0Min: amount0Min,
          amount1Min: amount1Min,
          deadline: deadline
        }]));
      }

      if (options.useNative) {
        var wrapped = options.useNative.wrapped;
        !(p.pool.token0.equals(wrapped) || p.pool.token1.equals(wrapped)) ?  invariant(false, 'NO_WETH')  : void 0;
        var wrappedValue = p.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired; // we only need to refund if we're actually sending ETH

        if (JSBI.greaterThan(wrappedValue, ZERO)) {
          // calldatas.push(Payments.encodeRefundETH())
          refundValue = JSBI.add(refundValue, wrappedValue);
        }

        if (isMint(options) && options.createPool) {
          var ethUnlock = p.pool.token0.equals(wrapped) ? SqrtPriceMath.getAmount0Unlock(p.pool.sqrtRatioX96) : SqrtPriceMath.getAmount1Unlock(p.pool.sqrtRatioX96);
          value = JSBI.add(value, JSBI.add(wrappedValue, ethUnlock));
        } else value = JSBI.add(wrappedValue, value);
      }
    });

    if (JSBI.greaterThan(refundValue, ZERO)) {
      calldatas.push(Payments.encodeRefundETH());
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(value)
    };
  };

  NonfungiblePositionManager.encodeCollect = function encodeCollect(options) {
    var calldatas = [];
    var tokenId = toHex(options.tokenId); // const involvesETH =
    // options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative

    var recipient = validateAndParseAddress(options.recipient);
    var deadline = toHex(options.deadline);

    if (!options.isRemovingLiquid && !options.isPositionClosed) {
      if (!options.legacyMode) calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('syncFeeGrowth', [tokenId]));else calldatas.push( //remove a small amount to update the RTokens
      NonfungiblePositionManager.INTERFACE.encodeFunctionData('removeLiquidity', [{
        tokenId: tokenId,
        liquidity: '0x1',
        amount0Min: 0,
        amount1Min: 0,
        deadline: deadline
      }]));
    }

    if (options.havingFee) {
      // collect
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('burnRTokens', [{
        tokenId: tokenId,
        amount0Min: 0,
        amount1Min: 0,
        deadline: deadline
      }]));
    }

    var token0IsNative = options.expectedCurrencyOwed0.currency.isNative;
    var token1IsNative = options.expectedCurrencyOwed1.currency.isNative;
    var token0Amount = options.expectedCurrencyOwed0.quotient;
    var token1Amount = options.expectedCurrencyOwed1.quotient;

    if (token0IsNative) {
      calldatas.push(Payments.encodeUnwrapWETH(token0Amount, recipient));
    } else {
      var token = options.expectedCurrencyOwed0.currency;
      calldatas.push(Payments.encodeSweepToken(token, token0Amount, recipient));
    }

    if (token1IsNative) {
      calldatas.push(Payments.encodeUnwrapWETH(token1Amount, recipient));
    } else {
      var _token = options.expectedCurrencyOwed1.currency;
      calldatas.push(Payments.encodeSweepToken(_token, token1Amount, recipient));
    } // if (involvesETH) {
    //   const ethAmount = options.expectedCurrencyOwed0.currency.isNative
    //     ? options.expectedCurrencyOwed0.quotient
    //     : options.expectedCurrencyOwed1.quotient
    //   const token = options.expectedCurrencyOwed0.currency.isNative
    //     ? (options.expectedCurrencyOwed1.currency as Token)
    //     : (options.expectedCurrencyOwed0.currency as Token)
    //   const tokenAmount = options.expectedCurrencyOwed0.currency.isNative
    //     ? options.expectedCurrencyOwed1.quotient
    //     : options.expectedCurrencyOwed0.quotient
    //   calldatas.push(Payments.encodeUnwrapWETH(ethAmount, recipient))
    //   calldatas.push(Payments.encodeSweepToken(token, tokenAmount, recipient))
    // }


    return calldatas;
  };

  NonfungiblePositionManager.collectCallParameters = function collectCallParameters(options) {
    var calldatas = NonfungiblePositionManager.encodeCollect(options);
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  }
  /**
   * Produces the calldata for completely or partially exiting a position
   * @param position The position to exit
   * @param options Additional information necessary for generating the calldata
   * @returns The call parameters
   */
  ;

  NonfungiblePositionManager.removeCallParameters = function removeCallParameters(position, options) {
    var calldatas = [];
    var deadline = toHex(options.deadline);
    var tokenId = toHex(options.tokenId);
    console.log(position); // construct a partial position with a percentage of liquidity

    var partialPosition = new Position({
      pool: position.pool,
      liquidity: options.liquidityPercentage.multiply(position.liquidity).quotient,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper
    });
    !JSBI.greaterThan(partialPosition.liquidity, ZERO) ?  invariant(false, 'ZERO_LIQUIDITY')  : void 0; // slippage-adjusted underlying amounts

    var _partialPosition$burn = partialPosition.burnAmountsWithSlippage(options.slippageTolerance),
        amount0Min = _partialPosition$burn.amount0,
        amount1Min = _partialPosition$burn.amount1;

    if (options.permit) {
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('permit', [validateAndParseAddress(options.permit.spender), tokenId, toHex(options.permit.deadline), options.permit.v, options.permit.r, options.permit.s]));
    } // remove liquidity


    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('removeLiquidity', [{
      tokenId: tokenId,
      liquidity: toHex(partialPosition.liquidity),
      amount0Min: toHex(amount0Min),
      amount1Min: toHex(amount1Min),
      deadline: deadline
    }]));

    var _options$collectOptio = options.collectOptions,
        expectedCurrencyOwed0 = _options$collectOptio.expectedCurrencyOwed0,
        expectedCurrencyOwed1 = _options$collectOptio.expectedCurrencyOwed1,
        rest = _objectWithoutPropertiesLoose(_options$collectOptio, _excluded);

    calldatas.push.apply(calldatas, NonfungiblePositionManager.encodeCollect(_extends({
      tokenId: toHex(options.tokenId),
      // add the underlying value to the expected currency already owed
      expectedCurrencyOwed0: expectedCurrencyOwed0.add(ksSdkCore.CurrencyAmount.fromRawAmount(expectedCurrencyOwed0.currency, amount0Min)),
      expectedCurrencyOwed1: expectedCurrencyOwed1.add(ksSdkCore.CurrencyAmount.fromRawAmount(expectedCurrencyOwed1.currency, amount1Min))
    }, rest)));

    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('burn', [tokenId]));
      }
    } else {
      !(options.burnToken !== true) ?  invariant(false, 'CANNOT_BURN')  : void 0;
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  };

  NonfungiblePositionManager.safeTransferFromParameters = function safeTransferFromParameters(options) {
    var recipient = validateAndParseAddress(options.recipient);
    var sender = validateAndParseAddress(options.sender);
    var calldata;

    if (options.data) {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256,bytes)', [sender, recipient, toHex(options.tokenId), options.data]);
    } else {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [sender, recipient, toHex(options.tokenId)]);
    }

    return {
      calldata: calldata,
      value: toHex(0)
    };
  };

  return NonfungiblePositionManager;
}();
NonfungiblePositionManager.INTERFACE = /*#__PURE__*/new abi$5.Interface(abi$1);

var abi$3 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		name: "quoteExactInput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint160[]",
				name: "afterSqrtPList",
				type: "uint160[]"
			},
			{
				internalType: "uint32[]",
				name: "initializedTicksCrossedList",
				type: "uint32[]"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint24",
						name: "feeUnits",
						type: "uint24"
					},
					{
						internalType: "uint160",
						name: "limitSqrtP",
						type: "uint160"
					}
				],
				internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "quoteExactInputSingle",
		outputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "usedAmount",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "returnedAmount",
						type: "uint256"
					},
					{
						internalType: "uint160",
						name: "afterSqrtP",
						type: "uint160"
					},
					{
						internalType: "uint32",
						name: "initializedTicksCrossed",
						type: "uint32"
					},
					{
						internalType: "uint256",
						name: "gasEstimate",
						type: "uint256"
					}
				],
				internalType: "struct IQuoterV2.QuoteOutput",
				name: "output",
				type: "tuple"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		name: "quoteExactOutput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint160[]",
				name: "afterSqrtPList",
				type: "uint160[]"
			},
			{
				internalType: "uint32[]",
				name: "initializedTicksCrossedList",
				type: "uint32[]"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "uint24",
						name: "feeUnits",
						type: "uint24"
					},
					{
						internalType: "uint160",
						name: "limitSqrtP",
						type: "uint160"
					}
				],
				internalType: "struct IQuoterV2.QuoteExactOutputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "quoteExactOutputSingle",
		outputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "usedAmount",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "returnedAmount",
						type: "uint256"
					},
					{
						internalType: "uint160",
						name: "afterSqrtP",
						type: "uint160"
					},
					{
						internalType: "uint32",
						name: "initializedTicksCrossed",
						type: "uint32"
					},
					{
						internalType: "uint256",
						name: "gasEstimate",
						type: "uint256"
					}
				],
				internalType: "struct IQuoterV2.QuoteOutput",
				name: "output",
				type: "tuple"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int256",
				name: "amount0Delta",
				type: "int256"
			},
			{
				internalType: "int256",
				name: "amount1Delta",
				type: "int256"
			},
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			}
		],
		name: "swapCallback",
		outputs: [
		],
		stateMutability: "view",
		type: "function"
	}
];

/**
 * Represents the Uniswap V3 QuoterV1 contract with a method for returning the formatted
 * calldata needed to call the quoter contract.
 */

var SwapQuoter = /*#__PURE__*/function () {
  function SwapQuoter() {}

  /**
   * Produces the on-chain method name of the appropriate function within QuoterV2,
   * and the relevant hex encoded parameters.
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The swap route, a list of pools through which a swap can occur
   * @param amount The amount of the quote, either an amount in, or an amount out
   * @param tradeType The trade type, either exact input or exact output
   * @returns The formatted calldata
   */
  SwapQuoter.quoteCallParameters = function quoteCallParameters(route, amount, tradeType, options) {
    if (options === void 0) {
      options = {};
    }

    var singleHop = route.pools.length === 1;
    var quoteAmount = toHex(amount.quotient);
    var calldata;

    if (singleHop) {
      if (tradeType === ksSdkCore.TradeType.EXACT_INPUT) {
        var _options$sqrtPriceLim, _options;

        calldata = SwapQuoter.INTERFACE.encodeFunctionData("quoteExactInputSingle", [[route.tokenPath[0].address, route.tokenPath[1].address, quoteAmount, route.pools[0].fee, toHex((_options$sqrtPriceLim = (_options = options) == null ? void 0 : _options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0)]]);
      } else {
        var _options$sqrtPriceLim2, _options2;

        calldata = SwapQuoter.INTERFACE.encodeFunctionData("quoteExactOutputSingle", [[route.tokenPath[0].address, route.tokenPath[1].address, quoteAmount, route.pools[0].fee, toHex((_options$sqrtPriceLim2 = (_options2 = options) == null ? void 0 : _options2.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim2 : 0)]]);
      }
    } else {
      var _options3;

      !(((_options3 = options) == null ? void 0 : _options3.sqrtPriceLimitX96) === undefined) ?  invariant(false, 'MULTIHOP_PRICE_LIMIT')  : void 0;
      var path = encodeRouteToPath(route, tradeType === ksSdkCore.TradeType.EXACT_OUTPUT);

      if (tradeType === ksSdkCore.TradeType.EXACT_INPUT) {
        calldata = SwapQuoter.INTERFACE.encodeFunctionData('quoteExactInput', [path, quoteAmount]);
      } else {
        calldata = SwapQuoter.INTERFACE.encodeFunctionData('quoteExactOutput', [path, quoteAmount]);
      }
    }

    return {
      calldata: calldata,
      value: toHex(0)
    };
  };

  return SwapQuoter;
}();
SwapQuoter.INTERFACE = /*#__PURE__*/new abi$5.Interface(abi$3);

function isAllowedPermit(permitOptions) {
  return 'nonce' in permitOptions;
}

var SelfPermit = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SelfPermit() {}

  SelfPermit.encodePermit = function encodePermit(token, options) {
    return isAllowedPermit(options) ? SelfPermit.INTERFACE.encodeFunctionData('selfPermitAllowed', [token.address, toHex(options.nonce), toHex(options.expiry), options.v, options.r, options.s]) : SelfPermit.INTERFACE.encodeFunctionData('selfPermit', [token.address, toHex(options.amount), toHex(options.deadline), options.v, options.r, options.s]);
  };

  return SelfPermit;
}();
SelfPermit.INTERFACE = /*#__PURE__*/new abi$5.Interface(ISelfPermit_json.abi);

var abi$4 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WETH",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "WETH",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "refundEth",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int256",
				name: "deltaQty0",
				type: "int256"
			},
			{
				internalType: "int256",
				name: "deltaQty1",
				type: "int256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "swapCallback",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "bytes",
						name: "path",
						type: "bytes"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "minAmountOut",
						type: "uint256"
					}
				],
				internalType: "struct IRouter.ExactInputParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "swapExactInput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "minAmountOut",
						type: "uint256"
					},
					{
						internalType: "uint160",
						name: "limitSqrtP",
						type: "uint160"
					}
				],
				internalType: "struct IRouter.ExactInputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "swapExactInputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "bytes",
						name: "path",
						type: "bytes"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOut",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "maxAmountIn",
						type: "uint256"
					}
				],
				internalType: "struct IRouter.ExactOutputParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "swapExactOutput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOut",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "maxAmountIn",
						type: "uint256"
					},
					{
						internalType: "uint160",
						name: "limitSqrtP",
						type: "uint160"
					}
				],
				internalType: "struct IRouter.ExactOutputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "swapExactOutputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "minAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "transferAllTokens",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "minAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeUnits",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "transferAllTokensWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "minAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWeth",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "minAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeUnits",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "unwrapWethWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];

/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */

var SwapRouter = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapRouter() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  SwapRouter.swapCallParameters = function swapCallParameters(trades, options) {
    if (!Array.isArray(trades)) {
      trades = [trades];
    }

    var sampleTrade = trades[0];
    var tokenIn = sampleTrade.inputAmount.currency.wrapped;
    var tokenOut = sampleTrade.outputAmount.currency.wrapped; // All trades should have the same starting and ending token.

    !trades.every(function (trade) {
      return trade.inputAmount.currency.wrapped.equals(tokenIn);
    }) ?  invariant(false, 'TOKEN_IN_DIFF')  : void 0;
    !trades.every(function (trade) {
      return trade.outputAmount.currency.wrapped.equals(tokenOut);
    }) ?  invariant(false, 'TOKEN_OUT_DIFF')  : void 0;
    var calldatas = [];
    var ZERO_IN = ksSdkCore.CurrencyAmount.fromRawAmount(trades[0].inputAmount.currency, 0);
    var ZERO_OUT = ksSdkCore.CurrencyAmount.fromRawAmount(trades[0].outputAmount.currency, 0);
    var totalAmountOut = trades.reduce(function (sum, trade) {
      return sum.add(trade.minimumAmountOut(options.slippageTolerance));
    }, ZERO_OUT); // flag for whether a refund needs to happen

    var mustRefund = sampleTrade.inputAmount.currency.isNative && sampleTrade.tradeType === ksSdkCore.TradeType.EXACT_OUTPUT;
    var inputIsNative = sampleTrade.inputAmount.currency.isNative; // flags for whether funds should be send first to the router

    var outputIsNative = sampleTrade.outputAmount.currency.isNative;
    var routerMustCustody = outputIsNative || !!options.fee;
    var totalValue = inputIsNative ? trades.reduce(function (sum, trade) {
      return sum.add(trade.maximumAmountIn(options.slippageTolerance));
    }, ZERO_IN) : ZERO_IN; // encode permit if necessary

    if (options.inputTokenPermit) {
      !sampleTrade.inputAmount.currency.isToken ?  invariant(false, 'NON_TOKEN_PERMIT')  : void 0;
      calldatas.push(SelfPermit.encodePermit(sampleTrade.inputAmount.currency, options.inputTokenPermit));
    }

    var recipient = validateAndParseAddress(options.recipient);
    var deadline = toHex(options.deadline);

    for (var _iterator = _createForOfIteratorHelperLoose(trades), _step; !(_step = _iterator()).done;) {
      var trade = _step.value;

      for (var _iterator2 = _createForOfIteratorHelperLoose(trade.swaps), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
            route = _step2$value.route,
            inputAmount = _step2$value.inputAmount,
            outputAmount = _step2$value.outputAmount;
        var amountIn = toHex(trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient);
        var amountOut = toHex(trade.minimumAmountOut(options.slippageTolerance, outputAmount).quotient); // flag for whether the trade is single hop or not

        var singleHop = route.pools.length === 1;

        if (singleHop) {
          if (trade.tradeType === ksSdkCore.TradeType.EXACT_INPUT) {
            var _options$sqrtPriceLim;

            var exactInputSingleParams = {
              tokenIn: route.tokenPath[0].address,
              tokenOut: route.tokenPath[1].address,
              fee: route.pools[0].fee,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountIn: amountIn,
              minAmountOut: amountOut,
              limitSqrtP: toHex((_options$sqrtPriceLim = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0)
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('swapExactInputSingle', [exactInputSingleParams]));
          } else {
            var _options$sqrtPriceLim2;

            var exactOutputSingleParams = {
              tokenIn: route.tokenPath[0].address,
              tokenOut: route.tokenPath[1].address,
              fee: route.pools[0].fee,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountOut: amountOut,
              maxAmountIn: amountIn,
              limitSqrtP: toHex((_options$sqrtPriceLim2 = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim2 : 0)
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('swapExactOutputSingle', [exactOutputSingleParams]));
          }
        } else {
          !(options.sqrtPriceLimitX96 === undefined) ?  invariant(false, 'MULTIHOP_PRICE_LIMIT')  : void 0;
          var path = encodeRouteToPath(route, trade.tradeType === ksSdkCore.TradeType.EXACT_OUTPUT);

          if (trade.tradeType === ksSdkCore.TradeType.EXACT_INPUT) {
            var exactInputParams = {
              path: path,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountIn: amountIn,
              minAmountOut: amountOut
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('swapExactInput', [exactInputParams]));
          } else {
            var exactOutputParams = {
              path: path,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountOut: amountOut,
              maxAmountIn: amountIn
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('swapExactOutput', [exactOutputParams]));
          }
        }
      }
    }

    if (routerMustCustody) {
      if (!!options.fee) {
        if (outputIsNative) {
          calldatas.push(Payments.encodeUnwrapWETH(totalAmountOut.quotient, recipient, options.fee));
        } else {
          calldatas.push(Payments.encodeSweepToken(sampleTrade.outputAmount.currency.wrapped, totalAmountOut.quotient, recipient, options.fee));
        }
      } else {
        calldatas.push(Payments.encodeUnwrapWETH(totalAmountOut.quotient, recipient));
      }
    } // refund


    if (mustRefund) {
      calldatas.push(Payments.encodeRefundETH());
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(totalValue.quotient)
    };
  };

  return SwapRouter;
}();
SwapRouter.INTERFACE = /*#__PURE__*/new abi$5.Interface(abi$4);

exports.ADDRESS_ZERO = ADDRESS_ZERO;
exports.FACTORY_ADDRESS = FACTORY_ADDRESS;
exports.FullMath = FullMath;
exports.LiquidityMath = LiquidityMath;
exports.MIN_LIQUIDITY = MIN_LIQUIDITY;
exports.Multicall = Multicall;
exports.NoTickDataProvider = NoTickDataProvider;
exports.NonfungiblePositionManager = NonfungiblePositionManager;
exports.POOL_INIT_CODE_HASH = POOL_INIT_CODE_HASH;
exports.Payments = Payments;
exports.Pool = Pool;
exports.Position = Position;
exports.Route = Route;
exports.SelfPermit = SelfPermit;
exports.SqrtPriceMath = SqrtPriceMath;
exports.SwapQuoter = SwapQuoter;
exports.SwapRouter = SwapRouter;
exports.TICK_SPACINGS = TICK_SPACINGS;
exports.Tick = Tick;
exports.TickList = TickList;
exports.TickListDataProvider = TickListDataProvider;
exports.TickMath = TickMath;
exports.Trade = Trade;
exports.computePoolAddress = computePoolAddress;
exports.encodeRouteToPath = encodeRouteToPath;
exports.encodeSqrtRatioX96 = encodeSqrtRatioX96;
exports.isSorted = isSorted;
exports.maxLiquidityForAmounts = maxLiquidityForAmounts;
exports.mostSignificantBit = mostSignificantBit;
exports.nearestUsableTick = nearestUsableTick;
exports.priceToClosestTick = priceToClosestTick;
exports.tickToPrice = tickToPrice;
exports.toHex = toHex;
//# sourceMappingURL=ks-sdk-elastic.cjs.development.js.map
