const express = require('express');
const cors = require('cors');

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("<div style='display:flex;height:96vh;justify-content: center;align-items: center;'><h1>product server running!</h1></div>");
});

const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {

    try {

        await client.connect();
        const database = client.db("Productdata");
        const productCollection = database.collection("products");
        const adminCollection = database.collection("homepages");

        // add course endpoints
        app.post('/product', async (req, res) => {

            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.json(result);

        });


        app.post('/homepage', async (req, res) => {

            const data = req.body;
            const result = await adminCollection.insertOne(data);
            res.json(result);

        });

        app.get('/product', async (req, res) => {

            const result = await productCollection.find({}).toArray();
            res.send(result);

        });
        app.get('/homepage', async (req, res) => {

            const result = await adminCollection.find({}).toArray();
            res.send(result);

        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        

       

    } finally {
        // await client.close();
    }

} run().catch(console.dir);

app.listen(port, () => console.log(`response from http://localhost:${port}`));