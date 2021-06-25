const Variables = require("camunda-external-task-client-js/lib/Variables");
const { Client, logger } = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'start-payment'
client.subscribe("start-payment", async function({ task, taskService }) {
    // Get the bizKey
    var bizKey = task.businessKey;
    var amount = task.variables.get("amount");

    const got = require('got');

    await (async () => {
        const {body} = await got.post('http://localhost:8080/engine-rest/message', {
            json: {
                messageName: 'startPayment',
                businessKey: bizKey,
                resultEnabled: 'true',
                processVariables: {
                    amount:
                        {value: amount}
                        
                }
            },
            
            responseType: 'json'
        });
        console.log("amount: "+amount);
        console.log("bizKey: "+bizKey);
        console.log(body.data);
    })();

    await taskService.complete(task);

});

// susbscribe to the topic: 'notify-payment-completed'
client.subscribe("notify-payment-completed", async function({ task, taskService }) {
    // Get the bizKey
    var bizKey = task.businessKey;

    const got = require('got');

    await (async () => {
        const {body} = await got.post('http://localhost:8080/engine-rest/message', {
            json: {
                messageName: 'payment-completed',
                businessKey: bizKey,
                resultEnabled: 'true'
            },
            responseType: 'json'
        });
        console.log("amount: "+amount);
        console.log("bizKey: "+bizKey);
        console.log(body.data);
    })();

    await taskService.complete(task);

});