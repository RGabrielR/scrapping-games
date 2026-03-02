declare module "*.svg" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}

declare module "@sparticuz/chromium" {
  const chromium: {
    args: string[];
    executablePath: string | Promise<string>;
    headless: boolean;
  };
  export = chromium;
}
