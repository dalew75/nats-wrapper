require('dotenv').config();
const NATS = require('nats');
const host = process.env.NATS_HOST || 'demo.nats.io';
const port = process.env.NATS_PORT || '4222';
const fullUrl = `${host}:${port}`;

console.log(`Going to connect to NATS at: ${fullUrl}`);

const nc = NATS.connect(`${host}:${port}`);

exports.subscribe = function (subject, subscribeCallback) {
    nc.subscribe(subject, subscribeCallback);
    console.log(`NATS: Listening for messages on subject: '${subject}' at ${fullUrl}`);
}

exports.publish = function (subject, msg, replyOrCallback) {
    if (typeof replyOrCallback === 'undefined') { // no reply subject
        nc.publish(subject, msg);
    }
    else if (typeof replyOrCallback === 'string') { // reply subject
        nc.publish(subject, msg, replyOrCallback);
    }
    else if (typeof replyOrCallback === 'function') { // callback
        const callback = replyOrCallback;
        const reply = NATS.createInbox();
        console.log(`Created reply inbox: ${reply}`);
        const subscription = nc.subscribe(reply, (msg) => {
            callback(null, msg);
            subscription.unsubscribe();
        });
        console.log(`NATS: Publishing to ${subject} with reply subject ${reply}\n${msg}`);
        nc.publish(subject, msg, reply);
    }
}