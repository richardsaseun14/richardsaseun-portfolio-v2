import { fields, singleton } from "@keystatic/core";
import { labelValueList, text, textList, titleBodyList } from "./shared";

export const about = singleton({
  label: "About",
  path: "content/about",
  format: { data: "json" },
  schema: {
    experience: fields.array(
      fields.object({
        period: text("Period", "e.g. 2021 – Now"),
        current: fields.checkbox({ label: "Current role" }),
        company: text("Company"),
        role: text("Role"),
        notes: textList("Notes", "Note"),
      }),
      { label: "Experience", itemLabel: (props) => props.fields.company.value || "Role" },
    ),
    capabilities: titleBodyList("Capabilities"),
    quickFacts: labelValueList("Quick facts"),
  },
});
