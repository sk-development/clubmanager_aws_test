'use strict';

const superagent = jest.createMockFromModule('superagent');

let result = null;
let forceReject = false;
let exception = null;
let wasCalled = false;

function __init() {
    result = null;
    wasCalled = false;
    exception = null;
}

function __wasCalled() {
    return wasCalled;
}

function __setResult($statusCode, $data, $forceReject = false) {
    result = new SuperAgentResponseMock($statusCode, $data);
    forceReject = $forceReject;
}

function __throwException($exception) {
    exception = $exception;
}

function post() {
    return new SuperAgentRequestMock();
}

let SuperAgentRequestMock = function () {
    const self = this;
    self.set = function () {
        return self;
    }
    self.send = function () {
        wasCalled = true;
        return new Promise((resolve, reject) => {
            if (forceReject)
                reject(result);
            else if (exception!=null)
                throw exception;
            else
                resolve(result);
        });
    }
}

let SuperAgentResponseMock = function(statusCode, data) {
    const self = this;
    self.status = statusCode;
    self.body = data;
}

superagent.__setResult = __setResult;
superagent.__init = __init;
superagent.__wasCalled = __wasCalled;
superagent.__throwException = __throwException;
superagent.post = post;

module.exports = superagent;