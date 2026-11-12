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
    siteUrl: text("Canonical site URL", "Public HTTPS URL assistants should research, including https://."),
    askAi: fields.object(
      {
        enabled: fields.checkbox({ label: "Show Ask AI links", defaultValue: false }),
        prompt: longText(
          "Prompt template",
          "Use {siteUrl} for the canonical URL above. Update availability wording when it changes.",
        ),
      },
      { label: "Ask AI" },
    ),
    cv: fields.file({
      label: "CV (PDF)",
      directory: "content/cv",
      description: "PDF only. In Google Docs: File > Download > PDF, then upload here. Served at /cv.",
    }),
    cvUpdated: fields.date({
      label: "CV last updated",
      description: 'Optional. Shown as "Updated <month year>" next to the CV button.',
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
