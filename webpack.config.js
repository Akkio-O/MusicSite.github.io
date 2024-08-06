const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

// Получаем все HTML файлы в папке src
const htmlPages = glob.sync('./src/**/*.html');
const entries = htmlPages.reduce((acc, page) => {
    const name = path.basename(page, '.html');
    acc[name] = path.resolve(__dirname, `./src/${name}.js`);
    return acc;
}, {});
module.exports = {
    mode: 'development',
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        pathinfo: true,
        assetModuleFilename: '[name][ext]',
        clean: true,
    },
    performance: {
        hints: false,
        maxAssetSize: 512000,
        maxEntrypointSize: 512000,
    },
    devServer: {
        port: 9000,
        compress: true,
        hot: true,
        static: {
            directory: path.join(__dirname, './dist'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],

            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|webm)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]',
                }
            }
        ]
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
        })
    ]
};