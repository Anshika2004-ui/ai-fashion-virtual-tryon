require("dotenv").config();

const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function test() {
  try {
    const models = await replicate.models.list();
    console.log("SUCCESS");
  } catch (err) {
    console.log(err);
  }
}

test();