module.exports = {
    webpack: (config, options, webpack) => {
        config.entry.main = [
            './src/index.ts'
        ];
        config.resolve = {
            extensions: [".ts", ".js", ".json"]
        };
        config.module.rules.push({
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
        });

        console.log(options.env);
        if (options.env == "development") {
            // TODO:
            // config.entry = Object.assign({app: ['./src/index.ts']}, config.entry);
        } else {
            config.output.path = './';
            config.output.filename = 'app.js';
            config.output.sourceMapFilename = 'app.map';
        }

        return config;
    }
};
