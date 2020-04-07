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
};
