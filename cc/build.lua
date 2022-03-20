function platform (xs,ys)
	for i = 1, ys, 1 do
		turtle.placeDown()
		for j = 1, xs-1, 1 do
			turtle.forward()
			turtle.placeDown()
		end
		if i ~= ys then
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
	turtle.turnRight()
	for i = 1, xs-1, 1 do
		turtle.forward()
	end
	turtle.turnRight()
end

platform(4,4)