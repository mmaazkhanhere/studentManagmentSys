#! /usr/bin/env node
import chalkAnimation from "chalk-animation";
function animationStop() {
    return new Promise((res) => {
        setTimeout(res, 3000);
    });
}
async function animation() {
    let title = chalkAnimation.rainbow('Student Management System');
    await animationStop();
    title.stop();
}
await animation();
