FROM node:20-alpine3.17

WORKDIR /app

COPY package*.json /app

RUN npm ci --omit=dev

COPY . .

ARG JWT_SECRET

ARG JWT_ACCESS_EXPIRES

ARG JWT_REFRESH_EXPIRES

ARG EXPRESS_PORT

ARG EXPRESS_SESSION_SECRET

ARG EXPRESS_SESSION_MAX_AGE

ARG SENTRY_DSN

ARG PRISMA_TEST_USER_LOGIN

ARG PRISMA_TEST_USER_PASSWORD

ARG NODE_ENV

ENV JWT_SECRET $JWT_SECRET

ENV JWT_ACCESS_EXPIRES $JWT_ACCESS_EXPIRES

ENV JWT_REFRESH_EXPIRES $JWT_REFRESH_EXPIRES

ENV EXPRESS_PORT $EXPRESS_PORT

ENV EXPRESS_SESSION_SECRET $EXPRESS_SESSION_SECRET

ENV EXPRESS_SESSION_MAX_AGE $EXPRESS_SESSION_MAX_AGE

ENV SENTRY_DSN $SENTRY_DSN

ENV PRISMA_TEST_USER_LOGIN $PRISMA_TEST_USER_LOGIN

ENV PRISMA_TEST_USER_PASSWORD $PRISMA_TEST_USER_PASSWORD

ENV NODE_ENV $NODE_ENV

EXPOSE $PORT

CMD ["npm", "run", "dev"]