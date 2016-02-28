$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://fitfrog.azure-mobile.net/', 'ChoWidsZrtNyUKhAzxAOMpOMieKnoH63'),
        highScoreTable = client.getTable('highscore');

    // Read current data and rebuild UI.
    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
    function refreshTodoItems() {
        var query = highScoreTable;

        query.read().then(function(todoItems) {
            var listItems = $.map(todoItems, function(item) {
                return $('<tr>')
                    .append($('<td>').text(item.user_name))
                    .append($('<td>').text(item.points));
            });

            $('#highscore-items').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('<strong>' + todoItems.length + '</strong> item(s)');
        }, handleError);
    }

    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    function getTodoItemId(formElement) {
        return $(formElement).closest('li').attr('data-todoitem-id');
    }

    // Handle insert
    $('#add-item').submit(function(evt) {
        var namebox = $('#new-name'),
            scorebox = $('#new-score'),
            name = namebox.val(),
            score = scorebox.val();
        if (name !== '' && score) {
            highScoreTable.insert({ user_name: name, points: score}).then(refreshTodoItems, handleError);
        }
        //textbox.val('').focus();
        evt.preventDefault();
    });

    // Handle update
    $(document.body).on('change', '.item-text', function() {
        var newText = $(this).val();
        highScoreTable.update({ id: getTodoItemId(this), text: newText }).then(null, handleError);
    });

    $(document.body).on('change', '.item-complete', function() {
        var isComplete = $(this).prop('checked');
        highScoreTable.update({ id: getTodoItemId(this), complete: isComplete }).then(refreshTodoItems, handleError);
    });

    // Handle delete
    $(document.body).on('click', '.item-delete', function () {
        highScoreTable.del({ id: getTodoItemId(this) }).then(refreshTodoItems, handleError);
    });

    // On initial load, start by fetching the current data
    refreshTodoItems();
});