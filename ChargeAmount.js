const { Client, logger } = require("camunda-external-task-client-js");
 
console.log("Init");
 
// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
 
// create a Client instance with custom configuration
const client = new Client(config);
console.log("chargingcreditcard");
 
// susbscribe to the topic: 'creditScoreChecker'
client.subscribe("chargingcreditcard", async function({ task, taskService }) {
  // Put your business logic
  console.log(task)
  var variables=task.variables.getAll();
  console.log(variables)
  var amount=task.variables.get("amount")
  var remainingamount=task.variables.get("remainingAmount")
  console.log("remainingamount: "+remainingamount)
  if (remainingamount>8000) {
    
    await taskService.handleBpmnError(task, "CCC-01", "CreditCard-error", variables);
     
    console.log("restore credit card")
    
    
    } else {
  //console.log(task.workerId)
  console.log("CreditSufficient: "+task.variables.get("creditSufficient"))
  console.log("Total Amount being handled: "+task.variables.get("amount"))
  console.log("Charging the credit card with:"+remainingamount)
  // complete the task
  console.log("Complete charge task");
    }
  await taskService.complete(task);
});