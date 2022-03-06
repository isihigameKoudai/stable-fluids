import face_vert from "./glsl/sim/face.vert?raw";
import pressure_frag from "./glsl/sim/pressure.frag?raw";

import ShaderPass from "./ShaderPass";
import { SimProps } from "../types/Sim";

interface Props extends SimProps {
  boundarySpace: THREE.Vector2;
  src_p: THREE.WebGLRenderTarget;
  src_v: THREE.WebGLRenderTarget;
  dst?: THREE.WebGLRenderTarget;
  dt: number;
}

export default class Pressure extends ShaderPass {
  constructor(simProps: Props) {
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

  updatePressure({
    vel,
    pressure,
  }: {
    vel: THREE.WebGLRenderTarget | THREE.WebGLCubeRenderTarget;
    pressure?: THREE.WebGLRenderTarget;
  }) {
    this.uniforms!.velocity.value = vel.texture;
    this.uniforms!.pressure.value = pressure!.texture;
    super.update();
  }
}
