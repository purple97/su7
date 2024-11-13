/* 
以上为React框架基础代码, ./module1.js
*/
/* ======================================================================================================================================================================== */

/* 
以上  module2.js 内容
======================================================================================================================================================================== 
*/

/* 
以上 module3.js 内容
======================================================================================================================================================================== 
*/

class dw extends xa {
	constructor(r) {
		super();
		B(this, "_envRT");
		B(this, "_mixMaterial");
		B(this, "_pmremGenerator");
		B(this, "_needsUpdate", !0);
		this._init = () => {
			const o = r.envMap0
				, p = r.envMap1;
			this._mixMaterial = new go({
				vertexShader: Ok,
				fragmentShader: Fk,
				uniforms: {
					tEnv0: {
						value: o
					},
					tEnv1: {
						value: p
					},
					intensity: {
						value: 1
					},
					weight: {
						value: 0
					}
				}
			});
			const y = o.source.data;
			this._envRT = new WP(y.width, y.height, {
				magFilter: tE,
				minFilter: tE,
				generateMipmaps: !1,
				type: jB,
				format: VP,
				encoding: bd,
				depthBuffer: !1
			}),
				this._envRT.texture.mapping = zB
		}
	}
	get intensity() {
		return this._mixMaterial.uniforms.intensity.value
	}
	set intensity(r) {
		this._mixMaterial.uniforms.intensity.value !== r && (this._mixMaterial.uniforms.intensity.value = r,
			this._needsUpdate = !0)
	}
	get weight() {
		return this._mixMaterial.uniforms.weight.value
	}
	set weight(r) {
		this._mixMaterial.uniforms.weight.value !== r && (this._mixMaterial.uniforms.weight.value = r,
			this._needsUpdate = !0)
	}
	get envMap() {
		return this._envRT.texture
	}
	onLoad() {
		this._init && this._init()
	}
	update() {
		this._needsUpdate && (this._needsUpdate = !1,
			UB(this.viewer.renderer, this._envRT, this._mixMaterial))
	}
	onDestroy() {
		var r;
		this._envRT.dispose(),
			this._mixMaterial.dispose(),
			(r = this._pmremGenerator) == null || r.dispose()
	}
}
XP([tl({
	min: 0,
	max: 1,
	step: .01
})], dw.prototype, "intensity", 1);
XP([tl({
	min: 0,
	max: 1,
	step: .01
})], dw.prototype, "weight", 1);
var tb = (t => (t[t.dark = 0] = "dark",
	t[t.night = 1] = "night",
	t[t.light = 2] = "light",
	t))(tb || {});

class Bk extends xa {
	constructor(r, o) {
		super();
		B(this, "_dynamicEnv");
		this.onLoad = () => {
			this._dynamicEnv = this.viewer.addNode(new dw({
				envMap0: r,
				envMap1: o
			})),
				this._dynamicEnv.intensity = 0,
				this._dynamicEnv.weight = 0,
				this.viewer.scene.environment = this._dynamicEnv.envMap
		}
	}
	setState(r, o = 1, p = qt.Easing.Cubic.InOut, y = 1) {
		switch (r) {
			case 0:
				qt.TweenManager.KillTweensOf(this._dynamicEnv),
					qt.TweenManager.Tween(this._dynamicEnv).to({
						intensity: 0,
						weight: 0
					}, o).easing(p).start();
				break;
			case 1:
				qt.TweenManager.KillTweensOf(this._dynamicEnv),
					qt.TweenManager.Tween(this._dynamicEnv).to({
						intensity: y,
						weight: 0
					}, o).easing(p).start();
				break;
			case 2:
				qt.TweenManager.KillTweensOf(this._dynamicEnv),
					qt.TweenManager.Tween(this._dynamicEnv).to({
						intensity: y,
						weight: 1
					}, o).easing(p).start();
				break
		}
	}
}
const dE = new bi("#000000")
	, kk = new bi("#000000")
	, Uk = new bi("#ffffff");

class Nk extends xa {
	constructor(r) {
		super();
		B(this, "_lightMaterial");
		B(this, "_lightValue", 0);
		this.onLoad = () => {
			this._lightMaterial = r.meshData.materials.Car_ight,
				this._lightMaterial.toneMapped = !1,
				this._lightMaterial.aoMapIntensity = 0,
				this._lightMaterial.color = dE,
				this._lightMaterial.needsUpdate = !0
		}
	}
	set lightValue(r) {
		this._lightValue = r,
			dE.copy(kk).lerp(Uk, r)
	}
	get lightValue() {
		return this._lightValue
	}
}

class zk extends xa {
	constructor(r) {
		super();
		B(this, "_lightMaterial");
		this.onLoad = () => {
			this._lightMaterial = r.meshData.materials.light,
				this._lightMaterial.emissive.setRGB(0, 0, 0),
				this._lightMaterial.transparent = !0,
				this._lightMaterial.depthWrite = !1,
				this._lightMaterial.needsUpdate = !0,
				this.opacity = 1
		}
	}
	get lightEmissiveIntensity() {
		return this._lightMaterial.emissiveIntensity
	}
	set lightEmissiveIntensity(r) {
		this._lightMaterial.emissiveIntensity = r
	}
	get lightEmissiveColor() {
		return this._lightMaterial.emissive
	}
	set lightEmissiveColor(r) {
		this._lightMaterial.emissive.copy(r)
	}
	get opacity() {
		return this._lightMaterial.opacity
	}
	set opacity(r) {
		this._lightMaterial.opacity = r
	}
}

class Gk extends xa {
	onEnable() {
		this.viewer.on(us.POINTER_DOWN, this._onPointerDown, this),
			this.viewer.on(us.POINTER_UP, this._onPointerUp, this)
	}
	onDisable() {
		this.viewer.off(us.POINTER_DOWN, this._onPointerDown, this),
			this.viewer.off(us.POINTER_UP, this._onPointerUp, this)
	}
	_onPointerDown() {
		Ct.emit(Ct.CLICKEFFECT, !0)
	}
	_onPointerUp() {
		Ct.emit(Ct.CLICKEFFECT, !1)
	}
}
const fE = new Yn;

class Hk extends xa {
	constructor(r, o) {
		super();
		B(this, "_wheels");
		B(this, "_targetVelocity", 0);
		B(this, "_currentVelocity", 0);
		B(this, "_lerpStrength", 1);
		B(this, "_springCameraOB");
		this.onLoad = () => {
			const p = r.children[0].children.find(y => y.name == "Wheel");
			this._wheels = p,
				this._springCameraOB = o
		}
	}
	set targetVelocity(r) {
		this._targetVelocity = r
	}
	set lerpStrength(r) {
		this._lerpStrength = r
	}
	update(r) {
		this._currentVelocity = Fl(this._currentVelocity, this._targetVelocity, r * this._lerpStrength);
		for (const p of this._wheels.children)
			p.rotateZ(-this._currentVelocity * r / (Math.PI * .737774) * 2 * Math.PI);
		Ne.u_floorUVOffset.value.x += this._currentVelocity * r;
		let o = Ne.u_speedUpBackgroundValue.value;
		Ct.currentShowingState == Sn.State1 ? o = Fl(o, this._currentVelocity, r * 2) : o = Fl(o, 0, r * 5),
			Ne.u_speedUpBackgroundValue.value = o,
			fE.set(1, 1, 1).multiplyScalar(o / 5),
			this._springCameraOB._springCamera.positionScale.copy(fE),
			o < .1 ? Ne.sm_speedup.visible = !1 : Ne.sm_speedup.visible = !0
	}
}

class _h extends xa {
	constructor() {
		super(...arguments);
		B(this, "controller", null)
	}
	show(r = 1, o = 0) {
		qt.TweenManager.KillTweensOf(this.controller),
			qt.TweenManager.Tween(this.controller).delay(o).to({
				visibility: 1
			}, r).easing(qt.Easing.Cubic.InOut).start()
	}
	hide(r = 1, o = 0) {
		qt.TweenManager.KillTweensOf(this.controller),
			qt.TweenManager.Tween(this.controller).delay(o).to({
				visibility: 0
			}, r).easing(qt.Easing.Cubic.InOut).start()
	}
}

class Vk extends _h {
	onLoad() {
		const { materials: i } = Ne.sm_size.meshData;
		this.viewer.addNode(Ne.sm_size),
			this.controller = new Proxy({
				visibility: 1
			}, {
				set: (r, o, p) => (r[o] = p,
					p >= .005 ? Ne.sm_size.visible = !0 : Ne.sm_size.visible = !1,
					Object.values(i).forEach(y => {
						y.opacity = p,
							y instanceof go && (y.uniforms.opacity.value = p)
					}
					),
					!0)
			}),
			this.controller.visibility = 0
	}
}

class Wk extends _h {
	onLoad() {
		const { materials: i } = Ne.sm_curvature.meshData;
		this.viewer.addNode(Ne.sm_curvature),
			this.controller = new Proxy({
				visibility: 1
			}, {
				set: (r, o, p) => (r[o] = p,
					p >= .005 ? Ne.sm_curvature.visible = !0 : Ne.sm_curvature.visible = !1,
					Object.values(i).forEach(y => {
						y.opacity = p,
							y instanceof go && (y.uniforms.opacity.value = p)
					}
					),
					!0)
			}),
			this.controller.visibility = 0
	}
}

class jk extends _h {
	onLoad() {
		const { materials: i } = Ne.sm_windspeed.meshData;
		this.viewer.addNode(Ne.sm_windspeed),
			this.controller = new Proxy({
				visibility: 1
			}, {
				set: (r, o, p) => (r[o] = p,
					p >= .005 ? Ne.sm_windspeed.visible = !0 : Ne.sm_windspeed.visible = !1,
					Object.values(i).forEach(y => {
						y.opacity = p,
							y instanceof go && (y.uniforms.opacity.value = p)
					}
					),
					!0)
			}),
			this.controller.visibility = 0
	}
}

class Xk extends _h {
	onLoad() {
		const { materials: i } = Ne.sm_linecar.meshData;
		this.viewer.addNode(Ne.sm_linecar),
			this.controller = new Proxy({
				visibility: 1
			}, {
				set: (r, o, p) => (r[o] = p,
					p >= .005 ? Ne.sm_linecar.visible = !0 : Ne.sm_linecar.visible = !1,
					Object.values(i).forEach(y => {
						Ne.u_car_discard.value = 1 - p,
							y.opacity = p,
							y instanceof go && (y.uniforms.opacity.value = p)
					}
					),
					!0)
			}),
			this.controller.visibility = 0
	}
}

class Yk extends _h {
	onLoad() {
		const { materials: i } = Ne.sm_carradar.meshData;
		this.viewer.addNode(Ne.sm_carradar),
			this.controller = new Proxy({
				visibility: 1
			}, {
				set: (r, o, p) => (r[o] = p,
					Ne.u_floor_typeSwitch.value = p,
					p >= .005 ? Ne.sm_carradar.visible = !0 : Ne.sm_carradar.visible = !1,
					Object.values(i).forEach(y => {
						y.opacity = p,
							y instanceof go && (y.uniforms.opacity.value = p)
					}
					),
					!0)
			}),
			this.controller.visibility = 0
	}
}

class Qk extends _h {
	constructor() {
		super(...arguments);
		B(this, "_length", 17);
		B(this, "_car1");
		B(this, "_car2");
		B(this, "_moveParams1", new Yn);
		B(this, "_moveParams2", new Yn)
	}
	onLoad() {
		this._car1 = Ne.sm_simpleCar.children[0],
			this._car2 = this._car1.clone(),
			Ne.sm_simpleCar.add(this._car2),
			this.viewer.addNode(Ne.sm_simpleCar),
			this.controller = new Proxy({
				visibility: 1
			}, {
				set: (r, o, p) => (r[o] = p,
					p >= .005 ? Ne.sm_simpleCar.visible = !0 : Ne.sm_simpleCar.visible = !1,
					u0.opacity = p,
					!0)
			}),
			this.controller.visibility = 0,
			this.randomUpdate(this._moveParams1, this._car1),
			this.randomUpdate(this._moveParams2, this._car2)
	}
	randomUpdate(r, o) {
		r.x = Math.random() > .5 ? -1 : 1,
			r.y = Math.random() * 3 + 2.5,
			r.z = Math.random() * 2 + 1,
			o.position.x = this._length * -r.x
	}
	update(r) {
		if (this._car1 && this._car2) {
			const o = this._car1.position;
			o.set(o.x + r * this._moveParams1.z * this._moveParams1.x, o.y, this._moveParams1.y),
				Ne.u_simpleCarCenter1.value.copy(o),
				Math.abs(o.x) > this._length && this.randomUpdate(this._moveParams1, this._car1);
			const p = this._car2.position;
			p.set(p.x + r * this._moveParams2.z * this._moveParams2.x, o.y, -this._moveParams2.y),
				Ne.u_simpleCarCenter2.value.copy(p),
				Math.abs(p.x) > this._length && this.randomUpdate(this._moveParams2, this._car2)
		}
	}
}
const bp = [[.65, 1.04, -1.16], [-.35, 1.43, -.69], [1.08, .72, -1.01], [1.95, .76, -1], [-1.66, 1.34, 0], [-1.95, .58, -1], [.35, 1.44, -.08], [.26, 1.46, -0], [2.53, .45, -.64], [2.73, .43, -.3], [2.78, .43, -0], [-2.3, .67, -.88], [-2.72, .68, 0], [-2.69, .62, -.4], [-2.24, .53, -.94], [.65, 1.04, 1.16], [-.35, 1.43, .69], [1.08, .72, 1.01], [1.95, .76, 1], [-1.95, .58, 1], [.35, 1.44, .08], [2.53, .45, .64], [2.73, .43, .3], [-2.3, .67, .88], [-2.69, .62, .4], [-2.24, .53, .94], [2.62, .43, .4], [-2.69, .62, -.4]]
	, pE = new eb
	, mE = new Yn
	, Kk = new $a
	, qk = new Yn(1, 1, 1);

class Zk extends _h {
	onLoad() {
		const i = new HP(.1, .1)
			, r = new XB(i, hE, bp.length);
		for (let o = 0; o < bp.length; o++)
			mE.set(bp[o][0], bp[o][1], bp[o][2]),
				pE.compose(mE, Kk, qk),
				r.setMatrixAt(o, pE);
		r.instanceMatrix.needsUpdate = !0,
			this.viewer.scene.add(r),
			this.controller = new Proxy({
				visibility: 1
			}, {
				set: (o, p, y) => (o[p] = y,
					y >= .005 ? r.visible = !0 : r.visible = !1,
					hE.uniforms.opacity.value = y,
					!0)
			}),
			this.controller.visibility = 0
	}
}

console.log('N.wA2', N.wA2)

/* 
N.wA2 在 module2.js中 ， 461: (t,i,r)=>{...}

*/
class Jk extends N.wA2 {
	constructor() {
		super(...arguments);
		B(this, "environment")
	}
	start() {
		console.log(vi.VERSION),
			this._preload().then(() => {
				this._prepareScene(),
					this._createScene(),
					this._compileScene()
			}
			)
	}

	async _preload() {
		const r = new JB(this.viewer.renderer);
		return Promise.all([this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_car.glb")
		}).then(o => {
			Ne.sm_car = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_startroom.raw.glb")
		}).then(o => {
			Ne.sm_startroom = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_speedup.glb")
		}).then(o => {
			Ne.sm_speedup = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_size.glb")
		}).then(o => {
			Ne.sm_size = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_curvature.glb")
		}).then(o => {
			Ne.sm_curvature = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_windspeed.glb")
		}).then(o => {
			Ne.sm_windspeed = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_linecar.glb")
		}).then(o => {
			Ne.sm_linecar = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_carradar.glb")
		}).then(o => {
			Ne.sm_carradar = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/mesh/sm_simplecar.glb")
		}).then(o => {
			Ne.sm_simpleCar = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_saLine.png"),
			flipY: !1,
			encoding: bd,
			wrapS: Rc,
			wrapT: Rc,
			anisotropy: 4
		}).then(o => Ne.ut_saLine.value = o), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_car_body_AO.raw.jpg"),
			flipY: !1,
			encoding: bd,
			minFilter: iE,
			magFilter: iE
		}).then(o => Ne.ut_car_body_ao.value = o), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_startroom_ao.raw.jpg"),
			flipY: !1,
			encoding: bd
		}).then(o => {
			Ne.ut_startroom_ao.value = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_startroom_light.raw.jpg"),
			flipY: !1,
			encoding: sk
		}).then(o => {
			Ne.ut_startroom_light.value = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_floor_normal.webp"),
			flipY: !1,
			encoding: bd,
			wrapS: Rc,
			wrapT: Rc
		}).then(o => {
			Ne.ut_floor_normal.value = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_floor_roughness.jpg"),
			flipY: !1,
			encoding: bd,
			wrapS: Rc,
			wrapT: Rc
		}).then(o => {
			Ne.ut_floor_roughness.value = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_street.png"),
			flipY: !1,
			wrapS: Rc,
			wrapT: Rc
		}).then(o => {
			Ne.ut_street.value = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_scar_matcap.png"),
			flipY: !1
		}).then(o => {
			Ne.ut_scar_matcap.value = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_cat_car_body_bc.png"),
			flipY: !1
		}).then(o => {
			Ne.ut_car_body_t_cat.value = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_gm_car_body_bc.png"),
			flipY: !1
		}).then(o => {
			Ne.ut_car_body_t_gm.value = o
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_env_night.hdr")
		}).then(o => {
			Ne.ut_env_night.value = r.fromEquirectangular(o).texture
		}
		), this.viewer.loadAsset({
			url: vi.autoURL("res/texture/t_env_light.hdr")
		}).then(o => {
			Ne.ut_env_light.value = r.fromEquirectangular(o).texture
		}
		)])
	}
	_prepareScene() {
		const r = this.viewer
			, o = r.addNode(new HB({
				scene: r.scene,
				layer: Ne.sceneCaptureLayer,
				resolution: 512
			}));
		o.blurIntensity = 4.5,
			this.environment = o,
			Ne.ut_cubeCapture = o.cubeTexture,
			Ne.ut_blurCapture = o.blurTexture;
		const p = new Float32Array(4);
		p.set([1, 1, 1, 1]);
		const y = new GB(p, 1, 1, VP, WB);
		y.needsUpdate = !0,
			Ne.ut_white.value = y;
		let d = Ne.sm_car.meshData;
		Object.values(d.meshes).forEach(E => {
			E.layers.enable(Ne.PlaneReflectLayer)
		}
		),
			Object.values(d.materials).forEach(E => {
				E.aoMap = Ne.ut_car_body_ao.value,
					Tk(E)
			}
			),
			d.materials.Car_body.map = y,
			d.materials.Car_body.needsUpdate = !0,
			d = Ne.sm_startroom.meshData,
			Object.values(d.materials).forEach(E => {
				E.aoMap = Ne.ut_startroom_ao.value,
					E.lightMap = Ne.ut_startroom_light.value,
					E.normalMap = Ne.ut_floor_normal.value,
					E.roughnessMap = Ne.ut_floor_roughness.value,
					E.envMapIntensity = 0
			}
			),
			d = Ne.sm_speedup.meshData,
			d.meshes.forEach(E => {
				E.material = Ek,
					E.layers.enable(Ne.sceneCaptureLayer)
			}
			),
			d = Ne.sm_size.meshData,
			Object.values(d.materials).forEach(E => {
				E.transparent = !0,
					E.needsUpdate = !0,
					E.map.anisotropy = 4
			}
			),
			d = Ne.sm_curvature.meshData,
			d.meshes.forEach(E => {
				E.name == "曲率" && (E.material = Ck,
					d.materials.m_curvature = E.material,
					E.layers.enable(Ne.sceneCaptureLayer))
			}
			),
			Object.values(d.materials).forEach(E => {
				E.transparent = !0,
					E.needsUpdate = !0
			}
			),
			d = Ne.sm_windspeed.meshData,
			d.meshes.forEach(E => {
				E.material = Pk,
					d.materials.m_windLine = E.material,
					E.layers.enable(Ne.sceneCaptureLayer)
			}
			),
			d = Ne.sm_linecar.meshData,
			d.meshes.forEach(E => {
				E.material = Rk,
					d.materials.m_linecar = E.material
			}
			),
			d = Ne.sm_carradar.meshData,
			d.meshes.forEach(E => {
				E.material = Dk,
					d.materials.m_carradar = E.material,
					E.layers.enable(Ne.sceneCaptureLayer)
			}
			),
			d = Ne.sm_simpleCar.meshData,
			d.meshes.forEach(E => {
				E.material = u0,
					d.materials.m_simpleCar = E.material,
					E.renderOrder = 10
			}
			)
	}
	_createScene() {
		const r = this.viewer;
		r.scene.background = new bi(0, 0, 0),
			r.addNode(_k),
			Ne.sm_startroom.traverse(re => {
				(re.name === "ReflecFloor" || re.name === "Floor") && Mk(re)
			}
			);
		const o = r.addNode(new Bk(Ne.ut_env_night.value, Ne.ut_env_light.value))
			, p = r.addNode(Ne.sm_startroom)
			, y = r.addNode(new zk(p))
			, d = new ek;
		this.viewer.addComponent(Ne.sm_car, d),
			d.probeBoxMin.set(-3, -.1, -1.5),
			d.probeBoxMax.set(3.6, 3, 1.5);
		const E = this.viewer.addNode(Ne.sm_car)
			, L = r.addNode(new Nk(E))
			, k = r.addNode(new jl({
				springLength: 11,
				rotation: new lo(0, Math.PI * .5, 0),
				fov: 33.4,
				lookAt: new Yn(0, .8, 0)
			}))
			, X = r.addNode(new yk({
				springCamera: k
			}));
		r.addNode(Gk);
		const $ = r.addNode(new Hk(E, X));
		r.addNode(Ne.sm_speedup);
		const Z = r.addNode(Vk)
			, ge = r.addNode(Wk)
			, be = r.addNode(jk)
			, ye = r.addNode(Xk)
			, $e = r.addNode(Zk)
			, ce = r.addNode(Yk)
			, ie = r.addNode(Qk)
			, U = r.addPlugin(new NB({
				luminanceThreshold: 0,
				luminanceSmoothing: 1.6,
				mipmapBlur: !0
			}));
		r.addPlugin(tk),
			vi.DEBUG && r.addPlugin(ik),
			this.eventRegister({
				envController: o,
				springCtr: X,
				carLightController: L,
				topLightController: y,
				carSpeedUpdate: $,
				bloom: U,
				projectionProbe: d,
				accessories: {
					s2_b: Z,
					s2_c: ge,
					s3_b: be,
					s3_c: ye,
					s4_b: $e,
					s4_c: ce,
					s4_cSC: ie
				}
			})
	}
	_compileScene() {
		Sk(),
			this.viewer.compile(),
			Ct.emit(Ct.PRELOADED)
	}
	eventRegister(r) {
		const o = r.envController
			, p = r.springCtr
			, y = r.carLightController
			, d = r.topLightController
			, E = r.carSpeedUpdate
			, L = r.bloom
			, k = r.projectionProbe
			, X = r.accessories
			, $ = (Z = 1, ge = 1, be = 1, ye = 1, $e = 1.8) => {
				qt.TweenManager.KillTweensOf(k),
					qt.TweenManager.Timeline(k).to({
						probeCenter: new Yn(0, 0, 0),
						probeBoxMax: new Yn(3.6, 3, 1.5)
					}, 1, {
						easing: qt.Easing.Cubic.InOut,
						onUpdate: () => {
							k.probeCenter = k.probeCenter
						}
					}).start(),
					qt.TweenManager.KillTweensOf(Ne.u_floorLightMapIntensity),
					qt.TweenManager.Timeline(Ne.u_floorLightMapIntensity).to({
						value: Z
					}, 1).start(),
					qt.TweenManager.KillTweensOf(Ne.u_car_envMapIntensity),
					qt.TweenManager.Timeline(Ne.u_car_envMapIntensity).to({
						value: ge
					}, 1.5, {
						easing: qt.Easing.Cubic.InOut
					}).start(),
					qt.TweenManager.KillTweensOf(this.environment),
					qt.TweenManager.Tween(this.environment).to({
						exposure: be
					}, 1).start(),
					qt.TweenManager.KillTweensOf(d),
					qt.TweenManager.Timeline(d).to({
						opacity: ye
					}, .5, {}).start(),
					qt.TweenManager.KillTweensOf(L),
					qt.TweenManager.Timeline(L).to({
						luminanceSmoothing: $e
					}, 2, {}).start()
			}
			;
		Ct.on(Ct.UPDATESHOWINGSTATE, Z => {
			const ge = Ne.u_floorLightMapColor.value.clone()
				, be = new bi("#000000")
				, ye = new bi("#C9D573")
				, $e = new bi("#ffffff")
				, ce = new bi;
			switch (Object.values(X).forEach(ie => ie.hide()),
			E.targetVelocity = 0,
			p.setNewRange(),
			Z) {
				case Sn.BeginAnim:
					qt.TweenManager.KillTweensOf(o),
						qt.TweenManager.Timeline(o).delay(1.5).call(() => {
							o.setState(tb.night, 2.5, qt.Easing.Cubic.In),
								p.gotoPOI(new Yn(0, .8, 0), 7, new lo(0, Math.PI * .5, 0), 4).then(() => {
									Ct.emit(Ct.UPDATESHOWINGSTATE, Sn.State1),
										p.enableControlCamera = !0
								}
								)
						}
						).delay(2.5).call(() => {
							o.setState(tb.light, 4, qt.Easing.Cubic.Out)
						}
						).start(),
						qt.TweenManager.KillTweensOf(d),
						qt.TweenManager.Timeline(d).delay(1.5).to({}, 2.5, {
							onUpdate: (ie, U) => {
								ce.copy(be).lerp(ye, U),
									d.lightEmissiveColor = ce,
									d.lightEmissiveIntensity = U * .4
							}
						}).to({}, 2, {
							onUpdate: (ie, U) => {
								ce.copy(ye).lerpHSL($e, U),
									d.lightEmissiveColor = ce,
									d.lightEmissiveIntensity = U * 2.3 + .4
							}
						}).start(),
						qt.TweenManager.KillTweensOf(y),
						qt.TweenManager.Timeline(y).delay(1).to({
							lightValue: 1
						}, 1, {
							easing: qt.Easing.Cubic.In
						}).start(),
						qt.TweenManager.KillTweensOf(Ne.u_floorLightMapIntensity),
						qt.TweenManager.Timeline(Ne.u_floorLightMapIntensity).delay(1.5).to({
							value: .1
						}, 2.5, {
							easing: qt.Easing.Cubic.In,
							onUpdate: (ie, U) => {
								ce.copy(ge).lerpHSL(ye, U),
									Ne.u_floorLightMapColor.value.copy(ce)
							}
						}).to({
							value: 1
						}, 2, {
							easing: qt.Easing.Linear.None,
							onUpdate: (ie, U) => {
								ce.copy(ye).lerpHSL($e, U),
									Ne.u_floorLightMapColor.value.copy(ce)
							}
						}).start(),
						qt.TweenManager.KillTweensOf(Ne.u_floorReflectIntensity),
						qt.TweenManager.Timeline(Ne.u_floorReflectIntensity).delay(1.8).to({
							value: .1
						}, 1.5, {
							easing: qt.Easing.Cubic.In
						}).to({
							value: 1
						}, 1.5, {
							easing: qt.Easing.Linear.None
						}).start();
					break;
				case Sn.State1:
					p.setNewTarget(new Yn(0, .8, 0), 7, new lo(0, Math.PI * .5, 0)),
						$();
					break;
				case Sn.State2:
					p.setNewTarget(new Yn(0, .8, 0), 7, new lo(0, -.89, .1)),
						X.s2_b.show(),
						$();
					break;
				case Sn.State3:
					p.setNewTarget(new Yn(.3, .8, 0), 7, new lo(0, .65, .1)),
						X.s3_b.show(),
						$(0, 0, 10, 0, .5),
						qt.TweenManager.KillTweensOf(k),
						qt.TweenManager.Timeline(k).to({
							probeCenter: new Yn(0, .5, 0),
							probeBoxMax: new Yn(3.6, 1.6, 1.5)
						}, 1, {
							easing: qt.Easing.Cubic.InOut,
							onUpdate: () => {
								k.probeCenter = k.probeCenter
							}
						}).start();
					break;
				case Sn.State4:
					p.setNewTarget(new Yn(.3, .8, 0), 14, new lo(0, Math.PI, 1.2)),
						p.setNewRange([.2, 1.3]),
						$(.2, 1, 3, 0, 1.5),
						X.s4_b.show(),
						qt.TweenManager.KillTweensOf(k),
						qt.TweenManager.Timeline(k).to({
							probeBoxMax: new Yn(3.6, 1.6, 1.5)
						}, 1, {
							easing: qt.Easing.Cubic.InOut,
							onUpdate: () => {
								k.probeCenter = k.probeCenter
							}
						}).start();
					break
			}
		}
		),
			Ct.on(Ct.CLICKEFFECT, Z => {
				switch (Object.entries(X).map(([ge, be]) => {
					be.hide()
				}
				),
				Ct.currentShowingState) {
					case Sn.State1:
						Z ? (E.targetVelocity = 8,
							E.lerpStrength = .5,
							p.targetFov = 60,
							p.springlengthOffset = -3,
							p.lerpStrength = .5,
							$(0, .1, 1, 0, 0)) : (E.targetVelocity = 0,
								E.lerpStrength = 1.5,
								p.targetFov = 33.4,
								p.lerpStrength = 1.5,
								p.springlengthOffset = 0,
								$());
						break;
					case Sn.State2:
						Z ? (X.s2_c.show(),
							p.targetFov = 45,
							p.lerpStrength = .5) : (X.s2_b.show(),
								p.targetFov = 33.4,
								p.lerpStrength = .5);
						break;
					case Sn.State3:
						Z ? (X.s3_c.show(1, .2),
							p.targetFov = 60,
							p.springlengthOffset = -3,
							p.lerpStrength = 1.5) : (X.s3_b.show(),
								p.targetFov = 33.4,
								p.springlengthOffset = 0,
								p.lerpStrength = 1.5);
						break;
					case Sn.State4:
						Z ? (E.targetVelocity = 16,
							E.lerpStrength = .5,
							X.s4_c.show(),
							X.s4_cSC.show(),
							p.targetFov = 25,
							p.lerpStrength = 1.5,
							p.springlengthOffset = 20,
							p.moveSpeed = [.1, .1],
							$(.2, .3, 3, 0, 1.5)) : (E.targetVelocity = 0,
								E.lerpStrength = 1.5,
								p.targetFov = 33.4,
								p.lerpStrength = 1.5,
								p.springlengthOffset = 0,
								p.moveSpeed = [1, 1],
								X.s4_b.show(),
								$(.2, 1, 3, 0, 1.5));
						break
				}
			}
			),
			Ct.on(Ct.CHANGECOLOR, (Z, ge) => {
				const be = Ne.sm_car.meshData.materials.Car_body.color.clone()
					, ye = new bi
					, $e = new bi(1, 1, 1)
					, ce = new bi(0, 0, 0);
				be.equals($e) && be.copy(ce),
					ge ? Ne.sm_car.meshData.materials.Car_body.map = ge.value : Ne.sm_car.meshData.materials.Car_body.map = Ne.ut_white.value,
					qt.TweenManager.KillTweensOf(Ne.sm_car.meshData.materials.Car_body),
					qt.TweenManager.Timeline(Ne.sm_car.meshData.materials.Car_body).to({}, .2, {
						easing: qt.Easing.Linear.None,
						onUpdate: (ie, U) => {
							ye.copy(be).lerp(Z, U),
								Ne.sm_car.meshData.materials.Car_body.color.copy(ye)
						}
					}).start()
			}
			)
	}
	update(r) {
		Ne.u_speedTime.value += r * Ne.u_speedUpBackgroundValue.value * .2,
			Ne.u_time.value += r
	}
}
function $k() {
	const t = ht.useRef(null);
	return ht.useEffect(() => {
		const i = new rk({
			root: document.getElementById("root"),
			canvas: t.current,
			orientation: ZB.LANDSCAPE,
			antialias: !0,
			toneMapping: kB,
			loader: {
				onProgress: (r, o, p) => Ct.loading = Math.max(Ct.loading, o / p),
				onLoad: () => Ct.loading = 1
			}
		});
		return i.addNode(Jk),
			() => {
				i.destroy()
			}
	}
		, []),
		je.jsxs("aside", {
			className: "webgl-wrapper",
			children: [je.jsx("canvas", {
				ref: t,
				className: "webgl-canvas",
				children: "No Canvas!"
			}), je.jsx("div", {
				id: "css-container"
			})]
		})
}
const fw = ht.createContext({
	transformPagePoint: t => t,
	isStatic: !1,
	reducedMotion: "never"
})
	, h0 = ht.createContext({})
	, d0 = ht.createContext(null)
	, pw = typeof document < "u"
	, mw = pw ? ht.useLayoutEffect : ht.useEffect
	, YP = ht.createContext({
		strict: !1
	})
	, gw = t => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase()
	, e3 = "framerAppearId"
	, QP = "data-" + gw(e3)
	, t3 = {
		skipAnimations: !1,
		useManualTiming: !1
	};
class gE {
	constructor() {
		this.order = [],
			this.scheduled = new Set
	}
	add(i) {
		if (!this.scheduled.has(i))
			return this.scheduled.add(i),
				this.order.push(i),
				!0
	}
	remove(i) {
		const r = this.order.indexOf(i);
		r !== -1 && (this.order.splice(r, 1),
			this.scheduled.delete(i))
	}
	clear() {
		this.order.length = 0,
			this.scheduled.clear()
	}
}
function n3(t) {
	let i = new gE
		, r = new gE
		, o = 0
		, p = !1
		, y = !1;
	const d = new WeakSet
		, E = {
			schedule: (L, k = !1, X = !1) => {
				const $ = X && p
					, Z = $ ? i : r;
				return k && d.add(L),
					Z.add(L) && $ && p && (o = i.order.length),
					L
			}
			,
			cancel: L => {
				r.remove(L),
					d.delete(L)
			}
			,
			process: L => {
				if (p) {
					y = !0;
					return
				}
				if (p = !0,
					[i, r] = [r, i],
					r.clear(),
					o = i.order.length,
					o)
					for (let k = 0; k < o; k++) {
						const X = i.order[k];
						d.has(X) && (E.schedule(X),
							t()),
							X(L)
					}
				p = !1,
					y && (y = !1,
						E.process(L))
			}
		};
	return E
}
const Kg = ["read", "resolveKeyframes", "update", "preRender", "render", "postRender"]
	, i3 = 40;
function KP(t, i) {
	let r = !1
		, o = !0;
	const p = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	}
		, y = Kg.reduce(($, Z) => ($[Z] = n3(() => r = !0),
			$), {})
		, d = $ => {
			y[$].process(p)
		}
		, E = () => {
			const $ = performance.now();
			r = !1,
				p.delta = o ? 1e3 / 60 : Math.max(Math.min($ - p.timestamp, i3), 1),
				p.timestamp = $,
				p.isProcessing = !0,
				Kg.forEach(d),
				p.isProcessing = !1,
				r && i && (o = !1,
					t(E))
		}
		, L = () => {
			r = !0,
				o = !0,
				p.isProcessing || t(E)
		}
		;
	return {
		schedule: Kg.reduce(($, Z) => {
			const ge = y[Z];
			return $[Z] = (be, ye = !1, $e = !1) => (r || L(),
				ge.schedule(be, ye, $e)),
				$
		}
			, {}),
		cancel: $ => Kg.forEach(Z => y[Z].cancel($)),
		state: p,
		steps: y
	}
}
const { schedule: vw, cancel: D4 } = KP(queueMicrotask, !1);
function r3(t, i, r, o) {
	const { visualElement: p } = ht.useContext(h0)
		, y = ht.useContext(YP)
		, d = ht.useContext(d0)
		, E = ht.useContext(fw).reducedMotion
		, L = ht.useRef();
	o = o || y.renderer,
		!L.current && o && (L.current = o(t, {
			visualState: i,
			parent: p,
			props: r,
			presenceContext: d,
			blockInitialAnimation: d ? d.initial === !1 : !1,
			reducedMotionConfig: E
		}));
	const k = L.current;
	ht.useInsertionEffect(() => {
		k && k.update(r, d)
	}
	);
	const X = ht.useRef(!!(r[QP] && !window.HandoffComplete));
	return mw(() => {
		k && (vw.postRender(k.render),
			X.current && k.animationState && k.animationState.animateChanges())
	}
	),
		ht.useEffect(() => {
			k && (k.updateFeatures(),
				!X.current && k.animationState && k.animationState.animateChanges(),
				X.current && (X.current = !1,
					window.HandoffComplete = !0))
		}
		),
		k
}
function Od(t) {
	return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current")
}
function s3(t, i, r) {
	return ht.useCallback(o => {
		o && t.mount && t.mount(o),
			i && (o ? i.mount(o) : i.unmount()),
			r && (typeof r == "function" ? r(o) : Od(r) && (r.current = o))
	}
		, [i])
}
function om(t) {
	return typeof t == "string" || Array.isArray(t)
}
function f0(t) {
	return t !== null && typeof t == "object" && typeof t.start == "function"
}
const yw = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"]
	, _w = ["initial", ...yw];
function p0(t) {
	return f0(t.animate) || _w.some(i => om(t[i]))
}
function qP(t) {
	return !!(p0(t) || t.variants)
}
function o3(t, i) {
	if (p0(t)) {
		const { initial: r, animate: o } = t;
		return {
			initial: r === !1 || om(r) ? r : void 0,
			animate: om(o) ? o : void 0
		}
	}
	return t.inherit !== !1 ? i : {}
}
function a3(t) {
	const { initial: i, animate: r } = o3(t, ht.useContext(h0));
	return ht.useMemo(() => ({
		initial: i,
		animate: r
	}), [vE(i), vE(r)])
}
function vE(t) {
	return Array.isArray(t) ? t.join(" ") : t
}
const yE = {
	animation: ["animate", "variants", "whileHover", "whileTap", "exit", "whileInView", "whileFocus", "whileDrag"],
	exit: ["exit"],
	drag: ["drag", "dragControls"],
	focus: ["whileFocus"],
	hover: ["whileHover", "onHoverStart", "onHoverEnd"],
	tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
	pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
	inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
	layout: ["layout", "layoutId"]
}
	, am = {};
for (const t in yE)
	am[t] = {
		isEnabled: i => yE[t].some(r => !!i[r])
	};
function l3(t) {
	for (const i in t)
		am[i] = {
			...am[i],
			...t[i]
		}
}
const xw = ht.createContext({})
	, ZP = ht.createContext({})
	, c3 = Symbol.for("motionComponentSymbol");
function u3({ preloadedFeatures: t, createVisualElement: i, useRender: r, useVisualState: o, Component: p }) {
	t && l3(t);
	function y(E, L) {
		let k;
		const X = {
			...ht.useContext(fw),
			...E,
			layoutId: h3(E)
		}
			, { isStatic: $ } = X
			, Z = a3(E)
			, ge = o(E, $);
		if (!$ && pw) {
			Z.visualElement = r3(p, ge, X, i);
			const be = ht.useContext(ZP)
				, ye = ht.useContext(YP).strict;
			Z.visualElement && (k = Z.visualElement.loadFeatures(X, ye, t, be))
		}
		return ht.createElement(h0.Provider, {
			value: Z
		}, k && Z.visualElement ? ht.createElement(k, {
			visualElement: Z.visualElement,
			...X
		}) : null, r(p, E, s3(ge, Z.visualElement, L), ge, $, Z.visualElement))
	}
	const d = ht.forwardRef(y);
	return d[c3] = p,
		d
}
function h3({ layoutId: t }) {
	const i = ht.useContext(xw).id;
	return i && t !== void 0 ? i + "-" + t : t
}
function d3(t) {
	function i(o, p = {}) {
		return u3(t(o, p))
	}
	if (typeof Proxy > "u")
		return i;
	const r = new Map;
	return new Proxy(i, {
		get: (o, p) => (r.has(p) || r.set(p, i(p)),
			r.get(p))
	})
}
const f3 = ["animate", "circle", "defs", "desc", "ellipse", "g", "image", "line", "filter", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline", "rect", "stop", "switch", "symbol", "svg", "text", "tspan", "use", "view"];
function bw(t) {
	return typeof t != "string" || t.includes("-") ? !1 : !!(f3.indexOf(t) > -1 || /[A-Z]/u.test(t))
}
const Uv = {};
function p3(t) {
	Object.assign(Uv, t)
}
const vm = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"]
	, xh = new Set(vm);
function JP(t, { layout: i, layoutId: r }) {
	return xh.has(t) || t.startsWith("origin") || (i || r !== void 0) && (!!Uv[t] || t === "opacity")
}
const fs = t => !!(t && t.getVelocity)
	, m3 = {
		x: "translateX",
		y: "translateY",
		z: "translateZ",
		transformPerspective: "perspective"
	}
	, g3 = vm.length;
function v3(t, { enableHardwareAcceleration: i = !0, allowTransformNone: r = !0 }, o, p) {
	let y = "";
	for (let d = 0; d < g3; d++) {
		const E = vm[d];
		if (t[E] !== void 0) {
			const L = m3[E] || E;
			y += `${L}(${t[E]}) `
		}
	}
	return i && !t.z && (y += "translateZ(0)"),
		y = y.trim(),
		p ? y = p(t, o ? "" : y) : r && o && (y = "none"),
		y
}
const $P = t => i => typeof i == "string" && i.startsWith(t)
	, eR = $P("--")
	, y3 = $P("var(--")
	, ww = t => y3(t) ? _3.test(t.split("/*")[0].trim()) : !1
	, _3 = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu
	, x3 = (t, i) => i && typeof t == "number" ? i.transform(t) : t
	, qc = (t, i, r) => r > i ? i : r < t ? t : r
	, tf = {
		test: t => typeof t == "number",
		parse: parseFloat,
		transform: t => t
	}
	, kp = {
		...tf,
		transform: t => qc(0, 1, t)
	}
	, qg = {
		...tf,
		default: 1
	}
	, Up = t => Math.round(t * 1e5) / 1e5
	, Aw = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu
	, b3 = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu
	, w3 = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
function ym(t) {
	return typeof t == "string"
}
const _m = t => ({
	test: i => ym(i) && i.endsWith(t) && i.split(" ").length === 1,
	parse: parseFloat,
	transform: i => `${i}${t}`
})
	, Dc = _m("deg")
	, el = _m("%")
	, mn = _m("px")
	, A3 = _m("vh")
	, S3 = _m("vw")
	, _E = {
		...el,
		parse: t => el.parse(t) / 100,
		transform: t => el.transform(t * 100)
	}
	, xE = {
		...tf,
		transform: Math.round
	}
	, tR = {
		borderWidth: mn,
		borderTopWidth: mn,
		borderRightWidth: mn,
		borderBottomWidth: mn,
		borderLeftWidth: mn,
		borderRadius: mn,
		radius: mn,
		borderTopLeftRadius: mn,
		borderTopRightRadius: mn,
		borderBottomRightRadius: mn,
		borderBottomLeftRadius: mn,
		width: mn,
		maxWidth: mn,
		height: mn,
		maxHeight: mn,
		size: mn,
		top: mn,
		right: mn,
		bottom: mn,
		left: mn,
		padding: mn,
		paddingTop: mn,
		paddingRight: mn,
		paddingBottom: mn,
		paddingLeft: mn,
		margin: mn,
		marginTop: mn,
		marginRight: mn,
		marginBottom: mn,
		marginLeft: mn,
		rotate: Dc,
		rotateX: Dc,
		rotateY: Dc,
		rotateZ: Dc,
		scale: qg,
		scaleX: qg,
		scaleY: qg,
		scaleZ: qg,
		skew: Dc,
		skewX: Dc,
		skewY: Dc,
		distance: mn,
		translateX: mn,
		translateY: mn,
		translateZ: mn,
		x: mn,
		y: mn,
		z: mn,
		perspective: mn,
		transformPerspective: mn,
		opacity: kp,
		originX: _E,
		originY: _E,
		originZ: mn,
		zIndex: xE,
		backgroundPositionX: mn,
		backgroundPositionY: mn,
		fillOpacity: kp,
		strokeOpacity: kp,
		numOctaves: xE
	};
function Sw(t, i, r, o) {
	const { style: p, vars: y, transform: d, transformOrigin: E } = t;
	let L = !1
		, k = !1
		, X = !0;
	for (const $ in i) {
		const Z = i[$];
		if (eR($)) {
			y[$] = Z;
			continue
		}
		const ge = tR[$]
			, be = x3(Z, ge);
		if (xh.has($)) {
			if (L = !0,
				d[$] = be,
				!X)
				continue;
			Z !== (ge.default || 0) && (X = !1)
		} else
			$.startsWith("origin") ? (k = !0,
				E[$] = be) : p[$] = be
	}
	if (i.transform || (L || o ? p.transform = v3(t.transform, r, X, o) : p.transform && (p.transform = "none")),
		k) {
		const { originX: $ = "50%", originY: Z = "50%", originZ: ge = 0 } = E;
		p.transformOrigin = `${$} ${Z} ${ge}`
	}
}
const Mw = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
function nR(t, i, r) {
	for (const o in i)
		!fs(i[o]) && !JP(o, r) && (t[o] = i[o])
}
function M3({ transformTemplate: t }, i, r) {
	return ht.useMemo(() => {
		const o = Mw();
		return Sw(o, i, {
			enableHardwareAcceleration: !r
		}, t),
			Object.assign({}, o.vars, o.style)
	}
		, [i])
}
function E3(t, i, r) {
	const o = t.style || {}
		, p = {};
	return nR(p, o, t),
		Object.assign(p, M3(t, i, r)),
		p
}
function T3(t, i, r) {
	const o = {}
		, p = E3(t, i, r);
	return t.drag && t.dragListener !== !1 && (o.draggable = !1,
		p.userSelect = p.WebkitUserSelect = p.WebkitTouchCallout = "none",
		p.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`),
		t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (o.tabIndex = 0),
		o.style = p,
		o
}
const C3 = new Set(["animate", "exit", "variants", "initial", "style", "values", "variants", "transition", "transformTemplate", "custom", "inherit", "onBeforeLayoutMeasure", "onAnimationStart", "onAnimationComplete", "onUpdate", "onDragStart", "onDrag", "onDragEnd", "onMeasureDragConstraints", "onDirectionLock", "onDragTransitionEnd", "_dragX", "_dragY", "onHoverStart", "onHoverEnd", "onViewportEnter", "onViewportLeave", "globalTapTarget", "ignoreStrict", "viewport"]);
function Nv(t) {
	return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || C3.has(t)
}
let iR = t => !Nv(t);
function P3(t) {
	t && (iR = i => i.startsWith("on") ? !Nv(i) : t(i))
}
try {
	P3(require("@emotion/is-prop-valid").default)
} catch { }
function R3(t, i, r) {
	const o = {};
	for (const p in t)
		p === "values" && typeof t.values == "object" || (iR(p) || r === !0 && Nv(p) || !i && !Nv(p) || t.draggable && p.startsWith("onDrag")) && (o[p] = t[p]);
	return o
}
function bE(t, i, r) {
	return typeof t == "string" ? t : mn.transform(i + r * t)
}
function D3(t, i, r) {
	const o = bE(i, t.x, t.width)
		, p = bE(r, t.y, t.height);
	return `${o} ${p}`
}
const I3 = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}
	, L3 = {
		offset: "strokeDashoffset",
		array: "strokeDasharray"
	};
function O3(t, i, r = 1, o = 0, p = !0) {
	t.pathLength = 1;
	const y = p ? I3 : L3;
	t[y.offset] = mn.transform(-o);
	const d = mn.transform(i)
		, E = mn.transform(r);
	t[y.array] = `${d} ${E}`
}
function Ew(t, { attrX: i, attrY: r, attrScale: o, originX: p, originY: y, pathLength: d, pathSpacing: E = 1, pathOffset: L = 0, ...k }, X, $, Z) {
	if (Sw(t, k, X, Z),
		$) {
		t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
		return
	}
	t.attrs = t.style,
		t.style = {};
	const { attrs: ge, style: be, dimensions: ye } = t;
	ge.transform && (ye && (be.transform = ge.transform),
		delete ge.transform),
		ye && (p !== void 0 || y !== void 0 || be.transform) && (be.transformOrigin = D3(ye, p !== void 0 ? p : .5, y !== void 0 ? y : .5)),
		i !== void 0 && (ge.x = i),
		r !== void 0 && (ge.y = r),
		o !== void 0 && (ge.scale = o),
		d !== void 0 && O3(ge, d, E, L, !1)
}
const rR = () => ({
	...Mw(),
	attrs: {}
})
	, Tw = t => typeof t == "string" && t.toLowerCase() === "svg";
function F3(t, i, r, o) {
	const p = ht.useMemo(() => {
		const y = rR();
		return Ew(y, i, {
			enableHardwareAcceleration: !1
		}, Tw(o), t.transformTemplate),
		{
			...y.attrs,
			style: {
				...y.style
			}
		}
	}
		, [i]);
	if (t.style) {
		const y = {};
		nR(y, t.style, t),
			p.style = {
				...y,
				...p.style
			}
	}
	return p
}
function B3(t = !1) {
	return (r, o, p, { latestValues: y }, d) => {
		const L = (bw(r) ? F3 : T3)(o, y, d, r)
			, k = R3(o, typeof r == "string", t)
			, X = r !== ht.Fragment ? {
				...k,
				...L,
				ref: p
			} : {}
			, { children: $ } = o
			, Z = ht.useMemo(() => fs($) ? $.get() : $, [$]);
		return ht.createElement(r, {
			...X,
			children: Z
		})
	}
}
function sR(t, { style: i, vars: r }, o, p) {
	Object.assign(t.style, i, p && p.getProjectionStyles(o));
	for (const y in r)
		t.style.setProperty(y, r[y])
}
const oR = new Set(["baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust"]);
function aR(t, i, r, o) {
	sR(t, i, void 0, o);
	for (const p in i.attrs)
		t.setAttribute(oR.has(p) ? p : gw(p), i.attrs[p])
}
function Cw(t, i) {
	const { style: r } = t
		, o = {};
	for (const p in r)
		(fs(r[p]) || i.style && fs(i.style[p]) || JP(p, t)) && (o[p] = r[p]);
	return o
}
function lR(t, i) {
	const r = Cw(t, i);
	for (const o in t)
		if (fs(t[o]) || fs(i[o])) {
			const p = vm.indexOf(o) !== -1 ? "attr" + o.charAt(0).toUpperCase() + o.substring(1) : o;
			r[p] = t[o]
		}
	return r
}
function Pw(t, i, r, o = {}, p = {}) {
	return typeof i == "function" && (i = i(r !== void 0 ? r : t.custom, o, p)),
		typeof i == "string" && (i = t.variants && t.variants[i]),
		typeof i == "function" && (i = i(r !== void 0 ? r : t.custom, o, p)),
		i
}
function cR(t) {
	const i = ht.useRef(null);
	return i.current === null && (i.current = t()),
		i.current
}
const nb = t => Array.isArray(t)
	, k3 = t => !!(t && typeof t == "object" && t.mix && t.toValue)
	, U3 = t => nb(t) ? t[t.length - 1] || 0 : t;
function hv(t) {
	const i = fs(t) ? t.get() : t;
	return k3(i) ? i.toValue() : i
}
function N3({ scrapeMotionValuesFromProps: t, createRenderState: i, onMount: r }, o, p, y) {
	const d = {
		latestValues: z3(o, p, y, t),
		renderState: i()
	};
	return r && (d.mount = E => r(o, E, d)),
		d
}
const uR = t => (i, r) => {
	const o = ht.useContext(h0)
		, p = ht.useContext(d0)
		, y = () => N3(t, i, o, p);
	return r ? y() : cR(y)
}
	;
function z3(t, i, r, o) {
	const p = {}
		, y = o(t, {});
	for (const Z in y)
		p[Z] = hv(y[Z]);
	let { initial: d, animate: E } = t;
	const L = p0(t)
		, k = qP(t);
	i && k && !L && t.inherit !== !1 && (d === void 0 && (d = i.initial),
		E === void 0 && (E = i.animate));
	let X = r ? r.initial === !1 : !1;
	X = X || d === !1;
	const $ = X ? E : d;
	return $ && typeof $ != "boolean" && !f0($) && (Array.isArray($) ? $ : [$]).forEach(ge => {
		const be = Pw(t, ge);
		if (!be)
			return;
		const { transitionEnd: ye, transition: $e, ...ce } = be;
		for (const ie in ce) {
			let U = ce[ie];
			if (Array.isArray(U)) {
				const re = X ? U.length - 1 : 0;
				U = U[re]
			}
			U !== null && (p[ie] = U)
		}
		for (const ie in ye)
			p[ie] = ye[ie]
	}
	),
		p
}
const Zr = t => t
	, { schedule: Nr, cancel: Zc, state: Kr, steps: Q_ } = KP(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Zr, !0)
	, G3 = {
		useVisualState: uR({
			scrapeMotionValuesFromProps: lR,
			createRenderState: rR,
			onMount: (t, i, { renderState: r, latestValues: o }) => {
				Nr.read(() => {
					try {
						r.dimensions = typeof i.getBBox == "function" ? i.getBBox() : i.getBoundingClientRect()
					} catch {
						r.dimensions = {
							x: 0,
							y: 0,
							width: 0,
							height: 0
						}
					}
				}
				),
					Nr.render(() => {
						Ew(r, o, {
							enableHardwareAcceleration: !1
						}, Tw(i.tagName), t.transformTemplate),
							aR(i, r)
					}
					)
			}
		})
	}
	, H3 = {
		useVisualState: uR({
			scrapeMotionValuesFromProps: Cw,
			createRenderState: Mw
		})
	};
function V3(t, { forwardMotionProps: i = !1 }, r, o) {
	return {
		...bw(t) ? G3 : H3,
		preloadedFeatures: r,
		useRender: B3(i),
		createVisualElement: o,
		Component: t
	}
}
function Ll(t, i, r, o = {
	passive: !0
}) {
	return t.addEventListener(i, r, o),
		() => t.removeEventListener(i, r)
}
const hR = t => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1;
function m0(t, i = "page") {
	return {
		point: {
			x: t[i + "X"],
			y: t[i + "Y"]
		}
	}
}
const W3 = t => i => hR(i) && t(i, m0(i));
function Bl(t, i, r, o) {
	return Ll(t, i, W3(r), o)
}
const j3 = (t, i) => r => i(t(r))
	, kl = (...t) => t.reduce(j3);
function dR(t) {
	let i = null;
	return () => {
		const r = () => {
			i = null
		}
			;
		return i === null ? (i = t,
			r) : !1
	}
}
const wE = dR("dragHorizontal")
	, AE = dR("dragVertical");
function fR(t) {
	let i = !1;
	if (t === "y")
		i = AE();
	else if (t === "x")
		i = wE();
	else {
		const r = wE()
			, o = AE();
		r && o ? i = () => {
			r(),
				o()
		}
			: (r && r(),
				o && o())
	}
	return i
}
function pR() {
	const t = fR(!0);
	return t ? (t(),
		!1) : !0
}

class iu {
	constructor(i) {
		this.isMounted = !1,
			this.node = i
	}
	update() { }
}
function SE(t, i) {
	const r = "pointer" + (i ? "enter" : "leave")
		, o = "onHover" + (i ? "Start" : "End")
		, p = (y, d) => {
			if (y.pointerType === "touch" || pR())
				return;
			const E = t.getProps();
			t.animationState && E.whileHover && t.animationState.setActive("whileHover", i),
				E[o] && E[o](y, d)
		}
		;
	return Bl(t.current, r, p, {
		passive: !t.getProps()[o]
	})
}
class X3 extends iu {
	mount() {
		this.unmount = kl(SE(this.node, !0), SE(this.node, !1))
	}
	unmount() { }
}

class Y3 extends iu {
	constructor() {
		super(...arguments),
			this.isActive = !1
	}
	onFocus() {
		let i = !1;
		try {
			i = this.node.current.matches(":focus-visible")
		} catch {
			i = !0
		}
		!i || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0),
			this.isActive = !0)
	}
	onBlur() {
		!this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1),
			this.isActive = !1)
	}
	mount() {
		this.unmount = kl(Ll(this.node.current, "focus", () => this.onFocus()), Ll(this.node.current, "blur", () => this.onBlur()))
	}
	unmount() { }
}
const mR = (t, i) => i ? t === i ? !0 : mR(t, i.parentElement) : !1;
function K_(t, i) {
	if (!i)
		return;
	const r = new PointerEvent("pointer" + t);
	i(r, m0(r))
}

class Q3 extends iu {
	constructor() {
		super(...arguments),
			this.removeStartListeners = Zr,
			this.removeEndListeners = Zr,
			this.removeAccessibleListeners = Zr,
			this.startPointerPress = (i, r) => {
				if (this.isPressing)
					return;
				this.removeEndListeners();
				const o = this.node.getProps()
					, y = Bl(window, "pointerup", (E, L) => {
						if (!this.checkPressEnd())
							return;
						const { onTap: k, onTapCancel: X, globalTapTarget: $ } = this.node.getProps();
						!$ && !mR(this.node.current, E.target) ? X && X(E, L) : k && k(E, L)
					}
						, {
							passive: !(o.onTap || o.onPointerUp)
						})
					, d = Bl(window, "pointercancel", (E, L) => this.cancelPress(E, L), {
						passive: !(o.onTapCancel || o.onPointerCancel)
					});
				this.removeEndListeners = kl(y, d),
					this.startPress(i, r)
			}
			,
			this.startAccessiblePress = () => {
				const i = y => {
					if (y.key !== "Enter" || this.isPressing)
						return;
					const d = E => {
						E.key !== "Enter" || !this.checkPressEnd() || K_("up", (L, k) => {
							const { onTap: X } = this.node.getProps();
							X && X(L, k)
						}
						)
					}
						;
					this.removeEndListeners(),
						this.removeEndListeners = Ll(this.node.current, "keyup", d),
						K_("down", (E, L) => {
							this.startPress(E, L)
						}
						)
				}
					, r = Ll(this.node.current, "keydown", i)
					, o = () => {
						this.isPressing && K_("cancel", (y, d) => this.cancelPress(y, d))
					}
					, p = Ll(this.node.current, "blur", o);
				this.removeAccessibleListeners = kl(r, p)
			}
	}
	startPress(i, r) {
		this.isPressing = !0;
		const { onTapStart: o, whileTap: p } = this.node.getProps();
		p && this.node.animationState && this.node.animationState.setActive("whileTap", !0),
			o && o(i, r)
	}
	checkPressEnd() {
		return this.removeEndListeners(),
			this.isPressing = !1,
			this.node.getProps().whileTap && this.node.animationState && this.node.animationState.setActive("whileTap", !1),
			!pR()
	}
	cancelPress(i, r) {
		if (!this.checkPressEnd())
			return;
		const { onTapCancel: o } = this.node.getProps();
		o && o(i, r)
	}
	mount() {
		const i = this.node.getProps()
			, r = Bl(i.globalTapTarget ? window : this.node.current, "pointerdown", this.startPointerPress, {
				passive: !(i.onTapStart || i.onPointerStart)
			})
			, o = Ll(this.node.current, "focus", this.startAccessiblePress);
		this.removeStartListeners = kl(r, o)
	}
	unmount() {
		this.removeStartListeners(),
			this.removeEndListeners(),
			this.removeAccessibleListeners()
	}
}
const ib = new WeakMap
	, q_ = new WeakMap
	, K3 = t => {
		const i = ib.get(t.target);
		i && i(t)
	}
	, q3 = t => {
		t.forEach(K3)
	}
	;
function Z3({ root: t, ...i }) {
	const r = t || document;
	q_.has(r) || q_.set(r, {});
	const o = q_.get(r)
		, p = JSON.stringify(i);
	return o[p] || (o[p] = new IntersectionObserver(q3, {
		root: t,
		...i
	})),
		o[p]
}
function J3(t, i, r) {
	const o = Z3(i);
	return ib.set(t, r),
		o.observe(t),
		() => {
			ib.delete(t),
				o.unobserve(t)
		}
}
const $3 = {
	some: 0,
	all: 1
};

class eU extends iu {
	constructor() {
		super(...arguments),
			this.hasEnteredView = !1,
			this.isInView = !1
	}
	startObserver() {
		this.unmount();
		const { viewport: i = {} } = this.node.getProps()
			, { root: r, margin: o, amount: p = "some", once: y } = i
			, d = {
				root: r ? r.current : void 0,
				rootMargin: o,
				threshold: typeof p == "number" ? p : $3[p]
			}
			, E = L => {
				const { isIntersecting: k } = L;
				if (this.isInView === k || (this.isInView = k,
					y && !k && this.hasEnteredView))
					return;
				k && (this.hasEnteredView = !0),
					this.node.animationState && this.node.animationState.setActive("whileInView", k);
				const { onViewportEnter: X, onViewportLeave: $ } = this.node.getProps()
					, Z = k ? X : $;
				Z && Z(L)
			}
			;
		return J3(this.node.current, d, E)
	}
	mount() {
		this.startObserver()
	}
	update() {
		if (typeof IntersectionObserver > "u")
			return;
		const { props: i, prevProps: r } = this.node;
		["amount", "margin", "root"].some(tU(i, r)) && this.startObserver()
	}
	unmount() { }
}
function tU({ viewport: t = {} }, { viewport: i = {} } = {}) {
	return r => t[r] !== i[r]
}
const nU = {
	inView: {
		Feature: eU
	},
	tap: {
		Feature: Q3
	},
	focus: {
		Feature: Y3
	},
	hover: {
		Feature: X3
	}
};
function gR(t, i) {
	if (!Array.isArray(i))
		return !1;
	const r = i.length;
	if (r !== t.length)
		return !1;
	for (let o = 0; o < r; o++)
		if (i[o] !== t[o])
			return !1;
	return !0
}
function iU(t) {
	const i = {};
	return t.values.forEach((r, o) => i[o] = r.get()),
		i
}
function rU(t) {
	const i = {};
	return t.values.forEach((r, o) => i[o] = r.getVelocity()),
		i
}
function g0(t, i, r) {
	const o = t.getProps();
	return Pw(o, i, r !== void 0 ? r : o.custom, iU(t), rU(t))
}
const Ul = t => t * 1e3
	, Nl = t => t / 1e3
	, sU = {
		type: "spring",
		stiffness: 500,
		damping: 25,
		restSpeed: 10
	}
	, oU = t => ({
		type: "spring",
		stiffness: 550,
		damping: t === 0 ? 2 * Math.sqrt(550) : 30,
		restSpeed: 10
	})
	, aU = {
		type: "keyframes",
		duration: .8
	}
	, lU = {
		type: "keyframes",
		ease: [.25, .1, .35, 1],
		duration: .3
	}
	, cU = (t, { keyframes: i }) => i.length > 2 ? aU : xh.has(t) ? t.startsWith("scale") ? oU(i[1]) : sU : lU;
function uU({ when: t, delay: i, delayChildren: r, staggerChildren: o, staggerDirection: p, repeat: y, repeatType: d, repeatDelay: E, from: L, elapsed: k, ...X }) {
	return !!Object.keys(X).length
}
function Rw(t, i) {
	return t[i] || t.default || t
}
const hU = t => t !== null;
function v0(t, { repeat: i, repeatType: r = "loop" }, o) {
	const p = t.filter(hU)
		, y = i && r !== "loop" && i % 2 === 1 ? 0 : p.length - 1;
	return !y || o === void 0 ? p[y] : o
}
let dv;
function dU() {
	dv = void 0
}
const Yc = {
	now: () => (dv === void 0 && Yc.set(Kr.isProcessing || t3.useManualTiming ? Kr.timestamp : performance.now()),
		dv),
	set: t => {
		dv = t,
			queueMicrotask(dU)
	}
}
	, vR = t => /^0[^.\s]+$/u.test(t);
function fU(t) {
	return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || vR(t) : !0
}
let pU = Zr
	, yR = Zr;
const _R = t => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t)
	, mU = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function gU(t) {
	const i = mU.exec(t);
	if (!i)
		return [,];
	const [, r, o, p] = i;
	return [`--${r ?? o}`, p]
}
function xR(t, i, r = 1) {
	const [o, p] = gU(t);
	if (!o)
		return;
	const y = window.getComputedStyle(i).getPropertyValue(o);
	if (y) {
		const d = y.trim();
		return _R(d) ? parseFloat(d) : d
	}
	return ww(p) ? xR(p, i, r + 1) : p
}
const vU = new Set(["width", "height", "top", "left", "right", "bottom", "x", "y", "translateX", "translateY"])
	, ME = t => t === tf || t === mn
	, EE = (t, i) => parseFloat(t.split(", ")[i])
	, TE = (t, i) => (r, { transform: o }) => {
		if (o === "none" || !o)
			return 0;
		const p = o.match(/^matrix3d\((.+)\)$/u);
		if (p)
			return EE(p[1], i);
		{
			const y = o.match(/^matrix\((.+)\)$/u);
			return y ? EE(y[1], t) : 0
		}
	}
	, yU = new Set(["x", "y", "z"])
	, _U = vm.filter(t => !yU.has(t));
function CE(t) {
	const i = [];
	return _U.forEach(r => {
		const o = t.getValue(r);
		o !== void 0 && (i.push([r, o.get()]),
			o.set(r.startsWith("scale") ? 1 : 0))
	}
	),
		i
}
const Zd = {
	width: ({ x: t }, { paddingLeft: i = "0", paddingRight: r = "0" }) => t.max - t.min - parseFloat(i) - parseFloat(r),
	height: ({ y: t }, { paddingTop: i = "0", paddingBottom: r = "0" }) => t.max - t.min - parseFloat(i) - parseFloat(r),
	top: (t, { top: i }) => parseFloat(i),
	left: (t, { left: i }) => parseFloat(i),
	bottom: ({ y: t }, { top: i }) => parseFloat(i) + (t.max - t.min),
	right: ({ x: t }, { left: i }) => parseFloat(i) + (t.max - t.min),
	x: TE(4, 13),
	y: TE(5, 14)
};
Zd.translateX = Zd.x;
Zd.translateY = Zd.y;
const bR = t => i => i.test(t)
	, xU = {
		test: t => t === "auto",
		parse: t => t
	}
	, wR = [tf, mn, el, Dc, S3, A3, xU]
	, PE = t => wR.find(bR(t))
	, hh = new Set;
let rb = !1
	, sb = !1;
function AR() {
	if (sb) {
		const t = Array.from(hh).filter(o => o.needsMeasurement)
			, i = new Set(t.map(o => o.element))
			, r = new Map;
		i.forEach(o => {
			CE(o).length && (r.set(o, CE(o)),
				o.render())
		}
		),
			t.forEach(o => o.measureInitialState()),
			i.forEach(o => {
				o.render()
			}
			),
			t.forEach(o => o.measureEndState()),
			t.forEach(o => {
				o.suspendedScrollY !== void 0 && window.scrollTo(0, o.suspendedScrollY)
			}
			)
	}
	sb = !1,
		rb = !1,
		hh.forEach(t => t.complete()),
		hh.clear()
}
function SR() {
	hh.forEach(t => {
		t.readKeyframes(),
			t.needsMeasurement && (sb = !0)
	}
	)
}
function bU() {
	SR(),
		AR()
}

class Dw {
	constructor(i, r, o, p, y, d = !1) {
		this.isComplete = !1,
			this.isAsync = !1,
			this.needsMeasurement = !1,
			this.isScheduled = !1,
			this.unresolvedKeyframes = [...i],
			this.onComplete = r,
			this.name = o,
			this.motionValue = p,
			this.element = y,
			this.isAsync = d
	}
	scheduleResolve() {
		this.isScheduled = !0,
			this.isAsync ? (hh.add(this),
				rb || (rb = !0,
					Nr.read(SR),
					Nr.resolveKeyframes(AR))) : (this.readKeyframes(),
						this.complete())
	}
	readKeyframes() {
		const { unresolvedKeyframes: i, name: r, element: o, motionValue: p } = this;
		for (let y = 0; y < i.length; y++)
			if (i[y] === null)
				if (y === 0) {
					const d = p == null ? void 0 : p.get()
						, E = i[i.length - 1];
					if (d !== void 0)
						i[0] = d;
					else if (o && r) {
						const L = o.readValue(r, E);
						L != null && (i[0] = L)
					}
					i[0] === void 0 && (i[0] = E),
						p && d === void 0 && p.set(i[0])
				} else
					i[y] = i[y - 1]
	}
	setFinalKeyframe() { }
	measureInitialState() { }
	renderEndStyles() { }
	measureEndState() { }
	complete() {
		this.isComplete = !0,
			this.onComplete(this.unresolvedKeyframes, this.finalKeyframe),
			hh.delete(this)
	}
	cancel() {
		this.isComplete || (this.isScheduled = !1,
			hh.delete(this))
	}
	resume() {
		this.isComplete || this.scheduleResolve()
	}
}
const Iw = (t, i) => r => !!(ym(r) && w3.test(r) && r.startsWith(t) || i && Object.prototype.hasOwnProperty.call(r, i))
	, MR = (t, i, r) => o => {
		if (!ym(o))
			return o;
		const [p, y, d, E] = o.match(Aw);
		return {
			[t]: parseFloat(p),
			[i]: parseFloat(y),
			[r]: parseFloat(d),
			alpha: E !== void 0 ? parseFloat(E) : 1
		}
	}
	, wU = t => qc(0, 255, t)
	, Z_ = {
		...tf,
		transform: t => Math.round(wU(t))
	}
	, lh = {
		test: Iw("rgb", "red"),
		parse: MR("red", "green", "blue"),
		transform: ({ red: t, green: i, blue: r, alpha: o = 1 }) => "rgba(" + Z_.transform(t) + ", " + Z_.transform(i) + ", " + Z_.transform(r) + ", " + Up(kp.transform(o)) + ")"
	};
function AU(t) {
	let i = ""
		, r = ""
		, o = ""
		, p = "";
	return t.length > 5 ? (i = t.substring(1, 3),
		r = t.substring(3, 5),
		o = t.substring(5, 7),
		p = t.substring(7, 9)) : (i = t.substring(1, 2),
			r = t.substring(2, 3),
			o = t.substring(3, 4),
			p = t.substring(4, 5),
			i += i,
			r += r,
			o += o,
			p += p),
	{
		red: parseInt(i, 16),
		green: parseInt(r, 16),
		blue: parseInt(o, 16),
		alpha: p ? parseInt(p, 16) / 255 : 1
	}
}
const ob = {
	test: Iw("#"),
	parse: AU,
	transform: lh.transform
}
	, Fd = {
		test: Iw("hsl", "hue"),
		parse: MR("hue", "saturation", "lightness"),
		transform: ({ hue: t, saturation: i, lightness: r, alpha: o = 1 }) => "hsla(" + Math.round(t) + ", " + el.transform(Up(i)) + ", " + el.transform(Up(r)) + ", " + Up(kp.transform(o)) + ")"
	}
	, hs = {
		test: t => lh.test(t) || ob.test(t) || Fd.test(t),
		parse: t => lh.test(t) ? lh.parse(t) : Fd.test(t) ? Fd.parse(t) : ob.parse(t),
		transform: t => ym(t) ? t : t.hasOwnProperty("red") ? lh.transform(t) : Fd.transform(t)
	};
function SU(t) {
	var i, r;
	return isNaN(t) && ym(t) && (((i = t.match(Aw)) === null || i === void 0 ? void 0 : i.length) || 0) + (((r = t.match(b3)) === null || r === void 0 ? void 0 : r.length) || 0) > 0
}
const ER = "number"
	, TR = "color"
	, MU = "var"
	, EU = "var("
	, RE = "${}"
	, TU = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function zv(t) {
	const i = t.toString()
		, r = []
		, o = {
			color: [],
			number: [],
			var: []
		}
		, p = [];
	let y = 0;
	const E = i.replace(TU, L => (hs.test(L) ? (o.color.push(y),
		p.push(TR),
		r.push(hs.parse(L))) : L.startsWith(EU) ? (o.var.push(y),
			p.push(MU),
			r.push(L)) : (o.number.push(y),
				p.push(ER),
				r.push(parseFloat(L))),
		++y,
		RE)).split(RE);
	return {
		values: r,
		split: E,
		indexes: o,
		types: p
	}
}
function CR(t) {
	return zv(t).values
}
function PR(t) {
	const { split: i, types: r } = zv(t)
		, o = i.length;
	return p => {
		let y = "";
		for (let d = 0; d < o; d++)
			if (y += i[d],
				p[d] !== void 0) {
				const E = r[d];
				E === ER ? y += Up(p[d]) : E === TR ? y += hs.transform(p[d]) : y += p[d]
			}
		return y
	}
}
const CU = t => typeof t == "number" ? 0 : t;
function PU(t) {
	const i = CR(t);
	return PR(t)(i.map(CU))
}
const Jc = {
	test: SU,
	parse: CR,
	createTransformer: PR,
	getAnimatableNone: PU
}
	, RU = new Set(["brightness", "contrast", "saturate", "opacity"]);
function DU(t) {
	const [i, r] = t.slice(0, -1).split("(");
	if (i === "drop-shadow")
		return t;
	const [o] = r.match(Aw) || [];
	if (!o)
		return t;
	const p = r.replace(o, "");
	let y = RU.has(i) ? 1 : 0;
	return o !== r && (y *= 100),
		i + "(" + y + p + ")"
}
const IU = /\b([a-z-]*)\(.*?\)/gu
	, ab = {
		...Jc,
		getAnimatableNone: t => {
			const i = t.match(IU);
			return i ? i.map(DU).join(" ") : t
		}
	}
	, LU = {
		...tR,
		color: hs,
		backgroundColor: hs,
		outlineColor: hs,
		fill: hs,
		stroke: hs,
		borderColor: hs,
		borderTopColor: hs,
		borderRightColor: hs,
		borderBottomColor: hs,
		borderLeftColor: hs,
		filter: ab,
		WebkitFilter: ab
	}
	, Lw = t => LU[t];
function RR(t, i) {
	let r = Lw(t);
	return r !== ab && (r = Jc),
		r.getAnimatableNone ? r.getAnimatableNone(i) : void 0
}
function OU(t, i, r) {
	let o = 0, p;
	for (; o < t.length && !p;)
		typeof t[o] == "string" && t[o] !== "none" && t[o] !== "0" && (p = t[o]),
			o++;
	if (p && r)
		for (const y of i)
			t[y] = RR(r, p)
}

class DR extends Dw {
	constructor(i, r, o, p) {
		super(i, r, o, p, p == null ? void 0 : p.owner, !0)
	}
	readKeyframes() {
		const { unresolvedKeyframes: i, element: r, name: o } = this;
		if (!r.current)
			return;
		super.readKeyframes();
		for (let L = 0; L < i.length; L++) {
			const k = i[L];
			if (typeof k == "string" && ww(k)) {
				const X = xR(k, r.current);
				X !== void 0 && (i[L] = X)
			}
		}
		if (!vU.has(o) || i.length !== 2)
			return this.resolveNoneKeyframes();
		const [p, y] = i
			, d = PE(p)
			, E = PE(y);
		if (d !== E)
			if (ME(d) && ME(E))
				for (let L = 0; L < i.length; L++) {
					const k = i[L];
					typeof k == "string" && (i[L] = parseFloat(k))
				}
			else
				this.needsMeasurement = !0
	}
	resolveNoneKeyframes() {
		const { unresolvedKeyframes: i, name: r } = this
			, o = [];
		for (let p = 0; p < i.length; p++)
			fU(i[p]) && o.push(p);
		o.length && OU(i, o, r)
	}
	measureInitialState() {
		const { element: i, unresolvedKeyframes: r, name: o } = this;
		if (!i.current)
			return;
		o === "height" && (this.suspendedScrollY = window.pageYOffset),
			this.measuredOrigin = Zd[o](i.measureViewportBox(), window.getComputedStyle(i.current)),
			r[0] = this.measuredOrigin;
		const p = r[r.length - 1];
		p !== void 0 && i.getValue(o, p).jump(p, !1)
	}
	measureEndState() {
		var i;
		const { element: r, name: o, unresolvedKeyframes: p } = this;
		if (!r.current)
			return;
		const y = r.getValue(o);
		y && y.jump(this.measuredOrigin, !1);
		const d = p.length - 1
			, E = p[d];
		p[d] = Zd[o](r.measureViewportBox(), window.getComputedStyle(r.current)),
			E !== null && (this.finalKeyframe = E),
			!((i = this.removedTransforms) === null || i === void 0) && i.length && this.removedTransforms.forEach(([L, k]) => {
				r.getValue(L).set(k)
			}
			),
			this.resolveNoneKeyframes()
	}
}
function FU(t) {
	let i;
	return () => (i === void 0 && (i = t()),
		i)
}
const DE = (t, i) => i === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && (Jc.test(t) || t === "0") && !t.startsWith("url("));
function BU(t) {
	const i = t[0];
	if (t.length === 1)
		return !0;
	for (let r = 0; r < t.length; r++)
		if (t[r] !== i)
			return !0
}
function kU(t, i, r, o) {
	const p = t[0];
	if (p === null)
		return !1;
	const y = t[t.length - 1]
		, d = DE(p, i)
		, E = DE(y, i);
	return !d || !E ? !1 : BU(t) || r === "spring" && o
}

class IR {
	constructor({ autoplay: i = !0, delay: r = 0, type: o = "keyframes", repeat: p = 0, repeatDelay: y = 0, repeatType: d = "loop", ...E }) {
		this.isStopped = !1,
			this.options = {
				autoplay: i,
				delay: r,
				type: o,
				repeat: p,
				repeatDelay: y,
				repeatType: d,
				...E
			},
			this.updateFinishedPromise()
	}
	get resolved() {
		return this._resolved || bU(),
			this._resolved
	}
	onKeyframesResolved(i, r) {
		const { name: o, type: p, velocity: y, delay: d, onComplete: E, onUpdate: L } = this.options;
		if (!kU(i, o, p, y))
			if (d)
				this.options.duration = 0;
			else {
				L == null || L(v0(i, this.options, r)),
					E == null || E(),
					this.resolveFinishedPromise();
				return
			}
		const k = this.initPlayback(i, r);
		k !== !1 && (this._resolved = {
			keyframes: i,
			finalKeyframe: r,
			...k
		},
			this.onPostResolved())
	}
	onPostResolved() { }
	then(i, r) {
		return this.currentFinishedPromise.then(i, r)
	}
	updateFinishedPromise() {
		this.currentFinishedPromise = new Promise(i => {
			this.resolveFinishedPromise = i
		}
		)
	}
}
function LR(t, i) {
	return i ? t * (1e3 / i) : 0
}
const UU = 5;
function OR(t, i, r) {
	const o = Math.max(i - UU, 0);
	return LR(r - t(o), i - o)
}
const J_ = .001
	, NU = .01
	, IE = 10
	, zU = .05
	, GU = 1;
function HU({ duration: t = 800, bounce: i = .25, velocity: r = 0, mass: o = 1 }) {
	let p, y;
	pU(t <= Ul(IE));
	let d = 1 - i;
	d = qc(zU, GU, d),
		t = qc(NU, IE, Nl(t)),
		d < 1 ? (p = k => {
			const X = k * d
				, $ = X * t
				, Z = X - r
				, ge = lb(k, d)
				, be = Math.exp(-$);
			return J_ - Z / ge * be
		}
			,
			y = k => {
				const $ = k * d * t
					, Z = $ * r + r
					, ge = Math.pow(d, 2) * Math.pow(k, 2) * t
					, be = Math.exp(-$)
					, ye = lb(Math.pow(k, 2), d);
				return (-p(k) + J_ > 0 ? -1 : 1) * ((Z - ge) * be) / ye
			}
		) : (p = k => {
			const X = Math.exp(-k * t)
				, $ = (k - r) * t + 1;
			return -J_ + X * $
		}
			,
			y = k => {
				const X = Math.exp(-k * t)
					, $ = (r - k) * (t * t);
				return X * $
			}
		);
	const E = 5 / t
		, L = WU(p, y, E);
	if (t = Ul(t),
		isNaN(L))
		return {
			stiffness: 100,
			damping: 10,
			duration: t
		};
	{
		const k = Math.pow(L, 2) * o;
		return {
			stiffness: k,
			damping: d * 2 * Math.sqrt(o * k),
			duration: t
		}
	}
}
const VU = 12;
function WU(t, i, r) {
	let o = r;
	for (let p = 1; p < VU; p++)
		o = o - t(o) / i(o);
	return o
}
function lb(t, i) {
	return t * Math.sqrt(1 - i * i)
}
const jU = ["duration", "bounce"]
	, XU = ["stiffness", "damping", "mass"];
function LE(t, i) {
	return i.some(r => t[r] !== void 0)
}
function YU(t) {
	let i = {
		velocity: 0,
		stiffness: 100,
		damping: 10,
		mass: 1,
		isResolvedFromDuration: !1,
		...t
	};
	if (!LE(t, XU) && LE(t, jU)) {
		const r = HU(t);
		i = {
			...i,
			...r,
			mass: 1
		},
			i.isResolvedFromDuration = !0
	}
	return i
}
function FR({ keyframes: t, restDelta: i, restSpeed: r, ...o }) {
	const p = t[0]
		, y = t[t.length - 1]
		, d = {
			done: !1,
			value: p
		}
		, { stiffness: E, damping: L, mass: k, duration: X, velocity: $, isResolvedFromDuration: Z } = YU({
			...o,
			velocity: -Nl(o.velocity || 0)
		})
		, ge = $ || 0
		, be = L / (2 * Math.sqrt(E * k))
		, ye = y - p
		, $e = Nl(Math.sqrt(E / k))
		, ce = Math.abs(ye) < 5;
	r || (r = ce ? .01 : 2),
		i || (i = ce ? .005 : .5);
	let ie;
	if (be < 1) {
		const U = lb($e, be);
		ie = re => {
			const ve = Math.exp(-be * $e * re);
			return y - ve * ((ge + be * $e * ye) / U * Math.sin(U * re) + ye * Math.cos(U * re))
		}
	} else if (be === 1)
		ie = U => y - Math.exp(-$e * U) * (ye + (ge + $e * ye) * U);
	else {
		const U = $e * Math.sqrt(be * be - 1);
		ie = re => {
			const ve = Math.exp(-be * $e * re)
				, Be = Math.min(U * re, 300);
			return y - ve * ((ge + be * $e * ye) * Math.sinh(Be) + U * ye * Math.cosh(Be)) / U
		}
	}
	return {
		calculatedDuration: Z && X || null,
		next: U => {
			const re = ie(U);
			if (Z)
				d.done = U >= X;
			else {
				let ve = ge;
				U !== 0 && (be < 1 ? ve = OR(ie, U, re) : ve = 0);
				const Be = Math.abs(ve) <= r
					, Ge = Math.abs(y - re) <= i;
				d.done = Be && Ge
			}
			return d.value = d.done ? y : re,
				d
		}
	}
}
function OE({ keyframes: t, velocity: i = 0, power: r = .8, timeConstant: o = 325, bounceDamping: p = 10, bounceStiffness: y = 500, modifyTarget: d, min: E, max: L, restDelta: k = .5, restSpeed: X }) {
	const $ = t[0]
		, Z = {
			done: !1,
			value: $
		}
		, ge = Ie => E !== void 0 && Ie < E || L !== void 0 && Ie > L
		, be = Ie => E === void 0 ? L : L === void 0 || Math.abs(E - Ie) < Math.abs(L - Ie) ? E : L;
	let ye = r * i;
	const $e = $ + ye
		, ce = d === void 0 ? $e : d($e);
	ce !== $e && (ye = ce - $);
	const ie = Ie => -ye * Math.exp(-Ie / o)
		, U = Ie => ce + ie(Ie)
		, re = Ie => {
			const Pt = ie(Ie)
				, vt = U(Ie);
			Z.done = Math.abs(Pt) <= k,
				Z.value = Z.done ? ce : vt
		}
		;
	let ve, Be;
	const Ge = Ie => {
		ge(Z.value) && (ve = Ie,
			Be = FR({
				keyframes: [Z.value, be(Z.value)],
				velocity: OR(U, Ie, Z.value),
				damping: p,
				stiffness: y,
				restDelta: k,
				restSpeed: X
			}))
	}
		;
	return Ge(0),
	{
		calculatedDuration: null,
		next: Ie => {
			let Pt = !1;
			return !Be && ve === void 0 && (Pt = !0,
				re(Ie),
				Ge(Ie)),
				ve !== void 0 && Ie >= ve ? Be.next(Ie - ve) : (!Pt && re(Ie),
					Z)
		}
	}
}
const BR = (t, i, r) => (((1 - 3 * r + 3 * i) * t + (3 * r - 6 * i)) * t + 3 * i) * t
	, QU = 1e-7
	, KU = 12;
function qU(t, i, r, o, p) {
	let y, d, E = 0;
	do
		d = i + (r - i) / 2,
			y = BR(d, o, p) - t,
			y > 0 ? r = d : i = d;
	while (Math.abs(y) > QU && ++E < KU);
	return d
}
function xm(t, i, r, o) {
	if (t === i && r === o)
		return Zr;
	const p = y => qU(y, 0, 1, t, r);
	return y => y === 0 || y === 1 ? y : BR(p(y), i, o)
}
const ZU = xm(.42, 0, 1, 1)
	, JU = xm(0, 0, .58, 1)
	, kR = xm(.42, 0, .58, 1)
	, $U = t => Array.isArray(t) && typeof t[0] != "number"
	, UR = t => i => i <= .5 ? t(2 * i) / 2 : (2 - t(2 * (1 - i))) / 2
	, NR = t => i => 1 - t(1 - i)
	, Ow = t => 1 - Math.sin(Math.acos(t))
	, zR = NR(Ow)
	, eN = UR(Ow)
	, GR = xm(.33, 1.53, .69, .99)
	, Fw = NR(GR)
	, tN = UR(Fw)
	, nN = t => (t *= 2) < 1 ? .5 * Fw(t) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
	, iN = {
		linear: Zr,
		easeIn: ZU,
		easeInOut: kR,
		easeOut: JU,
		circIn: Ow,
		circInOut: eN,
		circOut: zR,
		backIn: Fw,
		backInOut: tN,
		backOut: GR,
		anticipate: nN
	}
	, FE = t => {
		if (Array.isArray(t)) {
			yR(t.length === 4);
			const [i, r, o, p] = t;
			return xm(i, r, o, p)
		} else if (typeof t == "string")
			return iN[t];
		return t
	}
	, lm = (t, i, r) => {
		const o = i - t;
		return o === 0 ? 1 : (r - t) / o
	}
	, ji = (t, i, r) => t + (i - t) * r;
function $_(t, i, r) {
	return r < 0 && (r += 1),
		r > 1 && (r -= 1),
		r < 1 / 6 ? t + (i - t) * 6 * r : r < 1 / 2 ? i : r < 2 / 3 ? t + (i - t) * (2 / 3 - r) * 6 : t
}
function rN({ hue: t, saturation: i, lightness: r, alpha: o }) {
	t /= 360,
		i /= 100,
		r /= 100;
	let p = 0
		, y = 0
		, d = 0;
	if (!i)
		p = y = d = r;
	else {
		const E = r < .5 ? r * (1 + i) : r + i - r * i
			, L = 2 * r - E;
		p = $_(L, E, t + 1 / 3),
			y = $_(L, E, t),
			d = $_(L, E, t - 1 / 3)
	}
	return {
		red: Math.round(p * 255),
		green: Math.round(y * 255),
		blue: Math.round(d * 255),
		alpha: o
	}
}
const ex = (t, i, r) => {
	const o = t * t
		, p = r * (i * i - o) + o;
	return p < 0 ? 0 : Math.sqrt(p)
}
	, sN = [ob, lh, Fd]
	, oN = t => sN.find(i => i.test(t));
function BE(t) {
	const i = oN(t);
	let r = i.parse(t);
	return i === Fd && (r = rN(r)),
		r
}
const kE = (t, i) => {
	const r = BE(t)
		, o = BE(i)
		, p = {
			...r
		};
	return y => (p.red = ex(r.red, o.red, y),
		p.green = ex(r.green, o.green, y),
		p.blue = ex(r.blue, o.blue, y),
		p.alpha = ji(r.alpha, o.alpha, y),
		lh.transform(p))
}
	;
function cb(t, i) {
	return r => r > 0 ? i : t
}
function aN(t, i) {
	return r => ji(t, i, r)
}
function Bw(t) {
	return typeof t == "number" ? aN : typeof t == "string" ? ww(t) ? cb : hs.test(t) ? kE : uN : Array.isArray(t) ? HR : typeof t == "object" ? hs.test(t) ? kE : lN : cb
}
function HR(t, i) {
	const r = [...t]
		, o = r.length
		, p = t.map((y, d) => Bw(y)(y, i[d]));
	return y => {
		for (let d = 0; d < o; d++)
			r[d] = p[d](y);
		return r
	}
}
function lN(t, i) {
	const r = {
		...t,
		...i
	}
		, o = {};
	for (const p in r)
		t[p] !== void 0 && i[p] !== void 0 && (o[p] = Bw(t[p])(t[p], i[p]));
	return p => {
		for (const y in o)
			r[y] = o[y](p);
		return r
	}
}
function cN(t, i) {
	var r;
	const o = []
		, p = {
			color: 0,
			var: 0,
			number: 0
		};
	for (let y = 0; y < i.values.length; y++) {
		const d = i.types[y]
			, E = t.indexes[d][p[d]]
			, L = (r = t.values[E]) !== null && r !== void 0 ? r : 0;
		o[y] = L,
			p[d]++
	}
	return o
}
const uN = (t, i) => {
	const r = Jc.createTransformer(i)
		, o = zv(t)
		, p = zv(i);
	return o.indexes.var.length === p.indexes.var.length && o.indexes.color.length === p.indexes.color.length && o.indexes.number.length >= p.indexes.number.length ? kl(HR(cN(o, p), p.values), r) : cb(t, i)
}
	;
function VR(t, i, r) {
	return typeof t == "number" && typeof i == "number" && typeof r == "number" ? ji(t, i, r) : Bw(t)(t, i)
}
function hN(t, i, r) {
	const o = []
		, p = r || VR
		, y = t.length - 1;
	for (let d = 0; d < y; d++) {
		let E = p(t[d], t[d + 1]);
		if (i) {
			const L = Array.isArray(i) ? i[d] || Zr : i;
			E = kl(L, E)
		}
		o.push(E)
	}
	return o
}
function dN(t, i, { clamp: r = !0, ease: o, mixer: p } = {}) {
	const y = t.length;
	if (yR(y === i.length),
		y === 1)
		return () => i[0];
	if (y === 2 && t[0] === t[1])
		return () => i[1];
	t[0] > t[y - 1] && (t = [...t].reverse(),
		i = [...i].reverse());
	const d = hN(i, o, p)
		, E = d.length
		, L = k => {
			let X = 0;
			if (E > 1)
				for (; X < t.length - 2 && !(k < t[X + 1]); X++)
					;
			const $ = lm(t[X], t[X + 1], k);
			return d[X]($)
		}
		;
	return r ? k => L(qc(t[0], t[y - 1], k)) : L
}
function fN(t, i) {
	const r = t[t.length - 1];
	for (let o = 1; o <= i; o++) {
		const p = lm(0, i, o);
		t.push(ji(r, 1, p))
	}
}
function pN(t) {
	const i = [0];
	return fN(i, t.length - 1),
		i
}
function mN(t, i) {
	return t.map(r => r * i)
}
function gN(t, i) {
	return t.map(() => i || kR).splice(0, t.length - 1)
}
function Gv({ duration: t = 300, keyframes: i, times: r, ease: o = "easeInOut" }) {
	const p = $U(o) ? o.map(FE) : FE(o)
		, y = {
			done: !1,
			value: i[0]
		}
		, d = mN(r && r.length === i.length ? r : pN(i), t)
		, E = dN(d, i, {
			ease: Array.isArray(p) ? p : gN(i, p)
		});
	return {
		calculatedDuration: t,
		next: L => (y.value = E(L),
			y.done = L >= t,
			y)
	}
}
const UE = 2e4;
function vN(t) {
	let i = 0;
	const r = 50;
	let o = t.next(i);
	for (; !o.done && i < UE;)
		i += r,
			o = t.next(i);
	return i >= UE ? 1 / 0 : i
}
const yN = t => {
	const i = ({ timestamp: r }) => t(r);
	return {
		start: () => Nr.update(i, !0),
		stop: () => Zc(i),
		now: () => Kr.isProcessing ? Kr.timestamp : Yc.now()
	}
}
	, _N = {
		decay: OE,
		inertia: OE,
		tween: Gv,
		keyframes: Gv,
		spring: FR
	}
	, xN = t => t / 100;

class kw extends IR {
	constructor({ KeyframeResolver: i = Dw, ...r }) {
		super(r),
			this.holdTime = null,
			this.startTime = null,
			this.cancelTime = null,
			this.currentTime = 0,
			this.playbackSpeed = 1,
			this.pendingPlayState = "running",
			this.state = "idle";
		const { name: o, motionValue: p, keyframes: y } = this.options
			, d = (E, L) => this.onKeyframesResolved(E, L);
		o && p && p.owner ? this.resolver = p.owner.resolveKeyframes(y, d, o, p) : this.resolver = new i(y, d, o, p),
			this.resolver.scheduleResolve()
	}
	initPlayback(i) {
		const { type: r = "keyframes", repeat: o = 0, repeatDelay: p = 0, repeatType: y, velocity: d = 0 } = this.options
			, E = _N[r] || Gv;
		let L, k;
		E !== Gv && typeof i[0] != "number" && (L = kl(xN, VR(i[0], i[1])),
			i = [0, 100]);
		const X = E({
			...this.options,
			keyframes: i
		});
		y === "mirror" && (k = E({
			...this.options,
			keyframes: [...i].reverse(),
			velocity: -d
		})),
			X.calculatedDuration === null && (X.calculatedDuration = vN(X));
		const { calculatedDuration: $ } = X
			, Z = $ + p
			, ge = Z * (o + 1) - p;
		return {
			generator: X,
			mirroredGenerator: k,
			mapPercentToKeyframes: L,
			calculatedDuration: $,
			resolvedDuration: Z,
			totalDuration: ge
		}
	}
	onPostResolved() {
		const { autoplay: i = !0 } = this.options;
		this.play(),
			this.pendingPlayState === "paused" || !i ? this.pause() : this.state = this.pendingPlayState
	}
	tick(i, r = !1) {
		const { resolved: o } = this;
		if (!o) {
			const { keyframes: Ie } = this.options;
			return {
				done: !0,
				value: Ie[Ie.length - 1]
			}
		}
		const { finalKeyframe: p, generator: y, mirroredGenerator: d, mapPercentToKeyframes: E, keyframes: L, calculatedDuration: k, totalDuration: X, resolvedDuration: $ } = o;
		if (this.startTime === null)
			return y.next(0);
		const { delay: Z, repeat: ge, repeatType: be, repeatDelay: ye, onUpdate: $e } = this.options;
		this.speed > 0 ? this.startTime = Math.min(this.startTime, i) : this.speed < 0 && (this.startTime = Math.min(i - X / this.speed, this.startTime)),
			r ? this.currentTime = i : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(i - this.startTime) * this.speed;
		const ce = this.currentTime - Z * (this.speed >= 0 ? 1 : -1)
			, ie = this.speed >= 0 ? ce < 0 : ce > X;
		this.currentTime = Math.max(ce, 0),
			this.state === "finished" && this.holdTime === null && (this.currentTime = X);
		let U = this.currentTime
			, re = y;
		if (ge) {
			const Ie = Math.min(this.currentTime, X) / $;
			let Pt = Math.floor(Ie)
				, vt = Ie % 1;
			!vt && Ie >= 1 && (vt = 1),
				vt === 1 && Pt--,
				Pt = Math.min(Pt, ge + 1),
				!!(Pt % 2) && (be === "reverse" ? (vt = 1 - vt,
					ye && (vt -= ye / $)) : be === "mirror" && (re = d)),
				U = qc(0, 1, vt) * $
		}
		const ve = ie ? {
			done: !1,
			value: L[0]
		} : re.next(U);
		E && (ve.value = E(ve.value));
		let { done: Be } = ve;
		!ie && k !== null && (Be = this.speed >= 0 ? this.currentTime >= X : this.currentTime <= 0);
		const Ge = this.holdTime === null && (this.state === "finished" || this.state === "running" && Be);
		return Ge && p !== void 0 && (ve.value = v0(L, this.options, p)),
			$e && $e(ve.value),
			Ge && this.finish(),
			ve
	}
	get duration() {
		const { resolved: i } = this;
		return i ? Nl(i.calculatedDuration) : 0
	}
	get time() {
		return Nl(this.currentTime)
	}
	set time(i) {
		i = Ul(i),
			this.currentTime = i,
			this.holdTime !== null || this.speed === 0 ? this.holdTime = i : this.driver && (this.startTime = this.driver.now() - i / this.speed)
	}
	get speed() {
		return this.playbackSpeed
	}
	set speed(i) {
		const r = this.playbackSpeed !== i;
		this.playbackSpeed = i,
			r && (this.time = Nl(this.currentTime))
	}
	play() {
		if (this.resolver.isScheduled || this.resolver.resume(),
			!this._resolved) {
			this.pendingPlayState = "running";
			return
		}
		if (this.isStopped)
			return;
		const { driver: i = yN, onPlay: r } = this.options;
		this.driver || (this.driver = i(p => this.tick(p))),
			r && r();
		const o = this.driver.now();
		this.holdTime !== null ? this.startTime = o - this.holdTime : (!this.startTime || this.state === "finished") && (this.startTime = o),
			this.state === "finished" && this.updateFinishedPromise(),
			this.cancelTime = this.startTime,
			this.holdTime = null,
			this.state = "running",
			this.driver.start()
	}
	pause() {
		var i;
		if (!this._resolved) {
			this.pendingPlayState = "paused";
			return
		}
		this.state = "paused",
			this.holdTime = (i = this.currentTime) !== null && i !== void 0 ? i : 0
	}
	stop() {
		if (this.resolver.cancel(),
			this.isStopped = !0,
			this.state === "idle")
			return;
		this.teardown();
		const { onStop: i } = this.options;
		i && i()
	}
	complete() {
		this.state !== "running" && this.play(),
			this.pendingPlayState = this.state = "finished",
			this.holdTime = null
	}
	finish() {
		this.teardown(),
			this.state = "finished";
		const { onComplete: i } = this.options;
		i && i()
	}
	cancel() {
		this.cancelTime !== null && this.tick(this.cancelTime),
			this.teardown(),
			this.updateFinishedPromise()
	}
	teardown() {
		this.state = "idle",
			this.stopDriver(),
			this.resolveFinishedPromise(),
			this.updateFinishedPromise(),
			this.startTime = this.cancelTime = null,
			this.resolver.cancel()
	}
	stopDriver() {
		this.driver && (this.driver.stop(),
			this.driver = void 0)
	}
	sample(i) {
		return this.startTime = 0,
			this.tick(i, !0)
	}
}
const WR = t => Array.isArray(t) && typeof t[0] == "number";
function jR(t) {
	return !!(!t || typeof t == "string" && XR[t] || WR(t) || Array.isArray(t) && t.every(jR))
}
const Tp = ([t, i, r, o]) => `cubic-bezier(${t}, ${i}, ${r}, ${o})`
	, XR = {
		linear: "linear",
		ease: "ease",
		easeIn: "ease-in",
		easeOut: "ease-out",
		easeInOut: "ease-in-out",
		circIn: Tp([0, .65, .55, 1]),
		circOut: Tp([.55, 0, 1, .45]),
		backIn: Tp([.31, .01, .66, -.59]),
		backOut: Tp([.33, 1.53, .69, .99])
	};
function YR(t) {
	if (t)
		return WR(t) ? Tp(t) : Array.isArray(t) ? t.map(YR) : XR[t]
}
function bN(t, i, r, { delay: o = 0, duration: p = 300, repeat: y = 0, repeatType: d = "loop", ease: E, times: L } = {}) {
	const k = {
		[i]: r
	};
	L && (k.offset = L);
	const X = YR(E);
	return Array.isArray(X) && (k.easing = X),
		t.animate(k, {
			delay: o,
			duration: p,
			easing: Array.isArray(X) ? "linear" : X,
			fill: "both",
			iterations: y + 1,
			direction: d === "reverse" ? "alternate" : "normal"
		})
}
const wN = FU(() => Object.hasOwnProperty.call(Element.prototype, "animate"))
	, AN = new Set(["opacity", "clipPath", "filter", "transform"])
	, Hv = 10
	, SN = 2e4;
function MN(t) {
	return t.type === "spring" || t.name === "backgroundColor" || !jR(t.ease)
}
function EN(t, i) {
	const r = new kw({
		...i,
		keyframes: t,
		repeat: 0,
		delay: 0
	});
	let o = {
		done: !1,
		value: t[0]
	};
	const p = [];
	let y = 0;
	for (; !o.done && y < SN;)
		o = r.sample(y),
			p.push(o.value),
			y += Hv;
	return {
		times: void 0,
		keyframes: p,
		duration: y - Hv,
		ease: "linear"
	}
}

class NE extends IR {
	constructor(i) {
		super(i);
		const { name: r, motionValue: o, keyframes: p } = this.options;
		this.resolver = new DR(p, (y, d) => this.onKeyframesResolved(y, d), r, o),
			this.resolver.scheduleResolve()
	}
	initPlayback(i, r) {
		var o;
		let { duration: p = 300, motionValue: y, name: d } = this.options;
		if (!(!((o = y.owner) === null || o === void 0) && o.current))
			return !1;
		if (MN(this.options)) {
			const { onComplete: L, onUpdate: k, motionValue: X, ...$ } = this.options
				, Z = EN(i, $);
			i = Z.keyframes,
				p = Z.duration,
				this.options.times = Z.times,
				this.options.ease = Z.ease
		}
		const E = bN(y.owner.current, d, i, {
			...this.options,
			duration: p
		});
		return E.startTime = Yc.now(),
			this.pendingTimeline ? (E.timeline = this.pendingTimeline,
				this.pendingTimeline = void 0) : E.onfinish = () => {
					const { onComplete: L } = this.options;
					y.set(v0(i, this.options, r)),
						L && L(),
						this.cancel(),
						this.resolveFinishedPromise()
				}
			,
		{
			animation: E,
			duration: p,
			keyframes: i
		}
	}
	get duration() {
		const { resolved: i } = this;
		if (!i)
			return 0;
		const { duration: r } = i;
		return Nl(r)
	}
	get time() {
		const { resolved: i } = this;
		if (!i)
			return 0;
		const { animation: r } = i;
		return Nl(r.currentTime || 0)
	}
	set time(i) {
		const { resolved: r } = this;
		if (!r)
			return;
		const { animation: o } = r;
		o.currentTime = Ul(i)
	}
	get speed() {
		const { resolved: i } = this;
		if (!i)
			return 1;
		const { animation: r } = i;
		return r.playbackRate
	}
	set speed(i) {
		const { resolved: r } = this;
		if (!r)
			return;
		const { animation: o } = r;
		o.playbackRate = i
	}
	get state() {
		const { resolved: i } = this;
		if (!i)
			return "idle";
		const { animation: r } = i;
		return r.playState
	}
	attachTimeline(i) {
		if (!this._resolved)
			this.pendingTimeline = i;
		else {
			const { resolved: r } = this;
			if (!r)
				return Zr;
			const { animation: o } = r;
			o.timeline = i,
				o.onfinish = null
		}
		return Zr
	}
	play() {
		if (this.isStopped)
			return;
		const { resolved: i } = this;
		if (!i)
			return;
		const { animation: r } = i;
		r.playState === "finished" && this.updateFinishedPromise(),
			r.play()
	}
	pause() {
		const { resolved: i } = this;
		if (!i)
			return;
		const { animation: r } = i;
		r.pause()
	}
	stop() {
		if (this.resolver.cancel(),
			this.isStopped = !0,
			this.state === "idle")
			return;
		const { resolved: i } = this;
		if (!i)
			return;
		const { animation: r, keyframes: o } = i;
		if (!(r.playState === "idle" || r.playState === "finished")) {
			if (this.time) {
				const { motionValue: p, onUpdate: y, onComplete: d, ...E } = this.options
					, L = new kw({
						...E,
						keyframes: o
					})
					, k = Ul(this.time);
				p.setWithVelocity(L.sample(k - Hv).value, L.sample(k).value, Hv)
			}
			this.cancel()
		}
	}
	complete() {
		const { resolved: i } = this;
		i && i.animation.finish()
	}
	cancel() {
		const { resolved: i } = this;
		i && i.animation.cancel()
	}
	static supports(i) {
		const { motionValue: r, name: o, repeatDelay: p, repeatType: y, damping: d, type: E } = i;
		return wN() && o && AN.has(o) && r && r.owner && r.owner.current instanceof HTMLElement && !r.owner.getProps().onUpdate && !p && y !== "mirror" && d !== 0 && E !== "inertia"
	}
}
const Uw = (t, i, r, o = {}, p, y) => d => {
	const E = Rw(o, t) || {}
		, L = E.delay || o.delay || 0;
	let { elapsed: k = 0 } = o;
	k = k - Ul(L);
	let X = {
		keyframes: Array.isArray(r) ? r : [null, r],
		ease: "easeOut",
		velocity: i.getVelocity(),
		...E,
		delay: -k,
		onUpdate: Z => {
			i.set(Z),
				E.onUpdate && E.onUpdate(Z)
		}
		,
		onComplete: () => {
			d(),
				E.onComplete && E.onComplete()
		}
		,
		name: t,
		motionValue: i,
		element: y ? void 0 : p
	};
	uU(E) || (X = {
		...X,
		...cU(t, X)
	}),
		X.duration && (X.duration = Ul(X.duration)),
		X.repeatDelay && (X.repeatDelay = Ul(X.repeatDelay)),
		X.from !== void 0 && (X.keyframes[0] = X.from);
	let $ = !1;
	if (X.type === !1 && (X.duration = 0,
		X.delay === 0 && ($ = !0)),
		$ && !y && i.get() !== void 0) {
		const Z = v0(X.keyframes, E);
		if (Z !== void 0) {
			Nr.update(() => {
				X.onUpdate(Z),
					X.onComplete()
			}
			);
			return
		}
	}
	return !y && NE.supports(X) ? new NE(X) : new kw(X)
}
	;
function Vv(t) {
	return !!(fs(t) && t.add)
}
function Nw(t, i) {
	t.indexOf(i) === -1 && t.push(i)
}
function zw(t, i) {
	const r = t.indexOf(i);
	r > -1 && t.splice(r, 1)
}

class Gw {
	constructor() {
		this.subscriptions = []
	}
	add(i) {
		return Nw(this.subscriptions, i),
			() => zw(this.subscriptions, i)
	}
	notify(i, r, o) {
		const p = this.subscriptions.length;
		if (p)
			if (p === 1)
				this.subscriptions[0](i, r, o);
			else
				for (let y = 0; y < p; y++) {
					const d = this.subscriptions[y];
					d && d(i, r, o)
				}
	}
	getSize() {
		return this.subscriptions.length
	}
	clear() {
		this.subscriptions.length = 0
	}
}
const zE = 30
	, TN = t => !isNaN(parseFloat(t));

class CN {
	constructor(i, r = {}) {
		this.version = "11.0.20",
			this.canTrackVelocity = !1,
			this.events = {},
			this.updateAndNotify = (o, p = !0) => {
				const y = Yc.now();
				this.updatedAt !== y && this.setPrevFrameValue(),
					this.prev = this.current,
					this.setCurrent(o),
					this.current !== this.prev && this.events.change && this.events.change.notify(this.current),
					p && this.events.renderRequest && this.events.renderRequest.notify(this.current)
			}
			,
			this.hasAnimated = !1,
			this.setCurrent(i),
			this.canTrackVelocity = TN(this.current),
			this.owner = r.owner
	}
	setCurrent(i) {
		this.current = i,
			this.updatedAt = Yc.now()
	}
	setPrevFrameValue(i = this.current) {
		this.prevFrameValue = i,
			this.prevUpdatedAt = this.updatedAt
	}
	onChange(i) {
		return this.on("change", i)
	}
	on(i, r) {
		this.events[i] || (this.events[i] = new Gw);
		const o = this.events[i].add(r);
		return i === "change" ? () => {
			o(),
				Nr.read(() => {
					this.events.change.getSize() || this.stop()
				}
				)
		}
			: o
	}
	clearListeners() {
		for (const i in this.events)
			this.events[i].clear()
	}
	attach(i, r) {
		this.passiveEffect = i,
			this.stopPassiveEffect = r
	}
	set(i, r = !0) {
		!r || !this.passiveEffect ? this.updateAndNotify(i, r) : this.passiveEffect(i, this.updateAndNotify)
	}
	setWithVelocity(i, r, o) {
		this.set(r),
			this.prev = void 0,
			this.prevFrameValue = i,
			this.prevUpdatedAt = this.updatedAt - o
	}
	jump(i, r = !0) {
		this.updateAndNotify(i),
			this.prev = i,
			this.prevUpdatedAt = this.prevFrameValue = void 0,
			r && this.stop(),
			this.stopPassiveEffect && this.stopPassiveEffect()
	}
	get() {
		return this.current
	}
	getPrevious() {
		return this.prev
	}
	getVelocity() {
		const i = Yc.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || i - this.updatedAt > zE)
			return 0;
		const r = Math.min(this.updatedAt - this.prevUpdatedAt, zE);
		return LR(parseFloat(this.current) - parseFloat(this.prevFrameValue), r)
	}
	start(i) {
		return this.stop(),
			new Promise(r => {
				this.hasAnimated = !0,
					this.animation = i(r),
					this.events.animationStart && this.events.animationStart.notify()
			}
			).then(() => {
				this.events.animationComplete && this.events.animationComplete.notify(),
					this.clearAnimation()
			}
			)
	}
	stop() {
		this.animation && (this.animation.stop(),
			this.events.animationCancel && this.events.animationCancel.notify()),
			this.clearAnimation()
	}
	isAnimating() {
		return !!this.animation
	}
	clearAnimation() {
		delete this.animation
	}
	destroy() {
		this.clearListeners(),
			this.stop(),
			this.stopPassiveEffect && this.stopPassiveEffect()
	}
}
function cm(t, i) {
	return new CN(t, i)
}
function PN(t, i, r) {
	t.hasValue(i) ? t.getValue(i).set(r) : t.addValue(i, cm(r))
}
function RN(t, i) {
	const r = g0(t, i);
	let { transitionEnd: o = {}, transition: p = {}, ...y } = r || {};
	y = {
		...y,
		...o
	};
	for (const d in y) {
		const E = U3(y[d]);
		PN(t, d, E)
	}
}
function DN({ protectedKeys: t, needsAnimating: i }, r) {
	const o = t.hasOwnProperty(r) && i[r] !== !0;
	return i[r] = !1,
		o
}
function QR(t, i, { delay: r = 0, transitionOverride: o, type: p } = {}) {
	var y;
	let { transition: d = t.getDefaultTransition(), transitionEnd: E, ...L } = i;
	const k = t.getValue("willChange");
	o && (d = o);
	const X = []
		, $ = p && t.animationState && t.animationState.getState()[p];
	for (const Z in L) {
		const ge = t.getValue(Z, (y = t.latestValues[Z]) !== null && y !== void 0 ? y : null)
			, be = L[Z];
		if (be === void 0 || $ && DN($, Z))
			continue;
		const ye = {
			delay: r,
			elapsed: 0,
			...Rw(d || {}, Z)
		};
		let $e = !1;
		if (window.HandoffAppearAnimations) {
			const ie = t.getProps()[QP];
			if (ie) {
				const U = window.HandoffAppearAnimations(ie, Z);
				U !== null && (ye.elapsed = U,
					$e = !0)
			}
		}
		ge.start(Uw(Z, ge, be, t.shouldReduceMotion && xh.has(Z) ? {
			type: !1
		} : ye, t, $e));
		const ce = ge.animation;
		ce && (Vv(k) && (k.add(Z),
			ce.then(() => k.remove(Z))),
			X.push(ce))
	}
	return E && Promise.all(X).then(() => {
		Nr.update(() => {
			E && RN(t, E)
		}
		)
	}
	),
		X
}
function ub(t, i, r = {}) {
	var o;
	const p = g0(t, i, r.type === "exit" ? (o = t.presenceContext) === null || o === void 0 ? void 0 : o.custom : void 0);
	let { transition: y = t.getDefaultTransition() || {} } = p || {};
	r.transitionOverride && (y = r.transitionOverride);
	const d = p ? () => Promise.all(QR(t, p, r)) : () => Promise.resolve()
		, E = t.variantChildren && t.variantChildren.size ? (k = 0) => {
			const { delayChildren: X = 0, staggerChildren: $, staggerDirection: Z } = y;
			return IN(t, i, X + k, $, Z, r)
		}
			: () => Promise.resolve()
		, { when: L } = y;
	if (L) {
		const [k, X] = L === "beforeChildren" ? [d, E] : [E, d];
		return k().then(() => X())
	} else
		return Promise.all([d(), E(r.delay)])
}
function IN(t, i, r = 0, o = 0, p = 1, y) {
	const d = []
		, E = (t.variantChildren.size - 1) * o
		, L = p === 1 ? (k = 0) => k * o : (k = 0) => E - k * o;
	return Array.from(t.variantChildren).sort(LN).forEach((k, X) => {
		k.notify("AnimationStart", i),
			d.push(ub(k, i, {
				...y,
				delay: r + L(X)
			}).then(() => k.notify("AnimationComplete", i)))
	}
	),
		Promise.all(d)
}
function LN(t, i) {
	return t.sortNodePosition(i)
}
function ON(t, i, r = {}) {
	t.notify("AnimationStart", i);
	let o;
	if (Array.isArray(i)) {
		const p = i.map(y => ub(t, y, r));
		o = Promise.all(p)
	} else if (typeof i == "string")
		o = ub(t, i, r);
	else {
		const p = typeof i == "function" ? g0(t, i, r.custom) : i;
		o = Promise.all(QR(t, p, r))
	}
	return o.then(() => {
		Nr.postRender(() => {
			t.notify("AnimationComplete", i)
		}
		)
	}
	)
}
const FN = [...yw].reverse()
	, BN = yw.length;
function kN(t) {
	return i => Promise.all(i.map(({ animation: r, options: o }) => ON(t, r, o)))
}
function UN(t) {
	let i = kN(t);
	const r = zN();
	let o = !0;
	const p = L => (k, X) => {
		var $;
		const Z = g0(t, X, L === "exit" ? ($ = t.presenceContext) === null || $ === void 0 ? void 0 : $.custom : void 0);
		if (Z) {
			const { transition: ge, transitionEnd: be, ...ye } = Z;
			k = {
				...k,
				...ye,
				...be
			}
		}
		return k
	}
		;
	function y(L) {
		i = L(t)
	}
	function d(L) {
		const k = t.getProps()
			, X = t.getVariantContext(!0) || {}
			, $ = []
			, Z = new Set;
		let ge = {}
			, be = 1 / 0;
		for (let $e = 0; $e < BN; $e++) {
			const ce = FN[$e]
				, ie = r[ce]
				, U = k[ce] !== void 0 ? k[ce] : X[ce]
				, re = om(U)
				, ve = ce === L ? ie.isActive : null;
			ve === !1 && (be = $e);
			let Be = U === X[ce] && U !== k[ce] && re;
			if (Be && o && t.manuallyAnimateOnMount && (Be = !1),
				ie.protectedKeys = {
					...ge
				},
				!ie.isActive && ve === null || !U && !ie.prevProp || f0(U) || typeof U == "boolean")
				continue;
			let Ie = NN(ie.prevProp, U) || ce === L && ie.isActive && !Be && re || $e > be && re
				, Pt = !1;
			const vt = Array.isArray(U) ? U : [U];
			let Mn = vt.reduce(p(ce), {});
			ve === !1 && (Mn = {});
			const { prevResolvedValues: Oi = {} } = ie
				, Fi = {
					...Oi,
					...Mn
				}
				, $r = Ei => {
					Ie = !0,
						Z.has(Ei) && (Pt = !0,
							Z.delete(Ei)),
						ie.needsAnimating[Ei] = !0
				}
				;
			for (const Ei in Fi) {
				const gr = Mn[Ei]
					, ms = Oi[Ei];
				if (ge.hasOwnProperty(Ei))
					continue;
				let mt = !1;
				nb(gr) && nb(ms) ? mt = !gR(gr, ms) : mt = gr !== ms,
					mt ? gr != null ? $r(Ei) : Z.add(Ei) : gr !== void 0 && Z.has(Ei) ? $r(Ei) : ie.protectedKeys[Ei] = !0
			}
			ie.prevProp = U,
				ie.prevResolvedValues = Mn,
				ie.isActive && (ge = {
					...ge,
					...Mn
				}),
				o && t.blockInitialAnimation && (Ie = !1),
				Ie && (!Be || Pt) && $.push(...vt.map(Ei => ({
					animation: Ei,
					options: {
						type: ce
					}
				})))
		}
		if (Z.size) {
			const $e = {};
			Z.forEach(ce => {
				const ie = t.getBaseTarget(ce);
				$e[ce] = ie === void 0 ? null : ie
			}
			),
				$.push({
					animation: $e
				})
		}
		let ye = !!$.length;
		return o && (k.initial === !1 || k.initial === k.animate) && !t.manuallyAnimateOnMount && (ye = !1),
			o = !1,
			ye ? i($) : Promise.resolve()
	}
	function E(L, k) {
		var X;
		if (r[L].isActive === k)
			return Promise.resolve();
		(X = t.variantChildren) === null || X === void 0 || X.forEach(Z => {
			var ge;
			return (ge = Z.animationState) === null || ge === void 0 ? void 0 : ge.setActive(L, k)
		}
		),
			r[L].isActive = k;
		const $ = d(L);
		for (const Z in r)
			r[Z].protectedKeys = {};
		return $
	}
	return {
		animateChanges: d,
		setActive: E,
		setAnimateFunction: y,
		getState: () => r
	}
}
function NN(t, i) {
	return typeof i == "string" ? i !== t : Array.isArray(i) ? !gR(i, t) : !1
}
function $u(t = !1) {
	return {
		isActive: t,
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	}
}
function zN() {
	return {
		animate: $u(!0),
		whileInView: $u(),
		whileHover: $u(),
		whileTap: $u(),
		whileDrag: $u(),
		whileFocus: $u(),
		exit: $u()
	}
}

class GN extends iu {
	constructor(i) {
		super(i),
			i.animationState || (i.animationState = UN(i))
	}
	updateAnimationControlsSubscription() {
		const { animate: i } = this.node.getProps();
		this.unmount(),
			f0(i) && (this.unmount = i.subscribe(this.node))
	}
	mount() {
		this.updateAnimationControlsSubscription()
	}
	update() {
		const { animate: i } = this.node.getProps()
			, { animate: r } = this.node.prevProps || {};
		i !== r && this.updateAnimationControlsSubscription()
	}
	unmount() { }
}
let HN = 0;

class VN extends iu {
	constructor() {
		super(...arguments),
			this.id = HN++
	}
	update() {
		if (!this.node.presenceContext)
			return;
		const { isPresent: i, onExitComplete: r } = this.node.presenceContext
			, { isPresent: o } = this.node.prevPresenceContext || {};
		if (!this.node.animationState || i === o)
			return;
		const p = this.node.animationState.setActive("exit", !i);
		r && !i && p.then(() => r(this.id))
	}
	mount() {
		const { register: i } = this.node.presenceContext || {};
		i && (this.unmount = i(this.id))
	}
	unmount() { }
}
const WN = {
	animation: {
		Feature: GN
	},
	exit: {
		Feature: VN
	}
}
	, GE = (t, i) => Math.abs(t - i);
function jN(t, i) {
	const r = GE(t.x, i.x)
		, o = GE(t.y, i.y);
	return Math.sqrt(r ** 2 + o ** 2)
}

class KR {
	constructor(i, r, { transformPagePoint: o, contextWindow: p, dragSnapToOrigin: y = !1 } = {}) {
		if (this.startEvent = null,
			this.lastMoveEvent = null,
			this.lastMoveEventInfo = null,
			this.handlers = {},
			this.contextWindow = window,
			this.updatePoint = () => {
				if (!(this.lastMoveEvent && this.lastMoveEventInfo))
					return;
				const $ = nx(this.lastMoveEventInfo, this.history)
					, Z = this.startEvent !== null
					, ge = jN($.offset, {
						x: 0,
						y: 0
					}) >= 3;
				if (!Z && !ge)
					return;
				const { point: be } = $
					, { timestamp: ye } = Kr;
				this.history.push({
					...be,
					timestamp: ye
				});
				const { onStart: $e, onMove: ce } = this.handlers;
				Z || ($e && $e(this.lastMoveEvent, $),
					this.startEvent = this.lastMoveEvent),
					ce && ce(this.lastMoveEvent, $)
			}
			,
			this.handlePointerMove = ($, Z) => {
				this.lastMoveEvent = $,
					this.lastMoveEventInfo = tx(Z, this.transformPagePoint),
					Nr.update(this.updatePoint, !0)
			}
			,
			this.handlePointerUp = ($, Z) => {
				this.end();
				const { onEnd: ge, onSessionEnd: be, resumeAnimation: ye } = this.handlers;
				if (this.dragSnapToOrigin && ye && ye(),
					!(this.lastMoveEvent && this.lastMoveEventInfo))
					return;
				const $e = nx($.type === "pointercancel" ? this.lastMoveEventInfo : tx(Z, this.transformPagePoint), this.history);
				this.startEvent && ge && ge($, $e),
					be && be($, $e)
			}
			,
			!hR(i))
			return;
		this.dragSnapToOrigin = y,
			this.handlers = r,
			this.transformPagePoint = o,
			this.contextWindow = p || window;
		const d = m0(i)
			, E = tx(d, this.transformPagePoint)
			, { point: L } = E
			, { timestamp: k } = Kr;
		this.history = [{
			...L,
			timestamp: k
		}];
		const { onSessionStart: X } = r;
		X && X(i, nx(E, this.history)),
			this.removeListeners = kl(Bl(this.contextWindow, "pointermove", this.handlePointerMove), Bl(this.contextWindow, "pointerup", this.handlePointerUp), Bl(this.contextWindow, "pointercancel", this.handlePointerUp))
	}
	updateHandlers(i) {
		this.handlers = i
	}
	end() {
		this.removeListeners && this.removeListeners(),
			Zc(this.updatePoint)
	}
}
function tx(t, i) {
	return i ? {
		point: i(t.point)
	} : t
}
function HE(t, i) {
	return {
		x: t.x - i.x,
		y: t.y - i.y
	}
}
function nx({ point: t }, i) {
	return {
		point: t,
		delta: HE(t, qR(i)),
		offset: HE(t, XN(i)),
		velocity: YN(i, .1)
	}
}
function XN(t) {
	return t[0]
}
function qR(t) {
	return t[t.length - 1]
}
function YN(t, i) {
	if (t.length < 2)
		return {
			x: 0,
			y: 0
		};
	let r = t.length - 1
		, o = null;
	const p = qR(t);
	for (; r >= 0 && (o = t[r],
		!(p.timestamp - o.timestamp > Ul(i)));)
		r--;
	if (!o)
		return {
			x: 0,
			y: 0
		};
	const y = Nl(p.timestamp - o.timestamp);
	if (y === 0)
		return {
			x: 0,
			y: 0
		};
	const d = {
		x: (p.x - o.x) / y,
		y: (p.y - o.y) / y
	};
	return d.x === 1 / 0 && (d.x = 0),
		d.y === 1 / 0 && (d.y = 0),
		d
}
function fo(t) {
	return t.max - t.min
}
function hb(t, i = 0, r = .01) {
	return Math.abs(t - i) <= r
}
function VE(t, i, r, o = .5) {
	t.origin = o,
		t.originPoint = ji(i.min, i.max, t.origin),
		t.scale = fo(r) / fo(i),
		(hb(t.scale, 1, 1e-4) || isNaN(t.scale)) && (t.scale = 1),
		t.translate = ji(r.min, r.max, t.origin) - t.originPoint,
		(hb(t.translate) || isNaN(t.translate)) && (t.translate = 0)
}
function Np(t, i, r, o) {
	VE(t.x, i.x, r.x, o ? o.originX : void 0),
		VE(t.y, i.y, r.y, o ? o.originY : void 0)
}
function WE(t, i, r) {
	t.min = r.min + i.min,
		t.max = t.min + fo(i)
}
function QN(t, i, r) {
	WE(t.x, i.x, r.x),
		WE(t.y, i.y, r.y)
}
function jE(t, i, r) {
	t.min = i.min - r.min,
		t.max = t.min + fo(i)
}
function zp(t, i, r) {
	jE(t.x, i.x, r.x),
		jE(t.y, i.y, r.y)
}
function KN(t, { min: i, max: r }, o) {
	return i !== void 0 && t < i ? t = o ? ji(i, t, o.min) : Math.max(t, i) : r !== void 0 && t > r && (t = o ? ji(r, t, o.max) : Math.min(t, r)),
		t
}
function XE(t, i, r) {
	return {
		min: i !== void 0 ? t.min + i : void 0,
		max: r !== void 0 ? t.max + r - (t.max - t.min) : void 0
	}
}
function qN(t, { top: i, left: r, bottom: o, right: p }) {
	return {
		x: XE(t.x, r, p),
		y: XE(t.y, i, o)
	}
}
function YE(t, i) {
	let r = i.min - t.min
		, o = i.max - t.max;
	return i.max - i.min < t.max - t.min && ([r, o] = [o, r]),
	{
		min: r,
		max: o
	}
}
function ZN(t, i) {
	return {
		x: YE(t.x, i.x),
		y: YE(t.y, i.y)
	}
}
function JN(t, i) {
	let r = .5;
	const o = fo(t)
		, p = fo(i);
	return p > o ? r = lm(i.min, i.max - o, t.min) : o > p && (r = lm(t.min, t.max - p, i.min)),
		qc(0, 1, r)
}
function $N(t, i) {
	const r = {};
	return i.min !== void 0 && (r.min = i.min - t.min),
		i.max !== void 0 && (r.max = i.max - t.min),
		r
}
const db = .35;
function ez(t = db) {
	return t === !1 ? t = 0 : t === !0 && (t = db),
	{
		x: QE(t, "left", "right"),
		y: QE(t, "top", "bottom")
	}
}
function QE(t, i, r) {
	return {
		min: KE(t, i),
		max: KE(t, r)
	}
}
function KE(t, i) {
	return typeof t == "number" ? t : t[i] || 0
}
const qE = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
})
	, Bd = () => ({
		x: qE(),
		y: qE()
	})
	, ZE = () => ({
		min: 0,
		max: 0
	})
	, or = () => ({
		x: ZE(),
		y: ZE()
	});
function Fo(t) {
	return [t("x"), t("y")]
}
function ZR({ top: t, left: i, right: r, bottom: o }) {
	return {
		x: {
			min: i,
			max: r
		},
		y: {
			min: t,
			max: o
		}
	}
}
function tz({ x: t, y: i }) {
	return {
		top: i.min,
		right: t.max,
		bottom: i.max,
		left: t.min
	}
}
function nz(t, i) {
	if (!i)
		return t;
	const r = i({
		x: t.left,
		y: t.top
	})
		, o = i({
			x: t.right,
			y: t.bottom
		});
	return {
		top: r.y,
		left: r.x,
		bottom: o.y,
		right: o.x
	}
}
function ix(t) {
	return t === void 0 || t === 1
}
function fb({ scale: t, scaleX: i, scaleY: r }) {
	return !ix(t) || !ix(i) || !ix(r)
}
function nh(t) {
	return fb(t) || JR(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY
}
function JR(t) {
	return JE(t.x) || JE(t.y)
}
function JE(t) {
	return t && t !== "0%"
}
function Wv(t, i, r) {
	const o = t - r
		, p = i * o;
	return r + p
}
function $E(t, i, r, o, p) {
	return p !== void 0 && (t = Wv(t, p, o)),
		Wv(t, r, o) + i
}
function pb(t, i = 0, r = 1, o, p) {
	t.min = $E(t.min, i, r, o, p),
		t.max = $E(t.max, i, r, o, p)
}
function $R(t, { x: i, y: r }) {
	pb(t.x, i.translate, i.scale, i.originPoint),
		pb(t.y, r.translate, r.scale, r.originPoint)
}
function iz(t, i, r, o = !1) {
	const p = r.length;
	if (!p)
		return;
	i.x = i.y = 1;
	let y, d;
	for (let E = 0; E < p; E++) {
		y = r[E],
			d = y.projectionDelta;
		const L = y.instance;
		L && L.style && L.style.display === "contents" || (o && y.options.layoutScroll && y.scroll && y !== y.root && kd(t, {
			x: -y.scroll.offset.x,
			y: -y.scroll.offset.y
		}),
			d && (i.x *= d.x.scale,
				i.y *= d.y.scale,
				$R(t, d)),
			o && nh(y.latestValues) && kd(t, y.latestValues))
	}
	i.x = eT(i.x),
		i.y = eT(i.y)
}
function eT(t) {
	return Number.isInteger(t) || t > 1.0000000000001 || t < .999999999999 ? t : 1
}
function Oc(t, i) {
	t.min = t.min + i,
		t.max = t.max + i
}
function tT(t, i, [r, o, p]) {
	const y = i[p] !== void 0 ? i[p] : .5
		, d = ji(t.min, t.max, y);
	pb(t, i[r], i[o], d, i.scale)
}
const rz = ["x", "scaleX", "originX"]
	, sz = ["y", "scaleY", "originY"];
function kd(t, i) {
	tT(t.x, i, rz),
		tT(t.y, i, sz)
}
function e2(t, i) {
	return ZR(nz(t.getBoundingClientRect(), i))
}
function oz(t, i, r) {
	const o = e2(t, r)
		, { scroll: p } = i;
	return p && (Oc(o.x, p.offset.x),
		Oc(o.y, p.offset.y)),
		o
}
const t2 = ({ current: t }) => t ? t.ownerDocument.defaultView : null
	, az = new WeakMap;

class lz {
	constructor(i) {
		this.openGlobalLock = null,
			this.isDragging = !1,
			this.currentDirection = null,
			this.originPoint = {
				x: 0,
				y: 0
			},
			this.constraints = !1,
			this.hasMutatedConstraints = !1,
			this.elastic = or(),
			this.visualElement = i
	}
	start(i, { snapToCursor: r = !1 } = {}) {
		const { presenceContext: o } = this.visualElement;
		if (o && o.isPresent === !1)
			return;
		const p = X => {
			const { dragSnapToOrigin: $ } = this.getProps();
			$ ? this.pauseAnimation() : this.stopAnimation(),
				r && this.snapToCursor(m0(X, "page").point)
		}
			, y = (X, $) => {
				const { drag: Z, dragPropagation: ge, onDragStart: be } = this.getProps();
				if (Z && !ge && (this.openGlobalLock && this.openGlobalLock(),
					this.openGlobalLock = fR(Z),
					!this.openGlobalLock))
					return;
				this.isDragging = !0,
					this.currentDirection = null,
					this.resolveConstraints(),
					this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0,
						this.visualElement.projection.target = void 0),
					Fo($e => {
						let ce = this.getAxisMotionValue($e).get() || 0;
						if (el.test(ce)) {
							const { projection: ie } = this.visualElement;
							if (ie && ie.layout) {
								const U = ie.layout.layoutBox[$e];
								U && (ce = fo(U) * (parseFloat(ce) / 100))
							}
						}
						this.originPoint[$e] = ce
					}
					),
					be && be(X, $);
				const { animationState: ye } = this.visualElement;
				ye && ye.setActive("whileDrag", !0)
			}
			, d = (X, $) => {
				const { dragPropagation: Z, dragDirectionLock: ge, onDirectionLock: be, onDrag: ye } = this.getProps();
				if (!Z && !this.openGlobalLock)
					return;
				const { offset: $e } = $;
				if (ge && this.currentDirection === null) {
					this.currentDirection = cz($e),
						this.currentDirection !== null && be && be(this.currentDirection);
					return
				}
				this.updateAxis("x", $.point, $e),
					this.updateAxis("y", $.point, $e),
					this.visualElement.render(),
					ye && ye(X, $)
			}
			, E = (X, $) => this.stop(X, $)
			, L = () => Fo(X => {
				var $;
				return this.getAnimationState(X) === "paused" && (($ = this.getAxisMotionValue(X).animation) === null || $ === void 0 ? void 0 : $.play())
			}
			)
			, { dragSnapToOrigin: k } = this.getProps();
		this.panSession = new KR(i, {
			onSessionStart: p,
			onStart: y,
			onMove: d,
			onSessionEnd: E,
			resumeAnimation: L
		}, {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin: k,
			contextWindow: t2(this.visualElement)
		})
	}
	stop(i, r) {
		const o = this.isDragging;
		if (this.cancel(),
			!o)
			return;
		const { velocity: p } = r;
		this.startAnimation(p);
		const { onDragEnd: y } = this.getProps();
		y && y(i, r)
	}
	cancel() {
		this.isDragging = !1;
		const { projection: i, animationState: r } = this.visualElement;
		i && (i.isAnimationBlocked = !1),
			this.panSession && this.panSession.end(),
			this.panSession = void 0;
		const { dragPropagation: o } = this.getProps();
		!o && this.openGlobalLock && (this.openGlobalLock(),
			this.openGlobalLock = null),
			r && r.setActive("whileDrag", !1)
	}
	updateAxis(i, r, o) {
		const { drag: p } = this.getProps();
		if (!o || !Zg(i, p, this.currentDirection))
			return;
		const y = this.getAxisMotionValue(i);
		let d = this.originPoint[i] + o[i];
		this.constraints && this.constraints[i] && (d = KN(d, this.constraints[i], this.elastic[i])),
			y.set(d)
	}
	resolveConstraints() {
		var i;
		const { dragConstraints: r, dragElastic: o } = this.getProps()
			, p = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (i = this.visualElement.projection) === null || i === void 0 ? void 0 : i.layout
			, y = this.constraints;
		r && Od(r) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : r && p ? this.constraints = qN(p.layoutBox, r) : this.constraints = !1,
			this.elastic = ez(o),
			y !== this.constraints && p && this.constraints && !this.hasMutatedConstraints && Fo(d => {
				this.getAxisMotionValue(d) && (this.constraints[d] = $N(p.layoutBox[d], this.constraints[d]))
			}
			)
	}
	resolveRefConstraints() {
		const { dragConstraints: i, onMeasureDragConstraints: r } = this.getProps();
		if (!i || !Od(i))
			return !1;
		const o = i.current
			, { projection: p } = this.visualElement;
		if (!p || !p.layout)
			return !1;
		const y = oz(o, p.root, this.visualElement.getTransformPagePoint());
		let d = ZN(p.layout.layoutBox, y);
		if (r) {
			const E = r(tz(d));
			this.hasMutatedConstraints = !!E,
				E && (d = ZR(E))
		}
		return d
	}
	startAnimation(i) {
		const { drag: r, dragMomentum: o, dragElastic: p, dragTransition: y, dragSnapToOrigin: d, onDragTransitionEnd: E } = this.getProps()
			, L = this.constraints || {}
			, k = Fo(X => {
				if (!Zg(X, r, this.currentDirection))
					return;
				let $ = L && L[X] || {};
				d && ($ = {
					min: 0,
					max: 0
				});
				const Z = p ? 200 : 1e6
					, ge = p ? 40 : 1e7
					, be = {
						type: "inertia",
						velocity: o ? i[X] : 0,
						bounceStiffness: Z,
						bounceDamping: ge,
						timeConstant: 750,
						restDelta: 1,
						restSpeed: 10,
						...y,
						...$
					};
				return this.startAxisValueAnimation(X, be)
			}
			);
		return Promise.all(k).then(E)
	}
	startAxisValueAnimation(i, r) {
		const o = this.getAxisMotionValue(i);
		return o.start(Uw(i, o, 0, r, this.visualElement))
	}
	stopAnimation() {
		Fo(i => this.getAxisMotionValue(i).stop())
	}
	pauseAnimation() {
		Fo(i => {
			var r;
			return (r = this.getAxisMotionValue(i).animation) === null || r === void 0 ? void 0 : r.pause()
		}
		)
	}
	getAnimationState(i) {
		var r;
		return (r = this.getAxisMotionValue(i).animation) === null || r === void 0 ? void 0 : r.state
	}
	getAxisMotionValue(i) {
		const r = "_drag" + i.toUpperCase()
			, o = this.visualElement.getProps()
			, p = o[r];
		return p || this.visualElement.getValue(i, (o.initial ? o.initial[i] : void 0) || 0)
	}
	snapToCursor(i) {
		Fo(r => {
			const { drag: o } = this.getProps();
			if (!Zg(r, o, this.currentDirection))
				return;
			const { projection: p } = this.visualElement
				, y = this.getAxisMotionValue(r);
			if (p && p.layout) {
				const { min: d, max: E } = p.layout.layoutBox[r];
				y.set(i[r] - ji(d, E, .5))
			}
		}
		)
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current)
			return;
		const { drag: i, dragConstraints: r } = this.getProps()
			, { projection: o } = this.visualElement;
		if (!Od(r) || !o || !this.constraints)
			return;
		this.stopAnimation();
		const p = {
			x: 0,
			y: 0
		};
		Fo(d => {
			const E = this.getAxisMotionValue(d);
			if (E) {
				const L = E.get();
				p[d] = JN({
					min: L,
					max: L
				}, this.constraints[d])
			}
		}
		);
		const { transformTemplate: y } = this.visualElement.getProps();
		this.visualElement.current.style.transform = y ? y({}, "") : "none",
			o.root && o.root.updateScroll(),
			o.updateLayout(),
			this.resolveConstraints(),
			Fo(d => {
				if (!Zg(d, i, null))
					return;
				const E = this.getAxisMotionValue(d)
					, { min: L, max: k } = this.constraints[d];
				E.set(ji(L, k, p[d]))
			}
			)
	}
	addListeners() {
		if (!this.visualElement.current)
			return;
		az.set(this.visualElement, this);
		const i = this.visualElement.current
			, r = Bl(i, "pointerdown", L => {
				const { drag: k, dragListener: X = !0 } = this.getProps();
				k && X && this.start(L)
			}
			)
			, o = () => {
				const { dragConstraints: L } = this.getProps();
				Od(L) && (this.constraints = this.resolveRefConstraints())
			}
			, { projection: p } = this.visualElement
			, y = p.addEventListener("measure", o);
		p && !p.layout && (p.root && p.root.updateScroll(),
			p.updateLayout()),
			o();
		const d = Ll(window, "resize", () => this.scalePositionWithinConstraints())
			, E = p.addEventListener("didUpdate", ({ delta: L, hasLayoutChanged: k }) => {
				this.isDragging && k && (Fo(X => {
					const $ = this.getAxisMotionValue(X);
					$ && (this.originPoint[X] += L[X].translate,
						$.set($.get() + L[X].translate))
				}
				),
					this.visualElement.render())
			}
			);
		return () => {
			d(),
				r(),
				y(),
				E && E()
		}
	}
	getProps() {
		const i = this.visualElement.getProps()
			, { drag: r = !1, dragDirectionLock: o = !1, dragPropagation: p = !1, dragConstraints: y = !1, dragElastic: d = db, dragMomentum: E = !0 } = i;
		return {
			...i,
			drag: r,
			dragDirectionLock: o,
			dragPropagation: p,
			dragConstraints: y,
			dragElastic: d,
			dragMomentum: E
		}
	}
}
function Zg(t, i, r) {
	return (i === !0 || i === t) && (r === null || r === t)
}
function cz(t, i = 10) {
	let r = null;
	return Math.abs(t.y) > i ? r = "y" : Math.abs(t.x) > i && (r = "x"),
		r
}

class uz extends iu {
	constructor(i) {
		super(i),
			this.removeGroupControls = Zr,
			this.removeListeners = Zr,
			this.controls = new lz(i)
	}
	mount() {
		const { dragControls: i } = this.node.getProps();
		i && (this.removeGroupControls = i.subscribe(this.controls)),
			this.removeListeners = this.controls.addListeners() || Zr
	}
	unmount() {
		this.removeGroupControls(),
			this.removeListeners()
	}
}
const nT = t => (i, r) => {
	t && t(i, r)
}
	;

class hz extends iu {
	constructor() {
		super(...arguments),
			this.removePointerDownListener = Zr
	}
	onPointerDown(i) {
		this.session = new KR(i, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: t2(this.node)
		})
	}
	createPanHandlers() {
		const { onPanSessionStart: i, onPanStart: r, onPan: o, onPanEnd: p } = this.node.getProps();
		return {
			onSessionStart: nT(i),
			onStart: nT(r),
			onMove: o,
			onEnd: (y, d) => {
				delete this.session,
					p && p(y, d)
			}
		}
	}
	mount() {
		this.removePointerDownListener = Bl(this.node.current, "pointerdown", i => this.onPointerDown(i))
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers())
	}
	unmount() {
		this.removePointerDownListener(),
			this.session && this.session.end()
	}
}
function dz() {
	const t = ht.useContext(d0);
	if (t === null)
		return [!0, null];
	const { isPresent: i, onExitComplete: r, register: o } = t
		, p = ht.useId();
	return ht.useEffect(() => o(p), []),
		!i && r ? [!1, () => r && r(p)] : [!0]
}
const fv = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
};
function iT(t, i) {
	return i.max === i.min ? 0 : t / (i.max - i.min) * 100
}
const wp = {
	correct: (t, i) => {
		if (!i.target)
			return t;
		if (typeof t == "string")
			if (mn.test(t))
				t = parseFloat(t);
			else
				return t;
		const r = iT(t, i.target.x)
			, o = iT(t, i.target.y);
		return `${r}% ${o}%`
	}
}
	, fz = {
		correct: (t, { treeScale: i, projectionDelta: r }) => {
			const o = t
				, p = Jc.parse(t);
			if (p.length > 5)
				return o;
			const y = Jc.createTransformer(t)
				, d = typeof p[0] != "number" ? 1 : 0
				, E = r.x.scale * i.x
				, L = r.y.scale * i.y;
			p[0 + d] /= E,
				p[1 + d] /= L;
			const k = ji(E, L, .5);
			return typeof p[2 + d] == "number" && (p[2 + d] /= k),
				typeof p[3 + d] == "number" && (p[3 + d] /= k),
				y(p)
		}
	};

class pz extends xb.Component {
	componentDidMount() {
		const { visualElement: i, layoutGroup: r, switchLayoutGroup: o, layoutId: p } = this.props
			, { projection: y } = i;
		p3(mz),
			y && (r.group && r.group.add(y),
				o && o.register && p && o.register(y),
				y.root.didUpdate(),
				y.addEventListener("animationComplete", () => {
					this.safeToRemove()
				}
				),
				y.setOptions({
					...y.options,
					onExitComplete: () => this.safeToRemove()
				})),
			fv.hasEverUpdated = !0
	}
	getSnapshotBeforeUpdate(i) {
		const { layoutDependency: r, visualElement: o, drag: p, isPresent: y } = this.props
			, d = o.projection;
		return d && (d.isPresent = y,
			p || i.layoutDependency !== r || r === void 0 ? d.willUpdate() : this.safeToRemove(),
			i.isPresent !== y && (y ? d.promote() : d.relegate() || Nr.postRender(() => {
				const E = d.getStack();
				(!E || !E.members.length) && this.safeToRemove()
			}
			))),
			null
	}
	componentDidUpdate() {
		const { projection: i } = this.props.visualElement;
		i && (i.root.didUpdate(),
			vw.postRender(() => {
				!i.currentAnimation && i.isLead() && this.safeToRemove()
			}
			))
	}
	componentWillUnmount() {
		const { visualElement: i, layoutGroup: r, switchLayoutGroup: o } = this.props
			, { projection: p } = i;
		p && (p.scheduleCheckAfterUnmount(),
			r && r.group && r.group.remove(p),
			o && o.deregister && o.deregister(p))
	}
	safeToRemove() {
		const { safeToRemove: i } = this.props;
		i && i()
	}
	render() {
		return null
	}
}
function n2(t) {
	const [i, r] = dz()
		, o = ht.useContext(xw);
	return xb.createElement(pz, {
		...t,
		layoutGroup: o,
		switchLayoutGroup: ht.useContext(ZP),
		isPresent: i,
		safeToRemove: r
	})
}
const mz = {
	borderRadius: {
		...wp,
		applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]
	},
	borderTopLeftRadius: wp,
	borderTopRightRadius: wp,
	borderBottomLeftRadius: wp,
	borderBottomRightRadius: wp,
	boxShadow: fz
}
	, i2 = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"]
	, gz = i2.length
	, rT = t => typeof t == "string" ? parseFloat(t) : t
	, sT = t => typeof t == "number" || mn.test(t);
function vz(t, i, r, o, p, y) {
	p ? (t.opacity = ji(0, r.opacity !== void 0 ? r.opacity : 1, yz(o)),
		t.opacityExit = ji(i.opacity !== void 0 ? i.opacity : 1, 0, _z(o))) : y && (t.opacity = ji(i.opacity !== void 0 ? i.opacity : 1, r.opacity !== void 0 ? r.opacity : 1, o));
	for (let d = 0; d < gz; d++) {
		const E = `border${i2[d]}Radius`;
		let L = oT(i, E)
			, k = oT(r, E);
		if (L === void 0 && k === void 0)
			continue;
		L || (L = 0),
			k || (k = 0),
			L === 0 || k === 0 || sT(L) === sT(k) ? (t[E] = Math.max(ji(rT(L), rT(k), o), 0),
				(el.test(k) || el.test(L)) && (t[E] += "%")) : t[E] = k
	}
	(i.rotate || r.rotate) && (t.rotate = ji(i.rotate || 0, r.rotate || 0, o))
}
function oT(t, i) {
	return t[i] !== void 0 ? t[i] : t.borderRadius
}
const yz = r2(0, .5, zR)
	, _z = r2(.5, .95, Zr);
function r2(t, i, r) {
	return o => o < t ? 0 : o > i ? 1 : r(lm(t, i, o))
}
function aT(t, i) {
	t.min = i.min,
		t.max = i.max
}
function Oo(t, i) {
	aT(t.x, i.x),
		aT(t.y, i.y)
}
function lT(t, i, r, o, p) {
	return t -= i,
		t = Wv(t, 1 / r, o),
		p !== void 0 && (t = Wv(t, 1 / p, o)),
		t
}
function xz(t, i = 0, r = 1, o = .5, p, y = t, d = t) {
	if (el.test(i) && (i = parseFloat(i),
		i = ji(d.min, d.max, i / 100) - d.min),
		typeof i != "number")
		return;
	let E = ji(y.min, y.max, o);
	t === y && (E -= i),
		t.min = lT(t.min, i, r, E, p),
		t.max = lT(t.max, i, r, E, p)
}
function cT(t, i, [r, o, p], y, d) {
	xz(t, i[r], i[o], i[p], i.scale, y, d)
}
const bz = ["x", "scaleX", "originX"]
	, wz = ["y", "scaleY", "originY"];
function uT(t, i, r, o) {
	cT(t.x, i, bz, r ? r.x : void 0, o ? o.x : void 0),
		cT(t.y, i, wz, r ? r.y : void 0, o ? o.y : void 0)
}
function hT(t) {
	return t.translate === 0 && t.scale === 1
}
function s2(t) {
	return hT(t.x) && hT(t.y)
}
function Az(t, i) {
	return t.x.min === i.x.min && t.x.max === i.x.max && t.y.min === i.y.min && t.y.max === i.y.max
}
function o2(t, i) {
	return Math.round(t.x.min) === Math.round(i.x.min) && Math.round(t.x.max) === Math.round(i.x.max) && Math.round(t.y.min) === Math.round(i.y.min) && Math.round(t.y.max) === Math.round(i.y.max)
}
function dT(t) {
	return fo(t.x) / fo(t.y)
}

class Sz {
	constructor() {
		this.members = []
	}
	add(i) {
		Nw(this.members, i),
			i.scheduleRender()
	}
	remove(i) {
		if (zw(this.members, i),
			i === this.prevLead && (this.prevLead = void 0),
			i === this.lead) {
			const r = this.members[this.members.length - 1];
			r && this.promote(r)
		}
	}
	relegate(i) {
		const r = this.members.findIndex(p => i === p);
		if (r === 0)
			return !1;
		let o;
		for (let p = r; p >= 0; p--) {
			const y = this.members[p];
			if (y.isPresent !== !1) {
				o = y;
				break
			}
		}
		return o ? (this.promote(o),
			!0) : !1
	}
	promote(i, r) {
		const o = this.lead;
		if (i !== o && (this.prevLead = o,
			this.lead = i,
			i.show(),
			o)) {
			o.instance && o.scheduleRender(),
				i.scheduleRender(),
				i.resumeFrom = o,
				r && (i.resumeFrom.preserveOpacity = !0),
				o.snapshot && (i.snapshot = o.snapshot,
					i.snapshot.latestValues = o.animationValues || o.latestValues),
				i.root && i.root.isUpdating && (i.isLayoutDirty = !0);
			const { crossfade: p } = i.options;
			p === !1 && o.hide()
		}
	}
	exitAnimationComplete() {
		this.members.forEach(i => {
			const { options: r, resumingFrom: o } = i;
			r.onExitComplete && r.onExitComplete(),
				o && o.options.onExitComplete && o.options.onExitComplete()
		}
		)
	}
	scheduleRender() {
		this.members.forEach(i => {
			i.instance && i.scheduleRender(!1)
		}
		)
	}
	removeLeadSnapshot() {
		this.lead && this.lead.snapshot && (this.lead.snapshot = void 0)
	}
}
function fT(t, i, r) {
	let o = "";
	const p = t.x.translate / i.x
		, y = t.y.translate / i.y;
	if ((p || y) && (o = `translate3d(${p}px, ${y}px, 0) `),
		(i.x !== 1 || i.y !== 1) && (o += `scale(${1 / i.x}, ${1 / i.y}) `),
		r) {
		const { rotate: L, rotateX: k, rotateY: X, skewX: $, skewY: Z } = r;
		L && (o += `rotate(${L}deg) `),
			k && (o += `rotateX(${k}deg) `),
			X && (o += `rotateY(${X}deg) `),
			$ && (o += `skewX(${$}deg) `),
			Z && (o += `skewY(${Z}deg) `)
	}
	const d = t.x.scale * i.x
		, E = t.y.scale * i.y;
	return (d !== 1 || E !== 1) && (o += `scale(${d}, ${E})`),
		o || "none"
}
const Mz = (t, i) => t.depth - i.depth;

class Ez {
	constructor() {
		this.children = [],
			this.isDirty = !1
	}
	add(i) {
		Nw(this.children, i),
			this.isDirty = !0
	}
	remove(i) {
		zw(this.children, i),
			this.isDirty = !0
	}
	forEach(i) {
		this.isDirty && this.children.sort(Mz),
			this.isDirty = !1,
			this.children.forEach(i)
	}
}
function Tz(t, i) {
	const r = Yc.now()
		, o = ({ timestamp: p }) => {
			const y = p - r;
			y >= i && (Zc(o),
				t(y - i))
		}
		;
	return Nr.read(o, !0),
		() => Zc(o)
}
function Cz(t) {
	window.MotionDebug && window.MotionDebug.record(t)
}
function Pz(t) {
	return t instanceof SVGElement && t.tagName !== "svg"
}
function Rz(t, i, r) {
	const o = fs(t) ? t : cm(t);
	return o.start(Uw("", o, i, r)),
		o.animation
}
const rx = ["", "X", "Y", "Z"]
	, Dz = {
		visibility: "hidden"
	}
	, pT = 1e3;
let Iz = 0;
const ih = {
	type: "projectionFrame",
	totalNodes: 0,
	resolvedTargetDeltas: 0,
	recalculatedProjection: 0
};
function mT(t, i, r, o) {
	const { latestValues: p } = i;
	p[t] && (r[t] = p[t],
		i.setStaticValue(t, 0),
		o && (o[t] = 0))
}

function a2({ attachResizeListener: t, defaultParent: i, measureScroll: r, checkIsScrollRoot: o, resetTransform: p }) {
	return class {
		constructor(d = {}, E = i == null ? void 0 : i()) {
			this.id = Iz++,
				this.animationId = 0,
				this.children = new Set,
				this.options = {},
				this.isTreeAnimating = !1,
				this.isAnimationBlocked = !1,
				this.isLayoutDirty = !1,
				this.isProjectionDirty = !1,
				this.isSharedProjectionDirty = !1,
				this.isTransformDirty = !1,
				this.updateManuallyBlocked = !1,
				this.updateBlockedByResize = !1,
				this.isUpdating = !1,
				this.isSVG = !1,
				this.needsReset = !1,
				this.shouldResetTransform = !1,
				this.treeScale = {
					x: 1,
					y: 1
				},
				this.eventHandlers = new Map,
				this.hasTreeAnimated = !1,
				this.updateScheduled = !1,
				this.projectionUpdateScheduled = !1,
				this.checkUpdateFailed = () => {
					this.isUpdating && (this.isUpdating = !1,
						this.clearAllSnapshots())
				}
				,
				this.updateProjection = () => {
					this.projectionUpdateScheduled = !1,
						ih.totalNodes = ih.resolvedTargetDeltas = ih.recalculatedProjection = 0,
						this.nodes.forEach(Fz),
						this.nodes.forEach(zz),
						this.nodes.forEach(Gz),
						this.nodes.forEach(Bz),
						Cz(ih)
				}
				,
				this.hasProjected = !1,
				this.isVisible = !0,
				this.animationProgress = 0,
				this.sharedNodes = new Map,
				this.latestValues = d,
				this.root = E ? E.root || E : this,
				this.path = E ? [...E.path, E] : [],
				this.parent = E,
				this.depth = E ? E.depth + 1 : 0;
			for (let L = 0; L < this.path.length; L++)
				this.path[L].shouldResetTransform = !0;
			this.root === this && (this.nodes = new Ez)
		}
		addEventListener(d, E) {
			return this.eventHandlers.has(d) || this.eventHandlers.set(d, new Gw),
				this.eventHandlers.get(d).add(E)
		}
		notifyListeners(d, ...E) {
			const L = this.eventHandlers.get(d);
			L && L.notify(...E)
		}
		hasListeners(d) {
			return this.eventHandlers.has(d)
		}
		mount(d, E = this.root.hasTreeAnimated) {
			if (this.instance)
				return;
			this.isSVG = Pz(d),
				this.instance = d;
			const { layoutId: L, layout: k, visualElement: X } = this.options;
			if (X && !X.current && X.mount(d),
				this.root.nodes.add(this),
				this.parent && this.parent.children.add(this),
				E && (k || L) && (this.isLayoutDirty = !0),
				t) {
				let $;
				const Z = () => this.root.updateBlockedByResize = !1;
				t(d, () => {
					this.root.updateBlockedByResize = !0,
						$ && $(),
						$ = Tz(Z, 250),
						fv.hasAnimatedSinceResize && (fv.hasAnimatedSinceResize = !1,
							this.nodes.forEach(vT))
				}
				)
			}
			L && this.root.registerSharedNode(L, this),
				this.options.animate !== !1 && X && (L || k) && this.addEventListener("didUpdate", ({ delta: $, hasLayoutChanged: Z, hasRelativeTargetChanged: ge, layout: be }) => {
					if (this.isTreeAnimationBlocked()) {
						this.target = void 0,
							this.relativeTarget = void 0;
						return
					}
					const ye = this.options.transition || X.getDefaultTransition() || Xz
						, { onLayoutAnimationStart: $e, onLayoutAnimationComplete: ce } = X.getProps()
						, ie = !this.targetLayout || !o2(this.targetLayout, be) || ge
						, U = !Z && ge;
					if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || U || Z && (ie || !this.currentAnimation)) {
						this.resumeFrom && (this.resumingFrom = this.resumeFrom,
							this.resumingFrom.resumingFrom = void 0),
							this.setAnimationOrigin($, U);
						const re = {
							...Rw(ye, "layout"),
							onPlay: $e,
							onComplete: ce
						};
						(X.shouldReduceMotion || this.options.layoutRoot) && (re.delay = 0,
							re.type = !1),
							this.startAnimation(re)
					} else
						Z || vT(this),
							this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
					this.targetLayout = be
				}
				)
		}
		unmount() {
			this.options.layoutId && this.willUpdate(),
				this.root.nodes.remove(this);
			const d = this.getStack();
			d && d.remove(this),
				this.parent && this.parent.children.delete(this),
				this.instance = void 0,
				Zc(this.updateProjection)
		}
		blockUpdate() {
			this.updateManuallyBlocked = !0
		}
		unblockUpdate() {
			this.updateManuallyBlocked = !1
		}
		isUpdateBlocked() {
			return this.updateManuallyBlocked || this.updateBlockedByResize
		}
		isTreeAnimationBlocked() {
			return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1
		}
		startUpdate() {
			this.isUpdateBlocked() || (this.isUpdating = !0,
				this.nodes && this.nodes.forEach(Hz),
				this.animationId++)
		}
		getTransformTemplate() {
			const { visualElement: d } = this.options;
			return d && d.getProps().transformTemplate
		}
		willUpdate(d = !0) {
			if (this.root.hasTreeAnimated = !0,
				this.root.isUpdateBlocked()) {
				this.options.onExitComplete && this.options.onExitComplete();
				return
			}
			if (!this.root.isUpdating && this.root.startUpdate(),
				this.isLayoutDirty)
				return;
			this.isLayoutDirty = !0;
			for (let X = 0; X < this.path.length; X++) {
				const $ = this.path[X];
				$.shouldResetTransform = !0,
					$.updateScroll("snapshot"),
					$.options.layoutRoot && $.willUpdate(!1)
			}
			const { layoutId: E, layout: L } = this.options;
			if (E === void 0 && !L)
				return;
			const k = this.getTransformTemplate();
			this.prevTransformTemplateValue = k ? k(this.latestValues, "") : void 0,
				this.updateSnapshot(),
				d && this.notifyListeners("willUpdate")
		}
		update() {
			if (this.updateScheduled = !1,
				this.isUpdateBlocked()) {
				this.unblockUpdate(),
					this.clearAllSnapshots(),
					this.nodes.forEach(gT);
				return
			}
			this.isUpdating || this.nodes.forEach(Uz),
				this.isUpdating = !1,
				window.HandoffCancelAllAnimations && window.HandoffCancelAllAnimations(),
				this.nodes.forEach(Nz),
				this.nodes.forEach(Lz),
				this.nodes.forEach(Oz),
				this.clearAllSnapshots();
			const E = Yc.now();
			Kr.delta = qc(0, 1e3 / 60, E - Kr.timestamp),
				Kr.timestamp = E,
				Kr.isProcessing = !0,
				Q_.update.process(Kr),
				Q_.preRender.process(Kr),
				Q_.render.process(Kr),
				Kr.isProcessing = !1
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0,
				vw.read(() => this.update()))
		}
		clearAllSnapshots() {
			this.nodes.forEach(kz),
				this.sharedNodes.forEach(Vz)
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0,
				Nr.preRender(this.updateProjection, !1, !0))
		}
		scheduleCheckAfterUnmount() {
			Nr.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed()
			}
			)
		}
		updateSnapshot() {
			this.snapshot || !this.instance || (this.snapshot = this.measure())
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(),
				!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
				return;
			if (this.resumeFrom && !this.resumeFrom.instance)
				for (let L = 0; L < this.path.length; L++)
					this.path[L].updateScroll();
			const d = this.layout;
			this.layout = this.measure(!1),
				this.layoutCorrected = or(),
				this.isLayoutDirty = !1,
				this.projectionDelta = void 0,
				this.notifyListeners("measure", this.layout.layoutBox);
			const { visualElement: E } = this.options;
			E && E.notify("LayoutMeasure", this.layout.layoutBox, d ? d.layoutBox : void 0)
		}
		updateScroll(d = "measure") {
			let E = !!(this.options.layoutScroll && this.instance);
			this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === d && (E = !1),
				E && (this.scroll = {
					animationId: this.root.animationId,
					phase: d,
					isRoot: o(this.instance),
					offset: r(this.instance)
				})
		}
		resetTransform() {
			if (!p)
				return;
			const d = this.isLayoutDirty || this.shouldResetTransform
				, E = this.projectionDelta && !s2(this.projectionDelta)
				, L = this.getTransformTemplate()
				, k = L ? L(this.latestValues, "") : void 0
				, X = k !== this.prevTransformTemplateValue;
			d && (E || nh(this.latestValues) || X) && (p(this.instance, k),
				this.shouldResetTransform = !1,
				this.scheduleRender())
		}
		measure(d = !0) {
			const E = this.measurePageBox();
			let L = this.removeElementScroll(E);
			return d && (L = this.removeTransform(L)),
				Yz(L),
			{
				animationId: this.root.animationId,
				measuredBox: E,
				layoutBox: L,
				latestValues: {},
				source: this.id
			}
		}
		measurePageBox() {
			const { visualElement: d } = this.options;
			if (!d)
				return or();
			const E = d.measureViewportBox()
				, { scroll: L } = this.root;
			return L && (Oc(E.x, L.offset.x),
				Oc(E.y, L.offset.y)),
				E
		}
		removeElementScroll(d) {
			const E = or();
			Oo(E, d);
			for (let L = 0; L < this.path.length; L++) {
				const k = this.path[L]
					, { scroll: X, options: $ } = k;
				if (k !== this.root && X && $.layoutScroll) {
					if (X.isRoot) {
						Oo(E, d);
						const { scroll: Z } = this.root;
						Z && (Oc(E.x, -Z.offset.x),
							Oc(E.y, -Z.offset.y))
					}
					Oc(E.x, X.offset.x),
						Oc(E.y, X.offset.y)
				}
			}
			return E
		}
		applyTransform(d, E = !1) {
			const L = or();
			Oo(L, d);
			for (let k = 0; k < this.path.length; k++) {
				const X = this.path[k];
				!E && X.options.layoutScroll && X.scroll && X !== X.root && kd(L, {
					x: -X.scroll.offset.x,
					y: -X.scroll.offset.y
				}),
					nh(X.latestValues) && kd(L, X.latestValues)
			}
			return nh(this.latestValues) && kd(L, this.latestValues),
				L
		}
		removeTransform(d) {
			const E = or();
			Oo(E, d);
			for (let L = 0; L < this.path.length; L++) {
				const k = this.path[L];
				if (!k.instance || !nh(k.latestValues))
					continue;
				fb(k.latestValues) && k.updateSnapshot();
				const X = or()
					, $ = k.measurePageBox();
				Oo(X, $),
					uT(E, k.latestValues, k.snapshot ? k.snapshot.layoutBox : void 0, X)
			}
			return nh(this.latestValues) && uT(E, this.latestValues),
				E
		}
		setTargetDelta(d) {
			this.targetDelta = d,
				this.root.scheduleUpdateProjection(),
				this.isProjectionDirty = !0
		}
		setOptions(d) {
			this.options = {
				...this.options,
				...d,
				crossfade: d.crossfade !== void 0 ? d.crossfade : !0
			}
		}
		clearMeasurements() {
			this.scroll = void 0,
				this.layout = void 0,
				this.snapshot = void 0,
				this.prevTransformTemplateValue = void 0,
				this.targetDelta = void 0,
				this.target = void 0,
				this.isLayoutDirty = !1
		}
		forceRelativeParentToResolveTarget() {
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== Kr.timestamp && this.relativeParent.resolveTargetDelta(!0)
		}
		resolveTargetDelta(d = !1) {
			var E;
			const L = this.getLead();
			this.isProjectionDirty || (this.isProjectionDirty = L.isProjectionDirty),
				this.isTransformDirty || (this.isTransformDirty = L.isTransformDirty),
				this.isSharedProjectionDirty || (this.isSharedProjectionDirty = L.isSharedProjectionDirty);
			const k = !!this.resumingFrom || this !== L;
			if (!(d || k && this.isSharedProjectionDirty || this.isProjectionDirty || !((E = this.parent) === null || E === void 0) && E.isProjectionDirty || this.attemptToResolveRelativeTarget))
				return;
			const { layout: $, layoutId: Z } = this.options;
			if (!(!this.layout || !($ || Z))) {
				if (this.resolvedRelativeTargetAt = Kr.timestamp,
					!this.targetDelta && !this.relativeTarget) {
					const ge = this.getClosestProjectingParent();
					ge && ge.layout && this.animationProgress !== 1 ? (this.relativeParent = ge,
						this.forceRelativeParentToResolveTarget(),
						this.relativeTarget = or(),
						this.relativeTargetOrigin = or(),
						zp(this.relativeTargetOrigin, this.layout.layoutBox, ge.layout.layoutBox),
						Oo(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
				}
				if (!(!this.relativeTarget && !this.targetDelta)) {
					if (this.target || (this.target = or(),
						this.targetWithTransforms = or()),
						this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(),
							QN(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : Oo(this.target, this.layout.layoutBox),
								$R(this.target, this.targetDelta)) : Oo(this.target, this.layout.layoutBox),
						this.attemptToResolveRelativeTarget) {
						this.attemptToResolveRelativeTarget = !1;
						const ge = this.getClosestProjectingParent();
						ge && !!ge.resumingFrom == !!this.resumingFrom && !ge.options.layoutScroll && ge.target && this.animationProgress !== 1 ? (this.relativeParent = ge,
							this.forceRelativeParentToResolveTarget(),
							this.relativeTarget = or(),
							this.relativeTargetOrigin = or(),
							zp(this.relativeTargetOrigin, this.target, ge.target),
							Oo(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
					}
					ih.resolvedTargetDeltas++
				}
			}
		}
		getClosestProjectingParent() {
			if (!(!this.parent || fb(this.parent.latestValues) || JR(this.parent.latestValues)))
				return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent()
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout)
		}
		calcProjection() {
			var d;
			const E = this.getLead()
				, L = !!this.resumingFrom || this !== E;
			let k = !0;
			if ((this.isProjectionDirty || !((d = this.parent) === null || d === void 0) && d.isProjectionDirty) && (k = !1),
				L && (this.isSharedProjectionDirty || this.isTransformDirty) && (k = !1),
				this.resolvedRelativeTargetAt === Kr.timestamp && (k = !1),
				k)
				return;
			const { layout: X, layoutId: $ } = this.options;
			if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation),
				this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
				!this.layout || !(X || $))
				return;
			Oo(this.layoutCorrected, this.layout.layoutBox);
			const Z = this.treeScale.x
				, ge = this.treeScale.y;
			iz(this.layoutCorrected, this.treeScale, this.path, L),
				E.layout && !E.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (E.target = E.layout.layoutBox,
					E.targetWithTransforms = or());
			const { target: be } = E;
			if (!be) {
				this.projectionTransform && (this.projectionDelta = Bd(),
					this.projectionTransform = "none",
					this.scheduleRender());
				return
			}
			this.projectionDelta || (this.projectionDelta = Bd(),
				this.projectionDeltaWithTransform = Bd());
			const ye = this.projectionTransform;
			Np(this.projectionDelta, this.layoutCorrected, be, this.latestValues),
				this.projectionTransform = fT(this.projectionDelta, this.treeScale),
				(this.projectionTransform !== ye || this.treeScale.x !== Z || this.treeScale.y !== ge) && (this.hasProjected = !0,
					this.scheduleRender(),
					this.notifyListeners("projectionUpdate", be)),
				ih.recalculatedProjection++
		}
		hide() {
			this.isVisible = !1
		}
		show() {
			this.isVisible = !0
		}
		scheduleRender(d = !0) {
			if (this.options.scheduleRender && this.options.scheduleRender(),
				d) {
				const E = this.getStack();
				E && E.scheduleRender()
			}
			this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0)
		}
		setAnimationOrigin(d, E = !1) {
			const L = this.snapshot
				, k = L ? L.latestValues : {}
				, X = {
					...this.latestValues
				}
				, $ = Bd();
			(!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0),
				this.attemptToResolveRelativeTarget = !E;
			const Z = or()
				, ge = L ? L.source : void 0
				, be = this.layout ? this.layout.source : void 0
				, ye = ge !== be
				, $e = this.getStack()
				, ce = !$e || $e.members.length <= 1
				, ie = !!(ye && !ce && this.options.crossfade === !0 && !this.path.some(jz));
			this.animationProgress = 0;
			let U;
			this.mixTargetDelta = re => {
				const ve = re / 1e3;
				yT($.x, d.x, ve),
					yT($.y, d.y, ve),
					this.setTargetDelta($),
					this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (zp(Z, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
						Wz(this.relativeTarget, this.relativeTargetOrigin, Z, ve),
						U && Az(this.relativeTarget, U) && (this.isProjectionDirty = !1),
						U || (U = or()),
						Oo(U, this.relativeTarget)),
					ye && (this.animationValues = X,
						vz(X, k, this.latestValues, ve, ie, ce)),
					this.root.scheduleUpdateProjection(),
					this.scheduleRender(),
					this.animationProgress = ve
			}
				,
				this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0)
		}
		startAnimation(d) {
			this.notifyListeners("animationStart"),
				this.currentAnimation && this.currentAnimation.stop(),
				this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(),
				this.pendingAnimation && (Zc(this.pendingAnimation),
					this.pendingAnimation = void 0),
				this.pendingAnimation = Nr.update(() => {
					fv.hasAnimatedSinceResize = !0,
						this.currentAnimation = Rz(0, pT, {
							...d,
							onUpdate: E => {
								this.mixTargetDelta(E),
									d.onUpdate && d.onUpdate(E)
							}
							,
							onComplete: () => {
								d.onComplete && d.onComplete(),
									this.completeAnimation()
							}
						}),
						this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
						this.pendingAnimation = void 0
				}
				)
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0,
				this.resumingFrom.preserveOpacity = void 0);
			const d = this.getStack();
			d && d.exitAnimationComplete(),
				this.resumingFrom = this.currentAnimation = this.animationValues = void 0,
				this.notifyListeners("animationComplete")
		}
		finishAnimation() {
			this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(pT),
				this.currentAnimation.stop()),
				this.completeAnimation()
		}
		applyTransformsToTarget() {
			const d = this.getLead();
			let { targetWithTransforms: E, target: L, layout: k, latestValues: X } = d;
			if (!(!E || !L || !k)) {
				if (this !== d && this.layout && k && l2(this.options.animationType, this.layout.layoutBox, k.layoutBox)) {
					L = this.target || or();
					const $ = fo(this.layout.layoutBox.x);
					L.x.min = d.target.x.min,
						L.x.max = L.x.min + $;
					const Z = fo(this.layout.layoutBox.y);
					L.y.min = d.target.y.min,
						L.y.max = L.y.min + Z
				}
				Oo(E, L),
					kd(E, X),
					Np(this.projectionDeltaWithTransform, this.layoutCorrected, E, X)
			}
		}
		registerSharedNode(d, E) {
			this.sharedNodes.has(d) || this.sharedNodes.set(d, new Sz),
				this.sharedNodes.get(d).add(E);
			const k = E.options.initialPromotionConfig;
			E.promote({
				transition: k ? k.transition : void 0,
				preserveFollowOpacity: k && k.shouldPreserveFollowOpacity ? k.shouldPreserveFollowOpacity(E) : void 0
			})
		}
		isLead() {
			const d = this.getStack();
			return d ? d.lead === this : !0
		}
		getLead() {
			var d;
			const { layoutId: E } = this.options;
			return E ? ((d = this.getStack()) === null || d === void 0 ? void 0 : d.lead) || this : this
		}
		getPrevLead() {
			var d;
			const { layoutId: E } = this.options;
			return E ? (d = this.getStack()) === null || d === void 0 ? void 0 : d.prevLead : void 0
		}
		getStack() {
			const { layoutId: d } = this.options;
			if (d)
				return this.root.sharedNodes.get(d)
		}
		promote({ needsReset: d, transition: E, preserveFollowOpacity: L } = {}) {
			const k = this.getStack();
			k && k.promote(this, L),
				d && (this.projectionDelta = void 0,
					this.needsReset = !0),
				E && this.setOptions({
					transition: E
				})
		}
		relegate() {
			const d = this.getStack();
			return d ? d.relegate(this) : !1
		}
		resetSkewAndRotation() {
			const { visualElement: d } = this.options;
			if (!d)
				return;
			let E = !1;
			const { latestValues: L } = d;
			if ((L.rotate || L.rotateX || L.rotateY || L.rotateZ || L.skewX || L.skewY) && (E = !0),
				!E)
				return;
			const k = {};
			for (let X = 0; X < rx.length; X++)
				mT(`rotate${rx[X]}`, d, k, this.animationValues),
					mT(`skew${rx[X]}`, d, k, this.animationValues);
			d.render();
			for (const X in k)
				d.setStaticValue(X, k[X]),
					this.animationValues && (this.animationValues[X] = k[X]);
			d.scheduleRender()
		}
		getProjectionStyles(d) {
			var E, L;
			if (!this.instance || this.isSVG)
				return;
			if (!this.isVisible)
				return Dz;
			const k = {
				visibility: ""
			}
				, X = this.getTransformTemplate();
			if (this.needsReset)
				return this.needsReset = !1,
					k.opacity = "",
					k.pointerEvents = hv(d == null ? void 0 : d.pointerEvents) || "",
					k.transform = X ? X(this.latestValues, "") : "none",
					k;
			const $ = this.getLead();
			if (!this.projectionDelta || !this.layout || !$.target) {
				const ye = {};
				return this.options.layoutId && (ye.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1,
					ye.pointerEvents = hv(d == null ? void 0 : d.pointerEvents) || ""),
					this.hasProjected && !nh(this.latestValues) && (ye.transform = X ? X({}, "") : "none",
						this.hasProjected = !1),
					ye
			}
			const Z = $.animationValues || $.latestValues;
			this.applyTransformsToTarget(),
				k.transform = fT(this.projectionDeltaWithTransform, this.treeScale, Z),
				X && (k.transform = X(Z, k.transform));
			const { x: ge, y: be } = this.projectionDelta;
			k.transformOrigin = `${ge.origin * 100}% ${be.origin * 100}% 0`,
				$.animationValues ? k.opacity = $ === this ? (L = (E = Z.opacity) !== null && E !== void 0 ? E : this.latestValues.opacity) !== null && L !== void 0 ? L : 1 : this.preserveOpacity ? this.latestValues.opacity : Z.opacityExit : k.opacity = $ === this ? Z.opacity !== void 0 ? Z.opacity : "" : Z.opacityExit !== void 0 ? Z.opacityExit : 0;
			for (const ye in Uv) {
				if (Z[ye] === void 0)
					continue;
				const { correct: $e, applyTo: ce } = Uv[ye]
					, ie = k.transform === "none" ? Z[ye] : $e(Z[ye], $);
				if (ce) {
					const U = ce.length;
					for (let re = 0; re < U; re++)
						k[ce[re]] = ie
				} else
					k[ye] = ie
			}
			return this.options.layoutId && (k.pointerEvents = $ === this ? hv(d == null ? void 0 : d.pointerEvents) || "" : "none"),
				k
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = void 0
		}
		resetTree() {
			this.root.nodes.forEach(d => {
				var E;
				return (E = d.currentAnimation) === null || E === void 0 ? void 0 : E.stop()
			}
			),
				this.root.nodes.forEach(gT),
				this.root.sharedNodes.clear()
		}
	}
}

function Lz(t) {
	t.updateLayout()
}
function Oz(t) {
	var i;
	const r = ((i = t.resumeFrom) === null || i === void 0 ? void 0 : i.snapshot) || t.snapshot;
	if (t.isLead() && t.layout && r && t.hasListeners("didUpdate")) {
		const { layoutBox: o, measuredBox: p } = t.layout
			, { animationType: y } = t.options
			, d = r.source !== t.layout.source;
		y === "size" ? Fo($ => {
			const Z = d ? r.measuredBox[$] : r.layoutBox[$]
				, ge = fo(Z);
			Z.min = o[$].min,
				Z.max = Z.min + ge
		}
		) : l2(y, r.layoutBox, o) && Fo($ => {
			const Z = d ? r.measuredBox[$] : r.layoutBox[$]
				, ge = fo(o[$]);
			Z.max = Z.min + ge,
				t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0,
					t.relativeTarget[$].max = t.relativeTarget[$].min + ge)
		}
		);
		const E = Bd();
		Np(E, o, r.layoutBox);
		const L = Bd();
		d ? Np(L, t.applyTransform(p, !0), r.measuredBox) : Np(L, o, r.layoutBox);
		const k = !s2(E);
		let X = !1;
		if (!t.resumeFrom) {
			const $ = t.getClosestProjectingParent();
			if ($ && !$.resumeFrom) {
				const { snapshot: Z, layout: ge } = $;
				if (Z && ge) {
					const be = or();
					zp(be, r.layoutBox, Z.layoutBox);
					const ye = or();
					zp(ye, o, ge.layoutBox),
						o2(be, ye) || (X = !0),
						$.options.layoutRoot && (t.relativeTarget = ye,
							t.relativeTargetOrigin = be,
							t.relativeParent = $)
				}
			}
		}
		t.notifyListeners("didUpdate", {
			layout: o,
			snapshot: r,
			delta: L,
			layoutDelta: E,
			hasLayoutChanged: k,
			hasRelativeTargetChanged: X
		})
	} else if (t.isLead()) {
		const { onExitComplete: o } = t.options;
		o && o()
	}
	t.options.transition = void 0
}
function Fz(t) {
	ih.totalNodes++,
		t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty),
			t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)),
			t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty))
}
function Bz(t) {
	t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1
}
function kz(t) {
	t.clearSnapshot()
}
function gT(t) {
	t.clearMeasurements()
}
function Uz(t) {
	t.isLayoutDirty = !1
}
function Nz(t) {
	const { visualElement: i } = t.options;
	i && i.getProps().onBeforeLayoutMeasure && i.notify("BeforeLayoutMeasure"),
		t.resetTransform()
}
function vT(t) {
	t.finishAnimation(),
		t.targetDelta = t.relativeTarget = t.target = void 0,
		t.isProjectionDirty = !0
}
function zz(t) {
	t.resolveTargetDelta()
}
function Gz(t) {
	t.calcProjection()
}
function Hz(t) {
	t.resetSkewAndRotation()
}
function Vz(t) {
	t.removeLeadSnapshot()
}
function yT(t, i, r) {
	t.translate = ji(i.translate, 0, r),
		t.scale = ji(i.scale, 1, r),
		t.origin = i.origin,
		t.originPoint = i.originPoint
}
function _T(t, i, r, o) {
	t.min = ji(i.min, r.min, o),
		t.max = ji(i.max, r.max, o)
}
function Wz(t, i, r, o) {
	_T(t.x, i.x, r.x, o),
		_T(t.y, i.y, r.y, o)
}
function jz(t) {
	return t.animationValues && t.animationValues.opacityExit !== void 0
}
const Xz = {
	duration: .45,
	ease: [.4, 0, .1, 1]
}
	, xT = t => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t)
	, bT = xT("applewebkit/") && !xT("chrome/") ? Math.round : Zr;
function wT(t) {
	t.min = bT(t.min),
		t.max = bT(t.max)
}
function Yz(t) {
	wT(t.x),
		wT(t.y)
}
function l2(t, i, r) {
	return t === "position" || t === "preserve-aspect" && !hb(dT(i), dT(r), .2)
}
const Qz = a2({
	attachResizeListener: (t, i) => Ll(t, "resize", i),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body.scrollLeft,
		y: document.documentElement.scrollTop || document.body.scrollTop
	}),
	checkIsScrollRoot: () => !0
})
	, sx = {
		current: void 0
	}
	, c2 = a2({
		measureScroll: t => ({
			x: t.scrollLeft,
			y: t.scrollTop
		}),
		defaultParent: () => {
			if (!sx.current) {
				const t = new Qz({});
				t.mount(window),
					t.setOptions({
						layoutScroll: !0
					}),
					sx.current = t
			}
			return sx.current
		}
		,
		resetTransform: (t, i) => {
			t.style.transform = i !== void 0 ? i : "none"
		}
		,
		checkIsScrollRoot: t => window.getComputedStyle(t).position === "fixed"
	})
	, Kz = {
		pan: {
			Feature: hz
		},
		drag: {
			Feature: uz,
			ProjectionNode: c2,
			MeasureLayout: n2
		}
	}
	, mb = {
		current: null
	}
	, u2 = {
		current: !1
	};
function qz() {
	if (u2.current = !0,
		!!pw)
		if (window.matchMedia) {
			const t = window.matchMedia("(prefers-reduced-motion)")
				, i = () => mb.current = t.matches;
			t.addListener(i),
				i()
		} else
			mb.current = !1
}
function Zz(t, i, r) {
	const { willChange: o } = i;
	for (const p in i) {
		const y = i[p]
			, d = r[p];
		if (fs(y))
			t.addValue(p, y),
				Vv(o) && o.add(p);
		else if (fs(d))
			t.addValue(p, cm(y, {
				owner: t
			})),
				Vv(o) && o.remove(p);
		else if (d !== y)
			if (t.hasValue(p)) {
				const E = t.getValue(p);
				!E.hasAnimated && E.set(y)
			} else {
				const E = t.getStaticValue(p);
				t.addValue(p, cm(E !== void 0 ? E : y, {
					owner: t
				}))
			}
	}
	for (const p in r)
		i[p] === void 0 && t.removeValue(p);
	return i
}
const AT = new WeakMap
	, Jz = [...wR, hs, Jc]
	, $z = t => Jz.find(bR(t))
	, h2 = Object.keys(am)
	, e4 = h2.length
	, ST = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"]
	, t4 = _w.length;

class n4 {
	constructor({ parent: i, props: r, presenceContext: o, reducedMotionConfig: p, blockInitialAnimation: y, visualState: d }, E = {}) {
		this.resolveKeyframes = (Z, ge, be, ye) => new this.KeyframeResolver(Z, ge, be, ye, this),
			this.current = null,
			this.children = new Set,
			this.isVariantNode = !1,
			this.isControllingVariants = !1,
			this.shouldReduceMotion = null,
			this.values = new Map,
			this.KeyframeResolver = Dw,
			this.features = {},
			this.valueSubscriptions = new Map,
			this.prevMotionValues = {},
			this.events = {},
			this.propEventSubscriptions = {},
			this.notifyUpdate = () => this.notify("Update", this.latestValues),
			this.render = () => {
				this.current && (this.triggerBuild(),
					this.renderInstance(this.current, this.renderState, this.props.style, this.projection))
			}
			,
			this.scheduleRender = () => Nr.render(this.render, !1, !0);
		const { latestValues: L, renderState: k } = d;
		this.latestValues = L,
			this.baseTarget = {
				...L
			},
			this.initialValues = r.initial ? {
				...L
			} : {},
			this.renderState = k,
			this.parent = i,
			this.props = r,
			this.presenceContext = o,
			this.depth = i ? i.depth + 1 : 0,
			this.reducedMotionConfig = p,
			this.options = E,
			this.blockInitialAnimation = !!y,
			this.isControllingVariants = p0(r),
			this.isVariantNode = qP(r),
			this.isVariantNode && (this.variantChildren = new Set),
			this.manuallyAnimateOnMount = !!(i && i.current);
		const { willChange: X, ...$ } = this.scrapeMotionValuesFromProps(r, {});
		for (const Z in $) {
			const ge = $[Z];
			L[Z] !== void 0 && fs(ge) && (ge.set(L[Z], !1),
				Vv(X) && X.add(Z))
		}
	}
	scrapeMotionValuesFromProps(i, r) {
		return {}
	}
	mount(i) {
		this.current = i,
			AT.set(i, this),
			this.projection && !this.projection.instance && this.projection.mount(i),
			this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)),
			this.values.forEach((r, o) => this.bindToMotionValue(o, r)),
			u2.current || qz(),
			this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : mb.current,
			this.parent && this.parent.children.add(this),
			this.update(this.props, this.presenceContext)
	}
	unmount() {
		AT.delete(this.current),
			this.projection && this.projection.unmount(),
			Zc(this.notifyUpdate),
			Zc(this.render),
			this.valueSubscriptions.forEach(i => i()),
			this.removeFromVariantTree && this.removeFromVariantTree(),
			this.parent && this.parent.children.delete(this);
		for (const i in this.events)
			this.events[i].clear();
		for (const i in this.features)
			this.features[i].unmount();
		this.current = null
	}
	bindToMotionValue(i, r) {
		const o = xh.has(i)
			, p = r.on("change", d => {
				this.latestValues[i] = d,
					this.props.onUpdate && Nr.preRender(this.notifyUpdate),
					o && this.projection && (this.projection.isTransformDirty = !0)
			}
			)
			, y = r.on("renderRequest", this.scheduleRender);
		this.valueSubscriptions.set(i, () => {
			p(),
				y(),
				r.owner && r.stop()
		}
		)
	}
	sortNodePosition(i) {
		return !this.current || !this.sortInstanceNodePosition || this.type !== i.type ? 0 : this.sortInstanceNodePosition(this.current, i.current)
	}
	loadFeatures({ children: i, ...r }, o, p, y) {
		let d, E;
		for (let L = 0; L < e4; L++) {
			const k = h2[L]
				, { isEnabled: X, Feature: $, ProjectionNode: Z, MeasureLayout: ge } = am[k];
			Z && (d = Z),
				X(r) && (!this.features[k] && $ && (this.features[k] = new $(this)),
					ge && (E = ge))
		}
		if ((this.type === "html" || this.type === "svg") && !this.projection && d) {
			this.projection = new d(this.latestValues, this.parent && this.parent.projection);
			const { layoutId: L, layout: k, drag: X, dragConstraints: $, layoutScroll: Z, layoutRoot: ge } = r;
			this.projection.setOptions({
				layoutId: L,
				layout: k,
				alwaysMeasureLayout: !!X || $ && Od($),
				visualElement: this,
				scheduleRender: () => this.scheduleRender(),
				animationType: typeof k == "string" ? k : "both",
				initialPromotionConfig: y,
				layoutScroll: Z,
				layoutRoot: ge
			})
		}
		return E
	}
	updateFeatures() {
		for (const i in this.features) {
			const r = this.features[i];
			r.isMounted ? r.update() : (r.mount(),
				r.isMounted = !0)
		}
	}
	triggerBuild() {
		this.build(this.renderState, this.latestValues, this.options, this.props)
	}
	measureViewportBox() {
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : or()
	}
	getStaticValue(i) {
		return this.latestValues[i]
	}
	setStaticValue(i, r) {
		this.latestValues[i] = r
	}
	update(i, r) {
		(i.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
			this.prevProps = this.props,
			this.props = i,
			this.prevPresenceContext = this.presenceContext,
			this.presenceContext = r;
		for (let o = 0; o < ST.length; o++) {
			const p = ST[o];
			this.propEventSubscriptions[p] && (this.propEventSubscriptions[p](),
				delete this.propEventSubscriptions[p]);
			const y = i["on" + p];
			y && (this.propEventSubscriptions[p] = this.on(p, y))
		}
		this.prevMotionValues = Zz(this, this.scrapeMotionValuesFromProps(i, this.prevProps), this.prevMotionValues),
			this.handleChildMotionValue && this.handleChildMotionValue()
	}
	getProps() {
		return this.props
	}
	getVariant(i) {
		return this.props.variants ? this.props.variants[i] : void 0
	}
	getDefaultTransition() {
		return this.props.transition
	}
	getTransformPagePoint() {
		return this.props.transformPagePoint
	}
	getClosestVariantNode() {
		return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0
	}
	getVariantContext(i = !1) {
		if (i)
			return this.parent ? this.parent.getVariantContext() : void 0;
		if (!this.isControllingVariants) {
			const o = this.parent ? this.parent.getVariantContext() || {} : {};
			return this.props.initial !== void 0 && (o.initial = this.props.initial),
				o
		}
		const r = {};
		for (let o = 0; o < t4; o++) {
			const p = _w[o]
				, y = this.props[p];
			(om(y) || y === !1) && (r[p] = y)
		}
		return r
	}
	addVariantChild(i) {
		const r = this.getClosestVariantNode();
		if (r)
			return r.variantChildren && r.variantChildren.add(i),
				() => r.variantChildren.delete(i)
	}
	addValue(i, r) {
		r !== this.values.get(i) && (this.removeValue(i),
			this.bindToMotionValue(i, r)),
			this.values.set(i, r),
			this.latestValues[i] = r.get()
	}
	removeValue(i) {
		this.values.delete(i);
		const r = this.valueSubscriptions.get(i);
		r && (r(),
			this.valueSubscriptions.delete(i)),
			delete this.latestValues[i],
			this.removeValueFromRenderState(i, this.renderState)
	}
	hasValue(i) {
		return this.values.has(i)
	}
	getValue(i, r) {
		if (this.props.values && this.props.values[i])
			return this.props.values[i];
		let o = this.values.get(i);
		return o === void 0 && r !== void 0 && (o = cm(r === null ? void 0 : r, {
			owner: this
		}),
			this.addValue(i, o)),
			o
	}
	readValue(i, r) {
		var o;
		let p = this.latestValues[i] !== void 0 || !this.current ? this.latestValues[i] : (o = this.getBaseTargetFromProps(this.props, i)) !== null && o !== void 0 ? o : this.readValueFromInstance(this.current, i, this.options);
		return p != null && (typeof p == "string" && (_R(p) || vR(p)) ? p = parseFloat(p) : !$z(p) && Jc.test(r) && (p = RR(i, r)),
			this.setBaseTarget(i, fs(p) ? p.get() : p)),
			fs(p) ? p.get() : p
	}
	setBaseTarget(i, r) {
		this.baseTarget[i] = r
	}
	getBaseTarget(i) {
		var r, o;
		const { initial: p } = this.props
			, y = typeof p == "string" || typeof p == "object" ? (o = Pw(this.props, p, (r = this.presenceContext) === null || r === void 0 ? void 0 : r.custom)) === null || o === void 0 ? void 0 : o[i] : void 0;
		if (p && y !== void 0)
			return y;
		const d = this.getBaseTargetFromProps(this.props, i);
		return d !== void 0 && !fs(d) ? d : this.initialValues[i] !== void 0 && y === void 0 ? void 0 : this.baseTarget[i]
	}
	on(i, r) {
		return this.events[i] || (this.events[i] = new Gw),
			this.events[i].add(r)
	}
	notify(i, ...r) {
		this.events[i] && this.events[i].notify(...r)
	}
}

class d2 extends n4 {
	constructor() {
		super(...arguments),
			this.KeyframeResolver = DR
	}
	sortInstanceNodePosition(i, r) {
		return i.compareDocumentPosition(r) & 2 ? 1 : -1
	}
	getBaseTargetFromProps(i, r) {
		return i.style ? i.style[r] : void 0
	}
	removeValueFromRenderState(i, { vars: r, style: o }) {
		delete r[i],
			delete o[i]
	}
}
function i4(t) {
	return window.getComputedStyle(t)
}

class r4 extends d2 {
	constructor() {
		super(...arguments),
			this.type = "html"
	}
	readValueFromInstance(i, r) {
		if (xh.has(r)) {
			const o = Lw(r);
			return o && o.default || 0
		} else {
			const o = i4(i)
				, p = (eR(r) ? o.getPropertyValue(r) : o[r]) || 0;
			return typeof p == "string" ? p.trim() : p
		}
	}
	measureInstanceViewportBox(i, { transformPagePoint: r }) {
		return e2(i, r)
	}
	build(i, r, o, p) {
		Sw(i, r, o, p.transformTemplate)
	}
	scrapeMotionValuesFromProps(i, r) {
		return Cw(i, r)
	}
	handleChildMotionValue() {
		this.childSubscription && (this.childSubscription(),
			delete this.childSubscription);
		const { children: i } = this.props;
		fs(i) && (this.childSubscription = i.on("change", r => {
			this.current && (this.current.textContent = `${r}`)
		}
		))
	}
	renderInstance(i, r, o, p) {
		sR(i, r, o, p)
	}
}

class s4 extends d2 {
	constructor() {
		super(...arguments),
			this.type = "svg",
			this.isSVGTag = !1
	}
	getBaseTargetFromProps(i, r) {
		return i[r]
	}
	readValueFromInstance(i, r) {
		if (xh.has(r)) {
			const o = Lw(r);
			return o && o.default || 0
		}
		return r = oR.has(r) ? r : gw(r),
			i.getAttribute(r)
	}
	measureInstanceViewportBox() {
		return or()
	}
	scrapeMotionValuesFromProps(i, r) {
		return lR(i, r)
	}
	build(i, r, o, p) {
		Ew(i, r, o, this.isSVGTag, p.transformTemplate)
	}
	renderInstance(i, r, o, p) {
		aR(i, r, o, p)
	}
	mount(i) {
		this.isSVGTag = Tw(i.tagName),
			super.mount(i)
	}
}
const o4 = (t, i) => bw(t) ? new s4(i, {
	enableHardwareAcceleration: !1
}) : new r4(i, {
	enableHardwareAcceleration: !0
})
	, a4 = {
		layout: {
			ProjectionNode: c2,
			MeasureLayout: n2
		}
	}
	, l4 = {
		...WN,
		...nU,
		...Kz,
		...a4
	}
	, fa = d3((t, i) => V3(t, i, l4, o4));
function f2() {
	const t = ht.useRef(!1);
	return mw(() => (t.current = !0,
		() => {
			t.current = !1
		}
	), []),
		t
}
function c4() {
	const t = f2()
		, [i, r] = ht.useState(0)
		, o = ht.useCallback(() => {
			t.current && r(i + 1)
		}
			, [i]);
	return [ht.useCallback(() => Nr.postRender(o), [o]), i]
}

class u4 extends ht.Component {
	getSnapshotBeforeUpdate(i) {
		const r = this.props.childRef.current;
		if (r && i.isPresent && !this.props.isPresent) {
			const o = this.props.sizeRef.current;
			o.height = r.offsetHeight || 0,
				o.width = r.offsetWidth || 0,
				o.top = r.offsetTop,
				o.left = r.offsetLeft
		}
		return null
	}
	componentDidUpdate() { }
	render() {
		return this.props.children
	}
}
function h4({ children: t, isPresent: i }) {
	const r = ht.useId()
		, o = ht.useRef(null)
		, p = ht.useRef({
			width: 0,
			height: 0,
			top: 0,
			left: 0
		})
		, { nonce: y } = ht.useContext(fw);
	return ht.useInsertionEffect(() => {
		const { width: d, height: E, top: L, left: k } = p.current;
		if (i || !o.current || !d || !E)
			return;
		o.current.dataset.motionPopId = r;
		const X = document.createElement("style");
		return y && (X.nonce = y),
			document.head.appendChild(X),
			X.sheet && X.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${d}px !important;
            height: ${E}px !important;
            top: ${L}px !important;
            left: ${k}px !important;
          }
        `),
			() => {
				document.head.removeChild(X)
			}
	}
		, [i]),
		ht.createElement(u4, {
			isPresent: i,
			childRef: o,
			sizeRef: p
		}, ht.cloneElement(t, {
			ref: o
		}))
}

const ox = ({ children: t, initial: i, isPresent: r, onExitComplete: o, custom: p, presenceAffectsLayout: y, mode: d }) => {
	const E = cR(d4)
		, L = ht.useId()
		, k = ht.useMemo(() => ({
			id: L,
			initial: i,
			isPresent: r,
			custom: p,
			onExitComplete: X => {
				E.set(X, !0);
				for (const $ of E.values())
					if (!$)
						return;
				o && o()
			}
			,
			register: X => (E.set(X, !1),
				() => E.delete(X))
		}), y ? void 0 : [r]);
	return ht.useMemo(() => {
		E.forEach((X, $) => E.set($, !1))
	}
		, [r]),
		ht.useEffect(() => {
			!r && !E.size && o && o()
		}
			, [r]),
		d === "popLayout" && (t = ht.createElement(h4, {
			isPresent: r
		}, t)),
		ht.createElement(d0.Provider, {
			value: k
		}, t)
}
	;
function d4() {
	return new Map
}
function f4(t) {
	return ht.useEffect(() => () => t(), [])
}
const rh = t => t.key || "";
function p4(t, i) {
	t.forEach(r => {
		const o = rh(r);
		i.set(o, r)
	}
	)
}
function m4(t) {
	const i = [];
	return ht.Children.forEach(t, r => {
		ht.isValidElement(r) && i.push(r)
	}
	),
		i
}
const um = ({ children: t, custom: i, initial: r = !0, onExitComplete: o, exitBeforeEnter: p, presenceAffectsLayout: y = !0, mode: d = "sync" }) => {
	const E = ht.useContext(xw).forceRender || c4()[0]
		, L = f2()
		, k = m4(t);
	let X = k;
	const $ = ht.useRef(new Map).current
		, Z = ht.useRef(X)
		, ge = ht.useRef(new Map).current
		, be = ht.useRef(!0);
	if (mw(() => {
		be.current = !1,
			p4(k, ge),
			Z.current = X
	}
	),
		f4(() => {
			be.current = !0,
				ge.clear(),
				$.clear()
		}
		),
		be.current)
		return ht.createElement(ht.Fragment, null, X.map(ie => ht.createElement(ox, {
			key: rh(ie),
			isPresent: !0,
			initial: r ? void 0 : !1,
			presenceAffectsLayout: y,
			mode: d
		}, ie)));
	X = [...X];
	const ye = Z.current.map(rh)
		, $e = k.map(rh)
		, ce = ye.length;
	for (let ie = 0; ie < ce; ie++) {
		const U = ye[ie];
		$e.indexOf(U) === -1 && !$.has(U) && $.set(U, void 0)
	}
	return d === "wait" && $.size && (X = []),
		$.forEach((ie, U) => {
			if ($e.indexOf(U) !== -1)
				return;
			const re = ge.get(U);
			if (!re)
				return;
			const ve = ye.indexOf(U);
			let Be = ie;
			if (!Be) {
				const Ge = () => {
					$.delete(U);
					const Ie = Array.from(ge.keys()).filter(Pt => !$e.includes(Pt));
					if (Ie.forEach(Pt => ge.delete(Pt)),
						Z.current = k.filter(Pt => {
							const vt = rh(Pt);
							return vt === U || Ie.includes(vt)
						}
						),
						!$.size) {
						if (L.current === !1)
							return;
						E(),
							o && o()
					}
				}
					;
				Be = ht.createElement(ox, {
					key: rh(re),
					isPresent: !1,
					onExitComplete: Ge,
					custom: i,
					presenceAffectsLayout: y,
					mode: d
				}, re),
					$.set(U, Be)
			}
			X.splice(ve, 0, Be)
		}
		),
		X = X.map(ie => {
			const U = ie.key;
			return $.has(U) ? ie : ht.createElement(ox, {
				key: rh(ie),
				isPresent: !0,
				presenceAffectsLayout: y,
				mode: d
			}, ie)
		}
		),
		ht.createElement(ht.Fragment, null, $.size ? X : X.map(ie => ht.cloneElement(ie)))
}
	, g4 = [Sn.State1, Sn.State2, Sn.State3, Sn.State4]
	, v4 = ["SU7", "车身", "风阻", "雷达"];
let Jg = {
	value: !0
};
function y4() {
	const [t, i] = ht.useState(Sn.Loading)
		, [r, o] = ht.useState(!1);
	return ht.useEffect(() => {
		const p = d => {
			i(d)
		}
			, y = d => {
				o(d)
			}
			;
		return Ct.on(Ct.UPDATESHOWINGSTATE, p),
			Ct.on(Ct.CLICKEFFECT, y),
			() => {
				Ct.off(Ct.UPDATESHOWINGSTATE, p),
					Ct.off(Ct.CLICKEFFECT, y)
			}
	}
		, []),
		je.jsx(je.Fragment, {
			children: je.jsx("div", {
				className: "StateTable-container",
				style: {
					opacity: r ? 0 : 1,
					transition: "all,0.5s"
				},
				children: je.jsx(um, {
					mode: "popLayout",
					children: t != Sn.BeginAnim && t != Sn.Loading && je.jsxs(fa.div, {
						className: "StateTable-content",
						initial: {
							x: 10,
							opacity: 0
						},
						animate: {
							x: 0,
							opacity: 1
						},
						exit: {
							x: -10,
							opacity: 0
						},
						transition: {
							duration: .5
						},
						children: [je.jsx("div", {
							className: "backgroundLine"
						}), g4.map((p, y) => je.jsxs("div", {
							className: "item",
							style: {
								backgroundColor: p == t ? "rgb(255, 146, 69)" : ""
							},
							onClick: () => {
								!Ct.isInClickEffect && p != t && Jg.value && (Ct.emit(Ct.UPDATESHOWINGSTATE, p),
									Jg.value = !1,
									qt.TweenManager.Timeline(Jg).delay(.3).call(() => {
										Jg.value = !0
									}
									).start())
							}
							,
							children: [p == t && je.jsx("div", {
								className: "item-Line"
							}), je.jsx("div", {
								className: "tableName",
								children: je.jsx("div", {
									style: {
										color: p == t ? "#fff" : "",
										fontSize: p == t ? "0.9rem" : ""
									},
									children: v4[y]
								})
							}), je.jsx("div", {
								className: "clickBox"
							})]
						}, y))]
					})
				})
			})
		})
}
function _4() {
	const t = ht.useRef(null)
		, [i, r] = ht.useState(0);
	return ht.useEffect(() => {
		let o = 0
			, p = !1;
		const y = setInterval(() => {
			o = NP.damp(o, Ct.loading, .016, 1),
				o >= .99 && (o = 1),
				r(o),
				p && o >= 1 && (p = !1,
					t.current.style.transition = "opacity 600ms cubic-bezier(0,0,.58,1)",
					t.current.style.opacity = "0",
					setTimeout(() => t.current.style.display = "none", 600))
		}
		)
			, d = () => {
				p = !0
			}
			;
		return Ct.reset(),
			Ct.on(Ct.PRELOADED, d),
			() => {
				clearInterval(y),
					Ct.clear()
			}
	}
		, []),
		je.jsxs("aside", {
			id: "preloader",
			ref: t,
			children: [je.jsx("div", {
				className: "progress-bar",
				children: je.jsxs("svg", {
					className: "progress-bar-svg",
					viewBox: "0 0 1709.0400390625 323.0625",
					fill: "none",
					children: [je.jsx("path", {
						className: "speed-line",
						id: "process",
						d: "M2.30809 318.07Q21.0208 316.441 50.1395 311.552Q108.449 301.761 160.401 285.447Q187.503 276.937 211.151 264.212Q225.389 256.551 250.01 240.238Q275.87 223.104 291.318 214.863Q317.146 201.086 347.378 191.695Q407.665 172.97 460.721 167.081Q495.936 163.173 558.47 163.173Q585.817 163.173 628.557 141.714Q654.353 128.763 708.923 94.4123Q742.671 73.1683 758.993 63.6874Q786.229 47.8662 806.111 39.6039Q862.305 16.252 914.714 7.87042Q961.797 0.340553 1040.78 0.0125411Q1117.18 -0.304734 1171.71 7.40653Q1227.48 15.2934 1289.78 35.6259Q1321.15 45.8667 1370.62 65.0861Q1407.99 79.6092 1425.84 85.4202Q1454.72 94.8298 1481 99.0339Q1520.17 105.3 1617.15 102.785Q1665.69 101.526 1706.36 99.0087C1706.42 99.0046 1706.48 99.0025 1706.54 99.0025C1707.92 99.0025 1709.04 100.122 1709.04 101.503C1709.04 102.838 1707.99 103.928 1706.68 103.999Q1665.91 106.522 1617.28 107.783Q1519.84 110.31 1480.22 103.971Q1453.55 99.7051 1424.29 90.1744Q1406.31 84.3207 1368.81 69.7466Q1319.47 50.5771 1288.22 40.3791Q1226.35 20.1827 1171.01 12.3573Q1116.83 4.69672 1040.8 5.0125Q962.205 5.3389 915.504 12.8077Q863.678 21.0959 808.029 44.2211Q788.454 52.356 761.504 68.0109Q745.26 77.4469 711.586 98.6438Q656.812 133.123 630.801 146.182Q587.002 168.173 558.47 168.173Q496.212 168.173 461.273 172.051Q408.69 177.886 348.862 196.47Q319.081 205.72 293.672 219.274Q278.433 227.403 252.771 244.406Q227.96 260.845 213.52 268.615Q189.453 281.565 161.899 290.218Q109.617 306.635 50.9674 316.483Q21.6568 321.404 2.74708 323.05C2.6658 323.058 2.58338 323.063 2.5 323.063C1.11929 323.063 0 321.943 0 320.563C0 319.246 1.01704 318.168 2.30809 318.07Z"
					}), je.jsx("defs", {
						children: je.jsxs("linearGradient", {
							xmlns: "http://www.w3.org/2000/svg",
							id: "linear_0",
							x1: "0.14628095304966532%",
							y1: "50%",
							x2: "99.85371904695035%",
							y2: "50%",
							gradientUnits: "objectBoundingBox",
							children: [je.jsx("stop", {
								offset: "0",
								stopColor: "#000000",
								stopOpacity: "0"
							}), je.jsx("stop", {
								offset: .2341 * i,
								stopColor: "#FFFFFF",
								stopOpacity: "0.44"
							}), je.jsx("stop", {
								offset: .5278 * i,
								stopColor: "#FFFFFF",
								stopOpacity: "1"
							}), je.jsx("stop", {
								offset: .7698 * i,
								stopColor: "#FFFFFF",
								stopOpacity: "0.49"
							}), je.jsx("stop", {
								offset: 1 * i,
								stopColor: "#000000",
								stopOpacity: "0"
							})]
						})
					})]
				})
			}), je.jsx("div", {
				className: "progress-num",
				children: je.jsxs("p", {
					children: [Math.floor(i * 100), "%"]
				})
			}), je.jsx("div", {
				className: "version",
				children: vi.VERSION
			})]
		})
}
function x4() {
	const [t, i] = ht.useState(Sn.Loading)
		, [r, o] = ht.useState(!1);
	return ht.useEffect(() => {
		const p = d => {
			i(d)
		}
			, y = d => {
				o(d)
			}
			;
		return Ct.on(Ct.UPDATESHOWINGSTATE, p),
			Ct.on(Ct.CLICKEFFECT, y),
			() => {
				Ct.off(Ct.UPDATESHOWINGSTATE, p),
					Ct.off(Ct.CLICKEFFECT, y)
			}
	}
		, []),
		je.jsx(je.Fragment, {
			children: hw() ? je.jsx("div", {
				className: "TopInfo-container",
				style: {
					opacity: r ? 0 : 1
				},
				children: je.jsxs(um, {
					mode: "popLayout",
					children: [t == Sn.State1 && je.jsxs(fa.div, {
						className: "TopInfo-content",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .2
						},
						children: [je.jsx("img", {
							src: `${vi.autoURL("res/icon/xiaomi_su7.webp")}`,
							alt: "",
							style: {
								width: "50vmin",
								marginTop: "10vmin"
							}
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#fffb",
								fontSize: "3vmin"
							},
							children: "C级高性能 生态科技轿车"
						})]
					}, "s1"), t == Sn.State2 && je.jsxs(fa.div, {
						className: "TopInfo-content",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .2
						},
						children: [je.jsx("div", {
							style: {
								marginTop: "6vmin",
								color: "rgba(240, 198, 159, 1)",
								fontSize: "3vmin"
							},
							children: "「外观设计」"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#fff",
								fontSize: "3vmin"
							},
							children: "优雅与速度感并存经得起时间考验的设计"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#aaa",
								fontSize: "2.5vmin"
							},
							children: "遵循「符合直觉」的美学设计理念，造就Xiaomi SU7 经典的流畅车身线条。"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#aaa",
								fontSize: "2.5vmin"
							},
							children: "富有力量的车身线条与自然舒展的车身比例，让优雅与速度相得益彰。"
						})]
					}, "s2"), t == Sn.State3 && je.jsxs(fa.div, {
						className: "TopInfo-content",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .2
						},
						children: [je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#fff",
								fontSize: "2.5vmin"
							},
							children: "出色的超低风阻系数"
						}), je.jsx("div", {
							style: {
								marginTop: "1.2vmin",
								color: "rgba(240, 198, 159, 1)",
								fontSize: "5vmin"
							},
							children: "Cd 0.195"
						}), je.jsx("div", {
							style: {
								marginTop: "1.2vmin",
								color: "#fff",
								fontSize: "2.5vmin"
							},
							children: "风，就是最好的设计师。"
						}), je.jsx("div", {
							style: {
								marginTop: "1.2vmin",
								color: "#fff",
								fontSize: "2.5vmin"
							},
							children: "经过 1000 次以上仿真实验和超过 300次油泥模型调整，不断寻找风道、车身曲线的最优解。"
						}), je.jsx("div", {
							style: {
								marginTop: "1.2vmin",
								color: "#fff",
								fontSize: "2.5vmin"
							},
							children: "最终达成 Cd0.195 超低风阻系数，带来难以想象的低能耗和出色续航表现。"
						})]
					}, "s3"), t == Sn.State4 && je.jsxs(fa.div, {
						className: "TopInfo-content",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .2
						},
						children: [je.jsx("div", {
							style: {
								marginTop: "0vmin",
								color: "rgba(240, 198, 159, 1)",
								fontSize: "3vmin"
							},
							children: "「智能驾驶」"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#fff",
								fontSize: "3vmin"
							},
							children: "隆重介绍XiaomiPilot更聪明、更安全的智能驾驶系统"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#aaa",
								fontSize: "2.5vmin"
							},
							children: "搭载两颗 NVIDIA DRIVE Orin 芯片，综合算力高达 508 TOPS，感知硬件具备罕见的大范围探测能力；"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#aaa",
								fontSize: "2.5vmin"
							},
							children: "在此之上，以领先行业的智能驾驶算法深度赋能小米全栈自研的全场景智能辅助驾驶。"
						}), je.jsxs("div", {
							className: "addon",
							children: [je.jsxs("div", {
								style: {
									marginTop: "10vmin"
								},
								children: [je.jsx("div", {
									children: "激光雷达"
								}), je.jsx("div", {
									style: {
										color: "rgba(255, 146, 69, 1)"
									},
									children: "x1"
								})]
							}), je.jsxs("div", {
								children: [je.jsx("div", {
									children: "高清摄像头"
								}), je.jsx("div", {
									style: {
										color: "rgba(255, 146, 69, 1)"
									},
									children: "x11"
								})]
							}), je.jsxs("div", {
								children: [je.jsx("div", {
									children: "毫米波雷达"
								}), je.jsx("div", {
									style: {
										color: "rgba(255, 146, 69, 1)"
									},
									children: "x3"
								})]
							}), je.jsxs("div", {
								children: [je.jsx("div", {
									children: "超声波雷达"
								}), je.jsx("div", {
									style: {
										color: "rgba(255, 146, 69, 1)"
									},
									children: "x12"
								})]
							})]
						})]
					}, "s4")]
				})
			}, "t1") : je.jsx("div", {
				className: "TopInfo-container",
				style: {
					opacity: r ? 0 : 1
				},
				children: je.jsxs(um, {
					mode: "popLayout",
					children: [t == Sn.State1 && je.jsxs(fa.div, {
						className: "TopInfo-content",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .2
						},
						children: [je.jsx("img", {
							src: `${vi.autoURL("res/icon/xiaomi_su7.webp")}`,
							alt: "",
							style: {
								width: "40vmin",
								marginTop: "10vmin"
							}
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#fffb",
								fontSize: "2vmin"
							},
							children: "C级高性能 生态科技轿车"
						})]
					}, "s1"), t == Sn.State2 && je.jsxs(fa.div, {
						className: "TopInfo-content",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .2
						},
						children: [je.jsx("div", {
							style: {
								marginTop: "6vmin",
								color: "rgba(240, 198, 159, 1)",
								fontSize: "2vmin"
							},
							children: "「外观设计」"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#fff",
								fontSize: "2vmin"
							},
							children: "优雅与速度感并存经得起时间考验的设计"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#aaa",
								fontSize: "1.4vmin"
							},
							children: "遵循「符合直觉」的美学设计理念，造就Xiaomi SU7 经典的流畅车身线条。"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#aaa",
								fontSize: "1.4vmin"
							},
							children: "富有力量的车身线条与自然舒展的车身比例，让优雅与速度相得益彰。"
						})]
					}, "s2"), t == Sn.State3 && je.jsxs(fa.div, {
						className: "TopInfo-content",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .2
						},
						children: [je.jsx("div", {
							style: {
								marginTop: "4vmin",
								color: "#fff",
								fontSize: "1.6vmin"
							},
							children: "出色的超低风阻系数"
						}), je.jsx("div", {
							style: {
								marginTop: "1.2vmin",
								color: "rgba(240, 198, 159, 1)",
								fontSize: "4vmin"
							},
							children: "Cd 0.195"
						}), je.jsx("div", {
							style: {
								marginTop: "1.2vmin",
								color: "#fff",
								fontSize: "1.6vmin"
							},
							children: "风，就是最好的设计师。"
						}), je.jsx("div", {
							style: {
								marginTop: "1.2vmin",
								color: "#fff",
								fontSize: "1.6vmin"
							},
							children: "经过 1000 次以上仿真实验和超过 300次油泥模型调整，不断寻找风道、车身曲线的最优解。"
						}), je.jsx("div", {
							style: {
								marginTop: "1.2vmin",
								color: "#fff",
								fontSize: "1.6vmin"
							},
							children: "最终达成 Cd0.195 超低风阻系数，带来难以想象的低能耗和出色续航表现。"
						})]
					}, "s3"), t == Sn.State4 && je.jsxs(fa.div, {
						className: "TopInfo-content",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .2
						},
						children: [je.jsx("div", {
							style: {
								marginTop: "4vmin",
								color: "rgba(240, 198, 159, 1)",
								fontSize: "1.8vmin"
							},
							children: "「智能驾驶」"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#fff",
								fontSize: "2vmin"
							},
							children: "隆重介绍XiaomiPilot更聪明、更安全的智能驾驶系统"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#aaa",
								fontSize: "1.4vmin"
							},
							children: "搭载两颗 NVIDIA DRIVE Orin 芯片，综合算力高达 508 TOPS，感知硬件具备罕见的大范围探测能力；"
						}), je.jsx("div", {
							style: {
								marginTop: "2vmin",
								color: "#aaa",
								fontSize: "1.4vmin"
							},
							children: "在此之上，以领先行业的智能驾驶算法深度赋能小米全栈自研的全场景智能辅助驾驶。"
						}), je.jsxs("div", {
							className: "addon",
							style: {
								fontSize: "2vmin"
							},
							children: [je.jsxs("div", {
								style: {
									marginTop: "10vmin"
								},
								children: [je.jsx("div", {
									children: "激光雷达"
								}), je.jsx("div", {
									style: {
										color: "rgba(255, 146, 69, 1)"
									},
									children: "x1"
								})]
							}), je.jsxs("div", {
								children: [je.jsx("div", {
									children: "高清摄像头"
								}), je.jsx("div", {
									style: {
										color: "rgba(255, 146, 69, 1)"
									},
									children: "x11"
								})]
							}), je.jsxs("div", {
								children: [je.jsx("div", {
									children: "毫米波雷达"
								}), je.jsx("div", {
									style: {
										color: "rgba(255, 146, 69, 1)"
									},
									children: "x3"
								})]
							}), je.jsxs("div", {
								children: [je.jsx("div", {
									children: "超声波雷达"
								}), je.jsx("div", {
									style: {
										color: "rgba(255, 146, 69, 1)"
									},
									children: "x12"
								})]
							})]
						})]
					}, "s4")]
				})
			}, "t2")
		})
}
const b4 = [{
	col: new bi("#25d6e9").convertSRGBToLinear(),
	bgUrl: "c1.png"
}, {
	col: new bi("#7c8670").convertSRGBToLinear(),
	bgUrl: "c2.png"
}, {
	col: new bi("#bababa").convertSRGBToLinear(),
	bgUrl: "c3.png"
}, {
	col: new bi("#645A64").convertSRGBToLinear(),
	bgUrl: "c4.png"
}, {
	col: new bi("#B3A0AC").convertSRGBToLinear(),
	bgUrl: "c5.png"
}, {
	col: new bi("#FF8E42").convertSRGBToLinear(),
	bgUrl: "c6.png"
}, {
	col: new bi("#CF9C33").convertSRGBToLinear(),
	bgUrl: "c7.png"
}, {
	col: new bi("#FFFFFF").convertSRGBToLinear(),
	bgUrl: "c8.png",
	tcar: Ne.ut_car_body_t_gm
}, {
	col: new bi("#FFFFFF").convertSRGBToLinear(),
	bgUrl: "c9.png",
	tcar: Ne.ut_car_body_t_cat
}];
function w4() {
	const [t, i] = ht.useState(Sn.Loading)
		, [r, o] = ht.useState(!1)
		, [p, y] = ht.useState("0");
	return ht.useEffect(() => {
		const d = L => {
			i(L)
		}
			, E = L => {
				o(L)
			}
			;
		return Ct.on(Ct.UPDATESHOWINGSTATE, d),
			Ct.on(Ct.CLICKEFFECT, E),
			() => {
				Ct.off(Ct.UPDATESHOWINGSTATE, d),
					Ct.off(Ct.CLICKEFFECT, E)
			}
	}
		, []),
		je.jsx(je.Fragment, {
			children: je.jsx("div", {
				style: {
					opacity: r ? 0 : 1,
					transition: "all 0.3s"
				},
				children: je.jsx(um, {
					mode: "popLayout",
					children: t != Sn.BeginAnim && t != Sn.Loading && je.jsx(fa.div, {
						className: "ColorBar-container",
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .5
						},
						children: je.jsx("div", {
							className: "ColorBar-content",
							children: b4.map((d, E) => je.jsx("div", {
								className: "Bar",
								style: {
									backgroundImage: `url(${vi.autoURL("res/icon/" + d.bgUrl)})`
								},
								onClick: () => {
									Ct.emit(Ct.CHANGECOLOR, d.col, d.tcar),
										y(E.toString())
								}
								,
								children: p == E.toString() && je.jsx("div", {
									className: "Bar-Line"
								})
							}, E))
						})
					})
				})
			})
		})
}
function A4() {
	return ht.useEffect(() => {
		const t = document.getElementById("custom-cursor")
			, i = document.getElementById("custom-cursor-inner")
			, r = document.getElementById("custom-cursor-outer")
			, o = d => {
				t.style.display = "flex",
					fk() ? (t.style.top = window.innerWidth - d.clientX + "px",
						t.style.left = d.clientY + "px") : (t.style.left = d.clientX + "px",
							t.style.top = d.clientY + "px")
			}
			, p = () => {
				i.style.width = "1rem",
					i.style.height = "1rem",
					i.style.backgroundColor = "rgb(255, 146, 69)",
					r.style.boxShadow = "0 0 0 0.5px rgb(255, 146, 69)",
					r.style.width = 1.8 + "rem",
					r.style.height = 1.8 + "rem"
			}
			, y = () => {
				i.style.width = "4px",
					i.style.height = "4px",
					i.style.backgroundColor = "#fff",
					r.style.boxShadow = "0 0 0 0.5px #fff",
					r.style.width = "2rem",
					r.style.height = "2rem"
			}
			;
		return document.addEventListener("pointermove", o),
			document.addEventListener("pointerdown", p),
			document.addEventListener("pointerup", y),
			() => {
				document.removeEventListener("pointermove", o),
					document.addEventListener("pointerdown", p),
					document.addEventListener("pointerup", y)
			}
	}
		, []),
		je.jsxs("div", {
			id: "custom-cursor",
			children: [je.jsx("div", {
				id: "custom-cursor-outer"
			}), je.jsx("div", {
				id: "custom-cursor-inner"
			})]
		})
}
function S4() {
	const [t, i] = ht.useState(Sn.Loading)
		, [r, o] = ht.useState(!1);
	return ht.useEffect(() => {
		const p = d => {
			i(d)
		}
			, y = d => {
				o(d)
			}
			;
		return Ct.on(Ct.UPDATESHOWINGSTATE, p),
			Ct.on(Ct.CLICKEFFECT, y),
			() => {
				Ct.off(Ct.UPDATESHOWINGSTATE, p),
					Ct.off(Ct.CLICKEFFECT, y)
			}
	}
		, []),
		je.jsxs(je.Fragment, {
			children: [je.jsx("div", {
				className: "Logo-container",
				onClick: () => {
					window.open("https://gamemcu.com")
				}
				,
				children: je.jsxs("div", {
					className: "Logo-content",
					children: [je.jsx("p", {
						style: {
							marginRight: "0.4rem",
							fontWeight: "300"
						},
						children: "Made by"
					}), je.jsx("p", {
						style: {
							color: "rgba(255, 141, 26, 1)",
							fontWeight: "600"
						},
						children: "GameMCU"
					})]
				})
			}), je.jsx("div", {
				style: {
					opacity: r ? 0 : 1,
					transition: "all 0.3s"
				},
				children: je.jsx(um, {
					mode: "popLayout",
					children: t != Sn.BeginAnim && t != Sn.Loading && je.jsx(fa.img, {
						initial: {
							y: 10,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						exit: {
							y: -10,
							opacity: 0
						},
						transition: {
							duration: .5
						},
						src: `${vi.autoURL("res/icon/bilibili.png")}`,
						alt: "",
						style: {
							position: "absolute",
							height: (hw(),
								"2rem"),
							left: "calc(50% + 14rem)",
							bottom: "calc(5vmin + 0.375rem)"
						},
						onClick: () => {
							window.open("https://www.bilibili.com/video/BV18x4y1m7Km")
						}
					})
				})
			})]
		})
}
function M4() {
	return je.jsxs(je.Fragment, {
		children: [je.jsx(_4, {}), je.jsx($k, {}), je.jsx(y4, {}), je.jsx(x4, {}), je.jsx(w4, {}), !hw() && je.jsx(A4, {}), je.jsx(S4, {})]
	})
}
ax.createRoot(document.getElementById("root")).render(je.jsx(xb.StrictMode, {
	children: je.jsx(M4, {})
}));
