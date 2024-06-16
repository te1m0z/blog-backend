import express from 'express';
import * as M from './middlewares';
import * as R from './routes';

const app = express();

app.use(M.jsonMiddleware);
app.use(M.compressMiddleware);
app.use(M.corsMiddleware);

/* App routers */
app.use(R.userRouter);
app.use(R.noteRouter);
app.use(R.csrfRouter);
app.use(R.categoryRouter);
// app.use(categoryRouter);
// app.use(laboratoryRouter);
// this.app.use(csrfRouter);
// this.app.use(jwtRouter);

app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found on the server</h1>');
});

/* Uncaught error on the server */
app.use(M.errorMiddleware);

export { app };
