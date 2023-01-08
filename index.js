const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
 
const uri = process.env.M_SECRET_KEY;
// console.log(uri);
const Client = new MongoClient(uri)
 
async function run(){
    try {
        const PostCollection = Client.db("todoApp").collection("userData")

        app.post("/userData",async(req, res)=>{
            try {
               const result = await PostCollection.insertOne(req.body)
                res.send({message : "success" , info : result})
            } catch (error) {
                console.log(error);
            }

        })
        app.get("/userData", async(req, res)=>{
           const userData = await PostCollection.find({}).toArray();
            res.send(userData);
        })
        app.delete("/userData/:id", async(req, res)=>{
           try {
            const id = req.params.id;
            const result = await PostCollection.deleteOne({_id : ObjectID(id)})
            res.send({message : "success", info : result})
           } catch (error) {
            console.log(error);
           }
        })
        app.put("/userData/:id", async(req, res)=>{
           try {
             const id = req.params.id;
            const result = await PostCollection.updateOne({_id : ObjectID(id)},{$set : {
                taskCompleted : true,
            }})
            const newData = await PostCollection.find({}).toArray();
            res.send({message : "success",newData : newData});
           } catch (error) {
            console.log(error)
           }
        })

    } catch (error) {
        console.log(error);
    }
}
run().catch(e=>console.log(e));
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))