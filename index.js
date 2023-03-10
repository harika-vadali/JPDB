
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "DB1";
var empRelationName = "EmpData";
var connToken = "90932991|-31949274019228884|90949465";

$("#empid").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var pid = $("#pid").val();
    var jsonStr = {
        id : pid
    };
    return JSON.stringify(jsonStr);
}

function resetForm(){
    $("#pid").val("");
    $("#pname").val("");
    $("#pa").val("");
    $("#pad").val("");
    $("#pd").val("");
    $("pid").prop("disabled", false);
    $("save").prop("disabled", true);
    $("change").prop("disabled", true);
    $("reset").prop("disabled", true);
    $("#pid").focus();
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    $("save").prop("disabled", true);
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
//    console.log(resJsonObj);
    resetForm();
    $("#pid").focus();
}
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#pname").val(record.name);
    $("#pa").val(record.asa);
    $("#pad").val(record.asb);
    $("#pd").val(record.asc);
}
function changeData(){
    $("#change").prop("disabled",true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#pid").prop("disabled",false);
    $("#reset").prop("disabled", true);
    $("#pid").focus();
}
function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#pname").focus();
    }
    else if(resJsonObj.status === 200){
        $("#pid").prop("disabled", true);
        fillData(resJsonObj);
        $("#save").prop("disabled", true);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled",false);
        $("#pname").focus();
    }
}
function validateData(){
    var pid, pname, pa, pad, pd;
    pid = $("#pid").val();
    pname = $("#pname").val();
    pa = $("#pa").val();
    pad = $("#pad").val();
    pd = $("#pd").val();
    if(pid === ""){
        alert("Employee ID missing");
        $("#empid").focus();
        return "";
    }
    if(pname === ""){
        alert("Employee Name missing");
        $("#empname").focus();
        return "";
    }
    if(pa === ""){
        alert("Assigned To missing");
        $("#empsal").focus();
        return "";
    }
    if(pad === ""){
        alert("Assignment Date missing");
        $("#empsal").focus();
        return "";
    }
    if(pd === ""){
        alert("Deadline missing");
        $("#empsal").focus();
        return "";
    }
    var jsonStrObj = {
        id: pid,
        name: pname,
        asa: pa,
        asb: pad,
        asc: pd
    };
    return JSON.stringify(jsonStrObj);
}

