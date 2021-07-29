const { build } = require("esbuild");
const { peerDependencies } = require("../package.json");

const shared = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  sourcemap: true,
  external: Object.keys(peerDependencies),
};

build({
  ...shared,
  outfile: "./dist/index.esm.js",
  format: "esm",
});

build({
  ...shared,
  outfile: "./dist/index.js",
});
