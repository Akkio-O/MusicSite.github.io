const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const glob = require('glob');

// Получаем все HTML файлы в папке src
const htmlPages = glob.sync('./src/**/*.html');
const entries = htmlPages.reduce((acc, page) => {
    const name = path.basename(page, '.html');
    acc[name] = path.resolve(__dirname, `./src/${name}.js`);
    return acc;
}, {});

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|webm)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]',
                },
            },
        ],
    },
    plugins: [
        ...htmlPages.map(page => {
            const name = path.basename(page, '.html');
            return new HtmlWebpackPlugin({
                filename: path.basename(page),
                template: page,
                inject: true,
                chunks: [name], // Добавляем только нужные чанки
                minify: false // Отключаем минификацию для диагностики
            });
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
        new CleanWebpackPlugin(),
        // download images to dist folder
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/img'),
                    to: path.resolve(__dirname, 'dist/img'),
                    noErrorOnMissing: true,
                },
                {
                    from: path.resolve(__dirname, 'src/css'),
                    to: path.resolve(__dirname, 'dist/css'),
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin(),
        ],
    },
};
