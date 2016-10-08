$(document).ready(function () {
    
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

            if (typeof (json) == "object") {
                //为对象
                datajson = json;
            }
            else {
                //将字符串转换为对象
                datajson = JSON.parse(json);
            }
            if (datajson.result.datas.length > 0) {
                $.each(datajson.result.datas, function (i, item) {
                    //模板渲染
                    var newDate = new Date();
                    newDate.setTime(item.sendtime);
                    item.sendtime = newDate.format('yyyy-MM-dd h:m:s');
                    var html = tmpl("tmpl_detailinfo", item);
                    $(html).appendTo("#all_listview").trigger('create');
                });
            }
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});

var getuserid;
function messagepage_btn_click(id) {
    var words = id.split(',');
    var sendid = words[0];
    var messageid = words[1];
    getuserid = sendid;
    $.ajax({
        url: domain + url_readedMessage + "?token=1&messageid=" + messageid,
        type: 'get',
        async: false,
        success: function (json) {
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
    $(document).on("pageinit", "#persmessage", function () {
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
        $("#persmessage_listview").empty();
        var paramr = "?token=1&ownid=" + sessionStorage.userid + "&otherid=" + sendid;
        $.ajax({
            url: domain + url_queryMessagesBetween + paramr,
            type: 'get',
            async: false,
            success: function (json) {

                if (typeof (json) == "object") {
                    //为对象
                    datajson = json;
                }
                else {
                    //将字符串转换为对象
                    datajson = JSON.parse(json);
                }
                if (datajson.result.datas.length > 0) {
                    $.each(datajson.result.datas, function (i, item) {
                        //模板渲染
                        var newDate = new Date();
                        newDate.setTime(item.sendtime);
                        item.sendtime = newDate.format('yyyy-MM-dd h:m:s');
                        var html = tmpl("tmpl_persmessage_detailinfo", item);
                        $(html).appendTo("#persmessage_listview").trigger('create');
                    });
                }
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    });
}
function diaoyong() {
    var message = document.getElementById("btn-input").value;
    var paramr = "?token=1&senduserid=" + sessionStorage.userid + "&getuserid=" + getuserid + "&message=" + message;
    $.ajax({
        type: "get",
        url: domain + url_sendMessage + paramr,
        async: false,
        success: function () {
            confirm("发送成功！");
        },
        error: function (errorMsg) {
            alert("请求数据失败\n" + errorMsg.toString());
        }
    });
}
