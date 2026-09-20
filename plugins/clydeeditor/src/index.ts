import { findByStoreName, findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";

const CLYDE_ID = "1";
const UserStore = findByStoreName("UserStore");
const AvatarUtils = findByProps("getUserAvatarSource");
const patches: (() => void)[] = [];

export default {
  onLoad() {
    storage.name ??= "";
    storage.avatar ??= "";
    if (UserStore) {
      patches.push(
        after("getUser", UserStore, ([id]: string[], user: any) => {
          if (id !== CLYDE_ID || !user || !storage.name) return;
          user.username = storage.name;
          user.globalName = storage.name;
        })
      );
    }
    if (AvatarUtils) {
      patches.push(
        after("getUserAvatarSource", AvatarUtils, ([user]: any[], res: any) => {
          if (user?.id === CLYDE_ID && storage.avatar) return { uri: storage.avatar };
        })
      );
    }
  },
  onUnload() {
    patches.forEach((p) => p());
  },
  settings: Settings,
};
