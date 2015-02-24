define ->
    
    class ParticleController
    
        particle: []
        
        init: ->
            @.loop()
            
        explosion: ( x , y , n , vmax , vmin , dmin , dmax , smin , smax , xinit , yinit ) =>
            i = 0
            while i < n
                v = vmin + Math.random() * ( vmax - vmin )
                d = dmin + Math.random() * ( dmax - dmin )
                s = smin + Math.random() * ( smax - smin )
                a = Math.random() * 360
                xv = Math.sin( a * ( Math.PI / 180 )) * v
                yv = Math.cos( a * ( Math.PI / 180 )) * v
                @.gen( x , y , xv , yv , d , s )
                i++
        
        gen: ( x , y , xv , yv , d , s ) ->
            particle = {
                dur: new Date().getTime() + d
                vel:
                    x: xv
                    y: yv
                
                vis:
                    scale: s
                    color: "#ffbf00"
                    points: [
                        x: -0.5
                        y: -0.5
                    ,
                        x: 0.5
                        y: -0.5
                    ,
                        x: 0.5
                        y: 0.5
                    ,
                        x: -0.5
                        y: 0.5
                    ]
                    pos:
                        x: x
                        y: y
                        r: 0
            }
            
            @.particle.push( particle )
            game.stage.render( particle.vis )
            
        loop: ->
            setInterval =>
                @.update()
            , 1000 / 60
            
        update: ->
            i = 0
            while i < @.particle.length
                @.step( @.particle[i] )
                @.check( @.particle[i] )
                i++
                
        step: ( p ) ->
            p.vis.pos.x += p.vel.x
            p.vis.pos.y += p.vel.y
            
        check: ( p ) ->
            if p.dur < new Date().getTime()
                p.vis.scale -= 0.1
                if p.vis.scale <= 0
                    game.stage.destroy( p.vis )
                    @.destroy( p )
                
        destroy: ( p ) =>
            i = 0
            while i < @.particle.length
                if @.particle[i] is p then @.particle.splice( i , 1 )
                i++