import 'tsconfig-paths/register';

import { app } from './app';
import { EXPRESS_PORT } from './config/enviroment';

app.listen(EXPRESS_PORT, () => {
  console.log('Server started on port: ' + EXPRESS_PORT);
});
