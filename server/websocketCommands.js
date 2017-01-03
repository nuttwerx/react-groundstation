
module.exports = function (io, udp, room, logger, podCommands, commConfig)
{
	var updateClientWithDatalogs = true;

	//flag used to allow/disallow Move Motor Raw command (EXTREAM DANGER WILL DAMAGE MAGNETS)
	var _brakeDevelopmentConfirmation = false;

	var _timer;

	var websocket = {};
	
	// socket.io demo
	io.on('connection', function (socket) {

	  /*
	  if(!udp.rx.listeningForUdp)
		startListening();*/

	  function startListening(){ // listen for udp packets
	  /*
		udp.rx.listeningForUdp = true;
		udp.rx.server().on('message', function (message, remote) {
			console.log("GROUNSTATION UDP - RECEIVED: " + remote.address + ':' + remote.port +' - ' + message);
			logger.log("debug", "GROUNSTATION UDP - RECEIVED: " + remote.address + ':' + remote.port +' - ' + message);

			if(updateClientWithDatalogs)
			{
			  socket.in('dataLogging').emit('udp:event', {
				log: remote.address + ':' + remote.port +' - ' + message
			  });
			}
		});*/
	  }

	  websocket.events = {

			'forceDisconnect': () => {

				socket.disconnect();

			},

			'XilinxSim:StartRun': (data) => {

				podCommands.XilinxSimStart();

			},

			'FlightControl_Brake:MoveMotorRAW': (data) => {

				// THIS IS EXTREAMLY DANGEROUS (WILL DAMAGE MAGNETS)


				if(_brakeDevelopmentConfirmation)
				{

					podCommands.FCUBrake_MoveMotorRAW(data);

				}

			},

			'FlightControl_Brake:DisableDevelopmentMode': () => {

				_brakeDevelopmentConfirmation = false; //flag used to allow/disallow Move Motor Raw command

				podCommands.FCUBrake_DisableDevelopmentMode();

			},

			'FlightControl_Brake:EnableDevelopmentMode': () => {

				// THIS IS VERY VERY DANGEROUS 


				_brakeDevelopmentConfirmation = true; //flag used to allow/disallow Move Motor Raw command

				podCommands.FCUBrake_EnableDevelopmentMode();

			},

			'FlightControl_Accel:StartStream_CalData': () => {

				podCommands.FCUStreamingControlStart_AccelCalData()

			},

			'FlightControl_Accel:StartStream_FullData': () => {

				podCommands.FCUStreamingControlStart_AccelFullData()

			},

			'FlightControl_Accel:StopStream': () => {

				podCommands.FCUStreamingControlStop_Accel()

			},

			'FlightControl_Accel:FineZero': (data) => {

				podCommands.FCUAccel_FineZero(data)

			},

			'FlightControl_Accel:AutoZero': (data) => {

				podCommands.FCUAccel_AutoZero(data)

			},

			'power:streamingControl': (data) => {

				//data.status == on/off
				podCommands.PowerStreamingControl(data.status)

			},

			'stop:Pod': (data) => {

				podCommands.PodStop();

			},

			'client event': (data) => {

				socket.broadcast.emit('update label', data);

			},

			'start:dataLogs': (data) => {

				if(_timer)
				{

					clearInterval(_timer)

				}

				_timer = setInterval(() => {

					udp.tx.sendMessage("Thanks Pod, message received")

				}, 2500);

				updateClientWithDatalogs = true;

			},

			'stop:dataLogs': (data) => {

				if(_timer)
				{

				clearInterval(_timer)

				}

				udp.tx.sendMessage("DataLogs are no longer listening")

				updateClientWithDatalogs = false;

			},

			'power:Pod': () => {

				podCommands.PodOff()

			},

			'join': (data) => {

				var name = data.name;

				room[data.room] = data.room; //add name of room to the list of rooms

				socket.join(room[data.room]);

				console.log(name + ' joined the group. '+ socket.id);

				socket.in(room[data.room]).emit('udp:event', {log: name + ' joined the group: ' + room[data.room]});

			},

			'sendParameter': (data) => {

				podCommands.SendParameter(data);

			},

			'setIpAndPort': (data) => {

				udp.rx.updateConnectionData(data).then(() => {

				console.log('udp starting to listen again')

				if(!udp.rx.listeningForUdp)

					startListening()

				})

				udp.tx.sendMessage(JSON.stringify(data))

			},

			'lgu:positionChange': (data) => {

				udp.tx.sendMessage(JSON.stringify(data))

			},

			'lgu:speedChange': (data) => {

				udp.tx.sendMessage(JSON.stringify(data))

			},

			'disconnect': () => {

				console.log('Server got disconnected!');

			},

			'commConfig:req': (data) => {

				socket.emit('commConfig:res', commConfig);

			}

	  }


	  for (const event in websocket.events){

		  socket.on (event, (data) => {

			websocket.events[event](data);

		  })

	  }

	});

};