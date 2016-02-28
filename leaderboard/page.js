$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://fitfrog.azure-mobile.net/', 'ChoWidsZrtNyUKhAzxAOMpOMieKnoH63'),
        highScoreTable = client.getTable('highscore');

    // Read current data and rebuild UI.
    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
    function refreshTodoItems() {
        var query = highScoreTable.orderByDescending('points');

        query.read().then(function(todoItems) {
            var listItems = $.map(todoItems, function(item) {
                return $('<tr>')
                    .append($('<td>').text(item.user_name))
                    .append($('<td>').text(item.points));
            });

            $('#highscore-items').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('');
        }, handleError);
    }

    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    // On initial load, start by fetching the current data
    refreshTodoItems();
});