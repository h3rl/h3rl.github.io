var subtitle = [
    'L8r!',
    '\"don\'t tell me what to do\"',
    'Hade ja',
    'Wow!',
    'STONKS',
    '<3',
    '(OwO)',
    'pls.. for real',
    'i don\'t care',
    'covid-19'
];

/*
background-size: auto 100%;
background-size: 100% auto;
*/
var sub = document.getElementById('subtitle');
sub.innerHTML = subtitle[Math.floor(Math.random() * subtitle.length)];