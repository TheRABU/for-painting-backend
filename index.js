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
    const myProductCollections = database.collection("userInsertedCollection");
    // const userCollection = database.collection("userDB");

    //THESE ARE FOR ADMIN
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
    // app.put("/update-crafts/craft/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedCraft = req.body;

    //   const craft = {
    //     $set: {
    //       image: updatedCraft.image,
    //       item_name: updatedCraft.item_name,
    //       subcategory_name: updatedCraft.subcategory_name,
    //       short_description: updatedCraft.short_description,
    //       price: updatedCraft.price,
    //       rating: updatedCraft.rating,
    //       customization: updatedCraft.customization,
    //       processing_time: updatedCraft.processing_time,
    //       stockStatus: updatedCraft.stockStatus,
    //     },
    //   };
    //   const result = await artAndCraftCollections.updateOne(
    //     filter,
    //     craft,
    //     options
    //   );
    //   res.send(result);
    // });

    // delete any craft
    // app.delete("/delete-crafts/craft/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await artAndCraftCollections.deleteOne(query);
    //   res.send(result);
    // });
    // sub category wise
    // app.get("/categories/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const options = {
    //     upsert: true,
    //   };
    //   const cursor = artAndCraftCollections.find(query, options);
    //   if ((await artAndCraftCollections.countDocuments) === 0) {
    //     console.log("No data found");
    //   }
    //   res.send(cursor);
    // });
    /// user related api
    // app.get("/users", async (req, res) => {
    //   const cursor = userCollection.find();
    //   const users = await cursor.toArray();
    //   res.send(users);
    // });
    // // Create User
    // app.post("/user", async (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });

    // //Update user
    // app.patch("/user", async (req, res) => {
    //   const user = req.body;
    //   const filter = { email: user.email };
    //   const updateDoc = {
    //     $set: {
    //       lastLoggedAt: user.lastLoggedAt,
    //     },
    //   };
    //   const result = await userCollection.updateOne(filter, updateDoc);
    //   res.send(result);
    // });

    // //delete User
    // app.delete("/user/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await userCollection.deleteOne(query);
    //   res.send(result);
    // });

    /// FOR USER'S WISHLIST OR MY LISTED PRODUCT PART

    app.post("/user/add-items", async (req, res) => {
      const post = req.body;
      console.log("created new post", post);
      const result = await myProductCollections.insertOne(post);
      res.send(result);
    });

    app.get("/user-items/:email", async (req, res) => {
      // const email = req.params.email;
      // console.log("fetching for email:", email);
      // try {
      //   const result = await myProductCollections
      //     .find({ email: email })
      //     .toArray();
      //   console.log("Query result:", result);
      //   if (result.length === 0) {
      //     console.log("No data found for email:", result);
      //   }
      //   res.send(result);
      // } catch (error) {
      //   console.log(error);
      // }
      const result = await myProductCollections
        .find({ email: req.params.email })
        .toArray();
      console.log(result);
      res.send(result);
    });

    // get each user who have been used the app
    app.get("/user-all-crafts-list", async (req, res) => {
      const result = await myProductCollections.find().toArray();
      res.send(result);
    });

    app.delete("/user-items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myProductCollections.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    //   const id = req.params.id;
    //   const updatedData = req.body;
    //   try {
    //     const filter = { _id: new ObjectId(id) };
    //     const updateDoc = {
    //       $set: updatedData,
    //     };
    //     const options = { upsert: false };
    //     const result = await myProductCollections.updateOne(
    //       filter,
    //       updateDoc,
    //       options
    //     );
    //     if (result.matchedCount === 0) {
    //       res.status(404).send({ message: "Post not found" });
    //     } else {
    //       res.send(result);
    //     }
    //   } catch (error) {
    //     res.status(500).send({ message: "Failed to update item", error });
    //   }
    // });
    ///THIS API NOT WORKING
    // app.put("/user-items/:id", async (req, res) => {
    //   const { id } = req.params;
    //   if (!ObjectId.isValid(id)) {
    //     return res.status(400).json({ error: "Invalid ID format" });
    //   }

    //   const query = { _id: new ObjectId(id) };
    //   const updatedItem = req.body; // New item data from the client
    //   delete updatedItem._id; // Remove _id field from the update data to avoid changing it

    //   try {
    //     const result = await myProductCollections.updateOne(query, {
    //       $set: updatedItem,
    //     });
    //     if (result.modifiedCount > 0) {
    //       res.status(200).json({ message: "Item updated successfully." });
    //     } else {
    //       res.status(404).json({ message: "Item not found." });
    //     }
    //   } catch (error) {
    //     console.error("Error updating item:", error);
    //     res.status(500).json({ message: "Internal server error." });
    //   }
    // });
    app.put("/user-items/:id", async (req, res) => {
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
      const result = await myProductCollections.updateOne(
        filter,
        craft,
        options
      );
      res.send(result);
    });

    app.get("/user-view-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myProductCollections.findOne(query);
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
