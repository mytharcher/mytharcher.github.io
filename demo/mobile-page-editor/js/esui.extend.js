elf.util.Class.implement(esui.Control, {
	__getSegmentByClass: function (cls) {
		return elf.dom.Selector.queryAll('.' + this.__getClass(cls), this.main);
	},

	insert: function (wrap, position) {
        wrap = wrap || document.body;
        elf(wrap).insert( this.main, position || null );
        this.render();
	}
});


esui.Button.prototype.__createMain = function () {
	return document.createElement('button');
};

esui.Layer.prototype._HIDE_POS = '-100%';

esui.Dialog.TOP = 0;
esui.Dialog.WIDTH = 700;



/**
 * 多个输入验证规则类
 * 
 * @class
 * @param {Object} options 参数
 */
esui.validator.GroupPatternRule = function( options ) {
	esui.lib.extend(this, options);
};

esui.validator.GroupPatternRule.prototype = {
	errorMessage : "${title}不符合规则",

	getName: function () {
		return 'grouppattern';
	},
	
	check: function ( value, control ) {
		var items = value.split(this.separator || ',');
		var valid = true;
		var checker = esui.validator.PatternRule.prototype.check;
		for (var i = items.length - 1; i >= 0; i--) {
			valid = checker.call(this, items[i], control);
			if (!valid) {
				break;
			}
		}
		return valid;
	}
};

esui.lib.inherits( esui.validator.GroupPatternRule, esui.validator.Rule );
esui.validator.Rule.register( 'grouppattern', esui.validator.GroupPatternRule );



esui.InputControl.prototype.render = function () {
	this.name = this.name || this.main.getAttribute( 'name' );
	esui.Control.prototype.render.call( this );
};

esui.Select.EMPTY_TEXT = '请选择';

(function (origin) {
	esui.Select.prototype.render = function () {
		var renderer = this._isRendered;

		origin.call(this);

		if (!renderer) {
			this._inputId = esui.util.getGUID();
			var input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.id = this._inputId;
			input.name = this.name;
			this.main.appendChild(input);
			input = null;
		}
	};
})(esui.Select.prototype.render);

(function (origin) {
	esui.Select.prototype.setSelectedIndex = function (index, opt_isDispatch) {
		var selected = this.datasource[index];
		var value = selected ? selected[this.valueName] : null;
		var _inputId = this._inputId;
		// setTimeout(function () {});
		var input = esui.lib.g(_inputId); input && (input.value = value);

		origin.call(this, index, opt_isDispatch);
	};
})(esui.Select.prototype.setSelectedIndex);



esui.Pager.PREV_TEXT = '&lt;';
esui.Pager.NEXT_TEXT = '&gt;';




elf().copy({
	__getClickHandler: function () {
		var me = this;
		return function ( ev ) {
			if ( !me.isDisabled() && me.onclick( ev ) !== false ) {
				me.onchange();
			} else {
				ev.preventDefault();
			}
		};
	},

	onchange: new Function()
}, esui.BoxControl.prototype);



esui.Editor = elf().Class({
	_type: 'editor',

	constructor: function (options) {
		esui.InputControl.call(this, options);

		this.value = this.main.innerHTML;
	},

	render: function () {
		var rendered = this._isRendered;
		
		esui.InputControl.prototype.render.call(this);

		if (!rendered) {

			var textarea = elf.dom.Operation.create('textarea', {
				id: this.textId = this.__getId('textarea'),
				style: 'width:100%; height:100%;'
			});
			this.main.appendChild(textarea);

			this.engine.setup.call(this);
		}

		this.setValue(this.value);
	},

	_getChangeHandler: function () {
		var me = this;
		return function (ev) {
			me.onchange();
		};
	},

	onchange: new Function(),

	engine: {
		get: function () {
			var id;
			switch(true) {
			case !!window.UE:
				id = 'UEDITOR';
				break;
			case !!window.CKEDITOR:
				id = 'CKEDITOR';
				break;
			}
			return id;
		},

		setup: function () {
			var engine = this.engines[this.engine.get()];
			engine.setup.call(this);

			this.setValue = engine.setValue;
			this.getValue = engine.getValue;
		}
	},

	engines: {
		UEDITOR: {
			setup: function () {
				UE.getEditor(this.textId).addListener('contentChange', this._getChangeHandler());
			},

			setValue: function (value) {
				var editor = UE.getEditor(this.textId);
				editor.ready(function () {
					editor.setContent(value);
				});
			},

			getValue: function () {
				return UE.getEditor(this.textId).getContent();
			}
		},

		CKEDITOR: {
			setup: function () {
				CKEDITOR.replace(this.textId);
			},

			setValue: function (value) {
				CKEDITOR.instances[this.textId].setData(value);
			},

			getValue: function () {
				return CKEDITOR.instances[this.textId].getData();
			}
		}
	}
}, esui.InputControl);



esui.FieldSet = elf().Class({
	constructor: function (options) {
		esui.Control.call(this, options);
	},

	render: function () {
		var me = this;
		
		me.datasource && setTimeout(function () {
			me.setData(me.datasource);
		}, 0);
		
		// 设置disabled
		me.setDisabled( me.disabled );
		
		esui.Control.prototype.render.call(me);
	},
	
	/**
	 * 循环迭代器
	 * @param {Function} fn
	 * @param {Object} scope
	 * @param {Any...}
	 */
	forEachField: function (fn, scope) {
		var args = Array.prototype.slice.call(arguments, 2),
			fields = esui.util.getControlsByContainer(this.main),
			scope = scope || this;
		
		for (var i = 0, len = fields.length; i < len; i++) {
			var field = fields[i];
			if (field instanceof esui.InputControl) {
				if (fn.apply(scope, [field].concat(args)) === false) {
					break;
				}
			}
		}
	},
	
	/**
	 * 验证表单
	 * @protected
	 * 
	 * @param {boolean} justCheck 是否仅验证
	 * @param {Boolean} all 是否要验证完全部才停止，默认：false
	 * 
	 * @return {boolean} 是否验证通过
	 */
	__validate: function ( justCheck , all) {
		this._valid = true;
		this.forEachField(this._validateIterator, this, justCheck, all);
		return this._valid;
	},
	
	/**
	 * 验证表单单个域的迭代器
	 * @private
	 * 
	 * @param {esui.InputControl} field
	 * @param {Boolean} justCheck
	 * @param {Boolean} all
	 */
	_validateIterator: function (field, justCheck, all) {
		if (field.isDisabled()) {
			return;
		}
		var me = this,
			originInvalidHandler = field.oninvalid;
		field.oninvalid = function (validity) {
			originInvalidHandler.call(field, validity);
			me.onfieldinvalid(field, validity);
		};
		var v = field.__validate(justCheck);
		field.oninvalid = originInvalidHandler;
		if (!v) {
			this._valid = false;
			if (!all) {
				return false;
			}
		}
	},
	
	
	
	/**
	 * 验证控件，仅返回是否验证通过
	 * 
	 * @public
	 * 
	 * @param {Boolean} all 是否要验证完全部才停止，默认：false
	 * 
	 * @return {boolean} 是否验证通过
	 */
	checkValidity: function ( all ) {
		return this.__validate( true , all );
	},
	
	/**
	 * 验证控件，当值不合法时显示错误信息
	 * 
	 * @public
	 * 
	 * @param {Boolean} all 是否要验证完全部才停止，默认：false
	 * 
	 * @return {boolean} 是否验证通过
	 */
	validate: function (all) {
		return this.__validate( false , all );
	},
	/**
	 * 预填表单值
	 * @param {Object} data
	 * @param {Object} filterMap 特殊处理过滤器表
	 */
	setData: function (data, filterMap) {
		this.forEachField(this.setFieldData, this, data, filterMap);
	},
	
	/**
	 * 预填每个域的值
	 * @param {Object} data
	 * @param {Object} filterMap 特殊处理过滤器表
	 */
	setFieldData: function (field, data, filterMap) {
		var dataItem = data[field.name];
		
		if (typeof dataItem != 'undefined') {
			var filter;
			if (filterMap && typeof (filter = filterMap[field.name]) == 'function') {
				filter.call(field, data);
			} else {
				if (field instanceof esui.BoxControl) {
					field.getGroup().selectByValues(dataItem.toString().split(','));
				} else {
					field.setValue(dataItem);
				}
			}
		}
	},
	
	/**
	 * 获取表单中的数据
	 * 
	 * @return {Object}
	 */
	getData: function () {
		var data = {};
		this.forEachField(this.getFieldData, this, data);
		Object.keys(data).forEach(function (item) {
			if (data[item] instanceof Array && data[item].length == 1) {
				data[item] = data[item][0];
			}
		});
		return data;
	},
	
	/**
	 * @private
	 * 获取每个field数据的迭代器
	 * 
	 * @param {esui.InputControl} field
	 * @param {Object} ret
	 */
	getFieldData: function (field, ret) {
		if (!field.isDisabled()) {
			var name = field.name;
			if (name) {
				if (!ret[name]) {
					ret[name] = [];
				}
				if (!(field instanceof esui.BoxControl) || field.isChecked()) {
					ret[name].push(field.getValue());
				}
			}
		}
	}
}, esui.Control);
