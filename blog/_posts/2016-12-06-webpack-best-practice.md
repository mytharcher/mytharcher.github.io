---
layout: post
title: 小型项目 Webpack 最佳实践
category: thinking
---

最近的项目里使用了当下最流行的 React 技术栈（全家桶），从以前作坊式的开发逐渐迁移到完整先进的前端工程化体系，算是又一次跳级。因为前几年前端各类轮子层出不穷，一是项目没需求，二是之前的方法大部分情况也能维持，本着够用就不折腾的原则，完全没有涉及到当时很流行的 grunt/gulp 等工具。而到了 React，webpack 就成了事实标配，并且在了解了他的 loader 机制后，觉得 grunt/gulp 之流 task runner 的思路无法吸引我，这部分配合 npm script 就能很好的解决。所以在工程化方面通过 webpack+npm 就完成了一次较大的跨越，而省去了中间众多轮子的学习成本。

但是 webpack 的学习之路也不是一帆风顺，还是经历了一定的折腾，文档看过很多遍，又根据使用到的功能反复调试很长时间后，项目里的`webpack.config.js`文件终于逐渐稳定下来，也算摸清了各个配置和选项的具体作用，于是将当前的配置做一个总结，逐块分析用途和注意事项，以备查阅。因为目前项目是基于 webpack 1.x 的，所以有部分配置名称和结构与 webpack 2.x 不太一样，但根据版本迁移文档应该不难升级。

	entry: './src/',

`entry`是整个应用的入口，由于的应用规模比较小，所以单一入口就可以了。如果需要多入口，可以参考官网文档中更复杂的配置。

	output: {
		path: './dist/[hash]',
		filename: '[name].js'
	},

输出配置中，指定目标路径中带上了`[hash]`是因为希望打包出的结果按版本划分目录，方便后续部署的流程。因为用版本做目录名，所以文件名直接用原名即可。

	resolve: {
		extensions: ['', '.js', '.jsx']
	},

这里面主要其实也是定义入口文件的默认后缀和检索顺序。

	eslint: {
		configFile: './.eslintrc'
	},

加入 eslint 是为了避免代码中很多低级错误。

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loader: 'eslint-loader',
				include: /src/,
				exclude: /node_modules/
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react']
				},
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.less$/,
				loaders: ['style', 'css', 'less', 'postcss']
			},
			{
				test: /\.css$/,
				loaders: ['style', 'css']
			},
			{
				test: /\.(jpe?g|gif|png|svg|eot|woff|ttf|otf)$/,
				loader: 'url',
				query: {
					limit: 4096,
					name: '[name].[ext]'
				}
			}
		]
	},

loader 其实还比较容易理解了，除了图片字体相关静态资源做了一个小于 4K 就转 base64 的设置，其他应该都很容易看懂。

	postcss: [autoprefixer],

针对 CSS 文件有个额外的配置是使用自动前缀修正插件来解决很多新特性的浏览器兼容问题。

	devServer: {
		proxy: {
			'/assets/*': {
				target: process.env.CDN_BASE_URL,
				changeOrigin: true
			}
		}
	},

对开发服务器的配置只加入了一个线上资源文件的代理，其他基本都写在命令行里，后面会另外介绍。

	plugins: [
		new HtmlwebpackPlugin({
			template: './src/templates/index.html'
		}),
		new webpack.EnvironmentPlugin(['NODE_ENV', 'API_BASE_URL'])
	]

最后是用到的两个插件，`index.html`作为默认的静态服务器入口文件，使用`HtmlwebpackPlugin`来进行复制打包。

`webpack.EnvironmentPlugin`是为打包脚本注入可能会使用到的环境变量的插件，参数是一个要用到的变量名字符串列表。当然也可以选择使用`webpack.DefinePlugin`，但这个插件的使用方式比较反人类，需要把变量内容使用`JSON.stringify()`方法来输出为字面量。而且只能每个变量一个单独配置，一旦想省事合并为一个对象一起定义使用时，就会触发一个 [bug#3421](https://github.com/webpack/webpack/issues/3421)，在输出结果中被每个使用的地方都替换且无法被压缩，造成输出文件体积过大的问题。

说完了 webpack 的配置，后面就是如何使用的问题。这部分我整理成了 npm 的命令行放在`package.json`文件的脚本配置中：

	"scripts": {
		"dev": "webpack-dev-server --port 3000 --hot --inline --history-api-fallback --colors --progress",
		"build": "NODE_ENV=production webpack -p --optimize-occurence-order --optimize-dedupe --output-public-path 'http://api.giulia.ai/assets/[hash]/'"
	},

如果不是开发环境的内容资源要配置代理服务器，我甚至不需要在 webpack 里配置`devServer`这一块。最大的目的就是开发调试和生产环境的发布使用同一份配置文件，而不需要用`if/else`或者不同文件来区分，只通过不同的命令行参数来解决这个问题，使用起来更加简单和具有一致性。

开发的时候只需要运行`npm run dev`就开启了本地调试服务器，而测试完成需要打包上线时，再运行`npm run build`输出打包和压缩优化后的结果。整个过程非常清晰和简单，不再需要任何的`grunt/gulp`等任务管理工具来解决，即使有需要，也直接在`script`配置项里添加各类命令即可。

最后将配置文件整理成了一个 gist，以备后用。

<script src="https://gist.github.com/mytharcher/89891ce55f6b98930c57351bbf3a23af.js"></script>
