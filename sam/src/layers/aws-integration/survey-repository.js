var dynamoDbCommon = require('./dynamoDb-common');
var dynamoDb = dynamoDbCommon.getDynamoDb();

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

async function getSurvey(event) {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: {
                S: event['pathParameters']['surveyID']
            }
        }
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

async function deleteSurvey(event) {
    var params = {
    'TableName': process.env.TABLE_NAME,
    'Key': {
        'id':
        {
            'S': event['pathParameters']['surveyID']
        }
    }
    };
    return await dynamoDb.deleteItem(params).promise();
}

module.exports = {
    getSurveys: getSurveys,
    getSurvey: getSurvey,
    deleteSurvey: deleteSurvey,
};
