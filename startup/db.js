import {database} from '../config';
import mongoose from 'mongoose';
import {logger} from '../middleware/logger';


//coonect to database
export default mongoose.connect(database)
    .then(() => logger.info(`Connected ${database} to MongoDB...`))
    .catch((err) => console.log(`Unable to connect ${err}`))
