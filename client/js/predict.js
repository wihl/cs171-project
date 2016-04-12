"use strict";

function predict() {

  // TODO: call webservice or JavaScript Random Forest

  //console.log(formData);

  // url template for webservice request src
  var url = "http://ws.chanceme.info/predict?admissionstest={TEST}&AP={AP}&averageAP={APAVE}&SATsubject={SAT2}&GPA={GPA}&schooltype={HS}&intendedgradyear=2017&female={GENDER}&MinorityRace=0&international=0&sports=0&earlyAppl=0&alumni=0&outofstate=0&acceptrate=0.151&size=6621&public=0&finAidPct=0&instatePct=0";

  // object to convert ACT to SAT scores
  var act2sat = {"36": 1600, "35": 1560, "34": 1510, "33": 1460, 
               "32": 1420, "31": 1380, "30": 1340, "29": 1300, 
               "28": 1260, "27": 1220, "26": 1190, "25": 1150, 
               "24": 1110, "23": 1070, "22": 1030, "21": 990, 
               "20": 950, "19": 910, "18": 870, "17": 830, "16": 790, 
               "15": 740, "14": 690, "13": 640, "12": 590, "11": 530}

  // means and standard deviations for standardizable values
  var means, stds;

  d3.csv('../client/data/normalize_means.csv', function(meanData) {
    d3.csv('../client/data/normalize_stds.csv', function(stdData) {

      means = meanData[0];
      stds = stdData[0];

      // calculate standard admissions test score
      var admissionstest;

      var newurl;
      var xhr = new XMLHttpRequest();

      // Standardize values and construct new URL
      function getNewURL(){

        // Standardize SAT/ACT
        // take larger score and standardize
        if (act.value == 0 && sat.value == 0) {
          admissionstest = 0;
        }
        else if (sat.value != 0 && act.value == 0) {
          admissionstest = (sat.value - means.admissionstest) / stds.admissionstest;
        }
        else if (sat.value == 0 && act.value != 0) {
          admissionstest = (act2sat[act.value] - means.admissionstest) / stds.admissionstest;
        }
        else {
          if (sat.value > act2sat[act.value]) {
            admissionstest = (sat.value - means.admissionstest) / stds.admissionstest;
          }
          else {
            admissionstest = (act2sat[act.value] - means.admissionstest) / stds.admissionstest;
          }
        }

        // Standardize GPA, Average AP, and SAT2
        var gpaValue = (gpa.value - means.GPA) / stds.GPA;
        var apaveValue = (apave.value - means.averageAP) / stds.averageAP;
        var sat2aveValue = (sat2ave.value - means.SATsubject) / stds.SATsubject;

        // Construct New URL
        var result_url = url.replace("{TEST}", admissionstest)
                            .replace("{GPA}", gpaValue)
                            .replace("{AP}", apnum.value)
                            .replace("{APAVE}", apaveValue)
                            .replace("{SAT2}", sat2aveValue)
                            .replace("{HS}", hs.value)
                            .replace("{GENDER}", gender.value);
                            //.replace("{RACE}", race.value);
        return result_url;
      }

      // Make Webservice Requests
      function makeRequest() {
        newurl = getNewURL();
        document.getElementById("result").innerHTML = "calling to webservice...<br>"+newurl;
        xhr.open("GET", newurl);
        xhr.send();
      }

      makeRequest();

      // Fetch JSON
      xhr.onreadystatechange=function(){
        if (this.readyState==4 && this.status==200){
          var predictions = JSON.parse(this.response).preds;
          var str = "";
          for (var i = 0; i < predictions.length; i++) {
            str += predictions[i].college + ": " + predictions[i].prob + "<br>\n";
          }
          document.getElementById("result").innerHTML = str;
          p171.predictions = predictions;
        } else if (this.readyState != 1) {
          document.getElementById("result").innerHTML =
            "Ready state: "+this.readyState+" Status: "+this.status;
        }
      }
    });
  });

  console.log(p171.predictions)
}

  // Get form selections
  var sat = document.getElementById('sat');
  var act = document.getElementById('act');
  var gpa = document.getElementById('gpa');
  var apave = document.getElementById('apave');
  var apnum = document.getElementById('apnum');
  var sat2ave = document.getElementById('sat2ave');
  var hs = document.getElementById('hs');
  var gender = document.getElementById('gender');
  var race = document.getElementById('race');

  // Add Event Listeners
  sat.addEventListener("change", predict(), false);
  act.addEventListener("change", predict(), false);
  gpa.addEventListener("change", predict(), false);
  apave.addEventListener("change", predict(), false);
  apnum.addEventListener("change", predict(), false);
  sat2ave.addEventListener("change", predict(), false);
  hs.addEventListener("change", predict(), false);
  gender.addEventListener("change", predict(), false);
  //race.addEventListener("change", makeRequest(), false);
