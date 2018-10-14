
chrome.tabs.onCreated.addListener(function (){
    update_badge();
});

chrome.tabs.onRemoved.addListener(function (){
    update_badge();
});

function update_badge(){
    chrome.tabs.getAllInWindow(null, function(tabs) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: tabs.length.toString()});
    });
}