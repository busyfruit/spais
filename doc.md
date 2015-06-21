# 单页面应用集成开发环境设计
##定义
**单页面应用（SPA，Simple Page Application）**  
>不同于传统的链接跳转，整个页面刷新的web站点，单页面应用采用ajax配合history API（或hashchange）技术异步加载数据，并在前端将数据和模板渲染成html片段，动态插入页面中，实现无刷新页面跳转。单页应用在提供更好的用户体验的同时，对前端的工程化有更高的要求。对于加载性能和用户体验要求更高的wap端，一般都会采用单页面的模式开发设计产品。

**集成开发环境**
>比较正式的说法：将前端研发领域中各种分散的技术元素集中在一起，并对常见的前端开发问题、不足、缺陷和需求，所提出的一种解决问题的方案。（引用自<https://github.com/fouber/blog/issues/1>）
简单的说，就是将前端开发过程中必须面临的问题如：本地开发、联调测试、产品发布、js模块化方案、框架集成、静态资源定位、文件名md5戳（去缓存）、预编译、代码压缩合并混淆、性能优化、组件化和组件库等等诸多问题串联起来，形成一个自动化的工作流。旨在提高开发效率和项目的可维护性、降低团队协作成本、减少重复的手工劳动和因此带来的人为失误。  
好的集成开发环境不仅能提升开发效率，更直接关系到整个产品的用户体验。用户体验的提升绝不仅仅是UE出两张设计稿、PM换个交互方式能解决的。比如说，离开系统结构谈性能优化，注定只能临时地解决个别页面的性能问题。

## 基本功能（集成环境的最小功能集）
**本地开发服务器环境**
>一个好的本地开发服务器应该最好能尽量模拟线上的服务器环境，本地开发服务器提供的不仅是开发效率，还能让前端不依赖后端，作为一个独立的产品模块而存在。

1. 支持get/post等多种http method；
2. 支持配置url规则，返回对应假数据；
3. 支持静态资源请求；

**js模块化方案**

1. 支持模块的独立执行上下文，依赖管理（模块管理器的基本功能)；
2. 支持同步/异步模块加载；
3. 支持合理的打包策略；

**组件化支持**

1. *开发环境* 支持组件资源（js/css/图片等）的集中管理（一个组件所依赖的资源应该在同一个组件目录下）；
2. *发布环境* 支持组件资源的自动定位（代码合并导致文件相对路径发生改变，而不需手动的替换资源引用）；
3. 按照功用对组件进行合理的划分和管理（通用控件、业务组件等）；
4. 组件资源的打包（组件依赖的js/css/模板等文件的合并和加载）；

**自动化编译**

1. 自动缓存清理（文件名md5戳）;
2. 代码打包、压缩、混淆；
3. 预编译（css预处理器：less/sass/scss/stylus，js转译语言：coffescript/dart/livescript/ES6等，模板预编译等）；
4. 自动图片优化、css sprite（可选）；
5. 资源内联，资源定位（如CDN部署时代码中的资源路径变更）；
6. 代码的非覆盖式发布；

**开发规范**

1. 代码分层，目录规范（模板、视图、路由、数据的解耦和分离，组件库的管理等）；
2. 命名规范（组件命名规范，文件命名规范，编码规范等）；
3. 技术选型（如库/框架的选择等）
4. 业务模块的拆分和通信（可选，视项目的大小而定）；
5. 子系统的拆分（可选，视项目的大小而定）；

## 集成环境实现的方案选择
**服务器环境**

开源的本地开发服务器方案有很多，比如基于grunt/gulp的各种webserver，npm上有一大堆。但是普遍比较简陋，要么只支持get方法，要么不支持独立的url配置文件，一怒之下自己开发了一个简单的服务器：[spable-server](https://github.com/busyfruit/spable-server)，基于node内置服务器，不依赖任何构建工具（当然也可以配合构建工具如gurnt/gulp之类一起使用），刚好能满足以上提到的3点要求，如果有新的功能要求也可以继续扩展。    
如果前端依赖php环境，比如使用了smarty模板引擎，采用php5.4+的内置服务器，配合一个极简的php框架，比如[Slim](http://www.slimframework.com/)，也是一个不错的选择，但这里只讨论单页面的开发环境。

**模块化方案**

提到模块化，首先想到的肯定是CMD/AMD，基于CMD规范的requirejs出现时间最早，广为人知。但是个人认为在前端发展日新月异的今天，CMD/AMD注定是一个临时的模块化替代品，迟早会被淘汰。在模块打包方面，requirejs提供了一个叫r.js的打包工具，seajs有基于服务器端combo的解决方案，但这r.js的打包方式有很明显的硬伤：要么所有模块全部打成一个包，要么全部单独异步加载。（我曾今见过一些基于requirejs的站点，一次页面跳转发出了20+个异步请求。）而基于cmobo的seajs除了需要服务器的支持，打包配置又过于繁琐难以维护。

另外一个较新的模块化方案[browserify](http://browserify.org/)，也存在同样的问题，它最大的卖点是直接使用commonJS的模块化，并且能把node的内置模块移至到前端来使用，想法很不错，但是目前的实际生产中并不适用。  

我最终的选择是[webpack](http://webpack.github.io/)，正如官网上面所说，webpack将整个依赖树分隔成“独立的块”（chunks）按需加载，采用“代码分割”（Code Splitting）的方式，将代码中用特定语法表明要进行分割的部分抽离出来将他们打成独立的chunk，在需要的时候再去加载。听起来好像跟requirejs的异步加载没有区别？看代码：

```
/**
* 打包时，view1.js + widgetA.js会打成一个chunk，
* view2.js + widgetB.js + somelib.js会打成另外一个chunk。
*/

// in view1.js
module.exports = function () {
	var widgetA = require('path/to/widget/widgetA.js');
	someLink.addEventListener('click', function (e) {
		e.preventDefault();`
		require.ensure([], function (require) {
			var view2 = require('path/to/view/view2.js');
			// render view2 ...
		});
	});
};

// in view2.js
module.exports = function () {
	var widgetB = require('path/to/widget/widgetB.js');
	var somelib = require('path/to/lib/somelib.js');
	// do something ...
};
```
webpack刚好能满足我对大型的单页面应用打包的设想：

1.**全局的库文件打成一个包，并暴露出全局变量**

比如我们采用jQuery+Backbone+underscore来开发，那么这三个库文件是一个整体，三个变量名都全局可用。
>这样做的好处是，首先不需要每个模块中都去require一遍库文件；其次，由于库文件的更新频率非常低，而业务代码更新频率非常高（如果是一个快速发展中的产品，一天发布多次很正常），将库文件和业务代码分开打包能够保证库文件的缓存长期有效，更新的只是业务代码。我们甚至可以使用manifest/localstorage等方式将库文件缓存到本地。  

2.**每次交互最多只发出一次资源请求**

假如我们以“页面”作为基本的功能单元，那么每个页面所依赖的全部css、js、tpl等都能在一次请求中返回；

此外，webpack还有一些其他的特点：    
- webpack认为所有的静态资源都应该是一个模块（不仅仅是js），这样css、tpl等都能在打包的过程中进行最优化加载管理；  
- webpack采用node的模块管理方式管理前端的库依赖，我们不再需要去jQuery官网下载一个代码文件放到目录中，直接用npm安装并require即可。（比较接近server端的包管理方式了~）

## 构建工具 grunt vs gulp
我的结论：grunt和gulp都存在一些缺陷，如果是要打造一个通用的集成化方案，最好还是基于node、python等来开发，但是工作量不小。如果二选一的话，gulp优于grunt。    

先说grunt的缺陷：     
1.grunt基于配置来构建编译流程，随便几步编译处理都会产生很长很长的代码文件，配置文件本身的维护都成问题。
> 以将less编译成css并提供压缩和未压缩两个版本的代码为例，grunt的代码量是gulp的3~5倍左右。

2.文件的多步处理依赖临时文件夹
> 考虑复杂点的编译场景，将less文件中的图片路径进行自动替换，再编译成css，最后压缩，这中间依赖3次临时文件夹的过度。

3.配置的灵活性有限，难以处理复杂的需求

4.违背单一职责    
> 比如对文件进行重命名，这步操作可能在uglify插件中进行，也可能在concat插件中进行，取决于工作流的最后一个环节是谁，插件本身需要负责很多本不该负责的操作。

5.性能低下    
> grunt全部采用node的同步API，再加上临时文件夹的过度，导致频繁的文件读写。可能有人觉得反正是本地编译，性能不那么重要。其实不然，如果启动watch，每次save代码都要等上超过3s才能看效果，开发体验会变得非常糟糕。

再说gulp：    
gulp相对grunt来说确实做了很多改进，异步、基于Stream的构建，遵循unix设计哲学（每个插件只专注于单一的功能）等等。但我在使用的过程中也遇到一些棘手的问题：

1.号称全部基于Stream，其实很多插件的工作都是读取整个文件Buffer来完成的，并不支持Stream的模式，为此gulp提供了isStream和isBuffer的API来做区别；    
2.过于专注于Stream，Stream对单一类型的文件进行处理非常高效方便，但更多时候我们需要同时对多种资源联合处理，比如：编译模板时需要先获取编译过的less内容，以便将css内联进模板中，这种情况下Stream反而成为了阻碍，仍然离不开临时文件夹。

但是相比grunt，gulp相对好用。所以最终选择了gulp。

# 库/框架的选择
影响库和框架的选择的因素是多种多样的，比如业务场景、个人偏好、团队水平、兼容性要求、面向不同的端等等。这是个仁者见仁，智者见智的问题。此外也有一些反框架的观点。    
以下是个人对用过的一些库/框架的观点：    
1.jQuery
>对于PC端站点，如果考虑低版本IE兼容性，jQuery仍是首选，IE8以上jQuery不那么重要了。jQuery容易导致烂代码，它的DOM遍历配合链式调用使用确实很方便，但容易将js逻辑和DOM结构耦合在一起。此外随着jQuery版本跟新，这个库也变得越来越大了。    

2.Zepto
>移动端版本的jQuery，在移动端，手势事件比DOM事件重要，但zepto的手势事件bug较多（作者却拒绝修复），也就能在移动端用用jQuery的DOM操作API、Ajax API和动画功能了。优点是对大多前端开发而言，没有额外的学习成本了。

3.Angular
>对Angular的了解不算深，网上评价褒贬不一，加上新老版本的不兼容，热度降低了不少。通过几个demo我发现Angular具有很强的侵入性与排他性，此外框架本身太重量级了。类似Extjs一样，个人还是保守的建议在管理后台中使用。     

4.Backbone
>Backbone非常小巧轻量，不具有侵入性，完全可以当做一个库来看待，但是对于重交互的产品Backbone可能不如MVVM框架来得方便。

5.React
>React是一个纯UI框架，按MVC来分的话算是V层，颠覆性比较大，也就具有很强的侵入性，用了React基本就没法写原生的HTML了，各有利弊。React最大的特点是性能高，减少了很多的DOM操作导致的reflow，所以对于富交互的APP（比如新浪微博之类）可能是个不错的选择。

6.反框架
>反对使用框架的观点有一定的道理，反框架的开发者一般都提倡[unix哲学](https://zh.wikipedia.org/zh/Unix%E5%93%B2%E5%AD%A6)，反对一个框架包办所有的事，甚至接管你的整个目录结构。在以前的前端开发中，反框架太理想化了，兼容性问题始终无法很好解决。但随着标准的普及，个人认为这会成为一个趋势。尤其在移动端，大多数情况下我们只需考虑webkit内核的浏览器，Android2.3也已经接近淘汰，ES5已经可以放心使用，ES6、HTML5和CSS3的很多新特性都能够被用上。我们完全可以选择小而专注的库来搭建应用。以下是一些优秀的移动端专注解决某类问题的库：      
[fastclick.js](https://github.com/ftlabs/fastclick)，专注点击事件，没有zepto坑爹的点击穿透bug；   
[hammer.js](http://hammerjs.github.io/)，专注各种手势事件，小而全；    
[animation.css](https://daneden.github.io/animate.css/)，定义好的CSS3动画样式集；     
[enquire.js](http://wicky.nillia.ms/enquire.js/)，处理响应式布局，压缩后才0.8kb；    
[iScroll.js](http://cubiq.org/iscroll-5)，这个不用多说了，移动端开发很少没用过的吧；    
[then-request](https://github.com/then/then-request)，ajax库，使用了Promise模式；   
[ajax.js](https://github.com/ForbesLindesay/ajax)，类似jQuery ajax API的ajax库；   
所以如果是一个移动端站点，我的选择是Backbone（可选） + zepto（可选）+ underscore/lodash（可选）+ fastclick.js + hammer.js + iScroll.js + animation.css

## 开发规范制定
####目录规范   
目录结构的划分是很重要的一个环节，关系到资源的相互关系、封装、加载，以及编译阶段的实现。
其中最重要的是组件的划分，其次是资源的组织方式。

**组件的划分**   
按照我的经验，一个web站点的组件分为两类：ui控件和业务组件。

**ui控件**   
>ui控件是指业务无关的，全局通用组件，比如弹窗、面包屑、翻页组件、按钮样式等等。类似开源的控件库如bootstrap、jqueryUI等。私人站点直接使用bootstrap就行，但一个商业产品的开发团队往往会有自己的设计师，有自己的站点风格，随着项目的日积月累，控件数也会逐渐增多，最终形成一套控件库。ui控件的特点是复用度高，同时不仅限于js控件，也包括纯css控件。    

**业务组件**
>业务组件是指跟业务相关的，页面级别的组件。对于一个复杂的页面，所有代码写在一个文件里显然不是一个好办法，合理的拆分成多个部分，每个部分独立成一个widget很有必要。业务组件又分成两类：具体页面的widget和全局widget，页面级别的widget只针对某个页面而言，全局widget指的是全站统一的导航条、footer等。不同于ui控件，不管是页面及的还是全局的widget，都不需要复用。但widget应该和ui控件一样对内封装、对外提供合理且可扩展的API。

对此，目录结构中应该包含ui、widget两个目录。

**资源的组织方式**   
对于图片、css、js等文件，传统的做法是建立三个文件夹image、css、js，分别存放。哪怕同属于一个组件的三个资源都被割裂开来归属到以资源类型来划分的三个目录中。这种做法对于项目的维护照成很多困难，首先，当修改一个组件时，需要跑到3个不同的位置去找对应的资源；其次，哪个css对应哪个组件，某张图片归哪个组件所有，只能通过对文件按照某种约定命名来区别；此外，资源只能新增不能删除，试想一个经历了一段时间的项目，经过了很多人的手，你知道这个文件到底在哪些地方被引用了吗？你敢保证你删除某个文件不会导致某个你不知道的页面出现bug吗？长久下去，项目里面存在越来越多的死文件，但谁也不敢轻易去清理它们。所以，我们应该按照功能而不是类型来划分资源，比如同一个组件的所有图片、样式、脚本等都应该存放在同一个目录下。

下面的目录结构基于以上两点来设计：

```
project
	- src                项目源码目录
		- image          全局图片，如favicon等；
		- css            全局样式
			- reset.less
			- global.less
		- js             入口js文件
			- main.js    单页面的入口文件
		- util           工具库js，如dateformatter等
		- page           以“页面”为基本单位，page下的每个文件夹对应着一个页面
			- home       首页
				- slider 首页的slider组件
					- slide.js
					- slide.less
					- slide.tmpl
				- some_other_widget
					...
				- images  首页依赖的图片
				- home.less
				- home.js
				- home.tmpl
			  ...

		- ui			通用的UI控件
			- dialog    一个弹窗控件
				- dialog.js
				- dialog.tmpl
				- dialog.less
			- popover
			- icon
			  ...
		- widget        全局组件，如header、nav、sidebar等
		- test          假数据存放目录
		- index.tpl     单页应用的入口模板
	- node_modules		node的安装包，包括开发工具包如gulp，和开发资源包如jQuery
	- output            编译产出目录，分成静态资源和模板两部分，方便线上部署
		- static
		- index.tpl
	- gulpfile.js       gulp配置文件
	- package.json      node的项目配置
	- server.conf       本地服务器配置
	- build.sh          上线编译脚本
	- README.md         项目说明，也许还需要一个doc目录？
```

# 一个完整实现
基于上面提到的各种问题，我最终产出了一个实现版本，取了个牛逼的名字：[spais](https://github.com/busyfruit/spais)（Simple Page Apps Integrated Solution）。但其实并不具有通用性，不支持插件开发，没有在编译的各个环节暴露的各种Hook供调用，更不能拿过去直接应用到项目中。所以，其实，它只是一个基于gulp+webpack的具体实现，还配不上这个高大上的名字。但是我认为一个完全通用的，能满足各种应用场景的，符合所有人口味的完整实现，难度太大了。没有最完美的，只有最适合自己的。所以，基于这套方案，也许可以稍微改造，删除用不到的功能，添加自己想要的功能，能够DIY一个项目专属的解决方案，至于插件开发，gulp和webpack都是支持的。

最后，列一下spais支持的功能：

 1.本地开发服务器，在server.conf中用正则表达式匹配url，指向一个假数据json文件，代码里面就可以调用了。也支持#注释，
比如：
```
# 这里是注释
^\/api\/users\/get ./test/userlist.json
```

2.支持自动替换css中的图片链接，也可配置CDN路径，发布模式能自动将图片地址换成线上CDN服务器地址；同时支持图片base64内联。比如：
```
// 源码：
.cls{
	background-image:url(bg.jpg);
}
.another-cls{
	background:url(logo.png?__inline);	
}

//编译后：
.cls{
	background-image:url(http://cdndomain/static/image/bg.jpg);
}
.another-cls{
	background:url("base64 content....");
}
```
3.支持css内联，为了实现一次页面跳转仅发出一次资源请求，link标签引入的css最终都会变成style标签内联的形式嵌入到模板中。

4.支持less预编译、支持underscore模板预编译，当然如果想换成其他css预处理器或者其他模板引擎，很简单，改一下[tasks/less.js](https://github.com/busyfruit/spais/blob/master/tasks/less.js)或[tasks/tempalte.js](https://github.com/busyfruit/spais/blob/master/tasks/template.js)中的预编译库就行。

5.支持css自动minify、js自动uglify；

6.支持js模块化，模块的依赖会自动打包到一起，模板预编译成js后也可以直接在js中require，最终样式表、模板、js代码实际上打包成了一个js文件。

7.支持文件自动添加md5戳，上线时的缓存更新不需要担心，专注写码就好了。

8.用node的方式来编写和维护前端代码，可随意require文件，可用npm安装模块，初始化项目等等。当然，这都是webpack的功劳。

## TODO List
1. 添加sourcemap支持，开发时，所有的代码虽然不会被压缩，但也打成了一个包，添加sourcemap更方便debug；
2. 提供联调时的自动发布到测试机功能；
3. 其他能想到的...