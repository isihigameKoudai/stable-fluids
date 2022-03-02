import Common from "./Common";
import * as THREE from "three";

type Uniforms = {
  boundarySpace: {
    value: number | null;
  };
  pressure?: {
    value: number | null;
  };
  divergence?: {
    value: number | null;
  };
  px: {
    value: number | null;
  };
  fboSize: {
    value: number | null;
  },
  velocity: {
    value: number | null;
  },
  dt: {
    value: number | null;
  },
  isBFECC: {
    value: boolean;
  },
};

export type ShaderPassProps = {
  material: {
    vertexShader: string;
    fragmentShader: string;
    uniforms: Uniforms;
  };
  output?: number | null;
  output0?: number | null;
  output1?: number | null;
};

export default class ShaderPass {
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  material?: THREE.RawShaderMaterial;
  geometry?: THREE.PlaneBufferGeometry;
  plane?: THREE.Mesh;
  props: ShaderPassProps;
  uniforms: Uniforms;

  constructor(props: ShaderPassProps) {
    this.props = props;
    this.uniforms = this.props.material?.uniforms;
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();

    if (this.uniforms) {
      this.material = new THREE.RawShaderMaterial(this.props.material);
      this.geometry = new THREE.PlaneBufferGeometry(2.0, 2.0);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);
    }
  }

  update() {
    Common.renderer?.setRenderTarget(this.props?.output?);
    Common.renderer?.render(this.scene!, this.camera!);
    Common.renderer?.setRenderTarget(null);
  }
}
