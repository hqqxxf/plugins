/**
 * Created by Administrator on 2015/10/12.
 */
require([
    'modules/dom'
],function(dom){
    console.log(dom);
    /*预处理所有dom节点*/
    function resetDoms(){
        var allNodes = dom.query('body *');
        allNodes.each(function(){
            if(this.getNodeName() != 'script'){
                this.attr('data-origstyle', this.attr('style') || '');
            }
        });
    }
    function onClickWindow(event){
        var target = dom.wrap(event.target || event.srcElement);
        console.log(target.getSelector());
        console.log(target.getUniqueSelector());
        console.log(target.getSameSelector());
        return event.zg_preventDefault();
    }
    function initEventsBind(){
        window.addEventListener('click', onClickWindow, true);
    }
    function init(){
        resetDoms();
        initEventsBind();
    }
    init();
});