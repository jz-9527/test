var protocol = window.location.protocol
// api地址
// var baseUrl = protocol+"//jyj-dev-api.idougong.com";
var baseUrl = protocol+"//jyj-api.idougong.com";
// var baseUrl = "http://192.168.0.52:8000";
// ajax
window.jyjAjax = function (callback, url, method, params) {
    $.ajax({
        type: method,
        url: baseUrl + url,
        timeout: 10000,
        dataType: 'json',
        // data:JSON.stringify(params),
        data: params,
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials
        },
        success: function (res) {
            callback(res)
        },
        error: function (error) {
            alert('err',error)
        }
    })
}