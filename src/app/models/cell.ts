import Point from './point'

export default class Cell {
    public isVisited: boolean
    public isWall: boolean
    public isStart: boolean
    public isEnd: boolean
    public row: number
    public col: number
    public distance: number = 0
    public previousCell
    public inPath = false

    constructor(
        row,
        col,
        visited = false,
        wall = false,
        startNode: Point = null,
        endNode: Point = null
    ) {
        this.row = row
        this.col = col
        this.isVisited = visited
        this.isWall = wall
        this.isStart = this.matches(startNode, { row, col })
        this.isEnd = this.matches(endNode, { row, col })
        this.distance = 9999999
        this.previousCell = null
    }

    // checks if both the points are same or not
    matches(point1, point2) {
        if (point1 == null) {
            return false
        }
        if (point1.row === point2.row && point1.col === point2.col) {
            return true
        }
        return false
    }

    markAsVisited() {
        this.isVisited = true
    }

    reset() {
        this.isVisited = false
        this.isWall = false
        this.previousCell = null
        this.inPath = false
        this.isStart = false
        this.isEnd = false
        this.distance = 9999999
    }
}
