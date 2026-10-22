(() => {
  const videos = Array.isArray(window.VIDEO_COLLECTION) ? window.VIDEO_COLLECTION : [];
  const grid = document.getElementById("videoGrid");
  const folders = document.getElementById("folderList");
  const search = document.getElementById("searchInput");
  const sort = document.getElementById("sortSelect");
  const count = document.getElementById("resultCount");
  const empty = document.getElementById("emptyState");
  const dialog = document.getElementById("playerDialog");
  const playerBody = document.getElementById("playerBody");
  const playerTitle = document.getElementById("playerTitle");
  const playerNote = document.getElementById("playerNote");
  let activeCategory = "Semua";

  document.getElementById("year").textContent = new Date().getFullYear();

  const categories = ["Semua", ...new Set(videos.map(v => v.category).filter(Boolean))];
  categories.forEach(category => {
    const button = document.createElement("button");
    button.className = "folder-button" + (category === activeCategory ? " active" : "");
    button.textContent = category;
    button.type = "button";
    button.addEventListener("click", () => {
      activeCategory = category;
      folders.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.textContent === category));
      render();
    });
    folders.appendChild(button);
  });

  function safeUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }

  function openVideo(video) {
    playerTitle.textContent = video.title || "Pemutar video";
    playerBody.replaceChildren();
    const url = safeUrl(video.videoUrl || "");
    if (!url) {
      const message = document.createElement("p");
      message.style.cssText = "padding:24px;text-align:center;color:#b9b9c7";
      message.textContent = "Video belum ditautkan. Tambahkan URL video pada file videos.js.";
      playerBody.appendChild(message);
      playerNote.textContent = "Gunakan URL video yang kamu miliki atau berhak untuk ditayangkan.";
    } else if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      const videoElement = document.createElement("video");
      videoElement.controls = true;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.src = url;
      playerBody.appendChild(videoElement);
      playerNote.textContent = "";
    } else {
      const frame = document.createElement("iframe");
      frame.src = url;
      frame.title = video.title || "Video";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      playerBody.appendChild(frame);
      playerNote.textContent = "Jika video tidak dapat diputar, periksa apakah penyedia video mengizinkan pemutaran melalui embed.";
    }
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function render() {
    const query = search.value.trim().toLocaleLowerCase("id");
    let filtered = videos.filter(video => {
      const categoryMatch = activeCategory === "Semua" || video.category === activeCategory;
      const searchMatch = [video.title, video.category].join(" ").toLocaleLowerCase("id").includes(query);
      return categoryMatch && searchMatch;
    });
    if (sort.value === "title") filtered.sort((a, b) => a.title.localeCompare(b.title, "id"));
    else filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    grid.replaceChildren();
    filtered.forEach(video => {
      const card = document.createElement("article");
      card.className = "video-card";
      const thumb = document.createElement("button");
      thumb.className = "thumb-button";
      thumb.type = "button";
      thumb.setAttribute("aria-label", "Putar " + video.title);
      const art = document.createElement("span");
      art.className = "thumb-art";
      art.style.setProperty("--tone1", video.tone1 || "#41415b");
      art.style.setProperty("--tone2", video.tone2 || "#15151d");
      art.textContent = video.label || "VIDEO";
      const play = document.createElement("span");
      play.className = "play-button";
      play.setAttribute("aria-hidden", "true");
      play.textContent = "▶";
      thumb.append(art, play);
      thumb.addEventListener("click", () => openVideo(video));

      const info = document.createElement("div");
      info.className = "video-info";
      const title = document.createElement("h3");
      title.className = "video-title";
      title.textContent = video.title;
      const category = document.createElement("div");
      category.className = "video-category";
      category.textContent = video.category || "Video";
      info.append(title, category);
      card.append(thumb, info);
      grid.appendChild(card);
    });
    count.textContent = `${filtered.length} video`;
    empty.hidden = filtered.length > 0;
  }

  search.addEventListener("input", render);
  sort.addEventListener("change", render);
  document.getElementById("closePlayer").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => playerBody.replaceChildren());
  document.getElementById("menuButton").addEventListener("click", event => {
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-expanded", String(!expanded));
    document.querySelector(".folder-section").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  render();
})();
