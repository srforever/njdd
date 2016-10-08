var carjson;

$(document).on("pageinit", "#mainpage", function () {

    $("#mainpage_setbtn").html(sessionStorage.name);
   
    $.ajax({
        url: domain + url_getCarInfo + "?token=1",
        type: 'get',
        async: false,
        success: function (json) {

            if (typeof (json) == "object") {
                //为对象
                carjson = json;
            }
            else {
                //将字符串转换为对象
                carjson = JSON.parse(json);
            }
            if (carjson.result.datas.length > 0) {
                var selObj = $("#mainpage_selectcar");
                $.each(carjson.result.datas, function (i, item) {
                    if (sessionStorage.userid == item.car_ownerid) {//问题在这里，checkbox
                        if (sessionStorage.carid == "") {
                            sessionStorage.carid = item.id;
                        }
                        sessionStorage.userunit = item.car_userunit;
                        sessionStorage.groupname = item.car_userteam;
                    }
                });
                selObj.append("<option value='" + "-1" + "'>" + "请选择" + "</option>");
                $.each(carjson.result.datas, function (i, item) {
                    if (sessionStorage.unitid == item.car_unitid) {
                        selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                    }
                });
                var opList = document.getElementById("mainpage_selectcar");
                if (sessionStorage.carid == "" || sessionStorage.carid == null) {
                    var option = $($("option", selObj).get(0));
                    option.attr('selected', 'selected');
                    selObj.selectmenu();
                    selObj.selectmenu('refresh', true);
                }
                else {
                    for (var j = 0, len = opList.length; j < len; j++) {
                        if (opList.options[j].value == sessionStorage.carid) {
                            var option = $($("option", selObj).get(j));
                            option.attr('selected', 'selected');
                            selObj.selectmenu();
                            selObj.selectmenu('refresh', true);
                            break;
                        }
                    }
                }
            }
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });

});

function getcarid() {
    sessionStorage.carid = $("#mainpage_selectcar").val();  
}


