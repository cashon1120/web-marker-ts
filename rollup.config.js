import { terser} from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2';

const isPrd = process.env.NODE_ENV === 'production';
export default {
  input: 'src/webMarker.ts',
  output: {
    file: 'dist/web_marker.js',
    format: 'umd',
    name: 'web_marker',
    sourcemap: false
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    isPrd && terser()
  ]
};