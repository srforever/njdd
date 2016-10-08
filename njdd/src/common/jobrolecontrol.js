//1是农机手，2是农场主
$(document).ready(function () {
    var jobroleid = sessionStorage.jobroleid;
    if (jobroleid == 1) {
        $("#header_conduct").hide(); 
        $("#header_addEssence").hide();
        $("#header_Logmanage").hide();
        $("#_conduct").hide();
        $("#_addEssence").hide();
        $("#_Logmanage").hide();
        $("#unitinput").hide();
        $("#fleetinfoinput").hide();
        $("#header_manager").hide();
        $("#header_personadd").hide();
    }
});