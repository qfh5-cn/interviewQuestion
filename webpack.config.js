const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWepackPlugin = require('clean-webpack-plugin');

// 导出webpack配置
module.exports = {
    // 入口
    entry:'./src/main.js',

    // 出口
    output:{
		path:path.resolve(__dirname,'./dist'),
		filename:'js/[name]-[hash:5].js'
    },

    // 服务器
    devServer: {
        contentBase: path.join(__dirname, "./src"), 
        host:'0.0.0.0'
    },

    resolve:{
        alias:{
            '@':path.resolve('./src'),
            '@@':path.resolve('./src/components'),
            '~':path.resolve('./src/pages')
        }
    },
    
    // 加载器
    module:{
		rules:[
            {
				test:/\.jsx?$/,
				exclude:path.resolve(__dirname,'./node_modules'),//排除node_modules目录
				
				use:[{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/react'],
                        plugins: [
                            ['@babel/plugin-proposal-decorators',{legacy:true}],
                            '@babel/plugin-proposal-class-properties',
                            ["import", { 
                                libraryName: "antd", 
                                libraryDirectory: "es",
                                style: "css" 
                            }] // `style: true` 会加载 less 文件
                        ]
                    }
				}]
            },
            { 
				test: /\.css$/, 
				loader: ['style-loader','css-loader'] 
            },
			{
				test:/\.scss$/,
				loader:['style-loader','css-loader','sass-loader']
			}
        ]
    },

    // 插件
    plugins:[
		new HtmlWebpackPlugin({
			template:'./src/template.html',
			hash:true,
			title:'首页'
        }),
        new CleanWepackPlugin()
    ]
}