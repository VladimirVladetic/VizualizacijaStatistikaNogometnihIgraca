function showSuggestions(data, inputId) {
        let playerNames = data.map(player => player.Name);
        let input = document.getElementById(inputId);
        let inputValue = input.value.toLowerCase();
        let suggestionsContainer = document.getElementById("suggestions-container");
        suggestionsContainer.innerHTML = "";

        let suggestions = playerNames.filter(name => name.toLowerCase().includes(inputValue));
        suggestions.forEach(suggestion => {
            let suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.textContent = suggestion;
            suggestionItem.addEventListener("click", function() {
                input.value = suggestion;
                suggestionsContainer.innerHTML = "";
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
}

function updateChart() {
    let positionSelect = document.getElementById("position-select");
    let selectedPosition = positionSelect.value;

    let playerInputs = document.querySelectorAll(".player-input");
    let playerNames = [];
    playerInputs.forEach(input => {
        let playerName = input.value.trim();
        if (playerName) {
            playerNames.push(playerName);
        }
    });

    if (playerNames.length > 0) {
        d3.csv("FullData_augmented.csv").then(function(data){
            if (selectedPosition === "forward") {
                features = ["Attacking_Position", "Composure", "Shot_Power", "Finishing", "Volleys", "Penalties"];
            } else if (selectedPosition === "playmaking") {
                features = ["Vision", "Short_Pass", "Long_Pass", "Crossing", "Curve", "Freekick_Accuracy"];
            } else if (selectedPosition === "defending") {
                features = ["Heading", "Jumping", "Strength", "Standing_Tackle", "Sliding_Tackle", "Marking"];
            } else if (selectedPosition === "goalkeeper") {
                features = ["GK_Reflexes", "GK_Handling", "GK_Kicking", "GK_Diving", "GK_Positioning", "Strength"];
            } else if (selectedPosition === "dribbling") {
                features = ["Ball_Control", "Dribbling", "Acceleration", "Speed", "Balance", "Agility"];
            } else if (selectedPosition === "disruption") {
                features = ["Strength", "Reactions", "Interceptions", "Stamina", "Standing_Tackle", "Sliding_Tackle"];
            }

            updateChartWithSelectedPlayers(data, features, playerNames);
        });
    }
}

function updateChartWithSelectedPlayers(data, features, playerNames) {
    let selectedPlayersData = [];
    let selectedPlayerNames = [];

    console.log(features);
    console.log(playerNames);

    playerNames.forEach(playerName => {
        let selectedPlayerData = data.find(player => player.Name.toLowerCase() === playerName.toLowerCase());
        if (selectedPlayerData) {
            let point = {};
            features.forEach(f => {
                let value = parseFloat(selectedPlayerData[f]);
                point[f] = value;
            });
            selectedPlayersData.push(point);
            selectedPlayerNames.push(playerName);
        }
    });

    selectedPlayersData.forEach((point, index) => {
        console.log(`Player: ${selectedPlayerNames[index]}`);
        features.forEach(f => {
            console.log(`${f}: ${point[f]}`);
        });
    });

    if (selectedPlayersData.length === playerNames.length) { 
        makeRadarChart(selectedPlayersData, features, selectedPlayerNames);
    }
}


