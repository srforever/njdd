$(document).ready(function () {
    var messageresult;
    //序列化时间
    Date.prototype.format = function (format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                       ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }
    $("#all_listview").empty();
    var paramstr = "?token=1&id=" + sessionStorage.userid;
    $.ajax({
        url: domain + url_getmessage + paramstr,
        type: 'get',
        async: false,
        success: function (json) {
            var notread;
            if (typeof (json) == "object") {
                //为对象
                datajson = json;
            }
            else {
                //将字符串转换为对象
                datajson = JSON.parse(json);
            }

            var a=0;
            $.each(datajson.result.datas, function (i, item) {
              
                if (item.isread == null) {
                    //messageresult[a] = item;
                    a++;
                    notread = true;
                }

            });

            

            if (notread) {

                alert("您有未读消息"+a+"条");

            }



        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});


