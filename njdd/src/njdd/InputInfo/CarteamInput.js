//teammember变量
var result;
var person;
var teamteamid;
var userunitid;
var userteamid;
var updateuserid;
var deleteuserid;
var datajson = [];
//alluser变量
$(document).on("pagecreate", "#carteaminputpage", function () {
    readyteam();
    document.getElementById("teamnameinput").value = "";

    //填充所属单位
    $("#unitid").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#unitid").append("<option></option>");
            $("#unitid").append("<option>" + "请选择" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#unitid").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });
            var selObj = $("#unitid");
            var option = $($("option", selObj).get(1));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);
        }
    });
    //填充车队队长
    $("#teamcaptain").empty();
    $("#teamcaptain").append("<option >" + "请选择" + "</option>");
    var sel = $("#teamcaptain");
    var ops = $($("option", sel).get(0));
    ops.attr('selected', 'selected');
    sel.selectmenu();
    sel.selectmenu('refresh', true);


    $("#teamadd").hide();
    document.getElementById("captainphone").value = "";
    document.getElementById("textarea").value = "";
});
function readyteam() {
    //填充车队名称
    $("#carteamname").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#carteamname").append("<option ></option>");
            $("#carteamname").append("<option >" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                if (sessionStorage.unitid == item.teamUnitid) {
                    $("#carteamname").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }
            });
            var selObj = $("#carteamname");
            var option = $($("option", selObj).get(1));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);
        }
    });
    $("#teamadd").hide();
    document.getElementById("teamnameinput").value = "";
    var selObj1 = $("#unitid");
    var option1 = $($("option", selObj1).get(1));
    option1.attr('selected', 'selected');
    selObj1.selectmenu();
    selObj1.selectmenu('refresh', true);
    var selObj2 = $("#teamcaptain");
    var option2 = $($("option", selObj2).get(0));
    option2.attr('selected', 'selected');
    selObj2.selectmenu();
    selObj2.selectmenu('refresh', true);
    document.getElementById("captainphone").value = "";
    document.getElementById("textarea").value = "";
    changedisabled();
}

//内容为“请输入”时添加信息，否则修改信息
function teamchange() {
    $("#teamadd").hide();
    var teamselect = $("#carteamname").find("option:selected").text();
    if (teamselect == "请输入") {
        //内容清空
        document.getElementById("teamnameinput").value = "";
        var selObj1 = $("#unitid");
        var option1 = $($("option", selObj1).get(1));
        option1.attr('selected', 'selected');
        selObj1.selectmenu();
        selObj1.selectmenu('refresh', true);
        var selObj2 = $("#teamcaptain");
        var option2 = $($("option", selObj2).get(0));
        option2.attr('selected', 'selected');
        selObj2.selectmenu();
        selObj2.selectmenu('refresh', true);
        document.getElementById("captainphone").value = "";
        document.getElementById("textarea").value = "";
        changedisabled();
    }
    else {
        //填充相应信息
        var teamid = $("#carteamname").val();
        $.ajax({
            type: "get",
            url: domain + url_getTeam + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                teamdata = data.result.datas;
                $.each(data.result.datas, function (i, item) {
                    if (teamid == item.id) {
                        document.getElementById("teamnameinput").value = item.name;
                        var opList = document.getElementById("unitid");
                        for (var j = 0, len = opList.length; j < len; j++) {
                            if (opList.options[j].value == item.teamUnitid) {
                                var selObj = $("#unitid");
                                var option = $($("option", selObj).get(j));
                                option.attr('selected', 'selected');
                                selObj.selectmenu();
                                selObj.selectmenu('refresh', true);
                                break;
                            }
                        }
                        var carteamunitid = item.teamUnitid;
                        $("#teamcaptain").empty();//清空
                        $.ajax({
                            type: "get",
                            url: domain + url_getAlluser + "?token=1",
                            async: true,
                            dataType: 'json',
                            success: function (data) {
                                $("#teamcaptain").append("<option >" + "请选择" + "</option>");
                                $.each(data.result.datas, function (i, item) {
                                    if (carteamunitid == item.unitid) {
                                        $("#teamcaptain").append("<option value='" + item.id + "'>" + item.name + "</option>");
                                    }
                                });
                                unit_owner(item.teamCaptainid, item.captainphone, item.remark);
                            }
                        });

                    }
                });
            }
        });
        changedisabled();
    }
}

function unit_owner(teamCaptainid, captainphone, remark) {
    var op = document.getElementById("teamcaptain");
    if (teamCaptainid == "") {
        var selObj = $("#teamcaptain");
        var option = $($("option", selObj).get(0));
        option.attr('selected', 'selected');
        selObj.selectmenu();
        selObj.selectmenu('refresh', true);
    }
    else {
        for (var j = 0, len = op.length; j < len; j++) {
            if (op.options[j].value == teamCaptainid) {
                var selObj = $("#teamcaptain");
                var option = $($("option", selObj).get(j));
                option.attr('selected', 'selected');
                selObj.selectmenu();
                selObj.selectmenu('refresh', true);
                break;
            }
        }
    }
    document.getElementById("captainphone").value = captainphone;
    document.getElementById("textarea").value = remark;
}

//转换按钮的disabled属性
function changedisabled() {
    var teamselect = $("#carteamname").find("option:selected").text();
    if (teamselect == "请输入") {
        if (classie_css.has(document.querySelector("#addteam"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#addteam"), "ui-state-disabled");
        }
        if (!classie_css.has(document.querySelector("#updateteam"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#updateteam"), "ui-state-disabled");
        }
        if (!classie_css.has(document.querySelector("#deleteteam"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#deleteteam"), "ui-state-disabled");
        }
    }
    else {
        if (!classie_css.has(document.querySelector("#addteam"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#addteam"), "ui-state-disabled");
        }
        if (classie_css.has(document.querySelector("#updateteam"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#updateteam"), "ui-state-disabled");
        }
        if (classie_css.has(document.querySelector("#deleteteam"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#deleteteam"), "ui-state-disabled");
        }
    }
}

//队长名与电话一致化
function captainchange() {
    var selectcaptain = $("#teamcaptain").val();
    $.ajax({
        type: "get",
        url: domain + url_getAlluser + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $.each(data.result.datas, function (i, item) {
                if (selectcaptain == item.id) {
                    document.getElementById("captainphone").value = item.phone;
                }
            });

        }
    });
}

//删除车队
function deleteTeam() {
    var teamid = $("#carteamname").val();
    var param = "?token=1&id=" + teamid;
    $.ajax({
        type: "get",
        url: domain + url_deleteTeam + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
            readyteam();
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//修改车队
function updateTeam() {
    if (document.getElementById("teamnameinput").value == "" || document.getElementById("teamnameinput").value == null) {
        $("#teamadd").show();
    }
    else {
        var name = document.getElementById("teamnameinput").value;
        //获取车队id
        var teamid = $("#carteamname").val();
        var unitid = $("#unitid").val();
        var ownerid = $("#teamcaptain").val();
        var remark;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            remark = "";
        }
        else {
            remark = document.getElementById("textarea").value;
        }
        var param = "?token=1&id=" + teamid + "&newName=" + name + "&teamUnitid=" + unitid + "&teamCaptainid=" + ownerid + "&remark=" + remark;

        $.ajax({
            type: "get",
            url: domain + url_updateTeam + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("修改成功！");
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//添加车队
function addTeam() {
    if (document.getElementById("teamnameinput").value == "" || document.getElementById("teamnameinput").value == null) {
        $("#teamadd").show();
    }
    else {
        var name = document.getElementById("teamnameinput").value;
        var unitid = $("#unitid").val();
        var captainid = $("#teamcaptain").val();
        var remark;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            remark = "";
        }
        else {
            remark = document.getElementById("textarea").value;
        }

        //保存新增车队
        var param = "?token=1&name=" + name + "&remark=" + remark + "&teamCaptainid=" + captainid + "&teamUnitid=" + unitid;
        $.ajax({
            type: "get",
            url: domain + url_addTeam + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("添加成功！");
                readyteam();
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//车队成员界面的显示
$(document).on("pagebeforecreate", "#teaminfopage", function () {
    teamteamid = $("#carteamname").val();
    var pramestr = "?token=1&teamID=" + teamteamid;
    $.ajax({
        url: domain + url_getTeammember + pramestr,
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
            result = datajson.result.datas;
            if (datajson.result.datas.length > 0) {
                $.each(datajson.result.datas, function (i, item) {
                    //模板渲染
                    var html = tmpl("tmpl_teaminfopage_detailinfo", item);
                    $(html).appendTo("#teaminfopage_listview").trigger('create');
                });
            }
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});

//车队人员添加显示内容
$(document).on("pagebeforecreate", "#teammemberaddpage", function () {
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
            var selcTaskDom = $("#teammemberaddpage_listview");
            // empty options
            selcTaskDom.empty();
            selcTaskDom.append();
            // 使用模块加载复选框
            for (var i = 0; i < person.length; i++) {
                selcTaskDom.append(tmpl("user_tmpl", person[i]));
                for (var j = 0; j < result.length; j++) {
                    //判断id，将表中出现的人名勾选上
                    if (result[j]["id"] == person[i]["id"]) {
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

//车队人员添加
function addperson() {
    for (var i = 0; i < person.length; i++) {
        if (result.length > 0) {
            for (var j = 0; j < result.length; j++) {
                if ($("#add_" + person[i]["id"]).is(":checked") && result[j]["id"] != person[i]["id"]) {
                    var personid = person[i]["id"];
                    var param = "?token=1&teamid=" + teamteamid + "&personid=" + personid;
                    $.ajax({
                        type: "get",
                        url: domain + url_addTeammember + param,
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
        if (result.length <= 0) {
            if ($("#add_" + person[i]["id"]).is(":checked")) {
                var personid = person[i]["id"];
                var param = "?token=1&teamid=" + teamteamid + "&personid=" + personid;
                $.ajax({
                    type: "get",
                    url: domain + url_addTeammember + param,
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
    confirm("添加成功！");
}

var replaceid;

function teaminfopageclick(id) {
    replaceid = id;
    deleteuserid = replaceid;
    updateuserid = replaceid;
    $(document).on("pageinit", "#teammemberinfo", function () {
        $("#teammemberinfo_team").empty();
        $("#teammemberinfo_unit").empty();
        $.ajax({
            type: "get",
            url: domain + url_getAlluser + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                $.each(data.result.datas, function (i, item) {
                    if (replaceid == item.id) {
                        $("#teammemberinfo_name").val(item.name);
                        $("#teammemberinfo_tel").val(item.phone);
                        $("#teammemberinfo_email").val(item.email);
                        userunitid = item.unitid;
                        userteamid = item.teamid;
                    }
                });
                panduanuserunit();
                panduanuserteam();
            }
        });
    });
}

//保存人员具体信息的修改
function saveTeammember() {
    var username = document.getElementById("teammemberinfo_name").value;
    var userphone = document.getElementById("teammemberinfo_tel").value;
    var useremail;
    if (document.getElementById("teammemberinfo_email").value == "" || document.getElementById("teammemberinfo_email").value == null) {
        useremail = "";
    }
    else {
        useremail = document.getElementById("teammemberinfo_email").value;
    }
    var userunit = $("#teammemberinfo_unit").val();
    var userteam = $("#teammemberinfo_team").val();
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
            confirm("修改成功！");
        }
    });
}
//);

function deleteTeammember() {
    //删除车队人员wy
    //$("#deleteteammember").click(function () {
    var teamid = $("#carteamname").val();
    var param = "?token=1&teamid=" + teamid + "&personid=" + deleteuserid;
    $.ajax({
        type: "get",
        url: domain + url_deleteTeammember + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
    //});
}

function panduanuserunit() {
    var selObj = $("#teammemberinfo_unit");
    //显示所有车队的列表
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (json) {
            if (typeof (json) == "object") {
                //为对象
                teamjson = json;
            }
            else {
                //将字符串转换为对象
                teamjson = JSON.parse(json);
            }
            $("#teammemberinfo_unit").empty();
            selObj.append("<option></option>");
            $.each(teamjson.result.datas, function (i, item) {
                selObj.append("<option value='" + item.id + "'>" + item.name + "</option>");
            });

            var teamNames = document.getElementById("teammemberinfo_unit");
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

function panduanuserteam() {
    var selObj = $("#teammemberinfo_team");
    //显示所有车队的列表
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (json) {
            if (typeof (json) == "object") {
                //为对象
                teamjson = json;
            }
            else {
                //将字符串转换为对象
                teamjson = JSON.parse(json);
            }
            $("#teammemberinfo_team").empty();
            selObj.append("<option></option>");
            $.each(teamjson.result.datas, function (i, item) {
                if (item.teamUnitid == userunitid) {
                    selObj.append("<option value='" + item.id + "'>" + item.name + "</option>");
                }

            });
            var teamNames = document.getElementById("teammemberinfo_team");
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
function unit_carteam() {
    var judgeunitid = $("#teammemberinfo_unit").val();
    //填充车队名称
    $("#teammemberinfo_team").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#teammemberinfo_team").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                if (item.teamUnitid == judgeunitid) {
                    $("#teammemberinfo_team").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }
            });
            var selObj = $("#teammemberinfo_team");
            var option = $($("option", selObj).get(0));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);
        }
    });
}

//车主与单位相关联
function judgeunit_user() {
    var judgeselectuser = $("#unitid").val();
    $("#teamcaptain").empty();
    $.ajax({
        type: "get",
        url: domain + url_getAlluser + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#teamcaptain").append("<option>" + "请选择" + "</option>");
            $.each(data.result.datas, function (i, item) {
                //根据id匹配相应的电话
                if (judgeselectuser == item.unitid) {
                    $("#teamcaptain").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }
            });
            document.getElementById("captainphone").value = "";
            var judgeselObj = $("#teamcaptain");
            var judgeoption = $($("option", judgeselObj).get(0));
            judgeoption.attr('selected', 'selected');
            judgeselObj.selectmenu();
            judgeselObj.selectmenu('refresh', true);
        }
    });
}



