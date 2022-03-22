import {WebSocketServer} from 'ws'
import {Server} from 'socket.io';

const io = new Server(3001, {cors: {origin: '*'}})

function print(str) {
	console.log(str);
} 

function sendCommand(data, computer) {
	print(`sending forward to ${computer}`)
	websockets[computer].send(JSON.stringify(data))
	// print(data)
}

let computers = {}
let websockets = {}
let selectedComputers;
let halt = false;
let socketo;

io.on("connection", (socket) => {
	socketo = socket;
	setInterval(() => {
		socket.emit("ping", computers)
		// console.log(selectedComputers);
	}, 100)

	socket.on("selection", (data) => {
		selectedComputers = data
		// print(data+": is selected")
	})

	socket.on("command", (data) => {
		console.log(data);
		if(selectedComputers) {
			for (let i = 0; i < selectedComputers.length; i++) {
				let selected = selectedComputers[i]
				if(computers[selected] != undefined) {
					if(!computers[selected].ishalted) {
						sendCommand(data, selected)
						computers[selected].ishalted = true
					}
					else {
						computers[selected].commands.push(data)
					}
				}
				else {
					console.log("Computer selected is no longer online.")
				}
			}
		}
		else {
			console.log("No computer selected.");
		}
	})

	socket.on("commands", (data) => {
		console.log(data);
		if(selectedComputers) {
			for (let i = 0; i < selectedComputers.length; i++) {
				let selected = selectedComputers[i]
				if(computers[selected] != undefined) {
					if(!computers[selected].ishalted) {
						sendCommand(data, selected)
						computers[selected].ishalted = true
					}
					else {
						computers[selected].commands.push(data)
					}
					for(let i = 0; i < data.repeats - 1; i++) {
						computers[selected].commands.push(data)
					}
				}
				else {
					console.log("Computer selected is no longer online.")
				}
			}
		}
		else {
			console.log("No computer selected.");
		}
	})

	socket.on("servercommand", (data) => {
		if(selectedComputers) {
			for (let i = 0; i < selectedComputers.length; i++) {
				let selected = selectedComputers[i]
				if(computers[selected] != undefined) {
					console.log(data.command)
					if(data.command == 'clear') {
						computers[selected].commands = []
					}
				}
				else {
					console.log("Computer selected is no longer online.")
				}
			}
		}
		else {
			console.log("No computer selected.");
		}
	})

})

const wss = new WebSocketServer({port: 8080})
wss.on('connection', (ws) => {
	let computerName = "Computer " + Object.keys(websockets).length
	let nameIndex = 1;

	while(Object.keys(websockets).includes(computerName)) {
		computerName = "Computer " + Object.keys(websockets).length + nameIndex;
		nameIndex++;
	}
	

	ws.on('message', (data) => {
		const buff = Buffer.from(data, 'ascii');
		
		let string = buff.toString()
		let object = JSON.parse(string)

		// try {
			print(object)
			if(object.command) {
				if(object.command == 'inventory') {
					socketo.emit("inventory", object.data)
				}
			}
			else {
				if(object.computer === "NOT ASSIGNED") {
					ws.send(JSON.stringify({command: "setName", params: computerName}))
					console.log(computerName);
				}
				else if(object.status == "operable" && computers[computerName].commands.length != 0) {
					computers[computerName]["fuel"] = object.fuel
					computers[computerName].ishalted = true
					sendCommand(computers[computerName].commands.shift(), computerName)
				}
				else {
					computers[computerName]["fuel"] = object.fuel
					computers[computerName].ishalted = false
				}
			}
		// } catch {
		// 	print("Could not parse..... json", string)
		// }
	})

	ws.on('close', () => {
		console.log(`Disconnecting ${computerName}`);
		delete computers[computerName]
		delete websockets[computerName]
	}) 

	computers[computerName] = {ishalted: halt, commands: []}
	websockets[computerName] = ws
})