import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import Cell from 'src/app/models/cell'
import { MessageService } from 'src/app/services/message.service'

@Component({
    selector: 'app-cell',
    templateUrl: './cell.component.html',
    styleUrls: ['./cell.component.scss'],
})
export class CellComponent implements OnInit {
    @Input('cell') cell: Cell
    @Input('isClicked') isClicked: boolean
    @Output('dropped') dropped: EventEmitter<any> = new EventEmitter<any>()

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        this.messageService.messages$.subscribe(
            (message: Node) => {
                console.log('M', message)
            },
            (err) => {
                console.log(err)
            }
        )
    }

    MouseUp(event: Event) {
        console.log(event)
        try {
            var data = (event as any).dataTransfer.getData('text')
            console.log(data, (event as any).data)
            this.dropped.emit({
                previousNode: JSON.parse(data),
                newNode: this.cell,
            })
        } catch (err) {
            console.error(err)
        }
    }

    MouseDown(event: Event) {
        if (this.cell.isStart || this.cell.isEnd) {
            this.messageService.MouseRelease()
            event.stopPropagation()

            return
        }
        this.cell.isWall = !this.cell.isWall
    }

    CreateWall(event) {
        console.log('inside', this.isClicked)
        if (
            this.messageService.GetMouseClicked() == true &&
            !this.cell.isEnd &&
            !this.cell.isStart
        ) {
            this.cell.isWall = !this.cell.isWall
        }
    }

    DragCancel(event: Event) {
        event.preventDefault()
    }

    DragStart(event) {
        event.dataTransfer.setData('text/plain', JSON.stringify(this.node))
        event.data = this.cell
    }
}
