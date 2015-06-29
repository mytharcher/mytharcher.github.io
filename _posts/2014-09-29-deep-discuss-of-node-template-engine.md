---
layout: post
title: Node.js模板引擎的深入探讨
category: thinking
tags: [node.js, JavaScript, 模板引擎]

---

每次当我想用 node.js 来写一个 web 相关项目的时候，我总是会陷入无比的纠结，原因是 JavaScript 生态圈里的模板引擎实在太多了，但那么多却实在找不出一个接近完美的，所谓完美的概念就是功能丰富，书写简单，前后端可共用等一些属性。虽然可以在 [Template Chooser](http://garann.github.io/template-chooser/) 按功能进行挑选，但挑选的结果再用来对比还是各有各的问题。所以干脆就一些模板引擎进行稍微深入的分析，希望通过对比总结出哪种更值得去使用。

{% raw %}

## 第一轮排除 ##

在上次[node模板引擎简单比较](/blog/posts/simply-comparison-of-node-template-engine)的文章里，其实已经有个简单的筛选了，总结成规则应该是这样的：

0.	首先避免使用需要对 HTML 进行转换的 Jade 之类。
	
	对于这类需要翻译才能使用的语言工具我是坚决的抵制，比如[恶心的CoffeeScript](/blog/posts/disgusting-coffeescript)。原因是这根本不是一个必要的过程，而且创造一种浏览器默认不支持的语言来表达首先提高了学习成本，特别是如果在团队中合作那就有必要让每个人都学会并配置上适合的开发工具。其次还要再翻译回来，说的难听点实在是脱裤子放屁，即使有自动化工具，但带来便捷上的收益抵不过徒增的成本。

0.	第二类是原生或者完整语法的 EJS 之类
	
	这类引擎本身没有什么太大的问题，对于学习成本来说 EJS 是非常低的，会 JS 就会写，但是相比较于后来的 mustache 轻逻辑系列，那么必然觉得在模板中写完整的 JavaScript 语法实在太麻烦，而且在模板中，核心是模板，而不是编程语言，所以表达方式应该更偏重于模板。

0.	其次针对模板的功能进行考虑
	
	其实这应该是作为首要考虑的原因，因为功能才是模板引擎的核心，但是实现一个模板引擎在现在来看并不是什么太困难的事情，所以大部分功能都差不多，那么主要考虑的就是差异部分。比如模板继承和引用是我看中的一个必要功能，可以很大程度上提高复用性。另外可能考虑的是输出变量表达式或者管道过滤器之类辅助功能，有这些会方便很多。

0.	最后才是性能的考虑
	
	因为上面说到模板并不是太复杂的东西，性能上面一般不用特别关注，因为大多数引擎都会带有预编译的功能，当一个模板预编译成简单的拼接函数，通常是不会有太大的性能压力。那么这一条考察的基本就是是否能预编译。

最后在 Template Chooser 上根据条件选择下来，就剩这些了：

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/node-tempate-engine/template-engine-chosen.png" />
	<figcaption>基本上就剩下 mustache 系了</figcaption>
</figure>

虽然之前也接触了一些的模板引擎，传统的比如 PHP 的 Smarty，Java 的 Velocity，甚至以前公司里跨平台的火麒麟等，但我还是承认看过一次 mustache 就对这个系列产生了偏好，那么接下来就详细分析一下他的一些特性。

## mustache类引擎特性分析 ##

### 使用`#`作为统一判定符号 ###

优点是简洁，`if`/`for`都可以通吃。但缺点是依赖于必选变量，很难将判断条件其扩展成表达式。另外`for`的索引变量名也无法设置。

当`#xxx`是一个 Object 类型值时，是应该按照`if`存在判断还是按照`for-in`遍历？目前是判断存在并创建下级作用域，这就导致无法使用 Object 类型作为 Map 进行`for-in`遍历。

还有一点，如果是在进行一个 list 的循环时，无法定义循环项和索引的变量名，很难利用到索引这个特殊变量。不过在 GRMustache 的实现中有增强，可以使用`@index`特殊变量，但这不是一个比较好的解决方案。

### `#`作用域效果 ###

`#`模块生成了子级作用域，使模块内的子级变量得到简写。缺点是设计渲染引擎的时候可能对于scope的情况考虑起来比较复杂，比如不同层次的同名变量，有可能会导致性能问题。

### 模板符号 ###

除了变量输出，控制语句的双括号有点多余了，可以考虑减少一层，因为内部还是一个符号，造成代码冲突的几率其实很低。另外模板语句的结束符名称其实也可以省略掉，正如语法分析过程中的关闭括号。示例：

	{#test}
		* {{variable}}
	{/}

可能原始设计以检测到双括号作为打开解析引擎的标志，如果改为单括号，后面碰到非模板的字符需要回朔一位。

### 分支语句 ###

由于条件判断都合并到了`#`符号的语句中，而判断由于要简化多种形式，导致不能使用表达式，而 mustache 只设计了`^`用来取反的一种表达方式，实际上和`#`都没有任何关联，在表达能力上就比较不足，比如想用`else if`就很麻烦。

类似`switch/case`的多条件分支就更难实现，虽然用的也不多，但是还是会有一定机会。

### 模板复用 ###

在 mustache 里只有一种，就是引入模板片段，类似于其他引擎的 include，符号是`{{>partial}}`。而且这指定的是模板名，在后端程序中通常是直接寻找文件名，但还需要自己映射。另外除了Handlebars其他也不支持继承形式的模板复用，所以我之前写了[MustLayout](/blog/posts/npm-mustlayout)这个npm包来在express中预处理这两个缺陷。

### 变量 ###

变量在 mustache 中非常简单，几乎只有模板替换的功能。而在其他引擎中，可以对临时变量赋值，输出可以使用表达式，或者管道过滤器等便捷的方法。

## 对比其他模板引擎的突出特性 ##

### 临时变量赋值 ###

如 liquid/Smarty/Swig 等中，可以在渲染模板时创建临时变量，在某些情况下有一定的便利性。比如在不同模板里引用一个模板片段，该片段中的某个变量名是固定的，但在不同地方引用的时候变量名不同，此时可以在引用之前声明一个统一的变量，帮助统一引用。

这个特性一定程度上也可以由函数模板来完成。

### 变量过滤器 ###

在 liquid/Smarty/Swig/Etpl 等中，可以通过类似 *nix shell 的管道模式，对要输出的变量进行更多处理，比如日期格式化，编码转义等功能。

	{{ aDate | date('Y-m-d') }}

### Swig的块继承 ###

在继承 block 块时可以使用父模板中已定义的部分，方便的追加更多内容，比如 CSS 和 JS 的引用部分：

	{% block head %}
	  {% parent %}
	  <link rel="stylesheet" href="custom.css">
	{% endblock %}

### Dust.js的继承 ###

Dust.js 的继承方式看起来比较诡异，是使用一个正常理解应该是 include 的方式来实现的，而且符号也是从 mustache 系继承过来的`{>parent}`，而仅仅在之后定义 block 区块，对父模板进行覆盖来实现。从实现的角度看这是一个比较取巧的方式，因为如果仅仅是声明 layout ，那么声明语句到底放在模板的哪里比较合适？如果声明两次是否会造成问题？而通过引入的话就比较直白了，不管怎样这是必须写的且只会写一次，我是要用父模板，先拿进来，之后的 block 部分实际上是重名再次定义的赋值过程。

issue里甚至有人提到这种写法应该使用开闭标签，让`{>parent}…{/parent}`之间包含其block的内容，也有道理，但是写起来是略有复杂，不够直白。

### Etpl的引用带入 ###

在 include 一个模板片段时代入一个自定义的块，以覆盖片段中的部分内容。这给 block 除了向上继承以外更多的一种灵活性。

	<!-- import: main -->
	    <!-- block: main -->
	        <div class="list">list</div>
	        <div class="pager">pager</div>
	    <!-- /block -->
	<!-- /import -->

### Etpl的扩展转换引擎 ###

在 Etpl 中称为过滤器，目前用例是将 Markdown 格式的模板内容转换成HTML，有一定价值，但不一定是必须功能，可以考虑作为扩展实现。

	<!-- filter: markdown(${useExtra}, true) -->
	## markdown document
	
	This is the content, also I can use `${variables}`
	<!-- /filter -->

## 期待 mustache 增强的特性 ##

对比了那么多，其实说对 mustache 最主要的偏好还是来自于模板语言表达的简洁性，而对于他最核心的轻逻辑来说，有点太轻，虽然我不需要完整的原生语言控制，但轻的难以表达了就还是需要权衡。最终我把我期待的模板引擎的样子描绘出来，看看是不是有人和我一样。

最主要的变量还是使用双括号，而控制语句使用单括号+特殊字符，同时关闭可以为自结束，并且不需要写对应的关闭标签名。

### 变量输出 ###

使用双括号在模板中输出变量：

	{{ variable }}
	{{ nested.element }}
	{{ array[index] }}
	{{ object[key] }}

输出可以使用带运算符的简单表达式：

	{{ ok ? 1 : 0 }}
	{{ ok || 'none' }}
	{{ index * (x + 3) }}

可以使用过滤器管道：

	{{ variable | escapeHTML }}
	{{ today | date:'Y-m-d' }}
	{{ group | max }}

默认不进行 HTML 转义，这样可以支持更多情景，而不是 HTML 专属，相反使用三括号才进行默认转义：

	{{{ content }}}

可以使用等号`=`进行临时变量赋值，但赋值使用专门的`$`符号语句且需要自关闭符号：

	{$ x = y * 5 /}
	{$ obj = {a: 1, b: []} /}

变量作用域没有发现太大的必要性，而且可能造成性能问题，暂时取消。

### 条件分支 ###

虽然 mustache 的`#`功能很强大，但表达能力略有欠缺且容易造成歧义，所以我还是把条件分支单独拿出来。

`if`语法用问号开头表达，和条件表达式一样有疑问的意思：

	{? expression }
		true
	{/}

	{? !condition }
		false
	{/}

`else`语法借用原来的`^`符号，且不再可以单独使用这个取反符号：

	{? expression}
		true
	{^}
		false
	{/}

`else if`类型的多条件继续使用`^`符号进行额外判断：

	{? case1 }
		1
	{^ case2 }
		2
	{^}
		-1
	{/}

暂时没想到如何简洁的表达对同一条件的`switch/case`，先用`else if`结构代替。

### 循环迭代 ###

普通的`for`循环继续使用`#`，但增加迭代条目和索引临时变量声明：

	{# list:item@index }
		<li>{{ index }}: {{ item }}</li>
	{/}

循环可以针对普通数组，也可以针对 Object 类型的对象：

	{# map:value@key }
		<li>{{ key }}: {{ value }}</li>
	{/}

可以联合取反符号`^`使用，输出没有元素项时的内容：

	{# []:item }
		{{ item }}
	{^}
		none items :(
	{/}

### 模板复用 ###

内嵌模板片段：

	{> partialName /}

模板名称可以在 API 中分情况实现，比如在后端 node.js 环境中，模板名直接对应相对路径进行文件读取；而在前端如果是使用`<script type="text/template">`方式载入的，可以在对应标签属性，通过 DOM 选择器读取。

可以考虑引入 etpl 的片段替换扩展：

	{> partialName }
		{+ blockName }My Title{/}
	{/}

继承上级模板可以考虑引入 Swig 的父级块引用：

	<!-- parent -->
	{+ scripts}
		<script type="text/javascript" src="lib.js"></script>
	{/}

	<!-- target -->
	{< parent /}
	{+ scripts }
		{+/}<!-- 内嵌上级的块 -->
		<script type="text/javascript" src="main.js"></script>
	{/}

这种声明式写法比较容易理解，而如果要实现简单，可以学习 dust.js 直接利用片段插入扩展的方法。

### 引擎规则 ###

这样设计的符号体系，让引擎可以从最简单的规则出发，并降低冲突的可能性。

0. 默认进入文本状态，当遇到第一个开始括号+控制符号`/\{([\{\$\?\/\+#^<>}])/`时，进入控制状态；
0. 根据`RegExp.$1`的符号判断进入何种控制流程，比如是`{`则直接准备输出；
0. 任何**非**变量输出`{`控制流程必须有对应的关闭结束标签`{/}`或者自关闭`.../}`，只有取反条件操作`{^}`例外；
0. 取反操作符`{^}`必须嵌套在条件语句和循环语句中使用；
0. 只要模板声明了继承`{< parent /}`，则会忽略任何`{+ block }...{/}`标签包围之外的内容；
0. 继承和嵌入片段都可以递归；


## 前后端共用模板的一些问题 ##

问题一：后端可以用文件名代替模板名，但前端没有。所以要在前端生成模板名。

1. 用script标签发送到前端，解决模板名又能合并。缺点是占用（污染）了前端的id，可能会产生冲突。（其实也可以用其他元素属性来标识，反正都是使用querySelector类的查询）
2. 添加一个模板名，并交给前端解析。缺点是增加了一种模板结构和命名，设计不好的话可能很难得到认可。

如果生成后，前后端模板名不一致，也会导致无法复用，比如需要include的时候，后端默认是文件路径，但前端一般的模板名称不会带有斜杠`/`字符。

问题二：在后端 render 完某个 path 的页面后，前端接管并使用 ajax 方式，此时使用 History API 在 route 到下一个 path 的时候，调用 view 的对应模板如何判断使用那一层 layout？

问题三：后端和前端在模板中使用的变量名或者层次往往不一致，如果仅作为片段问题到不大，但如果是整页渲染，可能需要额外的针对性处理。

不过话说回来，前后端要想共用模板，除了使用 HTML5 的 History API 优化体验，其他很少有能使用到的场景。尤其是现在 mv* 的前端框架大行其道的情况下，要么就都用纯前端模板，要么就还是传统的后端渲染网页。所以很可能共用这条道路本来就是个美好的设想，而没有很强的需求，大多数情况下考虑各自端的分离使用就可以了。

## API设计 ##

	var Mustplus = Class({
		config: {
			ifStart: ['{?', '}'],
			ifEnd: '{/}',
			elseWord: ['{^', '}'],
			forExp: /\{#(\w+)(?:\:(\w+))?(?:@(\w+))\}?/,
			forEnd: '{/}'
			// ...
		},
		templates: {},
		compiled: {},

		constructor: function (options) {
			this.read = browser ? this.readDOM : this.readFile;
		},
		
		readDOM: function (name) {
			return $('script[type=text/template][name=' + name + ']').html();
		},

		readFile: function (file) {
			return fs.readFileSync(path.join(this.base, file));
		},
		
		// 继承扩展
		extend: function (name) {
		
		},

		include: function (template) {
			return template.match(includeRE) ? template.replace(includeRE, function (name) {
				return this.include(this.read(name));
			}) : template;
		},

		resolve: function (name) {
			return this.include(this.extend(name));
		},
		
		compile: function (name) {
			var content = this.resolve(name);
			var stream = this.parse(content);
			var fn = '';
			while(token = stream.next()) {
				switch(token.type) {
					case 'text':
					default:
						fn += text;
				}
			}
			return new Function('data', fn);
		},

		cache: function (name) {
			return this.compiled[name] || (this.compiled[name] = this.compile(name));
		},
		
		render: function (name, data) {
			return this.cache(name)(data);
		}
	});

	var engine = new Mustplus({/*if config*/});

	var template = engine.compile('xxx');
	template(data);
	// or
	engine.render('xxx', data);

## 最后 ##

其实总结完了以后我发现我偏好 mustache 并不是为他的轻逻辑，而是喜欢他对模板语言简洁的表达方式。再回头看我设计的这套语法，其实主要也是把传统模板语言中的`if/else/foreach`等替换成了符号表达，并做了一些简化。从此看来，其实建立一个万用的模板引擎也不是不可能，因为普遍需求的一些核心语法基本是相同的，只要在初始化的时候将引擎配置成你喜欢的符号和结构的正则表达式，就可以解释为一种新的模板语言。

目前市面上最接近我想法的应该是 [dust.js](http://linkedin.github.io/dustjs/) ，也是我了解到的唯一一个基于语法分析（利用了[PEG.js](http://pegjs.majda.cz/)构建语法）的模板引擎（其他大多数都是基于字符串切分和普通正则分析），难怪 LinkedIn 的工程团队[通过对比最后选择的也是 dust.js](http://engineering.linkedin.com/frontend/client-side-templating-throwdown-mustache-handlebars-dustjs-and-more)。当然如我期待的话还有可以改进的地方，YY总是要有的，万一哪天顺手就实现了呢？

{% endraw %}

-EOF-
