const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
AWS.config.update({
    region: "eu-central-1"
});
// Create DynamoDB service object
var endPoint = (process.env.LOCAL_ENDPOINT == "AWS::NoValue") ? null : process.env.LOCAL_ENDPOINT;
var dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: endPoint });

exports.handler = async (event) => {
    //uuid is not possible because of Number type from ID -> has to be of type String
    // const id = uuidv4();
    // const convertedId = id.replace(/-/g, "").toString();
    var intID = Math.floor(Math.random());
    const name = JSON.parse(event.body).name;

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
                'N': `${intID}`
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


    try {
        result = await dynamoDb.putItem(params).promise();
    } catch (err) {
        result = err;
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(result)
    };
    return response;
};

// aws lambda update-function-code --function-name my-function --zip-file fileb://function.zip


// { 'M': { 'index': { 'N': '0' }, 'text': { 'S': 'option1' } } },
// { 'M': { 'index': { 'N': '1' }, 'text': { 'S': 'option2' } } },
// { 'M': { 'index': { 'N': '2' }, 'text': { 'S': 'option3' } } }