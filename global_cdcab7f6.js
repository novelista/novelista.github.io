// Global JavaScripts
// For use within normal web clients 
var isiPad = navigator.userAgent.match(/iPad/i) != null;
var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
var isAndroid = navigator.userAgent.match(/Android/i) != null;


function correctPNG() // correctly handle PNG transparency in Win IE 5.5 and 6.
{
	if ((jQuery.browser.msie) && (jQuery.browser.version < 7)) 
    {
       for(var i=0; i<document.images.length; i++)
       {
	      var img = document.images[i]
	      var imgName = img.src.toUpperCase()
	      if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
	      {
		     var imgID = (img.id) ? "id='" + img.id + "' " : ""
		     var imgClass = (img.className) ? "class='" + img.className + "' " : ""
		     var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
		     var imgStyle = "display:inline-block;" + img.style.cssText 
		     var imgAttribs = img.attributes;
		     for (var j=0; j<imgAttribs.length; j++)
			 {
			    var imgAttrib = imgAttribs[j];
			    if (imgAttrib.nodeName == "align")
			    {		  
			       if (imgAttrib.nodeValue == "left") imgStyle = "float:left;" + imgStyle
			       if (imgAttrib.nodeValue == "right") imgStyle = "float:right;" + imgStyle
			       break
			    }
             }
		     var strNewHTML = "<span " + imgID + imgClass + imgTitle
		     strNewHTML += " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
	         strNewHTML += "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
		     strNewHTML += "(src='" + img.src + "', sizingMethod='scale');\""
		     if (imgClass.indexOf("rollover") != 0) { strNewHTML += " onmouseover=\"PNGswap('" + img.id + "');\" onmouseout=\"PNGswap('" + img.id +"');\"" }
		     strNewHTML += "></span>" 
		     img.outerHTML = strNewHTML
		     i = i-1
	      }
       }
   }
}

function PNGswap(myID)
{
   var strOver  = "-over"
   var strOff = "-off"
   var oSpan = document.getElementById(myID)
   var currentAlphaImg = oSpan.filters(0).src
   if (currentAlphaImg.indexOf(strOver) != -1)
      oSpan.filters(0).src = currentAlphaImg.replace(strOver,strOff)
   else
      oSpan.filters(0).src = currentAlphaImg.replace(strOff,strOver)
}




/* Just add class="rollover" to the img tag and make sure your images are named whatever-off.gif and whatever-over.gif */
/* You can use any kind of images and name them what you like.  The "off" and "-over" are the only parts that matter */
function initrollovers() {
	var aPreLoad = new Array();
	var sTempsrc;
	var aImages = $("img.rollover, input.rollover");
	for (var i = 0; i < aImages.length; i++) {
		var src = aImages[i].getAttribute('src');
		var ftype = src.substring(src.lastIndexOf('.'), src.length);
		var hsrc = src.replace('-off'+ftype, '-over'+ftype);
		aImages[i].setAttribute('hsrc', hsrc);
		aPreLoad[i] = new Image();
		aPreLoad[i].src = hsrc;
		aImages[i].onmouseover = function() {
			sTempsrc = this.getAttribute('src');
			this.setAttribute('src', this.getAttribute('hsrc'));
		}
		aImages[i].onmouseout = function() {
			if (!sTempsrc) sTempsrc = this.getAttribute('src').replace('-over'+ftype, '-off'+ftype);
			this.setAttribute('src', sTempsrc);
		}
	}
} 

/* On page load */
$(function() {
	// Fix PNG Transparency and initialize rollover graphics
	correctPNG();
	initrollovers();
	
	// Drawer
	$('#headerBG, #container, #footerBG').click(function(){
		if($('#drawer-button').hasClass('open')){
			closeDrawer();
		}
		if($('.btn-plus').length){
			if($('.rollover').length){
				rollOut();
			}
		}
	});
	
	$('#drawer-button a').click(function(event){
		event.stopPropagation();
		if($('#drawer-button').hasClass('closed')){
			openDrawer();
		} else {
			closeDrawer();
		}
	});
	$('#drawer-close').click(function(){
		closeDrawer();
	});
	$('#drawer-content li').mouseenter(function(){
		drawerHover(this, 'over');
	});
	$('#drawer-content li').mouseleave(function(){
		drawerHover(this, 'out');
	});
	if(isiPad || isiPhone || isAndroid){
		$('#drawer-content li').click(function(){
			if($(this).hasClass('active')){
				return false;
			} else {
				drawerHover($('#drawer-content li.active'), 'out', true);
				$('#drawer-content li').removeClass('active');
				$(this).addClass('active');
				drawerHover(this,'over',true)
			}
		});
	}
	
	// Dropdown Nav
	$('#mainNav ul').superfish({
		autoArrows:  false,
		dropShadows: false,
		delay: 0,
		disableHI: true
	}); 
	
	
	// Function for Interested In? box
	$("#interestedBtn").hover(function() {
		$(this).find("ul").fadeIn();
	}, function() {
		$(this).find("ul").fadeOut();
	});
	
	// Accordion Functions
	if ($(".accordion").length > 0) {
		$(".accordion").accordion({animated: false, autoHeight: false, collapsible: true, active: -1, header: 'h3'});
		
		$("h3.ui-state-active").live("mouseover", function() {
			$(this).next().addClass("ui-accordion-content-active-hover");
		}).live("mouseout", function() {
			$(this).next().removeClass("ui-accordion-content-active-hover");
		});
	}
	
	// Callout box rollovers
	if ($(".callout").length > 0) {
		$(".callout").mouseover(function() {
			$(this).addClass("calloutOver");
		}).mouseout(function() {
			$(this).removeClass("calloutOver");
		}).click(function() {
			var promolink = $(this).find("a").attr("href");
			var promotarget = $(this).find("a").attr("target");
			if (promotarget=="_blank") {
				window.open(promolink);
			} else {
				location.href = promolink;
			}
			return false;
		});
	}
	
	// Contact Form
	if ($("#formContactUs").length > 0) {
		$("#formContactUs").validate({
			messages: {
				direccion: {
					email: 'Esta dirección de correo no es válida'
				}
			}		
		});	
	}
	
	// Homepage Setup
	if ($("#homeMainPromos").length > 0) {
		$("#homeMainPress .inTheNewsItem:last").addClass("last");
		$("#homeMainDotCO .dotCOItem:last").addClass("last");
		$("#homeMainMoreInfo").click(function () {
			$(this).toggleClass("open");
			$("#homeMainMoreInfoExt").slideToggle("slow");
		});

	}
	
	/* FIXES TITLE BAR TO HAVE TOP LEVEL PARENT DISPLAYED */
	if($('#title a').html() == '&nbsp;'){
		var linkHref = $('#mainNav ul li.active a').attr("href");
		var linkName = $('#mainNav ul li.active a').html();
		$('a.topParentTitle:not(a.topParentTitle.locked)').html(linkName);
		$('#titleBG #title a').attr("href", linkHref);
	}
	
	$('#email-signup').submit(function(){
		if($('#user-email').val() == 'Digite su correo electronico' || $('#ddlIndustry').val() == ''){
			if($('#email-signup .error').length){
				return false;
			} else {
				$('#email-signup').append('<span class="error">Please enter your email and select a category</span>');
				return false;
			}
		} else {
			$('#email-signup .error').remove();
			
			var list = $('#email-signup #ddlIndustry').val();
			var email = $('#email-signup #user-email').val();
			$.ajax({
				   url: 'http://dotcolocal.pappasdev.com/themes/dotco/register/',
				   type: 'GET',
				   data: 'list=' + list + '&email=' + email,
				   success: function(result) {
					   if (result=='TRUE') {
							$('#register h4').text('Thank you for your interest in the .CO domain.');
							$('#email-signup').hide();
							$('#register').append('<p>We\'ll keep you posted about any new developments. If you would like to speak to someone at the .CO Registry for any reason, please <a href="registry/contact-us" class="learn-more">contact us</a></p>');
					   } else {
						    $('#register p').remove();
							$('#register h4').text('An error occured with your submission.');
							$('#email-signup').hide();
							$('#register').append('<p>Please try again later or <a href="registry/contact-us" class="learn-more">contact us</a></p>');
					   }
				   }
			});
			
			return false;
		}
	});
	
	
	$('#registrations ul li').fadeTo(0,0);
	// url rotator
	var j = 0;
	var delay = 2000; //millisecond delay between cycles
	function cycleThru(){
		
		 var jmax = $("#registrations ul li").length -1;
		 var curwidth = ($('#registrations ul li:eq('+j+')').width() / 2);
		 $('#registrations ul li:eq('+j+')').css({"margin-left" : -curwidth});
		 $("#registrations ul li:eq(" + j + ")")
				 .animate({"opacity" : "1"})
				 .animate({"opacity" : "1"}, delay)
				 .animate({"opacity" : "0"}, 400, function(){
						 (j == jmax) ? j=0 : j++;
						 cycleThru();
				 });
		 };
	
	cycleThru();
	
});

function drawerHover(list, action, touch){
		var index = $('#drawer-content ul li').index(list)+1;
		
		if(action == 'over'){
			$(list).css({'z-index':100});
			/*if($(list).hasClass('last')){
				$(list).css({'border-right':'none','width':'195px'})
			} else {
				$('#drawer-content ul li').eq(index).css({'border-left':'none','width':'196px'});
			}*/
			$(list).find('span').fadeIn('fast');
		} else if(action == 'out'){
			$(list).css({'z-index':1});
			/*if($(list).hasClass('last')){
				$(list).css({'border-right':'1px solid #7eb1c5','width':'195px'})
			} else {
				$('#drawer-content ul li').eq(index).css({'border-left':'1px solid #7eb1c5','width':'195px'});
			}*/
			$(list).find('span').fadeOut('fast');	
		}
}

function closeDrawer(){
	if($('#drawer-content li.active').length){
		drawerHover($('#drawer-content li.active'), 'out', true);
	}
	$('#drawer-button').removeClass('open').addClass('closed');
	$('#global-sites #content-wrapper').css({'display':'none'});
	$('#global-sites').animate({'height':'7px'},200);
	$('#global-sites').removeClass('open');
}
function openDrawer(){
	$('#drawer-button').removeClass('closed').addClass('open');
	$('#global-sites').addClass('open');
	$('#global-sites #content-wrapper').css({'display':'block'});
	$('#global-sites').animate({'height':'171px'}, 200);
}


/* Homepage promos */
var iCurrent = 1; // Sets the first gallery image
var timer;  // Variable for timer
var iSeconds = 10; // Number of seconds between rotations
var iMax = 4; // Creates variable for the number of gallery images

/* Set inital promo and nav icon on page load */
var currentGallery = "div#promo"+iCurrent;
var currentNav = "a#promoNav"+iCurrent;
