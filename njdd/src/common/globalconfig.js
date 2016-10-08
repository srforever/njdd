
function entrypage_signin_btn_click() {
   
    var tel = $("#entrypage_signin_tel").val();
    var password = $("#entrypage_signin_password").val();
    if (tel == null || tel == "" || password == null || password == "") {
        $("#confirm-dialog_info").html("用户电话或密码不能为空");
        window.location.href = "#confirm-dialog";
    } else {
        $.ajax({
            url: domain+url_checkUser+"?token=1&username=" + tel + "&password=" + password,
            type: 'get',
            async: false,
            success: function (json) {
                var datajson;

                if (typeof (json) == "object") {
                    //为对象
                    datajson = json;
                }
                else {
                    //将字符串转换为对象
                    datajson = JSON.parse(json);
                }
                if (datajson.result.datas.length > 0) {
                    sessionStorage.name = datajson.result.datas[0].name;
                    sessionStorage.unitName = datajson.result.datas[0].unitName;
                    sessionStorage.userid = datajson.result.datas[0].userid;
                    sessionStorage.email = datajson.result.datas[0].email;
                    sessionStorage.jobroleid = datajson.result.datas[0].jobroleid;
                    sessionStorage.jobrolename = datajson.result.datas[0].jobrolename;
                    sessionStorage.tel = tel;
                    sessionStorage.unitid = datajson.result.datas[0].unitid;
                    sessionStorage.password = datajson.result.datas[0].password;
                    window.location.href = "../../entry/mainpage.html";
                } else {
                    $("#confirm-dialog_info").html("登录失败");
                    window.location.href = "#confirm-dialog";
                }
            },
            error: function (errorMsg) {
                $("#confirm-dialog_info").html(errorMsg);
                window.location.href = "#confirm-dialog";
            }
        });
    }

}


function entrypage_register_btn_click() {

    var selectval = $("#personinfopage_unitName").val();

    var tel = $("#entrypage_register_tel").val();
    var name = $("#entrypage_register_name").val();
    var password = $("#entrypage_register_password").val();
    var passwordsure = $("#entrypage_register_passwordsure").val();
    if (tel == null || tel == "" || password == null || password == "" || name == null || name == "" || passwordsure == null || passwordsure == "") {
        $("#confirm-dialog_info").html("所有内容都为必填");
        window.location.href = "#confirm-dialog";
    } else {
        if (password == passwordsure) {

            var data = new Object();
            data["token"] = "1";
            data["data"] = new Object();
            data["data"]["filter"] = new Object();
            data["data"]["items"] = [];
            data["data"]["param"] = new Object();
            data["data"]["param"]["name"] = name;
            data["data"]["param"]["phone"] = tel;
            data["data"]["param"]["email"] = '';
            data["data"]["param"]["password"] = password;

            if (selectval == "2") {
                
                data["data"]["param"]["jobroleid"] = '2';
            }
            else {

                data["data"]["param"]["jobroleid"] = '1';
            }
          

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
                success: function (json) {
                    
                    var datajson;

                    if (typeof (json) == "object") {
                        //为对象
                        datajson = json;
                    }
                    else {
                        //将字符串转换为对象
                        datajson = JSON.parse(json);
                    }
                    if (datajson.result.datas.length > 0) {
                       
                        sessionStorage.phone = tel;
                        sessionStorage.name = datajson.result.datas[0].name;
                        sessionStorage.userid = datajson.result.datas[0].id;
                        sessionStorage.email = datajson.result.datas[0].email;
                        sessionStorage.jobroleid = datajson.result.datas[0].jobroleid;
                        sessionStorage.password = datajson.result.datas[0].password;


                        window.location.href = "../../entry/mainpage.html";
                    } else {
                        $("#confirm-dialog_info").html("该手机号码已注册");
                        window.location.href = "#confirm-dialog";
                    }
                },
                error:function(errorMsg) {
                    $("#confirm-dialog_info").html(errorMsg);
                    window.location.href = "#confirm-dialog";
                }
            });
        } else {
            $("#confirm-dialog_info").html("密码与确认密码不一致！");
            window.location.href = "#confirm-dialog";
        }

    }
}




//function judgeunit()
//{
    
//    if (value == 1) {
//        alert("1");
//    }
//    if (value == 0) {
//        alert("0");
//    }
//}




