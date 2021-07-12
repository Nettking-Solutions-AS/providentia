import { users, items } from "./fixtures";
import { Item, User } from "./Types";
import { isAdmin } from "./helpers";

// Temporary local fetching
export const fetchUserData = async (
  email: string
): Promise<{
  user: { id: number; name: string; email: string; role: string };
  items: {};
}> => {
  const user = users.find((u) => u.email === email) || ({} as User);
  return {
    user,
    items: isAdmin(user as User)
      ? items
      : items.filter((item) =>
          item.owners.some((ownerID) => ownerID === user.id)
        ),
  };
};

export const fetchItem = async (itemID: number): Promise<Item | undefined> =>
  items.find((i) => i.id === itemID);
