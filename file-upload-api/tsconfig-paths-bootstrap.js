const path = require("path");
const tsConfigPaths = require("tsconfig-paths");
const tsConfig = require(path.resolve(__dirname, "tsconfig.build.json"));


tsConfigPaths.register({
    baseUrl: tsConfig.compilerOptions.outDir,
    paths: tsConfig.compilerOptions.paths
});

