/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
var sessiontype, sessionid;
$(document).ready(function () {
    discountFunctions();
});


function discountFunctions() {
    discountBtnEvents();
    discountSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    discountPageFunctions();
}


function discountBtnEvents() {

    $("#searchsinglecustomerbtn").click(function () {
        var txt = $("#searchsinglecustomertxt").val();
        if (txt.length > 2) {
            showLoader();
            GetData("User", "GetSearchUserDetails", "LoadSearchUserDetails", txt);
        }
    });

    $("#dcodeStartDate").datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
        immediateUpdates: true
    });

    $("#dcodeExpiryDate").datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
        immediateUpdates: true
    });


    $("form[name=discountForm]").submit(function (e) {
        var dcodeName = $("#dcodeName").val();
        var dcodeDescription = $("#dcodeDescription").val();
        var dcodeDeductionType = $("#dcodeDeductionType").val();
        var dcodeDeductionValue = $("#dcodeDeductionValue").val();
        if (dcodeDeductionValue.includes(",")) {
            dcodeDeductionValue = dcodeDeductionValue.replace(",", "");
        }
        var dcodeObject = $("#dcodeObject").val();
        var dcodeStartDate = $("#dcodeStartDate").val();
        var dcodeExpiryDate = $("#dcodeExpiryDate").val();
        var dcodeType = $("#dcodeType").val();
        var dcodeCustomerUserID = $(".dcode-bid").text();
        var dcodeTotalPerCustomer = $("#dcodeTotalPerCustomer").val();
        if (dcodeDeductionType === "0" || dcodeDeductionType === 0) {
            ErrorNoty("Discount Code  :::  Select the deduction type");
        } else {
            if (dcodeObject === "0" || dcodeObject === 0) {
                ErrorNoty("Discount Code  :::  Select the Item to apply code to");
            } else {
                if (dcodeType === "0" || dcodeType === 0) {
                    ErrorNoty("Discount Code  :::  Select the discount type");
                } else if ((dcodeType === 1 || dcodeType === "1") && (dcodeCustomerUserID === "" || dcodeCustomerUserID === undefined)) {
                    ErrorNoty("Discount Code  :::  Please search the Customer to create the discount code for");
                } else {
                    if (dcodeCustomerUserID === "" || dcodeCustomerUserID === undefined) {
                        dcodeCustomerUserID = 0;
                    }
                    var data = [dcodeName, dcodeDescription, dcodeDeductionType, dcodeDeductionValue, dcodeObject, dcodeStartDate, dcodeExpiryDate, dcodeType, dcodeCustomerUserID, dcodeTotalPerCustomer];
                    showLoader();
                    GetData("Discount", "NewDiscountCode", "LoadDiscountCodeInfo", data);
                }

            }
        }
        e.preventDefault();
    });

    $("form[name=deductionTypeForm]").submit(function (e) {
        var deductionTypeName = $("#deductionTypeName").val();
        var deductionTypeDesc = $("#deductionTypeDesc").val();
        var data = [deductionTypeName, deductionTypeDesc];
        showLoader();
        GetData("Discount", "CreateDiscountCodeDeductionType", "LoadDiscountCodeInfo", data);

        e.preventDefault();
    });


    $("form[name=discountTypeForm]").submit(function (e) {
        var discountTypeName = $("#discountTypeName").val();
        showLoader();
        GetData("Discount", "CreateDiscountCodeType", "LoadDiscountCodeInfo", discountTypeName);

        e.preventDefault();
    });
}

function discountSetActiveLink() {
    $("#id-accounts-svg").addClass("resp-tab-active");
    $("#id-accounts-side").addClass("resp-tab-content-active");
    $("#id-accounts-discount").addClass("active");
}

function discountPageFunctions() {
    showLoader();
    GetData("Discount", "GetDiscountCodes", "LoadDiscountCodes", "");
    GetData("Discount", "GetDiscountTypes", "LoadDiscountTypes", "");
    GetData("Discount", "GetDeductionTypes", "LoadDeductionTypes", "");
    GetData("Discount", "GetDiscountObject", "LoadDiscountObject", "");

}

function DisplayDiscountTypes(data) {
    hideLoader();
    var cs = $("#dcodeType");
    cs.empty();
    if (data === "empty") {
    } else {
        cs.append($('<option/>').val(0).text("Select The Discount Code Type"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
        cs.change('select2:select', function () {
            var option = $(this).find('option:selected');
            //Added with the EDIT
            var id = option.val();//to get content of "value" attrib
            if (id === 1 || id === "1") {
                $(".forSingleCustomer").removeClass("d-none");
            } else {
                $(".forSingleCustomer").addClass("d-none");
                $(".forSingleCustomerResult").addClass("d-none");
            }
        });
    }


    var parent = $(".DCodeTypeList");
    if (data) {
        var childclone = parent.find(".dcode-type-clone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("dcode-type-clone");
            newchild.removeClass("d-none");
            newchild.addClass("clone-child");
            newchild.find(".decode-type-sn").text(count);
            newchild.find(".decode-type-name").text(details["name"]);
            var detailsbtn = newchild.find(".btn-delete-dcode-type").click(function () {
                swal({
                    title: 'Discount Code Type',
                    text: "Are you sure you want to deleted this record?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Discount", "DeleteDiscountCodeType", "LoadDiscountCodeInfo", id);
                    }
                });
            });
            DisplayToolTip(detailsbtn);
            newchild.appendTo(parent);
        });
        childclone.hide();
    }

}

function DisplayDeductionTypes(data) {
    hideLoader();
    var cs = $("#dcodeDeductionType");
    cs.empty();
    if (data === "empty") {
    } else {
        cs.append($('<option/>').val(0).text("Select The Deduction Type"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
        cs.change('select2:select', function () {
            //Use $option (with the "$") to see that the variable is a jQuery object
            var option = $(this).find('option:selected');
        });
    }
    var parent = $(".DCodeDeductionTypeList");
    if (data) {
        var childclone = parent.find(".deduct-type-clone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("deduct-type-clone");
            newchild.removeClass("d-none");
            newchild.addClass("clone-child");
            newchild.find(".deduct-type-sn").text(count);
            newchild.find(".deduct-type-name").text(details["name"]);
            newchild.find(".deduct-type-desc").text(details["description"]);
            var detailsbtn = newchild.find(".btn-delete-dcode-deduct-type").click(function () {
                swal({
                    title: 'Deduction Type',
                    text: "Are you sure you want to deleted this record?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Discount", "DeleteDeductionType", "LoadDiscountCodeInfo", id);
                    }
                });
            });
            DisplayToolTip(detailsbtn);
            newchild.appendTo(parent);
        });
        childclone.hide();
    }


}

function DisplayDiscountObject(data) {
    hideLoader();
    var cs = $("#dcodeObject");
    cs.empty();
    if (data === "empty") {
    } else {
        cs.append($('<option/>').val(0).text("Select Item to Apply To:"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
    }

}

function DisplaySearchUserDetails(resp) {
    hideLoader();
    if (resp.Beneficiaryid !== "0") {
        $(".forSingleCustomerResult").removeClass("d-none");
        $(".dcode-bid").text(resp.Beneficiaryid);
        $(".dcode-bname").text(resp.BeneficiaryName);
        $(".dcode-bemail").text(resp.BeneficiaryEmail);
        $(".dcode-phone").text(resp.BeneficiaryPhone);
    } else if (resp.Beneficiaryid === "0") {
        $(".forSingleCustomerResult").addClass("d-none");
        $(".dcode-bname").text("");
        $(".dcode-bemail").text("");
        $(".dcode-phone").text("");
        ErrorNoty("No record was found. Please try something else");
    }

}

function ErrorNoty(msg) {
    $.growl.error({
        message: msg
    });
}

function DisplayDiscountCodeInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Discount Code',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
        });
    } else if (resp.status === "error") {
        swal({
            title: "Discount Code",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

function DisplayDiscountCodes(data) {
    hideLoader();
    var parent = $("#DiscountCodeList");
    parent.find(".new-clone").remove();
    if (data !== "none") {
        var childclone = parent.find(".dcode-clone").removeClass("d-none");
        var count = 0;
        var TotalAllCustomers = 0;
        var TotalAllSingleCustomers = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("dcode-clone");
            newchild.find(".dcode-sn").text(count);
            newchild.find(".dcode-name").text(details["name"]);
            newchild.find(".dcode-code").text(details["code"]);
            var dtype = details["discount_code_type_id"];
            if (dtype === "2" || dtype === 2) {
                TotalAllCustomers++;
            } else {
                TotalAllSingleCustomers++;
            }
            newchild.find(".dcode-type").text(details["DiscountCodeTypeName"]);
            newchild.find(".dcode-dedtype").text(details["DiscountDeductionTypeName"]);
            newchild.find(".dcode-createddate").text(details["start_date"]);
            newchild.find(".dcode-expirydate").text(details["expiry_date"]);
            newchild.find(".dcode-for").text(details["DiscountObjectName"]);
            var status = details["Status"];
            if (status === "Active") {
                newchild.find(".dcode-status").text(details["Status"]).addClass("badge badge-success");
                newchild.find(".btn-dcode-stop").removeClass("d-none");
                newchild.find(".btn-dcode-delete").addClass("d-none");
            } else if (status === "InActive") {
                newchild.find(".dcode-status").text(details["Status"]).addClass("badge badge-primary");
                newchild.find(".btn-dcode-stop").addClass("d-none");
                newchild.find(".btn-dcode-delete").removeClass("d-none");
            } else if (status === "Expired") {
                newchild.find(".dcode-status").text(details["Status"]).addClass("badge badge-danger");
                newchild.find(".btn-dcode-stop").addClass("d-none");
                newchild.find(".btn-dcode-delete").removeClass("d-none");
            }
            var detailsbtn = newchild.find(".btn-dcode-details").click(function () {
                $("#discountcodedetails").modal("show");
                DisplayDiscountCodeDetails(details);
            });
            DisplayToolTip(detailsbtn);
            var deletebtn = newchild.find(".btn-dcode-delete").click(function () {
                ProcessDiscount("Deleted", id, "Delete");
            });
            DisplayToolTip(deletebtn);
            var stopbtn = newchild.find(".btn-dcode-stop").click(function () {
                ProcessDiscount("Stopped", id, "Stop");
            });
            DisplayToolTip(stopbtn);
            newchild.appendTo(parent);
        });
        childclone.hide();
        $(".TotalDiscountCode").text(count);
        $(".TotalAllCustomers").text(TotalAllCustomers);
        $(".TotalAllSingleCustomers").text(TotalAllSingleCustomers);
    }
}

function DisplayDiscountCodeDetails(data) {
    $(".dcode-desc").text(data["description"]);
    $(".dcode-for").text(data["DiscountObjectName"]);
    $(".dcode-dedtype").text(data["DiscountDeductionTypeName"]);
    var dedtype = data["discount_deduction_type_id"];
    if (dedtype === "2" || dedtype === 2) {
        $(".dcode-dedvalue").text(PriceFormat(data["deduction_value"]));
    } else {
        $(".dcode-dedvalue").text(data["deduction_value"]);
    }
    $(".dcode-totalcreated").text(data["total_created"]);
    $(".dcode-totalavail").text(data["total_available"]);
}


function ProcessDiscount(Option, discountID, part) {
    swal({
        title: 'Discount Code',
        text: "Do you want to " + part + " this discount code record?",
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: ' Ok!',
        buttonsStyling: true
    }, function (dismiss) {
        if (dismiss) {
            var data = [Option, discountID];
            showLoader();
            GetData("Discount", "ProcessDiscount", "LoadDiscountCodeInfo", data);
        }
    });
}