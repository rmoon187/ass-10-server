require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.isok8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        const database = client.db("sportsDb");
        const productsCollection = database.collection("sportsProducts");
        const categoriesCollection = database.collection("sportsCategories");

        // Test Route
        app.get("/", (req, res) => {
            res.send("Server is running!");
        });

        /** -----------------------
         *  PRODUCTS API
         * ----------------------- */

        // GET all products
        app.get("/products", async (req, res) => {

            const limit = parseInt(req.query.limit);
            const products = await productsCollection.find().limit(limit).toArray();
            products.forEach(product => product._id = product._id.toString());
            res.send(products);

        });

        // GET a single product by ID
        app.get("/products/:id", async (req, res) => {

            const id = req.params.id;
            const product = await productsCollection.findOne({ _id: new ObjectId(id) });
            product._id = product._id.toString();
            res.send(product);

        });

        // POST a new product
        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        });

        // DELETE a product
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // UPDATE a product by ID
        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedProduct = req.body;
            const updateDoc = {
                $set: {
                    image: updatedProduct.image,
                    itemName: updatedProduct.itemName,
                    categoryName: updatedProduct.categoryName,
                    price: updatedProduct.price,
                    description: updatedProduct.description,
                    rating: updatedProduct.rating,
                    customization: updatedProduct.customization,
                    stockStatus: updatedProduct.stockStatus,
                    processingTime: updatedProduct.processingTime,
                },
            }
            const result = await productsCollection.updateOne(query, updateDoc);

            res.send(result);

        })

        // GET products by user email
        app.get("/my-equipment", async (req, res) => {

            const userEmail = req.query.email; // Get user email from query params             
            const products = await productsCollection.find({ userEmail }).toArray();
            res.send(products);

        });

        /** -----------------------
         *  CATEGORIES API
         * ----------------------- */

        // GET all categories
        app.get("/categories", async (req, res) => {
            const categories = await categoriesCollection.find().toArray();
            res.send(categories);
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

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
