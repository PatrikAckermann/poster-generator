import React from "react"

var Canvas = props => {
    const canvasRef = React.useRef(null)

    React.useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        var frameCount = 0
        var animationFrameId

        const render = () => {
            frameCount++
            props.draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        if (!props.data.stopped) { render() }

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [props])

    

    return <canvas ref={canvasRef} className="Canvas" id="PosterCanvas" height="1600" width="900"/>
}

export default Canvas