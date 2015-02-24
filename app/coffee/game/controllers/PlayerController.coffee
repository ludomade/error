define ->
    
    class PlayerController
        
        past: new Date()
        present: new Date()
        
        init: ->
            @.gen()
            @.addListeners()
            @.loop()
            
        gen: =>
            @.ship =
                vis:
                    color: "#C6C4C5"
                    scale: 6.66
                    points: [
                        x:  0.00
                        y: -1.00
                    ,
                        x: -0.74
                        y:  1.00
                    ,
                        x:  0.74
                        y:  1.00
                    ]
                    
                    pos:
                        x: window.innerWidth / 2
                        y: window.innerHeight / 2
                        r: 0
                    
                health: 6
                thrust: 0.045
                rot: 4
                
                particles:
                    last: 0
                    rate: 70
                    
                munitions:
                    last: 0
                    rate: 175
                    damage: 5
                    
                controls:
                    up: false
                    down: false
                    left: false
                    right: false
                    space: false
                    
                vel:
                    x: 0
                    y: 0
                    r: 0
                    
            game.stage.render( @.ship.vis )
            
        addListeners: ->
            window.addEventListener "keydown" , ( e ) =>
                e.preventDefault()
                @.ctl( e.keyCode , true )
                
            window.addEventListener "keyup" , ( e ) =>
                e.preventDefault()
                @.ctl( e.keyCode , false )
                
        ctl: ( code , state ) =>
            console.log code
            switch code
                when 38 then @.ship.controls.up = state
                when 40 then @.ship.controls.down = state
                when 37 then @.ship.controls.left = state
                when 39 then @.ship.controls.right = state
                when 32 then @.ship.controls.space = state
                
        loop: ->
            setInterval =>
                @.present = new Date()
                elapsed = @.present.getTime() - @.past.getTime()
                @.past = @.present
                @.update( elapsed )
            , 1000 / 60
            
        update: ( elapsed ) ->
            @.move( elapsed )
            @.wrap()
            @.munitions()
            @.particles()
            @.collision()
            
        move: ( elapsed ) ->
            vel = 0
            rot = 0
            if @.ship.controls.up is true then vel = @.ship.thrust
            if @.ship.controls.down is true then vel = -@.ship.thrust
            if @.ship.controls.left is true then rot = -@.ship.rot
            if @.ship.controls.right is true then rot = @.ship.rot
            
            @.ship.vel.x += Math.cos(( @.ship.vis.pos.r - 90 ) * ( Math.PI / 180 )) * vel * ( elapsed / ( 1000 / 60 ))
            @.ship.vel.y += Math.sin(( @.ship.vis.pos.r - 90 ) * ( Math.PI / 180 )) * vel * ( elapsed / ( 1000 / 60 ))
            @.ship.vis.pos.x += @.ship.vel.x * ( elapsed / ( 1000 / 60 ))
            @.ship.vis.pos.y += @.ship.vel.y * ( elapsed / ( 1000 / 60 ))
            @.ship.vis.pos.r += rot * ( elapsed / ( 1000 / 60 ))
            
        wrap: ->
            pos = game.tools.wrap( @.ship.vis.pos.x , @.ship.vis.pos.y , @.ship.vis.pos.r , @.ship.vis.scale )
            @.ship.vis.pos.x = pos.x
            @.ship.vis.pos.y = pos.y
            @.ship.vis.pos.r = pos.r
            
        munitions: ->
            present = new Date()
            present = present.getTime()
            
            if @.ship.munitions.last < present and @.ship.controls.space is true
                @.ship.munitions.last = present + @.ship.munitions.rate
                x = @.ship.vis.pos.x
                y = @.ship.vis.pos.y
                xv = @.ship.vel.x
                yv = @.ship.vel.y
                r = -@.ship.vis.pos.r + 180
                game.missles.smallMissle({ source: @.ship , x: x , y: y , r: r , xv: xv , yv , damage: @.ship.munitions.damage })
            
        particles: ->
            present = new Date()
            present = present.getTime()
            
            if @.ship.particles.last < present and @.ship.controls.up is true
                @.ship.particles.last = present + @.ship.particles.rate
                x = @.ship.vis.pos.x
                y = @.ship.vis.pos.y
                xv = @.ship.vel.x + ( Math.cos(( @.ship.vis.pos.r - 90 ) * ( Math.PI / 180 )) * ( -@.ship.thrust * 30 ))
                yv = @.ship.vel.y + ( Math.sin(( @.ship.vis.pos.r - 90 ) * ( Math.PI / 180 )) * ( -@.ship.thrust * 30 ))
                d = 20 + Math.random() * ( @.ship.particles.rate * ( 30 * Math.random()))
                s = 1 + Math.random() * 2.5
                game.particles.gen( x , y , xv , yv , d , s )
                
        collision: ->
            i = 0
            asteroids = game.asteroids.asteroid
            a = 
                x: @.ship.vis.pos.x
                y: @.ship.vis.pos.y
                s: @.ship.vis.scale * 2
                
            while i < asteroids.length
                b = 
                    x: asteroids[i].vis.pos.x
                    y: asteroids[i].vis.pos.y
                    s: asteroids[i].vis.scale * 2.2
                    
                if game.tools.distance( a , b ) < 0
                    @.kill()
                i++
                
        kill: =>
            if @.invincible isnt true
                setTimeout =>
                    @.invincible = false
                , 3000
                @.invincible = true
                r = @.ship.vis.scale * 9
                x = @.ship.vis.pos.x
                y = @.ship.vis.pos.y

                game.score.die()
                game.particles.explosion( x , y , Math.round( @.ship.vis.scale ) , 0.15 , 2 , 150 , 1250 , @.ship.vis.scale / 2 , @.ship.vis.scale / 1.5 )
                
                @.ship.vis.pos.x = window.innerWidth / 2
                @.ship.vis.pos.y = window.innerHeight / 2
                @.ship.vel.x = 0
                @.ship.vel.y = 0
                @.ship.health = 3