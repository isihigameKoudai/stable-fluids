import vertex_source from "./v_shader.vert?raw";
import fragment_source from "./f_shader.frag?raw";

function assert_is_defined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}

const maybeCanvas = document.getElementById("canvas");
assert_is_defined(maybeCanvas);

const canvas: HTMLCanvasElement = maybeCanvas as HTMLCanvasElement;

const maybe_context = canvas.getContext("webgl2");
assert_is_defined(maybe_context);

const context: WebGL2RenderingContext = maybe_context;

const vertex_shader = context.createShader(context.VERTEX_SHADER);
assert_is_defined(vertex_shader);
context.shaderSource(vertex_shader, vertex_source);
context.compileShader(vertex_shader);

const vertex_shader_compile_status = context.getShaderParameter(
  vertex_shader,
  context.COMPILE_STATUS
);
if (!vertex_shader_compile_status) {
  const info = context.getShaderInfoLog(vertex_shader);
  console.warn(info);
}

const fragment_shader = context.createShader(context.FRAGMENT_SHADER);
assert_is_defined(fragment_shader);
context.shaderSource(fragment_shader, fragment_source);
context.compileShader(fragment_shader);

const fragment_shader_compile_status = context.getShaderParameter(
  fragment_shader,
  context.COMPILE_STATUS
);
if (!fragment_shader_compile_status) {
  const info = context.getShaderInfoLog(fragment_shader);
  console.warn(info);
}

const program = context.createProgram();
assert_is_defined(program);
context.attachShader(program, vertex_shader);
context.attachShader(program, fragment_shader);
context.linkProgram(program);

const link_status = context.getProgramParameter(program, context.LINK_STATUS);
if (!link_status) {
  const info = context.getProgramInfoLog(program);
  console.warn(info);
}

context.useProgram(program);

const vertex_buffer = context.createBuffer();
const color_buffer = context.createBuffer();

const vertex_attrib_location = context.getAttribLocation(
  program,
  "vertex_position"
);
const color_attrib_location = context.getAttribLocation(program, "color");

const VERTEX_SIZE = 3;
const COLOR_SIZE = 4;

context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer);
context.enableVertexAttribArray(vertex_attrib_location);
context.vertexAttribPointer(
  vertex_attrib_location,
  VERTEX_SIZE,
  context.FLOAT,
  false,
  0,
  0
);

context.bindBuffer(context.ARRAY_BUFFER, color_buffer);
context.enableVertexAttribArray(color_attrib_location);
context.vertexAttribPointer(
  color_attrib_location,
  COLOR_SIZE,
  context.FLOAT,
  false,
  0,
  0
);

const halfsize = 0.5;
const vertices = new Float32Array([
  -halfsize,
  halfsize,
  0.0,
  -halfsize,
  -halfsize,
  0.0,
  halfsize,
  halfsize,
  0.0,
  -halfsize,
  -halfsize,
  0.0,
  halfsize,
  -halfsize,
  0.0,
  halfsize,
  halfsize,
  0.0,
]);

const colors = new Float32Array([
  1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0,
  1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
]);

context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer);
context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

context.bindBuffer(context.ARRAY_BUFFER, color_buffer);
context.bufferData(context.ARRAY_BUFFER, colors, context.STATIC_DRAW);

const VERTEX_NUMS = 6;
context.drawArrays(context.TRIANGLES, 0, VERTEX_NUMS);

context.flush();
