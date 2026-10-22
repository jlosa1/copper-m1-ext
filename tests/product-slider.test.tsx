import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

const activeSlide = () =>
  screen
    .getAllByTestId("slide")
    .find((slide) => slide.getAttribute("aria-hidden") === "false")!;

describe("Product slider", () => {
  it("has three slides: both products, Copper Home, Copper Notes", () => {
    render(<Home />);
    const slides = screen.getAllByTestId("slide");
    expect(slides.map((s) => s.getAttribute("data-slide"))).toEqual([
      "both",
      "copper-home",
      "copper-notes",
    ]);
    expect(slides[0].querySelectorAll("img")).toHaveLength(2);
    expect(slides[1].querySelectorAll("img")).toHaveLength(1);
    expect(slides[2].querySelectorAll("img")).toHaveLength(1);
    for (const slide of slides) {
      expect(
        slide.querySelector("figcaption")!.textContent!.length,
      ).toBeGreaterThan(0);
      for (const img of slide.querySelectorAll("img")) {
        expect(img.getAttribute("alt")!.length).toBeGreaterThan(10);
      }
    }
  });

  it("sits above the hero", () => {
    render(<Home />);
    const slider = screen.getByTestId("product-slider");
    const hero = screen.getByTestId("hero");
    expect(
      slider.compareDocumentPosition(hero) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("moves with Next, Previous and the dots, and wraps around", () => {
    render(<Home />);
    expect(activeSlide().getAttribute("data-slide")).toBe("both");

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(activeSlide().getAttribute("data-slide")).toBe("copper-home");

    fireEvent.click(screen.getByRole("button", { name: "Go to slide 3" }));
    expect(activeSlide().getAttribute("data-slide")).toBe("copper-notes");

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(activeSlide().getAttribute("data-slide")).toBe("both");

    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(activeSlide().getAttribute("data-slide")).toBe("copper-notes");
  });

  it("responds to the arrow keys", () => {
    render(<Home />);
    const slider = screen.getByTestId("product-slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(activeSlide().getAttribute("data-slide")).toBe("copper-home");
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(activeSlide().getAttribute("data-slide")).toBe("both");
  });
});
