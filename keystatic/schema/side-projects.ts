import { fields, singleton } from "@keystatic/core";
import { text } from "./shared";

export const sideProjects = singleton({
  label: "Side projects",
  path: "content/side-projects",
  format: { data: "json" },
  schema: {
    items: fields.array(
      fields.object({
        name: text("Name"),
        blurb: text("Blurb", "One line: what it does and why you built it."),
        date: text("Date", "e.g. Mar 2026"),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Live", value: "Live" },
            { label: "Building", value: "Building" },
            { label: "Archived", value: "Archived" },
          ],
          defaultValue: "Building",
        }),
        tags: fields.array(text("Tag"), { label: "Tags", itemLabel: (props) => props.value || "Tag" }),
        demo: text("Demo URL", "Leave empty to hide."),
        code: text("Code URL", "Leave empty to hide."),
      }),
      {
        label: "Side projects",
        description: "Newest first. Add new builds to the top.",
        itemLabel: (props) => props.fields.name.value || "Side project",
      },
    ),
  },
});
