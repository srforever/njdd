var datajson;
var userphone;
var selecttype;
(function (window) {

    $(document).ready(function () {
        // 初始化页面中content的高度（高度为设备高减去header和footer高的高度）
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
        var infoWindow;
        var markers = [];


        //加载地图
        loadmap();
        function loadmap() {
            map = new AMap.Map("container", {
                resizeEnable: true,
                zoom: 13
            });
        }

        //地图插件
        maptools();
        function maptools() {

            AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Driving', 'AMap.MouseTool', 'AMap.MouseTool', "AMap.MapType", "AMap.OverView", 'AMap.Geolocation', "AMap.RangingTool"], function () {

                map.addControl(new AMap.ToolBar());  //加载平移缩放控件
                map.addControl(new AMap.Scale());    //加载比例尺    
                map.addControl(new AMap.OverView());
                infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });


                //地图类型切换
                var type = new AMap.MapType({
                    defaultType: 0 //使用2D地图
                });
                map.addControl(type);

            });

        }

        getAllUsers("0");
       
        //点击查询按钮
        document.getElementById("condouctpage_querybtn").onclick = function () { condoctpage_querybtn_click(); };
        function condoctpage_querybtn_click() {
             var selectval = $("#condouctpage_select").val();
             getAllUsers(selectval);
            // alert(selectval);
        }

        //获取农机状态
        function getAllUsers(selectval) {
                    map.clearMap();
                    $.ajax({
                        url: domain+url_userStatus+"?token=1",
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

                            $.each(datajson.result.datas, function (i, item) {
                                switch (item.status) {
                                    case "空闲":
                                        if (selectval == "0" || selectval == "1") {
                                            suregraphic("free", item);
                                            selecttype = item.status;
                                        }
                                        break;
                                    case "停靠超时":

                                        if (selectval == "0" || selectval == "2") {
                                            suregraphic("overrest", item);
                                            selecttype = item.status;
                                        }
                                        break;
                                    case "疲劳驾驶":

                                        if (selectval == "0" || selectval == "3") {
                                            suregraphic("tireDriving", item);
                                            selecttype = item.status;
                                        }
                                        break;
                                    case "超速":

                                        if (selectval == "0" || selectval == "4") {
                                            suregraphic("Speeding", item);
                                            selecttype = item.status;
                                        }
                                        break;
                                    case "超出区域范围":
                                        if (selectval == "0" || selectval == "5") {
                                            suregraphic("overrange", item);
                                            selecttype = item.status;
                                        }
                                        break;
                                    case "正常":
                                        if (selectval == "0" || selectval == "6") {
                                            suregraphic("executing", item);
                                            selecttype = item.status;
                                        }
                                        break;
                                    default:
                                }
                            });
                            if (selectval == '0') {
                                selecttype = "所有用户";
                            }
                        }

                    });
        }

        //渲染每种状态的marker
        function suregraphic(picname,item) {

          var   marker = new AMap.Marker({
                map: map,
                icon:"../../dep/jquery-mobile/images/icons-png/" + picname + ".png",

                    //{
                    //   size: new AMap.Size(20, 20),  //图标大小
                      
                    //  },
                    
                position: [item.x, item.y]  
            });
            markers.push(marker);
            marker.content = item.username;
            marker.on('click', markerClick);

        }

        //地图上点点击窗体
        function markerClick(e) {
            infoWindow.setContent(e.target.content);
            infoWindow.open(map, e.target.getPosition());
        }



    });


})(window);


//左上角点击按钮/获取相关信息
$(document).on("pagebeforecreate", "#njinfopage", function () {
    $.each(datajson.result.datas, function (i, item) {
        if (selecttype == "所有用户") {
            njinfopageuser(item);
        } else if (item.status == selecttype) {
            njinfopageuser(item);
        }

    });

});

//获取相关人员列表
function njinfopageuser(item) {
    if (item.unit_name == null) {
        item.unit_name = "无";
    }

    var html = tmpl("tmpl_conduct_detailinfo", item);
    $(html).appendTo("#njinfopage_listview").trigger('create');
}

//点击特定人员显示其相关信息
function njinfo_btn_click(id) {
    userphone = null;
    $.each(datajson.result.datas, function (i, item) {
        if (item.unit_name == null) {
            item.unit_name = "无";
        }
        if (item.userid == id) {
            userphone = item.phone;
            $(document).on("pageinit", "#detailinfopage", function () {
                $("#detailinfopage_username").html(item.username);
                $("#detailinfopage_carname").html(item.car_brand);
                $("#detailinfopage_power").html(item.car_horsepower);
            });
            return;
        }

        
    });
}

//点击发送消息
function detailinfopage_smsbtn_click() {
    //alert($("#detailinfopage_smsinfo").val());
    if (userphone!=null) {
        window.location.href = "sms:" + userphone + "?body=" + $("#detailinfopage_smsinfo").val();
        
        document.getElementById("writemessage").value = "";

       
    }
}






