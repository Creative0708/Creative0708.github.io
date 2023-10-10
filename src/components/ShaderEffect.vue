<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import vertSource from '../shader/foreground/vert.glsl?raw';
import fragSource from '../shader/foreground/frag.glsl?raw';

import { loadShader, initShaderProgram, type ProgramInfo } from '../lib/shader';

const canvas = ref<HTMLCanvasElement | null>(null);

function updateCanvasDimensions(){
    if(!canvas.value)
        return;
    canvas.value.width = window.innerWidth * window.devicePixelRatio;
    canvas.value.height = window.innerHeight * window.devicePixelRatio;
}

let shaderData: {
    gl: WebGL2RenderingContext,
    programInfo: ProgramInfo,
    positionBuffer: WebGLBuffer
} | null = null;

onMounted(() => {
    window.addEventListener('resize', updateCanvasDimensions);
    updateCanvasDimensions();

    const gl = canvas.value?.getContext('webgl2', { alpha: true });
    if(!gl)
        throw Error('Failed to get WebGL2 context');

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragSource);

    const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);

    const positionBuffer = gl.createBuffer();
    if(!positionBuffer)
        throw Error('Failed to create buffer');

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
        },
        uniformLocations: {
            resolution: gl.getUniformLocation(shaderProgram, 'uResolution'),
            time: gl.getUniformLocation(shaderProgram, 'uTime')
        }
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1
    ]), gl.STATIC_DRAW);

    shaderData = {
        gl,
        programInfo,
        positionBuffer
    };

    draw(performance.now());
});

function draw(timestamp: number){
    if(!shaderData)
        return;

    drawScene(shaderData.gl, shaderData.programInfo, shaderData.positionBuffer, timestamp);

    requestAnimationFrame(draw);
}

function drawScene(gl: WebGL2RenderingContext, programInfo: ProgramInfo, positionBuffer: WebGLBuffer, timestamp: number){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.useProgram(programInfo.program);

    gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(programInfo.uniformLocations.time, timestamp / 1000);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

onUnmounted(() => {
    window.removeEventListener('resize', updateCanvasDimensions);
});

</script>

<template>
    <canvas ref="canvas" class="w-screen h-screen absolute pointer-events-none"></canvas>
</template>