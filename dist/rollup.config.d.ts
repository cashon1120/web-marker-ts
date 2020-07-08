declare namespace _default {
    export const input: string;
    export namespace output {
        export const file: string;
        export const format: string;
        export const name: string;
        export const sourcemap: boolean;
    }
    export const plugins: import("rollup").Plugin[];
}
export default _default;
