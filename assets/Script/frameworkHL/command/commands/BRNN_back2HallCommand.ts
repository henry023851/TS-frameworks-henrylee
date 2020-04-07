import ICommand from "../../interface/ICommand";

export default class BRNN_back2HallCommand implements ICommand {

    private hasInit: Boolean = false;

    public constructor() {

    }

    init(): void {
        this.hasInit = true;
    }

    execute(...param: any[]): Boolean {
        if (!this.hasInit) return false;

        return true;
    }

    destroy() {
        this.hasInit = false;
    }

}