let types = {
  and: "and",
  or: "or",
  not: "not",
  nand: "nand",
  nor: "nor",
  xor: "xor",
  xnor: "xnor",
};

for (let type in types) {
  document.querySelector(".gate-container").innerHTML += `
    <div class="gate" id="${type}">
      <div class="socket">
        <button class="input" data-input="0"></button>
        ${
          type != types.not
            ? '<button class="input" data-input="0"></button>'
            : ""
        }
      </div>
      <div class="gate-body">${type}</div>
      <button class="output" data-output="0"></button>
    </div>
`;
  performSetup();
}

function performSetup() {
  let gates = document.querySelectorAll(".gate");
  gates.forEach((gate) => {
    let inputBtns = gate.querySelectorAll(".input");
    let outputBtn = gate.querySelector(".output");
    calculateOutput(inputBtns, outputBtn, types[gate.id]);
    inputBtns.forEach((inpBtn) => {
      inpBtn.addEventListener("click", (e) => {
        let newInp = e.target.dataset.input == "0" ? "1" : "0";
        e.target.dataset.input = newInp;
        e.target.style.background = Number(newInp) == 0 ? "white" : "green";
        calculateOutput(inputBtns, outputBtn, types[gate.id]);
      });
    });
  });
}

function calculateOutput(inputBtns, outputBtn, gateType) {
  let inp1 = Number(inputBtns[0].dataset.input);
  let inp2 = Number(inputBtns[1]?.dataset?.input || undefined);
  let out;
  if (gateType == types.and) out = inp1 & inp2;
  else if (gateType == types.or) out = inp1 | inp2;
  else if (gateType == types.not) out = !inp1;
  else if (gateType == types.nand) out = !(inp1 & inp2);
  else if (gateType == types.nor) out = !(inp1 | inp2);
  else if (gateType == types.xor) out = inp1 ^ inp2;
  else if (gateType == types.xnor) out = !(inp1 ^ inp2);
  outputBtn.dataset.output = out;
  outputBtn.style.background = out == 0 ? "white" : "green";
  return out;
}
