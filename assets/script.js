(function () {
  const body = document.body;
  const THEME_KEY = "ppa-theme";

  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
  }

  function initThemeToggle() {
    const saved = localStorage.getItem(THEME_KEY);
    const initial = saved || "light";
    applyTheme(initial);

    const toggleBtn = document.querySelector("[data-theme-toggle]");
    if (!toggleBtn) return;

    const label = toggleBtn.querySelector(".theme-label");

    function syncButton(theme) {
      toggleBtn.dataset.themeState = theme;
      if (label) {
        label.textContent = theme === "dark" ? "Dark" : "Light";
      }
    }

    syncButton(initial);

    toggleBtn.addEventListener("click", () => {
      const next = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      syncButton(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  function groupByYear(items) {
    return items.reduce((acc, item) => {
      const year = item.year || "Misc";
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {});
  }

  async function fetchMarkdown(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.text();
  }

  async function renderMarkdownList(manifestPath, targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;
    try {
      const manifest = await fetch(manifestPath).then((r) => r.json());
      const grouped = groupByYear(manifest.items || []);

      container.innerHTML = Object.keys(grouped)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => {
          const entries = grouped[year];
          const entryMarkup = entries
            .map(
              (entry) => `
              <article class="list-item" data-file="${entry.file}">
                <div class="meta"><span class="year-badge">${year}</span>${entry.venue || ""}</div>
                <h3>${entry.title}</h3>
                <p>${entry.authors || ""}</p>
                <div class="markdown-target" id="${targetId}-${entry.id}"></div>
              </article>
            `
            )
            .join("");
          return `<section><h3>${year}</h3><div class="list-group">${entryMarkup}</div></section>`;
        })
        .join("");

      for (const entry of manifest.items || []) {
        const markdown = await fetchMarkdown(entry.file);
        const target = document.getElementById(`${targetId}-${entry.id}`);
        if (target) {
          target.innerHTML = window.marked ? window.marked.parse(markdown) : markdown;
        }
      }
    } catch (error) {
      container.innerHTML = `<p class="meta">Unable to load content: ${error.message}</p>`;
      console.error(error);
    }
  }

  async function renderBlog() {
    const listContainer = document.getElementById("blog-list");
    const viewer = document.getElementById("blog-viewer");
    if (!listContainer || !viewer) return;

    function setLoading() {
      viewer.querySelector(".blog-content").innerHTML = "<p class='meta'>Loading…</p>";
    }

    function renderPost(post, markdown) {
      viewer.querySelector("h2").textContent = post.title;
      viewer.querySelector("p.meta").textContent = post.date;
      viewer.querySelector(".blog-content").innerHTML = window.marked ? window.marked.parse(markdown) : markdown;
    }

    async function loadPost(post) {
      setLoading();
      try {
        const md = await fetchMarkdown(post.file);
        renderPost(post, md);
      } catch (error) {
        viewer.querySelector(".blog-content").innerHTML = `<p class='meta'>${error.message}</p>`;
      }
    }

    try {
      const posts = await fetch("blog/posts.json").then((r) => r.json());
      listContainer.innerHTML = posts.map((post) => {
        return `
          <article class="post-card" data-file="${post.file}">
            <p class="meta">${post.date}</p>
            <h4>${post.title}</h4>
            <p>${post.summary}</p>
          </article>
        `;
      }).join("");

      const cards = listContainer.querySelectorAll(".post-card");
      cards.forEach((card, idx) => {
        card.addEventListener("click", () => {
          cards.forEach((c) => c.classList.remove("active"));
          card.classList.add("active");
          loadPost(posts[idx]);
        });
      });

      if (posts.length) {
        cards[0].classList.add("active");
        loadPost(posts[0]);
      }
    } catch (error) {
      listContainer.innerHTML = `<p class="meta">Unable to load posts: ${error.message}</p>`;
    }
  }

  function initPage() {
    initThemeToggle();

    const page = document.body.dataset.page;
    if (window.feather) window.feather.replace();

    switch (page) {
      case "publications":
        renderMarkdownList("content/publications/manifest.json", "publications-list");
        renderMarkdownList("content/projects/manifest.json", "projects-list");
        break;
      case "blog":
        renderBlog();
        break;
      default:
        break;
    }
  }

  document.addEventListener("DOMContentLoaded", initPage);
})();

