import face_vert from "./glsl/sim/face.vert?raw";
import divergence_frag from "./glsl/sim/divergence.frag?raw";

import ShaderPass from "./ShaderPass";
import { SimProps } from "../types/Sim";

export default class Divergence extends ShaderPass {
  constructor(simProps: SimProps) {
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

  updateDivergence({ vel }) {
    this.uniforms.velocity.value = vel.texture;
    super.update();
  }
}
