import face_vert from "./glsl/sim/face.vert";
import pressure_frag from "./glsl/sim/pressure.frag";

import ShaderPass from "./ShaderPass";
import { SimProps } from "../types/Sim";

export default class Pressure extends ShaderPass {
  constructor(simProps: SimProps) {
    super({
      material: {
        vertexShader: face_vert,
        fragmentShader: pressure_frag,
        uniforms: {
          boundarySpace: {
            value: simProps.boundarySpace,
          },
          pressure: {
            value: simProps.src_p.texture,
          },
          velocity: {
            value: simProps.src_v.texture,
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

  updatePressure({ vel, pressure }) {
    this.uniforms.velocity.value = vel.texture;
    this.uniforms.pressure!.value = pressure.texture;
    super.update();
  }
}
