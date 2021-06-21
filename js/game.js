/* ----------------------- Element Variables -----------------------*/
const slots = document.getElementsByClassName('circle');
const resetBtn = document.getElementById('reset');
const playerBtns = document.getElementsByClassName('player-btn');

/* ----------------------- Other Variables -----------------------*/

let board = new Board(slots, playerBtns);

const numColumns = 7;
const numSlots = 42;

/* ----------------------- Event Handling -----------------------*/

resetBtn.addEventListener('click', () => board.reset());

for (let i = 0; i < board.length(); i++) {
    const slot = board.getSlot(i);

    // find index for last slot in current column
    let lastSlotNum = i;
    while ((lastSlotNum + numColumns) < numSlots) {
      lastSlotNum += numColumns;
    }

    // find index for first slot in current column
    let firstSlotNum = i;
    while ((firstSlotNum - numColumns) >= 0) {
      firstSlotNum -= numColumns;
    }

    // unbold border of slots of column on mouseout
    slot.addEventListener('mouseover', () => {
      board.boldColumn(lastSlotNum);
    });

    // unbold border of slots of column on mouseout
    slot.addEventListener('mouseout', () => {
      board.unboldColumn(lastSlotNum);
    });

    // add token to lowest slot when a slot in the column is clicked
    slot.addEventListener('click', () => {
      board.fillSlot(firstSlotNum, lastSlotNum)
    });
}
