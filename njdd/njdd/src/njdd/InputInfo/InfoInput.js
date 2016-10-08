$(document).on("pageinit", "#infoinputpage", function () {
    //显示所有农机车牌  
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
                var selObj = $("#number");
                selObj.append("<option>" + "请选择" + "</option>");
                $.each(carjson.result.datas, function (i, item) {
                    if (sessionStorage.unitid == item.car_unitid) {
                        selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                    }
                });
                if (sessionStorage.carid == "" || sessionStorage.carid == null) {
                    var option = $($("option", selObj).get(b));
                    option.attr('selected', 'selected');
                    selObj.selectmenu();
                    selObj.selectmenu('refresh', true);
                } else {
                    var teamNames = document.getElementById("number");
                    for (var b = 0, lenteamNames = teamNames.length; b < lenteamNames; b++) {
                        if (teamNames.options[b].value == sessionStorage.carid) {
                            var option = $($("option", selObj).get(b));
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

function infoinputpage_selectcar_change() {
    sessionStorage.carid = $("#number").val();
}
