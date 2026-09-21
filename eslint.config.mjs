import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next/**", "coverage/**", "playwright-report/**", "test-results/**", "next-env.d.ts"] },
  ...tseslint.configs.recommended,
);
