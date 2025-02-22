import { Client, ClientTCP, Transport } from '@nestjs/microservices';

const client = new ClientTCP({
  host: 'localhost',
  port: 3001,
});

async function test() {
  await client.connect();

  // Login
  const auth = await client.send({ cmd: 'login' }, {
    username: 'test',
    password: 'password'
  }).toPromise();

  console.log('Auth response:', auth);

  // Send message (you'll need to include the token in the metadata)
  const message = await client.send({ cmd: 'send_message' }, {
    from: 'test',
    content: 'Hello, world!'
  }).toPromise();

  console.log('Message sent:', message);

  // Get messages
  const messages = await client.send({ cmd: 'get_messages' }, {}).toPromise();
  console.log('Messages:', messages);
}

test(); 