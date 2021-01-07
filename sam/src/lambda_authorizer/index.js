exports.handler = async (event) => {
    if(event.authorizationToken === "12345")
        return allowPolicy(event.methodArn);
        
    return denyAllPolicy();
};

function denyAllPolicy(){
    return {
        "principalId": "*",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "*",
                    "Effect": "Deny",
                    "Resource": "*"
                }
            ]
        }
    }
}
function allowPolicy(methodArn){
    return {
        "principalId": "apigateway.amazonaws.com",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": "Allow",
                    "Resource": methodArn
                }
            ]
        }
    }
}
