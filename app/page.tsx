import Image from "next/image";
import { PlanPicker } from "@/components/copper/plan-picker";
import { ProductSlider } from "@/components/copper/product-slider";
import { SiteFooter } from "@/components/copper/site-footer";
import { SiteHeader } from "@/components/copper/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatMemory,
  formatNotesHours,
  formatUsd,
  getPlans,
  getPrivacySummary,
  getProducts,
} from "@/lib/copper/catalog";

// Alt text and a one-line caption for each lifestyle photo, keyed by file name.
// The photo paths themselves come from the catalog.
const LIFESTYLE_COPY: Record<
  string,
  { alt: string; caption: string; width: number; height: number }
> = {
  "copper-home-desert-light.png": {
    alt: "Copper Home smart speaker on a stone counter beside a window with a desert sunset and saguaro cacti",
    caption: "Copper Home keeps the house running while the desert sun sets.",
    width: 1672,
    height: 941,
  },
  "copper-notes-stone-desk.png": {
    alt: "Copper Notes clip-on recorder standing on a stone desk next to its copper charging puck",
    caption:
      "Copper Notes sits at home on your desk, ready for the next meeting.",
    width: 1672,
    height: 941,
  },
  "copper-notes-golden-hour.png": {
    alt: "Man writing in a notebook with a Copper Notes recorder clipped to his shirt pocket in golden light",
    caption: "Clip Copper Notes on and stay in the conversation.",
    width: 1536,
    height: 1024,
  },
};

// One-line captions for the slider's single-product slides.
const SLIDE_CAPTIONS: Record<string, string> = {
  "copper-home": "Copper Home keeps the house running.",
  "copper-notes": "Copper Notes catches every conversation.",
};

export default function Home() {
  const products = getProducts();
  const cutoutImage = (product: (typeof products)[number]) => ({
    src: product.cutout,
    alt: `${product.name} ${product.type} in ${product.colors[0]}`,
  });
  const slides = [
    {
      id: "both",
      caption: "Two helpers, one Copper family.",
      images: products.map(cutoutImage),
    },
    ...products.map((product) => ({
      id: product.id,
      caption: SLIDE_CAPTIONS[product.id] ?? product.name,
      images: [cutoutImage(product)],
    })),
  ];
  const plans = getPlans();
  const privacy = getPrivacySummary();
  const showcaseItems = products.flatMap((product) =>
    product.lifestyle.flatMap((src) => {
      const copy = LIFESTYLE_COPY[src.split("/").pop() ?? ""];
      return copy ? [{ src, productName: product.name, ...copy }] : [];
    }),
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ProductSlider slides={slides} />
        <section
          data-testid="hero"
          id="top"
          className="bg-secondary text-secondary-foreground"
        >
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
            <div className="flex flex-col items-start gap-5">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Smart helpers for your Arizona home
              </h1>
              <p className="text-muted-foreground text-lg">
                From raw ideas to refined answers.
              </p>
              <Button asChild size="lg">
                <a href="#products">See products</a>
              </Button>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              {products.map((product) => (
                <Image
                  key={product.id}
                  src={product.cutout}
                  alt={`${product.name} ${product.type} in ${product.colors[0]}`}
                  width={1254}
                  height={1254}
                  priority
                  sizes="(min-width: 768px) 256px, 45vw"
                  className="h-auto w-full"
                />
              ))}
            </div>
          </div>
        </section>

        <section
          data-testid="products"
          id="products"
          className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12 md:py-20"
        >
          <h2 className="mb-8 text-3xl font-bold tracking-tight">Products</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <Card
                key={product.id}
                data-testid="product-card"
                data-product={product.id}
              >
                <CardContent className="flex flex-col gap-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <Image
                      src={product.cutout}
                      alt={`${product.name} ${product.type} in ${product.colors[0]}`}
                      width={1254}
                      height={1254}
                      sizes="(min-width: 768px) 400px, 90vw"
                      className="mx-auto h-auto w-full max-w-xs"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-primary text-xl font-bold">
                      {formatUsd(product.priceUsd)}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{product.type}</p>
                  <ul className="flex flex-col gap-2">
                    {product.features.slice(0, 3).map((feature) => (
                      <li key={feature.name}>
                        <span className="font-medium">{feature.name}.</span>{" "}
                        <span className="text-muted-foreground">
                          {feature.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <ul
                    aria-label="Available colors"
                    className="flex flex-wrap gap-2"
                  >
                    {product.colors.map((color) => (
                      <li key={color}>
                        <Badge variant="secondary">{color}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          data-testid="showcase"
          id="showcase"
          className="bg-muted scroll-mt-16"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12 md:py-20">
            <h2 className="text-3xl font-bold tracking-tight">
              Made for life in Arizona
            </h2>
            {showcaseItems.map((item, index) => (
              <figure
                key={item.src}
                className="grid items-center gap-6 md:grid-cols-2"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 768px) 480px, 100vw"
                  className={`h-auto w-full rounded-xl ${index % 2 === 1 ? "md:order-2" : ""}`}
                />
                <figcaption className="flex flex-col gap-2">
                  <span className="text-primary text-sm font-semibold">
                    {item.productName}
                  </span>
                  <span className="text-xl">{item.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          data-testid="plus-pricing"
          id="plus"
          className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12 md:py-20"
        >
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            Free or Copper Plus
          </h2>
          <p className="text-muted-foreground mb-8">
            Compare what each plan includes.
          </p>
          <PlanPicker
            defaultPlanId="copper-plus"
            plans={plans.map((plan) => ({
              id: plan.id,
              name: plan.name,
              rows: [
                ["Monthly", formatUsd(plan.monthlyUsd)],
                ["Annual", formatUsd(plan.annualUsd)],
                ["Memory kept", formatMemory(plan.memoryDays)],
                [
                  "Copper Notes recording",
                  formatNotesHours(plan.notesHoursPerMonth),
                ],
                [
                  "Refined answers",
                  plan.refinedAnswers ? "Included" : "Not included",
                ],
              ],
            }))}
          />
        </section>

        <section
          data-testid="privacy-summary"
          id="privacy"
          className="bg-accent text-accent-foreground scroll-mt-16"
        >
          <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">
              How Copper handles your data
            </h2>
            <p className="mb-8 text-lg">
              Our {privacy.policy} privacy policy, in plain words.
            </p>
            <ul className="flex flex-col gap-4 text-lg">
              {privacy.points.map((point) => (
                <li
                  key={point}
                  className="border-accent-foreground/30 border-l-4 pl-4"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
