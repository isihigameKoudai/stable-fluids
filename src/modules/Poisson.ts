import face_vert from "./glsl/sim/face.vert?raw";
import poisson_frag from "./glsl/sim/poisson.frag?raw";

import ShaderPass from "./ShaderPass";
import { SimProps } from "../types/Sim";

interface Props extends SimProps {
  boundarySpace: THREE.Vector2;
  dst_: THREE.WebGLRenderTarget;
  dst: THREE.WebGLRenderTarget;
  src: THREE.WebGLRenderTarget;
}
export default class Poisson extends ShaderPass {
  constructor(simProps: Props) {
    super({
      material: {
        vertexShader: face_vert,
        fragmentShader: poisson_frag,
        uniforms: {
          boundarySpace: {
            value: simProps.boundarySpace,
          },
          pressure: {
            value: simProps.dst_.texture,
          },
          divergence: {
            value: simProps.src.texture,
          },
          px: {
            value: simProps.cellScale,
          },
        },
      },
      output: simProps.dst,
      output0: simProps.dst_,
      output1: simProps.dst,
    });

    this.init();
  }

  updatePoisson({ iterations }: { iterations: number }) {
    let p_in, p_out;

    for (var i = 0; i < iterations; i++) {
      const isOdd = i % 2 === 0;

      p_in = isOdd ? this.props.output0 : this.props.output1;
      p_out = isOdd ? this.props.output1 : this.props.output0;

      this.uniforms!.pressure.value = p_in!.texture;
      this.props.output = p_out;
      super.update();
    }

    return p_out;
  }
}
