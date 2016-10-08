//Task execution

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
            $("#editTask-content").height(content);
        })();

                var currentX, currentY; //save the latitude and longitude in real-time
                // flags of the style of buttons
                var startBtnEnable, pauseBtnEnable, comptBtnEnable;
                // flags of the status of users.
                var isResting, isPausing, isExecuting, isCompleting;
                // button element
                var elemBtnStart, elemBtnPause, elemBtnCompt;

                var lastGraphic;

                var taskid, userid, carid;

                var intervalTime;

                // record the start time of pause or work.
                var startPauseTime, startWorkTime;
                // 存放所有任务数据
                var taskData;

                var wkt;
                wkt = new Wkt.Wkt();

                ///////////////////////////////////////////////////////
                // initialData
                (function () {
                    startBtnEnable = true;
                    pauseBtnEnable = comptBtnEnable = false;
                    isResting = true;
                    isPausing = isExecuting = isCompleting = false;
                    lastGraphic = null;
                    taskid = "";
                    userid = sessionStorage.userid;
                    carid = sessionStorage.carid;
                    intervalTime = 120000;//120000
                    elemBtnStart = document.querySelector("#btn_start");
                    elemBtnPause = document.querySelector("#btn_pause");
                    elemBtnCompt = document.querySelector("#btn_compt");
                   // wkt = new Wkt.Wkt();
                })();


                var map;
                var polygonArr = new Array();//多边形覆盖物节点坐标数组
                var polygonarray = [];
                var geolocation;

        //初始化时间
         setSelectTask();
        
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
                //infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });


                //地图类型切换
                var type = new AMap.MapType({
                    defaultType: 0 //使用2D地图
                });
                map.addControl(type);

            });

        }

        intdatastion();
        function intdatastion() {
            map.plugin('AMap.Geolocation', function () {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition: 'RB'
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
            });


            //解析定位结果
            function onComplete(data) {
             
                currentX = data.position.getLng();
                currentY = data.position.getLat();
             
            }
            //解析定位错误信息
            function onError(data) {
                alert('定位失败');
            }
        }

        //Set timer to set position and save it.
        window.setInterval(function () {
            //setPosition(function() {
            //    drawPoint();
            //    saveInfo();
            //    checkProblem();
            //});
                intdatastion();
                saveInfo();
                checkProblem();
        }, intervalTime);

                // insert task options into select dom.
        function setSelectTask() {
                    taskData = getUserTask(userid);

                    var selcDom = $("#sele_task");
                    // empty options
                    selcDom.empty();

                    var initIndex = 0;

                    var optionSum = 0;
                    selcDom.append("<option value='-1'>请选择任务</option>");

                    if (taskData != null) {
                        var taskItems = taskData["result"]["datas"];
                        for (var i = 0; i < taskItems.length; i++) {
                            if (taskItems[i].status != "完成任务") {
                                var workData = getUserWork(taskItems[i].workid);
                                if (workData != null) {
                                    if (workData.result.datas.length > 0) {
                                        optionSum++;
                                        var opt = "<option value='" + taskItems[i].id + "'>" + workData.result.datas[0].name + "</option>";
                                        selcDom.append(opt);
                                        if (taskItems[i].status == "执行中") {
                                            openExecutingStatus();
                                            initIndex = optionSum;
                                        }
                                        if (taskItems[i].status == "休息") {
                                            openPausingStatus();
                                            initIndex = optionSum;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var option = $($("option", selcDom).get(initIndex));
                    option.attr('selected', 'selected');
                    selcDom.selectmenu();
                    selcDom.selectmenu('refresh', true);
                    // 如果选择项都是"未执行"的任务，则切换为Resting状态
                    // 否则让select标签不可选
                    if (initIndex == 0) {
                        selcDom.attr("disabled", false);
                        openRestingStatus();
                    } else {
                        alert("您有未完成的任务,无法选择其他新任务");
                        selcDom.attr("disabled", true);
                    }
                }

                // 得到用户的所有任务.
        function getUserTask(queryUserid) {
                    var paramStr = "?token=1&userid=" + queryUserid;
                    var data;
                    $.ajax({
                        type: "get",
                        async: false, //同步执行
                        url: domain + url_executionGetTask + paramStr,
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
                    return data;
        }

                // 通过workid获取作业数据
        function getUserWork(workid) {
                    var paramStr = "?token=1&workid=" + workid;
                    var data;
                    $.ajax({
                        type: "get",
                        async: false, //同步执行
                        url: domain + url_executionGetWork + paramStr,
                        dataType: "json",
                        timeout: 3000,
                        success: function (result) {
                            if (result.message.statusCode == 200)
                                data = result;
                            else {
                                data = null;
                            }
                        },
                        error: function (errorMsg) {
                            data = null;
                            alert("出错,无法查询任务\n" + errorMsg.toString());
                        }
                    });
                    return data;
        }

        //开始工作
        function openExecutingStatus() {
            // record start time of work
            startWorkTime = new Date();
            startBtnEnable = false;
            pauseBtnEnable = comptBtnEnable = true;
            isExecuting = true;
            isPausing = isCompleting = isResting = false;
        }

        //暂停任务
        function openPausingStatus() {
            // record start time of pause
            startPauseTime = new Date();
            pauseBtnEnable = false;
            startBtnEnable = comptBtnEnable = true;
            isPausing = true;
            isExecuting = isCompleting = isResting = false;
        }

        //打开完成状态
        function openCompletingStatus() {
            startBtnEnable = pauseBtnEnable = comptBtnEnable = false;
            isCompleting = true;
            isExecuting = isPausing = isResting = false;
        }

        //打开休息状态
        function openRestingStatus() {
            startBtnEnable = true;
            pauseBtnEnable = comptBtnEnable = false;
            isCompleting = true;
            isExecuting = isPausing = isResting = false;
        }

        //选择任务后点击确定
        $("#btn_makeTask").on("click", function () {
                // 得到所有任务
                var value = $("#sele_task").val();
                // 值为-1说明未选择任务
                if (value != "-1") {
                    taskid = value;
                    switchBtnClass();
                    drawWorkRange(value);
                } else {
                    alert("您未选择任务");
                }
        });

        //Switch the button class
        function switchBtnClass() {
            //Control start buttion
            if (startBtnEnable) {
                if (classie_css.has(elemBtnStart, "ui-state-disabled")) {
                    classie_css.remove(elemBtnStart, "ui-state-disabled");
                }
            }
            else {
                if (!classie_css.has(elemBtnStart, "ui-state-disabled")) {
                    classie_css.add(elemBtnStart, "ui-state-disabled");
                }
            }
            //Control pause buttion
            if (pauseBtnEnable) {
                if (classie_css.has(elemBtnPause, "ui-state-disabled")) {
                    classie_css.remove(elemBtnPause, "ui-state-disabled");
                }
            }
            else {
                if (!classie_css.has(elemBtnPause, "ui-state-disabled")) {
                    classie_css.add(elemBtnPause, "ui-state-disabled");
                }
            }
            //Control completion buttion
            if (comptBtnEnable) {
                if (classie_css.has(elemBtnCompt, "ui-state-disabled")) {
                    classie_css.remove(elemBtnCompt, "ui-state-disabled");
                }
            }
            else {
                if (!classie_css.has(elemBtnCompt, "ui-state-disabled")) {
                    classie_css.add(elemBtnCompt, "ui-state-disabled");
                }
            }
        }

         //绘制工作范围
        function drawWorkRange(value) {
            if (taskData == null)
                return;
            var workid = null;
            var taskItems = taskData["result"]["datas"];
            // 找到用户选择的任务对应的workid.
            for (var i = 0; i < taskItems.length; i++) {
                if (taskItems[i]["id"] == value) {
                    workid = taskItems[i]["workid"];
                    break;
                }
            }
            // 获取到作业数据
            if (workid != null) {              
                var workdata = getUserWork(workid);
                if (workdata != null) {
                    if (workdata.result.datas.length > 0) {
                        // 根据|符号分隔字符串
                        var wktArray = workdata.result.datas[0]["gml"].split("|");
                        // 清空图层
                        map.clearMap(); //gl.clear();
                        for (i = 0; i < wktArray.length - 1; i++) {
                            if (wktArray[i] != "") {
                                // 读取wkt
                                var polygon;
                                polygon = wkt.read(wktArray[i]);
                                var polygon1 = polygon.components;
                                var polygon2 = polygon1[0];
                                $.each(polygon2, function (i, item) {
                                    //  alert(item.x);

                                    polygonArr.push([item.x, item.y]);

                                });
                             
                               
                                //var symbol = null;

                                //var graphic = new Graphic(obj, symbol);
                                //gl.add(graphic);
                            }
                            //map.setExtent(GraphicsUtils.graphicsExtent(gl.graphics));
                        }
                    }

                    var polygon = new AMap.Polygon({
                        path: polygonArr,//设置多边形边界路径
                        map: map,
                        strokeColor: "#FF33FF", //线颜色
                        strokeOpacity: 1, //线透明度
                        strokeWeight: 3,    //线宽
                        fillColor: "#1791fc", //填充色
                        fillOpacity: 0.3//填充透明度
                    });

                    polygonarray.push(polygon);

                }
            }
        }

        //Event开始任务
        $(document).ready(function () {   
            $("#btn_start").on("click", function () {
                openExecutingStatus();
                // current time string
                var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss");
                var paramStr = "?token=1&taskid=" + taskid + "&status=" + getStatus() + "&starttime=" + dateStr + "&carid=" + carid;
                $.ajax({
                    type: "get",
                    async: true, //异步执行
                    url: domain + url_executionTaskstatus + paramStr,
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                        switchBtnClass();
                    },
                    error: function (errorMsg) {
                        alert("出错,无法开始任务\n"+errorMsg.toString());
                    }
                });
            });
        });

        //Event暂停任务
        $("#btn_pause").on("click", function () {
                openPausingStatus();
                var paramStr = "?token=1&taskid=" + taskid + "&status=" + getStatus()+"&carid="+carid;
                $.ajax({
                    type: "get",
                    async: true, //异步执行
                    url: domain + url_executionTaskstatus + paramStr,
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                        switchBtnClass();
                    },
                    error: function (errorMsg) {
                        alert("出错,无法暂停任务\n" + errorMsg.toString());
                    }
                });
        });

        //Event完成任务
        $("#btn_compt").on("click", function () {


                openCompletingStatus();
                var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss");
                var paramStr = "?token=1&taskid=" + taskid + "&status=" + getStatus() + "&endtime=" + dateStr + "&carid=" + carid;
                $.ajax({
                    type: "get",
                    async: true, //异步执行
                    url: domain + url_executionTaskstatus + paramStr,
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                        switchBtnClass();
                        // reset task option
                        setSelectTask();
                        map.clearMap();
                    },
                    error: function (errorMsg) {
                        alert("出错,无法完成任务\n" + errorMsg.toString());
                    }
                });
        });

        //提交点位信息
        // visit the api to save the point and other information
        function saveInfo() {
            // data ready to post
            alert(currentX);
            alert(currentY);
            var data = new Object();
            var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss");
            data["token"] = "1";
            data["data"] = new Object();
            data["data"]["filter"] = new Object();
            data["data"]["items"] = [];
            data["data"]["param"] = new Object();
            data["data"]["param"]["x"] = currentX;
            data["data"]["param"]["y"] = currentY;
            data["data"]["param"]["userid"] = userid;
            data["data"]["param"]["carid"] = carid;
            data["data"]["param"]["recordtime"] = dateStr;
            data["data"]["param"]["taskid"] = taskid;
            $.ajax({
                type: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                async: true, //异步执行
                url: domain + url_executionLocation,
                data: JSON.stringify(data),
                dataType: "json",
                timeout: 3000,
                success: function (result) {
                },
                error: function (errorMsg) {
                    alert("出错,轨迹存储失败\n" + errorMsg.toString());
                }
            });
        }

        // check the problem after timer function executed.
        function checkProblem() {
            // check overspeed
            (function() {
                var distance;
                if (lastGraphic != null) {
                    var x1 = lastGraphic.geometry.x;
                    var y1 = lastGraphic.geometry.y;
                    distance = calDistance(x1, y1, currentX, currentY);

                }
            })();
            // check overrange
            // check overpause
            (function () {
                if (isPausing) {
                    var currentDate = new Date();
                    console.log(currentDate.getTime() - startPauseTime.getTime());
                }
            })();
            // check overworking
            (function () {
                if (isExecuting) {
                    var currentDate = new Date();
                    console.log(currentDate.getTime() - startWorkTime.getTime());
                }
            })();
        }

        //判断任务工作状态
        function getStatus() {
            if (isResting) {
                return  "未执行";
            }
            else if (isExecuting) {
                return  "执行中";
            }
            else if (isPausing) {
                return  "休息";
            }
            else{
                return "完成任务";
            }
        }


    });
   

})(window);