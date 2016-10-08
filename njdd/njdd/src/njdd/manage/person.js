var teamnameid;
var nuitnameid;
var ID;
(function (window) {

    

$(document).ready(function () {

    jibenxinxi();
    function jibenxinxi() {

        //根据进入的帐号调取相应的信息
        var param = "?token=1&id=" + sessionStorage.userid;
        $.ajax({
            type: "get",
            url: domain + url_getAlluser + param,
            async: true,
            dataType: 'json',
            success: function (data) {
                $.each(data.result.datas, function (i, item) {
                    $("#personinfopage_name").val(item.name);
                    $("#personinfopage_tel").val(item.phone);
                    $("#personinfopage_email").val(item.email);
                    $("#personinfopage_password").val(item.password);
                    //$("#personinfopage_teamName").val(item.teamName);
                    nuitnameid = item.unitid;
                    teamnameid = item.teamid;
                    ID = item.id;
                });

    liebiao();

            }

       });

    }
   
});


function liebiao() {

    //显示所有车队的列表
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $.each(data.result.datas, function (i, item) {

                $("#personinfopage_teamName").append("<option value='" + item.id + "'>" + item.name + "</option>");

            });

            panduanteam();
        }

    });

    //显示所有单位的列表
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $.each(data.result.datas, function (i, item) {

                $("#personinfopage_unitName").append("<option value='" + item.id + "'>" + item.name + "</option>");

            });

            panduanunit();
        }
    });

}


function panduanteam() {

    var teamNames = document.getElementById("personinfopage_teamName");
    for (var b = 0, lenteamNames = teamNames.length; b < lenteamNames; b++) {
        if (teamNames.options[b].value == teamnameid) {
            teamNames.options[b].selected = true;
            break;
        }
    }

}

function panduanunit() {

    var unitNames = document.getElementById("personinfopage_unitName");
    for (var a = 0, lenunitNames = unitNames.length; a < lenunitNames; a++) {
        if (unitNames.options[a].value == nuitnameid) {
            unitNames.options[a].selected = true;
            break;
        }
    }
}




})(window);



function tijiao() {
    var tel = $("#personinfopage_tel").val();
    var name = $("#personinfopage_name").val();
    var password = $("#personinfopage_password").val();
    var email = $("#personinfopage_email").val();

    var unitNameid = $("#personinfopage_unitName").val();
    var teamNameid = $("#personinfopage_teamName").val();

    var data = new Object();
    data["token"] = "1";
    data["data"] = new Object();
    data["data"]["filter"] = new Object();
    data["data"]["items"] = [];
    data["data"]["param"] = new Object();
    data["data"]["param"]["name"] = name;
    data["data"]["param"]["phone"] = tel;
    data["data"]["param"]["email"] = email;
    data["data"]["param"]["password"] = password;
    data["data"]["param"]["jobroleid"] = '1';
    data["data"]["param"]["unitid"] = unitNameid;
    data["data"]["param"]["teamid"] = teamNameid;
    data["data"]["param"]["id"] = ID;

    $.ajax({
        url: domain + url_addUser,
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        timeout: 3000,
        success: function () {
           // alert("1634");
            //$('#myModal').modal({ keyboard: true });
            $("#confirm-dialog_info").html("修改成功");
            window.location.href = "#confirm-dialog";
        },
        error: function () {
            alert("出错");
        }
    });
}