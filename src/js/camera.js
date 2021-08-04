const camera = document.querySelector('.camera')
const scene = document.querySelector('.scene')
const cameraDebug = document.querySelector('.debug .view')
const perfDebug = document.querySelector('.debug .perf')

const defaultRotation = { 
  x: parseInt(getComputedStyle(scene).getPropertyValue('--default-rotation-x').replace('deg', ''), 10), 
  z: parseInt(getComputedStyle(scene).getPropertyValue('--default-rotation-z').replace('deg', ''), 10) 
}
const rotation = { x: defaultRotation.x, z: defaultRotation.z }
const prevRotation = { x: rotation.x, z: rotation.z }
const position = { x: 0, y: 0, z: 0 }
let zoom = 0

let mouseDown = false
let mouseDownPos = { x: 0, y: 0 }

function handleDown(event) {
  event.preventDefault()
  mouseDown = true
  mouseDownPos.x = event.clientX || event.touches[0].clientX
  mouseDownPos.y = event.clientY || event.touches[0].clientY
  // console.log(`Mouse down at ${mouseDownPos.x}, ${mouseDownPos.y}`)
}

function handleUp() {
  mouseDown = false
  prevRotation.x = rotation.x
  prevRotation.z = rotation.z
  // console.log('Mouse up')
}

function handleMove(event) {
  if (mouseDown) {
    event.preventDefault()
    const x = event.clientX || event.touches[0].clientX
    const y = event.clientY || event.touches[0].clientY
    rotation.x = mouseDownPos.y - y + prevRotation.x
    rotation.z = mouseDownPos.x - x + prevRotation.z
    moveCamera(rotation, position)
    // console.log(`Rotating ${tempRotation.x}, ${tempRotation.z}`)
  }
}

function moveCamera(rotation, position) {
  camera.style.transform = `translateZ(${zoom}px)`
  scene.style.transform = `rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg) translateX(${position.x}px) translateY(${position.y}px)`
  cameraDebug.innerText = `Position: ${Math.round(position.x)}x, ${Math.round(position.y)}y ${Math.round(position.z)}z\nRotation: ${Math.round(rotation.x)}°x, ${Math.round(rotation.z)}°z\nZoom: ${Math.round(zoom)}px`
}

function resetRotation() {
  console.log("Resetting rotation")
  rotation.x = defaultRotation.x
  rotation.z = defaultRotation.z
  moveCamera(rotation, position)
}

function resetPosition() {
  console.log("Resetting position")
  position.x = position.y = position.z = 0
  moveCamera(rotation, position)
}

document.addEventListener('mousedown', handleDown)
document.addEventListener('touchstart', handleDown)
document.addEventListener('mouseup', handleUp)
document.addEventListener('touchend', handleUp)
document.addEventListener('mousemove', handleMove)
document.addEventListener('touchmove', handleMove)

moveCamera(rotation, position)

/* Game loop */

const keys = new Set()
let previousTimestamp
const movementSpeed = 0.2
const zoomSpeed = 0.2

document.onkeydown = function(event) {
  keys.add(event.key)
}

document.onkeyup = function(event) {
  keys.delete(event.key)
}

function toRad(angle) {
  return angle * (Math.PI / 180)
}

function main(timestamp) {
  window.requestAnimationFrame(main)
  
  if (previousTimestamp === undefined) previousTimestamp = timestamp
  const elapsed = timestamp - previousTimestamp
  
  // Do stuff
  let moveX = 0, moveY = 0, moveZoom = 0
  const rx = toRad(rotation.x)
  const ry = toRad(rotation.y)
  const rz = toRad(rotation.z)
  if (keys.has('w')) { 
    moveX += Math.sin(rz) * movementSpeed * elapsed
    moveY += Math.cos(rz) * movementSpeed * elapsed
  }
  if (keys.has('a')) { 
    moveX += Math.cos(rz) * movementSpeed * elapsed
    moveY -= Math.sin(rz) * movementSpeed * elapsed
  }
  if (keys.has('s')) { 
    moveX -= Math.sin(rz) * movementSpeed * elapsed
    moveY -= Math.cos(rz) * movementSpeed * elapsed
  }
  if (keys.has('d')) { 
    moveX -= Math.cos(rz) * movementSpeed * elapsed
    moveY += Math.sin(rz) * movementSpeed * elapsed
  }
  if (keys.has('z')) {
    moveZoom += zoomSpeed * elapsed
  }
  if (keys.has('x')) {
    moveZoom -= zoomSpeed * elapsed
  }
  if (moveX || moveY || moveZoom) {
    position.x += moveX
    position.y += moveY
    zoom += moveZoom
    moveCamera(rotation, position)
  }
  
  previousTimestamp = timestamp  
  perfDebug.innerText = `Elapsed: ${elapsed.toFixed(2)} FPS: ${(1000 / elapsed).toFixed()}`
}

window.requestAnimationFrame(main)
