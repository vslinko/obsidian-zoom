export function renderHeader(
  doc: Document,
  ctx: {
    breadcrumbs: Array<{ title: string; pos: number | null }>;
    onClick: (pos: number | null) => void;
  }
) {
  const { breadcrumbs, onClick } = ctx;

  const h = doc.createElement("div");
  h.classList.add("zoom-plugin-header");

  for (let i = 0; i < breadcrumbs.length; i++) {
    if (i > 0) {
      const d = doc.createElement("span");
      d.classList.add("zoom-plugin-delimiter");
      d.innerText = ">";
      h.append(d);
    }

    const breadcrumb = breadcrumbs[i];
    const b = doc.createElement("a");
    b.classList.add("zoom-plugin-title");
    b.innerText = breadcrumb.title;
    b.dataset.pos = String(breadcrumb.pos);
    b.addEventListener("click", (e) => {
      e.preventDefault();
      const t = e.target as HTMLAnchorElement;
      const pos = t.dataset.pos;
      onClick(pos === "null" ? null : Number(pos));
    });
    h.appendChild(b);
  }

  return h;
}
