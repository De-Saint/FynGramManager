/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
var sessiontype, sessionid, messageid, messageoption;
$(document).ready(function () {
    msgFunctions();
});

function msgFunctions() {
    msgBtnEvents();
    msgSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    msgPageFunctions();
}


function msgBtnEvents() {
    $("#searchuserbtn").click(function () {
        var txt = $("#searchusertxt").val();
        if (txt.length > 2) {
            showLoader();
            GetData("User", "GetSearchUserDetails", "LoadSearchResultDetails", txt);
        }
    });


    $("form[name=newMessageForm]").submit(function (e) {
        var toUserID = $(".toUserID").text();
        var msgSubject = $("#msgSubject").val();
        var msgBody = $("#msgBody").val();
        var data = [toUserID, msgSubject, msgBody, sessionid];
        showLoader();
        GetData("Messages", "NewMessage", "LoadNewMessage", data);
        e.preventDefault();
    });
}
function msgSetActiveLink() {
    $("#id-notifications-svg").addClass("resp-tab-active");
    $("#id-notifications-side").addClass("resp-tab-content-active");
    $("#id-notifications-messages").addClass("active");
}

function msgPageFunctions() {
    showLoader();
    var data = [sessionid, "All"];
    GetData("Messages", "GetMessages", "LoadMessages", data);
}


function DisplayMessages(data, parent) {
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var result = data[1];
        var totalcount = data[2];
        var childclone = parent.find(".msg-clone").removeClass("d-none");
        var count = 0;
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            var newchild = childclone.clone();
            newchild.removeClass("dcode-clone");
            newchild.find(".dcode-sn").text(count);
            newchild.find(".msg-sender").text(details["SenderName"]);
            var detailsbtn = newchild.find(".msg-subject").text(details["subject"]).click(function () {
                var sessiontype = GetSessionType();
                if (sessiontype === "Admin") {
                    localStorage.setItem("messageid", details["msgid"]);
                    window.location = extension + "LinksServlet?type=AdminReadMessage";
                } else if (sessiontype === "Seller") {
                    localStorage.setItem("messageid", details["msgid"]);
                    window.location = extension + "LinksServlet?type=SellerReadMessage";
                }
            });
            newchild.addClass("newclone");
            detailsbtn.hover(function () {
                detailsbtn.addClass("text-primary");
            }, function () {
                detailsbtn.removeClass("text-primary");
            });
            newchild.find(".msg-body").text(details["body"]);
            newchild.find(".msg-date-time").text(details["time"] + " - " + details["date"]);
            newchild.appendTo(parent);
        });
        childclone.hide();
        $(".TotalDiscountCode").text(totalcount);
    }
}

function DisplaySearchResultDetails(resp) {
    hideLoader();
    if (resp.Beneficiaryid !== "0") {
        $(".searchresult").removeClass("d-none");
        $(".result-bid").text(resp.Beneficiaryid);
        $(".result-bname").text(resp.BeneficiaryName);
        $(".result-bemail").text(resp.BeneficiaryEmail);
        $(".result-bphone").text(resp.BeneficiaryPhone);
    } else if (resp.Beneficiaryid === "0") {
        $(".searchresult").addClass("d-none");
        $(".result-bname").text("");
        $(".result-bemail").text("");
        $(".result-bphone").text("");
        ErrorNoty("No record was found. Please try something else");
    }
}

function DisplayNewMessage(resp) {
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
            window.location = extension + "LinksServlet?type=AdminMessages";
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

