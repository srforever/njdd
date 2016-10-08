
$(document).on("pagecreate", "#unitinputpage", function () {
    readyunit();
    $("#unitadd").hide();
    $("#unitupdate").hide();
    document.getElementById("unitInput").value = "";
    document.getElementById("textarea").value = "";
});

function readyunit() {
    //填充所属单位
    $("#unitselect").empty();
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#unitselect").append("<option >" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#unitselect").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });
            var selObj = $("#unitselect");
            var option = $($("option", selObj).get(0));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);

        }
    });
    document.getElementById("unitInput").value = "";
    $("#unitadd").hide();
    $("#unitupdate").hide();
    document.getElementById("textarea").value = "";
    changedisabled();
}


//内容为“请输入”时添加信息，否则修改信息
function unitChange() {
    var selectstr = $("#unitselect").find("option:selected").text();
    if (selectstr == "请输入") {
        document.getElementById("unitInput").value = "";
        $("#unitadd").hide();
        $("#unitupdate").hide();
        document.getElementById("textarea").value = "";
        changedisabled();
    } else {
        $("#unitadd").hide();
        $("#unitupdate").hide();
        document.getElementById("unitInput").value = selectstr;
        var unitvalue = $("#unitselect").val();
        $.ajax({
            type: "get",
            url: domain + url_getUnit + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                $.each(data.result.datas, function (i, item) {
                    if (unitvalue == item.id) {
                        document.getElementById("textarea").value = item.remark;
                    }
                });
            }
        });
        changedisabled();
    }
}

//转换按钮的disabled属性
function changedisabled() {
    var teamselect = $("#unitselect").find("option:selected").text();
    if (teamselect == "请输入") {
        if (classie_css.has(document.querySelector("#addunit"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#addunit"), "ui-state-disabled");
        }
        if (!classie_css.has(document.querySelector("#updateunit"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#updateunit"), "ui-state-disabled");
        }
        if (!classie_css.has(document.querySelector("#deleteunit"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#deleteunit"), "ui-state-disabled");
        }
    }
    else {
        if (!classie_css.has(document.querySelector("#addunit"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#addunit"), "ui-state-disabled");
        }
        if (classie_css.has(document.querySelector("#updateunit"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#updateunit"), "ui-state-disabled");
        }
        if (classie_css.has(document.querySelector("#deleteunit"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#deleteunit"), "ui-state-disabled");
        }
    }
}

//添加所属单位
function addUnit() {
    if (document.getElementById("unitInput").value == "" || document.getElementById("unitInput").value == null) {
        $("#unitadd").show();
    }
    else {
        var unitadd = document.getElementById("unitInput").value;
        var remarkadd;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            remarkadd = "";
        }
        else {
            remarkadd = document.getElementById("textarea").value;
        }
        var param = "?token=1&name=" + unitadd + "&remark=" + remarkadd;
        $.ajax({
            type: "get",
            url: domain + url_addUnit + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("添加成功！");
                readyunit();
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//修改所属单位
function updateUnit() {
    var unitname = document.getElementById("unitInput").value;
    var unit = $("#unitselect").find("option:selected").text();
    var unitchangeremark = document.getElementById("textarea").value;
    var reunitvalue = $("#unitselect").val();
    var reunitremark;
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $.each(data.result.datas, function (i, item) {
                if (reunitvalue == item.id) {
                    reunitremark = item.remark;
                }
            });
            saveunitchange(unitname,unit,unitchangeremark,reunitremark);
        }
    });
}
function saveunitchange(unitname, unit, unitchangeremark, reunitremark) {
    if (unitname == unit && unitchangeremark == reunitremark) {
        $("#unitupdate").show();
    }
    else {
        var unitid = $("#unitselect").val();
        var unitremarkchange;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null)
            unitremarkchange = "";
        else
            unitremarkchange = document.getElementById("textarea").value;
        var param = "?token=1&id=" + unitid + "&newName=" + unitname + "&remark=" + unitremarkchange;
        $.ajax({
            type: "get",
            url: domain + url_updateUnit + param,
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

//删除所属单位
function deleteUnit() {
    var unitid = $("#unitselect").val();
    var param = "?token=1&id=" + unitid;
    $.ajax({
        type: "get",
        url: domain + url_deleteUnit + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
            readyunit();
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}