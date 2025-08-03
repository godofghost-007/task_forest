
export type Theme = {
  name: string;
  className: string;
  colors: {
    [key: string]: string;
  };
};

export const themes: Theme[] = [
  {
    name: "Default",
    className: "theme-default",
    colors: {
      background: "30 67% 94%",
      foreground: "30 10% 10%",
      primary: "30 100% 50%",
      secondary: "30 50% 90%",
      accent: "120 25% 65%",
    },
  },
  {
    name: "Pastel Dream",
    className: "theme-pastel-dream",
    colors: {
      background: "300 100% 98%",
      foreground: "300 10% 40%",
      primary: "300 100% 85%",
      secondary: "240 100% 97%",
      accent: "180 100% 85%",
    },
  },
  {
    name: "Night Sakura",
    className: "theme-night-sakura",
    colors: {
      background: "270 15% 15%",
      foreground: "330 30% 90%",
      primary: "330 80% 70%",
      secondary: "270 10% 25%",
      accent: "210 50% 70%",
    },
  },
  {
    name: "Aqua Breeze",
    className: "theme-aqua-breeze",
    colors: {
      background: "190 80% 95%",
      foreground: "190 30% 25%",
      primary: "180 90% 45%",
      secondary: "190 50% 88%",
      accent: "170 100% 40%",
    },
  },
  {
    name: "Ghibli Forest",
    className: "theme-ghibli-forest",
    colors: {
      background: "110 20% 96%",
      foreground: "100 25% 25%",
      primary: "120 60% 45%",
      secondary: "80 30% 90%",
      accent: "40 80% 60%",
    },
  },
  {
    name: "Cyber Neon Tokyo",
    className: "theme-cyber-neon-tokyo",
    colors: {
      background: "260 25% 10%",
      foreground: "260 50% 95%",
      primary: "300 100% 60%",
      secondary: "240 20% 18%",
      accent: "180 100% 50%",
    },
  },
  {
    name: "Chibi Cloudscape",
    className: "theme-chibi-cloudscape",
    colors: {
      background: "210 100% 97%",
      foreground: "220 30% 50%",
      primary: "200 100% 75%",
      secondary: "220 50% 92%",
      accent: "350 100% 85%",
    },
  },
  {
    name: "Moonlit Shrine",
    className: "theme-moonlit-shrine",
    colors: {
      background: "220 20% 12%",
      foreground: "220 15% 88%",
      primary: "0 80% 65%",
      secondary: "220 15% 20%",
      accent: "210 40% 55%",
    },
  },
  {
    name: "Pixel Vaporwave",
    className: "theme-pixel-vaporwave",
    colors: {
      background: "280 20% 15%",
      foreground: "190 100% 90%",
      primary: "300 100% 70%",
      secondary: "260 25% 25%",
      accent: "180 90% 60%",
    },
  },
  {
    name: "Cherry Blossom Rain",
    className: "theme-cherry-blossom-rain",
    colors: {
      background: "340 100% 98%",
      foreground: "340 20% 30%",
      primary: "330 90% 75%",
      secondary: "340 50% 94%",
      accent: "210 50% 80%",
    },
  },
  {
    name: "Crystal Snowfall",
    className: "theme-crystal-snowfall",
    colors: {
      background: "200 60% 95%",
      foreground: "210 25% 30%",
      primary: "210 100% 70%",
      secondary: "200 30% 88%",
      accent: "240 100% 80%",
    },
  },
  {
    name: "Midnight Neko",
    className: "theme-midnight-neko",
    colors: {
      background: "240 10% 10%",
      foreground: "40 100% 90%",
      primary: "40 100% 70%",
      secondary: "240 5% 20%",
      accent: "300 80% 75%",
    },
  },
  {
    name: "Shoujo Heartbeat",
    className: "theme-shoujo-heartbeat",
    colors: {
      background: "340 100% 97%",
      foreground: "330 50% 40%",
      primary: "330 100% 65%",
      secondary: "0 100% 97%",
      accent: "40 100% 70%",
    },
  },
  {
    name: "Yandere Glow",
    className: "theme-yandere-glow",
    colors: {
      background: "300 5% 10%",
      foreground: "330 80% 90%",
      primary: "330 100% 55%",
      secondary: "300 10% 18%",
      accent: "0 0% 70%",
    },
  },
  {
    name: "Otaku Sunset",
    className: "theme-otaku-sunset",
    colors: {
      background: "25 100% 96%",
      foreground: "15 50% 30%",
      primary: "10 90% 60%",
      secondary: "30 100% 92%",
      accent: "320 80% 70%",
    },
  },
  {
    name: "Kawaii Candy Pop",
    className: "theme-kawaii-candy-pop",
    colors: {
      background: "0 0% 100%",
      foreground: "270 50% 50%",
      primary: "330 100% 70%",
      secondary: "200 100% 95%",
      accent: "180 100% 65%",
    },
  },
  {
    name: "Mystic Shrine Maiden",
    className: "theme-mystic-shrine-maiden",
    colors: {
      background: "15 20% 95%",
      foreground: "0 30% 25%",
      primary: "0 70% 50%",
      secondary: "0 10% 88%",
      accent: "200 40% 60%",
    },
  },
  {
    name: "Cozy Kotatsu Winter",
    className: "theme-cozy-kotatsu-winter",
    colors: {
      background: "30 30% 92%",
      foreground: "20 25% 30%",
      primary: "10 80% 60%",
      secondary: "35 20% 85%",
      accent: "180 30% 65%",
    },
  },
  {
    name: "Silent Hilltop School",
    className: "theme-silent-hilltop-school",
    colors: {
      background: "220 10% 90%",
      foreground: "220 10% 25%",
      primary: "210 20% 55%",
      secondary: "220 8% 80%",
      accent: "30 15% 60%",
    },
  },
  {
    name: "Floating Spirit World",
    className: "theme-floating-spirit-world",
    colors: {
      background: "180 30% 15%",
      foreground: "170 70% 90%",
      primary: "160 100% 70%",
      secondary: "180 20% 25%",
      accent: "280 80% 80%",
    },
  },
  {
    name: "Maid Café Minimal",
    className: "theme-maid-cafe-minimal",
    colors: {
      background: "0 0% 100%",
      foreground: "0 0% 15%",
      primary: "330 70% 75%",
      secondary: "0 0% 96%",
      accent: "240 50% 70%",
    },
  },
];
