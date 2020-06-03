//转盘配置
var luckyRotate = {
    option:{
        restaraunts:[],				//大转盘奖品
        images:[],                  //奖品图片
        outsideRadius:180,			//大转盘外圆的半径
        textRadius:150,				//大转盘奖品位置距离圆心的距离
        insideRadius:45,			//大转盘内圆的半径
        startAngle:0,				//开始角度
        bRotate:false,				//false:停止;ture:旋转
        prizeColor:'#E5302F',       //奖品字体颜色
        x: 230,                     //转盘水平位置
        y: 231                      //转盘垂直位置
    },

}
//转盘设置
var turnplate=luckyRotate.option;
var hitContent = '';  //中奖信息
var prizeId = ''  //奖品id
window.prizeList = [] //奖品列表


function decrypt(word){
    // var aesKey = 'gyjgyjgyjgyjgyjg';  //密钥
    var aesKey = 'dgyjdgyjgyjgyjgyjgyjgyjgdgyjdgyj';  //密钥
    var key = CryptoJS.enc.Utf8.parse(aesKey.substr(8,16));
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString())
}


//今日剩余次数
window.todayNum = 0;


//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload=function(){
    window.luckyId = []
    // getLuckInfo();  //获取中奖信息
    //动态添加大转盘的奖品与奖品区域背景颜色
    // turnplate.restaraunts = ["一等奖", "50积分", "二等奖", "100积分", "三等奖", "谢谢参与"];
    // turnplate.colors = ["#FFFDF7", "#FCCC96", "#FFFDF7", "#FCCC96", "#FFFDF7", "#FCCC96", "#FFFDF7", "#FCCC96"];
    // turnplate.images = ['prize-img8.png', 'prize-img1.png', 'prize-img6.png', 'prize-img2.png', 'prize-img5.png', 'prize-img3.png', 'prize-img7.png', 'prize-img4.png'];

};

//获取奖品
window.getPrizesData = function (){
    gyjAjax(function(res){
        if(res.code == 0){
            prizeList =  res.data;
            res.data.forEach(function(item,index){
                var obj = {
                    name: item.name,
                    img:item.img,
                    color:'#FFFDF7',
                    type: item.relationType
                }
                if (index%2 == 0){
                    obj.color = '#FCCC96'
                }
                var img = document.createElement('img')
                img.src = item.img
                img.id = 'img'+index
                img.style.display = 'none'
                $('body').eq(0).append(img)
                turnplate.restaraunts.push(obj)
            });
            setTimeout(function(){
                drawRouletteWheel(); // 渲染大转盘
            },1000)
            console.log(turnplate.restaraunts)
        }
    },'/v2/luckDraw/getPrizes','post');
}
//获取剩余抽奖次数
window.getLuckNumData = function(){
    gyjAjax(function(res){
        if(res.code == 0){
            todayNum = res.data.num;
            $('.today-num').html(todayNum); //今日剩余次数
            //抽奖按钮置灰
            if(todayNum <= 0){
                $('.lucky-btn').attr('src','./images/lucky-btn-gray.png')
            }
        }
    },'/v2/luckDraw/getLuckNum','get');
}
//点击抽奖
$('.lucky-btn').click(function (){
    var R=$('.my-prize')
    R.attr('disabled')
    if(todayNum <=0 ){
        // $('.toast').html('抽奖次数已用完').show()
        // setTimeout(function(){
        //     $('.toast').hide()
        // },3000)
        // 抽奖次数已用完
        if(exchangeNum <= 0){
            $('.toast').html('今日抽奖次数已用完').show();
            setTimeout(function(){
                $('.toast').hide();
            },3000)
            return false;
        }
        $('.exchange-popup').show();
        return false
    }
    if(turnplate.bRotate)return;
    turnplate.bRotate = !turnplate.bRotate;
    //获取随机数(奖品个数范围内)
    // var item = rnd(1,turnplate.restaraunts.length);
    var prizeIndex = '';
    prizeList.forEach(function(item,index){
        if(item.id == prizeId){
            // prizeIndex = turnplate.restaraunts.indexOf(item.name);
            prizeIndex = index
        //    console.log('奖品：'+turnplate.restaraunts[index]);
        }   
    })
    todayNum--;
    $('.today-num').html(todayNum); //今日剩余次数
    //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
    //奖品位置，奖品信息
    rotateFn(prizeIndex+1, turnplate.restaraunts[prizeIndex]);
    getLuckInfo(); //获取下一次抽奖信息
    console.log(prizeIndex);
    R.removeAttr('disabled')
});

//获取抽奖结果
window.getLuckInfo = function(){
    var params = {content:hitContent};
    hitContent ? params = {content:hitContent} : params = {};
    gyjAjax(function(res){
        if(res.code == 0){
            hitContent = res.data;
            prizeId = decrypt(res.data).prizeId;
            window.luckyId.push(decrypt(res.data).id);
            console.log('奖品id' + prizeId);
            console.log('当前记录id:' + decrypt(res.data).id)
            console.log('抽奖Id:' + window.luckyId)
        }
    },'/v2/luckDraw/getHitInfo','post',params);
}

//抽奖结果
function luckyResult(item, obj){
    console.log(item, obj)
    // getLuckInfo(); //获取下一次抽奖信息
    //抽奖按钮置灰
    if(todayNum <= 0){
        $('.lucky-btn').attr('src','./images/lucky-btn-gray.png')
    }
    //抽奖结果反馈
    if(obj.name == '谢谢惠顾'){
        $('.luck-result-text1').html('很遗憾');
        $('.luck-result-text2').html('您与奖品只差一步之遥')
    }else{
        $('.luck-result-text1').html('您抽中啦');
        $('.luck-result-text2').html('恭喜您获得'+obj.name)  
    }

    if (obj.type == 3){ //实物商品
        $('.popup-btn').html('去填写信息')
    }else{
        $('.popup-btn').html('知道了')
    }

    // $('.result-prize-img').attr('src','./images/'+turnplate.images[item-1]);  //奖品图片
    $('.result-prize-img').attr('src',obj.img);  //奖品图片
    $('.result-prize-name').html(obj.name);  // 奖品名称
    $('.popup').show();
    turnplate.bRotate = !turnplate.bRotate;
}


//旋转转盘 item:奖品位置; obj：奖品信息;
function rotateFn(item, obj){
    var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
    if(angles<270){
        angles = 270 - angles; 
    }else{
        angles = 360 - angles + 270;
    }
    $('#wheelcanvas').stopRotate();
    $('#wheelcanvas').rotate({
        angle:0,
        animateTo:angles+1800,
        duration:8000,
        callback:function(){
            luckyResult(item, obj)
        }
    });
}

// 渲染大转盘
function drawRouletteWheel() {    
    var canvas = document.getElementById("wheelcanvas");   
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length/2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 460, 460);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '16px Microsoft YaHei';      
        ctx.fillStyle = '#fff';
        for(var i = 0; i < turnplate.restaraunts.length; i++) {       
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.restaraunts[i].color;
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
            ctx.arc(turnplate.x, turnplate.y, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(turnplate.x, turnplate.y, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();  
            ctx.fill();

            //锁画布(为了保存之前的画布状态)
            ctx.save();   
            
            //----绘制奖品开始----
            ctx.fillStyle = turnplate.prizeColor;  //奖品字体颜色
            // var text = turnplate.restaraunts[i];
            var text = turnplate.restaraunts[i].name;  //奖品名称
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(turnplate.x + Math.cos(angle + arc / 2) * turnplate.textRadius, turnplate.y + Math.sin(angle + arc / 2) * turnplate.textRadius);
            
            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            
            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if(text.length>6){//奖品名称长度超过一定范围 
                text = text.substring(0,6)+"||"+text.substring(6);
                var texts = text.split("||");
                for(var j = 0; j<texts.length; j++){
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            }else{
                //在画布上绘制填色的文本。文本的默认颜色是黑色
                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }
            
            //绘制奖品图
            var img = document.getElementById("img"+i);
            img.onload = function () {
                // ctx.drawImage(img, -18, 10, 45, 45);
            }; 
            ctx.drawImage(img, -24, 10, 50, 50);
  
            //把当前画布返回（调整）到上一个save()状态之前 
            ctx.restore();
            //----绘制奖品结束----
            // alert('4')
        }     
    } 
}

// 随机数
function rnd(n, m){

	n=1;//最小随机数
	m=100;//最大随机数（概率范围最大值）
	//最大数数不超过最大随机数
	var ransluck = [50,60,65,90,95,100];//概率为比自己小的第一个数之间的差
	var randoms = Math.floor(Math.random()*(m-n+1)+n);
	if(randoms<=ransluck[0])
	{
		var random = 1;
	}
	else if(randoms<=ransluck[1])
	{
		var random = 2;
	}
	else if(randoms<=ransluck[2])
	{
		var random = 3;
	}
	else if(randoms<=ransluck[3])
	{
		var random = 4;
	}
	else if(randoms<=ransluck[4])
	{
		var random = 5;
	}
	else if(randoms<=ransluck[5])
	{
		var random = 6;
	}
	//alert(randoms);
	//alert(random);
	return random;
	
}
