/**
 * Created by Administrator on 2015/8/2.
 */
(function($){
    $.fn.multiSelectList = function(options){
        var defaults = {
                data : [],
                fieldName : "",//用于显示的值
                editable : false,
                width : 170,
                placeHolder : '选择',
                showArrow : true,
                classes : '',
                enable : true
            },
            opts = $.extend(defaults,options),
            randomId = lex.uuid(),
            that = this,
            search = '#searchSelect_' + randomId;
        //初始化
        function init(){
            for(var i=0; i<opts.data.length; i++){
                opts.data[i].parentId = 'select';
                structure(opts.data[i]);//结构化json
            }
            template();
            if(!opts.enable)return;
            eventBind();
        }
        //迭代为json中的每一个添加一个parentId
        function structure(parent){
            if(parent && parent.child && parent.child.length){
                for(var i=0; i<parent.child.length; i++){
                    parent.child[i].parentId = parent.parentId + "_" + parent.id;
                    structure(parent.child[i]);
                }
            }
        }
        //模板
        function template(){
            var htmTemplate = '<div id="searchSelect_${id}" class="zhuge_selcet_sx ${class}" style="width: ${width}px;">' +
                '   <input id="searchSelectText_${id}" type="text" value="" ${editable} class="zhuge_selecttitle zhuge_input ${showArrow}" placeholder="${placeHolder}">' +
                '</div>';
            $(that).empty().append(htmTemplate.customReplace("id",randomId, 'g')
                .customReplace("qianzhui",opts.data[0].parentId)
                .customReplace('editable', opts.editable ? '' : 'readonly')
                .customReplace('class', opts.classes)
                .customReplace("showArrow", opts.showArrow ? 'icon_select_gray' : '')//显示下拉箭头
                .customReplace('width', opts.width, 'g')
                .customReplace('placeHolder', opts.placeHolder));
            $('#searchSelectText_' + randomId).data('data',{parentId : opts.data[0].parentId, id : '',child : opts.data});
        }
        //点其他部分隐藏下拉菜单
        function clearBind(event){
            var target = $(event.target);
            if(!(target.is(search)
                || target.parents(search).length)){
                $(search + " ul[id^='" + opts.data[0].parentId + "']").hide();
            }
        }
        //事件绑定
        function eventBind(){
            $(window).scroll(clearBind);
            $('body').mousedown(clearBind);
            if(!$(search).data('alreadyBind')){
                $(search).delegate('input:text','click', {type : "click"},eachLiClick);
                $(search).data('alreadyBind',true);
            }
        }
        //每个li的click事件
        function eachLiClick(event){
            var item = $(this).data('data');
            $(search + ' ul[id^=' + item.parentId + '_]').hide();
            $(search + ' ul[id^=' + item.parentId + ']').find('li').removeClass('active');
            $(this).addClass('active');
            if(!item)return;
            var ulId = (item.name) ? item.parentId + '_' + item.id : item.parentId ,
                ulID = search + ' #' + ulId;
            if(item.child && item.child.length){
                if(!$(this).data('haveAddchild')){
                    var ul = '<ul id="${id}" class="zhuge_selectcont" style="display : none"></ul>',
                        li = '<li style="position:relative" title="${name}">${name} ${rightArrow}</li>',
                        offsetTop = (item.name) ? $(this).offset().top - (parseFloat($(this).parent().css('marginTop'))
                        + parseFloat($(this).parent().css('borderTop'))) :
                        $(this).outerHeight() + $(this).offset().top - (parseFloat($(this).parent().css('marginTop'))
                        + parseFloat($(this).parent().css('borderTop'))),
                        offsetLeft = (item.name) ? $(this).offset().left + $(this).outerWidth() : $(this).offset().left;
                    $(search).append($(ul.customReplace('id', ulId)).css({
                        "position" : "fixed",
                        "width" : $(this).width()
                    }).offset({"left" : offsetLeft,"top" : offsetTop}));
                    for(var i=0; i<item.child.length; i++){
                        $('#' + ulId).append($(li.customReplace('name',item.child[i][opts.fieldName],'g')
                            .customReplace('rightArrow',item.child[i].child && item.child[i].child.length ? '<span class="zg_icon_right"></span>' : '')).data('data',item.child[i]));
                    }
                    $(ulID).delegate('li', 'mouseenter', {type : "mouseenter"}, eachLiClick);
                    $(ulID).delegate('li','click',onChange);
                    $(this).data('haveAddchild',true);
                }
            }
            if(event.type === "click"){
                if($(ulID).css('display') === "block"){
                    $(search + ' ul[id^=' + ulId + ']').hide();
                }else{
                    $(search + ' ul[id^=' + item.parentId + '_]').hide();
                    $(search + ' ul[id^=' + item.parentId + ']').find('li').removeClass('active');
                    $(this).addClass('active');
                    $(ulID).show();
                    $(ulID).show();
                }
            }else{
                $(ulID).show();
            }

        }
        //选中事件
        function onChange(event){
            var item = $(this).data('data');
            if(!item)return ;
            if(!item.child || !item.child.length){
                $('#searchSelectText_' + randomId).val(item[opts.fieldName]);
            }
        }
        init();
    };
})(jQuery);