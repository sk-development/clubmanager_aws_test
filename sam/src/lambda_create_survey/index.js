const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
AWS.config.update({
    region: "eu-central-1"
});
// Create DynamoDB service object
var endPoint = (process.env.LOCAL_ENDPOINT == "AWS::NoValue") ? null : process.env.LOCAL_ENDPOINT;
var dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: endPoint });

exports.handler = async (event) => {
    try {
        const id = uuidv4();
        const surveyParse = JSON.parse(event.body);
        const name = surveyParse.title;
        const description = surveyParse.description;
        const validTo = surveyParse.validTo;

        const optionsArray = [];
        for(const option of surveyParse.options) {
            const optionsId = uuidv4();
            optionsArray.push(
                { 'M': { 'id': { 'S': `${optionsId}` }, 'text': { 'S': `${option.text}` } } },
            )
        }
        var params = {
            'TableName': `${process.env.TABLE_NAME}`,
            'Item': {
                'id':
                {
                    'S': `${id}`
                },
                'name':
                {
                    'S': `${name}`
                },
                'description':
                {
                    'S': `${description}`
                },
                'validTo':
                {
                    'S': `${validTo}`
                },
                'options':
                {
                    'L':
                        optionsArray
                }
            },
            'ReturnConsumedCapacity': 'TOTAL'
            ,
        };
        var result;
        result = await dynamoDb.putItem(params).promise();
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:4200",
                // "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
                // "Access-Control-Allow-Headers": "'Content-Type, x-apikey, x-tenantid'"
            },
            body: JSON.stringify(result)
        };
        
    } catch (err) {
        result = err;
        response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:4200",
                // "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
                // "Access-Control-Allow-Headers": "'Content-Type, x-apikey, x-tenantid'"
            },
            body: JSON.stringify(result)
        };
    }

    return response;
};

// aws lambda update-function-code --function-name my-function --zip-file fileb://function.zip


// { 'M': { 'index': { 'N': '0' }, 'text': { 'S': 'option1' } } },
// { 'M': { 'index': { 'N': '1' }, 'text': { 'S': 'option2' } } },
// { 'M': { 'index': { 'N': '2' }, 'text': { 'S': 'option3' } } }