import { cleanTitle } from "../cleanTitle";

test("should clean title", () => {
  expect(cleanTitle(" Text with spaces ")).toBe("Text with spaces");
  expect(cleanTitle("# Some header")).toBe("Some header");
  expect(cleanTitle("## Some header")).toBe("Some header");
  expect(cleanTitle("### Some header")).toBe("Some header");
  expect(cleanTitle("#### Some header")).toBe("Some header");
  expect(cleanTitle("#\tSome header")).toBe("Some header");
  expect(cleanTitle("#Some invalid header")).toBe("#Some invalid header");
  expect(cleanTitle("- Some bullet")).toBe("Some bullet");
  expect(cleanTitle("+ Some bullet")).toBe("Some bullet");
  expect(cleanTitle("* Some bullet")).toBe("Some bullet");
  expect(cleanTitle("  * Some bullet  ")).toBe("Some bullet");
  expect(cleanTitle("\t*\tSome bullet  ")).toBe("Some bullet");
  expect(cleanTitle("\t*Some invalid bullet  ")).toBe("*Some invalid bullet");
});
