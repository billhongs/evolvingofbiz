/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


/* This file will be used for front store application*/
jQuery(document).ready(function() {
    jQuery.fn.label = function() {
        var parent_label = jQuery(this).closest('label'),
            for_label = jQuery("[for='" + jQuery(this).attr('id') + "']");
        if (parent_label.size() > 0) {
            return parent_label.first();
        } else {
            return for_label.first();
        }
    }

    jQuery.fn.update = function(text) {
        return this.each(function() {
            var element = jQuery(this);
            if (element.is('a')) {
                    element.attr('href', text);
            } else if (element.is('img')) {
                    element.attr('src', text);
            } else if (element.is(':input')) {
                    element.val(text);
            } else {
                    element.html(text);
            }
        });
    }

    jQuery.fn.equalHeights = function() {
        var max_height = 0;
        jQuery(this).each(function() {
            if (jQuery(this).outerHeight() > max_height) {
                /*This(Adding 0.4) is a hack, we will fix it in better way.*/
                max_height = jQuery(this).outerHeight()+0.4;
            }
        });
        if (Number.prototype.pxToEm) {
            max_height = max_height.pxToEm();
        }
        jQuery(this).css('min-height', max_height);
        return this;
    };

    //This function is used in validation of elements placed outside of the form.
    jQuery.fn.fields = function() {
        var id = jQuery(this).attr('id');
        if (id == undefined) {
            return jQuery(this).find(':input:not([form])');
        } else {
            return jQuery.merge(jQuery(this).find(':input:not([form]), :input[form=' + id + ']'), jQuery(':input[form=' + id + ']'))
        }
    }

    jQuery.fn.form = function() {
        var form_id = jQuery(this).attr('form');
        if (form_id === undefined) {
            return jQuery(this).closest('form');
        } else {
            return jQuery('#' + form_id);
        }
    }

    jQuery.fn.topLink = function(settings) {
        return this.each(function() {
            //listen for scroll
            var el = jQuery(this);
            el.hide(); //in case the user forgot
            jQuery(window).scroll(function() {
                if (jQuery(window).scrollTop() >= settings.min) {
                    el.fadeIn(settings.fadeSpeed);
                }
                else {
                    el.fadeOut(settings.fadeSpeed);
                }
            });
        });
    }

    window.default_modal_options = {replace: true};

    function getDefaultValidatorOptions() {
        return {
            highlight: function(element, errorClass, validClass) {
                $(element).closest('.form-group').removeClass('has-success');
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).closest('.form-group').removeClass('has-error');
                $(element).closest('.form-group').addClass('has-success');
            },
            errorPlacement: function(error, element) {
                var root_elt = element.closest('form, fieldset') || jQuery(element).parent(),
                    error_container = jQuery(root_elt).find('.validation-messages').first();
                if(error_container.size() === 0) {
                    error_container = jQuery('<div/>').addClass('validation-messages').appendTo(root_elt);
                }
                error.appendTo(error_container);
            },
            errorClass: 'text-danger',
            errorLabelContainer: jQuery(this).find('.validation-messages ul:last'),
            ignoreTitle: true
        };
    }

    jQuery.validator.setDefaults({
        ignore: ':hidden, [readonly], fieldset[disabled] :input'
    });

    // why 'fName'? because the 'name' is kinda reserved one, and causes weird errors if we use it.
    jQuery.validator.addMethod('fName', function(v, e, p) {
            return /^[A-z]?[A-z ]*[A-z]?$/.test(v);
        },
        function(v, e) {
            var label_text = jQuery(e).data('label') || jQuery(e).label().text();
            if(label_text === undefined) {
                label_text = jQuery(e).attr('name');
            }
            return 'Please do not use any numbers, spaces or special characters in your first name.';
        }
    );
    jQuery.validator.addMethod('lName', function(v, e, p) {
            return /^[A-z]?[A-z]*$/.test(v);
        },
        'Please do not use any numbers, spaces or special characters in your last name.'
    );
    jQuery.validator.addMethod('pass', function(v, e, p) {
            return this.getLength(jQuery.trim(v), e) >= 5;
        },
        'Password should be at least 5 characters long.'
    );
    jQuery.validator.addMethod('passwordVerify', function(v, e, p) {
            var form = jQuery(e).closest('form');
            return jQuery(form).find('.validate-newPassword').val() === v;
        },
        'Verify password must match the password entered.'
    );
    jQuery.validator.addMethod('phone', function(v, e, p) {
            return /^(\d{0,3}[ .-]?\d{3}[ .-]?\d{3}[ .-]?\d{4})?$/.test(v); 
        },
        'Please enter a valid phone number.'
    );
    jQuery.validator.addMethod('zip', function(v, e, p) {
            return this.getLength(jQuery.trim(v), e) <= 5; 
        },
        'Zip code can not be more than 5 characters for USA.'
    );
    jQuery.validator.addMethod('quantity', function(v, e, p) {
            return ((v >= 1) && /^\d+$/.test(v)); 
        },
        'Please enter a valid quantity.'
    );
    jQuery.validator.addMethod('cvv2', function(v, e, p) {
            var form = jQuery(e).closest('form');
            if ((jQuery(form).find('.cardType').val() === "AmericanExpress") || (jQuery(form).find('.cardType').text().search("AmericanExpress") !== -1)) {
                return ((this.getLength(v.replace(/\s/g, ''), e) >= 4) && (/^[0-9]{4}$/).test(v));
            } else {
                return ((this.getLength(v.replace(/\s/g, ''), e) == 3) && (/^[0-9]{3}$/).test(v));
            }
        },
        'Please enter a valid CVV2 number.'
    );
    jQuery.validator.addMethod('expireDate', function(v, e, p) {
            var now = new Date(),
                form = jQuery(e).closest('form'),
                month = jQuery(form).find('[name=expMonth]').val(),
                year = jQuery(form).find('[name=expYear]').val();
            if (!month || !year) {
                return true;
            }
            if (now < new Date(parseInt(year, 10), parseInt(month, 10))) {
                return true;
            }
            return false;
        },
        'The expiration date of your card has already passed.'
    );
    jQuery.validator.addMethod('nonPoAddress', function(v, e, p) {
            if(jQuery(e).is('.js-shippingInformation *')) {
                if(v.search(new RegExp('(po |p o |po box|p\\.o\\.|p\\.o )', 'i')) === 0) {
                    return false;
                }
            }
            return true;
        },
        'PO Box is not allowed for shipping address.'
    );
    jQuery.validator.addMethod('req', function(v, e, p) {
            switch(e.nodeName.toLowerCase()) {
                case 'select':
                    var val = jQuery(e).val();
                    return val && val.length > 0;
                case 'input':
                    if(this.checkable(e)) {
                        return this.getLength(v, e) > 0;
                    }
                default:
                    return jQuery.trim(v).length > 0;
            }
        },
        function(v, e) {
            var label_text = jQuery(e).data('label') || jQuery(e).label().text();
            if (!label_text.trim()) {
                label_text = jQuery(e).attr('name');
            }
            return 'Please enter a valid ' + label_text.trim() + '.';
        }
    );
    jQuery.validator.addMethod('avoidHtml', function(v, e, p) {
            return  /^[^<>]*$/.test(v); 
        },
        'Please dont enter less-than (<) and greater-than (>) symbols.'
    );
    
    jQuery.extend(jQuery.validator.messages, {
        email: "E-mail address not formatted correctly. Expected format: name@domain.com",
    });

    jQuery.validator.addMethod('usCanadaZip', function(v, e, p) {
            var country_box = jQuery(e).data("country-box");
            var country_name = jQuery(country_box).val();
            if (country_name === "USA") {
                return (this.getLength(jQuery.trim(v), e) <= 5 && (/^[0-9]{5}$/).test(v));
            } else if (country_name === "CAN") {
                return (this.getLength(jQuery.trim(v), e) <= 7 && (/^[A-z][0-9][A-z][ .-]?[0-9][A-z][0-9]$/).test(v));
            }
        },
        'Please enter a valid zip code.'
    );
    /* TODO: We can find better way to validate supported credit card number.*/
    jQuery.validator.addMethod('supportedCreditCard', function(v, e) {
        var form = jQuery(e).closest('form');
        var return_value = this.optional(e);
        var card_type_list = jQuery(form).find('.card_logos li');
        card_type_list.each(function(){
            if (jQuery(this).hasClass("CCT_AMERICANEXPRESS")) {
                return_value = return_value || (/^3$|^3[47][0-9]{0,13}$/.test(v));
            } else if (jQuery(this).hasClass("CCT_DISCOVER")) {
                return_value = return_value || (/^6$|^6[05]$|^601[1]?$|^65[0-9][0-9]?$|^6(?:011|5[0-9]{2})[0-9]{0,12}$/.test(v));
            } else if (jQuery(this).hasClass("CCT_VISA")) {
                return_value = return_value || (/^4[0-9]{0,15}$/.test(v));
            } else if (jQuery(this).hasClass("CCT_MASTERCARD")) {
                return_value = return_value || (/^5$|^5[1-5][0-9]{0,14}$/.test(v));
            }
        });
        return return_value;
        },
        function(v, e) {
            var label_text = getValidateElementLabel(v, e);
            return 'Please enter a valid ' + label_text;
        }
    );

    jQuery.validator.addClassRules({
        'validate-required': { req: true },
        'validate-name': { fName: true },
        'validate-lName': { lName: true },
        'validate-cvv2': { cvv2: true },
        'validate-email': { email: true },
        'validate-password': { pass: true },
        'validate-passwordVerify': { passwordVerify: true },
        'validate-phone': { phone: true },
        'validate-creditcard': { creditcard: true },
        'validate-zip': { zip: true },
        'validate-usCanadaZip': { usCanadaZip: true },
        'validate-quantity': { quantity: true },
        'validate-expireDate': { expireDate: true },
        'validate-nonPoAddress': { nonPoAddress: true },
        'validate-avoidHtml': { avoidHtml: true },
        'validate-supportedCreditCard': { supportedCreditCard: true }
    });

    jQuery('body').on('submit', 'form', function(e) {
        if(jQuery(this).data('validator') === undefined) {
            var elm = jQuery(this);
            elm.attr('novalidate', 'novalidate');
            elm.validate(jQuery.proxy(getDefaultValidatorOptions, this)());
        }
        if(!jQuery(this).valid()) {
            e.preventDefault();
            return false;
        }
    });
    jQuery('body').find('input').each(function (){
        if(!jQuery(this).hasClass('validate-required')) {
            jQuery(this).attr('placeholder', 'Optional');
        }
    });

    function toggleDisplay(target, state) {
        if(jQuery(target) !== undefined) {
            jQuery(target).toggle(state);
        }
    }

    jQuery('body').on('click', '[data-toggle-display]', function(e) {
        if (jQuery(this).is(':radio:checked')) {
            toggleDisplay(jQuery(this).data('toggle-display'), jQuery(this).is(':checked'));
        } else {
            jQuery(jQuery(this).data('toggle-display')).each(function() {
                toggleDisplay(jQuery(this), !jQuery(this).is(':visible'));
            });
        }
    });
    jQuery('body').on('click', '[data-toggle-hide]', function(e) {
        if (jQuery(this).is(':radio:checked')) {
            toggleDisplay(jQuery(this).data('toggle-hide'), !jQuery(this).is(':checked'));
        } else {
            e.preventDefault();
            jQuery(jQuery(this).data('toggle-hide')).each(function() {
                toggleDisplay(jQuery(this), !jQuery(this).is(':visible'));
            });
        }
    });

    jQuery('body').on('change click', '[data-toggle-class]:checkbox', function(e) {
        jQuery(this).trigger('toggle');
    });
    jQuery('body').on('toggle', '[data-toggle-class]:checkbox', function(e) {
        var className = jQuery(this).data('toggle-class'),
            target = jQuery(jQuery(this).data('toggle-target'));
        jQuery(target).toggleClass(className, jQuery(this).is(':checked'));
    });
    jQuery('body').on('change click', '[data-toggle-class1]:checkbox', function(e) {
        jQuery(this).trigger('toggle');
    });
    jQuery('body').on('toggle', '[data-toggle-class1]:checkbox', function(e) {
        var className = jQuery(this).data('toggle-class1'),
            target = jQuery(jQuery(this).data('toggle-target1'));
        jQuery(target).toggleClass(className, jQuery(this).is(':checked'));
    });
    jQuery('body').on('change click', '[data-inverse-toggle-class]:checkbox', function(e) {
        jQuery(this).trigger('toggle');
    });
    jQuery('body').on('toggle', '[data-inverse-toggle-class]:checkbox', function(e) {
        var className = jQuery(this).data('inverse-toggle-class'),
            target = jQuery(jQuery(this).data('inverse-toggle-target'));
        jQuery(target).toggleClass(className, !jQuery(this).is(':checked'));
    });
    jQuery('body').on('change click','[data-inverse-toggle-class1]:checkbox', function(e) {
        jQuery(this).trigger('toggle');
    });
    jQuery('body').on('toggle','[data-inverse-toggle-class1]:checkbox', function(e) {
        var className = jQuery(this).data('inverse-toggle-class1'),
            target = jQuery(jQuery(this).data('inverse-toggle-target1'));
        jQuery(target).toggleClass(className, !jQuery(this).is(':checked'));
    });

    jQuery('body').on('change click', '[data-toggle-attribute]', function(e) {
        jQuery(this).trigger('toggle');
    });
    jQuery('body').on('toggle', '[data-toggle-attribute]', function(e) {
        var attributes = jQuery(this).data('toggle-attribute').split(' '),
            target = jQuery(jQuery(this).data('toggle-attribute-target')),
            value = jQuery(this).data('toggle-attribute-value');
        e.preventDefault();
        for(var i=0; i<attributes.length; i++) {
            target.attr(attributes[i], value);
        }
    });
    jQuery('body').on('change click', '[data-toggle-attribute1]', function(e) {
        jQuery(this).trigger('toggle');
    });
    jQuery('body').on('toggle', '[data-toggle-attribute1]', function(e) {
        var attributes = jQuery(this).data('toggle-attribute1').split(' '),
            target = jQuery(jQuery(this).data('toggle-attribute-target1')),
            value = jQuery(this).data('toggle-attribute-value1');
        e.preventDefault();
        for(var i=0; i<attributes.length; i++) {
            target.attr(attributes[i], value);
        }
    });

    //The below code is to fix chrome issue, which doesn't allow change event at option tag.
    jQuery('body').on('change', 'select', function() {
        jQuery(this).find(':selected').trigger('change');
    })
    jQuery('body').on('change', 'option', function(e) {
        e.stopPropagation();
    })

    jQuery('body').on('change', ':input', function(e) {
        var form = jQuery(this).form();
        if (form.hasClass('js-change-submit')) {
            form.trigger('submit', e);
        }
    });

    jQuery("#zoom-container").elevateZoom({gallery:'gallery', cursor: 'crosshair', galleryActiveClass: 'active', zoomType: "inner", loadingIcon: '../image/loading_spinner.gif'});
    jQuery("#zoom-container").bind("click", function(e) { 
      var ez =   $('#zoom-container').data('elevateZoom');
      $.fancybox(ez.getGalleryList());
      return false;
    });

    jQuery('body').on('click',"#reviewProductForm button[type='submit']", function (e) {
        e.preventDefault();
        var elt = jQuery(this);
        var form = elt.form();
        form.ajaxForm({
            type:"post",
            dataType:'json',
            cache:'false',
            beforeSend: showAjaxLoader(form),
            complete:function(data) {
                hideAjaxLoader(elt);
                if (data.responseText != undefined) {
                    var eventMessage = jQuery.parseJSON(data.responseText)._EVENT_MESSAGE_;
                    var errorMessage = jQuery.parseJSON(data.responseText)._ERROR_MESSAGE_;
                    if (eventMessage != undefined && eventMessage != "") {
                        jQuery.ajax({
                            async: true,
                            type: 'post',
                            url: jQuery(form).data('success-request'),
                            cache: false,
                            complete: function(xhr, status) {
                                handleAjaxResponse({
                                    xhr: xhr,
                                    success_method: jQuery(form).data('success-method'),
                                    status: status
                                });
                                var message_dismiss = jQuery('<button/>').addClass('close').attr('data-dismiss', 'alert').html('&times;');
                                var message_body = jQuery('<div/>').addClass('alert alert-success alert-dismissable text-center').html(eventMessage).append(message_dismiss);
                                // Check if the success message is already on the screen.
                                if (jQuery('#review-notifications').children().size() == 0) {
                                    jQuery('#review-notifications').append(message_body);
                                }
                            }
                        });
                    } else if (errorMessage != undefined && errorMessage != "") {
                        jQuery(".errorMessage").addClass('alert alert-danger alert-dismissable text-center').html(errorMessage).append(message_dismiss);
                    }
                }
            }
        });
      form.submit();
    });

    jQuery('body').on('click', '[data-dialog-href]', function(e) {
        var href = jQuery(this).data('dialog-href'),
            id = jQuery(this).data('id'),
            title = jQuery(this).attr('title'),
            ajax_loader = jQuery('<i/>').addClass('dialog-ajax-loader fa fa-spinner fa-4x fa-spin'),
            modal_header = jQuery('<div/>').addClass('modal-header'),
            modal_title = jQuery('<h4/>').addClass('modal-title').html(title),
            modal_dismiss = jQuery('<button/>').addClass('close').attr('data-dismiss', 'modal').html('&times;'),
            modal_body = jQuery('<div/>').addClass('modal-body'),
            data_dialog_width = (jQuery(this).data('dialog-width')) ? jQuery(this).data('dialog-width') : "default";;

        window.modal = jQuery('<div/>').addClass('modal '+data_dialog_width).attr('id', id);
        window.data_dialog_width = data_dialog_width;
        jQuery(window.modal).append(modal_header);
        jQuery(modal_header).append(modal_dismiss);
        jQuery(modal_header).append(modal_title);
        jQuery(modal_body).insertAfter(modal_header);
        jQuery(modal_body).append(ajax_loader);
        rebindContainer(jQuery(window.modal));
        e.preventDefault();

        // adding backward compatibility
        if (!href && jQuery(this).hasClass('dialogWindow')) {
            href = jQuery(this).attr('href') || jQuery(this).attr('data-action');
            title = jQuery(this).attr('title');
        }
        if (href !== undefined) {
            /* jQuery's css selector does a ton of things except just the element selection, so if we use jQuery('/control/main')
             * then instead of returning empty array, it throws an error as it tries to consider the passed argument as regular expression
             * so assuming that we will only use id or class selector for pointing dialog's content's location, the below code is written
             */
            if (href.charAt(0) === '#' || href.charAt(0) === '.') {
                // we already have the dialog's content on the page, so let's use it, the content will tell us the dialog's title and the modal configuration
                jQuery(ajax_loader).remove();
                jQuery(modal_body).append(jQuery(href).html());
                if (title === undefined) {
                    modal_title.html(jQuery(href).find('.js-dialogTitle:first').text());
                }
                modal_body.find('.js-dialogTitle:first').hide();
                jQuery(window.modal).modal(default_modal_options);
                rebindContainer(jQuery(window.modal));
            } else {
                jQuery.ajax({
                    url: href,
                    dataTypeString: "html",
                    beforeSend: function() {
                        jQuery(window.modal).modal(default_modal_options);
                    },
                    complete: function(xhr, status) {
                        /* Here we are hiding existing modal as content before ajax request is only ajax-loader. So in case size of content 
                         * after ajax request is enough for modal overflow, modal is not coming at appropriate place (It is coming at center 
                         * of the window). A new modal will appear whose positioning will be according to the size of content of ajax response.
                         */
                        jQuery(window.modal).modal('hide');
                        var response_without_scripts = jQuery(xhr.responseText).not('script'),
                            response_scripts = jQuery(xhr.responseText).filter('script'),
                            response_html = jQuery('<div/>').html(response_without_scripts);
                        if (title === undefined) {
                            modal_title.html(response_html.find('.js-dialogTitle:first').text());
                        }
                        jQuery(modal_body).html(response_html.html());
                        modal_body.find('.js-dialogTitle:first').hide();
                        jQuery(response_scripts).appendTo(window.modal);
                        jQuery(window.modal).modal(default_modal_options);
                        rebindContainer(jQuery(window.modal));
                    }
                });
            }
        }
    });

    function getValidateElementLabel(v, e) {
        jQuery(e).siblings('label[class="error"]').remove();
        var label_text = jQuery(e).data('label') || jQuery(e).siblings('label:first').text();
        // can't use the title attribute here, as the validation API uses it to override the whole message
        if (label_text === undefined || label_text === "") {
            label_text = jQuery(e).attr('name');
        }
        return label_text;
    }

    function ajaxUpdater() {
        var options = this,
            elt = jQuery(options.elt),
            beforeSendCallback = options.beforeSendCallback ? options.beforeSendCallback : jQuery.noop;
            url = elt.data('update-url'),
            to_update = jQuery(elt.data('ajax-update')),
            valid = true,
            param_source = jQuery(elt.data('param-source')),
            form_fields = jQuery.unique(jQuery.merge(param_source.find(':input').andSelf(), elt.find(':input').andSelf()).filter(':input')),
            data = form_fields.serializeArray();
            form_fields.filter(':visible').each(function() {
                var validator = jQuery(this).form().data('validator');
                if(validator !== undefined) {
                    valid = valid && (validator.check(this) == false ? false : true);
                }
            });
        if (valid) {
            jQuery.ajax({
                async: true,
                type: 'post',
                url: url,
                cache: false,
                data: data,
                beforeSend: function(xhr, settings) {
                    beforeSendCallback({
                        xhr: xhr,
                    });
                    showAjaxLoader(elt);
                },
                complete: function(xhr, status) {
                    hideAjaxLoader(elt);
                    handleAjaxResponse({
                        xhr: xhr,
                        success_method: to_update,
                        error_method: to_update,
                        status: status
                    });
                }
            });
        }
    }

    jQuery('body').on('change', '[data-ajax-update]', function() {
        jQuery.proxy(ajaxUpdater, {elt: this})();
    });
    jQuery('body').on('click', 'a[data-ajax-update], button[data-ajax-update]', function(e) {
        e.preventDefault();
        jQuery.proxy(ajaxUpdater, {elt: this})();
    });

    //Define global variable to store last facet request object (xhr).
    var LAST_FACET_REQ_REF = null;
    jQuery('body').on('click', 'a[data-facet-update]', function(e) {
        e.preventDefault();
        var elt = jQuery(this);
        elt.data('ajax-update', elt.data('facet-update'));
        var options = {
            elt: elt,
            beforeSendCallback: function(options) {
                //If LAST_FACET_REQ_REF is not null means an existing ajax facet request is in progress, so need to abort them to prevent inconsistent behavior of results from facets
                if (LAST_FACET_REQ_REF != null && LAST_FACET_REQ_REF.readyState != 4) {
                    var oldRef = LAST_FACET_REQ_REF;
                    console.log(LAST_FACET_REQ_REF);
                    oldRef.abort();
                    console.log(LAST_FACET_REQ_REF);
                }
                LAST_FACET_REQ_REF = options.xhr;
            }
        }
        jQuery.proxy(ajaxUpdater, options)();
    });

    jQuery('body').on('change', '.js-shippingInformation [data-update-cart]', function() {
        var elt = jQuery(this),
            url = elt.data('update-cart-url'),
            to_update = elt.data('update-cart'),
            data = jQuery('.js-postalCode, .js-stateProvince, .js-country', '.js-shippingInformation').serializeArray();
        jQuery.ajax({
            async: true,
            type: 'post',
            url: url,
            cache: false,
            data: data,
            beforeSend: showAjaxLoader(elt),
            complete: function(xhr, status) {
                hideAjaxLoader(elt);
                handleAjaxResponse({
                    xhr: xhr,
                    success_method: to_update,
                    error_method: to_update,
                    status: status
                });
            }
        });
    });

    jQuery('body').on('change', '[data-change-submit]', function() {
        jQuery(this).submit();
    });

    jQuery('body').on('submit', 'form.js-ajaxAddToCart', function(e) {
        var form = jQuery(this),
            action = form.attr('action'),
            method = form.attr('method'),
            speed = (jQuery(this).data('slide-speed')) ? jQuery(this).data('slide-speed') : 'slow',
            parameters = form.serializeArray();
        e.preventDefault();
        doAjaxRequest(form, {
            url: action,
            type: method,
            data: parameters,
            success: function(data, status, xhr) {
                // hard coded here, need to add animation
                jQuery('#addToCartConfirmation').slideDown(speed).show();
            }
        });
        return false;
    });

    jQuery('body').on('submit', 'form.js-ajaxMe', function(e) {
        var form = jQuery(this),
            action = form.attr('action'),
            method = form.attr('method'),
            parameters = form.serializeArray();
        e.preventDefault();
        if(jQuery(this).data('validator') === undefined) {
            var elm = jQuery(this);
            elm.attr('novalidate', 'novalidate');
            elm.validate(jQuery.proxy(getDefaultValidatorOptions, this)());
        }
        if(jQuery(this).valid()) {
            doAjaxRequest(form, {
                url: action,
                type: method,
                data: parameters
            });
        }
        return false;
    });

    function doAjaxRequest(target, options) {
        var default_options = {
            async: true,
            type: 'post',
            cache: false,
            beforeSend: showAjaxLoader(target),
            success: jQuery.noop, //data, status, xhr
            error: jQuery.noop, // xhr, status, error
            complete: function(xhr, status) {
                hideAjaxLoader(target);
                handleAjaxResponse({
                    xhr: xhr,
                    success_method: jQuery(target).data('success-method'),
                    error_method: jQuery(target).data('error-method'),
                    status: status
                });
            }
        };
        jQuery.ajax(jQuery.extend({}, default_options, options));
    }

    function handleAjaxResponse(options) {
        var xhr = options.xhr,
            status = options.status,
            data = jQuery(xhr.responseText).not('script').not('.notification-messages'),
            scripts = jQuery(xhr.responseText).filter('script'),
            notification_messages = jQuery(xhr.responseText).filter('.notification-messages').children(),
            to_update = (status === 'success') ? jQuery(options.success_method) : jQuery(options.error_method);
            data = jQuery(data).not('script'),
            response_scripts = jQuery(xhr.responseText).filter('script'),
            default_dialog_title = (status === 'success') ? 'Notification' : 'Error',
            new_dialog_title = jQuery(window.modal).find('.modal-title'),
            data_dialog_width = (window.data_dialog_width) ? window.data_dialog_width : 'default',
            response_html = jQuery('<div/>').html(data);
            // do we really need it now?
        if(xhr.getResponseHeader('requestAction')) {
            window.location = xhr.getResponseHeader('requestAction');
            return;
        }
        if(new_dialog_title === undefined) {
            new_dialog_title = default_dialog_title;
        }

        if(data.size() > 0) {
            if(to_update.size() === 0) {
                // elements to be updated are not specified, so we will use dialog to display the result
                var title = new_dialog_title,
                    modal_dialog = jQuery('<div/>').addClass('modal-dialog'),
                    modal_header = jQuery('<div/>').addClass('modal-header'),
                    modal_title = jQuery('<h4/>').addClass('modal-title').html(title),
                    modal_dismiss = jQuery('<button/>').addClass('close').attr('data-dismiss', 'modal').html('&times;'),
                    modal_body = jQuery('<div/>').addClass('modal-body');
                window.modal = jQuery('<div/>').addClass('modal '+ data_dialog_width);
                jQuery(window.modal).append(modal_header);
                jQuery(modal_header).append(modal_dismiss);
                jQuery(modal_header).append(modal_title);
                jQuery(modal_body).insertAfter(modal_header);
                jQuery(modal_body).append(data);
                jQuery(window.modal).modal(default_modal_options);
                rebindContainer(jQuery(window.modal));
            } else if(to_update.size() === 1) {
                var isInDialog = false;
                to_update.html(data);
                if(jQuery('.modal').find(to_update).size() > 0) {
                    isInDialog = true;
                }
                if (!(isInDialog) && window.modal !== undefined) {
                    jQuery(window.modal).modal('hide');
                }
                rebindContainer(to_update);
                
            } else {
                var isInDialog = false;
                jQuery('<div/>').html(data).children().each(function(i, elt) {
                    var elt = jQuery(elt),
                        id = elt.attr('id'),
                        cls = (elt.attr('class') !== undefined) ? ('.' + elt.attr('class').split(' ').join('.')) : null;
                    if (id !== undefined) {
                        to_update.each(function(i, update_elt) {
                            if (jQuery(update_elt).attr('id') === id) {
                                jQuery(update_elt).html(elt.html());
                            }
                            if(jQuery('.modal').find('#'+id).size() > 0) {
                                isInDialog = true;
                            }
                        });
                    } else if (cls !== null) {
                        to_update.each(function(i, update_elt) {
                            if (jQuery.inArray(update_elt, jQuery(cls)) !== -1) {
                                jQuery(update_elt).html(elt.html());
                            }
                            if(jQuery('.modal').find(cls).size() > 0) {
                               isInDialog = true;
                            }
                        });
                    }
                });
                if(!isInDialog && window.modal !== undefined) {
                    jQuery(window.modal).modal('hide');
                }
                rebindContainer(to_update);
            }
            jQuery(scripts).appendTo('body');
        } else if (to_update.size() === 0 && window.modal !== undefined) {
            jQuery(window.modal).modal('hide');
        }
        jQuery(notification_messages).prependTo('.notification-messages');
    }

    jQuery('.ajax-form').find('input').keypress(function(e){
        if ( e.which == 13 ) // Enter key = keycode 13
        {
            $(this).next('input').focus();  //Use whatever selector necessary to focus the 'next' input
            return false;
        }
    });

    rebindContainer();

    function initScrollPagination (elt) {
        //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Javascript#Javascript-InfiniteScrolling
        jQuery(elt).find('.scrollPagination').each(function(){
            var scrollable_elt = jQuery(this);
            var loading_elt = jQuery(scrollable_elt.data('loading-result'));
            var no_more_elt = jQuery(scrollable_elt.data('no-more-result'));
            var more_result_elt = jQuery(scrollable_elt.data('more-result'));
            var options = {
                //the url you are fetching the results
                contentPage: scrollable_elt.data('content-page'),
                contentData: {
                    VIEW_SIZE: scrollable_elt.data('view-size'),
                    VIEW_INDEX: scrollable_elt.data('index') != undefined ? scrollable_elt.data('index') : scrollable_elt.data('view-index'),
                },
                // who gonna scroll? in this example, the full window or fixed table
                // Here we need to add more support for any element like div for infinit scrolling.we will update this code in case of new need.
                scrollTarget: (scrollable_elt.parents('.fht-tbody').size() > 0) ? scrollable_elt.parents('.fht-tbody') : window,
                // it gonna request when scroll is 2 pixels before the page ends
                heightOffset: 2,
                beforeLoad: function() { // before load function, you can display a preloader div
                    var opts = jQuery(this);
                    var form_id = scrollable_elt.data('form-id'),
                        fields = jQuery(form_id).serializeArray(),
                        fieldMap = {};
                    jQuery.each(fields, function() {
                        if (fieldMap[this.name]) {
                            if (!fieldMap[this.name].push) {
                                fieldMap[this.name] = [fieldMap[this.name]];
                            }
                            fieldMap[this.name].push(this.value || '');
                        } else {
                            fieldMap[this.name] = this.value || '';
                        }
                    });
                    loading_elt.fadeIn();
                    if(form_id == undefined) {
                        opts.attr('contentData', {'VIEW_INDEX': (opts.attr('contentData').VIEW_INDEX + 1), 'VIEW_SIZE': opts.attr('contentData').VIEW_SIZE});
                        opts.data('index', opts.attr('contentData').VIEW_INDEX);
                    } else {
                        opts.attr('contentData', {'VIEW_INDEX': (opts.attr('contentData').VIEW_INDEX + 1), 'VIEW_SIZE': opts.attr('contentData').VIEW_SIZE});
                        jQuery.extend(opts.attr('contentData'), fieldMap);
                        opts.data('index', opts.attr('contentData').VIEW_INDEX);
                    }
                },
                afterLoad: function(elementsLoaded) { // after loading content, you can use this function to animate your new elements
                    var opts = jQuery(this);
                    loading_elt.fadeOut();
                    var viewindex = opts.attr('contentData').VIEW_INDEX,
                        viewsize = opts.attr('contentData').VIEW_SIZE,
                        highIndex = viewsize * (viewindex + 1);
                    if (highIndex % (viewsize * 5) === 0) {
                        scrollable_elt.stopScrollPagination();
                        more_result_elt.show().click(function() {
                            scrollable_elt.scrollPagination();
                        });
                    }
                    var elementSize = scrollable_elt.children().size();
                    var listSize = scrollable_elt.data('list-size');
                    if (elementSize >= listSize) {
                        more_result_elt.hide();
                        no_more_elt.fadeIn();
                        scrollable_elt.stopScrollPagination();
                    } else {
                        scrollable_elt.attr('scrollpagination', 'enabled');
                    }
                    rebindContainer(jQuery(elementsLoaded));
                }
            }
        jQuery(this).scrollPagination(options);
        });
    }
    function rebindContainer(elt) {
        if(elt === undefined) {
            elt = jQuery('body');
        }
        initScrollPagination(elt);

      // to display star rating labels
        jQuery(elt).find('.js-prodRatingStar').rating();

      // This is a hack. Lets think of better fix.
      if (jQuery('body').is(elt)) {
          jQuery(window).load(function() {
              jQuery(elt).find('.product-summary').closest('.row').each(function() {
                  jQuery(this).find('.product-summary').equalHeights();
              });
          });
      } else {
          jQuery(elt).find('.product-summary').closest('.row').each(function() {
              jQuery(this).find('.product-summary').equalHeights();
          });
      }
          
        jQuery(elt).find('form').each(function() {
            var elm = jQuery(this);
            elm.attr('novalidate', 'novalidate');
            elm.validate(jQuery.proxy(getDefaultValidatorOptions, this)());
        });

        jQuery(elt).find(':checkbox, :radio:checked').trigger('toggle');

        


        jQuery(elt).find('img').each(function() {
            jQuery(this).error(function() {
                if(jQuery(this).data('alt-image') !== undefined ) {
                    jQuery(this).attr('src', jQuery(this).data('alt-image'));
                } else {
                    jQuery(this).attr('src', jQuery('body').data('alt-image'));
                }
            });
        });

        jQuery(elt).find('[data-dependent]').each(function() {
            var parent_elt = jQuery(this),
                child_elt = jQuery(parent_elt.data('dependent')),
                child_clone = child_elt.clone();
            jQuery(parent_elt).on('change', function() {
                var selected_title = jQuery(parent_elt).find(':selected').attr('title');
                jQuery(child_elt).empty();
                child_clone.children().each(function() {
                    /* The check "jQuery(this).is('option')" is added here because there is bug in IE 
                     * which shows some weird behavior when we check only for jQuery(this).attr('value') === ''
                     * */
                    if((jQuery(this).is('option') && jQuery(this).attr('value') === '') || jQuery(this).attr('label') === selected_title || (selected_title !== '' && jQuery(this).hasClass(selected_title))) {
                        jQuery(child_elt).append(jQuery(this).clone());
                    }
                });
            });
            jQuery(this).change();
        });
        
        jQuery(elt).on('change', '.js-selectableFeature', function() {
            var select_elt = jQuery(this),
                form_elt = select_elt.closest('form'),
                option_elt = jQuery(select_elt).find(':selected'),
                product_elt = jQuery(form_elt.data('product-elt')),
                price_elt = jQuery(form_elt.data('price-elt')),
                is_unavailable = (option_elt.data('is-available') === false),
                product_id = option_elt.val(),
                price = option_elt.data('price');
            form_elt.toggleClass('unavailable', is_unavailable);
            jQuery('.add-to-cart-btn').toggleClass('disabled', is_unavailable);
            product_elt.update(product_id);
            price_elt.update(price);
        });

        $(elt).find('#customer_card_number').each(function() {
            jQuery(this).creditCardTypeDetector({ 'credit_card_logos' : '.card_logos' });
        });

        jQuery(elt).find('.ajax-form').each(function(){
            jQuery(this).find('input').keypress(function(e){
                if ( e.which == 13 ) // Enter key = keycode 13
                {
                    $(this).next('input').focus();  //Use whatever selector necessary to focus the 'next' input
                    return false;
                }
            });
        });
        jQuery('.top-link').topLink({
            min: 50,
            fadeSpeed: 500
        });
        //smoothscroll
        jQuery('.top-link').click(function(e) {
            e.preventDefault();
            jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    }

    function showAjaxLoader(elt) {
        if(!jQuery(elt).is('form')) {
            jQuery(elt).parent().find('span.ajaxLoader').each(function() {
                jQuery(this).remove();
            });
            if(jQuery(elt).parent().hasClass('relative')) {
                jQuery(elt).parent().append(jQuery('<span/>').addClass('ajaxLoader abs'));
            } else if (jQuery(elt).hasClass('relative')) {
                jQuery(elt).append(jQuery('<span/>').addClass('ajaxLoader abs'));
            } else {
                jQuery(elt).parent().append(jQuery('<span/>').addClass('ajaxLoader'));
            }
        } else {
            var ajaxLoaderElt = jQuery(elt).fields().find('.ajaxLoader');
            if(ajaxLoaderElt.size() > 0) {
                jQuery(ajaxLoaderElt).show();
            } else {
                ajaxLoaderElt = jQuery(jQuery(elt).data('ajaxLoader'));
                if(ajaxLoaderElt.size() > 0) {
                    jQuery(ajaxLoaderElt).show();
                } 
            }
        }
    }

    function hideAjaxLoader(elt) {
        if(jQuery(elt).siblings('.ajaxLoader').size() > 0) {
            jQuery(elt).siblings('.ajaxLoader').hide();
        } else {
            var ajaxLoaderElt = elt.find('.ajaxLoader');
            if (ajaxLoaderElt.size() > 0) {
                jQuery(ajaxLoaderElt).hide();
            } else {
                ajaxLoaderElt = jQuery(jQuery(elt).data('ajaxLoader'));
                if (ajaxLoaderElt.size() > 0) {
                    jQuery(ajaxLoaderElt).hide();
                }
            }
        }
    }

    jQuery('body').on('click', '[data-click-navigation]', function() {
        clicked_elt = jQuery(this);
        clickable_link = jQuery(jQuery(clicked_elt).data('click-navigation'));
        if (clickable_link.data('update-url') != undefined) {
            jQuery(clickable_link).trigger('click');
        } else {
            window.location = clickable_link.attr('href');
        }
    });
});
