/**
 * Created by Administrator on 2015/10/12.
 */
define([

], function(){
    if(!String.prototype.trim){
        String.prototype.trim = function(){
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    }
    /*${}类型的字符替换*/
    String.prototype.customReplace = function(from, to, type){
        from = from.toString();
        var reg = (type && (type=="g" || type=="i" || type =="m"))?new RegExp("\\${"+from+"}",type):new RegExp("\\${"+from+"}");
        var str = this.toString().replace(reg, to);
        return str;
    };
    /*填充页面内容时屏蔽代码注入*/
    String.prototype.xssEncode = function(){
        return this.replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    Event.prototype.zg_preventDefault = function (){
        if(this.preventDefault)this.preventDefault();
        if(this.stopPropagation)this.stopPropagation();
        if(this.returnValue)this.returnValue = false;
        if(this.cancelBubble) this.cancelBubble = true;
        return false;
    };
    var util = {
        isObject: function(ele){
            return Object.prototype.toString.call(ele) == '[object Object]';
        },
        isArray: function(ele){
            return Object.prototype.toString.call(ele) == '[object Array]';
        },
        getType: function(ele){
            if(ele === undefined)return 'undefined';
            if(ele === null)return 'null';
            var type = Object.prototype.toString.call(ele).match(/[A-Z][a-zA-Z]*/)[0];
            var consName = ele.constructor.name;
            try{
                var constructorName = ele.constructor.toString().match(/[fF]unction (\S+)\(/)[1];
            }catch(error){
                var constructorName = ele.constructor.name;
            }


            return type.toLowerCase() == 'object' ? (consName || constructorName) : type;
        },
        getWheelEventName: function(){
            return "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                    "DOMMouseScroll";// let's assume that remaining browsers are older Firefox
        },
        getHrefData: function(){
            var searchParam = decodeURIComponent(location.search).replace(/\?/, '').split('&'),
                hrefdata = {};
            for(var i = 0; i < searchParam.length; i++){
                hrefdata[searchParam[i].split('=')[0]] = searchParam[i].split('=')[1];
            }
            return hrefdata;
        },
        log: function(){
            if(window.console && window.openLog){
                var array = [],
                    item = null;
                for(item in arguments){
                    array.push(arguments[item]);
                }
                console.info.apply(console, array);
            }
        },
        /*对象克隆*/
        clone: function(obj){
            if(this.isArray(obj)){
                var arr = [];
                for(var i = 0; i < obj.length; i++){
                    arr.push(this.clone(obj[i]));
                }
                return arr;
            }
            if(!this.isObject(obj)) return obj;
            if(obj == null) return obj;
            var myNewObj = new Object();
            for(var i in obj){
                myNewObj[i] = this.clone(obj[i]);
            }
            return myNewObj;
        },
        /*对象合并*/
        mergeObject: function(a, b){
            for(var prop in a){
                if(this.isObject(a[prop])){
                    b[prop] = b[prop] ? b[prop] : {};
                    this.mergeObject(a[prop], b[prop]);
                }else if(this.isArray(a[prop])){
                    b[prop] = this.isArray(b[prop]) ? b[prop] : a[prop];
                }else{
                    b[prop] = (b[prop] === null || b[prop] === undefined) ? a[prop] : b[prop];
                }
            }
            return this.clone(b);
        },
        getXhrObj: function(){
            var xmlhttp;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xmlhttp;
        },
        serializeParam: function(obj){
            var param = [];
            for(var prop in obj){
                param.push(encodeURIComponent(prop) + '=' + encodeURIComponent(this.getType(obj[prop]) != 'String' ? JSON.stringify(obj[prop]) : obj[prop]));
            }
            return param.join('&');
        },
        ajax: function(options){
            var defaults = {
                    url: '',
                    type: 'POST',
                    data: {},
                    username: '',
                    password: '',
                    success: function(){},
                    error: function(){}
                },
                opts = this.mergeObject(defaults, options),
                xhr = this.getXhrObj();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE ) {
                    if(xhr.status >= 200 && xhr.status <= 299){
                        try{
                            opts.success.call(xhr, JSON.parse(xhr.responseText));
                        }catch(error){
                            opts.success.call(xhr, xhr.responseText);
                        }

                    }else {
                        opts.error.call(xhr);
                    }
                }
            };
            xhr.onerror = opts.error;
            switch(opts.type){
                case 'get':
                case 'delete':
                    opts.url += '?' + this.serializeParam(opts.data);
                    xhr.open(opts.type, opts.url, true);
                    xhr.send();
                    break;
                case 'post':
                    xhr.open(opts.type, opts.url, true);
                    var param = this.serializeParam(opts.data);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send(param);
                    break;
            }

            return xhr;
        }
    };
    return util;
});