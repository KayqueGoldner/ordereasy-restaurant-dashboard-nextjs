import { DefaultUser } from "@auth/core/types";

import { UserRole } from "@/db/schema/users";

declare module "@auth/core/types" {
  interface User extends DefaultUser {
    role?: UserRole;
  }

  interface Session {
    user: User;
  }
}
