/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
$(document).ready(function () {
    reviewsFunctions();
});


function reviewsFunctions() {
    reviewsBtnEvents();
    reviewsSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    reviewPageFunctions();
}


function reviewsBtnEvents() {

}
function reviewsSetActiveLink() {
    $("#id-notifications-svg").addClass("resp-tab-active");
    $("#id-notifications-side").addClass("resp-tab-content-active");
    $("#id-notifications-reiviews").addClass("active");
}


function reviewPageFunctions() {
    showLoader();
    GetData("Review", "GetUserReviewList", "LoadUserReviews", sessionid);
}

function DisplayUserReviews(data) {

    hideLoader();
    var reviewParent = $("#reviewsList");
    reviewParent.find(".new-clone").remove();
    if (data === "none") {
        reviewParent.text("No Result");
    } else {
        var childclone = reviewParent.find(".review-clone");
        var count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            console.log(details["date"]);
            newchild.removeClass("review-clone");
            newchild.removeClass("d-none");

            if (details["reviewUserImage"] === "none") {
                var image_url = extension + "assets/images/no-image.png";
                $(".review-userimage").attr("src", image_url);
            } else {
                $(".review-userimage").attr("src", "data:image/png;base64," + details["reviewUserImage"]);
            }
            if (details["reviewProductImage"] === "none") {
                var image_url = extension + "assets/images/no-image.png";
                $(".reviewProductImage").attr("src", image_url);
            } else {
                $(".reviewProductImage").attr("src", "data:image/png;base64," + details["reviewProductImage"]);
            }

            newchild.addClass("new-clone");
            newchild.find(".review-date").text(details["date"]);
            newchild.find(".review-time").text(details["time"]);
            newchild.find(".review-comment").text(details["comment"]);
            newchild.find(".review-username").text(details["reviewUsername"]);
            newchild.find(".review-rate-value").text(details["rate_value"]);
            newchild.find(".review-product-name").text(details["reviewProductName"]);
            newchild.find(".review-product-desc").text(details["reviewProductDesc"]);
            var btndelete = newchild.find(".review-btn-delete").click(function () {
                swal({
                    title: 'Review',
                    text: "Are you sure you want to delete this review?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                GetData("Review", "DeleteReview", "LoadDeleteReview", details["id"]);
                    }
                });
                
            });
            DisplayToolTip(btndelete);
            newchild.appendTo(reviewParent).show();
        });
        childclone.hide();

        $(".review-count").text(count);
    }

}

function DisplayDeleteReview(data){
    hideLoader();
    var resp = data.result;
     if (resp.status === "success") {
        swal({
            title: 'Review',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
           DisplayUserReviews(data.reviewdata);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Review",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
    
}

