const mongoose = require('mongoose');
const Test = require('./schema');
const { mongoDB } = require('../../util/mongodb');

run();

async function run() {
  try {
    const test = await Test.create({
      name: 'howard',
    });
    console.log(test);
  } catch (error) {
    console.log(error.message);
  }
}
