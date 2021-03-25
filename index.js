const express=require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId= require('mongodb').ObjectId;
const password ='HyDhd9!ncWBn_Ta';
const uri = "mongodb+srv://organicUser:HyDhd9!ncWBn_Ta@cluster0.taqt5.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) =>{
     res.sendFile(__dirname + '/index.html')
})

client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
    app.get('/products', (req, res) =>{
         productCollection.find({})  //to read fixed number of data we use .limit(4)
        .toArray((err,documents) =>{
            res.send(documents)
        })
    })


  app.post('/addProduct',(req,res) =>{
    const product=req.body;
    productCollection.insertOne(product)
    .then(result =>{
        console.log('data added successfully')
        res.send('success')
    })
     
})

app.delete('/delete/:id', (req, res) =>{
  productCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result =>{
     console.log(result)
  })
})
 
});

app.listen(3000)