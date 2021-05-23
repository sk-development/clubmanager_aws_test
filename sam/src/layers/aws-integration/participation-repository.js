var dynamoDbCommon = require('./dynamoDb-common');
var dynamoDb = dynamoDbCommon.getDynamoDb();
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

async function getAllParticipations() {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
    };
    const data = await dynamoDb.scan(params).promise();
    for (var i = 0; i < data.Items.length; i++) {
        var item = data.Items[i]
        retData.push({
            id: item.id.S,
            title: item.title.S
        })
    }
    return retData;
}

async function getUserParticipations() {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
    };
    const data = await dynamoDb.scan(params).promise();
    for (var i = 0; i < data.Items.length; i++) {
        var item = data.Items[i]
        retData.push({
            id: item.id.S,
            title: item.title.S
        })
    }
    return retData;
}

async function getSurveyParticipations(surveyId) {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
        IndexName: "SurveyIndexAll",
        KeyConditionExpression: "surveyId = :surveyId",
        ExpressionAttributeValues: marshall({
            ":surveyId": surveyId
        }),
    }
    const data = await dynamoDb.query(params).promise();
    for (var i = 0; i < data.Items.length; i++) {
        var item = data.Items[i];
        const editedOptionsIdsArray = [];
        for (const option of item.editedOptionsIds.L) {
            editedOptionsIdsArray.push(option.M.id.S)
        }
        retData.push({
            participationId: item.participationId.S,
            userId: item.userId.S,
            surveyId: item.surveyId.S,
            notation: item.notation.S,
            editedOptionsIds: editedOptionsIdsArray
        })
    }
    return retData;
}

async function getParticipationById(participationId) {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: surveyId
        }),
    };
    const data = await dynamoDb.getItem(params).promise()

    const textOptionsArray = [];
    for (const option of data.Item.options.L) {
        textOptionsArray.push({
            optionsID: option.M.id.S,
            optionsText: option.M.text.S,
        })
    }

    retData.push({
        id: data.Item.id.S,
        title: data.Item.title.S,
        description: data.Item.description.S,
        validTo: data.Item.validTo.S,
        textOptions: textOptionsArray
    })
    return retData;
}

async function getParticipationFromIndex(participationId) {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: surveyId
        }),
    };
    const data = await dynamoDb.getItem(params).promise()

    const textOptionsArray = [];
    for (const option of data.Item.options.L) {
        textOptionsArray.push({
            optionsID: option.M.id.S,
            optionsText: option.M.text.S,
        })
    }

    retData.push({
        id: data.Item.id.S,
        title: data.Item.title.S,
        description: data.Item.description.S,
        validTo: data.Item.validTo.S,
        textOptions: textOptionsArray
    })
    return retData;
}

async function createParticipation(event){
    const id = uuidv4();
    const surveyParse = JSON.parse(event.body);
    var params = {
        TableName: process.env.TABLE_NAME,
        Item: marshall({
            participationId: id,
            userId: surveyParse.userId,
            surveyId: surveyParse.surveyId,
            notation: surveyParse.notation,
            editedOptionsIds: surveyParse.editedOptionsIds
        }),
        ReturnConsumedCapacity: 'TOTAL',
    };
    var result;
    try {
        result = await dynamoDb.putItem(params).promise();
        result = 'Success';
    } catch (err) {
        result = err;
    }
    return result;
}

async function updateParticipation(event) {
    const data = JSON.parse(event.body)
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: event['pathParameters']['participationID']
        }),
        UpdateExpression: "set participationID = :n, editedOptionsIds = :eO",
        ExpressionAttributeValues: marshall({
            ":n": data.notation,
            ":eO": data.editedOptionsIds
        }),
    }
    var result;
    try {
        const item = await dynamoDb.updateItem(params).promise();
        result = 'Success';
    } catch (err) {
        result = err;
    }
    return result;
}



module.exports = {
    getAllParticipations: getAllParticipations,
    getUserParticipations: getUserParticipations,
    getSurveyParticipations: getSurveyParticipations,
    getParticipationById: getParticipationById,
    getParticipationFromIndex: getParticipationFromIndex,
    createParticipation: createParticipation,
    updateParticipation: updateParticipation
};