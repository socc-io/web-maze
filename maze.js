var express = require('express');
var app = express();
var fs = require('fs');
var PORT = 3000;

var dir = __dirname + "/contents"; // your directory

var files = fs.readdirSync(dir);
files.sort();

var map = {};

for( x in files ){
	file = files[x];
	temp = file.split("_");
	num = temp[0];
	temp_back = temp[1].split(".");
	name = temp_back[0];
	map[name] = num;
}

console.log(map);

var rankers = {};

app.use(express.static(__dirname + "/docs"));

app.get('/',function(req, res){
	res.sendFile(__dirname + "/docs/index.html");
	console.log("index called");
});


app.get('/maze', function(req, res){
	var answer = req.param("ans");
	var id = req.param("id");
	console.log("maze called with id : " + id + ", ans : " + answer);
	if(answer in map && id.length > 4){
		var text = fs.readFileSync(dir+"/"+map[answer]+"_"+answer+".wmz");
		rankers[id] = map[answer];
		res.send(text);
	}else{
		res.send("FALSE");
	}
	
	console.log(rankers);
});

app.get('/rank', function(req, res){
	console.log("rank called");
	str_rank = "";

	var sortable = [];
    for (var key in rankers)
      sortable.push([key, rankers[key]]);

    sortable.sort(function(a, b) {return b[1] - a[1]})

	for(key in sortable){
		new_key = sortable[key][0].substr(0,3);
		new_key += "********";
		rank = sortable[key][1];
		str_rank = str_rank + new_key+":"+rank+",";
	}
	if(str_rank.length > 0){
		str_rank = str_rank.substr(0,str_rank.length-1);
	}
	res.send(str_rank);
});


app.listen(PORT);
console.log("Server is running on localhost:"+PORT);
