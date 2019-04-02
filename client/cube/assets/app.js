$('body').on('click',  function(e){
	$('.nav-droplist').hide();
	$('.nav-dropdown').show();
	if(window.innerWidth < 980) {
		$('.nav-dropdown').width(60);
	}
	window.toogle_nav = false;
});

$('body').on('click', 'a.nav-dropdown', function(e){
	if(!window.toogle_nav){
		setTimeout(function(){
			if(window.innerWidth < 980) {
				$('.nav-dropdown').hide();
			}
			$('.nav-droplist').show();
			window.toogle_nav = true;	
			
		}, 50);	
	} else {
		window.toogle_nav = false;
	}	
});

$('body').on('click', 'a.close-notification' , function(e) {
	e.preventDefault();
	$('.notification-wrapper').fadeOut();
});

var showNotification = function(text, status) {
	$('.notification-wrapper').fadeIn();
	$('.notificatin-message').text(text);
	if(status) {
		$('.notification-head').text('Success');
	} else {
		$('.notification-head').text('Error');
	}
}

var validateForm = function(form) {
	var inputs = form.find('input, textarea.message');
	var is_valid = true;

	// email reg exp
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	$('.helper-span').remove();
	for(var i in inputs) {
		if(typeof inputs[i].value !== "undefined" ){
			if(inputs[i].value == '') {
				if(inputs[i].name == 'rezume' ) {
					$(inputs[i]).prev('p').css('border', '2px solid rgba(176, 32,32,0.71)');
					$(inputs[i]).prev('p').after('<span class="helper-span">Required</span>');
				} else {
					
					$(inputs[i]).css('border', '2px solid rgba(176, 32,32,0.71)');
					$(inputs[i]).after('<span class="helper-span">Required</span>');
				}
				is_valid = false;
				
			} else {
				if(inputs[i].name == 'rezume' ) {
					$(inputs[i]).prev('p').css('border', '2px solid white');
				}
				$(inputs[i]).css('border', '2px solid white');

				if(inputs[i].name == 'email' && !re.test(inputs[i].value)) {
				    is_valid = false;
				    $(inputs[i]).css('border', '2px solid rgba(176, 32,32,0.71)');
					$(inputs[i]).after('<span class="helper-span">Invalid email</span>');
				}
			}
		}
	}

	 return is_valid;
}

var showLoading = function() {
    $('#loading').modal('show');
}

var hideLoading = function() {
    $('#loading').modal('hide');
}