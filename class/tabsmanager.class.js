

class tabsManager {
    constructor(chunks) {
      this.uniqueHosts = {};
      this.maxTitleLength = 55; // trim extra characters
      this.settings = {};
      // load settings
      this.getOptions(function(){});
    }

    // read settings data from storage
    getOptions(callback){
      var _this = this;
      chrome.storage.sync.get(["tm_settings"], function(settings) {
          if(typeof settings == "object"){
              _this.settings = settings.tm_settings;
              callback(settings.tm_settings);
          }
          return null;
      });
    }

    // notification
    notify(message){
        var opt = {
          type: "basic",
          title: chrome.runtime.getManifest().name,
          message: message,
          iconUrl: "../assets/images/hello_extensions.png"
        }
        // show notification
        chrome.notifications.create(opt, function(){});
    }

    // read all pages and group them
    loadTabs(){
        var _this = this;
        var hosts = [];
        var tabUi = '<div class="ui top attached tabular hosts menu">';
        var tabContent = "";
        // geta details of all tabs
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

              tabUi += `<a class="item" data-tab="tab${index}" data-index="${index}">`+favicon;

              // Check user settings
              if(_this.settings.child_count)
                tabUi += ` <span class="childcount">${childs}</span>`;

                tabUi += `<div class="floating ui red label closeall">x</div>`;

              tabUi += `</a>`;
              // print urls under host
              tabContent += `
                <div class="ui bottom attached tab segment" data-tab="tab${index}">`;

            // print list of open pages in side tab contents
            _.forEach(eachPage, function(page, index){
              tm.c(page);
              tabContent += `<div class="ui relaxed divided list">`;
              tabContent +=
              `<div class="item">
                <div class="content eachpage" id="${page.id}" data-active="${page.active}">
                  ${favicon}&nbsp;&nbsp;<a class="header sitetitle">${_this.makeTitle(page.title)}</a>`;
                  // highlight active tab
                  if(page.active)
                    tabContent += `<a class="ui green empty circular label"></a>`;

                  tabContent += `<a href="" class="float-right closetab">
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

    // extract domain name from url string
    // getDomain(url){
    //   domain=url.split("//")[1];
    //   return domain.split("/")[0];
    // }

    // format/trim tab title
    makeTitle(title){
      if(title.length >= this.maxTitleLength) return title.substring(0,this.maxTitleLength) + "...";
      return title;
    }

    // extract host name from url string
    getHost(str){
      var matches = str.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      var domain = matches && matches[1];
      // for urls like chrome://extention/ code returns null
      if(domain != null)
        return domain;
      return str;
    }

    // wrap webite favicon in img tag
    getFavicon(favicon){
      // c(favicon);
      if(favicon !== undefined)
        favicon = `<img src="${favicon}" height="16" width="16" />`;
      else favicon = `<i class="file image icon"></i>`;
      return favicon;
    }

    selectClosest(item){
      index = item.closest('.item').data("index");
      if(index >= 1){
        index = index - 1;
        $('.item[data-index="'+parseInt(index)+'"]').trigger('click');
      }
    }

    c(str){
      console.log(str);
    }

}