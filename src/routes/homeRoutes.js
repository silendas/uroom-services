'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          @keyframes slideUpDown {
            0% { transform: translateY(-20px); }
            50% { transform: translateY(0); }
            100% { transform: translateY(-20px); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          @keyframes rotateSun {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes flare {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 0.4; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          @keyframes meteor {
            0% {
              transform: translate(120%, -120%) rotate(45deg);
              opacity: 1;
            }
            100% {
              transform: translate(-120%, 120%) rotate(45deg);
              opacity: 0;
            }
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
            overflow: hidden;
            perspective: 1000px;
          }
          .space {
            position: fixed;
            width: 100vw;
            height: 100vh;
            transform-style: preserve-3d;
            transition: transform 0.1s ease-out;
          }
          .sun {
            position: absolute;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle at center, #fff700 0%, #ff8800 50%, #ff4400 100%);
            border-radius: 50%;
            box-shadow: 0 0 100px #ff4400,
                       0 0 60px #ff8800,
                       0 0 30px #ffff00;
            left: 75%;
            top: 35%;
            transform: translate(-50%, -50%);
          }
          .sun-flare {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: radial-gradient(ellipse at center, rgba(255,150,0,0.3) 0%, rgba(255,150,0,0) 70%);
            animation: flare 3s infinite linear, rotateSun 20s infinite linear;
          }
          .meteor {
            position: absolute;
            width: 100px;
            height: 2px;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);
            animation: meteor 3s linear infinite;
            transform-origin: right center;
            transform-style: preserve-3d;
          }
          .container {
            text-align: center;
            background-color: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            animation: slideUpDown 3s ease-in-out infinite;
            position: relative;
            backdrop-filter: blur(5px);
            z-index: 100;
          }
          .logo {
            font-size: 60px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          }
          .message {
            font-size: 28px;
            color: #e0e0e0;
            margin-bottom: 10px;
          }
          .login-message {
            font-size: 20px;
            color: #cccccc;
            margin-top: 0px;
          }
          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: white;
            border-radius: 50%;
            transform-style: preserve-3d;
          }
          .star-space {
            position: fixed;
            width: 100vw;
            height: 100vh;
            transform-style: preserve-3d;
            transition: transform 0.1s ease-out;
          }
          .meteor-space {
            position: fixed;
            width: 100vw;
            height: 100vh;
            transform-style: preserve-3d;
            transition: transform 0.1s ease-out;
          }
        </style>
      </head>
      <body>
        <div class="star-space"></div>
        <div class="meteor-space"></div>
        <div class="space">
          <div class="sun">
            <div class="sun-flare"></div>
          </div>
        </div>
        <div class="container">
          <div class="logo">U-ROOM</div>
          <div class="message">Selamat datang di Service API U-Room</div>
          <div class="login-message">
            silahkan kunjungi endpoint /api-docs
          </div>
        </div>
        <script>
          function createStar() {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 100 + 'vh';
            star.style.animation = 'twinkle ' + (Math.random() * 3 + 1) + 's infinite';
            document.querySelector('.star-space').appendChild(star);
          }
          
          function createMeteor() {
            const meteor = document.createElement('div');
            meteor.classList.add('meteor');
            meteor.style.top = Math.random() * 100 + 'vh';
            meteor.style.left = Math.random() * 100 + 'vw';
            document.querySelector('.meteor-space').appendChild(meteor);
            
            setTimeout(() => {
              meteor.remove();
            }, 3000);
          }

          // Membuat bintang-bintang
          for (let i = 0; i < 200; i++) {
            createStar();
          }

          // Membuat meteor setiap 3 detik
          setInterval(createMeteor, 3000);

          // Efek parallax saat mouse bergerak
          document.addEventListener('mousemove', (e) => {
            const space = document.querySelector('.space');
            const starSpace = document.querySelector('.star-space');
            const meteorSpace = document.querySelector('.meteor-space');
            
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            space.style.transform = \`rotateY(\${xAxis}deg) rotateX(\${yAxis}deg)\`;
            starSpace.style.transform = \`rotateY(\${xAxis * 0.5}deg) rotateX(\${yAxis * 0.5}deg)\`;
            meteorSpace.style.transform = \`rotateY(\${xAxis * 0.8}deg) rotateX(\${yAxis * 0.8}deg)\`;
          });
        </script>
      </body>
    </html>
  `);
});

module.exports = router;
