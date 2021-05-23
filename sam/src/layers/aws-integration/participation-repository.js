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

async function getUserParticipations(userId) {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
        IndexName: "UserIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: marshall({
            ":userId": userId
        }),
    }
    const data = await dynamoDb.query(params).promise();
    for (var i = 0; i < data.Items.length; i++) {
        var item = data.Items[i];
        retData.push({
            participationId: item.participationId.S,
            surveyId: item.surveyId.S
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
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            participationId: participationId
        }),
    };
    const {Item} = await dynamoDb.getItem(params).promise()
    const retData = unmarshall(Item);
    const editedOptionsIdsArray = [];
    for (const option of Item.editedOptionsIds.L) {
        editedOptionsIdsArray.push(option.M.id.S)
    }
    retData.editedOptionsIds = editedOptionsIdsArray;
    // var item = data.Item;
    // const editedOptionsIdsArray = [];
    // for (const option of item.editedOptionsIds.L) {
    //     editedOptionsIdsArray.push(option.M.id.S)
    // }
    // retData.push({
    //     participationId: item.participationId.S,
    //     userId: item.userId.S,
    //     surveyId: item.surveyId.S,
    //     notation: item.notation.S,
    //     editedOptionsIds: editedOptionsIdsArray
    // })
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

module.exports = {
    getAllParticipations: getAllParticipations,
    getUserParticipations: getUserParticipations,
    getSurveyParticipations: getSurveyParticipations,
    getParticipationById: getParticipationById,
    getParticipationFromIndex: getParticipationFromIndex
};