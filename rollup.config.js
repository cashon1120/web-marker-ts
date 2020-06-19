import { terser} from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2';

const isPrd = process.env.NODE_ENV === 'production';

export default {
  input: 'src/app.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'web-marker',
    sourcemap: false
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    isPrd && terser()
  ]
};