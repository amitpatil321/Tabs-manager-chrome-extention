$(function(){
    var settings;

    $("#saveoptions").click(function(){
        // get updated values and store in chrome storage
        var child_count = ($("#noofpages").is(":checked")) ? 1 : 0;
        var close_confirm = ($("#closeconfirm").is(":checked")) ? 1 : 0;
        // prepare settings object
        settings = {
            "child_count"   : child_count,
            "close_confirm" : close_confirm
        };

        // update options
        chrome.storage.sync.set({ "tm_settings" : settings }, function() {
            $(".saved").fadeIn();
            setTimeout(function(){ $(".saved").fadeOut() }, 3000);
        });
    });
})