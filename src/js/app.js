//配置
require.config({
    paths:{
        jquery:'../../node_modules/jquery/dist/jquery.min',
        reg:'./reg'
    },
    shim:{}
});
require(['jquery','reg'],function ($,reg) { 
    reg.regEv('#btn');
 });