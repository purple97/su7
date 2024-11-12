constructor(h, l) {
    super();
    if (l === void 0) {
        console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.');
        l = document;
    }
    this.isTransformControls = true;
    this.visible = false;
    this.domElement = l;
    this.domElement.style.touchAction = "none";
    const f = new X0();
    this._gizmo = f;
    this.add(f);
    const v = new km();
    this._plane = v;
    this.add(v);
    const x = this;
    function b(Oe, Ae) {
        let ke = Ae;
        Object.defineProperty(x, Oe, {
            get: function () {
                return ke !== void 0 ? ke : Ae;
            },
            set: function (lt) {
                if (ke !== lt) {
                    ke = lt;
                    v[Oe] = lt;
                    f[Oe] = lt;
                    x.dispatchEvent({ type: Oe + "-changed", value: lt });
                    x.dispatchEvent(Mu);
                }
            }
        });
        x[Oe] = Ae;
        v[Oe] = Ae;
        f[Oe] = Ae;
    }
    b("camera", h);
    b("object", void 0);
    b("enabled", true);
    b("axis", null);
    b("mode", "translate");
    b("translationSnap", null);
    b("rotationSnap", null);
    b("scaleSnap", null);
    b("space", "world");
    b("size", 1);
    b("dragging", false);
    b("showX", true);
    b("showY", true);
    b("showZ", true);
    const P = new G.Pa4();
    const I = new G.Pa4();
    const z = new G._fP();
    const Q = new G._fP();
    const H = new G.Pa4();
    const ee = new G._fP();
    const fe = new G.Pa4();
    const Se = new G.Pa4();
    const De = new G.Pa4();
    let Re = 0;
    const Te = new G.Pa4();
    b("worldPosition", P);
    b("worldPositionStart", I);
    b("worldQuaternion", z);
    b("worldQuaternionStart", Q);
    b("cameraPosition", H);
    b("cameraQuaternion", ee);
    b("pointStart", fe);
    b("pointEnd", Se);
    b("rotationAxis", De);
    b("rotationAngle", Re);
    b("eye", Te);
    this._offset = new G.Pa4();
    this._startNorm = new G.Pa4();
    this._endNorm = new G.Pa4();
    this._cameraScale = new G.Pa4();
    this._parentPosition = new G.Pa4();
    this._parentQuaternion = new G._fP();
    this._parentQuaternionInv = new G._fP();
    this._parentScale = new G.Pa4();
    this._worldScaleStart = new G.Pa4();
    this._worldQuaternionInv = new G._fP();
    this._worldScale = new G.Pa4();
    this._positionStart = new G.Pa4();
    this._quaternionStart = new G._fP();
    this._scaleStart = new G.Pa4();
    this._getPointer = ea.bind(this);
    this._onPointerDown = jh.bind(this);
    this._onPointerHover = yf.bind(this);
    this._onPointerMove = Fa.bind(this);
    this._onPointerUp = _f.bind(this);
    this.domElement.addEventListener("pointerdown", this._onPointerDown);
    this.domElement.addEventListener("pointermove", this._onPointerHover);
    this.domElement.addEventListener("pointerup", this._onPointerUp);
}