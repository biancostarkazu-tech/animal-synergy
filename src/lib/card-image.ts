import { Animal } from "@/types";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  let line = "";
  let cursorY = y;
  for (const char of text) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line !== "") {
      ctx.fillText(line, x, cursorY);
      line = char;
      cursorY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, cursorY);
  return cursorY + lineHeight;
}

export function downloadCardImage(animal: Animal) {
  const canvas = document.createElement("canvas");
  canvas.width = 540;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = animal.color.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = animal.color.card;
  ctx.beginPath();
  ctx.roundRect(30, 50, canvas.width - 60, canvas.height - 100, 32);
  ctx.fill();

  ctx.textAlign = "center";

  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = animal.color.primary;
  ctx.fillText("あなたの診断結果は…", canvas.width / 2, 120);

  ctx.font = "120px sans-serif";
  ctx.fillText(animal.emoji, canvas.width / 2, 250);

  ctx.font = "bold 40px sans-serif";
  ctx.fillStyle = animal.color.text;
  ctx.fillText(animal.name, canvas.width / 2, 310);

  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = animal.color.primary;
  ctx.fillText(animal.catchphrase, canvas.width / 2, 350);

  ctx.textAlign = "left";
  let cursorY = 410;

  ctx.font = "bold 19px sans-serif";
  ctx.fillStyle = animal.color.primary;
  ctx.fillText("✨ リフレーミングされた才能", 70, cursorY);
  cursorY += 32;
  ctx.font = "19px sans-serif";
  ctx.fillStyle = animal.color.text;
  cursorY = wrapText(ctx, animal.reframedTalent, 70, cursorY, canvas.width - 140, 27);

  cursorY += 20;
  ctx.font = "bold 19px sans-serif";
  ctx.fillStyle = animal.color.primary;
  ctx.fillText("🤝 トリセツ", 70, cursorY);
  cursorY += 32;
  ctx.font = "19px sans-serif";
  ctx.fillStyle = animal.color.text;
  cursorY = wrapText(ctx, animal.interactionTip, 70, cursorY, canvas.width - 140, 27);

  cursorY += 20;
  ctx.font = "bold 19px sans-serif";
  ctx.fillStyle = animal.color.primary;
  ctx.fillText("💬 かけてほしい言葉", 70, cursorY);
  cursorY += 32;
  ctx.font = "bold 19px sans-serif";
  ctx.fillStyle = animal.color.text;
  cursorY = wrapText(ctx, animal.praiseWord, 70, cursorY, canvas.width - 140, 27);

  ctx.textAlign = "center";
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = animal.color.primary;
  ctx.fillText("アニマルシナジー 🐾", canvas.width / 2, canvas.height - 60);

  const link = document.createElement("a");
  link.download = `animal-synergy_${animal.id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
