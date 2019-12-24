"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isPlainObject;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fnToString = function fnToString(fn) {
  return Function.prototype.toString.call(fn);
};
/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */


function isPlainObject(obj) {
  if (!obj || _typeof(obj) !== 'object') {
    return false;
  }

  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

  if (proto === null) {
    return true;
  }

  var constructor = proto.constructor;
  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === fnToString(Object);
}
//# sourceMappingURL=isPlainObject.js.map