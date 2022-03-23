function layer (xs,ys)
	if turtle.getFuelLevel() > ((xs*ys)+50) then

		-- for i = 1, z, 1 do
		-- 	turtle.down()
		-- end

		for i = 1, xs, 1 do
			turtle.digDown()
			for j = 1, ys-1, 1 do
				turtle.forward()
				turtle.digDown()
			end
			if i ~= xs then
				if i%2==0 then
					turtle.turnLeft()
					turtle.forward()
					turtle.turnLeft()
				else
					turtle.turnRight()
					turtle.forward()
					turtle.turnRight()
				end
			end
		end

		if (xs % 2) == 1 then
			turtle.turnRight()
			turtle.turnRight()
			for i = 1, ys-1, 1 do
				turtle.forward()
			end
		end

		turtle.turnRight()

		for i = 1, xs-1, 1 do
			turtle.forward()
		end

		turtle.turnRight()

		-- for i = 1, z, 1 do
		-- 	turtle.up()
		-- end
		turtle.down()
	end
end

-- very bad, tired and just doing stuff til it works, and uneffective
function tunnel (xs,ys) 
	if turtle.getFuelLevel() > ((xs*ys)+10) then
		for i = 0, xs-1, 1 do
			if i ~= 0 then
				turtle.turnLeft()
				turtle.forward()
				turtle.turnRight()
			end
			for j = 0, ys-1, 1 do
				if j ~= 0 then
					turtle.up()
				end
				turtle.dig()
			end
			for j = 0, ys-2, 1 do
				turtle.down()
			end
		end
		if xs%2 == 1 then
			for i = 0, ys-1, 1 do
				turtle.down()
			end
			turtle.turnRight()
			for i = 0, xs-2, 1 do
				turtle.forward()
			end
			turtle.turnLeft()
		else
			turtle.turnRight()
			for i = 0, xs-2, 1 do
				turtle.forward()
			end
			turtle.turnLeft()
		end
	end
	turtle.forward()
end

return {layer=layer, tunnel=tunnel}