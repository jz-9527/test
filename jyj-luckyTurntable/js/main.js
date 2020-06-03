
//转盘配置
var luckyRotate = {
    option: {
        restaraunts: [],				//大转盘奖品
        images: [],                  //奖品图片
        outsideRadius: 180,			//大转盘外圆的半径
        textRadius: 150,				//大转盘奖品位置距离圆心的距离
        insideRadius: 45,			//大转盘内圆的半径
        startAngle: 0,				//开始角度
        bRotate: false,				//false:停止;ture:旋转
        prizeColor: '#E5302F',       //奖品字体颜色
        x: 230,                     //转盘水平位置
        y: 231                      //转盘垂直位置
    },

}
//转盘设置
var turnplate = luckyRotate.option;
var hitContent = '';  //中奖信息
var prizeId = '',  //中奖奖品id
    prizeList = [], //转盘奖品列表
    todayNum = 0,//今日剩余次数
    luckyId = [];

// exchangeNum = 0;   //积分兑换次数

$(function () {
    if (methods.getUrlParam('u')) {
        methods.tologin()
    } else {
        methods.getUserData(); //获取用户信息 
        methods.getHitData(); //获取中奖列表
        // methods.getLuckPointNumData(); // 获取剩余兑换次数
        methods.getPrizesData(); // 获取奖品
        methods.getLuckNumData(); //获取剩余抽奖次数
        methods.getLuckInfo(); //获取中奖信息
    }
    var deviceType = methods.getDeviceType()
    if (deviceType.isIOS) {
        document.querySelector('#declare').style.display = 'block'
    }
})

//点击抽奖
$('.lucky-btn').click(function () {
    
    if (todayNum <= 0) {
        // 抽奖次数已用完
        // if (exchangeNum <= 0) {
        $('.toast').html('今日抽奖次数已用完').show();
        setTimeout(function () {
            $('.toast').hide();
        }, 3000)
        // return false;
        // }
        // $('.exchange-popup').show();
        return false
    }
    $('.R').attr('disabled', 'disabled')   //抽奖中禁止查看礼包
    if (turnplate.bRotate) return;
    turnplate.bRotate = !turnplate.bRotate;

    todayNum--;
    $('.today-num').html(todayNum); //更新页面今日剩余次数

    prizeList.forEach(function (item, index) {
        if (item.id == prizeId) {
            //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
            //转盘旋转到到指定位置  参数 奖品位置，奖品信息
            console.log('奖品索引：' + index, '点击抽奖')
            methods.rotateFn(index + 1, turnplate.restaraunts[index]);
        }
    })
    methods.getLuckInfo(); //自动获取下一次抽奖信息
    
});
//打开我的礼品弹窗
var recordList = '' //我的礼包数据
$('.R').click(function () {
    // 我的礼包
    jyjAjax(function (res) {
        if (res.code == 0) {
            var str = '';
            recordList = res.data;
            res.data.forEach(function (item) {
                if (item.relationType == 1) {
                    str += '<div class="myPrize-item">' +
                        '<p class="myPrize-name">' + item.name + '</p>' +
                        '<p class="myPrize-time">' + item.recordCreateAt + '</p>' +
                        '</div>'
                } else if (item.relationType == 3) {
                    str += '<div class="myPrize-item">' +
                        '<p class="myPrize-name">' + item.name + '</p>' +
                        '<p class="myPrize-time">' + item.recordCreateAt + '</p>' +
                        '<div class="myPrize-btn">填写信息</div>' +
                        '</div>'
                }
            });
            $('.myPrize-list').html(str)
        }
    }, '/v2/luckDraw/getRecord', 'get')
    $('.myPrize-popup').show();
})
//去填写信息
$('.myPrize-list').on('click', '.myPrize-btn', function () {
    var index = $(this).parent().index();
    window.location.href = './subinfo.html?id=' + recordList[index].id;
})
//关闭我的奖品弹窗
$('.close').click(function () {
    $('.myPrize-popup').hide();
})

//关闭抽奖结果弹窗
$('.popup-btn').click(function () {
    if ($('.popup-btn').html() == '去填写信息') {
        var id = window.luckyId[0];
        window.luckyId.shift();
        console.log('跳转id：' + id);
        console.log('关闭弹窗后：' + window.luckyId);
        $('.popup').hide();
        window.location.href = './subinfo.html?id=' + id
        // window.location.href = window.location.origin + '/luckyTurntable/subinfo.html?id='+ window.luckyId[0];
        // window.location.href = window.location.origin+'/luckyTurntable/subinfo.html';
    } else {
        // console.log(window.location)
        window.luckyId.shift();
        $('.popup').hide();
        // getUserData();
        $('.R').removeAttr('disabled') //抽奖结束可以查看
    }
})

var methods = {
    //抽奖结束
    luckyResult: function (item, obj) {
        // getLuckInfo(); //获取下一次抽奖信息
        //抽奖按钮置灰
        if (todayNum <= 0) {
            $('.lucky-btn').attr('src', './images/lucky-btn-gray.png')
        }
        //抽奖结果反馈
        if (obj.name == '谢谢惠顾') {
            $('.luck-result-text1').html('很遗憾');
            $('.luck-result-text2').html('您与奖品只差一步之遥')
        } else {
            $('.luck-result-text1').html('您抽中啦');
            $('.luck-result-text2').html('恭喜您获得' + obj.name)
        }

        // if (obj.type == 3) { //实物商品
        //     $('.popup-btn').html('去填写信息')
        // } else {
        $('.popup-btn').html('知道了')
        // }

        // $('.result-prize-img').attr('src','./images/'+turnplate.images[item-1]);  //奖品图片
        $('.result-prize-img').attr('src', obj.img);  //奖品图片
        $('.result-prize-name').html(obj.name);  // 奖品名称
        $('.popup').show();
        turnplate.bRotate = !turnplate.bRotate;
    },
    //获取抽奖数据信息
    getLuckInfo: function () {
        var _this = this;
        var params = { content: hitContent };
        hitContent ? params = { content: hitContent } : params = {};
        jyjAjax(function (res) {
            if (res.code == 0) {
                hitContent = res.data;
                prizeId = _this.decrypt(res.data).prizeId;
                luckyId.push(_this.decrypt(res.data).id);
                console.log('奖品id' + prizeId);
                console.log('当前记录id:' + _this.decrypt(res.data).id)
                console.log('抽奖Id:' + window.luckyId)
            }
        }, '/v2/luckDraw/getHitInfo', 'post', params);
    },
    //获取剩余抽奖次数
    getLuckNumData: function () {
        jyjAjax(function (res) {
            if (res.code == 0) {
                todayNum = res.data.num;
                $('.today-num').html(todayNum); //今日剩余次数
                //抽奖按钮置灰
                if (todayNum <= 0) {
                    $('.lucky-btn').attr('src', './images/lucky-btn-gray.png')
                }
            }
        }, '/v2/luckDraw/getLuckNum', 'get');
    },
    //获取奖品
    getPrizesData: function () {
        var _this = this;
        jyjAjax(function (res) {
            if (res.code == 0) {
                var html = '';
                prizeList = res.data;
                res.data.forEach(function (item, index) {
                    var obj = {
                        name: item.name,
                        img: item.img,
                        color: '#FFFDF7',
                        type: item.relationType
                    }
                    if (index % 2 == 0) {
                        obj.color = '#FCCC96'
                    }
                    //渲染奖品列表
                    if (item.name != '谢谢惠顾') {
                        html += '<div class="prize-dec">' +
                            '<div class="prize-dec-l" >' +
                            '<img src="' + item.img + '" class="prize-dec-img">' +
                            '</div>' +
                            '<div class="prize-dec-r">' +
                            '<p class="prize-dec-name">' + item.name + '</p>' +
                            '<p class="prize-dec-text">' + item.description + '</p>' +
                            '</div>' +
                            '</div >';
                    }

                    //动态插入奖品图片 （用于canvas在转盘绘制奖品图）
                    var img = document.createElement('img')
                    img.src = item.img
                    img.id = 'img' + index
                    img.style.display = 'none'
                    $('body').eq(0).append(img)
                    turnplate.restaraunts.push(obj)
                });
                $('.item-con2-hide').html(html);
                setTimeout(function () {
                    _this.drawRouletteWheel(); // 渲染大转盘
                }, 100)
                
            }
        }, '/v2/luckDraw/getPrizes', 'post');
    },
    //获取中奖列表
    getHitData: function () {
        var _this = this;
        jyjAjax(function (res) {
            var str = '';
            var nowTime = new Date();
            if (res.code == 0) {
                res.data.forEach(function (item) {
                    var createTime = item.createAt.replace(/\-/g, '/');
                    var luckTime = new Date(createTime);
                    var time = nowTime - luckTime;
                    if (time / 1000 < 60) {
                        str += '<li class="name-item">' + item.Phone + '&nbsp;&nbsp;手气爆棚，抽中了' + item.name + '&nbsp;&nbsp;<span style="color:#999">' + Math.ceil(time / 1000) + '秒钟前</span></li>'
                    } else if (time / (1000 * 60) < 60) {
                        str += '<li class="name-item">' + item.Phone + '&nbsp;&nbsp;手气爆棚，抽中了' + item.name + '&nbsp;&nbsp;<span style="color:#999">' + Math.ceil(time / (1000 * 60)) + '分钟前</span></li>'
                    } else if (time / (1000 * 60 * 60) < 24) {
                        str += '<li class="name-item">' + item.Phone + '&nbsp;&nbsp;手气爆棚，抽中了' + item.name + '&nbsp;&nbsp;<span style="color:#999">' + Math.ceil(time / (1000 * 60 * 60)) + '小时前</span></li>'
                    } else {
                        str += '<li class="name-item">' + item.Phone + '&nbsp;&nbsp;手气爆棚，抽中了' + item.name + '&nbsp;&nbsp;<span style="color:#999">' + Math.ceil(time / (1000 * 60 * 60 * 24)) + '天前</span></li>'
                    }
                })
                var ele = $('#name-list');
                ele.html(str);
                if (ele.find('li').length > 3) {
                    setInterval(function () {
                        _this.scroll(ele);
                    }, 3000)
                }
            }
        }, '/v2/luckDraw/getHitList', 'get');
    },
    //获取用户信息
    getUserData: function () {
        jyjAjax(function (res) {
            if (res.code == 0) {
                // console.log(res.data)
                $('.user-icon').attr('src', res.data.icon);
                $('.user-mobile').html(res.data.nickName);
                $('.user-points').html('积分:' + res.data.point);
            } else {
                $('.toast').html(res.msg).show();
                setTimeout(function () {
                    $('.toast').hide();
                }, 3000)
            }
        }, '/user/get', 'get');
    },
    //列表滚动
    scroll: function (dom) {
        dom.animate({ marginTop: '-0.6rem' }, 800, function () {
            dom.append(dom.find('li:first-child'))
            dom.css({ 'margin-top': '0' })
        })
    },
    //转盘旋转  item:奖品位置; obj：奖品信息
    rotateFn: function (item, obj) {
        var _this = this;
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length * 2));
        if (angles < 270) {
            angles = 270 - angles;
        } else {
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: angles + 1800,
            duration: 8000,
            callback: function () {
                _this.luckyResult(item, obj)
            }
        });
    },
    // 渲染大转盘
    drawRouletteWheel: function () {
        var canvas = document.getElementById("wheelcanvas");
        if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            var arc = Math.PI / (turnplate.restaraunts.length / 2);
            var ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0, 0, 460, 460);
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
            ctx.strokeStyle = "#FFBE04";
            //font 属性设置或返回画布上文本内容的当前字体属性
            ctx.font = '16px Microsoft YaHei';
            ctx.fillStyle = '#fff';
            for (var i = 0; i < turnplate.restaraunts.length; i++) {
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
                if (text.length > 6) {//奖品名称长度超过一定范围 
                    text = text.substring(0, 6) + "||" + text.substring(6);
                    var texts = text.split("||");
                    for (var j = 0; j < texts.length; j++) {
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                } else {
                    //在画布上绘制填色的文本。文本的默认颜色是黑色
                    //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                }

                //绘制奖品图
                var img = document.getElementById("img" + i);
                img.onload = function () {
                    // ctx.drawImage(img, -18, 10, 45, 45);
                };
                ctx.drawImage(img, -24, 10, 50, 50);

                //把当前画布返回（调整）到上一个save()状态之前 
                ctx.restore();
                //----绘制奖品结束----
            }
        }
    },
    // 随机数
    rnd: function (n, m) {
        n = 1;//最小随机数
        m = 100;//最大随机数（概率范围最大值）
        //最大数数不超过最大随机数
        var ransluck = [50, 60, 65, 90, 95, 100];//概率为比自己小的第一个数之间的差
        var randoms = Math.floor(Math.random() * (m - n + 1) + n);
        if (randoms <= ransluck[0]) {
            var random = 1;
        }
        else if (randoms <= ransluck[1]) {
            var random = 2;
        }
        else if (randoms <= ransluck[2]) {
            var random = 3;
        }
        else if (randoms <= ransluck[3]) {
            var random = 4;
        }
        else if (randoms <= ransluck[4]) {
            var random = 5;
        }
        else if (randoms <= ransluck[5]) {
            var random = 6;
        }
        //alert(randoms);
        return random;
    },
    //登录
    tologin: function () {
        var _this = this;
        var params = {
            phone: atob(this.getUrlParam('u')),
            token: atob(this.getUrlParam('t'))
        }
        jyjAjax(function (res) {
            if (res.code == 0) {
                _this.getUserData(); //获取用户信息 
                _this.getHitData(); //获取中奖列表
                // this.getLuckPointNumData(); // 获取剩余兑换次数
                _this.getPrizesData(); // 获取奖品
                _this.getLuckNumData(); //获取剩余抽奖次数
                _this.getLuckInfo(); //获取中奖信息
            }
        }, '/v2/user/login', 'post', params)
    },
    //aes解密
    decrypt: function (word) {
        // var aesKey = 'gyjgyjgyjgyjgyjg';  //密钥
        var aesKey = 'dgyjdgyjgyjgyjgyjgyjgyjgdgyjdgyj';  //密钥
        var key = CryptoJS.enc.Utf8.parse(aesKey.substr(8, 16));
        var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString())
    },
    //获取设备类型
    getDeviceType: function () {
        var type = window.navigator.userAgent.toLocaleLowerCase();
        var isAndroid = /android/.test(type);
        var isIOS = /iphone|ipad|ipod/.test(type);
        return {
            isAndroid: isAndroid,
            isIOS: isIOS
        }
    },
    //获取url参数
    getUrlParam: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        // 获取地址栏的查询参数字符串
        var search = window.location.search;
        var result = decodeURIComponent(search).substring(1).match(reg);
        if (result) return result[2];
        return '';
    }
}