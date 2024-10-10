import {build} from "esbuild";
import {polyfillNode} from "esbuild-plugin-polyfill-node";

await build({
  entryPoints: ["online/src/js/index.js"],
  bundle: true,
  minify: true,
  sourcemap: 'external',
  target: 'chrome60',
  outfile: "online/js/bundle.js",
  plugins: [
    polyfillNode({
      // Options (optional)
    }),
  ],
});
