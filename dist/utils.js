'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultHeaders = exports.buildArr = exports.buildStr = exports.msgid2Orig = exports.getMsgid = undefined;
exports.makePluralFunc = makePluralFunc;
exports.getPluralFunc = getPluralFunc;
exports.transformTranslateObj = transformTranslateObj;
exports.dedentIfConfig = dedentIfConfig;

var _dedent = require('dedent');

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