<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vanta Cells Background</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden; /* Ensures no scrollbars */
    }

    #vanta-bg {
      width: 100%;
      height: 100%;
    }

    #center-menu {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(10px);
      z-index: 10;
      text-align: center;
    }

    #center-menu button {
      padding: 10px 20px;
      font-size: 18px;
      border: none;
      border-radius: 5px;
      background-color: #3599f2;
      color: white;
      cursor: pointer;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
    }

    #center-menu button:hover {
      background-color: #5fc5c5;
    }
  </style>
</head>
<body>
  <div id="vanta-bg"></div>

  <div id="center-menu">
    <button onclick="window.location.href='/shop.html?refresh=601178'">Wattos Junkshop</button>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js"></script>
  <script>
    VANTA.CELLS({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      color1: 0x5fc5c5,
      color2: 0x3599f2,
      size: 2.70,
      speed: 0.50
    });
  </script>
</body>
</html>
