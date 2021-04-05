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
    const name = JSON.parse(event.body).title;

    const optionsArray = [];
    for(option in event.body.options) {
        optionsArray.push(
            { 'M': { 'index': { 'N': `${option.index}` }, 'text': { 'S': `${option.text}` } } },
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