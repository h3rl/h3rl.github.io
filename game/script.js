var arr = [];
for(var i = 1; i <= 1000; i++){
	arr.push(i);
}

arr.sort(function(a,b){
	var ret = Math.floor(Math.random()*2);
	if(ret == 0){
		ret = -1;
	}
	return ret;
})

console.log(arr);
console.log(sortmap);