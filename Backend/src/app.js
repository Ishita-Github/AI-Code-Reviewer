const express=require("express");
const app=express();
const aiRoutes=require("./routes/ai.routes");
const errMiddleware=require("./middleware/error.middleware");
const cors=require("cors");
const helmet=require("helmet");


app.use(helmet())
app.use(cors())
app.use(express.json({limit:"100kb"}));
app.get('/',(req,res) => {
    res.send("Hello World")
})
app.use("/ai",aiRoutes);
app.use(errMiddleware)

module.exports=app;