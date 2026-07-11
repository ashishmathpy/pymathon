(() => {
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
    document.addEventListener("DOMContentLoaded", setShareLinks);
  } else {
    setShareLinks();
  }
})();
