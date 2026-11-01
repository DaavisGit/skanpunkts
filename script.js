const entryDirections = [
  { x: "-32px", y: "0px" },
  { x: "32px", y: "0px" },
  { x: "0px", y: "-28px" },
  { x: "0px", y: "28px" },
  { x: "-24px", y: "-20px" },
  { x: "24px", y: "-20px" },
  { x: "-24px", y: "20px" },
  { x: "24px", y: "20px" }
];

for (let index = entryDirections.length - 1; index > 0; index -= 1) {
  const swapIndex = Math.floor(Math.random() * (index + 1));
  [entryDirections[index], entryDirections[swapIndex]] = [entryDirections[swapIndex], entryDirections[index]];
}

let nextEntryDirection = 0;

const assignEntryDirection = (element) => {
  const direction = entryDirections[nextEntryDirection % entryDirections.length];
  nextEntryDirection += 1;
  element.style.setProperty("--entry-x", direction.x);
  element.style.setProperty("--entry-y", direction.y);
};

document.querySelectorAll(".topbar > *, .footer > *, .hero > *, .events-header > *, .scroll-reveal").forEach(assignEntryDirection);
document.documentElement.classList.add("has-entry-directions");

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("has-scroll-reveal");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".scroll-reveal").forEach((element) => {
    revealObserver.observe(element);
  });
}

// Static pages cannot enumerate folder contents; keep this list synced with events/.
const eventImages = [
  {
    src: "1.jpg",
    lastModified: "2026-11-01T12:21:02Z",
    alt: "Pasākums 1"
  },
  {
    src: "2.jpg",
    lastModified: "2026-11-01T12:21:02Z",
    alt: "Pasākums 2"
  },
  {
    src: "3.jpg",
    lastModified: "2026-11-01T12:21:02Z",
    alt: "Pasākums 3"
  }
];

const eventsDirectory = new URL("events/", document.currentScript.src);
const eventsGallery = document.querySelector("[data-events-gallery]");

if (eventsGallery) {
  const eventsPerPage = 6;
  const eventsGrid = eventsGallery.querySelector(".events-grid");
  const eventsNavigation = eventsGallery.querySelector(".events-navigation");
  const eventsPageStatus = eventsGallery.querySelector(".events-page-status");
  const previousEventsButton = eventsGallery.querySelector("[data-events-previous]");
  const nextEventsButton = eventsGallery.querySelector("[data-events-next]");
  const orderedEventImages = [...eventImages].sort((first, second) =>
    Date.parse(second.lastModified) - Date.parse(first.lastModified)
    || second.src.localeCompare(first.src, undefined, { numeric: true })
  );
  const pageCount = Math.ceil(orderedEventImages.length / eventsPerPage);
  let currentPage = 0;

  const renderEventsPage = () => {
    const firstEvent = currentPage * eventsPerPage;
    const visibleEvents = orderedEventImages.slice(firstEvent, firstEvent + eventsPerPage);
    const eventCards = visibleEvents.map((event) => {
      const card = document.createElement("figure");
      const image = document.createElement("img");

      card.className = "event-card";
      assignEntryDirection(card);
      card.style.animationDelay = `${visibleEvents.indexOf(event) * 90}ms`;
      image.src = new URL(event.src, eventsDirectory).href;
      image.alt = event.alt;
      image.loading = "lazy";
      image.decoding = "async";
      card.append(image);

      return card;
    });

    eventsGrid.replaceChildren(...eventCards);
    eventsNavigation.hidden = pageCount <= 1;
    eventsPageStatus.textContent = `${currentPage + 1} / ${pageCount}`;
    previousEventsButton.disabled = currentPage === 0;
    nextEventsButton.disabled = currentPage >= pageCount - 1;
  };

  previousEventsButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage -= 1;
      renderEventsPage();
    }
  });

  nextEventsButton.addEventListener("click", () => {
    if (currentPage < pageCount - 1) {
      currentPage += 1;
      renderEventsPage();
    }
  });

  renderEventsPage();
}