<?php

header('content-type:text/html;charset=utf-8');

$mysql_conf = array(
    'host'=>'localhost:3306',// 地址
    'db_user'=>'root',// 用户名
    'db_pass'=>'', // 密码
    'db'=>'jz'// 数据库名
);

// 数据库连接 mysqli
$mysqli = @new mysqli($mysql_conf['host'],$mysql_conf['db_user'],$mysql_conf['db_pass']);

// var_dump($mysqli);
if($mysqli->connect_errno){
    die('连接错误'.$mysqli->connect_errno);
}

// 设置查询字符集
$mysqli->query("set names utf8");

// 选择数据库
$select_db = $mysqli->select_db($mysql_conf['db']);

if(!$select_db){
    // 检查数据库是否选择成功
    die('数据库选择错误'.$mysqli->error);
}

?>