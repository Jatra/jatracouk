/* --------------------------------------------------------------
   Sample crossword JSON – replace this with your own data source.
   You could also fetch it via `fetch('/myPuzzle.json')`.
---------------------------------------------------------------- */
const puzzle = {
  "title": "Puzzle",
  "size": {"rows": 5, "cols": 5},
  "cells": [
    {"row":0,"col":0,"solution":"C","number":1,"isBlock":false,"acrossClueId":"A1","downClueId":"D1"},
    {"row":0,"col":1,"solution":"A","number":null,"isBlock":false,"acrossClueId":"A1","downClueId":null},
    {"row":0,"col":2,"solution":"T","number":2,"isBlock":false,"acrossClueId":"A1","downClueId":null},
    {"row":0,"col":3,"solution":"#","number":null,"isBlock":true},
    {"row":0,"col":4,"solution":"#","number":2,"isBlock":true,"acrossClueId":"A2","downClueId":"D2"},

    {"row":1,"col":0,"solution":"O","number":null,"isBlock":false,"acrossClueId":"A1","downClueId":"D1"},
    {"row":1,"col":1,"solution":"#","number":null,"isBlock":true,"acrossClueId":"A1","downClueId":"D3"},
    {"row":1,"col":2,"solution":"R","number":null,"isBlock":false,"acrossClueId":"A1","downClueId":"D4"},
    {"row":1,"col":3,"solution":"#","isBlock":true},
    {"row":1,"col":4,"solution":"C","number":3,"isBlock":false,"acrossClueId":"A2","downClueId":"D2"},

    {"row":2,"col":0,"solution":"M","number":4,"isBlock":false,"acrossClueId":"A5","downClueId":"D1"},
    {"row":2,"col":1,"solution":"O","isBlock":false},
    {"row":2,"col":2,"solution":"U","isBlock":false},
    {"row":2,"col":3,"solution":"S","isBlock":false},
    {"row":2,"col":4,"solution":"E","number":null,"isBlock":false,"acrossClueId":"A2","downClueId":"D2"},

    {"row":3,"col":0,"solution":"B","isBlock":false},
    {"row":3,"col":1,"solution":"#","isBlock":true},
    {"row":3,"col":2,"solution":"N","isBlock":false},
    {"row":3,"col":3,"solution":"#","isBlock":true},
    {"row":3,"col":4,"solution":"L","number":null,"isBlock":false,"acrossClueId":"A2","downClueId":"D2"},

    {"row":4,"col":0,"solution":"#","isBlock":true},
    {"row":4,"col":1,"solution":"#","isBlock":true},
    {"row":4,"col":2,"solution":"K","isBlock":false,"number":5},
    {"row":4,"col":3,"solution":"I","isBlock":false},
    {"row":4,"col":4,"solution":"T","number":null,"isBlock":false,"acrossClueId":"A2","downClueId":"D2"}
  ],
  "acrossClues": [
    {"id":"A1","number":1,"text":"Feline","answerLength":3,"startCell":{"row":0,"col":0}},
      {"id":"A2","number":4,"text":"Feline food","answerLength":5,"startCell":{"row":2,"col":0}},
      {"id":"A3","number":5,"text":"Smart car","answerLength":3,"startCell":{"row":4,"col":2}}
  ],
  "downClues": [
    {"id":"D1","number":1,"text":"Hair dresser","answerLength":4,"startCell":{"row":0,"col":0}},
      {"id":"D2","number":2,"text":"Elephant nose","answerLength":5,"startCell":{"row":0,"col":2}},
      {"id":"D3","number":3,"text":"Scot or Irish","answerLength":4,"startCell":{"row":1,"col":4}}
  ]
};

/* --------------------------------------------------------------
   Rendering logic
---------------------------------------------------------------- */

/* --------------------------------------------------------------
   1️⃣  Add a button to the page (you can place it wherever you like)
---------------------------------------------------------------- */
function addCheckButton() {
  const btn = document.createElement('button');
  btn.textContent = 'Check Answers';
  btn.style.marginTop = '20px';
  btn.style.padding = '8px 16px';
  btn.style.fontSize = '14px';
  // Insert the button after the clue panels
  const cluesDiv = document.querySelector('.clues');
  cluesDiv.parentNode.insertBefore(btn, cluesDiv.nextSibling);

  // Attach the click handler
  btn.addEventListener('click', checkAnswers);
}


/* --------------------------------------------------------------
   2️⃣  Core checking routine
---------------------------------------------------------------- */
function checkAnswers() {
  // Grab *all* inputs that belong to the crossword
  const inputs = document.querySelectorAll('#grid .cell input');

  let correctCount = 0;
  inputs.forEach(inp => {
    const userLetter = inp.value.trim().toUpperCase();
    const correctLetter = inp.dataset.correct.toUpperCase();

    // Reset any previous styling first
    inp.style.backgroundColor = '';
    inp.style.color = '';

    if (userLetter === '') {
      // Empty cell – leave it neutral
      inp.style.border = '2px solid #999';
    } else if (userLetter === correctLetter) {
      // ✅ Correct
      inp.style.backgroundColor = '#c8e6c9'; // light green
      inp.style.color = '#1b5e20';           // dark green text
      correctCount++;
    } else {
      // ❌ Wrong
      inp.style.backgroundColor = '#ffcdd2'; // light red/pink
      inp.style.color = '#b71c1c';           // dark red text
    }
  });

  // Simple feedback for the user
  const total = inputs.length;
  alert(`You got ${correctCount} out of ${total} letters correct.`);
}

/* --------------------------------------------------------------
   2️⃣  Guess‑a‑letter helpers
---------------------------------------------------------------- */

/**
 * Shows a temporary message next to the guess input.
 * type: "ok" (green) or "error" (red)
 */
function showGuessMessage(text, type = "ok") {
  const msg = document.getElementById('guess-msg');
  msg.textContent = text;
  msg.style.color = type === "ok" ? "#1b5e20" : "#b71c1c";
  // Fade out after 2 seconds
  setTimeout(() => {
    msg.textContent = "";
  }, 2000);
}

/**
 * Handles a single‑letter guess.
 * Finds the *first* unrevealed occurrence of the letter and fills it.
 */
function handleLetterGuess() {
  const raw = document.getElementById('letter-guess').value.trim();
  if (!raw) return;                       // nothing typed
  const guess = raw.toUpperCase();         // normalise

  // 1️⃣ Gather all input cells in reading order (row‑major)
  const inputs = Array.from(document.querySelectorAll('#grid .cell input'));

  // 2️⃣ Find the first cell where:
  //    - the stored answer equals the guessed letter
  //    - the user hasn’t typed anything yet (empty string)
  const target = inputs.find(inp => {
    const correct = inp.dataset.correct?.toUpperCase();
    const current = inp.value.trim().toUpperCase();
    return correct === guess && current === "";
  });

  if (target) {
    // Fill the cell and give a quick visual cue
    target.value = guess;
    target.style.transition = "background-color 0.3s ease";
    target.style.backgroundColor = "#c8e6c9"; // light‑green flash
    setTimeout(() => target.style.backgroundColor = "", 500);

    showGuessMessage(`Found a "${guess}"!`);
  } else {
    // No new matches
    showGuessMessage(`No remaining "${guess}" in the puzzle.`, "error");
  }

  // Clear the input field for the next guess
  document.getElementById('letter-guess').value = "";
}

/**
 * Wire the UI – create button listener and also allow Enter key.
 */
function initGuessUI() {
  const btn = document.getElementById('guess-btn');
  const txt = document.getElementById('letter-guess');

  btn.addEventListener('click', handleLetterGuess);
  txt.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLetterGuess();
    }
  });
}

/**
 * Show a brief message next to the word‑guess input.
 * type: "ok" (green) or "error" (red)
 */
function showWordMessage(text, type = "ok") {
  const msg = document.getElementById('word-msg');
  msg.textContent = text;
  msg.style.color = type === "ok" ? "#1b5e20" : "#b71c1c";
  msg.classList.add('show');
  setTimeout(() => msg.classList.remove('show'), 2500);
}

/**
 * Try to place a whole word into the first still‑empty matching slot.
 *
 * The algorithm:
 *   1. Scan every Across clue, then every Down clue (reading order).
 *   2. For each clue, compare the clue’s answer with the guessed word.
 *   3. If they match **and** at least one cell of that answer is still empty,
 *      fill *all* empty cells of that clue with the correct letters.
 *   4. Stop after the first successful placement.
 */
function handleWordGuess() {
  const raw = document.getElementById('word-guess').value.trim();
  if (!raw) return; // nothing typed
  const guess = raw.toUpperCase();

// console.log('Trying word:', guess);

  // Helper to get the input element belonging to a given cell coordinate
  function getInputAt(row, col) {
    const selector = `.cell[data-row="${row}"][data-col="${col}"] input`;
    return document.querySelector(selector);
  }


  const cellMap = {};
  document.querySelectorAll('#grid .cell').forEach(cell => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    const inp = cell.querySelector('input');
    if (inp) cellMap[`${r},${c}`] = inp;
  });


  function tryPlaceOnClue(clue) {
    const answer = clue.answer || clue.text; // fallback if answer not stored
    // Some puzzles store only the clue text; we rely on the `solution` letters
    // from the original JSON. We'll reconstruct the answer from the cells.
    const start = clue.startCell;
    const dir = clue.direction; // "across" or "down"
    const length = clue.answerLength;

// console.log('Checking clue', clue.id, clue.direction, 'answer length', clue.answerLength);

    // Re‑assemble the answer from the grid (so we are sure it matches)
    let assembled = "";
    for (let i = 0; i < length; i++) {
      const r = start.row + (dir === "down" ? i : 0);
      const c = start.col + (dir === "across" ? i : 0);
	 
      const cell = puzzle.cells.find(cel => cel.row === r && cel.col === c);
	  // const isBlock = cell.isBlock;
	  
	  
      if (!cell || cell.isBlock) {
		  // console.log('Checking clue', 'returning early', 'cell:', cell, 'isBlock:', isBlock);
		  return false; // safety
	  }
      assembled += cell.solution.toUpperCase();
    }


    // Does the assembled answer equal the guessed word?
    if (assembled !== guess) return false;

    // Are there any still‑empty inputs in this clue?
    let anyEmpty = false;
    for (let i = 0; i < length; i++) {
      const r = start.row + (dir === "down" ? i : 0);
      const c = start.col + (dir === "across" ? i : 0);
      const inp = cellMap[`${r},${c}`];
      if (!inp || inp.value.trim() === "") anyEmpty = true;
    }
	
	
    if (!anyEmpty) return false; // already fully filled


    for (let i = 0; i < length; i++) {
      const r = start.row + (dir === "down" ? i : 0);
      const c = start.col + (dir === "across" ? i : 0);
      const inp = cellMap[`${r},${c}`];
      if (!inp || inp.value.trim() === "") {
        inp.value = guess[i];
        // Brief green flash for each newly filled cell
        inp.style.transition = "background-color 0.3s ease";
        inp.style.backgroundColor = "#c8e6c9";
        setTimeout(() => (inp.style.backgroundColor = ""), 400);
      }
    }
    return true; // we placed the word
  }


  const allClues = [];

/* --------------------------------------------------------------
   NOTE: Our original JSON didn’t store `direction` or `answer`
   directly on clue objects. We can infer direction from the
   array they belong to (acrossClues vs downClues). We'll enrich
   each clue with the needed fields before processing.
--------------------------------------------------------------- */
  puzzle.acrossClues.forEach(c => {
    c.direction = "across";
    // The answer itself isn’t in the JSON; we rebuild it from the grid.
    // The `answerLength` field already exists.
    allClues.push(c);
  });
  puzzle.downClues.forEach(c => {
    c.direction = "down";
    allClues.push(c);
  });


  // Try each clue until we succeed
  let placed = false;
  for (const clue of allClues) {
    if (tryPlaceOnClue(clue)) {
      placed = true;
      break; // stop after first successful placement
    }
  }

  if (placed) {
    showWordMessage(`Word “${guess}” placed!`);
  } else {
    showWordMessage(
      `No remaining empty slot for “${guess}”.`,
      "error"
    );
  }

  // Clean the input field for the next attempt
  document.getElementById('word-guess').value = "";
}

/**
 * Wire the UI – button click and Enter key handling.
 */
function initWordUI() {
  const btn = document.getElementById('word-btn');
  const txt = document.getElementById('word-guess');

  btn.addEventListener('click', handleWordGuess);
  txt.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleWordGuess();
    }
  });
}


function buildEditableGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = ''; // clear any previous content

  // Configure CSS‑grid dimensions
  gridEl.style.gridTemplateRows = `repeat(${puzzle.size.rows}, 30px)`;
  gridEl.style.gridTemplateColumns = `repeat(${puzzle.size.cols}, 30px)`;

  puzzle.cells.forEach(cell => {
    const div = document.createElement('div');
    div.className = 'cell' + (cell.isBlock ? ' block' : '');

    div.dataset.row = cell.row;   // e.g. "0", "1", …
     div.dataset.col = cell.col;   // e.g. "0", "1", …
	 
    // Add clue number if present
    if (cell.number) {
      const numSpan = document.createElement('span');
      numSpan.className = 'num';
      numSpan.textContent = cell.number;
      div.appendChild(numSpan);
    }

    // Editable field for white squares
    if (!cell.isBlock) {
      const input = document.createElement('input');
      input.maxLength = 1;                     // only one character
      input.dataset.correct = cell.solution;   // store the answer
      input.style.width = '100%';
      input.style.height = '100%';
      input.style.border = 'none';
      input.style.textAlign = 'center';
      input.style.fontSize = '16px';
      input.style.background = 'transparent';
      input.autocomplete = 'off';
      div.appendChild(input);
    }

    gridEl.appendChild(div);
  });
}


function initCrossword() {
  document.getElementById('title').textContent = puzzle.title;

  // Render clues (same as before)
  function renderClues(list, containerId) {
    const ul = document.querySelector(`#${containerId} ul`);
    ul.innerHTML = '';
    list.forEach(clue => {
      const li = document.createElement('li');
      li.textContent = `${clue.number}. ${clue.text}`;
      ul.appendChild(li);
    });
  }
  renderClues(puzzle.acrossClues, 'across');
  renderClues(puzzle.downClues,   'down');

  // Build the interactive grid and the button
  buildEditableGrid();
  addCheckButton();
  
  initGuessUI();
  initWordUI();    // **new** whole‑word panel
  
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCrossword);
} else {
  initCrossword();
}