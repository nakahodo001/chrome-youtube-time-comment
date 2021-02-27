function timeToSec(time) {
    var hms = time.split(':');
    var sec = 0;
    for (var i in hms) {
        sec *= 60;
        sec += parseInt(hms[i]);
    }
    return sec
}

function openAnchor(anchor) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabID = tabs[0].id;
        if (tabID === undefined) {
            return;
        }
        chrome.tabs.executeScript(tabID, {
            code: `window.location.href="${anchor.href}";`
        }, console.log);
    });
}

function displayComments(data, youtubeUrl) {
    var comments = JSON.parse(data);
    //const obj = {};
    //Object.keys(comments).reverse().forEach(key => obj[key] = comments[key]);
    //comments = obj;
    for (var time in comments) {
        for (var i in comments[time]) {
            var url = youtubeUrl + "&t=" + timeToSec(time) + "s";
            $('#time-comments').append('<tr><td><a href="' + url + '">' + time + '</a></td><td>' + comments[time][i] + '</td></tr>');
        }
    }
    let anchors = document.body.querySelectorAll('a');
    for (let i = 0; i < anchors.length; i++) {
        anchors[i].onclick = () => {
            openAnchor(anchors[i]);
        };
    }
    $('#status').text("コメント");
}

chrome.runtime.getBackgroundPage(function(backgroundPage) {
    $('#status').text("読み込み中");
    var videoId = backgroundPage.getVideoId();
    var comments = backgroundPage.getComment();
    chrome.tabs.getSelected(tab=>{
        var youtubeUrl = tab.url;
        var params = youtubeUrl.split('&');
        var stateUrl = params[0];
        params = params[0].split('watch?v=');
        if (typeof params[1] === "undefined") {
            $('#status').text("特定の動画視聴ページで試してください．");
        }
        else if (videoId != params[1]) {
            videoId = params[1];
            var json_asocc = {'video_id' : videoId};
            var json_text = JSON.stringify(json_asocc);
            $.post({
                url:  "https://youtube-comment-emotions-api.herokuapp.com/youtube_time_comment",
                data: json_text,
                contentType: 'application/json',
            }).done(function(data, textStatus, jqXHR){
                displayComments(data, stateUrl);
                backgroundPage.setVideoId(videoId);
                backgroundPage.setComment(data)

            }).fail(function(jqXHR, textStatus, errorThrown){
                $('#status').text(stateUrl + " " + videoId + "結果を取得できませんでした。ステータス：" + jqXHR.status);
            });
        }
        else {
            displayComments(comments, stateUrl);
        }
    });
});
