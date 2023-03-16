//rem适配
const htmlEl = document.documentElement;

function setRemUnit() {
    const htmlWidth = htmlEl.clientWidth;
    const htmlFontSize = htmlWidth / 3.75;
    htmlEl.style.fontSize = htmlFontSize + "px";
}

setRemUnit();
window.addEventListener("resize", setRemUnit);
//预加载
var imgs = document.getElementsByTagName('img');
var imgNum = imgs.length;
var loading = 0;
for ( var i = 0; i <= (imgNum - 1); i++ ) {
    (function (i) {
        setTimeout(function () {
            imgs[i].onload = add();
        }, 100 * i);
    })(i);
}

function add() {
    $(".num").html((loading / imgNum * 100).toFixed(0) + '%');
    console.dir(loading / imgNum * 100 + '%');
    if ( loading == imgNum - 1 ) {//预加载完成
        loading = imgNum;
        $(".num").html('100%');
        $('.loading').css('display', 'none');
        setTimeout(() => {
            $('.tips').css('display', 'none')
        }, 2000)
    }
    loading++;

}

//切换技能
$(".skill-list li").click(function () {
    let status = $(this).addClass('active').siblings().removeClass('active');
})
//切换商品
$(".hero-box li").click(function () {
    let status = $(this).addClass('active-hero').siblings().removeClass('active-hero');

})
//buy
$('.btn button,.close').click(function () {
    // $('.hero-box').css('display', 'none')
    $('.hero-box').fadeOut(700, 'linear');
    $('.back').fadeOut();
})
$('.buy-box').click(function () {
    $('.hero-box').fadeIn(700, 'linear');
    $('.back').fadeIn();
});

//audio
function play_music() {
    if ( $('#mc_play').hasClass('on') ) {
        $('#mc_play audio').get(0).pause();
        $('#mc_play').attr('class', 'stop');
    } else {
        $('#mc_play audio').get(0).play();
        $('#mc_play').attr('class', 'on');
    }
}


//swiper
var mySwiper = new Swiper('.swiper', {
    direction: 'vertical',
    loop: false,
    on: {
        slideChangeTransitionEnd: function () {
            let index = this.activeIndex
            index == 0 ? $('.top-icon-box').css('display', 'none') : $('.top-icon-box').css('display', 'block')
            index == 3 ? $('.bottom-icon-box').css('display', 'none') : $('.bottom-icon-box').css('display', 'block')
        },
    },
});

// monster show
function start() {
    var n = 1;
    document.getElementById("monster").style.display = 'block'
    var t = setInterval(function () {
        document.getElementById("monster").src = 'images/' + n + '.png';
        n = n + 1;
        if ( n > 20 ) {
            document.getElementById("monster").style.display = 'none';
            play_music();
            clearInterval(t);
        }
    }, 200);
}

//擦除
var canvas = document.getElementById("cas"),
    ctx = canvas.getContext("2d");
var x1, y1, a = 30,
    timeout, totimes = 100,
    jiange = 30;
canvas.width = document.getElementById("box").clientWidth;
canvas.height = document.getElementById("cas").clientHeight
var img = new Image();
img.src = "./images/pic/bg1.png";
img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    //ctx.fillRect(0,0,canvas.width,canvas)
    tapClip()
}

//通过修改globalCompositeOperation来达到擦除的效果
function tapClip() {
    var hastouch = "ontouchstart" in window ? true : false,
        tapstart = hastouch ? "touchstart" : "mousedown",
        tapmove = hastouch ? "touchmove" : "mousemove",
        tapend = hastouch ? "touchend" : "mouseup";

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = a * 2;
    ctx.globalCompositeOperation = "destination-out";

    canvas.addEventListener(tapstart, function (e) {
        clearTimeout(timeout)
        e.preventDefault();

        x1 = hastouch ? e.targetTouches[0].pageX : e.clientX - canvas.offsetLeft;
        y1 = hastouch ? e.targetTouches[0].pageY : e.clientY - canvas.offsetTop;

        ctx.save();
        ctx.beginPath()
        ctx.arc(x1, y1, 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        canvas.addEventListener(tapmove, tapmoveHandler);
        canvas.addEventListener(tapend, function () {
            canvas.removeEventListener(tapmove, tapmoveHandler);

            timeout = setTimeout(function () {
                var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var dd = 0;
                for ( var x = 0; x < imgData.width; x += jiange ) {
                    for ( var y = 0; y < imgData.height; y += jiange ) {
                        var i = (y * imgData.width + x) * 4;
                        if ( imgData.data[i + 3] > 0 ) {
                            dd++
                        }
                    }
                }
                if ( dd / (imgData.width * imgData.height / (jiange * jiange)) < 0.4 ) {
                    canvas.className = "noOp";
                    document.getElementById("cas").style.display = 'none';
                    start();
                }
            }, totimes)
        });

        function tapmoveHandler(e) {
            clearTimeout(timeout)
            e.preventDefault()
            x2 = hastouch ? e.targetTouches[0].pageX : e.clientX - canvas.offsetLeft;
            y2 = hastouch ? e.targetTouches[0].pageY : e.clientY - canvas.offsetTop;

            ctx.save();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore()

            x1 = x2;
            y1 = y2;
        }
    })
}
