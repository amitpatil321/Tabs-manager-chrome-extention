

class tabsManager {
    constructor(chunks) {
        this.uniqueHosts = {};
    }

    getOptions(callback){
        chrome.storage.sync.get(["tm_settings"], function(settings) {
            if(typeof settings == "object"){
                callback(settings);
            }
            return null;
        });
    }


    loadTabs(){
        var _this = this;
        var hosts = [];
        var tabUi = '<div class="ui top attached tabular hosts menu">';
        var tabContent = "";
        chrome.tabs.getAllInWindow(null, function(alltabs) {
          _.forEach(alltabs, function(eachTab, index){

            var length = 0;

            if(_this.uniqueHosts[_this.getHost(eachTab.url)] !== undefined){
              length = Object.keys(_this.uniqueHosts[_this.getHost(eachTab.url)]).length;
              _this.uniqueHosts[_this.getHost(eachTab.url)][length] = eachTab;
            }else{
              _this.uniqueHosts[_this.getHost(eachTab.url)] = [];
              _this.uniqueHosts[_this.getHost(eachTab.url)][0] = eachTab;
            }
          });

          // make UI
          var favicon = "";
          var index = 0;

          _.forEach(_this.uniqueHosts, function(eachPage, eachHost){
              // get number of childs for same host
              var childs = Object.keys(eachPage).length;
              // generate unique tabs for each host
              favicon = _this.getFavicon(eachPage[0].favIconUrl);

              tabUi += `<a class="item" data-tab="tab`+index+`">`+favicon;

              // Check user settings
              if(settings.child_count)
                tabUi += `<div class="floating ui grey label">`+childs+`</div>`;

              tabUi += `</a>`;
              // print urls under host
              tabContent += `
                <div class="ui bottom attached tab segment" data-tab="tab`+index+`">`;

            // print list of open pages in side tab contents
            _.forEach(eachPage, function(page, index){
              tabContent += `<div class="ui relaxed divided list">`;
              tabContent +=
              `<div class="item">
                <div class="content" id="`+page.id+`">
                  `+favicon+`&nbsp;&nbsp;<a class="header sitetitle">`+_this.makeTitle(page.title)+`</a>`;
                  // highlight active tab
                  if(page.active)
                    tabContent += `<a class="ui green empty circular label"></a>`;

                  tabContent += `<a href="" class="float-right">
                    <i class="ui icon close red"></i></a>
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


    getDomain(url){
      domain=url.split("//")[1];
      return domain.split("/")[0];
    }

    makeTitle(title){
      if(title.length >= maxTitleLength) return title.substring(0,maxTitleLength) + "...";
      return title;
    }

    getHost(str){
      var matches = str.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      var domain = matches && matches[1];
      // for urls like chrome://extention/ code returns null
      if(domain != null)
        return domain;
      return str;
    }

    getFavicon(favicon){
      // c(favicon);
      if(favicon !== undefined)
        favicon = '<img src="'+favicon+'" height="16" width="16" />';
      else favicon = '<i class="file image icon"></i>';
      return favicon;
    }

    c(str){
      console.log(str);
    }

}