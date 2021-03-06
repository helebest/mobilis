var xhunt = {
	NAME: localStorage.getItem('mobilis.xhunt.username'),
	JID: localStorage.getItem('mobilis.xhunt.jid'),
	PASSWORD: localStorage.getItem('mobilis.xhunt.password'),
	gameinfo: {
		joined : false
	},
	position: {
	},
	tickets :{
		'4' : {
			'title' : 'Black',
			'url' :  'http://mobilis.inf.tu-dresden.de/bilder/ti_black.png'
		},
		'1' : {
			'title' : 'Tram',
			'url' :  'http://mobilis.inf.tu-dresden.de/bilder/ti_tram.png'
		},
		'2' : {
			'title' : 'Bus',
			'url' :  'http://mobilis.inf.tu-dresden.de/bilder/ti_bus.png'
		},
		'3' : {
			'title' : 'Railway',
			'url' :  'http://mobilis.inf.tu-dresden.de/bilder/ti_railway.png'
		}
	},
	icons : {
		blue : {
			url : 'http://mobilis.inf.tu-dresden.de/bilder/ic_player_blue_36.png',
			color : '#04F',
			used : false,
			markericon : new google.maps.MarkerImage('http://mobilis.inf.tu-dresden.de/bilder/ic_player_blue_36.png',
				new google.maps.Size(36, 36),
				new google.maps.Point(0, 0),
				new google.maps.Point(18, 26),
				new google.maps.Size(36, 36)),
		},
		green : {
			url : 'http://mobilis.inf.tu-dresden.de/bilder/ic_player_green_36.png',
			color : '#2F0',
			used : false,
			markericon : new google.maps.MarkerImage('http://mobilis.inf.tu-dresden.de/bilder/ic_player_green_36.png',
				new google.maps.Size(36, 36),
				new google.maps.Point(0, 0),
				new google.maps.Point(18, 26),
				new google.maps.Size(36, 36)),
		},
		orange : {
			url : 'http://mobilis.inf.tu-dresden.de/bilder/ic_player_orange_36.png',
			color : '#F90',
			used : false,
			markericon : new google.maps.MarkerImage('http://mobilis.inf.tu-dresden.de/bilder/ic_player_orange_36.png',
				new google.maps.Size(36, 36),
				new google.maps.Point(0, 0),
				new google.maps.Point(18, 26),
				new google.maps.Size(36, 36)),
		},
		red : {
			url : 'http://mobilis.inf.tu-dresden.de/bilder/ic_player_red_36.png',
			color : '#F00',
			used : false,
			markericon : new google.maps.MarkerImage('http://mobilis.inf.tu-dresden.de/bilder/ic_player_red_36.png',
				new google.maps.Size(36, 36),
				new google.maps.Point(0, 0),
				new google.maps.Point(18, 26),
				new google.maps.Size(36, 36)),
		},
		yellow : {
			url : 'http://mobilis.inf.tu-dresden.de/bilder/ic_player_yellow_36.png',
			color : '#EF0',
			used : false,
			markericon : new google.maps.MarkerImage('http://mobilis.inf.tu-dresden.de/bilder/ic_player_yellow_36.png',
				new google.maps.Size(36, 36),
				new google.maps.Point(0, 0),
				new google.maps.Point(18, 26),
				new google.maps.Size(36, 36)),
		},
		black : {
			url : 'http://mobilis.inf.tu-dresden.de/bilder/ic_player_mrx_36.png',
			color : '#000',
			used : false,
			markericon : new google.maps.MarkerImage('http://mobilis.inf.tu-dresden.de/bilder/ic_player_mrx_36.png',
				new google.maps.Size(36, 36),
				new google.maps.Point(0, 0),
				new google.maps.Point(18, 26),
				new google.maps.Size(36, 36)),
		}
	},
	hlst: new google.maps.MarkerImage('http://mobilis.inf.tu-dresden.de/bilder/station_50px.gif',
		new google.maps.Size(18, 18),
		new google.maps.Point(0, 0),
		new google.maps.Point(9, 9),
		new google.maps.Size(18, 18)),
	colors: ['#800000', '#008000', '#0000A0'],
	stations: {},
	players: {},
















/* ============================================================================================================== 

 #    #  #    #  #    #  #    #  #####      #    #    ##    #    #  #####   #       ######  #####    ####  
  #  #   #    #  #    #  ##   #    #        #    #   #  #   ##   #  #    #  #       #       #    #  #      
   ##    ######  #    #  # #  #    #        ######  #    #  # #  #  #    #  #       #####   #    #   ####  
   ##    #    #  #    #  #  # #    #        #    #  ######  #  # #  #    #  #       #       #####        # 
  #  #   #    #  #    #  #   ##    #        #    #  #    #  #   ##  #    #  #       #       #   #   #    # 
 #    #  #    #   ####   #    #    #        #    #  #    #  #    #  #####   ######  ######  #    #   ####  

============================================================================================================== */









	onPlayersRequest: function (iq) { //  <PlayersRequest xmlns="mobilisxhunt:iq:players">

		Mobilis.xhunt.respondPlayer(
			$(iq).attr('from'), // gameJID
			$(iq).attr('id'), // iqid
			function (result){  // resultcallback
				xhunt.log('respondPlayer result:'); xhunt.log(result);
			},
			function (error){ // errorcallback
				xhunt.log('respondPlayer error:'); xhunt.log(error);
				xhunt.log($(error).find('text').text());
			}
		);

		$('#player-list').empty();

		$(iq).find('PlayerInfo').each(function(){ 

			var jid = $(this).find('Jid').text();

			if (!xhunt.players[jid]) {
				xhunt.players[jid] = {
					'name'  : '',
					'lat'   : '',
					'lon'   : '',
					'tlat'  : '',
					'tlon'  : '',
					'ismrx' : '',
					'ismod' : '',
					'icon'  : '',
					'round' : '0'
				}
			};

			var player = xhunt.players[jid];

			player.name = $(this).find('PlayerName').text();
			player.ismod = Boolean($(this).find('IsModerator').text().match(/^true$/i));
			player.ismrx = Boolean($(this).find('IsMrX').text().match(/^true$/i));
			var isready = Boolean($(this).find('IsReady').text().match(/^true$/i));

			player.icon.used = false;
			var mrxHtml = '';
			if (player.ismrx) {
				player.icon = xhunt.icons.black;
				xhunt.icons.black.used = true;
				mrxHtml = '<span class="ui-li-count">X</span>';
			} else {
				$.each(xhunt.icons, function(index, value){
					if (!value.used) {
						value.used = true;
						player.icon = value;
						return false;
					}
				});
			}

			var modHtml = (player.ismod) ? '<span class="ui-li-count">M</span>' : '';
			var rdyHtml = (isready) ? '  &#10003;' : '';

			$('#player-list').append('<li><img src="' 
									+ player.icon.url 
									+ ' "/>' 
									+ player.name 
									+ rdyHtml 
									+ modHtml 
									+ mrxHtml 
									+ '</li>')
			.listview('refresh');
		});

		var info = $(iq).find('Info').text();
		xhunt.log('PlayersRequest Info: '+ info );

		return true;   
	},










	onStartRoundRequest : function (iq) { // <StartRoundRequest xmlns="mobilisxhunt:iq:startround">

		Mobilis.xhunt.respondStartRound(
			localStorage.getItem('mobilis.xhunt.gamejid'), // gameJID			
			iq.getAttribute('id'), // iqid
			function (result){  // resultcallback
				xhunt.log('respondStartRound result:'); xhunt.log(result);
				xhunt.log($(result).find('text').text());
			},
			function (error){ // errorcallback
				xhunt.log('respondStartRound error:'); xhunt.log(error);
				xhunt.log($(error).find('text').text());
			}
		);

		//$('#waitingforplayers-tooltip').popup('close');

		xhunt.log('Game started: xhunt.gameinfo.name:'); xhunt.log(xhunt.gameinfo.name);

		var round = $(iq).find('Round').text();
		var nextround = parseInt( round, 10 ) + 1 ;
		var showmrx = Boolean($(this).find('ShowMrX').text().match(/^true$/i));

		xhunt.log('xhunt.players:');xhunt.log(xhunt.players);

		$.each(xhunt.players, function(index, player) { 
			xhunt.log(player.round);
			xhunt.log('index: ' + index + ', player.round: ' + player.round);
			if (parseInt( player.round , 10 )=== parseInt( round, 10 )){
				player.round = nextround;
				// $(iq).find('TicketAmount').each(function(){
				// 	var ticketid = $(this).find('ID').text();
				// 	var ticketamount =$(this).find('Amount').text();
				// 	//$('#' + index + '_' + ticketid).html('<img class="ticketicon" src="'+ xhunt.tickets[ticketid].url +'"/> ' + ticketamount);
				// })
				//return false;
			} 
			xhunt.log('player.round after:' + player.round);
		});
		return true;
	},










/*	on_startRoundIQ: function (iq) {
		var round = $(iq).find('gameround').text();
		var nextround = parseInt( round, 10 ) + 1 ;
		$('#roundinfo').html('<div id="roundinfo_content">Round : ' + 
			round + '   Show MrX: <span id="showmrx"></span></div>');
		var showmrx = $(iq).find('ShowMrX').text();
		if (showmrx === 'true')
			$('#showmrx').html('YES');
		else {
			$('#showmrx').html('NO');
		}
		$.each(xhunt.players, function(index, value) { 
			if (parseInt( value.round , 10 )=== parseInt( round, 10 )){
				value.round = nextround;
				$(iq).find('ticket').each(function(){
					var ticketid = $(this).find('ticketid').text();
					var ticketamount =$(this).find('ticketamount').text();
					$('#' + index + '_' + ticketid).html('<img class="ticketicon" src="'+ xhunt.tickets[ticketid].url +'"/> ' + ticketamount);
				})                    
				return false;
			} 
		});

		return true;   
	},
*/

	onLocationRequest : function(iq) { // <LocationRequest xmlns="mobilisxhunt:iq:location">
		Mobilis.xhunt.respondLocation(

			localStorage.getItem('mobilis.xhunt.gamejid'), // gameJID
			Mobilis.connection.jid, // playerJid
			iq.getAttribute('id'), // iqid
			Math.round(xhunt.position.latitude  * 1000000), // latitude
			Math.round(xhunt.position.longitude * 1000000), // longitude
			function (result){  // resultcallback
				xhunt.log('respondLocation result:'); xhunt.log(result);
				xhunt.log($(result).find('Text').text());
			},
			function (error){ // errorcallback
				xhunt.log('respondLocation error:'); xhunt.log(error);
				//xhunt.log($(error).find('Text').text());
			}
		);

		$(iq).find('LocationInfo').each(function(){
			var jid = $(this).find('Jid').text(	);
			var lat = parseInt( $(this).find('Latitude').text(), 10 )/ 1000000;
			var lon = parseInt( $(this).find('Longitude').text(), 10 )/ 1000000;
			xhunt.players[jid].lat = lat;
			xhunt.players[jid].lon = lon;

			xhunt.log(xhunt.players[jid]);

			$('#map').gmap3({
			  action:'clear',
			  name:'marker',
			  tag: jid, 
			});
			$('#map').gmap3(
			   {
				action: 'addMarker',
				latLng: [lat, lon],
				options: { 
					icon: xhunt.players[jid].icon.markericon,
				},
				tag: jid
			   }
			);
		});

		return true;
	},


	onGameOverRequest : function (iq) {
		Mobilis.xhunt.respondGameOver(
			$(iq).attr('from'), // gameJID
			$(iq).attr('id'), // iqid
			function (result){  // resultcallback
				xhunt.log('respondGameOver result:'); xhunt.log(result);
			},
			function (error){ // errorcallback
				xhunt.log('respondGameOver error:'); xhunt.log(error);
				xhunt.log($(error).find('text').text());
			}
		);
		$.each(xhunt.players, function(index, player) { 
			$('#map').gmap3({
				action:'clear',
				name:'marker',
				tag: player, 
			});
		});
		xhunt.log('This Game is over!');xhunt.log(iq);
		return true;
	},

/*	on_gameOverIQ: function (iq) {
		xhunt.log('Game Over');
		//$.jGrowl('Game Over');
		xhunt.log($(iq).find('reason').text(), {sticky: true });   
		//$.jGrowl($(iq).find('reason').text(), {sticky: true });   
		return true;  
	},
*/	
	onUpdateTicketsRequest : function (iq) {
		//todo
	},
/*	on_usedTicketsIQ: function (iq) {
		$(iq).find('player').each(function(){
			var jid = Strophe.getNodeFromJid($(this).find('playername').text());
			var ticket = $(this).find('ticketid').text();
			$('#' + jid + '_' + ticket).append('+');
		});
		//xhunt.log('usedTickets');
		//xhunt.log(iq);   
		return true;
	},
*/	

	onRoundStatusRequest : function (iq) {
		Mobilis.xhunt.respondRoundStatus(
			$(iq).attr('from'), // gameJID
			$(iq).attr('id'), // iqid
			function (result){  // resultcallback
				xhunt.log('respondRoundStatus result:'); xhunt.log(result);
			},
			function (error){ // errorcallback
				xhunt.log('respondRoundStatus error:'); xhunt.log(error);
				xhunt.log($(error).find('text').text());
			}
		);		
		return true;
	},
/*	on_roundStatusIQ: function (iq) {
		
		$(iq).find('player').each(function(){

			var jid = Strophe.getNodeFromJid($(this).find('jid').text());
			var stationID = $(this).find('stationid').text();
			var isfinal = $(this).find('isfinal').text();
			var arrived = $(this).find('arrived').text();
			if (xhunt.stations[stationID])
				var stationName = xhunt.stations[stationID].name;
			else
				var stationName = '-';
			if (arrived === 'true') {
				$('#' + jid + ' > .playertarget').html('Target Station: -');
				$('#map').gmap3({
				  action:'clear',
				  name:'polyline',
				  tag: jid, 
				});   
			} else {
				$('#' + jid + ' > .playertarget').html('Target Station: ' + stationName);
				if (xhunt.stations[stationID]){
					//.log('setTargetPolyline');
					xhunt.players[jid].tlat = xhunt.stations[stationID].lat;
					xhunt.players[jid].tlon = xhunt.stations[stationID].lon;
				}
				$('#map').gmap3(
				   {
					   action: 'addPolyline',
					   options: {
						   strokeColor: xhunt.players[jid].icon.color,
						   strokeOpacity: 1.0,
						   strokeWeight: 8
					   },
					   path: [[xhunt.players[jid].lat , xhunt.players[jid].lon], [xhunt.players[jid].tlat, xhunt.players[jid].tlon]],
					   tag: jid
				   }
				);
			}  


  
		});
		return true;   
	}, 
*/

/*	on_invitation: function (iq) {
		var gameJid = $(iq).find('param').first().text();
		var gameName = $(iq).find('param').next().text();
		xhunt.gameinfo['gameJID'] = gameJid;
		xhunt.gameinfo['name'] = gameName;
		xhunt.joinGame( { jid: $(this).attr('id') } );
		$('#login_dialog').dialog('close');
		return true;   
	},
*/













/* ============================================================================================================== 

 #    #  #    #  #    #  #    #  #####      #    #  ######  #####  #    #   ####   #####    ####  
  #  #   #    #  #    #  ##   #    #        ##  ##  #         #    #    #  #    #  #    #  #      
   ##    ######  #    #  # #  #    #        # ## #  #####     #    ######  #    #  #    #   ####  
   ##    #    #  #    #  #  # #    #        #    #  #         #    #    #  #    #  #    #       # 
  #  #   #    #  #    #  #   ##    #        #    #  #         #    #    #  #    #  #    #  #    # 
 #    #  #    #   ####   #    #    #        #    #  ######    #    #    #   ####   #####    ####  

============================================================================================================== */








	addHandlers : function () {
		Mobilis.xhunt.addGameOverHandler(xhunt.onGameOverRequest);
		Mobilis.xhunt.addLocationHandler(xhunt.onLocationRequest);
		Mobilis.xhunt.addPlayersHandler(xhunt.onPlayersRequest);
		Mobilis.xhunt.addRoundStatusHandler(xhunt.onRoundStatusRequest);
		Mobilis.xhunt.addStartRoundHandler(xhunt.onStartRoundRequest);
	},

	connectServer : function() {
		// if (Mobilis.core.Status.CONNECTED){
		// 	Mobilis.core.disconnect('reconnect');
		// };
		xhunt.log('connect: ' + xhunt.JID + ' '+ xhunt.PASSWORD);
		Mobilis.core.connect(
			xhunt.JID,
			xhunt.PASSWORD,
			function(status) {
				
				if (status == Mobilis.core.Status.CONNECTED) {

					xhunt.queryGames();

				} 
			}
		);
	},

	queryGames : function() {

		Mobilis.core.mobilisServiceDiscovery(
			[Mobilis.core.NS.XHUNT],
			function (iq) {
				$('#game-list').empty().listview();
				xhunt.log('querying...');
				if ($(iq).find('mobilisService').length){
					$(iq).find('mobilisService').each( function() {
						Mobilis.core.SERVICES[$(this).attr('namespace')] = {
							'version': $(this).attr('version'),
							'jid': $(this).attr('jid'),
							'servicename' : $(this).attr('serviceName')
						};
						$('#game-list').append('<li><a class="available-game" id="'
												 + $(this).attr('jid') 
												 + '" href="lobby.html" data-transition="slide">' 
												 + $(this).attr('serviceName') 
												 + '</a></li>');
					});
				} else {
					$('#game-list').append('<li>No games found</li>');
				}
				$('#game-list').listview('refresh');
			}
		);
	},

	sendMessage : function (message) {

		if (xhunt.gameinfo['room']) {
			Mobilis.connection.muc.message(
				xhunt.gameinfo['room'],
				xhunt.gameinfo['nick'], 
				message, 
				'groupchat');
		}
		return true;
	},

	updatePlayer : function (updates) {
		Mobilis.xhunt.updatePlayer(
			localStorage.getItem('mobilis.xhunt.gamejid'), //gameJID
			Mobilis.connection.jid, //playerJid
			xhunt.NAME, //playerName
			updates.ismod, //isModerator
			updates.ismrx, //isMrX
			updates.ready, //isReady
			function (result){  // resultcallback
				xhunt.log('updatePlayer Info:' + $(result).find('Info').text());
			},
			function (error){ // errorcallback
				xhunt.log('updatePlayer Error:'); xhunt.log(error);
				//xhunt.log($(error).find('text').text());
			}
		);
		return true;
	},

	joinGame : function (data) {
		Mobilis.xhunt.joinGame(
			data.jid, //gameJID
			xhunt.NAME, //playerName
			function (result){  // resultcallback: <JoinGameResponse xmlns="mobilisxhunt:iq:joingame">

				var room = $(result).find('ChatRoom').text();
				var pwd = $(result).find('ChatPassword').text();
				//xhunt.log('xhunt.gameinfo.name:');xhunt.log(xhunt.gameinfo.name);
				//$('title').append(xhunt.gameinfo.name + ' Lobby | Mobilis XHunt');
				//$('#header').append(xhunt.gameinfo.name + ' Lobby');

				xhunt.gameinfo['room'] = room.toLowerCase();
				xhunt.gameinfo['pwd'] = pwd;
				xhunt.gameinfo['nick'] = xhunt.NAME;

				if (xhunt.gameinfo['joined'] == false){
					Mobilis.connection.muc.join(
						xhunt.gameinfo['room'], // room
						xhunt.gameinfo['nick'], // nick
						function(message) {     // msg_handler_cb: <message .../>
							if ( from = Strophe.getResourceFromJid($(message).attr('from')) ){
								xhunt.log(from + ' says: ' + $(message).find('body').text() );
							}
							return true;
						}, 						
						function (presence){       // pres_handler_cb: <presence ... />

							if ( from = Strophe.getResourceFromJid($(presence).attr('from')) ){
								xhunt.log('presence: ' + from);
							}
							return true;
						},
						xhunt.gameinfo['pwd']  // password
					);
					xhunt.gameinfo['joined'] = true;
				}
			},
			function (error){ // errorcallback
				xhunt.log('joinGame error:'); xhunt.log(error);
				xhunt.log($(error).find('text').text());
			}
		);
	},

	exitGame : function () {
		if (Mobilis.connection.connected) {
			if (Mobilis.xhunt.gameJID){
				Mobilis.xhunt.playerExit(
					localStorage.getItem('mobilis.xhunt.gamejid'), //gameJID
					Mobilis.connection.jid, //playerJid
					function (result){  // resultcallback
						xhunt.log('playerExit result:'); xhunt.log(result);
					}, 
					function (error){ // errorcallback
						xhunt.log('playerExit error:'); xhunt.log(error);
						xhunt.log($(error).find('text').text());
					}
				);

				xhunt.queryGames();
				// $('#players').html('');  
				// $('#roundinfo').html('');
				// $('#chatdisplay').html(''); 
				// $('#gameinformation').html('Game Information');
				// $('#map_canvas').gmap3({
				// 	action:'clear',
				// 	name:'polyline'
				// });  
				// $('#map_canvas').gmap3({
				// 	action:'clear',
				// 	name:'marker'
				// });

			}
		}
	},

	requestTarget : function(data) {
		//todo
	},

	initMap : function(data) {
		// if (navigator.geolocation) {
		// 	xhunt.log('yes we have a geolocation');
		navigator.geolocation.getCurrentPosition( function (position) {

			// var current_latitude = position.coords.latitude;
			// var current_longitude = position.coords.longitude;
			var current_latitude = xhunt.position.latitude; xhunt.log('current_latitude: '+current_latitude);
			var current_longitude = xhunt.position.longitude; xhunt.log('current_longitude: '+current_longitude);

			$('#map').gmap3({
				action: 'init',
					options:{
						center: [current_latitude, current_longitude],
						zoom: 15,
						mapTypeId: google.maps.MapTypeId.MAP,
						mapTypeControl: false,
						navigationControl: true,
						scrollwheel: true,
						streetViewControl: false
					}
				}
			).height($(document).height()-42); // 42 = Header Height

			$.ajax({
				type: "GET",
				url: data.xml,
				dataType: "xml",
				success: function(xml) {
					$(xml).find('Station').each(function() {
						xhunt.stations[$(this).attr('id')] = {
							'abbrev': $(this).attr('abbrev'),
							'name': $(this).attr('name'),
							'lat': $(this).attr('latitude'),
							'lon' : $(this).attr('longitude')
						};
						$('#map').gmap3({
							action: 'addMarker',
							latLng: [$(this).attr('latitude'), $(this).attr('longitude')],
							marker: {
								options: {
									icon: xhunt.hlst,
									title: $(this).attr('name')
								}
							},
						},'autofit'
						);
					});
					
					$(xml).find('Route').each(function() {
						var stops = [];
						var i = 0;
						var colornummer = $(this).attr('type');
						$(this).find('stop').each(function() {
							$(xml).find("Station[id='" + $(this).text() + "']").each(function() {
								var latitude = $(this).attr('latitude');
								var longitude = $(this).attr('longitude');
								stops[i] = [];
								stops[i][0] = latitude;
								stops[i][1] = longitude;
								i++;
							});

							// key-value hashmap mit jeder haltestelle die in der route davor und oder danach ist
							// key ist n int, value ist liste von ints der jeweiligen stationen
							
						});
						$('#map').gmap3({
							action: 'addPolyline',
							options: {
								strokeColor: xhunt.colors[colornummer],
								strokeOpacity: 1.0,
								strokeWeight: 2
							},
							path: stops
						});
					});
				}
			});

			// $('#waitingforplayers-tooltip').popup('open', {
			// 	positionTo: 'window',
			// 	theme: 'a'
			// });

		},
		function (msg) {
			xhunt.log(typeof msg == 'string' ? 'Error: ' + msg : 'unknown GeoLocation Error');
		});
		// } else {
		// 	xhunt.log('HTML5 GeoLocation not supported');
		// }
	},













/* ============================================================================================================== 

 #    #  ######  #       #####   ######  #####    ####  
 #    #  #       #       #    #  #       #    #  #      
 ######  #####   #       #    #  #####   #    #   ####  
 #    #  #       #       #####   #       #####        # 
 #    #  #       #       #       #       #   #   #    # 
 #    #  ######  ######  #       ######  #    #   ####  

============================================================================================================== */







/*
	createPlayer : function (jid) {
		if (!xhunt.players[jid]) {
			xhunt.players[jid] = {
				'name'  : '',
				'lat'   : '',
				'lon'   : '',
				'tlat'  : '',
				'tlon'  : '',
				'ismrx' : '',
				'ismod' : '',
				'icon'  : '',
				'round' : '0'
			};
		}
	},
*/

	convert : function (num) {
		var num=num;
		ans="";
		for (var i=0;i<num.length;i++){
			if (i==num.length-6)
				ans=ans+"."+num.charAt(i);
			else
				ans=ans+num.charAt(i);
		}
		return ans;
	},

	log: function (msg) {
		console.log(msg);
		//$('#logwindow').append('<div class="message" ></div>').append(document.createTextNode(msg))
	},

	watchPosition: function () {
		navigator.geolocation.watchPosition(function(position) {
			xhunt.log(xhunt.position['latitude'] = position.coords.latitude);
			xhunt.log(xhunt.position['longitude'] = position.coords.longitude);
		});
	},
	randomizePosition: function () {
		xhunt.log(xhunt.position['latitude'] = (510+Math.random())/10);
		xhunt.log(xhunt.position['longitude'] = (137+Math.random())/10);
	}
};















/* ============================================================================================================== 

      #   ####   #    #  ######  #####   #   #      #    #    ##    #    #  #####   #       ######  #####    ####  
      #  #    #  #    #  #       #    #   # #       #    #   #  #   ##   #  #    #  #       #       #    #  #      
      #  #    #  #    #  #####   #    #    #        ######  #    #  # #  #  #    #  #       #####   #    #   ####  
      #  #  # #  #    #  #       #####     #        #    #  ######  #  # #  #    #  #       #       #####        # 
 #    #  #   #   #    #  #       #   #     #        #    #  #    #  #   ##  #    #  #       #       #   #   #    # 
  ####    ### #   ####   ######  #    #    #        #    #  #    #  #    #  #####   ######  ######  #    #   ####  

============================================================================================================== */








$(document).on('pageinit', '#games-page', function() {

	if ( (navigator.geolocation) && (localStorage.getItem('mobilis.xhunt.staticmode') == 'off') ) {

		xhunt.watchPosition();
		xhunt.connectServer();

	} else {
		xhunt.log('Only Static Mode supported');
		xhunt.randomizePosition();
		xhunt.connectServer();
	}

});


$(document).on('click', '.available-game', function () {

	localStorage.setItem('mobilis.xhunt.gamejid', $(this).attr('id'));

	xhunt.gameinfo['gameJID'] = $(this).attr('id');
	xhunt.gameinfo['name'] = $(this).text();


	xhunt.addHandlers();
	xhunt.joinGame( { jid: $(this).attr('id') } );
	
});


// $(document).on('click', '#send-message-button', function () {
// 	xhunt.sendChat('Chat!');
// });


$(document).on('click', '#getready-button', function() {
	xhunt.updatePlayer( {
		'ready': true
	});
});


$(document).on('click', '#exitgame-button', function() {
	xhunt.exitGame();
});

$(document).on('click', '#refresh-button', function() {
	xhunt.queryGames();
});


$(document).on('click', '#ingamemenu-button', function() {
	$('#ingamemenu-container').popup('open', {
		positionTo: 'window',
		theme: 'b',
		corners: true
	});
});
$(document).on('click', '#message-button', function() {
	$('#message-container').popup('open', {
		positionTo: 'window',
		theme: 'b',
		corners: true
	});
});

$(document).on('click', '#message-form #submit', function() {
	var message = $('#message-form #message').val();
	if (message) {
		xhunt.log(message);
		xhunt.sendMessage(message);
	}
	$('#message-container').popup('close');
	return false;
});



$(document).on('pageinit', '#game-page', function() {
	// $('title').append(xhunt.gameinfo.name + ' | Mobilis XHunt');
	// $('#header').append(xhunt.gameinfo.name);

	xhunt.initMap( { xml: 'data/sites.xml' } );
});


$(document).on('pageinit', '#settings-page', function() {
	$('#settings-form #username').val(localStorage.getItem('mobilis.xhunt.username'));
	$('#settings-form #jid').val(localStorage.getItem('mobilis.xhunt.jid'));
	$('#settings-form #password').val(localStorage.getItem('mobilis.xhunt.password'));
	if (localStorage.getItem('mobilis.xhunt.staticmode') == 'on') {
		var staticmode = $('#settings-form #staticmode');
		staticmode[0].selectedIndex = 1;
		staticmode.slider('refresh');
	}
});


$(document).on('click', '#settings-form #submit', function() {
	localStorage.setItem('mobilis.xhunt.username', $('#settings-form #username').val());
	localStorage.setItem('mobilis.xhunt.jid', $('#settings-form #jid').val());
	localStorage.setItem('mobilis.xhunt.password', $('#settings-form #password').val());
	localStorage.setItem('mobilis.xhunt.staticmode', $('#settings-form #staticmode').val());
	xhunt.log(localStorage.getItem('mobilis.xhunt.username'));
	xhunt.log(localStorage.getItem('mobilis.xhunt.jid'));
	xhunt.log(localStorage.getItem('mobilis.xhunt.password'));
	xhunt.log(localStorage.getItem('mobilis.xhunt.staticmode'));
	$('#settings-form #username').val(localStorage.getItem('mobilis.xhunt.username'));
	$('#settings-form #jid').val(localStorage.getItem('mobilis.xhunt.jid'));
	$('#settings-form #password').val(localStorage.getItem('mobilis.xhunt.password'));
	if (localStorage.getItem('mobilis.xhunt.staticmode') == 'on') {
		var staticmode = $('#settings-form #staticmode');
		staticmode[0].selectedIndex = 1;
		staticmode.slider('refresh');
	}

	return true;
});



// $(window).on('orientationchange resize pageshow', function() {

// 	/* http://www.semicomplete.com/blog/geekery/jquery-mobile-full-height-content
// 	 * Some orientation changes leave the scroll position at something
// 	 * that isn't 0,0. This is annoying for user experience. */
// 	scroll(0, 0);

// 	/* Calculate the geometry that our content area should take */
// 	var header = $("#header:visible");
// 	//var footer = $("#footer:visible");
// 	var content = $("#content:visible");
// 	var viewport_height = $(window).height();
// 	var content_height = viewport_height - header.outerHeight();// - footer.outerHeight();

// 	/* Trim margin/border/padding height */
// 	content_height -= (content.outerHeight() - content.height());
// 	content.height(content_height);
// });
