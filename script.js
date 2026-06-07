const menuButton = document.querySelector(".menu-button");
const sidebar = document.querySelector(".sidebar");
const navLinks = Array.from(document.querySelectorAll(".sidebar nav a"));
const typedTarget = document.querySelector("#typed-topic");

const topics = [
  "transportation systems with large-scale mobility data",
  "evacuation behavior during hurricanes and wildfires",
  "spatial bias in mobile device location data",
  "GeoAI methods for GPS trajectory understanding",
  "real-time traffic monitoring with transit buses"
];

let topicIndex = 0;
let charIndex = topics[0].length;
let deleting = true;

function setMenu(open) {
  sidebar.classList.toggle("open", open);
  document.body.classList.toggle("nav-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => {
  setMenu(!sidebar.classList.contains("open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

function typeLoop() {
  if (!typedTarget) return;

  const phrase = topics[topicIndex];
  typedTarget.textContent = phrase.slice(0, charIndex);

  if (deleting) {
    charIndex -= 1;
    if (charIndex <= 0) {
      deleting = false;
      topicIndex = (topicIndex + 1) % topics.length;
    }
  } else {
    charIndex += 1;
    if (charIndex >= topics[topicIndex].length) {
      deleting = true;
      setTimeout(typeLoop, 1300);
      return;
    }
  }

  const delay = deleting ? 34 : 58;
  setTimeout(typeLoop, delay);
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
    if (!activeLink) return;
    navLinks.forEach((link) => link.classList.remove("active"));
    activeLink.classList.add("active");
  });
}, {
  rootMargin: "-30% 0px -58% 0px",
  threshold: 0
});

document.querySelectorAll("section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setTimeout(typeLoop, 1200);
}
