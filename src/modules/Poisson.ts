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
    const createRenderTarget = () => {
      const odd = (iterations - 1) % 2 === 0;
      return {
        p_in: odd ? this.props.output0! : this.props.output1!,
        p_out: odd ? this.props.output! : this.props.output0!,
      };
    };
    const p_in: THREE.WebGLRenderTarget = createRenderTarget().p_in;
    const p_out: THREE.WebGLRenderTarget = createRenderTarget().p_out;

    for (var i = 0; i < iterations; i++) {
      this.uniforms!.pressure!.value = p_in.texture;
      this.props.output = p_out;
      super.update();
    }

    return p_out;
  }
}
