/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
$(document).ready(function () {
    newFeatureFunctions();
});


function newFeatureFunctions() {
    newFeatureBtnEvents();
    newFeatureSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }

    newFeaturePageFunctions();
}


function newFeatureBtnEvents() {

}

function newFeaturePageFunctions() {
    showLoader();
    GetData("User", "GetNewFeatureSuggestions", "LoadNewFeatureRequest", "");

}
function newFeatureSetActiveLink() {
    $("#id-users-svg").addClass("resp-tab-active");
    $("#id-user-side").addClass("resp-tab-content-active");
    $("#id-user-features").addClass("active");
}


function DisplayNewFeatureRequest(data) {
    hideLoader();
    var parent = $(".NewFeatureList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var count = 0;
        var resolvedcount = 0;
        var pendingcount = 0;
        var childclone = parent.find(".newfeature-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("newfeature-clone");
            newchild.addClass("newclone");
            newchild.find(".sugest-sn").text(count);
            newchild.find(".suggest-name").text(result["name"]);
            newchild.find(".suggest-email").text(result["email"]);
            newchild.find(".suggest-suggest").text(result["description"]);
            newchild.find(".suggest-time").text(result["time"]);
            newchild.find(".suggest-date").text(result["date"]);
            if (result["status"] === "Pending") {
                newchild.find(".suggest-status").text(result["status"]).addClass("badge-primary-light");
                pendingcount++;
            } else {
                newchild.find(".suggest-status").text(result["status"]).addClass("badge-success-light");
                resolvedcount++;
                newchild.find(".btn-suggest-delete").removeClass("d-none");
            }

            var resolvebtn = newchild.find(".btn-suggest-implement");
            var deletebtn = newchild.find(".btn-suggest-delete");

            DisplayToolTip(resolvebtn);
            DisplayToolTip(deletebtn);

            deletebtn.click(function () {
                swal({
                    title: 'New Feature Suggestion',
                    text: "Are you sure you want to delete this feature suggestion?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        var data = ["Delete", result["id"]];
                        GetData("User", "NewFeatureOption", "LoadNewFeatureOption", data);
                    }
                });
            });
            resolvebtn.click(function () {
                swal({
                    title: 'New Feature Suggestion',
                    text: "You are about to set this new feature suggestion as implemented, do you want to continue?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        var data = ["Implement", result["id"]];
                        GetData("User", "NewFeatureOption", "LoadNewFeatureOption", data);
                    }
                });

            });
            newchild.appendTo(parent).show();
        });
        $(".total_suggests").text(totalcount);
        $(".total_suggest_implemented").text(resolvedcount);
        $(".total_suggest_pending").text(pendingcount);
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "7", text: "No Results Found"}).appendTo(row);

    }
}


function DisplayNewFeatureOption(data) {
    hideLoader();
    var resp = data[3];
    if (resp.status === "success") {
        swal({
            title: 'New Feature Suggestion',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayNewFeatureRequest(data);
        });
    } else if (resp.status === "error") {
        swal({
            title: "New Feature Suggestion",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

