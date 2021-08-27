import { camera, followCameraUpdate } from '../camera';

export default function Sun({ x, y, z, r }) {
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
  this.r = r ?? 0;
  this.color = '#f90'; // TODO: Replace with fancy background & lighting color?
  this.element = document.createElement('div');
  this.element.className = 'face circle sun';
  this.element.style.width = `${r * 2}px`;
  this.element.style.height = `${r * 2}px`;
  this.element.innerHTML = `
    <svg>
      <filter id='noise'>
        <feTurbulence id="color-noise" baseFrequency="0.1"/>
        <feGaussianBlur stdDeviation="3"/>
        <feColorMatrix values="0 0 0 1 1
                               0 0 0 1 .1
                               0 0 0 0 0
                               0 0 0 0 1" result="base"/>
        <feTurbulence id="wave-noise" baseFrequency="0.1" result="ripples" />
        <feDisplacementMap in="base" in2="ripples" scale="30" result="texture"/>
        <animate xlink:href="#wave-noise" attributeName="baseFrequency" dur="30s" keyTimes="0;0.5;1" values="0.1 0.06;0.06 0.1;0.1 0.06" repeatCount="indefinite"/>
        <animate xlink:href="#color-noise" attributeName="baseFrequency" dur="30s" keyTimes="0;0.5;1" values="0.08 0.1;0.1 0.08;0.08 0.1" repeatCount="indefinite"/>
        <feImage id="fe-image-sphere-distort" xlink:href="" result="barrel" x="0" y="0" width="100%" height="100%"/>
        <feDisplacementMap in2="barrel" in="texture" xChannelSelector="R" yChannelSelector="G" scale="256" result="final"></feDisplacementMap>
        <feComposite operator="in" in="final" in2="SourceGraphic"/>
      </filter>

      <circle cx="50%" cy="50%" r="100%" filter="url(#noise)" />
    </svg>
  `;
  document.querySelector('.scene').append(this.element);
  camera.followers.push(this);
  this.updateTransform = followCameraUpdate;
  this.updateTransform(camera);
}
