import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
  },
  plugins: [
    resolve(),
    commonjs(),
    babel(),
  ],
}
