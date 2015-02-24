define ->
    
    class AsteroidController
    
        asteroid: []
        past: new Date()
        present: new Date()
        
        init: ->
            @.loop()
                
        generate: ( xPos , yPos , scale ) ->
            console.log x
            if !xPos? then xPos = Math.random() * window.innerWidth
            if !yPos? then yPos = Math.random() * window.innerHeight
            if !scale?
                s = 1 + Math.floor( Math.random() * 4 )
                scale = 10 + ( s * 15 ) + ( Math.random() * 5 )
                
            health = 3 + ( scale / 4 )
            points = []
            total = 12 + Math.floor( Math.random() * 3 )
            range = 0.35
            i = total
            while i >= 0
                a = ( i / total ) * 360
                d = ( 1 - ( range / 2 )) + ( Math.random() * range )
                if i isnt 0
                    x = Math.sin( a * ( Math.PI / 180 )) * d
                    y = Math.cos( a * ( Math.PI / 180 )) * d
                else
                    x = points[0].x
                    y = points[0].y
                    
                points.push({ 
                    x: x
                    y: y 
                })
                i--
                
            asteroid = {
                vis:
                    points: points
                    scale: scale
                    color: "#ffbf00"
                    pos:
                        x: xPos
                        y: yPos
                        r: Math.random() * 360
                  
                data:
                    health: health
                    vel:
                        x: ( Math.random() * 2 ) - 1.0
                        y: ( Math.random() * 2 ) - 1.0
                        r: ( Math.random() * 1 ) - 0.5
            }
            
            @.asteroid.push( asteroid )
            game.stage.render( asteroid.vis )
            
            
        loop: ->
            setInterval =>
                if @.asteroid.length < 7
                    if Math.random() > 0.5
                        y = Math.random() * window.innerHeight
                        if Math.random() > 0.5
                            x = 0 - 120
                        else
                            x = window.innerWidth + 120
                    else
                        x = Math.random() * window.innerWidth
                        if Math.random() > 0.5
                            y = 0 - 120
                        else
                            y = window.innerHeight + 120
                    @.generate( x , y )
            , 5000
            
            setInterval =>
                @.present = new Date()
                elapsed = @.present.getTime() - @.past.getTime()
                @.past = @.present
                @.update( elapsed )
            , 1000 / 60
            
        update: ( e )->
            i = 0
            while i < @.asteroid.length
                @.step( @.asteroid[i] , e )
                @.wrap( @.asteroid[i] )
                i++
                
        step: ( a , e ) ->
            a.vis.pos.x += a.data.vel.x * ( e / ( 1000 / 60 ))
            a.vis.pos.y += a.data.vel.y * ( e / ( 1000 / 60 ))
            a.vis.pos.r += a.data.vel.r * ( e / ( 1000 / 60 ))
            
        wrap: ( a ) ->
            pos = game.tools.wrap( a.vis.pos.x , a.vis.pos.y , a.vis.pos.r , a.vis.scale )
            a.vis.pos.x = pos.x
            a.vis.pos.y = pos.y
            a.vis.pos.r = pos.r
            
        kill: ( a ) =>
            r = a.vis.scale * 1.2
            x = a.vis.pos.x
            y = a.vis.pos.y
            if a.vis.scale > 30
                s1 = r * ( 0.4 + ( Math.random() * 0.2 ))
                s2 = r - s1
                @.generate( x , y , s1 )
                @.generate( x , y , s2 )
            
            game.particles.explosion( x , y , Math.round( a.vis.scale * 1.25 ) , 0.15 , 2 , 150 , 1250 , a.vis.scale / 10 , a.vis.scale / 3.5 , a.data.vel.x , a.data.vel.y )
            setTimeout =>
                @.destroy( a )
            , 100
            
        destroy: ( a ) ->
            i = 0
            while i < @.asteroid.length
                if @.asteroid[i] is a
                    game.stage.destroy( @.asteroid[i].vis )
                    @.asteroid.splice( i , 1 )
                i++