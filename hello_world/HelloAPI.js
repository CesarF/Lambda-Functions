console.log('Hello World function');

exports.handler = function(event, context, callback){
   callback(null, {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"resp":"Hello, World!"})
    });
};