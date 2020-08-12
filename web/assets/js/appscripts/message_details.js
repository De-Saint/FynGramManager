/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
var sessiontype, sessionid, messageid, messageoption;
$(document).ready(function () {
    msgDetFunctions();
});

function GetMessageID() {
    return messageid = localStorage.getItem("messageid");
}

function msgDetFunctions() {
    msgDetBtnEvents();
    msgDetSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    msgDetPageFunctions();
}


function msgDetBtnEvents() {
    $(".btn-delete-msg").click(function () {
        swal({
            title: 'Delete Message',
            text: "Are you sure you want to deleted this message?",
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            if (dismiss) {
                showLoader();
                messageid = GetMessageID();
                GetData("Messages", "DeleteMessage", "LoadDeleteMessage", messageid);
            }
        });
    });
}
function msgDetSetActiveLink() {
    $("#id-notifications-svg").addClass("resp-tab-active");
    $("#id-notifications-side").addClass("resp-tab-content-active");
    $("#id-notifications-messages").addClass("active");
}

function msgDetPageFunctions() {
    showLoader();
    messageid = GetMessageID();
    GetData("Messages", "GetMessageDetails", "LoadMessageDetails", messageid);
}


function DisplayMessageDetails(resp) {
    hideLoader();
    $(".msg-date-time").text(resp["date"] + " - " + resp["time"]);
    $(".msg-from-username").text(resp["SenderName"]);
    $(".msg-to-username").text(resp["RecieverName"]);
    $(".msg-from-useremail").text(resp["SenderEmail"]);
    $(".msg-to-useremail").text(resp["RecieverEmail"]);
    $(".msg-subject").text(resp["subject"]);
    $(".msg-body").text(resp["body"]);
}

function DisplayDeleteMessage(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Message',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            var sessiontype = GetSessionType();
            if (sessiontype === "Admin") {
                window.location = extension + "LinksServlet?type=AdminMessages";
            } else if (sessiontype === "Seller") {
                window.location = extension + "LinksServlet?type=SellerMessages";
            }
        });
    } else if (resp.status === "error") {
        swal({
            title: "Message",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Try Again',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}


