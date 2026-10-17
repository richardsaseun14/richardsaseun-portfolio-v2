import { fields, singleton } from "@keystatic/core";
import { labelValueList, longText, text, textList, titleBodyList } from "./shared";

export const about = singleton({
  label: "About",
  path: "content/about",
  format: { data: "json" },
  schema: {
    intro: longText("Intro", "A short paragraph about you, shown at the top of the page"),
    roots: fields.array(
      fields.object({
        key: fields.select({
          label: "Icon",
          options: [
            { label: "Faith", value: "faith" },
            { label: "Roots", value: "roots" },
            { label: "Family", value: "family" },
          ],
          defaultValue: "faith",
        }),
        label: text("Label"),
        title: text("Title"),
        body: longText("Body"),
      }),
      { label: "Roots", itemLabel: (props) => props.fields.label.value || "Root" },
    ),
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
    learning: fields.object(
      {
        title: text("Title"),
        body: longText("Body"),
        facts: labelValueList("Facts"),
      },
      { label: "Learning" },
    ),
  },
});
