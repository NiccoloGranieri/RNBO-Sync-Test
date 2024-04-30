const setup = async () => {

  // create WebAudio AudioContext
  const context = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });
  
  // get exported RNBO patcher file (file name must match whatever is used during target export)
  const rawPatcher = await fetch("export/patch.export.json");
  const patcher = await rawPatcher.json();

  // create RNBO device
  const device = await RNBO.createDevice({ context, patcher });

  // connect device to AudioContext audio output
  device.node.connect(context.destination);
  
  // start audio with a button
  document.getElementById("start-button").onpointerdown = (e) => { 
    context.resume();
    e.target.disabled = true;
  };

  // start video automatically
  const video = document.getElementById('webcam-video');

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (error) {
        console.log("Something went wrong!");
      });
  }

  // Set audio constraints to improve latency
  const constraints = {
    video: false,
    audio: {
      echoCancellation: false,
      noiseSuppression: false
    }
  }

  // Mic Audio Input
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const source = context.createMediaStreamSource(stream);
  source.connect(device.node);

  // attach HTML UI elements to RNBO device parameters 
  document.getElementById("vol-slider").oninput = (e) => {
    device.parametersById.get("master-volume").value = e.target.value;
  };

  document.getElementById("osc1").oninput = (e) => {
    device.parametersById.get("g1").value = e.target.value;
  };

  document.getElementById("osc2").oninput = (e) => {
    device.parametersById.get("g2").value = e.target.value;
  };

  document.getElementById("osc3").oninput = (e) => {
    device.parametersById.get("g3").value = e.target.value;
  };

  document.getElementById("osc4").oninput = (e) => {
    device.parametersById.get("g4").value = e.target.value;
  };

  document.getElementById("osc5").oninput = (e) => {
    device.parametersById.get("g5").value = e.target.value;
  };
  
};

setup();

