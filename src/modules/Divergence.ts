import face_vert from "./glsl/sim/face.vert?raw";
import divergence_frag from "./glsl/sim/divergence.frag?raw";

import ShaderPass from "./ShaderPass";
import { SimProps } from "../types/Sim";

interface Props extends SimProps {
  boundarySpace: THREE.Vector2;
  dst: THREE.WebGLRenderTarget;
  src: THREE.WebGLRenderTarget;
  dt: number;
}

export default class Divergence extends ShaderPass {
  constructor(simProps: Props) {
    super({
      material: {
        vertexShader: face_vert,
        fragmentShader: divergence_frag,
        uniforms: {
          boundarySpace: {
            value: simProps.boundarySpace,
          },
          velocity: {
            value: simProps.src.texture,
          },
          px: {
            value: simProps.cellScale,
          },
          dt: {
            value: simProps.dt,
          },
        },
      },
      output: simProps.dst,
    });

    this.init();
  }

  updateDivergence({ vel }: { vel: THREE.WebGLRenderTarget }) {
    if (this.uniforms) {
      this.uniforms.velocity!.value = vel.texture;
    }
    super.update();
  }
}
