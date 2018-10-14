
function load_tabs(){
    var hosts = [];

    chrome.tabs.getAllInWindow(null, function(tabs) {
      var list = "";
      var uniqueHosts = [];
      var favicon = "";
      var htmlTabs = "";
      /*
        <div class="ui top attached tabular menu">
          <a class="active item" data-tab="first">First</a>
          <a class="item" data-tab="second">Second</a>
          <a class="item" data-tab="third">Third</a>
        </div>
        <div class="ui bottom attached active tab segment" data-tab="first">
          First
        </div>
        <div class="ui bottom attached tab segment" data-tab="second">
          Second
        </div>
        <div class="ui bottom attached tab segment" data-tab="third">
          Third
        </div>
      */

      // find unique hosts and store in array
      var tabContents = '';
      _.map(tabs, function(eachtab) {
        // console.log(eachtab);
        if($.inArray( getHost(eachtab.url), uniqueHosts) === -1)
          uniqueHosts.push(getHost(eachtab.url));
      });


      var htmlTabs = '<div class="ui top attached tabular menu">';
      $.each(uniqueHosts, function(index, each){
          // find items with same hostname
          var find = _.filter(tabs ,function(item){ return item.url.indexOf(each)>-1; });

          // get host favicon
          favicon = getFavicon(find[0].favIconUrl);


          htmlTabs += `<a class="item" data-tab="`+index+`">`+favicon+`</a>`;
          htmlTabs += `</div>`;

          tabContents += `<div class="ui bottom attached tab segment" data-tab="`+index+`">`;
          $.each(find, function(index, eachtab){
            tabContents += eachtab.title;
          });
          tabContents += `</div>`;
      });

      c(htmlTabs);
      c(tabContents);

      $(".list").html(htmlTabs+tabContents);
      $('.menu .item').tab();

      /*
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
      */

    });
}