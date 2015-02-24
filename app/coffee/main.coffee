"use strict"

require.config(

	baseUrl: "scripts"

	paths:
		"jquery": "vendor/jquery/dist/jquery"
		"RAF": "vendor/requestAnimationFrame/app/requestAnimationFrame"

	deps: [
		"jquery"
		"RAF"
	]
)

require( [ "game/App" ] , ( App ) ->
	new App()
)