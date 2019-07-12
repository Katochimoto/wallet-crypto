(function (f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.bitcoin = f()
    }
})(function () {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    }({
        1: [function (require, module, exports) {
            var util = require("util/");
            var pSlice = Array.prototype.slice;
            var hasOwn = Object.prototype.hasOwnProperty;
            var assert = module.exports = ok;
            assert.AssertionError = function AssertionError(options) {
                this.name = "AssertionError";
                this.actual = options.actual;
                this.expected = options.expected;
                this.operator = options.operator;
                if (options.message) {
                    this.message = options.message;
                    this.generatedMessage = false
                } else {
                    this.message = getMessage(this);
                    this.generatedMessage = true
                }
                var stackStartFunction = options.stackStartFunction || fail;
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(this, stackStartFunction)
                } else {
                    var err = new Error;
                    if (err.stack) {
                        var out = err.stack;
                        var fn_name = stackStartFunction.name;
                        var idx = out.indexOf("\n" + fn_name);
                        if (idx >= 0) {
                            var next_line = out.indexOf("\n", idx + 1);
                            out = out.substring(next_line + 1)
                        }
                        this.stack = out
                    }
                }
            };
            util.inherits(assert.AssertionError, Error);
            function replacer(key, value) {
                if (util.isUndefined(value)) {
                    return "" + value
                }
                if (util.isNumber(value) && !isFinite(value)) {
                    return value.toString()
                }
                if (util.isFunction(value) || util.isRegExp(value)) {
                    return value.toString()
                }
                return value
            }
            function truncate(s, n) {
                if (util.isString(s)) {
                    return s.length < n ? s : s.slice(0, n)
                } else {
                    return s
                }
            }
            function getMessage(self) {
                return truncate(JSON.stringify(self.actual, replacer), 128) + " " + self.operator + " " + truncate(JSON.stringify(self.expected, replacer), 128)
            }
            function fail(actual, expected, message, operator, stackStartFunction) {
                throw new assert.AssertionError({
                    message: message,
                    actual: actual,
                    expected: expected,
                    operator: operator,
                    stackStartFunction: stackStartFunction
                })
            }
            assert.fail = fail;
            function ok(value, message) {
                if (!value) fail(value, true, message, "==", assert.ok)
            }
            assert.ok = ok;
            assert.equal = function equal(actual, expected, message) {
                if (actual != expected) fail(actual, expected, message, "==", assert.equal)
            };
            assert.notEqual = function notEqual(actual, expected, message) {
                if (actual == expected) {
                    fail(actual, expected, message, "!=", assert.notEqual)
                }
            };
            assert.deepEqual = function deepEqual(actual, expected, message) {
                if (!_deepEqual(actual, expected)) {
                    fail(actual, expected, message, "deepEqual", assert.deepEqual)
                }
            };
            function _deepEqual(actual, expected) {
                if (actual === expected) {
                    return true
                } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
                    if (actual.length != expected.length) return false;
                    for (var i = 0; i < actual.length; i++) {
                        if (actual[i] !== expected[i]) return false
                    }
                    return true
                } else if (util.isDate(actual) && util.isDate(expected)) {
                    return actual.getTime() === expected.getTime()
                } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
                    return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase
                } else if (!util.isObject(actual) && !util.isObject(expected)) {
                    return actual == expected
                } else {
                    return objEquiv(actual, expected)
                }
            }
            function isArguments(object) {
                return Object.prototype.toString.call(object) == "[object Arguments]"
            }
            function objEquiv(a, b) {
                if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b)) return false;
                if (a.prototype !== b.prototype) return false;
                if (util.isPrimitive(a) || util.isPrimitive(b)) {
                    return a === b
                }
                var aIsArgs = isArguments(a),
                    bIsArgs = isArguments(b);
                if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) return false;
                if (aIsArgs) {
                    a = pSlice.call(a);
                    b = pSlice.call(b);
                    return _deepEqual(a, b)
                }
                var ka = objectKeys(a),
                    kb = objectKeys(b),
                    key, i;
                if (ka.length != kb.length) return false;
                ka.sort();
                kb.sort();
                for (i = ka.length - 1; i >= 0; i--) {
                    if (ka[i] != kb[i]) return false
                }
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!_deepEqual(a[key], b[key])) return false
                }
                return true
            }
            assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
                if (_deepEqual(actual, expected)) {
                    fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual)
                }
            };
            assert.strictEqual = function strictEqual(actual, expected, message) {
                if (actual !== expected) {
                    fail(actual, expected, message, "===", assert.strictEqual)
                }
            };
            assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
                if (actual === expected) {
                    fail(actual, expected, message, "!==", assert.notStrictEqual)
                }
            };
            function expectedException(actual, expected) {
                if (!actual || !expected) {
                    return false
                }
                if (Object.prototype.toString.call(expected) == "[object RegExp]") {
                    return expected.test(actual)
                } else if (actual instanceof expected) {
                    return true
                } else if (expected.call({}, actual) === true) {
                    return true
                }
                return false
            }
            function _throws(shouldThrow, block, expected, message) {
                var actual;
                if (util.isString(expected)) {
                    message = expected;
                    expected = null
                }
                try {
                    block()
                } catch (e) {
                    actual = e
                }
                message = (expected && expected.name ? " (" + expected.name + ")." : ".") + (message ? " " + message : ".");
                if (shouldThrow && !actual) {
                    fail(actual, expected, "Missing expected exception" + message)
                }
                if (!shouldThrow && expectedException(actual, expected)) {
                    fail(actual, expected, "Got unwanted exception" + message)
                }
                if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
                    throw actual
                }
            }
            assert.throws = function (block, error, message) {
                _throws.apply(this, [true].concat(pSlice.call(arguments)))
            };
            assert.doesNotThrow = function (block, message) {
                _throws.apply(this, [false].concat(pSlice.call(arguments)))
            };
            assert.ifError = function (err) {
                if (err) {
                    throw err
                }
            };
            var objectKeys = Object.keys || function (obj) {
                var keys = [];
                for (var key in obj) {
                    if (hasOwn.call(obj, key)) keys.push(key)
                }
                return keys
            }
        }, {
            "util/": 29
        }],
        2: [function (require, module, exports) {}, {}],
        3: [function (require, module, exports) {
            (function (global) {
                "use strict";
                var base64 = require("base64-js");
                var ieee754 = require("ieee754");
                var isArray = require("isarray");
                exports.Buffer = Buffer;
                exports.SlowBuffer = SlowBuffer;
                exports.INSPECT_MAX_BYTES = 50;
                Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
                exports.kMaxLength = kMaxLength();
                function typedArraySupport() {
                    try {
                        var arr = new Uint8Array(1);
                        arr.foo = function () {
                            return 42
                        };
                        return arr.foo() === 42 && typeof arr.subarray === "function" && arr.subarray(1, 1).byteLength === 0
                    } catch (e) {
                        return false
                    }
                }
                function kMaxLength() {
                    return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
                }
                function createBuffer(that, length) {
                    if (kMaxLength() < length) {
                        throw new RangeError("Invalid typed array length")
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        that = new Uint8Array(length);
                        that.__proto__ = Buffer.prototype
                    } else {
                        if (that === null) {
                            that = new Buffer(length)
                        }
                        that.length = length
                    }
                    return that
                }
                function Buffer(arg, encodingOrOffset, length) {
                    if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
                        return new Buffer(arg, encodingOrOffset, length)
                    }
                    if (typeof arg === "number") {
                        if (typeof encodingOrOffset === "string") {
                            throw new Error("If encoding is specified then the first argument must be a string")
                        }
                        return allocUnsafe(this, arg)
                    }
                    return from(this, arg, encodingOrOffset, length)
                }
                Buffer.poolSize = 8192;
                Buffer._augment = function (arr) {
                    arr.__proto__ = Buffer.prototype;
                    return arr
                };
                function from(that, value, encodingOrOffset, length) {
                    if (typeof value === "number") {
                        throw new TypeError('"value" argument must not be a number')
                    }
                    if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
                        return fromArrayBuffer(that, value, encodingOrOffset, length)
                    }
                    if (typeof value === "string") {
                        return fromString(that, value, encodingOrOffset)
                    }
                    return fromObject(that, value)
                }
                Buffer.from = function (value, encodingOrOffset, length) {
                    return from(null, value, encodingOrOffset, length)
                };
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    Buffer.prototype.__proto__ = Uint8Array.prototype;
                    Buffer.__proto__ = Uint8Array;
                    if (typeof Symbol !== "undefined" && Symbol.species && Buffer[Symbol.species] === Buffer) {
                        Object.defineProperty(Buffer, Symbol.species, {
                            value: null,
                            configurable: true
                        })
                    }
                }
                function assertSize(size) {
                    if (typeof size !== "number") {
                        throw new TypeError('"size" argument must be a number')
                    }
                }
                function alloc(that, size, fill, encoding) {
                    assertSize(size);
                    if (size <= 0) {
                        return createBuffer(that, size)
                    }
                    if (fill !== undefined) {
                        return typeof encoding === "string" ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill)
                    }
                    return createBuffer(that, size)
                }
                Buffer.alloc = function (size, fill, encoding) {
                    return alloc(null, size, fill, encoding)
                };
                function allocUnsafe(that, size) {
                    assertSize(size);
                    that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
                    if (!Buffer.TYPED_ARRAY_SUPPORT) {
                        for (var i = 0; i < size; i++) {
                            that[i] = 0
                        }
                    }
                    return that
                }
                Buffer.allocUnsafe = function (size) {
                    return allocUnsafe(null, size)
                };
                Buffer.allocUnsafeSlow = function (size) {
                    return allocUnsafe(null, size)
                };
                function fromString(that, string, encoding) {
                    if (typeof encoding !== "string" || encoding === "") {
                        encoding = "utf8"
                    }
                    if (!Buffer.isEncoding(encoding)) {
                        throw new TypeError('"encoding" must be a valid string encoding')
                    }
                    var length = byteLength(string, encoding) | 0;
                    that = createBuffer(that, length);
                    that.write(string, encoding);
                    return that
                }
                function fromArrayLike(that, array) {
                    var length = checked(array.length) | 0;
                    that = createBuffer(that, length);
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255
                    }
                    return that
                }
                function fromArrayBuffer(that, array, byteOffset, length) {
                    array.byteLength;
                    if (byteOffset < 0 || array.byteLength < byteOffset) {
                        throw new RangeError("'offset' is out of bounds")
                    }
                    if (array.byteLength < byteOffset + (length || 0)) {
                        throw new RangeError("'length' is out of bounds")
                    }
                    if (length === undefined) {
                        array = new Uint8Array(array, byteOffset)
                    } else {
                        array = new Uint8Array(array, byteOffset, length)
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        that = array;
                        that.__proto__ = Buffer.prototype
                    } else {
                        that = fromArrayLike(that, array)
                    }
                    return that
                }
                function fromObject(that, obj) {
                    if (Buffer.isBuffer(obj)) {
                        var len = checked(obj.length) | 0;
                        that = createBuffer(that, len);
                        if (that.length === 0) {
                            return that
                        }
                        obj.copy(that, 0, 0, len);
                        return that
                    }
                    if (obj) {
                        if (typeof ArrayBuffer !== "undefined" && obj.buffer instanceof ArrayBuffer || "length" in obj) {
                            if (typeof obj.length !== "number" || isnan(obj.length)) {
                                return createBuffer(that, 0)
                            }
                            return fromArrayLike(that, obj)
                        }
                        if (obj.type === "Buffer" && isArray(obj.data)) {
                            return fromArrayLike(that, obj.data)
                        }
                    }
                    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                }
                function checked(length) {
                    if (length >= kMaxLength()) {
                        throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + kMaxLength().toString(16) + " bytes")
                    }
                    return length | 0
                }
                function SlowBuffer(length) {
                    if (+length != length) {
                        length = 0
                    }
                    return Buffer.alloc(+length)
                }
                Buffer.isBuffer = function isBuffer(b) {
                    return !!(b != null && b._isBuffer)
                };
                Buffer.compare = function compare(a, b) {
                    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                        throw new TypeError("Arguments must be Buffers")
                    }
                    if (a === b) return 0;
                    var x = a.length;
                    var y = b.length;
                    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                        if (a[i] !== b[i]) {
                            x = a[i];
                            y = b[i];
                            break
                        }
                    }
                    if (x < y) return -1;
                    if (y < x) return 1;
                    return 0
                };
                Buffer.isEncoding = function isEncoding(encoding) {
                    switch (String(encoding).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "raw":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return true;
                    default:
                        return false
                    }
                };
                Buffer.concat = function concat(list, length) {
                    if (!isArray(list)) {
                        throw new TypeError('"list" argument must be an Array of Buffers')
                    }
                    if (list.length === 0) {
                        return Buffer.alloc(0)
                    }
                    var i;
                    if (length === undefined) {
                        length = 0;
                        for (i = 0; i < list.length; i++) {
                            length += list[i].length
                        }
                    }
                    var buffer = Buffer.allocUnsafe(length);
                    var pos = 0;
                    for (i = 0; i < list.length; i++) {
                        var buf = list[i];
                        if (!Buffer.isBuffer(buf)) {
                            throw new TypeError('"list" argument must be an Array of Buffers')
                        }
                        buf.copy(buffer, pos);
                        pos += buf.length
                    }
                    return buffer
                };
                function byteLength(string, encoding) {
                    if (Buffer.isBuffer(string)) {
                        return string.length
                    }
                    if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
                        return string.byteLength
                    }
                    if (typeof string !== "string") {
                        string = "" + string
                    }
                    var len = string.length;
                    if (len === 0) return 0;
                    var loweredCase = false;
                    for (;;) {
                        switch (encoding) {
                        case "ascii":
                        case "binary":
                        case "raw":
                        case "raws":
                            return len;
                        case "utf8":
                        case "utf-8":
                        case undefined:
                            return utf8ToBytes(string).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return len * 2;
                        case "hex":
                            return len >>> 1;
                        case "base64":
                            return base64ToBytes(string).length;
                        default:
                            if (loweredCase) return utf8ToBytes(string).length;
                            encoding = ("" + encoding).toLowerCase();
                            loweredCase = true
                        }
                    }
                }
                Buffer.byteLength = byteLength;
                function slowToString(encoding, start, end) {
                    var loweredCase = false;
                    if (start === undefined || start < 0) {
                        start = 0
                    }
                    if (start > this.length) {
                        return ""
                    }
                    if (end === undefined || end > this.length) {
                        end = this.length
                    }
                    if (end <= 0) {
                        return ""
                    }
                    end >>>= 0;
                    start >>>= 0;
                    if (end <= start) {
                        return ""
                    }
                    if (!encoding) encoding = "utf8";
                    while (true) {
                        switch (encoding) {
                        case "hex":
                            return hexSlice(this, start, end);
                        case "utf8":
                        case "utf-8":
                            return utf8Slice(this, start, end);
                        case "ascii":
                            return asciiSlice(this, start, end);
                        case "binary":
                            return binarySlice(this, start, end);
                        case "base64":
                            return base64Slice(this, start, end);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return utf16leSlice(this, start, end);
                        default:
                            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
                            encoding = (encoding + "").toLowerCase();
                            loweredCase = true
                        }
                    }
                }
                Buffer.prototype._isBuffer = true;
                function swap(b, n, m) {
                    var i = b[n];
                    b[n] = b[m];
                    b[m] = i
                }
                Buffer.prototype.swap16 = function swap16() {
                    var len = this.length;
                    if (len % 2 !== 0) {
                        throw new RangeError("Buffer size must be a multiple of 16-bits")
                    }
                    for (var i = 0; i < len; i += 2) {
                        swap(this, i, i + 1)
                    }
                    return this
                };
                Buffer.prototype.swap32 = function swap32() {
                    var len = this.length;
                    if (len % 4 !== 0) {
                        throw new RangeError("Buffer size must be a multiple of 32-bits")
                    }
                    for (var i = 0; i < len; i += 4) {
                        swap(this, i, i + 3);
                        swap(this, i + 1, i + 2)
                    }
                    return this
                };
                Buffer.prototype.toString = function toString() {
                    var length = this.length | 0;
                    if (length === 0) return "";
                    if (arguments.length === 0) return utf8Slice(this, 0, length);
                    return slowToString.apply(this, arguments)
                };
                Buffer.prototype.equals = function equals(b) {
                    if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
                    if (this === b) return true;
                    return Buffer.compare(this, b) === 0
                };
                Buffer.prototype.inspect = function inspect() {
                    var str = "";
                    var max = exports.INSPECT_MAX_BYTES;
                    if (this.length > 0) {
                        str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
                        if (this.length > max) str += " ... "
                    }
                    return "<Buffer " + str + ">"
                };
                Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
                    if (!Buffer.isBuffer(target)) {
                        throw new TypeError("Argument must be a Buffer")
                    }
                    if (start === undefined) {
                        start = 0
                    }
                    if (end === undefined) {
                        end = target ? target.length : 0
                    }
                    if (thisStart === undefined) {
                        thisStart = 0
                    }
                    if (thisEnd === undefined) {
                        thisEnd = this.length
                    }
                    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                        throw new RangeError("out of range index")
                    }
                    if (thisStart >= thisEnd && start >= end) {
                        return 0
                    }
                    if (thisStart >= thisEnd) {
                        return -1
                    }
                    if (start >= end) {
                        return 1
                    }
                    start >>>= 0;
                    end >>>= 0;
                    thisStart >>>= 0;
                    thisEnd >>>= 0;
                    if (this === target) return 0;
                    var x = thisEnd - thisStart;
                    var y = end - start;
                    var len = Math.min(x, y);
                    var thisCopy = this.slice(thisStart, thisEnd);
                    var targetCopy = target.slice(start, end);
                    for (var i = 0; i < len; ++i) {
                        if (thisCopy[i] !== targetCopy[i]) {
                            x = thisCopy[i];
                            y = targetCopy[i];
                            break
                        }
                    }
                    if (x < y) return -1;
                    if (y < x) return 1;
                    return 0
                };
                function arrayIndexOf(arr, val, byteOffset, encoding) {
                    var indexSize = 1;
                    var arrLength = arr.length;
                    var valLength = val.length;
                    if (encoding !== undefined) {
                        encoding = String(encoding).toLowerCase();
                        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
                            if (arr.length < 2 || val.length < 2) {
                                return -1
                            }
                            indexSize = 2;
                            arrLength /= 2;
                            valLength /= 2;
                            byteOffset /= 2
                        }
                    }
                    function read(buf, i) {
                        if (indexSize === 1) {
                            return buf[i]
                        } else {
                            return buf.readUInt16BE(i * indexSize)
                        }
                    }
                    var foundIndex = -1;
                    for (var i = 0; byteOffset + i < arrLength; i++) {
                        if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                            if (foundIndex === -1) foundIndex = i;
                            if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
                        } else {
                            if (foundIndex !== -1) i -= i - foundIndex;
                            foundIndex = -1
                        }
                    }
                    return -1
                }
                Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
                    if (typeof byteOffset === "string") {
                        encoding = byteOffset;
                        byteOffset = 0
                    } else if (byteOffset > 2147483647) {
                        byteOffset = 2147483647
                    } else if (byteOffset < -2147483648) {
                        byteOffset = -2147483648
                    }
                    byteOffset >>= 0;
                    if (this.length === 0) return -1;
                    if (byteOffset >= this.length) return -1;
                    if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);
                    if (typeof val === "string") {
                        val = Buffer.from(val, encoding)
                    }
                    if (Buffer.isBuffer(val)) {
                        if (val.length === 0) {
                            return -1
                        }
                        return arrayIndexOf(this, val, byteOffset, encoding)
                    }
                    if (typeof val === "number") {
                        if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === "function") {
                            return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
                        }
                        return arrayIndexOf(this, [val], byteOffset, encoding)
                    }
                    throw new TypeError("val must be string, number or Buffer")
                };
                Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
                    return this.indexOf(val, byteOffset, encoding) !== -1
                };
                function hexWrite(buf, string, offset, length) {
                    offset = Number(offset) || 0;
                    var remaining = buf.length - offset;
                    if (!length) {
                        length = remaining
                    } else {
                        length = Number(length);
                        if (length > remaining) {
                            length = remaining
                        }
                    }
                    var strLen = string.length;
                    if (strLen % 2 !== 0) throw new Error("Invalid hex string");
                    if (length > strLen / 2) {
                        length = strLen / 2
                    }
                    for (var i = 0; i < length; i++) {
                        var parsed = parseInt(string.substr(i * 2, 2), 16);
                        if (isNaN(parsed)) return i;
                        buf[offset + i] = parsed
                    }
                    return i
                }
                function utf8Write(buf, string, offset, length) {
                    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
                }
                function asciiWrite(buf, string, offset, length) {
                    return blitBuffer(asciiToBytes(string), buf, offset, length)
                }
                function binaryWrite(buf, string, offset, length) {
                    return asciiWrite(buf, string, offset, length)
                }
                function base64Write(buf, string, offset, length) {
                    return blitBuffer(base64ToBytes(string), buf, offset, length)
                }
                function ucs2Write(buf, string, offset, length) {
                    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
                }
                Buffer.prototype.write = function write(string, offset, length, encoding) {
                    if (offset === undefined) {
                        encoding = "utf8";
                        length = this.length;
                        offset = 0
                    } else if (length === undefined && typeof offset === "string") {
                        encoding = offset;
                        length = this.length;
                        offset = 0
                    } else if (isFinite(offset)) {
                        offset = offset | 0;
                        if (isFinite(length)) {
                            length = length | 0;
                            if (encoding === undefined) encoding = "utf8"
                        } else {
                            encoding = length;
                            length = undefined
                        }
                    } else {
                        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")
                    }
                    var remaining = this.length - offset;
                    if (length === undefined || length > remaining) length = remaining;
                    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
                        throw new RangeError("Attempt to write outside buffer bounds")
                    }
                    if (!encoding) encoding = "utf8";
                    var loweredCase = false;
                    for (;;) {
                        switch (encoding) {
                        case "hex":
                            return hexWrite(this, string, offset, length);
                        case "utf8":
                        case "utf-8":
                            return utf8Write(this, string, offset, length);
                        case "ascii":
                            return asciiWrite(this, string, offset, length);
                        case "binary":
                            return binaryWrite(this, string, offset, length);
                        case "base64":
                            return base64Write(this, string, offset, length);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return ucs2Write(this, string, offset, length);
                        default:
                            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
                            encoding = ("" + encoding).toLowerCase();
                            loweredCase = true
                        }
                    }
                };
                Buffer.prototype.toJSON = function toJSON() {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                };
                function base64Slice(buf, start, end) {
                    if (start === 0 && end === buf.length) {
                        return base64.fromByteArray(buf)
                    } else {
                        return base64.fromByteArray(buf.slice(start, end))
                    }
                }
                function utf8Slice(buf, start, end) {
                    end = Math.min(buf.length, end);
                    var res = [];
                    var i = start;
                    while (i < end) {
                        var firstByte = buf[i];
                        var codePoint = null;
                        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
                        if (i + bytesPerSequence <= end) {
                            var secondByte, thirdByte, fourthByte, tempCodePoint;
                            switch (bytesPerSequence) {
                            case 1:
                                if (firstByte < 128) {
                                    codePoint = firstByte
                                }
                                break;
                            case 2:
                                secondByte = buf[i + 1];
                                if ((secondByte & 192) === 128) {
                                    tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                                    if (tempCodePoint > 127) {
                                        codePoint = tempCodePoint
                                    }
                                }
                                break;
                            case 3:
                                secondByte = buf[i + 1];
                                thirdByte = buf[i + 2];
                                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                                    tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                                    if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                                        codePoint = tempCodePoint
                                    }
                                }
                                break;
                            case 4:
                                secondByte = buf[i + 1];
                                thirdByte = buf[i + 2];
                                fourthByte = buf[i + 3];
                                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                                    tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                                    if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                                        codePoint = tempCodePoint
                                    }
                                }
                            }
                        }
                        if (codePoint === null) {
                            codePoint = 65533;
                            bytesPerSequence = 1
                        } else if (codePoint > 65535) {
                            codePoint -= 65536;
                            res.push(codePoint >>> 10 & 1023 | 55296);
                            codePoint = 56320 | codePoint & 1023
                        }
                        res.push(codePoint);
                        i += bytesPerSequence
                    }
                    return decodeCodePointsArray(res)
                }
                var MAX_ARGUMENTS_LENGTH = 4096;
                function decodeCodePointsArray(codePoints) {
                    var len = codePoints.length;
                    if (len <= MAX_ARGUMENTS_LENGTH) {
                        return String.fromCharCode.apply(String, codePoints)
                    }
                    var res = "";
                    var i = 0;
                    while (i < len) {
                        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH))
                    }
                    return res
                }
                function asciiSlice(buf, start, end) {
                    var ret = "";
                    end = Math.min(buf.length, end);
                    for (var i = start; i < end; i++) {
                        ret += String.fromCharCode(buf[i] & 127)
                    }
                    return ret
                }
                function binarySlice(buf, start, end) {
                    var ret = "";
                    end = Math.min(buf.length, end);
                    for (var i = start; i < end; i++) {
                        ret += String.fromCharCode(buf[i])
                    }
                    return ret
                }
                function hexSlice(buf, start, end) {
                    var len = buf.length;
                    if (!start || start < 0) start = 0;
                    if (!end || end < 0 || end > len) end = len;
                    var out = "";
                    for (var i = start; i < end; i++) {
                        out += toHex(buf[i])
                    }
                    return out
                }
                function utf16leSlice(buf, start, end) {
                    var bytes = buf.slice(start, end);
                    var res = "";
                    for (var i = 0; i < bytes.length; i += 2) {
                        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
                    }
                    return res
                }
                Buffer.prototype.slice = function slice(start, end) {
                    var len = this.length;
                    start = ~~start;
                    end = end === undefined ? len : ~~end;
                    if (start < 0) {
                        start += len;
                        if (start < 0) start = 0
                    } else if (start > len) {
                        start = len
                    }
                    if (end < 0) {
                        end += len;
                        if (end < 0) end = 0
                    } else if (end > len) {
                        end = len
                    }
                    if (end < start) end = start;
                    var newBuf;
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        newBuf = this.subarray(start, end);
                        newBuf.__proto__ = Buffer.prototype
                    } else {
                        var sliceLen = end - start;
                        newBuf = new Buffer(sliceLen, undefined);
                        for (var i = 0; i < sliceLen; i++) {
                            newBuf[i] = this[i + start]
                        }
                    }
                    return newBuf
                };
                function checkOffset(offset, ext, length) {
                    if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
                    if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length")
                }
                Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) checkOffset(offset, byteLength, this.length);
                    var val = this[offset];
                    var mul = 1;
                    var i = 0;
                    while (++i < byteLength && (mul *= 256)) {
                        val += this[offset + i] * mul
                    }
                    return val
                };
                Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        checkOffset(offset, byteLength, this.length)
                    }
                    var val = this[offset + --byteLength];
                    var mul = 1;
                    while (byteLength > 0 && (mul *= 256)) {
                        val += this[offset + --byteLength] * mul
                    }
                    return val
                };
                Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 1, this.length);
                    return this[offset]
                };
                Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 2, this.length);
                    return this[offset] | this[offset + 1] << 8
                };
                Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 2, this.length);
                    return this[offset] << 8 | this[offset + 1]
                };
                Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216
                };
                Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3])
                };
                Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) checkOffset(offset, byteLength, this.length);
                    var val = this[offset];
                    var mul = 1;
                    var i = 0;
                    while (++i < byteLength && (mul *= 256)) {
                        val += this[offset + i] * mul
                    }
                    mul *= 128;
                    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
                    return val
                };
                Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) checkOffset(offset, byteLength, this.length);
                    var i = byteLength;
                    var mul = 1;
                    var val = this[offset + --i];
                    while (i > 0 && (mul *= 256)) {
                        val += this[offset + --i] * mul
                    }
                    mul *= 128;
                    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
                    return val
                };
                Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 1, this.length);
                    if (!(this[offset] & 128)) return this[offset];
                    return (255 - this[offset] + 1) * -1
                };
                Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 2, this.length);
                    var val = this[offset] | this[offset + 1] << 8;
                    return val & 32768 ? val | 4294901760 : val
                };
                Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 2, this.length);
                    var val = this[offset + 1] | this[offset] << 8;
                    return val & 32768 ? val | 4294901760 : val
                };
                Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24
                };
                Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]
                };
                Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return ieee754.read(this, offset, true, 23, 4)
                };
                Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return ieee754.read(this, offset, false, 23, 4)
                };
                Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 8, this.length);
                    return ieee754.read(this, offset, true, 52, 8)
                };
                Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 8, this.length);
                    return ieee754.read(this, offset, false, 52, 8)
                };
                function checkInt(buf, value, offset, ext, max, min) {
                    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
                    if (offset + ext > buf.length) throw new RangeError("Index out of range")
                }
                Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                        checkInt(this, value, offset, byteLength, maxBytes, 0)
                    }
                    var mul = 1;
                    var i = 0;
                    this[offset] = value & 255;
                    while (++i < byteLength && (mul *= 256)) {
                        this[offset + i] = value / mul & 255
                    }
                    return offset + byteLength
                };
                Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                        checkInt(this, value, offset, byteLength, maxBytes, 0)
                    }
                    var i = byteLength - 1;
                    var mul = 1;
                    this[offset + i] = value & 255;
                    while (--i >= 0 && (mul *= 256)) {
                        this[offset + i] = value / mul & 255
                    }
                    return offset + byteLength
                };
                Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
                    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
                    this[offset] = value & 255;
                    return offset + 1
                };
                function objectWriteUInt16(buf, value, offset, littleEndian) {
                    if (value < 0) value = 65535 + value + 1;
                    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
                        buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8
                    }
                }
                Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 255;
                        this[offset + 1] = value >>> 8
                    } else {
                        objectWriteUInt16(this, value, offset, true)
                    }
                    return offset + 2
                };
                Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 8;
                        this[offset + 1] = value & 255
                    } else {
                        objectWriteUInt16(this, value, offset, false)
                    }
                    return offset + 2
                };
                function objectWriteUInt32(buf, value, offset, littleEndian) {
                    if (value < 0) value = 4294967295 + value + 1;
                    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
                        buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255
                    }
                }
                Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset + 3] = value >>> 24;
                        this[offset + 2] = value >>> 16;
                        this[offset + 1] = value >>> 8;
                        this[offset] = value & 255
                    } else {
                        objectWriteUInt32(this, value, offset, true)
                    }
                    return offset + 4
                };
                Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 24;
                        this[offset + 1] = value >>> 16;
                        this[offset + 2] = value >>> 8;
                        this[offset + 3] = value & 255
                    } else {
                        objectWriteUInt32(this, value, offset, false)
                    }
                    return offset + 4
                };
                Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit)
                    }
                    var i = 0;
                    var mul = 1;
                    var sub = 0;
                    this[offset] = value & 255;
                    while (++i < byteLength && (mul *= 256)) {
                        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                            sub = 1
                        }
                        this[offset + i] = (value / mul >> 0) - sub & 255
                    }
                    return offset + byteLength
                };
                Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit)
                    }
                    var i = byteLength - 1;
                    var mul = 1;
                    var sub = 0;
                    this[offset + i] = value & 255;
                    while (--i >= 0 && (mul *= 256)) {
                        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                            sub = 1
                        }
                        this[offset + i] = (value / mul >> 0) - sub & 255
                    }
                    return offset + byteLength
                };
                Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
                    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
                    if (value < 0) value = 255 + value + 1;
                    this[offset] = value & 255;
                    return offset + 1
                };
                Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 255;
                        this[offset + 1] = value >>> 8
                    } else {
                        objectWriteUInt16(this, value, offset, true)
                    }
                    return offset + 2
                };
                Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 8;
                        this[offset + 1] = value & 255
                    } else {
                        objectWriteUInt16(this, value, offset, false)
                    }
                    return offset + 2
                };
                Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 255;
                        this[offset + 1] = value >>> 8;
                        this[offset + 2] = value >>> 16;
                        this[offset + 3] = value >>> 24
                    } else {
                        objectWriteUInt32(this, value, offset, true)
                    }
                    return offset + 4
                };
                Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
                    if (value < 0) value = 4294967295 + value + 1;
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 24;
                        this[offset + 1] = value >>> 16;
                        this[offset + 2] = value >>> 8;
                        this[offset + 3] = value & 255
                    } else {
                        objectWriteUInt32(this, value, offset, false)
                    }
                    return offset + 4
                };
                function checkIEEE754(buf, value, offset, ext, max, min) {
                    if (offset + ext > buf.length) throw new RangeError("Index out of range");
                    if (offset < 0) throw new RangeError("Index out of range")
                }
                function writeFloat(buf, value, offset, littleEndian, noAssert) {
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38)
                    }
                    ieee754.write(buf, value, offset, littleEndian, 23, 4);
                    return offset + 4
                }
                Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, true, noAssert)
                };
                Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, false, noAssert)
                };
                function writeDouble(buf, value, offset, littleEndian, noAssert) {
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308)
                    }
                    ieee754.write(buf, value, offset, littleEndian, 52, 8);
                    return offset + 8
                }
                Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, true, noAssert)
                };
                Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, false, noAssert)
                };
                Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                    if (!start) start = 0;
                    if (!end && end !== 0) end = this.length;
                    if (targetStart >= target.length) targetStart = target.length;
                    if (!targetStart) targetStart = 0;
                    if (end > 0 && end < start) end = start;
                    if (end === start) return 0;
                    if (target.length === 0 || this.length === 0) return 0;
                    if (targetStart < 0) {
                        throw new RangeError("targetStart out of bounds")
                    }
                    if (start < 0 || start >= this.length) throw new RangeError("sourceStart out of bounds");
                    if (end < 0) throw new RangeError("sourceEnd out of bounds");
                    if (end > this.length) end = this.length;
                    if (target.length - targetStart < end - start) {
                        end = target.length - targetStart + start
                    }
                    var len = end - start;
                    var i;
                    if (this === target && start < targetStart && targetStart < end) {
                        for (i = len - 1; i >= 0; i--) {
                            target[i + targetStart] = this[i + start]
                        }
                    } else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) {
                        for (i = 0; i < len; i++) {
                            target[i + targetStart] = this[i + start]
                        }
                    } else {
                        Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart)
                    }
                    return len
                };
                Buffer.prototype.fill = function fill(val, start, end, encoding) {
                    if (typeof val === "string") {
                        if (typeof start === "string") {
                            encoding = start;
                            start = 0;
                            end = this.length
                        } else if (typeof end === "string") {
                            encoding = end;
                            end = this.length
                        }
                        if (val.length === 1) {
                            var code = val.charCodeAt(0);
                            if (code < 256) {
                                val = code
                            }
                        }
                        if (encoding !== undefined && typeof encoding !== "string") {
                            throw new TypeError("encoding must be a string")
                        }
                        if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
                            throw new TypeError("Unknown encoding: " + encoding)
                        }
                    } else if (typeof val === "number") {
                        val = val & 255
                    }
                    if (start < 0 || this.length < start || this.length < end) {
                        throw new RangeError("Out of range index")
                    }
                    if (end <= start) {
                        return this
                    }
                    start = start >>> 0;
                    end = end === undefined ? this.length : end >>> 0;
                    if (!val) val = 0;
                    var i;
                    if (typeof val === "number") {
                        for (i = start; i < end; i++) {
                            this[i] = val
                        }
                    } else {
                        var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
                        var len = bytes.length;
                        for (i = 0; i < end - start; i++) {
                            this[i + start] = bytes[i % len]
                        }
                    }
                    return this
                };
                var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
                function base64clean(str) {
                    str = stringtrim(str).replace(INVALID_BASE64_RE, "");
                    if (str.length < 2) return "";
                    while (str.length % 4 !== 0) {
                        str = str + "="
                    }
                    return str
                }
                function stringtrim(str) {
                    if (str.trim) return str.trim();
                    return str.replace(/^\s+|\s+$/g, "")
                }
                function toHex(n) {
                    if (n < 16) return "0" + n.toString(16);
                    return n.toString(16)
                }
                function utf8ToBytes(string, units) {
                    units = units || Infinity;
                    var codePoint;
                    var length = string.length;
                    var leadSurrogate = null;
                    var bytes = [];
                    for (var i = 0; i < length; i++) {
                        codePoint = string.charCodeAt(i);
                        if (codePoint > 55295 && codePoint < 57344) {
                            if (!leadSurrogate) {
                                if (codePoint > 56319) {
                                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                                    continue
                                } else if (i + 1 === length) {
                                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                                    continue
                                }
                                leadSurrogate = codePoint;
                                continue
                            }
                            if (codePoint < 56320) {
                                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                                leadSurrogate = codePoint;
                                continue
                            }
                            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536
                        } else if (leadSurrogate) {
                            if ((units -= 3) > -1) bytes.push(239, 191, 189)
                        }
                        leadSurrogate = null;
                        if (codePoint < 128) {
                            if ((units -= 1) < 0) break;
                            bytes.push(codePoint)
                        } else if (codePoint < 2048) {
                            if ((units -= 2) < 0) break;
                            bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128)
                        } else if (codePoint < 65536) {
                            if ((units -= 3) < 0) break;
                            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128)
                        } else if (codePoint < 1114112) {
                            if ((units -= 4) < 0) break;
                            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128)
                        } else {
                            throw new Error("Invalid code point")
                        }
                    }
                    return bytes
                }
                function asciiToBytes(str) {
                    var byteArray = [];
                    for (var i = 0; i < str.length; i++) {
                        byteArray.push(str.charCodeAt(i) & 255)
                    }
                    return byteArray
                }
                function utf16leToBytes(str, units) {
                    var c, hi, lo;
                    var byteArray = [];
                    for (var i = 0; i < str.length; i++) {
                        if ((units -= 2) < 0) break;
                        c = str.charCodeAt(i);
                        hi = c >> 8;
                        lo = c % 256;
                        byteArray.push(lo);
                        byteArray.push(hi)
                    }
                    return byteArray
                }
                function base64ToBytes(str) {
                    return base64.toByteArray(base64clean(str))
                }
                function blitBuffer(src, dst, offset, length) {
                    for (var i = 0; i < length; i++) {
                        if (i + offset >= dst.length || i >= src.length) break;
                        dst[i + offset] = src[i]
                    }
                    return i
                }
                function isnan(val) {
                    return val !== val
                }
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {
            "base64-js": 4,
            ieee754: 5,
            isarray: 6
        }],
        4: [function (require, module, exports) {
            "use strict";
            exports.toByteArray = toByteArray;
            exports.fromByteArray = fromByteArray;
            var lookup = [];
            var revLookup = [];
            var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            function init() {
                var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                for (var i = 0, len = code.length; i < len; ++i) {
                    lookup[i] = code[i];
                    revLookup[code.charCodeAt(i)] = i
                }
                revLookup["-".charCodeAt(0)] = 62;
                revLookup["_".charCodeAt(0)] = 63
            }
            init();
            function toByteArray(b64) {
                var i, j, l, tmp, placeHolders, arr;
                var len = b64.length;
                if (len % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4")
                }
                placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;
                arr = new Arr(len * 3 / 4 - placeHolders);
                l = placeHolders > 0 ? len - 4 : len;
                var L = 0;
                for (i = 0, j = 0; i < l; i += 4, j += 3) {
                    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
                    arr[L++] = tmp >> 16 & 255;
                    arr[L++] = tmp >> 8 & 255;
                    arr[L++] = tmp & 255
                }
                if (placeHolders === 2) {
                    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
                    arr[L++] = tmp & 255
                } else if (placeHolders === 1) {
                    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
                    arr[L++] = tmp >> 8 & 255;
                    arr[L++] = tmp & 255
                }
                return arr
            }
            function tripletToBase64(num) {
                return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63]
            }
            function encodeChunk(uint8, start, end) {
                var tmp;
                var output = [];
                for (var i = start; i < end; i += 3) {
                    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
                    output.push(tripletToBase64(tmp))
                }
                return output.join("")
            }
            function fromByteArray(uint8) {
                var tmp;
                var len = uint8.length;
                var extraBytes = len % 3;
                var output = "";
                var parts = [];
                var maxChunkLength = 16383;
                for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength))
                }
                if (extraBytes === 1) {
                    tmp = uint8[len - 1];
                    output += lookup[tmp >> 2];
                    output += lookup[tmp << 4 & 63];
                    output += "=="
                } else if (extraBytes === 2) {
                    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                    output += lookup[tmp >> 10];
                    output += lookup[tmp >> 4 & 63];
                    output += lookup[tmp << 2 & 63];
                    output += "="
                }
                parts.push(output);
                return parts.join("")
            }
        }, {}],
        5: [function (require, module, exports) {
            exports.read = function (buffer, offset, isLE, mLen, nBytes) {
                var e, m;
                var eLen = nBytes * 8 - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var nBits = -7;
                var i = isLE ? nBytes - 1 : 0;
                var d = isLE ? -1 : 1;
                var s = buffer[offset + i];
                i += d;
                e = s & (1 << -nBits) - 1;
                s >>= -nBits;
                nBits += eLen;
                for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
                m = e & (1 << -nBits) - 1;
                e >>= -nBits;
                nBits += mLen;
                for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
                if (e === 0) {
                    e = 1 - eBias
                } else if (e === eMax) {
                    return m ? NaN : (s ? -1 : 1) * Infinity
                } else {
                    m = m + Math.pow(2, mLen);
                    e = e - eBias
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
            };
            exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c;
                var eLen = nBytes * 8 - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var i = isLE ? 0 : nBytes - 1;
                var d = isLE ? 1 : -1;
                var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
                value = Math.abs(value);
                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0;
                    e = eMax
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2);
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--;
                        c *= 2
                    }
                    if (e + eBias >= 1) {
                        value += rt / c
                    } else {
                        value += rt * Math.pow(2, 1 - eBias)
                    }
                    if (value * c >= 2) {
                        e++;
                        c /= 2
                    }
                    if (e + eBias >= eMax) {
                        m = 0;
                        e = eMax
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * Math.pow(2, mLen);
                        e = e + eBias
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                        e = 0
                    }
                }
                for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {}
                e = e << mLen | m;
                eLen += mLen;
                for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {}
                buffer[offset + i - d] |= s * 128
            }
        }, {}],
        6: [function (require, module, exports) {
            var toString = {}.toString;
            module.exports = Array.isArray || function (arr) {
                return toString.call(arr) == "[object Array]"
            }
        }, {}],
        7: [function (require, module, exports) {
            function EventEmitter() {
                this._events = this._events || {};
                this._maxListeners = this._maxListeners || undefined
            }
            module.exports = EventEmitter;
            EventEmitter.EventEmitter = EventEmitter;
            EventEmitter.prototype._events = undefined;
            EventEmitter.prototype._maxListeners = undefined;
            EventEmitter.defaultMaxListeners = 10;
            EventEmitter.prototype.setMaxListeners = function (n) {
                if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
                this._maxListeners = n;
                return this
            };
            EventEmitter.prototype.emit = function (type) {
                var er, handler, len, args, i, listeners;
                if (!this._events) this._events = {};
                if (type === "error") {
                    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
                        er = arguments[1];
                        if (er instanceof Error) {
                            throw er
                        }
                        throw TypeError('Uncaught, unspecified "error" event.')
                    }
                }
                handler = this._events[type];
                if (isUndefined(handler)) return false;
                if (isFunction(handler)) {
                    switch (arguments.length) {
                    case 1:
                        handler.call(this);
                        break;
                    case 2:
                        handler.call(this, arguments[1]);
                        break;
                    case 3:
                        handler.call(this, arguments[1], arguments[2]);
                        break;
                    default:
                        args = Array.prototype.slice.call(arguments, 1);
                        handler.apply(this, args)
                    }
                } else if (isObject(handler)) {
                    args = Array.prototype.slice.call(arguments, 1);
                    listeners = handler.slice();
                    len = listeners.length;
                    for (i = 0; i < len; i++) listeners[i].apply(this, args)
                }
                return true
            };
            EventEmitter.prototype.addListener = function (type, listener) {
                var m;
                if (!isFunction(listener)) throw TypeError("listener must be a function");
                if (!this._events) this._events = {};
                if (this._events.newListener) this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
                if (!this._events[type]) this._events[type] = listener;
                else if (isObject(this._events[type])) this._events[type].push(listener);
                else this._events[type] = [this._events[type], listener];
                if (isObject(this._events[type]) && !this._events[type].warned) {
                    if (!isUndefined(this._maxListeners)) {
                        m = this._maxListeners
                    } else {
                        m = EventEmitter.defaultMaxListeners
                    }
                    if (m && m > 0 && this._events[type].length > m) {
                        this._events[type].warned = true;
                        console.error("(node) warning: possible EventEmitter memory " + "leak detected. %d listeners added. " + "Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
                        if (typeof console.trace === "function") {
                            console.trace()
                        }
                    }
                }
                return this
            };
            EventEmitter.prototype.on = EventEmitter.prototype.addListener;
            EventEmitter.prototype.once = function (type, listener) {
                if (!isFunction(listener)) throw TypeError("listener must be a function");
                var fired = false;
                function g() {
                    this.removeListener(type, g);
                    if (!fired) {
                        fired = true;
                        listener.apply(this, arguments)
                    }
                }
                g.listener = listener;
                this.on(type, g);
                return this
            };
            EventEmitter.prototype.removeListener = function (type, listener) {
                var list, position, length, i;
                if (!isFunction(listener)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[type]) return this;
                list = this._events[type];
                length = list.length;
                position = -1;
                if (list === listener || isFunction(list.listener) && list.listener === listener) {
                    delete this._events[type];
                    if (this._events.removeListener) this.emit("removeListener", type, listener)
                } else if (isObject(list)) {
                    for (i = length; i-- > 0;) {
                        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
                            position = i;
                            break
                        }
                    }
                    if (position < 0) return this;
                    if (list.length === 1) {
                        list.length = 0;
                        delete this._events[type]
                    } else {
                        list.splice(position, 1)
                    }
                    if (this._events.removeListener) this.emit("removeListener", type, listener)
                }
                return this
            };
            EventEmitter.prototype.removeAllListeners = function (type) {
                var key, listeners;
                if (!this._events) return this;
                if (!this._events.removeListener) {
                    if (arguments.length === 0) this._events = {};
                    else if (this._events[type]) delete this._events[type];
                    return this
                }
                if (arguments.length === 0) {
                    for (key in this._events) {
                        if (key === "removeListener") continue;
                        this.removeAllListeners(key)
                    }
                    this.removeAllListeners("removeListener");
                    this._events = {};
                    return this
                }
                listeners = this._events[type];
                if (isFunction(listeners)) {
                    this.removeListener(type, listeners)
                } else if (listeners) {
                    while (listeners.length) this.removeListener(type, listeners[listeners.length - 1])
                }
                delete this._events[type];
                return this
            };
            EventEmitter.prototype.listeners = function (type) {
                var ret;
                if (!this._events || !this._events[type]) ret = [];
                else if (isFunction(this._events[type])) ret = [this._events[type]];
                else ret = this._events[type].slice();
                return ret
            };
            EventEmitter.prototype.listenerCount = function (type) {
                if (this._events) {
                    var evlistener = this._events[type];
                    if (isFunction(evlistener)) return 1;
                    else if (evlistener) return evlistener.length
                }
                return 0
            };
            EventEmitter.listenerCount = function (emitter, type) {
                return emitter.listenerCount(type)
            };
            function isFunction(arg) {
                return typeof arg === "function"
            }
            function isNumber(arg) {
                return typeof arg === "number"
            }
            function isObject(arg) {
                return typeof arg === "object" && arg !== null
            }
            function isUndefined(arg) {
                return arg === void 0
            }
        }, {}],
        8: [function (require, module, exports) {
            if (typeof Object.create === "function") {
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor;
                    ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    })
                }
            } else {
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor;
                    var TempCtor = function () {};
                    TempCtor.prototype = superCtor.prototype;
                    ctor.prototype = new TempCtor;
                    ctor.prototype.constructor = ctor
                }
            }
        }, {}],
        9: [function (require, module, exports) {
            module.exports = function (obj) {
                return !!(obj != null && (obj._isBuffer || obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj)))
            }
        }, {}],
        10: [function (require, module, exports) {
            var process = module.exports = {};
            var cachedSetTimeout;
            var cachedClearTimeout;
            (function () {
                try {
                    cachedSetTimeout = setTimeout
                } catch (e) {
                    cachedSetTimeout = function () {
                        throw new Error("setTimeout is not defined")
                    }
                }
                try {
                    cachedClearTimeout = clearTimeout
                } catch (e) {
                    cachedClearTimeout = function () {
                        throw new Error("clearTimeout is not defined")
                    }
                }
            })();
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;
            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue)
                } else {
                    queueIndex = -1
                }
                if (queue.length) {
                    drainQueue()
                }
            }
            function drainQueue() {
                if (draining) {
                    return
                }
                var timeout = cachedSetTimeout(cleanUpNextTick);
                draining = true;
                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run()
                        }
                    }
                    queueIndex = -1;
                    len = queue.length
                }
                currentQueue = null;
                draining = false;
                cachedClearTimeout(timeout)
            }
            process.nextTick = function (fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i]
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    cachedSetTimeout(drainQueue, 0)
                }
            };
            function Item(fun, array) {
                this.fun = fun;
                this.array = array
            }
            Item.prototype.run = function () {
                this.fun.apply(null, this.array)
            };
            process.title = "browser";
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = "";
            process.versions = {};
            function noop() {}
            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.binding = function (name) {
                throw new Error("process.binding is not supported")
            };
            process.cwd = function () {
                return "/"
            };
            process.chdir = function (dir) {
                throw new Error("process.chdir is not supported")
            };
            process.umask = function () {
                return 0
            }
        }, {}],
        11: [function (require, module, exports) {
            module.exports = require("./lib/_stream_duplex.js")
        }, {
            "./lib/_stream_duplex.js": 12
        }],
        12: [function (require, module, exports) {
            "use strict";
            var objectKeys = Object.keys || function (obj) {
                var keys = [];
                for (var key in obj) {
                    keys.push(key)
                }
                return keys
            };
            module.exports = Duplex;
            var processNextTick = require("process-nextick-args");
            var util = require("core-util-is");
            util.inherits = require("inherits");
            var Readable = require("./_stream_readable");
            var Writable = require("./_stream_writable");
            util.inherits(Duplex, Readable);
            var keys = objectKeys(Writable.prototype);
            for (var v = 0; v < keys.length; v++) {
                var method = keys[v];
                if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method]
            }
            function Duplex(options) {
                if (!(this instanceof Duplex)) return new Duplex(options);
                Readable.call(this, options);
                Writable.call(this, options);
                if (options && options.readable === false) this.readable = false;
                if (options && options.writable === false) this.writable = false;
                this.allowHalfOpen = true;
                if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
                this.once("end", onend)
            }
            function onend() {
                if (this.allowHalfOpen || this._writableState.ended) return;
                processNextTick(onEndNT, this)
            }
            function onEndNT(self) {
                self.end()
            }
            function forEach(xs, f) {
                for (var i = 0, l = xs.length; i < l; i++) {
                    f(xs[i], i)
                }
            }
        }, {
            "./_stream_readable": 14,
            "./_stream_writable": 16,
            "core-util-is": 18,
            inherits: 8,
            "process-nextick-args": 20
        }],
        13: [function (require, module, exports) {
            "use strict";
            module.exports = PassThrough;
            var Transform = require("./_stream_transform");
            var util = require("core-util-is");
            util.inherits = require("inherits");
            util.inherits(PassThrough, Transform);
            function PassThrough(options) {
                if (!(this instanceof PassThrough)) return new PassThrough(options);
                Transform.call(this, options)
            }
            PassThrough.prototype._transform = function (chunk, encoding, cb) {
                cb(null, chunk)
            }
        }, {
            "./_stream_transform": 15,
            "core-util-is": 18,
            inherits: 8
        }],
        14: [function (require, module, exports) {
            (function (process) {
                "use strict";
                module.exports = Readable;
                var processNextTick = require("process-nextick-args");
                var isArray = require("isarray");
                Readable.ReadableState = ReadableState;
                var EE = require("events").EventEmitter;
                var EElistenerCount = function (emitter, type) {
                    return emitter.listeners(type).length
                };
                var Stream;
                (function () {
                    try {
                        Stream = require("st" + "ream")
                    } catch (_) {} finally {
                        if (!Stream) Stream = require("events").EventEmitter
                    }
                })();
                var Buffer = require("buffer").Buffer;
                var bufferShim = require("buffer-shims");
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var debugUtil = require("util");
                var debug = void 0;
                if (debugUtil && debugUtil.debuglog) {
                    debug = debugUtil.debuglog("stream")
                } else {
                    debug = function () {}
                }
                var StringDecoder;
                util.inherits(Readable, Stream);
                var hasPrependListener = typeof EE.prototype.prependListener === "function";
                function prependListener(emitter, event, fn) {
                    if (hasPrependListener) return emitter.prependListener(event, fn);
                    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
                    else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);
                    else emitter._events[event] = [fn, emitter._events[event]]
                }
                var Duplex;
                function ReadableState(options, stream) {
                    Duplex = Duplex || require("./_stream_duplex");
                    options = options || {};
                    this.objectMode = !!options.objectMode;
                    if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
                    var hwm = options.highWaterMark;
                    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                    this.highWaterMark = ~~this.highWaterMark;
                    this.buffer = [];
                    this.length = 0;
                    this.pipes = null;
                    this.pipesCount = 0;
                    this.flowing = null;
                    this.ended = false;
                    this.endEmitted = false;
                    this.reading = false;
                    this.sync = true;
                    this.needReadable = false;
                    this.emittedReadable = false;
                    this.readableListening = false;
                    this.resumeScheduled = false;
                    this.defaultEncoding = options.defaultEncoding || "utf8";
                    this.ranOut = false;
                    this.awaitDrain = 0;
                    this.readingMore = false;
                    this.decoder = null;
                    this.encoding = null;
                    if (options.encoding) {
                        if (!StringDecoder) StringDecoder = require("string_decoder/").StringDecoder;
                        this.decoder = new StringDecoder(options.encoding);
                        this.encoding = options.encoding
                    }
                }
                var Duplex;
                function Readable(options) {
                    Duplex = Duplex || require("./_stream_duplex");
                    if (!(this instanceof Readable)) return new Readable(options);
                    this._readableState = new ReadableState(options, this);
                    this.readable = true;
                    if (options && typeof options.read === "function") this._read = options.read;
                    Stream.call(this)
                }
                Readable.prototype.push = function (chunk, encoding) {
                    var state = this._readableState;
                    if (!state.objectMode && typeof chunk === "string") {
                        encoding = encoding || state.defaultEncoding;
                        if (encoding !== state.encoding) {
                            chunk = bufferShim.from(chunk, encoding);
                            encoding = ""
                        }
                    }
                    return readableAddChunk(this, state, chunk, encoding, false)
                };
                Readable.prototype.unshift = function (chunk) {
                    var state = this._readableState;
                    return readableAddChunk(this, state, chunk, "", true)
                };
                Readable.prototype.isPaused = function () {
                    return this._readableState.flowing === false
                };
                function readableAddChunk(stream, state, chunk, encoding, addToFront) {
                    var er = chunkInvalid(state, chunk);
                    if (er) {
                        stream.emit("error", er)
                    } else if (chunk === null) {
                        state.reading = false;
                        onEofChunk(stream, state)
                    } else if (state.objectMode || chunk && chunk.length > 0) {
                        if (state.ended && !addToFront) {
                            var e = new Error("stream.push() after EOF");
                            stream.emit("error", e)
                        } else if (state.endEmitted && addToFront) {
                            var _e = new Error("stream.unshift() after end event");
                            stream.emit("error", _e)
                        } else {
                            var skipAdd;
                            if (state.decoder && !addToFront && !encoding) {
                                chunk = state.decoder.write(chunk);
                                skipAdd = !state.objectMode && chunk.length === 0
                            }
                            if (!addToFront) state.reading = false;
                            if (!skipAdd) {
                                if (state.flowing && state.length === 0 && !state.sync) {
                                    stream.emit("data", chunk);
                                    stream.read(0)
                                } else {
                                    state.length += state.objectMode ? 1 : chunk.length;
                                    if (addToFront) state.buffer.unshift(chunk);
                                    else state.buffer.push(chunk);
                                    if (state.needReadable) emitReadable(stream)
                                }
                            }
                            maybeReadMore(stream, state)
                        }
                    } else if (!addToFront) {
                        state.reading = false
                    }
                    return needMoreData(state)
                }
                function needMoreData(state) {
                    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0)
                }
                Readable.prototype.setEncoding = function (enc) {
                    if (!StringDecoder) StringDecoder = require("string_decoder/").StringDecoder;
                    this._readableState.decoder = new StringDecoder(enc);
                    this._readableState.encoding = enc;
                    return this
                };
                var MAX_HWM = 8388608;
                function computeNewHighWaterMark(n) {
                    if (n >= MAX_HWM) {
                        n = MAX_HWM
                    } else {
                        n--;
                        n |= n >>> 1;
                        n |= n >>> 2;
                        n |= n >>> 4;
                        n |= n >>> 8;
                        n |= n >>> 16;
                        n++
                    }
                    return n
                }
                function howMuchToRead(n, state) {
                    if (state.length === 0 && state.ended) return 0;
                    if (state.objectMode) return n === 0 ? 0 : 1;
                    if (n === null || isNaN(n)) {
                        if (state.flowing && state.buffer.length) return state.buffer[0].length;
                        else return state.length
                    }
                    if (n <= 0) return 0;
                    if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
                    if (n > state.length) {
                        if (!state.ended) {
                            state.needReadable = true;
                            return 0
                        } else {
                            return state.length
                        }
                    }
                    return n
                }
                Readable.prototype.read = function (n) {
                    debug("read", n);
                    var state = this._readableState;
                    var nOrig = n;
                    if (typeof n !== "number" || n > 0) state.emittedReadable = false;
                    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
                        debug("read: emitReadable", state.length, state.ended);
                        if (state.length === 0 && state.ended) endReadable(this);
                        else emitReadable(this);
                        return null
                    }
                    n = howMuchToRead(n, state);
                    if (n === 0 && state.ended) {
                        if (state.length === 0) endReadable(this);
                        return null
                    }
                    var doRead = state.needReadable;
                    debug("need readable", doRead);
                    if (state.length === 0 || state.length - n < state.highWaterMark) {
                        doRead = true;
                        debug("length less than watermark", doRead)
                    }
                    if (state.ended || state.reading) {
                        doRead = false;
                        debug("reading or ended", doRead)
                    }
                    if (doRead) {
                        debug("do read");
                        state.reading = true;
                        state.sync = true;
                        if (state.length === 0) state.needReadable = true;
                        this._read(state.highWaterMark);
                        state.sync = false
                    }
                    if (doRead && !state.reading) n = howMuchToRead(nOrig, state);
                    var ret;
                    if (n > 0) ret = fromList(n, state);
                    else ret = null;
                    if (ret === null) {
                        state.needReadable = true;
                        n = 0
                    }
                    state.length -= n;
                    if (state.length === 0 && !state.ended) state.needReadable = true;
                    if (nOrig !== n && state.ended && state.length === 0) endReadable(this);
                    if (ret !== null) this.emit("data", ret);
                    return ret
                };
                function chunkInvalid(state, chunk) {
                    var er = null;
                    if (!Buffer.isBuffer(chunk) && typeof chunk !== "string" && chunk !== null && chunk !== undefined && !state.objectMode) {
                        er = new TypeError("Invalid non-string/buffer chunk")
                    }
                    return er
                }
                function onEofChunk(stream, state) {
                    if (state.ended) return;
                    if (state.decoder) {
                        var chunk = state.decoder.end();
                        if (chunk && chunk.length) {
                            state.buffer.push(chunk);
                            state.length += state.objectMode ? 1 : chunk.length
                        }
                    }
                    state.ended = true;
                    emitReadable(stream)
                }
                function emitReadable(stream) {
                    var state = stream._readableState;
                    state.needReadable = false;
                    if (!state.emittedReadable) {
                        debug("emitReadable", state.flowing);
                        state.emittedReadable = true;
                        if (state.sync) processNextTick(emitReadable_, stream);
                        else emitReadable_(stream)
                    }
                }
                function emitReadable_(stream) {
                    debug("emit readable");
                    stream.emit("readable");
                    flow(stream)
                }
                function maybeReadMore(stream, state) {
                    if (!state.readingMore) {
                        state.readingMore = true;
                        processNextTick(maybeReadMore_, stream, state)
                    }
                }
                function maybeReadMore_(stream, state) {
                    var len = state.length;
                    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
                        debug("maybeReadMore read 0");
                        stream.read(0);
                        if (len === state.length) break;
                        else len = state.length
                    }
                    state.readingMore = false
                }
                Readable.prototype._read = function (n) {
                    this.emit("error", new Error("not implemented"))
                };
                Readable.prototype.pipe = function (dest, pipeOpts) {
                    var src = this;
                    var state = this._readableState;
                    switch (state.pipesCount) {
                    case 0:
                        state.pipes = dest;
                        break;
                    case 1:
                        state.pipes = [state.pipes, dest];
                        break;
                    default:
                        state.pipes.push(dest);
                        break
                    }
                    state.pipesCount += 1;
                    debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
                    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
                    var endFn = doEnd ? onend : cleanup;
                    if (state.endEmitted) processNextTick(endFn);
                    else src.once("end", endFn);
                    dest.on("unpipe", onunpipe);
                    function onunpipe(readable) {
                        debug("onunpipe");
                        if (readable === src) {
                            cleanup()
                        }
                    }
                    function onend() {
                        debug("onend");
                        dest.end()
                    }
                    var ondrain = pipeOnDrain(src);
                    dest.on("drain", ondrain);
                    var cleanedUp = false;
                    function cleanup() {
                        debug("cleanup");
                        dest.removeListener("close", onclose);
                        dest.removeListener("finish", onfinish);
                        dest.removeListener("drain", ondrain);
                        dest.removeListener("error", onerror);
                        dest.removeListener("unpipe", onunpipe);
                        src.removeListener("end", onend);
                        src.removeListener("end", cleanup);
                        src.removeListener("data", ondata);
                        cleanedUp = true;
                        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain()
                    }
                    src.on("data", ondata);
                    function ondata(chunk) {
                        debug("ondata");
                        var ret = dest.write(chunk);
                        if (false === ret) {
                            if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
                                debug("false write response, pause", src._readableState.awaitDrain);
                                src._readableState.awaitDrain++
                            }
                            src.pause()
                        }
                    }
                    function onerror(er) {
                        debug("onerror", er);
                        unpipe();
                        dest.removeListener("error", onerror);
                        if (EElistenerCount(dest, "error") === 0) dest.emit("error", er)
                    }
                    prependListener(dest, "error", onerror);
                    function onclose() {
                        dest.removeListener("finish", onfinish);
                        unpipe()
                    }
                    dest.once("close", onclose);
                    function onfinish() {
                        debug("onfinish");
                        dest.removeListener("close", onclose);
                        unpipe()
                    }
                    dest.once("finish", onfinish);
                    function unpipe() {
                        debug("unpipe");
                        src.unpipe(dest)
                    }
                    dest.emit("pipe", src);
                    if (!state.flowing) {
                        debug("pipe resume");
                        src.resume()
                    }
                    return dest
                };
                function pipeOnDrain(src) {
                    return function () {
                        var state = src._readableState;
                        debug("pipeOnDrain", state.awaitDrain);
                        if (state.awaitDrain) state.awaitDrain--;
                        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
                            state.flowing = true;
                            flow(src)
                        }
                    }
                }
                Readable.prototype.unpipe = function (dest) {
                    var state = this._readableState;
                    if (state.pipesCount === 0) return this;
                    if (state.pipesCount === 1) {
                        if (dest && dest !== state.pipes) return this;
                        if (!dest) dest = state.pipes;
                        state.pipes = null;
                        state.pipesCount = 0;
                        state.flowing = false;
                        if (dest) dest.emit("unpipe", this);
                        return this
                    }
                    if (!dest) {
                        var dests = state.pipes;
                        var len = state.pipesCount;
                        state.pipes = null;
                        state.pipesCount = 0;
                        state.flowing = false;
                        for (var _i = 0; _i < len; _i++) {
                            dests[_i].emit("unpipe", this)
                        }
                        return this
                    }
                    var i = indexOf(state.pipes, dest);
                    if (i === -1) return this;
                    state.pipes.splice(i, 1);
                    state.pipesCount -= 1;
                    if (state.pipesCount === 1) state.pipes = state.pipes[0];
                    dest.emit("unpipe", this);
                    return this
                };
                Readable.prototype.on = function (ev, fn) {
                    var res = Stream.prototype.on.call(this, ev, fn);
                    if (ev === "data" && false !== this._readableState.flowing) {
                        this.resume()
                    }
                    if (ev === "readable" && !this._readableState.endEmitted) {
                        var state = this._readableState;
                        if (!state.readableListening) {
                            state.readableListening = true;
                            state.emittedReadable = false;
                            state.needReadable = true;
                            if (!state.reading) {
                                processNextTick(nReadingNextTick, this)
                            } else if (state.length) {
                                emitReadable(this, state)
                            }
                        }
                    }
                    return res
                };
                Readable.prototype.addListener = Readable.prototype.on;
                function nReadingNextTick(self) {
                    debug("readable nexttick read 0");
                    self.read(0)
                }
                Readable.prototype.resume = function () {
                    var state = this._readableState;
                    if (!state.flowing) {
                        debug("resume");
                        state.flowing = true;
                        resume(this, state)
                    }
                    return this
                };
                function resume(stream, state) {
                    if (!state.resumeScheduled) {
                        state.resumeScheduled = true;
                        processNextTick(resume_, stream, state)
                    }
                }
                function resume_(stream, state) {
                    if (!state.reading) {
                        debug("resume read 0");
                        stream.read(0)
                    }
                    state.resumeScheduled = false;
                    stream.emit("resume");
                    flow(stream);
                    if (state.flowing && !state.reading) stream.read(0)
                }
                Readable.prototype.pause = function () {
                    debug("call pause flowing=%j", this._readableState.flowing);
                    if (false !== this._readableState.flowing) {
                        debug("pause");
                        this._readableState.flowing = false;
                        this.emit("pause")
                    }
                    return this
                };
                function flow(stream) {
                    var state = stream._readableState;
                    debug("flow", state.flowing);
                    if (state.flowing) {
                        do {
                            var chunk = stream.read()
                        } while (null !== chunk && state.flowing)
                    }
                }
                Readable.prototype.wrap = function (stream) {
                    var state = this._readableState;
                    var paused = false;
                    var self = this;
                    stream.on("end", function () {
                        debug("wrapped end");
                        if (state.decoder && !state.ended) {
                            var chunk = state.decoder.end();
                            if (chunk && chunk.length) self.push(chunk)
                        }
                        self.push(null)
                    });
                    stream.on("data", function (chunk) {
                        debug("wrapped data");
                        if (state.decoder) chunk = state.decoder.write(chunk);
                        if (state.objectMode && (chunk === null || chunk === undefined)) return;
                        else if (!state.objectMode && (!chunk || !chunk.length)) return;
                        var ret = self.push(chunk);
                        if (!ret) {
                            paused = true;
                            stream.pause()
                        }
                    });
                    for (var i in stream) {
                        if (this[i] === undefined && typeof stream[i] === "function") {
                            this[i] = function (method) {
                                return function () {
                                    return stream[method].apply(stream, arguments)
                                }
                            }(i)
                        }
                    }
                    var events = ["error", "close", "destroy", "pause", "resume"];
                    forEach(events, function (ev) {
                        stream.on(ev, self.emit.bind(self, ev))
                    });
                    self._read = function (n) {
                        debug("wrapped _read", n);
                        if (paused) {
                            paused = false;
                            stream.resume()
                        }
                    };
                    return self
                };
                Readable._fromList = fromList;
                function fromList(n, state) {
                    var list = state.buffer;
                    var length = state.length;
                    var stringMode = !!state.decoder;
                    var objectMode = !!state.objectMode;
                    var ret;
                    if (list.length === 0) return null;
                    if (length === 0) ret = null;
                    else if (objectMode) ret = list.shift();
                    else if (!n || n >= length) {
                        if (stringMode) ret = list.join("");
                        else if (list.length === 1) ret = list[0];
                        else ret = Buffer.concat(list, length);
                        list.length = 0
                    } else {
                        if (n < list[0].length) {
                            var buf = list[0];
                            ret = buf.slice(0, n);
                            list[0] = buf.slice(n)
                        } else if (n === list[0].length) {
                            ret = list.shift()
                        } else {
                            if (stringMode) ret = "";
                            else ret = bufferShim.allocUnsafe(n);
                            var c = 0;
                            for (var i = 0, l = list.length; i < l && c < n; i++) {
                                var _buf = list[0];
                                var cpy = Math.min(n - c, _buf.length);
                                if (stringMode) ret += _buf.slice(0, cpy);
                                else _buf.copy(ret, c, 0, cpy);
                                if (cpy < _buf.length) list[0] = _buf.slice(cpy);
                                else list.shift();
                                c += cpy
                            }
                        }
                    }
                    return ret
                }
                function endReadable(stream) {
                    var state = stream._readableState;
                    if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
                    if (!state.endEmitted) {
                        state.ended = true;
                        processNextTick(endReadableNT, state, stream)
                    }
                }
                function endReadableNT(state, stream) {
                    if (!state.endEmitted && state.length === 0) {
                        state.endEmitted = true;
                        stream.readable = false;
                        stream.emit("end")
                    }
                }
                function forEach(xs, f) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        f(xs[i], i)
                    }
                }
                function indexOf(xs, x) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        if (xs[i] === x) return i
                    }
                    return -1
                }
            }).call(this, require("_process"))
        }, {
            "./_stream_duplex": 12,
            _process: 10,
            buffer: 3,
            "buffer-shims": 17,
            "core-util-is": 18,
            events: 7,
            inherits: 8,
            isarray: 19,
            "process-nextick-args": 20,
            "string_decoder/": 27,
            util: 2
        }],
        15: [function (require, module, exports) {
            "use strict";
            module.exports = Transform;
            var Duplex = require("./_stream_duplex");
            var util = require("core-util-is");
            util.inherits = require("inherits");
            util.inherits(Transform, Duplex);
            function TransformState(stream) {
                this.afterTransform = function (er, data) {
                    return afterTransform(stream, er, data)
                };
                this.needTransform = false;
                this.transforming = false;
                this.writecb = null;
                this.writechunk = null;
                this.writeencoding = null
            }
            function afterTransform(stream, er, data) {
                var ts = stream._transformState;
                ts.transforming = false;
                var cb = ts.writecb;
                if (!cb) return stream.emit("error", new Error("no writecb in Transform class"));
                ts.writechunk = null;
                ts.writecb = null;
                if (data !== null && data !== undefined) stream.push(data);
                cb(er);
                var rs = stream._readableState;
                rs.reading = false;
                if (rs.needReadable || rs.length < rs.highWaterMark) {
                    stream._read(rs.highWaterMark)
                }
            }
            function Transform(options) {
                if (!(this instanceof Transform)) return new Transform(options);
                Duplex.call(this, options);
                this._transformState = new TransformState(this);
                var stream = this;
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                if (options) {
                    if (typeof options.transform === "function") this._transform = options.transform;
                    if (typeof options.flush === "function") this._flush = options.flush
                }
                this.once("prefinish", function () {
                    if (typeof this._flush === "function") this._flush(function (er) {
                        done(stream, er)
                    });
                    else done(stream)
                })
            }
            Transform.prototype.push = function (chunk, encoding) {
                this._transformState.needTransform = false;
                return Duplex.prototype.push.call(this, chunk, encoding)
            };
            Transform.prototype._transform = function (chunk, encoding, cb) {
                throw new Error("Not implemented")
            };
            Transform.prototype._write = function (chunk, encoding, cb) {
                var ts = this._transformState;
                ts.writecb = cb;
                ts.writechunk = chunk;
                ts.writeencoding = encoding;
                if (!ts.transforming) {
                    var rs = this._readableState;
                    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark)
                }
            };
            Transform.prototype._read = function (n) {
                var ts = this._transformState;
                if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
                    ts.transforming = true;
                    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)
                } else {
                    ts.needTransform = true
                }
            };
            function done(stream, er) {
                if (er) return stream.emit("error", er);
                var ws = stream._writableState;
                var ts = stream._transformState;
                if (ws.length) throw new Error("Calling transform done when ws.length != 0");
                if (ts.transforming) throw new Error("Calling transform done when still transforming");
                return stream.push(null)
            }
        }, {
            "./_stream_duplex": 12,
            "core-util-is": 18,
            inherits: 8
        }],
        16: [function (require, module, exports) {
            (function (process) {
                "use strict";
                module.exports = Writable;
                var processNextTick = require("process-nextick-args");
                var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
                Writable.WritableState = WritableState;
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var internalUtil = {
                    deprecate: require("util-deprecate")
                };
                var Stream;
                (function () {
                    try {
                        Stream = require("st" + "ream")
                    } catch (_) {} finally {
                        if (!Stream) Stream = require("events").EventEmitter
                    }
                })();
                var Buffer = require("buffer").Buffer;
                var bufferShim = require("buffer-shims");
                util.inherits(Writable, Stream);
                function nop() {}
                function WriteReq(chunk, encoding, cb) {
                    this.chunk = chunk;
                    this.encoding = encoding;
                    this.callback = cb;
                    this.next = null
                }
                var Duplex;
                function WritableState(options, stream) {
                    Duplex = Duplex || require("./_stream_duplex");
                    options = options || {};
                    this.objectMode = !!options.objectMode;
                    if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
                    var hwm = options.highWaterMark;
                    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                    this.highWaterMark = ~~this.highWaterMark;
                    this.needDrain = false;
                    this.ending = false;
                    this.ended = false;
                    this.finished = false;
                    var noDecode = options.decodeStrings === false;
                    this.decodeStrings = !noDecode;
                    this.defaultEncoding = options.defaultEncoding || "utf8";
                    this.length = 0;
                    this.writing = false;
                    this.corked = 0;
                    this.sync = true;
                    this.bufferProcessing = false;
                    this.onwrite = function (er) {
                        onwrite(stream, er)
                    };
                    this.writecb = null;
                    this.writelen = 0;
                    this.bufferedRequest = null;
                    this.lastBufferedRequest = null;
                    this.pendingcb = 0;
                    this.prefinished = false;
                    this.errorEmitted = false;
                    this.bufferedRequestCount = 0;
                    this.corkedRequestsFree = new CorkedRequest(this)
                }
                WritableState.prototype.getBuffer = function writableStateGetBuffer() {
                    var current = this.bufferedRequest;
                    var out = [];
                    while (current) {
                        out.push(current);
                        current = current.next
                    }
                    return out
                };
                (function () {
                    try {
                        Object.defineProperty(WritableState.prototype, "buffer", {
                            get: internalUtil.deprecate(function () {
                                return this.getBuffer()
                            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer " + "instead.")
                        })
                    } catch (_) {}
                })();
                var Duplex;
                function Writable(options) {
                    Duplex = Duplex || require("./_stream_duplex");
                    if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);
                    this._writableState = new WritableState(options, this);
                    this.writable = true;
                    if (options) {
                        if (typeof options.write === "function") this._write = options.write;
                        if (typeof options.writev === "function") this._writev = options.writev
                    }
                    Stream.call(this)
                }
                Writable.prototype.pipe = function () {
                    this.emit("error", new Error("Cannot pipe, not readable"))
                };
                function writeAfterEnd(stream, cb) {
                    var er = new Error("write after end");
                    stream.emit("error", er);
                    processNextTick(cb, er)
                }
                function validChunk(stream, state, chunk, cb) {
                    var valid = true;
                    var er = false;
                    if (chunk === null) {
                        er = new TypeError("May not write null values to stream")
                    } else if (!Buffer.isBuffer(chunk) && typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
                        er = new TypeError("Invalid non-string/buffer chunk")
                    }
                    if (er) {
                        stream.emit("error", er);
                        processNextTick(cb, er);
                        valid = false
                    }
                    return valid
                }
                Writable.prototype.write = function (chunk, encoding, cb) {
                    var state = this._writableState;
                    var ret = false;
                    if (typeof encoding === "function") {
                        cb = encoding;
                        encoding = null
                    }
                    if (Buffer.isBuffer(chunk)) encoding = "buffer";
                    else if (!encoding) encoding = state.defaultEncoding;
                    if (typeof cb !== "function") cb = nop;
                    if (state.ended) writeAfterEnd(this, cb);
                    else if (validChunk(this, state, chunk, cb)) {
                        state.pendingcb++;
                        ret = writeOrBuffer(this, state, chunk, encoding, cb)
                    }
                    return ret
                };
                Writable.prototype.cork = function () {
                    var state = this._writableState;
                    state.corked++
                };
                Writable.prototype.uncork = function () {
                    var state = this._writableState;
                    if (state.corked) {
                        state.corked--;
                        if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state)
                    }
                };
                Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
                    if (typeof encoding === "string") encoding = encoding.toLowerCase();
                    if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
                    this._writableState.defaultEncoding = encoding;
                    return this
                };
                function decodeChunk(state, chunk, encoding) {
                    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
                        chunk = bufferShim.from(chunk, encoding)
                    }
                    return chunk
                }
                function writeOrBuffer(stream, state, chunk, encoding, cb) {
                    chunk = decodeChunk(state, chunk, encoding);
                    if (Buffer.isBuffer(chunk)) encoding = "buffer";
                    var len = state.objectMode ? 1 : chunk.length;
                    state.length += len;
                    var ret = state.length < state.highWaterMark;
                    if (!ret) state.needDrain = true;
                    if (state.writing || state.corked) {
                        var last = state.lastBufferedRequest;
                        state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
                        if (last) {
                            last.next = state.lastBufferedRequest
                        } else {
                            state.bufferedRequest = state.lastBufferedRequest
                        }
                        state.bufferedRequestCount += 1
                    } else {
                        doWrite(stream, state, false, len, chunk, encoding, cb)
                    }
                    return ret
                }
                function doWrite(stream, state, writev, len, chunk, encoding, cb) {
                    state.writelen = len;
                    state.writecb = cb;
                    state.writing = true;
                    state.sync = true;
                    if (writev) stream._writev(chunk, state.onwrite);
                    else stream._write(chunk, encoding, state.onwrite);
                    state.sync = false
                }
                function onwriteError(stream, state, sync, er, cb) {
                    --state.pendingcb;
                    if (sync) processNextTick(cb, er);
                    else cb(er);
                    stream._writableState.errorEmitted = true;
                    stream.emit("error", er)
                }
                function onwriteStateUpdate(state) {
                    state.writing = false;
                    state.writecb = null;
                    state.length -= state.writelen;
                    state.writelen = 0
                }
                function onwrite(stream, er) {
                    var state = stream._writableState;
                    var sync = state.sync;
                    var cb = state.writecb;
                    onwriteStateUpdate(state);
                    if (er) onwriteError(stream, state, sync, er, cb);
                    else {
                        var finished = needFinish(state);
                        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
                            clearBuffer(stream, state)
                        }
                        if (sync) {
                            asyncWrite(afterWrite, stream, state, finished, cb)
                        } else {
                            afterWrite(stream, state, finished, cb)
                        }
                    }
                }
                function afterWrite(stream, state, finished, cb) {
                    if (!finished) onwriteDrain(stream, state);
                    state.pendingcb--;
                    cb();
                    finishMaybe(stream, state)
                }
                function onwriteDrain(stream, state) {
                    if (state.length === 0 && state.needDrain) {
                        state.needDrain = false;
                        stream.emit("drain")
                    }
                }
                function clearBuffer(stream, state) {
                    state.bufferProcessing = true;
                    var entry = state.bufferedRequest;
                    if (stream._writev && entry && entry.next) {
                        var l = state.bufferedRequestCount;
                        var buffer = new Array(l);
                        var holder = state.corkedRequestsFree;
                        holder.entry = entry;
                        var count = 0;
                        while (entry) {
                            buffer[count] = entry;
                            entry = entry.next;
                            count += 1
                        }
                        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
                        state.pendingcb++;
                        state.lastBufferedRequest = null;
                        if (holder.next) {
                            state.corkedRequestsFree = holder.next;
                            holder.next = null
                        } else {
                            state.corkedRequestsFree = new CorkedRequest(state)
                        }
                    } else {
                        while (entry) {
                            var chunk = entry.chunk;
                            var encoding = entry.encoding;
                            var cb = entry.callback;
                            var len = state.objectMode ? 1 : chunk.length;
                            doWrite(stream, state, false, len, chunk, encoding, cb);
                            entry = entry.next;
                            if (state.writing) {
                                break
                            }
                        }
                        if (entry === null) state.lastBufferedRequest = null
                    }
                    state.bufferedRequestCount = 0;
                    state.bufferedRequest = entry;
                    state.bufferProcessing = false
                }
                Writable.prototype._write = function (chunk, encoding, cb) {
                    cb(new Error("not implemented"))
                };
                Writable.prototype._writev = null;
                Writable.prototype.end = function (chunk, encoding, cb) {
                    var state = this._writableState;
                    if (typeof chunk === "function") {
                        cb = chunk;
                        chunk = null;
                        encoding = null
                    } else if (typeof encoding === "function") {
                        cb = encoding;
                        encoding = null
                    }
                    if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);
                    if (state.corked) {
                        state.corked = 1;
                        this.uncork()
                    }
                    if (!state.ending && !state.finished) endWritable(this, state, cb)
                };
                function needFinish(state) {
                    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing
                }
                function prefinish(stream, state) {
                    if (!state.prefinished) {
                        state.prefinished = true;
                        stream.emit("prefinish")
                    }
                }
                function finishMaybe(stream, state) {
                    var need = needFinish(state);
                    if (need) {
                        if (state.pendingcb === 0) {
                            prefinish(stream, state);
                            state.finished = true;
                            stream.emit("finish")
                        } else {
                            prefinish(stream, state)
                        }
                    }
                    return need
                }
                function endWritable(stream, state, cb) {
                    state.ending = true;
                    finishMaybe(stream, state);
                    if (cb) {
                        if (state.finished) processNextTick(cb);
                        else stream.once("finish", cb)
                    }
                    state.ended = true;
                    stream.writable = false
                }
                function CorkedRequest(state) {
                    var _this = this;
                    this.next = null;
                    this.entry = null;
                    this.finish = function (err) {
                        var entry = _this.entry;
                        _this.entry = null;
                        while (entry) {
                            var cb = entry.callback;
                            state.pendingcb--;
                            cb(err);
                            entry = entry.next
                        }
                        if (state.corkedRequestsFree) {
                            state.corkedRequestsFree.next = _this
                        } else {
                            state.corkedRequestsFree = _this
                        }
                    }
                }
            }).call(this, require("_process"))
        }, {
            "./_stream_duplex": 12,
            _process: 10,
            buffer: 3,
            "buffer-shims": 17,
            "core-util-is": 18,
            events: 7,
            inherits: 8,
            "process-nextick-args": 20,
            "util-deprecate": 21
        }],
        17: [function (require, module, exports) {
            (function (global) {
                "use strict";
                var buffer = require("buffer");
                var Buffer = buffer.Buffer;
                var SlowBuffer = buffer.SlowBuffer;
                var MAX_LEN = buffer.kMaxLength || 2147483647;
                exports.alloc = function alloc(size, fill, encoding) {
                    if (typeof Buffer.alloc === "function") {
                        return Buffer.alloc(size, fill, encoding)
                    }
                    if (typeof encoding === "number") {
                        throw new TypeError("encoding must not be number")
                    }
                    if (typeof size !== "number") {
                        throw new TypeError("size must be a number")
                    }
                    if (size > MAX_LEN) {
                        throw new RangeError("size is too large")
                    }
                    var enc = encoding;
                    var _fill = fill;
                    if (_fill === undefined) {
                        enc = undefined;
                        _fill = 0
                    }
                    var buf = new Buffer(size);
                    if (typeof _fill === "string") {
                        var fillBuf = new Buffer(_fill, enc);
                        var flen = fillBuf.length;
                        var i = -1;
                        while (++i < size) {
                            buf[i] = fillBuf[i % flen]
                        }
                    } else {
                        buf.fill(_fill)
                    }
                    return buf
                };
                exports.allocUnsafe = function allocUnsafe(size) {
                    if (typeof Buffer.allocUnsafe === "function") {
                        return Buffer.allocUnsafe(size)
                    }
                    if (typeof size !== "number") {
                        throw new TypeError("size must be a number")
                    }
                    if (size > MAX_LEN) {
                        throw new RangeError("size is too large")
                    }
                    return new Buffer(size)
                };
                exports.from = function from(value, encodingOrOffset, length) {
                    if (typeof Buffer.from === "function" && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
                        return Buffer.from(value, encodingOrOffset, length)
                    }
                    if (typeof value === "number") {
                        throw new TypeError('"value" argument must not be a number')
                    }
                    if (typeof value === "string") {
                        return new Buffer(value, encodingOrOffset)
                    }
                    if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
                        var offset = encodingOrOffset;
                        if (arguments.length === 1) {
                            return new Buffer(value)
                        }
                        if (typeof offset === "undefined") {
                            offset = 0
                        }
                        var len = length;
                        if (typeof len === "undefined") {
                            len = value.byteLength - offset
                        }
                        if (offset >= value.byteLength) {
                            throw new RangeError("'offset' is out of bounds")
                        }
                        if (len > value.byteLength - offset) {
                            throw new RangeError("'length' is out of bounds")
                        }
                        return new Buffer(value.slice(offset, offset + len))
                    }
                    if (Buffer.isBuffer(value)) {
                        var out = new Buffer(value.length);
                        value.copy(out, 0, 0, value.length);
                        return out
                    }
                    if (value) {
                        if (Array.isArray(value) || typeof ArrayBuffer !== "undefined" && value.buffer instanceof ArrayBuffer || "length" in value) {
                            return new Buffer(value)
                        }
                        if (value.type === "Buffer" && Array.isArray(value.data)) {
                            return new Buffer(value.data)
                        }
                    }
                    throw new TypeError("First argument must be a string, Buffer, " + "ArrayBuffer, Array, or array-like object.")
                };
                exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
                    if (typeof Buffer.allocUnsafeSlow === "function") {
                        return Buffer.allocUnsafeSlow(size)
                    }
                    if (typeof size !== "number") {
                        throw new TypeError("size must be a number")
                    }
                    if (size >= MAX_LEN) {
                        throw new RangeError("size is too large")
                    }
                    return new SlowBuffer(size)
                }
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {
            buffer: 3
        }],
        18: [function (require, module, exports) {
            (function (Buffer) {
                function isArray(arg) {
                    if (Array.isArray) {
                        return Array.isArray(arg)
                    }
                    return objectToString(arg) === "[object Array]"
                }
                exports.isArray = isArray;
                function isBoolean(arg) {
                    return typeof arg === "boolean"
                }
                exports.isBoolean = isBoolean;
                function isNull(arg) {
                    return arg === null
                }
                exports.isNull = isNull;
                function isNullOrUndefined(arg) {
                    return arg == null
                }
                exports.isNullOrUndefined = isNullOrUndefined;
                function isNumber(arg) {
                    return typeof arg === "number"
                }
                exports.isNumber = isNumber;
                function isString(arg) {
                    return typeof arg === "string"
                }
                exports.isString = isString;
                function isSymbol(arg) {
                    return typeof arg === "symbol"
                }
                exports.isSymbol = isSymbol;
                function isUndefined(arg) {
                    return arg === void 0
                }
                exports.isUndefined = isUndefined;
                function isRegExp(re) {
                    return objectToString(re) === "[object RegExp]"
                }
                exports.isRegExp = isRegExp;
                function isObject(arg) {
                    return typeof arg === "object" && arg !== null
                }
                exports.isObject = isObject;
                function isDate(d) {
                    return objectToString(d) === "[object Date]"
                }
                exports.isDate = isDate;
                function isError(e) {
                    return objectToString(e) === "[object Error]" || e instanceof Error
                }
                exports.isError = isError;
                function isFunction(arg) {
                    return typeof arg === "function"
                }
                exports.isFunction = isFunction;
                function isPrimitive(arg) {
                    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined"
                }
                exports.isPrimitive = isPrimitive;
                exports.isBuffer = Buffer.isBuffer;
                function objectToString(o) {
                    return Object.prototype.toString.call(o)
                }
            }).call(this, {
                isBuffer: require("is-buffer")
            })
        }, {
            "is-buffer": 9
        }],
        19: [function (require, module, exports) {
            arguments[4][6][0].apply(exports, arguments)
        }, {
            dup: 6
        }],
        20: [function (require, module, exports) {
            (function (process) {
                "use strict";
                if (!process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
                    module.exports = nextTick
                } else {
                    module.exports = process.nextTick
                }
                function nextTick(fn, arg1, arg2, arg3) {
                    if (typeof fn !== "function") {
                        throw new TypeError('"callback" argument must be a function')
                    }
                    var len = arguments.length;
                    var args, i;
                    switch (len) {
                    case 0:
                    case 1:
                        return process.nextTick(fn);
                    case 2:
                        return process.nextTick(function afterTickOne() {
                            fn.call(null, arg1)
                        });
                    case 3:
                        return process.nextTick(function afterTickTwo() {
                            fn.call(null, arg1, arg2)
                        });
                    case 4:
                        return process.nextTick(function afterTickThree() {
                            fn.call(null, arg1, arg2, arg3)
                        });
                    default:
                        args = new Array(len - 1);
                        i = 0;
                        while (i < args.length) {
                            args[i++] = arguments[i]
                        }
                        return process.nextTick(function afterTick() {
                            fn.apply(null, args)
                        })
                    }
                }
            }).call(this, require("_process"))
        }, {
            _process: 10
        }],
        21: [function (require, module, exports) {
            (function (global) {
                module.exports = deprecate;
                function deprecate(fn, msg) {
                    if (config("noDeprecation")) {
                        return fn
                    }
                    var warned = false;
                    function deprecated() {
                        if (!warned) {
                            if (config("throwDeprecation")) {
                                throw new Error(msg)
                            } else if (config("traceDeprecation")) {
                                console.trace(msg)
                            } else {
                                console.warn(msg)
                            }
                            warned = true
                        }
                        return fn.apply(this, arguments)
                    }
                    return deprecated
                }
                function config(name) {
                    try {
                        if (!global.localStorage) return false
                    } catch (_) {
                        return false
                    }
                    var val = global.localStorage[name];
                    if (null == val) return false;
                    return String(val).toLowerCase() === "true"
                }
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {}],
        22: [function (require, module, exports) {
            module.exports = require("./lib/_stream_passthrough.js")
        }, {
            "./lib/_stream_passthrough.js": 13
        }],
        23: [function (require, module, exports) {
            (function (process) {
                var Stream = function () {
                    try {
                        return require("st" + "ream")
                    } catch (_) {}
                }();
                exports = module.exports = require("./lib/_stream_readable.js");
                exports.Stream = Stream || exports;
                exports.Readable = exports;
                exports.Writable = require("./lib/_stream_writable.js");
                exports.Duplex = require("./lib/_stream_duplex.js");
                exports.Transform = require("./lib/_stream_transform.js");
                exports.PassThrough = require("./lib/_stream_passthrough.js");
                if (!process.browser && process.env.READABLE_STREAM === "disable" && Stream) {
                    module.exports = Stream
                }
            }).call(this, require("_process"))
        }, {
            "./lib/_stream_duplex.js": 12,
            "./lib/_stream_passthrough.js": 13,
            "./lib/_stream_readable.js": 14,
            "./lib/_stream_transform.js": 15,
            "./lib/_stream_writable.js": 16,
            _process: 10
        }],
        24: [function (require, module, exports) {
            module.exports = require("./lib/_stream_transform.js")
        }, {
            "./lib/_stream_transform.js": 15
        }],
        25: [function (require, module, exports) {
            module.exports = require("./lib/_stream_writable.js")
        }, {
            "./lib/_stream_writable.js": 16
        }],
        26: [function (require, module, exports) {
            module.exports = Stream;
            var EE = require("events").EventEmitter;
            var inherits = require("inherits");
            inherits(Stream, EE);
            Stream.Readable = require("readable-stream/readable.js");
            Stream.Writable = require("readable-stream/writable.js");
            Stream.Duplex = require("readable-stream/duplex.js");
            Stream.Transform = require("readable-stream/transform.js");
            Stream.PassThrough = require("readable-stream/passthrough.js");
            Stream.Stream = Stream;
            function Stream() {
                EE.call(this)
            }
            Stream.prototype.pipe = function (dest, options) {
                var source = this;
                function ondata(chunk) {
                    if (dest.writable) {
                        if (false === dest.write(chunk) && source.pause) {
                            source.pause()
                        }
                    }
                }
                source.on("data", ondata);
                function ondrain() {
                    if (source.readable && source.resume) {
                        source.resume()
                    }
                }
                dest.on("drain", ondrain);
                if (!dest._isStdio && (!options || options.end !== false)) {
                    source.on("end", onend);
                    source.on("close", onclose)
                }
                var didOnEnd = false;
                function onend() {
                    if (didOnEnd) return;
                    didOnEnd = true;
                    dest.end()
                }
                function onclose() {
                    if (didOnEnd) return;
                    didOnEnd = true;
                    if (typeof dest.destroy === "function") dest.destroy()
                }
                function onerror(er) {
                    cleanup();
                    if (EE.listenerCount(this, "error") === 0) {
                        throw er
                    }
                }
                source.on("error", onerror);
                dest.on("error", onerror);
                function cleanup() {
                    source.removeListener("data", ondata);
                    dest.removeListener("drain", ondrain);
                    source.removeListener("end", onend);
                    source.removeListener("close", onclose);
                    source.removeListener("error", onerror);
                    dest.removeListener("error", onerror);
                    source.removeListener("end", cleanup);
                    source.removeListener("close", cleanup);
                    dest.removeListener("close", cleanup)
                }
                source.on("end", cleanup);
                source.on("close", cleanup);
                dest.on("close", cleanup);
                dest.emit("pipe", source);
                return dest
            }
        }, {
            events: 7,
            inherits: 8,
            "readable-stream/duplex.js": 11,
            "readable-stream/passthrough.js": 22,
            "readable-stream/readable.js": 23,
            "readable-stream/transform.js": 24,
            "readable-stream/writable.js": 25
        }],
        27: [function (require, module, exports) {
            var Buffer = require("buffer").Buffer;
            var isBufferEncoding = Buffer.isEncoding || function (encoding) {
                switch (encoding && encoding.toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                case "raw":
                    return true;
                default:
                    return false
                }
            };
            function assertEncoding(encoding) {
                if (encoding && !isBufferEncoding(encoding)) {
                    throw new Error("Unknown encoding: " + encoding)
                }
            }
            var StringDecoder = exports.StringDecoder = function (encoding) {
                this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, "");
                assertEncoding(encoding);
                switch (this.encoding) {
                case "utf8":
                    this.surrogateSize = 3;
                    break;
                case "ucs2":
                case "utf16le":
                    this.surrogateSize = 2;
                    this.detectIncompleteChar = utf16DetectIncompleteChar;
                    break;
                case "base64":
                    this.surrogateSize = 3;
                    this.detectIncompleteChar = base64DetectIncompleteChar;
                    break;
                default:
                    this.write = passThroughWrite;
                    return
                }
                this.charBuffer = new Buffer(6);
                this.charReceived = 0;
                this.charLength = 0
            };
            StringDecoder.prototype.write = function (buffer) {
                var charStr = "";
                while (this.charLength) {
                    var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
                    buffer.copy(this.charBuffer, this.charReceived, 0, available);
                    this.charReceived += available;
                    if (this.charReceived < this.charLength) {
                        return ""
                    }
                    buffer = buffer.slice(available, buffer.length);
                    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                    var charCode = charStr.charCodeAt(charStr.length - 1);
                    if (charCode >= 55296 && charCode <= 56319) {
                        this.charLength += this.surrogateSize;
                        charStr = "";
                        continue
                    }
                    this.charReceived = this.charLength = 0;
                    if (buffer.length === 0) {
                        return charStr
                    }
                    break
                }
                this.detectIncompleteChar(buffer);
                var end = buffer.length;
                if (this.charLength) {
                    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
                    end -= this.charReceived
                }
                charStr += buffer.toString(this.encoding, 0, end);
                var end = charStr.length - 1;
                var charCode = charStr.charCodeAt(end);
                if (charCode >= 55296 && charCode <= 56319) {
                    var size = this.surrogateSize;
                    this.charLength += size;
                    this.charReceived += size;
                    this.charBuffer.copy(this.charBuffer, size, 0, size);
                    buffer.copy(this.charBuffer, 0, 0, size);
                    return charStr.substring(0, end)
                }
                return charStr
            };
            StringDecoder.prototype.detectIncompleteChar = function (buffer) {
                var i = buffer.length >= 3 ? 3 : buffer.length;
                for (; i > 0; i--) {
                    var c = buffer[buffer.length - i];
                    if (i == 1 && c >> 5 == 6) {
                        this.charLength = 2;
                        break
                    }
                    if (i <= 2 && c >> 4 == 14) {
                        this.charLength = 3;
                        break
                    }
                    if (i <= 3 && c >> 3 == 30) {
                        this.charLength = 4;
                        break
                    }
                }
                this.charReceived = i
            };
            StringDecoder.prototype.end = function (buffer) {
                var res = "";
                if (buffer && buffer.length) res = this.write(buffer);
                if (this.charReceived) {
                    var cr = this.charReceived;
                    var buf = this.charBuffer;
                    var enc = this.encoding;
                    res += buf.slice(0, cr).toString(enc)
                }
                return res
            };
            function passThroughWrite(buffer) {
                return buffer.toString(this.encoding)
            }
            function utf16DetectIncompleteChar(buffer) {
                this.charReceived = buffer.length % 2;
                this.charLength = this.charReceived ? 2 : 0
            }
            function base64DetectIncompleteChar(buffer) {
                this.charReceived = buffer.length % 3;
                this.charLength = this.charReceived ? 3 : 0
            }
        }, {
            buffer: 3
        }],
        28: [function (require, module, exports) {
            module.exports = function isBuffer(arg) {
                return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function"
            }
        }, {}],
        29: [function (require, module, exports) {
            (function (process, global) {
                var formatRegExp = /%[sdj%]/g;
                exports.format = function (f) {
                    if (!isString(f)) {
                        var objects = [];
                        for (var i = 0; i < arguments.length; i++) {
                            objects.push(inspect(arguments[i]))
                        }
                        return objects.join(" ")
                    }
                    var i = 1;
                    var args = arguments;
                    var len = args.length;
                    var str = String(f).replace(formatRegExp, function (x) {
                        if (x === "%%") return "%";
                        if (i >= len) return x;
                        switch (x) {
                        case "%s":
                            return String(args[i++]);
                        case "%d":
                            return Number(args[i++]);
                        case "%j":
                            try {
                                return JSON.stringify(args[i++])
                            } catch (_) {
                                return "[Circular]"
                            }
                        default:
                            return x
                        }
                    });
                    for (var x = args[i]; i < len; x = args[++i]) {
                        if (isNull(x) || !isObject(x)) {
                            str += " " + x
                        } else {
                            str += " " + inspect(x)
                        }
                    }
                    return str
                };
                exports.deprecate = function (fn, msg) {
                    if (isUndefined(global.process)) {
                        return function () {
                            return exports.deprecate(fn, msg).apply(this, arguments)
                        }
                    }
                    if (process.noDeprecation === true) {
                        return fn
                    }
                    var warned = false;
                    function deprecated() {
                        if (!warned) {
                            if (process.throwDeprecation) {
                                throw new Error(msg)
                            } else if (process.traceDeprecation) {
                                console.trace(msg)
                            } else {
                                console.error(msg)
                            }
                            warned = true
                        }
                        return fn.apply(this, arguments)
                    }
                    return deprecated
                };
                var debugs = {};
                var debugEnviron;
                exports.debuglog = function (set) {
                    if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || "";
                    set = set.toUpperCase();
                    if (!debugs[set]) {
                        if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
                            var pid = process.pid;
                            debugs[set] = function () {
                                var msg = exports.format.apply(exports, arguments);
                                console.error("%s %d: %s", set, pid, msg)
                            }
                        } else {
                            debugs[set] = function () {}
                        }
                    }
                    return debugs[set]
                };
                function inspect(obj, opts) {
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    if (arguments.length >= 3) ctx.depth = arguments[2];
                    if (arguments.length >= 4) ctx.colors = arguments[3];
                    if (isBoolean(opts)) {
                        ctx.showHidden = opts
                    } else if (opts) {
                        exports._extend(ctx, opts)
                    }
                    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
                    if (isUndefined(ctx.depth)) ctx.depth = 2;
                    if (isUndefined(ctx.colors)) ctx.colors = false;
                    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
                    if (ctx.colors) ctx.stylize = stylizeWithColor;
                    return formatValue(ctx, obj, ctx.depth)
                }
                exports.inspect = inspect;
                inspect.colors = {
                    bold: [1, 22],
                    italic: [3, 23],
                    underline: [4, 24],
                    inverse: [7, 27],
                    white: [37, 39],
                    grey: [90, 39],
                    black: [30, 39],
                    blue: [34, 39],
                    cyan: [36, 39],
                    green: [32, 39],
                    magenta: [35, 39],
                    red: [31, 39],
                    yellow: [33, 39]
                };
                inspect.styles = {
                    special: "cyan",
                    number: "yellow",
                    "boolean": "yellow",
                    undefined: "grey",
                    "null": "bold",
                    string: "green",
                    date: "magenta",
                    regexp: "red"
                };
                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];
                    if (style) {
                        return "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m"
                    } else {
                        return str
                    }
                }
                function stylizeNoColor(str, styleType) {
                    return str
                }
                function arrayToHash(array) {
                    var hash = {};
                    array.forEach(function (val, idx) {
                        hash[val] = true
                    });
                    return hash
                }
                function formatValue(ctx, value, recurseTimes) {
                    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
                        var ret = value.inspect(recurseTimes, ctx);
                        if (!isString(ret)) {
                            ret = formatValue(ctx, ret, recurseTimes)
                        }
                        return ret
                    }
                    var primitive = formatPrimitive(ctx, value);
                    if (primitive) {
                        return primitive
                    }
                    var keys = Object.keys(value);
                    var visibleKeys = arrayToHash(keys);
                    if (ctx.showHidden) {
                        keys = Object.getOwnPropertyNames(value)
                    }
                    if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
                        return formatError(value)
                    }
                    if (keys.length === 0) {
                        if (isFunction(value)) {
                            var name = value.name ? ": " + value.name : "";
                            return ctx.stylize("[Function" + name + "]", "special")
                        }
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp")
                        }
                        if (isDate(value)) {
                            return ctx.stylize(Date.prototype.toString.call(value), "date")
                        }
                        if (isError(value)) {
                            return formatError(value)
                        }
                    }
                    var base = "",
                        array = false,
                        braces = ["{", "}"];
                    if (isArray(value)) {
                        array = true;
                        braces = ["[", "]"]
                    }
                    if (isFunction(value)) {
                        var n = value.name ? ": " + value.name : "";
                        base = " [Function" + n + "]"
                    }
                    if (isRegExp(value)) {
                        base = " " + RegExp.prototype.toString.call(value)
                    }
                    if (isDate(value)) {
                        base = " " + Date.prototype.toUTCString.call(value)
                    }
                    if (isError(value)) {
                        base = " " + formatError(value)
                    }
                    if (keys.length === 0 && (!array || value.length == 0)) {
                        return braces[0] + base + braces[1]
                    }
                    if (recurseTimes < 0) {
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp")
                        } else {
                            return ctx.stylize("[Object]", "special")
                        }
                    }
                    ctx.seen.push(value);
                    var output;
                    if (array) {
                        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys)
                    } else {
                        output = keys.map(function (key) {
                            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array)
                        })
                    }
                    ctx.seen.pop();
                    return reduceToSingleString(output, base, braces)
                }
                function formatPrimitive(ctx, value) {
                    if (isUndefined(value)) return ctx.stylize("undefined", "undefined");
                    if (isString(value)) {
                        var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return ctx.stylize(simple, "string")
                    }
                    if (isNumber(value)) return ctx.stylize("" + value, "number");
                    if (isBoolean(value)) return ctx.stylize("" + value, "boolean");
                    if (isNull(value)) return ctx.stylize("null", "null")
                }
                function formatError(value) {
                    return "[" + Error.prototype.toString.call(value) + "]"
                }
                function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                    var output = [];
                    for (var i = 0, l = value.length; i < l; ++i) {
                        if (hasOwnProperty(value, String(i))) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true))
                        } else {
                            output.push("")
                        }
                    }
                    keys.forEach(function (key) {
                        if (!key.match(/^\d+$/)) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true))
                        }
                    });
                    return output
                }
                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc;
                    desc = Object.getOwnPropertyDescriptor(value, key) || {
                        value: value[key]
                    };
                    if (desc.get) {
                        if (desc.set) {
                            str = ctx.stylize("[Getter/Setter]", "special")
                        } else {
                            str = ctx.stylize("[Getter]", "special")
                        }
                    } else {
                        if (desc.set) {
                            str = ctx.stylize("[Setter]", "special")
                        }
                    }
                    if (!hasOwnProperty(visibleKeys, key)) {
                        name = "[" + key + "]"
                    }
                    if (!str) {
                        if (ctx.seen.indexOf(desc.value) < 0) {
                            if (isNull(recurseTimes)) {
                                str = formatValue(ctx, desc.value, null)
                            } else {
                                str = formatValue(ctx, desc.value, recurseTimes - 1)
                            }
                            if (str.indexOf("\n") > -1) {
                                if (array) {
                                    str = str.split("\n").map(function (line) {
                                        return "  " + line
                                    }).join("\n").substr(2)
                                } else {
                                    str = "\n" + str.split("\n").map(function (line) {
                                        return "   " + line
                                    }).join("\n")
                                }
                            }
                        } else {
                            str = ctx.stylize("[Circular]", "special")
                        }
                    }
                    if (isUndefined(name)) {
                        if (array && key.match(/^\d+$/)) {
                            return str
                        }
                        name = JSON.stringify("" + key);
                        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                            name = name.substr(1, name.length - 2);
                            name = ctx.stylize(name, "name")
                        } else {
                            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
                            name = ctx.stylize(name, "string")
                        }
                    }
                    return name + ": " + str
                }
                function reduceToSingleString(output, base, braces) {
                    var numLinesEst = 0;
                    var length = output.reduce(function (prev, cur) {
                        numLinesEst++;
                        if (cur.indexOf("\n") >= 0) numLinesEst++;
                        return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }, 0);
                    if (length > 60) {
                        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1]
                    }
                    return braces[0] + base + " " + output.join(", ") + " " + braces[1]
                }
                function isArray(ar) {
                    return Array.isArray(ar)
                }
                exports.isArray = isArray;
                function isBoolean(arg) {
                    return typeof arg === "boolean"
                }
                exports.isBoolean = isBoolean;
                function isNull(arg) {
                    return arg === null
                }
                exports.isNull = isNull;
                function isNullOrUndefined(arg) {
                    return arg == null
                }
                exports.isNullOrUndefined = isNullOrUndefined;
                function isNumber(arg) {
                    return typeof arg === "number"
                }
                exports.isNumber = isNumber;
                function isString(arg) {
                    return typeof arg === "string"
                }
                exports.isString = isString;
                function isSymbol(arg) {
                    return typeof arg === "symbol"
                }
                exports.isSymbol = isSymbol;
                function isUndefined(arg) {
                    return arg === void 0
                }
                exports.isUndefined = isUndefined;
                function isRegExp(re) {
                    return isObject(re) && objectToString(re) === "[object RegExp]"
                }
                exports.isRegExp = isRegExp;
                function isObject(arg) {
                    return typeof arg === "object" && arg !== null
                }
                exports.isObject = isObject;
                function isDate(d) {
                    return isObject(d) && objectToString(d) === "[object Date]"
                }
                exports.isDate = isDate;
                function isError(e) {
                    return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error)
                }
                exports.isError = isError;
                function isFunction(arg) {
                    return typeof arg === "function"
                }
                exports.isFunction = isFunction;
                function isPrimitive(arg) {
                    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined"
                }
                exports.isPrimitive = isPrimitive;
                exports.isBuffer = require("./support/isBuffer");
                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }
                function pad(n) {
                    return n < 10 ? "0" + n.toString(10) : n.toString(10)
                }
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                function timestamp() {
                    var d = new Date;
                    var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
                    return [d.getDate(), months[d.getMonth()], time].join(" ")
                }
                exports.log = function () {
                    console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments))
                };
                exports.inherits = require("inherits");
                exports._extend = function (origin, add) {
                    if (!add || !isObject(add)) return origin;
                    var keys = Object.keys(add);
                    var i = keys.length;
                    while (i--) {
                        origin[keys[i]] = add[keys[i]]
                    }
                    return origin
                };
                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop)
                }
            }).call(this, require("_process"), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {
            "./support/isBuffer": 28,
            _process: 10,
            inherits: 8
        }],
        30: [function (require, module, exports) {
            function BigInteger(a, b, c) {
                if (!(this instanceof BigInteger)) return new BigInteger(a, b, c);
                if (a != null) {
                    if ("number" == typeof a) this.fromNumber(a, b, c);
                    else if (b == null && "string" != typeof a) this.fromString(a, 256);
                    else this.fromString(a, b)
                }
            }
            var proto = BigInteger.prototype;
            proto.__bigi = require("../package.json").version;
            BigInteger.isBigInteger = function (obj, check_ver) {
                return obj && obj.__bigi && (!check_ver || obj.__bigi === proto.__bigi)
            };
            var dbits;
            function am1(i, x, w, j, c, n) {
                while (--n >= 0) {
                    var v = x * this[i++] + w[j] + c;
                    c = Math.floor(v / 67108864);
                    w[j++] = v & 67108863
                }
                return c
            }
            function am2(i, x, w, j, c, n) {
                var xl = x & 32767,
                    xh = x >> 15;
                while (--n >= 0) {
                    var l = this[i] & 32767;
                    var h = this[i++] >> 15;
                    var m = xh * l + h * xl;
                    l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
                    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
                    w[j++] = l & 1073741823
                }
                return c
            }
            function am3(i, x, w, j, c, n) {
                var xl = x & 16383,
                    xh = x >> 14;
                while (--n >= 0) {
                    var l = this[i] & 16383;
                    var h = this[i++] >> 14;
                    var m = xh * l + h * xl;
                    l = xl * l + ((m & 16383) << 14) + w[j] + c;
                    c = (l >> 28) + (m >> 14) + xh * h;
                    w[j++] = l & 268435455
                }
                return c
            }
            BigInteger.prototype.am = am1;
            dbits = 26;
            BigInteger.prototype.DB = dbits;
            BigInteger.prototype.DM = (1 << dbits) - 1;
            var DV = BigInteger.prototype.DV = 1 << dbits;
            var BI_FP = 52;
            BigInteger.prototype.FV = Math.pow(2, BI_FP);
            BigInteger.prototype.F1 = BI_FP - dbits;
            BigInteger.prototype.F2 = 2 * dbits - BI_FP;
            var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
            var BI_RC = new Array;
            var rr, vv;
            rr = "0".charCodeAt(0);
            for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
            rr = "a".charCodeAt(0);
            for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
            rr = "A".charCodeAt(0);
            for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
            function int2char(n) {
                return BI_RM.charAt(n)
            }
            function intAt(s, i) {
                var c = BI_RC[s.charCodeAt(i)];
                return c == null ? -1 : c
            }
            function bnpCopyTo(r) {
                for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
                r.t = this.t;
                r.s = this.s
            }
            function bnpFromInt(x) {
                this.t = 1;
                this.s = x < 0 ? -1 : 0;
                if (x > 0) this[0] = x;
                else if (x < -1) this[0] = x + DV;
                else this.t = 0
            }
            function nbv(i) {
                var r = new BigInteger;
                r.fromInt(i);
                return r
            }
            function bnpFromString(s, b) {
                var self = this;
                var k;
                if (b == 16) k = 4;
                else if (b == 8) k = 3;
                else if (b == 256) k = 8;
                else if (b == 2) k = 1;
                else if (b == 32) k = 5;
                else if (b == 4) k = 2;
                else {
                    self.fromRadix(s, b);
                    return
                }
                self.t = 0;
                self.s = 0;
                var i = s.length,
                    mi = false,
                    sh = 0;
                while (--i >= 0) {
                    var x = k == 8 ? s[i] & 255 : intAt(s, i);
                    if (x < 0) {
                        if (s.charAt(i) == "-") mi = true;
                        continue
                    }
                    mi = false;
                    if (sh == 0) self[self.t++] = x;
                    else if (sh + k > self.DB) {
                        self[self.t - 1] |= (x & (1 << self.DB - sh) - 1) << sh;
                        self[self.t++] = x >> self.DB - sh
                    } else self[self.t - 1] |= x << sh;
                    sh += k;
                    if (sh >= self.DB) sh -= self.DB
                }
                if (k == 8 && (s[0] & 128) != 0) {
                    self.s = -1;
                    if (sh > 0) self[self.t - 1] |= (1 << self.DB - sh) - 1 << sh
                }
                self.clamp();
                if (mi) BigInteger.ZERO.subTo(self, self)
            }
            function bnpClamp() {
                var c = this.s & this.DM;
                while (this.t > 0 && this[this.t - 1] == c) --this.t
            }
            function bnToString(b) {
                var self = this;
                if (self.s < 0) return "-" + self.negate().toString(b);
                var k;
                if (b == 16) k = 4;
                else if (b == 8) k = 3;
                else if (b == 2) k = 1;
                else if (b == 32) k = 5;
                else if (b == 4) k = 2;
                else return self.toRadix(b);
                var km = (1 << k) - 1,
                    d, m = false,
                    r = "",
                    i = self.t;
                var p = self.DB - i * self.DB % k;
                if (i-- > 0) {
                    if (p < self.DB && (d = self[i] >> p) > 0) {
                        m = true;
                        r = int2char(d)
                    }
                    while (i >= 0) {
                        if (p < k) {
                            d = (self[i] & (1 << p) - 1) << k - p;
                            d |= self[--i] >> (p += self.DB - k)
                        } else {
                            d = self[i] >> (p -= k) & km;
                            if (p <= 0) {
                                p += self.DB;
                                --i
                            }
                        }
                        if (d > 0) m = true;
                        if (m) r += int2char(d)
                    }
                }
                return m ? r : "0"
            }
            function bnNegate() {
                var r = new BigInteger;
                BigInteger.ZERO.subTo(this, r);
                return r
            }
            function bnAbs() {
                return this.s < 0 ? this.negate() : this
            }
            function bnCompareTo(a) {
                var r = this.s - a.s;
                if (r != 0) return r;
                var i = this.t;
                r = i - a.t;
                if (r != 0) return this.s < 0 ? -r : r;
                while (--i >= 0)
                    if ((r = this[i] - a[i]) != 0) return r;
                return 0
            }
            function nbits(x) {
                var r = 1,
                    t;
                if ((t = x >>> 16) != 0) {
                    x = t;
                    r += 16
                }
                if ((t = x >> 8) != 0) {
                    x = t;
                    r += 8
                }
                if ((t = x >> 4) != 0) {
                    x = t;
                    r += 4
                }
                if ((t = x >> 2) != 0) {
                    x = t;
                    r += 2
                }
                if ((t = x >> 1) != 0) {
                    x = t;
                    r += 1
                }
                return r
            }
            function bnBitLength() {
                if (this.t <= 0) return 0;
                return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
            }
            function bnByteLength() {
                return this.bitLength() >> 3
            }
            function bnpDLShiftTo(n, r) {
                var i;
                for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
                for (i = n - 1; i >= 0; --i) r[i] = 0;
                r.t = this.t + n;
                r.s = this.s
            }
            function bnpDRShiftTo(n, r) {
                for (var i = n; i < this.t; ++i) r[i - n] = this[i];
                r.t = Math.max(this.t - n, 0);
                r.s = this.s
            }
            function bnpLShiftTo(n, r) {
                var self = this;
                var bs = n % self.DB;
                var cbs = self.DB - bs;
                var bm = (1 << cbs) - 1;
                var ds = Math.floor(n / self.DB),
                    c = self.s << bs & self.DM,
                    i;
                for (i = self.t - 1; i >= 0; --i) {
                    r[i + ds + 1] = self[i] >> cbs | c;
                    c = (self[i] & bm) << bs
                }
                for (i = ds - 1; i >= 0; --i) r[i] = 0;
                r[ds] = c;
                r.t = self.t + ds + 1;
                r.s = self.s;
                r.clamp()
            }
            function bnpRShiftTo(n, r) {
                var self = this;
                r.s = self.s;
                var ds = Math.floor(n / self.DB);
                if (ds >= self.t) {
                    r.t = 0;
                    return
                }
                var bs = n % self.DB;
                var cbs = self.DB - bs;
                var bm = (1 << bs) - 1;
                r[0] = self[ds] >> bs;
                for (var i = ds + 1; i < self.t; ++i) {
                    r[i - ds - 1] |= (self[i] & bm) << cbs;
                    r[i - ds] = self[i] >> bs
                }
                if (bs > 0) r[self.t - ds - 1] |= (self.s & bm) << cbs;
                r.t = self.t - ds;
                r.clamp()
            }
            function bnpSubTo(a, r) {
                var self = this;
                var i = 0,
                    c = 0,
                    m = Math.min(a.t, self.t);
                while (i < m) {
                    c += self[i] - a[i];
                    r[i++] = c & self.DM;
                    c >>= self.DB
                }
                if (a.t < self.t) {
                    c -= a.s;
                    while (i < self.t) {
                        c += self[i];
                        r[i++] = c & self.DM;
                        c >>= self.DB
                    }
                    c += self.s
                } else {
                    c += self.s;
                    while (i < a.t) {
                        c -= a[i];
                        r[i++] = c & self.DM;
                        c >>= self.DB
                    }
                    c -= a.s
                }
                r.s = c < 0 ? -1 : 0;
                if (c < -1) r[i++] = self.DV + c;
                else if (c > 0) r[i++] = c;
                r.t = i;
                r.clamp()
            }
            function bnpMultiplyTo(a, r) {
                var x = this.abs(),
                    y = a.abs();
                var i = x.t;
                r.t = i + y.t;
                while (--i >= 0) r[i] = 0;
                for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
                r.s = 0;
                r.clamp();
                if (this.s != a.s) BigInteger.ZERO.subTo(r, r)
            }
            function bnpSquareTo(r) {
                var x = this.abs();
                var i = r.t = 2 * x.t;
                while (--i >= 0) r[i] = 0;
                for (i = 0; i < x.t - 1; ++i) {
                    var c = x.am(i, x[i], r, 2 * i, 0, 1);
                    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                        r[i + x.t] -= x.DV;
                        r[i + x.t + 1] = 1
                    }
                }
                if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
                r.s = 0;
                r.clamp()
            }
            function bnpDivRemTo(m, q, r) {
                var self = this;
                var pm = m.abs();
                if (pm.t <= 0) return;
                var pt = self.abs();
                if (pt.t < pm.t) {
                    if (q != null) q.fromInt(0);
                    if (r != null) self.copyTo(r);
                    return
                }
                if (r == null) r = new BigInteger;
                var y = new BigInteger,
                    ts = self.s,
                    ms = m.s;
                var nsh = self.DB - nbits(pm[pm.t - 1]);
                if (nsh > 0) {
                    pm.lShiftTo(nsh, y);
                    pt.lShiftTo(nsh, r)
                } else {
                    pm.copyTo(y);
                    pt.copyTo(r)
                }
                var ys = y.t;
                var y0 = y[ys - 1];
                if (y0 == 0) return;
                var yt = y0 * (1 << self.F1) + (ys > 1 ? y[ys - 2] >> self.F2 : 0);
                var d1 = self.FV / yt,
                    d2 = (1 << self.F1) / yt,
                    e = 1 << self.F2;
                var i = r.t,
                    j = i - ys,
                    t = q == null ? new BigInteger : q;
                y.dlShiftTo(j, t);
                if (r.compareTo(t) >= 0) {
                    r[r.t++] = 1;
                    r.subTo(t, r)
                }
                BigInteger.ONE.dlShiftTo(ys, t);
                t.subTo(y, y);
                while (y.t < ys) y[y.t++] = 0;
                while (--j >= 0) {
                    var qd = r[--i] == y0 ? self.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
                    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                        y.dlShiftTo(j, t);
                        r.subTo(t, r);
                        while (r[i] < --qd) r.subTo(t, r)
                    }
                }
                if (q != null) {
                    r.drShiftTo(ys, q);
                    if (ts != ms) BigInteger.ZERO.subTo(q, q)
                }
                r.t = ys;
                r.clamp();
                if (nsh > 0) r.rShiftTo(nsh, r);
                if (ts < 0) BigInteger.ZERO.subTo(r, r)
            }
            function bnMod(a) {
                var r = new BigInteger;
                this.abs().divRemTo(a, null, r);
                if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
                return r
            }
            function Classic(m) {
                this.m = m
            }
            function cConvert(x) {
                if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
                else return x
            }
            function cRevert(x) {
                return x
            }
            function cReduce(x) {
                x.divRemTo(this.m, null, x)
            }
            function cMulTo(x, y, r) {
                x.multiplyTo(y, r);
                this.reduce(r)
            }
            function cSqrTo(x, r) {
                x.squareTo(r);
                this.reduce(r)
            }
            Classic.prototype.convert = cConvert;
            Classic.prototype.revert = cRevert;
            Classic.prototype.reduce = cReduce;
            Classic.prototype.mulTo = cMulTo;
            Classic.prototype.sqrTo = cSqrTo;
            function bnpInvDigit() {
                if (this.t < 1) return 0;
                var x = this[0];
                if ((x & 1) == 0) return 0;
                var y = x & 3;
                y = y * (2 - (x & 15) * y) & 15;
                y = y * (2 - (x & 255) * y) & 255;
                y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
                y = y * (2 - x * y % this.DV) % this.DV;
                return y > 0 ? this.DV - y : -y
            }
            function Montgomery(m) {
                this.m = m;
                this.mp = m.invDigit();
                this.mpl = this.mp & 32767;
                this.mph = this.mp >> 15;
                this.um = (1 << m.DB - 15) - 1;
                this.mt2 = 2 * m.t
            }
            function montConvert(x) {
                var r = new BigInteger;
                x.abs().dlShiftTo(this.m.t, r);
                r.divRemTo(this.m, null, r);
                if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
                return r
            }
            function montRevert(x) {
                var r = new BigInteger;
                x.copyTo(r);
                this.reduce(r);
                return r
            }
            function montReduce(x) {
                while (x.t <= this.mt2) x[x.t++] = 0;
                for (var i = 0; i < this.m.t; ++i) {
                    var j = x[i] & 32767;
                    var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
                    j = i + this.m.t;
                    x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
                    while (x[j] >= x.DV) {
                        x[j] -= x.DV;
                        x[++j]++
                    }
                }
                x.clamp();
                x.drShiftTo(this.m.t, x);
                if (x.compareTo(this.m) >= 0) x.subTo(this.m, x)
            }
            function montSqrTo(x, r) {
                x.squareTo(r);
                this.reduce(r)
            }
            function montMulTo(x, y, r) {
                x.multiplyTo(y, r);
                this.reduce(r)
            }
            Montgomery.prototype.convert = montConvert;
            Montgomery.prototype.revert = montRevert;
            Montgomery.prototype.reduce = montReduce;
            Montgomery.prototype.mulTo = montMulTo;
            Montgomery.prototype.sqrTo = montSqrTo;
            function bnpIsEven() {
                return (this.t > 0 ? this[0] & 1 : this.s) == 0
            }
            function bnpExp(e, z) {
                if (e > 4294967295 || e < 1) return BigInteger.ONE;
                var r = new BigInteger,
                    r2 = new BigInteger,
                    g = z.convert(this),
                    i = nbits(e) - 1;
                g.copyTo(r);
                while (--i >= 0) {
                    z.sqrTo(r, r2);
                    if ((e & 1 << i) > 0) z.mulTo(r2, g, r);
                    else {
                        var t = r;
                        r = r2;
                        r2 = t
                    }
                }
                return z.revert(r)
            }
            function bnModPowInt(e, m) {
                var z;
                if (e < 256 || m.isEven()) z = new Classic(m);
                else z = new Montgomery(m);
                return this.exp(e, z)
            }
            proto.copyTo = bnpCopyTo;
            proto.fromInt = bnpFromInt;
            proto.fromString = bnpFromString;
            proto.clamp = bnpClamp;
            proto.dlShiftTo = bnpDLShiftTo;
            proto.drShiftTo = bnpDRShiftTo;
            proto.lShiftTo = bnpLShiftTo;
            proto.rShiftTo = bnpRShiftTo;
            proto.subTo = bnpSubTo;
            proto.multiplyTo = bnpMultiplyTo;
            proto.squareTo = bnpSquareTo;
            proto.divRemTo = bnpDivRemTo;
            proto.invDigit = bnpInvDigit;
            proto.isEven = bnpIsEven;
            proto.exp = bnpExp;
            proto.toString = bnToString;
            proto.negate = bnNegate;
            proto.abs = bnAbs;
            proto.compareTo = bnCompareTo;
            proto.bitLength = bnBitLength;
            proto.byteLength = bnByteLength;
            proto.mod = bnMod;
            proto.modPowInt = bnModPowInt;
            function bnClone() {
                var r = new BigInteger;
                this.copyTo(r);
                return r
            }
            function bnIntValue() {
                if (this.s < 0) {
                    if (this.t == 1) return this[0] - this.DV;
                    else if (this.t == 0) return -1
                } else if (this.t == 1) return this[0];
                else if (this.t == 0) return 0;
                return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
            }
            function bnByteValue() {
                return this.t == 0 ? this.s : this[0] << 24 >> 24
            }
            function bnShortValue() {
                return this.t == 0 ? this.s : this[0] << 16 >> 16
            }
            function bnpChunkSize(r) {
                return Math.floor(Math.LN2 * this.DB / Math.log(r))
            }
            function bnSigNum() {
                if (this.s < 0) return -1;
                else if (this.t <= 0 || this.t == 1 && this[0] <= 0) return 0;
                else return 1
            }
            function bnpToRadix(b) {
                if (b == null) b = 10;
                if (this.signum() == 0 || b < 2 || b > 36) return "0";
                var cs = this.chunkSize(b);
                var a = Math.pow(b, cs);
                var d = nbv(a),
                    y = new BigInteger,
                    z = new BigInteger,
                    r = "";
                this.divRemTo(d, y, z);
                while (y.signum() > 0) {
                    r = (a + z.intValue()).toString(b).substr(1) + r;
                    y.divRemTo(d, y, z)
                }
                return z.intValue().toString(b) + r
            }
            function bnpFromRadix(s, b) {
                var self = this;
                self.fromInt(0);
                if (b == null) b = 10;
                var cs = self.chunkSize(b);
                var d = Math.pow(b, cs),
                    mi = false,
                    j = 0,
                    w = 0;
                for (var i = 0; i < s.length; ++i) {
                    var x = intAt(s, i);
                    if (x < 0) {
                        if (s.charAt(i) == "-" && self.signum() == 0) mi = true;
                        continue
                    }
                    w = b * w + x;
                    if (++j >= cs) {
                        self.dMultiply(d);
                        self.dAddOffset(w, 0);
                        j = 0;
                        w = 0
                    }
                }
                if (j > 0) {
                    self.dMultiply(Math.pow(b, j));
                    self.dAddOffset(w, 0)
                }
                if (mi) BigInteger.ZERO.subTo(self, self)
            }
            function bnpFromNumber(a, b, c) {
                var self = this;
                if ("number" == typeof b) {
                    if (a < 2) self.fromInt(1);
                    else {
                        self.fromNumber(a, c);
                        if (!self.testBit(a - 1)) self.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, self);
                        if (self.isEven()) self.dAddOffset(1, 0);
                        while (!self.isProbablePrime(b)) {
                            self.dAddOffset(2, 0);
                            if (self.bitLength() > a) self.subTo(BigInteger.ONE.shiftLeft(a - 1), self)
                        }
                    }
                } else {
                    var x = new Array,
                        t = a & 7;
                    x.length = (a >> 3) + 1;
                    b.nextBytes(x);
                    if (t > 0) x[0] &= (1 << t) - 1;
                    else x[0] = 0;
                    self.fromString(x, 256)
                }
            }
            function bnToByteArray() {
                var self = this;
                var i = self.t,
                    r = new Array;
                r[0] = self.s;
                var p = self.DB - i * self.DB % 8,
                    d, k = 0;
                if (i-- > 0) {
                    if (p < self.DB && (d = self[i] >> p) != (self.s & self.DM) >> p) r[k++] = d | self.s << self.DB - p;
                    while (i >= 0) {
                        if (p < 8) {
                            d = (self[i] & (1 << p) - 1) << 8 - p;
                            d |= self[--i] >> (p += self.DB - 8)
                        } else {
                            d = self[i] >> (p -= 8) & 255;
                            if (p <= 0) {
                                p += self.DB;
                                --i
                            }
                        }
                        if ((d & 128) != 0) d |= -256;
                        if (k === 0 && (self.s & 128) != (d & 128)) ++k;
                        if (k > 0 || d != self.s) r[k++] = d
                    }
                }
                return r
            }
            function bnEquals(a) {
                return this.compareTo(a) == 0
            }
            function bnMin(a) {
                return this.compareTo(a) < 0 ? this : a
            }
            function bnMax(a) {
                return this.compareTo(a) > 0 ? this : a
            }
            function bnpBitwiseTo(a, op, r) {
                var self = this;
                var i, f, m = Math.min(a.t, self.t);
                for (i = 0; i < m; ++i) r[i] = op(self[i], a[i]);
                if (a.t < self.t) {
                    f = a.s & self.DM;
                    for (i = m; i < self.t; ++i) r[i] = op(self[i], f);
                    r.t = self.t
                } else {
                    f = self.s & self.DM;
                    for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
                    r.t = a.t
                }
                r.s = op(self.s, a.s);
                r.clamp()
            }
            function op_and(x, y) {
                return x & y
            }
            function bnAnd(a) {
                var r = new BigInteger;
                this.bitwiseTo(a, op_and, r);
                return r
            }
            function op_or(x, y) {
                return x | y
            }
            function bnOr(a) {
                var r = new BigInteger;
                this.bitwiseTo(a, op_or, r);
                return r
            }
            function op_xor(x, y) {
                return x ^ y
            }
            function bnXor(a) {
                var r = new BigInteger;
                this.bitwiseTo(a, op_xor, r);
                return r
            }
            function op_andnot(x, y) {
                return x & ~y
            }
            function bnAndNot(a) {
                var r = new BigInteger;
                this.bitwiseTo(a, op_andnot, r);
                return r
            }
            function bnNot() {
                var r = new BigInteger;
                for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
                r.t = this.t;
                r.s = ~this.s;
                return r
            }
            function bnShiftLeft(n) {
                var r = new BigInteger;
                if (n < 0) this.rShiftTo(-n, r);
                else this.lShiftTo(n, r);
                return r
            }
            function bnShiftRight(n) {
                var r = new BigInteger;
                if (n < 0) this.lShiftTo(-n, r);
                else this.rShiftTo(n, r);
                return r
            }
            function lbit(x) {
                if (x == 0) return -1;
                var r = 0;
                if ((x & 65535) == 0) {
                    x >>= 16;
                    r += 16
                }
                if ((x & 255) == 0) {
                    x >>= 8;
                    r += 8
                }
                if ((x & 15) == 0) {
                    x >>= 4;
                    r += 4
                }
                if ((x & 3) == 0) {
                    x >>= 2;
                    r += 2
                }
                if ((x & 1) == 0) ++r;
                return r
            }
            function bnGetLowestSetBit() {
                for (var i = 0; i < this.t; ++i)
                    if (this[i] != 0) return i * this.DB + lbit(this[i]);
                if (this.s < 0) return this.t * this.DB;
                return -1
            }
            function cbit(x) {
                var r = 0;
                while (x != 0) {
                    x &= x - 1;
                    ++r
                }
                return r
            }
            function bnBitCount() {
                var r = 0,
                    x = this.s & this.DM;
                for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
                return r
            }
            function bnTestBit(n) {
                var j = Math.floor(n / this.DB);
                if (j >= this.t) return this.s != 0;
                return (this[j] & 1 << n % this.DB) != 0
            }
            function bnpChangeBit(n, op) {
                var r = BigInteger.ONE.shiftLeft(n);
                this.bitwiseTo(r, op, r);
                return r
            }
            function bnSetBit(n) {
                return this.changeBit(n, op_or)
            }
            function bnClearBit(n) {
                return this.changeBit(n, op_andnot)
            }
            function bnFlipBit(n) {
                return this.changeBit(n, op_xor)
            }
            function bnpAddTo(a, r) {
                var self = this;
                var i = 0,
                    c = 0,
                    m = Math.min(a.t, self.t);
                while (i < m) {
                    c += self[i] + a[i];
                    r[i++] = c & self.DM;
                    c >>= self.DB
                }
                if (a.t < self.t) {
                    c += a.s;
                    while (i < self.t) {
                        c += self[i];
                        r[i++] = c & self.DM;
                        c >>= self.DB
                    }
                    c += self.s
                } else {
                    c += self.s;
                    while (i < a.t) {
                        c += a[i];
                        r[i++] = c & self.DM;
                        c >>= self.DB
                    }
                    c += a.s
                }
                r.s = c < 0 ? -1 : 0;
                if (c > 0) r[i++] = c;
                else if (c < -1) r[i++] = self.DV + c;
                r.t = i;
                r.clamp()
            }
            function bnAdd(a) {
                var r = new BigInteger;
                this.addTo(a, r);
                return r
            }
            function bnSubtract(a) {
                var r = new BigInteger;
                this.subTo(a, r);
                return r
            }
            function bnMultiply(a) {
                var r = new BigInteger;
                this.multiplyTo(a, r);
                return r
            }
            function bnSquare() {
                var r = new BigInteger;
                this.squareTo(r);
                return r
            }
            function bnDivide(a) {
                var r = new BigInteger;
                this.divRemTo(a, r, null);
                return r
            }
            function bnRemainder(a) {
                var r = new BigInteger;
                this.divRemTo(a, null, r);
                return r
            }
            function bnDivideAndRemainder(a) {
                var q = new BigInteger,
                    r = new BigInteger;
                this.divRemTo(a, q, r);
                return new Array(q, r)
            }
            function bnpDMultiply(n) {
                this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
                ++this.t;
                this.clamp()
            }
            function bnpDAddOffset(n, w) {
                if (n == 0) return;
                while (this.t <= w) this[this.t++] = 0;
                this[w] += n;
                while (this[w] >= this.DV) {
                    this[w] -= this.DV;
                    if (++w >= this.t) this[this.t++] = 0;
                    ++this[w]
                }
            }
            function NullExp() {}
            function nNop(x) {
                return x
            }
            function nMulTo(x, y, r) {
                x.multiplyTo(y, r)
            }
            function nSqrTo(x, r) {
                x.squareTo(r)
            }
            NullExp.prototype.convert = nNop;
            NullExp.prototype.revert = nNop;
            NullExp.prototype.mulTo = nMulTo;
            NullExp.prototype.sqrTo = nSqrTo;
            function bnPow(e) {
                return this.exp(e, new NullExp)
            }
            function bnpMultiplyLowerTo(a, n, r) {
                var i = Math.min(this.t + a.t, n);
                r.s = 0;
                r.t = i;
                while (i > 0) r[--i] = 0;
                var j;
                for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
                for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
                r.clamp()
            }
            function bnpMultiplyUpperTo(a, n, r) {
                --n;
                var i = r.t = this.t + a.t - n;
                r.s = 0;
                while (--i >= 0) r[i] = 0;
                for (i = Math.max(n - this.t, 0); i < a.t; ++i) r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
                r.clamp();
                r.drShiftTo(1, r)
            }
            function Barrett(m) {
                this.r2 = new BigInteger;
                this.q3 = new BigInteger;
                BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
                this.mu = this.r2.divide(m);
                this.m = m
            }
            function barrettConvert(x) {
                if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
                else if (x.compareTo(this.m) < 0) return x;
                else {
                    var r = new BigInteger;
                    x.copyTo(r);
                    this.reduce(r);
                    return r
                }
            }
            function barrettRevert(x) {
                return x
            }
            function barrettReduce(x) {
                var self = this;
                x.drShiftTo(self.m.t - 1, self.r2);
                if (x.t > self.m.t + 1) {
                    x.t = self.m.t + 1;
                    x.clamp()
                }
                self.mu.multiplyUpperTo(self.r2, self.m.t + 1, self.q3);
                self.m.multiplyLowerTo(self.q3, self.m.t + 1, self.r2);
                while (x.compareTo(self.r2) < 0) x.dAddOffset(1, self.m.t + 1);
                x.subTo(self.r2, x);
                while (x.compareTo(self.m) >= 0) x.subTo(self.m, x)
            }
            function barrettSqrTo(x, r) {
                x.squareTo(r);
                this.reduce(r)
            }
            function barrettMulTo(x, y, r) {
                x.multiplyTo(y, r);
                this.reduce(r)
            }
            Barrett.prototype.convert = barrettConvert;
            Barrett.prototype.revert = barrettRevert;
            Barrett.prototype.reduce = barrettReduce;
            Barrett.prototype.mulTo = barrettMulTo;
            Barrett.prototype.sqrTo = barrettSqrTo;
            function bnModPow(e, m) {
                var i = e.bitLength(),
                    k, r = nbv(1),
                    z;
                if (i <= 0) return r;
                else if (i < 18) k = 1;
                else if (i < 48) k = 3;
                else if (i < 144) k = 4;
                else if (i < 768) k = 5;
                else k = 6;
                if (i < 8) z = new Classic(m);
                else if (m.isEven()) z = new Barrett(m);
                else z = new Montgomery(m);
                var g = new Array,
                    n = 3,
                    k1 = k - 1,
                    km = (1 << k) - 1;
                g[1] = z.convert(this);
                if (k > 1) {
                    var g2 = new BigInteger;
                    z.sqrTo(g[1], g2);
                    while (n <= km) {
                        g[n] = new BigInteger;
                        z.mulTo(g2, g[n - 2], g[n]);
                        n += 2
                    }
                }
                var j = e.t - 1,
                    w, is1 = true,
                    r2 = new BigInteger,
                    t;
                i = nbits(e[j]) - 1;
                while (j >= 0) {
                    if (i >= k1) w = e[j] >> i - k1 & km;
                    else {
                        w = (e[j] & (1 << i + 1) - 1) << k1 - i;
                        if (j > 0) w |= e[j - 1] >> this.DB + i - k1
                    }
                    n = k;
                    while ((w & 1) == 0) {
                        w >>= 1;
                        --n
                    }
                    if ((i -= n) < 0) {
                        i += this.DB;
                        --j
                    }
                    if (is1) {
                        g[w].copyTo(r);
                        is1 = false
                    } else {
                        while (n > 1) {
                            z.sqrTo(r, r2);
                            z.sqrTo(r2, r);
                            n -= 2
                        }
                        if (n > 0) z.sqrTo(r, r2);
                        else {
                            t = r;
                            r = r2;
                            r2 = t
                        }
                        z.mulTo(r2, g[w], r)
                    }
                    while (j >= 0 && (e[j] & 1 << i) == 0) {
                        z.sqrTo(r, r2);
                        t = r;
                        r = r2;
                        r2 = t;
                        if (--i < 0) {
                            i = this.DB - 1;
                            --j
                        }
                    }
                }
                return z.revert(r)
            }
            function bnGCD(a) {
                var x = this.s < 0 ? this.negate() : this.clone();
                var y = a.s < 0 ? a.negate() : a.clone();
                if (x.compareTo(y) < 0) {
                    var t = x;
                    x = y;
                    y = t
                }
                var i = x.getLowestSetBit(),
                    g = y.getLowestSetBit();
                if (g < 0) return x;
                if (i < g) g = i;
                if (g > 0) {
                    x.rShiftTo(g, x);
                    y.rShiftTo(g, y)
                }
                while (x.signum() > 0) {
                    if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
                    if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
                    if (x.compareTo(y) >= 0) {
                        x.subTo(y, x);
                        x.rShiftTo(1, x)
                    } else {
                        y.subTo(x, y);
                        y.rShiftTo(1, y)
                    }
                }
                if (g > 0) y.lShiftTo(g, y);
                return y
            }
            function bnpModInt(n) {
                if (n <= 0) return 0;
                var d = this.DV % n,
                    r = this.s < 0 ? n - 1 : 0;
                if (this.t > 0)
                    if (d == 0) r = this[0] % n;
                    else
                        for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
                return r
            }
            function bnModInverse(m) {
                var ac = m.isEven();
                if (this.signum() === 0) throw new Error("division by zero");
                if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
                var u = m.clone(),
                    v = this.clone();
                var a = nbv(1),
                    b = nbv(0),
                    c = nbv(0),
                    d = nbv(1);
                while (u.signum() != 0) {
                    while (u.isEven()) {
                        u.rShiftTo(1, u);
                        if (ac) {
                            if (!a.isEven() || !b.isEven()) {
                                a.addTo(this, a);
                                b.subTo(m, b)
                            }
                            a.rShiftTo(1, a)
                        } else if (!b.isEven()) b.subTo(m, b);
                        b.rShiftTo(1, b)
                    }
                    while (v.isEven()) {
                        v.rShiftTo(1, v);
                        if (ac) {
                            if (!c.isEven() || !d.isEven()) {
                                c.addTo(this, c);
                                d.subTo(m, d)
                            }
                            c.rShiftTo(1, c)
                        } else if (!d.isEven()) d.subTo(m, d);
                        d.rShiftTo(1, d)
                    }
                    if (u.compareTo(v) >= 0) {
                        u.subTo(v, u);
                        if (ac) a.subTo(c, a);
                        b.subTo(d, b)
                    } else {
                        v.subTo(u, v);
                        if (ac) c.subTo(a, c);
                        d.subTo(b, d)
                    }
                }
                if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
                while (d.compareTo(m) >= 0) d.subTo(m, d);
                while (d.signum() < 0) d.addTo(m, d);
                return d
            }
            var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
            var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
            function bnIsProbablePrime(t) {
                var i, x = this.abs();
                if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
                    for (i = 0; i < lowprimes.length; ++i)
                        if (x[0] == lowprimes[i]) return true;
                    return false
                }
                if (x.isEven()) return false;
                i = 1;
                while (i < lowprimes.length) {
                    var m = lowprimes[i],
                        j = i + 1;
                    while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
                    m = x.modInt(m);
                    while (i < j)
                        if (m % lowprimes[i++] == 0) return false
                }
                return x.millerRabin(t)
            }
            function bnpMillerRabin(t) {
                var n1 = this.subtract(BigInteger.ONE);
                var k = n1.getLowestSetBit();
                if (k <= 0) return false;
                var r = n1.shiftRight(k);
                t = t + 1 >> 1;
                if (t > lowprimes.length) t = lowprimes.length;
                var a = new BigInteger(null);
                var j, bases = [];
                for (var i = 0; i < t; ++i) {
                    for (;;) {
                        j = lowprimes[Math.floor(Math.random() * lowprimes.length)];
                        if (bases.indexOf(j) == -1) break
                    }
                    bases.push(j);
                    a.fromInt(j);
                    var y = a.modPow(r, this);
                    if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                        var j = 1;
                        while (j++ < k && y.compareTo(n1) != 0) {
                            y = y.modPowInt(2, this);
                            if (y.compareTo(BigInteger.ONE) == 0) return false
                        }
                        if (y.compareTo(n1) != 0) return false
                    }
                }
                return true
            }
            proto.chunkSize = bnpChunkSize;
            proto.toRadix = bnpToRadix;
            proto.fromRadix = bnpFromRadix;
            proto.fromNumber = bnpFromNumber;
            proto.bitwiseTo = bnpBitwiseTo;
            proto.changeBit = bnpChangeBit;
            proto.addTo = bnpAddTo;
            proto.dMultiply = bnpDMultiply;
            proto.dAddOffset = bnpDAddOffset;
            proto.multiplyLowerTo = bnpMultiplyLowerTo;
            proto.multiplyUpperTo = bnpMultiplyUpperTo;
            proto.modInt = bnpModInt;
            proto.millerRabin = bnpMillerRabin;
            proto.clone = bnClone;
            proto.intValue = bnIntValue;
            proto.byteValue = bnByteValue;
            proto.shortValue = bnShortValue;
            proto.signum = bnSigNum;
            proto.toByteArray = bnToByteArray;
            proto.equals = bnEquals;
            proto.min = bnMin;
            proto.max = bnMax;
            proto.and = bnAnd;
            proto.or = bnOr;
            proto.xor = bnXor;
            proto.andNot = bnAndNot;
            proto.not = bnNot;
            proto.shiftLeft = bnShiftLeft;
            proto.shiftRight = bnShiftRight;
            proto.getLowestSetBit = bnGetLowestSetBit;
            proto.bitCount = bnBitCount;
            proto.testBit = bnTestBit;
            proto.setBit = bnSetBit;
            proto.clearBit = bnClearBit;
            proto.flipBit = bnFlipBit;
            proto.add = bnAdd;
            proto.subtract = bnSubtract;
            proto.multiply = bnMultiply;
            proto.divide = bnDivide;
            proto.remainder = bnRemainder;
            proto.divideAndRemainder = bnDivideAndRemainder;
            proto.modPow = bnModPow;
            proto.modInverse = bnModInverse;
            proto.pow = bnPow;
            proto.gcd = bnGCD;
            proto.isProbablePrime = bnIsProbablePrime;
            proto.square = bnSquare;
            BigInteger.ZERO = nbv(0);
            BigInteger.ONE = nbv(1);
            BigInteger.valueOf = nbv;
            module.exports = BigInteger
        }, {
            "../package.json": 33
        }],
        31: [function (require, module, exports) {
            (function (Buffer) {
                var assert = require("assert");
                var BigInteger = require("./bigi");
                BigInteger.fromByteArrayUnsigned = function (byteArray) {
                    if (byteArray[0] & 128) {
                        return new BigInteger([0].concat(byteArray))
                    }
                    return new BigInteger(byteArray)
                };
                BigInteger.prototype.toByteArrayUnsigned = function () {
                    var byteArray = this.toByteArray();
                    return byteArray[0] === 0 ? byteArray.slice(1) : byteArray
                };
                BigInteger.fromDERInteger = function (byteArray) {
                    return new BigInteger(byteArray)
                };
                BigInteger.prototype.toDERInteger = BigInteger.prototype.toByteArray;
                BigInteger.fromBuffer = function (buffer) {
                    if (buffer[0] & 128) {
                        var byteArray = Array.prototype.slice.call(buffer);
                        return new BigInteger([0].concat(byteArray))
                    }
                    return new BigInteger(buffer)
                };
                BigInteger.fromHex = function (hex) {
                    if (hex === "") return BigInteger.ZERO;
                    assert.equal(hex, hex.match(/^[A-Fa-f0-9]+/), "Invalid hex string");
                    assert.equal(hex.length % 2, 0, "Incomplete hex");
                    return new BigInteger(hex, 16)
                };
                BigInteger.prototype.toBuffer = function (size) {
                    var byteArray = this.toByteArrayUnsigned();
                    var zeros = [];
                    var padding = size - byteArray.length;
                    while (zeros.length < padding) zeros.push(0);
                    return new Buffer(zeros.concat(byteArray))
                };
                BigInteger.prototype.toHex = function (size) {
                    return this.toBuffer(size).toString("hex")
                }
            }).call(this, require("buffer").Buffer)
        }, {
            "./bigi": 30,
            assert: 1,
            buffer: 3
        }],
        32: [function (require, module, exports) {
            var BigInteger = require("./bigi");
            require("./convert");
            module.exports = BigInteger
        }, {
            "./bigi": 30,
            "./convert": 31
        }],
        33: [function (require, module, exports) {
            module.exports = {
                version: "1.4.2"
            }
        }, {}],
        34: [function (require, module, exports) {
            (function (Buffer) {
                function check(buffer) {
                    if (buffer.length < 8) return false;
                    if (buffer.length > 72) return false;
                    if (buffer[0] !== 48) return false;
                    if (buffer[1] !== buffer.length - 2) return false;
                    if (buffer[2] !== 2) return false;
                    var lenR = buffer[3];
                    if (lenR === 0) return false;
                    if (5 + lenR >= buffer.length) return false;
                    if (buffer[4 + lenR] !== 2) return false;
                    var lenS = buffer[5 + lenR];
                    if (lenS === 0) return false;
                    if (6 + lenR + lenS !== buffer.length) return false;
                    if (buffer[4] & 128) return false;
                    if (lenR > 1 && buffer[4] === 0 && !(buffer[5] & 128)) return false;
                    if (buffer[lenR + 6] & 128) return false;
                    if (lenS > 1 && buffer[lenR + 6] === 0 && !(buffer[lenR + 7] & 128)) return false;
                    return true
                }
                function decode(buffer) {
                    if (buffer.length < 8) throw new Error("DER sequence length is too short");
                    if (buffer.length > 72) throw new Error("DER sequence length is too long");
                    if (buffer[0] !== 48) throw new Error("Expected DER sequence");
                    if (buffer[1] !== buffer.length - 2) throw new Error("DER sequence length is invalid");
                    if (buffer[2] !== 2) throw new Error("Expected DER integer");
                    var lenR = buffer[3];
                    if (lenR === 0) throw new Error("R length is zero");
                    if (5 + lenR >= buffer.length) throw new Error("R length is too long");
                    if (buffer[4 + lenR] !== 2) throw new Error("Expected DER integer (2)");
                    var lenS = buffer[5 + lenR];
                    if (lenS === 0) throw new Error("S length is zero");
                    if (6 + lenR + lenS !== buffer.length) throw new Error("S length is invalid");
                    if (buffer[4] & 128) throw new Error("R value is negative");
                    if (lenR > 1 && buffer[4] === 0 && !(buffer[5] & 128)) throw new Error("R value excessively padded");
                    if (buffer[lenR + 6] & 128) throw new Error("S value is negative");
                    if (lenS > 1 && buffer[lenR + 6] === 0 && !(buffer[lenR + 7] & 128)) throw new Error("S value excessively padded");
                    return {
                        r: buffer.slice(4, 4 + lenR),
                        s: buffer.slice(6 + lenR)
                    }
                }
                function encode(r, s) {
                    var lenR = r.length;
                    var lenS = s.length;
                    if (lenR === 0) throw new Error("R length is zero");
                    if (lenS === 0) throw new Error("S length is zero");
                    if (lenR > 33) throw new Error("R length is too long");
                    if (lenS > 33) throw new Error("S length is too long");
                    if (r[0] & 128) throw new Error("R value is negative");
                    if (s[0] & 128) throw new Error("S value is negative");
                    if (lenR > 1 && r[0] === 0 && !(r[1] & 128)) throw new Error("R value excessively padded");
                    if (lenS > 1 && s[0] === 0 && !(s[1] & 128)) throw new Error("S value excessively padded");
                    var signature = new Buffer(6 + lenR + lenS);
                    signature[0] = 48;
                    signature[1] = signature.length - 2;
                    signature[2] = 2;
                    signature[3] = r.length;
                    r.copy(signature, 4);
                    signature[4 + lenR] = 2;
                    signature[5 + lenR] = s.length;
                    s.copy(signature, 6 + lenR);
                    return signature
                }
                module.exports = {
                    check: check,
                    decode: decode,
                    encode: encode
                }
            }).call(this, require("buffer").Buffer)
        }, {
            buffer: 3
        }],
        35: [function (require, module, exports) {
            (function (Buffer) {
                "use strict";
                var base58 = require("bs58");
                var createHash = require("create-hash");
                function sha256x2(buffer) {
                    var tmp = createHash("sha256").update(buffer).digest();
                    return createHash("sha256").update(tmp).digest()
                }
                function encode(payload) {
                    var checksum = sha256x2(payload);
                    return base58.encode(Buffer.concat([payload, checksum], payload.length + 4))
                }
                function decode(string) {
                    var buffer = new Buffer(base58.decode(string));
                    var payload = buffer.slice(0, -4);
                    var checksum = buffer.slice(-4);
                    var newChecksum = sha256x2(payload);
                    if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3]) throw new Error("Invalid checksum");
                    return payload
                }
                module.exports = {
                    encode: encode,
                    decode: decode
                }
            }).call(this, require("buffer").Buffer)
        }, {
            bs58: 36,
            buffer: 3,
            "create-hash": 40
        }],
        36: [function (require, module, exports) {
            var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
            var ALPHABET_MAP = {};
            for (var i = 0; i < ALPHABET.length; i++) {
                ALPHABET_MAP[ALPHABET.charAt(i)] = i
            }
            var BASE = 58;
            function encode(buffer) {
                if (buffer.length === 0) return "";
                var i, j, digits = [0];
                for (i = 0; i < buffer.length; i++) {
                    for (j = 0; j < digits.length; j++) digits[j] <<= 8;
                    digits[0] += buffer[i];
                    var carry = 0;
                    for (j = 0; j < digits.length; ++j) {
                        digits[j] += carry;
                        carry = digits[j] / BASE | 0;
                        digits[j] %= BASE
                    }
                    while (carry) {
                        digits.push(carry % BASE);
                        carry = carry / BASE | 0
                    }
                }
                for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0);
                var stringOutput = "";
                for (var i = digits.length - 1; i >= 0; i--) {
                    stringOutput = stringOutput + ALPHABET[digits[i]]
                }
                return stringOutput
            }
            function decode(string) {
                if (string.length === 0) return [];
                var i, j, bytes = [0];
                for (i = 0; i < string.length; i++) {
                    var c = string[i];
                    if (!(c in ALPHABET_MAP)) throw new Error("Non-base58 character");
                    for (j = 0; j < bytes.length; j++) bytes[j] *= BASE;
                    bytes[0] += ALPHABET_MAP[c];
                    var carry = 0;
                    for (j = 0; j < bytes.length; ++j) {
                        bytes[j] += carry;
                        carry = bytes[j] >> 8;
                        bytes[j] &= 255
                    }
                    while (carry) {
                        bytes.push(carry & 255);
                        carry >>= 8
                    }
                }
                for (i = 0; string[i] === "1" && i < string.length - 1; i++) bytes.push(0);
                return bytes.reverse()
            }
            module.exports = {
                encode: encode,
                decode: decode
            }
        }, {}],
        37: [function (require, module, exports) {
            module.exports = function (a, b) {
                if (typeof a.compare === "function") return a.compare(b);
                if (a === b) return 0;
                var x = a.length;
                var y = b.length;
                var i = 0;
                var len = Math.min(x, y);
                while (i < len) {
                    if (a[i] !== b[i]) break;
                    ++i
                }
                if (i !== len) {
                    x = a[i];
                    y = b[i]
                }
                if (x < y) return -1;
                if (y < x) return 1;
                return 0
            }
        }, {}],
        38: [function (require, module, exports) {
            (function (Buffer) {
                "use strict";
                module.exports = function (a, b) {
                    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                        throw new TypeError("Arguments must be Buffers")
                    }
                    if (a === b) {
                        return true
                    }
                    if (typeof a.equals === "function") {
                        return a.equals(b)
                    }
                    if (a.length !== b.length) {
                        return false
                    }
                    for (var i = 0; i < a.length; i++) {
                        if (a[i] !== b[i]) {
                            return false
                        }
                    }
                    return true
                }
            }).call(this, {
                isBuffer: require("is-buffer")
            })
        }, {
            "is-buffer": 9
        }],
        39: [function (require, module, exports) {
            (function (Buffer) {
                module.exports = function reverse(src) {
                    var buffer = new Buffer(src.length);
                    for (var i = 0, j = src.length - 1; i <= j; ++i, --j) {
                        buffer[i] = src[j];
                        buffer[j] = src[i]
                    }
                    return buffer
                }
            }).call(this, require("buffer").Buffer)
        }, {
            buffer: 3
        }],
        40: [function (require, module, exports) {
            (function (Buffer) {
                "use strict";
                var inherits = require("inherits");
                var md5 = require("./md5");
                var rmd160 = require("ripemd160");
                var sha = require("sha.js");
                var Base = require("cipher-base");
                function HashNoConstructor(hash) {
                    Base.call(this, "digest");
                    this._hash = hash;
                    this.buffers = []
                }
                inherits(HashNoConstructor, Base);
                HashNoConstructor.prototype._update = function (data) {
                    this.buffers.push(data)
                };
                HashNoConstructor.prototype._final = function () {
                    var buf = Buffer.concat(this.buffers);
                    var r = this._hash(buf);
                    this.buffers = null;
                    return r
                };
                function Hash(hash) {
                    Base.call(this, "digest");
                    this._hash = hash
                }
                inherits(Hash, Base);
                Hash.prototype._update = function (data) {
                    this._hash.update(data)
                };
                Hash.prototype._final = function () {
                    return this._hash.digest()
                };
                module.exports = function createHash(alg) {
                    alg = alg.toLowerCase();
                    if ("md5" === alg) return new HashNoConstructor(md5);
                    if ("rmd160" === alg || "ripemd160" === alg) return new HashNoConstructor(rmd160);
                    return new Hash(sha(alg))
                }
            }).call(this, require("buffer").Buffer)
        }, {
            "./md5": 42,
            buffer: 3,
            "cipher-base": 43,
            inherits: 44,
            ripemd160: 45,
            "sha.js": 47
        }],
        41: [function (require, module, exports) {
            (function (Buffer) {
                "use strict";
                var intSize = 4;
                var zeroBuffer = new Buffer(intSize);
                zeroBuffer.fill(0);
                var chrsz = 8;
                function toArray(buf, bigEndian) {
                    if (buf.length % intSize !== 0) {
                        var len = buf.length + (intSize - buf.length % intSize);
                        buf = Buffer.concat([buf, zeroBuffer], len)
                    }
                    var arr = [];
                    var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
                    for (var i = 0; i < buf.length; i += intSize) {
                        arr.push(fn.call(buf, i))
                    }
                    return arr
                }
                function toBuffer(arr, size, bigEndian) {
                    var buf = new Buffer(size);
                    var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
                    for (var i = 0; i < arr.length; i++) {
                        fn.call(buf, arr[i], i * 4, true)
                    }
                    return buf
                }
                function hash(buf, fn, hashSize, bigEndian) {
                    if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
                    var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
                    return toBuffer(arr, hashSize, bigEndian)
                }
                exports.hash = hash
            }).call(this, require("buffer").Buffer)
        }, {
            buffer: 3
        }],
        42: [function (require, module, exports) {
            "use strict";
            var helpers = require("./helpers");
            function core_md5(x, len) {
                x[len >> 5] |= 128 << len % 32;
                x[(len + 64 >>> 9 << 4) + 14] = len;
                var a = 1732584193;
                var b = -271733879;
                var c = -1732584194;
                var d = 271733878;
                for (var i = 0; i < x.length; i += 16) {
                    var olda = a;
                    var oldb = b;
                    var oldc = c;
                    var oldd = d;
                    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                    a = safe_add(a, olda);
                    b = safe_add(b, oldb);
                    c = safe_add(c, oldc);
                    d = safe_add(d, oldd)
                }
                return Array(a, b, c, d)
            }
            function md5_cmn(q, a, b, x, s, t) {
                return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
            }
            function md5_ff(a, b, c, d, x, s, t) {
                return md5_cmn(b & c | ~b & d, a, b, x, s, t)
            }
            function md5_gg(a, b, c, d, x, s, t) {
                return md5_cmn(b & d | c & ~d, a, b, x, s, t)
            }
            function md5_hh(a, b, c, d, x, s, t) {
                return md5_cmn(b ^ c ^ d, a, b, x, s, t)
            }
            function md5_ii(a, b, c, d, x, s, t) {
                return md5_cmn(c ^ (b | ~d), a, b, x, s, t)
            }
            function safe_add(x, y) {
                var lsw = (x & 65535) + (y & 65535);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return msw << 16 | lsw & 65535
            }
            function bit_rol(num, cnt) {
                return num << cnt | num >>> 32 - cnt
            }
            module.exports = function md5(buf) {
                return helpers.hash(buf, core_md5, 16)
            }
        }, {
            "./helpers": 41
        }],
        43: [function (require, module, exports) {
            (function (Buffer) {
                var Transform = require("stream").Transform;
                var inherits = require("inherits");
                var StringDecoder = require("string_decoder").StringDecoder;
                module.exports = CipherBase;
                inherits(CipherBase, Transform);
                function CipherBase(hashMode) {
                    Transform.call(this);
                    this.hashMode = typeof hashMode === "string";
                    if (this.hashMode) {
                        this[hashMode] = this._finalOrDigest
                    } else {
                        this.final = this._finalOrDigest
                    }
                    this._decoder = null;
                    this._encoding = null
                }
                CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
                    if (typeof data === "string") {
                        data = new Buffer(data, inputEnc)
                    }
                    var outData = this._update(data);
                    if (this.hashMode) {
                        return this
                    }
                    if (outputEnc) {
                        outData = this._toString(outData, outputEnc)
                    }
                    return outData
                };
                CipherBase.prototype.setAutoPadding = function () {};
                CipherBase.prototype.getAuthTag = function () {
                    throw new Error("trying to get auth tag in unsupported state")
                };
                CipherBase.prototype.setAuthTag = function () {
                    throw new Error("trying to set auth tag in unsupported state")
                };
                CipherBase.prototype.setAAD = function () {
                    throw new Error("trying to set aad in unsupported state")
                };
                CipherBase.prototype._transform = function (data, _, next) {
                    var err;
                    try {
                        if (this.hashMode) {
                            this._update(data)
                        } else {
                            this.push(this._update(data))
                        }
                    } catch (e) {
                        err = e
                    } finally {
                        next(err)
                    }
                };
                CipherBase.prototype._flush = function (done) {
                    var err;
                    try {
                        this.push(this._final())
                    } catch (e) {
                        err = e
                    } finally {
                        done(err)
                    }
                };
                CipherBase.prototype._finalOrDigest = function (outputEnc) {
                    var outData = this._final() || new Buffer("");
                    if (outputEnc) {
                        outData = this._toString(outData, outputEnc, true)
                    }
                    return outData
                };
                CipherBase.prototype._toString = function (value, enc, final) {
                    if (!this._decoder) {
                        this._decoder = new StringDecoder(enc);
                        this._encoding = enc
                    }
                    if (this._encoding !== enc) {
                        throw new Error("can't switch encodings")
                    }
                    var out = this._decoder.write(value);
                    if (final) {
                        out += this._decoder.end()
                    }
                    return out
                }
            }).call(this, require("buffer").Buffer)
        }, {
            buffer: 3,
            inherits: 44,
            stream: 26,
            string_decoder: 27
        }],
        44: [function (require, module, exports) {
            arguments[4][8][0].apply(exports, arguments)
        }, {
            dup: 8
        }],
        45: [function (require, module, exports) {
            (function (Buffer) {
                var zl = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
                var zr = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
                var sl = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
                var sr = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
                var hl = [0, 1518500249, 1859775393, 2400959708, 2840853838];
                var hr = [1352829926, 1548603684, 1836072691, 2053994217, 0];
                function bytesToWords(bytes) {
                    var words = [];
                    for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
                        words[b >>> 5] |= bytes[i] << 24 - b % 32
                    }
                    return words
                }
                function wordsToBytes(words) {
                    var bytes = [];
                    for (var b = 0; b < words.length * 32; b += 8) {
                        bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255)
                    }
                    return bytes
                }
                function processBlock(H, M, offset) {
                    for (var i = 0; i < 16; i++) {
                        var offset_i = offset + i;
                        var M_offset_i = M[offset_i];
                        M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360
                    }
                    var al, bl, cl, dl, el;
                    var ar, br, cr, dr, er;
                    ar = al = H[0];
                    br = bl = H[1];
                    cr = cl = H[2];
                    dr = dl = H[3];
                    er = el = H[4];
                    var t;
                    for (i = 0; i < 80; i += 1) {
                        t = al + M[offset + zl[i]] | 0;
                        if (i < 16) {
                            t += f1(bl, cl, dl) + hl[0]
                        } else if (i < 32) {
                            t += f2(bl, cl, dl) + hl[1]
                        } else if (i < 48) {
                            t += f3(bl, cl, dl) + hl[2]
                        } else if (i < 64) {
                            t += f4(bl, cl, dl) + hl[3]
                        } else {
                            t += f5(bl, cl, dl) + hl[4]
                        }
                        t = t | 0;
                        t = rotl(t, sl[i]);
                        t = t + el | 0;
                        al = el;
                        el = dl;
                        dl = rotl(cl, 10);
                        cl = bl;
                        bl = t;
                        t = ar + M[offset + zr[i]] | 0;
                        if (i < 16) {
                            t += f5(br, cr, dr) + hr[0]
                        } else if (i < 32) {
                            t += f4(br, cr, dr) + hr[1]
                        } else if (i < 48) {
                            t += f3(br, cr, dr) + hr[2]
                        } else if (i < 64) {
                            t += f2(br, cr, dr) + hr[3]
                        } else {
                            t += f1(br, cr, dr) + hr[4]
                        }
                        t = t | 0;
                        t = rotl(t, sr[i]);
                        t = t + er | 0;
                        ar = er;
                        er = dr;
                        dr = rotl(cr, 10);
                        cr = br;
                        br = t
                    }
                    t = H[1] + cl + dr | 0;
                    H[1] = H[2] + dl + er | 0;
                    H[2] = H[3] + el + ar | 0;
                    H[3] = H[4] + al + br | 0;
                    H[4] = H[0] + bl + cr | 0;
                    H[0] = t
                }
                function f1(x, y, z) {
                    return x ^ y ^ z
                }
                function f2(x, y, z) {
                    return x & y | ~x & z
                }
                function f3(x, y, z) {
                    return (x | ~y) ^ z
                }
                function f4(x, y, z) {
                    return x & z | y & ~z
                }
                function f5(x, y, z) {
                    return x ^ (y | ~z)
                }
                function rotl(x, n) {
                    return x << n | x >>> 32 - n
                }
                function ripemd160(message) {
                    var H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
                    if (typeof message === "string") {
                        message = new Buffer(message, "utf8")
                    }
                    var m = bytesToWords(message);
                    var nBitsLeft = message.length * 8;
                    var nBitsTotal = message.length * 8;
                    m[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
                    m[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
                    for (var i = 0; i < m.length; i += 16) {
                        processBlock(H, m, i)
                    }
                    for (i = 0; i < 5; i++) {
                        var H_i = H[i];
                        H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360
                    }
                    var digestbytes = wordsToBytes(H);
                    return new Buffer(digestbytes)
                }
                module.exports = ripemd160
            }).call(this, require("buffer").Buffer)
        }, {
            buffer: 3
        }],
        46: [function (require, module, exports) {
            (function (Buffer) {
                function Hash(blockSize, finalSize) {
                    this._block = new Buffer(blockSize);
                    this._finalSize = finalSize;
                    this._blockSize = blockSize;
                    this._len = 0;
                    this._s = 0
                }
                Hash.prototype.update = function (data, enc) {
                    if (typeof data === "string") {
                        enc = enc || "utf8";
                        data = new Buffer(data, enc)
                    }
                    var l = this._len += data.length;
                    var s = this._s || 0;
                    var f = 0;
                    var buffer = this._block;
                    while (s < l) {
                        var t = Math.min(data.length, f + this._blockSize - s % this._blockSize);
                        var ch = t - f;
                        for (var i = 0; i < ch; i++) {
                            buffer[s % this._blockSize + i] = data[i + f]
                        }
                        s += ch;
                        f += ch;
                        if (s % this._blockSize === 0) {
                            this._update(buffer)
                        }
                    }
                    this._s = s;
                    return this
                };
                Hash.prototype.digest = function (enc) {
                    var l = this._len * 8;
                    this._block[this._len % this._blockSize] = 128;
                    this._block.fill(0, this._len % this._blockSize + 1);
                    if (l % (this._blockSize * 8) >= this._finalSize * 8) {
                        this._update(this._block);
                        this._block.fill(0)
                    }
                    this._block.writeInt32BE(l, this._blockSize - 4);
                    var hash = this._update(this._block) || this._hash();
                    return enc ? hash.toString(enc) : hash
                };
                Hash.prototype._update = function () {
                    throw new Error("_update must be implemented by subclass")
                };
                module.exports = Hash
            }).call(this, require("buffer").Buffer)
        }, {
            buffer: 3
        }],
        47: [function (require, module, exports) {
            var exports = module.exports = function SHA(algorithm) {
                algorithm = algorithm.toLowerCase();
                var Algorithm = exports[algorithm];
                if (!Algorithm) throw new Error(algorithm + " is not supported (we accept pull requests)");
                return new Algorithm
            };
            exports.sha = require("./sha");
            exports.sha1 = require("./sha1");
            exports.sha224 = require("./sha224");
            exports.sha256 = require("./sha256");
            exports.sha384 = require("./sha384");
            exports.sha512 = require("./sha512")
        }, {
            "./sha": 48,
            "./sha1": 49,
            "./sha224": 50,
            "./sha256": 51,
            "./sha384": 52,
            "./sha512": 53
        }],
        48: [function (require, module, exports) {
            (function (Buffer) {
                var inherits = require("inherits");
                var Hash = require("./hash");
                var K = [1518500249, 1859775393, 2400959708 | 0, 3395469782 | 0];
                var W = new Array(80);
                function Sha() {
                    this.init();
                    this._w = W;
                    Hash.call(this, 64, 56)
                }
                inherits(Sha, Hash);
                Sha.prototype.init = function () {
                    this._a = 1732584193;
                    this._b = 4023233417;
                    this._c = 2562383102;
                    this._d = 271733878;
                    this._e = 3285377520;
                    return this
                };
                function rotl5(num) {
                    return num << 5 | num >>> 27
                }
                function rotl30(num) {
                    return num << 30 | num >>> 2
                }
                function ft(s, b, c, d) {
                    if (s === 0) return b & c | ~b & d;
                    if (s === 2) return b & c | b & d | c & d;
                    return b ^ c ^ d
                }
                Sha.prototype._update = function (M) {
                    var W = this._w;
                    var a = this._a | 0;
                    var b = this._b | 0;
                    var c = this._c | 0;
                    var d = this._d | 0;
                    var e = this._e | 0;
                    for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
                    for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                    for (var j = 0; j < 80; ++j) {
                        var s = ~~(j / 20);
                        var t = rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s] | 0;
                        e = d;
                        d = c;
                        c = rotl30(b);
                        b = a;
                        a = t
                    }
                    this._a = a + this._a | 0;
                    this._b = b + this._b | 0;
                    this._c = c + this._c | 0;
                    this._d = d + this._d | 0;
                    this._e = e + this._e | 0
                };
                Sha.prototype._hash = function () {
                    var H = new Buffer(20);
                    H.writeInt32BE(this._a | 0, 0);
                    H.writeInt32BE(this._b | 0, 4);
                    H.writeInt32BE(this._c | 0, 8);
                    H.writeInt32BE(this._d | 0, 12);
                    H.writeInt32BE(this._e | 0, 16);
                    return H
                };
                module.exports = Sha
            }).call(this, require("buffer").Buffer)
        }, {
            "./hash": 46,
            buffer: 3,
            inherits: 44
        }],
        49: [function (require, module, exports) {
            (function (Buffer) {
                var inherits = require("inherits");
                var Hash = require("./hash");
                var K = [1518500249, 1859775393, 2400959708 | 0, 3395469782 | 0];
                var W = new Array(80);
                function Sha1() {
                    this.init();
                    this._w = W;
                    Hash.call(this, 64, 56)
                }
                inherits(Sha1, Hash);
                Sha1.prototype.init = function () {
                    this._a = 1732584193;
                    this._b = 4023233417;
                    this._c = 2562383102;
                    this._d = 271733878;
                    this._e = 3285377520;
                    return this
                };
                function rotl1(num) {
                    return num << 1 | num >>> 31
                }
                function rotl5(num) {
                    return num << 5 | num >>> 27
                }
                function rotl30(num) {
                    return num << 30 | num >>> 2
                }
                function ft(s, b, c, d) {
                    if (s === 0) return b & c | ~b & d;
                    if (s === 2) return b & c | b & d | c & d;
                    return b ^ c ^ d
                }
                Sha1.prototype._update = function (M) {
                    var W = this._w;
                    var a = this._a | 0;
                    var b = this._b | 0;
                    var c = this._c | 0;
                    var d = this._d | 0;
                    var e = this._e | 0;
                    for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
                    for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);
                    for (var j = 0; j < 80; ++j) {
                        var s = ~~(j / 20);
                        var t = rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s] | 0;
                        e = d;
                        d = c;
                        c = rotl30(b);
                        b = a;
                        a = t
                    }
                    this._a = a + this._a | 0;
                    this._b = b + this._b | 0;
                    this._c = c + this._c | 0;
                    this._d = d + this._d | 0;
                    this._e = e + this._e | 0
                };
                Sha1.prototype._hash = function () {
                    var H = new Buffer(20);
                    H.writeInt32BE(this._a | 0, 0);
                    H.writeInt32BE(this._b | 0, 4);
                    H.writeInt32BE(this._c | 0, 8);
                    H.writeInt32BE(this._d | 0, 12);
                    H.writeInt32BE(this._e | 0, 16);
                    return H
                };
                module.exports = Sha1
            }).call(this, require("buffer").Buffer)
        }, {
            "./hash": 46,
            buffer: 3,
            inherits: 44
        }],
        50: [function (require, module, exports) {
            (function (Buffer) {
                var inherits = require("inherits");
                var Sha256 = require("./sha256");
                var Hash = require("./hash");
                var W = new Array(64);
                function Sha224() {
                    this.init();
                    this._w = W;
                    Hash.call(this, 64, 56)
                }
                inherits(Sha224, Sha256);
                Sha224.prototype.init = function () {
                    this._a = 3238371032;
                    this._b = 914150663;
                    this._c = 812702999;
                    this._d = 4144912697;
                    this._e = 4290775857;
                    this._f = 1750603025;
                    this._g = 1694076839;
                    this._h = 3204075428;
                    return this
                };
                Sha224.prototype._hash = function () {
                    var H = new Buffer(28);
                    H.writeInt32BE(this._a, 0);
                    H.writeInt32BE(this._b, 4);
                    H.writeInt32BE(this._c, 8);
                    H.writeInt32BE(this._d, 12);
                    H.writeInt32BE(this._e, 16);
                    H.writeInt32BE(this._f, 20);
                    H.writeInt32BE(this._g, 24);
                    return H
                };
                module.exports = Sha224
            }).call(this, require("buffer").Buffer)
        }, {
            "./hash": 46,
            "./sha256": 51,
            buffer: 3,
            inherits: 44
        }],
        51: [function (require, module, exports) {
            (function (Buffer) {
                var inherits = require("inherits");
                var Hash = require("./hash");
                var K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
                var W = new Array(64);
                function Sha256() {
                    this.init();
                    this._w = W;
                    Hash.call(this, 64, 56)
                }
                inherits(Sha256, Hash);
                Sha256.prototype.init = function () {
                    this._a = 1779033703;
                    this._b = 3144134277;
                    this._c = 1013904242;
                    this._d = 2773480762;
                    this._e = 1359893119;
                    this._f = 2600822924;
                    this._g = 528734635;
                    this._h = 1541459225;
                    return this
                };
                function ch(x, y, z) {
                    return z ^ x & (y ^ z)
                }
                function maj(x, y, z) {
                    return x & y | z & (x | y)
                }
                function sigma0(x) {
                    return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
                }
                function sigma1(x) {
                    return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
                }
                function gamma0(x) {
                    return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3
                }
                function gamma1(x) {
                    return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ x >>> 10
                }
                Sha256.prototype._update = function (M) {
                    var W = this._w;
                    var a = this._a | 0;
                    var b = this._b | 0;
                    var c = this._c | 0;
                    var d = this._d | 0;
                    var e = this._e | 0;
                    var f = this._f | 0;
                    var g = this._g | 0;
                    var h = this._h | 0;
                    for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
                    for (; i < 64; ++i) W[i] = gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16] | 0;
                    for (var j = 0; j < 64; ++j) {
                        var T1 = h + sigma1(e) + ch(e, f, g) + K[j] + W[j] | 0;
                        var T2 = sigma0(a) + maj(a, b, c) | 0;
                        h = g;
                        g = f;
                        f = e;
                        e = d + T1 | 0;
                        d = c;
                        c = b;
                        b = a;
                        a = T1 + T2 | 0
                    }
                    this._a = a + this._a | 0;
                    this._b = b + this._b | 0;
                    this._c = c + this._c | 0;
                    this._d = d + this._d | 0;
                    this._e = e + this._e | 0;
                    this._f = f + this._f | 0;
                    this._g = g + this._g | 0;
                    this._h = h + this._h | 0
                };
                Sha256.prototype._hash = function () {
                    var H = new Buffer(32);
                    H.writeInt32BE(this._a, 0);
                    H.writeInt32BE(this._b, 4);
                    H.writeInt32BE(this._c, 8);
                    H.writeInt32BE(this._d, 12);
                    H.writeInt32BE(this._e, 16);
                    H.writeInt32BE(this._f, 20);
                    H.writeInt32BE(this._g, 24);
                    H.writeInt32BE(this._h, 28);
                    return H
                };
                module.exports = Sha256
            }).call(this, require("buffer").Buffer)
        }, {
            "./hash": 46,
            buffer: 3,
            inherits: 44
        }],
        52: [function (require, module, exports) {
            (function (Buffer) {
                var inherits = require("inherits");
                var SHA512 = require("./sha512");
                var Hash = require("./hash");
                var W = new Array(160);
                function Sha384() {
                    this.init();
                    this._w = W;
                    Hash.call(this, 128, 112)
                }
                inherits(Sha384, SHA512);
                Sha384.prototype.init = function () {
                    this._ah = 3418070365;
                    this._bh = 1654270250;
                    this._ch = 2438529370;
                    this._dh = 355462360;
                    this._eh = 1731405415;
                    this._fh = 2394180231;
                    this._gh = 3675008525;
                    this._hh = 1203062813;
                    this._al = 3238371032;
                    this._bl = 914150663;
                    this._cl = 812702999;
                    this._dl = 4144912697;
                    this._el = 4290775857;
                    this._fl = 1750603025;
                    this._gl = 1694076839;
                    this._hl = 3204075428;
                    return this
                };
                Sha384.prototype._hash = function () {
                    var H = new Buffer(48);
                    function writeInt64BE(h, l, offset) {
                        H.writeInt32BE(h, offset);
                        H.writeInt32BE(l, offset + 4)
                    }
                    writeInt64BE(this._ah, this._al, 0);
                    writeInt64BE(this._bh, this._bl, 8);
                    writeInt64BE(this._ch, this._cl, 16);
                    writeInt64BE(this._dh, this._dl, 24);
                    writeInt64BE(this._eh, this._el, 32);
                    writeInt64BE(this._fh, this._fl, 40);
                    return H
                };
                module.exports = Sha384
            }).call(this, require("buffer").Buffer)
        }, {
            "./hash": 46,
            "./sha512": 53,
            buffer: 3,
            inherits: 44
        }],
        53: [function (require, module, exports) {
            (function (Buffer) {
                var inherits = require("inherits");
                var Hash = require("./hash");
                var K = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];
                var W = new Array(160);
                function Sha512() {
                    this.init();
                    this._w = W;
                    Hash.call(this, 128, 112)
                }
                inherits(Sha512, Hash);
                Sha512.prototype.init = function () {
                    this._ah = 1779033703;
                    this._bh = 3144134277;
                    this._ch = 1013904242;
                    this._dh = 2773480762;
                    this._eh = 1359893119;
                    this._fh = 2600822924;
                    this._gh = 528734635;
                    this._hh = 1541459225;
                    this._al = 4089235720;
                    this._bl = 2227873595;
                    this._cl = 4271175723;
                    this._dl = 1595750129;
                    this._el = 2917565137;
                    this._fl = 725511199;
                    this._gl = 4215389547;
                    this._hl = 327033209;
                    return this
                };
                function Ch(x, y, z) {
                    return z ^ x & (y ^ z)
                }
                function maj(x, y, z) {
                    return x & y | z & (x | y)
                }
                function sigma0(x, xl) {
                    return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
                }
                function sigma1(x, xl) {
                    return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
                }
                function Gamma0(x, xl) {
                    return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ x >>> 7
                }
                function Gamma0l(x, xl) {
                    return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
                }
                function Gamma1(x, xl) {
                    return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ x >>> 6
                }
                function Gamma1l(x, xl) {
                    return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
                }
                function getCarry(a, b) {
                    return a >>> 0 < b >>> 0 ? 1 : 0
                }
                Sha512.prototype._update = function (M) {
                    var W = this._w;
                    var ah = this._ah | 0;
                    var bh = this._bh | 0;
                    var ch = this._ch | 0;
                    var dh = this._dh | 0;
                    var eh = this._eh | 0;
                    var fh = this._fh | 0;
                    var gh = this._gh | 0;
                    var hh = this._hh | 0;
                    var al = this._al | 0;
                    var bl = this._bl | 0;
                    var cl = this._cl | 0;
                    var dl = this._dl | 0;
                    var el = this._el | 0;
                    var fl = this._fl | 0;
                    var gl = this._gl | 0;
                    var hl = this._hl | 0;
                    for (var i = 0; i < 32; i += 2) {
                        W[i] = M.readInt32BE(i * 4);
                        W[i + 1] = M.readInt32BE(i * 4 + 4)
                    }
                    for (; i < 160; i += 2) {
                        var xh = W[i - 15 * 2];
                        var xl = W[i - 15 * 2 + 1];
                        var gamma0 = Gamma0(xh, xl);
                        var gamma0l = Gamma0l(xl, xh);
                        xh = W[i - 2 * 2];
                        xl = W[i - 2 * 2 + 1];
                        var gamma1 = Gamma1(xh, xl);
                        var gamma1l = Gamma1l(xl, xh);
                        var Wi7h = W[i - 7 * 2];
                        var Wi7l = W[i - 7 * 2 + 1];
                        var Wi16h = W[i - 16 * 2];
                        var Wi16l = W[i - 16 * 2 + 1];
                        var Wil = gamma0l + Wi7l | 0;
                        var Wih = gamma0 + Wi7h + getCarry(Wil, gamma0l) | 0;
                        Wil = Wil + gamma1l | 0;
                        Wih = Wih + gamma1 + getCarry(Wil, gamma1l) | 0;
                        Wil = Wil + Wi16l | 0;
                        Wih = Wih + Wi16h + getCarry(Wil, Wi16l) | 0;
                        W[i] = Wih;
                        W[i + 1] = Wil
                    }
                    for (var j = 0; j < 160; j += 2) {
                        Wih = W[j];
                        Wil = W[j + 1];
                        var majh = maj(ah, bh, ch);
                        var majl = maj(al, bl, cl);
                        var sigma0h = sigma0(ah, al);
                        var sigma0l = sigma0(al, ah);
                        var sigma1h = sigma1(eh, el);
                        var sigma1l = sigma1(el, eh);
                        var Kih = K[j];
                        var Kil = K[j + 1];
                        var chh = Ch(eh, fh, gh);
                        var chl = Ch(el, fl, gl);
                        var t1l = hl + sigma1l | 0;
                        var t1h = hh + sigma1h + getCarry(t1l, hl) | 0;
                        t1l = t1l + chl | 0;
                        t1h = t1h + chh + getCarry(t1l, chl) | 0;
                        t1l = t1l + Kil | 0;
                        t1h = t1h + Kih + getCarry(t1l, Kil) | 0;
                        t1l = t1l + Wil | 0;
                        t1h = t1h + Wih + getCarry(t1l, Wil) | 0;
                        var t2l = sigma0l + majl | 0;
                        var t2h = sigma0h + majh + getCarry(t2l, sigma0l) | 0;
                        hh = gh;
                        hl = gl;
                        gh = fh;
                        gl = fl;
                        fh = eh;
                        fl = el;
                        el = dl + t1l | 0;
                        eh = dh + t1h + getCarry(el, dl) | 0;
                        dh = ch;
                        dl = cl;
                        ch = bh;
                        cl = bl;
                        bh = ah;
                        bl = al;
                        al = t1l + t2l | 0;
                        ah = t1h + t2h + getCarry(al, t1l) | 0
                    }
                    this._al = this._al + al | 0;
                    this._bl = this._bl + bl | 0;
                    this._cl = this._cl + cl | 0;
                    this._dl = this._dl + dl | 0;
                    this._el = this._el + el | 0;
                    this._fl = this._fl + fl | 0;
                    this._gl = this._gl + gl | 0;
                    this._hl = this._hl + hl | 0;
                    this._ah = this._ah + ah + getCarry(this._al, al) | 0;
                    this._bh = this._bh + bh + getCarry(this._bl, bl) | 0;
                    this._ch = this._ch + ch + getCarry(this._cl, cl) | 0;
                    this._dh = this._dh + dh + getCarry(this._dl, dl) | 0;
                    this._eh = this._eh + eh + getCarry(this._el, el) | 0;
                    this._fh = this._fh + fh + getCarry(this._fl, fl) | 0;
                    this._gh = this._gh + gh + getCarry(this._gl, gl) | 0;
                    this._hh = this._hh + hh + getCarry(this._hl, hl) | 0
                };
                Sha512.prototype._hash = function () {
                    var H = new Buffer(64);
                    function writeInt64BE(h, l, offset) {
                        H.writeInt32BE(h, offset);
                        H.writeInt32BE(l, offset + 4)
                    }
                    writeInt64BE(this._ah, this._al, 0);
                    writeInt64BE(this._bh, this._bl, 8);
                    writeInt64BE(this._ch, this._cl, 16);
                    writeInt64BE(this._dh, this._dl, 24);
                    writeInt64BE(this._eh, this._el, 32);
                    writeInt64BE(this._fh, this._fl, 40);
                    writeInt64BE(this._gh, this._gl, 48);
                    writeInt64BE(this._hh, this._hl, 56);
                    return H
                };
                module.exports = Sha512
            }).call(this, require("buffer").Buffer)
        }, {
            "./hash": 46,
            buffer: 3,
            inherits: 44
        }],
        54: [function (require, module, exports) {
            (function (Buffer) {
                "use strict";
                var createHash = require("create-hash/browser");
                var inherits = require("inherits");
                var Transform = require("stream").Transform;
                var ZEROS = new Buffer(128);
                ZEROS.fill(0);
                function Hmac(alg, key) {
                    Transform.call(this);
                    alg = alg.toLowerCase();
                    if (typeof key === "string") {
                        key = new Buffer(key)
                    }
                    var blocksize = alg === "sha512" || alg === "sha384" ? 128 : 64;
                    this._alg = alg;
                    this._key = key;
                    if (key.length > blocksize) {
                        key = createHash(alg).update(key).digest()
                    } else if (key.length < blocksize) {
                        key = Buffer.concat([key, ZEROS], blocksize)
                    }
                    var ipad = this._ipad = new Buffer(blocksize);
                    var opad = this._opad = new Buffer(blocksize);
                    for (var i = 0; i < blocksize; i++) {
                        ipad[i] = key[i] ^ 54;
                        opad[i] = key[i] ^ 92
                    }
                    this._hash = createHash(alg).update(ipad)
                }
                inherits(Hmac, Transform);
                Hmac.prototype.update = function (data, enc) {
                    this._hash.update(data, enc);
                    return this
                };
                Hmac.prototype._transform = function (data, _, next) {
                    this._hash.update(data);
                    next()
                };
                Hmac.prototype._flush = function (next) {
                    this.push(this.digest());
                    next()
                };
                Hmac.prototype.digest = function (enc) {
                    var h = this._hash.digest();
                    return createHash(this._alg).update(this._opad).update(h).digest(enc)
                };
                module.exports = function createHmac(alg, key) {
                    return new Hmac(alg, key)
                }
            }).call(this, require("buffer").Buffer)
        }, {
            buffer: 3,
            "create-hash/browser": 40,
            inherits: 55,
            stream: 26
        }],
        55: [function (require, module, exports) {
            arguments[4][8][0].apply(exports, arguments)
        }, {
            dup: 8
        }],
        56: [function (require, module, exports) {
            var assert = require("assert");
            var BigInteger = require("bigi");
            var Point = require("./point");
            function Curve(p, a, b, Gx, Gy, n, h) {
                this.p = p;
                this.a = a;
                this.b = b;
                this.G = Point.fromAffine(this, Gx, Gy);
                this.n = n;
                this.h = h;
                this.infinity = new Point(this, null, null, BigInteger.ZERO);
                this.pOverFour = p.add(BigInteger.ONE).shiftRight(2)
            }
            Curve.prototype.pointFromX = function (isOdd, x) {
                var alpha = x.pow(3).add(this.a.multiply(x)).add(this.b).mod(this.p);
                var beta = alpha.modPow(this.pOverFour, this.p);
                var y = beta;
                if (beta.isEven() ^ !isOdd) {
                    y = this.p.subtract(y)
                }
                return Point.fromAffine(this, x, y)
            };
            Curve.prototype.isInfinity = function (Q) {
                if (Q === this.infinity) return true;
                return Q.z.signum() === 0 && Q.y.signum() !== 0
            };
            Curve.prototype.isOnCurve = function (Q) {
                if (this.isInfinity(Q)) return true;
                var x = Q.affineX;
                var y = Q.affineY;
                var a = this.a;
                var b = this.b;
                var p = this.p;
                if (x.signum() < 0 || x.compareTo(p) >= 0) return false;
                if (y.signum() < 0 || y.compareTo(p) >= 0) return false;
                var lhs = y.square().mod(p);
                var rhs = x.pow(3).add(a.multiply(x)).add(b).mod(p);
                return lhs.equals(rhs)
            };
            Curve.prototype.validate = function (Q) {
                assert(!this.isInfinity(Q), "Point is at infinity");
                assert(this.isOnCurve(Q), "Point is not on the curve");
                var nQ = Q.multiply(this.n);
                assert(this.isInfinity(nQ), "Point is not a scalar multiple of G");
                return true
            };
            module.exports = Curve
        }, {
            "./point": 60,
            assert: 1,
            bigi: 32
        }],
        57: [function (require, module, exports) {
            module.exports = {
                secp128r1: {
                    p: "fffffffdffffffffffffffffffffffff",
                    a: "fffffffdfffffffffffffffffffffffc",
                    b: "e87579c11079f43dd824993c2cee5ed3",
                    n: "fffffffe0000000075a30d1b9038a115",
                    h: "01",
                    Gx: "161ff7528b899b2d0c28607ca52c5b86",
                    Gy: "cf5ac8395bafeb13c02da292dded7a83"
                },
                secp160k1: {
                    p: "fffffffffffffffffffffffffffffffeffffac73",
                    a: "00",
                    b: "07",
                    n: "0100000000000000000001b8fa16dfab9aca16b6b3",
                    h: "01",
                    Gx: "3b4c382ce37aa192a4019e763036f4f5dd4d7ebb",
                    Gy: "938cf935318fdced6bc28286531733c3f03c4fee"
                },
                secp160r1: {
                    p: "ffffffffffffffffffffffffffffffff7fffffff",
                    a: "ffffffffffffffffffffffffffffffff7ffffffc",
                    b: "1c97befc54bd7a8b65acf89f81d4d4adc565fa45",
                    n: "0100000000000000000001f4c8f927aed3ca752257",
                    h: "01",
                    Gx: "4a96b5688ef573284664698968c38bb913cbfc82",
                    Gy: "23a628553168947d59dcc912042351377ac5fb32"
                },
                secp192k1: {
                    p: "fffffffffffffffffffffffffffffffffffffffeffffee37",
                    a: "00",
                    b: "03",
                    n: "fffffffffffffffffffffffe26f2fc170f69466a74defd8d",
                    h: "01",
                    Gx: "db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d",
                    Gy: "9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"
                },
                secp192r1: {
                    p: "fffffffffffffffffffffffffffffffeffffffffffffffff",
                    a: "fffffffffffffffffffffffffffffffefffffffffffffffc",
                    b: "64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1",
                    n: "ffffffffffffffffffffffff99def836146bc9b1b4d22831",
                    h: "01",
                    Gx: "188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012",
                    Gy: "07192b95ffc8da78631011ed6b24cdd573f977a11e794811"
                },
                secp256k1: {
                    p: "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
                    a: "00",
                    b: "07",
                    n: "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
                    h: "01",
                    Gx: "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
                    Gy: "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
                },
                secp256r1: {
                    p: "ffffffff00000001000000000000000000000000ffffffffffffffffffffffff",
                    a: "ffffffff00000001000000000000000000000000fffffffffffffffffffffffc",
                    b: "5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",
                    n: "ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",
                    h: "01",
                    Gx: "6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
                    Gy: "4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"
                }
            }
        }, {}],
        58: [function (require, module, exports) {
            var Point = require("./point");
            var Curve = require("./curve");
            var getCurveByName = require("./names");
            module.exports = {
                Curve: Curve,
                Point: Point,
                getCurveByName: getCurveByName
            }
        }, {
            "./curve": 56,
            "./names": 59,
            "./point": 60
        }],
        59: [function (require, module, exports) {
            var BigInteger = require("bigi");
            var curves = require("./curves.json");
            var Curve = require("./curve");
            function getCurveByName(name) {
                var curve = curves[name];
                if (!curve) return null;
                var p = new BigInteger(curve.p, 16);
                var a = new BigInteger(curve.a, 16);
                var b = new BigInteger(curve.b, 16);
                var n = new BigInteger(curve.n, 16);
                var h = new BigInteger(curve.h, 16);
                var Gx = new BigInteger(curve.Gx, 16);
                var Gy = new BigInteger(curve.Gy, 16);
                return new Curve(p, a, b, Gx, Gy, n, h)
            }
            module.exports = getCurveByName
        }, {
            "./curve": 56,
            "./curves.json": 57,
            bigi: 32
        }],
        60: [function (require, module, exports) {
            (function (Buffer) {
                var assert = require("assert");
                var BigInteger = require("bigi");
                var THREE = BigInteger.valueOf(3);
                function Point(curve, x, y, z) {
                    assert.notStrictEqual(z, undefined, "Missing Z coordinate");
                    this.curve = curve;
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this._zInv = null;
                    this.compressed = true
                }
                Object.defineProperty(Point.prototype, "zInv", {
                    get: function () {
                        if (this._zInv === null) {
                            this._zInv = this.z.modInverse(this.curve.p)
                        }
                        return this._zInv
                    }
                });
                Object.defineProperty(Point.prototype, "affineX", {
                    get: function () {
                        return this.x.multiply(this.zInv).mod(this.curve.p)
                    }
                });
                Object.defineProperty(Point.prototype, "affineY", {
                    get: function () {
                        return this.y.multiply(this.zInv).mod(this.curve.p)
                    }
                });
                Point.fromAffine = function (curve, x, y) {
                    return new Point(curve, x, y, BigInteger.ONE)
                };
                Point.prototype.equals = function (other) {
                    if (other === this) return true;
                    if (this.curve.isInfinity(this)) return this.curve.isInfinity(other);
                    if (this.curve.isInfinity(other)) return this.curve.isInfinity(this);
                    var u = other.y.multiply(this.z).subtract(this.y.multiply(other.z)).mod(this.curve.p);
                    if (u.signum() !== 0) return false;
                    var v = other.x.multiply(this.z).subtract(this.x.multiply(other.z)).mod(this.curve.p);
                    return v.signum() === 0
                };
                Point.prototype.negate = function () {
                    var y = this.curve.p.subtract(this.y);
                    return new Point(this.curve, this.x, y, this.z)
                };
                Point.prototype.add = function (b) {
                    if (this.curve.isInfinity(this)) return b;
                    if (this.curve.isInfinity(b)) return this;
                    var x1 = this.x;
                    var y1 = this.y;
                    var x2 = b.x;
                    var y2 = b.y;
                    var u = y2.multiply(this.z).subtract(y1.multiply(b.z)).mod(this.curve.p);
                    var v = x2.multiply(this.z).subtract(x1.multiply(b.z)).mod(this.curve.p);
                    if (v.signum() === 0) {
                        if (u.signum() === 0) {
                            return this.twice()
                        }
                        return this.curve.infinity
                    }
                    var v2 = v.square();
                    var v3 = v2.multiply(v);
                    var x1v2 = x1.multiply(v2);
                    var zu2 = u.square().multiply(this.z);
                    var x3 = zu2.subtract(x1v2.shiftLeft(1)).multiply(b.z).subtract(v3).multiply(v).mod(this.curve.p);
                    var y3 = x1v2.multiply(THREE).multiply(u).subtract(y1.multiply(v3)).subtract(zu2.multiply(u)).multiply(b.z).add(u.multiply(v3)).mod(this.curve.p);
                    var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.p);
                    return new Point(this.curve, x3, y3, z3)
                };
                Point.prototype.twice = function () {
                    if (this.curve.isInfinity(this)) return this;
                    if (this.y.signum() === 0) return this.curve.infinity;
                    var x1 = this.x;
                    var y1 = this.y;
                    var y1z1 = y1.multiply(this.z);
                    var y1sqz1 = y1z1.multiply(y1).mod(this.curve.p);
                    var a = this.curve.a;
                    var w = x1.square().multiply(THREE);
                    if (a.signum() !== 0) {
                        w = w.add(this.z.square().multiply(a))
                    }
                    w = w.mod(this.curve.p);
                    var x3 = w.square().subtract(x1.shiftLeft(3).multiply(y1sqz1)).shiftLeft(1).multiply(y1z1).mod(this.curve.p);
                    var y3 = w.multiply(THREE).multiply(x1).subtract(y1sqz1.shiftLeft(1)).shiftLeft(2).multiply(y1sqz1).subtract(w.pow(3)).mod(this.curve.p);
                    var z3 = y1z1.pow(3).shiftLeft(3).mod(this.curve.p);
                    return new Point(this.curve, x3, y3, z3)
                };
                Point.prototype.multiply = function (k) {
                    if (this.curve.isInfinity(this)) return this;
                    if (k.signum() === 0) return this.curve.infinity;
                    var e = k;
                    var h = e.multiply(THREE);
                    var neg = this.negate();
                    var R = this;
                    for (var i = h.bitLength() - 2; i > 0; --i) {
                        var hBit = h.testBit(i);
                        var eBit = e.testBit(i);
                        R = R.twice();
                        if (hBit !== eBit) {
                            R = R.add(hBit ? this : neg)
                        }
                    }
                    return R
                };
                Point.prototype.multiplyTwo = function (j, x, k) {
                    var i = Math.max(j.bitLength(), k.bitLength()) - 1;
                    var R = this.curve.infinity;
                    var both = this.add(x);
                    while (i >= 0) {
                        var jBit = j.testBit(i);
                        var kBit = k.testBit(i);
                        R = R.twice();
                        if (jBit) {
                            if (kBit) {
                                R = R.add(both)
                            } else {
                                R = R.add(this)
                            }
                        } else if (kBit) {
                            R = R.add(x)
                        }--i
                    }
                    return R
                };
                Point.prototype.getEncoded = function (compressed) {
                    if (compressed == null) compressed = this.compressed;
                    if (this.curve.isInfinity(this)) return new Buffer("00", "hex");
                    var x = this.affineX;
                    var y = this.affineY;
                    var buffer;
                    var byteLength = Math.floor((this.curve.p.bitLength() + 7) / 8);
                    if (compressed) {
                        buffer = new Buffer(1 + byteLength);
                        buffer.writeUInt8(y.isEven() ? 2 : 3, 0)
                    } else {
                        buffer = new Buffer(1 + byteLength + byteLength);
                        buffer.writeUInt8(4, 0);
                        y.toBuffer(byteLength).copy(buffer, 1 + byteLength)
                    }
                    x.toBuffer(byteLength).copy(buffer, 1);
                    return buffer
                };
                Point.decodeFrom = function (curve, buffer) {
                    var type = buffer.readUInt8(0);
                    var compressed = type !== 4;
                    var byteLength = Math.floor((curve.p.bitLength() + 7) / 8);
                    var x = BigInteger.fromBuffer(buffer.slice(1, 1 + byteLength));
                    var Q;
                    if (compressed) {
                        assert.equal(buffer.length, byteLength + 1, "Invalid sequence length");
                        assert(type === 2 || type === 3, "Invalid sequence tag");
                        var isOdd = type === 3;
                        Q = curve.pointFromX(isOdd, x)
                    } else {
                        assert.equal(buffer.length, 1 + byteLength + byteLength, "Invalid sequence length");
                        var y = BigInteger.fromBuffer(buffer.slice(1 + byteLength));
                        Q = Point.fromAffine(curve, x, y)
                    }
                    Q.compressed = compressed;
                    return Q
                };
                Point.prototype.toString = function () {
                    if (this.curve.isInfinity(this)) return "(INFINITY)";
                    return "(" + this.affineX.toString() + "," + this.affineY.toString() + ")"
                };
                module.exports = Point
            }).call(this, require("buffer").Buffer)
        }, {
            assert: 1,
            bigi: 32,
            buffer: 3
        }],
        61: [function (require, module, exports) {
            (function (process, global, Buffer) {
                "use strict";
                function oldBrowser() {
                    throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11")
                }
                var crypto = global.crypto || global.msCrypto;
                if (crypto && crypto.getRandomValues) {
                    module.exports = randomBytes
                } else {
                    module.exports = oldBrowser
                }
                function randomBytes(size, cb) {
                    if (size > 65536) throw new Error("requested too many random bytes");
                    var rawBytes = new global.Uint8Array(size);
                    if (size > 0) {
                        crypto.getRandomValues(rawBytes)
                    }
                    var bytes = new Buffer(rawBytes.buffer);
                    if (typeof cb === "function") {
                        return process.nextTick(function () {
                            cb(null, bytes)
                        })
                    }
                    return bytes
                }
            }).call(this, require("_process"), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer)
        }, {
            _process: 10,
            buffer: 3
        }],
        62: [function (require, module, exports) {
            (function (Buffer) {
                var inherits = require("inherits");
                function TfTypeError(type, value) {
                    this.tfError = Error.call(this);
                    if (arguments.length === 1 && typeof type === "string") {
                        this.message = type
                    } else {
                        this.tfType = type;
                        this.tfValue = value;
                        var message;
                        Object.defineProperty(this, "message", {
                            get: function () {
                                if (message) return message;
                                message = tfErrorString(type, value);
                                return message
                            }
                        })
                    }
                }
                inherits(TfTypeError, Error);
                Object.defineProperty(TfTypeError, "stack", {
                    get: function () {
                        return this.tfError.stack
                    }
                });
                function TfPropertyTypeError(type, property, value, error) {
                    this.tfError = error || Error.call(this);
                    this.tfProperty = property;
                    this.tfType = type;
                    this.tfValue = value;
                    var message;
                    Object.defineProperty(this, "message", {
                        get: function () {
                            if (message) return message;
                            if (type) {
                                message = tfPropertyErrorString(type, property, value)
                            } else {
                                message = 'Unexpected property "' + property + '"'
                            }
                            return message
                        }
                    })
                }
                inherits(TfPropertyTypeError, Error);
                Object.defineProperty(TfPropertyTypeError, "stack", {
                    get: function () {
                        return this.tfError.stack
                    }
                });
                TfPropertyTypeError.prototype.asChildOf = function (property) {
                    return new TfPropertyTypeError(this.tfType, property + "." + this.tfProperty, this.tfValue, this.tfError)
                };
                function getFunctionName(fn) {
                    return fn.name || fn.toString().match(/function (.*?)\s*\(/)[1]
                }
                function getValueTypeName(value) {
                    if (nativeTypes.Null(value)) return "";
                    return getFunctionName(value.constructor)
                }
                function getValue(value) {
                    if (nativeTypes.Function(value)) return "";
                    if (nativeTypes.String(value)) return JSON.stringify(value);
                    if (value && nativeTypes.Object(value)) return "";
                    return value
                }
                function tfJSON(type) {
                    if (nativeTypes.Function(type)) return type.toJSON ? type.toJSON() : getFunctionName(type);
                    if (nativeTypes.Array(type)) return "Array";
                    if (type && nativeTypes.Object(type)) return "Object";
                    return type || ""
                }
                function stfJSON(type) {
                    type = tfJSON(type);
                    return nativeTypes.Object(type) ? JSON.stringify(type) : type
                }
                function tfErrorString(type, value) {
                    var valueTypeName = getValueTypeName(value);
                    var valueValue = getValue(value);
                    return "Expected " + stfJSON(type) + ", got" + (valueTypeName !== "" ? " " + valueTypeName : "") + (valueValue !== "" ? " " + valueValue : "")
                }
                function tfPropertyErrorString(type, name, value) {
                    return tfErrorString('property "' + stfJSON(name) + '" of type ' + stfJSON(type), value)
                }
                var nativeTypes = {
                    Array: function (value) {
                        return value !== null && value !== undefined && value.constructor === Array
                    },
                    Boolean: function (value) {
                        return typeof value === "boolean"
                    },
                    Buffer: function (value) {
                        return Buffer.isBuffer(value)
                    },
                    Function: function (value) {
                        return typeof value === "function"
                    },
                    Null: function (value) {
                        return value === undefined || value === null
                    },
                    Number: function (value) {
                        return typeof value === "number"
                    },
                    Object: function (value) {
                        return typeof value === "object"
                    },
                    String: function (value) {
                        return typeof value === "string"
                    },
                    "": function () {
                        return true
                    }
                };
                var otherTypes = {
                    arrayOf: function arrayOf(type) {
                        function arrayOf(value, strict) {
                            if (!nativeTypes.Array(value)) return false;
                            return value.every(function (x) {
                                return typeforce(type, x, strict, arrayOf)
                            })
                        }
                        arrayOf.toJSON = function () {
                            return [tfJSON(type)]
                        };
                        return arrayOf
                    },
                    maybe: function maybe(type) {
                        function maybe(value, strict) {
                            return nativeTypes.Null(value) || typeforce(type, value, strict, maybe)
                        }
                        maybe.toJSON = function () {
                            return "?" + stfJSON(type)
                        };
                        return maybe
                    },
                    object: function object(type) {
                        function object(value, strict) {
                            if (!nativeTypes.Object(value)) return false;
                            if (nativeTypes.Null(value)) return false;
                            var propertyName;
                            try {
                                for (propertyName in type) {
                                    var propertyType = type[propertyName];
                                    var propertyValue = value[propertyName];
                                    typeforce(propertyType, propertyValue, strict)
                                }
                            } catch (e) {
                                if (e instanceof TfPropertyTypeError) {
                                    throw e.asChildOf(propertyName)
                                } else if (e instanceof TfTypeError) {
                                    throw new TfPropertyTypeError(e.tfType, propertyName, e.tfValue, e.tfError)
                                }
                                throw e
                            }
                            if (strict) {
                                for (propertyName in value) {
                                    if (type[propertyName]) continue;
                                    throw new TfPropertyTypeError(undefined, propertyName)
                                }
                            }
                            return true
                        }
                        object.toJSON = function () {
                            return tfJSON(type)
                        };
                        return object
                    },
                    map: function map(propertyType, propertyKeyType) {
                        function map(value, strict) {
                            typeforce(nativeTypes.Object, value, strict);
                            if (nativeTypes.Null(value)) return false;
                            var propertyName;
                            try {
                                for (propertyName in value) {
                                    if (propertyKeyType) {
                                        typeforce(propertyKeyType, propertyName, strict)
                                    }
                                    var propertyValue = value[propertyName];
                                    typeforce(propertyType, propertyValue, strict)
                                }
                            } catch (e) {
                                if (e instanceof TfPropertyTypeError) {
                                    throw e.asChildOf(propertyName)
                                } else if (e instanceof TfTypeError) {
                                    throw new TfPropertyTypeError(e.tfType, propertyKeyType || propertyName, e.tfValue)
                                }
                                throw e
                            }
                            return true
                        }
                        if (propertyKeyType) {
                            map.toJSON = function () {
                                return "{" + stfJSON(propertyKeyType) + ": " + stfJSON(propertyType) + "}"
                            }
                        } else {
                            map.toJSON = function () {
                                return "{" + stfJSON(propertyType) + "}"
                            }
                        }
                        return map
                    },
                    oneOf: function oneOf() {
                        var types = [].slice.call(arguments);
                        function oneOf(value, strict) {
                            return types.some(function (type) {
                                try {
                                    return typeforce(type, value, strict)
                                } catch (e) {
                                    if (e instanceof TfTypeError || e instanceof TfPropertyTypeError) return false;
                                    throw e
                                }
                            })
                        }
                        oneOf.toJSON = function () {
                            return types.map(stfJSON).join("|")
                        };
                        return oneOf
                    },
                    quacksLike: function quacksLike(type) {
                        function quacksLike(value) {
                            return type === getValueTypeName(value)
                        }
                        quacksLike.toJSON = function () {
                            return type
                        };
                        return quacksLike
                    },
                    tuple: function tuple() {
                        var types = [].slice.call(arguments);
                        function tuple(value, strict) {
                            return types.every(function (type, i) {
                                return typeforce(type, value[i], strict)
                            })
                        }
                        tuple.toJSON = function () {
                            return "(" + types.map(stfJSON).join(", ") + ")"
                        };
                        return tuple
                    },
                    value: function value(expected) {
                        function value(actual) {
                            return actual === expected
                        }
                        value.toJSON = function () {
                            return expected
                        };
                        return value
                    }
                };
                function compile(type) {
                    if (nativeTypes.String(type)) {
                        if (type[0] === "?") return otherTypes.maybe(compile(type.slice(1)));
                        return nativeTypes[type] || otherTypes.quacksLike(type)
                    } else if (type && nativeTypes.Object(type)) {
                        if (nativeTypes.Array(type)) return otherTypes.arrayOf(compile(type[0]));
                        var compiled = {};
                        for (var propertyName in type) {
                            compiled[propertyName] = compile(type[propertyName])
                        }
                        return otherTypes.object(compiled)
                    } else if (nativeTypes.Function(type)) {
                        return type
                    }
                    return otherTypes.value(type)
                }
                function typeforce(type, value, strict, surrogate) {
                    if (nativeTypes.Function(type)) {
                        if (type(value, strict)) return true;
                        throw new TfTypeError(surrogate || type, value)
                    }
                    return typeforce(compile(type), value, strict)
                }
                var typeName;
                Object.keys(nativeTypes).forEach(function (typeName) {
                    var nativeType = nativeTypes[typeName];
                    nativeType.toJSON = function () {
                        return typeName
                    };
                    typeforce[typeName] = nativeType
                });
                for (typeName in otherTypes) {
                    typeforce[typeName] = otherTypes[typeName]
                }
                module.exports = typeforce;
                module.exports.compile = compile;
                module.exports.TfTypeError = TfTypeError;
                module.exports.TfPropertyTypeError = TfPropertyTypeError
            }).call(this, {
                isBuffer: require("is-buffer")
            })
        }, {
            "is-buffer": 9,
            inherits: 63
        }],
        63: [function (require, module, exports) {
            arguments[4][8][0].apply(exports, arguments)
        }, {
            dup: 8
        }],
        64: [function (require, module, exports) {
            (function (Buffer) {
                var bs58check = require("bs58check");
                function decodeRaw(version, buffer) {
                    if (buffer[0] !== version) throw new Error("Invalid network version");
                    if (buffer.length === 34) {
                        if (buffer[33] !== 1) throw new Error("Invalid compression flag");
                        return {
                            version: buffer[0],
                            d: buffer.slice(1, -1),
                            compressed: true
                        }
                    }
                    if (buffer.length !== 33) throw new Error("Invalid WIF length");
                    return {
                        version: buffer[0],
                        d: buffer.slice(1),
                        compressed: false
                    }
                }
                function decode(version, string) {
                    return decodeRaw(version, bs58check.decode(string))
                }
                function encodeRaw(version, d, compressed) {
                    var buffer = new Buffer(compressed ? 34 : 33);
                    buffer.writeUInt8(version, 0);
                    d.copy(buffer, 1);
                    if (compressed) {
                        buffer[33] = 1
                    }
                    return buffer
                }
                function encode(version, d, compressed) {
                    return bs58check.encode(encodeRaw(version, d, compressed))
                }
                module.exports = {
                    decode: decode,
                    decodeRaw: decodeRaw,
                    encode: encode,
                    encodeRaw: encodeRaw
                }
            }).call(this, require("buffer").Buffer)
        }, {
            bs58check: 35,
            buffer: 3
        }],
        65: [function (require, module, exports) {
            (function (Buffer) {
                var bs58check = require("bs58check");
                var bscript = require("./script");
                var networks = require("./networks");
                var typeforce = require("typeforce");
                var types = require("./types");
                function fromBase58Check(address) {
                    var payload = bs58check.decode(address);
                    if (payload.length < 21) throw new TypeError(address + " is too short");
                    if (payload.length > 21) throw new TypeError(address + " is too long");
                    var version = payload[0];
                    var hash = payload.slice(1);
                    return {
                        hash: hash,
                        version: version
                    }
                }
                function fromOutputScript(scriptPubKey, network) {
                    network = network || networks.bitcoin;
                    if (bscript.isPubKeyHashOutput(scriptPubKey)) return toBase58Check(bscript.compile(scriptPubKey).slice(3, 23), network.pubKeyHash);
                    if (bscript.isScriptHashOutput(scriptPubKey)) return toBase58Check(bscript.compile(scriptPubKey).slice(2, 22), network.scriptHash);
                    throw new Error(bscript.toASM(scriptPubKey) + " has no matching Address")
                }
                function toBase58Check(hash, version) {
                    typeforce(types.tuple(types.Hash160bit, types.UInt8), arguments);
                    var payload = new Buffer(21);
                    payload.writeUInt8(version, 0);
                    hash.copy(payload, 1);
                    return bs58check.encode(payload)
                }
                function toOutputScript(address, network) {
                    network = network || networks.bitcoin;
                    var decode = fromBase58Check(address);
                    if (decode.version === network.pubKeyHash) return bscript.pubKeyHashOutput(decode.hash);
                    if (decode.version === network.scriptHash) return bscript.scriptHashOutput(decode.hash);
                    throw new Error(address + " has no matching Script")
                }
                module.exports = {
                    fromBase58Check: fromBase58Check,
                    fromOutputScript: fromOutputScript,
                    toBase58Check: toBase58Check,
                    toOutputScript: toOutputScript
                }
            }).call(this, require("buffer").Buffer)
        }, {
            "./networks": 74,
            "./script": 76,
            "./types": 80,
            bs58check: 35,
            buffer: 3,
            typeforce: 62
        }],
        66: [function (require, module, exports) {
            (function (Buffer) {
                var bufferutils = require("./bufferutils");
                var bcrypto = require("./crypto");
                var compare = require("buffer-compare");
                var Transaction = require("./transaction");
                function Block() {
                    this.version = 1;
                    this.prevHash = null;
                    this.merkleRoot = null;
                    this.timestamp = 0;
                    this.bits = 0;
                    this.nonce = 0
                }
                Block.fromBuffer = function (buffer) {
                    if (buffer.length < 80) throw new Error("Buffer too small (< 80 bytes)");
                    var offset = 0;
                    function readSlice(n) {
                        offset += n;
                        return buffer.slice(offset - n, offset)
                    }
                    function readUInt32() {
                        var i = buffer.readUInt32LE(offset);
                        offset += 4;
                        return i
                    }
                    var block = new Block;
                    block.version = readUInt32();
                    block.prevHash = readSlice(32);
                    block.merkleRoot = readSlice(32);
                    block.timestamp = readUInt32();
                    block.bits = readUInt32();
                    block.nonce = readUInt32();
                    if (buffer.length === 80) return block;
                    function readVarInt() {
                        var vi = bufferutils.readVarInt(buffer, offset);
                        offset += vi.size;
                        return vi.number
                    }
                    function readTransaction() {
                        var tx = Transaction.fromBuffer(buffer.slice(offset), true);
                        offset += tx.byteLength();
                        return tx
                    }
                    var nTransactions = readVarInt();
                    block.transactions = [];
                    for (var i = 0; i < nTransactions; ++i) {
                        var tx = readTransaction();
                        block.transactions.push(tx)
                    }
                    return block
                };
                Block.fromHex = function (hex) {
                    return Block.fromBuffer(new Buffer(hex, "hex"))
                };
                Block.prototype.getHash = function () {
                    return bcrypto.hash256(this.toBuffer(true))
                };
                Block.prototype.getId = function () {
                    return [].reverse.call(this.getHash()).toString("hex")
                };
                Block.prototype.getUTCDate = function () {
                    var date = new Date(0);
                    date.setUTCSeconds(this.timestamp);
                    return date
                };
                Block.prototype.toBuffer = function (headersOnly) {
                    var buffer = new Buffer(80);
                    var offset = 0;
                    function writeSlice(slice) {
                        slice.copy(buffer, offset);
                        offset += slice.length
                    }
                    function writeUInt32(i) {
                        buffer.writeUInt32LE(i, offset);
                        offset += 4
                    }
                    writeUInt32(this.version);
                    writeSlice(this.prevHash);
                    writeSlice(this.merkleRoot);
                    writeUInt32(this.timestamp);
                    writeUInt32(this.bits);
                    writeUInt32(this.nonce);
                    if (headersOnly || !this.transactions) return buffer;
                    var txLenBuffer = bufferutils.varIntBuffer(this.transactions.length);
                    var txBuffers = this.transactions.map(function (tx) {
                        return tx.toBuffer()
                    });
                    return Buffer.concat([buffer, txLenBuffer].concat(txBuffers))
                };
                Block.prototype.toHex = function (headersOnly) {
                    return this.toBuffer(headersOnly).toString("hex")
                };
                Block.calculateTarget = function (bits) {
                    var exponent = ((bits & 4278190080) >> 24) - 3;
                    var mantissa = bits & 8388607;
                    var i = 31 - exponent;
                    var target = new Buffer(32);
                    target.fill(0);
                    target[i] = mantissa & 255;
                    target[i - 1] = mantissa >> 8;
                    target[i - 2] = mantissa >> 16;
                    target[i - 3] = mantissa >> 24;
                    return target
                };
                Block.prototype.checkProofOfWork = function () {
                    var hash = [].reverse.call(this.getHash());
                    var target = Block.calculateTarget(this.bits);
                    return compare(hash, target) <= 0
                };
                module.exports = Block
            }).call(this, require("buffer").Buffer)
        }, {
            "./bufferutils": 67,
            "./crypto": 68,
            "./transaction": 78,
            buffer: 3,
            "buffer-compare": 37
        }],
        67: [function (require, module, exports) {
            (function (Buffer) {
                var opcodes = require("./opcodes");
                function verifuint(value, max) {
                    if (typeof value !== "number") throw new Error("cannot write a non-number as a number");
                    if (value < 0) throw new Error("specified a negative value for writing an unsigned value");
                    if (value > max) throw new Error("value is larger than maximum value for type");
                    if (Math.floor(value) !== value) throw new Error("value has a fractional component")
                }
                function pushDataSize(i) {
                    return i < opcodes.OP_PUSHDATA1 ? 1 : i < 255 ? 2 : i < 65535 ? 3 : 5
                }
                function readPushDataInt(buffer, offset) {
                    var opcode = buffer.readUInt8(offset);
                    var number, size;
                    if (opcode < opcodes.OP_PUSHDATA1) {
                        number = opcode;
                        size = 1
                    } else if (opcode === opcodes.OP_PUSHDATA1) {
                        if (offset + 2 > buffer.length) return null;
                        number = buffer.readUInt8(offset + 1);
                        size = 2
                    } else if (opcode === opcodes.OP_PUSHDATA2) {
                        if (offset + 3 > buffer.length) return null;
                        number = buffer.readUInt16LE(offset + 1);
                        size = 3
                    } else {
                        if (offset + 5 > buffer.length) return null;
                        if (opcode !== opcodes.OP_PUSHDATA4) throw new Error("Unexpected opcode");
                        number = buffer.readUInt32LE(offset + 1);
                        size = 5
                    }
                    return {
                        opcode: opcode,
                        number: number,
                        size: size
                    }
                }
                function readUInt64LE(buffer, offset) {
                    var a = buffer.readUInt32LE(offset);
                    var b = buffer.readUInt32LE(offset + 4);
                    b *= 4294967296;
                    verifuint(b + a, 9007199254740991);
                    return b + a
                }
                function readVarInt(buffer, offset) {
                    var t = buffer.readUInt8(offset);
                    var number, size;
                    if (t < 253) {
                        number = t;
                        size = 1
                    } else if (t < 254) {
                        number = buffer.readUInt16LE(offset + 1);
                        size = 3
                    } else if (t < 255) {
                        number = buffer.readUInt32LE(offset + 1);
                        size = 5
                    } else {
                        number = readUInt64LE(buffer, offset + 1);
                        size = 9
                    }
                    return {
                        number: number,
                        size: size
                    }
                }
                function writePushDataInt(buffer, number, offset) {
                    var size = pushDataSize(number);
                    if (size === 1) {
                        buffer.writeUInt8(number, offset)
                    } else if (size === 2) {
                        buffer.writeUInt8(opcodes.OP_PUSHDATA1, offset);
                        buffer.writeUInt8(number, offset + 1)
                    } else if (size === 3) {
                        buffer.writeUInt8(opcodes.OP_PUSHDATA2, offset);
                        buffer.writeUInt16LE(number, offset + 1)
                    } else {
                        buffer.writeUInt8(opcodes.OP_PUSHDATA4, offset);
                        buffer.writeUInt32LE(number, offset + 1)
                    }
                    return size
                }
                function writeUInt64LE(buffer, value, offset) {
                    verifuint(value, 9007199254740991);
                    buffer.writeInt32LE(value & -1, offset);
                    buffer.writeUInt32LE(Math.floor(value / 4294967296), offset + 4)
                }
                function varIntSize(i) {
                    return i < 253 ? 1 : i < 65536 ? 3 : i < 4294967296 ? 5 : 9
                }
                function writeVarInt(buffer, number, offset) {
                    var size = varIntSize(number);
                    if (size === 1) {
                        buffer.writeUInt8(number, offset)
                    } else if (size === 3) {
                        buffer.writeUInt8(253, offset);
                        buffer.writeUInt16LE(number, offset + 1)
                    } else if (size === 5) {
                        buffer.writeUInt8(254, offset);
                        buffer.writeUInt32LE(number, offset + 1)
                    } else {
                        buffer.writeUInt8(255, offset);
                        writeUInt64LE(buffer, number, offset + 1)
                    }
                    return size
                }
                function varIntBuffer(i) {
                    var size = varIntSize(i);
                    var buffer = new Buffer(size);
                    writeVarInt(buffer, i, 0);
                    return buffer
                }
                module.exports = {
                    equal: require("buffer-equals"),
                    pushDataSize: pushDataSize,
                    readPushDataInt: readPushDataInt,
                    readUInt64LE: readUInt64LE,
                    readVarInt: readVarInt,
                    reverse: require("buffer-reverse"),
                    varIntBuffer: varIntBuffer,
                    varIntSize: varIntSize,
                    writePushDataInt: writePushDataInt,
                    writeUInt64LE: writeUInt64LE,
                    writeVarInt: writeVarInt
                }
            }).call(this, require("buffer").Buffer)
        }, {
            "./opcodes": 75,
            buffer: 3,
            "buffer-equals": 38,
            "buffer-reverse": 39
        }],
        68: [function (require, module, exports) {
            var createHash = require("create-hash");
            function hash160(buffer) {
                return ripemd160(sha256(buffer))
            }
            function hash256(buffer) {
                return sha256(sha256(buffer))
            }
            function ripemd160(buffer) {
                return createHash("rmd160").update(buffer).digest()
            }
            function sha1(buffer) {
                return createHash("sha1").update(buffer).digest()
            }
            function sha256(buffer) {
                return createHash("sha256").update(buffer).digest()
            }
            module.exports = {
                hash160: hash160,
                hash256: hash256,
                ripemd160: ripemd160,
                sha1: sha1,
                sha256: sha256
            }
        }, {
            "create-hash": 40
        }],
        69: [function (require, module, exports) {
            (function (Buffer) {
                var createHmac = require("create-hmac");
                var typeforce = require("typeforce");
                var types = require("./types");
                var BigInteger = require("bigi");
                var ECSignature = require("./ecsignature");
                var ZERO = new Buffer([0]);
                var ONE = new Buffer([1]);
                var ecurve = require("ecurve");
                var secp256k1 = ecurve.getCurveByName("secp256k1");
                function deterministicGenerateK(hash, x, checkSig) {
                    typeforce(types.tuple(types.Hash256bit, types.Buffer256bit, types.Function), arguments);
                    var k = new Buffer(32);
                    var v = new Buffer(32);
                    v.fill(1);
                    k.fill(0);
                    k = createHmac("sha256", k).update(v).update(ZERO).update(x).update(hash).digest();
                    v = createHmac("sha256", k).update(v).digest();
                    k = createHmac("sha256", k).update(v).update(ONE).update(x).update(hash).digest();
                    v = createHmac("sha256", k).update(v).digest();
                    v = createHmac("sha256", k).update(v).digest();
                    var T = BigInteger.fromBuffer(v);
                    while (T.signum() <= 0 || T.compareTo(secp256k1.n) >= 0 || !checkSig(T)) {
                        k = createHmac("sha256", k).update(v).update(ZERO).digest();
                        v = createHmac("sha256", k).update(v).digest();
                        v = createHmac("sha256", k).update(v).digest();
                        T = BigInteger.fromBuffer(v)
                    }
                    return T
                }
                var N_OVER_TWO = secp256k1.n.shiftRight(1);
                function sign(hash, d) {
                    typeforce(types.tuple(types.Hash256bit, types.BigInt), arguments);
                    var x = d.toBuffer(32);
                    var e = BigInteger.fromBuffer(hash);
                    var n = secp256k1.n;
                    var G = secp256k1.G;
                    var r, s;
                    deterministicGenerateK(hash, x, function (k) {
                        var Q = G.multiply(k);
                        if (secp256k1.isInfinity(Q)) return false;
                        r = Q.affineX.mod(n);
                        if (r.signum() === 0) return false;
                        s = k.modInverse(n).multiply(e.add(d.multiply(r))).mod(n);
                        if (s.signum() === 0) return false;
                        return true
                    });
                    if (s.compareTo(N_OVER_TWO) > 0) {
                        s = n.subtract(s)
                    }
                    return new ECSignature(r, s)
                }
                function verify(hash, signature, Q) {
                    typeforce(types.tuple(types.Hash256bit, types.ECSignature, types.ECPoint), arguments);
                    var n = secp256k1.n;
                    var G = secp256k1.G;
                    var r = signature.r;
                    var s = signature.s;
                    if (r.signum() <= 0 || r.compareTo(n) >= 0) return false;
                    if (s.signum() <= 0 || s.compareTo(n) >= 0) return false;
                    var e = BigInteger.fromBuffer(hash);
                    var sInv = s.modInverse(n);
                    var u1 = e.multiply(sInv).mod(n);
                    var u2 = r.multiply(sInv).mod(n);
                    var R = G.multiplyTwo(u1, Q, u2);
                    if (secp256k1.isInfinity(R)) return false;
                    var xR = R.affineX;
                    var v = xR.mod(n);
                    return v.equals(r)
                }
                function recoverPubKey(e, signature, i) {
                    typeforce(types.tuple(types.BigInt, types.ECSignature, types.UInt2), arguments);
                    var n = secp256k1.n;
                    var G = secp256k1.G;
                    var r = signature.r;
                    var s = signature.s;
                    if (r.signum() <= 0 || r.compareTo(n) >= 0) throw new Error("Invalid r value");
                    if (s.signum() <= 0 || s.compareTo(n) >= 0) throw new Error("Invalid s value");
                    var isYOdd = i & 1;
                    var isSecondKey = i >> 1;
                    var x = isSecondKey ? r.add(n) : r;
                    var R = secp256k1.pointFromX(isYOdd, x);
                    var nR = R.multiply(n);
                    if (!secp256k1.isInfinity(nR)) throw new Error("nR is not a valid curve point");
                    var rInv = r.modInverse(n);
                    var eNeg = e.negate().mod(n);
                    var Q = R.multiplyTwo(s, G, eNeg).multiply(rInv);
                    secp256k1.validate(Q);
                    return Q
                }
                function calcPubKeyRecoveryParam(e, signature, Q) {
                    typeforce(types.tuple(types.BigInt, types.ECSignature, types.ECPoint), arguments);
                    for (var i = 0; i < 4; i++) {
                        var Qprime = recoverPubKey(e, signature, i);
                        if (Qprime.equals(Q)) {
                            return i
                        }
                    }
                    throw new Error("Unable to find valid recovery factor")
                }
                module.exports = {
                    calcPubKeyRecoveryParam: calcPubKeyRecoveryParam,
                    deterministicGenerateK: deterministicGenerateK,
                    recoverPubKey: recoverPubKey,
                    sign: sign,
                    verify: verify,
                    __curve: secp256k1
                }
            }).call(this, require("buffer").Buffer)
        }, {
            "./ecsignature": 71,
            "./types": 80,
            bigi: 32,
            buffer: 3,
            "create-hmac": 54,
            ecurve: 58,
            typeforce: 62
        }],
        70: [function (require, module, exports) {
            (function (Buffer) {
                var bcrypto = require("./crypto");
                var bs58check = require("bs58check");
                var ecdsa = require("./ecdsa");
                var randomBytes = require("randombytes");
                var typeforce = require("typeforce");
                var types = require("./types");
                var wif = require("wif");
                var NETWORKS = require("./networks");
                var BigInteger = require("bigi");
                var ecurve = require("ecurve");
                var secp256k1 = ecdsa.__curve;
                function ECPair(d, Q, options) {
                    if (options) {
                        typeforce({
                            compressed: types.maybe(types.Boolean),
                            network: types.maybe(types.Network)
                        }, options)
                    }
                    options = options || {};
                    if (d) {
                        if (d.signum() <= 0) throw new Error("Private key must be greater than 0");
                        if (d.compareTo(secp256k1.n) >= 0) throw new Error("Private key must be less than the curve order");
                        if (Q) throw new TypeError("Unexpected publicKey parameter");
                        this.d = d
                    } else {
                        typeforce(types.ECPoint, Q);
                        this.__Q = Q
                    }
                    this.compressed = options.compressed === undefined ? true : options.compressed;
                    this.network = options.network || NETWORKS.bitcoin
                }
                Object.defineProperty(ECPair.prototype, "Q", {
                    get: function () {
                        if (!this.__Q && this.d) {
                            this.__Q = secp256k1.G.multiply(this.d)
                        }
                        return this.__Q
                    }
                });
                ECPair.fromPublicKeyBuffer = function (buffer, network) {
                    var Q = ecurve.Point.decodeFrom(secp256k1, buffer);
                    return new ECPair(null, Q, {
                        compressed: Q.compressed,
                        network: network
                    })
                };
                ECPair.fromWIF = function (string, network) {
                    network = network || NETWORKS.bitcoin;
                    var buffer = bs58check.decode(string);
                    if (types.Array(network)) {
                        var version = buffer[0];
                        network = network.filter(function (network) {
                            return version === network.wif
                        }).pop() || {}
                    }
                    var decoded = wif.decodeRaw(network.wif, buffer);
                    var d = BigInteger.fromBuffer(decoded.d);
                    return new ECPair(d, null, {
                        compressed: decoded.compressed,
                        network: network
                    })
                };
                ECPair.makeRandom = function (options) {
                    options = options || {};
                    var rng = options.rng || randomBytes;
                    var d;
                    do {
                        var buffer = rng(32);
                        typeforce(types.Buffer256bit, buffer);
                        d = BigInteger.fromBuffer(buffer)
                    } while (d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0);
                    return new ECPair(d, null, options)
                };
                ECPair.prototype.getAddress = function () {
                    var pubKey = this.getPublicKeyBuffer();
                    var pubKeyHash = bcrypto.hash160(pubKey);
                    var payload = new Buffer(21);
                    payload.writeUInt8(this.network.pubKeyHash, 0);
                    pubKeyHash.copy(payload, 1);
                    return bs58check.encode(payload)
                };
                ECPair.prototype.getNetwork = function () {
                    return this.network
                };
                ECPair.prototype.getPublicKeyBuffer = function () {
                    return this.Q.getEncoded(this.compressed)
                };
                ECPair.prototype.sign = function (hash) {
                    if (!this.d) throw new Error("Missing private key");
                    return ecdsa.sign(hash, this.d)
                };
                ECPair.prototype.toWIF = function () {
                    if (!this.d) throw new Error("Missing private key");
                    return wif.encode(this.network.wif, this.d.toBuffer(32), this.compressed)
                };
                ECPair.prototype.verify = function (hash, signature) {
                    return ecdsa.verify(hash, signature, this.Q)
                };
                module.exports = ECPair
            }).call(this, require("buffer").Buffer)
        }, {
            "./crypto": 68,
            "./ecdsa": 69,
            "./networks": 74,
            "./types": 80,
            bigi: 32,
            bs58check: 35,
            buffer: 3,
            ecurve: 58,
            randombytes: 61,
            typeforce: 62,
            wif: 64
        }],
        71: [function (require, module, exports) {
            (function (Buffer) {
                var bip66 = require("bip66");
                var typeforce = require("typeforce");
                var types = require("./types");
                var BigInteger = require("bigi");
                function ECSignature(r, s) {
                    typeforce(types.tuple(types.BigInt, types.BigInt), arguments);
                    this.r = r;
                    this.s = s
                }
                ECSignature.parseCompact = function (buffer) {
                    if (buffer.length !== 65) throw new Error("Invalid signature length");
                    var flagByte = buffer.readUInt8(0) - 27;
                    if (flagByte !== (flagByte & 7)) throw new Error("Invalid signature parameter");
                    var compressed = !!(flagByte & 4);
                    var recoveryParam = flagByte & 3;
                    var r = BigInteger.fromBuffer(buffer.slice(1, 33));
                    var s = BigInteger.fromBuffer(buffer.slice(33));
                    return {
                        compressed: compressed,
                        i: recoveryParam,
                        signature: new ECSignature(r, s)
                    }
                };
                ECSignature.fromDER = function (buffer) {
                    var decode = bip66.decode(buffer);
                    var r = BigInteger.fromDERInteger(decode.r);
                    var s = BigInteger.fromDERInteger(decode.s);
                    return new ECSignature(r, s)
                };
                ECSignature.parseScriptSignature = function (buffer) {
                    var hashType = buffer.readUInt8(buffer.length - 1);
                    var hashTypeMod = hashType & ~128;
                    if (hashTypeMod <= 0 || hashTypeMod >= 4) throw new Error("Invalid hashType " + hashType);
                    return {
                        signature: ECSignature.fromDER(buffer.slice(0, -1)),
                        hashType: hashType
                    }
                };
                ECSignature.prototype.toCompact = function (i, compressed) {
                    if (compressed) {
                        i += 4
                    }
                    i += 27;
                    var buffer = new Buffer(65);
                    buffer.writeUInt8(i, 0);
                    this.r.toBuffer(32).copy(buffer, 1);
                    this.s.toBuffer(32).copy(buffer, 33);
                    return buffer
                };
                ECSignature.prototype.toDER = function () {
                    var r = new Buffer(this.r.toDERInteger());
                    var s = new Buffer(this.s.toDERInteger());
                    return bip66.encode(r, s)
                };
                ECSignature.prototype.toScriptSignature = function (hashType) {
                    var hashTypeMod = hashType & ~128;
                    if (hashTypeMod <= 0 || hashTypeMod >= 4) throw new Error("Invalid hashType " + hashType);
                    var hashTypeBuffer = new Buffer(1);
                    hashTypeBuffer.writeUInt8(hashType, 0);
                    return Buffer.concat([this.toDER(), hashTypeBuffer])
                };
                module.exports = ECSignature
            }).call(this, require("buffer").Buffer)
        }, {
            "./types": 80,
            bigi: 32,
            bip66: 34,
            buffer: 3,
            typeforce: 62
        }],
        72: [function (require, module, exports) {
            (function (Buffer) {
                var base58check = require("bs58check");
                var bcrypto = require("./crypto");
                var createHmac = require("create-hmac");
                var typeforce = require("typeforce");
                var types = require("./types");
                var NETWORKS = require("./networks");
                var BigInteger = require("bigi");
                var ECPair = require("./ecpair");
                var ecurve = require("ecurve");
                var curve = ecurve.getCurveByName("secp256k1");
                function HDNode(keyPair, chainCode) {
                    typeforce(types.tuple("ECPair", types.Buffer256bit), arguments);
                    if (!keyPair.compressed) throw new TypeError("BIP32 only allows compressed keyPairs");
                    this.keyPair = keyPair;
                    this.chainCode = chainCode;
                    this.depth = 0;
                    this.index = 0;
                    this.parentFingerprint = 0
                }
                HDNode.HIGHEST_BIT = 2147483648;
                HDNode.LENGTH = 78;
                HDNode.MASTER_SECRET = new Buffer("Bitcoin seed");
                HDNode.fromSeedBuffer = function (seed, network) {
                    typeforce(types.tuple(types.Buffer, types.maybe(types.Network)), arguments);
                    if (seed.length < 16) throw new TypeError("Seed should be at least 128 bits");
                    if (seed.length > 64) throw new TypeError("Seed should be at most 512 bits");
                    var I = createHmac("sha512", HDNode.MASTER_SECRET).update(seed).digest();
                    var IL = I.slice(0, 32);
                    var IR = I.slice(32);
                    var pIL = BigInteger.fromBuffer(IL);
                    var keyPair = new ECPair(pIL, null, {
                        network: network
                    });
                    return new HDNode(keyPair, IR)
                };
                HDNode.fromSeedHex = function (hex, network) {
                    return HDNode.fromSeedBuffer(new Buffer(hex, "hex"), network)
                };
                HDNode.fromBase58 = function (string, networks) {
                    var buffer = base58check.decode(string);
                    if (buffer.length !== 78) throw new Error("Invalid buffer length");
                    var version = buffer.readUInt32BE(0);
                    var network;
                    if (Array.isArray(networks)) {
                        network = networks.filter(function (network) {
                            return version === network.bip32.private || version === network.bip32.public
                        }).pop() || {}
                    } else {
                        network = networks || NETWORKS.bitcoin
                    }
                    if (version !== network.bip32.private && version !== network.bip32.public) throw new Error("Invalid network");
                    var depth = buffer[4];
                    var parentFingerprint = buffer.readUInt32BE(5);
                    if (depth === 0) {
                        if (parentFingerprint !== 0) throw new Error("Invalid parent fingerprint")
                    }
                    var index = buffer.readUInt32BE(9);
                    if (depth === 0 && index !== 0) throw new Error("Invalid index");
                    var chainCode = buffer.slice(13, 45);
                    var keyPair;
                    if (version === network.bip32.private) {
                        if (buffer.readUInt8(45) !== 0) throw new Error("Invalid private key");
                        var d = BigInteger.fromBuffer(buffer.slice(46, 78));
                        keyPair = new ECPair(d, null, {
                            network: network
                        })
                    } else {
                        var Q = ecurve.Point.decodeFrom(curve, buffer.slice(45, 78));
                        if (!Q.compressed) throw new Error("Invalid public key");
                        curve.validate(Q);
                        keyPair = new ECPair(null, Q, {
                            network: network
                        })
                    }
                    var hd = new HDNode(keyPair, chainCode);
                    hd.depth = depth;
                    hd.index = index;
                    hd.parentFingerprint = parentFingerprint;
                    return hd
                };
                HDNode.prototype.getAddress = function () {
                    return this.keyPair.getAddress()
                };
                HDNode.prototype.getIdentifier = function () {
                    return bcrypto.hash160(this.keyPair.getPublicKeyBuffer())
                };
                HDNode.prototype.getFingerprint = function () {
                    return this.getIdentifier().slice(0, 4)
                };
                HDNode.prototype.getNetwork = function () {
                    return this.keyPair.getNetwork()
                };
                HDNode.prototype.getPublicKeyBuffer = function () {
                    return this.keyPair.getPublicKeyBuffer()
                };
                HDNode.prototype.neutered = function () {
                    var neuteredKeyPair = new ECPair(null, this.keyPair.Q, {
                        network: this.keyPair.network
                    });
                    var neutered = new HDNode(neuteredKeyPair, this.chainCode);
                    neutered.depth = this.depth;
                    neutered.index = this.index;
                    neutered.parentFingerprint = this.parentFingerprint;
                    return neutered
                };
                HDNode.prototype.sign = function (hash) {
                    return this.keyPair.sign(hash)
                };
                HDNode.prototype.verify = function (hash, signature) {
                    return this.keyPair.verify(hash, signature)
                };
                HDNode.prototype.toBase58 = function (__isPrivate) {
                    if (__isPrivate !== undefined) throw new TypeError("Unsupported argument in 2.0.0");
                    var network = this.keyPair.network;
                    var version = this.keyPair.d ? network.bip32.private : network.bip32.public;
                    var buffer = new Buffer(78);
                    buffer.writeUInt32BE(version, 0);
                    buffer.writeUInt8(this.depth, 4);
                    buffer.writeUInt32BE(this.parentFingerprint, 5);
                    buffer.writeUInt32BE(this.index, 9);
                    this.chainCode.copy(buffer, 13);
                    if (this.keyPair.d) {
                        buffer.writeUInt8(0, 45);
                        this.keyPair.d.toBuffer(32).copy(buffer, 46)
                    } else {
                        this.keyPair.getPublicKeyBuffer().copy(buffer, 45)
                    }
                    return base58check.encode(buffer)
                };
                HDNode.prototype.derive = function (index) {
                    var isHardened = index >= HDNode.HIGHEST_BIT;
                    var data = new Buffer(37);
                    if (isHardened) {
                        if (!this.keyPair.d) throw new TypeError("Could not derive hardened child key");
                        data[0] = 0;
                        this.keyPair.d.toBuffer(32).copy(data, 1);
                        data.writeUInt32BE(index, 33)
                    } else {
                        this.keyPair.getPublicKeyBuffer().copy(data, 0);
                        data.writeUInt32BE(index, 33)
                    }
                    var I = createHmac("sha512", this.chainCode).update(data).digest();
                    var IL = I.slice(0, 32);
                    var IR = I.slice(32);
                    var pIL = BigInteger.fromBuffer(IL);
                    if (pIL.compareTo(curve.n) >= 0) {
                        return this.derive(index + 1)
                    }
                    var derivedKeyPair;
                    if (this.keyPair.d) {
                        var ki = pIL.add(this.keyPair.d).mod(curve.n);
                        if (ki.signum() === 0) {
                            return this.derive(index + 1)
                        }
                        derivedKeyPair = new ECPair(ki, null, {
                            network: this.keyPair.network
                        })
                    } else {
                        var Ki = curve.G.multiply(pIL).add(this.keyPair.Q);
                        if (curve.isInfinity(Ki)) {
                            return this.derive(index + 1)
                        }
                        derivedKeyPair = new ECPair(null, Ki, {
                            network: this.keyPair.network
                        })
                    }
                    var hd = new HDNode(derivedKeyPair, IR);
                    hd.depth = this.depth + 1;
                    hd.index = index;
                    hd.parentFingerprint = this.getFingerprint().readUInt32BE(0);
                    return hd
                };
                HDNode.prototype.deriveHardened = function (index) {
                    return this.derive(index + HDNode.HIGHEST_BIT)
                };
                HDNode.prototype.toString = HDNode.prototype.toBase58;
                module.exports = HDNode
            }).call(this, require("buffer").Buffer)
        }, {
            "./crypto": 68,
            "./ecpair": 70,
            "./networks": 74,
            "./types": 80,
            bigi: 32,
            bs58check: 35,
            buffer: 3,
            "create-hmac": 54,
            ecurve: 58,
            typeforce: 62
        }],
        73: [function (require, module, exports) {
            (function (Buffer) {
                var bufferutils = require("./bufferutils");
                var bcrypto = require("./crypto");
                var ecdsa = require("./ecdsa");
                var networks = require("./networks");
                var BigInteger = require("bigi");
                var ECPair = require("./ecpair");
                var ECSignature = require("./ecsignature");
                function magicHash(message, network) {
                    var messagePrefix = new Buffer(network.messagePrefix);
                    var messageBuffer = new Buffer(message);
                    var lengthBuffer = bufferutils.varIntBuffer(messageBuffer.length);
                    var buffer = Buffer.concat([messagePrefix, lengthBuffer, messageBuffer]);
                    return bcrypto.hash256(buffer)
                }
                function sign(keyPair, message, network) {
                    network = network || networks.bitcoin;
                    var hash = magicHash(message, network);
                    var signature = keyPair.sign(hash);
                    var e = BigInteger.fromBuffer(hash);
                    var i = ecdsa.calcPubKeyRecoveryParam(e, signature, keyPair.Q);
                    return signature.toCompact(i, keyPair.compressed)
                }
                function verify(address, signature, message, network) {
                    if (!Buffer.isBuffer(signature)) {
                        signature = new Buffer(signature, "base64")
                    }
                    network = network || networks.bitcoin;
                    var hash = magicHash(message, network);
                    var parsed = ECSignature.parseCompact(signature);
                    var e = BigInteger.fromBuffer(hash);
                    var Q = ecdsa.recoverPubKey(e, parsed.signature, parsed.i);
                    var keyPair = new ECPair(null, Q, {
                        compressed: parsed.compressed,
                        network: network
                    });
                    return keyPair.getAddress() === address
                }
                module.exports = {
                    magicHash: magicHash,
                    sign: sign,
                    verify: verify
                }
            }).call(this, require("buffer").Buffer)
        }, {
            "./bufferutils": 67,
            "./crypto": 68,
            "./ecdsa": 69,
            "./ecpair": 70,
            "./ecsignature": 71,
            "./networks": 74,
            bigi: 32,
            buffer: 3
        }],
        74: [function (require, module, exports) {
            module.exports = {
                bitcoin: {
                    messagePrefix: "Bitcoin Signed Message:\n",
                    bip32: {
                        "public": 76067358,
                        "private": 76066276
                    },
                    pubKeyHash: 0,
                    scriptHash: 5,
                    wif: 128,
                    dustThreshold: 546
                },
                testnet: {
                    messagePrefix: "Bitcoin Signed Message:\n",
                    bip32: {
                        "public": 70617039,
                        "private": 70615956
                    },
                    pubKeyHash: 111,
                    scriptHash: 196,
                    wif: 239,
                    dustThreshold: 546
                },
                litecoin: {
                    messagePrefix: "Litecoin Signed Message:\n",
                    bip32: {
                        "public": 27108450,
                        "private": 27106558
                    },
                    pubKeyHash: 48,
                    scriptHash: 5,
                    wif: 176,
                    dustThreshold: 0
                },
                dogecoin: {
                    messagePrefix: "Dogecoin Signed Message:\n",
                    bip32: {
                        "public": 49990397,
                        "private": 49988504
                    },
                    pubKeyHash: 30,
                    scriptHash: 22,
                    wif: 158,
                    dustThreshold: 0
                }
            }
        }, {}],
        75: [function (require, module, exports) {
            module.exports = {
                OP_FALSE: 0,
                OP_0: 0,
                OP_PUSHDATA1: 76,
                OP_PUSHDATA2: 77,
                OP_PUSHDATA4: 78,
                OP_1NEGATE: 79,
                OP_RESERVED: 80,
                OP_1: 81,
                OP_TRUE: 81,
                OP_2: 82,
                OP_3: 83,
                OP_4: 84,
                OP_5: 85,
                OP_6: 86,
                OP_7: 87,
                OP_8: 88,
                OP_9: 89,
                OP_10: 90,
                OP_11: 91,
                OP_12: 92,
                OP_13: 93,
                OP_14: 94,
                OP_15: 95,
                OP_16: 96,
                OP_NOP: 97,
                OP_VER: 98,
                OP_IF: 99,
                OP_NOTIF: 100,
                OP_VERIF: 101,
                OP_VERNOTIF: 102,
                OP_ELSE: 103,
                OP_ENDIF: 104,
                OP_VERIFY: 105,
                OP_RETURN: 106,
                OP_TOALTSTACK: 107,
                OP_FROMALTSTACK: 108,
                OP_2DROP: 109,
                OP_2DUP: 110,
                OP_3DUP: 111,
                OP_2OVER: 112,
                OP_2ROT: 113,
                OP_2SWAP: 114,
                OP_IFDUP: 115,
                OP_DEPTH: 116,
                OP_DROP: 117,
                OP_DUP: 118,
                OP_NIP: 119,
                OP_OVER: 120,
                OP_PICK: 121,
                OP_ROLL: 122,
                OP_ROT: 123,
                OP_SWAP: 124,
                OP_TUCK: 125,
                OP_CAT: 126,
                OP_SUBSTR: 127,
                OP_LEFT: 128,
                OP_RIGHT: 129,
                OP_SIZE: 130,
                OP_INVERT: 131,
                OP_AND: 132,
                OP_OR: 133,
                OP_XOR: 134,
                OP_EQUAL: 135,
                OP_EQUALVERIFY: 136,
                OP_RESERVED1: 137,
                OP_RESERVED2: 138,
                OP_1ADD: 139,
                OP_1SUB: 140,
                OP_2MUL: 141,
                OP_2DIV: 142,
                OP_NEGATE: 143,
                OP_ABS: 144,
                OP_NOT: 145,
                OP_0NOTEQUAL: 146,
                OP_ADD: 147,
                OP_SUB: 148,
                OP_MUL: 149,
                OP_DIV: 150,
                OP_MOD: 151,
                OP_LSHIFT: 152,
                OP_RSHIFT: 153,
                OP_BOOLAND: 154,
                OP_BOOLOR: 155,
                OP_NUMEQUAL: 156,
                OP_NUMEQUALVERIFY: 157,
                OP_NUMNOTEQUAL: 158,
                OP_LESSTHAN: 159,
                OP_GREATERTHAN: 160,
                OP_LESSTHANOREQUAL: 161,
                OP_GREATERTHANOREQUAL: 162,
                OP_MIN: 163,
                OP_MAX: 164,
                OP_WITHIN: 165,
                OP_RIPEMD160: 166,
                OP_SHA1: 167,
                OP_SHA256: 168,
                OP_HASH160: 169,
                OP_HASH256: 170,
                OP_CODESEPARATOR: 171,
                OP_CHECKSIG: 172,
                OP_CHECKSIGVERIFY: 173,
                OP_CHECKMULTISIG: 174,
                OP_CHECKMULTISIGVERIFY: 175,
                OP_NOP1: 176,
                OP_NOP2: 177,
                OP_CHECKLOCKTIMEVERIFY: 177,
                OP_NOP3: 178,
                OP_NOP4: 179,
                OP_NOP5: 180,
                OP_NOP6: 181,
                OP_NOP7: 182,
                OP_NOP8: 183,
                OP_NOP9: 184,
                OP_NOP10: 185,
                OP_PUBKEYHASH: 253,
                OP_PUBKEY: 254,
                OP_INVALIDOPCODE: 255
            }
        }, {}],
        76: [function (require, module, exports) {
            (function (Buffer) {
                var bip66 = require("bip66");
                var bufferutils = require("./bufferutils");
                var typeforce = require("typeforce");
                var types = require("./types");
                var OPS = require("./opcodes");
                var REVERSE_OPS = function () {
                    var result = {};
                    for (var op in OPS) {
                        var code = OPS[op];
                        result[code] = op
                    }
                    return result
                }();
                var OP_INT_BASE = OPS.OP_RESERVED;
                function toASM(chunks) {
                    if (Buffer.isBuffer(chunks)) {
                        chunks = decompile(chunks)
                    }
                    return chunks.map(function (chunk) {
                        if (Buffer.isBuffer(chunk)) return chunk.toString("hex");
                        return REVERSE_OPS[chunk]
                    }).join(" ")
                }
                function fromASM(asm) {
                    typeforce(types.String, asm);
                    return compile(asm.split(" ").map(function (chunkStr) {
                        if (OPS[chunkStr] !== undefined) return OPS[chunkStr];
                        return new Buffer(chunkStr, "hex")
                    }))
                }
                function compile(chunks) {
                    if (Buffer.isBuffer(chunks)) return chunks;
                    typeforce(types.Array, chunks);
                    var bufferSize = chunks.reduce(function (accum, chunk) {
                        if (Buffer.isBuffer(chunk)) {
                            return accum + bufferutils.pushDataSize(chunk.length) + chunk.length
                        }
                        return accum + 1
                    }, 0);
                    var buffer = new Buffer(bufferSize);
                    var offset = 0;
                    chunks.forEach(function (chunk) {
                        if (Buffer.isBuffer(chunk)) {
                            offset += bufferutils.writePushDataInt(buffer, chunk.length, offset);
                            chunk.copy(buffer, offset);
                            offset += chunk.length
                        } else {
                            buffer.writeUInt8(chunk, offset);
                            offset += 1
                        }
                    });
                    if (offset !== buffer.length) throw new Error("Could not decode chunks");
                    return buffer
                }
                function decompile(buffer) {
                    if (types.Array(buffer)) return buffer;
                    typeforce(types.Buffer, buffer);
                    var chunks = [];
                    var i = 0;
                    while (i < buffer.length) {
                        var opcode = buffer[i];
                        if (opcode > OPS.OP_0 && opcode <= OPS.OP_PUSHDATA4) {
                            var d = bufferutils.readPushDataInt(buffer, i);
                            if (d === null) return [];
                            i += d.size;
                            if (i + d.number > buffer.length) return [];
                            var data = buffer.slice(i, i + d.number);
                            i += d.number;
                            chunks.push(data)
                        } else {
                            chunks.push(opcode);
                            i += 1
                        }
                    }
                    return chunks
                }
                function isCanonicalPubKey(buffer) {
                    if (!Buffer.isBuffer(buffer)) return false;
                    if (buffer.length < 33) return false;
                    switch (buffer[0]) {
                    case 2:
                    case 3:
                        return buffer.length === 33;
                    case 4:
                        return buffer.length === 65
                    }
                    return false
                }
                function isCanonicalSignature(buffer) {
                    if (!Buffer.isBuffer(buffer)) return false;
                    if (!isDefinedHashType(buffer[buffer.length - 1])) return false;
                    return bip66.check(buffer.slice(0, -1))
                }
                function isDefinedHashType(hashType) {
                    var hashTypeMod = hashType & ~128;
                    return hashTypeMod > 0 && hashTypeMod < 4
                }
                function isPubKeyHashInput(script) {
                    var chunks = decompile(script);
                    return chunks.length === 2 && isCanonicalSignature(chunks[0]) && isCanonicalPubKey(chunks[1])
                }
                function isPubKeyHashOutput(script) {
                    var buffer = compile(script);
                    return buffer.length === 25 && buffer[0] === OPS.OP_DUP && buffer[1] === OPS.OP_HASH160 && buffer[2] === 20 && buffer[23] === OPS.OP_EQUALVERIFY && buffer[24] === OPS.OP_CHECKSIG
                }
                function isPubKeyInput(script) {
                    var chunks = decompile(script);
                    return chunks.length === 1 && isCanonicalSignature(chunks[0])
                }
                function isPubKeyOutput(script) {
                    var chunks = decompile(script);
                    return chunks.length === 2 && isCanonicalPubKey(chunks[0]) && chunks[1] === OPS.OP_CHECKSIG
                }
                function isScriptHashInput(script, allowIncomplete) {
                    var chunks = decompile(script);
                    if (chunks.length < 2) return false;
                    var lastChunk = chunks[chunks.length - 1];
                    if (!Buffer.isBuffer(lastChunk)) return false;
                    var scriptSigChunks = chunks.slice(0, -1);
                    var redeemScriptChunks = decompile(lastChunk);
                    if (redeemScriptChunks.length === 0) return false;
                    return classifyInput(scriptSigChunks, allowIncomplete) === classifyOutput(redeemScriptChunks)
                }
                function isScriptHashOutput(script) {
                    var buffer = compile(script);
                    return buffer.length === 23 && buffer[0] === OPS.OP_HASH160 && buffer[1] === 20 && buffer[22] === OPS.OP_EQUAL
                }
                function isMultisigInput(script, allowIncomplete) {
                    var chunks = decompile(script);
                    if (chunks.length < 2) return false;
                    if (chunks[0] !== OPS.OP_0) return false;
                    if (allowIncomplete) {
                        return chunks.slice(1).every(function (chunk) {
                            return chunk === OPS.OP_0 || isCanonicalSignature(chunk)
                        })
                    }
                    return chunks.slice(1).every(isCanonicalSignature)
                }
                function isMultisigOutput(script) {
                    var chunks = decompile(script);
                    if (chunks.length < 4) return false;
                    if (chunks[chunks.length - 1] !== OPS.OP_CHECKMULTISIG) return false;
                    var mOp = chunks[0];
                    var nOp = chunks[chunks.length - 2];
                    if (!types.Number(mOp)) return false;
                    if (!types.Number(nOp)) return false;
                    var m = mOp - OP_INT_BASE;
                    var n = nOp - OP_INT_BASE;
                    if (m <= 0) return false;
                    if (m > n) return false;
                    if (n > 16) return false;
                    if (n !== chunks.length - 3) return false;
                    return chunks.slice(1, -2).every(isCanonicalPubKey)
                }
                function isNullDataOutput(script) {
                    var chunks = decompile(script);
                    return chunks[0] === OPS.OP_RETURN
                }
                function classifyOutput(script) {
                    var chunks = decompile(script);
                    if (isPubKeyHashOutput(chunks)) {
                        return "pubkeyhash"
                    } else if (isScriptHashOutput(chunks)) {
                        return "scripthash"
                    } else if (isMultisigOutput(chunks)) {
                        return "multisig"
                    } else if (isPubKeyOutput(chunks)) {
                        return "pubkey"
                    } else if (isNullDataOutput(chunks)) {
                        return "nulldata"
                    }
                    return "nonstandard"
                }
                function classifyInput(script, allowIncomplete) {
                    var chunks = decompile(script);
                    if (isPubKeyHashInput(chunks)) {
                        return "pubkeyhash"
                    } else if (isMultisigInput(chunks, allowIncomplete)) {
                        return "multisig"
                    } else if (isScriptHashInput(chunks, allowIncomplete)) {
                        return "scripthash"
                    } else if (isPubKeyInput(chunks)) {
                        return "pubkey"
                    }
                    return "nonstandard"
                }
                function pubKeyOutput(pubKey) {
                    return compile([pubKey, OPS.OP_CHECKSIG])
                }
                function pubKeyHashOutput(pubKeyHash) {
                    typeforce(types.Hash160bit, pubKeyHash);
                    return compile([OPS.OP_DUP, OPS.OP_HASH160, pubKeyHash, OPS.OP_EQUALVERIFY, OPS.OP_CHECKSIG])
                }
                function scriptHashOutput(scriptHash) {
                    typeforce(types.Hash160bit, scriptHash);
                    return compile([OPS.OP_HASH160, scriptHash, OPS.OP_EQUAL])
                }
                function multisigOutput(m, pubKeys) {
                    typeforce(types.tuple(types.Number, [types.Buffer]), arguments);
                    var n = pubKeys.length;
                    if (n < m) throw new Error("Not enough pubKeys provided");
                    return compile([].concat(OP_INT_BASE + m, pubKeys, OP_INT_BASE + n, OPS.OP_CHECKMULTISIG))
                }
                function pubKeyInput(signature) {
                    typeforce(types.Buffer, signature);
                    return compile([signature])
                }
                function pubKeyHashInput(signature, pubKey) {
                    typeforce(types.tuple(types.Buffer, types.Buffer), arguments);
                    return compile([signature, pubKey])
                }
                function scriptHashInput(scriptSig, scriptPubKey) {
                    var scriptSigChunks = decompile(scriptSig);
                    var serializedScriptPubKey = compile(scriptPubKey);
                    return compile([].concat(scriptSigChunks, serializedScriptPubKey))
                }
                function multisigInput(signatures, scriptPubKey) {
                    if (scriptPubKey) {
                        var chunks = decompile(scriptPubKey);
                        if (!isMultisigOutput(chunks)) throw new Error("Expected multisig scriptPubKey");
                        var mOp = chunks[0];
                        var nOp = chunks[chunks.length - 2];
                        var m = mOp - OP_INT_BASE;
                        var n = nOp - OP_INT_BASE;
                        if (signatures.length < m) throw new Error("Not enough signatures provided");
                        if (signatures.length > n) throw new Error("Too many signatures provided")
                    }
                    return compile([].concat(OPS.OP_0, signatures))
                }
                function nullDataOutput(data) {
                    return compile([OPS.OP_RETURN, data])
                }
                module.exports = {
                    compile: compile,
                    decompile: decompile,
                    fromASM: fromASM,
                    toASM: toASM,
                    number: require("./script_number"),
                    isCanonicalPubKey: isCanonicalPubKey,
                    isCanonicalSignature: isCanonicalSignature,
                    isDefinedHashType: isDefinedHashType,
                    isPubKeyHashInput: isPubKeyHashInput,
                    isPubKeyHashOutput: isPubKeyHashOutput,
                    isPubKeyInput: isPubKeyInput,
                    isPubKeyOutput: isPubKeyOutput,
                    isScriptHashInput: isScriptHashInput,
                    isScriptHashOutput: isScriptHashOutput,
                    isMultisigInput: isMultisigInput,
                    isMultisigOutput: isMultisigOutput,
                    isNullDataOutput: isNullDataOutput,
                    classifyOutput: classifyOutput,
                    classifyInput: classifyInput,
                    pubKeyOutput: pubKeyOutput,
                    pubKeyHashOutput: pubKeyHashOutput,
                    scriptHashOutput: scriptHashOutput,
                    multisigOutput: multisigOutput,
                    pubKeyInput: pubKeyInput,
                    pubKeyHashInput: pubKeyHashInput,
                    scriptHashInput: scriptHashInput,
                    multisigInput: multisigInput,
                    nullDataOutput: nullDataOutput
                }
            }).call(this, require("buffer").Buffer)
        }, {
            "./bufferutils": 67,
            "./opcodes": 75,
            "./script_number": 77,
            "./types": 80,
            bip66: 34,
            buffer: 3,
            typeforce: 62
        }],
        77: [function (require, module, exports) {
            (function (Buffer) {
                function decode(buffer, maxLength, minimal) {
                    maxLength = maxLength || 4;
                    minimal = minimal === undefined ? true : minimal;
                    var length = buffer.length;
                    if (length === 0) return 0;
                    if (length > maxLength) throw new TypeError("Script number overflow");
                    if (minimal) {
                        if ((buffer[length - 1] & 127) === 0) {
                            if (length <= 1 || (buffer[length - 2] & 128) === 0) throw new Error("Non-minimally encoded script number")
                        }
                    }
                    if (length === 5) {
                        var a = buffer.readUInt32LE(0);
                        var b = buffer.readUInt8(4);
                        if (b & 128) return -((b & ~128) * 4294967296 + a);
                        return b * 4294967296 + a
                    }
                    var result = 0;
                    for (var i = 0; i < length; ++i) {
                        result |= buffer[i] << 8 * i
                    }
                    if (buffer[length - 1] & 128) return -(result & ~(128 << 8 * (length - 1)));
                    return result
                }
                function scriptNumSize(i) {
                    return i > 2147483647 ? 5 : i > 8388607 ? 4 : i > 32767 ? 3 : i > 127 ? 2 : i > 0 ? 1 : 0
                }
                function encode(number) {
                    var value = Math.abs(number);
                    var size = scriptNumSize(value);
                    var buffer = new Buffer(size);
                    var negative = number < 0;
                    for (var i = 0; i < size; ++i) {
                        buffer.writeUInt8(value & 255, i);
                        value >>= 8
                    }
                    if (buffer[size - 1] & 128) {
                        buffer.writeUInt8(negative ? 128 : 0, size - 1)
                    } else if (negative) {
                        buffer[size - 1] |= 128
                    }
                    return buffer
                }
                module.exports = {
                    decode: decode,
                    encode: encode
                }
            }).call(this, require("buffer").Buffer)
        }, {
            buffer: 3
        }],
        78: [function (require, module, exports) {
            (function (Buffer) {
                var bcrypto = require("./crypto");
                var bscript = require("./script");
                var bufferutils = require("./bufferutils");
                var opcodes = require("./opcodes");
                var typeforce = require("typeforce");
                var types = require("./types");
                function Transaction() {
                    this.version = 1;
                    this.locktime = 0;
                    this.ins = [];
                    this.outs = []
                }
                Transaction.DEFAULT_SEQUENCE = 4294967295;
                Transaction.SIGHASH_ALL = 1;
                Transaction.SIGHASH_NONE = 2;
                Transaction.SIGHASH_SINGLE = 3;
                Transaction.SIGHASH_ANYONECANPAY = 128;
                Transaction.fromBuffer = function (buffer, __noStrict) {
                    var offset = 0;
                    function readSlice(n) {
                        offset += n;
                        return buffer.slice(offset - n, offset)
                    }
                    function readUInt32() {
                        var i = buffer.readUInt32LE(offset);
                        offset += 4;
                        return i
                    }
                    function readUInt64() {
                        var i = bufferutils.readUInt64LE(buffer, offset);
                        offset += 8;
                        return i
                    }
                    function readVarInt() {
                        var vi = bufferutils.readVarInt(buffer, offset);
                        offset += vi.size;
                        return vi.number
                    }
                    function readScript() {
                        return readSlice(readVarInt())
                    }
                    var tx = new Transaction;
                    tx.version = readUInt32();
                    var vinLen = readVarInt();
                    for (var i = 0; i < vinLen; ++i) {
                        tx.ins.push({
                            hash: readSlice(32),
                            index: readUInt32(),
                            script: readScript(),
                            sequence: readUInt32()
                        })
                    }
                    var voutLen = readVarInt();
                    for (i = 0; i < voutLen; ++i) {
                        tx.outs.push({
                            value: readUInt64(),
                            script: readScript()
                        })
                    }
                    tx.locktime = readUInt32();
                    if (__noStrict) return tx;
                    if (offset !== buffer.length) throw new Error("Transaction has unexpected data");
                    return tx
                };
                Transaction.fromHex = function (hex) {
                    return Transaction.fromBuffer(new Buffer(hex, "hex"))
                };
                Transaction.isCoinbaseHash = function (buffer) {
                    return Array.prototype.every.call(buffer, function (x) {
                        return x === 0
                    })
                };
                var EMPTY_SCRIPT = new Buffer(0);
                Transaction.prototype.addInput = function (hash, index, sequence, scriptSig) {
                    typeforce(types.tuple(types.Hash256bit, types.UInt32, types.maybe(types.UInt32), types.maybe(types.Buffer)), arguments);
                    if (types.Null(sequence)) {
                        sequence = Transaction.DEFAULT_SEQUENCE
                    }
                    return this.ins.push({
                        hash: hash,
                        index: index,
                        script: scriptSig || EMPTY_SCRIPT,
                        sequence: sequence
                    }) - 1
                };
                Transaction.prototype.addOutput = function (scriptPubKey, value) {
                    typeforce(types.tuple(types.Buffer, types.UInt53), arguments);
                    return this.outs.push({
                        script: scriptPubKey,
                        value: value
                    }) - 1
                };
                Transaction.prototype.byteLength = function () {
                    function scriptSize(someScript) {
                        var length = someScript.length;
                        return bufferutils.varIntSize(length) + length
                    }
                    return 8 + bufferutils.varIntSize(this.ins.length) + bufferutils.varIntSize(this.outs.length) + this.ins.reduce(function (sum, input) {
                        return sum + 40 + scriptSize(input.script)
                    }, 0) + this.outs.reduce(function (sum, output) {
                        return sum + 8 + scriptSize(output.script)
                    }, 0)
                };
                Transaction.prototype.clone = function () {
                    var newTx = new Transaction;
                    newTx.version = this.version;
                    newTx.locktime = this.locktime;
                    newTx.ins = this.ins.map(function (txIn) {
                        return {
                            hash: txIn.hash,
                            index: txIn.index,
                            script: txIn.script,
                            sequence: txIn.sequence
                        }
                    });
                    newTx.outs = this.outs.map(function (txOut) {
                        return {
                            script: txOut.script,
                            value: txOut.value
                        }
                    });
                    return newTx
                };
                var ONE = new Buffer("0000000000000000000000000000000000000000000000000000000000000001", "hex");
                var VALUE_UINT64_MAX = new Buffer("ffffffffffffffff", "hex");
                Transaction.prototype.hashForSignature = function (inIndex, prevOutScript, hashType) {
                    typeforce(types.tuple(types.UInt32, types.Buffer, types.Number), arguments);
                    if (inIndex >= this.ins.length) return ONE;
                    var txTmp = this.clone();
                    var hashScript = bscript.compile(bscript.decompile(prevOutScript).filter(function (x) {
                        return x !== opcodes.OP_CODESEPARATOR
                    }));
                    var i;
                    txTmp.ins.forEach(function (input) {
                        input.script = EMPTY_SCRIPT
                    });
                    txTmp.ins[inIndex].script = hashScript;
                    if ((hashType & 31) === Transaction.SIGHASH_NONE) {
                        txTmp.outs = [];
                        txTmp.ins.forEach(function (input, i) {
                            if (i !== inIndex) {
                                input.sequence = 0
                            }
                        })
                    } else if ((hashType & 31) === Transaction.SIGHASH_SINGLE) {
                        var nOut = inIndex;
                        if (nOut >= this.outs.length) return ONE;
                        txTmp.outs = txTmp.outs.slice(0, nOut + 1);
                        var stubOut = {
                            script: EMPTY_SCRIPT,
                            valueBuffer: VALUE_UINT64_MAX
                        };
                        for (i = 0; i < nOut; i++) {
                            txTmp.outs[i] = stubOut
                        }
                        txTmp.ins.forEach(function (input, i) {
                            if (i !== inIndex) {
                                input.sequence = 0
                            }
                        })
                    }
                    if (hashType & Transaction.SIGHASH_ANYONECANPAY) {
                        txTmp.ins[0] = txTmp.ins[inIndex];
                        txTmp.ins = txTmp.ins.slice(0, 1)
                    }
                    var buffer = new Buffer(txTmp.byteLength() + 4);
                    buffer.writeInt32LE(hashType, buffer.length - 4);
                    txTmp.toBuffer().copy(buffer, 0);
                    return bcrypto.hash256(buffer)
                };
                Transaction.prototype.getHash = function () {
                    return bcrypto.hash256(this.toBuffer())
                };
                Transaction.prototype.getId = function () {
                    return [].reverse.call(this.getHash()).toString("hex")
                };
                Transaction.prototype.toBuffer = function () {
                    var buffer = new Buffer(this.byteLength());
                    var offset = 0;
                    function writeSlice(slice) {
                        slice.copy(buffer, offset);
                        offset += slice.length
                    }
                    function writeUInt32(i) {
                        buffer.writeUInt32LE(i, offset);
                        offset += 4
                    }
                    function writeUInt64(i) {
                        bufferutils.writeUInt64LE(buffer, i, offset);
                        offset += 8
                    }
                    function writeVarInt(i) {
                        var n = bufferutils.writeVarInt(buffer, i, offset);
                        offset += n
                    }
                    writeUInt32(this.version);
                    writeVarInt(this.ins.length);
                    this.ins.forEach(function (txIn) {
                        writeSlice(txIn.hash);
                        writeUInt32(txIn.index);
                        writeVarInt(txIn.script.length);
                        writeSlice(txIn.script);
                        writeUInt32(txIn.sequence)
                    });
                    writeVarInt(this.outs.length);
                    this.outs.forEach(function (txOut) {
                        if (!txOut.valueBuffer) {
                            writeUInt64(txOut.value)
                        } else {
                            writeSlice(txOut.valueBuffer)
                        }
                        writeVarInt(txOut.script.length);
                        writeSlice(txOut.script)
                    });
                    writeUInt32(this.locktime);
                    return buffer
                };
                Transaction.prototype.toHex = function () {
                    return this.toBuffer().toString("hex")
                };
                Transaction.prototype.setInputScript = function (index, scriptSig) {
                    typeforce(types.tuple(types.Number, types.Buffer), arguments);
                    this.ins[index].script = scriptSig
                };
                module.exports = Transaction
            }).call(this, require("buffer").Buffer)
        }, {
            "./bufferutils": 67,
            "./crypto": 68,
            "./opcodes": 75,
            "./script": 76,
            "./types": 80,
            buffer: 3,
            typeforce: 62
        }],
        79: [function (require, module, exports) {
            (function (Buffer) {
                var baddress = require("./address");
                var bcrypto = require("./crypto");
                var bscript = require("./script");
                var bufferEquals = require("buffer-equals");
                var networks = require("./networks");
                var ops = require("./opcodes");
                var typeforce = require("typeforce");
                var types = require("./types");
                var ECPair = require("./ecpair");
                var ECSignature = require("./ecsignature");
                var Transaction = require("./transaction");
                function fixMSSignatures(transaction, vin, pubKeys, signatures, prevOutScript, hashType, skipPubKey) {
                    var unmatched = signatures.slice();
                    var cache = {};
                    return pubKeys.map(function (pubKey) {
                        if (skipPubKey && bufferEquals(skipPubKey, pubKey)) return undefined;
                        var matched;
                        var keyPair2 = ECPair.fromPublicKeyBuffer(pubKey);
                        unmatched.some(function (signature, i) {
                            if (!signature) return false;
                            var signatureHash = cache[hashType] = cache[hashType] || transaction.hashForSignature(vin, prevOutScript, hashType);
                            if (!keyPair2.verify(signatureHash, signature)) return false;
                            unmatched[i] = undefined;
                            matched = signature;
                            return true
                        });
                        return matched || undefined
                    })
                }
                function extractInput(transaction, txIn, vin) {
                    var redeemScript;
                    var scriptSig = txIn.script;
                    var scriptSigChunks = bscript.decompile(scriptSig);
                    var prevOutScript;
                    var prevOutType = bscript.classifyInput(scriptSig, true);
                    var scriptType;
                    if (prevOutType === "scripthash") {
                        redeemScript = scriptSigChunks.slice(-1)[0];
                        prevOutScript = bscript.scriptHashOutput(bcrypto.hash160(redeemScript));
                        scriptSig = bscript.compile(scriptSigChunks.slice(0, -1));
                        scriptSigChunks = scriptSigChunks.slice(0, -1);
                        scriptType = bscript.classifyInput(scriptSig, true)
                    } else {
                        scriptType = prevOutType
                    }
                    var redeemScriptChunks;
                    if (redeemScript) {
                        redeemScriptChunks = bscript.decompile(redeemScript)
                    }
                    var hashType, parsed, pubKeys, signatures;
                    switch (scriptType) {
                    case "pubkeyhash":
                        parsed = ECSignature.parseScriptSignature(scriptSigChunks[0]);
                        hashType = parsed.hashType;
                        pubKeys = scriptSigChunks.slice(1);
                        signatures = [parsed.signature];
                        prevOutScript = bscript.pubKeyHashOutput(bcrypto.hash160(pubKeys[0]));
                        break;
                    case "pubkey":
                        parsed = ECSignature.parseScriptSignature(scriptSigChunks[0]);
                        hashType = parsed.hashType;
                        signatures = [parsed.signature];
                        if (redeemScript) {
                            pubKeys = redeemScriptChunks.slice(0, 1)
                        }
                        break;
                    case "multisig":
                        signatures = scriptSigChunks.slice(1).map(function (chunk) {
                            if (chunk === ops.OP_0) return undefined;
                            var parsed = ECSignature.parseScriptSignature(chunk);
                            hashType = parsed.hashType;
                            return parsed.signature
                        });
                        if (redeemScript) {
                            pubKeys = redeemScriptChunks.slice(1, -2);
                            if (pubKeys.length !== signatures.length) {
                                signatures = fixMSSignatures(transaction, vin, pubKeys, signatures, redeemScript, hashType, redeemScript)
                            }
                        }
                        break
                    }
                    return {
                        hashType: hashType,
                        prevOutScript: prevOutScript,
                        prevOutType: prevOutType,
                        pubKeys: pubKeys,
                        redeemScript: redeemScript,
                        scriptType: scriptType,
                        signatures: signatures
                    }
                }
                function TransactionBuilder(network) {
                    this.prevTxMap = {};
                    this.prevOutScripts = {};
                    this.prevOutTypes = {};
                    this.network = network || networks.bitcoin;
                    this.inputs = [];
                    this.tx = new Transaction
                }
                TransactionBuilder.prototype.setLockTime = function (locktime) {
                    typeforce(types.UInt32, locktime);
                    if (this.inputs.some(function (input) {
                            if (!input.signatures) return false;
                            return input.signatures.some(function (s) {
                                return s
                            })
                        })) {
                        throw new Error("No, this would invalidate signatures")
                    }
                    this.tx.locktime = locktime
                };
                TransactionBuilder.fromTransaction = function (transaction, network) {
                    var txb = new TransactionBuilder(network);
                    txb.tx.version = transaction.version;
                    txb.tx.locktime = transaction.locktime;
                    transaction.ins.forEach(function (txIn) {
                        txb.addInput(txIn.hash, txIn.index, txIn.sequence)
                    });
                    transaction.outs.forEach(function (txOut) {
                        txb.addOutput(txOut.script, txOut.value)
                    });
                    txb.inputs = transaction.ins.map(function (txIn, vin) {
                        if (Transaction.isCoinbaseHash(txIn.hash)) {
                            throw new Error("coinbase inputs not supported")
                        }
                        if (txIn.script.length === 0) return {};
                        return extractInput(transaction, txIn, vin)
                    });
                    return txb
                };
                TransactionBuilder.prototype.addInput = function (txHash, vout, sequence, prevOutScript) {
                    if (typeof txHash === "string") {
                        txHash = [].reverse.call(new Buffer(txHash, "hex"))
                    } else if (txHash instanceof Transaction) {
                        prevOutScript = txHash.outs[vout].script;
                        txHash = txHash.getHash()
                    }
                    var input = {};
                    if (prevOutScript) {
                        var prevOutScriptChunks = bscript.decompile(prevOutScript);
                        var prevOutType = bscript.classifyOutput(prevOutScriptChunks);
                        switch (prevOutType) {
                        case "multisig":
                            input.pubKeys = prevOutScriptChunks.slice(1, -2);
                            input.signatures = input.pubKeys.map(function () {
                                return undefined
                            });
                            break;
                        case "pubkey":
                            input.pubKeys = prevOutScriptChunks.slice(0, 1);
                            input.signatures = [undefined];
                            break
                        }
                        if (prevOutType !== "scripthash") {
                            input.scriptType = prevOutType
                        }
                        input.prevOutScript = prevOutScript;
                        input.prevOutType = prevOutType
                    }
                    if (!this.inputs.every(function (otherInput) {
                            if (otherInput.hashType === undefined) return true;
                            return otherInput.hashType & Transaction.SIGHASH_ANYONECANPAY
                        })) {
                        throw new Error("No, this would invalidate signatures")
                    }
                    var prevOut = txHash.toString("hex") + ":" + vout;
                    if (this.prevTxMap[prevOut]) throw new Error("Transaction is already an input");
                    var vin = this.tx.addInput(txHash, vout, sequence);
                    this.inputs[vin] = input;
                    this.prevTxMap[prevOut] = vin;
                    return vin
                };
                TransactionBuilder.prototype.addOutput = function (scriptPubKey, value) {
                    var nOutputs = this.tx.outs.length;
                    if (!this.inputs.every(function (input, index) {
                            if (input.hashType === undefined) return true;
                            var hashTypeMod = input.hashType & 31;
                            if (hashTypeMod === Transaction.SIGHASH_NONE) return true;
                            if (hashTypeMod === Transaction.SIGHASH_SINGLE) {
                                return index < nOutputs
                            }
                            return false
                        })) {
                        throw new Error("No, this would invalidate signatures")
                    }
                    if (typeof scriptPubKey === "string") {
                        scriptPubKey = baddress.toOutputScript(scriptPubKey, this.network)
                    }
                    return this.tx.addOutput(scriptPubKey, value)
                };
                TransactionBuilder.prototype.build = function () {
                    return this.__build(false)
                };
                TransactionBuilder.prototype.buildIncomplete = function () {
                    return this.__build(true)
                };
                var canBuildTypes = {
                    multisig: true,
                    pubkey: true,
                    pubkeyhash: true
                };
                TransactionBuilder.prototype.__build = function (allowIncomplete) {
                    if (!allowIncomplete) {
                        if (!this.tx.ins.length) throw new Error("Transaction has no inputs");
                        if (!this.tx.outs.length) throw new Error("Transaction has no outputs")
                    }
                    var tx = this.tx.clone();
                    this.inputs.forEach(function (input, index) {
                        var scriptType = input.scriptType;
                        var scriptSig;
                        if (!allowIncomplete) {
                            if (!scriptType) throw new Error("Transaction is not complete");
                            if (!canBuildTypes[scriptType]) throw new Error(scriptType + " not supported");
                            if (!input.signatures) throw new Error("Transaction is missing signatures")
                        }
                        if (input.signatures) {
                            switch (scriptType) {
                            case "pubkeyhash":
                                var pkhSignature = input.signatures[0].toScriptSignature(input.hashType);
                                scriptSig = bscript.pubKeyHashInput(pkhSignature, input.pubKeys[0]);
                                break;
                            case "multisig":
                                var msSignatures = input.signatures.map(function (signature) {
                                    return signature && signature.toScriptSignature(input.hashType)
                                });
                                if (allowIncomplete) {
                                    for (var i = 0; i < msSignatures.length; ++i) {
                                        msSignatures[i] = msSignatures[i] || ops.OP_0
                                    }
                                } else {
                                    msSignatures = msSignatures.filter(function (x) {
                                        return x
                                    })
                                }
                                var redeemScript = allowIncomplete ? undefined : input.redeemScript;
                                scriptSig = bscript.multisigInput(msSignatures, redeemScript);
                                break;
                            case "pubkey":
                                var pkSignature = input.signatures[0].toScriptSignature(input.hashType);
                                scriptSig = bscript.pubKeyInput(pkSignature);
                                break
                            }
                        }
                        if (scriptSig) {
                            if (input.prevOutType === "scripthash") {
                                scriptSig = bscript.scriptHashInput(scriptSig, input.redeemScript)
                            }
                            tx.setInputScript(index, scriptSig)
                        }
                    });
                    return tx
                };
                TransactionBuilder.prototype.sign = function (index, keyPair, redeemScript, hashType) {
                    if (keyPair.network !== this.network) throw new Error("Inconsistent network");
                    if (!this.inputs[index]) throw new Error("No input at index: " + index);
                    hashType = hashType || Transaction.SIGHASH_ALL;
                    var input = this.inputs[index];
                    var canSign = input.hashType && input.prevOutScript && input.prevOutType && input.pubKeys && input.scriptType && input.signatures && input.signatures.length === input.pubKeys.length;
                    var kpPubKey = keyPair.getPublicKeyBuffer();
                    if (canSign) {
                        if (redeemScript) {
                            if (!bufferEquals(input.redeemScript, redeemScript)) throw new Error("Inconsistent redeemScript")
                        }
                        if (input.hashType !== hashType) throw new Error("Inconsistent hashType")
                    } else {
                        if (redeemScript) {
                            if (input.prevOutScript) {
                                if (input.prevOutType !== "scripthash") throw new Error("PrevOutScript must be P2SH");
                                var scriptHash = bscript.decompile(input.prevOutScript)[1];
                                if (!bufferEquals(scriptHash, bcrypto.hash160(redeemScript))) throw new Error("RedeemScript does not match " + scriptHash.toString("hex"))
                            }
                            var scriptType = bscript.classifyOutput(redeemScript);
                            var redeemScriptChunks = bscript.decompile(redeemScript);
                            var pubKeys;
                            switch (scriptType) {
                            case "multisig":
                                pubKeys = redeemScriptChunks.slice(1, -2);
                                break;
                            case "pubkeyhash":
                                var pkh1 = redeemScriptChunks[2];
                                var pkh2 = bcrypto.hash160(keyPair.getPublicKeyBuffer());
                                if (!bufferEquals(pkh1, pkh2)) throw new Error("privateKey cannot sign for this input");
                                pubKeys = [kpPubKey];
                                break;
                            case "pubkey":
                                pubKeys = redeemScriptChunks.slice(0, 1);
                                break;
                            default:
                                throw new Error("RedeemScript not supported (" + scriptType + ")")
                            }
                            if (!input.prevOutScript) {
                                input.prevOutScript = bscript.scriptHashOutput(bcrypto.hash160(redeemScript));
                                input.prevOutType = "scripthash"
                            }
                            input.pubKeys = pubKeys;
                            input.redeemScript = redeemScript;
                            input.scriptType = scriptType;
                            input.signatures = pubKeys.map(function () {
                                return undefined
                            })
                        } else {
                            if (input.prevOutType === "scripthash") throw new Error("PrevOutScript is P2SH, missing redeemScript");
                            if (!input.scriptType) {
                                input.prevOutScript = bscript.pubKeyHashOutput(bcrypto.hash160(keyPair.getPublicKeyBuffer()));
                                input.prevOutType = "pubkeyhash";
                                input.pubKeys = [kpPubKey];
                                input.scriptType = input.prevOutType;
                                input.signatures = [undefined]
                            } else {
                                if (!input.pubKeys || !input.signatures) throw new Error(input.scriptType + " not supported")
                            }
                        }
                        input.hashType = hashType
                    }
                    var signatureScript = input.redeemScript || input.prevOutScript;
                    var signatureHash = this.tx.hashForSignature(index, signatureScript, hashType);
                    var valid = input.pubKeys.some(function (pubKey, i) {
                        if (!bufferEquals(kpPubKey, pubKey)) return false;
                        if (input.signatures[i]) throw new Error("Signature already exists");
                        var signature = keyPair.sign(signatureHash);
                        input.signatures[i] = signature;
                        return true
                    });
                    if (!valid) throw new Error("Key pair cannot sign for this input")
                };
                module.exports = TransactionBuilder
            }).call(this, require("buffer").Buffer)
        }, {
            "./address": 65,
            "./crypto": 68,
            "./ecpair": 70,
            "./ecsignature": 71,
            "./networks": 74,
            "./opcodes": 75,
            "./script": 76,
            "./transaction": 78,
            "./types": 80,
            buffer: 3,
            "buffer-equals": 38,
            typeforce: 62
        }],
        80: [function (require, module, exports) {
            var typeforce = require("typeforce");
            function nBuffer(value, n) {
                typeforce(types.Buffer, value);
                if (value.length !== n) throw new typeforce.TfTypeError("Expected " + n * 8 + "-bit Buffer, got " + value.length * 8 + "-bit Buffer");
                return true
            }
            function Hash160bit(value) {
                return nBuffer(value, 20)
            }
            function Hash256bit(value) {
                return nBuffer(value, 32)
            }
            function Buffer256bit(value) {
                return nBuffer(value, 32)
            }
            var UINT53_MAX = Math.pow(2, 53) - 1;
            function UInt2(value) {
                return (value & 3) === value
            }
            function UInt8(value) {
                return (value & 255) === value
            }
            function UInt32(value) {
                return value >>> 0 === value
            }
            function UInt53(value) {
                return typeforce.Number(value) && value >= 0 && value <= UINT53_MAX && Math.floor(value) === value
            }
            var BigInt = typeforce.quacksLike("BigInteger");
            var ECPoint = typeforce.quacksLike("Point");
            var ECSignature = typeforce.compile({
                r: BigInt,
                s: BigInt
            });
            var Network = typeforce.compile({
                messagePrefix: typeforce.oneOf(typeforce.Buffer, typeforce.String),
                bip32: {
                    "public": UInt32,
                    "private": UInt32
                },
                pubKeyHash: UInt8,
                scriptHash: UInt8,
                wif: UInt8,
                dustThreshold: UInt53
            });
            var types = {
                BigInt: BigInt,
                Buffer256bit: Buffer256bit,
                ECPoint: ECPoint,
                ECSignature: ECSignature,
                Hash160bit: Hash160bit,
                Hash256bit: Hash256bit,
                Network: Network,
                UInt2: UInt2,
                UInt8: UInt8,
                UInt32: UInt32,
                UInt53: UInt53
            };
            for (var typeName in typeforce) {
                types[typeName] = typeforce[typeName]
            }
            module.exports = types
        }, {
            typeforce: 62
        }],
        "bitcoinjs-lib": [function (require, module, exports) {
            module.exports = {
                Block: require("./block"),
                ECPair: require("./ecpair"),
                ECSignature: require("./ecsignature"),
                HDNode: require("./hdnode"),
                Transaction: require("./transaction"),
                TransactionBuilder: require("./transaction_builder"),
                address: require("./address"),
                bufferutils: require("./bufferutils"),
                crypto: require("./crypto"),
                message: require("./message"),
                networks: require("./networks"),
                opcodes: require("./opcodes"),
                script: require("./script")
            }
        }, {
            "./address": 65,
            "./block": 66,
            "./bufferutils": 67,
            "./crypto": 68,
            "./ecpair": 70,
            "./ecsignature": 71,
            "./hdnode": 72,
            "./message": 73,
            "./networks": 74,
            "./opcodes": 75,
            "./script": 76,
            "./transaction": 78,
            "./transaction_builder": 79
        }]
    }, {}, [])("bitcoinjs-lib")
});
