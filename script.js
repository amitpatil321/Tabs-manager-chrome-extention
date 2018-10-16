// global variable
var alltabs = [];
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
    // set tab selected
    chrome.tabs.update(parseInt(tabId), {"active": true}, function(tab){ });
  });

  // close all tabs inside parent
  $(document).on("click", ".closeall", function(e){
    var confirmed   = false;
    var index       = "";
    var tabid       = $(this).closest('.item').data("tab");
    var totalChilds = $(".segment[data-tab='"+tabid+"'] .eachpage").length;

    // check if user wants to see confirm box ??
    if(tm.settings.close_confirm && totalChilds > 0){
      if(confirm(`Do you really want to close ${totalChilds} tabs ?`)){
        confirmed = true
      }
    }


    if((tm.settings.close_confirm && confirmed) || !tm.settings.close_confirm){
      $(".segment[data-tab='"+tabid+"'] .eachpage").each(function(){
        // check if its a active tab ?
        // if so then make some other tab active and then close this tab
        chrome.tabs.remove(parseInt($(this).attr("id")));
        tm.notify("Closed "+totalChilds+" tabs!");
      });
      // hide this tab
      $(".item[data-tab='"+tabid+"']").hide();
      $(".segment[data-tab='"+tabid+"']").hide();

      // select previous item as active
      tm.selectClosest($(this));

      $(this).closest(".item:visible").html();

    }
  });

  // close tabs
  $(document).on("click", ".closetab", function(){
    var id = $(this).closest(".eachpage").attr("id");
    var title = $(this).closest(".sitetitle").text();
    // select previous item as active
    tm.selectClosest($(this));
    // close tab
    chrome.tabs.remove(parseInt(id), function(){});
  });

  // open settings page
  $(".settings").click(function(){
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  setTimeout(function(){
    $('html').height($('.segment.active').height());
  }, 1000);
});