(() => {
  const AD_CONFIG = {
  adsterraUrl: "https://auctionr.org/4/60cb60e3050fe037f72088a700cab7ca",
  shopeeUrl: "https://s.shopee.co.id/W7bEEnveU"
};
  const fallback = Array.isArray(window.VIDEO_COLLECTION) ? window.VIDEO_COLLECTION : [];
  const grid = document.getElementById("videoGrid"), folders = document.getElementById("folderList");
  const search = document.getElementById("searchInput"), sort = document.getElementById("sortSelect");
  const count = document.getElementById("resultCount"), empty = document.getElementById("emptyState");
  const setupNote = document.getElementById("setupNote"), dialog = document.getElementById("playerDialog");
  const playerBody = document.getElementById("playerBody"), playerTitle = document.getElementById("playerTitle"), playerNote = document.getElementById("playerNote");
  let videos = fallback, activeCategory = "Semua";
  document.getElementById("year").textContent = new Date().getFullYear();

  function getClient() {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY ||
        window.SUPABASE_URL.includes("PASTE_") || window.SUPABASE_ANON_KEY.includes("PASTE_")) return null;
    return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  const client = getClient();
  function normalize(row) {
    return { ...row, date: row.date || row.created_at || "", label: row.label || row.title || "VIDEO",
      tone1: row.tone1 || "#41415b", tone2: row.tone2 || "#15151d",
      thumbnail_url: row.thumbnail_url || "", video_url: row.video_url || "" };
  }
  async function loadVideos() {
    if (!client) { setupNote.hidden = false; videos = fallback; rebuildFolders(); render(); return; }
    const { data, error } = await client.from("videos").select("*").order("created_at", { ascending: false });
    if (error) { console.error(error); setupNote.hidden = false; videos = fallback; }
    else { videos = (data || []).map(normalize); setupNote.hidden = true; }
    rebuildFolders(); render();
  }
  function rebuildFolders() {
    folders.replaceChildren();
    const categories = ["Semua", ...new Set(videos.map(v => v.category).filter(Boolean))];
    if (!categories.includes(activeCategory)) activeCategory = "Semua";
    categories.forEach(category => {
      const button = document.createElement("button");
      button.className = "folder-button" + (category === activeCategory ? " active" : "");
      button.textContent = category; button.type = "button";
      button.addEventListener("click", () => { activeCategory = category; rebuildFolders(); render(); });
      folders.appendChild(button);
    });
  }
  function safeUrl(value) {
    try { const url = new URL(value, location.href); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; }
    catch { return ""; }
  }
  

function openVideo(video) {
  window.open(AD_CONFIG.adsterraUrl, "_blank", "noopener,noreferrer");
  playerTitle.textContent = video.title || "Pemutar video";
  playerBody.replaceChildren();
  playerBody.hidden = false;

  const timedAdOverlay = document.getElementById("timedAdOverlay");
  const timedAdLink = document.getElementById("timedAdLink");
  const closeTimedAd = document.getElementById("closeTimedAd");

  if (timedAdOverlay) timedAdOverlay.hidden = true;
  if (timedAdLink) timedAdLink.href = AD_CONFIG.adsterraUrl;

  let videoElement = null;
  let secondsPlayed = 0;
  let lastTime = null;
  let adShown = false;
  let shopeeOpened = false;

  const url = safeUrl(video.video_url || video.videoUrl || "");



if (!url) {
  playerNote.textContent = "URL video belum ditambahkan.";
} else if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
  const videoWrap = document.createElement("div");
  videoWrap.className = "player-video-wrap";

  videoElement = document.createElement("video");
  videoElement.controls = true;
  videoElement.playsInline = true;
  videoElement.src = url;

  const playButton = document.createElement("button");
  playButton.className = "video-center-play";
  playButton.type = "button";
  playButton.setAttribute("aria-label", "Putar video");
  playButton.textContent = "▶";



playButton.addEventListener("click", () => {
  window.open(AD_CONFIG.adsterraUrl, "_blank", "noopener,noreferrer");

  const resumeVideo = () => {
    if (document.visibilityState === "visible") {
      document.removeEventListener("visibilitychange", resumeVideo);
      videoElement.play().catch(() => {
        playerNote.textContent =
          "Tekan tombol Play pada pemutar untuk mulai menonton.";
      });
    }
  };

  document.addEventListener("visibilitychange", resumeVideo);
});



  videoElement.addEventListener("play", () => {
    playButton.hidden = true;
  });

  videoElement.addEventListener("pause", () => {
    playButton.hidden = false;
  });

  videoElement.addEventListener("ended", () => {
    playButton.hidden = false;
  });

  videoWrap.appendChild(videoElement);
  videoWrap.appendChild(playButton);
  playerBody.appendChild(videoWrap);
  playerNote.textContent = "";
} else {
  const frame = document.createElement("iframe");
  frame.src = url;
  frame.title = video.title || "Video";
  frame.allow =
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  frame.allowFullscreen = true;

  playerBody.appendChild(frame);
  
const playButton = document.createElement("button");
playButton.type = "button";
playButton.className = "video-center-play";
playButton.setAttribute("aria-label", "Buka iklan Adsterra");
playButton.innerHTML = "&#9654;";
playButton.onclick = () => {
  window.open(AD_CONFIG.adsterraUrl, "_blank", "noopener,noreferrer");
  playButton.remove();
};
playerBody.appendChild(playButton);

  playerNote.textContent =
    "Jika video tidak muncul, periksa URL video atau gunakan URL embed.";
}


  if (videoElement) {
    videoElement.addEventListener("timeupdate", () => {
      if (
        !videoElement.paused &&
        !videoElement.ended &&
        lastTime !== null
      ) {
        secondsPlayed += Math.max(
          0,
          videoElement.currentTime - lastTime
        );
      }

      lastTime = videoElement.currentTime;

    
    });


    
  
  videoElement.addEventListener("seeking", () => {
    if (!shopeeOpened) {
        shopeeOpened = true;
        window.open(AD_CONFIG.shopeeUrl, "_blank", "noopener,noreferrer");
    }
});
    }
 
  
  if (closeTimedAd) {
    closeTimedAd.onclick = () => {
      if (timedAdOverlay) timedAdOverlay.hidden = true;
      if (videoElement) {
        videoElement.play().catch(() => {});
      }
    };
  }

  if (!dialog.open) dialog.showModal();
}
  

/* Tombol Play di tengah area video */
.player-body {
  position: relative;
}

.player-body .video-center-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  background: rgba(20, 30, 45, 0.85);
  color: #ffffff;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  padding: 0;
}

.player-body .video-center-play:hover {
  background: rgba(22, 142, 234, 0.95);
  transform: translate(-50%, -50%) scale(1.08);
}


  function render() {
    const q = search.value.trim().toLocaleLowerCase("id");
    let list = videos.filter(v => (activeCategory === "Semua" || v.category === activeCategory) &&
      [v.title, v.category].join(" ").toLocaleLowerCase("id").includes(q));
    if (sort.value === "title") list.sort((a,b) => (a.title||"").localeCompare(b.title||"", "id"));
    else list.sort((a,b) => (b.date||b.created_at||"").localeCompare(a.date||a.created_at||""));
    grid.replaceChildren();
    list.forEach(v => {
      const card = document.createElement("article"); card.className = "video-card";
      const thumb = document.createElement("button"); thumb.className = "thumb-button"; thumb.type = "button"; thumb.setAttribute("aria-label", "Putar " + v.title);
      const art = document.createElement("span"); art.className = "thumb-art"; art.style.setProperty("--tone1",v.tone1||"#41415b"); art.style.setProperty("--tone2",v.tone2||"#15151d"); art.textContent = v.label || v.title || "VIDEO";
      const imageUrl = safeUrl(v.thumbnail_url || "");
      if (imageUrl) { const img = document.createElement("img"); img.className = "thumb-image"; img.src = imageUrl; img.alt = v.title || "Thumbnail video"; img.loading = "lazy"; img.onerror = () => img.remove(); thumb.appendChild(img); }
      const play = document.createElement("span"); play.className = "play-button"; play.textContent = "▶"; play.setAttribute("aria-hidden","true");
      thumb.append(art,play); thumb.addEventListener("click",()=>openVideo(v));
      const info = document.createElement("div"); info.className = "video-info";
      const title = document.createElement("h3"); title.className = "video-title"; title.textContent = v.title || "Tanpa judul";
      const cat = document.createElement("div"); cat.className = "video-category"; cat.textContent = v.category || "Video";
      info.append(title,cat); card.append(thumb,info); grid.appendChild(card);
    });
    count.textContent = `${list.length} video`; empty.hidden = list.length > 0;
  }
  search.addEventListener("input",render); sort.addEventListener("change",render);
  document.getElementById("closePlayer").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
  dialog.addEventListener("close",()=>playerBody.replaceChildren());
  loadVideos();
})();
