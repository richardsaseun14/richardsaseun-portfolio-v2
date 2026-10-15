import { fields, singleton } from "@keystatic/core";
import { text, textList, titleBodyList } from "./shared";

export const home = singleton({
  label: "Home",
  path: "content/home",
  format: { data: "json" },
  schema: {
    marquee: textList("Marquee", "Phrase"),
    stats: fields.array(
      fields.object({
        value: text("Value", "e.g. 50K"),
        accent: text("Accent", "Highlighted suffix, e.g. +"),
        label: text("Label"),
      }),
      { label: "Stats", itemLabel: (props) => props.fields.value.value || "Stat" },
    ),
    principles: titleBodyList("Principles"),
    pipeline: textList("Pipeline steps", "Step"),
    stack: fields.array(
      fields.object({
        group: text("Group"),
        items: textList("Items", "Tool"),
      }),
      { label: "Stack", itemLabel: (props) => props.fields.group.value || "Group" },
    ),
  },
});
