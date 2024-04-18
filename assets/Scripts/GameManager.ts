import DotNode from "./DotNode";
import { NodeIndex } from "./NodeIndex";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {


    @property(cc.Prefab)
    NodePrefab: cc.Prefab = null;


    private rows = 6;
    private coloums = 6;

    private rowOffSet = 60;
    private coloumOffSet = 60;
    startCorner: cc.Vec3 = new cc.Vec3(-500, -5000, 0);

    activeDotNode: DotNode = null;

    nodeList: DotNode[] = [];

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnded, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancle, this)
        this.node.on("DisableNeighbours", this.reasetAllNeighbours, this)
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnded, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancle, this)
        this.node.off("DisableNeighbours", this.reasetAllNeighbours, this)
    }
    touchStart() {
        console.log("TouchStarted");
    }
    touchEnded() {
        console.log("TouchEnded");
    }
    touchCancle(TouchCancle: any) {
        this.nodeList.forEach(n => {
            n.node.emit('touchCancleEvent', TouchCancle, this.activeDotNode);
        });
    }

    start() {
        this.spawnMatrix();
    }
    spawnMatrix() {
        for (let i = this.coloums - 1; i >= 0; i--) {
            let pos = this.startCorner;
            pos.y = this.coloumOffSet * i - 100;
            for (let j = 0; j < this.rows; j++) {
                let node = cc.instantiate(this.NodePrefab)
                node.parent = this.node;
                let dotNode = node.getComponent(DotNode);

                this.addToNodeList(dotNode);

                dotNode.initialize(j, i, this.rows, this.coloums, this);
                pos.x = (this.rowOffSet * j) - 100;
                node.position = pos;
            }
            pos.x = this.startCorner.x;
        }
    }

    hightLightNeighbour(nebours: NodeIndex[], currentDotNode: DotNode) {
        const neighbors: DotNode[] = [];
        this.activeDotNode = currentDotNode;
        nebours.forEach(nebour => {
            neighbors.push(this.nodeList.filter((node) => node.index.x == nebour.x && node.index.y == nebour.y)[0])
        });

        neighbors.forEach(element => {
            element.activateHighlight();
        });
    }
    resetNeighbour(nodes: NodeIndex[]) {
        const neighbors: DotNode[] = [];
        nodes.forEach(element => {
            neighbors.push(this.nodeList.filter((node) => node.index.x == element.x && node.index.y == element.y)[0])
        });
        neighbors.forEach(element => {
            element.deactivateHighlight();
        });
        this.activeDotNode = null;
    }
    reasetAllNeighbours() {
        this.nodeList.forEach(element => {
            element.deactivateHighlight();
        });
    }

    private addToNodeList(dotNode: DotNode) {
        this.nodeList.push(dotNode);
    }
}



