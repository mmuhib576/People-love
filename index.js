const cors = require("cors");
const PORT = process.env.PORT || 8000
const express = require('express')
const uri = 'mongodb+srv://People-Love:xU6yUbTmYsJnTWB7@cluster0.gjcbjqc.mongodb.net/Cluster0?retryWrites=true&w=majority'
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {v1:uuidv1} = require('uuid');
const { connect } = require("react-redux");
const path = require('path');

//Google Auth
// app.use(passport.initializen());
// app.use(passport.session());
// app.use(
//     cookieSession({
//         name:"session",
//         keys:["cyberwolve"],
//         maxAge:24*60*60*100,
//     })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(
//     cors({
//         origin:"http:localhost:3000",
//         methods:"GET,POST,PUT,DELETE",
//         credentials:true,
//     })
// );
// app.use("/auth",authRoute);
// app.listen(port,() => console.log(`Listenting on ${PORT}...`));

//Google Auth Ends

// async function run() {
//     try {
//       await client.connect();
//       console.log('Connected successfully to server');
//     } catch (error) {
//       console.log(error);
//     } finally {
//       await client.close();
//     }
//   }
  
//   run();

const app = express()
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=> {
    res.json('Peope Love')
})
//Deploy routes 
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.post('/login',async(req,res)=>{
    const client = new MongoClient(uri)
    const {Student_email, password} = req.body
    try{
        await client.connect()
        const database = client.db('app-data') 
        const users = database.collection('users')
        const find_email = await users.findOne({Student_email})
        if (find_email && (await bcrypt.compare(password, find_email.hashed_password))) {
            const SecureKeyToekn = jwt.sign(find_email, Student_email, {
                expiresIn: 60 * 3
            });
            res.status(201).json({ SecureKeyToekn, userid: find_email.user_id, Student_email: find_email.Student_email });
        } else {
            res.status(400).send('Wrong Email or password');
        }

    }catch(error){
        console.log(error)
    }finally{
        await client.close()
    }
})

app.put('/updateuser',async(req,res)=>{
    const client = new MongoClient(uri)
    const forminputdata = req.body.forminputdata
    // console.log(forminputdata.firstname)
    try{
        await client.connect()
        const database = client.db('app-data') 
        const users = database.collection('users')

        const find_user = {user_id: forminputdata.user_id}
        const updateexistingUser = {
            $set:{
                user_id : forminputdata.user_id,
                firstname : forminputdata.firstname,
                lastname : forminputdata.LastName,
                date_of_birth_day : forminputdata.date_of_birth_day,
                date_of_birth_month : forminputdata.date_of_birth_month,
                date_of_birth_year : forminputdata.date_of_birth_year,
                show_gender : forminputdata.display_Gender,
                gender_identity : forminputdata.user_Gender,
                gender_interest : forminputdata.Gender_Interested,
                // email : cookie,
                url : forminputdata.image_url,
                about : forminputdata.about,
                matches :forminputdata.matches
            }
        }
        const updateddate = await users.updateOne(find_user,updateexistingUser)
        //res.status(201).json({SecureKeyToekn,userid : uuid ,Student_email: LcaseEmail})
        res.send(updateddate)
    }catch(error){
        console.log(error)
    }finally{
        await client.close()
    }
})

app.post('/signup',async(req,res)=> {
    const client = new MongoClient(uri)
    const {Student_email, password} = req.body
    const uuid = uuidv1()
    const Hpassword = await bcrypt.hash(password,10)
    try{
        await client.connect()
        const database = client.db('app-data') 
        const users = database.collection('users')
        const isexist =await users.findOne({Student_email})
        if(isexist){
            return res.status(409).send('Already registered')
        }
        else{
            // console.log(Student_email)
            // console.log(password)
            const LcaseEmail = Student_email.toLowerCase()
            const data = {
                user_id : uuid,
                Student_email : LcaseEmail,
                hashed_password : Hpassword

            }
            const DataInserted =  await users.insertOne(data)
            const SecureKeyToekn = jwt.sign(DataInserted,LcaseEmail,{
                expiresIn:60*3  
            })
            res.status(201).json({SecureKeyToekn,userid : uuid ,Student_email: LcaseEmail})

        }
    }catch(error){
        console.log(error)
    }finally{
        await client.close()
    }
})

app.get('/Cruser',async(req,res) => {
    const mg_client = new MongoClient(uri)
    const userid = req.query.userid
    // console.log('userid',userid);
    try{
        await mg_client.connect()
        const database = mg_client.db('app-data')
        
        const users = database.collection('users')
        const query = {user_id : userid}
        
        const user = await users.findOne(query)
        
        res.send(user)

    }finally{
        await mg_client.close()
    }
})

app.get('/genderprofile',async (req,res)=> {
    const client = new MongoClient(uri)
    const gender = req.query.gender
    try{
        await client.connect()
        const database = client.db('app-data') 
        const users = database.collection('users')
       // console.log(gender)
        const query = {gender_identity : {$eq : gender}}
        const All_Users_with_Gen = await users.find(query).toArray()
        //const returnusers = await users.find().toArray()
        res.send(All_Users_with_Gen)
    }finally{
        await client.close()
    }
})

// app.put('/add_new_Match',async(req,res) =>{
//     const client = new MongoClient(uri)
//     const {userid,MachedUser} = req.body
//     try{
//         await client.connect()
//         const database = client.db('app-data')
//         const users = database.collection('users')
//         const query = {user_id : userid}
//         const updateDoc = {
//             $push:{matches : {user_id : MachedUser}}
//         }
//         const Update_users = await users.updateOne(query,updateDoc)
//         res.send(Update_users)
//     }finally{
//         await client.close()
//     }
// })



app.put('/add_new_Match', async (req, res) => {
    const client = new MongoClient(uri);
    const { userid, MachedUser } = req.body;
  
    try {
      await client.connect();
      const database = client.db('app-data');
      const users = database.collection('users');
  
      // Check if the "MachedUser" ID already exists in the "matches" array
      const query = { user_id: userid, "matches.user_id": MachedUser };
      const user = await users.findOne(query);
  
      if (user) {
        // If the ID already exists, return an error message
        res.status(400).send({ error: "This user has already been matched." });
      } else {
        // If the ID doesn't exist, update the document and add the new ID to the "matches" array
        const updateQuery = { user_id: userid };
        const updateDoc = {
          $push: { matches: { user_id: MachedUser } }
        };
        const Update_users = await users.updateOne(updateQuery, updateDoc);
        res.send(Update_users);
      }
    } finally {
      await client.close();
    }
  });
  
  
  app.post('/addMessage',async(req,res) => {
    const client = new MongoClient(uri);
    const message = req.body.message
    const uuid = uuidv1()
    message.messageId = uuid
    try{
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('messages');
        const Added_Message = await users.insertOne(message)
        res.send(Added_Message)
        console.log(Added_Message)
    }
    catch(error){
        console.log(error)
    }
    finally{
        await client.close()
    }
})
  


app.get('/users',async(req,res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)
    console.log(userIds)
    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        
        const pipeline =  [
            {
                '$match':{
                    'user_id' : {
                        '$in' : userIds
                    }
                }
            }
        ]
        const foundUser = await users.aggregate(pipeline).toArray()
        // console.log(foundUser)
        res.send(foundUser)
    }finally{
        await client.close()
    }
})

app.get('/messages', async (req, res) => {
    const client = new MongoClient(uri);
    const { userid, receiverduserid } = req.query;

    try {
        await client.connect();
        const database = client.db('app-data');
        const messages = database.collection('messages');
       
        const query = { from_userid: userid, to_user: receiverduserid };
        const foundMessages = await messages.find(query).toArray();
        res.send(foundMessages);
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
});


app.put('/messagesseen/:messageId/seen', async (req, res) => {
    try {
      // Connect to MongoDB
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db();
  
      // Update the "seen" column of the message with the given ID
      const messageId = req.params.messageId;
      const result = await db.collection('messages').updateOne(
        { _id: messageId },
        { $set: { seen: true } }
      );
  
      // Return success message
      res.status(200).json({ message: `Message ${messageId} updated.` });
    } catch (err) {
      // Handle errors
      console.log(err);
      res.status(500).json({ error: err.message });
    } finally {
      // Close the connection to MongoDB
      await client.close();
    }
  });

app.listen(PORT,() => console.log('Server running on',PORT))