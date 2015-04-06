var find_average = function(original_data){
  var avg = d3.range(0,16).map(function(){
    return 0;
  })
  
  var num_days = 0

  original_data.forEach(function(d) {
          d3.range(16).forEach(function (a){
              if (d.prios[a]!= "undefined"){
                avg[a] += d.prios[a];  
              }
          })
      console.log(avg)
      num_days += 1
    });

  avg.forEach(function(d, i){
    avg[i] = d/num_days
  })
  console.log(avg);
  return avg
}