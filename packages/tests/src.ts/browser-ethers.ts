'use strict';

console.log("Using global.ethers");

const anyGlobal = (window as any);

const ethers = anyGlobal.ethers;

export { ethers }
