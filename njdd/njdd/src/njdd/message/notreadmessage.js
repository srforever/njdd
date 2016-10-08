$(document).ready(function () {

    alert();
    //var messageresult;
    ////序列化时间
    //Date.prototype.format = function (format) {
    //    var date = {
    //        "M+": this.getMonth() + 1,
    //        "d+": this.getDate(),
    //        "h+": this.getHours(),
    //        "m+": this.getMinutes(),
    //        "s+": this.getSeconds(),
    //        "q+": Math.floor((this.getMonth() + 3) / 3),
    //        "S+": this.getMilliseconds()
    //    };
    //    if (/(y+)/i.test(format)) {
    //        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    //    }
    //    for (var k in date) {
    //        if (new RegExp("(" + k + ")").test(format)) {
    //            format = format.replace(RegExp.$1, RegExp.$1.length == 1
    //                   ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    //        }
    //    }
    //    return format;
    //}
    //$("#all_listview").empty();
    //var paramstr = "?token=1&id=" + sessionStorage.userid;
    //$.ajax({
    //    url: domain + url_getmessage + paramstr,
    //    type: 'get',
    //    async: false,
    //    success: function (json) {
    //        var notread;
    //        if (typeof (json) == "object") {
    //            //为对象
    //            datajson = json;
    //        }
    //        else {
    //            //将字符串转换为对象
    //            datajson = JSON.parse(json);
    //        }

    //        var a = 0;
    //        $.each(datajson.result.datas, function (i, item) {

    //            if (item.isread == null) {
    //                messageresult[a] = item;
    //                a++;
    //                notread = true;
    //            }

    //        });


//        if (notread) {
    //            $("<div data-role='dialog' id='message-dialog'><div data-role='header'><h1>提示信息</h1></div><div data-role='content'><p> 你有未读消息</p><a data-role='button' href='message/message.html'>查看</a></div></div>").appendTo("body");
    //            //href='http://" + domain + "njdd.web.mobile/entry/message/message.html'
    //            window.location.href = "#message-dialog";
    //        }


//    },
    //    error: function (errorMsg) {
    //        alert(errorMsg);
    //    }
    //});
});