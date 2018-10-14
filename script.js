// global variable
var alltabs = [];
var maxTitleLength = 80; // characters
$(function(){
    loadTabs();

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
            loadTabs();

            // show notification
            chrome.notifications.create(opt, function(){});
        });
    });
})

function loadTabs(){
    var hosts = [];
    var uniqueHosts = {};
    var tabUi = '<div class="ui top attached tabular hosts menu">';
    var tabContent = "";
    chrome.tabs.getAllInWindow(null, function(alltabs) {
      _.forEach(alltabs, function(eachTab, index){

        var length = 0;

        if(uniqueHosts[getHost(eachTab.url)] !== undefined){
          length = Object.keys(uniqueHosts[getHost(eachTab.url)]).length;
          uniqueHosts[getHost(eachTab.url)][length] = eachTab;
        }else{
          uniqueHosts[getHost(eachTab.url)] = [];
          uniqueHosts[getHost(eachTab.url)][0] = eachTab;
        }
      });

      // make UI
      var favicon = "";
      var index = 0;

      _.forEach(uniqueHosts, function(eachPage, eachHost){
          // generate unique tabs for each host
          favicon = getFavicon(eachPage[0].favIconUrl);

          tabUi += `<a class="item" data-tab="tab`+index+`">`+favicon+`</a>`;
          // print urls under host
          tabContent += `
            <div class="ui bottom attached tab segment" data-tab="tab`+index+`">`;
        // print list of open pages in side tab contents
        _.forEach(eachPage, function(page, index){
          tabContent += `<div class="ui relaxed divided list">`;
          tabContent +=
          `<div class="item">
            <div class="content">
              `+favicon+`&nbsp;&nbsp;<a class="header">`+makeTitle(page.title)+`</a>
              <a href="" class="float-right"><i class="ui icon close red"></i></a>
            </div>
           </div>`;
          tabContent += `</div>`;
        });
        tabContent += `</div>`;
        // increment counter
        index++;
      });
      tabUi += `</div>`;

      $(".list").html(tabUi+tabContent);
      $('.menu .item').tab();
      // click on first item
      $('.menu .item:first-child').trigger('click');

    });

}

function getDomain(url){
  domain=url.split("//")[1];
  return domain.split("/")[0];
}

function makeTitle(title){
  if(title.length >= maxTitleLength) return title.substring(0,maxTitleLength) + "...";
  return title;
}

function getHost(str){
  var matches = str.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  var domain = matches && matches[1];
  // for urls like chrome://extention/ code returns null
  if(domain != null)
    return domain;
  return str;
}

function getFavicon(favicon){
  // c(favicon);
  if(favicon !== undefined)
    favicon = '<img src="'+favicon+'" height="16" width="16" />';
  else favicon = '<i class="file image icon"></i>';
  return favicon;
}

function c(str){
  console.log(str);
}