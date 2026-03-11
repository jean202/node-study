import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


  // import { createServer } from 'node:http';
  // import { MongoClient } from 'mongodb';
  // import 'dotenv/config';

  // const host = process.env.HOST ?? '127.0.0.1';
  // const port = Number(process.env.PORT ?? 3000);
  // const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017';
  // const dbName = process.env.MONGODB_DB ?? 'node_study';

  // const client = new MongoClient(uri);
  // await client.connect();
  // const db = client.db(dbName);
  // await db.command({ ping: 1 });
  // console.log(`MongoDB connected: ${uri}/${dbName}`);

  // const server = createServer(async (req, res) => {
  //   if (req.url === '/health') {
  //     const ping = await db.command({ ping: 1 });
  //     res.writeHead(200, { 'Content-Type': 'application/json' });
  //     res.end(JSON.stringify({ ok: ping.ok === 1 }));
  //     return;
  //   }

  //   res.writeHead(200, { 'Content-Type': 'text/plain' });
  //   res.end('Hello World');
  // });

  // server.listen(port, host, () => {
  //   console.log(`Server running at http://${host}:${port}/`);
  // });

  // process.on('SIGINT', async () => {
  //   await client.close();

  // node server.js
  // {"ok":true} 나오면 연결 성공입니다.