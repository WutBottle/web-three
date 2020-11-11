import _ from 'lodash';
import process from 'process';

const BenchMark = require('benchmark');
const Benchmark = BenchMark.runInContext({_, process});
window.Benchmark = Benchmark;

const wasmC = require('@C_CPP/test.c');


// const accumulateCPP = function () {
//   funcCPP();
// }
//
// const accumulateJS = function () {
//   // eslint-disable-next-line no-unused-vars
//   let res = 0;
//   const count = 10000;
//   for (let i = 1; i <= count; i++) {
//     res += i;
//   }
// }

export default function benchTest() {
  wasmC({
    'global': {mem: 42},
    'env': {
      'memoryBase': 0,
      'tableBase': 0,
      'memory': new WebAssembly.Memory({initial: 10, maximum: 100}),
      'table': new WebAssembly.Table({initial: 0, element: 'anyfunc'})
    }
  }).then(result => {
    const i32 = new Uint32Array(result.instance.exports.mem.buffer);
    for (let i = 0; i < 10; i++) {
      i32[i] = i;
    }
    console.log(result.instance.exports.accumulate(0, 10));
  });
//   const suite = new BenchMark.Suite;
// add tests
//   suite.add('accumulateJS#test.c', function () {
//     accumulateJS();
//   })
//     .add('accumulateCPP#test.c', function () {
//       accumulateCPP();
//     })
//     // add listeners
//     .on('cycle', function (event) {
//       console.log(String(event.target));
//     })
//     .on('complete', function () {
//       console.log('Fastest is ' + this.filter('fastest').map('name'));
//     })
//     // run async
//     .run({'async': true});
}