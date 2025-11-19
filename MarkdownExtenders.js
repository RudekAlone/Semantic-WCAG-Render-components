export class MarkdownExtenders {
  static applyMarkdownStyles(previewElement) {
    previewElement.querySelectorAll("h1").forEach((el) => {
      el.style.fontSize = "2em";
      el.style.marginBottom = "0.5em";
    });
    console.log('Markdown styles applied.');
  }
}