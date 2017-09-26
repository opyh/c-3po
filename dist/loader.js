'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.loadFile = loadFile;
exports.loadLocale = loadLocale;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gettextParser = require('gettext-parser');

var _gettextParser2 = _interopRequireDefault(_gettextParser);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadFile(filepath) {
    var fileContent = _fs2.default.readFileSync(filepath);
    if (_path2.default.extname(filepath) === '.mo') {
        return _gettextParser2.default.mo.parse(fileContent);
    }

    if (_path2.default.extname(filepath) === '.po') {
        return _gettextParser2.default.po.parse(fileContent);
    }

    throw new Error('Unsupported filetype ' + filepath);
}

function loadLocale(locale, filepath) {
    var replaceVariablesNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (typeof filepath === 'string') {
        return (0, _index.addLocale)(locale, loadFile(filepath), replaceVariablesNames);
    }

    if (filepath && (typeof filepath === 'undefined' ? 'undefined' : _typeof(filepath)) === 'object' && filepath.translations && filepath.headers) {
        return (0, _index.addLocale)(locale, filepath, replaceVariablesNames);
    }

    throw new Error('Unsupported filetype ' + filepath);
}