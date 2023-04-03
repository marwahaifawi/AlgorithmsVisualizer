const lengthSlider = document.getElementById("length");
const valueLabel1 = document.getElementById("valueLabel1");
const speedSlider = document.getElementById("speed");
const valueLabel2 = document.getElementById("valueLabel2");
lengthSlider.addEventListener("input", () => {
  valueLabel1.textContent = lengthSlider.value;
});
speedSlider.addEventListener("input", () => {
  if (speedSlider.value == 1) valueLabel2.textContent = "x1";
  else if (speedSlider.value == 2) valueLabel2.textContent = "x1.5";
  else valueLabel2.textContent = "x2";
});

// Generate a random array of the specified length
function generateRandomArray(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 400) + 1);
  }
  return arr;
}

let array = generateRandomArray(
  parseInt(document.getElementById("length").value)
);
drawArray(array);

// Draw the current state of the array on the canvasDisplay
function drawArray(array, moves) {
  canvasDisplay.width = 1000;
  canvasDisplay.height = 500;
  const margin = 30;
  const cols = [];
  const ctx = canvasDisplay.getContext("2d");
  const availableWidth = canvasDisplay.width - margin;
  const barWidth = (availableWidth / array.length) * 0.8;
  ctx.clearRect(0, 0, canvasDisplay.width, canvasDisplay.height);
  for (let i = 0; i < array.length; i++) {
    const x =
      i * barWidth +
      margin +
      barWidth / 2 +
      (availableWidth - array.length * barWidth) / 2;
    const y = canvasDisplay.height - margin;
    const width = barWidth - 4;
    const height = array[i];
    cols[i] = new Column(x, y, width, height);
    const move = moves && moves.find((move) => move.indices.includes(i));
    if (move && move.type === "swap") {
      const color = move.indices.includes(i) ? "green" : "#acd6e6";
      cols[i].draw(ctx, color);
    } else if (move && move.type === "compare") {
      const color = move.indices.includes(i) ? "red" : "#acd6e6";
      cols[i].draw(ctx, color);
    } else cols[i].draw(ctx);
  }
}
function disableButtons() {
  document.getElementById("length").disabled = true;
  document.getElementById("solve").disabled = true;
  document.getElementById("randomize").disabled = true;
}

function enableButtons() {
  document.getElementById("length").disabled = false;
  document.getElementById("solve").disabled = false;
  document.getElementById("randomize").disabled = true;
}
// Sort the array using bubble sort and display the sorting process visually

function bubbleSort(array) {
  const moves = [];
  for (let i = 0; i < array.length; i++) {
    let swapped = false;
    for (let j = 0; j < array.length - i - 1; j++) {
      moves.push({ indices: [j, j + 1], type: "compare" });
      if (array[j] > array[j + 1]) {
        // Swap elements
        swapped = true;
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        moves.push({ indices: [j, j + 1], type: "swap" });
      }
      drawArray(array);
    }
    // If no moves were made, array is sorted
    if (!swapped) {
      break;
    }
  }
  return moves;
}

// Sort the array using selection sort and display the sorting process visually

async function selectionSort(array) {
  const moves = [];
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      moves.push({ indices: [j, minIndex], type: "compare" });
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      drawArray(array, [moves[moves.length - 1]]);
      await new Promise((r) => setTimeout(r, 500));
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      moves.push({ indices: [i, minIndex], type: "swap" });
      drawArray(array, [moves[moves.length - 1]]);
      await new Promise((r) => setTimeout(r, 500));
    }
    moves.push({ indices: [array.length - 1, minIndex], type: "done" });
    drawArray(array, [moves[moves.length - 1]]);
    await new Promise((r) => setTimeout(r, 500));
  }
  return moves;
}

// Sort the array using quick sort and display the sorting process visually

function quickSort(array) {
  let moves = [];
  function partition(array, low, high) {
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      moves.push({ indices: [j, high], type: "compare" });
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        moves.push({ indices: [i, j], type: "swap" });
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    moves.push({ indices: [i + 1, high], type: "swap" });
    return i + 1;
  }
  function sort(array, low, high) {
    if (low < high) {
      let pivotIndex = partition(array, low, high);
      sort(array, low, pivotIndex - 1);
      sort(array, pivotIndex + 1, high);
    }
  }
  sort(array.slice(), 0, array.length - 1);
  return moves;
}
// Sort the array using insertion sort and display the sorting process visually

function insertionSort(array) {
  let moves = [];
  const len = array.length;
  for (let i = 1; i < len; i++) {
    const current = array[i];
    let j = i - 1;
    moves.push({ indices: [j, current], type: "compare" });
    while (j >= 0 && array[j] > current) {
      array[j + 1] = array[j];
      moves.push({ indices: [j + 1, j], type: "swap" });
      j--;
    }
    array[j + 1] = current;
  }
  return moves;
}

// Sort the array using heap Sort and display the sorting process visually

function heapSort(array) {
  let heapSize = array.length;
  let moves = [];

  function heapify(array, heapSize, index) {
    let largest = index;
    let leftChild = 2 * index + 1;
    let rightChild = 2 * index + 2;

    // Check if left child is larger than the root
    if (leftChild < heapSize && array[leftChild] > array[largest]) {
      largest = leftChild;
    }

    // Check if right child is larger than the root and left child
    if (rightChild < heapSize && array[rightChild] > array[largest]) {
      largest = rightChild;
    }

    moves.push({ indices: [largest, index], type: "compare" });

    if (largest !== index) {
      // Swap the root with the largest element
      [array[index], array[largest]] = [array[largest], array[index]];
      moves.push({ indices: [index, largest], type: "swap" });
      // Recursively heapify the affected sub-tree
      heapify(array, heapSize, largest);
    }
  }

  // Build a max heap
  for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
    heapify(array, heapSize, i);
  }

  // Heap sort
  for (let i = array.length - 1; i > 0; i--) {
    // Swap the root element (max value) with the last element
    [array[0], array[i]] = [array[i], array[0]];
    moves.push({ indices: [0, i], type: "swap" });
    heapSize--;
    heapify(array, heapSize, 0);
  }

  return moves;
}
// Sort the array using gnome Sort and display the sorting process visually

function gnomeSort(array) {
  let i = 0;
  let n = array.length;
  let moves = [];

  while (i < n) {
    moves.push({ indices: [i, i - 1], type: "compare" });
    if (i == 0 || array[i] >= array[i - 1]) {
      i++;
    } else {
      [array[i], array[i - 1]] = [array[i - 1], array[i]];
      moves.push({ indices: [i, i - 1], type: "swap" });
      i--;
    }
  }

  return moves;
}
// Sort the array using comb Sort and display the sorting process visually
function combSort(array) {
  let gap = array.length;
  let shrink = 1.3;
  let sorted = false;
  let moves = [];

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap > 1) {
      sorted = false;
    } else {
      gap = 1;
      sorted = true;
    }
    let i = 0;
    while (i + gap < array.length) {
      moves.push({ indices: [i, i + gap], type: "compare" });
      if (array[i] > array[i + gap]) {
        [array[i], array[i + gap]] = [array[i + gap], array[i]];
        moves.push({ indices: [i, i + gap], type: "swap" });
        sorted = false;
      }
      i++;
    }
  }
  return moves;
}
// Sort the array using odd-Even Sort and display the sorting process visually

function oddEvenSort(array) {
  let sorted = false;
  let moves = [];
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < array.length - 1; i += 2) {
      moves.push({ indices: [i, i + 1], type: "compare" });
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        moves.push({ indices: [i, i + 1], type: "swap" });
        sorted = false;
      }
    }
    for (let i = 0; i < array.length - 1; i += 2) {
      moves.push({ indices: [i, i + 1], type: "compare" });
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        moves.push({ indices: [i, i + 1], type: "swap" });
        sorted = false;
      }
    }
  }
  return moves;
}
// Sort the array using shell Sort and display the sorting process visually

function shellSort(array) {
  //The implementation starts by calculating the gap,
  //which is initialized to half of the array length.
  //Then, it iterates over the array from the gap index to the end of the array, comparing and swapping elements using the gap value.
  //The while loop inside the for loop swaps the elements until the correct position is found. Finally, the gap is reduced by half,
  //and the process is repeated until the gap is 1.
  let moves = [];
  const n = array.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = array[i];
      let j = i;
      moves.push({ indices: [j - gap, i], type: "compare" });

      while (j >= gap && array[j - gap] > temp) {
        array[j] = array[j - gap];
        array[j - gap] = temp;
        moves.push({ indices: [j, j - gap], type: "swap" });

        j -= gap;
      }
      array[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return moves;
}

function animating(moves) {
  let speed = 600;
  if (moves.length == 0) {
    drawArray(array);
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;
  if (move.type === "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }
  drawArray(array, [move]);
  if (speedSlider.value == 1) speed = 400;
  else if (speedSlider.value == 2) speed = 100;
  else speed = 10;
  setTimeout(function () {
    animating(moves);
  }, speed);
}

// Bind the "randomize" button to generate a new random array
document.getElementById("randomize").addEventListener("click", () => {
  array = generateRandomArray(
    parseInt(document.getElementById("length").value)
  );
  drawArray(array);
});

// Bind the "solve" button to sort the current array using the selected algorithm
document.getElementById("solve").addEventListener("click", () => {
  const algorithm = document.getElementById("algorithm").value;
  switch (algorithm) {
    case "bubble":
      const copy1 = [...array];
      const move1 = bubbleSort(copy1);
      animating(move1);
      break;
    case "selection":
      const copy2 = [...array];
      const move2 = selectionSort(copy2);
      animating(move2);
      break;
    case "quick":
      const copy3 = [...array];
      const move3 = quickSort(copy3);
      animating(move3);
      break;
    case "insertion":
      const copy4 = [...array];
      const move4 = insertionSort(copy4);
      animating(move4);
      break;
    case "heap":
      const copy5 = [...array];
      const move5 = heapSort(copy5);
      animating(move5);
      break;
    case "gnome":
      const copy6 = [...array];
      const move6 = gnomeSort(copy6);
      animating(move6);
      break;
    case "comb":
      const copy7 = [...array];
      const move7 = combSort(copy7);
      animating(move7);
      break;
    case "oddEven":
      const copy8 = [...array];
      const move8 = oddEvenSort(copy8);
      animating(move8);
      break;
    case "shell":
      const copy9 = [...array];
      const move9 = shellSort(copy9);
      animating(move9);
      break;
  }
});
const algorithmSelect = document.getElementById("algorithm");
algorithmSelect.addEventListener("change", () => {
  const algorithm = algorithmSelect.value;
  const description = document.getElementById("description");
  // Clear previous description
  description.innerHTML = "";
  // Add new description based on selected algorithm
  switch (algorithm) {
    case "bubble":
      description.innerHTML =
        "<p>Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.</p>";
      break;
    case "selection":
      description.innerHTML =
        "<p>Selection sort repeatedly finds the minimum element from unsorted part of the array and puts it at the beginning.</p>";
      break;
    case "quick":
      description.innerHTML =
        '<p>Quick Sort is a divide-and-conquer algorithm that selects a "pivot" element and partitions the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.</p>';
      break;
    case "insertion":
      description.innerHTML =
        "<p>Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists.</p>";
      break;
    case "heap":
      description.innerHTML =
        "<p>Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It is not a stable sort, meaning that the relative order of equal sort items is not preserved.</p>";
      break;
    case "gnome":
      description.innerHTML =
        "<p>Gnome Sort is a sorting algorithm that is similar to insertion sort, but it is less efficient in practice. The algorithm finds the first place where two adjacent elements are in the wrong order and swaps them.</p>";
      break;
    case "comb":
      description.innerHTML =
        "<p>Comb Sort is a sorting algorithm that is repeatedly swapping adjacent elements that are out of order, using a gap between the elements that starts large and decreases over time. The algorithm stops when the gap is 1.</p>";
      break;
    case "oddEven":
      description.innerHTML =
        "<p>Odd Even Sort is a variation of the bubble sort algorithm that sorts pairs of adjacent elements with opposite parity. The algorithm first sorts all the even indexed elements and then all the odd indexed elements. It repeats this process until the array is completely sorted.</p>";
      break;
    case "shell":
      description.innerHTML =
        "<p> Shell Sort is sorting the array by first sorting elements far apart from each other, then progressively reducing the gap between the elements being compared.</p>";
      break;
    default:
      break;
  }
});
