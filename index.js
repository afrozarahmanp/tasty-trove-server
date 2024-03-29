const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000;
//middleware
app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8idv4x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const menuCollection = client.db("tastyTroveDb").collection("menu");
        const reviewsCollection = client.db("tastyTroveDb").collection("reviews");
        const cartCollection = client.db("tastyTroveDb").collection("carts");

        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result)
        })

        //cart collection
        app.post('/carts', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
            res.send(result);
        })

        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            console.log(email)

            if (!email) {

                res.send([]);
            }

            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('tasty tasty foods data')
})
app.listen(port, () => {
    console.log(`tasty tasty foods on port ${port}`)
})

/* -------------------
    Naming convention
----------------------
users : userCollection

app.get('/users')
app.get('/users/:id')
app.post('/users')
app.patch('/users/:id')
app.put('/users/:id')
app.delete('/users/:id')
*/