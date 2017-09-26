(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultHeaders = exports.buildArr = exports.buildStr = exports.msgid2Orig = exports.getMsgid = undefined;
exports.makePluralFunc = makePluralFunc;
exports.getPluralFunc = getPluralFunc;
exports.transformTranslateObj = transformTranslateObj;
exports.dedentIfConfig = dedentIfConfig;

var _dedent = __webpack_require__(1);

var _dedent2 = _interopRequireDefault(_dedent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMsgid = exports.getMsgid = function getMsgid(str, exprs) {
    return str.reduce(function (s, l, i) {
        return s + l + (exprs[i] !== undefined && '${ ' + i + ' }' || '');
    }, '');
};

var mem = {};
var memoize1 = function memoize1(f) {
    return function (arg) {
        if (mem[arg]) {
            return mem[arg];
        }
        mem[arg] = f(arg);
        return mem[arg];
    };
};

var reg = function reg(i) {
    return new RegExp('\\$\\{([\\s]+?|\\s?)' + i + '([\\s]+?|\\s?)}');
};
var memReg = memoize1(reg);

var msgid2Orig = exports.msgid2Orig = function msgid2Orig(id, exprs) {
    return exprs.reduce(function (r, expr, i) {
        return r.replace(memReg(i), expr);
    }, id);
};

var buildStr = exports.buildStr = function buildStr(strs, exprs) {
    return strs.reduce(function (r, s, i) {
        return r + s + (exprs[i] !== undefined ? exprs[i] : '');
    }, '');
};

var buildArr = exports.buildArr = function buildArr(strs, exprs) {
    return strs.reduce(function (r, s, i) {
        return exprs[i] !== undefined ? r.concat(s, exprs[i]) : r.concat(s);
    }, []);
};

function pluralFnBody(pluralStr) {
    return 'return args[+ (' + pluralStr + ')];';
}

var fnCache = {};
function makePluralFunc(pluralStr) {
    /* eslint-disable no-new-func */
    var fn = fnCache[pluralStr];
    if (!fn) {
        fn = new Function('n', 'args', pluralFnBody(pluralStr));
        fnCache[pluralStr] = fn;
    }
    return fn;
}

var pluralRegex = /\splural ?=?([\s\S]*);?/;
function getPluralFunc(headers) {
    var pluralFn = pluralRegex.exec(headers['plural-forms'])[1];
    if (pluralFn[pluralFn.length - 1] === ';') {
        pluralFn = pluralFn.slice(0, -1);
    }
    return pluralFn;
}

var defaultHeaders = exports.defaultHeaders = {
    'content-type': 'text/plain; charset=UTF-8',
    'plural-forms': 'nplurals=2; plural=(n!=1);'
};

var variableREG = /\$\{ \w+(.\w+)* \}/g;

function getObjectKeys(obj) {
    var keys = [];
    for (var key in obj) {
        // eslint-disable-line no-restricted-syntax
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}

function replaceVariables(str, obj) {
    return str.replace(variableREG, function (variable) {
        return '${ ' + obj[variable] + ' }';
    });
}

function transformTranslate(translate) {
    var variables = translate.msgid.match(variableREG);
    if (!variables) {
        return translate;
    }

    var variableNumberMap = {};
    variables.forEach(function (variable, i) {
        variableNumberMap[variable] = i;
    });

    var msgid = replaceVariables(translate.msgid, variableNumberMap);

    var newTranslate = { msgid: msgid };

    if (translate.msgid_plural) {
        newTranslate.msgid_plural = replaceVariables(translate.msgid_plural, variableNumberMap);
    }

    newTranslate.msgstr = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = translate.msgstr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var str = _step.value;

            newTranslate.msgstr.push(replaceVariables(str, variableNumberMap));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    newTranslate.comments = translate.comments;
    return newTranslate;
}

function transformTranslateObj(translateObj) {
    var newTranslations = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = getObjectKeys(translateObj.translations)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            var translation = translateObj.translations[key];
            var newTranslation = {};
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = getObjectKeys(translation)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var msgid = _step3.value;

                    var newTranslate = transformTranslate(translation[msgid]);
                    newTranslation[newTranslate.msgid] = newTranslate;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            newTranslations[key] = newTranslation;
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    translateObj.translations = newTranslations;
    return translateObj;
}

function dedentIfConfig(config, rawStr) {
    if (!config || !config.dedent) {
        return rawStr;
    }

    if (!(typeof rawStr === 'string')) {
        return rawStr;
    }

    if (rawStr.indexOf('\n') === -1) {
        return rawStr;
    }

    return (0, _dedent2.default)(rawStr);
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function dedent(strings) {

  var raw = void 0;
  if (typeof strings === "string") {
    // dedent can be used as a plain function
    raw = [strings];
  } else {
    raw = strings.raw;
  }

  // first, perform interpolation
  var result = "";
  for (var i = 0; i < raw.length; i++) {
    result += raw[i].
    // join lines when there is a suppressed newline
    replace(/\\\n[ \t]*/g, "").

    // handle escaped backticks
    replace(/\\`/g, "`");

    if (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
      result += arguments.length <= i + 1 ? undefined : arguments[i + 1];
    }
  }

  // now strip indentation
  var lines = result.split("\n");
  var mindent = null;
  lines.forEach(function (l) {
    var m = l.match(/^(\s+)\S+/);
    if (m) {
      var indent = m[1].length;
      if (!mindent) {
        // this is the first indented line
        mindent = indent;
      } else {
        mindent = Math.min(mindent, indent);
      }
    }
  });

  if (mindent !== null) {
    result = lines.map(function (l) {
      return l[0] === " " ? l.slice(mindent) : l;
    }).join("\n");
  }

  // dedent eats leading and trailing whitespace too
  result = result.trim();

  // handle escaped newlines at the end to ensure they don't get stripped too
  return result.replace(/\\n/g, "\n");
}

if (true) {
  module.exports = dedent;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.tWithLocale = tWithLocale;
exports.t = t;
exports.jtWithLocale = jtWithLocale;
exports.jt = jt;
exports.msgid = msgid;
exports.gettext = gettext;
exports.ngettextWithLocale = ngettextWithLocale;
exports.ngettext = ngettext;
exports.addLocale = addLocale;
exports.useLocale = useLocale;
exports.setDedent = setDedent;
exports.setDefaultHeaders = setDefaultHeaders;
exports.setHeaders = setHeaders;

var _utils = __webpack_require__(0);

var config = {
    locales: {},
    currentLocale: 'en',
    dedent: true,
    headers: _utils.defaultHeaders
};

function isFuzzy(translationObj) {
    return translationObj && translationObj.comments && translationObj.comments.flag === 'fuzzy';
}

function findTransObj(locale, str) {
    var locales = config.locales;

    var translation = locales[locale] && locales[locale].translations[''][str];
    return translation && !isFuzzy(translation) ? translation : null;
}

function maybeDedent(str) {
    return config.dedent ? (0, _utils.dedentIfConfig)(config, str) : str;
}

function tWithLocale(locale, strings) {
    var result = strings;
    if (strings && strings.reduce) {
        for (var _len = arguments.length, exprs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            exprs[_key - 2] = arguments[_key];
        }

        var id = maybeDedent((0, _utils.getMsgid)(strings, exprs));
        var transObj = findTransObj(locale, id);
        result = transObj ? (0, _utils.msgid2Orig)(transObj.msgstr[0], exprs) : (0, _utils.buildStr)(strings, exprs);
    }
    return maybeDedent(result);
}

function t(strings) {
    for (var _len2 = arguments.length, exprs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        exprs[_key2 - 1] = arguments[_key2];
    }

    return tWithLocale.apply(undefined, [config.currentLocale, strings].concat(exprs));
}

var separator = /(\${\s*\d+\s*})/g;
var slotIdRegexp = /\${\s*(\d+)\s*}/;

function jtWithLocale(locale, strings) {
    for (var _len3 = arguments.length, exprs = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        exprs[_key3 - 2] = arguments[_key3];
    }

    if (strings && strings.reduce) {
        var id = (0, _utils.getMsgid)(strings, exprs);
        var transObj = findTransObj(locale, id);
        if (!transObj) return (0, _utils.buildArr)(strings, exprs);

        // splits string & capturing group into tokens
        //
        var translatedTokens = transObj.msgstr[0].split(separator);

        return translatedTokens.map(function (token) {
            var slotIdMatch = token.match(slotIdRegexp);
            // slotIdMatch is not null only when the token is a variable slot (${xx})
            return slotIdMatch ? exprs[+slotIdMatch[1]] : token;
        });
    }
    return strings;
}

function jt(strings) {
    for (var _len4 = arguments.length, exprs = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        exprs[_key4 - 1] = arguments[_key4];
    }

    return jtWithLocale.apply(undefined, [config.currentLocale, strings].concat(exprs));
}

function msgid(strings) {
    /* eslint-disable no-new-wrappers */
    if (strings && strings.reduce) {
        for (var _len5 = arguments.length, exprs = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            exprs[_key5 - 1] = arguments[_key5];
        }

        var result = new String((0, _utils.buildStr)(strings, exprs));
        result._strs = strings;
        result._exprs = exprs;
        return result;
    }

    return strings;
}

function gettext(id) {
    var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var transObj = findTransObj(locale || config.currentLocale, id);
    return transObj ? transObj.msgstr[0] : id;
}

function ngettextWithLocale(_ref) {
    var currentLocale = _ref.currentLocale,
        locales = _ref.locales;

    for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
    }

    var id = maybeDedent((0, _utils.getMsgid)(args[0]._strs, args[0]._exprs));
    var n = args[args.length - 1];
    var trans = findTransObj(currentLocale, id);
    var headers = trans ? locales[currentLocale].headers : config.headers;
    var pluralStr = (0, _utils.getPluralFunc)(headers);
    var pluralFn = (0, _utils.makePluralFunc)(pluralStr);
    var result = void 0;
    if (!trans) {
        var forms = args.slice(1, -1);
        forms.unshift(args[0].toString());
        result = pluralFn(n, forms);
    } else {
        result = (0, _utils.msgid2Orig)(pluralFn(n, trans.msgstr), args[0]._exprs);
    }

    return maybeDedent(result);
}

function ngettext() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
    }

    return ngettextWithLocale.apply(undefined, [config].concat(args));
}

function addLocale(locale, data) {
    var replaceVariablesNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (replaceVariablesNames) {
        data = (0, _utils.transformTranslateObj)(data);
    }
    config.locales[locale] = data;
}

function useLocale(locale) {
    config.currentLocale = locale;
}

function setDedent(value) {
    config.dedent = Boolean(value);
}

function setDefaultHeaders(headers) {
    config.headers = headers;
}

function setHeaders(headers) {
    /* eslint-disable no-console */
    (console.warn || console.log)('[DEPRECATED] setHeaders is deprecated, and will be removed in the' + ' next minor version 0.6, use setDefaultHeaders instead');
    setDefaultHeaders(headers);
}

/***/ })
/******/ ]);
});