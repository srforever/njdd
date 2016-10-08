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
        var cityinfo = remote_ip_info.city;



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

            AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Driving', 'AMap.MouseTool', 'AMap.MouseTool', "AMap.MapType", "AMap.OverView", 'AMap.Geolocation', "AMap.RangingTool", "AMap.DistrictSearch"], function() {

                map.addControl(new AMap.ToolBar()); //加载平移缩放控件
                map.addControl(new AMap.Scale()); //加载比例尺    
                map.addControl(new AMap.OverView());
                infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });

            });

        }

        var weather;
        AMap.service('AMap.Weather', function () {
            weather = new AMap.Weather();
            //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
            weather.getLive(cityinfo, function (err, data) {
                if (!err) {
                    var str = [];
                    str.push('<div style="color: #3366FF;">实时天气' + '</div>');
                    str.push('<div>城市/区：' + data.city + '</div>');
                    str.push('<div>天气：' + data.weather + '</div>');
                    str.push('<div>温度：' + data.temperature + '℃</div>');
                    str.push('<div>风向：' + data.windDirection + '</div>');
                    str.push('<div>风力：' + data.windPower + ' 级</div>');
                    str.push('<div>空气湿度：' + data.humidity + '</div>');
                    str.push('<div>发布时间：' + data.reportTime + '</div>');
                    var marker = new AMap.Marker({ map: map, position: map.getCenter() });
                    var infoWin = new AMap.InfoWindow({
                        content: str.join(''),
                        offset: new AMap.Pixel(0, -20)
                    });
                    infoWin.open(map, marker.getPosition());
                    marker.on('mouseover', function () {
                        infoWin.open(map, marker.getPosition());
                    });
                }
            });
            //未来4天天气预报

            getlastweather();

        });

        var str ;
        function getlastweather() {
            str = [];
            weather.getForecast(cityinfo, function (err, data) {
                if (err) { return; }
                str.push(cityinfo);
                for (var i = 0, dayWeather; i < data.forecasts.length; i++) {
                    dayWeather = data.forecasts[i];
                   
                    str.push(dayWeather.date + ' <div class="weather">' + dayWeather.dayWeather + '</div> ' + dayWeather.nightTemp + '~' + dayWeather.dayTemp + '℃');
                }
                document.getElementById('tip').innerHTML = str.join('<br>');
              
            });
        }

        document.getElementById("condouctpage_querybtn").onclick = function () { getweather(); };

        function getweather() {
            sessionStorage.cityinfo = $("#district").val();
            //sessionStorage.cityinfo = $("#district option:selected").text;
            cityinfo = sessionStorage.cityinfo;
            // alert(sessionStorage.cityinfo);
            $("#tip").empty();
         
            getlastweather();
            $("#tip").append(str.join('<br>'));
           
        

        }


    });


})(window);







