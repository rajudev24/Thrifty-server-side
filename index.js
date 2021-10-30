const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000

//Middlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qhwuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
        const database = client.db('Thrifty-Traveler');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders')
        

        //GET API
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });


        //POST API for add service
        app.post('/services', async(req, res)=>{
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            res.json(result)
        })

        // POST API for order
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result);
        });
        //Get API for show my Orders
        app.get('/orders', async(req, res)=>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        });

        // Delete API

        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await  ordersCollection.deleteOne(query);
            res.json(result)
        })
        
    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Thrifty Travler Runing')
});

app.listen(port, ()=>{
    console.log('Thrifty Traveler runing on port', port)
});