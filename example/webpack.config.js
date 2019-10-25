const path = require('path');
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './index.html'),
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: [
                    'file-loader?name=[name].[ext]',
                    // 'extract-loader',
                    {
                        loader: path.resolve(__dirname, '../index.js'),
                        options: {
                            placeholder: '{{__content__}}'
                        },
                    }
                ],
            }
        ]
    },
};
