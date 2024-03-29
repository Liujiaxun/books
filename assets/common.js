(function (designWidth, maxWidth) {
    var doc = document,
        win = window,
        docEl = doc.documentElement,
        remStyle = document.createElement("style"),
        tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        maxWidth = maxWidth || 540;
        width > maxWidth && (width = maxWidth);
        var rem = width * 100 / designWidth;
        remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
    }

    if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(remStyle);
    } else {
        var wrap = doc.createElement("div");
        wrap.appendChild(remStyle);
        doc.write(wrap.innerHTML);
        wrap = null;
    }
    //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem();
    win.addEventListener("resize", function () {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener("pageshow", function (e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
    } else {
        doc.addEventListener("DOMContentLoaded", function (e) {
            doc.body.style.fontSize = "16px";
        }, false);
    }
})(375, 667);

var fontSizeConfig = [
    {
        fontSize: '.2rem',
        lineHeight: '.4rem'
    },
    {
        fontSize: '.15rem',
        lineHeight: '.25rem'
    },
    {
        fontSize: '.1rem',
        lineHeight: '.2rem'
    }
]
var menustatus = false;
var bookListStatus = false;
var dbClickTime = 0;
var dbStatus = false;
var taskBarIndex = 0;
var searchBtnStatus = false;
$(function () {
    if ($('body').find('.pageBars').length === 1) {
        $('body').css({'paddingBottom': '.575rem'});
        $('.loadList').css({'paddingBottom': '.575rem'});
    }
    new Swiper('#banner', {
        loop: true, // 循环模式选项
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },
        speed: 500,
        autoplay: {
            delay: 5000
        },
    });
    new Swiper('.hots', {
        loop: true, // 循环模式选项
    });

    function hideBack() {
        $('#back').stop(true).fadeOut();
    }

    function showBack() {
        $('#back').stop(true).fadeIn();
    }

    function modalShow(id) {
        $('.modal').hide();
        $('#' + id).fadeIn();
        showBack();
    }

    function settingFontSize(type) {
        $('#books-bodys-shows').css(fontSizeConfig[type - 1]);
        $('.fontSizeSetting').eq(type - 1).addClass('active').siblings().removeClass('active');
        window.localStorage.setItem('$bookType', type)
    }

    function shows(val) {
        if (val) {
            hideBack();
            $('#menuList').stop(true).fadeOut();
            menustatus = false;
        } else {
            showBack();
            $('#menuList').stop(true).fadeIn();
            menustatus = true;
        }
    }

    function showBookList(status) {
        var $imgSrc = $('#booklisticon').find('.menulisticon').attr('src');
        var newSrc = $imgSrc.slice(0, $imgSrc.length - 5);
        if (status) {
            hideBack();
            $('#booklisticon').find('.menulisticon').attr({'src': newSrc + 'tf.svg'});
            $('#booklisticon').find('.booklisticonBody').hide();
            bookListStatus = false;
        } else {
            showBack();
            $('#booklisticon').find('.menulisticon').attr({'src': newSrc + '.svg'});
            $('#booklisticon').find('.booklisticonBody').show();
            bookListStatus = true;
        }
    }

    //qp
    function qp(status) {
        if (!status) {
            $('body').addClass('qp');
            $('.header').addClass('qp');
            $('.books-show').addClass('qp');
            $('.fontSize-bar').addClass('qp');
            $('.pages').addClass('qp');
        } else {
            $('body').removeClass('qp');
            $('.header').removeClass('qp');
            $('.books-show').removeClass('qp');
            $('.fontSize-bar').removeClass('qp');
            $('.pages').removeClass('qp');
        }
        dbStatus = !status;
    }
    function showSearchBar(status){
        if(status){
            $('body').removeClass('onSearch');
            $('#SeacrchBar').css({top:-1.75+'rem'});
        }else{
            $('body').addClass('onSearch');
            $('#SeacrchBar').css({top:(115/2/100)+'rem'});
        }
        searchBtnStatus =!status;
    }
    var $bookType = window.localStorage.getItem('$bookType');
    if ($bookType) {
        settingFontSize($bookType);
    }
    $('#menuBtn').click(function () {
        shows(menustatus)
    })
    $('#registerBtn').click(function (e) {
        e.preventDefault();
        $('#registerSuccess').show().siblings('.modal-body').hide();
        $('#registerModal').css({'height': '2.1rem', 'margin-top': '-1.05rem'})
    })
    $('.close').click(function () {
        $('.modal').hide();
        $('.modal .modal-body').hide();
        $('.modal .modal-body.first').show();
        $('#loginModal').css({height: '2.5rem', marginTop: '-1.5rem'});
        $('#registerModal').css({height: '3rem', marginTop: '-1.5rem'});
        hideBack();
    })
    $('#registerShowModal').click(function () {
        modalShow('registerModal');
    });
    $('#loginShowModal').click(function () {
        modalShow('loginModal');
    })
    $('#loginBtn').click(function () {
        $('#loginError').show().siblings('.modal-body').hide();
    });
    $('#hasAccout').click(function () {
        modalShow('loginModal');
    });
    $('.fontSizeSetting').click(function () {
        var $type = $(this).attr('type');
        settingFontSize($type);
    })
    $('#booklisticon').click(function () {
        showBookList(bookListStatus)
        // showBack();
    })
    $('#back').click(function () {
        var display = $('#registerModal').css('display') === 'block' || $('#registerModal').css('loginModal') === 'block';
        if (!display) {
            shows(true);
            showBookList(true);
        }
    });
    $('#readType').click(function () {
        var readType = $(this).attr('type');
        if (readType == 1) {
            $('#books-bodys-shows').addClass('nightMode');
            $(this).html('白天');
            $(this).attr({type: 0});
        } else {
            $('#books-bodys-shows').removeClass('nightMode');
            $(this).html('夜间');
            $(this).attr({type: 1});
        }
    });

    $('#books-bodys-shows').click(function (e) {
        var date = new Date();
        var clientY = e.clientY;
        var height = document.body.clientHeight / 2;
        console.log(dbStatus);
        if (((date.getTime()) - dbClickTime < 500) && (clientY > (height - 50)) && (clientY < (height + 50))) {
            dbClickTime = 0;
            qp(dbStatus);
        }
        dbClickTime = date.getTime();
    })
    var taskLength = $('.taskBar p').length;
    if (taskLength > 0) {
        setInterval(function () {
            var nowWidth = $('.taskBar p').eq(taskBarIndex).width();
            var nowLeft = $('.taskBar p').eq(taskBarIndex)[0].offsetLeft;
            $('.taskBar p').eq(taskBarIndex).animate({left: (nowLeft - 1) + 'px'},0);
            if (nowLeft < 0  && (nowLeft + nowWidth) == 0) {
                if( taskBarIndex < taskLength){
                    $('.taskBar p').eq(taskBarIndex).css({left: '100%'});
                    taskBarIndex++;
                    if(taskBarIndex == taskLength){
                        taskBarIndex = 0;
                    }
                }
            }
        }, 20);
    }
    $('#searchBtn').click(function(){
        showSearchBar(searchBtnStatus);
    });

    $('#searchSubmitBtn').click(function(){
        document.getElementById('searchForm').submit();
    });


});
