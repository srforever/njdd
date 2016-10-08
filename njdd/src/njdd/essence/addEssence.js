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


                // 获取按钮
                elemBtnTask = document.querySelector("#btn_task");
                elemBtnEssence = document.querySelector("#btn_eccence");
                elemBtnConserve = document.querySelector("#btn_conserve");


            // 存放要素的图层
            var graphicLayer;

            // 绘图器
            var toolbar;

            // main-page中按钮能否点击的开关
            var taskBtnEnable, essenceBtnEnable, conserveBtnEnable;

            // main-page中底部的三个按钮元素
            var elemBtnTask, elemBtnEssence, elemBtnConserve;



            // WKT的实例,用于Geometry的序列化
            var wkt;

            // 存放数据库中的所有用户
            var userdata;

            // 存放当前操作作业的信息(从后端返回)
            var workInfo = null;

            // 同上,存放要素信息
            var graphicInfo = null;

            // carid  从缓存中获取
            var carid;

            // 存放作业时存储的任务id
            var taskidArray;

            // 要素点击类型
            var graphicClickType;

            // 当前操作，指示当前用户对该模块的操作类型：EDITWORK或者EDITESSENCE（编辑作业或者编辑要素）
            var currentAction;

            var map;
            var taskpolygon1;
            var liebiao3 = new Array(2);
        

        //加载地图
        loadmap();
        function loadmap() {
            map = new AMap.Map("container", {
                resizeEnable: true,
                zoom: 13
            });
        }

        //初始化行为
        setSelectUser();

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
      
            //点击要素绘制下方立即绘制
            $("#btn_drawEssen").on("click", function () {
            //    // 设置用户操作类型为"要素编辑"类型
                currentAction = "EDITESSENCE";
                // 令main-page中的任务绘制和要素绘制按钮不可点击
                taskBtnEnable = essenceBtnEnable = false;
                conserveBtnEnable = true;
                switchBtnClass();
                // 初始化taskidArray
                taskidArray = new Array();
                // 初始化workInfo
                workInfo = null;
                // 初始化graphicInfo
                graphicInfo = null;
                // 清空绘制的要素
                //graphicLayer.clear();
                // 设置要素点击事件为空
                //graphicClickType = "";

               // 激活地图绘制
                activateToolbar();
            });

            //转换按钮样式
            function switchBtnClass() {
                // 控制"任务绘制"按钮的样式
                if (taskBtnEnable) {
                    if (classie_css.has(elemBtnTask, "ui-state-disabled")) {
                        classie_css.remove(elemBtnTask, "ui-state-disabled");
                    }
                } else {
                    if (!classie_css.has(elemBtnTask, "ui-state-disabled")) {
                        classie_css.add(elemBtnTask, "ui-state-disabled");
                    }
                }
                // 控制"要素绘制"按钮的样式
                if (essenceBtnEnable) {
                    if (classie_css.has(elemBtnEssence, "ui-state-disabled")) {
                        classie_css.remove(elemBtnEssence, "ui-state-disabled");
                    }
                } else {
                    if (!classie_css.has(elemBtnEssence, "ui-state-disabled")) {
                        classie_css.add(elemBtnEssence, "ui-state-disabled");
                    }
                }
                // 控制"保存"按钮的样式
                if (conserveBtnEnable) {
                    if (classie_css.has(elemBtnConserve, "ui-state-disabled")) {
                        classie_css.remove(elemBtnConserve, "ui-state-disabled");
                    }
                } else {
                    if (!classie_css.has(elemBtnConserve, "ui-state-disabled")) {
                        classie_css.add(elemBtnConserve, "ui-state-disabled");
                    }
                }
            }
            
        //激活绘制
            var mouseTool1 = new AMap.MouseTool(map);
            function activateToolbar() {
               
                mouseTool1.polygon({
                    strokeColor: "#FF33FF", //线颜色
                    strokeOpacity: 0.2, //线透明度
                    strokeWeight: 3, //线宽
                    fillColor: "#1791fc", //填充色
                    fillOpacity: 0.35 //填充透明度

                });
            }

            AMap.event.addListener(mouseTool1, "draw", function (e) {               
                taskpolygon1 = e.obj;
                taskpolygon1.on('click', function () {
                    graphicOnClick();                   
                });
                mouseTool1.close();
                var taskpolygongml1 = PolygonToWKT(taskpolygon1);
                alert(taskpolygongml1);
                // 激活地图绘制
                activateToolbar();

            });

            //绘制完点击保存
            $("#btn_conserve").on("click", function () {
                // 注销地图绘制
                //toolbar.deactivate();
                // 令main-page中的任务绘制和要素绘制按钮可以点击
                taskBtnEnable = essenceBtnEnable = true;
                conserveBtnEnable = false;
                switchBtnClass();
                if (currentAction == "EDITWORK") {
                    // 获取到任务添加页中所有被选择用户,add_为任务添加页选择项id的前缀
                    var userArray = getCheckedUsers("add_");
                    // 保存作业
                    saveWork(userArray);
                    // 初始化作业编辑页面
                    initialEditTaskPage(userArray);
                }
                if (currentAction == "EDITESSENCE") {
                    // 保存要素
                    saveEssence();
                    // 初始化要素编辑页面
                    initialEditEssencePage();//将要素绘制块信息添加到编辑面块
                }
                // 设置要素点击事件为弹出页面事件
                graphicClickType = "OPENPAGE";
            });

        //保存要素
        function saveEssence() {
                // 如果地图上没有绘制要素，返回
            if (map.getAllOverlays().length <= 0)
                    return;
                var id = "";
                var type = "";
                var gml = "";
                var ownername = "";
                var remark = "";
                // 如果要素信息不为空，此时应更新要素；如果作业信息为空,此时应新增作业
                if (graphicInfo != null) {
                    // 从要素信息中初始化要素信息项
                    id = graphicInfo[0].id;
                    type = graphicInfo[0].type;
                    gml = graphicInfo[0].gml;
                    ownername = graphicInfo[0].ownername;
                    remark = graphicInfo[0].remark;
                    // 对于删除要素操作后的保存来讲,要做的是更新gml
                    if (graphicClickType == "DELETE") {
                        gml = PolygonToWKT(taskpolygon1);       //在此处需要修改graphicLayer.graphics
                    }
                    // 对于编辑要素操作后的保存来讲,要做的是更新要素所有者名称,要素类型,要素备注
                    if (graphicClickType == "OPENPAGE") {
                        ownername = $('#editOwner_name').val();
                        type = $('#editEssence_type').val();
                        remark = $('#editEccen_info').val();
                    }
                }
                else {
                    id = "";
                    gml = PolygonToWKT(taskpolygon1);;
                    ownername = $('#owner_name').val();
                    type = $('#essence_type').val();
                    remark = $('#eccen_info').val();
                }
                // 更新或新增要素到数据库
                updateOrAddEssence(id, type, gml, ownername, remark);
        }
        
        function PolygonToWKT(geometry) {
            wkt = [];
            var paths = geometry.getPath();
            for (var i in paths) {
                liebiao3[0] = paths[i].C;
                liebiao3[1] = paths[i].I;
                wkt.push(liebiao3.join(" "));

            }
            return "POLYGON ((" + wkt.join(",") + "))" + "|";
        }

            /**
             * 更新或新增要素到数据库
             * @param   id               {String}    作业id，为空字符串时后台执行作业新增，否则为更新
             * @param   type             {String}    要素类型
             * @param   gml              {String}    gml，wkt字符串
             * @param   ownername        {String}    所有人名称
             * @param   remark           {String}    备注
             */
            function updateOrAddEssence(id, type, gml, ownername, remark) {
                // 准备post数据
                var data = new Object();
                data["token"] = "1";
                data["data"] = new Object();
                data["data"]["filter"] = new Object();
                data["data"]["items"] = [];
                data["data"]["param"] = new Object();
                // id，为空时执行添加，不为空时后端执行更新
                data["data"]["param"]["id"] = id;
                data["data"]["param"]["type"] = type;
                data["data"]["param"]["gml"] = gml;
                data["data"]["param"]["owername"] = ownername;
                data["data"]["param"]["createtime"] = new Date().Format("yyyy-MM-dd hh:mm:ss");
                data["data"]["param"]["remark"] = remark;

                $.ajax({
                    type: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    async: true, //异步执行
                    url: domain + url_saveGraphics,
                    data: JSON.stringify(data),
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                        if (result.message.statusCode == 200) {
                            if (result.result.datas.length > 0) {
                                // 存储要素信息数据到全局变量中
                                graphicInfo = result.result.datas;;
                            }
                        }
                    },
                    error: function (errorMsg) {
                        alert("出错,作业存储失败\n" + errorMsg.toString());
                    }
                });
            }

             //   初始化编辑要素界面
            function initialEditEssencePage() {
                // 从essenDraw-page页拷贝输入到editEssence-page页
                $('#editOwner_name').val($('#owner_name').val());
                $('#editEssence_type').val($('#essence_type').val());
                $('#editEccen_info').val($('#eccen_info').val());
            }

            //几何点击事件：点击时打开editTask-page页             
            function graphicOnClick(evt) {
                // 点击事件为空时不执行动作
                if (graphicClickType == "")
                    return;
                // 点击事件被设置为OPENPAGE时打开editTask-page页面
                if (graphicClickType == "OPENPAGE"){
                    if (!conserveBtnEnable && currentAction=="EDITWORK")
                        $.mobile.changePage("#editTask-page", "slideup");
                    if (!conserveBtnEnable && currentAction == "EDITESSENCE")
                       $.mobile.changePage("#editEssence-page", "slideup");
                }
                // 点击事件被设置为DELETE时弹出窗口
                if (graphicClickType == "DELETE") {
                    // 移除按钮的激活样式
                    $('#btn_deleteYes').removeClass('ui-btn-active');
                    $('#btn_deleteNo').removeClass('ui-btn-active');
                    $("#deleteWindow").popup('open');
                }

                // 点击事件-点击弹窗中的"是"按钮时触发
                $("#btn_deleteYes").on("click", function () {
                    // 如果保存按钮不可点击
                    if (!conserveBtnEnable) {
                        // 打开保存按钮,关闭任务绘制和要素绘制按钮
                        taskBtnEnable = essenceBtnEnable = false;
                        conserveBtnEnable = true;
                        switchBtnClass();
                    }
                    map.clearMap();//这里也要修改graphicLayer.remove(evt.graphic);
                });
                // 点击事件-点击弹窗中的"否"按钮时触发
                $("#btn_deleteNo").on("click", function () {

                    graphicClickType = "OPENPAGE";
                });

            }



        
                // 设置任务选择和编辑页中可选择的用户
            function setSelectUser() {
                // 将用户数据放到外部以便后面使用
                userdata = getAllUser();

                var users = userdata.result.datas;

                var selcTaskDom = $("#slec_user");
                var selcEditDom = $("#modify_user");
                var selcConvDom = $("#convertSlec_user");
                // empty options
                selcTaskDom.empty();
                selcEditDom.empty();
                selcConvDom.empty();
                selcTaskDom.append("<legend>任务所有人姓名：</legend>");
                selcEditDom.append("<legend>任务所有人姓名：</legend>");
                selcConvDom.append("<legend>任务所有人姓名：</legend>");
                // 使用模块加载复选项
                for (var i = 0; i < users.length; i++) {
                    selcTaskDom.append(tmpl("user_tmpl", users[i]));
                    selcEditDom.append(tmpl("edit_tmpl", users[i]));
                    selcConvDom.append(tmpl("convert_tmpl", users[i]));
                }
            }


   
           // 获取到数据库中的所有用户
            function getAllUser() {
                var paramStr = "?token=1";
                var data;
                $.ajax({
                    type: "get",
                    async: false, //同步执行
                    url: domain + url_getAlluser + paramStr,
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
                        alert("出错,无法查询到用户\n" + errorMsg.toString());
                    }
                });
                return data;
            }

            /**
             * 获取所有被选中的用户id
             * @param   prefix {String}      选择项的id前缀：添加任务页前缀为"add_"，编辑任务页为"edit_"
             * @return         {String Array}
             */
            function getCheckedUsers(prefix) {
                var userArray = Array();
                // 取出用户数据
                var users = userdata.result.datas;
                // 遍历检查
                for (var i = 0; i < users.length; i++) {
                    // 由于模块的复选框中可选的dom的id是根据前缀加上用户的id生成的.
                    // 如:add_123456789
                    // 所以可以根据"前缀+用户id"作为dom的标识来检查哪一项是被选中
                    if ($("#" + prefix + users[i]["id"]).is(":checked")) {
                        // 添加用户id到userArray中
                        userArray.push(users[i]);
                    }
                }
                return userArray;
            }


            /**
             * 保存任务绘制的内容
             */
            function saveWork(checkedUsers) {
                // 如果地图上没有绘制要素，返回
                if (map.getAllOverlays().length <= 0)
                    return;

                // 如果该作业之前的任务之前添加过，则删除上次的添加
                if (taskidArray.length > 0)
                    deleteLastTask();

                // 准备更新或者新增的作业信息项
                var workid = "";
                var gml = "";
                var workName = "";
                var remark = "";

                // 如果作业信息不为空，此时应更新作业
                if (workInfo != null) {
                    // 从作业信息中初始化作业信息项
                    workid = workInfo[0].id;
                    gml = workInfo[0].gml;
                    workName = workInfo[0].name;
                    remark = workInfo[0].remark;
                    // 对于删除要素操作后的保存来讲,要做的是更新gml
                    if (graphicClickType == "DELETE") {
                        gml = PolygonToWKT(taskpolygon1);// PolygonToWKT(graphicLayer.graphics)
                    }
                    // 对于编辑作业操作后的保存来讲,要做的是更新作业名称,作业备注
                    if (graphicClickType == "OPENPAGE") {
                        workName = $('#editwork_name').val();
                        remark = $('#editwork_info').val();
                    }
                }
                // 如果作业信息为空,此时应新增作业
                else {
                    gml = PolygonToWKT(taskpolygon1);//// PolygonToWKT(graphicLayer.graphics)
                    if (currentAction == "EDITWORK") {
                        workName = $('#work_name').val();
                        remark = $('#work_info').val();
                    }
                    if (currentAction == "EDITESSENCE") {
                        workName = $('#convertWork_name').val();
                        remark = $('#convertWork_info').val();
                    }
                }
                // 更新或新增作业
                updateOrAddWork(workid, gml, workName, remark, checkedUsers);
            }


            /**
             * 更新或新增作业
             * @param   workid           {String}    作业id，为空字符串时后台执行作业新增，否则为更新
             * @param   gml              {String}    gml，wkt字符串
             * @param   workName         {String}    作业名称
             * @param   remark           {String}    备注
             * @param   checkedUsers     {Object}    执行该作业的用户
             */
            function updateOrAddWork(workid, gml, workName, remark, checkedUsers) {
                // 准备post数据
                var data = new Object();
                data["token"] = "1";
                data["data"] = new Object();
                data["data"]["filter"] = new Object();
                data["data"]["items"] = [];
                data["data"]["param"] = new Object();
                // 作业id，为空时执行添加，不为空时后端执行更新
                data["data"]["param"]["workid"] = workid;
                // wkt字符串
                data["data"]["param"]["gml"] = gml;
                // 作业名称
                data["data"]["param"]["name"] = workName;
                // 当前的时间
                data["data"]["param"]["createtime"] = new Date().Format("yyyy-MM-dd hh:mm:ss");
                // 作业备注
                data["data"]["param"]["remark"] = remark;

                $.ajax({
                    type: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    async: true, //异步执行
                    url: domain + url_saveWork,
                    data: JSON.stringify(data),
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                        if (result.result.datas.length > 0) {
                            // 存储作业数据到全局变量中
                            workInfo = result.result.datas;
                            // 根据当前用户所选择的用户和作业表信息保存任务
                            saveTask(checkedUsers);
                        }
                    },
                    error: function (errorMsg) {
                        alert("出错,作业存储失败\n" + errorMsg.toString());
                    }
                });
            }

            
            //将上次添加到作业表中的任务全都删除掉
            function deleteLastTask() {
                var taskid = "";
                for (var i = 0; i < taskidArray.length; i++) {
                    taskid += taskidArray[i] + ",";
                }
                var paramStr = "?token=1&taskid=" + taskid;
                console.log(domain + url_deleteTask + paramStr);
                $.ajax({
                    type: "get",
                    async: true, //异步执行
                    url: domain + url_deleteTask + paramStr,
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                        console.log("删除任务成功");
                    },
                    error: function (errorMsg) {
                        alert("出错,删除任务失败\n" + errorMsg.toString());
                    }
                });
            }

            
            //初始化编辑作业界面
            function initialEditTaskPage(checkedUsers) {
                // 从taskDraw-page页拷贝输入到editTask-page页
                $('#editwork_name').val($('#work_name').val());
                $('#editwork_info').val($('#work_info').val());
                for (var i = 0; i < checkedUsers.length; i++) {
                    $('#edit_' + checkedUsers[i]["id"]).prop('checked', true);
                }
            }


            /**
             * 将绘制的要素,根据选择的用户保存到后端task表中
             * @param   userArray {String Array}    
             */
            function saveTask(userArray) {
                // 清空taskidArray
                taskidArray = new Array();
                for (var i = 0; i < userArray.length; i++) {
                    var userid = userArray[i]["id"];
                    var paramStr = "?token=1&userid=" + userid + "&status=未执行" + "&workid=" + workInfo[0]["id"];
                    $.ajax({
                        type: "get",
                        async: true, //异步执行
                        url: domain + url_executionTaskstatus + paramStr,
                        dataType: "json",
                        timeout: 3000,
                        success: function (result) {
                            taskidArray.push(result.result.taskid);
                        },
                        error: function (errorMsg) {
                            alert("出错,任务存储失败\n" + errorMsg.toString());
                        }
                    });
                }
            }


        //require([
        //"esri",
        //"esri/map",
        //"esri/toolbars/draw",
        //"bdlib/TDTVecLayer",
        //"esri/layers/FeatureLayer",
        //"esri/graphic",
        //"esri/geometry/Point",
        //"esri/geometry/Polyline",
        //"esri/symbols/SimpleMarkerSymbol",
        //"esri/symbols/SimpleLineSymbol",
        //"esri/symbols/SimpleFillSymbol",
        //"esri/layers/GraphicsLayer",
        //"esri/SpatialReference",
        //"dojo/_base/connect",
        //"dojo/domReady!"],
        //function (
        //    esri,
        //    Map,
        //    Draw,
        //    TDTVecLayer,
        //    FeatureLayer,
        //    Graphic,
        //    Point,
        //    Polyline,
        //    SimpleMarkerSymbol,
        //    SimpleLineSymbol,
        //    SimpleFillSymbol,
        //    GraphicsLayer,
        //    SpatialReference,
        //    connect
        //) {

        //    var map;

        //    // 存放要素的图层
        //    var graphicLayer;

        //    // 存放用户实时位置
        //    var currentX, currentY; 

        //    // 绘图器
        //    var toolbar;

        //    // main-page中按钮能否点击的开关
        //    var taskBtnEnable, essenceBtnEnable, conserveBtnEnable;

        //    // main-page中底部的三个按钮元素
        //    var elemBtnTask, elemBtnEssence, elemBtnConserve;



        //    // WKT的实例,用于Geometry的序列化
        //    var wkt;

        //    // 存放数据库中的所有用户
        //    var userdata;

        //    // 存放当前操作作业的信息(从后端返回)
        //    var workInfo = null;

        //    // 同上,存放要素信息
        //    var graphicInfo = null;

        //    // carid  从缓存中获取
        //    var carid;

        //    // 存放作业时存储的任务id
        //    var taskidArray;

        //    // 要素点击类型
        //    var graphicClickType;

        //    // 当前操作，指示当前用户对该模块的操作类型：EDITWORK或者EDITESSENCE（编辑作业或者编辑要素）
        //    var currentAction;

        //    ////////////////
        //    // 初始化数据
        //    (function () {
        //        // 初始化页面时令保存按钮不可点击
        //        taskBtnEnable = essenceBtnEnable = true;
        //        conserveBtnEnable = false;
        //        // 不设置绘制类型

        //        // 获取按钮
        //        elemBtnTask = document.querySelector("#btn_task");
        //        elemBtnEssence = document.querySelector("#btn_eccence");
        //        elemBtnConserve = document.querySelector("#btn_conserve");
        //        // WKT与Geometry的互转类
        //        wkt = new Wkt.Wkt();
        //        carid = sessionStorage.carid;
        //        taskidArray = Array();
        //        // 要素点击类型为空
        //        graphicClickType = "";
        //        currentAction = "";
        //    })();
        //    ////////////////
        //    //初始化地图
        //    (function () {
        //        map = new Map("map", {
        //            logo: false
        //        });
        //        var imgMap = new TDTVecLayer();
        //        map.addLayer(imgMap);
        //        graphicLayer = new GraphicsLayer({ id: "graphicsLayer" });
        //        map.addLayer(graphicLayer);
        //    })();
        //    ////////////////
        //    // 初始化行为
        //    (function () {

        //        // 创建绘图器
        //        createToolbar(map);
        //        // 设置任务绘制页中可选用户
        //        setSelectUser();
        //        // 绑定要素点击方法
        //        connect.connect(graphicLayer, "onClick", graphicOnClick);
        //    })();


//    /**
        //     * 创建绘制工具
        //     */
        //    function createToolbar(themap) {
        //        toolbar = new Draw(themap);
        //        toolbar.on("draw-end", addToMap);
        //    }

        //    /**
        //     * 事件-添加几何要素到地图上
        //     */
        //    function addToMap(evt) {
        //        var symbol = null;
        //        map.showZoomSlider();
        //        if (drawType == "polyline")
        //            symbol = new SimpleLineSymbol();
        //        if (drawType == "polygon")
        //            symbol = new SimpleFillSymbol();

        //        var graphic = new Graphic(evt.geometry, symbol);

        //        graphicLayer.add(graphic);
        //    }



        //    /**
        //    * 获取到数据库中的所有用户
        //    */
        //    function getAllUser() {
        //        var paramStr = "?token=1";
        //        var data;
        //        $.ajax({
        //            type: "get",
        //            async: false, //同步执行
        //            url: domain + url_getAlluser + paramStr,
        //            dataType: "json",
        //            timeout: 3000,
        //            success: function (result) {
        //                if (result.message.statusCode == 200) {
        //                    data = result;
        //                }
        //                else {
        //                    data = null;
        //                }
        //            },
        //            error: function (errorMsg) {
        //                data = null;
        //                alert("出错,无法查询到用户\n" + errorMsg.toString());
        //            }
        //        });
        //        return data;
        //    }

        //    /**
        //     * 获取所有被选中的用户id
        //     * @param   prefix {String}      选择项的id前缀：添加任务页前缀为"add_"，编辑任务页为"edit_"
        //     * @return         {String Array}
        //     */
        //    function getCheckedUsers(prefix) {
        //        var userArray = Array();
        //        // 取出用户数据
        //        var users = userdata.result.datas;
        //        // 遍历检查
        //        for (var i = 0; i < users.length; i++) {
        //            // 由于模块的复选框中可选的dom的id是根据前缀加上用户的id生成的.
        //            // 如:add_123456789
        //            // 所以可以根据"前缀+用户id"作为dom的标识来检查哪一项是被选中
        //            if ($("#" + prefix + users[i]["id"]).is(":checked")) {
        //                // 添加用户id到userArray中
        //                userArray.push(users[i]);
        //            }
        //        }
        //        return userArray;
        //    }

        //    /**
        //     * 几何点击事件：点击时打开editTask-page页
        //     */
        //    function graphicOnClick(evt) {
        //        // 点击事件为空时不执行动作
        //        if (graphicClickType == "")
        //            return;
        //        // 点击事件被设置为OPENPAGE时打开editTask-page页面
        //        if (graphicClickType == "OPENPAGE"){
        //            if (!conserveBtnEnable && currentAction=="EDITWORK")
        //                $.mobile.changePage("#editTask-page", "slideup");
        //            if (!conserveBtnEnable && currentAction=="EDITESSENCE")
        //                $.mobile.changePage("#editEssence-page", "slideup");
        //        }
        //        // 点击事件被设置为DELETE时弹出窗口
        //        if (graphicClickType == "DELETE") {
        //            // 移除按钮的激活样式
        //            $('#btn_deleteYes').removeClass('ui-btn-active');
        //            $('#btn_deleteNo').removeClass('ui-btn-active');
        //            $("#deleteWindow").popup('open');
        //        }

        //        // 点击事件-点击弹窗中的"是"按钮时触发
        //        $("#btn_deleteYes").on("click", function () {
        //            // 如果保存按钮不可点击
        //            if (!conserveBtnEnable) {
        //                // 打开保存按钮,关闭任务绘制和要素绘制按钮
        //                taskBtnEnable = essenceBtnEnable = false;
        //                conserveBtnEnable = true;
        //                switchBtnClass();
        //            }
        //            graphicLayer.remove(evt.graphic);
        //        });
        //        // 点击事件-点击弹窗中的"否"按钮时触发
        //        $("#btn_deleteNo").on("click", function () {

        //            graphicClickType = "OPENPAGE";
        //        });

        //    }

        //    /**
        //     * 转换按钮样式
        //     */
        //    function switchBtnClass() {
        //        // 控制"任务绘制"按钮的样式
        //        if (taskBtnEnable) {
        //            if (classie_css.has(elemBtnTask, "ui-state-disabled")) {
        //                classie_css.remove(elemBtnTask, "ui-state-disabled");
        //            }
        //        } else {
        //            if (!classie_css.has(elemBtnTask, "ui-state-disabled")) {
        //                classie_css.add(elemBtnTask, "ui-state-disabled");
        //            }
        //        }
        //        // 控制"要素绘制"按钮的样式
        //        if (essenceBtnEnable) {
        //            if (classie_css.has(elemBtnEssence, "ui-state-disabled")) {
        //                classie_css.remove(elemBtnEssence, "ui-state-disabled");
        //            }
        //        } else {
        //            if (!classie_css.has(elemBtnEssence, "ui-state-disabled")) {
        //                classie_css.add(elemBtnEssence, "ui-state-disabled");
        //            }
        //        }
        //        // 控制"保存"按钮的样式
        //        if (conserveBtnEnable) {
        //            if (classie_css.has(elemBtnConserve, "ui-state-disabled")) {
        //                classie_css.remove(elemBtnConserve, "ui-state-disabled");
        //            }
        //        } else {
        //            if (!classie_css.has(elemBtnConserve, "ui-state-disabled")) {
        //                classie_css.add(elemBtnConserve, "ui-state-disabled");
        //            }
        //        }
        //    }

        //    /**
        //     * 激活绘制
        //     */
        //    function activateToolbar() {
        //        if (drawType == "polyline")
        //            toolbar.activate(Draw.POLYLINE);
        //        if (drawType == "polygon") 
        //            toolbar.activate(Draw.POLYGON);
        //    }


        //    /**
        //     * 将graphic数组转化为wkt
        //     * @param   objects {Graphic Array}   待转化的要素数组
        //     * @return          {String}          wkt字符串,要素根据"|"符号分开
        //     */
        //    function convertToWkt(objects) {
        //        var wktStr = "";
        //        // 遍历要素组
        //        for (var i = 0; i < objects.length; i++) {
        //            // 取出esri几何要素转化为wkt类
        //            wkt.fromObject(objects[i].geometry);
        //            // wkt类转化为wkt字符串,以'|'为分隔符
        //            wktStr += wkt.write() + "|";
        //        }
        //        return wktStr;
        //    }

        //    /**
        //     * 初始化编辑作业界面
        //     */
        //    function initialEditTaskPage(checkedUsers) {
        //        // 从taskDraw-page页拷贝输入到editTask-page页
        //        $('#editwork_name').val($('#work_name').val());
        //        $('#editwork_info').val($('#work_info').val());
        //        for (var i = 0; i < checkedUsers.length; i++) {
        //            $('#edit_' + checkedUsers[i]["id"]).prop('checked', true);
        //        }
        //    }



        //    ///////////////////////////////////
        //    ///main-page页面按钮点击事件
        //    /**
        //     * 保存
        //     */
        //    $("#btn_conserve").on("click", function () {
        //        // 注销地图绘制
        //        toolbar.deactivate();
        //        // 令main-page中的任务绘制和要素绘制按钮可以点击
        //        taskBtnEnable = essenceBtnEnable = true;
        //        conserveBtnEnable = false;
        //        switchBtnClass();
        //        if (currentAction == "EDITWORK") {
        //            // 获取到任务添加页中所有被选择用户,add_为任务添加页选择项id的前缀
        //            var userArray = getCheckedUsers("add_");
        //            // 保存作业
        //            saveWork(userArray);
        //            // 初始化作业编辑页面
        //            initialEditTaskPage(userArray);
        //        }
        //        if (currentAction == "EDITESSENCE") {
        //            // 保存要素
        //            saveEssence();
        //            // 初始化要素编辑页面
        //            initialEditEssencePage();
        //        }
        //        // 设置要素点击事件为弹出页面事件
        //        graphicClickType = "OPENPAGE";
        //    });

            ///////////////////////////////////
            ///按钮点击事件-taskDraw-page页面
            /**
             * 立即绘制
             */
            $("#btn_drawTask").on("click", function () {
                // 设置用户操作类型为"作业编辑"类型
                currentAction = "EDITWORK";

                // 激活地图绘制
                activateToolbar();
                // 令main-page中的任务绘制和要素绘制按钮不可点击
                taskBtnEnable = essenceBtnEnable = false;
                conserveBtnEnable = true;
                switchBtnClass();
                // 初始化taskidArray
                taskidArray = new Array();
                // 初始化workInfo
                workInfo = null;
                // 清空绘制的要素
                map.clearMap();        //graphicLayer.clear();
                // 设置要素点击事件为空
                graphicClickType = "";
            });


        //    ///////////////////////////////////
            ///editTask-page页面按钮点击事件
            /**
             * 保存
             */
            $("#btn_editconserve").on("click", function () {
                // 获取到编辑页中所有被选择用户,edit_为编辑页选择项id的前缀
                var userArray = getCheckedUsers("edit_");
                // 保存作业
                saveWork(userArray);
            });
            /**
             * 编辑要素
             */
            $("#btn_editTask").on("click", function () {
                // 设置要素点击事件为删除要素事件
                graphicClickType = "DELETE";
            });

        //    //////////////////////////////////////
            ///editEssence-page页面按钮点击事件///
            /**
            * 保存
            */
            $("#btn_editEssenConserve").on("click", function () {
                // 保存要素
                saveEssence();
            });

            /**
            * 编辑要素
            */
            $("#btn_editEssenGraphic").on("click", function () {
                // 设置要素点击事件为删除要素事件
                graphicClickType = "DELETE";
            });

            //////////////////////////////////////
            ///convert-page页面按钮点击事件///
            /**
            * 保存
            */
            $("#btn_convertConserve").on("click", function () {
                // 获取到转换任务页中所有被选择用户,convert_为任务添加页选择项id的前缀
                var userArray = getCheckedUsers("convert_");
                // 保存作业
                saveWork(userArray);
            });
        //});
    });
})(window);