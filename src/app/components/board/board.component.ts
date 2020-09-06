import {
    Component,
    OnInit,
    ViewChildren,
    QueryList,
    ChangeDetectorRef,
} from '@angular/core'
import Cell from 'src/app/models/cell'
import Point from 'src/app/models/point'
import { MessageService } from 'src/app/services/message.service'
import { CellComponent } from '../cell/cell.component'
import DijkstraAlgorithm from 'src/app/models/dijkstra'

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
    rows: number = 15
    cols: number = 30
    html: string = ''
    isClicked: boolean = false

    // avalilableAlgos: Array<Algorithm> = [
    //     { name: 'Djikstra', isSelected: true },
    //     { name: 'A*', isSelected: false },
    // ]

    // actions: Array<Action> = [
    //     {
    //         name: 'Start',
    //         action: () => {
    //             this.start()
    //         },
    //     },
    //     {
    //         name: 'Reset',
    //         action: () => {
    //             this.Reset()
    //         },
    //     },
    // ]

    cells: Array<Array<Cell>> = []

    startCell: Point = { row: 10, col: 14 }
    endCell: Point = { row: 8, col: 25 }

    @ViewChildren('cell') myComponents: QueryList<CellComponent>

    constructor(
        private ref: ChangeDetectorRef,
        private messageService: MessageService
    ) {}

    initializeStartEndNodes() {
        let stCell: Cell = this.getCell(this.startCell)
        stCell.isStart = true
        this.startCell = stCell
        let enCell = this.getCell(this.endCell)
        enCell.isEnd = true
        this.endCell = enCell
    }

    ngOnInit() {
        this.createCells()
        this.initializeStartEndNodes()
    }

    /**
     * The user has released the mouse button.
     * @param event Event Object
     */
    mouseUp(event: Event) {
        this.messageService.MouseRelease()
        event.preventDefault()
        event.stopPropagation()
    }

    /**
     * The user has clicked on the board
     * @param event Event Object
     */
    mouseDown(event: Event) {
        this.messageService.MouseClicked()
        event.preventDefault()
        event.stopPropagation()
    }

    getCell(point): Cell {
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.row === point.row && cell.col === point.col) {
                    return cell
                }
            }
        }
    }

    /**
     * Creates Nodes for each grid row and cols
     */
    createCells() {
        for (let i = 0; i < this.rows; i++) {
            const cols: Array<Cell> = []
            for (let j = 0; j < this.cols; j++) {
                cols.push(
                    new Cell(i, j, false, false, this.startCell, this.endCell)
                )
            }
            this.cells.push(cols)
        }
    }

    /**
     * CORE Of the component
     * this is the main part it runs the selected algorithm on the nodes currently only
     * works for djikstra wthis function will evolve as application evolves.
     * Currently it does following things
     * 1. Run the algo and obtain the final result which will be a set of nodes that will be visited.
     * 2. Once we have obtained the nodes which need to be modified we go through all the node components
     * which we have stored in the mycomponents and run the change detector on them. We also use setTimeout function
     * so to create a aesthetic effect.
     * 3. Then we iterate over again and try to contruct the path by looking at the previousNode Property. We use set
     * timeout to animate this also.
     */
    startVisualizing() {
        // this.RunChangeDetector();

        //initialize the algorithm
        const dijkstra = new DijkstraAlgorithm();

        //run algorithm and get visited nodes
        const visitedCells = dijkstra.start(this.cells, this.startCell, this.endCell)

        //run change detection to create animated effect
        for (let i = 0; i < visitedCells.length; i++) {
            this.myComponents.forEach((cmp: CellComponent) => {
                if (cmp.cell == visitedCells[i]) {
                    setTimeout(() => {
                        cmp.runChangeDetector()
                    }, 1000 * i)
                }
            })
        }

        let lastCell = visitedCells[visitedCells.length - 1]
        while (lastCell != null) {
            lastCell.inPath = true
            lastCell = lastCell.previousCell
        }

        let totalTime = 5 * (visitedCells.length - 1)

        //update the nodes to reflect the shortest path
        setTimeout(() => {
            let i = 0
            this.myComponents.forEach((cmp: CellComponent) => {
                setTimeout(() => {
                    cmp.runChangeDetector()
                }, i * 1000)
                i += 1
            })
        }, totalTime)
    }

    /**
     * Resets the Board and restore it to its inital position;
     */
    resetBoard() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.cells[i][j].reset()
            }
        }
        this.initializeStartEndNodes()

        let newCells = []
        for (let i = 0; i < this.rows; i++) {
            newCells.push([...this.cells[i]])
        }
        delete this.cells
        this.cells = newCells

        //run change detector to update the nodes
        this.runChangeDetector()
    }

    //runs the change detection over all the node components to update them.
    //or on a given index.
    runChangeDetector(type = 'all', index?) {
        if (type == 'all') {
            console.log('her')
            let toRun = []
            this.myComponents.forEach((cmp: CellComponent) => {
                toRun.push(cmp.runChangeDetector())
            })
            Promise.all(toRun)
        }
    }
}
