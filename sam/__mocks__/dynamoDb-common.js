'use strict';

const dynamoDbCommon = jest.createMockFromModule('../src/layers/aws-integration/dynamoDb-common')

let result = null;
let exception = null;

function __init() {
    result = null;
    exception = null;
}

function __setScanResult($data) {
    result = new DynamoDbScanMock($data);
}

function __setGetItemResults($data) {
    result = new DynamoDbGetItemMock($data);
}

function __throwException($exception) {
    exception = $exception;
}

function getDynamoDb() {
    return new DynamoDbMock();
}

let DynamoDbMock = function () {
    const self = this;
    self.scan = function() {}
    self.getItem = function() {}
    self.updateItem = function() {}
    self.deleteItem = function() {}
    self.putItem = function() {}
    self.promise = function() {
        if(exception != null) {
            throw exception;
        }
        return self;
    }
}

let DynamoDbScanMock = function(data) {
    const self = this;
    self.Items = data;
}

let DynamoDbGetItemMock = function(data) {
    const self = this;
    self.Item = data;
}

dynamoDbCommon.__init = __init;
dynamoDbCommon.__setScanResult = __setScanResult;
dynamoDbCommon.__setGetItemResults = __setGetItemResults;
dynamoDbCommon.__throwException = __throwException;
dynamoDbCommon.getDynamoDb = getDynamoDb;

module.exports = dynamoDbCommon;