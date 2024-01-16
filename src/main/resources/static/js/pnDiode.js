const V_T = 26e-3; // Thermal voltage in volts
const I_s = 1e-12; // Reverse saturation current in amperes
const n = 1; // Ideality factor
let voltageInp;
let resistanceInp;
let switchInp;
let switchOn = true;

function setup() {
  createCanvas(windowWidth, windowHeight - 200);
  voltageInp = createElement("input");
  resistanceInp = createElement("input");
  switchInp = createElement("button", switchOn ? "ON" : "OFF");
  voltageInp.position(355, 530);
  resistanceInp.position(155, 320);
  switchInp.position(500, 510);
  voltageInp.elt.oninput = update;
  resistanceInp.elt.oninput = update;
  switchInp.elt.onclick = (e) => {
    switchOn = !switchOn;
    e.target.innerHTML = switchOn ? "ON" : "OFF";
    update();
  };
  voltageInp.elt.value = 5;
  resistanceInp.elt.value = 20;
  textSize(26);
  textAlign(CENTER, CENTER);
  background(50);
  update();
}

function update() {
  if (Number(voltageInp.elt.value) > 5.0) voltageInp.elt.value = 5;
  else if (Number(voltageInp.elt.value) < 0.0) voltageInp.elt.value = 0;
  if (Number(resistanceInp.elt.value) > 2000) resistanceInp.elt.value = 2000;
  else if (Number(resistanceInp.elt.value) < 0) resistanceInp.elt.value = 0;
  background(50);
  noStroke(); 
  fill(255);
  text("PN Junction Diode (Forward Bias)", 350, 50);
  stroke(255, switchOn ? 255 : 50);
  noFill();
  rect(100, 300, 500, 200);
  rect(400, 150, 200, 150);
  drawBattery(400, 500, (parseFloat(voltageInp.elt.value) || "NaN") + " V");
  drawSwitch(500, 500, switchOn);
  drawAmmeter(300, 300);
  drawDiode(500, 300);
  drawAmmeter(500, 150, "V");
  drawResistance(
    200,
    300,
    (parseFloat(resistanceInp.elt.value) || "NaN") + " Ω",
  );
  let v = parseFloat(voltageInp.elt.value);
  let r = parseFloat(resistanceInp.elt.value);
  if (v === NaN && r === NaN) return;
  const voltage = Array.from({ length: 100 }, (_, i) => i / 100); // Adjust the range and resolution as needed
  const current = voltage.map((v) => diodeCurrent(v, r));
  plotGraph(voltage, current);
}

function plotGraph(voltage, current) {
  push();
  let w = width / 2;
  let h = height;
  translate(w, 0);
  line(0, 500, w, 500);
  line(0, 0, 0, h);
  textSize(12);
  fill(255);
  for (let i = 0; i < voltage.length; i += 5) {
    stroke(255, 40);
    let x = i * (w / voltage.length);
    line(x, 0, x, h);
    stroke(255);
    line(x, 500 - 5, x, 500 + 5);
    noStroke();
    text(voltage[i].toFixed(2), x, 520);
  }
  stroke(255, 40);
  for (let i = 500; i >= 0; i -= 50) {
    line(0, i, w, i);
    text((500 - i) / 50, -20, i);
  }
  for (let i = 500; i <= h; i += 50) {
    line(0, i, w, i);
  }
  stroke(255);
  fill(255);
  if (switchOn && voltageInp.elt.value > 0) {
    for (let i = 1; i < voltage.length; i++) {
      let p1 = [(i - 1) * (w / voltage.length), 500 - current[i - 1] * 50];
      let p2 = [i * (w / voltage.length), 500 - current[i] * 50];
      line(p1[0], p1[1], p2[0], p2[1]);
    }
  }
  textSize(22);
  text("Voltage (V)", w / 2, 550);
  translate(-50, h / 2);
  rotate(-PI / 2);
  text("Current (A)", 0, 0);
  pop();
}

function drawSwitch(x, y, on) {
  let size = 20;
  push();
  translate(x, y);
  fill(50);
  noStroke();
  strokeWeight(2);
  rect(-3, -20, size + 8, 40);
  stroke(255);
  fill(255);
  rotate(on ? 0 : -PI / 4);
  line(0, 0, size, 0);
  circle(size, 0, 5);
  noStroke();
  textSize(18);
  pop();
}

function drawBattery(x, y, volts, dir = 1) {
  let w = 60,
    h = 40;
  push();
  noStroke();
  fill(50);
  translate(x, y);
  rect(-w / 2, -h / 2, w, h);
  fill(255);
  text(volts, 0, -40);
  stroke(255);
  line(0 - w / 2, -h / 2 - dir * 5, 0 - w / 2, h / 2 + dir * 5);
  line(20 - w / 2, -h / 2 + dir * 5, 20 - w / 2, h / 2 - dir * 5);
  line(40 - w / 2, -h / 2 - dir * 5, 40 - w / 2, h / 2 + dir * 5);
  line(60 - w / 2, -h / 2 + dir * 5, 60 - w / 2, h / 2 - dir * 5);
  pop();
}

function drawAmmeter(x, y, c = "A") {
  let r = 40;
  push();
  stroke(255);
  fill(50);
  circle(x, y, r);
  fill(255);
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text(c, x, y);
  pop();
}

function drawDiode(x, y) {
  let size = 40;
  push();
  translate(x, y);
  stroke(255);
  fill(50);
  triangle(-size / 2, -size / 2, size / 2, 0, -size / 2, size / 2);
  line(size / 2, -size / 2, size / 2, size / 2);
  pop();
}

function drawResistance(x, y, resistance) {
  let size = 80;
  push();
  translate(x - size / 2, y);
  noStroke();
  fill(255);
  text(resistance, size / 2, -25);
  fill(50);
  rect(0, -8, size, 16);
  stroke(255);
  line(0, -8, 10, 8);
  line(10, 8, 20, -8);
  line(20, -8, 30, 8);
  line(30, 8, 40, -8);
  line(40, -8, 50, 8);
  line(50, 8, 60, -8);
  line(60, -8, 70, 8);
  line(70, 8, 80, -8);
  pop();
}
function diodeCurrent(V, Rs) {
  return I_s * (Math.exp(V / (n * V_T)) - 1) + V / Rs;
}
