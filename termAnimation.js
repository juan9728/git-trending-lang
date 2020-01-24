import chalkAnimation from 'chalk-animation';

let duck = [
    " ___      ___     ___      ___     ___",
    "_|_|_    _|_|_   _|_|_    _|_|_   _|_|_",
    "<(o )___ <(o )___<(o )___ <(o )___<(o )___",
    " ( ._> /  ( ._> / ( ._> /  ( ._> / ( ._> /",
    "  `---'    `---'   `---'    `---'   `---'",
].join('\n');
chalkAnimation.rainbow(duck,2);