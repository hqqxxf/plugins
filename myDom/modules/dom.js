/**
 * Created by Administrator on 2015/10/12.
 */
define([
    'modules/util'
], function(util){
    function DomList(list){
        this.origin = list;
        this.length = list.length;
        for(var i = 0; i < list.length; i++){
            this[i] = list[i];
        }
    }
    function Node(node){
        this.origin = node;
    }
    var typeOfNode = util.getType(new Node(document)),
        typeOfDomlist = util.getType(new DomList([]));
    DomList.prototype.each = function(callback){
        var length = this.origin ? this.origin.length : 0,
            i = 0;
        for(i = 0; i < length; i++){
            callback.call(util.getType(this.origin[i]) == typeOfNode ? this.origin[i] : new Node(this.origin[i]), i);
        }
    };
    DomList.prototype.getByIndex =  function(index){
        var item = this.origin[index];
        if(util.getType(item) == typeOfDomlist){
            return item;
        }else{
            return new DomList([item]);
        }
    };
    var NodePrototype = {
        getBody: function(){
            return new Node(document.body);
        },
        getHead: function(){
            return new Node(document.querySelector('head'));
        },
        wrap: function(node){
            return util.getType(node) != typeOfNode ? new Node(node) : node;
        },
        getClientRect: function(){
            var origRect = this.origin.getBoundingClientRect(),
                rect = {};
            for(var prop in origRect){
                rect[prop] = origRect[prop];
            }
            return rect;
        },
        getAbsolutePosition: function(rect){
            if(!rect){
                rect = {
                    width: this.origin.offsetWidth,
                    height: this.origin.offsetHeight,
                    top: this.origin.offsetTop,
                    left: this.origin.offsetLeft
                }
            }else{
                rect.top += this.origin.offsetTop;
                rect.left += this.origin.offsetLeft;
            }
            if(this.origin.offsetParent){
                return this.wrap(this.origin.offsetParent).getAbsolutePosition(rect);
            }else{
                return rect;
            }
        },
        getNodeName: function(){
            return this.origin.nodeName.toLowerCase();
        },
        /*插入子元素*/
        append: function(node){
            if(util.getType(node) == 'String'){
                this.origin.insertAdjacentHTML('afterbegin', node);
            }else{
                node = util.getType(node) == typeOfNode ? node.origin : node;
                this.origin.appendChild(node);
            }
            return this;
        },
        empty: function(){
            var i = 0,
                length = this.origin.childNodes.length;
            for(i; i < length; i++){
                this.origin.removeChild(this.origin.childNodes[0]);
            }
            return this;
        },
        /*查询单个元素*/
        find: function(selector){
            var node = this.origin.querySelector(selector);
            return node ? new Node(node) : null;
        },
        /*查询多个元素*/
        query: function(selector){
            /*
            * 'div:eq(0)>div:eq(0)'.split(/:eq\(\d+\)/)
            * */
            var indexArr = selector.match(/:eq\(\d+\)/g);
            if(indexArr){
                var selectorArr = selector.split(/:eq\(\d+\)/),
                    resultDom = null;
                for(var i = 0; i < selectorArr.length; i++){
                    var item = selectorArr[i];
                    if(/^>/.test(item)){
                        item = item.replace(/^>/, '');
                    }
                    if(resultDom){
                        if(i < selectorArr.length - 1){
                            resultDom = resultDom.query(item).getByIndex(indexArr[i].match(/\d+/)[0]);
                        }else if(item){
                            resultDom = resultDom.query(item);
                        }else{
                            return resultDom;
                        }
                    }else{
                        resultDom = this.query(item).getByIndex(indexArr[i].match(/\d+/)[0]);
                    }
                }
                return resultDom;
            }else{
                return new DomList(this.origin.querySelectorAll(selector));
            }
        },
        siblings: function(selector){
            selector = selector || this.getSelector();
            var list = this.parent().query(selector),
                resultList = [],
                that = this;
            list.each(function(){
                if(!this.is(that)){
                    resultList.push(this);
                }
            });
            return new DomList(resultList);
        },
        remove: function(){
            this.origin.parentNode.removeChild(this.origin);
            return this;
        },
        contains: function(node){
            if(util.getType(node) == typeOfNode){
                node = node.toString();
            }else if(node instanceof HTMLElement){
                node = (new Node(node)).toString();
            }else{
                node = node.toString();
            }
            return this.toString().indexOf(node) > -1 ? true : false;
        },
        toString: function(){
            var container = document.createElement('div');
            container.appendChild(this.origin.cloneNode(true));
            return container.innerHTML;
        },
        html: function(htm){
            var container = document.createElement('div');
            container.innerHTML = htm;
            for(var i = 0; i < container.childNodes.length; i++){
                this.append(new Node(container.childNodes[i]));
            }
            return this;
        },
        bind: function(type, handler, flag){
            var origin = this.origin,
                that = this;
            if(origin.addEventListener){
                origin.addEventListener(type, function(event){
                    handler.call(that, event || window.event)
                }, flag || false);
            }else if(this.attachEvent){
                origin.attachEvent("on"+type, function(event){
                    handler.call(that, event || window.event)
                });
            }else{
                origin["on" + type] = function(event){
                    handler.call(that, event || window.event)
                };
            }
            return this;
        },
        unbind: function(type, handler, flag){
            var origin = this.origin,
                that = this;
            if(origin.removeEventListener){
                origin.removeEventListener(type, function(event){
                    handler.call(that, event || window.event)
                }, flag || false);
            }else if(origin.detachEvent){
                origin.detachEvent("on" + type, handler);
            }else{
                origin["on" + type] = null;
            }
            return this;
        },
        click: function(callback){
            var that = this;
            this.bind('click', function(event){
                callback.call(that, event || window.event);
            });
            return this;
        },
        attr: function(key, value){
            if(value !== undefined){
                this.origin.setAttribute(key, value);
                return this;
            }else{
                return this.origin.getAttribute(key);
            }
        },
        addClass: function(clazz){
            clazz = clazz.toString().toLowerCase();
            var nowClass = this.attr('class') ? this.attr('class').replace(/\s{0,}/, ' ') : '',
                reg = new RegExp('\\b' + clazz + '\\b');
            nowClass = nowClass.replace(reg, '');
            this.attr('class', (nowClass + ' ' + clazz).trim().replace(/\s{1,}/g, ' '));
            return this;
        },
        removeClass: function(clazz){
            var reg = new RegExp('\\b(' + clazz + ')\\b', 'g');
            clazz = clazz.toString().toLowerCase();
            var nowClass = this.attr('class').replace(/\s{1,}/g, ' '),
                reg = new RegExp('\\b(' + clazz + ')\\b', 'g');
            this.attr('class', nowClass.replace(reg, '').trim());
            return this;
        },
        css: function(style, value){
            if(util.isObject(style) || value){
                if(!util.isObject(style)){
                    var param = {};
                    param[style] = value;
                    style = param;
                }
                for(var prop in style){
                    var unit =  '';
                    if((
                        !/\D/.test(style[prop])
                        || (style[prop].toString().match(/\D/g).length == 1 && style[prop].toString().match(/\D/g)[0] == '.')
                        )
                        && prop.toString().toLowerCase() != 'zindex'){//如果不是纯数字，并且style不是zindex
                        unit = 'px';
                    }
                    var matchArr = prop.match(/[A-Z]/g),
                        name = prop.split(/[A-Z]/)[0];
                    for(var i = 0; matchArr && i < matchArr.length; i++){
                        name += '-' + matchArr[i].toLowerCase() + prop.split(/[A-Z]/)[i + 1];
                    }
                    this.origin.style[name] = style[prop] + unit;
                }
                return this;
            }else{
                return window.getComputedStyle(this.origin)[style];
            }
        },
        show: function(){
            this.css('display', 'block');
        },
        hide: function(){
            this.css('display', 'none');
        },
        focus: function(){
            var scrollTop = 0,
                scrollElement = document.body;
            if(document.documentElement && document.documentElement.scrollTop){
                scrollTop=document.documentElement.scrollTop;
                scrollElement = document.documentElement;
            }else if(document.body){
                scrollTop=document.body.scrollTop;
            }
            this.origin.tabIndex = -1;
            this.origin.focus();
            scrollElement['scrollTop'] = scrollTop;
            return this;
        },
        text: function(value){
            if(value){
                this.origin.innerHTML = value.xssEncode();
                return this;
            }else{
                return this.origin.innerHTML.toString().replace(/(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))/g, '').trim();
            }
        },
        is: function(selector){
            try{
                if(util.getType(selector) == typeOfNode){
                    return this.toString() == selector.toString();
                }else if(selector instanceof HTMLElement){
                    return this.toString() == (new Node(selector)).toString();
                }else{
                    var div = document.createDocumentFragment();
                    div.appendChild(this.origin.cloneNode(false));
                    return div.querySelector(selector) ? true : false;
                }
            }catch(error){
                return false;
            }
        },
        val: function(value){
            if(value != null && value != undefined){
                this.origin.value = value;
                return this;
            }else{
                return this.origin.value;
            }
        },
        check: function(status){
            if(status != null && status != undefined){
                this.origin.checked = status ? true : false;
            }else{
                return this.origin.checked;
            }
        },
        parent: function(){
            var parent = this.origin.parentNode;
            return this.wrap(parent);
        },
        parents: function(selector){
            if(this.parent().is(selector)){
                return this.parent();
            }else{
                return this.parent().parents(selector);
            }
        },
        childs: function(selector){
            return this.query(selector ? selector : '*');
        },
        indexOfParent: function(selector){
            var self = this;
            var indexValue = 0;

            this.wrap(document).query(this.parent().getUniqueSelector() + '>' + selector).each(function(index){
                if(self.is(this)){
                    indexValue = index;
                    return;
                }
            });
            return indexValue;
        },
        /*生成css选择器*/
        getSelector: function(unique){
            var selector = '';
            if(this.attr('id')){
                selector = '#' + this.attr('id');
            }else{
                var tagName = this.getNodeName();
                var classes = this.attr('class');
                if(classes){
                    classes = classes.replace('zhuge_checked_node', '').trim()
                        .replace(/\s+/g, ' ').trim().split(/\s{1}/).join('.');
                }
                classes = classes ? ('.' + classes) : '';
                selector = tagName + classes;
            }
            if(unique && this.wrap(document).query(selector).length > 1){
                selector = selector + ':eq(' + this.indexOfParent(selector) + ')';
            }
            return selector;
        },
        /*获取唯一css选择器*/
        getUniqueSelector: function(selector, origin){
            var selfSelector = this.getSelector(true);
            var flag = /:eq\(\d+\)/.test(selfSelector);//如果当前元素选择器唯一，则返回
            if(selector){
                selfSelector += '>' + selector;
            }
            /*如果查询结果为单一元素，则返回结果，否则继续查询父级元素*/
            var doc = this.wrap(document);
            if(!this.is('body')
                && flag
            ){
                return this.parent().getUniqueSelector(selfSelector, origin ? origin : this);
            }else{
                return selfSelector;
            }
        },
        getSameSelector: function(selector, origin){
            var selfSelector = this.getSelector(false);
            var doc = this.wrap(document);
            var flag = doc.query(selfSelector).length < 2;//如果当前元素选择器唯一，则返回
            if(selector){
                selfSelector += '>' + selector;
            }
            /*如果查询结果为单一元素，则返回结果，否则继续查询父级元素*/
            if(!flag){
                return this.parent().getSameSelector(selfSelector, origin ? origin : this);
            }else{
                return selfSelector;
            }
        },
        width: function(){
            return this.origin.clientWidth;
        },
        height: function(){
            return this.origin.clientHeight;
        }
    };
    for(var prop in NodePrototype){
        Node.prototype[prop] = NodePrototype[prop];
    }
    var methods2NodeList = 'append,empty,query,remove,bind,unbind,click,show,hide,attr,addClass,removeClass,css,text,is';
    for(var i = 0; i < methods2NodeList.split(',').length; i++){
        var method = methods2NodeList.split(',')[i];
        (function(ele){
            DomList.prototype[ele] = function(){
                var param = Array.prototype.slice.call(arguments),
                    resultArr = [];
                this.each(function(){
                    var res = this[ele].apply(this, param);
                    if(util.getType(res) == typeOfDomlist){
                        res.each(function(){
                            resultArr.push(this);
                        });
                    }else{
                        resultArr.push(res);
                    }
                });
                return new DomList(resultArr);
            }
        })(method);
    }
    return new Node(document);
});