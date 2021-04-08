var dynamoDbCommon = require('./dynamoDb-common');
var surveyRepository = require('./survey-repository');
var lambdaProxyAdapter = require('./apigateway-lambda-proxy-integration-adapter');

module.exports = {
  getDynamoDb: dynamoDbCommon.getDynamoDb,
  SURVEY_REPOSITORY: surveyRepository,
  LAMBDA_PROXY_ADAPTER: lambdaProxyAdapter
};