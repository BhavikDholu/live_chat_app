const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("welcome to chat app")
})

app.listen(4500,() => {
//   try {
//     await connection;
//     console.log("connected to db");
//   } catch (error) {
//     console.log(error);
//   }
  console.log("running port 4500");
});