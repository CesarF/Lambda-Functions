const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

console.log('Loading function');

const tableAccount = "Accounting";

const accountkey = "incomes";

const tableTicket = "Tickets";

exports.handler = (event, context, callback) => {
   
    event.Records.forEach((record) => {
       if (record.eventName == 'INSERT') {
            console.log(record.eventID);
            console.log(record.eventName);
            console.log('DynamoDB Record: %j', record.dynamodb);
            var idIncome = JSON.parse(record.dynamodb.Keys.ID.N);
            getItem(tableTicket, idIncome, processIncome)
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};

function processIncome(data) { 
    console.log("Process Income: " + JSON.stringify(data))
    getItem(tableAccount, accountkey, addIncome, data)
}

function addIncome(account, income) { 
    console.log("Add income: " + JSON.stringify(income) + " to account " + JSON.stringify(account))
    if(!account.Item){
        console.log("Create account with income: " + JSON.stringify(income))
        var params = {}
        params.TableName = tableAccount;
    	params.Item = {ID: accountkey,
    			Value: income.Item.UnitCost * income.Item.Quantity,
    			CreatedDate : Date.now()};
    	dynamo.putItem(params, consoleFunction);
    }
    else {
        updateAccount(income)
    }    
}

function updateAccount(income){
    console.log("Update account: " + JSON.stringify(income))
    var params = {};
    params.TableName = tableAccount
    params.Key = {ID : accountkey};
    params.UpdateExpression = "set #Value = #Value + :x";
    params.ExpressionAttributeNames = {"#Value" : "Value"};
    params.ExpressionAttributeValues = {":x" : income.Item.UnitCost * income.Item.Quantity};
    console.log(params);
    dynamo.updateItem(params, consoleFunction);
}

function getItem(tableName, key, processFunction, extraData){
    var params = {};
    params.TableName = tableName;
    params.Key = {ID : key};
    console.log(params)
    dynamo.getItem(params, function(err, data) { 
        if (err) {
            console.log(err, err.stack);
        } else {
            processFunction(data, extraData)
        }
    }); 
}

function consoleFunction(err, data) { 
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log(data);
    }
}