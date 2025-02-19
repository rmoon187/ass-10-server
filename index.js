require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// MongoDB Connection

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.isok8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db("sportsDb");
        const productsCollection = database.collection("sportsProducts");

        // Test route
        app.get("/", (req, res) => {
            res.send("Server is running!");
        });

        // GET all products
        app.get("/products", async (req, res) => {
            const products = await productsCollection.find().toArray();
            res.json(products);
        });

        // POST a new product
        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.json(result);
        });

        // DELETE a product
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
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



