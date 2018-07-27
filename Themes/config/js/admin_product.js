﻿$(document).ready(function () {

    $('.selectlang').unbind("click");
    $(".selectlang").click(function () {
        $('.actionbuttonwrapper').hide();
        $('.editlanguage').hide();
        $('.processing').show();
        $("#p1_nextlang").val($(this).attr("editlang"));
        if ($("#p1_razortemplate").val() == 'Admin_ProductDetail.cshtml') {
            //move data to update postback field
            $('#xmlupdatemodeldata').val($.fn.genxmlajaxitems('#productmodels', '.modelitem'));
            $('#xmlupdateoptiondata').val($.fn.genxmlajaxitems('#productoptions', '.optionitem'));
            $('#xmlupdateoptionvaluesdata').val($.fn.genxmlajaxitems('#productoptionvalues', '.optionvalueitem'));
            $('#xmlupdateproductimages').val($.fn.genxmlajaxitems('#productimages', '.imageitem'));
            $('#xmlupdateproductdocs').val($.fn.genxmlajaxitems('#productdocs', '.docitem'));
            nbxget('product_admin_save', '#productdatasection', '#actionreturn');
        } else {
            product_search();
        }
    });

    $(document).on("nbxgetcompleted", Admin_product_nbxgetCompleted); // assign a completed event for the ajax calls

    // start load all ajax data, continued by js in product.js file
    $('.processing').show();

    $('#p1_razortemplate').val('Admin_ProductList.cshtml');
    nbxget('product_admin_getlist', '#selectparams_Product_Admin', '#datadisplay');

    $('#product_admin_cmdSave').unbind("click");
    $('#product_admin_cmdSave').click(function () {
        $('.editlanguage').hide();
        $('.processing').show();
        //move data to update postback field
        $('#xmlupdateproductimages').val($.fn.genxmlajaxitems('#productimages', '.imageitem'));
        $('#xmlupdateproductdocs').val($.fn.genxmlajaxitems('#productdocs', '.docitem'));
        $('.taginputfield').attr('id', 'txttagwords');  // rename taglist back to correct id for save.
        // move index fields into hidden index fields for NBrightBuyIdx
        $('.indexfield').each(function (i, obj) {
            $(this).val($('#' + $(this).attr('indexname')).val());
        });

        nbxget('product_admin_savedata', '#productdatasection');
    });

    $('#product_admin_cmdSaveExit').unbind("click");
    $('#product_admin_cmdSaveExit').click(function () {

    });

    $('#product_admin_cmdSaveAs').unbind("click");
    $('#product_admin_cmdSaveAs').click(function () {

    });

    $('#product_admin_cmdReturn').unbind('click');
    $('#product_admin_cmdReturn').click(function () {
        $('#p1_selecteditemid').val(''); // clear sleecteditemid.        
        nbxget('product_admin_getlist', '#selectparams_Product_Admin', '#datadisplay');
    });

    $('#product_admin_cmdDelete').unbind('click');
    $('#product_admin_cmdDelete').click(function () {
        if (confirm($('#deletemsg').val())) {
            nbxget('product_admin_delete', '#datadisplay');
        }
    });

    $('#product_admin_cmdAddNew').unbind('click');
    $('#product_admin_cmdAddNew').click(function () {
        $('.processing').show();
        $('#p1_selecteditemid').val('');
        $('#p1_razortemplate').val('Admin_ProductDetail.cshtml');
        nbxget('product_admin_addnew', '#selectparams_Product_Admin', '#datadisplay');
    });


});


function Admin_product_nbxgetCompleted(e) {

    if (e.cmd == 'product_admin_addnew') {
        $('#p1_selecteditemid').val($('#p1_itemid').val()); // move the itemid into the selecteditemid, so page knows what itemid is being edited
        nbxget('product_admin_savedata', '#productdatasection');
    }

    if (e.cmd == 'product_admin_delete' || e.cmd == 'product_admin_moveproductadmin') {
        $('#p1_selecteditemid').val('');
        $('.actionbuttonwrapper').show();
        $('.editlanguage').show();
        product_admin_search();
    }

    if (e.cmd == 'product_admin_savedata') {
        $('.processing').show();
        nbxget('product_admin_getdetail', '#selectparams_Product_Admin', '#datadisplay');// relist after save
    }

    if (e.cmd == 'product_admin_selectlang') {
        $('#p1_editlang').val($('#p1_nextlang').val()); // alter lang after, so we get correct data record
        nbxget('product_admin_getdata', '#selectparams_Product_Admin', '#datadisplay'); // do ajax call to get edit form
    }


    if (e.cmd == 'product_admin_getlist') {

        $('.processing').hide();

        $('#product_admin_cmdSearch').unbind("click");
        $('#product_admin_cmdSearch').click(function () {
            product_admin_search();
        });

        $('#product_admin_cmdReset').unbind("click");
        $('#product_admin_cmdReset').click(function () {
            $('.processing').show();
            $('#p1_pagenumber').val('1');
            $('#p1_searchtext').val('');
            $('#p1_searchcategory').val('');
            $('#p1_searchproperty').val('');
            $('#p1_searchhidden').val('');
            $('#p1_searchvisible').val('');
            $('#p1_searchenabled').val('');
            $('#p1_searchdisabled').val('');
            $('#p1_selecteditemid').val('');
            nbxget('product_admin_getlist', '#selectparams_Product_Admin', '#datadisplay');
        });

        $('.product_admin_cmdDelete').unbind("click");
        $('.product_admin_cmdDelete').click(function () {
            if (confirm($('#confirmdeletemsg').text())) {
                $('.actionbuttonwrapper').hide();
                $('.editlanguage').hide();
                $('.processing').show();
                $('#p1_selecteditemid').val($(this).attr('itemid'));
                nbxget('product_admin_delete', '#selectparams_Product_Admin');
            }
        });

        $('.cmdPg').unbind("click");
        $('.cmdPg').click(function () {
            $('.processing').show();
            $('#p1_pagenumber').val($(this).attr('pagenumber'));
            product_admin_search();
        });

        // Move products
        $(".selectmove").hide();
        $(".selectcancel").hide();
        $(".selectrecord").hide();
        $(".savebutton").hide();

        var catlistcount = 0;
        if ($('#p1_searchcategory').val() != '') {
            catlistcount = ($('#p1_searchcategory').val().split(',').length - 1)
        }
        if ($('#p1_searchproperty').val() != '') {
            catlistcount = catlistcount + ($('#p1_searchproperty').val().split(',').length - 1)
        }
        if (catlistcount == 1) {
            if ($('#p1_moveproductid').val() != '') {
                $('.selectmove').show();
            }
            else {
                $('.selectrecord').show();
            }
        }
        else {
            $('.selectrecord').hide();
        }

        $('.selectrecord').unbind("click");
        $(".selectrecord").click(function () {
            $(".selectrecord").hide();
            $(".selectmove").show();
            $(".selectmove[itemid='" + $(this).attr("itemid") + "']").hide();
            $(".selectcancel[itemid='" + $(this).attr("itemid") + "']").show();
            $("#p1_moveproductid").val($(this).attr("itemid"));

            var selectid = $(this).attr("itemid");
            $(".selectmove").each(function (index) {
                if ($(this).attr("parentlist").indexOf(selectid + ";") > -1) $(this).hide();
            });

            $('.searchcategorydiv').hide();
            $('.searchpropertydiv').hide();

        });

        $('.selectcancel').unbind("click");
        $(".selectcancel").click(function () {
            $(".selectmove").hide();
            $(".selectcancel").hide();
            $(".selectrecord").show();
            $('.searchcategorydiv').show();
            $('.searchpropertydiv').show();
            $('#p1_moveproductid').val('');
        });

        $('.selectmove').unbind("click");
        $(".selectmove").click(function () {
            $(".selectmove").hide();
            $(".selectcancel").hide();
            $(".selectrecord").show();
            $("#p1_movetoproductid").val($(this).attr("itemid"));
            $('.searchcategorydiv').show();
            $('.searchpropertydiv').show();

            var propertylist = $(".searchpropertydiv").dropdownCheckbox("checked");
            var selectproperty = '';
            jQuery.each(propertylist, function (index, item) {
                $('#p1_searchproperty').val(item.id + ',');
            });

            var catlist = $(".searchcategorydiv").dropdownCheckbox("checked");
            var selectcatid = '';
            jQuery.each(catlist, function (index, item) {
                $('#p1_searchcategory').val(item.id + ',');
            });

            nbxget('product_admin_moveproductadmin', '#selectparams_Product_Admin');
        });

        $('#datadisplay').children().find('.sortelementUp').click(function () { moveUp($(this).parent()); });
        $('#datadisplay').children().find('.sortelementDown').click(function () { moveDown($(this).parent()); });


        $('.updateboolean').unbind("click");
        $('.updateboolean').click(function () {
            $('.processing').show();
            $('#p1_selecteditemid').val($(this).attr('itemid'));
            $('#p1_xpath').val($(this).attr('xpath'));
            if ($(this).hasClass("fa-check-circle")) {
                $(this).addClass('fa-circle').removeClass('fa-check-circle');
            } else {
                $(this).addClass('fa-check-circle').removeClass('fa-circle');
            }
            nbxget('product_admin_updateboolean', '#selectparams_Product_Admin');
        });



    }

    if (e.cmd == 'product_admin_getdetail') {

        $('.processing').hide();
        setupbackoffice();
        $("#accordion").accordion("option", "active", parseInt($('#p1_accordianactive').val()));

        $('input[datatype=date]').datepicker();

        $('#lang_txttagwords').tagsInput({
            'autocomplete_url': '/DesktopModules/NBright/NBrightBuy/XmlConnector.ashx?cmd=product_admin_autocomplete' + "&language=" + $('#editlanguage').val(),
            'height': '100px',
            'width': '100%',
            'interactive': true,
            'defaultText': '...',
            'onAddTag': onAddTag,
            'onRemoveTag': onRemoveTag,
            'removeWithBackspace': false,
            'minChars': 0,
            'maxChars': 100, // if not provided there is no limit
            'placeholderColor': '#cccccc'
        });

        initDocFileUpload();
        initImgFileUpload();
        initImgDisplay();
        initDocDisplay();
        initCategoryDisplay();
        initPropertyDisplay();
        initRelatedDisplay();
        initClientDisplay();


    }

    if (e.cmd == 'product_admin_updateproductdocs') {
        initDocDisplay();
    }

    if (e.cmd == 'product_admin_updateproductimages') {
        initImgDisplay();
    }

    if (e.cmd == 'product_admin_populatecategorylist' || e.cmd == 'product_admin_addproperty' || e.cmd == 'product_admin_removeproperty') {
        initPropertyDisplay();
    }
    if (e.cmd == 'product_admin_addproductcategory' || e.cmd == 'product_admin_removeproductcategory' || e.cmd == 'product_admin_setdefaultcategory') {
        initCategoryDisplay();
    }
    if (e.cmd == 'product_admin_removerelated') {
        initRelatedDisplay();
    }
    if (e.cmd == 'product_admin_removeproductclient') {
        initRelatedDisplay();
    }


    // ---------------------------------------------------------------------------
    // check if we are displaying a list or the detail and do processing.
    // ---------------------------------------------------------------------------

    if (($('#p1_selecteditemid').val() != '') || (e.cmd == 'product_admin_addnew')) {

        if (e.cmd == 'product_admin_getproductselectlist'
            || e.cmd == 'product_admin_addrelatedproduct'
            || e.cmd == 'product_admin_addproductclient'
            || e.cmd == 'product_admin_getclientselectlist') {
            product_admin_NoButtons();
        }
        else {
            product_admin_DetailButtons();
        }

        $('.processing').hide();

    } else {
        //PROCESS LIST
        product_admin_ListButtons();
        $('.product_admin_cmdEdit').unbind('click');
        $('.product_admin_cmdEdit').click(function () {
            $('.processing').show();
            $('#p1_selecteditemid').val($(this).attr("itemid")); // assign the sleected itemid, so the server knows what item is being edited
            nbxget('product_admin_getdetail', '#selectparams_Product_Admin', '#datadisplay'); // do ajax call to get edit form
        });
        $('.processing').hide();
    }


}



    // function to do actions after an ajax call has been made.
    function XXAdmin_product_nbxgetCompleted(e) {

        $('.actionbuttonwrapper').show();
        $('.editlanguage').show();

        setupbackoffice(); // run JS to deal with standard BO functions like accordian.


        //NBS - Tooltips
        $('[data-toggle="tooltip"]').tooltip({
            animation: 'true',
            placement: 'auto top',
            viewport: { selector: '#content', padding: 0 },
            delay: { show: 100, hide: 200 }
        });

        $('#product_admin_cmdAddNew').unbind("click");
        $('#product_admin_cmdAddNew').click(function () {
            $('.processing').show();
            $('#p1_razortemplate').val('Admin_ProductDetail.cshtml');
            nbxget('product_adminaddnew', '#productadminsearch', '#datadisplay');
        });

        if (e.cmd == 'product_selectchangedisable' || e.cmd == 'product_selectchangehidden') {
            $('.processing').hide();
        };

        if (e.cmd == 'product_admin_getlist') {

            $('.processing').hide();

            $("#product_admin_cmdSaveExit").hide();
            $("#product_admin_cmdSave").hide();
            $("#product_admin_cmdSaveAs").hide();
            $("#product_admin_cmdDelete").hide();
            $("#product_admin_cmdReturn").hide();
            $("#product_admin_cmdAddNew").show();

            // Move products
            $(".selectmove").hide();
            $(".selectcancel").hide();
            $(".selectrecord").hide();
            $(".savebutton").hide();

            var catlistcount = 0;
            if ($('#p1_searchcategory').val() != '') {
                catlistcount = ($('#p1_searchcategory').val().split(',').length - 1)
            }
            if ($('#p1_searchproperty').val() != '') {
                catlistcount = catlistcount + ($('#p1_searchproperty').val().split(',').length - 1)
            }
            if (catlistcount == 1) {
                if ($('#p1_moveproductid').val() != '') {
                    $('.selectmove').show();
                }
                else {
                    $('.selectrecord').show();
                }
            }
            else {
                $('.selectrecord').hide();
            }

            $('.selectrecord').unbind("click");
            $(".selectrecord").click(function() {
                $(".selectrecord").hide();
                $(".selectmove").show();
                $(".selectmove[itemid='" + $(this).attr("itemid") + "']").hide();
                $(".selectcancel[itemid='" + $(this).attr("itemid") + "']").show();
                $("#p1_moveproductid").val($(this).attr("itemid"));

                var selectid = $(this).attr("itemid");
                $(".selectmove").each(function(index) {
                    if ($(this).attr("parentlist").indexOf(selectid + ";") > -1) $(this).hide();
                });

                $('.searchcategorydiv').hide();
                $('.searchpropertydiv').hide();

            });

            $('.selectcancel').unbind("click");
            $(".selectcancel").click(function() {
                $(".selectmove").hide();
                $(".selectcancel").hide();
                $(".selectrecord").show();
                $('.searchcategorydiv').show();
                $('.searchpropertydiv').show();
                $('#p1_moveproductid').val('');
            });

            $('.selectmove').unbind("click");
            $(".selectmove").click(function() {
                $(".selectmove").hide();
                $(".selectcancel").hide();
                $(".selectrecord").show();
                $("#p1_movetoproductid").val($(this).attr("itemid"));
                $('.searchcategorydiv').show();
                $('.searchpropertydiv').show();

                var propertylist = $(".searchpropertydiv").dropdownCheckbox("checked");
                var selectproperty = '';
                jQuery.each(propertylist, function (index, item) {
                    $('#p1_searchproperty').val(item.id + ',');
                });

                var catlist = $(".searchcategorydiv").dropdownCheckbox("checked");
                var selectcatid = '';
                jQuery.each(catlist, function (index, item) {
                    $('#p1_searchcategory').val(item.id + ',');
                });

                nbxget('product_moveproductadmin', '#productadminsearch');
            });


            // editbutton created by list, so needs to be assigned on each render of list.
            $('.product_admin_cmdEdit').unbind("click");
            $('.product_admin_cmdEdit').click(function() {
                $('.processing').show();
                $('#p1_razortemplate').val('Admin_ProductDetail.cshtml');
                $('#p1_selecteditemid').val($(this).attr('itemid'));
                nbxget('product_admin_getdetail', '#productadminsearch', '#datadisplay');
            });


            $('.selectchangedisable').unbind("click");
            $('.selectchangedisable').click(function () {
                $('.processing').show();
                $('#p1_selecteditemid').val($(this).attr('itemid'));
                if ($(this).hasClass("fa-check-circle")) {
                    $(this).addClass('fa-circle').removeClass('fa-check-circle');
                } else {
                    $(this).addClass('fa-check-circle').removeClass('fa-circle');
                }
                nbxget('product_selectchangedisable', '#productadminsearch');
            });

            $('.selectchangehidden').unbind("click");
            $('.selectchangehidden').click(function () {
                $('.processing').show();
                $('#p1_selecteditemid').val($(this).attr('itemid'));
                if ($(this).hasClass("fa-check-circle")) {
                    $(this).addClass('fa-circle').removeClass('fa-check-circle');
                } else {
                    $(this).addClass('fa-check-circle').removeClass('fa-circle');
                }
                nbxget('product_selectchangehidden', '#productadminsearch');
            });


            $('.cmdPg').unbind("click");
            $('.cmdPg').click(function() {
                $('.processing').show();
                $('#p1_pagenumber').val($(this).attr('pagenumber'));
                nbxget('product_admin_getlist', '#productadminsearch', '#datadisplay');
            });

            $('#product_admin_cmdSearch').unbind("click");
            $('#product_admin_cmdSearch').click(function () {
                product_search();
            });

            $('#product_admin_cmdReset').unbind("click");
            $('#product_admin_cmdReset').click(function() {
                $('.processing').show();
                $('#p1_pagenumber').val('1');
                $('#p1_searchtext').val('');
                $('#p1_searchcategory').val('');
                $('#p1_searchproperty').val('');
                $('#p1_searchhidden').val('');
                $('#p1_searchvisible').val('');
                $('#p1_searchenabled').val('');
                $('#p1_searchdisabled').val('');
                $('#p1_selecteditemid').val('');

                nbxget('product_admin_getlist', '#productadminsearch', '#datadisplay');
            });

            $('.product_admin_cmdDelete').unbind("click");
            $('.product_admin_cmdDelete').click(function () {
                if (confirm($('#confirmdeletemsg').text())) {
                    $('.actionbuttonwrapper').hide();
                    $('.editlanguage').hide();
                    $('.processing').show();
                    $('#p1_selecteditemid').val($(this).attr('itemid'));
                    nbxget('product_admin_delete', '#productadminsearch', '#actionreturn');
                }
            });

        }

        if (e.cmd == 'product_admin_delete') {
            $('#p1_razortemplate').val('Admin_ProductList.cshtml');
            $('#p1_selecteditemid').val('');
            nbxget('product_admin_getlist', '#productadminsearch', '#datadisplay');
        }

        if (e.cmd == 'product_admin_save') {
            $("#p1_editlang").val($("#p1_nextlang").val());
            nbxget('product_admin_getdetail', '#productadminsearch', '#datadisplay');
        };

        if (e.cmd == 'product_admin_saveexit' || e.cmd == 'product_admin_saveas') {
            $("#p1_editlang").val($("#p1_nextlang").val());
            $('#p1_razortemplate').val('Admin_ProductList.cshtml');
            $('#p1_selecteditemid').val('');
            nbxget('product_admin_getlist', '#productadminsearch', '#datadisplay');
        };

        if (e.cmd == 'product_moveproductadmin') {
            $('#p1_moveproductid').val('');
            $('#p1_movetoproductid').val('');
            nbxget('product_admin_getlist', '#productadminsearch', '#datadisplay');
        };
        
        if (e.cmd == 'product_getproductselectlist') {
            $('.processing').hide();
        };

        if (e.cmd == 'product_admin_getdetail'
            || e.cmd == 'product_addproductmodels'
            || e.cmd == 'product_addproductoptions'
            || e.cmd == 'product_addproductoptionvalues'
            || e.cmd == 'product_updateproductdocs'
            || e.cmd == 'product_addproductcategory'
            || e.cmd == 'product_setdefaultcategory'
            || e.cmd == 'product_removeproductcategory'
            || e.cmd == 'product_populatecategorylist'
            || e.cmd == 'product_removeproperty'
            || e.cmd == 'product_addproperty'
            || e.cmd == 'product_addrelated'
            || e.cmd == 'product_removerelated'
            || e.cmd == 'product_adminaddnew'
            || e.cmd == 'product_updateproductimages') {

            // Copy the productid into the selecteditemid (for Add New Product)
            $('#p1_selecteditemid').val($('#itemid').val());

            $('.actionbuttonwrapper').show();

            $('.processing').hide();
           
            $("#product_admin_cmdSaveExit").show();
            $("#product_admin_cmdSave").show();
            $("#product_admin_cmdSaveAs").show();
            $("#product_admin_cmdDelete").show();
            $("#product_admin_cmdReturn").show();
            $("#product_admin_cmdAddNew").hide();

            $('#datadisplay').children().find('.sortelementUp').click(function () { moveUp($(this).parent()); });
            $('#datadisplay').children().find('.sortelementDown').click(function () { moveDown($(this).parent()); });


            // ---------------------------------------------------------------------------
            // FILE UPLOAD
            // ---------------------------------------------------------------------------
            var filecount = 0;
            var filesdone = 0;
            $(function () {
                'use strict';
                var url = '/DesktopModules/NBright/NBrightBuy/XmlConnector.ashx?cmd=fileupload';
                $('#fileupload').unbind('fileupload');
                $('#fileupload').fileupload({
                    url: url,
                    maxFileSize: 5000000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    dataType: 'json'
                }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled')
                    .bind('fileuploadprogressall', function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css('width', progress + '%');
                    })
                    .bind('fileuploadadd', function (e, data) {
                        $.each(data.files, function (index, file) {
                            $('input[id*="imguploadlist"]').val($('input[id*="imguploadlist"]').val() + file.name + ',');
                            filesdone = filesdone + 1;
                        });
                    })
                    .bind('fileuploadchange', function (e, data) {
                        filecount = data.files.length;
                        $('.processing').show();
                    })
                    .bind('fileuploaddrop', function (e, data) {
                        filecount = data.files.length;
                        $('.processing').show();
                    })
                    .bind('fileuploadstop', function (e) {
                        if (filesdone == filecount) {
                            $('#p1_razortemplate').val('Admin_ProductImages.cshtml');
                            nbxget('product_updateproductimages', '#productadminsearch', '#productimages'); // load images
                            filesdone = 0;
                            $('input[id*="imguploadlist"]').val('');
                            $('.processing').hide();
                            $('#progress .progress-bar').css('width', '0');
                        }
                    });
            });
            var filecount2 = 0;
            var filesdone2 = 0;
            $(function () {
                'use strict';
                var url = '/DesktopModules/NBright/NBrightBuy/XmlConnector.ashx?cmd=fileupload';
                $('#cmdSaveDoc').unbind();
                $('#cmdSaveDoc').fileupload({
                    url: url,
                    maxFileSize: 5000000,
                    acceptFileTypes: /(\.|\/)(png)$/i,
                    dataType: 'json'
                }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled')
                    .bind('fileuploadprogressall', function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css('width', progress + '%');
                    })
                    .bind('fileuploadadd', function (e, data) {
                        $.each(data.files, function (index, file) {
                            $('input[id*="docuploadlist"]').val($('input[id*="docuploadlist"]').val() + file.name + ',');
                            filesdone2 = filesdone2 + 1;
                        });
                    })
                    .bind('fileuploadchange', function (e, data) {
                        filecount2 = data.files.length;
                        $('.processing').show();
                    })
                    .bind('fileuploaddrop', function (e, data) {
                        filecount2 = data.files.length;
                        $('.processing').show();
                    })
                    .bind('fileuploadstop', function (e) {
                        if (filesdone2 == filecount2) {
                            $('#p1_razortemplate').val('Admin_ProductDocs.cshtml');
                            nbxget('product_updateproductdocs', '#productadminsearch', '#productdocs'); // load images
                            filesdone2 = 0;
                            $('input[id*="docuploadlist"]').val('');
                            $('.processing').hide();
                            $('#progress .progress-bar').css('width', '0');
                        }
                    });
            });


            // ---------------------------------------------------------------------------
            // ACTION BUTTONS
            // ---------------------------------------------------------------------------
            $('#product_admin_cmdReturn').unbind("click");
            $('#product_admin_cmdReturn').click(function () {
                $('#p1_selecteditemid').val('');
                $('#p1_razortemplate').val('Admin_ProductList.cshtml');
                nbxget('product_admin_getlist', '#productadminsearch', '#datadisplay');
            });
            
            $('#product_admin_cmdSave').unbind("click");
            $('#product_admin_cmdSave').click(function () {
                $('.actionbuttonwrapper').hide();
                $('.editlanguage').hide();
                $('.processing').show();
                //move data to update postback field
                $('#xmlupdatemodeldata').val($.fn.genxmlajaxitems('#productmodels', '.modelitem'));
                $('#xmlupdateoptiondata').val($.fn.genxmlajaxitems('#productoptions', '.optionitem'));
                $('#xmlupdateoptionvaluesdata').val($.fn.genxmlajaxitems('#productoptionvalues', '.optionvalueitem'));
                $('#xmlupdateproductimages').val($.fn.genxmlajaxitems('#productimages', '.imageitem'));
                $('#xmlupdateproductdocs').val($.fn.genxmlajaxitems('#productdocs', '.docitem'));
                $('#p1_razortemplate').val('Admin_ProductDetail.cshtml');
                nbxget('product_admin_save', '#productdatasection');
            });

            $('#product_admin_cmdSaveExit').unbind("click");
            $('#product_admin_cmdSaveExit').click(function () {
                $('.actionbuttonwrapper').hide();
                $('.editlanguage').hide();
                $('.processing').show();
                //move data to update postback field
                $('#xmlupdatemodeldata').val($.fn.genxmlajaxitems('#productmodels', '.modelitem'));
                $('#xmlupdateoptiondata').val($.fn.genxmlajaxitems('#productoptions', '.optionitem'));
                $('#xmlupdateoptionvaluesdata').val($.fn.genxmlajaxitems('#productoptionvalues', '.optionvalueitem'));
                $('#xmlupdateproductimages').val($.fn.genxmlajaxitems('#productimages', '.imageitem'));
                $('#xmlupdateproductdocs').val($.fn.genxmlajaxitems('#productdocs', '.docitem'));
                nbxget('product_admin_saveexit', '#productdatasection');
            });

            $('#product_admin_cmdSaveAs').unbind("click");
            $('#product_admin_cmdSaveAs').click(function () {
                $('.actionbuttonwrapper').hide();
                $('.editlanguage').hide();
                $('.processing').show();
                //move data to update postback field
                $('#xmlupdatemodeldata').val($.fn.genxmlajaxitems('#productmodels', '.modelitem'));
                $('#xmlupdateoptiondata').val($.fn.genxmlajaxitems('#productoptions', '.optionitem'));
                $('#xmlupdateoptionvaluesdata').val($.fn.genxmlajaxitems('#productoptionvalues', '.optionvalueitem'));
                $('#xmlupdateproductimages').val($.fn.genxmlajaxitems('#productimages', '.imageitem'));
                $('#xmlupdateproductdocs').val($.fn.genxmlajaxitems('#productdocs', '.docitem'));
                nbxget('product_admin_saveas', '#productdatasection', '#actionreturn');
            });


            $('#product_admin_cmdDelete').unbind("click");
            $('#product_admin_cmdDelete').click(function () {
                if (confirm($('#confirmdeletemsg').text())) {
                    $('.actionbuttonwrapper').hide();
                    $('.editlanguage').hide();
                    $('.processing').show();
                    nbxget('product_admin_delete', '#productadminsearch', '#actionreturn');
                }
            });



            // ---------------------------------------------------------------------------
            // STOCK CONTROL
            // ---------------------------------------------------------------------------
            $('.chkstockon:not(:checked)').each(function (index) {
                $(this).parent().parent().next().hide();
            });

            $('.selectrecord').unbind("click");
            $('.chkstockon').click(function () {
                if ($(this).is(":checked")) {
                    $(this).parent().parent().next().show();
                } else {
                    $(this).parent().parent().next().hide();
                }
            });


            // ---------------------------------------------------------------------------
            // MODELS
            // ---------------------------------------------------------------------------
            $('.removemodel').unbind("click");
            $('.removemodel').click(function () { removeelement($(this).parent().parent().parent().parent()); });

            $('input[id*="availabledate"]').datepicker();

            //Add models
            $('#addmodels').unbind("click");
            $('#addmodels').click(function () {
                $('.processing').show();
                $('#addqty').val($('#txtaddmodelqty').val());
                $('#p1_razortemplate').val('Admin_ProductDetail.cshtml');
                nbxget('product_addproductmodels', '#productadminsearch', '#datadisplay'); // load models
            });

            $('#undomodel').unbind("click");
            $('#undomodel').click(function() {
                 undoremove('.modelitem', '#productmodels');
            });
            $('.chkdisabledealer:checked').each(function (index) {
                $(this).prev().attr("disabled", "disabled");;
                $(this).parent().next().find('.dealersale').attr("disabled", "disabled");
            });
            $('.chkdisabledealer').unbind("change");
            $('.chkdisabledealer').change(function () {
                if ($(this).is(":checked")) {
                    $(this).prev().attr("disabled", "disabled");
                    $(this).parent().next().find('.dealersale').attr("disabled", "disabled");
                    $(this).prev().val(0);
                    $(this).parent().next().find('.dealersale').val(0);
                } else {
                    $(this).prev().removeAttr("disabled");
                    $(this).parent().next().find('.dealersale').removeAttr("disabled");
                }
            });

            $('.chkdisablesale:checked').each(function (index) {
                $(this).prev().attr("disabled", "disabled");;
            });
            $('.chkdisablesale').unbind("change");
            $('.chkdisablesale').change(function () {
                if ($(this).is(":checked")) {
                    $(this).prev().attr("disabled", "disabled");;
                    $(this).prev().val(0);
                } else {
                    $(this).prev().removeAttr("disabled");
                }
            });

            // ---------------------------------------------------------------------------
            // OPTIONS
            // ---------------------------------------------------------------------------

            //Add options
            $('#addopt').unbind("click");
            $('#addopt').click(function () {
                $('.processing').show();
                $('#addqty').val($('#txtaddoptqty').val());
                $('#p1_razortemplate').val("Admin_ProductOptions.cshtml");                
                nbxget('product_addproductoptions', '#productadminsearch', '#productoptions');
            });

            $('#undooption').unbind("click");
            $('#undooption').click(function () {
                undoremove('.optionitem', '#productoptions');
            });

            $('.removeoption').unbind("click");
            $('.removeoption').click(function () {
                removeelement($(this).parent().parent().parent().parent());
                if ($(this).parent().parent().parent().parent().hasClass('selected')) {
                    $('#productoptionvalues').hide();
                    $(this).parent().parent().parent().parent().removeClass('selected');
                }
            });

            $('.selectoption').unbind("click");
            $('.selectoption').click(function () {
                $('#p1_selectedoptionid').val($(this).attr('itemid'));
                $(this).parent().parent().parent().parent().parent().children().removeClass('selected');
                $(this).parent().parent().parent().parent().addClass('selected');
                showoptionvalues();
            });

            //Add optionvalues
            $('#addoptvalues').unbind("click");
            $('#addoptvalues').click(function () {
                $('.processing').show();
                $('#addqty').val($('#txtaddoptvalueqty').val());   
                $('#p1_razortemplate').val("Admin_ProductOptionValues.cshtml");
                nbxget('product_addproductoptionvalues', '#productadminsearch', '#productoptionvalues');
            });

            $('.removeoptionvalue').unbind("click");
            $('.removeoptionvalue').click(function () {
                 removeelement($(this).parent().parent().parent().parent());
            });

            $('#undooptionvalue').unbind("click");
            $('#undooptionvalue').click(function () {
                 undoremove('.optionvalueitem', '#productoptionvalues');
            });

            //trigger select option, to display correct option values
            if ($('#p1_selectedoptionid').val() == '') {
                $('.selectoption').last().trigger('click');
            } else {
                var findstr = ".selectoption input[itemid='" + $('#p1_selectedoptionid').val() + "']";
                if ($('.selectoption').find(findstr).length > 0) {
                    $('.selectoption').find(findstr).trigger('click');
                } else {
                    $('.selectoption').last().trigger('click');
                }

            }


            // ---------------------------------------------------------------------------
            // IMAGES
            // ---------------------------------------------------------------------------

            $('.removeimage').unbind("click");
            $('.removeimage').click(function () {
                removeelement($(this).parent().parent().parent().parent());
            });

            $('#undoimage').unbind("click");
            $('#undoimage').click(function () {
                 undoremove('.imageitem', '#productimages');
            });

            // ---------------------------------------------------------------------------
            // DOCS
            // ---------------------------------------------------------------------------

            $('.removedoc').unbind();
            $('.removedoc').click(function() {
                 removeelement($(this).parent().parent().parent().parent());
            });

            $('#undodoc').unbind();
            $('#undodoc').click(function () {
                 undoremove('.docitem', '#productdocs');
            });

            // ---------------------------------------------------------------------------
            // CATEGORY
            // ---------------------------------------------------------------------------
            $('.selectcategory').unbind();
            $('.selectcategory').click(function () {
                $('.processing').show();
                $('#p1_selectedcatid').val($(this).val());
                $('#p1_razortemplate').val("Admin_ProductCategories.cshtml");
                if ($(this).val() != null) nbxget('product_addproductcategory', '#productadminsearch', '#productcategories'); // load 
            });
            $('.removecategory').unbind();
            $('.removecategory').click(function () {
                $('.processing').show();
                $('#p1_selecteditemid').val($(this).attr('itemid'));
                $('#p1_selectedcatid').val($(this).attr('categoryid'));
                $('#p1_razortemplate').val("Admin_ProductCategories.cshtml");
                nbxget('product_removeproductcategory', '#productadminsearch', '#productcategories'); // load             
            });
            // set default category
            $('.defaultcategory').unbind('click');
            $('.defaultcategory').click(function () {
                $('.processing').show();
                $('#p1_selecteditemid').val($(this).attr('itemid'));
                $('#p1_selectedcatid').val($(this).attr('categoryid'));
                $('#p1_razortemplate').val("Admin_ProductCategories.cshtml");
                nbxget('product_setdefaultcategory', '#productadminsearch', '#productcategories'); // load             
            });


            // ---------------------------------------------------------------------------
            // PROPERTIES
            // ---------------------------------------------------------------------------

            $('.selectgrouptype').unbind('click');
            $('.selectgrouptype').click(function () {
                $('.processing').show();
                $('#p1_selectedgroupref').val($(this).val());
                $('#p1_razortemplate').val("Admin_ProductPropertySelect.cshtml");
                if ($(this).val() != null) nbxget('product_populatecategorylist', '#productadminsearch', '#groupcategorylist'); // load 
            });

            $('.removegroupcategory').unbind('click');
            $('.removegroupcategory').click(function () {
                $('.processing').show();
                $('#p1_selectedcatid').val($(this).attr('categoryid'));
                $('#p1_razortemplate').val("Admin_ProductProperties.cshtml");
                nbxget('product_removeproperty', '#productadminsearch', '#productgroupcategories'); // load             
            });

            $('.selectproperty').unbind('click');
            $('.selectproperty').click(function () {
                $('#p1_selectedcatid').val($(this).val());
                $('.processing').show();
                $('#p1_razortemplate').val("Admin_ProductProperties.cshtml");
                nbxget('product_addproperty', '#productadminsearch', '#productgroupcategories'); // load 
            });

            $('.product_admin_cmdEdit').unbind("click");
            $('.product_admin_cmdEdit').click(function () {
                $('.processing').show();
                $('#p1_razortemplate').val('Admin_ProductDetail.cshtml');
                $('#p1_selecteditemid').val($(this).attr('itemid'));
                nbxget('product_admin_getdetail', '#productadminsearch', '#datadisplay');
            });


            // ---------------------------------------------------------------------------
            // RELATED
            // ---------------------------------------------------------------------------

            $('.removerelated').unbind('click');
            $('.removerelated').click(function () {
                $('#p1_selectedrelatedid').val($(this).attr('productid'));
                $('#p1_razortemplate').val('Admin_ProductRelated.cshtml');
                nbxget('product_removerelated', '#productadminsearch', '#productrelated'); // load releated
            });

            $('#productselect').click(function () {
                $('#p1_pagesize').val('60');
                $('#p1_razortemplate').val('Admin_ProductSelectList.cshtml');
                nbxget('product_getproductselectlist', '#productadminsearch', '#productselectlist');
                $('#productdatasection').hide();
                $('#productselectsection').show();
            });

            $('#returnfromselect').click(function () {
                $('#p1_pagesize').val('20');
                $('#productdatasection').show();
                $('#productselectsection').hide();
                $("#p1_searchtextrelated").val('');
                $('#p1_razortemplate').val('Admin_ProductDetail.cshtml');
                nbxget('product_admin_getdetail', '#productadminsearch', '#datadisplay');
                $('#datadisplay').show();
            });

            $('#productselectlist').change(function () {
                //Do paging
                $('.cmdPg').unbind();
                $('.cmdPg').click(function () {
                    $('input[id*="pagenumber"]').val($(this).attr("pagenumber"));
                    nbxget('product_getproductselectlist', '#productadminsearch', '#productselectlist');
                });
                // select product
                $('.selectproduct').unbind();
                $('.selectproduct').click(function() {
                    $('.selectproductid' + $(this).attr('itemid')).hide();
                    $('#p1_selectedrelatedid').val($(this).attr('itemid'));
                    nbxget('product_addrelatedproduct', '#productadminsearch', '#productrelated'); // load releated
                });

            });

            $('#txtproductselectsearch').val($('#p1_searchtextrelated').val());

            $('#selectsearch').unbind("click");
            $('#selectsearch').click(function () {
                $('.processing').show();
                $('#p1_pagenumber').val('1');
                $('#p1_searchtextrelated').val($('#txtproductselectsearch').val());
                nbxget('product_getproductselectlist', '#productadminsearch', '#productselectlist');
            });

            $('#selectreset').unbind("click");
            $('#selectreset').click(function () {
                $('.processing').show();
                $('#p1_pagenumber').val('1');
                $('#txtproductselectsearch').val('');
                $('#p1_searchtextrelated').val('');
                nbxget('product_getproductselectlist', '#productadminsearch', '#productselectlist');
            });

            // ---------------------------------------------------------------------------
            // CLIENTS
            // ---------------------------------------------------------------------------

            $('#clientselectlist').unbind("change");
            $('#clientselectlist').change(function () {
                // select product
                $('.selectclient').unbind();
                $('.selectclient').click(function () {
                    $('.selectuserid' + $(this).attr('itemid')).hide();
                    $('input[id*="selecteduserid"]').val($(this).attr('itemid'));
                    $('#p1_razortemplate').val('Admin_ProductClientSelect.cshtml');
                    nbxget('product_addproductclient', '#productadminsearch', '#productclients'); // load releated
                });
            });

            $('#clientlistsearch').unbind("click");
            $('#clientlistsearch').click(function () {
                $('#searchtext').val($('#txtclientsearch').val());
                $('#p1_razortemplate').val('Admin_ProductClientSelect.cshtml');
                nbxget('product_getclientselectlist', '#productadminsearch', '#clientselectlist');
            });

            $('#clientselect').unbind("click");
            $('#clientselect').click(function () {
                $(this).hide();
                $('#productdatasection').hide();
                $('#clientselectsection').show();
            });

            $('#returnfromclientselect').unbind("click");
            $('#returnfromclientselect').click(function () {
                $('#clientselect').show();
                $("input[id*='searchtext']").val('');
                $('#p1_razortemplate').val('Admin_ProductClients.cshtml');
                nbxget('product_productclients', '#productadminsearch', '#productclients');
                $('#clientselectsection').hide();
                $('#productdatasection').show();
            });

            $('#productclients').unbind("click");
            $('#productclients').change(function () {
                $('.removeclient').click(function () {
                    $('input[id*="selecteduserid"]').val($(this).attr('itemid'));
                    $('#p1_razortemplate').val('Admin_ProductClients.cshtml');
                    nbxget('product_removeproductclient', '#productadminsearch', '#productclients');
                });
            });



        }

    };

    // ---------------------------------------------------------------------------
    // FUNCTIONS
    // ---------------------------------------------------------------------------

function product_admin_DetailButtons() {
        $('.editlanguage').show();
        $('#cmdsave').show();
        $('#cmddelete').show();
        $('#cmdreturn').show();
        $('#addnew').hide();
        $('input[datatype="date"]').datepicker(); // assign datepicker to any ajax loaded fields
    }

function product_admin_ListButtons() {
        $('.editlanguage').show();
        $('#cmdsave').hide();
        $('#cmddelete').hide();
        $('#cmdreturn').hide();
        $('#addnew').show();
    }

function product_admin_NoButtons() {
        $('.editlanguage').hide();
        $('#cmdsave').hide();
        $('#cmddelete').hide();
        $('#cmdreturn').hide();
        $('#addnew').hide();
    }


    function moveUp(item) {
        var prev = item.prev();
        if (prev.length == 0)
            return;
        prev.css('z-index', 999).css('position', 'relative').animate({ top: item.height() }, 250);
        item.css('z-index', 1000).css('position', 'relative').animate({ top: '-' + prev.height() }, 300, function () {
            prev.css('z-index', '').css('top', '').css('position', '');
            item.css('z-index', '').css('top', '').css('position', '');
            item.insertBefore(prev);
        });
    }
    function moveDown(item) {
        var next = item.next();
        if (next.length == 0)
            return;
        next.css('z-index', 999).css('position', 'relative').animate({ top: '-' + item.height() }, 250);
        item.css('z-index', 1000).css('position', 'relative').animate({ top: next.height() }, 300, function () {
            next.css('z-index', '').css('top', '').css('position', '');
            item.css('z-index', '').css('top', '').css('position', '');
            item.insertAfter(next);
        });
    }

    function removeelement(elementtoberemoved) {
        if ($('#recyclebin').length > 0) {
            $('#recyclebin').append($(elementtoberemoved));
        } else { $(elementtoberemoved).remove(); }
        if ($(elementtoberemoved).hasClass('modelitem')) $('#undomodel').show();
        if ($(elementtoberemoved).hasClass('optionitem')) $('#undooption').show();
        if ($(elementtoberemoved).hasClass('optionvalueitem')) $('#undooptionvalue').show();
        if ($(elementtoberemoved).hasClass('imageitem')) $('#undoimage').show();
        if ($(elementtoberemoved).hasClass('docitem')) $('#undodoc').show();
        if ($(elementtoberemoved).hasClass('categoryitem')) $('#undocategory').show();
        if ($(elementtoberemoved).hasClass('relateditem')) $('#undorelated').show();
        if ($(elementtoberemoved).hasClass('clientitem')) $('#undoclient').show();
    }
    function undoremove(itemselector, destinationselector) {
        if ($('#recyclebin').length > 0) {
            $(destinationselector).append($('#recyclebin').find(itemselector).last());
        }
        if ($('#recyclebin').children(itemselector).length == 0) {
            if (itemselector == '.modelitem') $('#undomodel').hide();
            if (itemselector == '.optionitem') $('#undooption').hide();
            if (itemselector == '.optionvalueitem') $('#undooptionvalue').hide();
            if (itemselector == '.imageitem') $('#undoimage').hide();
            if (itemselector == '.docitem') $('#undodoc').hide();
            if (itemselector == '.categoryitem') $('#undocategory').hide();
            if (itemselector == '.relateditem') $('#undorelated').hide();
            if (itemselector == '.clientitem') $('#undoclient').hide();
        }
    }

    function showoptionvalues() {
        $('#productoptionvalues').children().hide();
        if ($('#productoptions').children('.selected').first().find('input[id*="optionid"]').length > 0) {
            $('#productoptionvalues').children('.' + $('#productoptions').children('.selected').first().find('input[id*="optionid"]').val()).show();
            $('#productoptionvalues').show();
        }
        $('#optionvaluecontrol').show();
    }

    function initImgFileUpload() {
        // ---------------------------------------------------------------------------
        // IMG FILE UPLOAD
        // ---------------------------------------------------------------------------
        var filecount = 0;
        var filesdone = 0;
        $(function () {
            'use strict';
            var url = '/DesktopModules/NBright/NBrightBuy/XmlConnector.ashx?cmd=fileupload';
            $('#fileupload').unbind('fileupload');
            $('#fileupload').fileupload({
                url: url,
                maxFileSize: 5000000,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                dataType: 'json'
            }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled')
                .bind('fileuploadprogressall', function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css('width', progress + '%');
                })
                .bind('fileuploadadd', function (e, data) {
                    $.each(data.files, function (index, file) {
                        $('input[id*="a1_imguploadlist"]').val($('input[id*="a1_imguploadlist"]').val() + file.name + ',');
                        filesdone = filesdone + 1;
                    });
                })
                .bind('fileuploadchange', function (e, data) {
                    filecount = data.files.length;
                    $('.processing').show();
                })
                .bind('fileuploaddrop', function (e, data) {
                    filecount = data.files.length;
                    $('.processing').show();
                })
                .bind('fileuploadstop', function (e) {
                    if (filesdone == filecount) {
                        nbxget('product_admin_updateproductimages', '#selectparams_Product_Admin', '#productimages'); // load images
                        filesdone = 0;
                        $('input[id*="a1_imguploadlist"]').val('');
                        $('.processing').hide();
                        $('#progress .progress-bar').css('width', '0');
                    }
                });
        });

    }

    function initDocFileUpload() {
        // ---------------------------------------------------------------------------
        // DOC FILE UPLOAD
        // ---------------------------------------------------------------------------
        var filecount2 = 0;
        var filesdone2 = 0;
        $(function () {
            'use strict';
            var url = '/DesktopModules/NBright/NBrightBuy/XmlConnector.ashx?cmd=fileupload';
            $('#cmdSaveDoc').unbind();
            $('#cmdSaveDoc').fileupload({
                url: url,
                maxFileSize: 5000000,
                acceptFileTypes: /(\.|\/)(pdf)$/i,
                dataType: 'json'
            }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled')
                .bind('fileuploadprogressall', function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css('width', progress + '%');
                })
                .bind('fileuploadadd', function (e, data) {
                    $.each(data.files, function (index, file) {
                        $('input[id*="a1_docuploadlist"]').val($('input[id*="a1_docuploadlist"]').val() + file.name + ',');
                        filesdone2 = filesdone2 + 1;
                    });
                })
                .bind('fileuploadchange', function (e, data) {
                    filecount2 = data.files.length;
                    $('.processing').show();
                })
                .bind('fileuploaddrop', function (e, data) {
                    filecount2 = data.files.length;
                    $('.processing').show();
                })
                .bind('fileuploadstop', function (e) {
                    if (filesdone2 == filecount2) {
                        nbxget('product_admin_updateproductdocs', '#selectparams_Product_Admin', '#productdocs'); // load images
                        filesdone2 = 0;
                        $('input[id*="a1_docuploadlist"]').val('');
                        $('.processing').hide();
                        $('#progress .progress-bar').css('width', '0');
                    }
                });
        });

    }

    function initImgDisplay() {
        $('.removeimage').unbind("click");
        $('.removeimage').click(function () {
            removeelement($(this).parent().parent().parent().parent());
        });

        $('#undoimage').unbind("click");
        $('#undoimage').click(function () {
            undoremove('.imageitem', '#productimages');
        });
    }

    function initDocDisplay() {
        $('.removedoc').unbind();
        $('.removedoc').click(function () {
            removeelement($(this).parent().parent().parent().parent());
        });

        $('#undodoc').unbind();
        $('#undodoc').click(function () {
            undoremove('.docitem', '#productdocs');
        });
    }

    function initPropertyDisplay() {

        $('.selectgrouptype').unbind('click');
        $('.selectgrouptype').click(function () {
            $('.processing').show();
            $('#p1_selectedgroupref').val($(this).val());
            if ($(this).val() != null) nbxget('product_admin_populatecategorylist', '#selectparams_Product_Admin', '#groupcategorylist'); // load 
        });

        $('.removegroupcategory').unbind('click');
        $('.removegroupcategory').click(function () {
            $('.processing').show();
            $('#p1_selectedcatid').val($(this).attr('categoryid'));
            nbxget('product_admin_removeproperty', '#selectparams_Product_Admin', '#productgroupcategories'); // load             
        });

        $('.selectproperty').unbind('click');
        $('.selectproperty').click(function () {
            $('#p1_selectedcatid').val($(this).val());
            $('.processing').show();
            nbxget('product_admin_addproperty', '#selectparams_Product_Admin', '#productgroupcategories'); // load 
        });
    }

    function initCategoryDisplay() {
        $('.selectcategory').unbind();
        $('.selectcategory').click(function () {
            $('.processing').show();
            $('#p1_selectedcatid').val($(this).val());
            $('#p1_razortemplate').val("AmylisCategories.cshtml");
            if ($(this).val() != null) nbxget('product_admin_addproductcategory', '#selectparams_Product_Admin', '#productcategories'); // load 
        });
        $('.removecategory').unbind();
        $('.removecategory').click(function () {
            $('.processing').show();
            $('#p1_selecteditemid').val($(this).attr('itemid'));
            $('#p1_selectedcatid').val($(this).attr('categoryid'));
            $('#p1_razortemplate').val("AmylisCategories.cshtml");
            nbxget('product_admin_removeproductcategory', '#selectparams_Product_Admin', '#productcategories'); // load             
        });
        // set default category
        $('.defaultcategory').unbind('click');
        $('.defaultcategory').click(function () {
            $('.processing').show();
            $('#p1_selecteditemid').val($(this).attr('itemid'));
            $('#p1_selectedcatid').val($(this).attr('categoryid'));
            $('#p1_razortemplate').val("AmylisCategories.cshtml");
            nbxget('product_admin_setdefaultcategory', '#selectparams_Product_Admin', '#productcategories'); // load             
        });
    }

    function initRelatedDisplay() {
        $('.removerelated').unbind('click');
        $('.removerelated').click(function () {
            $('#p1_selectedrelatedid').val($(this).attr('productid'));
            $("#p1_razortemplate").val('AmylisRelated.cshtml');
            nbxget('product_admin_removerelated', '#selectparams_Product_Admin', '#productrelated'); // load releated
        });

        $('#productselect').unbind('click');
        $('#productselect').click(function () {
            $('.processing').show();
            $('#p1_accordianactive').val($("#accordion").accordion("option", "active"));
            $('#p1_pagesize').val('60');
            $("#p1_razortemplate").val('AmylisSelectList.cshtml');
            nbxget('product_admin_getproductselectlist', '#selectparams_Product_Admin', '#productselectlist');
            $('#productdatasection').hide();
            $('#productselectsection').show();
        });

        $('#returnfromselect').unbind('click');
        $('#returnfromselect').click(function () {
            $('#p1_pagesize').val('20');
            $('#productdatasection').show();
            $('#productselectsection').hide();
            $("#p1_searchtext").val('');
            $("#p1_searchcategory").val('');
            nbxget('product_admin_getdetail', '#selectparams_Product_Admin', '#datadisplay');
            $('#datadisplay').show();
        });

        $("#productselectlist").unbind("change");
        $('#productselectlist').change(function () {
            //Do paging
            $('.cmdPg').unbind();
            $('.cmdPg').click(function () {
                $('input[id*="a1_pagenumber"]').val($(this).attr("pagenumber"));
                nbxget('product_admin_getproductselectlist', '#selectparams_Product_Admin', '#productselectlist');
            });
            // select product
            $('.selectproduct').unbind();
            $('.selectproduct').click(function () {
                $('.selectproductid' + $(this).attr('itemid')).hide();
                $('#p1_selectedrelatedid').val($(this).attr('itemid'));
                nbxget('product_admin_addrelatedproduct', '#selectparams_Product_Admin', '#productrelated'); // load releated
            });

        });

        $("#ddlsearchcategory").unbind("change");
        $("#ddlsearchcategory").change(function () {
            $('#p1_searchcategory').val($(this).val());
            $("#p1_razortemplate").val('AmylisSelectList.cshtml');
            nbxget('product_admin_getproductselectlist', '#selectparams_Product_Admin', '#productselectlist');
        });

        $('#txtproductselectsearch').val($('#searchtext').val());

        $('#selectsearch').unbind("click");
        $('#selectsearch').click(function () {
            $('.processing').show();
            $('#p1_pagenumber').val('1');
            $('#p1_searchtext').val($('#txtproductselectsearch').val());
            $("#p1_razortemplate").val('AmylisSelectList.cshtml');
            nbxget('product_admin_getproductselectlist', '#selectparams_Product_Admin', '#productselectlist');
        });

        $('#selectreset').unbind("click");
        $('#selectreset').click(function () {
            $('.processing').show();
            $('#p1_pagenumber').val('1');
            $('#p1_searchtext').val('');
            $("#p1_searchcategory").val('');
            $("#ddlsearchcategory").val('');
            $('#txtproductselectsearch').val('');
            $("#p1_razortemplate").val('AmylisSelectList.cshtml');
            nbxget('product_admin_getproductselectlist', '#selectparams_Product_Admin', '#productselectlist');
        });


    }

    function initClientDisplay() {

        $('#clientselectlist').unbind("change");
        $('#clientselectlist').change(function () {
            // select product
            $('.selectclient').unbind();
            $('.selectclient').click(function () {
                $('.selectuserid' + $(this).attr('itemid')).hide();
                $('input[id*="selecteduserid"]').val($(this).attr('itemid'));
                nbxget('product_admin_addproductclient', '#selectparams_Product_Admin', '#productclients'); // load releated
            });
        });

        $('#clientlistsearch').unbind("click");
        $('#clientlistsearch').click(function () {
            $('#p1_searchtext').val($('#txtclientsearch').val());
            nbxget('product_admin_getclientselectlist', '#selectparams_Product_Admin', '#clientselectlist');
        });

        $('#clientselect').unbind("click");
        $('#clientselect').click(function () {
            $('#p1_accordianactive').val($("#accordion").accordion("option", "active"));
            $(this).hide();
            $('#productdatasection').hide();
            $('#clientselectsection').show();
            product_admin_NoButtons();
        });

        $('#returnfromclientselect').unbind("click");
        $('#returnfromclientselect').click(function () {
            $('#clientselect').show();
            $("input[id*='searchtext']").val('');
            nbxget('product_admin_productclients', '#selectparams_Product_Admin', '#productclients');
            $('#clientselectsection').hide();
            $('#productdatasection').show();
        });

        $('#productclients').unbind("click");
        $('#productclients').change(function () {
            $('.removeclient').click(function () {
                $('input[id*="selecteduserid"]').val($(this).attr('itemid'));
                nbxget('product_admin_removeproductclient', '#selectparams_Product_Admin', '#productclients');
            });
        });


    }


function product_admin_search() {
        $('.processing').show();

        $('#p1_razortemplate').val('Admin_ProductList.cshtml');
        $('#p1_selecteditemid').val('');
        $('#p1_searchtext').val($('#searchtext').val());

        $('#p1_moveproductid').val('');
        $('#p1_movetoproductid').val('');

        if ($(".searchcategorydiv").length) {
            var catlist = $(".searchcategorydiv").dropdownCheckbox("checked");
            var selectcatid = '';
            jQuery.each(catlist, function (index, item) {
                selectcatid += item.id + ',';
            });
            $('#p1_searchcategory').val(selectcatid);
        }

        if ($(".searchpropertydiv").length) {
            var propertylist = $(".searchpropertydiv").dropdownCheckbox("checked");
            var selectproperty = '';
            jQuery.each(propertylist, function (index, item) {
                selectproperty += item.id + ',';
            });
            $('#p1_searchproperty').val(selectproperty);
        }
        $('#p1_cascade').val('False');
        if ($('#cascade').prop('checked')) {
            $('#p1_cascade').val('True');
        }
        $('#p1_searchhidden').val('False');
        if ($('#searchhidden').prop('checked')) {
            $('#p1_searchhidden').val('True');
        }
        $('#p1_searchvisible').val('False');
        if ($('#searchvisible').prop('checked')) {
            $('#p1_searchvisible').val('True');
        }
        $('#p1_searchenabled').val('False');
        if ($('#searchenabled').prop('checked')) {
            $('#p1_searchenabled').val('True');
        }
        $('#p1_searchdisabled').val('False');
        if ($('#searchdisabled').prop('checked')) {
            $('#p1_searchdisabled').val('True');
        }

    nbxget('product_admin_getlist', '#selectparams_Product_Admin', '#datadisplay');

    }
    // ---------------------------------------------------------------------------


