'use strict';

const cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');
const authorizationService = cloudIntegration.AUTHORIZATION_SERVICE;
const inputAdapter = cloudIntegration.INPUT_ADAPTER;

exports.handler = async (event) => {
    const headerValues = {};
    if (!inputAdapter.extractHeaderValues(event, [inputAdapter.X_APIKEY], headerValues))
        return Promise.resolve(authorizationService.denyAllPolicy());

    return authorizationService.authorize(headerValues[inputAdapter.X_APIKEY]);
};
