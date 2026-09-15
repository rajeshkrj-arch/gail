import { useEffect, useRef } from "react";
import {
  Bike,
  Building2,
  Bus,
  Factory,
  Home,
  Hospital,
  Landmark,
  Truck,
  UtensilsCrossed,
  CarTaxiFront,
} from "lucide-react";
import { CITY_BY_ID } from "@/lib/game/data";
import { useGame } from "@/lib/game/store";
import { asset } from "@/lib/asset";

const ICONS = {
  auto: Bike,
  home: Home,
  food: UtensilsCrossed,
  temple: Landmark,
  taxi: CarTaxiFront,
  office: Building2,
  hospital: Hospital,
  industry: Factory,
  bus: Bus,
  truck: Truck,
};

export function CityReveal() {
  const id = useGame((s) => s.revealCity);
  const clear = useGame((s) => s.clearReveal);
  const started = useRef(0);

  useEffect(() => {
    if (!id) return;
    started.current = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      if (now - started.current > 2400) {
        clear();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [id, clear]);

  if (!id) return null;
  const city = CITY_BY_ID[id];
  if (!city) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center bg-bg/55 p-4 pb-28 backdrop-blur-[2px]"
      onClick={clear}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") clear();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="stagger-in w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
        <div className="relative aspect-16/9 overflow-hidden">
          <img
            src={asset("/cities/dark.jpg")}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            crossOrigin="anonymous"
          />
          <img
            src={asset(city.image)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover animate-[reveal-up_500ms_ease-out]"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-bg to-transparent p-4 pt-12">
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-primary uppercase">Energized</p>
            <h2 className="font-display text-3xl font-semibold tracking-display text-fg">{city.name}</h2>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-sm text-muted">{city.line}</p>
          <ul className="grid grid-cols-2 gap-2">
            {city.activities.map((a) => {
              const Icon = ICONS[a.icon];
              return (
                <li
                  key={a.label}
                  className="flex items-center gap-2 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg"
                >
                  <Icon className="size-4 text-primary" />
                  {a.label}
                </li>
              );
            })}
          </ul>
          <p className="font-display text-lg font-semibold tabular-nums text-primary">+500 energy points</p>
          <p className="text-[11px] tracking-wide text-subtle uppercase">Tap to continue</p>
        </div>
      </div>
    </div>
  );
}
