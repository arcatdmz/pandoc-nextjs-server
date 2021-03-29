import { IScrapboxOptions } from "./scrapbox";

export default {
  uploadDir: "uploads",
  formats: [
    { id: "Adobe PDF (.pdf)", value: "pdf", mime: "application/pdf" },
    { id: "HTML (.html)", value: "html", mime: "text/html" },
    {
      id: "GitHub-Flavored Markdown (.md)",
      value: "gfm",
      ext: "md",
      mime: "text/plain",
    },
    {
      id: "Pandoc's Markdown (.md)",
      value: "markdown",
      ext: "md",
      mime: "text/plain",
    },
    { id: "reStructuredText (.rst)", value: "rst", mime: "text/plain" },
    { id: "Rich Text Format (.rtf)", value: "rtf", mime: "application/rtf" },
    {
      id: "Microsoft Word (.docx)",
      value: "docx",
      mime:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  ],
  scrapbox: {
    options: {
      // only show `2021-03-30`-like pages
      filter: /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/,
      // opening Scrapbox tags
      openings: [],
      // ending Scrapbox tags
      endings: [],
      skipBlankPages: true,
    } as IScrapboxOptions,
  },
};
