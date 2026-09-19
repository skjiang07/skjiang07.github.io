const menuButton = document.querySelector(".menu-button");
const sidebar = document.querySelector(".sidebar");
const backdrop = document.querySelector(".nav-backdrop");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const navLinks = Array.from(document.querySelectorAll(".sidebar nav a"));
const mobileQuery = window.matchMedia("(max-width: 860px)");

function setMenu(open, restoreFocus = false) {
  const expanded = open && mobileQuery.matches;
  sidebar.classList.toggle("open", expanded);
  document.body.classList.toggle("nav-open", expanded);
  menuButton.setAttribute("aria-expanded", String(expanded));
  menuButton.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
  backdrop.hidden = !expanded;
  sidebar.inert = mobileQuery.matches && !expanded;
  main.inert = expanded;
  footer.inert = expanded;
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
backdrop.addEventListener("click", () => setMenu(false, true));
sidebar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false, mobileQuery.matches));
});
document.addEventListener("keydown", (event) => {
  if (!sidebar.classList.contains("open")) return;
  if (event.key === "Escape") setMenu(false, true);
  if (event.key === "Tab") {
    const lastLink = sidebar.querySelector(".sidebar-footer a:last-child");
    if (event.shiftKey && document.activeElement === menuButton) {
      event.preventDefault();
      lastLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      menuButton.focus();
    }
  }
});
mobileQuery.addEventListener("change", () => setMenu(false));
setMenu(false);

const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));
let scheduled = false;
function updateActiveSection() {
  const offset = mobileQuery.matches ? 120 : 100;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= offset) active = section;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) active = sections.at(-1);
  navLinks.forEach((link) => {
    if (link.hash === "#" + active.id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scheduled = false;
}
window.addEventListener("scroll", () => {
  if (!scheduled) {
    scheduled = true;
    window.requestAnimationFrame(updateActiveSection);
  }
}, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();
