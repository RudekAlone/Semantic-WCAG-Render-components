import { RenderInput } from "../../Render/RenderInput.js";
import { RenderMarkdown } from "../../RenderMarkdown.js";

/**
 * Komponent edytora Markdown z podglądem na żywo i synchronizacją przewijania.
 * Realizuje zasadę Single Responsibility Principle (SRP) dla edycji treści markdown.
 */
export class MarkdownEditorComponent {
  /**
   * Tworzy instancję edytora.
   * @param {string} label - Etykieta dla pola tekstowego.
   * @param {string} idPrefix - Prefiks dla ID elementów (unikalność).
   * @param {string} initialValue - Wartość początkowa.
   * @param {Function} [previewRenderer=null] - Opcjonalna funkcja renderująca podgląd (domyślnie RenderMarkdown.renderMarkdownPreview).
   *                                            Sygnatura: (previewElement, textContent) => void
   */
  constructor(label, idPrefix, initialValue = "", previewRenderer = null) {
    this.label = label;
    this.idPrefix = idPrefix;
    this.initialValue = initialValue;
    this.previewRenderer = previewRenderer || RenderMarkdown.renderMarkdownPreview.bind(RenderMarkdown);
    
    // Elementy DOM
    this.container = null;
    this.textarea = null;
    this.preview = null;
    
    // Stan synchronizacji
    this.state = {
      activeSource: null,
      skipPreviewSync: false,
      finalizeTimer: null,
    };
  }

  /**
   * Renderuje komponent edytora.
   * @returns {HTMLElement} Kontener edytora (zawiera sekcję edycji i podglądu).
   */
  render() {
    this.container = document.createElement("div");
    this.container.classList.add("markdown-editor-component", "flex", "gap-20", "editor-height");

    // Sekcja edytora
    const editorSection = document.createElement("section");
    editorSection.classList.add("editor-section", "flex-1", "flex", "flex-column");

    const headerEditor = document.createElement("h3");
    headerEditor.textContent = this.label;
    editorSection.appendChild(headerEditor);

    const editorWrapper = RenderInput.renderTextArea("", `${this.idPrefix}-input`, `${this.idPrefix}-input`, 44, 80);
    editorWrapper.classList.add("flex-1", "flex", "flex-column");
    
    this.textarea = editorWrapper.querySelector("textarea");
    this.textarea.value = this.initialValue;
    this.textarea.classList.add("resize-none", "h-100");
    
    editorSection.appendChild(editorWrapper);

    // Sekcja podglądu
    const previewSection = document.createElement("section");
    previewSection.classList.add("preview-section", "flex-1", "flex", "flex-column");

    const headerPreview = document.createElement("h3");
    headerPreview.textContent = "Podgląd";
    previewSection.appendChild(headerPreview);

    this.preview = document.createElement("div");
    this.preview.id = `${this.idPrefix}-preview`;
    this.preview.classList.add("preview-markdown", "flex-1", "border-standard", "pd-10", "overflow-y-auto");
    this.preview.setAttribute("role", "region");
    this.preview.setAttribute("aria-label", "Podgląd treści");
    this.preview.tabIndex = 0; // Umożliwia przewijanie klawiaturą
    
    previewSection.appendChild(this.preview);

    this.container.appendChild(editorSection);
    this.container.appendChild(previewSection);

    this.attachEvents();
    
    // Inicjalny render podglądu
    this.updatePreview();

    return this.container;
  }

  /**
   * Podpina zdarzenia (input, scroll, sync).
   */
  attachEvents() {
    // Input -> Update Preview
    this.textarea.addEventListener("input", () => {
      this.updatePreview();
      // Emit custom event for parent components
      this.container.dispatchEvent(new CustomEvent("editor-change", { 
        bubbles: true, 
        detail: { value: this.textarea.value } 
      }));
    });

    // Klawiatura w preview
    this.preview.addEventListener("keydown", (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) {
        this.state.skipPreviewSync = true;
        if (this.state.finalizeTimer) {
          clearTimeout(this.state.finalizeTimer);
          this.state.finalizeTimer = null;
        }
      }
    });

    this.preview.addEventListener("keyup", (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) {
        this.state.skipPreviewSync = false;
        this.state.finalizeTimer = setTimeout(() => {
          this.finalizeAlign();
          this.state.finalizeTimer = null;
        }, 30);
      }
    });

    // Sync edytor -> preview
    this.textarea.addEventListener("scroll", () => {
      if (this.state.activeSource === "preview") return;
      this.state.activeSource = "editor";
      requestAnimationFrame(() => {
        const ratio = this.textarea.scrollTop / (this.textarea.scrollHeight - this.textarea.clientHeight);
        // Zabezpieczenie przed dzieleniem przez zero lub NaN
        if (!Number.isFinite(ratio)) return;
        
        this.preview.scrollTop = ratio * (this.preview.scrollHeight - this.preview.clientHeight);
        this.state.activeSource = null;
      });
    });

    // Sync preview -> edytor
    this.preview.addEventListener("scroll", () => {
      if (this.state.activeSource === "editor") return;
      if (this.state.skipPreviewSync) return;
      this.state.activeSource = "preview";
      requestAnimationFrame(() => {
        const ratio = this.preview.scrollTop / (this.preview.scrollHeight - this.preview.clientHeight);
        if (!Number.isFinite(ratio)) return;

        this.textarea.scrollTop = ratio * (this.textarea.scrollHeight - this.textarea.clientHeight);
        this.state.activeSource = null;
      });
    });
  }

  updatePreview() {
    if (this.preview && this.textarea) {
      this.previewRenderer(this.preview, this.textarea.value);
    }
  }

  finalizeAlign() {
    if (!this.preview || !this.textarea) return;
    
    const ratio = this.preview.scrollTop / (this.preview.scrollHeight - this.preview.clientHeight);
    if (!Number.isFinite(ratio)) return;

    let targetTop = ratio * (this.textarea.scrollHeight - this.textarea.clientHeight);

    const lh = parseFloat(getComputedStyle(this.textarea).lineHeight) || parseFloat(getComputedStyle(this.textarea).fontSize);
    if (lh && Number.isFinite(lh)) {
      targetTop = Math.round(targetTop / lh) * lh;
    }

    this.state.activeSource = "preview";
    this.textarea.scrollTop = targetTop;
    this.state.activeSource = null;
  }

  /**
   * Ustawia wartość edytora z zewnątrz.
   * @param {string} value 
   */
  setValue(value) {
    if (this.textarea) {
      this.textarea.value = value;
      this.updatePreview();
    }
  }

  /**
   * Pobiera aktualną wartość.
   * @returns {string}
   */
  getValue() {
    return this.textarea ? this.textarea.value : "";
  }
  
  /**
   * Zwraca referencję do textarea (np. do focusowania).
   * @returns {HTMLTextAreaElement}
   */
  getTextArea() {
      return this.textarea;
  }
}
