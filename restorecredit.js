
const { Client, logger,Variables } = require("camunda-external-task-client-js");
 
console.log("Init");
 
// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
 
// create a Client instance with custom configuration
const client = new Client(config);
console.log("Subscribe");
client.subscribe("restore-credit", async function({ task, taskService }) {
    // Put your business logic
  
   
    //Assume a balance of 10000 is present
    const processVariables = new Variables()
    var CustomerBalance=10000
    console.log("Credit is restored")
    // complete the task
    console.log("Complete");
    await taskService.complete(task,processVariables); 
  });