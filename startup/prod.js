import helmet from 'helmet';
import compression from 'compression';

export default app =>{
     app.use(helmet());
     app.use(compression);
}