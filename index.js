const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l82nz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        client.connect();
        const database = client.db("Bikes");
        const productCollection = database.collection('products')//all products collection
        const oderCollection = database.collection('userOder')//all oder collection
        const allUserCollection = database.collection('allUser')// all user collection



        // product add 
        app.post('/product',async (req, res) => {
            const result = await productCollection.insertOne(req.body);
            res.json(result);
        })
        // product add
        app.get('/product',async (req, res) => {
            const result = await productCollection.find({}).toArray();
            res.json(result);
        })
        // single product get
        app.get('/product/:id',async (req, res) => {
            const id = req.params.id;
            const user = {_id:ObjectId(id)}
            const result = await productCollection.findOne(user);
            res.json(result);
        })
        // users post oders
        app.post('/oders',async (req, res) =>{
            const result = await oderCollection.insertOne(req.body)
            res.json(result);
        })
        // all user collection
        app.post('/allUser',async (req, res) =>{
            const item = req.body;
            console.log(item);
            const result = await allUserCollection.insertOne(req.body)
            res.json(result);
            console.log(result,"all result");
        });
        // all google user collection
        app.put('/allUser',async (req, res) =>{
            const user = req.body;
            const filter = {email:user.email};
            const options = { upsert: true };
            const updateDoc = {$set:user};
            const result = await allUserCollection.updateOne(filter,updateDoc,options);
            res.json(result);
        })
        // add admin user collection
        app.put('/users/admin', async(req,res)=>{
            const user = req.body;
            const filter ={email:user.email};
            const updateDoc ={$set: {role:'admin'} }
            const result = await allUserCollection.updateOne(filter,updateDoc);
            res.json(result)
            console.log(result)
          })
       app.get('/admin/:email',async (req, res)=>{
           const email = req.params.email;
           const query ={email: email};
           const filter =await allUserCollection.findOne(query);
           let isAdmin =false;
           if(filter?.role === 'admin'){
               isAdmin = true;
           }
           res.json({admin: isAdmin})
       })
    //    ============================

    //  ADMIN  dashbord
       app.delete('/deleteAll/:id',async (req, res)=>{
           const id = req.params.id;
           const query = {_id:ObjectId(id)}
           const result = await productCollection.deleteOne(query)
           res.json(result)
       });

    //    update get productCollection
       app.get('/updateproduct/:id',async (req, res)=>{
           const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await productCollection.findOne(query);
          res.json(result)

       })

       app.get('/manageOder',async (req, res)=>{
            const result = await oderCollection.find({}).toArray();
            res.json(result)
       });

       app.delete('/manageOder/:id',async (req, res)=>{
           const id = req.params.id;
           const query = {_id:ObjectId(id)};
           const result = await oderCollection.deleteOne(query);
           res.json(result);
       })

       app.put('/manageOder/:id', async (req, res) => {
           const id = req.params.id;
           const query = {_id:ObjectId(id)};
           const upDateItem = req.body;
           const updateDoc ={
               $set:{
                   status:"shipping"
               }
           }
           const result = await oderCollection.updateOne(query,updateDoc);
           res.json(result);
           console.log(result)
       })
    // ==================================
    // ===================== USER Dashboard 

    app.get('/myOder/:email',async (req, res)=>{
        const email = req.params.email;
        const user = {email: email};
        const result = await oderCollection.find(user).toArray();
        res.json(result); 
    })

    app.delete('/myOder/:id',async (req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await oderCollection.deleteOne(query);
        res.json(result);
        console.log(result);
    })

    // ================================
    }
    finally {
        // client.close();
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('bikes clubs server')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})