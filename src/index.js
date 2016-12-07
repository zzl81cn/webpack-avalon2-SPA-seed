﻿avalon.config({
    debug: true
});
var root = avalon.define({
    $id: 'root',
    headerPage: '<p>this is headerPage</p>',//头部页面
    footerPage: '<p>this is footerPage</p>',//尾部页面
    currPath: '',//当前路径
    currPage: ''//当前页面
});


var states = {};

function addState(path, vm, html) {
    states[path] = {
        vm: vm,
        html: html
    }
}

avalon.component('ms-view', {
    template: '<div ms-html="@page" class="ms-view"></div>',
    defaults: {
        page: '&nbsp;',
        path: 'no',
        onReady: function(e) {
            var path = e.vmodel.path;
            var state = states[path];
            avalon.vmodels[state.vm.$id] = state.vm;
            setTimeout(function() {//必须等它扫描完这个template,才能替换
                // e.vmodel.page = '<div><p>hello world</p></div>';
                e.vmodel.page = state.html
            },100)
        },
        onDispose: function(e) {
            var path = e.vmodel.path;
            var state = states[path];
            var vm = state.vm;
            var render = vm.render;
            render && render.dispose();
            delete avalon.vmodels[vm.$id]
        }
    }
});

function getPage(path) {
    path = path.slice(1);
    var html = '<xmp is="ms-view" class="view-container" ms-widget="{path:\'' + path + '\',page: @page}"><xmp>';
    return html
}

var pages = ["aa/first","bb/second"];
pages.forEach(function(pathname) {
    var html = require('./html/' + pathname + '.html');
    var vm = require('./js/' + pathname + '.js');
    addState(pathname, vm, html);
    avalon.router.add("/"+pathname, function(a) {
        root.currPath = this.path;
        root.currPage = getPage(this.path);
    })
});

avalon.history.start({
    root: "/test/second"
});

avalon.ready(function() {
    avalon.scan(document.body)
});