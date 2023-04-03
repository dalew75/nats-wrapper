# nats-wrapper
Wrapper to make NATS functions available with configuration and connection happening in one place

### Install

```bash
mkdir ~/dev/tools
git clone git@github.com:dalew75/nats-wrapper.git ~/dev/tools
mkdir ~/dev/my-project
cd ~/dev/my-project
npm init -y 
npm install /dev/tools/nats-wrapper/
```

### Config
In your .env file define NATS HOST and PORT(4222 default)
```bash
NATS_HOST=[HOST_OR_IP_FOR_NATS_SERVER]
NATS_PORT=[CUSTOM_PORT]
```

### import

```bash
var nats = require('nats-wrapper');
```

#### subscribe
```bash
// Will add a greeting to the name/message sent
nats.subscribe('/add-greeting', async function (message, replyTo, subject) {
    console.log(`Got message: '${message}' on subject: '${subject}', replyTo: ${replyTo}`);
    nc.publish(replyTo,`Hello ${message}!);
});
```

#### publish (with specifying reply to subject)
```bash

const replyToSubject = '/receiving-greetings';

nats.publish('/add-greeting', 'John Doe', replyToSubject => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(`Received message with greeting: ${msg}`);
        //const msgObj = JSON.parse(msg); // if expecting JSON, parse it and use it
    }
});

// Will add a greeting to the name/message sent
nats.subscribe(replyToSubject, async function (message, replyTo, subject) {
    console.log(`Received message with greeting: ${msg}`);
});
```

#### publish (with callback)
```bash

nats.publish('/add-greeting', 'John Doe', async (err, msg) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(`Received message with greeting: ${msg}`);
        //const msgObj = JSON.parse(msg); // if expecting JSON, parse it and use it
    }
});