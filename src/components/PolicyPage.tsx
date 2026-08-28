import { ArrowLeft, Mountain } from "lucide-react";
import type { ReactNode } from "react";

import { CartButton } from "@/components/CartButton";

export function PolicyPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3">
          <a href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mountain size={18} />
            </span>
            <span className="hidden sm:inline font-display text-xl font-black tracking-tight lowercase">
              kazevo by solarah
            </span>
          </a>
          <CartButton />
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 md:py-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </a>

        <h1 className="mt-8 font-display text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>
        )}

        <div className="mt-10 space-y-8 text-base leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a:hover]:underline [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-foreground [&_li]:mt-2 [&_p]:mt-3 [&_strong]:text-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </main>

      <footer className="border-t border-border">
        <p className="py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} kazevo by solarah. Built for the light and fast.
        </p>
      </footer>
    </div>
  );
}
