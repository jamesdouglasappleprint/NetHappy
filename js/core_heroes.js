/* APPLE PRINT & CREATIVE //////////////////////////////////////////////////////////////////////////////////////////////////
// Nethappy HEROES CORE ///////////////////////////////////////////////////////////////////////////////////////////////////////////
// SITE: Nethappy CORE /////////////////////////////////////////////////////////////////////////////////////////////////////
// DEV: JAMES DOUGLAS //////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILD: 2016 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////.d888888////////////////////dP//////////////888888ba///////////oo////////////dP//////dP////////d888888P/888888ba///////
////d8'////88////////////////////88//////////////88////`8b////////////////////////88//////88///////////88////88////`8b//////
////88aaaaa88a/88d888b./88d888b./88/.d8888b.////a88aaaa8P'/88d888b./dP/88d888b./d8888P////88///////////88////88/////88//////
////88/////88//88'//`88/88'//`88/88/88ooood8/////88////////88'//`88/88/88'//`88///88//////88///////////88////88/////88//////
////88/////88//88.//.88/88.//.88/88/88.//.../////88////////88///////88/88////88///88//////88///////////88////88////.8P//////
////88/////88//88Y888P'/88Y888P'/dP/`88888P'/////dP////////dP///////dP/dP////dP///dP//////88888888P////dP////8888888P///////
///////////////88///////88//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////dP///////dP//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/


// navigator.notification.alert('Thanks for registering! You can now log in using your email and password', null, 'Registration Success!', 'Continue')
//navigator.notification.confirm('User not found. Please check your login details and try again!', loginFailure, 'Login failure', ['Retry','Cancel'])

function HeroesCore(){
  console.log('HeroesCore Loaded');
  var heroes_core = this;

  heroes_core.all_buttons()
  heroes_core.setContainerHeight()
  heroes_core.registerUser()

  heroes_core.languageContent = []
  heroes_core.debug = 1; //if 1, disable cordova functionality

}

//Set container heights to 100vh (without using VH because VH sucks)
HeroesCore.prototype.setContainerHeight = function(){
  var core = this
  console.log('setting container height')
  var docHeight = $(document).height()
  var maths = docHeight-120
  var maths2 = docHeight-120-50

  $('.heroes_container').css({height:maths+"px"})
  $('.heroes_menu_container').css({height:maths2+"px"})
  $('#welcome').css({height:maths+"px"})
  $('#about').css({height:maths+"px"})

  $('.heroes_menu_item_anchor_parent').css({'line-height':$('.heroes_menu_item').height()+'px'})
  $('.heroes_menu_item_anchor_parent i').css({'line-height':$('.heroes_menu_item').height()+'px'})
  $('.heroes_return').css({'line-height':$('.heroes_return').height()+1+'px'})
}

HeroesCore.prototype.all_buttons = function(){
  var heroes_core = this
  console.log('Heroes Button Actions Loaded')

  $(document).on("click",".heroes_launcher",function(e){
    console.log('heroes launcher clicked')
    e.preventDefault()
    //heroes_core.all_buttons()
    $('.heroes_container').load("heroes_index.html", function(){
      console.log('Heroes Index page successfully loaded.')
      $('.contentContainer').hide()

      //If user agreement already selected, then skip terms and conditions step
      if (window.localStorage.getItem("termsandconditions") == 1){
        //Skip terms and conditions
        console.log('terms and conditions detected')
        $('.heroes_termsandconditions_container').hide()
        $('.termstoggle').removeClass('fa-square-o').addClass('fa-check-square')
        heroes_core.load_heroes_menu()
      }else{
        //Dont skip terms and conditions
        $('.heroes_termsandconditions_container').show()
      }

    })
  })

  $(document).on("click",".heroes_return",function(e){
    //returning back to main menu
    $('.heroes_menu_container').hide()
  });


  //TERMS AND CONDITIONS USER AGREEMENT
  //Accept user agreement
  $(document).on("click",".termstoggle",function(e){
    if ($(this).hasClass('fa-check-square')){
      $(this).removeClass('fa-check-square').addClass('fa-square-o')
      window.localStorage.removeItem("termsandconditions");
    }else{
      $(this).removeClass('fa-square-o').addClass('fa-check-square')
      window.localStorage.setItem("termsandconditions", 1);
      $('.heroes_termsandconditions_container').hide()
      console.log('load heroes menu')
      if (heroes_core.debug != 1){
        navigator.notification.alert('Thank you for accepting the terms and conditions', null, 'Terms & conditions', 'Continue')
      }

      heroes_core.load_heroes_menu()
    }
  })

  $(document).on("click",".heroes_menu_item_anchor_parent",function(e){
    e.preventDefault()
    var target = $(this).attr('data-panel')

    $('#'+target).show()
    $('.heroes_menu_container').hide()
  });

  $(document).on("click",".heroes_returntomenu a",function(e){
    e.preventDefault()
    $(this).parent().parent().parent().parent().hide()
    $('.heroes_menu_container').show()
  });

  $(document).on("click",".heroes_returntomenu.heroes_returnto_about_menu a",function(e){
    e.preventDefault()
    $('.heroes_menu_container').hide()
    $('.about_container').show()
  });

  $(document).on("click",".heroes_returntomenu.heroes_returnto_claim_menu a",function(e){
    e.preventDefault()
    $('.heroes_menu_container').hide()
    $('#claim').show()
  });

  $(document).on("click",".get_heroes_points",function(e){
    e.preventDefault()
    heroes_core.getPoints();
  });

  $(document).on("click",".submit_accepted_deal_reg",function(e){
    e.preventDefault()

    var dealreg = $('#accepted_dr').val()
    var enduser = $('#accepted_enduser').val()
    var ponum = 0
    var value = $('#accepted_value').val()
    var username = localStorage.getItem('userName')
    var stringToPass = 'dt=2'+'&dn='+dealreg+'&eu='+enduser+'&val='+value+'&un='+username

    heroes_core.pointsmeanprizes(stringToPass);
  });

  $(document).on("click",".submit_closed_deal_reg",function(e){
    e.preventDefault()

    var ponum = $('#closed_po').val()
    var enduser = $('#closed_enduser').val()
    var value = $('#closed_value').val()
    var username = localStorage.getItem('userName')
    var stringToPass = 'dt=1'+'&po='+ponum+'&eu='+enduser+'&val='+value+'&un='+username

    heroes_core.pointsmeanprizes(stringToPass);
  });

  $(document).on("click",".submit_events_deal_reg",function(e){
    e.preventDefault()

    var evname = $('#closed_evname').val()
    var evloc = $('#closed_evloc').val()
    var date = $('#closed_date').val()
    var username = localStorage.getItem('userName')
    var stringToPass = 'dt=4'+'&evname='+evname+'&evloc='+evloc+'&evdate='+date+'&un='+username

    heroes_core.pointsmeanprizes(stringToPass);
  });

}

HeroesCore.prototype.load_heroes_menu = function(){
  var heroes_core = this
  console.log('Heroes menu loaded')
  $('.heroes_menu_container').show() //open menu, it starts off hidden
  heroes_core.setContainerHeight()

}

HeroesCore.prototype.pointsmeanprizes = function(string){
  var heroes_core = this

  $.ajax({
    type: 'POST',
    data: string,
    async: false,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://netappyheroes.apple-dev.co.uk/ghRegisterDeal.ashx',
    success: function(data){
      console.log(data)

    },
    error: function(){
      console.log('Error registering user.')
    }
  });

}

HeroesCore.prototype.registerUser = function(info){
  var heroes_core = this

  var un = localStorage.getItem('userName')
  var fn = localStorage.getItem('fn')
  var ln = localStorage.getItem('ln')
  var em = localStorage.getItem('email')

  $.ajax({
    type: 'POST',
    data: 'un='+un+'&fn='+fn+'&ln='+ln+'&em='+em,
    async: false,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://netappyheroes.apple-dev.co.uk/ghRegisterUser.ashx',
    success: function(data){
      console.log('Heroes User Registered:',data)

    },
    error: function(data){
      console.log('Error registering user.',data)
    }
  });



}

HeroesCore.prototype.getPoints = function(){
  var heroes_core = this

  $.ajax({
    type: 'POST',
    data: 'un='+localStorage.getItem('userName'),
    async: false,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://netappyheroes.apple-dev.co.uk/ghGetPoints.ashx',
    success: function(data){
      console.log('User Points =',data)

    },
    error: function(data){
      console.log('Error getting user points.',data)
    }
  });

}

HeroesCore.prototype.x = function(){
  var heroes_core = this

}

////////BOOT CORE
var HeroesCore = new HeroesCore();
