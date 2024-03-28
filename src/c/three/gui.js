import GUI from 'lil-gui'

class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

class CreateGUI extends GUI {
    constructor(...args) {
        super(...args)
    }
    addColor(...args) {
        if (typeof args[0] === 'object' && args[0][args[1]]) {
            return super.addColor(new ColorGUIHelper(...args), 'value')
        }
        return super.addColor(...args)
    }
}



export default CreateGUI