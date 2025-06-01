import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  adminClient,
  multiSessionClient,
  usernameClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({});
export const { signIn, signUp, useSession } = createAuthClient({
  plugins: [
    emailOTPClient(),
    adminClient(),
    multiSessionClient(),
    usernameClient(),
  ],
});
