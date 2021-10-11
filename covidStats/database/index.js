'use strict'

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

let db
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.boowj.mongodb.net/covid_response?retryWrites=true&w=majority`;
const loadDB = async (intentName) => {
    var data
    try {
        const client = await MongoClient.connect(uri);
        db = client.db(process.env.DATABASE_NAME);
        data = await getData(intentName);
        client.close()
    } catch (err) {
        console.log(err)
        throw new Error('Could not connect to db');
    }
    return data;
};


var getData = (intentName) => {
    return new Promise((resolve, reject) => {
        db.collection(process.env.COLLECTION_NAME).findOne({ intentName: intentName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err)
        });
    })
}

module.exports = loadDB;