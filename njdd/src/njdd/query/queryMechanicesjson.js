var carname; (function (window) {
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
            url: domain + url_getCartype + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                $("#quetymechanicsinfopage_selectname").append("<option value='" + "allcars" + "'>" + "全部" + "</option>");
                $.each(data.result.datas, function (i, item) {
                    $("#quetymechanicsinfopage_selectname").append("<option value='" + item.id + "'>" + item.type + "</option>");
                });

            }
        });


        $("#btn_start").click(function () {
            $("#quetymechanicsinfopage_listview").empty();
            var option = $("#quetymechanicsinfopage_selectname option:selected").text();
            //var paramStr = "?token=1";
            $.ajax({
                type: "get",
                url: domain + url_getCarInfo + "?token=1",
                async: true,
                dataType: 'json',
                success: function (data) {
                    $.each(data.result.datas, function (i, item) {
                        if (option == "全部") {
                            logmanagepagecar(item);
                        } else if (option == item.cartype) {
                            logmanagepagecar(item);
                        }

                    });
                }
            });

        });
        //模板渲染  
        function logmanagepagecar(item) {
            var html = tmpl("tmpl_quetymechanicsinfopage_detailinfo", item);
            $(html).appendTo("#quetymechanicsinfopage_listview").trigger('create');
        };





    });


})(window)