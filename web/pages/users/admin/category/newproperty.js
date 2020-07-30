/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
var sessionid, sessiontype, propertyid, propoption;
$(document).ready(function () {
    newPropertyFunctions();
});

function GetPropertyID() {
    return categoryid = localStorage.getItem("propertyid");
}
function GetPropertyOption() {
    return catoption = localStorage.getItem("propoption");
}

function newPropertyFunctions() {
    newPropertyBtnEvents();
    newPropertySetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    newPropertyPageFunctions();
}



function newPropertyBtnEvents() {
    $('input:radio[name="ispropcat"]').change(
            function () {
                if ($(this).is(':checked') && $(this).val() === '1') {
                    $(".prop-root-disp").addClass("d-none");
                } else {
                    $(".prop-root-disp").removeClass("d-none");
                }
            });

    $("form[name=newPropertyForm]").submit(function (e) {
        var newpropname = $("#newprop-name").val();
        var isrootprop = $("input[name=ispropcat]:checked").val();
        var selectedpropid = $("#selectedpropid").val();
        if (selectedpropid === "") {
            selectedpropid = 0;
        }
        propertyid = GetPropertyID();
        propoption = GetPropertyOption();
        var data = [newpropname, isrootprop, selectedpropid, propoption, propertyid];
        showLoader();
        GetData("Category", "CreateProperty", "LoadNewPropertiesInfo", data);
        e.preventDefault();
    });
}

function newPropertyPageFunctions() {
    GetData("Category", "GetProperties", "LoadPropProperties", "");


    propertyid = GetPropertyID();
    if (propertyid !== "0" || propertyid !== 0) {
        showLoader();
        GetData("Category", "GetPropertyDetails", "LoadPropertyDetails", propertyid);
    }
}

function newPropertySetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-category").addClass("active");
}


function DisplayNewPropertiesInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Properties',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
            $("#newPropertyForm").trigger("reset");
        });
    } else if (resp.status === "error") {
        swal({
            title: "Properties",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

function DisplayPropProperties(data) {

    var cs = $("#prop-root-cat");
    cs.empty();
    if (data === "none") {
    } else {
        cs.append($('<option/>').val(0).text("Select Property"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
        cs.change('select2:select', function () {
            var option = $(this).find('option:selected');
            //Added with the EDIT
            var id = option.val(); //to get content of "value" attrib
            GetData("Category", "GetParentProperties", "LoadParentProperties", id);
            var text = option.text(); //to get <option>Text</option> content
            $("#selectedproptext").val(text);
            $("#selectedpropid").val(id);
        });
    }
}

function DisplayPropertyDetails(data) {
    console.log(data.isroot_property);
    hideLoader();
     $("#newprop-name").val(data.name);
    if (data.isroot_property === "1" || data.isroot_property === 1) {
        $(".prop-root-disp").addClass("d-none");
        $("input[name=ispropcat][value='1']").prop("checked", true);
        $("input[name=ispropcat][value='0']").prop("checked", false);
    } else if (data.isroot_property === "0" || data.isroot_property === 0) {
        $(".prop-root-disp").removeClass("d-none");
        $("input[name=ispropcat][value='0']").prop("checked", true);
        $("input[name=ispropcat][value='1']").prop("checked", false);
    }
}