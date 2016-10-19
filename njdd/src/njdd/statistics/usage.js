(function (window) {
    $(document).ready(function () {
        var myChart;
        // chart option
        var option;
        var carid;
        var chartType;
        var chartTypeIndex;

        // initialize Data
        (function () {
            carid = sessionStorage.carid;
            chartType = ["bar", "line"];
            chartTypeIndex = 0;
        })();

        // set height of chart
        (function() {
            var screen = $.mobile.getScreenHeight(),
            header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
            footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
            contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
            content = screen - header - footer - contentCurrent;
            $(".ui-content").height(content);
        })();

        // initialize chart
        (function() {
            require.config({
                paths: {
                    echarts: '../../dep/echarts'
                }
            });

            // 使用
            require(
                [
                    'echarts',
                    'echarts/chart/bar',
                    'echarts/chart/line'
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    myChart = ec.init(document.getElementById('chart'));

                    option = {
                        tooltip: {
                            show: true
                        },
                        legend: {
                            data: ['使用次数']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: []
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                "name": "使用次数",
                                "type": "bar",
                                "data": []
                            }
                        ]
                    };
                    // 为echarts对象加载数据 
                    
                }
            );
        })();
        
        $("#btn_query").on("click", function () {
            // option value
            var selVal = $("#select-querytype").val();
            var paramStr = "?token=1&carid=" + carid + "&queryType=" + selVal;
            $.ajax({
                type: "get",
                async: true, //异步执行
                url: domain + url_statUsageOption + paramStr,
                dataType: "json",
                timeout: 3000,
                success: function (result) {
                    if (result.message.statusCode==200) {
                        setChart(selVal, result);
                    } else {
                        alert("出错,统计数据参数有误");
                    }
                },
                error: function (errorMsg) {
                    alert("出错,无法访问数据\n" + errorMsg.toString());
                }
            });
        });

        $("#chart").on("swiperight", function () {
            chartTypeIndex++;
            chartTypeIndex = chartTypeIndex % chartType.length;
            resetChart();
        });
        $("#chart").on("swipeleft", function () {
            chartTypeIndex--;
            if (chartTypeIndex < 0) chartTypeIndex = chartType.length - 1;
            resetChart();
        });

        function resetChart() {
            option.series[0].type = chartType[chartTypeIndex];
            myChart.clear();
            myChart.hideLoading();
            myChart.setOption(option);
        }

        function setChart(selVal, result) {
            var type = getYAxleType(selVal);
            var datas = result.result.datas;
            // 清空option数据
            option.xAxis[0].data = [];
            option.series[0].data = [];
            if (type == "day") {
                for (var i = 0; i < datas.length; i++) {
                    option.xAxis[0].data.push(new Date(datas[i].date).Format("yyyy-MM-dd"));
                    option.series[0].data.push(datas[i].useTime);
                }
            } else if (type == "week") {
                for (var i = 0; i < datas.length; i++) {
                    option.xAxis[0].data.push("第" + datas[i].week.toString() + "周");
                    option.series[0].data.push(datas[i].useTime);
                }
            } else if (type == "month") {
                for (var i = 0; i < datas.length; i++) {
                    option.xAxis[0].data.push(datas[i].month.toString() + "月");
                    option.series[0].data.push(datas[i].useTime );
                }
            }
            myChart.clear();
            myChart.hideLoading();
            myChart.setOption(option);
        }

        function getYAxleType(selVal) {
            var type = "";
            if (selVal == "thisWeek") {
                type = "day";
            } else if (selVal == "lastWeek") {
                type = "day";
            } else if (selVal == "thisMonth") {
                type = "week";
            } else if (selVal == "lastMonth") {
                type = "week";
            } else if (selVal == "firstHalfYear") {
                type = "month";
            } else if (selVal == "secondHalfYear") {
                type = "month";
            }
            return type;
        }
    });
    
})(window)