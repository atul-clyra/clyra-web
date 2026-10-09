import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const eslintConfig = [
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Copy uses plain quotes and apostrophes, which render fine in JSX text.
      "react/no-unescaped-entities": "off",
      // Static export with `images.unoptimized`, so next/image adds nothing over <img>.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
