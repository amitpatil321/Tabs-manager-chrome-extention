// global variable
var alltabs = [];
var maxTitleLength = $(".container").width - 100; // characters
var settings = {};
var tm = new tabsManager();

$(function(){

  // load settings
  tm.getOptions(function(settings){
    tm.c(settings);
  });

  tm.loadTabs();

  // focus clicked tab
  $(document).on("click", ".sitetitle", function(){
    var tabId  = $(this).closest(".content").attr("id");
    chrome.tabs.update(parseInt(tabId), {"active": true}, function(tab){ });
  });

  // close tabs
  $(document).on("click", ".website a", function(){
      var id = $(this).attr("id");
      var title = $(this).parent().find("#title").text();
      chrome.tabs.remove(parseInt(id), function(){
          var opt = {
            type: "basic",
            title: "Tab Closed",
            message: title + " - Closed",
            iconUrl: "hello_extensions.png"
          }
          // refresh the list
          tm.loadTabs();

          // show notification
          chrome.notifications.create(opt, function(){});
      });
  });
})