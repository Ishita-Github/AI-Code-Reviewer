const express=require("express");
const router=express.Router();
const aiController=require("../controllers/ai.controllers");
const rateLimiter=require("../middleware/rate.middleware");

router.post("/get-review",rateLimiter,aiController.getReview);


module.exports=router;