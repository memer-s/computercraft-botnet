local myURL = "ws://localhost:8080"
local ws = http.websocket(myURL)
ws.send("{\"status\": 200}")
local event, url, message
local name = "NOT ASSIGNED"

-- Z = 0
Quarry = require('quarry')

repeat
	ws.send(textutils.serializeJSON({computer = name, status = "operable", fuel = turtle.getFuelLevel()}))

	repeat
		event, url, message = os.pullEvent("websocket_message")
	until url == myURL
	local data = textutils.unserializeJSON(message)

	print(textutils.serializeJSON(data))

	if data.command == "setName" then
		name = data.params
		os.setComputerLabel(name)
	end

	if data.command == "inventory" then
		local inventory = {}
		for i = 1, 16, 1 do
			turtle.select(i)
			table.insert(inventory, {index = i, item = turtle.getItemDetail()})
		end
		turtle.select(1)
		ws.send(textutils.serializeJSON({command = "inventory", data = inventory}))
	end

	if data.command == "selectinv" then
		turtle.select(data.index)
	end

	if data.command == "refuel" then
		turtle.refuel()
	end

	if data.command == "forward" then
		turtle.forward()
	end

	if data.command == "back" then
		turtle.back()
	end

	if data.command == "right" then
		turtle.turnRight()
	end

	if data.command == "left" then
		turtle.turnLeft()
	end

	if data.command == "up" then
		turtle.up()
	end

	if data.command == "down" then
		turtle.down()
	end

	if data.command == "dig" then
		turtle.dig()
	end

	if data.command == "digdown" then
		turtle.digDown()
	end

	if data.command == "digdup" then
		turtle.digUp()
	end

	if data.command == "place" then
		turtle.place()
	end

	if data.command == "placedown" then
		turtle.placeDown()
	end

	if data.command == "placeup" then
		turtle.placeUp()
	end

	if data.command == "mine" then
		Quarry.layer(data.params[1],data.params[2])
		-- Z = Z + 1
		-- print(Z)
	end

	if data.command == "quarry" then
		Quarry.layer(data.params[1],data.params[2])
	end

	if data.command == "run" then

	end

until false

ws.close()