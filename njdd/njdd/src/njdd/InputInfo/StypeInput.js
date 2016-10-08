$(document).on("pagecreate", "#stypeinputpage", function () {
    readycartype();
    $("#typeadd").hide();
    $("#typeupdate").hide();
    document.getElementById("Styleinput").value = "";
    document.getElementById("textarea").value = "";
});

function readycartype() {
    //加载农机类型select的内容
    $("#StyleSelect").empty();
    $.ajax({
        type: "get",
        url: domain + url_getCartype + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#StyleSelect").append("<option>" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#StyleSelect").append("<option value='" + item.id + "'>" + item.type + "</option>");
            });
            var selObj = $("#StyleSelect");
            var option = $($("option", selObj).get(0));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);
        }
    });
    $("#typeadd").hide();
    $("#typeupdate").hide();
    document.getElementById("Styleinput").value = "";
    document.getElementById("textarea").value = "";
    changedisabled();
}

var typeremark;
//内容为“请输入”时添加信息，否则修改信息
function cartypechange() {
    $("#typeadd").hide();
    $("#typeupdate").hide();
    var selectstr = $("#StyleSelect").find("option:selected").text();
    if (selectstr == "请输入") {
        document.getElementById("Styleinput").value = "";
        document.getElementById("textarea").value = "";
        changedisabled();
    } else {
        document.getElementById("Styleinput").value = selectstr;
        var typevalue = $("#StyleSelect").val();
        $.ajax({
            type: "get",
            url: domain + url_getCartype + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                $.each(data.result.datas, function (i, item) {
                    if (typevalue == item.id) {
                        document.getElementById("textarea").value = item.remark;
                        typeremark = item.remark;
                    }
                });
            }
        });
        changedisabled();
    }
}

//转换按钮的disabled属性
function changedisabled() {
    var teamselect = $("#StyleSelect").find("option:selected").text();
    if (teamselect == "请输入") {
        if (classie_css.has(document.querySelector("#addCartype"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#addCartype"), "ui-state-disabled");
        }
        if (!classie_css.has(document.querySelector("#updateCartype"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#updateCartype"), "ui-state-disabled");
        }
        if (!classie_css.has(document.querySelector("#deleteCartype"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#deleteCartype"), "ui-state-disabled");
        }
    }
    else {
        if (!classie_css.has(document.querySelector("#addCartype"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#addCartype"), "ui-state-disabled");
        }
        if (classie_css.has(document.querySelector("#updateCartype"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#updateCartype"), "ui-state-disabled");
        }
        if (classie_css.has(document.querySelector("#deleteCartype"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#deleteCartype"), "ui-state-disabled");
        }
    }
}

//添加农机类型
function addCartype() {
    if (document.getElementById("Styleinput").value == "" || document.getElementById("Styleinput").value == null) {
        $("#typeadd").show();
    }
    else {
        var typeadd = document.getElementById("Styleinput").value;
        var remarkadd;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            remarkadd = "";
        }
        else {
            remarkadd = document.getElementById("textarea").value;
        }
        var param = "?token=1&type=" + typeadd + "&remark=" + remarkadd;
        $.ajax({
            type: "get",
            url: domain + url_addCartype + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("添加成功！");
                readycartype();
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//修改农机类型
function updateCartype() {
    var typechange = document.getElementById("Styleinput").value;
    var type = $("#StyleSelect").find("option:selected").text();
    var typechangeremark = document.getElementById("textarea").value;
    if (typechange == type && typechangeremark == typeremark) {
        $("#typeupdate").show();
    }
    else {
        var cartypeid = $("#StyleSelect").val();
        var cartypename = document.getElementById("Styleinput").value;
        var cartyperemark;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            cartyperemark = "";
        }
        else {
            cartyperemark = document.getElementById("textarea").value;
        }
        var param = "?token=1&type=" + cartypename + "&remark=" + cartyperemark + "&typeid=" + cartypeid;
        $.ajax({
            type: "get",
            url: domain + url_addCartype + param,
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

//删除农机类型
function deleteCartype() {
    var typeid = $("#StyleSelect").val();
    var param = "?token=1&id=" + typeid;
    $.ajax({
        type: "get",
        url: domain + url_deleteCartype + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
            readycartype();
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}