/*
 * Uniter - JavaScript PHP interpreter
 * Copyright 2013 Dan Phillimore (asmblah)
 * http://asmblah.github.com/uniter/
 *
 * Released under the MIT license
 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
 */

/*global define */
define([
    'js/util',
    'js/Exception',
    'js/Promise'
], function (
    util,
    Exception,
    Promise
) {
    'use strict';

    function Engine(parser, interpreter, options) {
        this.interpreter = interpreter;
        this.options = options;
        this.parser = parser;
    }

    util.extend(Engine.prototype, {
        execute: function (code) {
            var ast,
                engine = this,
                promise = new Promise();

            try {
                ast = engine.parser.parse(code);
                engine.interpreter.interpret(ast).done(function (value, type) {
                    promise.resolve(value, type);
                }).fail(function (exception) {
                    promise.reject(exception);
                });
            } catch (exception) {
                if (!(exception instanceof Exception)) {
                    throw exception;
                }
                promise.reject(exception);
            }

            return promise;
        },

        expose: function (object, name) {
            this.interpreter.expose(object, name);
        },

        getEnvironment: function () {
            return this.interpreter.getEnvironment();
        },

        getStderr: function () {
            return this.interpreter.stderr;
        },

        getStdin: function () {
            return this.interpreter.stdin;
        },

        getStdout: function () {
            return this.interpreter.stdout;
        }
    });

    return Engine;
});
