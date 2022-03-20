function layer (z,xs,ys)
	if turtle.getFuelLevel() > ((xs*ys)+50) then

		for i = 1, z, 1 do
			turtle.down()
		end

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

		for i = 1, z, 1 do
			turtle.up()
		end

	end
end

return {layer=layer}