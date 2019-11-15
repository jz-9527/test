define(['jquery'], function ($) {
    return {
        regEv: function (selector) {
            $(selector).on('click', function () {
                $.ajax({
                    type: "post",
                    url: "http://127.0.0.1:8080/H1910/test/register.test/lib/reg.php",
                    data: {
                        username:$('#name').val(),
                        password:$('#pass').val()
                    },
                    success: function (response) {
                        console.log(response);
                    }
                });
            });
        }
    }
});