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

// sections part added
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

    const sectionsArray = [];
    for (const section of data.Item.sections.L) {
        const sectionsOptionArray = [];
        for (const option of section.M.options.L) {
            sectionsOptionArray.push({
                optionsID: option.M.id.S,
                optionsText: option.M.text.S
            })
        }
        sectionsArray.push({
            sectionsID: section.M.id.S,
            sectionsText: section.M.text.S,
            sectionsMultiSelect: section.M.multiSelect.BOOL,
            sectionsOptions: sectionsOptionArray
        })
    }

    retData.push({
        id: data.Item.id.S,
        title: data.Item.title.S,
        description: data.Item.description.S,
        validTo: data.Item.validTo.S,
        textOptions: textOptionsArray,
        sections: sectionsArray
    })
    return retData;
}

// sections part added
async function updateSurvey(data) {
    // const data = JSON.parse(event.body)
    const updatedOptionsArray = [];
    for (const option of data.options) {
        if(option.id == null) {
            const optionsId = uuidv4();
            updatedOptionsArray.push(
                { id: optionsId, text: option.text },
            )
        } else {
            updatedOptionsArray.push(option)
        }
    }
    const updatedSection = [];   
    const sectionsData = data.sections;
    for (const section of sectionsData) {
        const updatedSectionOptionsArray = [];
        for (const option of section.options) {
            if (option.id == null) {
                const optionsId = uuidv4();
                updatedSectionOptionsArray.push(
                    { text: option.text, id: optionsId },
                )
            } else {
                updatedSectionOptionsArray.push(option);
            }
        }
        if (section.id == null) {
            const sectionId = uuidv4();
            updatedSection.push({
                id: sectionId,
                multiSelect: section.multiSelect,
                text: section.text,
                options: updatedSectionOptionsArray
            })
        } else {
            updatedSection.push({
                id: section.id,
                multiSelect: section.multiSelect,
                text: section.text,
                options: updatedSectionOptionsArray
            })
        }
    }
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: data.id
        }),
        UpdateExpression: "set title = :t, validTo=:v, description=:d, options=:o, sections=:sc",
        ExpressionAttributeValues: marshall({
            ":t": data.title,
            ":v": data.validTo,
            ":d": data.description,
            ":o": updatedOptionsArray,
            ":sc": updatedSection
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

async function deleteSurvey(surveyId) {
    var params = {
        TableName: process.env.TABLE_NAME,
        Key: marshall({
            id: surveyId
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

// sections part added
async function createSurvey(data) {
    const id = uuidv4();
    // const surveyParse = JSON.parse(event.body);
    const optionsArray = [];
    for (const option of data.options) {
        const optionsId = uuidv4();
        optionsArray.push(
            { id: optionsId, text: option.text },
        )
    }
    const updatedSection = [];
    if (data.sections != null) {
        const sectionsData = data.sections;
        for (const section of sectionsData) {
            const updatedSectionOptionsArray = [];
            for (const option of section.options) {
                if (option.id == null) {
                    const optionsId = uuidv4();
                    updatedSectionOptionsArray.push(
                        { text: option.text, id: optionsId },
                    )
                } else {
                    updatedSectionOptionsArray.push(option);
                }
            }
            if (section.id == null) {
                const sectionId = uuidv4();
                updatedSection.push({
                    id: sectionId,
                    multiSelect: section.multiSelect,
                    text: section.text,
                    options: updatedSectionOptionsArray
                })
            } else {
                updatedSection.push({
                    id: section.id,
                    multiSelect: section.multiSelect,
                    text: section.text,
                    options: updatedSectionOptionsArray
                })
            }
        }
    }


    var params = {
        TableName: process.env.TABLE_NAME,
        Item: marshall({
            id: id,
            // title: surveyParse.title,
            // validTo: surveyParse.validTo,
            // description: surveyParse.description,
            // options: optionsArray
            title: data.title,
            validTo: data.validTo,
            description: data.description,
            options: optionsArray,
            sections: updatedSection
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
    getById: getSurvey, // Rename necessary for a generic validation module
    updateSurvey: updateSurvey,
    deleteSurvey: deleteSurvey,
    createSurvey: createSurvey
};