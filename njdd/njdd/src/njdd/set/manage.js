
var userunitid;
var userteamid;
var deleteuserid;
var datajson;//
$(document).on("pagebeforecreate", "#managepage", function () {
    $.ajax({
        url: domain + url_getAlluser + "?token=1",
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
                    if (sessionStorage.userid == item.id) {
                        sessionStorage.unitName = item.unitid;
                    }
                });
                $.each(datajson.result.datas, function (i, item) {
                    //模板渲染
                    var html;
                    if (sessionStorage.unitName == item.unitid) {
                        if (item.teamid == "") {
                            item.teamName = "无车队";
                            html = tmpl("tmpl_managepage_detailinfo", item);
                            $(html).appendTo("#managepage_listview").trigger('create');
                        }
                        else {
                            html = tmpl("tmpl_managepage_detailinfo", item);
                            $(html).appendTo("#managepage_listview").trigger('create');
                        }






                    }
                });
            }
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});
var replaceid;
var deleteuserid;
var updateuserid;
function managepage_btn_click(unituserid) {
    replaceid = unituserid;
    deleteuserid = replaceid;
    updateuserid = replaceid;
    $(document).on("pageinit", "#informationpage", function () {
        //alert("56");
        $("#informationpage_unit").empty();
        $("#informationpage_team").empty();
        $.ajax({
            type: "get",
            url: domain + url_getAlluser + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                $.each(data.result.datas, function (i, item) {
                    if (replaceid == item.id) {
                        $("#informationpage_name").val(item.name);
                        $("#informationpage_tel").val(item.phone);
                        $("#informationpage_email").val(item.email);
                        userunitid = item.unitid;
                        userteamid = item.teamid;
                    }
                });
                fullunit();
                fulluserteam();
            }
        });
    });
}

//修改用户信息
function dianji() {
    //$("#updateuser").click(function () {
    var username = document.getElementById("informationpage_name").value;
    var userphone = document.getElementById("informationpage_tel").value;
    var useremail;
    if (document.getElementById("informationpage_email").value == "" || document.getElementById("informationpage_email").value == null) {
        useremail = "";
    }
    else {
        useremail = document.getElementById("informationpage_email").value;
    }
    var userunit = $("#informationpage_unit").val();
    var userteam = $("#informationpage_team").val();
    var data = new Object();
    data["token"] = "1";
    data["data"] = new Object();
    data["data"]["filter"] = new Object();
    data["data"]["items"] = [];
    data["data"]["param"] = new Object();
    data["data"]["param"]["name"] = username;
    data["data"]["param"]["phone"] = userphone;
    data["data"]["param"]["email"] = useremail;
    data["data"]["param"]["unitid"] = userunit;
    data["data"]["param"]["teamid"] = userteam;
    data["data"]["param"]["id"] = updateuserid;
    $.ajax({
        url: domain + url_addUser,
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        timeout: 3000,
        success: function (json) {
            // alert("修改成功");
            confirm("修改成功！");
        }
    });
    //});
}

function deleteunituser() {
    ////删除用户
    //$("#deleteuser").click(function () {
    var param = "?token=1&unitID=" + userunitid + "&userID=" + deleteuserid;
    $.ajax({
        type: "get",
        url: domain + url_deleteUnitmember + param,
        async: true,
        dataType: 'json',
        success: function () {
            //personSearch();
            confirm("删除成功！");
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
    //});
}

function fullunit() {
    var selObj = $("#informationpage_unit");
    //显示所有单位的列表
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (json) {
            $("#informationpage_unit").empty();
            $("#informationpage_unit").append("<option ></option>");
            $.each(json.result.datas, function (i, item) {
                selObj.append("<option value='" + item.id + "'>" + item.name + "</option>");
            });
            var teamNames = document.getElementById("informationpage_unit");
            for (var b = 0, lenteamNames = teamNames.length; b < lenteamNames; b++) {
                if (teamNames.options[b].value == userunitid) {
                    var option = $($("option", selObj).get(b));
                    option.attr('selected', 'selected');
                    selObj.selectmenu();
                    selObj.selectmenu('refresh', true);
                    break;
                }

            }
        }

    });

}


function fulluserteam() {

    var selObj = $("#informationpage_team");
    //显示所有车队的列表
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (json) {
            $("#informationpage_team").empty();
            $("#informationpage_team").append("<option ></option>");
            $.each(json.result.datas, function (i, item) {
                if (item.teamUnitid == userunitid)
                    selObj.append("<option value='" + item.id + "'>" + item.name + "</option>");
            });

            var teamNames = document.getElementById("informationpage_team");
            for (var b = 0, lenteamNames = teamNames.length; b < lenteamNames; b++) {
                if (teamNames.options[b].value == userteamid) {
                    var option = $($("option", selObj).get(b));
                    option.attr('selected', 'selected');
                    selObj.selectmenu();
                    selObj.selectmenu('refresh', true);
                    break;
                }

            }
        }

    });
}

//根据单位的不同改变车队列表
function judgeunit() {
    var judgeunitid = $("#informationpage_unit").val();
    //填充车队名称
    $("#informationpage_team").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#informationpage_team").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                if (item.teamUnitid == judgeunitid) {
                    $("#informationpage_team").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }
            });
            var selObj = $("#informationpage_team");
            var option = $($("option", selObj).get(0));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);
        }
    });
}
