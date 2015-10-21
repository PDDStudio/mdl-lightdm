/*
*
*
*
*
*
*/

//set DEBUG = true to display log messages in the greeter
var DEBUG = false,
	selectedUser = null,
	authPending = null,
	users_shown = true,
	userList;

//for providing defaults
var defaultSession = null;
var defaultAccount = null;
var USE_DEFAULTS = false;

//username to login with
var default_account_name = "your_user_name";
//the session to launch after the login
var default_session_name = "your_session";


/**
* for logging
*/

function log(text) {
	if(DEBUG) {
		$('#logArea').append(text);
		$('#logArea').append('<br />');
	}
}

$(document).ready(function () {

	function fetchUserList() {
		userList = $('#user-list');
		for(var i in lightdm.users) {
			var user = lightdm.users[i];
			var lastSession = localStorage.getItem(user.name);
			if(lastSession == null && lastSession == undefined) {
				localStorage.setItem(user.name, lightdm.default_session);
				lastSession = localStorage.getItem(user.name);
			}
			log('Last Session (' + user.name + '): ' + lastSession);
			var userItem = '<li class="mdl-menu__item"> <a href="#' + user.name + '" onclick="startAuthentication(\'' + user.name + '\')" data-session="' + lastSession + '">' + user.display_name + '</a></li>';
			$(userList).append(userItem);
		}
	}

	function fetchSessionList() {
		var sessionMenu = $('#sessions');
		for (var i in lightdm.sessions) {
			var session = lightdm.sessions[i];
			var className = session.name.replace(/ /g, '');
			var item = '\n<li><a href="#" data-session-id="' + session.key + '" onclick="sessionToggle(this)" class="' + className + '">' + session.name + '</a></li>';
			$(sessionMenu).append(item);
		}
	}

	function loadDefaults() {
		defaultAccount = getUserObj(default_account_name);
		defaultSession = getSessionObj(default_session_name);
		if( defaultSession !== null && defaultAccount !== null ) {
			log("loaded default account: " + defaultAccount.name + " and default session: " + defaultSession.name);
			USE_DEFAULTS = true;
		}
		if (defaultSession == null) {
			log("default session is null!");
		}
		if(defaultAccount == null) {
			log("default account is null!");
		}

	}

	$(window).load(function() {

		/**
		* Loading UI informations
		*/

		get_hostname();

		fetchUserList();
		fetchSessionList();
		loadDefaults();
		printDebugInfo();

		//if possible - start authentication with default session
		if(USE_DEFAULTS) {
			startDefaultAuthentication();
		}

		// submit the password when enter is pressed
		$(document).keydown(function (e) {
			checkKey(e);
		});

		$('#loading_button_area').hide();
		$('#wrongpass').hide();
		$('#pass').focus();

	});

	function get_hostname() {
		var hostname = lightdm.hostname;
		log("hostname: " + hostname);
		//in case the name should be visible
		//var hostname_span = document.getElementById('FIELD_ID');
		//$(hostname_span).append(hostname);
	}

	function checkKey(event) {
		var action;
		if(event.which == 13) {
			action = authPending ? submitPassword() : 0;
			log(action);
		}
	}

	window.handleAction = function (id) {
		log("handleAction(" + id + ")");
		eval("lightdm." + id + "()");
	};

	function getUserObj(username) {
		var user =  null;
		for (var i = 0; i < lightdm.users.length; ++i) {
			if(lightdm.users[i].name == username) {
				user = lightdm.users[i];
				break;
			}
		}
		return user;
	}

	function getSessionObj(sessionname) {
		var session = null;
		for(var i = 0; i < lightdm.sessions.length; ++i) {
			if(lightdm.sessions[i].name == sessionname) {
				session = lightdm.sessions[i];
				break;
			}
		}
		return session;
	}

	function printDebugInfo() {
		log("-- debug info --");
		log("total users found: " + lightdm.users.length);
		log("total sessions found: " + lightdm.sessions.length);
		//print the user names
		for(var i = 0; i < lightdm.users.length; i++) {
			var usr = lightdm.users[i];
			log("username found: " + usr.name);
		}
		for(var y = 0; y < lightdm.sessions.length; y++) {
			var sn = lightdm.sessions[y];
			log("session found: " + sn.name);
		}
		log("-- end debug info --");
	}

	function startDefaultAuthentication() {
		log("start default authentication for: " + defaultAccount.name);
		var userNameLabel = document.getElementById("user_current");
		userNameLabel.innerHTML = defaultAccount.display_name;
		$('#session-area').hide();
		$('#switch_user').hide();
		authPending = true;
		lightdm.start_authentication(defaultAccount.name);
	}

	window.startAuthentication = function (userId) {
		log("startAuthentication(" + userId + ")");

		var sessionButton = $('#session-list-btn');
		var userLabel = $('#user-current');

		if(selectedUser !== null) {
			lightdm.cancel_authentication();
			localStorage.setItem('selUser', null);
			log("authentication cancelled for " + selectedUser);
		}

		localStorage.setItem('selUser', userId);
		log(userList);
		var usrSession = localStorage.getItem(userId);
		log("usrSession: " + usrSession);
		var usrSessionEl = "[data-session-id=" + usrSession + "]";
		var usrSessionName = $(usrSessionEl).html();
		$(userLabel).html(usrSessionName);
		$(sessionButton).attr('data-session-id', usrSession);
		authPending = true;
		lightdm.start_authentication(userId);
	};

	window.cancelAuthentication = function () {
		log("authentication cancelled for " + selectedUser);
		lightdm.cancel_authentication();
		selectedUser = null;
		authPending = false;
		return true;
	};

	window.submitPassword = function () {
		$('#login_button_area').hide();
		$('#loading_button_area').show();
		log("provide_secret -> called! value: " + $('#pass').val());
		if(USE_DEFAULTS) log("-> called for default authentication!");
		lightdm.provide_secret($('#pass').val());
		//todo: maybe hide password field and show progress circle
		log("provide_secret -> done!");
	};

	window.sessionToggle = function(el) {
		var selectedText = $(el).text();
		var selectedID = $(el).attr('data-session-id');
		var selUser = localStorage.getItem('selUser');
		$('#session-list-btn').attr('data-session-id', selectedID);
		$('#session-list-btn').html(selectedText);
		localStorage.setItem(selUser, selectedID);
	};

});

/**
* Lightdm Callbacks
*/
function show_prompt(text) {
	log("show_prompt(" + text + ")");
	$('#pass').val("");
	$('#pass').focus();
}

function authentication_complete() {
	log("authentication_complete()");
	$('#loading_button_area').hide();
	$('#login_button_area').show();
	authPending = false;
	if(USE_DEFAULTS) {
		if(lightdm.is_authenticated) {
			log("-> authenticated with defaults!");
			lightdm.login(lightdm.authentication_user, defaultSession.key);
		} else {
			log("-> unable to authenticate with defaults!");
			$('#wrongpass').show();
		}
	} else {
		var selSession = $('#session-list-btn').attr('data-session-id');
		if(lightdm.is_authenticated) {
			log("-> authenticated !");
			lightdm.login(lightdm.authentication_user, selSession);
		} else {
			//show error
			log("-> not authenticated !");
			$('#wrongpass').show();
		}
	}
}

function show_message(text) {
	log(text);
}

function show_error(text) {
	show_message(text);
}
