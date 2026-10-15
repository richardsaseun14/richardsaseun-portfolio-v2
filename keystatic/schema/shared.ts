import { fields } from "@keystatic/core";

// Field helpers reused across singletons and collections.

export const text = (label: string, description?: string) => fields.text({ label, description });

export const longText = (label: string, description?: string) =>
  fields.text({ label, description, multiline: true });

export const textList = (label: string, itemLabel: string) =>
  fields.array(fields.text({ label: itemLabel }), {
    label,
    itemLabel: (props) => props.value || itemLabel,
  });

export const labelValueList = (label: string) =>
  fields.array(
    fields.object({
      label: text("Label"),
      value: text("Value"),
    }),
    { label, itemLabel: (props) => props.fields.label.value || "Item" },
  );

export const titleBodyList = (label: string) =>
  fields.array(
    fields.object({
      title: text("Title"),
      body: longText("Body"),
    }),
    { label, itemLabel: (props) => props.fields.title.value || "Item" },
  );

export const image = (label: string, folder: string) =>
  fields.image({
    label,
    directory: `public/images/${folder}`,
    publicPath: `/images/${folder}/`,
  });
