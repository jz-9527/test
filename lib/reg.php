<?php

    header('Access-Control-Allow-Origin:*'); // CORS

    include('./conn.php');

    $username = $_REQUEST['username'];
    $password = $_REQUEST['password'];

    $sql = "select * from user where user_name='$username'";

    $res = $mysqli->query($sql);

    if($res->num_rows>0){
        echo '{"status":200,"msg":"用户名已存在"}';
        $mysqli->close();
    }
    $insert="insert into user(user_name,user_pass,user_phone,user_email) values('$username',$password,123,123)";
    $ress=$mysqli->query($insert);
    if($ress){
        echo '{"msg":"注册成功"}';
    }
    $mysqli->close();
?>