var dynamoDbCommon = require('./dynamoDb-common');
var dynamoDb = dynamoDbCommon.getDynamoDb();
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

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
    // for (var i = 0; i < data.Items.length; i++) {
    //     var item = data.Items[i]
    //     retData.push({
    //         id: item.id.S,
    //         title: item.title.S,
    //         validTo: item.validTo.S,
    //         description: item.description.S,
    //         options: item.options.L
    //     })
        })
    }
    // return retData;
    return data;
}

async function getSurvey(event) {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: event['pathParameters']['surveyID']
        }),
    };
    const data = await dynamoDb.getItem(params).promise()

    const textOptionsArray = [];
    for(const option of data.Item.options.L) {
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

async function updateSurvey(event) {
    const data = JSON.parse(event.body)
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: event['pathParameters']['surveyID']
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

module.exports = {
    getSurveys: getSurveys,
    getSurvey: getSurvey,
    updateSurvey: updateSurvey,
    deleteSurvey: deleteSurvey
};