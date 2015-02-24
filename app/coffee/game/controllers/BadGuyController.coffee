define ->
    
    class BadGuyController
        
        
        past: new Date()
        present: new Date()
        ships: []
        
        init: ->
            @.loop()
            
        loop: ->
            @.gen()
            @.gen()
            setInterval =>
                n = 0
                while n < 3 + Math.random() * 4
                    setTimeout =>
                        if @.ships.length < 4 then @.gen()
                    , 1000 + 3000 * Math.random()
                    n++
            , 25000
            
            setInterval =>
                i = @.ships.length - 1
                @.present = new Date()
                elapsed = @.present.getTime() - @.past.getTime()
                @.past = @.present
                while i >= 0
                    @.think( @.ships[i] )
                    @.thrust( @.ships[i] , elapsed )
                    @.particles( @.ships[i] )
                    @.move( @.ships[i] , elapsed )
                    @.wrap( @.ships[i] )
                    @.collision( @.ships[i] )
                    i--
            , 1000 / 60
            
        gen: ->
            
            if Math.random() > 0.5
                y = Math.random() * window.innerHeight
                if Math.random() > 0.5
                    x = 0 - 6
                else
                    x = window.innerWidth + 6
            else
                x = Math.random() * window.innerWidth
                if Math.random() > 0.5
                    y = 0 - 6
                else
                    y = window.innerHeight + 6
            
            ship =
                vis:
                    color: "#ffbf00"
                    scale: 5
                    pos:
                        x: x
                        y: y
                        r: Math.random() * 360
                        
                    points: [
                        x: -1
                        y: -1
                    ,
                        x: 1
                        y: 1
                    ,
                        x: 1
                        y: -1
                    ,
                        x: -1
                        y: 1
                    ,
                        x: -1
                        y: -1
                    ]
                    
                health: 5
                thrust: 0.0895
                rot: 0.9
                
                particles:
                    last: 0
                    rate: 120
                    
                munitions:
                    last: 0
                    rate: 650
                    damage: 1
                    
                goal:
                    x: game.player.ship.vis.pos.x
                    y: game.player.ship.vis.pos.y
                    r: 0
                    
                vel:
                    x: 0
                    y: 0
                    r: 0
                    
            game.stage.render( ship.vis )
            @.ships.push( ship )
            
        think: ( ship ) ->
            i = 0
            asteroid = game.asteroids.asteroid
            a =
                x: ship.vis.pos.x
                y: ship.vis.pos.y
                s: ship.vis.scale * 2.5
                
            min = 120
            smin = 40
            pmin = 90
            
            while i < @.ships.length
                b =
                    x: @.ships[i].vis.pos.x
                    y: @.ships[i].vis.pos.y
                    s: @.ships[i].vis.scale * 2.2
                    
                dis = game.tools.distance( a , b )
                if dis <= smin and ship isnt @.ships[i]
                    smin = dis
                    a = game.tools.pointTo( @.ships[i].vis.pos.x , @.ships[i].vis.pos.y , ship.vis.pos.x , ship.vis.pos.y ) - 180
                    if ship.vis.pos.r - a >  180 then ship.vis.pos.r -= 360
                    if ship.vis.pos.r - a < -180 then ship.vis.pos.r += 360
                    ship.goal.r = a
                i++
                
            b =
                x: game.player.ship.vis.pos.x
                y: game.player.ship.vis.pos.y
                s: game.player.ship.vis.scale * 10
                
            dis = game.tools.distance( a , b )
            if dis <= pmin
                pmin = dis
                a = game.tools.pointTo( game.player.ship.vis.pos.x , game.player.ship.vis.pos.y , ship.vis.pos.x , ship.vis.pos.y ) - 180
                if ship.vis.pos.r - a >  180 then ship.vis.pos.r -= 360
                if ship.vis.pos.r - a < -180 then ship.vis.pos.r += 360
                ship.goal.r = a
                
            i = 0
            while i < asteroid.length
                b =
                    x: asteroid[i].vis.pos.x
                    y: asteroid[i].vis.pos.y
                    s: asteroid[i].vis.scale * 2
                    
                dis = game.tools.distance( a , b )
                if dis <= min
                    min = dis
                    a = game.tools.pointTo( asteroid[i].vis.pos.x , asteroid[i].vis.pos.y , ship.vis.pos.x , ship.vis.pos.y ) - 180
                    if ship.vis.pos.r - a >  180 then ship.vis.pos.r -= 360
                    if ship.vis.pos.r - a < -180 then ship.vis.pos.r += 360
                    ship.goal.r = a
                i++
            
            if min >= 120 and smin >= 40 and pmin >= 90
                ship.goal.x = game.player.ship.vis.pos.x
                ship.goal.y = game.player.ship.vis.pos.y
                ship.goal.r = game.tools.pointTo( ship.goal.x , ship.goal.y , ship.vis.pos.x , ship.vis.pos.y )
                if ship.vis.pos.r - ship.goal.r >  180 then ship.vis.pos.r -= 360
                if ship.vis.pos.r - ship.goal.r < -180 then ship.vis.pos.r += 360
                if Math.abs( ship.vis.pos.r - ship.goal.r ) < 0.3 then @.munitions( ship )
                
        thrust: ( ship , elapsed ) ->
            if ship.vis.pos.r < ship.goal.r then ship.vel.r += ship.rot * ( elapsed / ( 1000 / 60 ))
            if ship.vis.pos.r > ship.goal.r then ship.vel.r -= ship.rot * ( elapsed / ( 1000 / 60 ))
            ship.vel.x -= Math.cos(( ship.vis.pos.r - 90 ) * ( Math.PI / 180 )) * ship.thrust * ( elapsed / ( 1000 / 60 ))
            ship.vel.y -= Math.sin(( ship.vis.pos.r - 90 ) * ( Math.PI / 180 )) * ship.thrust * ( elapsed / ( 1000 / 60 ))
            ship.vel.x = game.tools.bound( ship.vel.x , -2.5 , 2.5 )
            ship.vel.y = game.tools.bound( ship.vel.y , -2.5 , 2.5 )
            ship.vel.x = ship.vel.x * 0.965
            ship.vel.y = ship.vel.y * 0.965
            ship.vel.r = ship.vel.r * 0.85
            
        move: ( ship , elapsed ) ->
            ship.vis.pos.x += ship.vel.x * ( elapsed / ( 1000 / 60 ))
            ship.vis.pos.y += ship.vel.y * ( elapsed / ( 1000 / 60 ))
            ship.vis.pos.r += ship.vel.r * ( elapsed / ( 1000 / 60 ))
            
        wrap: ( ship ) ->
            pos = game.tools.wrap( ship.vis.pos.x , ship.vis.pos.y , ship.vis.pos.r , ship.vis.scale )
            ship.vis.pos.x = pos.x
            ship.vis.pos.y = pos.y
            
        particles: ( ship ) ->
            present = new Date()
            present = present.getTime()
            
            if ship.particles.last < present
                ship.particles.last = present + ship.particles.rate + ( Math.random() * ship.particles.rate )
                x = ship.vis.pos.x
                y = ship.vis.pos.y
                xv = ship.vel.x + ( Math.cos(( ship.vis.pos.r - 90 ) * ( Math.PI / 180 )) * ( ship.thrust * 10 ))
                yv = ship.vel.y + ( Math.sin(( ship.vis.pos.r - 90 ) * ( Math.PI / 180 )) * ( ship.thrust * 10 ))
                d = Math.random() * (( ship.particles.rate  / 2 ) * Math.random())
                s = 1 + Math.random() * 2.5
                game.particles.gen( x , y , xv , yv , d , s )
                
        munitions: ( ship ) ->
            present = new Date()
            present = present.getTime()
            
            if ship.munitions.last < present
                ship.munitions.last = present + ship.munitions.rate + ( ship.munitions.rate * Math.random() )
                x = ship.vis.pos.x
                y = ship.vis.pos.y
                xv = ship.vel.x
                yv = ship.vel.y
                r = -ship.vis.pos.r
                game.missles.smallMissle({ source: ship , x: x , y: y , r: r , xv: xv , yv: yv , damage: ship.munitions.damage })
                
        collision: ( ship ) ->
            asteroids = game.asteroids.asteroid
            i = 0
            a = 
                x: ship.vis.pos.x
                y: ship.vis.pos.y
                s: ship.vis.scale * 2.5
                
            while i < asteroids.length
                b = 
                    x: asteroids[i].vis.pos.x
                    y: asteroids[i].vis.pos.y
                    s: asteroids[i].vis.scale * 2.2
                    
                if game.tools.distance( a , b ) < 0
                    game.enemies.kill( ship )
                i++
        
        kill: ( ship ) =>
            r = ship.vis.scale * 9
            x = ship.vis.pos.x
            y = ship.vis.pos.y
            game.score.ship()
            game.particles.explosion( x , y , Math.round( ship.vis.scale ) , 0.15 , 2 , 150 , 1250 , ship.vis.scale / 2 , ship.vis.scale / 1.5 )
            setTimeout =>
                @.destroy( ship )
            , 100
            
        destroy: ( ship ) ->
            i = 0
            while i < @.ships.length
                if @.ships[i] is ship
                    game.stage.destroy( @.ships[i].vis )
                    @.ships.splice( i , 1 )
                i++