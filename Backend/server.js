require("dotenv").config(); //To access env file variables

const app=require('./src/app');

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})