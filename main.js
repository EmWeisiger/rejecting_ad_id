window.addEventListener('load', function(evt) {
    document
        .getElementById('get_ad_info')
        .addEventListener('submit', rejectAd);
});

function rejectAd(event) {
    event.preventDefault();
    var advertiser_id = document.getElementById('advertiser_id').value;
    var ad_id         = document.getElementById('ad_id').value;
    var ad_id_hash    = md5(ad_id);
    var reason        = document.getElementById('reason').value;
    var comments      = document.getElementById('comments').value;

    var query = "https://ENTER WEBSITE HERE/api/Advertiser/SecondaryAd/view.json?parameters=%7B%22criteria%22%3A%7B%22ad_id_hash%22%3A%22" + ad_id_hash + "%22%2C%22advertiser_id%22%3A%22" + advertiser_id + "%22%7D%7D";

    $.get(
        query
        )
        .done(function(data, textStatus, jqXHR) {
            console.log("successfully fetched ad data for ad_id " + ad_id);
            var adInfo = data.data;

            adInfo.SecondaryAd.status = "rejected";
            adInfo.SecondaryAd.status_reason = reason;
            adInfo.SecondaryAd.status_comments = comments;

            console.log(adInfo);

            $.ajax(
                {
                    url: "https://ENTER WEBSITE HERE/api/Advertiser/SecondaryAd/update.json",
                    type: "POST",
                    data: adInfo,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    dataType: 'json'
                }
            )
                .done(function(data, textStatus, jqXHR) {
                    console.log("successfully updated ad data to rejected for ad_id " + ad_id);
                    console.log(data);
                    $('#result').text(
                        ad_id + " rejected."
                    );
                })
                .fail(function(jqXHR, statusText, errorThrown) {
                    console.log("error updating ad data: " + statusText);
                    console.log(errorThrown);
                    $('#result').text(
                        ad_id + " failed to be rejected."
                    );
                });

        })
        .fail(function(jqXHR, statusText, errorThrown) {
            console.log("error retreiving ad data: " + statusText);
            console.log(errorThrown);
            $('#result').text(ad_id + " failed to fetch ad data.");
        });
}
