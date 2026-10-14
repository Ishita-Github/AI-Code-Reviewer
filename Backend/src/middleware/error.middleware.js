async function errorHandler(err,req,res,next){
    if (res.headersSent) {
  return next(err);
}
    res.status(err.statusCode || 500).json({
            status:"Failed",
            message: err.message || "Internal Server Error"
        })
}

module.exports=errorHandler