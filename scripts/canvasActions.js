/** Item containing all information regarding a canvas action. */
class HistoryItem {
    /**
     * Create a HistoryItem
     * @param {Object} bounds 
     * @param {*} type 
     * @param {Image|string} image 
     */
    constructor(bounds, type, image) {
        this.bounds = bounds;
        this.type = type;
        this.image = new window.Image();
        this.image.src = typeof image == 'string' ? image : image.src;
    }
}

/**
 * Encapsulates all data and methods concerning the undo and redo actions of the canvas.
 * @property {HistoryItem[]} history - Previous actions
 * @property {HistoryItem[]} future - Undone actions, used for redo
 */
class Revertible {
    history = [];
    future = [];
    constructor() { }

    get lastHistoryItem() {
        return this.history[this.history.length - 1];
    }

    addToHistory(bounds, type, image) {
        const item = new HistoryItem(bounds, type, image);
        this.history.push(item);
    }

    /**
     * Undoes the last action, action is moved to the {@link Revertible.future}
     * @return {HistoryItem} last item in history
     */
    undo() {
        const item = this.history.pop();
        if (item)
            this.future.push(item);

        return this.lastHistoryItem;
    }

    /**
     * Redoes the last action retrieved from {@link Revertible.future}, this action is added to the end of the {@link Revertible.history}
     * @return {HistoryItem} last item in history
     */
    redo() {
        const item = this.future.pop();
        if (item && item.type == "background")
            this.history = [];
        if (item)
            this.history.push(item);

        return this.lastHistoryItem;
    }

    /**
     * Resets the history and future. IMPORTANT, all bounding boxes will be lost!
     */
    reset() {
        this.history = [];
        this.future = [];
    }
}