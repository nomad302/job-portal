const express = require("express");
const app = express();
const { promisify } = require("util");
const port = 3001;

var redis = require("redis"),
  client = redis.createClient({
    host: "127.0.0.1",
    no_ready_check: true,
    auth_pass: "root123"
  });

const getAsync = promisify(client.get).bind(client);

app.get("/jobs", async (req, res) => {
  const jobs = await getAsync("github");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  return res.send(jobs);
});

app.listen(port, () => console.log("Example app is running on port 3001"));
