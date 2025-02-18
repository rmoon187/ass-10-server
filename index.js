const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleWire
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server is running")
})
app.listen(port, () => [
    console.log(`running on port : ${port}`)
])

// ass-09-user
// KXRWUdfqrUT0RyFE


const uri = "mongodb+srv://ass-09-user:KXRWUdfqrUT0RyFE@cluster0.isok8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function main() {
    try {

        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } catch (error) {
        console.log(error)
    }
}
main()
