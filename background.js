chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.youtube.com'},
        })
    ],
    actions: [
        new chrome.declarativeContent.ShowPageAction()
    ]
    }]);
});
function getVideoId() {
    return localStorage["videoId"];
}
function setVideoId(newVideoId) {
    localStorage["videoId"] = newVideoId;
}
function getComment() {
    return localStorage["Comment"];
}
function setComment(newComment) {
    localStorage["Comment"] = newComment;
}