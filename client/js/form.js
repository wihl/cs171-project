"use strict";
// Class to store user input
function FormData(sat) {
  /* initial user input with rational defaults */
  this.sat = parseInt(sat) || 1200;
  return this;
}

// From http://stackoverflow.com/questions/8674618/adding-options-to-select-with-javascript
// Populate drop downs with a set of values
function populateSelect(target, min, max, inc){
  if (!target){
    return false;
  }
  else {
    var min = min || 0,
        max = max || min + 100,
        inc = inc || 1;

    var select = document.getElementById(target);
    if (select === null) return;

    for (var i = min; i<=max; i += inc){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select.appendChild(opt);
    }
  }
}

$(document).ready(function() {
  populateSelect('sat',600,2400,10);
  populateSelect('act',1,36);
  populateSelect('apnum',0,10);
  populateSelect('sat2ave',0,10);
});

// Be responsive
window.addEventListener("resize", function(){
  d3.select("body").selectAll("svg").remove();
  updatePredictionViz();
}, false);

document.getElementById("btn-predict").onclick = function() {
  // get form data
  var formData = new FormData(
    document.getElementById("sat").value
  );

  // call the prediction
  p171.predictions = predict(formData);
  console.log(p171.predictions);
  updatePredictionViz();
}