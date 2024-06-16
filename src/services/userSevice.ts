import { compareSync } from 'bcrypt';
import { prisma } from '@/config/prisma';
import { createTokens } from '@/services/jwtService';

type TUserLoginArgs = {
  login: string;
  password: string;
  fingerprint: string;
};

export async function userLogin(args: TUserLoginArgs) {
  //
  const { login, password, fingerprint } = args;
  // Try to get user from db, otherwise throw error
  const user = await prisma.user.findUniqueOrThrow({ where: { login } });
  // Compare original password with hashed in db
  const isPasswordsMatch = compareSync(password, user.password);
  //
  if (!isPasswordsMatch) throw null;
  // Creating Access and Refresh tokens
  const tokens = await createTokens({
    sub: String(user.id),
    iss: 'login',
    fingerprint
  });
  // Preparing data to get back to client's browser
  return {
    id: user.id,
    login: user.login,
    ...tokens
  };
}
