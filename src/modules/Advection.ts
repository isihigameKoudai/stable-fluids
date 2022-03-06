import * as THREE from "three";

import face_vert from "./glsl/sim/face.vert?raw";
import line_vert from "./glsl/sim/line.vert?raw";
import advection_frag from "./glsl/sim/advection.frag?raw";
import ShaderPass from "./ShaderPass";
import { ControlProps } from "./Controls";
import { SimProps } from "../types/Sim";

interface Props extends SimProps {
  fboSize: THREE.Vector2;
  src: THREE.WebGLRenderTarget;
  dst: THREE.WebGLRenderTarget;
  dt: number;
}

export default class Advection extends ShaderPass {
  line?: THREE.LineSegments;
  constructor(simProps: Props) {
    super({
      material: {
        vertexShader: face_vert,
        fragmentShader: advection_frag,
        uniforms: {
          boundarySpace: {
            value: simProps.cellScale,
          },
          px: {
            value: simProps.cellScale,
          },
          fboSize: {
            value: simProps.fboSize,
          },
          velocity: {
            value: simProps.src.texture,
          },
          dt: {
            value: simProps.dt,
          },
          isBFECC: {
            value: true,
          },
        },
      },
      output: simProps.dst,
    });

    this.init();
  }

  init() {
    super.init();
    this.createBoundary();
  }

  createBoundary() {
    const boundaryG = new THREE.BufferGeometry();
    const vertices_boundary = new Float32Array([
      // left
      -1, -1, 0, -1, 1, 0,

      // top
      -1, 1, 0, 1, 1, 0,

      // right
      1, 1, 0, 1, -1, 0,

      // bottom
      1, -1, 0, -1, -1, 0,
    ]);
    boundaryG.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices_boundary, 3)
    );

    const boundaryM = new THREE.RawShaderMaterial({
      vertexShader: line_vert,
      fragmentShader: advection_frag,
      uniforms: this.uniforms,
    });

    this.line = new THREE.LineSegments(boundaryG, boundaryM);
    this.scene?.add(this.line);
  }

  updateAdvection({ dt, isBounce, BFECC }: ControlProps) {
    if (this.uniforms) this.uniforms.dt.value = dt;
    this.line!.visible = isBounce;
    this.uniforms!.isBFECC!.value = BFECC;

    super.update();
  }
}
