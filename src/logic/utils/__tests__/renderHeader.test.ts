/**
 * @jest-environment jsdom
 */
import { renderHeader } from "../renderHeader";

test("should render html", () => {
  const h = renderHeader(document, {
    breadcrumbs: [
      { title: "Document", pos: null },
      { title: "header 1", pos: 10 },
    ],
    onClick: () => {},
  });

  expect(h.outerHTML).toBe(
    `<div class="zoom-plugin-header"><a class="zoom-plugin-title" data-pos="null">Document</a><span class="zoom-plugin-delimiter"></span><a class="zoom-plugin-title" data-pos="10">header 1</a></div>`
  );
});

test("should handle click on document link", () => {
  const onClick = jest.fn();
  const h = renderHeader(document, {
    breadcrumbs: [
      { title: "Document", pos: null },
      { title: "header 1", pos: 10 },
    ],
    onClick,
  });

  h.querySelectorAll<HTMLSpanElement>(".zoom-plugin-title")[0].click();

  expect(onClick).toHaveBeenCalledWith(null);
});

test("should handle click on header link", () => {
  const onClick = jest.fn();
  const h = renderHeader(document, {
    breadcrumbs: [
      { title: "Document", pos: null },
      { title: "header 1", pos: 10 },
    ],
    onClick,
  });

  h.querySelectorAll<HTMLSpanElement>(".zoom-plugin-title")[1].click();

  expect(onClick).toHaveBeenCalledWith(10);
});
