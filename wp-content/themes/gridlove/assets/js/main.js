(function($) {

    "use strict";

    $(document).ready(function() {


        /* Logo check */
        gridlove_logo_setup();

        /* Detect if admin bar is used */
        var gridlove_admin_top_bar_height = 0;
        gridlove_top_bar_check();

        /* Responsive header check */
        gridlove_responsive_header();


        /* Hidden sidebar */

        $('body').on('click', '.gridlove-sidebar-action', function() {

            $('body').addClass('gridlove-sidebar-action-open gridlove-lock');
            $('.gridlove-sidebar-action-wrapper').css('top', gridlove_admin_top_bar_height);

        });

        $('body').on('click', '.gridlove-action-close, .gridlove-sidebar-action-overlay', function() {

            $('body').removeClass('gridlove-sidebar-action-open gridlove-lock');

        });

        $(document).keyup(function(e) {
            if (e.keyCode == 27 && $('body').hasClass('gridlove-sidebar-action-open')) {
                $('body').removeClass('gridlove-sidebar-action-open gridlove-lock');
            }
        });


        /* Header search */

        $('body').on('click', '.gridlove-action-search span', function() {

            $(this).find('i').toggleClass('fa-close', 'fa-search');
            $(this).closest('.gridlove-action-search').toggleClass('active');
            setTimeout(function() {
                $('.active input[type="text"]').focus()
            }, 150);

            if ($('.gridlove-responsive-header .gridlove-watch-later').hasClass('active')) {
                $('.gridlove-responsive-header .gridlove-watch-later').removeClass('active');
            }

        });

        $(document).on('click', function(evt) {
            if (!$(evt.target).is('.gridlove-action-search span') && $(window).width() < 580) {

                $('.gridlove-action-search.active .sub-menu').css('width', $(window).width());
            }
        });


        /* Cover slider */

        $(".gridlove-cover-slider").each(function() {

            var lg_items = parseInt($(this).attr('data-items'));
            var md_items = lg_items > 2 ? 2 : 1;
            var autoplay_time = parseInt($(this).attr('data-autoplay'));
            var autoplay = autoplay_time ? true : false;
            var gridlove_auto_width = true;
            if (lg_items == 1) {
                gridlove_auto_width = false;
            }

            $(this).owlCarousel({
                rtl: gridlove_js_settings.rtl_mode ? true : false,
                loop: true,
                autoHeight: false,
                autoWidth: gridlove_auto_width,
                items: lg_items,
                margin: 30,
                nav: true,
                center: false,
                fluidSpeed: 100,
                autoplayHoverPause: true,
                autoplay: autoplay,
                autoplayTimeout: autoplay_time,
                navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
                responsive: {
                    0: {
                        items: 1,
                        autoWidth: false
                    },
                    580: {
                        items: md_items,
                        autoWidth: false
                    },
                    1024: {
                        items: lg_items,
                        autoWidth: false
                    },

                    1230: {
                        items: lg_items,
                        autoWidth: gridlove_auto_width
                    }



                }
            });
        });


        /* Module slider */

        $(".gridlove-slider").each(function() {

            var controls = $(this).closest('.gridlove-module').find('.gridlove-slider-controls');
            var lg_items = parseInt(controls.attr('data-items'));
            var md_items = lg_items > 2 ? 2 : 1;
            var autoplay_time = parseInt(controls.attr('data-autoplay'));
            var autoplay = autoplay_time ? true : false;

            $(this).owlCarousel({
                rtl: gridlove_js_settings.rtl_mode ? true : false,
                loop: true,
                autoHeight: false,
                autoWidth: true,
                items: lg_items,
                margin: 30,
                nav: true,
                center: false,
                fluidSpeed: 100,
                navContainer: controls,
                autoplay: autoplay,
                autoplayTimeout: autoplay_time,
                navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
                responsive: {
                    0: {
                        items: 1,
                        autoWidth: false
                    },
                    580: {
                        items: md_items,
                        autoWidth: false
                    },
                    1024: {
                        items: lg_items,
                        autoWidth: false
                    },

                    1230: {
                        items: lg_items,
                        autoWidth: true
                    }



                }
            });
        });

        /* Widget slider init */

        gridlove_widget_slider($('body'));


        /* Sticky header */

        if (gridlove_js_settings.header_sticky) {

            var gridlove_last_top;

            $('.gridlove-header-sticky').css('top', gridlove_admin_top_bar_height);

            $(window).scroll(function() {

                var top = $(window).scrollTop();

                if (gridlove_js_settings.header_sticky_up) {

                    if (gridlove_last_top > top && top >= gridlove_js_settings.header_sticky_offset) {
                        if (!$("body").hasClass('gridlove-header-sticky-on')) {
                            $("body").addClass("gridlove-header-sticky-on");

                        }
                    } else {
                        if ($("body").hasClass('gridlove-header-sticky-on')) {
                            $("body").removeClass("gridlove-header-sticky-on");

                        }
                    }

                } else {

                    if (top >= gridlove_js_settings.header_sticky_offset) {
                        if (!$("body").hasClass('gridlove-header-sticky-on')) {
                            $("body").addClass("gridlove-header-sticky-on");

                        }

                    } else {
                        if ($("body").hasClass('gridlove-header-sticky-on')) {
                            $("body").removeClass("gridlove-header-sticky-on");
                        }

                    }
                }

                gridlove_last_top = top;
            });

        }

        $(window).scroll(function() {

            gridlove_responsive_header();

        });

        /* Share buttons click */

        $('body').on('click', '.gridlove-share-item', function(e) {
            e.preventDefault();
            var data = $(this).attr('data-url');
            gridlove_social_share(data);
        });


        /* Hendling url on ajax call for load more and infinite scroll case */
        if ($('.gridlove-infinite-scroll').length || $('.gridlove-load-more').length || $('.gridlove-infinite-scroll-single').length) {

            var gridlove_url_pushes = [];
            var gridlove_pushes_up = 0;
            var gridlove_pushes_down = 0;

            var push_obj = {
                prev: window.location.href,
                next: '',
                offset: $(window).scrollTop(),
                prev_title: window.document.title,
                next_title: window.document.title
            };

            gridlove_url_pushes.push(push_obj);
            window.history.pushState(push_obj, '', window.location.href);

            var last_up, last_down = 0;

            $(window).scroll(function() {
                if (gridlove_url_pushes[gridlove_pushes_up].offset != last_up && $(window).scrollTop() < gridlove_url_pushes[gridlove_pushes_up].offset) {

                    last_up = gridlove_url_pushes[gridlove_pushes_up].offset;
                    last_down = 0;
                    window.document.title = gridlove_url_pushes[gridlove_pushes_up].prev_title;
                    window.history.replaceState(gridlove_url_pushes, '', gridlove_url_pushes[gridlove_pushes_up].prev); //1

                    gridlove_pushes_down = gridlove_pushes_up;
                    if (gridlove_pushes_up != 0) {
                        gridlove_pushes_up--;
                    }
                }
                if (gridlove_url_pushes[gridlove_pushes_down].offset != last_down && $(window).scrollTop() > gridlove_url_pushes[gridlove_pushes_down].offset) {

                    last_down = gridlove_url_pushes[gridlove_pushes_down].offset;
                    last_up = 0;

                    window.document.title = gridlove_url_pushes[gridlove_pushes_down].next_title;
                    window.history.replaceState(gridlove_url_pushes, '', gridlove_url_pushes[gridlove_pushes_down].next);

                    gridlove_pushes_up = gridlove_pushes_down;
                    if (gridlove_pushes_down < gridlove_url_pushes.length - 1) {
                        gridlove_pushes_down++;
                    }

                }
            });

        }


        /* Load more button handler */
        var gridlove_load_ajax_new_count = 0;

        $("body").on('click', '.gridlove-load-more a', function(e) {

            e.preventDefault();
            var start_url = window.location.href;
            var prev_title = window.document.title;
            var $link = $(this);
            var page_url = $link.attr("href");

            $link.parent().addClass('gridlove-loader-active');
            $('.gridlove-loader').show();
            $("<div>").load(page_url, function() {
                var n = gridlove_load_ajax_new_count.toString();
                var $wrap = $link.closest('.gridlove-load-more').prev().find('.gridlove-posts');
                var $new = $(this).find('.gridlove-posts').last().children().addClass('gridlove-new-' + n);
                var $this_div = $(this);

                $new.imagesLoaded(function() {

                    if($wrap.find('.gridlove-masonry-wrapper').length > 0){
                        $new.hide().appendTo($wrap.find('.gridlove-masonry-wrapper')).fadeIn(400);
                        $wrap.find('.gridlove-masonry-wrapper').masonry('appended', $new);
                    }else{
                        $new.hide().appendTo($wrap).fadeIn(400);
                        if($wrap.hasClass('masonry')){
                            $wrap.masonry('appended', $new);
                        }
                    }

                    $('.gridlove-new-' + n + ' .box-inner-ellipsis').ellipsis();

                    if ($this_div.find('.gridlove-load-more').length) {
                        $('.gridlove-load-more').html($this_div.find('.gridlove-load-more').html());
                        $('.gridlove-loader').hide();
                        $('.gridlove-load-more').removeClass('gridlove-loader-active');
                    } else {
                        $('.gridlove-load-more').fadeOut('fast').remove();
                    }


                    if (page_url != window.location) {

                        gridlove_pushes_up++;
                        gridlove_pushes_down++;
                        var next_title = $this_div.find('title').text();

                        var push_obj = {
                            prev: start_url,
                            next: page_url,
                            offset: $(window).scrollTop(),
                            prev_title: prev_title,
                            next_title: next_title
                        };

                        gridlove_url_pushes.push(push_obj);
                        window.document.title = next_title;
                        window.history.pushState(push_obj, '', page_url);

                    }

                    gridlove_load_ajax_new_count++;

                    return false;
                });

            });

        });



        /* Infinite scroll handler */

        var gridlove_infinite_allow = true;

        if ($('.gridlove-infinite-scroll').length) {
            $(window).scroll(function() {
                if (gridlove_infinite_allow && $('.gridlove-infinite-scroll').length && ($(this).scrollTop() > ($('.gridlove-infinite-scroll').offset().top) - $(this).height() - 200)) {
                    var $link = $('.gridlove-infinite-scroll a');
                    var start_url = window.location.href;
                    var prev_title = window.document.title;
                    $link.parent().addClass('gridlove-loader-active');
                    var page_url = $link.attr("href");
                    if (page_url != undefined) {
                        gridlove_infinite_allow = false;
                        $('.gridlove-loader').show();
                        $("<div>").load(page_url, function() {
                            var n = gridlove_load_ajax_new_count.toString();
                            var $wrap = $('.gridlove-posts').last();
                            var $new = $(this).find('.gridlove-posts').last().children().addClass('gridlove-new-' + n);
                            var $this_div = $(this);

                            $new.imagesLoaded(function() {

                                if($wrap.find('.gridlove-masonry-wrapper').length > 0){
                                    $new.removeClass('layout-combo').addClass('layout-masonry');
                                    $new.hide().appendTo($wrap.find('.gridlove-masonry-wrapper')).fadeIn(400);
                                    $wrap.find('.gridlove-masonry-wrapper').masonry('appended', $new);
                                }else{
                                    $new.hide().appendTo($wrap).fadeIn(400);
                                    if($wrap.hasClass('masonry')){
                                        $wrap.masonry('appended', $new);
                                    }
                                }

                                $('.gridlove-new-' + n + ' .box-inner-ellipsis').ellipsis();

                                if ($this_div.find('.gridlove-infinite-scroll').length) {
                                    $('.gridlove-infinite-scroll').html($this_div.find('.gridlove-infinite-scroll').html());
                                    $('.gridlove-loader').hide();
                                    $('.gridlove-infinite-scroll').removeClass('gridlove-loader-active');
                                    gridlove_infinite_allow = true;
                                } else {
                                    $('.gridlove-infinite-scroll').fadeOut('fast').remove();
                                }

                                if (page_url != window.location) {

                                    gridlove_pushes_up++;
                                    gridlove_pushes_down++;
                                    var next_title = $this_div.find('title').text();

                                    var push_obj = {
                                        prev: start_url,
                                        next: page_url,
                                        offset: $(window).scrollTop(),
                                        prev_title: prev_title,
                                        next_title: next_title
                                    }

                                    gridlove_url_pushes.push(push_obj);
                                    window.document.title = next_title;
                                    window.history.pushState(push_obj, '', page_url);

                                }

                                gridlove_load_ajax_new_count++;

                                return false;
                            });

                        });
                    }
                }
            });
        }


        /* Infinite scroll on single post page */

        if ($('.gridlove-infinite-scroll-single').length) {

            $(window).scroll(function() {


                if (gridlove_infinite_allow && $('.gridlove-infinite-scroll-single').length && ($(this).scrollTop() > ($('.gridlove-infinite-scroll-single').offset().top) - $(this).height() - 200)) {

                    var $link = $('.gridlove-infinite-scroll-single a');
                    $link.parent().addClass('gridlove-loader-active');
                    var page_url = $link.attr("href");
                    var start_url = window.location.href;
                    var prev_title = window.document.title;

                    if (page_url != undefined) {
                        gridlove_infinite_allow = false;
                        $('.gridlove-loader').show();
                        $("<div>").load(page_url, function() {

                            var n = gridlove_load_ajax_new_count.toString();
                            var $wrap = $('.gridlove-site-content').last();
                            var $this_div = $(this);
                            var coverArea = $this_div.find('.gridlove-cover-area').last().addClass('gridlove-cover-new' + n);
                            var newContent = $this_div.find('.gridlove-site-content').last().addClass('gridlove-new-' + n);

                            newContent.imagesLoaded(function() {

                                if ($this_div.find('.attachment-gridlove-cover').hasClass('size-gridlove-cover')) {

                                    coverArea.hide().insertAfter($wrap).fadeIn(400);
                                    newContent.hide().insertAfter(coverArea).fadeIn(400);

                                } else {

                                    newContent.hide().insertAfter($wrap).fadeIn(400);
                                }

                                gridlove_sticky_sidebar(newContent);
                                gridlove_sticky_share(newContent);
                                gridlove_widget_slider(newContent);
                                newContent.find('.box-inner-ellipsis').ellipsis();
                                gridlove_gallery_slider(newContent);
                                gridlove_popup_gallery(newContent);
                                gridlove_popup_image(newContent);


                                if ($this_div.find('.gridlove-infinite-scroll-single').length) {

                                    $('.gridlove-infinite-scroll-single').html($this_div.find('.gridlove-infinite-scroll-single').html());
                                    $('.gridlove-loader').hide();
                                    $('.gridlove-infinite-scroll-single').removeClass('gridlove-loader-active');
                                    gridlove_infinite_allow = true;
                                } else {
                                    $('.gridlove-infinite-scroll-single').fadeOut('fast').remove();
                                }


                                if (page_url != window.location) {

                                    gridlove_pushes_up++;
                                    gridlove_pushes_down++;
                                    var next_title = $this_div.find('title').text();

                                    var push_obj = {
                                        prev: start_url,
                                        next: page_url,
                                        offset: $(window).scrollTop(),
                                        prev_title: prev_title,
                                        next_title: next_title
                                    }

                                    gridlove_url_pushes.push(push_obj);
                                    window.document.title = next_title;
                                    window.history.pushState(push_obj, '', page_url);

                                }

                                gridlove_load_ajax_new_count++;

                                return false;
                            });

                        });
                    }
                }
            });
        }

        /* Fitvidjs functionality on single posts */

        gridlove_fit_videos($('.entry-content, .entry-media'));


        /* Gallery pop-up init */

        gridlove_popup_gallery($('.gridlove-content, .gridlove-text-module-content'));


        /* Image popup init */

        gridlove_popup_image($('.gridlove-content'));


        /* Gallery slider */
        gridlove_gallery_slider($('.gridlove-content, .gridlove-text-module-content'));


        /* Add Accordion menu arrows */

        $(".widget_nav_menu").each(function() {

            var menu_item = $(this).find('.menu-item-has-children > a');
            menu_item.after('<span class="gridlove-nav-widget-acordion"><i class="fa fa-chevron-down"></i></span>');

        });

        $(".widget_pages").each(function() {

            var menu_item = $(this).find('.page_item_has_children > a');
            menu_item.after('<span class="gridlove-nav-widget-acordion"><i class="fa fa-chevron-down"></i></span>');

        });

        /* Accordion menu click functionality*/

        $('.widget_nav_menu .gridlove-nav-widget-acordion, .widget_pages .gridlove-nav-widget-acordion').click(function() {
            $(this).next('ul.sub-menu:first, ul.children:first').slideToggle('fast').parent().toggleClass('active');

        });



        $('body').imagesLoaded(function() {
            gridlove_sticky_sidebar($('.gridlove-site-content').last());
            gridlove_sticky_share($('.gridlove-site-content').last());

            objectFitImages('.gridlove-module .entry-image img, .gridlove-cover-area .gridlove-cover-bg img');


        });


        $('.gridlove-posts').imagesLoaded(function() {
            /* Apply elipsis to ensure height */
            $('.box-inner-ellipsis').ellipsis();

             /* Apply masonry */
            $('.gridlove-module-layout-masonry .gridlove-posts, .gridlove-masonry-wrapper').masonry();
        });


        $(window).resize(function() {

            // Don't do anything in full screen mode
            if(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement){
                return;
            }

            gridlove_logo_setup();
            gridlove_top_bar_check();
            gridlove_responsive_header();
            $('.gridlove-site-content').each(function() {
                gridlove_sticky_sidebar($(this));
                gridlove_sticky_share($(this));
            });

            $('.box-inner-ellipsis').ellipsis();
        });


        /* Scroll to comments */

        $('body').on('click', '.gridlove-content .meta-comments a:first, .gridlove-cover-single .meta-comments a', function(e) {

            e.preventDefault();
            var target = this.hash;
            var $target = $(target);
            var offset = gridlove_js_settings.header_sticky ? 100 : 0;

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - offset
            }, 900, 'swing', function() {
                window.location.hash = target;
            });

        });


        if (window.location.hash == '#respond') {

            var offset = gridlove_js_settings.header_sticky ? 100 : 0;
            $('html, body').stop().animate({
                'scrollTop': $('#respond').offset().top - offset
            }, 900, 'swing', function() {

            });
        }

        /* Reverse submenu ul if out of the screen */

        $('.gridlove-main-nav li').hover(function(e) {
            if ($(this).closest('body').width() < $(document).width()) {

                $(this).find('ul').addClass('gridlove-rev');
            }
        }, function() {
            $(this).find('ul').removeClass('gridlove-rev');
        });

        /* Gallery slider function */
        function gridlove_gallery_slider(obj) {
            if (gridlove_js_settings.gridlove_gallery) {
                obj.each(function() {
                    $(this).find('.gallery-columns-1').owlCarousel({
                        rtl: gridlove_js_settings.rtl_mode ? true : false,
                        loop: true,
                        nav: true,
                        autoWidth: false,
                        center: false,
                        fluidSpeed: 100,
                        margin: 0,
                        items: 1,
                        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
                    });
                });
            }
        }

        /* Slider widget function */
        function gridlove_widget_slider(obj) {
            obj.find(".gridlove-widget-slider").each(function() {
                var $controls = $(this).closest('.widget').find('.gridlove-slider-controls');
                var autoplay_time = parseInt($controls.attr('data-autoplay'));
                var autoplay = autoplay_time ? true : false;

                $(this).owlCarousel({
                    rtl: gridlove_js_settings.rtl_mode ? true : false,
                    loop: true,
                    autoHeight: false,
                    autoWidth: false,
                    items: 1,
                    nav: true,
                    center: false,
                    fluidSpeed: 100,
                    margin: 0,
                    navContainer: $controls,
                    autoplay: autoplay,
                    autoplayTimeout: autoplay_time,
                    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
                });
            });
        }


        /* Sticky sidebar and Sticky share functionality*/

        function gridlove_sticky_sidebar(obj) {

            if (obj.find('.gridlove-sticky-sidebar').length) {

                var stickySidebar = obj.find('.gridlove-sticky-sidebar');
                var gridloveSidebar = obj.find('.gridlove-sidebar');

                if (window.innerWidth >= 1023) {

                    var content_margin = 0;

                    if (gridlove_is_single_layout_indent()) {
                        content_margin = 75;
                    }

                    var content_height = obj.find('.gridlove-content').height() - content_margin;
                    var sidebar_height = gridloveSidebar.height();



                    if (content_height > sidebar_height) {

                        gridloveSidebar.css('height', content_height - 30);

                        var gridlove_sticky_header_height = 0;

                        if ($('.gridlove-header-sticky').length && !gridlove_js_settings.header_sticky_up) {
                            gridlove_sticky_header_height = $('.gridlove-header-sticky').height();
                        }

                        var sticky_top = 30 + gridlove_admin_top_bar_height + gridlove_sticky_header_height;

                        stickySidebar.stick_in_parent({
                            parent: ".gridlove-sidebar",
                            inner_scrolling: true,
                            offset_top: sticky_top,
                             spacer: false
                        });

                    }

                } else {

                    gridloveSidebar.each(function() {
                        $(this).css('height', 'auto');
                        $(this).css('min-height', '1px');
                    });

                    stickySidebar.trigger("sticky_kit:detach");
                }
            }
        }


        /* Sticky share */

        function gridlove_sticky_share(obj) {

            if (obj.find('.gridlove-sticky-share').length) {

                var shareWrapper = obj.find('.gridlove-share-wrapper').last();
                var stickyShare = obj.find('.gridlove-sticky-share').last();



                if (window.innerWidth >= 900) {

                    var content_margin = 0;

                    if (gridlove_is_single_layout_indent()) {
                        content_margin = 75;
                    }

                    var content_height = obj.find('.gridlove-content').height() - content_margin;
                    var gridlove_sticky_header_height = 0;

                    /* Check if sticky share is higher than content  */
                    if( (content_height-30) > shareWrapper.height()){
                        shareWrapper.css('height', content_height - 30);
                    } else{
                        shareWrapper.css('height', 'auto');
                    }

                    if ($('.gridlove-header-sticky').length && !gridlove_js_settings.header_sticky_up) {
                        gridlove_sticky_header_height = $('.gridlove-header-sticky').height();
                    }

                    var sticky_top = 30 + gridlove_admin_top_bar_height + gridlove_sticky_header_height;

                    stickyShare.prependTo(shareWrapper);

                    stickyShare.stick_in_parent({
                        parent: ".gridlove-share-wrapper",
                        inner_scrolling: true,
                        offset_top: sticky_top
                    });

                } else {
                    
                    shareWrapper.each(function() {
                        $(this).css('height', 'auto');
                        $(this).css('min-height', '1px');
                    });
                    //stickyShare.prependTo('.box-single .entry-content');
                    obj.find('.box-single .entry-content').last().prepend(stickyShare);
                    stickyShare.trigger("sticky_kit:detach");
                }
            }
        }


        /* Share popup function */

        function gridlove_social_share(data) {
            window.open(data, "Share", 'height=500,width=760,top=' + ($(window).height() / 2 - 250) + ', left=' + ($(window).width() / 2 - 380) + 'resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0');
        }


        /* Fitvidjs function */
        function gridlove_fit_videos(obj) {
            obj.fitVids({
                customSelector: "iframe[src^='https://www.dailymotion.com'], iframe[src^='https://player.twitch.tv'], iframe[src^='https://vine.co'], iframe[src^='https://videopress.com'], iframe[src^='//content.jwplatform.com']"
            });
        }


        /* Popup image function */

        function gridlove_popup_image(obj) {

            if (obj.find("a.gridlove-popup-img").length) {

                var popupImg = obj.find("a.gridlove-popup-img");

                popupImg.find('img').each(function() {
                    var $that = $(this);
                    if ($that.hasClass('alignright')) {
                        $that.removeClass('alignright').parent().addClass('alignright');
                    }
                    if ($that.hasClass('alignleft')) {
                        $that.removeClass('alignleft').parent().addClass('alignleft');
                    }
                });

                popupImg.magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true
                    },
                    image: {
                        titleSrc: function(item) {
                            return item.el.closest('.wp-caption').find('figcaption').text();
                        }
                    }
                });
            }

        }


        /* Pop-up gallery function */

        function gridlove_popup_gallery(obj) {
            if (gridlove_js_settings.gridlove_gallery) {
                obj.each(function() {
                    $(this).find('.gallery').each(function() {
                        $(this).find('.gallery-icon a.gridlove-popup').magnificPopup({
                            type: 'image',
                            gallery: {
                                enabled: true
                            },

                            image: {
                                titleSrc: function(item) {
                                    var $caption = item.el.closest('.gallery-item').find('.gallery-caption');
                                    if ($caption != 'undefined') {
                                        return $caption.text();
                                    }
                                    return '';
                                }
                            }
                        });
                    });
                });
            }
        }


        /* Logo setup */

        var gridlove_retina_logo_done = false;
        var gridlove_retina_mini_logo_done = false;

        function gridlove_logo_setup() {

            //Retina logo
            if (window.devicePixelRatio > 1) {

                if (gridlove_js_settings.logo_retina && !gridlove_retina_logo_done && $('.gridlove-logo').length) {
                    $('.gridlove-logo').imagesLoaded(function() {

                        $('.gridlove-logo').each(function() {
                            if ($(this).is(':visible')) {
                                var width = $(this).width();
                                $(this).attr('src', gridlove_js_settings.logo_retina).css('width', width + 'px');
                            }
                        });
                    });

                    gridlove_retina_logo_done = true;
                }

                if (gridlove_js_settings.logo_mini_retina && !gridlove_retina_mini_logo_done && $('.gridlove-logo-mini').length) {
                    $('.gridlove-logo-mini').imagesLoaded(function() {
                        $('.gridlove-logo-mini').each(function() {
                            if ($(this).is(':visible')) {
                                var width = $(this).width();
                                $(this).attr('src', gridlove_js_settings.logo_mini_retina).css('width', width + 'px');
                            }
                        });
                    });

                    gridlove_retina_mini_logo_done = true;
                }
            }
        }


        /* Top bar height check and admin bar fixes*/

        function gridlove_top_bar_check() {

            if ($('#wpadminbar').length && $('#wpadminbar').is(':visible')) {
                gridlove_admin_top_bar_height = $('#wpadminbar').height();
            }

        }

        /* Responsive header check */

        function gridlove_responsive_header() {

            if ($('.gridlove-header-responsive').length) {

                $('.gridlove-header-responsive').css('top', gridlove_admin_top_bar_height);


                if (gridlove_admin_top_bar_height > 0 && $('#wpadminbar').css('position') == 'absolute') {

                    if ($(window).scrollTop() <= gridlove_admin_top_bar_height) {
                        $('.gridlove-header-responsive').css('position', 'absolute');
                    } else {
                        $('.gridlove-header-responsive').css('position', 'fixed').css('top', 0);
                    }

                }

            }
        }


        /* Check if single or page layout is with indented content */

        function gridlove_is_single_layout_indent() {

            var content = $('.gridlove-content');

            if (content.hasClass('gridlove-single-layout-7') || content.hasClass('gridlove-single-layout-8') || content.hasClass('gridlove-page-layout-4') || content.hasClass('gridlove-page-layout-5')) {
                return true;
            }

            return false;

        }

    }); //document ready end

})(jQuery);