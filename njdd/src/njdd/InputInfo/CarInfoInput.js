$(document).on("pagecreate", "#carinfoinputpage", function () {
    readycode();
    $("#caradd").hide();
    document.getElementById("carcodeinput").value = "";
    document.getElementById("carbrand").value = "";
    document.getElementById("carhorsepower").value = "";
    //加载农机类型select的内容
    $("#cartype").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getCartype + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#cartype").append("<option></option>");
            $("#cartype").append("<option>" + "请选择" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#cartype").append("<option value='" + item.id + "'>" + item.type + "</option>");
            });
            var selObj = $("#cartype");
            var option = $($("option", selObj).get(1));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);
        }
    });
    //填充农机车主
    $("#owner").empty();
    $("#owner").append("<option >" + "请选择" + "</option>");
    var sel = $("#owner");
    var ops = $($("option", sel).get(0));
    ops.attr('selected', 'selected');
    sel.selectmenu();
    sel.selectmenu('refresh', true);
    document.getElementById("tel").value = "";

    //填充所属单位、
    $("#unit").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#unit").append("<option></option>");
            $("#unit").append("<option>" + "请选择" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#unit").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });
            var selObj = $("#unit");
            var option = $($("option", selObj).get(1));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);
        }
    });


    document.getElementById("textarea").value = "";
});

function readycode() {
    //填充农机编号
    $("#carcode").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getCarInfo + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#carcode").append("<option></option>");
            $("#carcode").append("<option>" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                if (sessionStorage.unitid == item.car_unitid) {
                    $("#carcode").append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                }
            });
            var selObj = $("#carcode");
            var option = $($("option", selObj).get(1));
            option.attr('selected', 'selected');
            selObj.selectmenu();
            selObj.selectmenu('refresh', true);
        }
    });
    $("#caradd").hide();
    document.getElementById("carcodeinput").value = "";
    document.getElementById("carbrand").value = "";
    document.getElementById("carcodeinput").disabled = false;
    document.getElementById("carhorsepower").value = "";
    var selObj1 = $("#cartype");
    var option1 = $($("option", selObj1).get(1));
    option1.attr('selected', 'selected');
    selObj1.selectmenu();
    selObj1.selectmenu('refresh', true);
    var selObj2 = $("#owner");
    var option2 = $($("option", selObj2).get(0));
    option2.attr('selected', 'selected');
    selObj2.selectmenu();
    selObj2.selectmenu('refresh', true);
    document.getElementById("tel").value = "";
    var selObj3 = $("#unit");
    var option3 = $($("option", selObj3).get(1));
    option3.attr('selected', 'selected');
    selObj3.selectmenu();
    selObj3.selectmenu('refresh', true);
    document.getElementById("tel").value = "";
    document.getElementById("textarea").value = "";
    changedisabled();
}

//内容为“请输入”时添加信息，否则修改信息
function toolschange() {
    $("#caradd").hide();
    var toolselect = $("#carcode").find("option:selected").text();
    if (toolselect == "请输入") {
        //内容清空
        document.getElementById("carcodeinput").value = "";
        document.getElementById("carbrand").value = "";
        document.getElementById("carcodeinput").disabled = false;
        document.getElementById("carhorsepower").value = "";
        var selObj1 = $("#cartype");
        var option1 = $($("option", selObj1).get(1));
        option1.attr('selected', 'selected');
        selObj1.selectmenu();
        selObj1.selectmenu('refresh', true);
        var selObj2 = $("#owner");
        var option2 = $($("option", selObj2).get(0));
        option2.attr('selected', 'selected');
        selObj2.selectmenu();
        selObj2.selectmenu('refresh', true);
        document.getElementById("tel").value = "";
        var selObj3 = $("#unit");
        var option3 = $($("option", selObj3).get(1));
        option3.attr('selected', 'selected');
        selObj3.selectmenu();
        selObj3.selectmenu('refresh', true);
        document.getElementById("tel").value = "";
        document.getElementById("textarea").value = "";
        changedisabled();
    }
    else {

        //填充相应信息
        var carid = $("#carcode").val();
        $.ajax({
            type: "get",
            url: domain + url_getCarInfo + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                teamdata = data.result.datas;
                $.each(data.result.datas, function (i, item) {
                    if (carid == item.id) {
                        document.getElementById("carcodeinput").value = item.car_code;
                        document.getElementById("carcodeinput").disabled = true;
                        document.getElementById("carbrand").value = item.car_brand;
                        document.getElementById("carhorsepower").value = item.car_horsepower;
                        var opLst = document.getElementById("cartype");
                        for (var j = 0, len = opLst.length; j < len; j++) {
                            var cartypeid = item.typeid;
                            if (opLst.options[j].value == cartypeid) {
                                var selObj = $("#cartype");
                                var option = $($("option", selObj).get(j));
                                option.attr('selected', 'selected');
                                selObj.selectmenu();
                                selObj.selectmenu('refresh', true);
                                break;
                            }
                        }
                        var opList = document.getElementById("unit");
                        for (var j = 0, len = opList.length; j < len; j++) {
                            if (opList.options[j].value == item.car_unitid) {
                                var selObj = $("#unit");
                                var option = $($("option", selObj).get(j));
                                option.attr('selected', 'selected');
                                selObj.selectmenu();
                                selObj.selectmenu('refresh', true);
                                break;
                            }
                        }
                        var carunitid = item.car_unitid;
                        $("#owner").empty();//清空
                        $.ajax({
                            type: "get",
                            url: domain + url_getAlluser + "?token=1",
                            async: true,
                            dataType: 'json',
                            success: function (data) {
                                $("#owner").append("<option >" + "请选择" + "</option>");
                                $.each(data.result.datas, function (i, item) {
                                    if (carunitid == item.unitid) {
                                        $("#owner").append("<option value='" + item.id + "'>" + item.name + "</option>");
                                    }
                                });
                                unit_owner(item.car_ownerid, item.car_userphone, item.remark);
                            }
                        });
                    }
                });
            }
        });
        changedisabled();
    }
}

function unit_owner(car_ownerid, car_userphone, remark) {
    var op = document.getElementById("owner");
    if (car_ownerid == "") {
        var selObj = $("#owner");
        var option = $($("option", selObj).get(0));
        option.attr('selected', 'selected');
        selObj.selectmenu();
        selObj.selectmenu('refresh', true);
    }
    else {
        for (var j = 0, len = op.length; j < len; j++) {
            if (op.options[j].value == car_ownerid) {
                var selObj = $("#owner");
                var option = $($("option", selObj).get(j));
                option.attr('selected', 'selected');
                selObj.selectmenu();
                selObj.selectmenu('refresh', true);
                break;
            }
        }
    }
    document.getElementById("tel").value = car_userphone;
    document.getElementById("textarea").value = remark;
}

//转换按钮的disabled属性
function changedisabled() {
    var teamselect = $("#carcode").find("option:selected").text();
    if (teamselect == "请输入") {
        if (classie_css.has(document.querySelector("#addtools"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#addtools"), "ui-state-disabled");
        }
        if (!classie_css.has(document.querySelector("#updatetools"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#updatetools"), "ui-state-disabled");
        }
        if (!classie_css.has(document.querySelector("#deletetools"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#deletetools"), "ui-state-disabled");
        }
    }
    else {
        if (!classie_css.has(document.querySelector("#addtools"), "ui-state-disabled")) {
            classie_css.add(document.querySelector("#addtools"), "ui-state-disabled");
        }
        if (classie_css.has(document.querySelector("#updatetools"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#updatetools"), "ui-state-disabled");
        }
        if (classie_css.has(document.querySelector("#deletetools"), "ui-state-disabled")) {
            classie_css.remove(document.querySelector("#deletetools"), "ui-state-disabled");
        }
    }
}

//车主名与电话一致化
function ownerchange() {
    var selectcaptain = $("#owner").val();
    $.ajax({
        type: "get",
        url: domain + url_getAlluser + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $.each(data.result.datas, function (i, item) {
                if (selectcaptain == item.id) {
                    document.getElementById("tel").value = item.phone;
                }
            });

        }
    });
}

//删除农具
function deleteTools() {
    var teamid = $("#carcode").val();
    var param = "?token=1&id=" + teamid;
    $.ajax({
        type: "get",
        url: domain + url_deleteCar + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
            readycode();
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//修改农具
function updateTools() {
    var carcodeid = $("#carcode").val();
    var carcode = document.getElementById("carcodeinput").value;
    var brand;
    if (document.getElementById("carbrand").value == "" || document.getElementById("carbrand").value == null) {
        brand = "";
    }
    else {
        brand = document.getElementById("carbrand").value;
    }

    var type = $("#cartype").val();
    var horsepower;
    if (document.getElementById("carhorsepower").value == "" || document.getElementById("carhorsepower").value == null) {
        horsepower = "";
    }
    else {
        horsepower = document.getElementById("carhorsepower").value;
    }
    var user = $("#owner").val();
    var remark;
    if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
        remark = "";
    }
    else {
        remark = document.getElementById("textarea").value;
    }
    var unit = $("#unit").val();
    var param = "?token=1&carCode=" + carcode + "&remark=" + remark + "&carBrand=" + brand + "&typeid=" + type + "&carHorsepower=" + horsepower + "&carOwnerid=" + user + "&carUnitid=" + unit + "&id=" + carcodeid;
    $.ajax({
        type: "get",
        url: domain + url_addCar + param,
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

//添加农具
function addTools() {
    if (document.getElementById("carcodeinput").value == "" || document.getElementById("carcodeinput").value == null) {
        $("#caradd").hide();
    }
    else {
        var carcode = document.getElementById("carcodeinput").value;
        var brand;
        if (document.getElementById("carbrand").value == "" || document.getElementById("carbrand").value == null) {
            brand = "";
        }
        else {
            brand = document.getElementById("carbrand").value;
        }

        var tooltype = $("#cartype").val();
        var horsepower;
        if (document.getElementById("carhorsepower").value == "" || document.getElementById("carhorsepower").value == null) {
            horsepower = "";
        }
        else {
            horsepower = document.getElementById("carhorsepower").value;
        }
        var user = $("#owner").val();
        var remark;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            remark = "";
        }
        else {
            remark = document.getElementById("textarea").value;
        }
        var unit = $("#unit").val();
        var param = "?token=1&carCode=" + carcode + "&remark=" + remark + "&carBrand=" + brand + "&typeid=" + tooltype + "&carHorsepower=" + horsepower + "&carOwnerid=" + user + "&carUnitid=" + unit;
        $.ajax({
            type: "get",
            url: domain + url_addCar + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("添加成功！");
                readycode();
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

function judgeunit() {
    var judgeselectuser = $("#unit").val();
    $("#owner").empty();
    $.ajax({
        type: "get",
        url: domain + url_getAlluser + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#owner").append("<option>" + "请选择" + "</option>");
            $.each(data.result.datas, function (i, item) {
                //根据id匹配相应的电话
                if (judgeselectuser == item.unitid) {
                    $("#owner").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }
            });
            document.getElementById("tel").value = "";
            var judgeselObj = $("#owner");
            var judgeoption = $($("option", judgeselObj).get(0));
            judgeoption.attr('selected', 'selected');
            judgeselObj.selectmenu();
            judgeselObj.selectmenu('refresh', true);
        }
    });
}