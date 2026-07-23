"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ExternalLink,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Reusable section heading (eyebrow + title + subtitle). Does NOT replace the
// 8 independent <section> blocks — only styles their shared header layout.
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-8 md:mb-12 scroll-reveal ${center ? "text-center" : ""}`}>
      {eyebrow ? (
        <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--nav-theme-light))] mb-3 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`text-base md:text-lg text-muted-foreground ${
            center ? "max-w-3xl mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.home-alone-anomaly.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Home Alone Anomaly Wiki",
        description:
          "Complete Home Alone Anomaly Wiki covering the walkthrough, visitors, anomalies, endings, choices, survival tips, and secrets for the Roblox doorstep horror game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Home Alone Anomaly - Doorstep Horror Survival",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Home Alone Anomaly Wiki",
        alternateName: "Home Alone Anomaly",
        url: siteUrl,
        description:
          "Complete Home Alone Anomaly Wiki resource hub for walkthroughs, visitors, anomalies, endings, choices, and survival guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Home Alone Anomaly Wiki - Doorstep Horror Survival",
        },
        sameAs: [
          "https://www.roblox.com/games/87468080405188/Home-Alone",
          "https://www.roblox.com/communities/715675394/3-AM-Productions-Freeground",
          "https://www.youtube.com/watch?v=esqyy5tOw9s",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Home Alone Anomaly",
        gamePlatform: ["PC", "Mobile", "Roblox"],
        applicationCategory: "Game",
        genre: ["Horror", "Survival", "Puzzle", "Roblox"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/87468080405188/Home-Alone",
        },
      },
      {
        "@type": "VideoObject",
        name: "Home Alone Anomaly - Full Game Walkthrough + Ending",
        description:
          "Full playthrough of Home Alone Anomaly covering every visitor, anomaly, choice and the ending.",
        uploadDate: "2025-06-01",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/esqyy5tOw9s",
        url: "https://www.youtube.com/watch?v=esqyy5tOw9s",
      },
    ],
  };

  // Accordion states
  const [endingsExpanded, setEndingsExpanded] = useState<number | null>(0);
  const [updatesExpanded, setUpdatesExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("walkthrough")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/87468080405188/Home-Alone"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，桌面端 max-w-5xl */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="esqyy5tOw9s"
              title="Home Alone Anomaly - Full Game Walkthrough + Ending"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (位于视频区之后、Latest Updates 之前) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                "walkthrough",
                "visitors-guide",
                "anomalies-guide",
                "endings-guide",
                "beginner-guide",
                "survival-tips",
                "controls-and-mechanics",
                "updates",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section (保留模板1 Latest Updates 模块，不修改) */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Walkthrough (step-by-step) */}
      <section id="walkthrough" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={t.modules.walkthrough.eyebrow}
            title={t.modules.walkthrough.title}
            subtitle={t.modules.walkthrough.subtitle}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.walkthrough.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-3 md:gap-5 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                        Survival tip:{" "}
                      </span>
                      {step.survivalTip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Visitors Guide (card-list) */}
      <section
        id="visitors-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={t.modules.visitorsGuide.eyebrow}
            title={t.modules.visitorsGuide.title}
            subtitle={t.modules.visitorsGuide.subtitle}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.visitorsGuide.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="mb-3 h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                  <DynamicIcon
                    name={card.icon}
                    className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                  />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {card.description}
                </p>
                <div className="mt-auto space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Warning signs:{" "}
                      </span>
                      {card.warningSigns}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Recommended:{" "}
                      </span>
                      {card.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Anomalies Guide (card-list) */}
      <section id="anomalies-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={t.modules.anomaliesGuide.eyebrow}
            title={t.modules.anomaliesGuide.title}
            subtitle={t.modules.anomaliesGuide.subtitle}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.anomaliesGuide.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center flex-shrink-0">
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-bold text-base md:text-lg">{card.title}</h3>
                </div>
                <span className="inline-block self-start text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-3">
                  {card.location}
                </span>
                <p className="text-sm text-muted-foreground mb-3">
                  {card.description}
                </p>
                <div className="mt-auto space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Warning signs:{" "}
                      </span>
                      {card.warningSigns}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Recommended:{" "}
                      </span>
                      {card.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Endings Guide (accordion) */}
      <section
        id="endings-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={t.modules.endingsGuide.eyebrow}
            title={t.modules.endingsGuide.title}
            subtitle={t.modules.endingsGuide.subtitle}
          />
          <div className="scroll-reveal space-y-2">
            {t.modules.endingsGuide.items.map((item: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-white/5"
              >
                <button
                  onClick={() =>
                    setEndingsExpanded(endingsExpanded === index ? null : index)
                  }
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-sm md:text-base">
                    {item.heading}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform text-[hsl(var(--nav-theme-light))] ${
                      endingsExpanded === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {endingsExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Beginner Guide (step-by-step with checklist) */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={t.modules.beginnerGuide.eyebrow}
            title={t.modules.beginnerGuide.title}
            subtitle={t.modules.beginnerGuide.subtitle}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {step.checklist.map((item: string, ci: number) => (
                      <li
                        key={ci}
                        className="inline-flex items-center gap-1.5 text-xs md:text-sm px-3 py-1.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                      >
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 6: Survival Tips (card-list) */}
      <section
        id="survival-tips"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={t.modules.survivalTips.eyebrow}
            title={t.modules.survivalTips.title}
            subtitle={t.modules.survivalTips.subtitle}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.survivalTips.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      card.priority === "Essential"
                        ? "bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]"
                        : card.priority === "High"
                          ? "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]"
                          : "bg-white/5 border-border text-muted-foreground"
                    }`}
                  >
                    {card.priority}
                  </span>
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Controls and Mechanics (table) */}
      <section
        id="controls-and-mechanics"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={t.modules.controlsAndMechanics.eyebrow}
            title={t.modules.controlsAndMechanics.title}
            subtitle={t.modules.controlsAndMechanics.subtitle}
          />
          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-[hsl(var(--nav-theme)/0.3)]">
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Action
                  </th>
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Input
                  </th>
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Purpose
                  </th>
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Mechanic
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.controlsAndMechanics.rows.map(
                  (row: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-semibold align-top whitespace-nowrap">
                        {row.action}
                      </td>
                      <td className="p-4 align-top">
                        <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                          {row.input}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground align-top">
                        {row.purpose}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground align-top">
                        {row.mechanic}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile stacked rows */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.controlsAndMechanics.rows.map(
              (row: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-[hsl(var(--nav-theme-light))]">
                      {row.action}
                    </span>
                  </div>
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-2">
                    {row.input}
                  </span>
                  <p className="text-sm text-muted-foreground mb-1">
                    {row.purpose}
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    {row.mechanic}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Updates (accordion) */}
      <section
        id="updates"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={t.modules.updates.eyebrow}
            title={t.modules.updates.title}
            subtitle={t.modules.updates.subtitle}
          />
          <div className="scroll-reveal space-y-2">
            {t.modules.updates.items.map((item: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-white/5"
              >
                <button
                  onClick={() =>
                    setUpdatesExpanded(updatesExpanded === index ? null : index)
                  }
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-sm md:text-base">
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform text-[hsl(var(--nav-theme-light))] ${
                      updatesExpanded === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {updatesExpanded === index && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm mb-3">
                      {item.summary}
                    </p>
                    <ul className="space-y-2">
                      {item.details.map((detail: string, di: number) => (
                        <li
                          key={di}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Official channels */}
          <div className="scroll-reveal mt-8 p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-base md:text-lg mb-1">
                  Stay current with Home Alone Anomaly
                </h3>
                <p className="text-sm text-muted-foreground">
                  Follow the official Roblox experience and developer community
                  for the latest visitors, fixes, and announcements.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.roblox.com/games/87468080405188/Home-Alone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                >
                  Roblox Game <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.roblox.com/communities/715675394/3-AM-Productions-Freeground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                >
                  Roblox Community <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/communities/715675394/3-AM-Productions-Freeground"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/87468080405188/Home-Alone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=esqyy5tOw9s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.walkthroughVideo}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/results?search_query=home+alone+anomaly"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youTubeSearch}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
