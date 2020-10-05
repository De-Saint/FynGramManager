/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "";
$(document).ready(function () {
    performActions();
});

function getCurrentPath() {
//returns the current page the user is on
    var path = window.location.pathname;
    return path;
}
function getCurrentPage() {
//returns the current page the user is on
    var path = window.location.pathname;
    var page = path.split("/").pop();
    return page;
}

function capitaliseFirstLetter(text) {
    if (text !== undefined) {
        return text.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}

function PriceFormat(price) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    });
    price = formatter.format(price);
    price = price.replace("NGN", "₦");
    return price.replace(".00", "");
}
function NumberFormat(number) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    });
    number = formatter.format(number);
    number = number.replace("NGN", "");
    return number.replace(".00", "");
}


function GetSessionType() {
    var sessiontype = "";
    if (localStorage) {
        sessiontype = localStorage.getItem("sessiontype");
    }
    return sessiontype;
}


function verifyUser() {
    var sessionidString = "";
//This function checks if a user is signed in and responds     
    if (localStorage) {
        var sessionidString = localStorage.getItem("sessionid");
        if (sessionidString === "null" || sessionidString === null || sessionidString === "" || sessionidString === "undefined" || sessionidString === undefined) {
//        $(".forMembers").hide();
//        $(".forMembers").addClass("hide");
//        $(".notforMembers").show();
//        $(".notforMembers").removeClass("hide");
            return sessionidString = 0;
        } else {
            var sessionoption = sessionidString.split("#")[1];
            if (sessionoption === "A") {
                $(".forAdmin").show();
                $(".forAdmin").removeClass("d-none");
            } else if (sessionoption === "S") {
                $(".forAdmin").hide();
                $(".forAdmin").addClass("d-none");
//                $(".forSellers").show();
//                $(".forSell").removeClass("d-none");
            }
        }
    } else {
        return sessionidString = 0;
    }
    return sessionidString;
}

function showLoader() {
    $("#loading").removeClass("d-none");
}
function hideLoader() {
    $("#loading").addClass("d-none");
}


function returnToTimeOutPage(extension) {
    window.location = extension + "LinksServlet?type=TimeOut";
}


function GetData(action, type, callfunction, data) {
    var path = window.location.pathname;
    var href = window.location.href;
    var url = href.replace(path, '').replace("#", '').replace("?", '');
    $.ajax({
        url: url + '/FynGramEngine/DispatcherSerlvet',
        type: 'GET',
        data: {
            action: action,
            type: type,
            data: data
        },
        success: function (data) {
            linkToFunction(callfunction, data);
        }
    });
}

$("input[data-type='currency']").on({
    keyup: function () {
        formatCurrency($(this));
    },
    blur: function () {
        formatCurrency($(this), "blur");
    }
});

function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    var input_val = input.val();

    // don't validate empty input
    if (input_val === "") {
        return;
    }

    // original length
    var original_len = input_val.length;

    // initial caret position 
    var caret_pos = input.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf(".") >= 0) {

        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");

        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);

        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
            right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = left_side;

    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);

        // final formatting
        if (blur === "blur") {
            input_val;
        }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}

function SessionTokenManager(resp) {
    localStorage.setItem("sessionid", resp.data.sessionid);
    localStorage.setItem("sessiontype", resp.data.sessiontype);
}



function ConvertImageToBase64(file, objectid, objecttype) {
    var reader = new FileReader();
    if (!file.files.length) {
        return false;
    }
// var url = href.replace(path, '').replace("#", '').replace("?", '');
//    $.ajax({
//        url: url + '/FynGramEngine/DispatcherSerlvet',
    reader.onload = function () {
        var base64Image = reader.result.toString();
        console.log(base64Image);
        var data = base64Image.replace(/^data:image\/(png|jpg);base64,/, "");
        showLoader();
        var newData = objectid + "-" + objecttype + "-" + data;
        var path = window.location.pathname;
        var href = window.location.href;
        var url = href.replace(path, '').replace("#", '').replace("?", '');
        $.ajax({
            url: url + '/FynGramEngine/WImageServlet',
            data: newData,
            type: "POST",
            processData: false,
            cache: false,
            contentType: "text/html",
            success: function (resp) {
                hideLoader();
                if (objecttype === "Category") {
                    DisplayCreateCategoryImage(resp);
                } else if (objecttype === "Profile") {//admin, seller.buyer
                    DisplayCreateUserImage(resp);
                } else if (objecttype === "Product") {
                    SubmitUpload(resp, file);

                }
            }
        });


    };
    reader.readAsDataURL(file.files[0]);
}

function DisplayToolTip(btn) {
    btn.tooltip({
        position: {
            my: "center bottom-40",
            at: "center top"
        }
    });
}

function ErrorNoty(msg) {
    $.growl.error({
        message: msg
    });
}

function SuccessNoty(msg) {
    $.growl.notice({
        message: msg
    });
}
function WarningNoty(msg) {
    $.growl.warning({
        message: msg
    });
}