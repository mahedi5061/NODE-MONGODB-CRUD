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

    app.get('/update/:id', (req, res) =>{
      productCollection.find({_id:ObjectId(req.params.id)}) //to read fixed number of data we use
      .toArray((err,documents) =>{
        res.send(documents[0])
      })
    })


  app.post('/addProduct',(req,res) =>{
    const product=req.body;
    productCollection.insertOne(product)
    .then(result =>{
        console.log('data added successfully')
        res.redirect('/')
    })
     
})

app.patch('/updateAProduct/:id', (req, res)=>{
  productCollection.updateOne({_id:ObjectId(req.params.id)},
  {
    $set: {price:req.body.price,quantity:req.body.quantity}
  })
  .then(result =>{
     res.send(result.modifiedCount>0)
  })
  
})

app.delete('/delete/:id', (req, res) =>{
  productCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result =>{
      res.send(result.deletedCount>0)
  })
})
 
});

app.listen(3000)