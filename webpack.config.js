var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry:
    {
        TabbedLogin: "./src/TabbedLogin/TabbedLogin.ts",
        TabbedLoginNoContext: "./src/TabbedLogin/TabbedLoginNoContext.ts"
    },
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/widget/[name].js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [".ts"],
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.html$/, use: "html-loader" },
            {
                test: /\.css$/, loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    devtool: "source-map",
    externals: [/^mxui\/|^mendix\/|^dojo\/|^dijit\//],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" }
        ], {
                copyUnmodified: true
            }),
        new ExtractTextPlugin("./src/widget/ui/TabbedLogin.css"),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};
