import { DefaultUser } from "@auth/core/types";

declare module "@auth/core/types" {
  interface User extends DefaultUser {
    cartId?: string;
  }

  interface Session {
    user: User;
  }
}
