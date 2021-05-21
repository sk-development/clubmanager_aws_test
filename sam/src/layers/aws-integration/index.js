var dynamoDbCommon = require('./dynamoDb-common');
var surveyRepository = require('./survey-repository');
var participationRepository = require('./participation-repository');
var lambdaProxyAdapter = require('./apigateway-lambda-proxy-integration-adapter');

module.exports = {
  getDynamoDb: dynamoDbCommon.getDynamoDb,
  SURVEY_REPOSITORY: surveyRepository,
  PARTICIPATION_REPOSITORY: participationRepository,
  LAMBDA_PROXY_ADAPTER: lambdaProxyAdapter
};