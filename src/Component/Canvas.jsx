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

    var size = {x: props.data.x, y: props.data.y}
    if (props.data.sizeMode === "printing") {
        size = JSON.parse(props.data.canvasSize)
        size.x = size.x * props.data.canvasPpi
        size.y = size.y * props.data.canvasPpi
    }
    var aspectRatio = size.x / size.y
    return <canvas ref={canvasRef} className="Canvas" id="PosterCanvas" height={size.y} width={size.x} style={{aspectRatio: aspectRatio}}/>
}

export default Canvas