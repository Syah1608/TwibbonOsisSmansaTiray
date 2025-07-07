.frame {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 20px;
}

canvas {
  width: 100%;
  height: auto;
  display: block;
}

.notification {
  visibility: hidden;
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 16px;
  border-radius: 5px;
}

.notification.show {
  visibility: visible;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
@keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
