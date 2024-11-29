let can_start = true; 
let current_sequence = [];
let current_index = 0;
let score = 0;
let input_sequence = [];

let sequence_length = 5;
let increase_length = true; 


function startGame() {
    can_start = false; 
    // Reset game state
    current_sequence = generateSequence(sequence_length);
    current_index = 0;
    score = 0;
    input_sequence = []; 

    document.getElementById("score-container").innerHTML = "";
    document.getElementById("grid-container").style.display = "none";
    document.getElementById("game-head").style.display = "none";
    document.getElementById("button-container").style.display = "none";
    document.getElementById("input-container").innerHTML = "";
    document.getElementById("solution-container").innerHTML = "";

    // Display sequence to user
    displaySequence();

    // Add keyboard listener for number keys
    document.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
    // Check if the pressed key is between '1' and '9'
    if (event.key >= '0' && event.key <= '9') {
        // Convert the key string to an integer
        const num = parseInt(event.key);
        
        // Call buttonClicked with the pressed number
        buttonClicked(num);

        // Find the button element with the corresponding number
        const button = Array.from(document.querySelectorAll('.button-link2'))
                            .find(b => b.innerText == num);
        if (button) {
            // Add the 'pressed' class to the button
            button.classList.add('pressed');

            // Remove the 'pressed' class after 0.5s
            setTimeout(() => button.classList.remove('pressed'), 256);
        }
    }
    else if (event.key === "Backspace"){
        backspaceClicked();
        const button = Array.from(document.querySelectorAll('.button-link2'))
                            .find(b => b.innerText == '<');
        if (button) {
            // Add the 'pressed' class to the button
            button.classList.add('pressed');

            // Remove the 'pressed' class after 0.5s
            setTimeout(() => button.classList.remove('pressed'), 256);
        }
    }
}

function handleStartPress(event) {
    if (event.keyCode == 13 & can_start) {
        document.getElementById("start-button").click();
    }
    else if (event.keyCode == 13 & document.getElementById("next-button").style.display != 'none') {
        document.getElementById("next-button").click();
    }
}



function setupGrid() {
    let gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = ""; // Clear existing buttons if any
    
    const numpadOrder = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]; // Numpad-style layout

    for (let i = 0; i < numpadOrder.length; i++) {
        let button = document.createElement("button");
        button.innerText = numpadOrder[i];
        button.className = "button-link2";
        button.onclick = function() { buttonClicked(numpadOrder[i]); };
        if (i===9) {
            gridContainer.appendChild(document.createElement("div"));
        }
        gridContainer.appendChild(button);
    }
    
    let backspaceButton = document.createElement("button");
    backspaceButton.innerText = '<';
    backspaceButton.className = "button-link2";
    backspaceButton.onclick = function(){backspaceClicked()};
    gridContainer.appendChild(backspaceButton);

    gridContainer.classList.add("grid-container"); // Ensure correct styling
    document.getElementById("sequence-container").innerHTML = "";
    gridContainer.style.display = "grid";
}

function buttonClicked(num) {
    input_sequence.push(num.toString())
    document.getElementById("input-container").innerHTML = input_sequence.join("");
    current_index++;
    if (current_index === current_sequence.length) {
        endGame();
    }
}

function backspaceClicked() {
    if (input_sequence.length > 0){
        input_sequence.pop();
        document.getElementById("input-container").innerHTML = input_sequence.join("");
        current_index -= 1;
    }
}

function endGame() {
    // Remove keyboard listener to stop capturing key presses
    document.removeEventListener("keydown", handleKeyPress);

    document.getElementById("next-button").style.display = "inline";
    document.getElementById("grid-container").style.display = "none";
    document.getElementById("game-head").style.display = "inline";
    document.getElementById("button-container").style.display = "block";
    //document.getElementById("start-button").innerHTML = "Start";
    document.getElementById("start-button").style.display = "none";
    document.getElementById("settings-button").style.display = "none";
    document.getElementById("solution-container").innerHTML = current_sequence.map(num => `<span>${num}</span>`).join("");;
    document.getElementById("input-container").innerHTML = input_sequence
    .map((num, index) => {
        num = parseInt(num);
        if (num === current_sequence[index]) {
            score++; 
            return `<span>${num}</span>`; // Matching digits
        } else {
            return `<span style="color: red;">${num}</span>`; // Mismatched digits
        }
    })
    .join("");
    document.getElementById("score-container").innerHTML = `${score} / ${sequence_length}`;
    if (score == sequence_length) {
        document.getElementById("score-container").classList.add("shining");
        if (increase_length){
            sequence_length++; 
        }
    };
    // document.getElementById("game-head").innerHTML = `Level ${sequence_length}`
}

function generateSequence(seq_len) {
    let baseNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(baseNumbers); // Shuffle the entire array of digits

    if (seq_len <= 9) {
        // For seq_len <= 9, take the first seq_len elements of the shuffled array
        return baseNumbers.slice(0, seq_len);
    } else {
        // For seq_len > 9, allow recurrence of digits
        let sequence = [];
        while (seq_len > 0) {
            let chunkSize = Math.min(seq_len, 9); // Size of the chunk to take from baseNumbers
            let chunk = baseNumbers.slice(0, chunkSize);
            shuffleArray(chunk); // Shuffle each chunk before adding
            sequence = sequence.concat(chunk);
            seq_len -= chunkSize;
        }
        return sequence;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.getElementById('save-settings').onclick = function() {
    // Retrieve values from input fields
    const newSequenceLength = parseInt(document.getElementById('sequence-length').value);
    const newTimeInterval = parseInt(document.getElementById('time-interval').value);
    const newIncreaseLength = document.getElementById('increase-length').checked;
    const newDisplayFontSize = parseInt(document.getElementById('display-font-size').value);

    // Update game settings
    sequence_length = newSequenceLength;

    time_interval = newTimeInterval;
    
    increase_length = newIncreaseLength; 

    document.getElementById('sequence-container').style.fontSize = newDisplayFontSize + 'px'

    // Close the menu
    document.getElementById('settings-menu').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    document.getElementById("input-container").innerHTML = "";
    document.getElementById("solution-container").innerHTML = "";
    can_start = true; 
};

// Update displaySequence to use time_interval
let time_interval = 1000; // Default time interval
function displaySequence() {
    let container = document.getElementById("sequence-container");
    container.innerHTML = "";

    current_sequence.forEach((num, index) => {
        // Display number
        setTimeout(() => {
            container.innerHTML = num;

            // Clear after 150ms
            setTimeout(() => {
                container.innerHTML = "";
            }, time_interval/2); 
        }, index * time_interval);

        // Check if it's the last number to setup the grid
        if (index === current_sequence.length - 1) {
            setTimeout(setupGrid, current_sequence.length * time_interval);
        }
    });
}



// Initial setup
document.getElementById("start-button").onclick = startGame;
document.addEventListener("keydown", handleStartPress);

document.getElementById('settings-button').onclick = function() {
    document.getElementById('settings-menu').style.display = 'block';
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('sequence-length').value = sequence_length;
    can_start = false; 
};

document.getElementById('cancel-settings').onclick = function() {
    document.getElementById('settings-menu').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    can_start = true; 
};

document.getElementById('next-button').onclick = function() {
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('settings-button').style.display = 'inline';
    document.getElementById('start-button').style.display = 'inline';
    document.getElementById('input-container').innerHTML = '';
    document.getElementById('score-container').innerHTML = '';
    document.getElementById('solution-container').innerHTML = '';
    document.getElementById('score-container').classList.remove("shining");
    can_start = true;
};