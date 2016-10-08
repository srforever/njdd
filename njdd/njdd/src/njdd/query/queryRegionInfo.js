//定义变量
var datajson;
var userphone;
var selecttype;
var colortype;
var items = new Array();
var mapPoint;
var unitname;
//var njpointresult;
//njpointresult = new Array();

var graphictemp;
var pt;
var njpointresult1;
njpointresult1 = new Array();
var dianx;
var diany;
var unitid = sessionStorage.unitid;
(function (window) {
    $(document).ready(function () {

        var circleX, circleY, queryRadius, circle;
        var markers = [];
        var marker;
        var infoWindow;

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
        var unitname = sessionStorage.userunit;

        var map;
        //加载地图
        loadmap();
        function loadmap() {
            map = new AMap.Map("container", {
                resizeEnable: true,
                zoom: 13
            });
        }

        maptools();
        function maptools() {
            //地图插件
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

        $("#btn_sumbit").click(function () {
        });

        //点击地图
        map.on('click', function (e) {

            circleX = e.lnglat.getLng();
            circleY = e.lnglat.getLat();

            huayuan();

        });

        //获取范围画圆
        function huayuan() {

            map.clearMap();

            markers = [];
            circle = new AMap.Circle({
                map: map,
                center: [circleX, circleY], //设置线覆盖物路径
                radius: document.querySelector("#input_area").value, //获取范围
                strokeColor: "#3366FF", //边框线颜色
                strokeOpacity: 0.3, //边框线透明度
                strokeWeight: 3, //边框线宽
                fillColor: "#FFA500", //填充色
                fillOpacity: 0.35 //填充透明度

            });

            getuserstatue();

        }

        //获取人员位置
        function getuserstatue() {
            njpointresult1 = [];
            $.ajax({
                url: domain + url_userStatus + "?token=1",
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
                    // alert("zhengchang");
                    var a = 0;
                    $.each(datajson.result.datas, function (i, item) {

                        if (circle.contains([item.x, item.y]) == true) {
                            //  alert("这个点在");
                            marker = new AMap.Marker({
                                map: map,
                                position: [item.x, item.y]        //positions[i]
                            });
                            markers.push(marker);

                          //  njpointresult[a] = getdata.result.datas[b];
                            njpointresult1[a] = item;
                            a++;


                            marker.content = item.username;
                            marker.on('click', markerClick);



                        } else {

                          
                        }

                    });
                  
                }
            });

        }

        //点击弹出信息框
        function markerClick(e) {
            infoWindow.setContent(e.target.content);
            infoWindow.open(map, e.target.getPosition());
        }

        //加载农机信息界面
       $(document).on("pagebeforecreate", "#njinfopage", function () {
                        $("#logmanagepage_listview").empty();
   
                                $.each(njpointresult1, function (i, item) {
                               //     if (item.unit_name == unitname) {
                                        njinfopageuser(item);
                                        
                                        //   }

                                });

       });

      //循环追加
      function njinfopageuser(item) {
                    //if (item.unit_name == null) {
                    //    item.unit_name = "无";
                    //}
                    //模板渲染                   
                    var html = tmpl("tmpl_logmanagepage_detailinfo", item);
                    $(html).appendTo("#logmanagepage_listview").trigger('create');
                }

        //        var njpointlayer;
        //        var njpointlayer1;
        //        var njpointlayer2;
        //        var currentX, currentY; //save the latitude and longitude in real-time
        //        var map;
        //        var gl; //use it to create graphic.       
        //        var lastGraphic;
        //        var circle;

        //        //var njpointresult;
        //        var getdata; //全局变量




        //            //信息与checkbox绑定
        //            $(":checkbox").each(function () {

        //                if ($(this).attr("checked") == "checked") {

        //                    $.each(njpointresult, function (i, item) {
        //                        if (item.unit_id == unitid) {
        //                            var symboltemp = new PictureMarkerSymbol('../../dep/image/png/free.png', 20, 20);
        //                            mapPoint = new Point(item.x, item.y, new SpatialReference({ wkid: 4326 }));
        //                            var graphictemp = new Graphic(mapPoint, symboltemp);
        //                            graphictemp.setAttributes({ "username": item.username, "x": item.x, "y": item.y });
        //                            var content = "<b>用户姓名</b>: <strong>${username}</strong> <br/><b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong>";
        //                            var infoTemplate = new InfoTemplate("信息", content);
        //                            graphictemp.setInfoTemplate(infoTemplate);
        //                            njpointlayer.add(graphictemp);

        //                        }



        //                    });
        //                    //alert("只查询本车队");


        //                } else {
        //                    $.each(njpointresult, function (i, item) {
        //                        var symboltemp = new PictureMarkerSymbol('../../dep/image/png/free.png', 20, 20);
        //                        mapPoint = new Point(item.x, item.y, new SpatialReference({ wkid: 4326 }));
        //                        var graphictemp = new Graphic(mapPoint, symboltemp);
        //                        graphictemp.setAttributes({ "username": item.username, "x": item.x, "y": item.y });
        //                        var content = "<b>用户姓名</b>: <strong>${username}</strong> <br/><b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong>";
        //                        var infoTemplate = new InfoTemplate("信息", content);
        //                        graphictemp.setInfoTemplate(infoTemplate);
        //                        njpointlayer.add(graphictemp);

        //                    });
        //                    //alert("查询所有车队");
        //                }
        //            });
        //            //信息与checkbox绑定


        //            $(document).on("pagebeforecreate", "#njinfopage", function () {
        //                $("#logmanagepage_listview").empty();
        //                $(":checkbox").each(function () {

        //                    if ($(this).attr("checked") == "checked") {

        //                        //alert("只查询本车队");
        //                        $.each(njpointresult, function (i, item) {
        //                            if (item.unit_name == unitname) {
        //                                njinfopageuser(item);
        //                            }

        //                        });

        //                    } else {

        //                        $.each(njpointresult, function (i, item) {

        //                            njinfopageuser(item);

        //                        });

        //                        //alert("查询所有车队");
        //                    }
        //                });


        //            });

        //        }


    });
})(window);


//点击追加列表的某一人，追加其个人信息
function njinfo_btn_click(userid) {

    userphone = null;
    $.each(njpointresult1, function (i, item) {
        if (item.unit_name == null) {
            item.unit_name = "无";
        }
        if (item.userid == userid) {
            userphone = item.phone;
            $(document).on("pageinit", "#detailinfopage", function () {
                $("#detailinfopage_username").val(item.username);

                $("#detailinfopage_car_type").val(item.car_type);
                $("#detailinfopage_car_horsepower").val(item.car_horsepower);
                $("#detailinfopage_unit_name").val(item.unit_name);
                $("#detailinfopage_car_code").val(item.car_code);
                $("#detailinfopage_phone").val(item.phone);

            });
            return;
        }


    });

}

//跳转至发送信息
function detailinfopage_smsbtn() {

    if (userphone != null) {
        window.location.href = "sms:" + userphone + "?body=" + $("#writemessage").val();
        document.getElementById("writemessage").value = "";
    }
}