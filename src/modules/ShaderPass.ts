import Common from "./Common";
import * as THREE from "three";

export type Uniforms = {
  boundarySpace?: {
    value: THREE.Vector2;
  };
  pressure?: {
    value: THREE.WebGLRenderTarget["texture"];
  };
  divergence?: {
    value: THREE.WebGLRenderTarget["texture"];
  };
  px: {
    value: THREE.Vector2 | null;
  };
  fboSize?: {
    value: THREE.Vector2 | null;
  };
  velocity?: {
    value: THREE.WebGLRenderTarget["texture"];
  };
  velocity_new?: {
    value: THREE.WebGLRenderTarget["texture"];
  };
  dt?: {
    value: number | null;
  };
  v?: {
    value: number | null;
  };
  isBFECC?: {
    value: boolean;
  };
};

export type ShaderPassProps = {
  material?: {
    vertexShader: string;
    fragmentShader: string;
    uniforms: Uniforms;
  };
  output?: THREE.WebGLRenderTarget;
  output0?: THREE.WebGLRenderTarget;
  output1?: THREE.WebGLRenderTarget;
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
    this.uniforms = this.props.material!.uniforms;
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
    Common.renderer?.setRenderTarget(this.props.output!);
    Common.renderer?.render(this.scene!, this.camera!);
    Common.renderer?.setRenderTarget(null);
  }
}
