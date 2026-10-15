import { collection, fields } from "@keystatic/core";
import { longText, text, textList } from "./shared";

export const projects = collection({
  label: "Projects",
  path: "content/projects/*",
  slugField: "name",
  format: { data: "json" },
  columns: ["order", "year"],
  schema: {
    name: fields.slug({ name: { label: "Name" }, slug: { label: "URL slug" } }),
    order: fields.integer({ label: "Order", description: "Lower numbers show first.", defaultValue: 0 }),
    featured: fields.checkbox({ label: "Featured on home page" }),
    blurb: text("Blurb", "One line on what it does and who it's for."),
    type: text("Type", "e.g. Web + Mobile"),
    role: text("Role"),
    year: text("Year"),
    tags: fields.multiselect({
      label: "Tags",
      options: [
        { label: "Web", value: "Web" },
        { label: "Mobile", value: "Mobile" },
        { label: "AI", value: "AI" },
        { label: "Open source", value: "Open source" },
      ],
    }),
    metrics: fields.array(
      fields.object({
        value: text("Value", "e.g. 50K"),
        accent: text("Accent", "Highlighted suffix, e.g. + or %"),
        label: text("Label"),
      }),
      { label: "Metrics", itemLabel: (props) => props.fields.label.value || "Metric" },
    ),
    caseStudy: fields.object(
      {
        industry: text("Industry"),
        summary: longText("Summary"),
        timeline: text("Timeline"),
        team: text("Team"),
        stack: text("Stack", "e.g. React Native · Next.js · Node · Postgres"),
        links: fields.array(
          fields.object({ label: text("Label"), href: text("URL") }),
          { label: "Links", itemLabel: (props) => props.fields.label.value || "Link" },
        ),
        problem: fields.array(longText("Paragraph"), {
          label: "Problem",
          itemLabel: (props) => props.value.slice(0, 60) || "Paragraph",
        }),
        thinking: fields.object(
          {
            intro: longText("Intro"),
            quote: text("Pull quote"),
            decisions: textList("Decisions", "Decision"),
          },
          { label: "Thinking" },
        ),
        built: fields.object(
          {
            intro: longText("Intro"),
            mobileShots: textList("Mobile screenshot captions", "Caption"),
            webShot: text("Web screenshot caption"),
          },
          { label: "What I built" },
        ),
        outcome: longText("Outcome"),
      },
      { label: "Case study" },
    ),
  },
});
