console.log('Loading Microservice 1');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

const tableTicket = "Tickets";

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    var data = JSON.parse(event.body); 
    switch (event.httpMethod) {
        case 'GET':
            dynamo.scan({ TableName: tableTicket}, done);
            break;
        case 'POST':
            var params = {}
            params.TableName = tableTicket;
            params.Item = {ID: Date.now(),
                   Movie: data.movie,
                   Quantity : data.quantity,
                   UnitCost : data.cost};
            dynamo.putItem(params, done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};