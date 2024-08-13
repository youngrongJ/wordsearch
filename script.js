const gridContainer = document.getElementById("grid-container");
const wordList = document.getElementById("word-list");

const words = [
  "SHAWN",
  "THOMAS",
  "JINNY",
  "TOM",
  "JACK",
  "JAKE",
  "MEEJUNG",
  "DAERO",
  "NARA",
];

const colors = [
  "pink",
  "lightblue",
  "lightgreen",
  "lightcoral",
  "lightgoldenrodyellow",
  "lightseagreen",
  "lightsalmon",
  "lightsteelblue",
  "lightcyan",
];

const gridSize = 10;
let gridData = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

// 단어를 그리드에 배치하는 함수
function placeWordInGrid(word) {
  const directions = [
    { x: 1, y: 0 }, // 가로
    { x: 0, y: 1 }, // 세로
    { x: 1, y: 1 }, // 대각선 (왼쪽 위 -> 오른쪽 아래)
    { x: 1, y: -1 }, // 대각선 (왼쪽 아래 -> 오른쪽 위)
  ];

  let placed = false;

  while (!placed) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const startX = Math.floor(Math.random() * gridSize);
    const startY = Math.floor(Math.random() * gridSize);

    let canPlace = true;
    for (let i = 0; i < word.length; i++) {
      const newX = startX + i * direction.x;
      const newY = startY + i * direction.y;

      if (
        newX < 0 ||
        newX >= gridSize ||
        newY < 0 ||
        newY >= gridSize ||
        (gridData[newY][newX] !== "" && gridData[newY][newX] !== word[i])
      ) {
        canPlace = false;
        break;
      }
    }

    if (canPlace) {
      for (let i = 0; i < word.length; i++) {
        const newX = startX + i * direction.x;
        const newY = startY + i * direction.y;
        gridData[newY][newX] = word[i];
      }
      placed = true;
    }
  }
}

// 모든 단어를 그리드에 배치
words.forEach((word) => placeWordInGrid(word));

// 빈 공간을 무작위 글자로 채우기
function fillEmptySpaces() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (gridData[y][x] === "") {
        gridData[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
}

fillEmptySpaces();

let selectedCells = [];
let colorIndex = 0;

// 그리드를 글자로 채우기
function populateGrid() {
  gridContainer.innerHTML = ""; // 이전 그리드를 초기화
  gridData.forEach((row, rowIndex) => {
    row.forEach((letter, colIndex) => {
      const cell = document.createElement("div");
      cell.textContent = letter;
      cell.className = "grid-cell";
      cell.dataset.row = rowIndex;
      cell.dataset.col = colIndex;
      cell.addEventListener("click", () => handleCellClick(cell));
      gridContainer.appendChild(cell);
    });
  });
}

// 단어 목록 채우기
function populateWordList() {
  wordList.innerHTML = ""; // 이전 목록을 초기화
  words.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    li.id = word;
    wordList.appendChild(li);
  });
}

// 셀 클릭 처리
function handleCellClick(cell) {
  // 이미 고정된 셀은 클릭해도 아무 동작하지 않음
  if (cell.classList.contains("found")) {
    return;
  }

  // 선택된 셀을 다시 클릭하면 선택 해제
  if (selectedCells.includes(cell)) {
    selectedCells = selectedCells.filter(
      (selectedCell) => selectedCell !== cell
    );
    cell.classList.remove("selected");
  } else {
    selectedCells.push(cell);
    cell.classList.add("selected");
  }

  checkWordSelection();
}

// 선택된 셀들의 글자가 단어 목록에 있는지 확인
function checkWordSelection() {
  const selectedWord = selectedCells.map((cell) => cell.textContent).join("");
  const reversedSelectedWord = selectedWord.split("").reverse().join("");

  let foundWord = null;

  if (words.includes(selectedWord)) {
    foundWord = selectedWord;
  } else if (words.includes(reversedSelectedWord)) {
    foundWord = reversedSelectedWord;
  }

  if (foundWord) {
    const currentColor = colors[colorIndex % colors.length];
    colorIndex++; // 다음 단어를 위해 색상 인덱스 증가

    selectedCells.forEach((cell) => {
      cell.classList.add("found");
      cell.style.backgroundColor = currentColor; // 각 단어마다 다른 배경색 적용
    });
    const wordElement = document.getElementById(foundWord);
    if (wordElement) {
      wordElement.classList.add("found");
    }
    selectedCells = []; // 선택된 셀 초기화
  }
}

// 게임 초기화
populateGrid();
populateWordList();
