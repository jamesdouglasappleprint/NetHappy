/* APPLE PRINT & CREATIVE //////////////////////////////////////////////////////////////////////////////////////////////////
// APPLEGOTCHI /////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SITE: APPLEGOTCHI ///////////////////////////////////////////////////////////////////////////////////////////////////////
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


function Core(){
  console.log('Core Loaded');
  var self = this;


  self.currentMood = 'happy';
  self.petNamedType = ""; //current pet type as a name
  self.petLevel = 1; //current pet type as a name
  self.userID = 0; //Pet Name

  self.loadPanelContent();//Load panels with content
  self.loginOrRegister(); //Load form options
  self.buildFunctionsDelete(); //Load temp files +++ DELETE THIS +++
  self.init();//Initial load checks
  self.logOut()
  self.initPushwoosh()
  window.plugin.notification.badge.clear(); //clear badge notifications
}

//Initialiser
Core.prototype.init = function (x) {
  var self = this

  if (localStorage.getItem("remainLoggedIn") == 'true' && localStorage.getItem("userID") !== null){
    console.log('remain logged in is true')
    //get up to date pet data
    self.loadPet(localStorage.getItem("userID"))
  }else{

  }

};

//Load HTML into panels
Core.prototype.loadPanelContent = function(){
  var self = this
  console.log('Loading Panel Content')

  $('.registerLoginPanel').load("registerlogin.html")
  $('.storyboardPanel').load("storyboard.html")
  $('.mainPanel').load("main.html")
  $('.menuPanel').load("menu.html")
  $('.levelupPanel').load("levelup.html")
  $('.contactDetailsPanel').load("contactdetails.html")
  $('.leaderboardPanel').load("leaderboard.html")

  $(document).on('click',".buttonPhoto", function(e){
    e.preventDefault()

    // navigator.screenshot.save(function(error,res){
    //   if(error){
    //     console.error(error);
    //   }else{
    //     window.plugins.socialsharing.share('Message and image', null, 'file://'+res.filePath, null)
    //     console.log(res.filePath);
    //   }
    // },'jpg',100,'myPet');

    localStorage.setItem('isKill', 1)
    self.currentMood = 'dead';


  })

  //Click to feed!
  $(document).on("click",".buttonFeed",function(e){
    e.preventDefault()
    self.actionFeed(localStorage.getItem('petLevel'))
  })

  //Click to feed!
  $(document).on("click",".buttonClean",function(e){
    e.preventDefault()
    self.actionClean(localStorage.getItem('petLevel'))
  })

  //Click to Entertain!
  $(document).on("click",".buttonEntertain",function(e){
    e.preventDefault()
    self.actionEntertain(localStorage.getItem('petLevel'))
  })

  //Click to open contact details menu
  $(document).on("click",".updateContactDeets",function(e){
    e.preventDefault()
    $('.contactDetailsPanel').show()
    $('#updateContactDetailsForm #userID').val(localStorage.getItem('userID'))
    $('#updateContactDetailsForm #forename').val(localStorage.getItem('firstName'))
    $('#updateContactDetailsForm #surname').val(localStorage.getItem('lastName'))
    $('#updateContactDetailsForm #email').val(localStorage.getItem('emailaddress'))
    $('#updateContactDetailsForm #a1').val(localStorage.getItem('AddressLine1'))
    $('#updateContactDetailsForm #a2').val(localStorage.getItem('AddressLine2'))
    $('#updateContactDetailsForm #a3').val(localStorage.getItem('AddressLine3'))
    $('#updateContactDetailsForm #t').val(localStorage.getItem('town'))
    $('#updateContactDetailsForm #pc').val(localStorage.getItem('postcode'))
    $('#updateContactDetailsForm #password').val(localStorage.getItem('password'))
  })

  //Update contact Details after filling in
  $(document).on("click",".submitUpdate",function(e){
    e.preventDefault()

    console.log('Submit Update has been clicked')
  	var postData = $('form#updateContactDetailsForm').serialize();
    var fakeDetailsRemoved = postData.replace('&fakeusernameremembered=&fakepasswordremembered=','');
  	$.ajax({
  		type: 'POST',
  		data: fakeDetailsRemoved,
      dataType:'jsonp',
      jsonp: 'callback',
  		url: 'http://applegotchi.co.uk/Ajax/ghUpdateUser.ashx',
  		success: function(data){
        console.log('Success! User updated.')
        console.log(data)
        navigator.notification.alert('Thanks for updating! Your details are now updated.', null, 'Details updated!', 'Continue')

        localStorage.setItem('firstName',$('#updateContactDetailsForm #forename').val())
        localStorage.setItem('lastName',$('#updateContactDetailsForm #surname').val())
        localStorage.setItem('emailaddress',$('#updateContactDetailsForm #email').val())
        localStorage.setItem('AddressLine1',$('#updateContactDetailsForm #a1').val())
        localStorage.setItem('AddressLine2',$('#updateContactDetailsForm #a2').val())
        localStorage.setItem('AddressLine3',$('#updateContactDetailsForm #a3').val())
        localStorage.setItem('town',$('#updateContactDetailsForm #t').val())
        localStorage.setItem('postcode',$('#updateContactDetailsForm #pc').val())
        localStorage.setItem('password',$('#updateContactDetailsForm #password').val())
  		},
  		error: function(){
        console.log('Error registering user.')
        navigator.notification.alert('Oops! It looks like something went wrong...', null, 'Details not updated :(', 'ok')
  		}
    });

  })

  //Kill your pet
  $(document).on("click",".petMurder",function(e){
    e.preventDefault()
    self.petMurder()
  })

  //Show Leaderboard
  $(document).on("click",".leaderBoardButton",function(e){
    e.preventDefault()
    $('.menuPanel').hide()
    $('.leaderboardPanel').show()
    $('.leaderboardData').html('')

    $.ajax({
      type: 'POST',
      data: 't=5',
      async: false,
      dataType:'jsonp',
      jsonp: 'callback',
      url: 'http://applegotchi.co.uk/Ajax/ghLeaderboard.ashx',
      success: function(data){
        console.log(data);

        $.each(data, function(e){
          var petTypeName = ''

          if (data[e].pt == 2){
            petTypeName = 'ringo'
          }else if (data[e].pt == 1){
            petTypeName = 'insatsu'
          }else{
            petTypeName = 'noneSpecified'
          }

          $('.leaderboardData').append('<li><div class="leaderboardEntryContainer"><img src="img/Leaderboard/leaderboardPetIMG_'+petTypeName+'_'+data[e].pl+'.png"><div class="leaderboardDetails"><p class="leaderboardBold">'+data[e].pos+'.'+data[e].pname+'</p><p>Owner: '+data[e].name+'</p></div><div class="leaderboardScore">'+data[e].p+'</div></div></li>')

          // console.log(data[e].name) //user
          // console.log(data[e].p) //score
          // console.log(data[e].pl) //Pet level
          // console.log(data[e].pname) //Pet name
          // console.log(data[e].pos) //leaderboard position
          // console.log(data[e].pt) //pet type
        })

      },
      error: function(){
        console.log('Error registering user.')
      }
    });

  })

  //Click to close contact details menu
  $(document).on("click",".closeleaderboard",function(e){
    e.preventDefault()
    $('.leaderboardPanel').hide()
    $('.menuPanel').show()
  })


  //Click to close contact details menu
  $(document).on("click",".closeContactDetails",function(e){
    e.preventDefault()
    $('.contactDetailsPanel').hide()
  })

  //Click to close contact details menu
  $(document).on("click",".closeLevelUp",function(e){
    e.preventDefault()
    $('.levelupPanel').hide()
  })

  //Click to close contact details menu
  $(document).on("click",".toggleMusic",function(e){
    e.preventDefault()
    console.log('toggling')
    $('.toggleMusic').toggleClass('disabledAudio')


    if (localStorage.getItem('music') == '1'){
      $('.menuMusic').get(0).pause()
      $('.gameMusic').get(0).pause()
       window.localStorage.setItem('music', '0')
    }else if (localStorage.getItem('music') == '0'){
       window.localStorage.setItem('music', '1')
      $('.menuMusic').get(0).pause()
      $('.gameMusic').get(0).play()
    }else{
      $('.menuMusic').get(0).pause()
      $('.gameMusic').get(0).pause()
    }

  })

  //Click to close contact details menu
  $(document).on("click",".toggleSound",function(e){
    e.preventDefault()
    console.log('toggling')
    $('.toggleSound').toggleClass('disabledAudio')

    if (localStorage.getItem('sound') == '1'){
       window.localStorage.setItem('sound', '0')
    }else{
       window.localStorage.setItem('sound', '1')
    }


  })



  //Click to Entertain!
  $(document).on("click",".menuTrigger",function(e){
    e.preventDefault()

    $('.accountDeetsFirstName>span').html(localStorage.getItem('firstName'))
    $('.accountDeetsLastName>span').html(localStorage.getItem('lastName'))
    $('.accountDeetsAddressLine1>span').html(localStorage.getItem('AddressLine1'))
    $('.accountDeetsAddressLine2>span').html(localStorage.getItem('AddressLine2'))
    $('.accountDeetsAddressLine3>span').html(localStorage.getItem('AddressLine3'))
    $('.accountDeetsTown>span').html(localStorage.getItem('town'))
    $('.accountDeetsPostcode>span').html(localStorage.getItem('postcode'))
    $('.accountDeetsEmailAddress>span').html(localStorage.getItem('emailaddress'))

    $('.menuPanel').show()
  })

  //Click to close contact details menu
  $(document).on("click",".closeMenu",function(e){
    e.preventDefault()
    $('.menuPanel').hide()
  })
}

//Log out and clear all local data
Core.prototype.logOut = function(){
  var self = this
  var save = localStorage.getItem('music')
  //Click to Entertain!
  $(document).on("click",".logOut",function(e){
    e.preventDefault()
    localStorage.clear();
    $('.menuPanel').hide()
    $('.mainPanel').hide()
    $('.storyboardPanel').hide()
    $('.registerLoginPanel').removeClass('displaceBackgroundLogin')
    $('.registerLoginContainer').removeClass('registerLoginReduce')
    $('.slideLogin').hide()

    //1 == play
    //0  == stop
    //if music is set to on, play
    if (save == '1'){
      $('.menuMusic').get(0).play()
      $('.gameMusic').get(0).pause()
      localStorage.setItem('music', "1")

    //else if music is set to off, pause both
    }else if (save == '0'){
      $('.menuMusic').get(0).pause()
      $('.gameMusic').get(0).pause()
      $('.toggleMusic').addClass('disabledAudio')
      localStorage.setItem('music', "0")
    }else{
      $('.menuMusic').get(0).pause()
      $('.gameMusic').get(0).pause()
    }


    //Call unregister
    self.initPushwoosh(null, null, false, true)
  })
}

//Login and Register Functions
Core.prototype.loginOrRegister = function(){
  var self = this
  console.log('Loading Panel Content')

  //If remmber me button clicked
  $(document).on("click",".rememberMeButton",function(e){
    if ($(this).data('status') == 'forget'){
      console.log('toggling to remember')
      $(this).addClass('statusRemember')
      $(this).data('status', 'remember')
      localStorage.setItem("remainLoggedIn", "true");
    }else{
      $(this).data('status', 'forget')
      $(this).removeClass('statusRemember')
      console.log('toggle to forget')
      localStorage.removeItem("remainLoggedIn", "true");
    }
  })

  //Login Opened
  $(document).on("click",".loginButton",function(e){
    $('.registerLoginContainer').addClass('registerLoginReduce')
    $('.slideLogin').show()
    $('.slideRegister').hide()
    $('.registerLoginPanel').addClass('displaceBackgroundLogin')
  })

  //Login closed
  $(document).on("click",".hideSlideLogin",function(e){
    $('.registerLoginContainer').removeClass('registerLoginReduce')
    $('.slideLogin').hide()
    $('.registerLoginPanel').removeClass('displaceBackgroundLogin')
  })

  //Login Opened
  $(document).on("click",".registerButton",function(e){
    $('.registerLoginContainer').addClass('registerLoginReduceMax')
    $('.slideRegister').show()
    $('.slideLogin').hide()
    $('.registerLoginPanel').addClass('displaceBackgroundRegister')
  })

  //Login closed
  $(document).on("click",".hideSlideRegister",function(e){
    $('.registerLoginContainer').removeClass('registerLoginReduceMax')
    $('.slideRegister').hide()
    $('.registerLoginPanel').removeClass('displaceBackgroundRegister')
  })

  //REGISTER USER
  $(document).on("click",".submitRegister",function(e){
  	e.preventDefault()
    localStorage.clear();
  	console.log('Submit Register has been clicked')
  	var postData = $('form#registerForm').serialize();
    var fakeDetailsRemoved = postData.replace('&fakeusernameremembered=&fakepasswordremembered=','');
  	$.ajax({
  		type: 'POST',
  		data: fakeDetailsRemoved,
      dataType:'jsonp',
      jsonp: 'callback',
  		url: 'http://applegotchi.co.uk/Ajax/ghRegister.ashx',
  		success: function(data){
        console.log('Success! User registered.')
        localStorage.setItem("userID", data.userID);
        navigator.notification.alert('Thanks for registering! You can now log in using your email and password', null, 'Registration Success!', 'Continue')

        $('.registerLoginContainer').removeClass('registerLoginReduceMax')
        $('.slideRegister').hide()
        $('.registerLoginPanel').removeClass('displaceBackgroundRegister')
  		},
  		error: function(){
        console.log('Error registering user.')
        navigator.notification.alert('Oops! It looks like something went wrong...', null, 'Registration Failure :(', 'ok')
  		}
    });

  });

  //USER LOGIN
  $(document).on("click",".submitLogin",function(e){
  	e.preventDefault()
  	console.log('Submit Login has been clicked')
  	var postData = $('form#loginForm').serialize();
    var fakeDetailsRemoved = decodeURIComponent(postData.replace('fakeusernameremembered=&fakepasswordremembered=&',''));
  	$.ajax({
  		type: 'POST',
  		data: fakeDetailsRemoved,
      dataType:'jsonp',
      jsonp: 'callback',
  		url: 'http://applegotchi.co.uk/Ajax/ghLogon.ashx',
  		success: function(data){
  			console.log(data);

        function loginFailure(buttonIndex) {
          console.log('login failure loop'+buttonIndex)
          if (buttonIndex == 1){
            $('.submitLogin').trigger('click')
          }
        }

        if (data.error == "user not found"){
          console.log('user not found')
          navigator.notification.confirm('User not found. Please check your login details and try again!', loginFailure, 'Login failure', ['Retry','Cancel'])
        }else{
          console.log('user found')
          self.userID = data.uid

          localStorage.setItem('userID', data.uid)
          localStorage.setItem('firstName', data.firstname)
          localStorage.setItem('lastName', data.lastname)
          localStorage.setItem('postcode', data.postcode)
          localStorage.setItem('AddressLine1', data.add1)
          localStorage.setItem('AddressLine2', data.add2)
          localStorage.setItem('AddressLine3', data.add3)
          localStorage.setItem('emailaddress', data.emailaddress)
          localStorage.setItem('town', data.town)
          localStorage.setItem('password', data.password)

          //TODO:: renable
          self.initPushwoosh(data.emailaddress, null, false)

          if (localStorage.getItem("hasPet") != 'true'){
            console.log('No local storage hasPet, either user hasn\t got a pet or they\'e got one but had deleted the app')

            //Check to see if user already has login, but has cleared localstorage
            $.ajax({
              type: 'POST',
              data: 'uid='+data.uid,
              dataType:'jsonp',
              jsonp: 'callback',
              url: 'http://applegotchi.co.uk/Ajax/ghPets.ashx',
              success: function(data){
                console.log(data);

                //If pet data exists
                if (data.length == 1){
                  console.log('No localstorage was present, but the user has a pet. Loading Pet...')
                  self.loadPet(self.userID)
                }else{
                  //Start creation story
                  self.creationStory();
                  $('.storyboardPanel').show()
                }



              },
              error: function(){
                console.log('Error registering user.')
              }
            });
          }else{
            console.log('You have signed in and already have a pet!')
            //skip to creature
            self.loadPet(self.userID)
          }
        }
  		},
  		error: function(){
        console.log('Error registering user.')
  		}
    });

  });
}//END

//Assigns global mood to whatever you feed it
Core.prototype.assignMood = function(mood){
  var self = this;
  var thisMood = mood;
  self.currentMood = thisMood;
}

//All code for creation story, including assigning which pet you've picked
Core.prototype.creationStory = function(){
  //this code is probably temporary...
  var self = this
  var flag1 = ''; //first stage check
  var flag2 = ''; //second stage check
  var flag3 = ''; //third stage check

  $(document).on("click",".option_a",function(e){
    e.preventDefault()
    console.log('option A')
    $('.storyboardContainer').css({left:'0'})
    flag1 = 'insatsu'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  $(document).on("click",".option_b",function(e){
    e.preventDefault()
    console.log('option B')
    $('.storyboardContainer').css({left:'-200%'})
    flag1 = 'ringo'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_c",function(e){
    e.preventDefault()
    console.log('option C')
    $('.storyboardContainer').css({left:'0', top:'-100%'})
    flag2 = 'insatsu'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_d",function(e){
    e.preventDefault()
    console.log('option d')
    $('.storyboardContainer').css({left:'0', top:'-100%'})
    flag2 = 'ringo'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_e",function(e){
    e.preventDefault()
    console.log('option e')
    $('.storyboardContainer').css({left:'-200%', top:'-100%'})
    flag2 = 'insatsu'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_f",function(e){
    e.preventDefault()
    console.log('option f')
    $('.storyboardContainer').css({left:'-200%', top:'-100%'})
    flag2 = 'ringo'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create insatsu
  $(document).on("click",".option_g",function(e){
    e.preventDefault()
    console.log('option g')
    flag3 = 'insatsu'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_h",function(e){
    e.preventDefault()
    console.log('option h')
    flag3 = 'ringo'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create insastsu
  $(document).on("click",".option_i",function(e){
    e.preventDefault()
    console.log('option i')
    flag3 = 'insatsu'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_j",function(e){
    e.preventDefault()
    console.log('option j')
    flag3 = 'ringo'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })



  function createPet(petType){
    console.log('Create Pet function Firing')
    var nameofpet = ''
    $('.petname').each(function(){
      console.log($(this).val())
      if ($(this).val() == ''){

      }else{
        nameofpet = $(this).val()
        return false;
      }
    })

    $.ajax({
  		type: 'POST',
  		data: 'uid='+localStorage.getItem("userID")+'&pn='+nameofpet+'&pt='+petType,
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghCreatePet.ashx',
  		success: function(data){
  			console.log(data);
        console.log('pet created')
        localStorage.setItem("petName", nameofpet);
        localStorage.setItem("petType", petType);
        localStorage.setItem("hasPet", true);
        self.loadPet(localStorage.getItem("userID"))
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

  }

  //Create Ringo
  $(document).on("click",".createPet",function(e){
    e.preventDefault()
    if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      console.log('Create Pet INSATSU //')
      createPet(1)
    }else if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'ringo'){
      console.log('Create Pet INSATSU //')
      createPet(1)
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'insatsu'){
      console.log('Create Pet INSATSU //')
      createPet(1)
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'ringo'){
      console.log('Create Pet RINGO //')
      createPet(2)
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'ringo'){
      console.log('Create Pet RINGO //')
      createPet(2)
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'ringo'){
      console.log('Create Pet RINGO //')
      createPet(2)
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      console.log('Create Pet INSATSU //')
      createPet(1)
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'insatsu'){
      console.log('Create Pet RINGO')
      createPet(2)
    }else{
      console.log('error, you\'ve somehow chosen an option I didn\'t think of.')
    }
  })
}

//Load pet data
Core.prototype.loadPet = function(uid){
  var self = this

  console.log('Loading Pet')

  $.ajax({
    type: 'POST',
    data: 'uid='+uid,
    async: false,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://applegotchi.co.uk/Ajax/ghPets.ashx',
    success: function(data){
      console.log(data);
      if (data.length == 1){
        if (data[0].pt == 2){
          //Ringo
          self.petNamedType = 'ringo'
          localStorage.setItem("petNamedType", "ringo")
        }else{
          //Insatsu
          localStorage.setItem("petNamedType", "insatsu")
          self.petNamedType = 'insatsu'
        }


        $('.speechBubble').attr('src','img/'+self.petNamedType+'-speech.png')
        $('.petName').html(data[0].pn)

        $('.mainPanel').show().removeClass('insatsuBackground').removeClass('ringoBackground').addClass(self.petNamedType+'Background')

        $('.petMain').removeClass('stage1').removeClass('stage2').removeClass('stage3').removeClass('stage4').removeClass('stage5').removeClass('stage6')
        $('.petMain').attr('src', 'img/'+self.petNamedType+'/'+self.petNamedType+'-'+self.currentMood+'-stage'+data[0].pl+'.png').addClass('stage'+data[0].pl)

        $('.petStage6ArmLeft').attr('src','img/'+self.petNamedType+'/'+self.petNamedType+'-leftarm.png')
        $('.petStage6ArmLeft').removeClass('petStage6ArmLeft_insatsu').removeClass('petStage6ArmLeft_ringo').addClass('petStage6ArmLeft_'+self.petNamedType)

        $('.petStage6ArmRight').attr('src','img/'+self.petNamedType+'/'+self.petNamedType+'-rightarm.png')
        $('.petStage6ArmRight').removeClass('petStage6ArmRight_insatsu').removeClass('petStage6ArmRight_ringo').addClass('petStage6ArmRight_'+self.petNamedType)

        console.log(data[0].pl, self.petNamedType)
        if (data[0].pl == 6 && self.petNamedType == 'insatsu'){
          $('.petStage6ArmLeft_insatsu').show()
          $('.petStage6ArmRight_insatsu').show()
          $('.petStage6ArmLeft_ringo').hide()
          $('.petStage6ArmRight_ringo').hide()

        }else if (data[0].pl == 6 && self.petNamedType == 'ringo'){
          $('.petStage6ArmLeft_insatsu').hide()
          $('.petStage6ArmRight_insatsu').hide()
          $('.petStage6ArmLeft_ringo').show()
          $('.petStage6ArmRight_ringo').show()
        }else{

        }

        //1 == play
        //0  == stop
        if (localStorage.getItem('music') == '1'){
          $('.menuMusic').get(0).pause()
          $('.gameMusic').get(0).play()

        }else if (localStorage.getItem('music') == '0'){
          $('.menuMusic').get(0).pause()
          $('.gameMusic').get(0).pause()
          $('.toggleMusic').addClass('disabledAudio')
        }else{
          localStorage.setItem('music', "1")
          $('.menuMusic').get(0).pause()
          $('.gameMusic').get(0).play()
        }

        if (localStorage.getItem('sound') == '1'){
          window.localStorage.setItem('sound', '0')
        }else{
          window.localStorage.setItem('sound', '1')
        }

        self.updateActionLevels(uid,'firstload')
      }else{
        console.log('retreievePetData has been fired, but there\'s no pet data to recall')
        localStorage.clear();
      }

    },
    error: function(){
      console.log('Error registering user.')
    }
  });
};

//Update current action levels of pet (and score)
Core.prototype.updateActionLevels = function(uid,firstLoad){
  var self = this

  var prevPetLevel = localStorage.getItem("petLevel")

  $.ajax({
    type: 'POST',
    data: 'uid='+uid,
    async: false,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://applegotchi.co.uk/Ajax/ghPets.ashx',
    success: function(data){
      console.log(data);
      if (data.length == 1){
        localStorage.setItem("cleanStatus", data[0].cs)
        localStorage.setItem("foodStatus", data[0].fs)
        localStorage.setItem("funStatus", data[0].ps)
        localStorage.setItem("petLevel", data[0].pl)
        localStorage.setItem("petPoints", data[0].pp)
        localStorage.setItem("petType", data[0].pt)
        localStorage.setItem("petName", data[0].pn)
        localStorage.setItem("petID", data[0].pid)
        localStorage.setItem("userID", data[0].uid)
        localStorage.setItem("hasPet", true);

        //TODO: RENABLE
        self.initPushwoosh(localStorage.getItem("emailaddress"),data[0].pl,true)
        //console.log(firstLoad)

        if (prevPetLevel != data[0].pl && data[0].pl > 1 && firstLoad != 'firstload'){
          $('.levelupPanel').show()
        }

        if(localStorage.getItem('isKill') == 1){
          self.currentMood = 'dead';
          $('.petStage6ArmLeft_insatsu').hide()
          $('.petStage6ArmRight_insatsu').hide()
          $('.petStage6ArmLeft_ringo').hide()
          $('.petStage6ArmRight_ringo').hide()
        }else if ((data[0].cs + data[0].fs + data[0].ps) >= 200){
          self.currentMood = 'happy';
        }else if ((data[0].cs + data[0].fs + data[0].ps) > 100 && (data[0].cs + data[0].fs + data[0].ps) < 200 ){
          self.currentMood = 'meh';
        }else{
          self.currentMood = 'sad';
        }

        $('.petMain').attr('src', 'img/'+localStorage.getItem("petNamedType")+'/'+localStorage.getItem("petNamedType")+'-'+self.currentMood+'-stage'+data[0].pl+'.png').addClass('stage'+data[0].pl)
        $('.petMain').removeClass('stage'+(data[0].pl-1))
        $('.petMain').removeClass('stage'+(data[0].pl-2))
        $('.petMain').removeClass('stage'+(data[0].pl-3))
        $('.petMain').removeClass('stage'+(data[0].pl-4))
        $('.petMain').removeClass('stage'+(data[0].pl-5))

        $('.statusFood>.statusLevel').css({height:data[0].fs+'%'})
        $('.statusEntertain>.statusLevel').css({height:data[0].ps+'%'})
        $('.statusClean>.statusLevel').css({height:data[0].cs+'%'})
        $('.currentScore').html(data[0].pp)


      }else{
        console.log('retreievePetData has been fired, but there\'s no pet data to recall')
      }

    },
    error: function(){
      console.log('Error registering user.')
    }
  });
}

//Pet Action: Feeding
Core.prototype.actionFeed = function(stage){
  var self =  this
  var petStage = stage
  $('.buttonContainer a').addClass('killLink')
  $('.petFood').show()
  $('.petFood').addClass('stage'+petStage+'_foodDrop')

  //1 == play
  //0  == stop
  if (localStorage.getItem('sound') == '1'){
    var audio = new Audio('audio/eat.mp3');
    audio.play();
  }else if (localStorage.getItem('sound') == '0'){

  }else{
    localStorage.setItem('sound', "1")
  }

  setTimeout(function(){
    $('.petFood').hide()
    //$('.petFood').removeClass('stage'+petStage+'_foodDrop')
    $('.buttonContainer a').removeClass('killLink')

    $.ajax({
  		type: 'POST',
  		data: 'pid='+localStorage.getItem('petID')+'&t=f',
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghAction.ashx',
  		success: function(data){
  			console.log(data);
        self.updateActionLevels(localStorage.getItem('userID'),null)
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

  },2000)


}

//Pet Action: Cleaning
Core.prototype.actionClean = function(stage){
  var self =  this
  var petStage = stage

  //1 == play
  //0  == stop
  if (localStorage.getItem('sound') == '1'){
    var audio = new Audio('audio/bubbles.mp3');
    audio.play();
  }else if (localStorage.getItem('sound') == '0'){

  }else{
    localStorage.setItem('sound', "1")
  }

  $('.buttonContainer a').addClass('killLink')
  $('.water').show()
  $('.cleaningBubblesLayer1').fadeIn()
  $('.cleaningBubblesLayer1').addClass('animateBubbles1')
  setTimeout(function(){
    $('.cleaningBubblesLayer4').fadeIn()
    $('.cleaningBubblesLayer4').addClass('animateBubbles4')
  },300)
  setTimeout(function(){
    $('.cleaningBubblesLayer5').fadeIn()
    $('.cleaningBubblesLayer5').addClass('animateBubbles5')
  },400)
  setTimeout(function(){
    $('.cleaningBubblesLayer2').fadeIn()
    $('.cleaningBubblesLayer2').addClass('animateBubbles2')
  },300)
  setTimeout(function(){
    $('.cleaningBubblesLayer3').fadeIn()
    $('.cleaningBubblesLayer3').addClass('animateBubbles1')
  },500)
  setTimeout(function(){
    $.ajax({
  		type: 'POST',
  		data: 'pid='+localStorage.getItem('petID')+'&t=c',
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghAction.ashx',
  		success: function(data){
  			console.log(data);
        self.updateActionLevels(localStorage.getItem('userID'),null)
        $('.water').hide()
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

    $('.animateBubbles1').removeClass('animateBubbles1')
    $('.animateBubbles2').removeClass('animateBubbles2')
    $('.animateBubbles4').removeClass('animateBubbles4')
    $('.animateBubbles5').removeClass('animateBubbles5')
    $('.buttonContainer a').removeClass('killLink')
  },4000)

}

//Pet Action: Entertain
Core.prototype.actionEntertain = function(stage){
  var self =  this
  var petStage = stage
  $('.entertainStreamers img').show()
  $('.buttonContainer a').addClass('killLink')

  //1 == play
  //0  == stop
  if (localStorage.getItem('sound') == '1' && self.currentMood == 'happy' || localStorage.getItem('sound') == '1' && self.currentMood == 'meh'){
    var audio = new Audio('audio/happy.mp3');
    audio.play();
  }else if (localStorage.getItem('sound') == '1' && self.currentMood == 'sad'){
    var audio = new Audio('audio/sad.mp3');
    audio.play();
  }else if (localStorage.getItem('sound') == '0'){

  }else{
    localStorage.setItem('sound', "1")
  }

  setTimeout(function(){
    $.ajax({
  		type: 'POST',
  		data: 'pid='+localStorage.getItem('petID')+'&t=p',
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghAction.ashx',
  		success: function(data){
  			console.log(data);
        self.updateActionLevels(localStorage.getItem('userID'),null)
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

    $('.entertainStreamers img').hide()
    $('.buttonContainer a').removeClass('killLink')
  },4000)


}

//TEMP SHIT DELETE THIS WHEN YO DONE
Core.prototype.buildFunctionsDelete = function(){
  var self = this
  // +++ DELETE THIS FOR PRODUCTION +++

  $(document).on("click",".skipLoading",function(e){
    $('.registerLoginPanel').show()

    if (localStorage.getItem('music') == '1'){
      $('.menuMusic').get(0).play()
    }else if (localStorage.getItem('music') == '0'){
      $('.menuMusic').get(0).pause()
    }else{
      $('.menuMusic').get(0).pause()
    }


  })

  $(document).on("click",".creationBypass",function(e){
    // self.creationStory();
    // $('.storyboardPanel').show()
    e.preventDefault()

  })


}

//omg kill yo pet
Core.prototype.petMurder = function(){

  function kill(buttonIndex) {
    console.log('login failure loop'+buttonIndex)
    if (buttonIndex == 2){
      alert('this function will kill pet')
      localStorage.clear();
      $('.menuPanel').hide()
      $('.mainPanel').hide()
      $('.storyboardPanel').hide()
      $('.registerLoginPanel').removeClass('displaceBackgroundLogin')
      $('.registerLoginContainer').removeClass('registerLoginReduce')
      $('.slideLogin').hide()

      //Call unregister
      self.initPushwoosh(null, null, false, true)
    }
  }

  navigator.notification.confirm('Please don\'t kill your pet. Just feed them, entertain them and keep them clean and they will be happy!', kill, 'Commit peticide', ['I\'ve changed my mind!','Kill my pet'])


}

Core.prototype.speechBubble = function(message){
  var self = this
  $('.speechBubble').show()
  $('.speechBubbleText').addClass('showSpeechText').html(message)

  $(document).on("click",".speechBubbleContainer",function(e){
    $('.speechBubble').addClass('shrinkBubble')
    setTimeout(function(){
      $('.speechBubble').hide()
      $('.speechBubble').removeClass('shrinkBubble')
    },1000)
    $('.speechBubbleText').removeClass('showSpeechText')
  })

}

Core.prototype.initPushwoosh = function(email,petLevel,setTags,unRegister){
  var self = this

  //FYI ///////////////////////////////////////////////////////////////
  //Email = users email, petLevel = pets level and setTags = true/false
  //If setTags == true, it will set the tags
  //If setTags == false, register device will fire && tags will be set.
  //If unRegister == true, un-register the user

  //navigator.notification.alert('Success!', null, 'Pushwoosh CORE Initialised', 'ok')
  console.log('line711: '+email+'_'+petLevel+'_'+setTags+'_'+unRegister)

  var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

  pushNotification.onDeviceReady({
    projectid: "364045976404", // GOOGLE_PROJECT_ID
    pw_appid : "4FF24-5ACEC" // PUSHWOOSH_APP_ID
  });

  function setTagsFunc(email,petLevel){
    console.log(email+' : '+petLevel)
    pushNotification.setTags(
    {
      "emailaddress":email,
      "petlevel":petLevel
    },
      function(status) {
          console.log('setTags success '+status);

          pushNotification.getTags(function(tags) {
            console.log('Returned Tags: ' + JSON.stringify(tags));
            },
            function(error) {
              console.warn('get tags error: ' + JSON.stringify(error));
            }
          );
      },
      function(status) {
          console.warn('setTags failed'+status);
      }
    );
  }//end func

  //If we're calling set tags only set tags, don't call register etc
  if (setTags === true){
    setTagsFunc(email,petLevel)

  //else assume we're registering
  }else if(unRegister === true){
    console.log('Attempting unregister...')
    PushNotification.unregisterDevice (
      function(token){
          console.log("unregistered success!" + token);
      },
      function(status){
          console.log("unregistered failed!" + status);
      })
  }else{
    //TRIGGERED WHEN NOTIFICATIONS RECIEVED IN APP
    document.addEventListener('push-notification', function(event) {
      var notification = event.notification;
      console.log('push message recieved');
      pushNotification.setApplicationIconBadgeNumber(0);
      self.speechBubble(notification.aps.alert)
      //navigator.notification.alert(notification.aps.alert, null, 'Your pet says...', 'OK')
    });

    //register for pushes
    pushNotification.registerDevice(
      function(status) {
        var deviceToken = status['deviceToken'];
        console.log('registerDevice: ' + deviceToken);
        setTagsFunc(email)
      },
      function(status) {
        navigator.notification.alert('Connection error', null, 'Error', 'Continue')

        console.log('failed to register : ' + JSON.stringify(status));
        alert(JSON.stringify(['failed to register ', status]));
      }
    );
  }

}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        console.log('device initialise')
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log('device ready')
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

////////FIRE ON DEVICE READY
document.addEventListener("deviceready", OnDeviceReady, false);
function OnDeviceReady()    {
  console.log('device is ready')
  window.plugin.notification.badge.clear();//clear notification badges
}

////////FIRE ON DEVICE OFFLINE
document.addEventListener("offline", onOffline, false);
function onOffline() {
  navigator.notification.alert('Uhoh, it looks like you\'re offline! Please re-connect to the internet!', null, 'Connectivity error', 'Continue')
}

////////BOOT CORE
var Core = new Core();
