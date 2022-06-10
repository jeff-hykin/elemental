export const h = (args...)=>console.log("h",args)
export const render = (args...)=>console.log("render",args)
export const hydrate = (args...)=>console.log("hydrate",args)
export const renderSSR = (args...)=>console.log("renderSSR",args)
export default { h, render, hydrate, renderSSR }