'use strict';

const _ = require('lodash');
const async = require('async');

const configs = require('./configs');
const cloudformation = require('./cloudformation');
const lambda = require('./lambda');

//
// Update the stacks.
//
module.exports = function(params) {
    console.log('/////////////////////////');
    console.log('// DEPLOY');
    console.log('/////////////////////////');
    console.log('');

    params.deploy = "true";

    async.waterfall([
        async.constant(params),
        configs.find,
        configs.parse,
        configs.validate,
        configs.validate_circular_stacks,
        configs.load_missing_parents,
        configs.resolve_params,
        function(stacks, next) { next(null, { stacks: stacks, params: params}); },
        cloudformation.fetch_statuses,
        lambda.deploy_stacks
    ], function(err) {
        if (err) {
            console.log('');
            console.log('*************************');
            console.log('** ERROR');
            console.log('*************************');
            console.log(err);
        } else {
            console.log('');
            console.log('/////////////////////////');
            console.log('// COMPLETE');
            console.log('/////////////////////////');
        }
    });
};