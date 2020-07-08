const path = require('path'),
    fs = require('fs'),
    nodeExternals = require('webpack-node-externals'),
    tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');


//@**  read webpack configuration from Json file
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'webpack.cli.json'), 'utf8'));
const currentWorkingDir = path.resolve(__dirname);
const tsConfigFilePath = path.resolve(currentWorkingDir, "tsconfig.json");
const mainFile = path.resolve(currentWorkingDir, 'src', config.build.main);
const outputDirectory = path.resolve(currentWorkingDir, config.build.outputDirectory);
const outputFile = config.build.outputFile;
const environment = config.environment;

console.log(`Webpack resolving directory : ${currentWorkingDir}`)

const webpackBuildConfiguration = {
    node: {
        __filename: false,
        __dirname: false
    },
    target: 'node',
    externals: [nodeExternals()],
    entry: mainFile,
    output: {
        path: outputDirectory,
        filename: outputFile
    },
    mode: environment
};


const resolvingStrategies = {
    extensions: ['.ts', '.js'],
    plugins: [new tsconfigPathsPlugin({
        baseUrl: currentWorkingDir,
        configFile: tsConfigFilePath
    })]
    // plugins: [new tsconfigPathsPlugin()],
    // alias: {
    //     "@api": path.resolve(__dirname, 'src/')
    // },


};

const moduleResolvingStrategies = {
    rules: [
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader'
            }
        }
    ]
};


webpackBuildConfiguration.resolve = resolvingStrategies;
webpackBuildConfiguration.module = moduleResolvingStrategies;
module.exports = webpackBuildConfiguration;




