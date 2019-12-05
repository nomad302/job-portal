var fetch = require("node-fetch");
var redis = require("redis"),
  client = redis.createClient({
    host: "127.0.0.1",
    no_ready_check: true,
    auth_pass: "root123"
  });
const { promisify } = require("util");

const setAsync = promisify(client.set).bind(client);

const baseUrl = "https://jobs.github.com/positions.json";

async function fetchGithub() {
  let resultCount = 1,
    onPage = 0;
  const alljobs = [];

  //fetch all pages
  while (resultCount > 0) {
    const res = await fetch(baseUrl + "?page=" + onPage);
    const jobs = await res.json();
    alljobs.push(...jobs);
    resultCount = jobs.length;
    console.log("got :- ", jobs.length);
    onPage++;
  }
  console.log("all Jobs :- ", alljobs.length);

  //filter algo
  const jrJobs = alljobs.filter(job => {
    const jobTitle = job.title.toLowerCase();

    // algo logic
    if (
      jobTitle.includes("senior") ||
      jobTitle.includes("manager") ||
      jobTitle.includes("sr.") ||
      jobTitle.includes("architect")
    ) {
      return false;
    }

    return true;
  });

  // filtered down to
  console.log("filtered  down to ", jrJobs.length);

  //set in redis
  const success = await setAsync("github", JSON.stringify(jrJobs));
  console.log({ success });
}

module.exports = fetchGithub;
