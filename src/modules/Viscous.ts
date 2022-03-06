import face_vert from "./glsl/sim/face.vert?raw";
import viscous_frag from "./glsl/sim/viscous.frag?raw";

import ShaderPass from "./ShaderPass";

// boundarySpace
type Props = {
  cellScale: THREE.Vector2;
  boundarySpace: THREE.Vector2;
  dst_: THREE.WebGLRenderTarget;
  dst: THREE.WebGLRenderTarget;
  src: THREE.WebGLRenderTarget;
  viscous: number;
  dt: number;
};
export default class Viscous extends ShaderPass {
  constructor(simProps: Props) {
    super({
      material: {
        vertexShader: face_vert,
        fragmentShader: viscous_frag,
        uniforms: {
          boundarySpace: {
            value: simProps.boundarySpace,
          },
          velocity: {
            value: simProps.src.texture,
          },
          velocity_new: {
            value: simProps.dst_.texture,
          },
          v: {
            value: simProps.viscous,
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

      output0: simProps.dst_,
      output1: simProps.dst,
    });

    this.init();
  }

  updateViscous({
    viscous,
    iterations,
    dt,
  }: {
    viscous: number;
    iterations: number;
    dt: number;
  }) {
    const exportedFboOut: THREE.WebGLRenderTarget =
      (iterations - 1) % 2 === 0 ? this.props.output1! : this.props.output0!;

    if (this.uniforms) {
      this.uniforms.v.value = viscous;
    }

    for (var i = 0; i < iterations; i++) {
      const isOdd = i % 2 == 0;
      const fbo_in = isOdd ? this.props.output0! : this.props.output1!;
      const fbo_out = isOdd ? this.props.output1! : this.props.output0!;

      if (this.uniforms) this.uniforms.velocity_new!.value = fbo_in.texture;
      this.props.output = fbo_out;
      if (!!fbo_in && this.uniforms) {
        this.uniforms.dt!.value = dt;
      }

      super.update();
    }

    return exportedFboOut;
  }
}
