import React from "react"

var Canvas = props => {
    const canvasRef = React.useRef(null)

    React.useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        var frameCount = 0
        var animationFrameId

        /*const stream = canvas.captureStream()
        const recorder = new MediaRecorder(stream, {mimeType: "video/webm"})
        recorder.start()
        setTimeout(()=>recorder.stop(), 2000)
        recorder.addEventListener("dataavailable", (evt) => {
            const url = URL.createObjectURL(evt.data)
            var hiddenElement = document.createElement('a');
            console.log(url)
        })*/

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