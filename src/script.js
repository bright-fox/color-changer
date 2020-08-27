(() => {
    // cache DOM elements
    const fileInput = document.getElementById("input-file")
    const pickedColor = document.getElementById("picked-color")
    const pickedColorDisplay = document.getElementById("picked-color-display")
    const desiredColor = document.getElementById("desired-color")
    const desiredColorDisplay = document.getElementById("desired-color-display")

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
        if (e.target.value.match(/^#[A-Fa-f0-9]{6}$/)) pickedColorDisplay.value = e.target.value
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

        // console.log("Index", index)
        // console.log("Pixel Values", imgData.data[index], imgData.data[index + 1], imgData.data[index + 2])
        // console.log("Mouse Position", e.offsetX, e.offsetY)
        // console.log("Data length", imgData.data.length)
    })

    // desired color
    desiredColor.oninput = e => {
        if (e.target.value.match(/^#[A-Fa-f0-9]{6}$/)) desiredColorDisplay.value = e.target.value
    }

    desiredColorDisplay.oninput = e => {
        desiredColor.value = e.target.value
    }

    // helper functions

    function getIndex(x, y) {
        const scaledX = Math.round(x * (canvas.width / canvas.clientWidth))
        const scaledY = Math.round(y * (canvas.height / canvas.clientHeight))
        return (scaledX + scaledY * srcImage.width) * 4
    }

    function componentToHex(c) {
        const hex = c.toString(16)
        return hex.length == 1 ? `0${hex}` : hex
    }

    function rgbToHex(r, g, b) {
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
    }


    // image.addEventListener("click", e => {
    //     if (!imageLoaded) return

    //     const pixel = canvas.getContext("2d").getImageData(e.offsetX, e.offsetY, 1, 1).data
    //     console.log(pixel)
    //     canvas.getContext("2d").fillStyle = "#FFF"
    //     canvas.getContext("2d").fillRect(e.offsetX, e.offSetY, 1, 1)
    // })
})()
