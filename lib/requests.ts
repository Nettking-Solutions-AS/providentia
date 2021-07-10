import * as fixtures from "./fixtures.json";
import { User } from "./Types";
import { isAdmin } from "./helpers";

// Temporary local fetching
// eslint-disable-next-line import/prefer-default-export
export const fetchUserData = async (
  email: string
): Promise<{
  user: { id: number; name: string; email: string; role: string };
  items: {};
}> => {
  const user = fixtures.users.find((u) => u.email === email) || ({} as User);
  return {
    user,
    items: isAdmin(user as User)
      ? fixtures.items
      : fixtures.items.filter((item) =>
          item.owners.some((ownerID) => ownerID === user.id)
        ),
  };
};
