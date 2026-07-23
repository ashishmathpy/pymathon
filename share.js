(() => {
  const decorateCodeBlocks = () => {
    document.querySelectorAll(".code-copy-outer-scaffold > .sourceCode.cell-code").forEach((block) => {
      const scaffold = block.parentElement;
      if (scaffold.classList.contains("code-editor")) return;

      scaffold.classList.add("code-editor");

      const header = document.createElement("div");
      header.className = "code-editor-header";
      header.setAttribute("aria-hidden", "true");
      header.innerHTML = `
        <span class="code-editor-lights">
          <span></span><span></span><span></span>
        </span>
        <span class="code-editor-language">PYTHON</span>
      `;
      scaffold.insertBefore(header, block);
    });
  };

  const setShareLinks = () => {
    const articleTitle = document.querySelector("main h1")?.textContent.trim() || document.title;
    const articleUrl = window.location.href;
    const encodedTitle = encodeURIComponent(articleTitle);
    const encodedUrl = encodeURIComponent(articleUrl);
    const encodedMessage = encodeURIComponent(articleTitle + "\n" + articleUrl);

    const links = {
      whatsapp: "https://wa.me/?text=" + encodedMessage,
      linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl,
      x: "https://twitter.com/intent/tweet?text=" + encodedTitle + "&url=" + encodedUrl,
      facebook: "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl,
      email: "mailto:?subject=" + encodedTitle + "&body=" + encodedMessage
    };

    document.querySelectorAll("[data-share]").forEach((control) => {
      const service = control.dataset.share;
      if (links[service]) {
        control.href = links[service];
      }
    });

    const copyButton = document.querySelector('[data-share="copy"]');
    if (!copyButton) return;

    copyButton.addEventListener("click", async () => {
      const originalText = copyButton.textContent;
      try {
        await navigator.clipboard.writeText(articleUrl);
      } catch {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = articleUrl;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        document.execCommand("copy");
        temporaryInput.remove();
      }

      copyButton.textContent = "Copied!";
      copyButton.setAttribute("aria-label", "Article link copied");
      window.setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.setAttribute("aria-label", "Copy this article's link");
      }, 1800);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      decorateCodeBlocks();
      setShareLinks();
    });
  } else {
    decorateCodeBlocks();
    setShareLinks();
  }
})();
