var dynamoDbCommon = require('./dynamoDb-common');
var surveyRepository = require('./survey-repository');
var participationRepository = require('./participation-repository');
var lambdaProxyAdapter = require('./apigateway-lambda-proxy-integration-adapter');
var modulePrivilegesHelper = require('./module_privileges_helper');
var eventHelper = require('./event_helper')

module.exports = {
  getDynamoDb: dynamoDbCommon.getDynamoDb,
  SURVEY_REPOSITORY: surveyRepository,
  PARTICIPATION_REPOSITORY: participationRepository,
  LAMBDA_PROXY_ADAPTER: lambdaProxyAdapter,
  MODULE_PRIVILEGES_HELPER: modulePrivilegesHelper,
  EVENT_HELPER: eventHelper
};