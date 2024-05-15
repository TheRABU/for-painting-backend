const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmitfes.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());
// middlewares end

//DB related starts here
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
    const database = client.db("createdNewDB");
    const artAndCraftCollections = database.collection("ArtAndCraftDB");
    const userCollection = database.collection("userDB");

    // get all arts and crafts
    app.get("/all-crafts", async (req, res) => {
      const cursor = artAndCraftCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get details/view details of a single card
    app.get("/view-details/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artAndCraftCollections.findOne(query);
      res.send(result);
    });

    // add arts and craft
    app.post("/add-crafts", async (req, res) => {
      const craft = req.body;
      console.log("new art and craft added", craft);
      const result = await artAndCraftCollections.insertOne(craft);
      res.send(result);
    });
    // update single art and craft
    app.put("/update-crafts/craft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;

      const craft = {
        $set: {
          image: updatedCraft.image,
          item_name: updatedCraft.item_name,
          subcategory_name: updatedCraft.subcategory_name,
          short_description: updatedCraft.short_description,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          processing_time: updatedCraft.processing_time,
          stockStatus: updatedCraft.stockStatus,
        },
      };
      const result = await artAndCraftCollections.updateOne(
        filter,
        craft,
        options
      );
      res.send(result);
    });

    // delete any craft
    app.delete("/delete-crafts/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artAndCraftCollections.deleteOne(query);
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
app.listen(port, () => {
  console.log("App listening on port", port);
});
