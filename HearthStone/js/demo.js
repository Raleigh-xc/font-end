$(function(){

    (function(){

        /*Ajax数据请求*/
        $.ajax({
            url: 'data/demo.json',
            type: 'GET',
            success: function(response,status,xhr){
                if(status == 'success'){

                    fillData(response);

                }
            },
            dataType: 'json'
        });

        function fillData(response){
            
            var str = '';

            $.each(response,function(index,value){

                var title =  value.title;
                var status =  value.status;
                var name0 = value.players[0];
                var name1 = value.players[1];
                var winner0 = '';
                var winner1 = '';

                if(value.winner == '0'){
                    winner0 = 'winner';
                    winner1 = '';
                }else if(value.winner == '1'){
                    winner0 = '';
                    winner1 = 'winner';
                }else{
                    winner0 = '';
                    winner1 = '';
                }

                var selected0 = '';
                var selected0 = '';
                if(value.selected == '0'){
                    selected0 = 'selected';
                    selected1 = '';
                }else if(value.selected == '1'){
                    selected0 = '';
                    selected1 = 'selected';
                }else{
                    selected0 = '';
                    selected1 = '';
                }

                var guess = value.result;
                var text = '';
                if(value.result == 'no-guess'){
                    text = '未竞猜';
                }else if(value.result == 'guess-right'){
                    text = '猜对了';
                }else if(value.result == 'guess-wrong'){
                    text = '猜错了';
                }

                str += '<li><div class="match-info"><span class="title">'+title+'</span><span class="status">'+status+'</span></div><div class="players"><div class="player1"><span class="name">'+name0+'</span><b class="'+winner0+'"></b><i class="'+selected0+'"></i></div><div class="player2"><span class="name">'+name1+'</span><b class="'+winner1+'"></b><i class="'+selected1+'"></i></div><div class="guess-result '+guess+'"><strong></strong>'+text+'</div></div></li>';

            });

            $("#guess-list").find('ul').html(str);
        }

    })();

    (function(){

        /*导航条位置*/
        $(window).scroll(function(){
            var iHeight = $('#banner').height() - $('#banner').find('.nav').height();
            if($(this).scrollTop() >= iHeight){
                $('#banner').find('.nav').addClass('nav-fix');
            }else{
                $('#banner').find('.nav').removeClass('nav-fix');
            }
        });

        /*导航条位置*/
        $(document).scroll(function(){
            var iHeight = $('#banner').height() - $('#banner').find('.nav').height();
            if($(this).scrollTop() >= iHeight){
                $('#banner').find('.nav').addClass('nav-fix');
            }else{
                $('#banner').find('.nav').removeClass('nav-fix');
            }
        });

    })();

    (function(){

        /*锚点动画跳转*/
        var iNavHeight = $('#banner').find('.nav').height();

        $('#guess-banner').find('a').click(function(ev){
            var oTarget = $(this).attr('href');
            var iHeight = $(oTarget ).offset().top - iNavHeight;
            $('html,body').animate({
                scrollTop:iHeight+'px'
            },'slow');
            ev.preventDefault();
        });

    })();


});