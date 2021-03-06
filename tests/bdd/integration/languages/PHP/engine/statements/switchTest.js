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
    '../tools',
    '../../tools',
    'js/util'
], function (
    engineTools,
    phpTools,
    util
) {
    'use strict';

    describe('PHP Engine switch statement integration', function () {
        var engine;

        function check(scenario) {
            engineTools.check(function () {
                return {
                    engine: engine
                };
            }, scenario);
        }

        beforeEach(function () {
            engine = phpTools.createEngine();
        });

        util.each({
            'empty switch statement with no cases': {
                code: util.heredoc(function (/*<<<EOS
<?php
    switch (null) {}

    echo 'done';
EOS
*/) {}),
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: 'done'
            },
            'switch statement with no cases - still check that expression is evaluated': {
                code: util.heredoc(function (/*<<<EOS
<?php
    switch ($a = 21) {}

    echo 'a is ' . $a;
EOS
*/) {}),
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: 'a is 21'
            },
            'switch statement with one matched and one unmatched case': {
                code: util.heredoc(function (/*<<<EOS
<?php
    switch (7) {
    case 6:
        echo 'nope, six';
    case 7:
        echo 'yep, seven';
    }

    echo ' - done';
EOS
*/) {}),
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: 'yep, seven - done'
            },
            'switch statement with one matched (with break) and two unmatched cases': {
                code: util.heredoc(function (/*<<<EOS
<?php
    switch (7) {
    case 6:
        echo 'nope, six';
    case 7:
        echo 'yep, seven';
        break;
    case 8:
        echo 'nope, eight';
    }

    echo ' - done';
EOS
*/) {}),
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: 'yep, seven - done'
            },
            'switch statement with deliberate fallthrough': {
                code: util.heredoc(function (/*<<<EOS
<?php
    switch (7) {
    case 6:
        echo 'nope, six';
    case 7:
        echo 'yep, seven - ';
    case 8:
        echo 'yep, eight';
    }

    echo ' - done';
EOS
*/) {}),
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: 'yep, seven - yep, eight - done'
            }
        }, function (scenario, description) {
            describe(description, function () {
                check(scenario);
            });
        });
    });
});
