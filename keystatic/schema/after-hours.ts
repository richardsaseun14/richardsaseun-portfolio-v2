import { fields, singleton } from "@keystatic/core";
import { image, labelValueList, longText, text } from "./shared";

export const afterHours = singleton({
  label: "After hours",
  path: "content/after-hours",
  format: { data: "json" },
  schema: {
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
    music: fields.object(
      {
        title: text("Album or playlist"),
        artist: text("Artist"),
        note: text("Note"),
        listenLabel: text("Listen label", "e.g. Listen on Spotify"),
        listenHref: text("Listen URL"),
        playlistsHref: text("Playlists URL"),
        cover: image("Cover", "music"),
      },
      { label: "Music" },
    ),
    books: fields.object(
      {
        current: fields.object(
          {
            title: text("Title"),
            author: text("Author"),
            note: text("Note"),
            page: fields.integer({ label: "Current page", defaultValue: 0 }),
            pages: fields.integer({ label: "Total pages", defaultValue: 1, validation: { min: 1 } }),
          },
          { label: "Currently reading" },
        ),
        finished: fields.array(
          fields.object({ title: text("Title"), author: text("Author") }),
          { label: "Finished", itemLabel: (props) => props.fields.title.value || "Book" },
        ),
        listHref: text("Reading list URL"),
      },
      { label: "Books" },
    ),
    games: fields.array(
      fields.object({
        title: text("Title"),
        meta: text("Meta", "e.g. PS5 · 40h"),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Playing", value: "Playing" },
            { label: "Finished", value: "Finished" },
          ],
          defaultValue: "Playing",
        }),
        cover: image("Cover", "games"),
      }),
      { label: "Games", itemLabel: (props) => props.fields.title.value || "Game" },
    ),
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
