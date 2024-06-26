function goToScatter() {
    document.getElementById("intro-div").style.display = "none";
    document.getElementById("scatter-div").style.display = "flex";
    document.getElementById("radar-div").style.display = "none";
    document.getElementById("individual-div").style.display = "none";
    d3.select("#scatter-chart-container").selectAll("svg").remove();
    d3.select("#radar-chart-container").selectAll("svg").remove();
    d3.select("#bar-chart-container").selectAll("svg").remove();
}

function goToRadar() {
    document.getElementById("intro-div").style.display = "none";
    document.getElementById("scatter-div").style.display = "none";
    document.getElementById("radar-div").style.display = "flex";
    document.getElementById("individual-div").style.display = "none";
    d3.select("#scatter-chart-container").selectAll("svg").remove();
    d3.select("#radar-chart-container").selectAll("svg").remove();
    d3.select("#bar-chart-container").selectAll("svg").remove();
}

function goToIndividual() {
    document.getElementById("intro-div").style.display = "none";
    document.getElementById("scatter-div").style.display = "none";
    document.getElementById("radar-div").style.display = "none";
    document.getElementById("individual-div").style.display = "flex";
    d3.select("#scatter-chart-container").selectAll("svg").remove();
    d3.select("#radar-chart-container").selectAll("svg").remove();
    d3.select("#bar-chart-container").selectAll("svg").remove();
}

document.addEventListener("DOMContentLoaded", function() {
    d3.csv("FullData_augmented.csv").then(function(data) {
        let playerInputs = document.querySelectorAll(".player-input");
        playerInputs.forEach(input => {
            input.addEventListener("input", function() {
                showSuggestions(data, this.id);
            });
        });
        let individualPlayerInputs = document.querySelectorAll(".individual-player-input");
        individualPlayerInputs.forEach(input => {
            input.addEventListener("input", function() {
                showIndividualSuggestions(data, this.id);
            });
        });
        let team = document.querySelectorAll(".team-input");
        team.forEach(input => {
            input.addEventListener("input", function() {
                showTeamSuggestions(data, this.id);
            });
        });
        let columnNames = Object.keys(data[0]).slice(19);
        let inputIds = ["stat-1", "stat-2"];
        inputIds.forEach(inputId => {
            let input = document.getElementById(inputId);
            input.addEventListener("input", function() {
                showColumnSuggestions(columnNames, this.value, inputId);
            });
        });
    });
});

function showSuggestions(data, inputId) {
        let playerNames = data.map(player => player.Name);
        let input = document.getElementById(inputId);
        let inputValue = input.value.toLowerCase();
        let suggestionsContainer = document.getElementById(`suggestions-container-player${inputId.slice(-1)}`);
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

function showIndividualSuggestions(data, inputId) {
    let playerNames = data.map(player => player.Name);
    let input = document.getElementById(inputId);
    let inputValue = input.value.toLowerCase();
    let suggestionsContainer = document.getElementById("individual-suggestions-container");
    suggestionsContainer.innerHTML = "";

    let suggestions = playerNames.filter(name => name.toLowerCase().includes(inputValue));
    suggestions.forEach(suggestion => {
        let suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener("click", function() {
            input.value = suggestion;
            suggestionsContainer.innerHTML = "";
            console.log(suggestion);
            d3.select("#bar-chart-container").selectAll("svg").remove();
            fetchPlayer(suggestion, data);
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

function fetchPlayer(playerName, data) {
    const player = data.find(player => player.Name === playerName);
    if (!player) {
        console.error('Player not found in the data');
        return;
    }

    const playerDetails = `
        <h2>${player.Name}</h2>
        <p><strong>Nationality:</strong> ${player.Nationality}</p>
        <p><strong>Club:</strong> ${player.Club}</p>
        <p><strong>Position:</strong> ${player.Club_Position}</p>
        <p><strong>Rating:</strong> ${player.Rating}</p>
        <p><strong>Height:</strong> ${player.Height}</p>
        <p><strong>Weight:</strong> ${player.Weight}</p>
        <p><strong>Preferred Foot:</strong> ${player.Preffered_Foot}</p>
        <p><strong>Age:</strong> ${player.Age}</p>
        <p><strong>Preferred Position:</strong> ${player.Preffered_Position}</p>
        <p><strong>Work Rate:</strong> ${player.Work_Rate}</p>
        <p><strong>Weak Foot:</strong> ${player.Weak_foot}</p>
        <p><strong>Skill Moves:</strong> ${player.Skill_Moves}</p>
    `;

    const playerContainer = document.getElementById("player-container");
    playerContainer.innerHTML = playerDetails;

    makeBarChart(player);
}

function makeBarChart(player) {
    const barChartContainer = document.getElementById("bar-chart-container");
    const skillColumns = Object.keys(player).slice(19);
    const sortedSkills = skillColumns.sort((a, b) => player[b] - player[a]);
    const top5Skills = sortedSkills.slice(0, 5);
    const bottom5Skills = sortedSkills.slice(-5);
    const top5Data = top5Skills.map(skill => ({ skill: skill, value: player[skill] }));
    const bottom5Data = bottom5Skills.map(skill => ({ skill: skill, value: player[skill] }));
    createBarChart(top5Data, barChartContainer, "top");
    createBarChart(bottom5Data, barChartContainer, "bottom");
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
            } else if (selectedPosition === "goalkeeping") {
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

function showColumnSuggestions(columnNames, inputValue, inputId) {
    let suggestionsContainer = document.getElementById(`suggestions-container${inputId.slice(-1)}`);
    suggestionsContainer.innerHTML = "";

    let suggestions = columnNames.filter(name => name.toLowerCase().includes(inputValue.toLowerCase()));
    suggestions.forEach(suggestion => {
        let suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener("click", function() {
            let input = document.getElementById(inputId);
            input.value = suggestion;
            suggestionsContainer.innerHTML = "";
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

function showTeamSuggestions(data, inputId) {
    let input = document.getElementById(inputId);
    let inputValue = input.value.toLowerCase();
    let suggestionsContainer = document.getElementById(`suggestions-container-team`);
    suggestionsContainer.innerHTML = "";

    let clubNames = data.map(player => player.Club);
    let nationalityNames = data.map(player => player.Nationality);

    let suggestionsSet = new Set([...clubNames, ...nationalityNames]);
    let suggestions = Array.from(suggestionsSet);

    suggestions = suggestions.filter(name => name.toLowerCase().includes(inputValue));

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

function updateScatterPlot() {
    stat1 = document.getElementById("stat-1").value;
    stat2 = document.getElementById("stat-2").value;
    team = document.getElementById("team").value;

    createScatterPlot(stat1, stat2, team);
}