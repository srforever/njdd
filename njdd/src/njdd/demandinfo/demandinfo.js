
//提交保存信息
function tijiao() {

    var tel = $("#personinfopage_tel").val();
    var name = $("#personinfopage_name").val();
    var remark = $("#personinfopage_email").val();
    var userid = sessionStorage.userid;

    var data = new Object();
    data["token"] = "1";
    data["data"] = new Object();
    data["data"]["filter"] = new Object();
    data["data"]["items"] = [];
    data["data"]["param"] = new Object();
    //data["data"]["param"]["id"] = "cc869beb-777a-40fa-a4ed-c71c12220075";
    data["data"]["param"]["infoOwnerid"] = userid;
    data["data"]["param"]["infoOwnername"] = name;
    data["data"]["param"]["infoOwnerphone"] = tel;
    data["data"]["param"]["remark"] = remark;
    data["data"]["param"]["isover"] = "0";

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

