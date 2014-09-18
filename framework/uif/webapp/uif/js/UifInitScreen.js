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

jQuery(function() {
//Used to edit the panel heading title on mouseover event
    jQuery('body').on('mouseover', '.edit', function() {
        var elt = jQuery(this);
            isContentEditable = elt.find('[contentEditable]').attr('contentEditable') ? elt.find('[contentEditable]').attr('contentEditable'): false;
        if(!isContentEditable) {
            if(elt.hasClass('top-level')){
                if(elt.hasClass('active')){
                    elt.find('.edit-icon').show().removeClass('hide').parent().addClass("editable-field");
                }
            } else{
                elt.find('.edit-icon').show().removeClass('hide').parent().addClass("editable-field");
            }
        }
    }).on('mouseout', '.edit', function() {
        jQuery(this).find('.editable-content').parent().removeClass("editable-field");
    }).on('click', '.editable-field', function(e) {
        var elt = jQuery(this);
        elt.removeClass("editable-field").addClass('editable-input');
        elt.find('.editable-content:visible').each(function(){
            jQuery(this).attr('contentEditable', true).focus();
            selectElementContents(this);
        });
        elt.find('.edit-icon').hide();
        elt.find('.save-icon').show().removeClass('hide');
    }).on('focusout','.editable-content', function(e) {
        var elt = jQuery(this);
            elt_prev_val = elt.data('prev-val') ? elt.data('prev-val') : '';

        elt.parents('.editable-input').removeClass('editable-input');
        elt.siblings('.save-icon').hide();
        if(elt.text().trim().length == 0 || elt_prev_val == elt.text().trim()) {
            elt.update(elt_prev_val);
            window.getSelection().removeAllRanges();
            elt.removeAttr('contentEditable');
            return false;
        } else {
            jQuery(elt.data('text-copy-slave')).update(elt.text().trim());
        }
        var options = {
            elt: jQuery(elt.siblings('.save-icon')),
            callback: function(responseText, xhr) {
                 elt.removeAttr('contentEditable');
            }
        }
        jQuery.proxy(ajaxUpdater, options)();
    });

    jQuery.fn.uniqueId = function() {
        var id = this.attr('id'),
            new_id = id || new Date().getTime();
        if (id === undefined) {
            this.attr('id', new_id);
        }
        return new_id;
    };

       $( window ).load(function() {
        $('.hideOnLoad').hide();
    });

    jQuery.fn.reveal = function() {
        return this.each(function() {
            var element = jQuery(this);
            element.css('display', '');
            element.removeClass('invisible');
        });
    };

    //doc link coming soon
    jQuery('.js-joyride').each(function() {
        var elt = jQuery(this);
        jQuery('<i class="help-link fa fa-question-circle"></i>').insertAfter(elt).click(function() {
            elt.joyride('restart');
        });
        elt.joyride({modal:true});
    });

    // Below block can be used if we want to do navigation on clicking the radio or checkbox.
    jQuery('body').on('click', '[data-click-navigation]', function() {
        clicked_elt = jQuery(this);
        clickable_link = jQuery(jQuery(clicked_elt).data('click-navigation'));
        if (clickable_link.data('update-url') != undefined) {
            jQuery(clickable_link).trigger('click');
        } else {
            showSpinner(clickable_link);
            window.location = clickable_link.attr('href');
        }
    });

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

    jQuery.fn.update = function(text) {
        return this.each(function() {
            var element = jQuery(this);
            switch (element.prop('tagName').toLowerCase()) {
                case 'a':
                    element.attr('href', text);
                    break;
                case 'img':
                    element.attr('src', text);
                    break;
                case 'input':
                case 'select':
                    element.val(text);
                    break;
                default:
                    element.html(text);
                    break;
            }
        });
    }

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

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Javascript#Javascript-AutoSelectItemFromList
    jQuery('body').on('submit', '.js-scan-select', function(e) {
        e.preventDefault();
        var input_elt = jQuery(e.target).fields(),
            target = input_elt.data('target');
        jQuery(target).each(function() {
            if(jQuery(this).text().trim() == input_elt.val().trim()) {
               var row_to_move = jQuery(this).closest('tr'),
                   checkbox = row_to_move.find('.bulk-action-checkbox [type=checkbox]');
               row_to_move.prependTo(row_to_move.parent());
               checkbox.prop('checked', true).trigger('change');
               input_elt.val('');
            }
        });
    });

    /* Event added below is for safari browser on Ipad to make whole screen clickable. Safari on touch screen devices does not honor 
                 touch event on non-clickable elements so in order to open tooltip we need to make them clickable. It will work with popover.*/
    jQuery('#main-content').closest('.tab-content').on('click', function() {
        return void(0);
    });

    //doc link coming soon
    jQuery('body').on('click', 'a[data-clone-template-class], button[data-clone-template-class]', function() {
        jQuery(this).trigger('clone');
    });

    jQuery('body').on('clone', '[data-clone-template-class]', function() {
        var template_class = jQuery(this).data('clone-template-class'),
            source = jQuery('.' + template_class);
        jQuery(source).each(function() {
            var identifier = jQuery(this).data('clone-index-identifier'),
                index = jQuery(this).data('clone-index');
            jQuery(this).data('clone-index', index + 1);
            cloneIt(jQuery(this), identifier, index, template_class);
        });
    });

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Javascript#Javascript-Onkeypressdatanotify
    jQuery('body').on('keypress', '[data-notify]', function(e) {
        var id = jQuery(this).data('notify');
        jQuery(id).addClass('unsaved');
    });

    // this is a global variable
    default_modal_options = {
        replace: true
    }

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Javascript#Javascript-ConfirmMe
    jQuery('body').on('click', '.js-confirm-me', function(e) {
        var form_elt = jQuery(this).form();
        if (form_elt.size() === 0 || form_elt.valid()) {
            e.preventDefault();
            var elt = jQuery(this),
                title = jQuery(this).attr('title'),
                confirm_message = jQuery(this).data('confirm-message'),
                modal_header = jQuery('<div/>').addClass('modal-header'),
                modal_dismiss = jQuery('<button/>').addClass('close').attr('data-dismiss', 'modal').html('&times;'),
                modal_no = jQuery('<button/>').addClass('btn btn-default btn-primary').attr('data-dismiss', 'modal').html('No'),
                modal_yes = jQuery('<button/>').addClass('btn btn-default btn-danger').html('Yes'),
                modal_body = jQuery('<div/>').addClass('modal-body'),
                modal_footer = jQuery('<div/>').addClass('modal-footer');

            window.modal = jQuery('<div/>').addClass('modal').attr('role', 'dialog');

            if (title === undefined) {
                title = 'Confirm';
            }
            if (confirm_message === undefined) {
                confirm_message = 'Are you sure you want to perform this action?';
            }
            var modal_title = jQuery('<h4/>').addClass('modal-title').html(title);

            jQuery(window.modal).append(modal_header);
            jQuery(modal_body).insertAfter(modal_header);
            jQuery(modal_footer).insertAfter(modal_body);
            jQuery(modal_header).append(modal_dismiss);
            jQuery(modal_header).append(modal_title);
            jQuery(modal_body).append(confirm_message);
            jQuery(modal_footer).append(modal_no);
            jQuery(modal_yes).insertAfter(modal_no);
            jQuery(window.modal).modal(default_modal_options);

            jQuery(modal_yes).on('click', function (e) {
                var action = jQuery(elt).attr('formaction') ? jQuery(elt).attr('formaction') : jQuery(form_elt).attr('action');
                jQuery.ajax({
                    async: true,
                    type: 'post',
                    url: action,
                    data: form_elt.serializeArray(),
                    beforeSend: function() {
                        showSpinner(jQuery(this));
                    },
                    complete: function(xhr, status) {
                        jQuery('body').find('.ui-widget-overlay').remove();
                        jQuery('body').find('.fa-spinner').remove();
                        handleAjaxResponse({
                            xhr: xhr,
                            response: status,
                            display_success_method: form_elt.attr('data-successMethod'),
                            display_error_method: form_elt.attr('data-errorMethod')
                        }); 
                    }
                });
                jQuery(window.modal).modal('hide');
            });
        }
    });

    function toggleMenuDown(target, state) {
        if (jQuery(target) !== undefined) {
            if(state === true){
                jQuery(target).slideDown();
                setTimeout(function() {jQuery('.tilesBackground').css('min-height', '100%');}, 350);
            } else {
                jQuery(target).hide();
            }
        }
    }
    function toggleMenuUp(target, state) {
        if (jQuery(target) !== undefined) {
            if(state === true){
                jQuery('.tilesBackground').css('min-height', '');
                setTimeout(function() {jQuery(target).show();}, 300);
            } else {
                jQuery(target).slideUp();
            }
        }
    }
    /*jQuery('body').on('click', '[data-toggle-menu-down]', function(e) {
        e.preventDefault();
        jQuery(jQuery(this).data('toggle-menu-down')).each(function() {
            toggleMenuDown(jQuery(this), !jQuery(this).is(':visible'));
        });
        setTimeout(function() {jQuery('body').getNiceScroll().resize();}, 400);
    });
    jQuery('body').on('click', '[data-toggle-menu-up]', function(e) {
        e.preventDefault();
        jQuery(jQuery(this).data('toggle-menu-up')).each(function() {
            toggleMenuUp(jQuery(this), !jQuery(this).is(':visible'));
        });
        setTimeout(function() {jQuery('body').getNiceScroll().resize();}, 400);
    });*/
    jQuery('body').on('click', '[toggle-menu]', function(e){
        e.preventDefault();
        var value = jQuery(this).attr('toggle-menu');
        if(value == 'down') {
            jQuery('.menus').each(function() {
                toggleMenuDown(jQuery(this), !jQuery(this).is(':visible'));
            });
            //setTimeout(function() {jQuery('body').getNiceScroll().resize();}, 400);
        } else {
            jQuery('.menus').each(function() {
                toggleMenuUp(jQuery(this), !jQuery(this).is(':visible'));
            });
            //setTimeout(function() {jQuery('body').getNiceScroll().resize();}, 400);
        }
    });
    function filter(query, items) {
        var items = items.not('.template');
        if(query === '') {
            items.reveal();
        } else {
            items.each(function() {
                (jQuery(this).text().toLowerCase().indexOf(query.toLowerCase()) === -1) ? jQuery(this).hide() : jQuery(this).reveal();
            });
        }
    }

    jQuery('body').on('smart-change', '[data-filter]', function() {
        var items = jQuery(jQuery(this).data('filter')),
            query = jQuery(this).val();
        filter(query, items);
    });

    // Scroll spy logic begins
    var scrollSpyTargets = jQuery('.scroll-spy-section');
    if (scrollSpyTargets.size() > 1){
        var parent = jQuery('<nav/>').addClass('navbar navbar-default scroll-spy').attr('role', 'navigation').attr('data-spy', 'affix').attr('data-offset-top', '87'),
            parent_inner = jQuery('<div/>').addClass('collapse navbar-collapse bs-js-navbar-scrollspy'),
            nav_list = jQuery('<ul/>').addClass('nav navbar-nav');
        scrollSpyTargets.each(function() {
            var href = jQuery(this).attr('id'),
                title = jQuery(this).attr('spy-title');
                list = jQuery('<li/>'),
                anchor = jQuery('<a/>').attr('href', '#'+href).html(title);
            list.append(anchor);
            nav_list.append(list);
        });
        parent_inner.append(nav_list);
        parent.append(parent_inner);
        jQuery('#main-content').before(parent);
        nav_list.children().first().addClass('active');
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

    function toggleDisplay(target, state, effect) {
        if (jQuery(target) !== undefined) {
            if (state === true) {
                if (effect === 'slide') {
                    jQuery(target).slideDown().removeClass('hide');
                } else if (effect === 'fade') {
                    jQuery(target).fadeIn().removeClass('hide');
                } else {
                    jQuery(target).show().removeClass('hide');
                }
            } else {
                if (effect === 'slide') {
                    jQuery(target).slideUp();
                } else if (effect === 'fade') {
                    jQuery(target).fadeOut();
                } else {
                    jQuery(target).hide();
                }
            }
        }
    }

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Javascript#Javascript-DataCopycatSlave
    jQuery('body').on('change keyup', '[data-copycat-slave]', function() {
        var slave = jQuery(jQuery(this).data('copycat-slave'));
        jQuery(slave).update(jQuery(this).val());
    });

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Javascript#Javascript-DisplayToggler
    jQuery('body').on('change click', '[data-toggle-display]', function(e) {
        var effect = jQuery(this).data('toggle-effect');
        if (jQuery(this).is(':checkbox, :radio:checked')) {
            toggleDisplay(jQuery(this).data('toggle-display'), jQuery(this).is(':checked'), effect);
        } else {
            e.preventDefault();
            jQuery(jQuery(this).data('toggle-display')).each(function() {
                toggleDisplay(jQuery(this), !jQuery(this).is(':visible'), effect);
            });
        }
    });

    jQuery('body').on('change click', '[data-toggle-hide]', function(e) {
        var effect = jQuery(this).data('toggle-effect');
        if (jQuery(this).is(':checkbox, :radio:checked')) {
            toggleDisplay(jQuery(this).data('toggle-hide'), !jQuery(this).is(':checked'), effect);
        } else {
            e.preventDefault();
            jQuery(jQuery(this).data('toggle-hide')).each(function() {
                toggleDisplay(jQuery(this), !jQuery(this).is(':visible'), effect);
            });
        }
    });

    /*Code to invoke functions to add/remove tabs based on width*/
    jQuery(window).resize(function() {
        var tabs_parent = jQuery('.tabs-sm'),
            win_size = jQuery(window).width();
        if (tabs_parent.size() > 0) {
            tabs_parent.each(function() {
                var is_tabs = false,
                    parent = jQuery(this);
                if (parent.find('.tab-wrap-div').size() > 0) {
                    is_tabs = true;
                }
                if(win_size >= 992 && is_tabs) {
                    removeTabs(parent);
                } else if (win_size < 992 && win_size >= 768 && !is_tabs) {
                    createTabs(parent);
                }
            });
        }
        var body = jQuery('body').find(".pushdown-body").first();
            if (body.length < 1) return;

            body.detach();

            var pushdown = jQuery('body').find(".selected-pushdown"),
                edge = pushdown;

            while (edge.next().size() > 0 && edge.next().position().left > edge.position().left) {
                edge = edge.next();
            }

            edge.after(body);
    });

    jQuery('#notification-messages').find('.alert-success').each(function (){
        counterHide(jQuery(this), 5);
    });

    function toggleAttributes(target, attributes, value, toggle) {
        if (toggle) {
            for(var i=0; i<attributes.length; i++) {
                if(value !== undefined) {
                    target.attr(attributes[i], value);
                } else {
                    target.attr(attributes[i], attributes[i]);
                }
            }
        } else {
            for(var i=0; i<attributes.length; i++) {
                target.removeAttr(attributes[i]);
            }
        }
    }

    jQuery('body').on('change click', '[data-toggle-attribute]', function(e) {
        var attributes = jQuery(this).data('toggle-attribute').split(' '),
            target = jQuery(jQuery(this).data('toggle-attribute-target')),
            value = jQuery(this).data('toggle-attribute-value');
        if (jQuery(this).is(':checkbox') || jQuery(this).is(':radio')) {
        toggleAttributes(target, attributes, value, jQuery(this).is(':checked'));
        } else {
            target.each(function(){
                var elt = jQuery(this);
                toggleAttributes(elt, attributes, value, (elt.attr(attributes[0]) === undefined));
            });
        }
    });
    jQuery('body').on('change click', '[data-inverse-toggle-attribute]:checkbox, [data-inverse-toggle-attribute]:radio', function(e) {
        var attributes = jQuery(this).data('inverse-toggle-attribute').split(' '),
            target = jQuery(jQuery(this).data('inverse-toggle-attribute-target')),
            value = jQuery(this).data('inverse-toggle-attribute-value');
        toggleAttributes(target, attributes, value, !jQuery(this).is(':checked'));
    });
    jQuery('body').on('click', '[data-toggle-disable]', function(e) {
        var elt = jQuery(this),
            disable_elt = elt.data('toggle-disable');
        jQuery(disable_elt).find('input, button, select').each(function() {
            toggleAttributes(jQuery(this), ['disabled'], 'disabled', elt.is(':checked'));
        });
    });

 // To set from date field and thru date field with a certain time duration gap.
    jQuery('body').on('click', '[data-duration]', function() {
        var elt = jQuery(this),
            now_date = new Date();
            from_date_target = elt.data('from-date-target'),
            thru_date_target = elt.data('thru-date-target'),
            duration = elt.data('duration');
            duration_type = duration.substr(duration.length-1);
            duration_value = duration.substring(0,duration.length-1);
            jQuery(thru_date_target).datepicker("setDate", elt.data('thru-date'));
            jQuery(from_date_target).datepicker("setDate", elt.data('from-date'));
    });

    if (jQuery('.prodRatingStar').length > 0) {
        jQuery('.prodRatingStar').rating({requireCancel: false});
    }

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Javascript#Javascript-AjaxUpdater
    jQuery('body').on('change', '[data-ajax-update]', function() {
        jQuery.proxy(ajaxUpdater, {elt: this})();
    });

    jQuery('body').on('click', 'a[data-ajax-update], button[data-ajax-update]', function(e) {
        e.preventDefault();
        jQuery.proxy(ajaxUpdater, {elt: this})();
    });

    //Define global variable to store last facet request object (jqXHR).
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
                    oldRef.abort();
                }
                LAST_FACET_REQ_REF = options.xhr;
            }
        }
        jQuery.proxy(ajaxUpdater, options)();
    });

    jQuery.validator.setDefaults({
        // Note: Here we are allowing js-chosen and js-ajax-chosen to run validation as by default select or input having either of these classes marked as hidden.
        // Suggestion: One can make class and can achieve the same but as of now we donot feel its relevance.
        ignore: ':hidden:not(.js-chosen):not(.js-ajax-chosen):not(.tm-validate), [readonly=readonly], fieldset:disabled :input'
    });
    jQuery.validator.addMethod('bulkActionReq', function(v, e, p) {
        var form = jQuery(e).form(),
            any_checked = false;
        if (form.size() > 0) {
            jQuery(form).fields().filter('[data-bulk-checkbox]').each(function() {
                any_checked = any_checked || jQuery(this).is(':checked');
            });
            return any_checked;
        }
        return true;
    }, 'Please select one of the items to perform this action.');
    jQuery.validator.addMethod('fName', function(v, e, p) {
            return /^[A-Za-z]?[A-Za-z ]*$/.test(v);
        },
        'Please do not use numbers or special characters in your name.'
    );
    jQuery.validator.addMethod('lName', function(v, e, p) {
            return /^[A-Za-z]?[A-Za-z]*$/.test(v);
        },
        'Please do not use any numbers, spaces or special characters in your last name.'
    );
    jQuery.validator.addMethod('nosplChar', function(v, e, p) {
            return /^[A-Za-z0-9]*$/.test(v);
        },
        'Please do not use spaces or any special characters.'
    );
    jQuery.validator.addMethod('pass', function(v, e, p) {
            return this.getLength(jQuery.trim(v), e) >= 5;
        },
        'Password should be at least 5 characters long.'
    );
    // Made a method to validate if either of the specified field is entered. 
    jQuery.validator.addMethod('atleastOneRequired', function(v, e, p) {
        var selector = jQuery(jQuery(e).data('group-element'));
        var validOrNot = jQuery(selector, jQuery(e).form()).filter(function() {
            return jQuery(this).val();
        }).length >= 1;
        return validOrNot;
    }, 
    'Please fill at least one of these fields.'
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
        'Please enter a valid phone number. Example: 123-123-123-1234.'
    );
    jQuery.validator.addMethod('zip', function(v, e, p) {
            return this.getLength(jQuery.trim(v), e) <= 5; 
        },
        'Zip code can not be more than 5 characters for USA.'
    );
    jQuery.validator.addMethod('url', function(v, e, p) {
            return this.getLength(jQuery.trim(v), e) == 0 || /^((http|https):\/\/)?((www)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v);
        },
        'Please enter a valid URL.'
    );
    jQuery.extend(jQuery.validator.messages, {
        email: "E-mail address not formatted correctly. Expected format: name@domain.com",
    });
    //TODO quantity validation can be replaced by positive integer validation.
    jQuery.validator.addMethod('quantity', function(v, e, p) {
            return (this.optional(e) || ((v > 0) && /^\d+$/.test(v))); 
        },
        'Please enter a valid quantity.'
    );
    jQuery.validator.addMethod('positiveInteger', function(v, e, p) {
            return (this.optional(e) || ((v > 0) && /^\d+$/.test(v))); 
        },
        function(v, e) {
            var label_text = getValidateElementLabel(v, e);
            return 'Please enter a valid ' + label_text + ', e.g., 1, 2';
        }
    );
    jQuery.validator.addMethod('nonZero', function(v, e, p) {
            return (this.optional(e) || (v != 0));
        },
        'Please enter non-zero value.'
    );
    jQuery.validator.addMethod('amount', function(v, e, p) {
            return (this.optional(e) || (/^-?\d*(\.\d+)?$/.test(v))); 
        },
        'Please enter a valid amount.'
    );

    jQuery.validator.addMethod('auctionPrice', function(v, e, p) {
        var form = jQuery(e).closest('form'),
                startPrice = jQuery(form).find('[name=startPrice]').val(), 
                buyItNowPrice = jQuery(form).find('[name=buyItNowPrice]').val(),
                minimumBuyItNowPrice = Number(startPrice) + Number(startPrice*(0.3));
            if (buyItNowPrice >= minimumBuyItNowPrice) {
                return true;
            }
            return false;
        },
        'Auction Price must be 30% more than start price.'
    );

    jQuery.validator.addMethod('minMax', function(v, e, p) {
            return (jQuery(e).data('min') < v && v <= jQuery(e).data('max'));
        },
        function(v, e) {
            return 'Please enter value between ' + jQuery(e).data('min') + ' and ' + (jQuery(e).data('max')) + '.';
        }
    );
    jQuery.validator.addMethod('usCanadaZip', function(v, e, p) {
            var form = jQuery(e).closest('form'),
                country_box = jQuery(e).data("country-box"),
                country_name = jQuery(country_box).val();
            if ((jQuery(form).find('.countryGeoId').val() === "USA") || (country_name === "USA")) {
                return (this.getLength(jQuery.trim(v), e) <= 5 && (/^[0-9]{5}$/).test(v));
            } else if ((jQuery(form).find('.countryGeoId').val() === "CAN") || (country_name === "CAN")) {
                return (this.getLength(jQuery.trim(v), e) <= 7 && (/^[A-z][0-9][A-z][ .-]?[0-9][A-z][0-9]$/).test(v));
                /* TODO: For now we are validating to true all zip codes for countries other than US and Canada. Validations for other countries will be added on requirement*/ 
            } else {
                return true;
            }
        },
        'Please enter a valid zip code.'
    );
    jQuery.validator.addMethod('expireDate', function(v, e, p) {
            var now = new Date(),
                form = jQuery(e).closest('form'),
                month = jQuery(form).find('[name=expMonth]').val(),
                year = jQuery(form).find('[name=expYear]').val();
            if (now < new Date(parseInt(year, 10), parseInt(month, 10))) {
                return true;
            }
            return false;
        },
        'The expiration date of your card has already passed.'
    );
    jQuery.validator.addMethod('positiveNumber', function(v, e) {
        return (this.optional(e) || (/^(?!0*[.]0*$|[.]0*$|0*$)((\d{1,3}(,\d{3})*)|(\d*))?(\.\d+)?$/.test(v)));
        },
        function(v, e) {
            var label_text = getValidateElementLabel(v, e);
            return 'Please enter a valid ' + label_text + ', e.g., 12,390,678.12';
        }
    );
    jQuery.validator.addMethod('nonNegativeNumber', function(v, e) {
        return (this.optional(e) || (/(^\d*\.?\d*[0-9]+\d*$)|(^[0-9]+\d*\.\d*$)/.test(v)));
        },
        function(v, e) {
            var label_text = getValidateElementLabel(v, e);
            return 'Please enter a valid ' + label_text;
        }
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
    jQuery.validator.addMethod('checkAvailability', function(v, e) {
        var elt = jQuery(e);
            url = elt.data('check-avail-url');
            param_source = jQuery(elt.data('param-source')),
            fields = jQuery.unique(jQuery.merge(param_source.find(':input').andSelf(), elt.find(':input').andSelf()).filter(':input')),
            data = fields.serializeArray(),
            result = true;
        jQuery.ajax({
            url: url,
            async: false,
            type: 'post',
            data: data,
            complete: function(xhr, status) {
                var response = jQuery(xhr.responseText),
                    error_html = response.find('.alert-error').html();
                if(error_html !== undefined) {
                    elt.attr('data-check-avail-label', jQuery(response).text());
                    result = false;
                }
            }
        });
        return result;
        },
        function(v, e) {
            label_text = jQuery(e).data('check-avail-label');
            jQuery(e).removeAttr('data-check-avail-label');
            return label_text;
        }
    );
    jQuery.validator.addMethod('cvv2', function(v, e, p) {
        var form = jQuery(e).closest('form');
        if ((jQuery(form).find('.cardType').val() === "AmericanExpress") || (jQuery(form).find('.cardType').text().search("AmericanExpress") !== -1)) {
            return ((this.getLength(v.replace(/\s/g, ''), e) >= 4) || (this.getLength(v.replace(/\s/g, ''), e) == 0) && (/^$|[0-9]{4}$/).test(v));
        } else {
            return ((this.getLength(v.replace(/\s/g, ''), e) == 3) || (this.getLength(v.replace(/\s/g, ''), e) == 0) && (/^$|[0-9]{3}$/).test(v));
        }
    },
    'Please enter a valid CVV2 number.'
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
            var label_text = getValidateElementLabel(v, e);
            return 'Please enter ' + label_text;
        }
    );

    function getValidateElementLabel(v, e) {
        jQuery(e).siblings('label[class="error"]').remove();
        var label_text = jQuery(e).data('label') || jQuery(e).siblings('label:first').text();
        // can't use the title attribute here, as the validation API uses it to override the whole message
        if (label_text === undefined || label_text === "") {
            label_text = jQuery(e).attr('name');
        }
        return label_text;
    }

    jQuery.validator.addClassRules({
        'required': {
            req: true
        },
        'validate-name': {
            fName: true
        },
        'validate-lName': {
            lName: true
        },
        'validate-nosplChar': {
            nosplChar: true
        },
        'validate-password': {
            pass: true
        },
        'validate-passwordVerify': {
            passwordVerify: true
        },
        'validate-email': {
            email: true
        },
        'validate-phone': {
            phone: true
        },
        'validate-zip': {
            zip: true
        },
        'validate-url': {
            url: true
        },
        'validate-quantity': {
            quantity: true
        },
        'validate-amount': {
            amount: true
        },
        'validate-nonZero': {
            nonZero: true
        },
        'validate-bulk-required': {
            bulkActionReq: true
        },
        'validate-min-max': {
            minMax: true
        },
        'validate-auctionPrice': {
            auctionPrice: true
        },
        'validate-usCanadaZip': {
            usCanadaZip: true
        },
        'validate-creditcard': {
            creditcard: true
        },
        'validate-supportedCreditCard': {
            supportedCreditCard: true
        },
        'validate-expireDate': {
            expireDate: true
        },
        'validate-positiveNumber': {
            positiveNumber: true
        },
        'validate-nonNegativeNumber':{
            nonNegativeNumber: true
        },
        'validate-alphanumeric': {
            alphanumeric: true
        },
        'validate-atleastOneRequired': {
            atleastOneRequired : true
        },
        'validate-cvv2': {
            cvv2: true
        },
        'check-availability': {
            checkAvailability: true
        },
        'validate-positiveInteger': {
             positiveInteger: true
         },
    });

    initValidations = (function() {
        function setValidation(elt) {
            jQuery(elt).validate({
                errorPlacement: function(error, input_elt) {
                    var input_id = jQuery(input_elt).attr('id') || '',
                        msg_elt = '';
                    // This code is to support error placement in modal window, on page modal window rendering need to be fixed.
                    if(input_id !== undefined && input_id !== '') {
                        var modal_elt = input_elt.closest('.modal');
                        if(modal_elt.size() === 0) {
                            msg_elt = jQuery('#validate-' + input_id);
                        } else {
                            msg_elt = modal_elt.find('#validate-' + input_id);
                        }
                    }
                    // The element where validation message will be placed is identified by css selector #validate-<input field's name>
                    // If no such element exists, then the validation message will be appended to input field's parent element
                    if (jQuery(msg_elt).size() === 0) {
                        error.appendTo(input_elt.parent());
                    } else {
                        error.appendTo(msg_elt);
                    }
                }
            });
        }
        // Set validations on all the forms which have class requireValidation
        jQuery('form.requireValidation').each(function(i, elt) {
            setValidation(elt);
        });

        return function(elt) {
            jQuery(elt).find('form.requireValidation').each(function(i, elt) {
                setValidation(elt);
            });
        }
    }());

    // Added custom method to override the OOTB method to validate number according to need to allow the numbers with leading decimal like- .3, .4, etc.
    jQuery.validator.addMethod('number', function(v, e) {
        return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v);
    }, "Please enter a valid number.");

    jQuery.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^\w+$/i.test(value);
    }, "Letters, numbers, spaces or underscores only please.");

    jQuery('body').on('keyup change', '.js-tag-input, .js-chosen, .js-ajax-chosen', function(){
        var elt = jQuery(this);
        if (elt.attr('value') === '' && elt.siblings('.tm-validate').attr('value') === '') {
            elt.siblings('label.error').show();
        } else {
            elt.siblings('label.error').hide();
        }
    });

    initAjaxObservers = (function() {
        function setAjaxObserver(elt) {
            var elt = jQuery(elt),
                options = {
                    form_elt: elt,
                    event: elt.attr('data-submitMethod') || 'submit',
                    paramSource: elt.attr('data-paramSource') || '',
                    anim_method: elt.data('anim-method'),
                    anim_direction:elt.data('anim-direction'),
                    display_dialog_title: elt.attr('data-dialogTitle'),
                    display_success_method: elt.attr('data-successMethod'),
                    display_error_method: elt.attr('data-errorMethod'),
                    new_dialog_update: elt.attr('data-newDialogUpdate')
                };
            ajaxifyForm(options);
        }
        // Set AJAX observers on all the forms which have class ajaxMe
        jQuery('form.ajaxMe').each(function(i, elt) {
            setAjaxObserver(elt);
        });

        return function(elt) {
            jQuery(elt).find('form.ajaxMe').each(function(i, elt) {
                setAjaxObserver(elt);
            });
        };
    }());

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Components#Components-Dialog
    jQuery('body').on('click', '[data-dialog-href], .dialogWindow', function(e) {
        // the dialog's content, can be an on-page element or an URL, in which case we will need to ajax-load the data
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

    function flipBack() {
        jQuery('.flipper-back:first').find('.header-copy').each(function() {
            jQuery(this).addClass('hide');
        }); //Need to rethink about this code.
        jQuery('body').find('.thfloat-table').each(function() {
            jQuery(this).remove();
        }); //Need to rethink about this code.
        swapWithAnimation(jQuery('.flipper-face:first'), jQuery('.flipper-back:first'), 'lightSpeedR', '', true);
        setTimeout(function() {
            jQuery('.flipper-back:first').children().unwrap();
        }, 1000);
    }

    function flipForward(title, content) {
        var flipper_face = jQuery('<div/>').addClass('flipper-face'),
            notification_messages = jQuery('#notification-messages');
            datepicker = jQuery('#ui-datepicker-div');
            custom_menus = jQuery('.tilesBackground');
            jQuery('body').find('#notification-messages').remove();
            jQuery('body').find('#ui-datepicker-div').remove();
            jQuery('body').find('.tilesBackground').remove();
        jQuery('body').children().wrapAll('<div class="flipper-back"/>');
        jQuery('body').prepend(custom_menus);
        // TODO: Need to have a better handling for '#notification-messages' and '#ui-datepicker-div' as both this ids must be there on the page only once.
        jQuery('body').append(notification_messages);
        jQuery('body').append(datepicker);
        flipper_face.insertBefore('.flipper-back:first').hide();
        flipper_face.html(content);
        swapWithAnimation(jQuery('.flipper-back:first'), jQuery('.flipper-face:first'), 'lightSpeed', '');
        setTimeout(function() {
            jQuery('.flipper-back:first').removeClass().addClass('flipper-back').hide();
            jQuery('.flipper-face:first').removeClass().addClass('flipper-face');
        }, 1000);
    }

    jQuery('body').on('click', '[data-flipper-href]', function(e) {
        var href_temp = jQuery(this).data('flipper-href'),
            href = encodeURI(href_temp),
            title = jQuery(this).attr('title'),
            menu = jQuery(this).attr('menu'),
            elt = jQuery(this),
            ajax_loader = jQuery(elt).siblings('.ajax-loader'),
            content;
        e.preventDefault();

        if (href !== undefined) {
            if (href.charAt(0) === '#' || href.charAt(0) === '.') {
                title = title || jQuery(href).find('.js-dialogTitle:first').text();
                content = jQuery(href).clone();
                jQuery(content).find('.js-dialogTitle:first').hide();
                jQuery(content).find('script').remove();
                flipForward(title, content.html());
            } else {
                jQuery.ajax({
                    url: href,
                    beforeSend: function() {
                        var ajax_loader = jQuery('<i/>').addClass('dialog-ajax-loader fa fa-spinner fa-4x fa-spin');
                        flipForward(title, ajax_loader);
                    },
                    complete: function(xhr, status) {
                        var response_without_scripts = jQuery(xhr.responseText).not('script'),
                            response_scripts = jQuery(xhr.responseText).filter('script'),
                            response_html = jQuery('<div/>').html(response_without_scripts);
                            jQuery(response_html).find('.previous').html(menu);
                        jQuery('.flipper-face:first').html(response_html.html());
                        jQuery('.flipper-close').click(flipBack);
                        jQuery(response_scripts).appendTo('body');
                        jQuery(window).scrollTop(0);
                        rebindContainer(jQuery('.flipper-face'));
                    }
                });
            }
        }
    });
    
    jQuery('body').on('click', '[data-pushdown-href]', function(e) {
            var href = jQuery(this).data('pushdown-href'),
                targeted_pushdown = jQuery(this).parents(".pushdown"),
                content,
                body;
            e.preventDefault();
            jQuery('.selected-pushdown').each(function(){
                        jQuery(this).removeClass('selected-pushdown');
            });
            var pushdown = jQuery(this).parents(".pushdown").first(),
                next_pushdown = pushdown.next();
            
                    while (pushdown.next().size() > 0 && pushdown.next().position().left > pushdown.position().left) {
                       pushdown = pushdown.next();
                    }
    
            if (href !== undefined) {
                if (href.charAt(0) === '#' || href.charAt(0) === '.') {
                    content = jQuery(href).clone();
                    
                    jQuery('.pushdown-body').each(function(){
                        jQuery(this).remove();
                    });
                    showSpinner(jQuery(this));
                    body = jQuery("<div class='pushdown-body row'></div>");
                    pushdown.after(body);
                    updateWithAnimation(body, content.html(), 'fade', 'Down');
                    targeted_pushdown.addClass('selected-pushdown');
                    jQuery('body').find('.ui-widget-overlay').remove();
                    jQuery('body').find('.fa-spinner').remove();
                } else {
                    jQuery.ajax({
                        url: href,
                        beforeSend: function() {
                            showSpinner(jQuery(this));
                            jQuery('.pushdown-body').each(function(){
                               jQuery(this).remove();
                            });
                            body = jQuery("<div class='pushdown-body row'></div>");
                            pushdown.after(body);
                        },
                        complete: function(xhr, status) {
                            jQuery('body').find('.ui-widget-overlay').remove();
                            jQuery('body').find('.fa-spinner').remove();
                            var response_without_scripts = jQuery(xhr.responseText).not('script'),
                                response_scripts = jQuery(xhr.responseText).filter('script'),
                                response_html = jQuery('<div/>').html(response_without_scripts);
                            updateWithAnimation(body, response_html.html(), 'fade', 'Down');
                            targeted_pushdown.addClass('selected-pushdown');
                            rebindContainer(jQuery(body));
                            //jQuery(window).scrollTop(0);
                        }
                    });
                }
            }
    });
    
    jQuery('body').on('click', '.pushdown-close', function(e) {
        var pushdown_body = jQuery(this).parents('.pushdown-body').first();
        showSpinner(jQuery(this));
        updateWithAnimation(pushdown_body, "<span></span>", 'fade', 'Up');
        jQuery('body').find('.ui-widget-overlay').remove();
        jQuery('body').find('.fa-spinner').remove();
    });
    
    
    jQuery('body').on('click', '.nav-tabs .close', function(e) {
        jQuery('.static-popover').popover('destroy');
        var step = jQuery(this).siblings('[data-toggle=tab]'),
            step_container = step.parent(),
            first_step = step_container.siblings(':eq(1)');
        if (!step_container.hasClass('active')) {
            first_step = step_container.siblings('.active');
        }
        step_container.remove();
        jQuery(step.attr('href')).remove();
        jQuery(first_step.find('a')).tab('show');
    });

    jQuery('body').on('click', '.nav-tabs a', function(e) {
        jQuery('.static-popover').popover('destroy');
        if (jQuery('body').find('.static-popover').html() !== undefined) {
            initStaticPopover('body');
        }
    });

    jQuery('body').on('click', '[data-tab-href]', function(e) {
        var href = jQuery(this).data('tab-href'),
            title = jQuery(this).attr('title'),
            sub_title = jQuery(this).attr('sub-title'),
            id = jQuery(this).uniqueId();
            if (sub_title === undefined) {
                sub_title = "";
            }

        e.preventDefault();

        if (href !== undefined) {
            var tab_id = 'tab-'+id,
                step = jQuery('[href=#'+tab_id+']').parent(),
                content = jQuery('#'+tab_id);
            if (step.size() === 0) {
                step = jQuery('<li class="page-title-tab"><button type="button" class="close">&times;</button><a href="#'+tab_id+'" data-toggle="tab"><h3><div class="tab-overflow">'+title+'<br><small>'+sub_title+'</small></div></h3></a></li>'),
                content = jQuery('<div id="'+tab_id+'" class="tab-pane fade"></div>');
                jQuery('#page-title').append(step);
                jQuery(content).insertAfter('#main-content');
            }
            jQuery(step.find('a')).tab('show');
            jQuery.ajax({
                url: href,
                beforeSend: function() {
                    var ajax_loader = jQuery('<i/>').addClass('fa fa-spinner fa-4x fa-spin').css({position:'absolute', bottom:'50%', left:'50%'});
                    jQuery(content).html(ajax_loader);
                },
                complete: function(xhr, status) {
                    var response_without_scripts = jQuery(xhr.responseText).not('script'),
                        response_scripts = jQuery(xhr.responseText).filter('script'),
                        response_html = jQuery('<div/>').html(response_without_scripts);
                    jQuery(content).html(response_html.html());
                    jQuery(response_scripts).appendTo(content);
                    rebindContainer(content);
                }
            });
        }
    });

    //jQuery('body').on('shown.bs.tab', function() {
      //  jQuery('body').getNiceScroll().resize();
    //});

    /* Js code for website dropdown functionality*/
    jQuery('body').on('click', '.open-sub-list', function() {
        var sub_list = jQuery(this).siblings('ul.sub-list');
        jQuery('ul.sub-list').each(function() {
            if (jQuery(this).is(sub_list)) {
                if (jQuery(this).is(':visible')) {
                    jQuery(this).hide();
                } else{
                    jQuery(this).show();
                }
            } else {
                jQuery(this).hide();
            }
        });
    });

    jQuery('body').on('click', '.ui-widget-overlay', function(e) {
        e.preventDefault();
        if (window.modal !== undefined) {
            jQuery(window.modal).modal('hide');
        }
        return false;
    });

    // add the sticky behavior to the app bar, so the it be always visible to
    // the user in long screns
    if (jQuery('#app-navigation').size() === 1) {
        var stick_target = jQuery('#app-navigation'),
            // record the initial position of the nav bar for future comparisons
            initial_offset_top = stick_target.offset().top;
        var height = jQuery(stick_target).outerHeight(),
            width = jQuery(stick_target).outerWidth();
        jQuery(window).bind('scroll', function() {
            var is_sticky = stick_target.hasClass('stick-to-top'),
                scroll_top = jQuery(window).scrollTop();
            if (scroll_top >= initial_offset_top) {
                if (!is_sticky) {
                    stick_target.addClass('stick-to-top');
                    jQuery(jQuery('<div/>').addClass('scroll-placeholder')).css({
                        'height': height,
                        'width': width
                    }).insertBefore(stick_target);
                }
            } else {
                if (is_sticky) {
                    stick_target.removeClass('stick-to-top');
                    jQuery(stick_target).prev('.scroll-placeholder').remove();
                }
            }
        });
        // fire the scroll event as nav bar needs to setup manually on page load
        jQuery(window).scroll();
    }

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Forms+1.2#Forms12-Bulk-ActionToggler
    // Set observers on all the toggler checkbox
    jQuery('body').on('click change', '[type=checkbox], [type=button]', function(event) {
        toggler = jQuery(event.target).form().fields().filter('.bulkActionToggler');
        if (!jQuery.isEmptyObject(toggler)) {
            if (jQuery(event.target).is('[type=checkbox].bulkActionToggler')) {
                setTogglerObserver(event.target, jQuery(event.target).is(':checked'));
            } else if (jQuery(event.target).is('[type=button].bulkActionToggler')) {
                setTogglerObserver(event.target, 'checked');
            } else {
                setTogglerObserver(toggler, null);
            }
        }
    });

    // Often it is required to perform additional actions on certain events, apart from their default behaviour,
    // like, show/hide a section on the page, open a dialog, redirect to a new page etc.
    // The event can be selecting an selectbox/radio button option etc.
    // The code below aims to identify eligible elements and add observers to them.
    // The code doesn't address all the possible cases, it will evolve as we get new requirements.
    initAdditionalOperationObservers = (function() {
        function performAction(elt) {
            var elt = jQuery(elt),
                selected_elt = elt.find(':selected'),
                data_action = jQuery(selected_elt.attr('data-action')),
                data_method = selected_elt.attr('data-method') || 'display',
                // [display, dialog]
                prev_elt = elt.data('selected');
            // Undo the actions performed by the previous selected option, if any
            if (prev_elt !== undefined) {
                // breaking the single var pattern here
                var prev_data_action = jQuery(prev_elt.attr('data-action')),
                    prev_data_method = prev_elt.attr('data-method') || 'display';
                if (prev_data_method === 'dialog') {
                    // Though it should never come to this, as we only allow one dialog at a time, but just in case
                    prev_data_action.modal('hide');
                } else {
                    prev_data_action.hide();
                }
            }
            if (data_action.size() > 0) {
                if (data_method === 'dialog') {
                    // Close already open dialogs
                    if (window.modal !== undefined) {
                        jQuery(window.modal).modal('hide');
                    }
                    window.modal = data_action.modal();
                } else {
                    data_action.show();
                }
            }
            // Set current selected option to the element for future change evenets
            elt.data('selected', selected_elt);
        }
        // Identify all the elements that have additional action to be performed
        jQuery('select [data-action]').each(function() {
            var elt = jQuery(this).parent('select');
            elt.change(function(event) {
                performAction(elt);
            });
            // Perform the operations if a valid element is default selected on page load
            performAction(elt);
        });

        return function(elt) {
            jQuery(elt).find('select [data-action]').each(function() {
                var elt = jQuery(this).parent('select');
                elt.change(function(event) {
                    performAction(elt);
                });
                performAction(elt);
            });
        };
    }());

    // Here makeActive is a custom event to avoid looping in toggling and make active rows events.
    jQuery('body').on('change click makeActive', '.bulk-action-checkbox [type=checkbox]', function() {
        var elt = jQuery(this),
            cell = elt.closest('td'),
            row = elt.closest('tr'),
            dependant_count = (cell.attr('rowspan') !== undefined && cell.attr('rowspan') - 1 !== NaN) ? cell.attr('rowspan') - 1 : 0,
            targets = row.nextAll(':lt(' + dependant_count + ')').andSelf();
        if(elt.closest('th').size() === 0) {
        elt.is(':checked')? targets.addClass('active') : targets.removeClass('active') ;
        }
    });
    jQuery('body').on('click', 'tr', function(e) {
        var elt = jQuery(this),
            checkbox = elt.find('.bulk-action-checkbox [type=checkbox]:not(:disabled)');
        if(checkbox.size() > 0 && !jQuery(e.target).is('a, :input')) {
            checkbox.prop('checked', !checkbox.prop('checked'));
            checkbox.trigger('change');
        }
    });
    jQuery('body').on('click', '.progressbar-content', function(){
        jQuery(this).find('button[class="ui-datepicker-trigger"]').trigger('click');
    });
    jQuery('body').on('selectablestop', '.selectable', function(e) {
        var elt = jQuery(this);
        elt.find('td.ui-selected input[type=checkbox]').not(':checked').prop('checked', true);
        elt.find('td.ui-selectee').not('.ui-selected').children('input[type=checkbox]:checked').prop('checked', false);
    });

    jQuery('body').on('click', '.close-popover', function(){
        jQuery('.progress-badge').popover('toggle');
    });

    jQuery('body').on('keyup', '.multi-form',function(){
        var formData = jQuery('.multi-form').find('input:not(":hidden")').filter(function() {
            return $.trim(this.value).length !== 0;
        }).length > 0;
        if (formData) {
          jQuery(this).find('button[type="submit"]').removeClass('disabled');
        } else {
          jQuery(this).find('button[type="submit"]').addClass('disabled');
        }
    });

    function showSpinner(elt) {
        if(elt.attr('target') !== '_blank') {
            jQuery('<div/>').addClass('ui-widget-overlay').css({
                height: jQuery(document).height() + 'px',
                width: jQuery(document).width() + 'px',
                'z-index': '1002'
            }).appendTo('body');
            jQuery('<i/>').addClass('fa fa-spinner fa-spin fa-4x').css({
                position: 'fixed',
                top: '50%', // approximate position
                left: '50%', // approximate position
                'z-index': '1002'
            }).appendTo('body');
        }
    }

    // Display spinner when some from of the page is submitted (without ajax), to prevent any user action until the page reloads
    jQuery('body').on('submit', 'form', function(event) {
        if(!event.isDefaultPrevented()) {
            jQuery(':focus').blur();
            showSpinner(jQuery(this));
        }
    });

    // Display spinner to prevent any user action until the page reloads , when link is clicked which does not perform any ajax operation and not having any element id as value in href attribute
    jQuery('body').on('click', 'a', function(event) {
        var link_href = jQuery(this).attr('href');
        if(!(event.isDefaultPrevented()) && !(link_href === undefined || link_href === "" || link_href === 'javascript:void();' )) {
            if(link_href.indexOf('#') !== 0) {
                if (!(event.metaKey || event.ctrlKey || event.shiftKey)) {
                showSpinner(jQuery(this));
                }
            }
        }
    });

    jQuery('body').on('submit', 'form.splitForm', function(event) {
        var elt = jQuery(event.target),
            paramSource = elt.attr('data-paramSource') || '',
            parameters = jQuery(jQuery(paramSource).add(elt).serializeArray()),
            merged_form = null;
        // creating a form on the fly
        merged_form = jQuery('<form/>', {
            action: elt.attr('action'),
            method: elt.attr('method') || 'post',
            target: elt.attr('target') || ''
        });
        // adding fields from children forms to the new form created
        parameters.each(function(i, elt) {
            var elt = jQuery(elt);
            jQuery('<input/>', {
                type: 'hidden',
                name: elt.attr('name'),
                value: elt.attr('value')
            }).appendTo(merged_form);
        });
        // we need to add the new form to DOM to submit it,
        // so creating a dialog on the fly and then destroying it once the job's done
        jQuery(merged_form).modal().submit().modal('hide');
        return false;
    });

    //Define global variable to store last auto-completer request object (jqXHR).
    var LAST_AUTOCOMP_REF = null;
    initAutoCompleter = (function() {
        function setAutoCompleter(elt) {
            var elt = jQuery(elt),
                display_success_method = elt.attr('data-successMethod'),
                cache = {},
                param_source = elt.data('param-source'),
                url = elt.attr('data-action') + ((param_source !== undefined && jQuery(param_source) !== '') ? '&' + jQuery(param_source).serialize() : '');
            elt.autocomplete({
                source: function(request, response) {
                    var term = request.term;
                    if (term in cache) {
                        response(cache[term]);
                        LAST_AUTOCOMP_REF.abort();
                        return;
                    }
                    jQuery.ajax({
                        url: url,
                        data: elt.serializeArray(),
                        beforeSend: function (jqXHR, settings) {
                            //If LAST_AUTOCOMP_REF is not null means an existing ajax auto-completer request is in progress, so need to abort them to prevent inconsistent behavior of autocompleter
                            if (LAST_AUTOCOMP_REF != null && LAST_AUTOCOMP_REF.readyState != 4) {
                                var oldRef = LAST_AUTOCOMP_REF;
                                oldRef.abort();
                                //Here we are aborting the LAST_AUTOCOMP_REF so need to call the response method so that auto-completer pending request count handle in proper way
                                response( [] );
                            }
                            LAST_AUTOCOMP_REF = jqXHR;
                        },
                        success: function(data) {
                            var suggestions = [],
                                ul = jQuery('<div/>').html(data).children('ul');
                            if (ul.size() != 0) {
                                var li = jQuery('<div/>').html(data).children('ul').find('li');
                                
                                jQuery(li).each(function(i, e) {
                                    suggestions.push({
                                        'id': jQuery(e).attr('id'),
                                        'label': jQuery(e).attr('title'),
                                        'value': jQuery(e).text(),
                                        'term': term,
                                        'hasClass': jQuery(e).hasClass('add-new-suggestion')
                                    });
                                });
                                response(suggestions);
                                cache[term] = suggestions;
                            } else {
                                response();
                                jQuery(display_success_method).html(data);
                                rebindContainer(display_success_method);
                            }
                        }
                    });
                }
            }).data("autocomplete")._renderItem = function(ul, item) {
                var listItem, fieldName=elt.data('field-name');
                if (item.hasClass) {
                    listItem = jQuery("<li></li>")
                            .data("item.autocomplete", item)
                            .append('<a href="" class="link" data-ajax-update="'+display_success_method+'" data-update-url="'+elt.data('add-new-suggestions-url')+'" data-param-source=".'+elt.data('param-source')+'">'+item.label+': "'+item.term+'"</a><input class="'+elt.data('param-source')+'" type="hidden" id="'+fieldName+'" name="'+fieldName+'" value="'+item.term+'"/>')
                            .appendTo(ul);
                } else {
                    listItem = jQuery("<li></li>")
                            .data("item.autocomplete", item)
                            .append('<a>' + item.label + '</a>')
                            .appendTo(ul);
                }
                return listItem;
            };
        }
        jQuery('.autoCompleter').each(function(i, elt) {
            setAutoCompleter(elt);
        });
        return function(elt) {
            jQuery(elt).find('.autoCompleter').each(function() {
                setAutoCompleter(this);
            });
        }
    }());

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Javascript#Javascript-Pop-Over
    /* Use data-tooltip-content attribute for show text contents and data-tooltip-target attribute to show html contents */
    jQuery('body').on('mouseenter', '[data-tooltip-content], [data-tooltip-target]', function() {
        var scroll_offset = scrollOffset(jQuery(this)),
            window_height = jQuery(window).height(),
            window_width = jQuery(window).width(),
            direction_of_tooltip = (window_width > window_height) ? 'left-or-right' : 'top-or-bottom';
        if (jQuery(this).data('bs.popover') === undefined) {
            jQuery(this).popover({
                container : 'body',
                html : 'true',
                trigger: 'manual',
                title: jQuery(this).data('tooltip-title') || 'Information',
                content: jQuery(jQuery(this).data('tooltip-target')).html() || jQuery(this).data('tooltip-content')
            });
        }

        // fail safe code for cases when the tooltip is too close to the boundary of the viewport
        // change the direction of the tooltip in such cases
        jQuery(this).popover('show');
        if (direction_of_tooltip === 'left-or-right') {
            var half_tooltip_height = jQuery(this).data('bs.popover').$tip.height() / 2;
            if (scroll_offset.top < half_tooltip_height || (window_height - scroll_offset.top) < half_tooltip_height) {
                direction_of_tooltip = 'top-or-bottom';
            }
        } else {
            var half_tooltip_width = jQuery(this).data('bs.popover').$tip.width() / 2;
            if (scroll_offset.left < half_tooltip_width || (window_width - scroll_offset.left) < half_tooltip_width) {
                direction_of_tooltip = 'left-or-right';
            }
        }

        if (direction_of_tooltip === 'left-or-right') {
            if (scroll_offset.left > (window_width / 2)) {
                jQuery(this).data('bs.popover').options.placement = 'left'
            } else {
                jQuery(this).data('bs.popover').options.placement = 'right'
            }
        } else {
            if (scroll_offset.top > (window_height / 2)) {
                jQuery(this).data('bs.popover').options.placement = 'top'
            } else {
                jQuery(this).data('bs.popover').options.placement = 'bottom'
            }
        }
        jQuery(this).popover('show');
    });
    jQuery('body').on('mouseleave', '[data-tooltip-content], [data-tooltip-target]', function() {
        if (jQuery(this).data('bs.popover') !== undefined) {
            jQuery(this).popover('hide');
        }
    });

    jQuery('body').on('change', ':input', function(e) {
      if (jQuery(this).attr('data-smart-change') === undefined) {
        var form = jQuery(this).form();
        if (form.hasClass('js-change-submit')) {
            form.trigger('submit', e);
        }
      }
    });
    // js code for appending prefix on order id.
    jQuery('body').on('keyup', '[data-prefix-id]', function(e) {
        var elt = jQuery(this);
        jQuery(elt.data('show-example')).text(elt.val().concat(elt.data('prefix-id')));
    });
    // js code for appending sufix.
    jQuery('body').on('keyup', '[data-sufix-id]', function(e) {
        var elt = jQuery(this);
        jQuery(elt.data('show-example')).text(elt.data('sufix-id').concat(elt.val()));
    });
    jQuery('body').on('click', '.static-popover', function(e) {
        rebindContainer(jQuery(e.target));
    });
    jQuery('body').on('smart-change', ':input', function(e) {
        var form = jQuery(this).form();
        if (form.hasClass('js-change-submit')) {
            form.trigger('submit', e);
        }
    });
    jQuery('.js-ajax-chosen').each(function(i, elt) {
        iniChosen(elt);
    });
    // Here this is custom requirement to update the chosen list because when chosen is enabled disabled we need to update the chosen.
    jQuery('body').on('click', '[data-chosen-update-field]', function(e) {
        var dep_elt = jQuery(this).data('chosen-update-field');
        jQuery(dep_elt).trigger("liszt:updated");
    });
    
    jQuery('body').on('change', '[data-add-new-rows]', function(e) {
     if (jQuery(this).find('input:text').filter(function () {
            return $.trim(this.value) != ""
        }).length) {
             jQuery(this).find('.row-submit').each( function(i, e) {
                 jQuery(e).attr('value', 'Y');
             });
             jQuery(this).find('input:text.bulk-required').each( function(i, e) {
                 jQuery(e).addClass("required");
             });
     } else {
         jQuery(this).find('.row-submit').each( function(i, e) {
             jQuery(e).attr('value', '');
        });
     }
        var row = jQuery(this).closest('.add-row'),
            addNewRows = jQuery(row).data('add-new-rows') != undefined ? jQuery(row).data('add-new-rows') :3;
        if (jQuery(row).is(':last-child')) {
            for (var i=0;i < addNewRows;i++) {
                appendNewRow(row);
            }
         }
    });

    jQuery('body').on('click', 'table.tablesorter th', function(e) {
        var elt = jQuery(this),
            child_elt = elt.children(".tablesorter-header-inner");
        if (elt.hasClass("tablesorter-headerAsc")) {
            child_elt.find("i.fa").replaceWith(' <i class="fa fa-lg fa-caret-down"></i>');
        } else {
            child_elt.find("i.fa").replaceWith(' <i class="fa fa-lg fa-caret-up"></i>');
        }
    });
    //jQuery('body').niceScroll({cursorwidth: "12px", cursoropacitymin: 0.2, cursorborderradius: 0});

    // Perform activities, on the whole document, that can't be done using delegated observers
    rebindContainer();
});

function initStaticPopover(elt) {
    jQuery(elt).find('.static-popover').each( function() {
        jQuery(this).popover();
    });
}

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
function initTablesorter(elt) {
    jQuery(elt).find('table.tablesorter').each( function() {
        jQuery(this).tablesorter();
    });
}

function tagsManager(elt) {
    jQuery(elt).tagsManager({
        delimiters : [9,13,44,32],
        prefilled : jQuery(elt).data('prefilled'),
        tagsContainer : jQuery(elt).data('tag-container') ? jQuery(elt).data('tag-container') : null,
        output : jQuery(elt).data('output-element') ? jQuery(elt).data('output-element') : null,
        validator : function() {
            if(jQuery(elt).is(':visible') && jQuery(elt).valid() == '0') {
                return false;
            }
            return true;
        }
    });
    jQuery(elt).on('focusout', function(e) {
        var input_elt = jQuery(this),
            val = input_elt.val();
        input_elt.tagsManager('pushTag', val);
    });
}

function scrollOffset(elt) {
    var valueT = 0,
        valueL = 0,
        element = jQuery(elt).get(0);
    if (element !== undefined) {
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            // Safari fix
            if (element.offsetParent == document.body && jQuery(element).css('position') == 'absolute') {
                break;
            }
        } while (element = element.offsetParent);

        element = jQuery(elt).get(0);
        do {
            if (!window.opera || element.tagName == 'BODY') {
                valueT -= element.scrollTop || 0;
                valueL -= element.scrollLeft || 0;
            }
        } while (element = element.parentNode);

        return {
            left: valueL,
            top: valueT
        };
    }
}

//https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Tables+1.2#Tables12-DataTable
function dataTable(elt) {
    jQuery(elt).find('.js-datatable').each(function() {
        jQuery(this).dataTable({
            bPaginate: false,
            bLengthChange: false,
            bFilter: true,
            bSort: true,
            bInfo: false,
            bAutoWidth: false
        });
    });
}

rangeSlider = function(elt) {
    var min = jQuery(elt).data('range-min'),
        max = jQuery(elt).data('range-max'),
        rangelow = jQuery(elt).data('range-low'),
        rangehigh = jQuery(elt).data('range-high'),
        sliderField = jQuery(elt).data('sliderid'),
        sliderField1 = jQuery(elt).data('sliderid1');
    jQuery(elt).slider({
        range: true,
        min: min,
        max: max,
        values: [rangelow, rangehigh],
        slide: function(event, ui) {
            $(sliderField).val(ui.values[0]);
            $(sliderField1).val(ui.values[1]);
        }
    });
}

//https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Components#Components-RatingStar
function prodRatingStar(elt) {
    if (jQuery('.prodRatingStar').length > 0) {
        jQuery('.prodRatingStar').rating({
            requireCancel: false
        });
    }
}
function iniChosen(elt) {
    if(jQuery(elt).hasClass('js-ajax-chosen')) {
        jQuery(elt).ajaxChosen({
            type: 'POST',
            url: jQuery(elt).data('action')
        }, function(data) {
            var results = [],
                parsed_html = jQuery.parseHTML(data),
                li = jQuery('<div/>').html(parsed_html).find('li');
            jQuery(li).each(function() {
                results.push({
                    value: jQuery(this).text(),
                    text: jQuery(this).attr('title')?jQuery(this).attr('title'):jQuery(this).text()
                });
            });
            return results;
        }, {width: '100%'});
    } else {
        jQuery(elt).chosen({width:"100%"});
    }
}

function setTogglerObserver(toggler, status) {
    var toggler = jQuery(toggler),
        dependant_form_selector = toggler.attr('data-dependantForms'),
        dependant_forms = (dependant_form_selector) ? jQuery(dependant_form_selector) : jQuery(toggler).closest('form'),
        dependant_elt_selector = (toggler.attr('name')) ? '[name=' + toggler.attr('name') + ']' : '',
        form_fields = jQuery(dependant_forms).fields(),
        child_checkboxes = form_fields.filter(dependant_elt_selector + ':checkbox:not(.bulkActionToggler):not(:disabled)'),
        row_submit_checkboxes = jQuery(child_checkboxes).filter('[data-bulk-checkbox]'),
        any_checked = false;

    if (status != null) {
        jQuery(child_checkboxes).attr('checked', function() {
            return status;
        }).trigger('makeActive');
    } else {
        // Below code is for checking or unchecking the toggler if all its dependent checkbox is checked.
        if (child_checkboxes.size() > 0) {
            var all_checked = true;
            child_checkboxes.each(function() {
                if (all_checked) {
                    all_checked = all_checked && jQuery(this).is(':checked');
                }
            });
            if (all_checked) {
                toggler.attr('checked', 'checked');
            } else {
                toggler.removeAttr("checked");
            }
        }
    }
    // Below code is for enabling or disabling the action buttons if any of its dependent checkbox is checked.
    var form_buttons = jQuery(form_fields).filter('button, [type=submit]').not('.bulkActionToggler');
    if (child_checkboxes.size() > 0) {
        if (row_submit_checkboxes.size() > 0) {
    
            jQuery(row_submit_checkboxes).each(function() {
                any_checked = any_checked || jQuery(this).is(':checked');
            });
    
            if (any_checked) {
                form_buttons.removeAttr('disabled');
                jQuery('.bulkActionToolTip').hide();
            } else {
                form_buttons.attr('disabled', 'disabled');
                jQuery('.bulkActionToolTip').show();
            }
        }
    } else {
        form_buttons.attr('disabled', 'disabled');
        toggler.attr('disabled', 'disabled');
    }
}

function rebindContainer(elt) {
    if (elt === undefined) {
        elt = jQuery('body');
    } else if (jQuery(elt).hasClass('static-popover')) {
        var popover_elt = jQuery(elt).next('div.popover');
        elt = jQuery(popover_elt).find("div.popover-content");
    }

  //This will be used for code editor

    function completeAfter(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.ftl);
        return CodeMirror.Pass;
      }
      function completeIfAfterLt(cm) {
        return completeAfter(cm, function() {
          var cur = cm.getCursor();
          return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "#";
        });
      }

    jQuery(elt).find('.code-editor').each(function(index) {
      jQuery(this).attr('id', 'code-' + index);
      CodeMirror.fromTextArea(document.getElementById('code-' + index), {
        mode: "ftl",
        styleActiveLine: true,
        lineNumbers: true,
        extraKeys:{
        "Ctrl-Space" : "autocomplete",
        "Shift-Ctrl-Space" : function(cm) {CodeMirror.showHint(cm, CodeMirror.hint.ftl);},
        "'#'" : completeAfter,
        "'/'" : completeIfAfterLt
        }
        });
    });

    // This will be used for enterprise search
    jQuery('[data-close-search]').click(function(){
        jQuery(jQuery(this).data('close-search')).children().slideUp(500);
    })

    //jQuery('body').getNiceScroll().resize();
    initStaticPopover(elt);
    initTablesorter(elt);
    jQuery(elt).find('.js-tabs').tabs();
    jQuery(elt).find('.js-buttonset').buttonset();
    jQuery(elt).find('[data-toggle-display]:checkbox, [data-toggle-display]:radio:checked, [data-toggle-hide]:radio:checked').change();
    jQuery(elt).find(".js-range-slider").each(function() {
        rangeSlider(jQuery(this));
    });
    $('#customer_card_number').creditCardTypeDetector({ 'credit_card_logos' : '.card_logos' });
    // Can not apply fixed header plugin to all the tables, as there are two variations.
    // For now, we only support the variation that is applicable on full page tables.
    jQuery(elt).find('.table-sticky').fixedHeader({topOffset:0});
    jQuery(elt).find('.table-fixed').each(function() {
        var height = jQuery(this).outerHeight(),
            fixed_height = jQuery(this).data('fixed-height');
        if(height > fixed_height) {
            jQuery(this).fixedHeaderTable({height: fixed_height});
            jQuery(this).parent().css({'overflow-y':'auto'});
        }
    });
    jQuery(elt).find('[data-smart-change]').each(function() {
        jQuery(this).autocomplete({
            minLength: 0,
            delay:600,
            search: function(e, o) {
                jQuery(e.target).trigger('smart-change');
                return false;
            }
        });
    });
    jQuery('.show-less').readmore(({
        speed: 75,
        maxHeight: 50
    }));

    jQuery(elt).find('[data-spy]').each(function() {
        jQuery(this).affix({
            offset: {
            top: jQuery(this).data('offset-top'),
            bottom: function () {
                return (this.bottom = $('.bs-footer').outerHeight(true))
                }
            }
        });
    });

    jQuery(elt).find('.switch-button').each(function() {
        jQuery(this).bootstrapSwitch();
    });
    
    // Tab Creation Code
    var tabs_parent = jQuery(elt).find('.tabs-sm');
    if (tabs_parent.size() > 0 && jQuery(window).width() < 992 && jQuery(window).width() >= 768) {
        tabs_parent.each(function() {
            createTabs(jQuery(this));
        });
    }

    // Affix code
    var affix_container = jQuery(elt).find('.sticky-container');
    if (affix_container.size() > 0 && jQuery(window).width() >= 768) {
        affix_container.each(function() {
            if (!jQuery(this).hasClass('initialized')) {
                createAffix(jQuery(this));
            }
        });
    }

    jQuery(elt).find('.carousel').each(function() {
        jQuery(this).carouFredSel({
            circular: false,
            infinite: false,
            auto: false,
            prev: jQuery(this).data('carousel-prev'),
            next: jQuery(this).data('carousel-next'),
            pagination: jQuery(this).data('carousel-pag')
        });
    });
    jQuery('.date-picker').datepicker({
        showOn: 'button',
        buttonText: '',
        dateFormat: 'yy-mm-dd ',
        minDate: 0
    });
    jQuery('body').find('[data-status-complete]').each(function(){
        var badge_width = jQuery(this).parents('.progress.status').siblings('.badge').width();
            status = jQuery(this).data('status-complete'),
            marginLeft = '0px';
        jQuery(this).css({width:status+'%'});
        if (status !== '0') {
            marginLeft = '-'+badge_width+'px';
        }
        jQuery(this).parents('.progress').siblings('.progress-badge').css({left : status+'%', marginLeft: marginLeft});
    });
    jQuery('body').on('click change', '.search-field input', function(){
        var chosen_ele = jQuery(this).parents('div.form-group').find('.js-chosen, .js-ajax-chosen');
        if (chosen_ele.data('add-suggestion-url') !== undefined) {
            Chosen.prototype.no_results = function(terms) {
                var ajaxUpdate = jQuery(chosen_ele).attr('data-sucessMethod'),
                    updateUrl = jQuery(chosen_ele).data('add-suggestion-url'),
                    fieldName = jQuery(chosen_ele).data('field-name'),
                    fieldLabel = jQuery(chosen_ele).data('label'),
                    paramSource = jQuery(chosen_ele).attr('data-paramSource'),
                    no_results_html;
                    no_results_html = $('<li class="no-results">' + this.results_none_found+'</li>');
                    jQuery('<li class="no-results"></li>')
                            .append('<a href="" class="link" data-ajax-update="'+ajaxUpdate+'" data-update-url="'+updateUrl+'" data-param-source=".'+paramSource+'">Add '+fieldLabel+': '+terms+'</a><input class="'+paramSource+'" type="hidden" name="'+fieldName+'" value="'+terms+'"/>')
                            .appendTo(no_results_html);
                return this.search_results.append(no_results_html);
            };
        }
    });
    
    jQuery('.selectable').each(function(){
        jQuery(this).on("mousedown", function(e) {
            e.metaKey = true;
        }).selectable({filter: ".selectable-item"});
    });
    jQuery('.selectable').on('selectableselecting', function(e, ui) {
        if (jQuery(ui.selecting).hasClass('selectedElement')) {
            jQuery(ui.selecting).removeClass('ui-selecting');
            jQuery(ui.selecting).removeClass('selectedElement');
        }
    });
    jQuery('.selectable').on('selectableselected', function(e, ui) {
        jQuery(ui.selected).addClass('selectedElement');
    });
    jQuery('.selectable').on('selectableunselected', function(e, ui) {
        jQuery(ui.unselected).removeClass('selectedElement')
    });

    // This is not supposed to be used by just any kind of select box, but only the ones on change of whose certain actions are performed
    jQuery(elt).find('select.js-action-dropdown').each(function() {
        // this code can be shifted to a separate function when it will be used by multiple functions
        var selectbox = jQuery(this),
            children = selectbox.children().filter(function(){ return $(this).css('display') != 'none';}),
            handle = jQuery('<a/>').addClass('btn dropdown-toggle navbar-btn btn-default').attr('data-toggle', 'dropdown').attr('href', '#'),
            menu = jQuery('<ul/>').addClass('dropdown-menu'),
            dropdown = jQuery('<div/>').addClass('btn-group');
        // assuming that the first option will be of nature '<Action(Verb)> <Object(Noun)>', for example: Choose Country, Assign Picker etc.
        jQuery(handle).html(children.html().concat('&nbsp;')).append(jQuery('<i/>').addClass('caret'));
        jQuery(children).each(function(i) {
            var child = jQuery(this);
            if(i > 0) {
                var menu_item = jQuery('<a/>').attr('href', 'javascript:void();').html(child.html());
                menu_item.on('click', function(e) {
                    selectbox.val(child.attr('value')).trigger('change');
                });
                menu.append(jQuery('<li/>').append(menu_item));
            }
        });
        jQuery(dropdown).append(handle).append(menu);
        dropdown.insertAfter(selectbox);
        selectbox.hide();
    });

    jQuery(elt).find('[data-lat][data-lng]').each(function() {
        var icon = new google.maps.MarkerImage("/uif/img/marker.png");
        map = new google.maps.Map(this, {
            center: new google.maps.LatLng(jQuery(this).data('lat'), jQuery(this).data('lng')),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            mapTypeControl: true,
            panControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            },
            zoomControl: true
        });
        marker = new google.maps.Marker({draggable: true, icon: icon, map: map, position: map.getCenter()});
        google.maps.event.addListener(marker, 'dragend',function() {
            var latitude = this.getPosition().lat();
            var longitude = this.getPosition().lng();
            jQuery(function() {
                jQuery("#latitude").val(latitude);
                jQuery("#longitude").val(longitude);
            });
        });
    });

    //https://confluence.hotwaxmedia.com/display/ETAILSNDBX/Forms+1.2#Forms12-DependentSelect
    jQuery(elt).find('[data-dependent]').each(function() {
        var parent_elt = jQuery(this),
            child_elt = jQuery(parent_elt.data('dependent'));
        parent_elt.data('child-clone', child_elt.clone());
        jQuery('body').on('change', '[data-dependent]', function() {
            var parent_elt = jQuery(this),
                child_elt = jQuery(parent_elt.data('dependent')),
                child_clone = parent_elt.data('child-clone'),
                selected_title = jQuery(parent_elt).find(':selected').attr('title');
            jQuery(child_elt).empty();
            child_clone.children().each(function() {
                if (jQuery(this).attr('value') === '') {
                    jQuery(child_elt).append(jQuery(this).clone());
                }
                if (selected_title !== '' && (jQuery(this).attr('label') === selected_title || jQuery(this).hasClass(selected_title))) {
                    jQuery(child_elt).append(jQuery(this).clone());
                }
            });
        });
        jQuery(this).change();
    });

    //TODO: This code can be merged to data-dependent code.
    jQuery(elt).find('[data-show-dependent]').each(function() {
        jQuery('body').on('keyup change', '[data-show-dependent]', function() {
            var parent_elt = jQuery(this),
                child_elt = jQuery(parent_elt.data('show-dependent')),
                parent_value = jQuery(parent_elt).val(),
                valid = false,
                validator = jQuery(parent_elt).form().data('validator');
                if (validator !== undefined && parent_value !== '') {
                    valid = validator.check(this);
                } else if(parent_value !== ''){
                    valid = true;
                }
                if(valid){
                    jQuery(child_elt).removeAttr('disabled');
                    jQuery(child_elt).show();
                } else {
                    jQuery(child_elt).attr('disabled', 'disabled');
                    jQuery(child_elt).hide();
                }
            });
        jQuery(this).change();
    });

    jQuery(elt).find('.js-plot-chart').each(function() {
        var parent_elt = jQuery(this),
            chart_id = parent_elt.attr('chart-id'),
            chart_type = parent_elt.attr('chart-type'),
            chart_color = parent_elt.attr('chart-color'),
            chart_x_label = parent_elt.attr('chart-x-label'),
            chart_y_label = parent_elt.attr('chart-y-label'),
            legend_holder = parent_elt.attr('legend-holder'),
            numbering_x_axis = parent_elt.attr('numbering-x-axis'),
            bar_data_array = [],
            data_array = [],
            previous_point = null,
            options,
            ticks_value = (numbering_x_axis == 'Y')?1:[];
        parent_elt.hide();
        if (chart_type === 'line') {
            parent_elt.find('dl').each(function () {
                var child_elt = jQuery(this),
                    chart_label = child_elt.attr('chart-label'),
                    line_data_array = [],
                    line_map = {};
                child_elt.find('dd').each(function (){
                    var sub_child_elt = jQuery(this),
                        line_key = sub_child_elt.attr('line-key'),
                        chart_value = sub_child_elt.text();
                        line_array = [];
                    filtered_value = chart_value.replace(/[,$]/g, '');
                    line_array.push(line_key);
                    line_array.push(filtered_value);
                    line_data_array.push(line_array);
                    jQuery(chart_id).data('<b>' + chart_label + '</b></br>' + line_key, chart_value);
                });
                line_map["label"] = chart_label;
                line_map["data"] = line_data_array;
                data_array.push(line_map);
            });
        } else {
            parent_elt.find('dd').each(function () {
                var child_elt = jQuery(this),
                    chart_value = child_elt.text();
                filtered_value = chart_value.replace(/[,$]/g, '');
                if (chart_type === 'bars') {
                    var bar_key = child_elt.attr('bar-key'),
                        bar_array = [];
                    bar_array.push(bar_key);
                    bar_array.push(filtered_value);
                    bar_data_array.push(bar_array);
                    jQuery(chart_id).data(bar_key, chart_value);
                }
                if (chart_type === 'pie') {
                    var pie_label = child_elt.attr('pie-label'),
                        pie_map = {};
                    pie_map["label"] = pie_label;
                    pie_map["data"] = chart_value;
                    data_array.push(pie_map);
                }
            });
        }
        if (chart_type === 'bars') {
            data_array.push(bar_data_array);
            options = {
                series: {
                    bars: {show: true, barWidth: 0.6, align: "center", fill: true, fillColor: {colors: [{ opacity: 0.8 }, { opacity: 0.1 }]}},
                    color: chart_color
                },
                colors: ["#298A08"],
                grid: {
                    hoverable: true,
                },
                xaxis: {
                    mode: "categories",
                    categories: [0],
                    tickLength: 0,
                    ticks: ticks_value,
                    tickSize: 1,
                    tickDecimals: 0
                }
            };
        } else if (chart_type === 'pie') {
            options = {
                series: {
                    pie: {show: true, radius: 3/4}
                },
                grid: {
                    hoverable: true
                },
                legend: {
                    show: true,
                    noColumns: 3,
                    container: legend_holder
                },
                tooltip: true,
                tooltipOpts: {
                    content: addContent(chart_x_label, chart_y_label),
                    shifts: {
                        x: 10,
                        y: 10
                    },
                    defaultTheme: false
                }
            };
        } else if (chart_type === 'line') {
            options = {
                series: {
                    lines: {show: true},
                    points: {show: true}
                },
                grid: {
                    show: true,
                    hoverable: true,
                    mouseActiveRadius: 2,
                    },
                legend: {
                    show: true,
                    noColumns: 3,
                    container: legend_holder
                },
                xaxis: {
                    mode: 'categories',
                    categories: [0],
                    ticks: 1,
                    tickSize: 1,
                    tickDecimals: 0
                }
            }
        }
        // Here function showTooltip is called for bar charts only.
        jQuery(chart_id).bind('plothover', function (event, pos, item) {
            if (item) {
                if (previous_point != item.dataIndex) {
                    previous_point = item.dataIndex;
                    jQuery('#tooltip').remove();
                    var x = item.datapoint[0],
                        category_label = item.series.label?'<b>' + item.series.label + '</b></br>':'',
                        y = jQuery(chart_id).data(category_label + item.series.data[item.dataIndex][0]);
                    if (chart_x_label === undefined && chart_y_label === undefined) {
                        showTooltip(item.pageX, item.pageY, category_label + item.series.data[item.dataIndex][0] + '</br><b>' + y +'</b>');
                    } else if (chart_x_label === undefined) {
                        showTooltip(item.pageX, item.pageY, category_label + item.series.data[item.dataIndex][0] + '</br>' + chart_y_label + ': <b>' + y +'</b>');
                    } else if (chart_y_label === undefined) {
                        showTooltip(item.pageX, item.pageY, category_label + chart_x_label + ': ' + item.series.data[item.dataIndex][0] + '</br><b>' + y +'</b>');
                    } else {
                        showTooltip(item.pageX, item.pageY, category_label + chart_x_label + ': ' + item.series.data[item.dataIndex][0] + '</br>' + chart_y_label + ': <b>' + y + '</b>');
                    }
                }
            } else {
                jQuery('#tooltip').remove();
                previous_point = null;
            }
        });
        jQuery.plot(chart_id, data_array, options);
    });
    
    jQuery(elt).find('.date-time-picker').each(function() {
        var form_elt = jQuery(this);
        var id = form_elt.attr('id');
        var value = form_elt.attr('value');
        var shortDateInput = jQuery(this).data('short-date-input');
        var minDate = jQuery(this).data('min-date');
        
        if (Date.CultureInfo != undefined) {
            var initDate = "";
            if(value != "" || value != undefined)
                initDate = jQuery('#' +id+'_i18n').val();
            if (initDate != "") {
                var dateFormat = Date.CultureInfo.formatPatterns.shortDate;
                if (shortDateInput != undefined && !shortDateInput)
                    dateFormat = dateFormat+ " " + Date.CultureInfo.formatPatterns.longTime;
                if (initDate.indexOf('.') != -1) {
                    initDate = initDate.substring(0, initDate.indexOf('.'));
                }
                var dateObj = Date.parse(initDate);
                var formatedObj = dateObj.toString(dateFormat);
                jQuery('#' +id+'_i18n').val(formatedObj);
            }

            jQuery(this).change(function() {
                var ofbizTime = "yyyy-MM-dd HH:mm:ss";
                if (shortDateInput != undefined && shortDateInput)
                    ofbizTime = "yyyy-MM-dd";
                var newValue = "";
                if (this.value != "") {
                    var dateObj = Date.parse(this.value, ofbizTime);
                    var dateFormat = Date.CultureInfo.formatPatterns.shortDate;
                    if (shortDateInput != undefined && !shortDateInput)
                        dateFormat = dateFormat+ " " + Date.CultureInfo.formatPatterns.longTime;
                    newValue = dateObj.toString(dateFormat);
                }
                jQuery('#' +id+'_i18n').val(newValue);
            });
            jQuery('#' +id+'_i18n').change(function() {
                var dateFormat = Date.CultureInfo.formatPatterns.shortDate;
                if (shortDateInput != undefined && !shortDateInput)
                    dateFormat = dateFormat+ " " + Date.CultureInfo.formatPatterns.longTime
                var newValue = ""
                if (this.value != "") {
                    var dateObj = Date.parse(this.value, dateFormat);
                    var ofbizTime = "yyyy-MM-dd HH:mm:ss";
                    if (shortDateInput != undefined && shortDateInput)
                        ofbizTime = "yyyy-MM-dd";
                    newValue = dateObj.toString(ofbizTime);
                }
                jQuery(this).val(newValue);
            });
        } else {
            jQuery(this).change(function() {
                jQuery('#' +id+'_i18n').val(this.value);
            });
            jQuery('#' +id+'_i18n').change(function() {
                jQuery(this).val(this.value);
            });
        }

        if (shortDateInput != undefined && shortDateInput) {
            jQuery(this).datepicker({
                showOn: 'button',
                buttonImage: '',
                buttonText: '',
                buttonImageOnly: false,
                dateFormat: 'yy-mm-dd'
            });
        } else {
            jQuery(this).datetimepicker({
                showSecond: true,
                timeFormat: 'hh:mm:ss',
                stepHour: 1,
                stepMinute: 1,
                stepSecond: 1,
                showOn: 'button',
                buttonImage: '',
                buttonText: '',
                buttonImageOnly: false,
                dateFormat: 'yy-mm-dd',
                minDate: minDate
            });
        }
    });
    // Lazy load code
    jQuery('a.lazy-load').on('load',function(e) {
        e.preventDefault();
        var ele = jQuery(e.target),
            url = ele.attr('href'),
            id = ele.attr('name');
        // Remove lazy-load class as load event was triggering multiple times 
        jQuery(ele).removeClass('lazy-load');
        jQuery.ajax({
            url: url,
            beforeSend: function(jqXHR, settings) {
                jqXHR.setRequestHeader('Is-Lazy-Load', 'Y');
            }
        }).done(function(data){
            jQuery(ele.parents("#"+id)).replaceWith(data);
            rebindContainer(jQuery('#' +id));
        });
        
    });
    jQuery('.lazy-load').trigger('load');

    elRTE.prototype.options.panels.style1 = ['bold'];
    elRTE.prototype.options.toolbars.basic = ['style1', 'lists', 'indent', 'alignment'];
    
    jQuery(elt).find('.js-wysiwyg').elrte({
        height: 150,
        styleWithCSS: false,
        toolbar: 'basic'
    });
    jQuery(elt).find('.js-wysiwyg-save').on ('click', function (e) {
      var button = jQuery (e.target), form = button.parents('form').first(), selector = form.find(".js-wysiwyg").first();
      if (!jQuery(selector).elrte('source').is(':visible')) {
        jQuery(selector).elrte('updateSource');
      }
    });

    initValidations(elt);
    initAjaxObservers(elt);
    initAdditionalOperationObservers(elt);
    dataTable(elt);
    prodRatingStar(elt);
    initScrollPagination(elt);
    initAutoCompleter(elt);
    jQuery('.bulkActionToggler').each(function(i, elt) {
        setTogglerObserver(elt, null);
    });
    jQuery(elt).find('form > fieldset > div .required:input').each(function() {
        if (!(jQuery(this).next('span.checkRequired').size() > 0)) {
            jQuery(this).after('* <span class="tooltip checkRequired">Required</span>');
        }
    });
    jQuery(elt).find('form div.form-group .required:input').each(function() {
        if (!jQuery(this).closest('div.form-group').find('span.asterisk').size() > 0) {
            jQuery(this).closest('div.form-group > div').children('label').append('<span class="asterisk"> *</span>');
        }
        if (!jQuery(this).is(':checkbox')) {
            jQuery(this).closest('div.form-group div').each(function() {
                if (!jQuery(this).find('span.asterisk').size() > 0) {
                    jQuery(this).children('label').append('<span class="asterisk"> *</span>');
                }
            });
        }
        if (!jQuery(this).closest('div.form-group').find('label').find('span.asterisk').size() > 0) {
            jQuery(this).closest('div.form-group').children('label').append('<span class="asterisk"> *</span>');
        }
    });
    // This is a hack. Lets think of better fix.
    if (jQuery('body').is(elt)) {
        jQuery(window).load(function() {
            jQuery(elt).find('.thumbnail').closest('.row').each(function() {
                jQuery(this).find('.description').equalHeights();
                jQuery(this).find('.thumbnail > .image').equalHeights();
                jQuery(this).find('.thumbnail .caption').equalHeights();
                jQuery(this).find('.thumbnail').equalHeights();
            });
        });
    } else {
        jQuery(elt).find('.thumbnail').closest('.row').each(function() {
            jQuery(this).find('.description').equalHeights();
            jQuery(this).find('.thumbnail > .image').equalHeights();
            jQuery(this).find('.thumbnail .caption').equalHeights();
            jQuery(this).find('.thumbnail').equalHeights();
        });
    }
    jQuery(elt).find('.info-tiles').each(function() {
        jQuery(this).children('li').equalHeights();
    });
    jQuery(elt).find('input.js-tag-input').each(function() {
        tagsManager(jQuery(this));
    });
    jQuery(elt).find('.js-ajax-chosen, .js-chosen').each(function(i, elt) {
        iniChosen(elt);
    });
    jQuery('ul.js-selectable-thumbnail').selectable({
        filter: jQuery('ul.js-selectable-thumbnail').children(),
        cancel: 'input:not(.selectable-radio), textarea, button, select, option, a',
        create: function(event, ui) {
            var ul_elt = jQuery(event.target);
            if (ul_elt.find('.ui-selectee fieldset')) {
                ul_elt.find('.ui-selectee:not(:first-child) fieldset').attr('disabled','disabled');
                ul_elt.find('.ui-selectee:not(:first-child) fieldset').addClass('text-muted');
            } else {
            ul_elt.find('.ui-selectee:not(:first-child) input').attr('disabled','disabled');
            }
            ul_elt.find('.ui-selectee:first-child').addClass('ui-selected');
        },
        selected: function(event, ui) {
            var ul_elt = jQuery(event.target);
            if (ul_elt.find('.ui-selectee fieldset')) {
                ul_elt.find('.ui-selectee fieldset').attr('disabled','disabled');
                ul_elt.find('.ui-selectee fieldset').addClass('text-muted');
                ul_elt.find('.ui-selected fieldset').removeAttr('disabled');
                ul_elt.find('.ui-selected fieldset').removeClass('text-muted');
            } else {
            ul_elt.find('.ui-selectee input').attr('disabled','disabled');
            ul_elt.find('.ui-selected input').removeAttr('disabled');
            }
            ul_elt.find('.ui-selected .selectable-radio:first-child').attr('checked', 'checked');
        }
    });
 // This variation is also applicable to tables which are not full-width
 //It is better to keep this code at the bottom as it moves the elements in floating block.
 //So that all the observers are applied before elements are moved.
    jQuery(elt).find('.js-thfloat-head').each(function() {
        jQuery(this).thfloat();
    });
    jQuery(elt).find('.js-thfloat-foot').each(function() {
        jQuery(this).thfloat({side: 'foot'});
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

    return false;
}

function addContent(chart_x_label, chart_y_label) {
    var content;
    if (chart_x_label === undefined && chart_y_label === undefined) {
        content = '%s</br><b>%p.2%</b>';
    } else if (chart_x_label === undefined) {
        content = '%s</br>' + chart_y_label + ': <b>%p.2%</b>';
    } else if (chart_y_label === undefined) {
        content = chart_x_label + ': %s</br><b>%p.2%</b>';
    } else {
        content = chart_x_label + ': %s</br>'+ chart_y_label +': <b>%p.2%</b>';
    }
    return content;
}

function showTooltip(x, y, contents) {
    jQuery('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y + 5,
        left: x + 5,
        border: '2px solid #4572A7',
        padding: '2px',
        'background-color': '#fff',
        opacity: 0.80,
        filter: 'alpha(opacity=80)',
        'border-radius': '6px',
        '-webkit-border-radius': '6px',
        '-moz-border-radius': '6px'
    }).appendTo('body').fadeIn(200);
}

function ajaxifyForm(ext_options) {
    var form_elt = ext_options.form_elt,
        options = {
            form_elt: null,
            event: 'submit',
            parameters: '',
            paramSource: '',
            display_success_method: [],
            display_error_method: [],
            new_dialog_update: undefined,
            callback: jQuery.noop
        };
    jQuery.extend(options, ext_options || {});
    if (jQuery(form_elt).fields().is(':file')) {
        var ajaxLoaderElt = (form_elt.find('.ajax-loader').size() > 0) ? form_elt.find('.ajax-loader') : jQuery(form_elt.data('ajax-loader')) ;
        jQuery(form_elt).ajaxForm({
            beforeSend: function() {
                jQuery(ajaxLoaderElt).show();
            },
            complete: jQuery.proxy(function(xhr, status) {
                jQuery(ajaxLoaderElt).hide();
                handleAjaxResponse(jQuery.extend(this, {
                    response: status,
                    xhr: xhr
                }));
                this.callback(xhr.responseText, xhr);
            }, options)
        });
    } else {
        jQuery(options.form_elt).unbind(options.event);
        jQuery(options.form_elt).bind(options.event, jQuery.proxy(doAjaxTransaction, options));
    }
}

function doAjaxTransaction(event, event_orig) {
    var form_elt = jQuery(this.form_elt),
        parameters = form_elt.serialize() + ((this.parameters !== '') ? '&' + this.parameters : '') + ((jQuery(this.paramSource) !== '') ? '&' + jQuery(this.paramSource).serialize() : '');
    event.preventDefault();

    if (form_elt.valid()) {
        jQuery.ajax({
            url: form_elt.attr('action'),
            async: true,
            data: parameters,
            type: form_elt.attr('method'),
            beforeSend: function() {
                form_elt.fields().filter('button, [type=submit]').attr('disabled', 'disabled');
                if (event_orig !== undefined) {
                    if (jQuery(event_orig.target).siblings('.dynamic-ajax-loader').size() > 0) {
                        jQuery(event_orig.target).siblings('.dynamic-ajax-loader').addClass('ajax-loader abs');
                    } else if (jQuery(event_orig.target).parent().hasClass('relative')) {
                        jQuery(event_orig.target).parent().append(jQuery('<i/>').addClass('dynamic-ajax-loader ajax-loader abs'));
                    } else {
                        jQuery(event_orig.target).parent().append(jQuery('<i/>').addClass('dynamic-ajax-loader ajax-loader'));
                    }
                } else {
                    var ajaxLoaderElt = (form_elt.find('.ajax-loader').size() > 0) ? form_elt.find('.ajax-loader') : jQuery(form_elt.data('ajax-loader')) ;
                        jQuery(ajaxLoaderElt).show();
                }
            },
            complete: jQuery.proxy(function(xhr, status) {
                form_elt.fields().filter('button, [type=submit]').removeAttr('disabled');
                if (event_orig !== undefined) {
                    jQuery(event_orig.target).siblings('.dynamic-ajax-loader').removeClass('ajax-loader abs');
                } else {
                    var ajaxLoaderElt = (form_elt.find('.ajax-loader').size() > 0) ? form_elt.find('.ajax-loader') : jQuery(form_elt.data('ajax-loader')) ;
                        jQuery(ajaxLoaderElt).hide();
                }
                handleAjaxResponse(jQuery.extend(this, {
                    response: status,
                    xhr: xhr
                }));
                this.callback(event, xhr.responseText, xhr);
            }, this)
        });
    } else {
        this.callback(event);
    }
    return false;
}

function handleAjaxResponse(options) {
    var response = options.response,
        xhr = options.xhr,
        data = jQuery(xhr.responseText).not('script').not('.messages'),
        scripts = jQuery(xhr.responseText).filter('script'),
        notification_messages = jQuery(xhr.responseText).filter('.messages').children(),
        to_update_selector = (response === 'success') ? options.display_success_method : options.display_error_method,
        to_update = jQuery(to_update_selector),
        default_dialog_title = (response === 'success') ? 'Notification' : 'Error',
        anim_method = (response === 'success') ? options.anim_method : '',
        anim_direction = (response === 'success' && options.anim_direction) ? options.anim_direction : '',
        new_dialog_title = (options.display_dialog_title) ? options.display_dialog_title : jQuery(window.modal).find('.modal-title'),
        new_dialog_update = options.new_dialog_update,
        data_dialog_width = (window.data_dialog_width) ? window.data_dialog_width : "default";

        if(jQuery(to_update_selector).find('.js-thfloat-foot').size() > 0){
            jQuery('.thfloat-table').remove();
        }
        if(new_dialog_title === undefined) {
            new_dialog_title = default_dialog_title;
        }
    // Check if we are supposed to redirect the user to a new page
    if (xhr.getResponseHeader('requestAction')) {
        window.location = xhr.getResponseHeader('requestAction');
        return;
    }
    if (data.size() > 0) {
        var focus_elt = jQuery(':focus'),
        focus_elt_id = focus_elt.attr('id');

        if (to_update.size() === 0) {
            // Elements to be updated are not specified, so we will use dialog to display the result
            var title = new_dialog_title,
                modal_dialog = jQuery('<div/>').addClass('modal-dialog'),
                modal_header = jQuery('<div/>').addClass('modal-header'),
                modal_title = jQuery('<h4/>').addClass('modal-title').html(title),
                modal_dismiss = jQuery('<button/>').addClass('close').attr('data-dismiss', 'modal').html('&times;'),
                modal_body = jQuery('<div/>').addClass('modal-body');

            window.modal = jQuery('<div/>').addClass('modal '+data_dialog_width);
            jQuery(window.modal).append(modal_header);
            jQuery(modal_header).append(modal_dismiss);
            jQuery(modal_header).append(modal_title);
            jQuery(modal_body).insertAfter(modal_header);
            jQuery(modal_body).append(data);
            jQuery(window.modal).modal(default_modal_options);
            rebindContainer(jQuery(window.modal));

        } else if (to_update.size() === 1 && new_dialog_update === undefined) {
                // We have exactly one element on the page to drop the data received
                updateWithAnimation(to_update, data, anim_method, anim_direction);
                // Close any open dialogs, so that user can see the results we just updated
                if (window.modal !== undefined) {
                    jQuery(window.modal).modal('hide');
                }
                rebindContainer(to_update);
                if (focus_elt_id !== undefined) {
                    var element = jQuery('#'+focus_elt_id);
                    element.focus().val(element.val());
                }
        } else {
                var isInDialog = false;
                // Below code would be used when we have a multiple section to update from data we have received.
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
                        // Support for opening new dialog with multisection update.
                        if (new_dialog_update !== undefined && id === new_dialog_update) {
                            if(elt.find("#new-dialog-title").size() > 0) {
                                new_dialog_title = elt.find("#new-dialog-title").html();
                                elt.find("#new-dialog-title").remove();
                            }
                            createModal({title: new_dialog_title, content: elt, width: data_dialog_width});
                            rebindContainer(jQuery(window.modal));
                            isInDialog = true;
                        }
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
            // Close any open dialogs, so that user can see the results we just updated
            if(!isInDialog && window.modal !== undefined) {
                jQuery(window.modal).modal('hide');
            }
            rebindContainer(to_update);
            if (focus_elt_id !== undefined) {
                jQuery('#'+focus_elt_id).focus();
            }
        }
        jQuery(scripts).appendTo('body');
    } else if (to_update.size() === 0 && window.modal !== undefined) {
        jQuery(window.modal).modal('hide');
    }
    jQuery(notification_messages).prependTo('#notification-messages');
    var success_hide = jQuery('#notification-messages').children('.alert-success:first');
    if (success_hide != undefined) {
        counterHide(success_hide, 5);
    }
}

// We can use this function for creating all dialogs.
function createModal(attrs) {
    var title = attrs.title,
        modal_content = attrs.content;
        modal_width = attrs.width;
        modal_dialog = jQuery('<div/>').addClass('modal-dialog'),
        modal_header = jQuery('<div/>').addClass('modal-header'),
        modal_title = jQuery('<h4/>').addClass('modal-title').html(title),
        modal_dismiss = jQuery('<button/>').addClass('close').attr('data-dismiss', 'modal').html('&times;'),
        modal_body = jQuery('<div/>').addClass('modal-body');

    window.modal = jQuery('<div/>').addClass('modal ' + modal_width);
    jQuery(window.modal).append(modal_header);
    jQuery(modal_header).append(modal_dismiss);
    jQuery(modal_header).append(modal_title);
    jQuery(modal_body).insertAfter(modal_header);
    jQuery(modal_body).append(modal_content);
    jQuery(window.modal).modal(default_modal_options);
}

function counterHide(elt, upper) {
    var lower_limit = 0,
        upper_limit = upper;

    var interval = setInterval(function() {
        elt.find('.timer').update(upper_limit - lower_limit);
        if (lower_limit >= upper_limit) {
            elt.hide("slide", {direction: "up" }, "slow", function(){ elt.remove();});
            //elt.hide('slow', function(){ elt.remove();});
            clearInterval(interval);
        }
        lower_limit++;
    }, 1000);
}

function cloneIt(source, identifier, index, template_class, callback) {
    var clone_template = jQuery(source).clone().removeClass(template_class).removeClass('template'),
        clone = jQuery('<div/>').append(clone_template),
        html = jQuery(clone).html().replace(new RegExp(identifier, 'g'), index),
        callback = callback || jQuery.noop;
    jQuery(clone).html(html);
    rebindContainer(clone);
    callback(clone);
    if (jQuery(source).data('append-to') === undefined) {
    jQuery(clone).children().appendTo(jQuery(source).parent()).reveal(); // fix this
    } else {
        jQuery(clone).children().appendTo(jQuery(source).data('append-to')).reveal(); // fix this
    }
}

function swapWithAnimation(old_elt, new_elt, method, direction, remove) {
    var old_elt = jQuery(old_elt), new_elt = jQuery(new_elt),
        old_elt_offset = old_elt.offset(), old_elt_width = old_elt.outerWidth(),
        anim_duration = {fade:1000, flip:500, bounce:500, rotate:500, roll:500, lightSpeed:250, lightSpeedR:250},
        opposite_direction = {'Down':'Up', 'DownBig':'UpBig', 'DownLeft':'UpLeft', 'DownRight':'UpRight', 'Left':'Right', 'LeftBig':'RightBig', 'Right':'Left', 'RightBig':'LeftBig', 'Up':'Down', 'UpBig':'DownBig', 'UpLeft':'DownLeft', 'UpRight':'DownRight', 'X':'Y', 'Y':'X'};
    old_elt.css({position:'absolute', top: old_elt_offset.top, left: old_elt_offset.left, width: old_elt_width});
    switch (method) {
        case 'fade':
            old_elt.addClass('animated ' + method + 'Out' + opposite_direction[direction]);
            new_elt.show().addClass('animated ' + method + 'In' + direction);
            break;
        case 'flip':
        case 'bounce':
        case 'rotate':
        case 'roll':
        case 'lightSpeedR':
        case 'lightSpeed':
            old_elt.addClass('animated ' + method + 'Out' + direction);
            setTimeout(function() {new_elt.show().addClass('animated ' + method + 'In' + direction);}, anim_duration[method]);
            break;
        default:
            remove ? old_elt.remove() : old_elt.hide();
            new_elt.show();
            break;
    }
    if(method !== undefined) {
        setTimeout(function() {remove ? old_elt.remove() : old_elt.hide(); old_elt.css({position:'', width:''});}, anim_duration[method]);
    }
}

function updateWithAnimation(to_update, data, method, direction) {
    var old_id = new Date().getTime(), new_id = old_id + 1;
    if(to_update.children().size() == 0) {
        to_update.append(jQuery('<div/>').attr('id', old_id));
    } else {
        to_update.children().wrapAll(jQuery('<div/>').attr('id', old_id));
    }
    jQuery('<div/>').attr('id', new_id).html(data).insertAfter('#' + old_id).hide();
    swapWithAnimation('#'+old_id, '#'+new_id, method, direction, true);
    setTimeout(function() {jQuery('#'+new_id).removeClass();}, 2000);
}

function wrap(functionToWrap, before, after, thisObject) {
    return function () {
        var args = Array.prototype.slice.call(arguments),
            result;
        if (before) {
            before.apply(thisObject || this, args);
        }
        result = functionToWrap.apply(thisObject || this, args);
        if (after) {
            after.apply(thisObject || this, args);
        }
        return result;
    };
};

function appendNewRow(row) {
    // used the cloner data attributes instead of defining new ones
    var template_class = $(row).data('clone-template-class'),
        template = jQuery('.' + template_class),
        identifier = jQuery(template).data('clone-index-identifier'),
        index = jQuery(template).data('clone-index');
    jQuery(template).data('clone-index', index + 1);
    cloneIt(template, identifier, index, template_class, null);
}


function ajaxUpdater() {
    var options = this,
        elt = jQuery(options.elt),
        callback = options.callback ? options.callback : jQuery.noop;
        beforeSendCallback = options.beforeSendCallback ? options.beforeSendCallback : jQuery.noop;
        url = elt.data('update-url'),
        to_update = jQuery(elt.data('ajax-update')),
        anim_method = elt.data('anim-method'),
        anim_direction = elt.data('anim-direction'),
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
            data: data,
            beforeSend: function(xhr, settings) {
                beforeSendCallback({
                    xhr: xhr,
                });
                elt.addClass('relative');
                var ajax_loader = jQuery('<i/>').addClass('ajax-loader abs');
                elt.next('.dynamic-ajax-loader').remove();
                if (jQuery(elt).is(':checkbox, :radio:checked') && jQuery(elt).parent("label").length > 0) {
                    elt = jQuery(elt).parent("label");
                }
                ajax_loader.appendTo(elt);
            },
            complete: function(xhr, status) {
                elt.children('.ajax-loader').removeClass('ajax-loader abs');
                handleAjaxResponse({
                    xhr: xhr,
                    response: status,
                    display_success_method: to_update,
                    display_error_method: to_update,
                    anim_method: anim_method,
                    anim_direction: anim_direction,
                    status: status
                });
                callback(xhr.responseText, xhr);
            }
        });
    }
 }

function createTabs(elt) {
    var tab_parent = jQuery(elt),
        child_list = tab_parent.children().filter(':visible');

    if (child_list.size() > 1) {
        var wrapper_div = jQuery('<div/>').addClass('col-sm-12 tab-wrap-div'),
            nav_tab = jQuery('<ul/>').addClass('nav nav-tabs'),
            tab_content = jQuery('<div/>').addClass('tab-content row'),
            first_flag = true;
        child_list.each(function() {
            if (jQuery(this).hasClass('ui-widget-overlay')) {
                tab_parent.data('widget-overlay', true);
                wrapper_div.append(jQuery('<div/>').addClass('ui-widget-overlay'));
            } else {
                var tab_text = jQuery(this).find('.tab-title-sm').text(),
                    tab_pane_id = jQuery('').uniqueId(),
                    tab_li = jQuery('<li/>'),
                    tab_a = jQuery('<a/>').attr('data-toggle', 'tab').attr('href', '#'+tab_pane_id).html(tab_text),
                    tab_pane_div = jQuery('<div/>').addClass('tab-pane').attr('id', tab_pane_id).append(jQuery(this));
                if (first_flag) {
                    first_flag = false;
                    tab_li.addClass('active');
                    tab_pane_div.addClass('active');
                }
                tab_li.append(tab_a);
                nav_tab.append(tab_li);
                tab_content.append(tab_pane_div);
            }
        });
        tab_parent.empty();
        wrapper_div.append(nav_tab);
        wrapper_div.append(tab_content);
        tab_parent.append(wrapper_div);
    }
}

function removeTabs(elt) {
    var tab_parent = jQuery(elt),
        child_list = tab_parent.find('.tab-pane');
    if (child_list.size() > 0) {
        child_list.each(function() {
            tab_parent.append(jQuery(this).children());
        });
        if(true === tab_parent.data('widget-overlay')) {
            tab_parent.append(jQuery('<div/>').addClass('ui-widget-overlay'));
        }
        tab_parent.find('.tab-wrap-div').remove();
    }
}

function createAffix (elm) {
    $(elm).find('.sticky-parent').each(function() {
        var elt = $(this),
            placeholder = elt.clone().removeClass('sticky-parent').addClass('sticky-clone').html('');
        placeholder.css({margin: 0, padding: 0, width: window.getComputedStyle(elt[0]).width, height: window.getComputedStyle(elt[0]).height});
        $(placeholder).insertAfter(elt);
    });
    $(elm).find('[data-sticky]').each(function() {
        var target = $(this),
            parentElt = target.offsetParent(),
            marginTop = target.data('margin-top') || 0,
            marginBottom = target.data('margin-bottom') || 0,
            initialOffsetTop = target.offset().top - marginTop;
        $(this).closest('.sticky-container').addClass('initialized');
        $(window).bind('scroll', function() {
            var isSticky = target.hasClass('sticky'),
                scrollTop = $(window).scrollTop(),
                height = target.outerHeight(),
                width = target.outerWidth(),
                parentOffsetBottom = parentElt.offset().top + parentElt.outerHeight(),
                currentOffsetBottom = scrollTop + marginTop + height + marginBottom;
            //Assign container width to target when it is hidden.
	    var parent = $(this).parents("#container"),
                isVisible = $(parent).is(':visible');
	    if (!isVisible) { 
                width = $('#container').width();
	    }
            if (parentOffsetBottom < currentOffsetBottom) {
                target.addClass('sticky bottom').css({top:'auto', width:width});
                if (target.prev('.scroll-placeholder').size() === 0) {
                    $('<div/>').addClass('scroll-placeholder').css({height: height, width: width}).insertBefore(target);
                }
            } else if (scrollTop > initialOffsetTop) {
                target.addClass('sticky').removeClass('bottom').css({top:marginTop, width:width});
                if (target.prev('.scroll-placeholder').size() === 0) {
                    $('<div/>').addClass('scroll-placeholder').css({height: height, width: width}).insertBefore(target);
                }
            } else if (isSticky) {
                target.removeClass('sticky bottom');
                target.prev('.scroll-placeholder').remove();
                $(window).scroll(); // bug fix for flickering
            }
        });
    });
    $(window).scroll();
}

function selectElementContents(elt) {
    if (window.getSelection && document.createRange) {
        var sel = window.getSelection(),
            range = document.createRange();
        range.selectNodeContents(elt);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
