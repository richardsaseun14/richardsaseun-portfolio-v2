import { fields, singleton } from "@keystatic/core";
import { longText, text } from "./shared";

export const profile = singleton({
  label: "Profile",
  path: "content/profile",
  format: { data: "json" },
  schema: {
    name: text("Name"),
    email: text("Email"),
    location: text("Location"),
    bio: longText("Bio", "Used in the hero, footer and default page description."),
    replyTime: text("Reply time"),
    cvUrl: text("CV link"),
    socials: fields.array(
      fields.object({
        label: text("Label"),
        href: text("URL"),
      }),
      { label: "Socials", itemLabel: (props) => props.fields.label.value || "Social" },
    ),
  },
});
