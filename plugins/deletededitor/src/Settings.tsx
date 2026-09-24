import { React, ReactNative } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { Forms } from "@vendetta/ui/components";

console.log("[DeletedEditor] Settings module evaluated", {
  Forms: typeof Forms,
  formKeys: Forms ? Object.keys(Forms) : null,
});

export default function Settings() {
  console.log("[DeletedEditor] Settings rendering");
  useProxy(storage);

  const { FormSection, FormInput, FormText } = (Forms ?? {}) as any;
  const { ScrollView } = ReactNative;
  console.log("[DeletedEditor] components", {
    FormSection: !!FormSection,
    FormInput: !!FormInput,
    FormText: !!FormText,
  });

  return (
    <ScrollView>
      <FormSection title="Deleted User Editor" titleStyleType="no_border">
        <FormInput title="Name" placeholder="Deleted" value={storage.name} onChange={(v: string) => (storage.name = v)} />
        <FormInput title="Avatar" placeholder="https://example.com/avatar.png" value={storage.avatar} onChange={(v: string) => (storage.avatar = v)} />
        <FormText style={{ margin: 16, opacity: 0.6 }}>
          Leave a field empty to keep Deleted Users default names or avatars. You should reload after updating.
        </FormText>
      </FormSection>
    </ScrollView>
  );
}
