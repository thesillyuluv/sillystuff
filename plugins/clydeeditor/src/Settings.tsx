import { React, ReactNative } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { Forms } from "@vendetta/ui/components";

const { FormSection, FormInput, FormText } = Forms;
const { ScrollView } = ReactNative;

export default function Settings() {
  useProxy(storage);

  return (
    <ScrollView>
      <FormSection title="Clyde Editor" titleStyleType="no_border">
        <FormInput title="Name" placeholder="Clyde" value={storage.name} onChange={(v: string) => (storage.name = v)} />
        <FormInput title="Avatar" placeholder="https://example.com/avatar.png" value={storage.avatar} onChange={(v: string) => (storage.avatar = v)} />
        <FormText style={{ margin: 16, opacity: 0.6 }}>
          Leave a field empty to keep Clyde's default name or avatar. You should reload after updating.
        </FormText>
      </FormSection>
    </ScrollView>
  );
}
