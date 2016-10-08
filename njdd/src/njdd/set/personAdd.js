var person = [];
var userunitid;
$(document).on("pagebeforecreate", "#personaddpage", function () {
    $.ajax({
        url: domain + url_getAlluser + "?token=1",
        type: 'get',
        async: false,
        success: function (json) {
            var datajson;
            if (typeof (json) == "object") {
                //为对象
                datajson = json;
            }
            else {
                //将字符串转换为对象
                datajson = JSON.parse(json);
            }
            person = datajson.result.datas;


            $.each(person, function (i, item) {
                if (sessionStorage.userid == item.id) {
                    userunitid = item.unitid;
                }
            });
            var selcTaskDom = $("#personaddpage_listview");
            // empty options
            selcTaskDom.empty();
            selcTaskDom.append();
            // 使用模块加载复选框
            for (var i = 0; i < person.length; i++) {
                if (userunitid == person[i]["unitid"] || person[i]["unitid"] == "") {
                    selcTaskDom.append(tmpl("user_tmpl", person[i]));
                    //判断id，将表中出现的人名勾选上
                    if (userunitid == person[i]["unitid"]) {
                        $("#add_" + person[i]["id"]).prop("checked", "true");
                    }
                }
            }
        },
        error: function (errorMsg) {
            data = null;
            alert("出错,无法查询到用户\n" + errorMsg.toString());
        }
    });
});

//对所属单位的人员进行增删
function userupdate() {
    for (var i = 0; i < person.length; i++) {
        if ($("#add_" + person[i]["id"]).is(":checked")) {
            if (person[i]["unitid"] != userunitid) {
                var personid = person[i]["id"];
                var param = "?token=1&unitid=" + userunitid + "&userid=" + personid;
                $.ajax({
                    type: "get",
                    url: domain + url_addUnitmember + param,
                    async: true,
                    dataType: 'json',
                    success: function () {
                    },
                    error: function (errorMsg) {
                        alert(errorMsg);
                    }
                });
            }
        }
        else {
            if (person[i]["unitid"] == userunitid) {
                var personid = person[i]["id"];
                var param = "?token=1&unitid=" + userunitid + "&userid=" + personid;
                $.ajax({
                    type: "get",
                    url: domain + url_deleteUnitmember + param,
                    async: true,
                    dataType: 'json',
                    success: function () {
                    },
                    error: function (errorMsg) {
                        alert(errorMsg);
                    }
                });
            }
        }
    }
    confirm("修改成功！");
}