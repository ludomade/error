define ->
    
    class StageView
        
        shapes: []
        down: false
        
        init: ->
            @.getElements()
            @.addListeners()
            @.loop()
            
        getElements: ->
            @.canvas = document.getElementsByTagName( "canvas" )[ 0 ]
            @.stage = @.canvas.getContext("2d")

        addListeners: ->
            window.addEventListener "keydown" , ( e ) =>
                e.preventDefault()
                if @.down is true then return
                $("main").fadeOut 3000
                $("#score").show()
                @.down = true
        
        render: ( el ) =>
            @.shapes.push( el )
            
        destroy: ( el ) =>
            i = 0
            while i < @.shapes.length
                if @.shapes[i] is el then @.shapes.splice( i , 1 )
                i++
        
        loop: =>
            @.update()
            @.clear()
            @.draw()
            
            requestAnimationFrame( @.loop )
        
        update: ->
            if @.width isnt window.innerWidth or @.height isnt window.innerHeight
                @.width = window.innerWidth
                @.height = window.innerHeight
                @.canvas.height = @.height
                @.canvas.width = @.width
                
        clear: ->
            @.stage.clearRect( 0 , 0 , @.width , @.height )
            
        draw: =>
            c = @.stage
            i = @.shapes.length - 1
            
            while i >= 0
                
                s = @.shapes[ i ]
                p = s.points
                m = s.scale
                
                c.save()
                c.fillStyle = s.color
                c.translate( s.pos.x , s.pos.y )
                c.rotate( s.pos.r * ( Math.PI / 180 ))
                c.beginPath()
                
                n = 0
                while n < p.length
                    x = ( p[n].x ) * m
                    y = ( p[n].y ) * m
                    
                    if n is 0
                        c.moveTo( x , y )
                    else
                        c.lineTo( x , y )
                    n++
                    
                c.fill()
                c.restore()
                    
                i--