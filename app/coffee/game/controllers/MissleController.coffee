define ->
    
    class MissleController
        
        missles: []
        past: new Date()
        present: new Date()
        
        init: ->
            @.loop()
            
        loop: ->
            setInterval =>
                @.present = new Date()
                elapsed = @.present.getTime() - @.past.getTime()
                @.past = @.present
                @.update( elapsed )
            , 1000 / 60
            
        update: ( elapsed ) =>
            i = @.missles.length - 1
            while i >= 0
                @.move( @.missles[i] , elapsed )
                # @.wrap( @.missles[i] )
                @.detectCollision( @.missles[i] )
                i--
                
        smallMissle: ( p ) =>
            if p.damage is undefined then p.damage = 1
            if p.xv is undefined then p.xv = 0
            if p.yv is undefined then p.yv = 0
            @.gen({
                height: 20
                width: 20
                scale: 10
                x: p.x
                y: p.y
                r: p.r
                xv: p.xv
                yv: p.yv
                source: p.source
                velocity: 4.5
                damage: p.damage
                duration: 2500
                particleRate: 125
            })
            
        gen: ( p ) =>
            dur = new Date()
            dur = dur.getTime() + p.duration
            last = new Date()
            last = last.getTime()
            
            missle = {
                vis:
                    points: [
                        x: -0.01 * ( p.width / 2 )
                        y: 0.01 * ( p.height / 2 )
                    ,
                        x: -0.01 * ( p.width / 2 )
                        y: -0.01 * ( p.height / 2 )
                    ,
                        x: 0.01 * ( p.width / 2 )
                        y: -0.01 * ( p.height / 2 )
                    ,
                        x: 0.01 * ( p.width / 2 )
                        y: 0.01 * ( p.height / 2 )
                        
                    ]
                    
                    color: "#ffbf00"
                    scale: p.scale  
                    pos:
                        x: p.x
                        y: p.y
                        r: p.r
                
                data:   
                    source: p.source
                    velocity: p.velocity
                    damage: p.damage
                    duration: dur
                    xv: p.xv
                    yv: p.yv
                
                particle:
                    rate: p.particleRate
                    last: last
                
            }
            @.missles.push( missle )
            game.stage.render( missle.vis )
            console.log @.missles
            
        detectCollision: ( missle ) =>
            i = 0
            asteroids = game.asteroids.asteroid
            a = 
                x: missle.vis.pos.x
                y: missle.vis.pos.y
                s: 1
                
            while i < asteroids.length
                b = 
                    x: asteroids[i].vis.pos.x
                    y: asteroids[i].vis.pos.y
                    s: asteroids[i].vis.scale * 2.2
                    
                if game.tools.distance( a , b ) < 0
                    @.destroy( missle )
                    asteroids[i].data.health -= missle.data.damage
                    if asteroids[i].data.health <= 0 then game.asteroids.kill( asteroids[i] )
                i++
                
            i = 0
            while i < game.enemies.ships.length
                b = 
                    x: game.enemies.ships[i].vis.pos.x
                    y: game.enemies.ships[i].vis.pos.y
                    s: game.enemies.ships[i].vis.scale * 2.2
                    
                if game.tools.distance( a , b ) < 0 and missle.data.source isnt game.enemies.ships[i]
                    @.destroy( missle )
                    game.enemies.ships[i].health -= missle.data.damage
                    if game.enemies.ships[i].health <= 0 then game.enemies.kill( game.enemies.ships[i] )
                i++
                
            b = 
                x: game.player.ship.vis.pos.x
                y: game.player.ship.vis.pos.y
                s: game.player.ship.vis.scale * 2.2
                
            if game.tools.distance( a , b ) < 0 and missle.data.source isnt game.player.ship
                @.destroy( missle )
                game.player.ship.health -= missle.data.damage
                if game.player.ship.health <= 0 then game.player.kill()
                
        move: ( missle , elapsed ) =>
            present = new Date()
            present = present.getTime()
            xvel = Math.sin( missle.vis.pos.r * ( Math.PI / 180 )) * missle.data.velocity
            yvel = Math.cos( missle.vis.pos.r * ( Math.PI / 180 )) * missle.data.velocity
            
            missle.vis.pos.x += ( xvel + missle.data.xv ) * ( elapsed / ( 1000 / 60 ))
            missle.vis.pos.y += ( yvel + missle.data.yv ) * ( elapsed / ( 1000 / 60 ))
            
            if present > missle.particle.last
                missle.particle.last = present + missle.particle.rate
                xOff = Math.sin(( Math.random() * 360 ) * ( Math.PI / 180 )) * ( missle.data.velocity * 0.05 )
                yOff = Math.cos(( Math.random() * 360 ) * ( Math.PI / 180 )) * ( missle.data.velocity * 0.05 )
                game.particles.gen( missle.vis.pos.x , missle.vis.pos.y , -( xvel / 10 ) + xOff , -( yvel / 10 ) + yOff , 0 + ( Math.random() * 20 ) , 0.5 + ( Math.random() * 2 ))
                
            if present > missle.data.duration
                @.destroy( missle )
                
        wrap: ( missle ) ->
            pos = game.tools.wrap( missle.vis.pos.x , missle.vis.pos.y , missle.vis.pos.r , missle.vis.scale )
            missle.vis.pos.x = pos.x
            missle.vis.pos.y = pos.y
            
        destroy: ( missle ) =>
            pTotal = Math.min( Math.max( Math.random() * ( missle.data.damage * 3 ) , 10 ) , 90 )
            game.particles.explosion( missle.vis.pos.x , missle.vis.pos.y , pTotal , missle.data.velocity * 0.25 , missle.data.velocity * 0.45 * ( missle.vis.scale / 15 ) , 150 , 500 , 1 , missle.vis.scale / 2.5 )
            game.stage.destroy( missle.vis )
            i = 0
            while i < @.missles.length
                if @.missles[i] is missle then @.missles.splice( i , 1 )
                i++