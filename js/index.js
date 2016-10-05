$(document).ready(function () {
    $('#details').hide();
    $('#alert_year').hide();
    $.ajax({
        url:   'https://data.nasa.gov/resource/y77d-th95.json?$limit=50000',
        type:  'get',
        dataType: 'json',
        success:  function (response) {
            showData(response);
            $('#loading').hide();
            $('#details').fadeIn('slow');
        }
    });
});

$('#btn_year').click(function () {
    var year = $('#text_year').val();
    var query = 'https://data.nasa.gov/resource/y77d-th95.json';
    var show = true;

    if (year > 0) {
        query = query + '?year=' + year + '-01-01T00:00:00.000';
    } else if (year == '') {
        query = query + '?$limit=50000';
    } else {
        $('#alert_year').show();
        show = false;
    }

    if (show) {
        $('#table_div').hide();
        $('#loading').show();
        $('#alert_year').hide();
        $.ajax({
            url: query,
            type: 'get',
            dataType : 'json',
            success:  function (response) {
                // Se destruye la tabla anterior para construir una nueva
                $('#meteorites').dataTable().fnDestroy();
                showData(response);
                $('#loading').hide();
                $('#table_div').fadeIn('slow');
            }
        });
    }
});

function showData(response) {
    $('#meteorites').DataTable({
        bFilter: false,
        data: response,
        columns: [
            { data: 'name',
                'defaultContent': '' },
            { data: 'nametype',
                'defaultContent': '' },
            { data: 'recclass',
                'defaultContent': '' },
            { data: 'mass',
                'defaultContent': '',
                'render': function (data) {
                    if (data != undefined)
                        return Number(data).toFixed(2) + ' g';
                }
            },
            { data: 'fall',
                'defaultContent': '' },
            { data: 'year',
                'defaultContent': '',
                'render': function (data) {
                    if (data != undefined)
                        return data.substring(0, 4);
                }
            },
            { data: null,
                'defaultContent': '',
                'render' : function (data, type, full) {
                    if (full['reclat'] != undefined && full['reclong'] != undefined && full['reclat'] != 0 && full['reclong'] != 0) {
                        var reclat = full['reclat'];
                        var reclong = full['reclong'];
                        return '<a target="_blank" href="http://maps.google.com/?q=' + reclat + ',' + reclong + '">' + reclat + ', ' + reclong + '</a>';
                    }
                }
            }
        ]
    });
}