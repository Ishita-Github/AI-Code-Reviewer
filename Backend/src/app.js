const express=require("express");
const app=express();
const aiRoutes=require("./routes/ai.routes");
const cors=require("cors");
app.use(cors())
app.use(express.json({limit:"100kb"}));

app.get('/',(req,res) => {
    res.send("Hello World")
})

app.use("/ai",aiRoutes);

module.exports=app;