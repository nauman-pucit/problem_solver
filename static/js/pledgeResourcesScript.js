$(document).ready(function () {

    $('.heading_click').bind('click', function () {

        $('.add_forms').find(':input[type="text"]').addClass('form-control ')

    });


    $('#project_plus_minus').bind('click', function () {
        $(this).toggleClass('fa-minus-square');
    });

    $('#network_plus_minus').bind('click', function () {
        $(this).toggleClass('fa-minus-square');
    });

    $('#contact_plus_minus').bind('click', function () {
        $(this).toggleClass('fa-minus-square');
    });

    $('#save_and_add_project').bind('click', function () {
        var inputs = $(this).parent().parent().parent().parent().parent().find(':input[type="text"]');
        var project_name = $('#id_project_name').val();
        var project_description = $('#id_project_description').val();
        var area_of_work = $('#id_area_of_work').val();
        var country_or_region = $('#id_country_or_region').val();
        var formdata = {
                  project_name : project_name,
                  project_description : project_description,
                  area_of_work : area_of_work,
                  country_or_region : country_or_region,
                  project_save_add_more : true,
                  csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val()

        };
        if (project_name.trim() != "" && project_description.trim() != ""){
            $.ajax({
            url: '/social_network/pledge_resources/',
            data: formdata,
            type: "POST"
        }).done(function (data) {

                $('#id_project_name').val("");
                $('#id_project_description').val("");
                $('#id_area_of_work').val("");
                $('#id_country_or_region').val("");
                if (!$('#success_btn_project2').hasClass('hide')){
                    $('#success_btn_project2').addClass('hide');
                }
                if (!$('#success_btn_project').hasClass('show')){
                    $('#success_btn_project').toggleClass('show');
                }

            })
            .fail(function () {
                alert("error");
            })
        }




    });

    $('#save_and_add_network').bind('click', function () {
        var inputs = $(this).parent().parent().parent().parent().parent().find(':input[type="text"]');
        var network_name = $('#id_network_name').val();
        var network_description = $('#id_network_description').val();
        var formdata = {
                  network_name : network_name,
                  network_description : network_description,
                  network_save_add_more : true,
                  csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val()

        };
        if (network_name.trim() != "" && network_description.trim() != ""){
            $.ajax({
            url: '/social_network/pledge_resources/',
            data: formdata,
            type: "POST"
        }).done(function () {
                $('#id_network_name').val("");
                $('#id_network_description').val("");

                if (!$('#success_btn_network2').hasClass('hide')){
                    $('#success_btn_network2').addClass('hide');
                }
                if (!$('#success_btn_network').hasClass('show')){
                    $('#success_btn_network').toggleClass('show');
                }
                $('#field_of_work_model').modal('show');
            })
            .fail(function () {
                alert("error");
            })
        }


    });
    $('#save_and_add_contact').bind('click', function () {
        var inputs = $(this).parent().parent().parent().parent().parent().find(':input[type="text"]');
        var contact_name = $('#id_contact_name').val();
        var contact_description = $('#id_contact_description').val();
        var formdata = {
                  contact_name : contact_name,
                  contact_description : contact_description,
                  contact_save_add_more : true,
                  csrfmiddlewaretoken : $('input[name = csrfmiddlewaretoken]').val()

        };
        if (contact_name.trim() != "" && contact_description.trim() != ""){
            $.ajax({
            url: '/social_network/pledge_resources/',
            data: formdata,
            type: "POST"
        }).done(function () {
                $('#id_contact_name').val("");
                $('#id_contact_description').val("");
                if (!$('#success_btn_contact2').hasClass('hide')){
                    $('#success_btn_contact2').addClass('hide');
                }
                if (!$('#success_btn_contact').hasClass('show')){
                    $('#success_btn_contact').toggleClass('show');
                }
                $('#affiliation_model').modal('show');
            })
            .fail(function () {
                alert("error");
            })
        }

    });

});