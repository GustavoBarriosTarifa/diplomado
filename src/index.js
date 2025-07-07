import 'dotenv/config'
import app from './app.js';
import logger from './logs/logger.js';
import config from './config/env.js';
import { sequelize } from './database/database.js';

async function main() {
    await sequelize.sync({force:true});//false si vas a sincronizzar cada ves
    const port = config.PORT;
    app.listen(port);
    console.log('Server is running port '+ port);
    logger.info('Server started on port 3000')
    logger.error('Server is a error on port 3000')
    logger.warn('Server is a warn on port 3000')
    logger.fatal('Server is a fatal on port 3000')    

    
}

main();