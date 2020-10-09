/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
$(document).ready(function () {
    complaintFunctions();
});


function complaintFunctions() {
    complaintBtnEvents();
    complaintSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    complaintPageFunctions();
}


function complaintBtnEvents() {

}
function complaintSetActiveLink() {
    $("#id-users-svg").addClass("resp-tab-active");
    $("#id-user-side").addClass("resp-tab-content-active");
    $("#id-user-complaints").addClass("active");
}

function complaintPageFunctions() {
    showLoader();
    GetData("User", "GetComplaints", "LoadCompaints", "");
}

function DisplayComplaints(data) {
    hideLoader();
    var parent = $(".ComplaintList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var count = 0;
        var resolvedcount = 0;
        var pendingcount = 0;
        var childclone = parent.find(".complist-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("complist-clone");
            newchild.addClass("newclone");
            newchild.find(".comp-sn").text(count);
            newchild.find(".comp-uname").text(result["complaintUserName"]);
            newchild.find(".comp-date").text(result["date"]);
            newchild.find(".comp-time").text(result["time"]);
            newchild.find(".comp-subject").text(result["subject"]);
            newchild.find(".comp-desc").text(result["description"]);
            if (result["status"] === "Pending") {
                newchild.find(".comp-status").text(result["status"]).addClass("badge-primary-light");
                pendingcount++;
            } else {
                newchild.find(".comp-status").text(result["status"]).addClass("badge-success-light");
                resolvedcount++;
                newchild.find(".btn-comp-delete").removeClass("d-none");
            }

            var resolvebtn = newchild.find(".btn-comp-resolved");
            var deletebtn = newchild.find(".btn-comp-delete");

            DisplayToolTip(resolvebtn);
            DisplayToolTip(deletebtn);

            deletebtn.click(function () {
                swal({
                    title: 'Complaint',
                    text: "Are you sure you want to delete this complaint?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        var data = ["Delete", result["id"]];
                        GetData("User", "ComplaintOption", "LoadComplaintOption", data);
                    }
                });
            });
            resolvebtn.click(function () {
                swal({
                    title: 'Complaint',
                    text: "You are about to set this complaint as resolved, do you want to continue?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        var data = ["Resolve", result["id"]];
                        GetData("User", "ComplaintOption", "LoadComplaintOption", data);
                    }
                });

            });
            newchild.appendTo(parent).show();
        });
        $(".complaintTotalCount").text(totalcount);
        $(".complaintResolvedCount").text(resolvedcount);
        $(".complaintPendingCount").text(pendingcount);
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "7", text: "No Results Found"}).appendTo(row);

    }
}


function DisplayComplaintOption(data) {
    hideLoader();
    var resp = data[3];
    if (resp.status === "success") {
        swal({
            title: 'Complaint',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayComplaints(data);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Complaint",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}