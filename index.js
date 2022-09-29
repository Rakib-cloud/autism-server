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
    res.send("<div style='display:flex;height:96vh;justify-content: center;align-items: center;'><h1>Autism Care Server Running!</h1></div>");
});

const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {

    try {

        await client.connect();
        const database = client.db("Autism");
        const courseCollection = database.collection("courses");

        app.post('/course', async (req, res) => {

            const data = req.body;
            const result = await courseCollection.insertOne(data);
            res.json(result);

        });


        app.get('/course',async (req,res) => {

            const result = await courseCollection.find({}).toArray()
            res.send(result);

        })

        app.get('/course/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id:ObjectId(id)}
            const course=await courseCollection.findOne(query)
            res.send(course);
        });


    } finally {
        // await client.close();
    }

} run().catch(console.dir);

app.listen(port, () => console.log("response from port", port));