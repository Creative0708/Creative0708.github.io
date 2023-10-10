export interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        [key: string]: number;
    };
    uniformLocations: {
        [key: string]: WebGLUniformLocation | null;
    };
}

export function loadShader(gl: WebGL2RenderingContext, type: number, source: string){
    const shader = gl.createShader(type);
    if(!shader)
        throw Error('Failed to create shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

export function initShaderProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader){
    const program = gl.createProgram();
    if(!program)
        throw Error('Failed to create program');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        const error = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        const vsError = gl.getShaderInfoLog(vertexShader);
        if(vsError) console.error("Vertex shader error:", vsError);
        const fsError = gl.getShaderInfoLog(fragmentShader);
        if(fsError) console.error("Fragment shader error:", fsError);
        throw Error(`Failed to link program: ${error}`);
    }
    return program;
}
