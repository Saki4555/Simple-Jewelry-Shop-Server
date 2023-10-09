const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();

const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(express.json());
app.use(cors(corsOptions));

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phgiqsm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usersCollection = client.db("jewelryDb").collection("users");
    const jewelriesCollection = client.db("jewelryDb").collection("jewelries");
    const cartCollection = client.db("jewelryDb").collection("carts");

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.get("/jewelries", async (req, res) => {
      const result = await jewelriesCollection.find().toArray();
      res.send(result);
    });

    app.get("/jewelries/:email", async (req, res) => {
      const email = req.params.email;

      const query = { sellerEmail: email };
      const result = await jewelriesCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/jewelries", async (req, res) => {
      const newJewelry = req.body;
      console.log(newJewelry);
      const result = await jewelriesCollection.insertOne(newJewelry);
      res.send(result);
    });

    app.put("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const jewelry = req.body;
      const query = { id: id };
      const options = { upsert: true };
      const updateDoc = {
        $set: jewelry,
      };
      const result = await cartCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get("/cart/:email", async (req, res) => {
        const email = req.params.email;
  
        const query = { customerEmail: email };
        const result = await cartCollection.find(query).toArray();
        res.send(result);
      });
  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Free Jewelries");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
