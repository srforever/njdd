var carname;
(function (window) {
    $(document).ready(function () {

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


       


        $.ajax({
            type: "get",
            url: domain + url_getCarInfo + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                $("#select-native-njbh").append("<option value='" + "allcars" + "'>" + "全部" + "</option>");
                $.each(data.result.datas, function (i, item) {
                    $("#select-native-njbh").append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                });
                carname = $("#select-native-njbh").find("option:selected").text();
                $("#select-native-njbh").change(function () {
                    carname = $("#select-native-njbh").find("option:selected").text();
                });

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

        $("#btn_start").click(function () {
            $("#logmanagepage_listview").empty();
            //var option = $("#select-native-njbh").val();
             {
                var paramStr = "?token=1"  + "&starttime=" + document.querySelector("#input_startime").value + "%2011:49:45&endtime=" + document.querySelector("#input_endtime").value + "%2011:49:45";
                $.ajax({
                    type: "get",
                    url: domain+ url_queryHistory + paramStr,
                    async: true,
                    dataType: 'json',
                    success: function (data) {
                        $.each(data.result.datas, function (i, item)
                        {
                           
                            if (carname == "全部" || carname == item.carcode) {
                                var newDate = new Date();
                                newDate.setTime(item.recordtime);
                                item.recordtime = newDate.format('yyyy-MM-dd h:m:s');
                                logmanagepagecar(item);
                            }
                            
                        });
                    } 
                });
            }

           

        });
        function logmanagepagecar(item) {
            //模板渲染
            var html = tmpl("tmpl_logmanagepage_detailinfo", item);
            $(html).appendTo("#logmanagepage_listview").trigger('create');
        };


    });
})(window)