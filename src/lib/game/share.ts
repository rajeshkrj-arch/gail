import { badgeFor } from "./data";

export async function paintShareCard(opts: {
  score: number;
  cities: number;
  badge: string;
}): Promise<Blob> {
  const w = 1080;
  const h = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas");

  ctx.fillStyle = "#07090e";
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#12151c");
  grad.addColorStop(1, "#07090e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#ffd94f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 220);
  ctx.lineTo(90, 980);
  ctx.stroke();

  ctx.fillStyle = "#ffd94f";
  ctx.beginPath();
  ctx.arc(90, 340, 10, 0, Math.PI * 2);
  ctx.arc(90, 520, 10, 0, Math.PI * 2);
  ctx.arc(90, 700, 10, 0, Math.PI * 2);
  ctx.arc(90, 880, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f4f0e6";
  ctx.font = "600 28px Outfit, sans-serif";
  ctx.fillText("GAIL ENERGY CONNECT", 140, 120);

  ctx.fillStyle = "#8b93a1";
  ctx.font = "500 22px Outfit, sans-serif";
  ctx.fillText("JODO PIPELINE. JAGAO SHEHAR.", 140, 158);

  ctx.fillStyle = "#ffd94f";
  ctx.font = "700 92px Rajdhani, sans-serif";
  ctx.fillText(String(opts.score), 140, 360);
  ctx.fillStyle = "#8b93a1";
  ctx.font = "500 22px Outfit, sans-serif";
  ctx.fillText("ENERGY SCORE", 140, 400);

  ctx.fillStyle = "#f4f0e6";
  ctx.font = "600 48px Rajdhani, sans-serif";
  ctx.fillText(`${opts.cities} cities energized`, 140, 520);

  ctx.fillStyle = "#ffd94f";
  ctx.font = "700 36px Rajdhani, sans-serif";
  ctx.fillText(opts.badge.toUpperCase(), 140, 600);

  ctx.fillStyle = "#f4f0e6";
  ctx.font = "600 40px Rajdhani, sans-serif";
  ctx.fillText("WAH KYA ENERGY HAI", 140, 760);

  ctx.fillStyle = "#8b93a1";
  ctx.font = "400 24px Outfit, sans-serif";
  wrap(ctx, "I connected the network. I energized the city. Can you beat my score?", 140, 820, 800, 34);

  ctx.fillStyle = "#5c6573";
  ctx.font = "500 20px Outfit, sans-serif";
  ctx.fillText("#WahKyaEnergyHai   #EnergizingPossibilities   #PradhanMantriUrjaGanga", 140, 1220);
  ctx.fillText("JHBDPL  ·  GAIL (India) Limited", 140, 1260);

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), "image/png");
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > max) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
}

export function shareCopy(score: number, cities: number) {
  const badge = badgeFor(cities, cities >= 7).name;
  return `I connected the network. I energized the city.\nEnergy score ${score} · ${cities} cities · ${badge}\nCan you beat my score?\n#WahKyaEnergyHai #EnergizingPossibilities #PradhanMantriUrjaGanga`;
}
