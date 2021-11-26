var dynamoDbCommon = require('./dynamoDb-common');
var dynamoDb = dynamoDbCommon.getDynamoDb();
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');


async function getSurveys() {
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

async function getSurvey(surveyId) {
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

async function updateSurvey(surveyId, data) {
    // const data = JSON.parse(event.body)
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            // id: event['pathParameters']['surveyID']
            id: surveyId
        }),
        UpdateExpression: "set title = :t, validTo=:v, description=:d, options=:o",
        ExpressionAttributeValues: marshall({
            ":t": data.title,
            ":v": data.validTo,
            ":d": data.description,
            ":o": data.options
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

async function deleteSurvey(event) {
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: event['pathParameters']['surveyID']
        })
    }
    var result;
    try {
        const item = await dynamoDb.deleteItem(params).promise();
        result = 'Success';
    } catch (err) {
        result = err;
    }
    return result;
}

async function createSurvey(event) {
    const id = uuidv4();
    const surveyParse = JSON.parse(event.body);
    const optionsArray = [];
    for (const option of surveyParse.options) {
        const optionsId = uuidv4();
        optionsArray.push(
            { id: optionsId, text: option.text },
        )
    }

    var params = {
        TableName: process.env.TABLE_NAME,
        Item: marshall({
            id: id,
            title: surveyParse.title,
            validTo: surveyParse.validTo,
            description: surveyParse.description,
            options: optionsArray
        }),
        ReturnConsumedCapacity: 'TOTAL'
        ,
    };
    var result;
    try {
        result = await dynamoDb.putItem(params).promise();
        result = id;
    } catch (err) {
        result = err;
    }
    return result;
}

module.exports = {
    getSurveys: getSurveys,
    getSurvey: getSurvey,
    updateSurvey: updateSurvey,
    deleteSurvey: deleteSurvey,
    createSurvey: createSurvey
};