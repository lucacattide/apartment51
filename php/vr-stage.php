<!--Inizio Scena-->
<a-scene embedded inspector="url: https://aframe.io/releases/0.3.0/aframe-inspector.min.js">
  <a-assets>
    <img id="sky" src="img/vr.jpg">
  </a-assets>
  <a-sky src="#sky" segments-height="8" segments-width="400" rotation="0 95 5"></a-sky>
  <a-camera fov="45" wasd-controls-enabled="false">
    <a-animation attribute="rotation" to="0 360 0" dur="10000" fill="backwards" direction="normal" easing="ease-in-out"></a-animation>
  </a-camera>
</a-scene>
<!--Fine Scena-->