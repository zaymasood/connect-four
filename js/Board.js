class Board {
  constructor() {
    this.slots = document.getElementsByClassName('slot');
    this.currentWin = false;
  }

  // returns slot at index i
  getSlot(i) {
    return this.slots[i];
  }

  // returns board's length
  length() {
    return this.slots.length;
  }

  get _currentWin() {
    return this._currentWin;
  }

  set _currentWin(bool) {
    this._currentWin = bool;
  }

  // clears all filled slots
  reset(color1, color2) {
    for (let i = 0; i < this.length(); i++) {
        let slot = this.getSlot(i);
        slot.classList.remove(color1);
        slot.classList.remove(color2);
        slot.classList.remove('filled');
    }
  }

  // determines if selected slot is filled.
  slotFilled(slot) {
    return slot.classList.contains('filled');
  }

  // bold border of slots in column
  boldColumn(lastSlotNum) {
    for (let i = lastSlotNum; i >= 0; i -= 7) {
      this.getSlot(i).style.border = '4px solid black';
    }
  }

  // unbold border of slots in column
  unboldColumn(lastSlotNum) {
    for (let i = lastSlotNum; i >= 0; i -= 7) {
      this.getSlot(i).style.border = '2px solid black';
    }
  }

  // finds the lowest slot in a column that has not been filled and fill it
  fillSlot(firstSlotNum, lastSlotNum, color) {
    if (this.currentWin) {
      return false;
    }

    for (let i = firstSlotNum; i <= lastSlotNum; i += numColumns) {
      let slot = this.getSlot(i);

      if (this.slotFilled(this.getSlot(firstSlotNum))) {
        return false;
      }

      if (!this.slotFilled(slot)) {
        slot.classList.add(color);
        slot.classList.remove(color);
      } else {
        if (i - numColumns >= 0) {
          let prevSlot = this.getSlot(i - numColumns);
          prevSlot.classList.add(color);
          prevSlot.classList.add('filled');
          return true;
        }
        return false;
      }

      // if it's the last row and its empty, u want to fill the slot
      if (i === lastSlotNum && !this.slotFilled(slot)) {
        slot.classList.add(color);
        slot.classList.add('filled');
        return true;
      }
    }
    return false;
  }

  // get all slots of given color
  getSlots(color) {
    return document.getElementsByClassName(color);
  }

  // get row
  getRow(slot) {
    return parseInt(slot.parentNode.dataset.row, 10);
  }

  // get col
  getCol(slot) {
    return parseInt(slot.dataset.col, 10);
  }

  // find filled columns in each row that has a filled slot for given color
  createRowMap(colorSlots) {
    let rowMap = {};
    // keys in the row map are rows and values are columns in that rows
    // that are filled
    for (let i = 0; i < colorSlots.length; i++) {
      let slot = colorSlots[i];
      let row = this.getRow(slot);

      if (!rowMap[row]) {
        rowMap[row] = [this.getCol(slot)];
      } else {
        rowMap[row].push(this.getCol(slot));
      }
    }
    return rowMap;
  }

  // check horizontal wins for given color
  checkHorizontalWin(color) {
    let colorSlots = this.getSlots(color);
    let rowMap = this.createRowMap(colorSlots);
    for (const key in rowMap) {
      const value = rowMap[key];
      value.sort();
      // if there aren't at least 4 filled slots in this row, there isn't a row-based win
      if (value.length > 3) {
        for (let i = 0; i < value.length - 3; i++) {
          // look through slots in chunks of 4
          let arr = value.slice(i, i + 4);
          // check that the 4 slots are next to each other
          let num = arr[3];
          if ((arr[0] + 3 === num) && (arr[1] + 2 === num) && (arr[2] + 1 === num)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // check vertical wins for given color
  checkVerticalWin(color) {
    for (let i = this.length() - 1; i >= 0; i -= 7) {
      for (let j = i; j > i - 7; j--) {
        let count = 0;
        let slot = board.getSlot(j);

        if (this.slotFilled(slot) && slot.classList.contains(color)) {
          count++;
          for (let k = j - 7; k >= 0; k -= 7) {
            slot = board.getSlot(k);
            if (this.slotFilled(slot) && slot.classList.contains(color)) {
              count++;
            } else {
              break;
            }
            if (count == 4) {
              return true;
            }
          }
          count = 0;
        }
      }
    }
    return false;
  }

  // check diagonal wins for given color
  checkDiagonalWin(color) {
    const numColumns = 7;

    // check the bottom 3 rows
    let i = this.length() - 1;
    for (let z = 0; z < 3; z++) {
      // check right four cols for a win going diagonally up and left
      for (let j = i; j > i - 4; j--) {
        let count = 0;
        let slot = board.getSlot(j);

        if (this.slotFilled(slot) && slot.classList.contains(color)) {
          count++;

          let k = j - numColumns - 1;

          while(slot.dataset.col >= 0) {
            slot = board.getSlot(k);
            if (this.slotFilled(slot) && slot.classList.contains(color)) {
              count++;
            } else {
              break;
            }
            if (count == 4) {
              return true;
            }
            k = k - numColumns - 1;
            slot = board.getSlot(k);
          }
          count = 0;
        }
      }

      // check left four cols for a win going diagonally up and right
      for (let j = i - 3; j > i - numColumns; j--) {
        let count = 0;
        let slot = board.getSlot(j);

        if (this.slotFilled(slot) && slot.classList.contains(color)) {
          count++;
          let k = j - numColumns + 1;
          slot = board.getSlot(k);
          while(slot.dataset.col >= 0) {
            slot = board.getSlot(k);
            if (this.slotFilled(slot) && slot.classList.contains(color)) {
              count++;
            } else {
              break;
            }
            if (count == 4) {
              return true;
            }
            k = k - numColumns + 1;
          }
          count = 0;
        }
      }
      i -= numColumns;
    }
    return false;
  }

  // check to see if there is a win anywhere on the board
  checkWin(color1, color2) {

    if (this.checkHorizontalWin(color1)) {
      this.currentWin = true;
      return color1;
    }

    if (this.checkHorizontalWin(color2)) {
      this.currentWin = true;
      return color2;
    }

    if (this.checkVerticalWin(color1)) {
      this.currentWin = true;
      return color1;
    }

    if (this.checkVerticalWin(color2)) {
      this.currentWin = true;
      return color2;
    }

    if (this.checkDiagonalWin(color1)) {
      this.currentWin = true;
      return color1;
    }

    if (this.checkDiagonalWin(color2)) {
      this.currentWin = true;
      return color2;
    }

    return false;
  }
}
