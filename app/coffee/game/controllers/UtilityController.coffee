define ->
    
    class UtilityController
    
        distance: ( a , b ) ->
            x = Math.pow( Math.abs( a.x - b.x ) , 2 )
            y = Math.pow( Math.abs( a.y - b.y ) , 2 )
            d = Math.sqrt( x + y ) - (( a.s / 2 ) + ( b.s / 2 ))
            return d
            
        wrap: ( x , y , r , s ) ->
            if ( x + s ) > ( window.innerWidth + ( s * 2 )) then x = -s
            if ( x + s ) < -( s * 2 ) then x = ( window.innerWidth + s )
            if ( y + s ) > ( window.innerHeight + ( s * 2 )) then y = -s
            if ( y + s ) < -( s * 2 ) then y = ( window.innerHeight + s )
            if r > 360 then r -= 360
            if r < 0 then r += 360
            return { x: x , y: y , r: r }
            
        pointTo: ( x1 , y1 , x2 ,y2 ) ->
            deltaY = y1 - y2
            deltaX = x2 - x1
            return Math.atan2( deltaX , deltaY ) * 180 / Math.PI
            
        bound: ( n , min , max ) ->
            return Math.min( Math.max( n , min ) , max )