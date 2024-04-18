// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    Player: cc.Node = null;

    input: cc.Vec2 = new cc.Vec2();

    speed: number = 0.1;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.Player = this.node;
    }
    onKeyDown(event: KeyboardEvent) {
        // console.log(event.location);

        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.MovePlayerHorizontally(1);
                break;
            case cc.macro.KEY.d:
                this.MovePlayerHorizontally(-1);
                break;
            case cc.macro.KEY.w:
                this.MovePlayerVertically(-1);
                break;
            case cc.macro.KEY.s:
                this.MovePlayerVertically(1);
                break;

            default:
                break;
        }

    }
    MovePlayerHorizontally(dir: number) {
        this.Player.anchorX += this.speed * dir;
    }
    MovePlayerVertically(dir: number) {
        this.Player.anchorY += this.speed * dir;
    }
    onKeyUp() {

    }
    start() {
        this.TweenSequence();
    }
    TweenSequence() {
        cc.tween(this.node)
            // .to(1, { position: cc.v3(100, 100), rotation: 360 })
            .delay(3)
            .by(1,{rotation: 60})
            .by(1, { scale: 0.1 })
            .start()
        
        setTimeout(() => {
            this.TweenSequence();
        }, 4000);
    }
    protected onDestroy(): void {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt) { }
}
