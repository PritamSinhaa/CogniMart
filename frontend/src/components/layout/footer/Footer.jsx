import { ArrowUp, Mail, MapPin, Phone, Sparkles } from "lucide-react";

import FooterColumn from "./FooterColumn";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Trending", href: "/products?sort=trending" },
      { label: "Deals", href: "/deals" },
      { label: "New Arrivals", href: "/products?sort=newest" },
    ],
  },
  {
    title: "AI Shopping",
    links: [
      { label: "AI Assistant", href: "/ai-assistant" },
      { label: "Smart Search", href: "/search" },
      { label: "Recommendations", href: "/recommendations" },
      { label: "Review Analysis", href: "/ai/reviews" },
      { label: "Price Comparison", href: "/ai/price-comparison" },
    ],
  },
  {
    title: "Customer",
    links: [
      { label: "My Account", href: "/profile" },
      { label: "My Orders", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About CogniMart", href: "/about" },
      { label: "Our Mission", href: "/about#mission" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Main footer */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.3fr_2fr] lg:py-16">
          {/* Brand */}
          <div className="max-w-sm">
            <a href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sparkles size={17} />
              </div>

              <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                Cogni<span className="text-emerald-600">Mart</span>
              </span>
            </a>

            <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
              AI-powered shopping designed to help you discover better products,
              make smarter decisions, and shop with confidence.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:support@cognimart.com"
                className="flex items-center gap-3 text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400"
              >
                <Mail size={15} />
                support@cognimart.com
              </a>

              <a
                href="tel:+911234567890"
                className="flex items-center gap-3 text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400"
              >
                <Phone size={15} />
                +91 12345 67890
              </a>

              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <MapPin size={15} />
                Mohali, Punjab, India
              </div>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="GitHub"
                className="
      flex h-9 w-9 items-center justify-center
      rounded-full border border-slate-200
      text-sm font-semibold text-slate-500
      transition-all duration-200
      hover:-translate-y-0.5
      hover:border-emerald-300
      hover:bg-emerald-50
      hover:text-emerald-600
      dark:border-slate-800
      dark:text-slate-400
      dark:hover:border-emerald-700
      dark:hover:bg-emerald-950/30
      dark:hover:text-emerald-400
    "
              >
                GH
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="
      flex h-9 w-9 items-center justify-center
      rounded-full border border-slate-200
      text-sm font-semibold text-slate-500
      transition-all duration-200
      hover:-translate-y-0.5
      hover:border-emerald-300
      hover:bg-emerald-50
      hover:text-emerald-600
      dark:border-slate-800
      dark:text-slate-400
      dark:hover:border-emerald-700
      dark:hover:bg-emerald-950/30
      dark:hover:text-emerald-400
    "
              >
                in
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}
          </div>
        </div>

        {/* AI CTA */}
        <div
          className="
            mb-10
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-emerald-100
            bg-emerald-50
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-emerald-900/50
            dark:bg-emerald-950/20
          "
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Sparkles size={16} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Need help choosing?
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Ask CogniMart AI and get personalized product recommendations.
              </p>
            </div>
          </div>

          <a
            href="/ai-assistant"
            className="
              inline-flex
              h-9
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-emerald-600
              px-4
              text-xs
              font-semibold
              text-white
              transition-colors
              hover:bg-emerald-700
            "
          >
            Ask AI
            <Sparkles size={13} />
          </a>
        </div>

        {/* Bottom */}
        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-slate-200
            py-6
            text-xs
            text-slate-400
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-slate-800
          "
        >
          <p>© {new Date().getFullYear()} CogniMart. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a
              href="/privacy"
              className="hover:text-slate-700 dark:hover:text-slate-200"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-slate-700 dark:hover:text-slate-200"
            >
              Terms
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="
                flex
                items-center
                gap-1.5
                font-medium
                text-slate-500
                transition-colors
                hover:text-emerald-600
                dark:text-slate-400
              "
            >
              Back to top
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
