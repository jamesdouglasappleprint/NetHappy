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


// navigator.notification.alert('Thanks for registering! You can now log in using your email and password', null, 'Registration Success!', 'Continue')
//navigator.notification.confirm('User not found. Please check your login details and try again!', loginFailure, 'Login failure', ['Retry','Cancel'])
//localStorage.clear();
//Call unregister
//core.initPushwoosh(null, null, false, true)

function Core(){
  console.log('Core Loaded');
  var core = this;

  core.init();
  core.logIn();
  core.appCoreClickEvents();
  core.loadCoreData();
  console.log('Clearing Badges')
  window.plugin.notification.badge.clear(); //clear badge notifications


}

//Initialiser
Core.prototype.init = function (x) {
  var core = this

  var value = window.localStorage.getItem("stayloggedon")

  if( value == 1){
    $('.appContainer').load("home.html")
    $('.navigateBack').hide()
    $('.prelaunchButtons').hide()
    $('.socialStrip').show()
    //BDM Data load
    core.getBdmData()
    //User Data

  }else{
    $('.navigateBack').hide()
    $('.prelaunchButtons').show()
    $('.socialStrip').hide()
    $('.appContainer').load("login.html")
  }

};

Core.prototype.GoogleMap = function () {
  var core = this;

  this.initialize = function(coords){
    var splitCoord = coords.split(',')
    var firstCoord = splitCoord[0]
    var secondCoord = splitCoord[1]
    //console.log(firstCoord,secondCoord)
    //console.log('running map',coords)
    var myLatlng = new google.maps.LatLng(firstCoord,secondCoord);
    var mapOptions = {
      zoom: 16,
      center: myLatlng,
      disableDefaultUI: true
    }
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Location'
    });
  }
}

Core.prototype.appCoreClickEvents = function () {
  var core = this;

  //Refire the getcalenderdata if the user clicks previous or next, so we can repopulate the calender with attached events for the month
  $(document).on("click",".ui-datepicker-prev",function(e){
    core.getCalenderData()
  })

  $(document).on("click",".ui-datepicker-next",function(e){
    core.getCalenderData()
  })

  //get category
  $(document).on("click",".listGrandParentAnchor",function(e){
    //console.log('grandparent clicked')
    var category = $(this).data('target')
    var trigger = $(this).parent().html().replace('listGrandParentAnchor','listGrandParentAnchorReturn')
    $('.appContainer').fadeOut('fast')
    core.getCategory(category,trigger)
    $('.contentContainer').show()
    $('.actions').hide()
    $('.menuButton').show()
    $('.myBdmMenu').hide()
    $('.fourthLevelContainer').hide()
  })

  //Return to parent item
  $(document).on("click",".listGrandParentAnchorReturn",function(e){
    $('.appContainer').fadeIn('fast')
    $('.contentContainer').hide()
    $('.actions').hide()
    $('.menuButton').hide()
  })

  //Return to parent item
  $(document).on("click",".listChild",function(e){
    $('.contentContainer').fadeIn('fast')
    $('.postContainer').hide()
    $('.actions').hide()
  })

  //Return to parent item
  $(document).on("click",".menuButton",function(e){
    $('.appContainer').toggle()
    $('.myBdmMenu').hide()
  })

  //REVEAL SOCIAL MODAL ON CLICK
  $(document).on("click",".shareThis",function(e){
    $('.socialModal').show()
  })

  //SHARE LINK OF SINGLE POST ON FACEBOOK
  $(document).on("click",".shareOnFacebook",function(e){
    var link = $(this).data('link')
    window.open('http://www.facebook.com/sharer.php?u='+link, '_system')
    $('.socialModal').hide()
  })

  //SHARE LINK OF SINGLE POST ON TWITTER
  $(document).on("click",".shareOnTwitter",function(e){
    var link = $(this).data('link')
    window.open('https://twitter.com/intent/tweet?url='+link, '_system')
    $('.socialModal').hide()
  })

  //SHARE LINK OF SINGLE POST ON LINKED IN
  $(document).on("click",".shareOnLinkedin",function(e){
    var link = $(this).data('link')
    window.open('https://www.linkedin.com/shareArticle?url='+link, '_system')
    $('.socialModal').hide()
  })

  //CLOSE SOCIAL MODAL BOX
  $(document).on("click",".closeSocialModal",function(e){
    $('.socialModal').hide()
  })

  $(document).on("click",".thirdLevelReturn",function(e){
    $('.contentContainer').hide()
  })

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // GENERATE SINGLE ARTICLE /////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  $(document).on("click",".listParentAnchor",function(e){
    core.areWeConnected()
    $('.actions').fadeIn('fast')
    $('.externalLink').show()
    $('.shareThis').show()
    $('.downloadItem').show()

    //console.log('parent clicked')
    var that = $(this).html()
    var parentCat = $(this).parent().parent().attr('data-category')
    var img = $(this).parent().parent().find('.listParent>.listGrandParentAnchorReturn>img').attr('src')
    var data = JSON.parse(window.localStorage.getItem('category'+parentCat))
    var postRef = $(this).parent().data('post')
    var itemTitle = data.posts[postRef].title

    //Check to see if the data we're pulling per post has been defined, if it hasn't been defined set the variable as false so we can dump a blank string into the append
    if (data.posts[postRef].thumbnail_images != undefined){var thumbnail = data.posts[postRef].thumbnail_images.full.url}else{var thumbnail = false}
    ///////////////
    if (data.posts[postRef].custom_fields.Link != undefined){
      var link = data.posts[postRef].custom_fields.Link[0]
      //add button to post if we do have a link
      $('.externalLink').show()
      $('.shareThis').show()
      var siteLink = '<a href="#" class="visitSiteLink externalLink"><i class="fa fa-sign-in"></i> Visit Website</a>'

    }else{
      $('.externalLink').hide()
      $('.shareThis').hide()
      var siteLink = ''
    }
    ///////////////
    if (data.posts[postRef].custom_fields.Download != undefined){
      var download = data.posts[postRef].custom_fields.Download[0]
    }else{
      $('.downloadItem').hide()
    }
    ///////////////
    if (data.posts[postRef].custom_fields.Event != undefined){
      var events = data.posts[postRef].custom_fields.Event[0]
      $('.addEventToCalender').show()
      var eventLink = '<a href="#" class="addPostEvent"><i class="fa fa-calendar"></i> Add to Calendar</a>'
    }else{
      $('.addEventToCalender').hide()
      var eventLink = ''
    }
    ///////////////
    if (data.posts[postRef].custom_fields.Event_Start_Date != undefined){
      var eventStart = data.posts[postRef].custom_fields.Event_Start_Date[0]
      $('.actions').hide()
      var eventFullLink = '<a href="#" class="addFullEvent"><i class="fa fa-calendar"></i> Add to Calendar</a>'
      var firstdate = returnDayMonth(data.posts[postRef].custom_fields.Event_Start_Date[0])
      var lastdate = returnDayMonth(data.posts[postRef].custom_fields.Event_End_Date[0])
      var completeddatestring = firstdate+' - '+lastdate
    }else{
      var eventFullLink = ''
    }
    ///////////////
    if (data.posts[postRef].custom_fields.Event_End_Date != undefined){var eventEnd = data.posts[postRef].custom_fields.Event_End_Date[0]}else{var eventEnd = false}
    ///////////////
    if (data.posts[postRef].custom_fields.Event_Registration_Link != undefined){
      var register = data.posts[postRef].custom_fields.Event_Registration_Link[0]
      var registerLink = '<a href="#" class="registerForEvent"><i class="fa fa-check"></i> Register</a>'
    }else{
      var registerLink = ''
    }
    if (data.posts[postRef].custom_fields.Google_Maps_Coordinates != undefined){var coords = data.posts[postRef].custom_fields.Google_Maps_Coordinates[0]}else{var coords = false}
    ///////////////
    if (data.posts[postRef].custom_fields.Collateral_data_sheets != undefined){
      var datasheets = ''
      for (i = 0; i < data.posts[postRef].custom_fields.Collateral_data_sheets.length; i++) {
        var array = data.posts[postRef].custom_fields.Collateral_data_sheets[i].split(",");
        datasheets+= '<li><p>'+array[0]+'</p><a href="#" class="dataSheetAnchor" data-url="'+array[1]+'"><i class="fa fa-eye"></i></a><a href="#" class="dataSheetShareAnchor" data-url="'+array[1]+'"><i class="fa fa-share-alt"></i></a></li>'
      }
      datasheet = "<ul class='customFieldDatasheets'>"+datasheets+"</ul>"
    }else{
      var datasheets = ''
    }
    ///////////////
    if (data.posts[postRef].custom_fields.Collateral_case_study != undefined){
      var casestudies = ''
      for (i = 0; i < data.posts[postRef].custom_fields.Collateral_case_study.length; i++) {
        var array = data.posts[postRef].custom_fields.Collateral_case_study[i].split(",");
        casestudies+= '<li><p>'+array[0]+'</p><a href="#" class="dataSheetAnchor" data-url="'+array[1]+'"><i class="fa fa-eye"></i></a><a href="#" class="dataSheetShareAnchor" data-url="'+array[1]+'"><i class="fa fa-share-alt"></i></a></li>'
      }
      casestudy = "<ul class='customFieldDatasheets'>"+casestudies+"</ul>"
    }else{
      var casestudies = ''
    }
    ///////////////
    if (data.posts[postRef].custom_fields.Collateral_white_paper != undefined){
      var whitepapers = ''
      for (i = 0; i < data.posts[postRef].custom_fields.Collateral_white_paper.length; i++) {
        var array = data.posts[postRef].custom_fields.Collateral_white_paper[i].split(",");
        whitepapers+= '<li><p>'+array[0]+'</p><a href="#" class="dataSheetAnchor" data-url="'+array[1]+'"><i class="fa fa-eye"></i></a><a href="#" class="dataSheetShareAnchor" data-url="'+array[1]+'"><i class="fa fa-share-alt"></i></a></li>'
      }
      whitepaper = "<ul class='customFieldDatasheets'>"+whitepapers+"</ul>"
    }else{
      var whitepapers = ''
    }

    //console.log('line 206 index.js',data.posts[postRef])

    //Convert the dates to the day-month format used in the single-page event
    function returnDayMonth(str){
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      var eventDay    = str.substr(0, 2);
      var eventMonth  = (str.substr(2, 3).replace('/0','').replace('/1','1'))-1;
      return eventDay+' '+months[eventMonth]
    }

    $('.shareOnFacebook').attr('data-link',link)
    $('.shareOnTwitter').attr('data-link',link)
    $('.shareOnLinkedin').attr('data-link',link)
    $('.contentContainer').fadeOut('fast')
    //Check which type of post we're generating
    if (parentCat == 4){
    //Events
      $('.postContainer').html('<div class="postInner"><div class="tabTitle tabSelected" data-tab="1"><p>Info</p></div><div class="tabTitle googleMapTab" data-tab="2"><p>Location</p></div><div class="tabPanel tab1"><h5>'+completeddatestring+'</h5><h6>'+data.posts[postRef].custom_fields.Event_Location[0]+'</h6>'+data.posts[postRef].content+'<div class="additionalLinks">'+siteLink+registerLink+eventFullLink+'</div></div><div class="tabPanel tab2"><div id="map-canvas"></div><p>'+data.posts[postRef].custom_fields.Event_Location[0]+'</p></div></div>').prepend("<ul class='listParentReturn'><li class='listParent'><a href='#' class='listChild'><img src="+img+" class='menuIcon'>"+that.replace('<i class="fa fa-calendar-o listCalendarIcon"></i>','').replace('fa-chevron-right','fa-chevron-left')+"</a></li></ul>")
    }else if (parentCat == 7){
      $('.actions').hide()
    //Collateral
      $('.postContainer').html('<div class="postInner collateralInner"><div class="postThumbnail"></div><div class="tabTitle tabSelected" data-tab="1"><p>Info</p></div><div class="tabTitle" data-tab="2"><p>Case Studies</p></div><div class="tabTitle" data-tab="3"><p>Data Sheets</p></div><div class="tabTitle" data-tab="4"><p>White Papers</p></div><div class="tabPanel tab1">'+data.posts[postRef].content+'</div><div class="tabPanel tab2">'+casestudy+'</div><div class="tabPanel tab3">'+datasheet+'</div><div class="tabPanel tab4">'+whitepaper+'</div><div class="additionalLinks">'+siteLink+eventLink+'</div></div>').prepend("<ul class='listParentReturn'><li class='listParent'><a href='#' class='listChild'><div class='menuIcon'><i class='fa fa-folder-open'></i></div>"+that.replace('fa-chevron-right','fa-chevron-left')+"</a></li></ul>")
    }else if (parentCat == 2){
      //eShot / recent communications
      $('.postContainer').html('<div class="postInner eshot"><div class="postThumbnail"></div>'+data.posts[postRef].content+'<div class="additionalLinks">'+siteLink+eventLink+'</div></div>').prepend("<ul class='listParentReturn'><li class='listParent'><a href='#' class='listChild'><div class='menuIcon'><i class='fa fa-envelope-square'></i></div>"+that.replace('fa-chevron-right','fa-chevron-left')+"</a></li></ul>")
      $('.socialStrip').show()
      $('.actions').hide()
    }else if (parentCat == 9){
      //Contact
      $('.postContainer').html('<div class="postInner"><div class="postThumbnail"></div><div class="postContactHeadshot"><img src="'+data.posts[postRef].custom_fields.Contact_Avatar[0]+'"></div><div class="postContactName"><h4>'+data.posts[postRef].title+'</h4><p>'+data.posts[postRef].custom_fields.Contact_Job_Title[0]+'</p></div>'+data.posts[postRef].content+'<div class="additionalLinks">'+siteLink+eventLink+'</div></div>').prepend("<ul class='listParentReturn'><li class='listParent thirdLevelReturn'><a href='#' class='listChild'><div class='menuIcon'><i class='fa fa-phone'></i></div>"+that.replace('fa-chevron-right','fa-chevron-left')+"</a></li></ul>")
    }else if (parentCat == 6){
      //Quick Enablement
      $('.postContainer').html('<div class="postInner"><div class="postThumbnail"></div>'+data.posts[postRef].content+'</div>').prepend("<ul class='listParentReturn'><li class='listParent thirdLevelReturn'><a href='#' class='listChild'><div class='menuIcon'><i class='fa fa-graduation-cap'></i></div>"+that.replace('fa-chevron-right','fa-chevron-left')+"</a></li></ul>")
    }else if (parentCat == 3){
      //Promotions
      var link = ""
       if (data.posts[postRef].custom_fields.Promotion_link == undefined ){
        link =  ""
      }else{
        link = '<a class="promotionsFindOutMore" href="'+data.posts[postRef].custom_fields.Promotion_link[0]+'">Find out more</a>'
      }

      $('.postContainer').html('<div class="postInner"><div class="promotionsTopBar"><div class="promotionsAvTo"><p class="promotionsTitles">Available To</p>'+data.posts[postRef].custom_fields.Promotion_availableto[0]+'</div><div class="promotionsValFrom"><p class="promotionsTitles">Valid From</p>'+data.posts[postRef].custom_fields.Promotion_valid_from[0]+'</div><div class="promotionsValTo"><p class="promotionsTitles">Valid To</p>'+data.posts[postRef].custom_fields.Promotion_valid_to[0]+'</div></div><div class="promotionsDetails">'+data.posts[postRef].custom_fields.Promotion_details[0]+'</div>'+data.posts[postRef].content+link+'</div>').prepend("<ul class='listParentReturn'><li class='listParent'><a href='#' class='listChild'><img src="+img+" class='menuIcon'>"+that.replace('fa-chevron-right','fa-chevron-left')+"</a></li></ul>")
      $('.socialStrip').show()
      $('.actions').hide()
    }else{
      $('.postContainer').html('<div class="postInner"><div class="postThumbnail"></div>'+data.posts[postRef].content+'<div class="additionalLinks">'+siteLink+eventLink+'</div></div>').prepend("<ul class='listParentReturn'><li class='listParent'><a href='#' class='listChild'><img src="+img+" class='menuIcon'>"+that.replace('fa-chevron-right','fa-chevron-left')+"</a></li></ul>")
    }



    $('.postContainer').show()
    $('.postThumbnail').css({background:'url('+thumbnail+')','background-size':'cover', 'background-position':'center'})
    $('.externalLink').click(function(e){
      e.preventDefault()
      var source = $(this).parent().parent().prev().find('h2').text()
      core.logContent('external',link, source);
      window.open(link, '_system')
    })

    $('.promotionsFindOutMore').click(function(e){
      e.preventDefault()
      var link = $(this).attr('href')

      var source = $(this).parent().prev().find('h2').text()
      core.logContent('findoutmore',link, source);

      window.open(link, '_system')

    })

    $('.downloadItem').click(function(e){
      //console.log('Downloading Item...')
      window.open(download, '_system')
    });

    //If a data sheet is downloaded//opened
    $('.dataSheetAnchor').click(function(){
      var url = $(this).data('url')
      var source = $(this).parent().parent().parent().parent().prev().find('h2').text()
      var item = $(this).prev().text()
      core.logContent('downloadcollateral',item, source);

      window.open(url, '_system')
    });

    //If a data sheet is shared
    $('.dataSheetShareAnchor').click(function(){
      var url = $(this).data('url')
      var source = $(this).parent().parent().parent().parent().prev().find('h2').text()
      var item = $(this).prev().prev().text()
      core.logContent('sharedcollateral',item, source);

      $('.shareOnFacebook').attr('data-link',url)
      $('.shareOnTwitter').attr('data-link',url)
      $('.shareOnLinkedin').attr('data-link',url)
      $('.socialModal').show()
    });

    $('.tabTitle').click(function(){
      var target = $(this).data('tab')
      $('.tabPanel').hide()
      $('.tab'+target).show()
      $('.tabTitle').removeClass('tabSelected')
      $(this).addClass('tabSelected')
    })

    $('.googleMapTab').click(function(){
      var map = new core.GoogleMap();
          map.initialize(coords);
    })

    $('.registerForEvent').click(function(){
      var url = data.posts[postRef].custom_fields.Event_Registration_Link[0]

      var source = $(this).parent().parent().parent().prev().find('h2').text()
      core.logContent('registerforevent',url, source);

      window.open(url, '_system')
    });

    $('.addFullEvent').click(function(){
      //console.log('Creating quick calendar event')

      var source = $(this).parent().parent().parent().prev().find('h2').text()
      core.logContent('addtocalendar',null, source);

      var eventDay    = eventStart.substr(0, 2);
      var eventMonth  = (eventStart.substr(2, 3).replace('/0','').replace('/1','1'))-1;
      var eventYear   = eventStart.substr(6, 4);

      var endDay    = eventEnd.substr(0, 2);
      var endMonth  = (eventEnd.substr(2, 3).replace('/0','').replace('/1','1'))-1;
      var endYear   = eventEnd.substr(6, 4);

      var startDate = new Date(eventYear,eventMonth,eventDay,12,00,0,0,0); // beware: month 0 = january, 11 = december
      var endDate = new Date(endYear,endMonth,endDay,12,00,0,0,0);
      //console.log('startdate'+startDate, 'endDate'+endDate)
      var title = itemTitle;
      var eventLocation = "";
      var notes = "";
      var success = function(message) {
        navigator.notification.alert('The event has been added to your calendar', null, 'Event added', 'Ok')
      };
      var error = function(message) {
        navigator.notification.alert('An error has occured', null, 'Event not added', 'Ok')
      };
      //Add the event
      core.addDirectEvent(startDate,endDate,title,eventLocation,notes,success,error)
    })

    //Add quick event from post (click the button, calendar event dumped straight into calendar)
    $('.addPostEvent').click(function(){

     // console.log('Creating quick calendar event')
      var eventDay    = events.substr(0, 2);
      var eventMonth  = (events.substr(2, 3).replace('/0','').replace('/1','1'))-1;
      var eventYear   = events.substr(6, 4);
      var startDate = new Date(eventYear,eventMonth,eventDay,12,00,0,0,0); // beware: month 0 = january, 11 = december
      var endDate = new Date(eventYear,eventMonth,eventDay,12,00,0,0,0);
      //console.log('startdate'+startDate, 'endDate'+endDate)
      var title = itemTitle;
      var eventLocation = data.posts[postRef].custom_fields.Event_Location;
      var notes = "";
      var success = function(message) { triggerAlert('<i class="fa fa-calendar"></i>','The event has been added to your calendar','Ok','');};
      var error = function(message) { triggerAlert('<i class="fa fa-calendar"></i>','An Error has occured!','Ok','');};
      //Add the event
      core.addDirectEvent(startDate,endDate,title,eventLocation,notes,success,error)
    })
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  })///END OF CLICK FOR POST GENERATION //////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  core.setContainerHeight()




}

Core.prototype.setContainerHeight = function(){
  var core = this
 // console.log('setting container height')
  var docHeight = $(document).height()
  var maths = docHeight-120
  $('.appContainer').css({height:maths+"px"})
  $('.contentContainer').css({height:maths+"px"})
  $('.postContainer').css({height:maths+"px"})
  $('.thirdLevelContainer').css({height:maths+"px"})
  $('.fourthLevelContainer').css({height:maths+"px"})
  $('.settingsMenu').css({height:maths+"px"})
  $('.myBdmMenu').css({height:maths+"px"})
}

//third level menu generated for contacts list
Core.prototype.getContacts = function(category,triggerElement,contact,team){
  var core = this;

  var data = JSON.parse(window.localStorage.getItem('category'+category))
  //console.log(data)
  core.$renderList = $('<div/>')

  if (contact == 'mybdm'){
    $('.myBdmMenu').show()
    $('.fourthLevelContainer').hide()
  }

  for (i = 0; i < data.count; i++) {
    if (data.posts[i].custom_fields.Contact_NetApp_or_Arrow[0] == contact && data.posts[i].tags[0].title == team){
      core.$listParent = $('<li/>', {'class':'listParent', 'data-post':i}).append('<a href="#" class="listParentAnchor"><h2>'+data.posts[i].title+'</h2><p>'+data.posts[i].custom_fields.Contact_Job_Title[0]+'</p><i class="fa fa-chevron-right"></i></a>')
      core.$renderList.append(core.$listParent)
    }
  }

  core.$grandparentReturn = $('<a/>', {'class':'grandparentReturn','href':'#'}).html(triggerElement.replace('fa-chevron-right','fa-chevron-left'));
  core.$childSections = $('<ul/>', {'class':'childSections','data-category':category}).append('<li class="listParent thirdLevelAnchor">'+core.$grandparentReturn.html()+'</li>'+core.$renderList.html()+'<li class="listParent mybdmlistlauncher"><a href="#" class=""><h2 class="menuTitleSpacing">My BDM</h2><i class="fa fa-chevron-right"></i></a></li>');
  $('.thirdLevelContainer').html(core.$childSections).show()
  $('.contentContainer').hide()
  $('.fourthLevelContainer').hide()

  $('.thirdLevelAnchor').click(function(){
    $('.thirdLevelContainer').hide()
    $('.contentContainer').show()
    $('.fourthLevelContainer').hide()
  })
}

//Fourth level menu generated for contacts list
Core.prototype.getContactTeam = function(category,triggerElement,contact){
  var core= this;

  var data = JSON.parse(window.localStorage.getItem('category'+category))
  if (contact == 'mybdm'){
    $('.myBdmMenu').show()
  }
  core.$renderList = $('<div/>')
  var teamArr = []
  for (i = 0; i < data.count; i++) {
    if ($.inArray(data.posts[i].tags[0].title, teamArr) >= 0){
      //onsole.log('in')
    }else if ($.inArray(data.posts[i].tags[0].title, teamArr) < 0 && data.posts[i].custom_fields.Contact_NetApp_or_Arrow[0] == contact){
      teamArr.push(data.posts[i].tags[0].title)
    }

  }

  //console.log(teamArr)
  for (i = 0; i < teamArr.length; i++) {
    //console.log('looping')
    core.$listParent = $('<li/>', {'class':'listParent', 'data-post':i}).append('<a href="#" class="generateThirdLevelFromFourth" data-contact="'+contact+'" data-team="'+teamArr[i]+'"><h2 class="menuTitleSpacing">'+teamArr[i]+'</h2><i class="fa fa-chevron-right"></i></a>')
    core.$renderList.append(core.$listParent)
  }

  core.$grandparentReturn = $('<a/>', {'class':'grandparentReturn','href':'#'}).html(triggerElement.replace('fa-chevron-right','fa-chevron-left'));
  core.$childSections = $('<ul/>', {'class':'childSections','data-category':category}).append('<li class="listParent fourthLevelAnchor">'+core.$grandparentReturn.html()+'</li>'+core.$renderList.html());
  $('.fourthLevelContainer').html(core.$childSections).show()
  $('.contentContainer').hide()

  $('.fourthLevelAnchor').click(function(){
    $('.fourthLevelContainer').hide()
    $('.contentContainer').show()
  })

  $('.generateThirdLevelFromFourth').click(function(){
    var contact = $(this).data('contact')
    var team = $(this).data('team')
    core.getContacts(category,triggerElement,contact,team)
  })
}

//third level menu generated for contacts list
Core.prototype.getEnablements = function(category,triggerElement,topic){
  var core = this;
  //console.log('getting enablements...')
  var data = JSON.parse(window.localStorage.getItem('category'+category))
  //console.log(data)
  core.$renderList = $('<div/>')

  for (i = 0; i < data.count; i++) {
    if (data.posts[i].tags[0].title == topic){
      core.$listParent = $('<li/>', {'class':'listParent', 'data-post':i}).append('<a href="#" class="listParentAnchor"><h2  class="menuTitleSpacing">'+data.posts[i].title+'</h2><i class="fa fa-chevron-right"></i></a>')
      core.$renderList.append(core.$listParent)
    }
  }
  core.$grandparentReturn = $('<a/>', {'class':'grandparentReturn','href':'#'}).html(triggerElement.replace('fa-chevron-right','fa-chevron-left'));
  core.$childSections = $('<ul/>', {'class':'childSections','data-category':category}).append('<li class="listParent thirdLevelAnchor enablementsThirdLevel"><a href="#" class="listChild"><div class="menuIcon"><i class="fa fa-graduation-cap"></i></div>'+core.$grandparentReturn.html()+'</a></li>'+core.$renderList.html());
  $('.thirdLevelContainer').html(core.$childSections).show()
  $('.contentContainer').hide()

  $('.thirdLevelAnchor').click(function(){
    $('.thirdLevelContainer').hide()
    $('.contentContainer').show()
  })

}

Core.prototype.getCategory = function(category,triggerElement){
  var core = this;
 // console.log('getting the category...')
  $('.postContainer').hide()
  var data = JSON.parse(window.localStorage.getItem('category'+category))
  //console.log('category: '+category)
  //console.log(data)
  core.$renderList = $('<div/>')
  $('.thirdLevelContainer').hide()
  //Remove any additional styling classes added to content container before we possibly add new ones.
  $('.contentContainer').removeClass('calendarContainer')

  //If events calendar, append large calendar as first list element after the parent return
  if (category == 4){
    $('.contentContainer').addClass('calendarContainer')

    core.$renderList.prepend('<li class="listCalendar"><div id="interactiveCalendar"></li>')
    for (i = 0; i < data.count; i++) {
      //console.log(data.posts[i].custom_fields.Event_Start_Date)
      var startConvertDate = '/'+data.posts[i].custom_fields.Event_Start_Date.toString()
      var startEventDay    = startConvertDate.substr(0, 3).replace('/0','').replace('/1','1').replace('/2','2').replace('/3','3')
      var startEventMonth  = startConvertDate.substr(3, 3).replace('/0','').replace('/1','1')
      var startEventYear   = startConvertDate.substr(7, 4);
      //var startdate = new Date(startEventMonth+'/'+startEventDay+'/'+startEventYear) //As date
      var endConvertDate = '/'+data.posts[i].custom_fields.Event_End_Date.toString()
      var endEventDay    = endConvertDate.substr(0, 3).replace('/0','').replace('/1','1').replace('/2','2').replace('/3','3')
      var endEventMonth  = endConvertDate.substr(3, 3).replace('/0','').replace('/1','1')
      var endEventYear   = endConvertDate.substr(7, 4);
      //var enddate = new Date(endEventMonth+'/'+endEventDay+'/'+endEventYear) //As date
      //console.log(startEventMonth,endEventMonth)
      core.$listParent = $('<li/>', {
        'class':'listParent calDate hidden',
        'data-post':i,
        'data-startday':startEventDay,
        'data-startmonth':startEventMonth,
        'data-startyear':startEventYear,
        'data-endday':endEventDay,
        'data-endmonth':endEventMonth,
        'data-endyear':endEventYear,
         }).append('<a href="#" class="listParentAnchor"><i class="fa fa-calendar-o listCalendarIcon"></i><h2>'+data.posts[i].title+'</h2><i class="fa fa-chevron-right"></i></a>')
      core.$renderList.append(core.$listParent)
    }
  //Contact
  }else if(category == 9){
    core.$renderList.append('<li class="listParent contactParent"><a href="#" class="contactAnchor" data-contact="Arrow"><h2>My Arrow contacts</h2><img class="contactLogo" src="./img/arrowLogo.png"><i class="fa fa-chevron-right"></i></a></li><li class="listParent contactParent"><a href="#" class="contactAnchor" data-contact="NetApp"><h2>My NetApp contacts </h2><img class="contactLogo" src="./img/netAppLogo.png"><i class="fa fa-chevron-right"></i></a></li><li class="listParent contactParent bdmcontactparent"><a href="#" class="contactAnchor" data-contact="mybdm"><h2>My BDM contact</h2><i class="fa fa-chevron-right"></i></a></li>')
  //Quick Enablement
  }else if(category == 6){
    var firstLevelItems = []
    var firstLevelDescription = []
    //console.log(data)
    for (i = 0; i < data.count; i++) {
      var title = data.posts[i].tags[0].title
      var description = data.posts[i].tags[0].description
      if ($.inArray(title,firstLevelItems) == -1){
        firstLevelItems.push(title)
        firstLevelDescription.push(description)
      }
    }
    for (x = 0; x < firstLevelItems.length; x++) {
      core.$listParent = $('<li/>', {'class':'listParent'}).append('<a href="#" class="listParent enableAnchor"><h2>'+firstLevelItems[x]+'</h2><p>'+firstLevelDescription[x]+'</p><i class="fa fa-chevron-right"></i></a>')
      core.$renderList.append(core.$listParent)
    }

  }else if(category == 3){
    for (i = 0; i < data.count; i++) {
      core.$listParent = $('<li/>', {'class':'listParent', 'data-post':i}).append('<a href="#" class="listParentAnchor"><h2 class="menuTitleSpacing">'+data.posts[i].title+'</h2><i class="fa fa-chevron-right"></i></a>')
      core.$renderList.append(core.$listParent)
    }
  }else{
    for (i = 0; i < data.count; i++) {
      core.$listParent = $('<li/>', {'class':'listParent', 'data-post':i}).append('<a href="#" class="listParentAnchor"><h2>'+data.posts[i].title+'</h2>'+data.posts[i].excerpt+'<i class="fa fa-chevron-right"></i></a>')
      core.$renderList.append(core.$listParent)
    }
  }

  core.$grandparentReturn = $('<a/>', {'class':'grandparentReturn','href':'#'}).html(triggerElement.replace('fa-chevron-right','fa-chevron-left'));
  core.$childSections = $('<ul/>', {'class':'childSections','data-category':category}).append('<li class="listParent listParentReturn">'+core.$grandparentReturn.html()+'</li>'+core.$renderList.html());
  $('.contentContainer').html(core.$childSections)

  //go to quick enablement third level menu
  $('.enableAnchor').click(function(){
    var topic = $(this).find('h2').text()
    var newtrigger = $(this).html()
    core.getEnablements(category,newtrigger,topic)
  })

  //go to third level menu
  $('.contactAnchor').click(function(){
    var contact = $(this).data('contact')
    var newtrigger = $(this).html()
    core.getContactTeam(category,newtrigger,contact)
  })

  $('#interactiveCalendar').datepicker({
    inline: true,
    hideIfNoPrevNext: true,
    prevText: "Previous",
    nextText: "Next",
    firstDay: 1,
    showOtherMonths: true,
    dayNamesMin: ['Su', 'M', 'T', 'W', 'T', 'F', 'S'],
    monthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    onSelect: function(date, inst) {
      inst.inline = false;
      core.getCalenderData()

      //Function to check the days an event spans over
      function isiInRange(startday,endday,current){
        for (i = 0; i < 10; i++) {
            //Code to span multiple days
            // if(startday+i<endday && startday+i == current || current == startday || current == endday){
            //   return true;
            // }
            //Only use start day
            if(current == startday){
              return true;
            }
        }
      }

      //counts days in a month, used for events that cross over the end of a month..
      function daysInMonth(month,year) {
          return new Date(year, month, 0).getDate();
      }

      $('.calDate').each(function(){
        var $that = $(this)
        if ($that.data('startmonth') == $('.highlightCalDay').first().data('month')+1 && $that.data('startmonth') == $that.data('endmonth')){
          var startday = $that.data('startday')
          var endday = $that.data('endday')
          var current = inst.currentDay

          //Sketchy bodge for events that last longer than 1 day...hopefully they don't last more than 10 days
          //because that's all this takes into account...
          if (isiInRange(startday,endday,current) == true){
            $that.slideDown()
          }else{
            $that.hide()
          }
        }else if($that.data('startmonth') != $that.data('endmonth') && $that.data('startmonth') == $('.highlightCalDay').first().data('month')+1){
          var startday = $that.data('startday')
          var endday = daysInMonth($that.data('startmonth'),$that.data('startyear'))
          var current = inst.currentDay

          if (isiInRange(startday,endday,current) == true){
            $that.slideDown()
          }else{
            $that.hide()
          }
        }else{
          $that.hide()
        }
      })

    }//END ON SELECT
  });
  //Click today by default so that we show todays events, otherwise we have a blank event box until something happens..
  $('.ui-datepicker-current-day').trigger('click')

  core.getCalenderData()
}

//Populate the calendar with related events
Core.prototype.getCalenderData = function(){
  var core = this;
  $('.calDate').each(function(){

    var startday = $(this).data('startday')
    var startmonth = $(this).data('startmonth')-1
    var startyear = $(this).data('startyear')
    var endday = $(this).data('endday')
    var endmonth = $(this).data('endmonth')-1
    var endyear = $(this).data('endyear')
    var differenceInDays = endday-startday

    if ($('.ui-datepicker-title .ui-datepicker-year').text() == startyear){


      //todo: hanging months - if a startdate is in this month, but the end date is in next month
      //the end item doesn't fall anywhere. ie: it's not in this month on the hanging next month,
      //and its not in next month when you switch using the next button. Figure that out?
      $('td').each(function(){
        if ($(this).data('month') == startmonth){
          if ($(this).text() == startday){
            //console.log(startmonth, endmonth)

            $(this).addClass('highlightCalDay')

            //also catches hangover events
            // if (startmonth !=endmonth){
            //   $(this).next().addClass('highlightCalDay')
            // }
            //$(this).nextAll(':lt('+differenceInDays+')').addClass('highlightCalDay')
          }
        }
      })
    }

  })
};

Core.prototype.logIn = function (x) {
  var core = this;
  //Submit login form
  $(document).on("click",".submitLoginFormData",function(e){
    core.areWeConnected()
    var username = $('.loginForm #userName').val()
    var password = $('.loginForm #password').val()
    var keeploggedon = 0;
    if ($('.fa-toggle-on').length){
      keeploggedon = 1;
    }
    core.generateAuthNonce(username, password,keeploggedon)
  })

  //Load registration form
  $(document).on("click",".createAccount",function(e){
    //console.log('create account clicked')
    $('.appContainer').load("register.html")
    $('.navigateBack').show()
    $('.appLogos').hide()
  })

  //Load Password Recovery form
  $(document).on("click",".passwordRecover",function(e){
    //console.log('Trying to recover password...')
    $('.appContainer').load("recovery.html")
    $('.navigateBack').show()
    $('.appLogos').hide()
  })

  //Recover Password
  $(document).on("click",".recoverYourPassword",function(e){
    var user = $('.recoveryForm #email').val()
    core.recoverPassword(user)
    navigator.notification.alert('Password recovery email sent!', null, 'Email sent', 'Ok')
  })

   //'Navigate back buttons'
  $(document).on("click",".navigateBack",function(e){
    var location = $(this).data('location')
    //console.log(location)
    $('.appContainer').load(location+".html")
    $('.navigateBack').hide()
    $('.appLogos').show()
  });

  //Register User
  $(document).on("click",".createAccountForm",function(e){
    var firstname = $('.registerForm #firstName').val(),
        lastname = $('.registerForm #lastName').val(),
        password = $('.registerForm #password').val(),
        email = $('.registerForm #email').val(),
        username = email,
        error = 0;

    // if (email.toLowerCase().indexOf("hotmail") >= 0 || email.toLowerCase().indexOf("yahoo") >= 0 || email.toLowerCase().indexOf("sky") >= 0 || email.toLowerCase().indexOf("gmail") >= 0 || email.toLowerCase().indexOf("aol") >= 0 || email.toLowerCase().indexOf("zoho") >= 0 || email.toLowerCase().indexOf("lycos") >= 0 || email.toLowerCase().indexOf("btinternet") >= 0 || email.toLowerCase().indexOf("outlook") >= 0 || email.toLowerCase().indexOf("icloud") >= 0 || email.toLowerCase().indexOf("me") >= 0 || email.toLowerCase().indexOf("ntlworld") >= 0){
    //   triggerAlert('<i class="fa fa-envelope-o"></i>','Unfortunately this email address is not allowed. Please re-register using your business email address. ','Cancel','');
    // }else if (email.toLowerCase().indexOf("avnet") >= 0 || email.toLowerCase().indexOf("simplivity") >= 0 || email.toLowerCase().indexOf("simplicity") >= 0 || email.toLowerCase().indexOf("hammerplc") >= 0 || email.toLowerCase().indexOf("hammer") >= 0 || email.toLowerCase().indexOf("e92plus") >= 0 || email.toLowerCase().indexOf("westcoast") >= 0 || email.toLowerCase().indexOf("micro-p") >= 0 || email.toLowerCase().indexOf("interfacesolutions") >= 0){
    //   triggerAlert('<i class="fa fa-envelope-o"></i>','Email Domain Not Allowed','Cancel','');
    // }else{
      $('input').each(function(){

        if (!$(this).val()){
          error++
          $(this).css({border:"1px solid red"})
        }
      })

      if (error>=1){
        navigator.notification.alert('You must complete the registration form', null, 'Registration error', 'Cancel')
      }else{
        core.generateRegisterNonce(firstname,lastname,username,password,email)
      }
   // }



  })

  //KEEP USER LOGGED IN
  $(document).on("click",".checkboxtoggle",function(e){
    if ($(this).hasClass('fa-toggle-on')){
      $(this).removeClass('fa-toggle-on').addClass('fa-toggle-off')
      window.localStorage.removeItem("stayloggedon");
    }else{
      $(this).removeClass('fa-toggle-off').addClass('fa-toggle-on')
      window.localStorage.setItem("stayloggedon", 1);
    }
  })

  //Settings Button
  $(document).on("click",".settings a",function(e){
    e.preventDefault()
    core.logContent('settings',null, null);

    $('.settingsMenu').toggle();
    $('.myBdmMenu').hide()
  })

  $(document).on("click",".loadMyBdm",function(e){
    var source = $(this).text()
    core.logContent('viewprofile',null, window.localStorage.getItem('bdm'));

    $('.myBdmMenu').show()
    $('.settingsMenu').hide()
    $('.fourthLevelContainer').hide()
  })

  $(document).on("click",".mybdmlistlauncher",function(e){
    core.logContent('viewprofile',null, window.localStorage.getItem('bdm'));

    $('.myBdmMenu').show()
     $('.fourthLevelContainer').hide()
  })

  $(document).on("click",".contactMyBdm",function(e){
    $('.myBdmMenu').show()
     $('.fourthLevelContainer').hide()
  })

  $(document).on("click","a",function(e){
    e.preventDefault()
    if ($(this).parent().parent().hasClass('listParentReturn') || $(this).parent().hasClass('listParentReturn') ){

    }else{
      var clickedItem = $(this).find('h2').text();
      core.logContent('anchor',null, clickedItem);

    }
    var href = $(this).attr('href')
    window.open(href, '_system')

  });

  $(document).on("click",".dealreglink",function(e){
    // var targetUser = Cookies.get('user')
    // if (targetUser.indexOf("softcat") >= 0){
    //   triggerAlert('<i class="fa fa-exclamation-triangle"></i>','Sorry, you are not able to submit a deal registration','Ok','');
    // }else{
    //   window.open('http://velocity.apple-dev.co.uk/reg_redirect/', '_system')
    //   $('.appContainer').show()
    //   $('.contentContainer').hide()
    // }

    var source = $(this).find('h2').text()
    core.logContent('dealreg',null, source);

    window.open('http://velocity.apple-dev.co.uk/reg_redirect/', '_system')
    $('.appContainer').show()
    $('.contentContainer').hide()
  })

  $(document).on("click",".twitter",function(e){
    core.logContent('twitter',null, null);

    window.open('https://twitter.com/arrowecs_netapp', '_system')
  })

  $(document).on("click",".facebook",function(e){
    core.logContent('facebook',null, null);
    window.open('https://www.facebook.com/arrowfiveyearsout', '_system')
  })

  $(document).on("click",".linkedIn",function(e){
    core.logContent('linkedin',null, null);
    window.open('https://www.linkedin.com/company/arrow-ecs-united-kingdom', '_system')
  })

  //Log Off
  $(document).on("click",".logOff",function(e){
    console.log('Log off Clicked')
    //TODO: add this back in
    core.logContent('logoff',null, null);
    core.initPushwoosh(null, "unregister")

    e.preventDefault()
    window.localStorage.removeItem('loggedIn');
    $('.navigateBack').hide()
    $('.socialStrip').hide()
    window.localStorage.removeItem("stayloggedon");
    window.localStorage.removeItem("auth");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("bdm");
    window.localStorage.removeItem("mybdmdata");
    window.localStorage.removeItem("userPass");
    window.location.replace('index.html')



  })


}

Core.prototype.generateAuthNonce = function (username,password,keeploggedon) {
  var core = this;
	//If we've already logged in once (cookie has been generated), then skip the log in process
	if (window.localStorage.getItem('loggedIn') == 1){
		//console.log('already logged in')
		$('.appContainer').load("home.html")

	}else{
		console.log('attempting to generate authentication nonce...')
		var username = username,
		 	password = password

		if (keeploggedon == 1){
			window.localStorage.setItem("stayloggedon", 1);
		}else{
			window.localStorage.removeItem("stayloggedon");
		}

		////console.log(username,password)

		$.ajax({
			url: "http://velocity.apple-dev.co.uk/api/get_nonce/?controller=auth&method=generate_auth_cookie",
			type: "GET",
			dataType: "jsonp",
			contentType: 'application/json',
			success: function(data){
				var arr = [data]
					nonce = arr[0].nonce;
				console.log(nonce)
				$('.generateAuthNonce .rendered').html(nonce)
				core.generateCookie(nonce,username,password)
				$('.navigationButtons').show()
      	$('.socialStrip').show()
			},
			error: function (data){
				console.log('Authentication Error ' + data);
			}
		});
	}
}

Core.prototype.generateCookie = function (nonce,username,password) {
  console.log('attempting to generate cookie from nonce...')
  var core = this

  	$.ajax({
  		url: "http://velocity.apple-dev.co.uk/api/auth/generate_auth_cookie/?nonce="+nonce+"&username="+username+"&password="+password+"&insecure=cool",
  		type: "GET",
  		dataType: "jsonp",
  		contentType: 'application/json',
  		success: function(data){
  			var arr = [data]
  			////console.log(arr)
  			if (arr[0].status == 'ok'){
  				//console.log[arr]
  				window.localStorage.setItem('loggedIn', '1');
  				window.localStorage.setItem('user', username);
  				$('.navigateBack').hide()
        			$('.prelaunchButtons').hide()
  				window.localStorage.setItem("auth", arr[0].cookie);
  				var authenticate = window.localStorage.getItem("auth")
        	var auth = core.getUserMeta(authenticate)
  				$('.appContainer').load("home.html")
  				//BDM Data load
          core.getBdmData()
          core.initPushwoosh(window.localStorage.getItem('user'), 'register')

  			}else if (arr[0].status == 'error'){
  				//unregisterDevice() -- DOESN'T WORK PGB

          function onRetry(buttonIndex){
            if (buttonIndex == 1){
              core.generateAuthNonce(username,password)
            }
          }

          navigator.notification.confirm('Your username or password is incorrect', onRetry, 'Error', ['Retry','Ok'])

  				return false;
  			}

  		},
  		error: function (data){
  			console.log('Error ' + data);
  		}
  	});
  }

Core.prototype.getBdmData = function () {
  var core = this
  //console.log('getting BDM')
	//Fired during container height resize
	var authenticate = window.localStorage.getItem("auth")
	var auth = core.getUserMeta(authenticate)
}

Core.prototype.generateRegisterNonce = function (firstname,lastname,username,password,email) {
  var core = this
  console.log('generating user nonce')
	$.ajax({
		url: "http://velocity.apple-dev.co.uk/api/get_nonce/?controller=user&method=register",
		type: "GET",
		dataType: "jsonp",
		contentType: 'application/json',
		success: function(data){
			var arr = [data]
				nonce = arr[0].nonce;
			////console.log(nonce)
			core.registerNewUser(nonce,firstname,lastname,username,password,email)
		},
		error: function (data){
			//console.log('Error ' + data);
		}
	});
}

Core.prototype.registerNewUser = function (nonce,firstname,lastname,username,password,email){
  console.log('registering new user...in theory..')
  var core = this
  	//console.log(nonce)
  	$.ajax({
  		url: "http://velocity.apple-dev.co.uk/api/user/register/?username="+username+"&display_name="+email+"&email="+email+"&nonce="+nonce+"&first_name="+firstname+"&last_name="+lastname+"&user_pass="+password+"&seconds=100",
  		type: "GET",
  		dataType: "jsonp",
  		contentType: 'application/json',
  		success: function(data){
  			//console.log('success')
  			var arr = [data]
  			if (arr[0].status == 'ok'){
  				$('.appContainer').load("login.html")
  				$('#userName').val(username)
  				$('#password').val(password)
          navigator.notification.alert('Registration complete! You will receive your login details via email after you have been successfully approved by one of our team.', null, 'Registration Complete!', 'Ok')

  			}else if (arr[0].status == 'error'){
          function onRetry(buttonIndex){
            if (buttonIndex == 1){
              core.generateRegisterNonce(firstname,lastname,username,password,email)
            }
          }

          navigator.notification.confirm('Username already exists', onRetry, 'Error', ['Retry','Ok'])

  			}


  		},
  		error: function (data){
  			//console.log('error')
  			//console.log('Error ' + data);
  		},
  		complete: function(data){

  		}
  	});
}

//Not sure if we're even using this anymore, I don't think we are. Delete this if we don't need it
Core.prototype.createPushRegister = function (ID){
  var core = this;
  console.log('pushing register')
	console.log(ID)
	$.ajax({
		url: "http://velocity.apple-dev.co.uk/pnfw/register/?token="+ID+"&os=iOS",
		type: "POST",
		contentType: 'application/x-www-form-urlencoded',
		success: function(data){
			var arr = JSON.stringify(data)
			//console.log('I think this worked?'+arr)
		},
		error: function (data){
			var arr = JSON.stringify(data)
			//console.log('This did not work.'+arr)
		}
	});

}

Core.prototype.recoverPassword = function (user){
  var core = this;
  //http://localhost/api/user/retrieve_password/?user_login=john
	//recoverYourPassword

	$.ajax({
		url: "http://velocity.apple-dev.co.uk/api/user/retrieve_password/?user_login="+user,
		type: "GET",
		dataType: "jsonp",
		contentType: 'application/json',
		success: function(data){
			var arr = [data]
			//console.log(arr)
		},
		error: function (data){
			//console.log('Error ' + data);
		}
	});
}

Core.prototype.getUserMeta = function (cookie){
  var core = this;
  //Get user data from wordpress by passing it the cookie generated at login
	var toreturn = []
	$.ajax({
		url: "http://velocity.apple-dev.co.uk/api/user/get_currentuserinfo/?cookie="+cookie,
		type: "GET",
		dataType: "jsonp",
		contentType: 'application/json',
		success: function(data){
			var arr = JSON.stringify(data)

			var user = data.user.username
			var firstname = data.user.firstname
			var lastname = data.user.lastname
			var email = data.user.email
			toreturn = [firstname,lastname,email]
			window.localStorage.setItem("email", toreturn[2]);
			//console.log(toreturn)

			var email = window.localStorage.getItem("email")
			var splitEmail = email.split('@')
			var afterAt = '@'+splitEmail[1]
			var notbusiness = ['@hotmail.com','@hotmail.co.uk']
			var appleprint = ['@appleprint.co.uk']
			var craigrobertson = ['@bytes.co.uk','@qassociates.co.uk','@softcat.com','@proact.co.uk']
			var timshaw = ['@bell-integration.com','@brighter-connections.com','@cetus-solutions.com','@concordeitgroup.com','@eacs.com','@gardsys.co.uk','@it-ps.com','@limanetworks.com','@majentasolutions.com','@phoenixs.co.uk','@silverbug.com','@ultimabusiness.com']
			var simongow = ['@mhra.gsi.gov.uk','@acr-its.com','@agailitydatasolutions.com','@amorgroup.com','@asmtech.com','@bluelogic.co.uk','@bramattcomputing.co.uk','@brendata.co.uk','@e-business.com','@centralis.co.uk','@chilli-it.co.uk','@csc.com','@dacoll.co.uk','@datrix.co.uk','@dsiltd.co.uk','@enforcetechnology.com','@esteem.co.uk','@eci.com','@ezecastle.com','@frontiertechnology.co.uk','@highlandercomputing.com','@hp.com','@infosys.com','@innov8.co.uk','@isl.com','@misco.co.uk','@richardsoneyres.co.uk','@ntsols.com','@openreality.co.uk','@quadsys.co.uk','@r-comconsulting.com','@redstor.com','@skanco.co.uk','@sys-pro.co.uk','@tdmgroup.net','@tectrade.co.uk','@tet.co.uk','@tgccomputers.co.uk','@trilogytechnologies.com','@trustsystems.co.uk','@unisys.com','@vohkus.com','@wipro.com','@zero20.net','@bluecoffeenetworks.com','@doherty.co.uk','@e-know.net','@keyzone.com','@lombard.co.uk','@pstg.co.uk','@puredatasolutions.co.uk','@seric.co.uk','@stoneleigh.co.uk','@ukbackup.com']
			var robwarner = ['@bt.com','@capita.co.uk','@dimensiondata.com','@uk.logicalis.com','@s3.co.uk','@scc.com','@virginmedia.co.uk']
			var dominicvincent = ['@7tech.ltd.uk','@acs365.co.uk','@apsu.com','@autodata.co.uk','@bull.co.uk','@celerity-uk.com','@cloudxl.co.uk','@comparex.co.uk','@controlcircle.com','@eurotech-computers.com','@fordway.com','@highpoint.com','@instantonit.com','@isnsolutions.co.uk','@jcom.co.uk','@jesfertechnology.com','@kcom.com','@maplecom.co.uk','@netcentrix.co.uk','@netplan.co.uk','@nettitude.com','@network-interlinks.com','@nouveau.co.uk','@onx.com ','@gcicom.net','@server-link.co.uk','@psu.co.uk','@redpalm.co.uk','@thinks3.co.uk','@shi.com','@strawberrygt.com','@tmcs.co.uk','@tek-nologysolutions.co.uk','@tig.co.uk','@unionsolutions.co.uk','@Viadex.com','@ware247.co.uk','@ansecurity.com','@chase-security.com','@du360.com','@forfusion.com','@themavingroup.com','@northdoor.co.uk','@itspecialists.uk.com','@systemsexpress.com','@qual.co.uk']

			if ($.inArray( afterAt, craigrobertson) >= 0){
				 window.localStorage.setItem("bdm", "Craig Robertson")
			}else if ($.inArray( afterAt, timshaw) >= 0){
				window.localStorage.setItem("bdm", "Tim Shaw")
			}else if ($.inArray( afterAt, simongow) >= 0){
				window.localStorage.setItem("bdm", "Simon Gow")
			}else if ($.inArray( afterAt, robwarner) >= 0){
				window.localStorage.setItem("bdm", "Rob Warner")
			}else if ($.inArray( afterAt, dominicvincent) >= 0){
				window.localStorage.setItem("bdm", "Dominic Vincent")
			}else if ($.inArray( afterAt, notbusiness) >= 0){
				//console.log("Not a business address")
			}else if ($.inArray( afterAt, appleprint) >= 0){
				window.localStorage.setItem("bdm", "Craig Robertson")
				//console.log('setting item')
			}else{
				window.localStorage.setItem("bdm", "Craig Robertson")
				//console.log('Doesn\'t match any condition '+afterAt)
			}
		},
		error: function (data){
			//console.log('Error ' + data);
		},
		complete: function(data){
			var contactsCat = JSON.parse(window.localStorage.getItem("category9"))
			var mybdm = window.localStorage.getItem("bdm")
			////console.log(contactsCat)
			for (i = 0; i < contactsCat.count; i++) {
				if (contactsCat.posts[i].title == mybdm){
					var jsonstring = JSON.stringify(contactsCat.posts[i])
					window.localStorage.setItem("mybdmdata",jsonstring)
				}
			}
			var mybdm = JSON.parse(window.localStorage.getItem("mybdmdata"))
      $('.postContactHeadshot').html('<img src="'+mybdm.custom_fields.Contact_Avatar[0]+'">')
      $('.postContactName h4').html(mybdm.title)
      $('.postContactName p').html(mybdm.custom_fields.Contact_Job_Title[0])
      $('.myBdmMenu .postInner').append(mybdm.content)
      var mybdm = JSON.parse(window.localStorage.getItem("mybdmdata"))
      $('.myBdmName').html(mybdm.title)
      $('.myBdmEmail').html(mybdm.custom_fields.Contact_Email[0])

			//console.log(toreturn)
      window.localStorage.setItem("userName", toreturn[0]+' '+toreturn[1])
			$('.settingsEmailAddress').html(toreturn[2])
      		$('.settingsUserName').html(toreturn[0]+' '+toreturn[1])
			return toreturn
		}
	});
}

Core.prototype.loadCoreData = function (){
  console.log('loading Core Data')
  var core = this;
  //console.log('Load core data')
  //Run loop of all post data and store that as JSON string in localstorage
  //This will reduce load times later.

  core.areWeConnected()
  for (i = 1; i < 10; i++) {
    (function (i) {
      $.ajax({
        url: "http://velocity.apple-dev.co.uk/api/core/get_category_posts/?id="+i,
        type: "GET",
        dataType: "jsonp",
        contentType: 'application/json',
        success: function(data){
        	////console.log(data)
        	window.localStorage.setItem('category'+i, JSON.stringify(data));
        },
        error: function (data){
          console.log('Error ' + data);
          navigator.notification.alert('No internet connection', null, 'Connection error', 'Cancel')
        }
      });
    })(i);
  }
}

Core.prototype.areWeConnected = function (){
  var core = this;
  ////console.log('are we connected?')
	$.ajax({
		url: "http://velocity.apple-dev.co.uk",
		type: "GET",
		success: function(data){
			var arr = JSON.stringify(data)
			//console.log('we are connected.')
		},
		error: function (data){
      //navigator.notification.alert('No Internet Connection. Some content may be missing or not up to date. Please connect to the internet and try again!', null, 'Connection error', 'Ok')
		}
	});
}

Core.prototype.addEvent = function (startDate,endDate,title,eventLocation,notes,success,error){
  var core = this;
  window.plugins.calendar.createEventInteractively(title,eventLocation,notes,startDate,endDate,success,error);
}

Core.prototype.addDirectEvent = function (startDate,endDate,title,eventLocation,notes,success,error){
  var core = this;
  window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate,success,error);
}

Core.prototype.logContent = function (action,toLog,source){
  console.log('I\'m a lumberjack...')
  var fullName = window.localStorage.getItem('userName')
  fullName = fullName.split(' ');
  console.log(source)
  // console.log(action) //Action to log

  var id    = '21';                                         // ID 21 assigned to NetHappy in DB // REQUIRED
  var fn    = fullName[0];                                  //First Name
  var ln    = fullName[1];                                  //Last Name
  var em    = window.localStorage.getItem('email');         //Email Address
  var ph    = null;                                         //Phone Number
  var rec   = '';                                           //Data

  if (action == 'external'){
    rec = 'External Website '+toLog+' opened from tab '+source
  }else if (action == 'findoutmore'){
    rec = 'Find Out More clicked on '+source
  }else if (action == 'addtocalendar'){
    rec = 'Added event to calendar '+source
  }else if (action == 'registerforevent'){
    rec = 'Clicked register for event '+source
  }else if (action == 'downloadcollateral'){
    rec = 'Collateral: '+toLog+' downloaded on '+source
  }else if (action == 'sharedcollateral'){
    rec = 'Collateral: '+toLog+' shared on '+source
  }else if (action == 'dealreg'){
    rec = 'User clicked '+source
  }else if (action == 'viewprofile'){
    rec = 'User viewed their BDM profile '+source
  }else if (action == 'twitter'){
    rec = 'User clicked Twitter share';
  }else if (action == 'facebook'){
    rec = 'User clicked facebook share';
  }else if (action == 'linkedin'){
    rec = 'User clicked Linked-In share';
  }else if (action == 'logoff'){
    rec = 'User Logged off';
  }else if (action == 'settings'){
    rec = 'Opened settings';
  }else if (action == 'anchor'){
    rec = source+' clicked';
  }else{

  }

  var dataStr = 'id='+id+'&fn='+fn+'&ln='+ln+'&em='+em+'&ph='+ph+'&rec='+rec

  //console.log(dataStr)
  $.ajax({
    url: "http://landingpageservice.apple-dev.co.uk/Ajax/ghRecordStuff.ashx",
    type: "GET",
    data: dataStr,
    dataType: "jsonp",
    contentType: 'application/json',
    success: function(data){
      //console.log(data)
    },
    error: function (data){
      console.log('Error ' + data);
    }
  });


}










Core.prototype.initPushwoosh = function(username, action){
  var core = this
  console.log('PUSHWOOSH INIT')
  //navigator.notification.alert('Success!', null, 'Pushwoosh CORE Initialised', 'ok')

  var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

  pushNotification.onDeviceReady({
    projectid: "625440960311", // GOOGLE_PROJECT_ID
    pw_appid : "5093D-320F3" // PUSHWOOSH_APP_ID
  });

  //TRIGGERED WHEN NOTIFICATIONS RECIEVED IN APP
  document.addEventListener('push-notification', function(event) {
    var notification = event.notification;
    console.log('push message recieved');
    navigator.notification.alert(notification.aps.alert, null, 'Hey there!', 'Continue')
    pushNotification.setApplicationIconBadgeNumber(0);

  });

  function setTagsFunc(username){
    console.log('Attempting tag setting of username:'+username)
    pushNotification.setTags(
    {
      "username":username,
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

  if (action == 'register'){
    //register for push
    pushNotification.registerDevice(
      function(status) {
        var deviceToken = status['deviceToken'];
        console.log('registerDevice: ' + deviceToken);
        setTagsFunc(username)
      },
      function(status) {
        navigator.notification.alert('Connection error', null, 'Error', 'Continue')
        console.log('failed to register : ' + JSON.stringify(status));
        alert(JSON.stringify(['failed to register ', status]));
      }
    );
  }else if (action == 'unregister'){
    console.log('Unregistering Device')
    //Unregister for push
    PushNotification.unregisterDevice (
      function(token){
          console.log("unregistered success!" + token);
      },
      function(status){
          console.log("unregistered failed!" + status);
      }
    )
  }



}

///////////////////////////////////////////////////////
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
