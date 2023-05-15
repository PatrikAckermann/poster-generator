import React from "react"

var Canvas = props => {
    const canvasRef = React.useRef(null)
    var oldTime = window.performance.now()

    React.useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        var fps = document.getElementById("fpsCounter")
        var frameCount = 0
        var animationFrameId

        const render = () => {
            if (process.env.NODE_ENV === "development") {
                fps.innerHTML = Math.round(1000 / (window.performance.now() - oldTime)) + " FPS"
                oldTime = window.performance.now()
            }
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
    } else {
        if (size.x > 5000) {size.x = 5000}
        if (size.x < 100) {size.x = 100}
        if (size.y > 5000) {size.y = 5000}
        if (size.y < 100) {size.y = 100}
    }
    var aspectRatio = size.x / size.y

    return <canvas ref={canvasRef} className="Canvas" id="PosterCanvas" height={size.y} width={size.x} style={{aspectRatio: aspectRatio}}/>
}

export default Canvas