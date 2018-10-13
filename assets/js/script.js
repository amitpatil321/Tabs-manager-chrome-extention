// global variable
var alltabs = [];
$(function(){
    load_tabs();

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
            load_tabs();

            // show notification
            chrome.notifications.create(opt, function(){});
        });
    });
})

function getDomain(url){
  domain=url.split("//")[1];
  return domain.split("/")[0];
}

function load_tabs(){
    var hosts = [];

    chrome.tabs.getAllInWindow(null, function(tabs) {
      var list = "";
      var uniqueHosts = [];
      $.each(tabs, function(index, each){
          // store all tabs info in a object for later classification
          alltabs.push(each)
          var title = each.title;
          var favicon = each.favIconUrl;  
          // trim large title
          if(title.length > 60) title = title.substring(0,50) + "...";
          // set default image icon if there is no favicon
          if(favicon != undefined) favicon = '<img src="'+favicon+'" height="16" width="16" />';
          else favicon = '<i class="file image icon"></i>';  

          // prepare list items
          list += `
          <div class="website">
            `+favicon+`
            <span id="title">`+title+`</span>
            <a href="#" id="`+each.id+`"><i class="disabled close red icon"></i></a>
          </div>
          `;
      });

      // console.log(_.filter(alltabs, { "favIconUrl" : 'https://semantic-ui.com/favicon.ico' }));
      // console.log(_.chain(alltabs).map('url').uniq().value());

      // find all urls from tabs
      // hosts = _.chain(alltabs).map('url').uniq().value();
      var tabs = '<div class="ui tabular menu">';
      var tabContents = '';
      _.map(alltabs, function(eachtab) {
        // console.log(eachtab);
        if($.inArray( get_host(eachtab.url), uniqueHosts) === -1)
          uniqueHosts.push(get_host(eachtab.url));
      });

      $.each(uniqueHosts, function(index, each){
          var find = _.filter(alltabs ,function(item){ return item.url.indexOf(each)>-1; });
          tabs += `<div class="item" data-tab="tab-name`+index+`"><img src="`+find[0].favIconUrl+`"></div>`;
          tabContents += `<div class="ui tab" data-tab="tab-name`+index+`">`;
          $.each(find, function(index, eachtab){
            tabContents += eachtab.title;
          });
          tabContents += `</div>`;
      });

      $(".list").html(tabs+tabContents);
      $('.tabular.menu .item').tab();
    });
}

function get_host(str){
  var matches = str.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  var domain = matches && matches[1];
  // for urls like chrome://extention/ code returns null
  if(domain != null)
    return domain;
  return str;
}

function c(str){
  console.log(str);
}