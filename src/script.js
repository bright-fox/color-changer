(() => {
    // cache DOM elements
    const fileInput = document.getElementById("input-file")
    const pickedColor = document.getElementById("picked-color")
    const pickedColorDisplay = document.getElementById("picked-color-display")
    const desiredColor = document.getElementById("desired-color")
    const desiredColorDisplay = document.getElementById("desired-color-display")
    const convertButton = document.getElementById("convert-button")
    const revertButton = document.getElementById("revert-button")
    const downloadLink = document.getElementById("download-link")

    // canvas and image variables
    const canvas = document.querySelector("#canvas")
    const ctx = canvas.getContext("2d")
    const srcImage = new Image
    let imageLoaded = false

    // holds the data of the image
    let imgData
    // holds the flat array of all the pixels of the image
    let originalPixels

    const RED_OFFSET = 0
    const GREEN_OFFSET = 1
    const BLUE_OFFSET = 2

    const DIFF_THRESHHOLD = 50

    // set src of image to selected image file
    fileInput.onchange = e => {
        if (e.target.files && e.target.files[0]) srcImage.src = URL.createObjectURL(e.target.files[0])
    }

    // draw image on the canvas once it is loaded and set the image data
    srcImage.onload = () => {
        imageLoaded = true

        canvas.width = srcImage.width
        canvas.height = srcImage.height
        ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
        imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
        originalPixels = imgData.data.slice()
    }

    // picked color
    pickedColor.oninput = e => {
        if (isHex(e.target.value)) pickedColorDisplay.value = e.target.value
    }

    pickedColorDisplay.oninput = e => {
        pickedColor.value = e.target.value
    }

    // set pickedColor via mouse click on canvas
    canvas.addEventListener("click", e => {
        if (!imageLoaded) return

        const index = getIndex(e.offsetX, e.offsetY)
        const red = imgData.data[index + RED_OFFSET]
        const green = imgData.data[index + GREEN_OFFSET]
        const blue = imgData.data[index + BLUE_OFFSET]

        const hexColor = rgbToHex(red, green, blue)
        pickedColor.value = hexColor
        pickedColorDisplay.value = hexColor
    })

    // desired color
    desiredColor.oninput = e => {
        if (isHex(e.target.value)) desiredColorDisplay.value = e.target.value
    }

    desiredColorDisplay.oninput = e => {
        desiredColor.value = e.target.value
    }

    // convert button
    convertButton.onclick = () => {
        if (imageLoaded && isHex(pickedColor.value) && isHex(desiredColor.value)) {
            const pickedRGB = hextoRGB(pickedColor.value)
            const desiredRGB = hextoRGB(desiredColor.value)
            for (let i = 0; i < imgData.data.length; i += 4) {
                // check if is simliar pixel
                const diff = Math.abs(imgData.data[i + RED_OFFSET] - pickedRGB[RED_OFFSET]) + Math.abs(imgData.data[i + GREEN_OFFSET] - pickedRGB[GREEN_OFFSET]) + Math.abs(imgData.data[i + BLUE_OFFSET] - pickedRGB[BLUE_OFFSET])

                isPixel = diff < DIFF_THRESHHOLD

                if (isPixel) {
                    imgData.data[i + RED_OFFSET] = desiredRGB[RED_OFFSET]
                    imgData.data[i + GREEN_OFFSET] = desiredRGB[GREEN_OFFSET]
                    imgData.data[i + BLUE_OFFSET] = desiredRGB[BLUE_OFFSET]
                }
            }

            ctx.putImageData(imgData, 0, 0)
        }
    }

    // revert button
    revertButton.onclick = () => {
        if (!imageLoaded) return
        for (let i = 0; i < imgData.data.length; i++) {
            imgData.data[i] = originalPixels[i]
        }
        ctx.putImageData(imgData, 0, 0)
    }

    // download link
    downloadLink.onclick = () => {
        if (!imageLoaded) return
        const dataURL = canvas.toDataURL("image/png")
        downloadLink.href = dataURL
        downloadLink.download = "download.png"
    }

    // helper functions

    function getIndex(x, y) {
        const scaledX = Math.round(x * (canvas.width / canvas.clientWidth))
        const scaledY = Math.round(y * (canvas.height / canvas.clientHeight))
        return (scaledX + scaledY * srcImage.width) * 4
    }

    function isHex(str) {
        return str.match(/^#[A-Fa-f\d]{6}$/)
    }

    function componentToHex(c) {
        const hex = c.toString(16)
        return hex.length == 1 ? `0${hex}` : hex
    }

    function rgbToHex(r, g, b) {
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
    }

    function hextoRGB(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex)
        return result ? [
            parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)
        ] : null
    }
})()
