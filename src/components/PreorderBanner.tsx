import { useEffect, useState } from "react";

function getTimeRemaining(deadline: string) {
  const total = Date.parse(deadline) - Date.now();
  if (total <= 0) return null;
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

interface PreorderBannerProps {
  deadline: string;
  shipsBy: string;
  badgeText?: string;
  closedMessage?: string;
}

export function PreorderBanner({
  deadline,
  shipsBy,
  badgeText = "Pre-order",
  closedMessage = "Pre-order ended",
}: PreorderBannerProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeRemaining>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeRemaining(deadline));
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!mounted) return null;

  const closed = !timeLeft;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
          {closed ? closedMessage : badgeText}
        </span>
        {closed ? (
          <span className="font-medium text-foreground">
            Pre-orders have closed. This item will return soon.
          </span>
        ) : (
          <>
            <span className="font-medium text-foreground">
              Ends in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
            <span className="text-muted-foreground">· Ships before {shipsBy}</span>
          </>
        )}
      </div>
    </div>
  );
}
