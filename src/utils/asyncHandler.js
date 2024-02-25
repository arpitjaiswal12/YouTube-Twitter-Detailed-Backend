const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };


// using try and catch

// here asuncHandler is js higher order function which accept an function or return an function

// as this accept an function
// ye jo function pass kra hai ussme sa extract kr lo req,res,next
// here next is important to pass it to next middleware checking

// const asyncHandler = (fun) => {()=>{}}// this finction calling another function

/*const asyncHandler = (func) => { 
  async (req,res,next) => {
    try {
        await func(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message:err.message
        })
        
    }
  };
};
*/
