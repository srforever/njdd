var carjson;
var personmanagejson;

function setpage_selectcar_change() {
    sessionStorage.carid = $("#setpage_selectcar").val();
    //alert(sessionStorage.carid);
}

$(document).on("pageinit", "#setpage", function () {
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
                var selObj = $("#setpage_selectcar");
                selObj.append("<option value='" + "-1" + "'>" + "请选择" + "</option>");
                $.each(carjson.result.datas, function (i, item) {
                    if (sessionStorage.unitid == item.car_unitid) {
                        selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                    }
                });
                var opList = document.getElementById("setpage_selectcar");
                if (sessionStorage.carid == "") {
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



