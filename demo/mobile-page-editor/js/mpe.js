// namespace mpe.*
var mpe = {
	data: {
		linkCategoryMap: {
			weisite: '微官网链接',
			newssubject: '新闻列表主题链接',
			newscat: '新闻列表分类链接',
			weigallery: '微相册相册链接',
			article: '单图文多图文链接',
			lbsgroup: 'lbs分组链接',
			'360view': '360全景链接',
			musicbox: '音乐盒链接',
			game: '游戏和功能链接'
		}
	},

	Type: {
		meta: 'MPEMetaPreviewer',
		title: 'MPEHeadingPreviewer',
		richtext: 'MPERichTextPreviewer',
		images: 'MPEImageGroupPreviewer'
	},

	loaders: [
		// module list
		function (done) {
			elf().ajax({
				url: 'data.json',
				responseType: elf.net.Ajax.DATA_TYPE_JSON,
				onsuccess: function (data) {
					mpe.data.blocks = data;
					done();
				}
			});
		},

		// link list
		function (done) {
			elf().ajax({
				url: 'link-list.json',
				responseType: elf.net.Ajax.DATA_TYPE_JSON,
				onsuccess: function (data) {
					mpe.data.linkList = data;

					var categoryMap = mpe.data.linkCategoryMap;
					mpe.data.linkCategories = Object.keys(categoryMap).map(function (category) {
						var id = 'LinkCategory-' + category;
						return {title: this[category], panel: id};
					}, categoryMap);

					done();
				}
			});
		}
	],

	components: {
		PreviewerGroup: {
			datasource: '*blocks'
		},

		LinkSelector: {
			categories: '*linkCategories',
			categoryMap: '*linkCategoryMap',
			datasource: '*linkList'
		}
	},

	context: function (component) {
		var value, data;
		for (var prop in component) {
			value = component[prop];
			if (typeof value == 'string' && ~value.indexOf('*')) {
				data = mpe.data[value.slice(1)];
				if (data) {
					component[prop] = data;
				}
			}
		}
	},

	init: function (options) {
		elf.util.Processor.parallel.apply(null, mpe.loaders.concat([
			function () {
				esui.init(document.body, mpe.components, mpe.context);

				elf('#panel-new button').on('click', function (ev) {
					var type = elf(this).attr('rel');
					var ui = esui.util.create(type, {
						id: elf().guid('block')
					});
					ui.appendTo(elf().g('preview'));
				});
			}
		]));
	}
};

mpe.LinkSelector = elf().Class({
	tplList: '<ul>#{0}</ul>',
	tplLinkItem: '<li><button type="button" rel="select" data-link="#{url}">选择</button>#{label}</li>',
	_tplClose: '<button type="button" ui="type:Button; id:{0}; skin:layerclose;"><i class="fa fa-times"></i></button>',

	constructor: function (options) {
		esui.Dialog.call(this, options);
	},

	render: function () {
		var rendered = this._isRendered;
		if (!rendered) {
			esui.Dialog.prototype.render.call(this);

			elf(this.main).addClass(this.__getClass('linkselector'));

			var categoriedData = {};
			this.datasource.forEach(function (item) {
				var type = item.type;
				if (!categoriedData[type]) {
					categoriedData[type] = [];
				}
				categoriedData[type].push(item);
			});

			var fragment = document.createDocumentFragment();
			Object.keys(this.categoryMap).forEach(function (category) {
				var id = 'LinkCategory-' + category;
				elf.dom.Node.create('section', {id: id})
					.html(this.createCategoryHTML(categoriedData[category] || []))
					.appendTo(fragment);
			}, this);

			var body = elf('.ui-dialog-body', this.main);
			body.append(fragment);

			esui.util.create('Tab', {
				id: 'LinkCategories',
				datasource: this.categories
			}).insert(body[0], body[0].firstChild);

			elf(this.main).on('click', this._handlerSelect.bind(this), 'button[rel=select]');
		}
	},

	createCategoryHTML: function (list) {
		var listHTML = list.map(function(item) {
			return elf().template(this.tplLinkItem, item);
		}, this);
		return elf().template(this.tplList, listHTML);
	},

	show: function (picker) {
		this.picker = picker;
		esui.Dialog.prototype.show.call(this);
	},

	_handlerSelect: function (ev) {
		var target = ev.target;
		this.picker && this.picker.onpick(target.getAttribute('data-link'));
		this.hide();
	}
}, esui.Dialog);

esui.util.register('MPELinkSelector', mpe.LinkSelector);



mpe.LinkPicker = elf().Class({

	selectorId: 'LinkSelector',

	constructor: function (options) {
		esui.TextInput.call(this, options);
	},

	render: function () {
		var rendered = this._isRendered;
		if (!rendered) {
			esui.TextInput.prototype.render.call(this);
			var selectButton = elf.dom.Node.create('button', {
				className: 'btn btn-default ui-linkpicker-button'
			}).html('选择');
			this.main.parentNode.insertBefore(selectButton[0], this.main.nextSibling);
			selectButton.on('click', this._openSelectorHandler.bind(this));
		}
	},

	_openSelectorHandler: function (ev) {
		esui.get(this.selectorId).show(this);
	},

	onpick: function (link) {
		this.setValue(link);
		this.onchange();
	}
}, esui.TextInput);

esui.util.register('MPELinkPicker', mpe.LinkPicker);



mpe.ImagePicker = elf().Class({
	_type: 'imagepicker',

	selectorId: 'ImageSelector',

	constructor: elf().copy({
		selectors: {},
		pickerKey: elf().guid('_imagePicker_'),
		getSelector: function (id) {
			var selector = mpe.ImagePicker.selectors[id];
			if (!selector) {
				selector = UE.getEditor(id);
				selector.ready(function () {
					this.hide();
					this.addListener('beforeInsertImage', function (ev, args) {
						// console.log(args);
						this[mpe.ImagePicker.pickerKey].onpick(args.pop());
					});
					// this.getDialog('insertimage').open();
				});
				selector.show = (function (originShow) {
					return function (picker) {
						this[mpe.ImagePicker.pickerKey] = picker;
						this.getDialog('insertimage').open();
					};
				})(selector.show);

				mpe.ImagePicker.selectors[id] = selector;
			}

			return selector;
		}
	}, function (options) {
		esui.InputControl.call(this, options);
	}),

	render: function () {
		var rendered = this._isRendered;
		if (!rendered) {
			esui.InputControl.prototype.render.call(this);

			this.constructor.getSelector(this.selectorId);

			elf(this.main).on('click', this._clickHandler.bind(this));
		}

		var bg = this.main.style.backgroundImage;
		this.value = this.value || (bg ? bg.replace(/^url\((.*)\)$/, '$1') : '');

		elf(this.main).setStyle('background-image', this.value ? 'url(' + this.value + ')' : 'none');
	},

	setValue: function (value) {
		esui.InputControl.prototype.setValue.call(this, value);
		this.render();
	},

	_clickHandler: function (ev) {
		var selector = this.constructor.getSelector(this.selectorId);
		selector.show(this);
	},

	onpick: function (image) {
		this.setValue(image.src);
		this.onchange();
	},

	onchange: new Function()
}, esui.InputControl);

esui.util.register('MPEImagePicker', mpe.ImagePicker);



mpe.PreviewerGroup = elf().Class({
	_type: 'previewergroup',

	constructor: function (options) {
		esui.Control.call(this, options);
	},

	render: function () {
		var rendered = this._isRendered;

		if (!rendered) {
			esui.Control.prototype.render.call(this);

			$(this.main).sortable({
				items: '.ui-blockpreviewer:not(.fixed)',
				forcePlaceholderSize: true
			});

			var data = this.datasource || [];
			data.map(this.createChild, this).forEach(this.insert, this);
		}
	},

	createChild: function (data, index) {
		var type = mpe.Type[data.type];
		return type ? esui.util.create(type, {
			id: elf().guid('block'),
			datasource: data
		}) : null;
	},

	insert: function (ui, position) {
		ui && ui.insert(this.main, position || null);
	}
}, esui.Control);

esui.util.register('MPEPreviewerGroup', mpe.PreviewerGroup);



mpe.EditorGroup = elf().Class({
	_type: 'editorgroup',

	constructor: function (options) {
		esui.Control.call(this, options);
	},

	closeAll: function () {
		elf(this.main).children().forEach(function (item) {
			var ui = esui.util.getControlByDom(item);
			if (ui instanceof mpe.BlockEditor) {
				ui.hide();
			}
		});
	}
}, esui.Control);

esui.util.register('MPEEditorGroup', mpe.EditorGroup);



mpe.AbstractPreviewBlock = elf().Class({
	_type: 'blockpreviewer',

	tplContent: '<div class="content">#{content}</div>',

	tplControl: '<div class="control"><div class="bottom"></div><p class="operation">' +
		'<button type="button" class="btn btn-default btn-xs" rel="add">添加新模块</button>' +
		'<button type="button" class="btn btn-default btn-xs" rel="remove">移除</button>' +
		'</p></div>',

	constructor: function (options) {
		esui.Control.call(this, options);
	},

	render: function () {
		var rendered = this._isRendered;

		var main = elf(this.main).html(this.createHTML())
			.toggleClass('fixed', !!this.fixed);
		if (!rendered) {
			esui.Control.prototype.render.call(this);
			!this.fixed && main.attr('draggable', true);
			main.addClass(mpe.AbstractPreviewBlock.prototype.__getClass())
				.on('click', this.edit.bind(this), '.bottom');
			if (!this.fixed) {
				main.on('click', this.remove.bind(this), 'button[rel=remove]');
			}
		}
	},

	createHTML: function () {
		return elf().template(this.tplContent, this.getData()) + this.tplControl;
	},

	getData: function () {
		return this.datasource || this.constructor.defaults || {};
	},

	setData: function (data) {
		this.datasource = data;
	},

	edit: function (ev) {
		var editor = esui.get(this.editor);
		if (editor) {
			editor.show(this);
		}
	},

	update: function (data) {
		this.setData(data);
		elf(this.main).html(this.createHTML());
	},

	remove: function (ev) {
		var editor = esui.get(this.editor);
		if (editor) {
			editor.hide();
		}
		this.dispose();
	},

	__dispose: function () {
		var main = this.main;
		esui.Control.prototype.__dispose.call(this);
		elf(main).un('click').remove();
		main = null;
	}
}, esui.Control);



mpe.MetaPreviewer = elf().Class({
	_type: 'metapreviewer',

	editor: 'MPEMetaEditor',

	fixed: true,

	tplContent: '<div class="content"><h1>#{title}</h1></div>',

	constructor: function (options) {
		mpe.AbstractPreviewBlock.call(this, options);
	}
}, mpe.AbstractPreviewBlock);

mpe.MetaPreviewer.defaults = {
	title: '页面标题',
	bgcolor: '#eeeeee'
};

esui.util.register('MPEMetaPreviewer', mpe.MetaPreviewer);



mpe.HeadingPreviewer = elf().Class({
	_type: 'headingpreviewer',

	editor: 'MPEHeadingEditor',

	tplContent: '<header class="content" style="text-align:#{alignment};background-color:#{bgcolor}"><h2>#{title}</h2><p>#{subtitle}</p></header>',

	constructor: function (options) {
		mpe.AbstractPreviewBlock.call(this, options);
	}
}, mpe.AbstractPreviewBlock);

mpe.HeadingPreviewer.defaults = {
	title: '标题',
	subtitle: '副标题',
	alignment: 'left',
	bgcolor: '#eeeeee'
};

esui.util.register('MPEHeadingPreviewer', mpe.HeadingPreviewer);



mpe.RichTextPreviewer = elf().Class({
	_type: 'richtextpreviewer',

	editor: 'MPERichTextEditor',

	tplContent: '<article class="content">#{content}</article>',

	constructor: function (options) {
		mpe.AbstractPreviewBlock.call(this, options);
	}
}, mpe.AbstractPreviewBlock);

mpe.RichTextPreviewer.defaults = {
	content: '<p>富文本内容</p>',
	bgcolor: '#eeeeee'
};

esui.util.register('MPERichTextPreviewer', mpe.RichTextPreviewer);



mpe.ImageGroupPreviewer = elf().Class({
	_type: 'imagegrouppreviewer',

	editor: 'MPEImageGroupEditor',

	tplContent: '<ul class="content #{0}">#{1}</ul>',

	tplItem: '<li><figure><a href="#{link}"><img src="#{image}" /><figcaption>#{title}</figcaption></a></figure></li>',

	constructor: function (options) {
		mpe.AbstractPreviewBlock.call(this, options);
	},

	createHTML: function () {
		var data = this.getData();
		return elf().template(this.tplContent, data.style || 'full', data.images.map(function (item) {
			return elf().template(this.tplItem, item);
		}, this).join('')) + this.tplControl;
	}
}, mpe.AbstractPreviewBlock);

mpe.ImageGroupPreviewer.defaults = {
	style: 'full',
	images: []
};

esui.util.register('MPEImageGroupPreviewer', mpe.ImageGroupPreviewer);



mpe.LinkGroupPreviewer = elf().Class({
	_type: 'linkgrouppreviewer',

	editor: 'MPELinkGroupEditor',

	tplContent: '<ul class="content">#{0}</ul>',

	tplItem: '<li><a href="#{link}">#{title}</a></li>',

	constructor: function (options) {
		this.datasource = [];
		mpe.AbstractPreviewBlock.call(this, options);
	},

	createHTML: function () {
		return elf().template(this.tplContent, this.datasource.map(function (item) {
			return elf().template(this.tplItem, item);
		}, this).join('')) + this.tplControl;
	}
}, mpe.AbstractPreviewBlock);

esui.util.register('MPELinkGroupPreviewer', mpe.LinkGroupPreviewer);



mpe.BlockEditor = elf().Class({
	_type: 'blockeditor',

	constructor: function (options) {
		this.data = {};

		esui.Control.call(this, options);
	},

	render: function () {
		var me = this;

		var rendered = this._isRendered;

		if (!rendered) {
			esui.FieldSet.prototype.render.call(this);

			this._changehandler = this._getChangeHandler();
		}

		setTimeout(function () {
			me.forEachField(function (field) {
				field.onchange = this._changehandler;
			}, me);
		}, 0);
	},

	show: function (editing) {
		var at = editing.main;
		var data = editing.getData();
		this.editing = editing;

		var group = this.getGroup();
		group && group.closeAll();

		this.setData(data);

		elf(at).addClass('editing').siblings().removeClass('editing');

		var pos = elf(at).getPosition(at.offsetParent);
		elf(this.main).addClass('active').css({
			left: 0,
			top: pos.y + 'px'
		});
	},

	hide: function () {
		elf(this.main).removeClass('active');
	},

	getGroup: function () {
		return this.group ? esui.get(this.group) : null;
	},

	_getChangeHandler: function () {
		var me = this;
		return function () {
			me.editing && me.editing.update(me.getData());
		};
	}
}, esui.FieldSet);

esui.util.register('MPEBlockEditor', mpe.BlockEditor);



mpe.ImageGroupEditor = elf().Class({
	_type: 'imagegroupeditor',

	tplItem: '<figure ui="type:MPEImagePicker; name:image;" style="background-image:url(#{image});"></figure>' +
		'<p><label>标题：</label><input type="text" name="title" value="#{title}" ui="type:TextInput;" /></p>' +
		'<p><label>链接：</label><input type="text" name="link" value="#{link}" ui="type:MPELinkPicker;" /></p>' +
		'<button type="button" class="icon-button" rel="delete"><i class="fa fa-times"></i></button>',

	constructor: function (options) {
		mpe.BlockEditor.call(this, options);
		this.datasource = {};
	},

	setData: function (data) {
		this.datasource = data;
		mpe.BlockEditor.prototype.setData.call(this, data);
		this.render();
	},

	getData: function () {
		var data = mpe.BlockEditor.prototype.getData.call(this);
		return {
			style: data.style,
			images: data.image instanceof Array && data.image.length ?
				data.image.map(function (item, i) {
					return {
						image: item,
						title: data.title[i],
						link: data.link[i]
					};
				}) :
				[{
					image: data.image,
					title: data.title,
					link: data.link
				}]
		};
	},

	render: function () {
		this.clear();

		var rendered = this._isRendered;

		var list = elf('ul', this.main);
		list.html(this.createGroupHTML());
		elf(esui.init, esui, this.main);

		mpe.BlockEditor.prototype.render.call(this);

		if (!rendered) {
			elf(this.main).addClass(mpe.BlockEditor.prototype.__getClass());
			elf('>p.operation button[rel=add]', this.main).on('click', this.addItem.bind(this));
		}
	},

	createGroupHTML: function () {
		return (this.datasource.images || []).map(function (item) {
			return '<li>' + elf().template(this.tplItem, item) + '</li>';
		}, this).join('');
	},

	addItem: function (ev) {
		elf.dom.Node.create('li', {}).html(elf().template(this.tplItem)).appendTo(elf('ul', this.main));
		esui.init(this.main);

		mpe.BlockEditor.prototype.render.call(this);
	},

	clear: function () {
		var list = elf('ul', this.main);
		var group  = esui.util.getControlsByContainer(list[0]);
		while (group.length) {
			var image = group.pop();
			image.dispose();
			image = null;
		}
		list.html('');
	}
}, mpe.BlockEditor);

esui.util.register('MPEImageGroupEditor', mpe.ImageGroupEditor);



mpe.LinkGroupEditor = elf().Class({
	_type: 'linkgroupeditor',

	tplItem: '<p class="form-group"><label>标题：</label><input type="text" name="title" value="#{title}" ui="type:TextInput;" /></p>' +
		'<p class="form-group"><label>链接：</label><input type="text" name="link" value="#{link}" ui="type:MPELinkPicker;" /></p>' +
		'<button type="button" class="icon-button" rel="delete"><i class="fa fa-times"></i></button>',

	constructor: function (options) {
		this.datasource = [];
		mpe.BlockEditor.call(this, options);
	},

	setData: function (data) {
		this.datasource = data;
		mpe.BlockEditor.prototype.setData.call(this, data);
		this.render();
	},

	getData: function () {
		var data = mpe.BlockEditor.prototype.getData.call(this);
		return data.link instanceof Array && data.link.length ?
			data.link.map(function (item, i) {
				return {
					link: item,
					title: data.title[i]
				};
			}) :
			[{
				link: data.link,
				title: data.title
			}];
	},

	render: function () {
		this.clear();

		var rendered = this._isRendered;

		var list = elf('ul', this.main);
		list.html(this.createGroupHTML());
		elf(esui.init, esui, this.main);

		mpe.BlockEditor.prototype.render.call(this);

		if (!rendered) {
			elf(this.main).addClass(mpe.BlockEditor.prototype.__getClass());
			elf('>p.operation button[rel=add]', this.main).on('click', this.addItem.bind(this));
		}
	},

	createGroupHTML: function () {
		return (this.datasource || []).map(function (item) {
			return '<li>' + elf().template(this.tplItem, item) + '</li>';
		}, this).join('');
	},

	addItem: function (ev) {
		elf.dom.Node.create('li', {}).html(elf().template(this.tplItem)).appendTo(elf('ul', this.main));
		esui.init(this.main);

		mpe.BlockEditor.prototype.render.call(this);
	},

	clear: function () {
		var list = elf('ul', this.main);
		var group  = esui.util.getControlsByContainer(list[0]);
		while (group.length) {
			var image = group.pop();
			image.dispose();
			image = null;
		}
		list.html('');
	}
}, mpe.BlockEditor);

esui.util.register('MPELinkGroupEditor', mpe.LinkGroupEditor);
