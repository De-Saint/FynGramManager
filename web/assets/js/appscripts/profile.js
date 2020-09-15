/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
var sessiontype, sessionid;
$(document).ready(function () {
    profileFunctions();
});


function profileFunctions() {
    profileBtnEvents();
    profileSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    profilePageFunctions();
}


function profileBtnEvents() {
    
    
    $("form[name=editForm]").submit(function (e) {
        var uLastName = $("#edit-lastname").val();
        var uFirstName = $("#edit-firstname").val();
        var uPhone = $("#edit-phone").val();
        var uOldPass = $("#edit-password").val();
        var uNewPass = $("#edit-password1").val();
        if (uLastName) {
            if (uFirstName) {
                if (uPhone) {
                    if (uOldPass) {
                        if (uNewPass) {
                            sessionid = verifyUser();
                            var data = [sessionid, uLastName, uFirstName, 1, uPhone, uOldPass, uNewPass];
//                            alert(data);
                            showLoader();
                            GetData("User", "UpdateProfile", "LoadBankDetailsInfo", data);
                        } else {
                            ErrorNoty("Please, enter the new password");
                        }
                    } else {
                        ErrorNoty("Please, provide your current password");
                    }
                } else {
                    ErrorNoty("Please, enter your new phone number");
                }

            } else {
                ErrorNoty("Please, provide your firstname");
            }

        } else {
            ErrorNoty("Please, provide your lastname");
        }

        e.preventDefault();
    });
    
    
    $("form[name=addImageForm]").submit(function (e) {
        var input = document.querySelector('input[type=file]');
        $("#addimage").modal("hide");
        ConvertImageToBase64(input, sessionid, "Profile");
        e.preventDefault();
    });

    $("form[name=newBankDetailsForm]").submit(function (e) {
        var bankid = $("#bkBankID").val();
        var bkaccttype = $("#bkAcctType").val();
        var bkAcctNumber = $("#bkAcctNumber").val();
        if (bankid === 0 || bankid === "0") {
            swal({
                title: "Bank Details",
                text: 'Please select a bank or select an account type',
                type: "error",
                confirmButtonText: 'Ok',
                showCancelButton: false,
                onClose: function () {
                }
            });
        } else {
            if (bkaccttype === 0 || bkaccttype === "0") {
                swal({
                    title: "Bank Details",
                    text: 'Please select a bank or select an account type',
                    type: "error",
                    confirmButtonText: 'Ok',
                    showCancelButton: false,
                    onClose: function () {
                    }
                });
            } else {
                var data = [sessionid, bankid, bkaccttype, bkAcctNumber];
                $("#addbankdetails").modal("hide");
                showLoader();
                GetData("CashOut", "CreateBankDetails", "LoadBankDetailsInfo", data);
            }
        }
        e.preventDefault();
    });

    $(".btn-delete-bkdetails").click(function () {
        var bdbkid = document.querySelector("#bankdetails .bdbkid").textContent;
        if (bdbkid) {
            showLoader();
            GetData("CashOut", "DeleteBankDetails", "LoadBankDetailsInfo", bdbkid);
        }
    });

    $(".btn-add-busstop").click(function () {
        var newStateVal = $(".txt-add-busstop").val();
        // Set the value, creating a new option if necessary
        if ($("#busstops").find("option[value='" + newStateVal + "']").length) {
            $("#busstops").val(newStateVal).trigger("change");
            $(".txt-add-busstop").val("");
        } else {
            // Create the DOM option that is pre-selected by default
            var newState = new Option(newStateVal, newStateVal, true, true);
            // Append it to the select
            $("#busstops").append(newState).trigger('change');
            $(".txt-add-busstop").val("");
        }
    });
    $(".btn-add-street").click(function () {
        var newStateVal = $(".txt-add-street").val();
        // Set the value, creating a new option if necessary
        if ($("#streets").find("option[value='" + newStateVal + "']").length) {
            $("#streets").val(newStateVal).trigger("change");
            $(".txt-add-street").val("");
        } else {
            // Create the DOM option that is pre-selected by default
            var newState = new Option(newStateVal, newStateVal, true, true);
            // Append it to the select
            $("#streets").append(newState).trigger('change');
            $(".txt-add-street").val("");
        }
    });



    $("form[name=addAddressForm]").submit(function (e) {
        var addresstypes = $("#addresstypes").val();
        var states = $("#states").val();
        var lgas = $("#lgas").val();
        var towns = $("#towns").val();
        var busstops = $("#busstops").val();
        var streets = $("#streets").val();
        var add_closeto = $("#add_closeto").val();
        var add_postal_code = $("#add_postal_code").val();
        var add_addressline = $("#add_addressline").val();
        var add_makedefault = $("#add_makedefault").val();
        var add_phone_line = $("#add_phone_line").val();
        var data = [sessionid, addresstypes, states, lgas, towns, busstops, streets, add_closeto, add_postal_code, add_addressline, add_makedefault, add_phone_line];     
        showLoader();
        $("#add_address").modal("hide");
        GetData("Address", "AddNewAddress", "LoadBankDetailsInfo", data);
        e.preventDefault();
    });

}


function profileSetActiveLink() {
    $("#id-dashboard-svg").addClass("resp-tab-active");
    $("#id-dashboard-side").addClass("resp-tab-content-active");
    $("#id-dashboard-profile").addClass("active");
}


function profilePageFunctions() {
    showLoader();
    GetData("CashOut", "GetBanks", "LoadBanks", "");
    showLoader();
    GetData("CashOut", "GetBankDetails", "LoadBankDetails", sessionid);
    GetData("Address", "GetAddressTypes", "LoadAddressTypes", "");
    GetData("Address", "GetStates", "LoadStates", "");
}


function DisplayCreateUserImage(resp) {
    if (resp.status === "success") {
        swal({
            title: 'Image Upload',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: ' Continue!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
        });
    } else if (resp.status === "error") {
        swal({
            title: "Image Upload",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

function DisplayBanks(data) {
    hideLoader();
    var parent = $("#bkBankID");
    parent.empty();
    if (data === "empty") {
    } else {
        parent.append($('<option/>').val(0).text("Select Bank"));
        $.each(data, function (key, value) {
            parent.append($('<option/>').val(key).text(value["name"]));
        });
    }
}

function DisplayBankDetailsInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Profile Details',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: ' Continue!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
        });
    } else if (resp.status === "error") {
        swal({
            title: "Profile Details",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

function DisplayBankDetails(data) {
    hideLoader();
    if (data !== "none") {
        $("#bankdetails").removeClass("d-none");
        $(".bdbkid").text(data["id"]);
        $(".bdbkkname").text(data["bankName"]);
        $(".bdbkacctnum").text(data["account_number"]);
        $(".bdbkaccttype").text(data["account_type"]);
    } else {
        $("#bankdetails").addClass("d-none");
    }

}

function DisplayAddressTypes(data) {
    var cs = $("#addresstypes");
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Address Type"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));

        });
    }
}
function DisplayStates(data) {
    var cs = $("#states");
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select State"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
        cs.change('#states', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Address", "GetLGAs", "LoadLGAs", id);
        });
    }
}

function DisplayLGAs(data) {
    console.log(data);
    var cs = $("#lgas");
    cs.empty();
    $("#towns").empty();
    $("#busstops").empty();
    $("#streets").empty();
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.append($('<option/>').val(0).text("Select LGA"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
        cs.change('#lgas', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Address", "GetTowns", "LoadTowns", id);
        });
    }
}

function DisplayTowns(data) {
    var cs = $("#towns");
    cs.empty();
    $("#busstops").empty();
    $("#streets").empty();
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];

        cs.append($('<option/>').val(0).text("Select Town"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
        cs.change('#towns', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Address", "GetBusStops", "LoadBusStops", id);
        });
    }
}


function DisplayBusStops(data) {
    var cs = $("#busstops");
    cs.empty();
    $("#streets").empty();
    if (data === "none") {
    } else {
        var ids = data[0];
        var result = data[1];
        cs.append($('<option/>').val(0).text("Select Bus Stop"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });

        cs.change('select2:select', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Address", "GetStreets", "LoadStreets", id);
            $(".add_busstop").addClass("d-none");
        });
    }
}
function DisplayStreets(data) {
    var cs = $("#streets");
    cs.empty();
    if (data === "none") {
    } else {
        var ids = data[0];
        var result = data[1];
        cs.append($('<option/>').val(0).text("Select Street"));

        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));

        });
        cs.change('select2:select', function () {
            $(".add_street").addClass("d-none");
        });
    }
}

