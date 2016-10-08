(function (window) {
    $(document).ready(function () {

    //设置界面布局
    (function () {
        var screen = $.mobile.getScreenHeight(),
                    header = $("#main-header").hasClass("ui-header-fixed") ? $("#main-header").outerHeight() - 1 : $("#main-header").outerHeight(),
                    footer = $("#main-footer").hasClass("ui-footer-fixed") ? $("#main-footer").outerHeight() - 1 : $("#main-footer").outerHeight(),
                    contentCurrent = $("#main-content").outerHeight() - $("#main-content").height(),
                    content = screen - header - footer - contentCurrent;
                   $("#main-content").height(content);
                   $("#taskDraw-content").height(content);
                   $("#essenDraw-content").height(content);
                   $("#editTask-content").height(content);
                   $("#editEssence-content").height(content);
                   $("#convert-content").height(content);
    })();
    var map;
    var marker, polyline;
    var polylineArr = [];

    //加载地图
    loadmap();   
    function loadmap()
    {
             map = new AMap.Map("container", {
                resizeEnable: true,              
                zoom: 13
            });
    }
       
    // 设置农机编号选项
    setCarSelection();
    function setCarSelection() {
                    var carData = getAllCar();
                    // 检查是否有数据
                    if (carData == null) return;

                    var selcDom = $("#sele_car");
                    // empty options
                    selcDom.empty();

                    selcDom.append("<option value='-1'>请选择农机</option>");

                    var taskItems = carData["result"]["datas"];
                    for (var i = 0; i < taskItems.length; i++) {
                        var opt = "<option value='" + taskItems[i].id + "'>" + taskItems[i].car_code + "</option>";
                        selcDom.append(opt);
                    }

                    var option = $($("option", selcDom).get(0));
                    option.attr('selected', 'selected');
                    selcDom.selectmenu();
                    selcDom.selectmenu('refresh', true);
                }

    // 获得所有农机数据
    function getAllCar() {
                    var paramStr = "?token=1";
                    var data;
                    $.ajax({
                        type: "get",
                        async: false, //同步执行
                        url: domain + url_getCarInfo + paramStr,
                        dataType: "json",
                        timeout: 3000,
                        success: function (result) {
                            if (result.message.statusCode == 200) {
                                data = result;
                            }
                            else {
                                data = null;
                            }
                        },
                        error: function (errorMsg) {
                            data = null;
                            alert("出错,无法查询任务\n" + errorMsg.toString());
                        }
                    });


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

                    return data;
                }

    //查询点击按钮
    $(document).ready(function () {
                    $("#btn_start").on("click", function () {
                        var value = $("#sele_car").val();
                        if (value != "-1") {
                            drawData(value);
                        } else {
                            alert("您未选择农机");
                        }
                    });
    });

    // 绘制历史轨迹,value为农机id
    function drawData(value) {

        var markpointx, markpointy;
        //getstarttime = $('#getstarttime').datebox('getValue');
        //getendtime = $('#getendtime').datebox('getValue');
        jsondata = [];
        polylineArr = [];


        //var mm = map.getAllOverlays();
        //if (mm.length > 0) {
        //    marker.setMap(null);
        //    polyline.setMap(null);
        //}

        map.clearMap();


                    var paramStr = "?token=1&carid="+value+"&starttime=" + document.querySelector("#input_startime").value + "%2011:49:45&endtime=" + document.querySelector("#input_endtime").value + "%2011:49:45";
                    var jsondata;
                    console.log(domain + url_queryHistory + paramStr);
                    $.ajax({
                        type: "get",
                        url: domain + url_queryHistory + paramStr,
                        async: false,
                        success: function (data) {
                           
                            jsondata = data.result.datas;
                            $.each(jsondata, function (i, item) {
                                polylineArr.push([item.x, item.y]);

                                markpointx = jsondata[0].x;
                                markpointy = jsondata[0].y;
                            });

                        },
                        error: function (errorMsg) {
                            alert("请求数据失败\n" + errorMsg.toString());
                        }
                    });

                    //drawPoint(jsondata);
        //drawLined(jsondata);

        // 绘制轨迹
                    polyline = new AMap.Polyline({
                        map: map,
                        path: polylineArr,
                        strokeColor: "#00A",  //线颜色
                        strokeOpacity: 1,     //线透明度
                        strokeWeight: 3,      //线宽
                        strokeStyle: "solid"  //线样式
                    });
                    map.setFitView();

                    marker = new AMap.Marker({
                        map: map,
                        position: [markpointx, markpointy],
                        icon: "http://webapi.amap.com/images/car.png",
                        offset: new AMap.Pixel(-26, -13),
                        autoRotation: true
                    });


    }

   //点击按钮动画事件
    var btsw = 1;
    $("#btswitch").on("click", function () {        
            if (btsw % 2 == 1) {
                marker.moveAlong(polylineArr, 10000);
            }

            if (btsw % 2 == 0) {
                marker.stopMove();
            }

            btsw++;            
    });

    });
})(window);
