module.exports=func=>(req,res,next)=>{
    return (req,res,next)=>{
        func(req,res,next).catch(next);
    }
}