#version 300 es

in vec3 vertex_position;
in vec4 color;

out vec4 v_color;

void main() {
    v_color = color;
    gl_Position = vec4(vertex_position, 1.0);
}
