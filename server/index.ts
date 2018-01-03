import App from './app';
import * as debug from 'debug';

debug('ts-express:server');

App.listen(process.env.PORT || 3000, () => console.log('Server is ready!'));