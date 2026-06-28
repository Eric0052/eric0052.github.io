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

  async function renderPublicationsList(manifestPath, targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;
  
    // ===== 新增：作者加粗函数 =====
    function renderAuthors(authors) {
      const highlightName = "Xiyu Zhou"; // 这里改成你要高亮的名字
      return authors
        .split(",")
        .map(a => {
          const name = a.trim();
          return name === highlightName
            ? `<strong>${name}</strong>` // 加粗高亮
            : name;
        })
        .join(", ");
    }
  
    // ===== 新增：status badge渲染函数 =====
    function renderStatusBadge(status) {
      if (!status) return "";
      return `<span class="status-badge">${status}</span>`; // 你可以在CSS里定义.status-badge样式
    }

    // ===== 新增：award badge渲染函数 =====
    function renderAwardBadge(award) {
      if (!award) return "";
      return `<span class="award-badge">${award}</span>`; // CSS里定义.award-badge样式
    }
  
    try {
      const manifest = await fetch(manifestPath).then((r) => r.json());
      const grouped = groupByYear(manifest.items || []);
  
      container.innerHTML = Object.keys(grouped)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => {
          const entries = grouped[year];
          const entryMarkup = entries
            .map((entry) => {
              let linksHtml = "";
              if (entry.links) {
                const linkItems = [];

                // 优先支持原来的类型
                if (entry.links.paper) linkItems.push(`<a href="${entry.links.paper}" target="_blank" rel="noopener">Paper</a>`);
                if (entry.links.arxiv) linkItems.push(`<a href="${entry.links.arxiv}" target="_blank" rel="noopener">arXiv</a>`);
                if (entry.links.code) linkItems.push(`<a href="${entry.links.code}" target="_blank" rel="noopener">Code</a>`);
                if (entry.links.project) linkItems.push(`<a href="${entry.links.project}" target="_blank" rel="noopener">Project</a>`);

                // 如果都没有，但有 URL，则显示为 Paper
                if (linkItems.length === 0 && entry.links.URL) {
                  linkItems.push(`<a href="${entry.links.URL}" target="_blank" rel="noopener">Paper</a>`);
                }

                if (linkItems.length > 0) {
                  linksHtml = `<div class="publication-links">${linkItems.join(" · ")}</div>`;
                }
              }

  
              // ===== 修改这里 =====
              return `
                <article class="list-item">
                  <div class="meta">
                  <span class="year-badge">${year}</span>
                  <span class="venue">${entry.venue || ""}</span>      <!-- venue 单独 span -->
                  ${renderStatusBadge(entry.status)}                   <!-- status badge -->
                  ${renderAwardBadge(entry.award)}                     <!-- award badge -->
                </div>
                  <h3>${entry.title}</h3>
                  <p>${renderAuthors(entry.authors)}</p> <!-- 使用作者加粗渲染 -->
                  ${linksHtml}
                </article>
              `;
            })
            .join("");
  
          return `<section><h3>${year}</h3><div class="list-group">${entryMarkup}</div></section>`;
        })
        .join("");
    } catch (error) {
      container.innerHTML = `<p class="meta">Unable to load content: ${error.message}</p>`;
      console.error(error);
    }
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
    const homeView = document.getElementById("blog-home");
    const articleView = document.getElementById("blog-article");
    const feedContainer = document.getElementById("blog-feed");
    const searchInput = document.getElementById("blog-search");
    const resultNote = document.getElementById("blog-result-note");
    const currentTags = document.getElementById("blog-current-tags");
    const tocContainer = document.getElementById("blog-toc");
    const backButton = document.getElementById("blog-back");
    const categoriesContainer = document.getElementById("blog-categories");
    const tagsContainer = document.getElementById("blog-tags");
    const archiveContainer = document.getElementById("blog-archive");
    const recentContainer = document.getElementById("blog-recent");
    if (!homeView || !articleView || !feedContainer) return;

    let posts = [];
    let activeFilter = { type: "all", value: "all" };

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function slugify(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function normalizePost(post, index) {
      const date = post.date || "";
      return {
        ...post,
        id: post.id || slugify(post.title) || `post-${index + 1}`,
        category: post.category || "Notes",
        tags: Array.isArray(post.tags) ? post.tags : [],
        summary: post.summary || "",
        year: date ? new Date(date).getFullYear().toString() : "Undated"
      };
    }

    function stripFrontMatter(markdown) {
      return markdown.replace(/^---\s*[\r\n]+[\s\S]*?[\r\n]+---\s*[\r\n]?/, "");
    }

    function renderMarkdown(markdown) {
      const mathSegments = [];
      const stashMath = (match) => {
        const token = `MATHSEGMENT${mathSegments.length}TOKEN`;
        mathSegments.push(match);
        return token;
      };

      const protectedMarkdown = markdown
        .replace(/\$\$[\s\S]*?\$\$/g, stashMath)
        .replace(/(^|[^$])\$([^$\n]+?)\$(?!\$)/g, (match, prefix, content) => `${prefix}${stashMath(`$${content}$`)}`);

      let html = window.marked ? window.marked.parse(protectedMarkdown) : protectedMarkdown;
      mathSegments.forEach((math, index) => {
        const token = `MATHSEGMENT${index}TOKEN`;
        const block = math.startsWith("$$")
          ? `<div class="math-display">${math}</div>`
          : `<span class="math-inline">${math}</span>`;
        html = html.replace(new RegExp(`<p>${token}</p>`, "g"), block);
        html = html.replace(new RegExp(token, "g"), block);
      });

      return html;
    }

    function setRoute(hash, replace = false) {
      const url = hash ? `${window.location.pathname}${hash}` : window.location.pathname;
      if (replace) {
        window.history.replaceState(null, "", url);
      } else {
        window.history.pushState(null, "", url);
      }
    }

    function showHome(replace = false) {
      homeView.hidden = false;
      articleView.hidden = true;
      if (tocContainer) {
        tocContainer.innerHTML = "";
        tocContainer.hidden = true;
      }
      if (replace) setRoute("", true);
    }

    function showArticle() {
      homeView.hidden = true;
      articleView.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function getPostFromHash() {
      const raw = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const id = raw.startsWith("post/") ? raw.slice(5) : raw;
      if (!id) return null;
      return posts.find((post) => post.id === id) || null;
    }

    function renderPostTags(target, post) {
      if (!target) return;
      const chips = [post.category, ...post.tags].filter(Boolean);
      target.innerHTML = chips
        .map((chip) => `<span class="post-tag">${escapeHtml(chip)}</span>`)
        .join("");
    }

    function getVisiblePosts() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

      return posts.filter((post) => {
        const filterMatched =
          activeFilter.type === "all" ||
          (activeFilter.type === "category" && post.category === activeFilter.value) ||
          (activeFilter.type === "tag" && post.tags.includes(activeFilter.value)) ||
          (activeFilter.type === "year" && post.year === activeFilter.value);

        if (!filterMatched) return false;
        if (!query) return true;

        return [post.title, post.summary, post.category, post.date, post.year, ...post.tags]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      });
    }

    function renderFeed() {
      const visiblePosts = getVisiblePosts();
      const filterLabel = activeFilter.type === "all" ? "all posts" : activeFilter.value;
      if (resultNote) {
        resultNote.textContent = `${visiblePosts.length} post${visiblePosts.length === 1 ? "" : "s"} in ${filterLabel}`;
      }

      if (!visiblePosts.length) {
        feedContainer.innerHTML = "<p class='meta empty-state'>No posts found.</p>";
        return;
      }

      feedContainer.innerHTML = visiblePosts.map((post) => `
        <article class="feed-post">
          <p class="post-meta">${escapeHtml(post.date)} · ${escapeHtml(post.category)}</p>
          <h3>${escapeHtml(post.title)}</h3>
          ${post.summary ? `<p>${escapeHtml(post.summary)}</p>` : ""}
          <div class="feed-post-footer">
            <div class="post-tags">
              ${post.tags.map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <button class="read-more" type="button" data-post-id="${escapeHtml(post.id)}">Continue reading</button>
          </div>
        </article>
      `).join("");

      feedContainer.querySelectorAll(".read-more").forEach((button) => {
        button.addEventListener("click", () => {
          const post = posts.find((item) => item.id === button.dataset.postId);
          if (post) loadPost(post);
        });
      });
    }

    function setFilter(type, value) {
      activeFilter = { type, value };
      if (searchInput) searchInput.value = "";
      showHome();
      renderSidebar();
      renderFeed();
    }

    function renderSidebarLinks(container, items, type) {
      if (!container) return;
      container.innerHTML = items.map(({ label, count }) => {
        const isActive = activeFilter.type === type && activeFilter.value === label;
        return `
          <button class="sidebar-link${isActive ? " active" : ""}" type="button" data-filter-type="${type}" data-filter-value="${escapeHtml(label)}">
            <span>${escapeHtml(label)}</span>
            <span>${count}</span>
          </button>
        `;
      }).join("");

      container.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          setFilter(button.dataset.filterType, button.dataset.filterValue);
        });
      });
    }

    function renderSidebar() {
      const categoryItems = Object.entries(posts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      }, {})).map(([label, count]) => ({ label, count }));

      const tagItems = Object.entries(posts.reduce((acc, post) => {
        post.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {})).map(([label, count]) => ({ label, count }));

      const archiveItems = Object.entries(posts.reduce((acc, post) => {
        acc[post.year] = (acc[post.year] || 0) + 1;
        return acc;
      }, {})).map(([label, count]) => ({ label, count }));

      renderSidebarLinks(categoriesContainer, categoryItems, "category");
      renderSidebarLinks(archiveContainer, archiveItems, "year");

      if (tagsContainer) {
        tagsContainer.innerHTML = tagItems.map(({ label, count }) => `
          <button class="tag-button${activeFilter.type === "tag" && activeFilter.value === label ? " active" : ""}" type="button" data-tag="${escapeHtml(label)}">
            ${escapeHtml(label)} <span>${count}</span>
          </button>
        `).join("");

        tagsContainer.querySelectorAll("button").forEach((button) => {
          button.addEventListener("click", () => setFilter("tag", button.dataset.tag));
        });
      }

      if (recentContainer) {
        recentContainer.innerHTML = posts.slice(0, 5).map((post) => `
          <button class="sidebar-link recent-link" type="button" data-post-id="${escapeHtml(post.id)}">
            <span>${escapeHtml(post.title)}</span>
          </button>
        `).join("");

        recentContainer.querySelectorAll("button").forEach((button) => {
          button.addEventListener("click", () => {
            const post = posts.find((item) => item.id === button.dataset.postId);
            if (post) loadPost(post);
          });
        });
      }
    }

    function renderTableOfContents(post) {
      if (!tocContainer) return;

      const headings = articleView.querySelectorAll(".blog-content h2, .blog-content h3");
      if (!headings.length) {
        tocContainer.innerHTML = "";
        tocContainer.hidden = true;
        return;
      }

      tocContainer.hidden = false;
      const links = [];
      headings.forEach((heading, index) => {
        const text = heading.textContent.trim();
        if (!text) return;

        const id = `${post.id}-${slugify(text) || "section"}-${index + 1}`;
        heading.id = id;
        links.push(`
          <a class="toc-link toc-${heading.tagName.toLowerCase()}" href="#${id}" data-target="${id}">
            ${escapeHtml(text)}
          </a>
        `);
      });

      tocContainer.innerHTML = `
        <p>Contents</p>
        <div>${links.join("")}</div>
      `;

      tocContainer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const target = document.getElementById(link.dataset.target);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    function typesetMath() {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([articleView.querySelector(".blog-content")]).catch((error) => {
          console.error("MathJax render failed:", error);
        });
      }
    }

    async function loadPost(post, updateHash = true) {
      showArticle();
      if (updateHash) setRoute(`#post/${post.id}`);

      articleView.querySelector("#blog-article-title").textContent = post.title;
      articleView.querySelector("#blog-article-meta").textContent = `${post.date} · ${post.category}`;
      renderPostTags(currentTags, post);
      articleView.querySelector(".blog-content").innerHTML = "<p class='meta'>Loading...</p>";

      try {
        const markdown = await fetchMarkdown(post.file);
        const content = stripFrontMatter(markdown);
        articleView.querySelector(".blog-content").innerHTML = renderMarkdown(content);
        renderTableOfContents(post);
        typesetMath();
      } catch (error) {
        articleView.querySelector(".blog-content").innerHTML = `<p class='meta'>${error.message}</p>`;
      }
    }

    try {
      posts = await fetch("blog/posts.json")
        .then((r) => r.json())
        .then((items) => items.map(normalizePost))
        .then((items) => items.sort((a, b) => new Date(b.date) - new Date(a.date)));

      renderSidebar();
      renderFeed();

      if (searchInput) {
        searchInput.addEventListener("input", () => {
          activeFilter = { type: "all", value: "all" };
          renderSidebar();
          renderFeed();
        });
      }

      if (backButton) {
        backButton.addEventListener("click", () => {
          showHome(true);
        });
      }

      const hashPost = getPostFromHash();
      if (hashPost) {
        loadPost(hashPost, false);
      } else {
        showHome(false);
      }

      window.addEventListener("popstate", () => {
        const post = getPostFromHash();
        if (post) {
          loadPost(post, false);
        } else {
          showHome(false);
        }
      });
    } catch (error) {
      feedContainer.innerHTML = `<p class="meta">Unable to load posts: ${error.message}</p>`;
    }
  }

  function initPage() {
    initThemeToggle();

    const page = document.body.dataset.page;
    if (window.feather) window.feather.replace();

    switch (page) {
      case "publications":
        renderPublicationsList("content/publications/manifest.json", "publications-list");
        // Projects view temporarily disabled per request
        // renderMarkdownList("content/projects/manifest.json", "projects-list");
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

