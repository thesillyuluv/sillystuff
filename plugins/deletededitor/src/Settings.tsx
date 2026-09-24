import { findByStoreName, findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import Settings from "./Settings";

console.log("[DeletedEditor] index evaluated", { settings: typeof Settings });

const CLYDE_ID = "1";
const UserStore = findByStoreName("UserStore");
const AvatarUtils = findByProps("getUserAvatarSource");
const patches: (() => void)[] = [];

export default {
  onLoad() {
    try {
      console.log("[ClydeEditor] onLoad", {
        UserStore: !!UserStore,
        AvatarUtils: !!AvatarUtils,
        name: storage.name,
        avatar: storage.avatar,
      });
      
      storage.name ??= "";
      storage.avatar ??= "";

      if (UserStore) {
        patches.push(
          after("getUser", UserStore, ([id]: string[], user: any) => {
            if (id !== CLYDE_ID || !user || !storage.name) return;
            console.log("[DeletedEditor] renaming Deleted to", storage.name);
            user.username = storage.name;
            user.globalName = storage.name;
          })
        );
      }
      if (AvatarUtils) {
        patches.push(
          after("getUserAvatarSource", AvatarUtils, ([user]: any[], res: any) => {
            if (user?.id === CLYDE_ID && storage.avatar) {
              console.log("[DeletedEditor] swapping Deleted avatar");
              return { uri: storage.avatar };
            }
          })
        );
      }
    } catch (e) {
      console.log("[ClydeEditor] onLoad error", e);
      showToast("Clyde Editor error, check logs");
    }
  },
  onUnload() {
    console.log("[ClydeEditor] onUnload");
    patches.forEach((p) => p());
  },
  settings: Settings,
};
