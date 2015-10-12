/**
 * Created by Administrator on 2015/9/22.
 */
define(function(){
    var Node = function(dom){
        this.origin = dom;
    };
    Node.prototype = {
        origin: document.body,
        //select only element
        find: function(ele){
            return new Node(this.origin.querySelector(ele));
        },
        //
        query: function(){

        }
    };
    var NodeList = function(list){
        this.origin = list;
    };
    NodeList.prototype = {
        origin: document.body,
        query: function(){

        }
    };
    return new Node(document);

});