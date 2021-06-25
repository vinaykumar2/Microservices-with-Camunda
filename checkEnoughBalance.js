const { Client, logger,Variables } = require("camunda-external-task-client-js");
 
console.log("Init");
 
// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
 
// create a Client instance with custom configuration
const client = new Client(config);
console.log("Subscribe");
 
// susbscribe to the topic: 'creditScoreChecker'
client.subscribe("Deduct-existing-credit", async function({ task, taskService }) {
  // Put your business logic
  console.log(task)
  var variables=task.variables.getAll();
  console.log(variables)
  
  //console.log(task.workerId)
  console.log("CreditSufficient: "+task.variables.get("creditSufficient"))
  console.log("Amount request: "+task.variables.get("amount"))
  var amount=task.variables.get("amount")
  console.log(amount)
 
  //Assume a balance of 10000 is present
  const processVariables = new Variables()
  var CustomerBalance=10000
  console.log(CustomerBalance)
  
  var remainingBalance=(amount-CustomerBalance).toFixed(2)
  console.log(remainingBalance)
  if (amount<0) {
    
    await taskService.handleFailure(task, {
     
    errorMessage: "sorry this failed",
    errorDetails: "because of my implementation",
   
    retries: 0,
    retryTimeout: 10000 });
     console.log("sorry this failed");
    
    } else {
  if(remainingBalance<0){
    console.log("Credit is sufficient")
    processVariables.set("creditSufficient",true)
 
    
  }else{
    console.log("Credit is not enough")
    processVariables.set("remainingAmount",remainingBalance).set("creditSufficient",false)
    console.log("Variables set")
  }
  // complete the task
  console.log("Complete");
  await taskService.complete(task,processVariables); }
}

);