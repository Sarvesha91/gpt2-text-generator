// Function to get parameters by name from config file
function getParameterByName(name, defaults, location) {
    location = location || window.location.href;
    name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
    var result = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(location);
    return result === null ? defaults : decodeURIComponent(result[1].replace(/\+/g, ' '));
  }
  
  // Get the config file "env.json" and extract the values
  function getConfig() {
    // if you pass ?dev=true to your url address default config that will be used is `config-development`
    // otherwise - `config-production`
    var configName = getParameterByName('dev', false) ? 'env' : 'env';
  
    window._config || (window._config = {});
  
    // for production version you should concat your config with main script or put it above main script
    // inside global `_config` variable for example
    if (window._config[configName]) return window._config[configName];
  
    // for development version you can just make an ajax call to get the config
    $.ajax({
      url : '/static/' + configName + '.json',
      async : false,
      success : function(response) {
        window._config[configName] = response;
      }
    });
    return window._config[configName];
  }
  
  // Get configuration
  var conf = getConfig();
  
  // Send request when spacebar or tab key is pressed
  function onKeyDown(e) {
      if (e.keyCode === 32 || e.keyCode === 9 || e.keyCode === 229) {
          e.preventDefault();
          sendRequest();
      }
  }
  
  // Colorize boxes and display generated prediction
  function displayPrediction(textGenerated) {
      if (textGenerated.generated == "lang_det_err") {
          document.getElementById("prediction").innerHTML = '<span style="font-weight: bold; color: #fda085;">Sorry, only supports English</span>';
      } else {
          var generated = '<span style="font-weight: bold; color: #fda085;">' + textGenerated.generated + '</span>';
          document.getElementById("prediction").innerHTML = textGenerated.query + generated;
      }
  }
  
  // Function to auto-generate prediction based on current textarea content
  function autoGenerate() {
      var element = document.getElementById('prediction');
      var text = element.innerText || element.textContent;
  
      // Send to sendRequest
      sendRequest(text);
  }
  
  console.log(conf.APP_URL + conf.ROUTE);
  
  // Function to send request to model
  function sendRequest(input) {
      // Check if argument input passed, otherwise fetch it from textarea
      if (input === undefined) {
          input = document.getElementById("textarea").value.trim();
      }
  
      if (input.length > 1) {
          // Build data JSON
          var data = JSON.stringify({"input": input});
  
          // Send POST request using fetch
          fetch(conf.APP_URL + conf.ROUTE, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: data
          })
          .then(response => {
              if (response.ok) {
                  return response.json();  // Parse JSON response if success
              } else {
                  throw new Error('Network response was not ok');
              }
          })
          .then(data => {
              displayPrediction(data.body);  // Display result
          })
          .catch(error => {
              console.error('Error:', error);  // Handle any errors
              document.getElementById("prediction").innerHTML = '<span style="font-weight: bold; color: red;">An error occurred. Please try again.</span>';
          });
      }
  }
  
  // Attach event listener to textarea for keydown events
  document.getElementById("textarea").addEventListener("keydown", onKeyDown);
  