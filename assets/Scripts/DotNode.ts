import GameManager from "./GameManager";
import { NodeIndex } from "./NodeIndex";

const { ccclass, property } = cc._decorator;

enum DotNodeState {
    active = 0,
    connected = 1,
}
@ccclass
export default class DotNode extends cc.Component {


    @property(cc.Graphics)
    LineRendererBlue: cc.Graphics = null;

    @property(cc.Graphics)
    LineRendererGray: cc.Graphics = null;


    @property(cc.Node)
    HightLight: cc.Node = null;

    index: NodeIndex = null;

    maxRow: number = 0;
    maxCol: number = 0;

    gameManager: GameManager;

    connectedTo: DotNode[] = [];

    currentState: DotNodeState = DotNodeState.active;

    initialize(x: number, y: number, maxRow: number, maxCol: number, gameManager) {
        this.index = new NodeIndex(x, y);
        this.maxCol = maxCol;
        this.maxRow = maxRow;
        this.gameManager = gameManager;
        this.node.on("touchCancleEvent", this.touchCancle, this)
    }
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnded, this)
        this.HightLight.active = false;
    }
    touchMoved(TouchMove: any) {
        if (this.isConnectedToAllNeighbours()) {
            return;
        }
        var touchPoint = TouchMove.getLocation();

        // Convert touch point to node space if needed
        var touchPointInNodeSpace = this.node.convertToNodeSpaceAR(touchPoint);

        this.LineRendererBlue.clear(true);
        this.LineRendererBlue.lineWidth = 8;
        this.LineRendererBlue.strokeColor = cc.Color.CYAN;
        this.LineRendererBlue.moveTo(0, 0);
        this.LineRendererBlue.lineTo(touchPointInNodeSpace.x, touchPointInNodeSpace.y);
        this.LineRendererBlue.stroke();
    }
    touchStart(TouchStart: any) {
        if (this.isConnectedToAllNeighbours()) {
            return;
        }
        this.gameManager.hightLightNeighbour(this.getNeabours(), this)
    }
    touchEnded(TouchEnd: any) {
        this.gameManager.resetNeighbour(this.getNeabours())
    }
    touchCancle(TouchCancle: any, activeNode: DotNode) {

        this.LineRendererBlue.clear(true);
        if (this.HightLight.getBoundingBoxToWorld().contains(TouchCancle.getLocation())) {
            // Should be a neighbour and should't be already connected.
            if (this.isNeighbour(activeNode.index) && !this.alreadyConnectedTo(activeNode)) {

                this.LineRendererBlue.clear(true);
                this.createLineSegment(activeNode.node, this.node);

                this.connectedTo.push(activeNode);
                activeNode.connectedTo.push(this);

                this.currentState = DotNodeState.connected;
                this.connectedTo.length
                console.log("Connected " + activeNode.connectedTo.length);

            }
        }
        this.gameManager.node.emit('DisableNeighbours');

    }
    createLineSegment(from: cc.Node, to: cc.Node) {
        // this.LineRenderer.clear(true);
        this.LineRendererGray.lineWidth = 10;
        this.LineRendererGray.strokeColor = cc.Color.GRAY;
        this.LineRendererGray.moveTo(0, 0);
        let pos = from.convertToWorldSpaceAR(cc.Vec2.ZERO)
        let localPos = this.node.convertToNodeSpaceAR(pos);
        this.LineRendererGray.lineTo(localPos.x, localPos.y);
        this.LineRendererGray.stroke();

        this.LineRendererBlue.clear();
    }
    getNeabours(): NodeIndex[] {
        const neighbors: NodeIndex[] = [];

        let row = this.index.x
        let col = this.index.y

        if (row > 0) {
            neighbors.push(new NodeIndex(row - 1, col));
        }

        if (row < this.maxRow - 1) {
            neighbors.push(new NodeIndex(row + 1, col));
        }

        if (col > 0) {
            neighbors.push(new NodeIndex(row, col - 1));
        }

        if (col < this.maxCol - 1) {
            neighbors.push(new NodeIndex(row, col + 1));
        }

        return neighbors;
    }
    isNeighbour(neighbour: NodeIndex): boolean {

        return (this.getNeabours().filter((index) => index.x === neighbour.x && index.y === neighbour.y).length > 0);
    }

    alreadyConnectedTo(neighbor: DotNode): boolean {
        let array = this.connectedTo;
        return array.filter((element) => element.index.x === neighbor.index.x && element.index.y === neighbor.index.y).length > 0;
    }

    isConnectedToAllNeighbours(): boolean {
        return (this.getNeabours().length === this.connectedTo.length);
    }
    activateHighlight() {
        this.HightLight.active = true;
    }
    deactivateHighlight() {
        this.HightLight.active = false;
    }
    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnded, this)
        this.node.off("touchCancleEvent", this.touchCancle, this)
    }
}

