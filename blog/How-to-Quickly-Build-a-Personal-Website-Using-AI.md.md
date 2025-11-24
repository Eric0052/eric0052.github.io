---
layout: none
---

# How to Quickly Build a Personal Website Using AI  
*— My One-Evening Journey with Cursor + ChatGPT*

## Introduction: Why I Wrote This
Recently, I built my entire personal website in just **one evening** with the help of **Cursor** and **ChatGPT**. This site includes the typical sections you’d expect—**Home**, **Publications & Projects**, **Blog**, and **CV**. More importantly, the Publications/Projects and Blog pages are designed so that I can easily add new content by simply dropping in `.md` files, without touching any frontend code.

This experience genuinely amazed me. For the first time, AI wasn’t just generating code snippets—it was **acting as a full front-end engineer**, helping me build a clean, functional, extensible website from scratch. It felt like the moment AI stopped being “a cool demo” and truly became **productive power**.

That’s why I decided to make this topic—*“How to Quickly Build a Personal Website Using AI”*—the very first blog post on my new site.

---

## 1. Prerequisites  
You only need three things:

1. **A GitHub account** — used later to deploy the site  
2. **A Cursor account with the app installed**  
3. **A powerful LLM for web design guidance** (e.g., ChatGPT)  
   - Optional, because Cursor’s built-in ASK mode is already good  
   - But ChatGPT helps refine requirements and avoid design pitfalls

---

## 2. Clarify Your Requirements (the most important part)

Most beginners fail not because they can’t build a site, but because they can’t **describe** what they want clearly.

Before asking Cursor to “generate my website,” you must prepare two types of requirements:

---

### 2.1 Functional Requirements  
Think about the **structure** and **content** you want.

You can refer to typical academic personal website templates on GitHub, then decide which parts apply to you. In most cases:

- A **Home** page  
- A sidebar or navbar with **Publications**, **Projects**, **Blog**, **CV**, etc.  
- A plan for which parts will be updated regularly  
- If you want sections like Blog or Projects to be extendable via `.md` files, clearly state it in your requirements

The clearer the structure, the fewer redesign cycles Cursor has to go through.

---

### 2.2 UI Design Requirements  
Words like *“modern,” “futuristic,” “premium,” “high-tech style”* often lead to extremely flashy designs that look more like startup landing pages than academic websites.

They’re visually stunning but often not suitable for researchers.

After several experiments, I found that the best UI requirement is:

> **“A clean, simple academic style with a touch of modern design.”**

This ensures elegance without unnecessary complexity.

---

## 3. Ask ChatGPT to Polish Your Requirements  
Even if you know what you want, you’re not a frontend engineer. Your requirements are probably vague or inconsistent.

Give your rough ideas to ChatGPT and let it:

- clarify unclear parts  
- reorganize ideas  
- add missing details  
- rewrite in professional terminology  
- produce a clean, actionable requirement list

Discuss it for a few rounds until everything is:

- Clear  
- Feasible  
- Professional  
- Ready for Cursor to implement

Then pass the final requirement list into Cursor.

---

## 4. Let Cursor Do the Work  
Give Cursor your finalized requirements and let it generate the entire frontend project.

Cursor will automatically:

- create all pages  
- generate navigation, layout, and themes  
- support markdown-based blog or project pages

Opening `index.html` for the first time will likely surprise you.  
I even asked Cursor to produce two completely different designs, and both were excellent.

If your requirements are clear, Cursor usually meets **85%+** of your expectations on the first try.

---

## 5. Continuous Refinement  
You probably won’t be fully satisfied with every detail. That’s normal.

You can refine the site in two ways:

### Method A — If you know some frontend  
Select the relevant HTML/CSS code using `@` in Cursor  
→ Tell Cursor what to change  
→ It updates the code

### Method B — If you know nothing about frontend  
Describe your issue in natural language:

- “This title looks too large.”  
- “The spacing feels too wide.”  
- “Can we move the navigation to the left?”

Cursor will locate and modify the right code on its own.

I also recommend asking ChatGPT to rewrite your requests using professional UI/UX terminology, which helps Cursor generate cleaner updates.

---

## 6. Fill in Your Personal Information  
Once the structure is set, replace the demo content with your real information.

You can simply search for “Your Name,” “Sample Bio,” or similar placeholders and replace them.

Real content may break some layout or spacing, which is expected.  
If something looks off, return to Step 5 and refine.

---

## 7. Deploy to GitHub Pages  
Deploying is simple:

1. Push your project to a GitHub repository  
2. Open **Settings → Pages**  
3. Select the deployment branch (`main` or a `docs` folder)  
4. Save  
5. Wait for GitHub Pages to build

Your personal website will soon be live.

### ⚠️ If updates don’t show  
This is almost always due to **browser caching**.

Fix:

- Open your site in **Incognito Mode**, or  
- Press **Ctrl + Shift + R** for a hard refresh

---

## Conclusion  
Going through this process taught me that:

> **AI has truly become a productive tool. Even without frontend knowledge, you can build a high-quality, maintainable personal website in one evening.**

If you want a fast, elegant, and extensible personal homepage, this workflow is fully repeatable.

Give it a try—you might be surprised by what AI can help you create.
