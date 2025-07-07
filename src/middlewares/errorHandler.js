import logger from "../logs/logger.js"

export default function erroHandler(error,req,res,next){
    console.log('error nombre: ', error.name)
    logger.error(error.message);

    if(error.name === 'ValidationError'){
        res.status(400).json({message: error.message});        
    } else if (error.name === 'JsonWebTokenError') {
        res.status(401).json({message: error.message});        
    } else if (error.name === 'TokenExpiredError') {
        res.status(401).json({message: error.message});        
    } else if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError' ||
        error.name === 'SequelizeForeignKeyConstrainError'
    ) {
        res.status(400).json({message: error.message}); 
    } else{
        res.status(500).json({message: error.message}); 
    }
}