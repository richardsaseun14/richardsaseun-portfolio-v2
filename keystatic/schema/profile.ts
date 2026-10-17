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
    cv: fields.file({
      label: "CV (PDF)",
      directory: "content/cv",
      description: "PDF only. In Google Docs: File > Download > PDF, then upload here. Served at /cv.",
    }),
    cvUpdated: fields.date({
      label: "CV last updated",
      description: "Optional. Shown as \"Updated <month year>\" next to the CV button.",
    }),
    socials: fields.array(
      fields.object({
        label: text("Label"),
        href: text("URL"),
      }),
      { label: "Socials", itemLabel: (props) => props.fields.label.value || "Social" },
    ),
  },
});
