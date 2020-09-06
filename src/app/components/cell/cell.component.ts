import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core'
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

    constructor(
        private messageService: MessageService,
        private ref: ChangeDetectorRef
    ) {}

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

    ngOnChanges(changes) {
        console.log('changes ', changes)
    }

    runChangeDetector() {
        this.ref.markForCheck()
    }

    mouseUp(event: Event) {
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

    mouseDown(event: Event) {
        if (this.cell.isStart || this.cell.isEnd) {
            this.messageService.MouseRelease()
            event.stopPropagation()

            return
        }
        this.cell.isWall = !this.cell.isWall
    }

    createWall(event) {
        console.log('inside', this.isClicked)
        if (
            this.messageService.GetMouseClicked() == true &&
            !this.cell.isEnd &&
            !this.cell.isStart
        ) {
            this.cell.isWall = !this.cell.isWall
        }
    }

    dragCancel(event: Event) {
        event.preventDefault()
    }

    dragStart(event) {
        event.dataTransfer.setData('text/plain', JSON.stringify(this.cell))
        event.data = this.cell
    }
}
