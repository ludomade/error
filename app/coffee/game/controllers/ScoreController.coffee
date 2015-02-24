define ->
    
    class ScoreController
    
        score: 0
        displayScore: 0
        
        init: ->
            @.score = @.displayScore = 0
            @.loop()

        update: =>
            @.displayScore += ( @.score - @.displayScore ) / 10
            $("#score").html Math.round( @.displayScore )

        loop: =>
            @.update()
            requestAnimationFrame @.loop

        die: ->
            $("#score").addClass "highlight"
            setTimeout =>
                @.score = 0
                $("#score").removeClass "highlight"
                setTimeout =>
                    $("#score").removeClass "highlight"
                , 500
            , 1000

        asteroid: ->
            @.score += 10

        ship: ->
            @.score += 20
                