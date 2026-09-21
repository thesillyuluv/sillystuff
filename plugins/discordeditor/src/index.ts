import { findByStoreName, findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";

const DISCORD_ID = "643945264868098049";

const UserStore = findByStoreName("UserStore");
const AvatarUtils = findByProps("getUserAvatarSource");

const patches: (() => void)[] = [];

export const onLoad = () => {
  storage.name ??= "";
  storage.avatar ??= "";

  patches.push(
    after("getUser", UserStore, ([id]: string[], user: any) => {
      if (id !== DISCORD_ID || !user || !storage.name) return;
      user.username = storage.name;
      user.globalName = storage.name;
    })
  );

  if (AvatarUtils) {
    patches.push(
      after("getUserAvatarSource", AvatarUtils, ([user]: any[], res: any) => {
        if (user?.id === DISCORD_ID && storage.avatar) return { uri: storage.avatar };
      })
    );
  }
};

export const onUnload = () => patches.forEach((p) => p());

export const settings = Settings;
