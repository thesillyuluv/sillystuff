import { findByStoreName, findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import Settings from "./Settings";

console.log("[DeletedEditor] index evaluated", { settings: typeof Settings });

const DEL_ID = "456226577798135808";
const UserStore = findByStoreName("UserStore");
const AvatarUtils = findByProps("getUserAvatarSource");
const patches: (() => void)[] = [];

export default {
  onLoad() {
    try {
      console.log("[DeletedEditor] onLoad", {
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
            if (id !== DEL_ID || !user || !storage.name) return;
            console.log("[DeletedEditor] renaming Deleted to", storage.name);
            user.username = storage.name;
            user.globalName = storage.name;
          })
        );
      }
      if (AvatarUtils) {
        patches.push(
          after("getUserAvatarSource", AvatarUtils, ([user]: any[], res: any) => {
            if (user?.id === DEL_ID && storage.avatar) {
              console.log("[DeletedEditor] swapping Deleted avatar");
              return { uri: storage.avatar };
            }
          })
        );
      }
    } catch (e) {
      console.log("[DeletedEditor] onLoad error", e);
      showToast("Deleted User Editor error, check logs");
    }
  },
  onUnload() {
    console.log("[DeletedEditor] onUnload");
    patches.forEach((p) => p());
  },
  settings: Settings,
};
