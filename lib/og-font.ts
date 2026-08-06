const LEGACY_UA =
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.71 Safari/534.24";

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
      { headers: { "User-Agent": LEGACY_UA } },
    ).then((res) => res.text());

    const match = css.match(/src: url\(([^)]+)\)/);
    if (!match) return null;

    const fontRes = await fetch(match[1]);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

let interTightMedium: Promise<ArrayBuffer | null> | null = null;

export function getInterTightMedium(): Promise<ArrayBuffer | null> {
  if (!interTightMedium) {
    interTightMedium = fetchGoogleFont("Inter Tight", 500);
  }
  return interTightMedium;
}
