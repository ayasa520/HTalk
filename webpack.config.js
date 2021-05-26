const path = require("path");
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'htalk.js',
        library: 'htalk'
    },
    optimization: {
        minimize: true
        //开发模式为false不混淆
    },
    //打包css
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}