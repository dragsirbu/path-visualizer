import Cell from './cell'

export default class DijkstraAlgorithm {
    start(cells, start, end) {
        console.log('Dijkstra Called')
        console.log(start, end)

        start.distance = 0

        const unvisited: Array<Cell> = []
        const visited: Array<Cell> = []

        for (const cell of cells) {
            unvisited.push(...cell)
        }

        while (unvisited.length > 0) {
            this.sortNodes(unvisited)
            const current = unvisited.shift()
            current.isVisited = true
            visited.push(current)
            if (current.row === end.row && current.col === end.col) {
                console.log('Finished')
                return visited
            }
            this.updateNeighbors(current, cells)
        }
    }

    updateReference(currentNode, original) {
        console.log(currentNode.row)
        setTimeout(() => {
            original[currentNode.row][currentNode.col] = currentNode
        }, 20)
    }

    sortNodes(nodes) {
        nodes.sort((a, b) => a.distance - b.distance)
    }

    updateNeighbors(current, cells) {
        let neighbors = this.getNeighbors(current, cells)
        for (let neighbor of neighbors) {
            neighbor.distance = current.distance + 1
            neighbor.previousCell = current
        }
    }

    getNeighbors(current, cells) {
        let neighbors: Array<Cell> = []
        if (current.row > 0) {
            neighbors.push(cells[current.row - 1][current.col])
        }
        if (current.col > 0) {
            neighbors.push(cells[current.row][current.col - 1])
        }
        if (current.row < cells.length - 1) {
            neighbors.push(cells[current.row + 1][current.col])
        }
        if (current.col < cells[0].length - 1) {
            neighbors.push(cells[current.row][current.col + 1])
        }
        neighbors = neighbors.filter(
            (neighbor) => !neighbor.isVisited && !neighbor.isWall
        )
        return neighbors
    }

    getCellsInShortestPathOrder(finish) {
        const cellsInShortestPathOrder = []
        let current = finish
        while (current !== null) {
            cellsInShortestPathOrder.unshift(current)
            current = current.previousCell
        }
        return cellsInShortestPathOrder
    }
}
