const rules = require('./webpack.rules');

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
    // Entry point for your application

    // Module rules (like handling CSS files)
    module: {
        rules,
    },
    devtool: 'source-map',
};
