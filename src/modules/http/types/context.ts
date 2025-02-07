import type { User } from "@/modules/user/types/user";
import type { Session } from "lucia";

export type CustomContext = {
  Variables: {
    session: Session;
    currentUser: User;
  };
};
