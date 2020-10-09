/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
$(document).ready(function () {
    guestFunctions();
});


function guestFunctions() {
    guestrBtnEvents();
    guestSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }


    guestPageFunctions();
}


function guestrBtnEvents() {

}
function guestSetActiveLink() {
    $("#id-users-svg").addClass("resp-tab-active");
    $("#id-user-side").addClass("resp-tab-content-active");
    $("#id-user-guests").addClass("active");
}

function guestPageFunctions() {
    showLoader();
    GetData("User", "GetAllGuests", "LoadAllGuests", "");

}


function DisplayAllGuests(data) {
    hideLoader();

    var parent = $("#GuestList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var withemail = 0;
        var count = 0;
        var childclone = parent.find(".guest-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("guest-clone");
            newchild.addClass("newclone");
            newchild.find(".guest-ipaddress").text(result["ipaddress"]);
            newchild.find(".guest-location").text(result["location"]);
            newchild.find(".guest-date-time").text(result["date"] + " " + result["time"]);
            var email = result["email"];
            if (email) {
                newchild.find(".guest-email").text(result["email"]);
                withemail++;
            } else {
                newchild.find(".guest-email").text("N/A");
            }
            newchild.appendTo(parent).show();
        });
        $(".guest-count").text(totalcount);
        $(".guest-withemail-count").text(withemail);
        childclone.hide();

    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 w-100 text-center newclone font-weight-bold text-primary", text: "No Results Found "}).appendTo(row);

    }

}