export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}

export const loadDependency = (src) => {
  return import(`../node_modules/${src}`)
  .then((module) => {
    console.log('dependency is loaded');
    return module;
  }).catch((e)=>{
    debugger;
    console.log(e)
  })
};