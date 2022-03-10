'use strict';

const dynamoDbCommon = require('./dynamoDb-common');
const surveyRepository = require('./survey-repository');
const participationRepository = require('./participation-repository');
const authorizationService = require('./authorization.service');
const lambdaProxyAdapter = require('./apigateway-lambda-proxy-integration-adapter');
const eventHelper = require('./event_helper');
const RestInputAdapter = require('./rest-input-adapter');
const SurveyModuleInfo = require('./survey-module-info');
const PrivilegesHandler = require('./privileges/privileges-handler');
const TenantService = require('./tenant.service');

const _tenantService = new TenantService();
const _privilegesHandler = new PrivilegesHandler();
const _surveyModuleInfo = new SurveyModuleInfo();
_surveyModuleInfo.register(_privilegesHandler);

module.exports = {
  getDynamoDb: dynamoDbCommon.getDynamoDb,
  AUTHORIZATION_SERVICE: authorizationService,
  SURVEY_REPOSITORY: surveyRepository,
  PARTICIPATION_REPOSITORY: participationRepository,
  LAMBDA_PROXY_ADAPTER: lambdaProxyAdapter,
  EVENT_HELPER: eventHelper,
  INPUT_ADAPTER: new RestInputAdapter(),
  SURVEY_MODULE: _surveyModuleInfo,
  PRIVILEGES: _privilegesHandler,
  TENANT_SERVICE: _tenantService
};