import { app } from './app';
import './db';

app.listen(process.env.PORT || 3000, () => console.log('Server is ready!'));
