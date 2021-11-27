const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5nvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('Camera_Zone');
        const productCollection = database.collection('products');
        const userCollection = database.collection('users');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');

        //GET API

        //get all products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const count = await cursor.count();
            const products = await cursor.toArray();
            res.json({
                products,
                count
            });
        })


        //get all users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({})
            const count = await cursor.count();
            const users = await cursor.toArray();
            res.json({
                users,
                count
            });
        })


        //get all reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({})
            const reviews = await cursor.toArray();
            res.json(reviews);
        })

        //get all orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const count = await cursor.count();
            const orders = await cursor.toArray();
            res.json({
                orders,
                count
            });
        })


        //GET API



        //get single product details
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.json(product)
        })


        //get user orders
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            query = { email: email };
            const orders = await orderCollection.find(query).toArray();
            res.json(orders)


        })


        //get single user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })




        //POST API

        //insert services
        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            const result = await productCollection.insertOne(newProducts)
            res.json(result)
        })

        //insert users
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            res.json(result)
        })

        //insert orders
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder)
            res.json(result)
        })

        //POST api




        //DELETE API

        //delete product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.json(result)
        })

        //cancel purchase
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

        //DELETE API




        //update user purchase
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    status: "Approved"
                }

            }
            const result = await orderCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        //update user  purchase



        //update user with same account//update admin
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        //update review
        app.put('/reviews', async (req, res) => {
            const review = req.body;
            const filter = { reviewId: 1 };
            const options = { upsert: true };
            const updateDoc = { $set: review };
            const result = await reviewCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //update user





        //UPDATE API


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)





app.get('/', (req, res) => {
    res.json("this is node")
})

app.listen(port, () => {
    console.log('listening in port', port);

})
