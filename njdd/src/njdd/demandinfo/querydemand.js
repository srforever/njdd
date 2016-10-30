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

            $("#quetymechanicsinfopage_listview").empty();
          //  var option = $("#quetymechanicsinfopage_selectname option:selected").text();
            //var paramStr = "?token=1";
            $.ajax({
                type: "get",
                url: domain + url_getDemandInfo + "?token=1",
                async: true,
                dataType: 'json',
                success: function (data) {
                    $.each(data.result.datas, function (i, item) {                   
                        logmanagepagecar(item);
                    });
                }
            });

        //模板渲染  
        function logmanagepagecar(item) {
            var html = tmpl("tmpl_quetymechanicsinfopage_detailinfo", item);
            $(html).appendTo("#quetymechanicsinfopage_listview").trigger('create');
        };



    });


})(window)

var demandid;
//点击追加列表的某一人，追加其个人信息
function njinfo_btn_click(id) {



    $.ajax({
        type: "get",
        url: domain + url_getDemandInfo + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $.each(data.result.datas, function (i, item) {
                if (id == item.id) {
                    $("#detailinfopage_username").val(item.info_ownername);
                    $("#detailinfopage_car_code").val(item.remark);
                    $("#detailinfopage_phone").val(item.info_ownerphone);
                }
            });
        }
    });





  
    sessionStorage.demandid = id;
}


//跳转至发送信息
function detailinfopage_smsbtn() {

    var data = new Object();
    data["token"] = "1";
    data["data"] = new Object();
    data["data"]["filter"] = new Object();
    data["data"]["items"] = [];
    data["data"]["param"] = new Object();
    data["data"]["param"]["id"] = sessionStorage.demandid;
    data["data"]["param"]["isover"] = "1";

    $.ajax({
        url: domain + url_addDemandInfo,
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        timeout: 3000,
        success: function (json) {
            alert("成功");
        },
        error: function (errorMsg) {
            alert(errorMsg);

        }
    });
}