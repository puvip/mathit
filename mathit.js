var question ="";
var alpha_numeric_x="";
var alpha_numeric_power="";
var equation ="";
var select_value ="";
var f_of_x="";
var combine="";
var old_data = "";
var chart="";
var graph="";
var getcanvas="";
var num_add="";
var num_add_full="";
var num_rep="";
var over_all="";
var x2_condition="";
var x_condition="";
var num_condition="";
var x2_combine="";
var x_combine="";
var color_rand="";
var check;
var store = [];
var x_val = 0;
var y_val = 0;
var datapoints = [];
var  datapoints_quad=[];
var text="";  var keys="";var res_data ="";
var num_reg =/-?\b\d+\b/g;
var x_reg =/([\-+])?\s*(\d+)?([a-zA-Z])\b/g;
var power_reg =/([\-+])?\s*(\d+)?([a-zA-Z](\d+))\b/g;
var int_reg =/[_^]({[+-]?(\d+)?}|[+-]?(\d{1}))/g;
var int_reg_remove =/(.*?)[\^]({[+-]?(\d+)?}|[+-]?(\d{1}))/;
var solve  = function (id)  {

              var question =   document.getElementById(id);
              var universal_check = question.value.match(/[a-z]{3}/g);
              if (universal_check == null) {
                   if (id != "move") {
                        if (question.value !="" && question.value != undefined) {

                                  location.href ="#q="+question.value;
                                  if (id == "upinput") {question.value ="";}}
	                                  }
                                  }
                  else { location.href ="#q="+question.value;}

                  return false
                }

function runfirst() {
datapoints = [];
datapoints_quad=[];
combine="";
graph();
setTimeout(function () {
 	var datas = window.location.href;
  var other = datas.match(/[&#]src=([^&]+)/);
  var solver_path= datas.match(/[&#]q=([^&]+)/);
if(other != null)
    {
      var check = datas.split("#");
      var finalurl = check[0]+other[1];
      document.getElementById('allframes').src=finalurl;
      id('equ_solver_box').hide();
	    id('others').show();
    }
  else
  {
  	   id('equ_solver_box').show();
        id('others').hide();
        if(solver_path != null) {
        id('equ').val(solver_path[1]);
        field.latex("");
        field.write(solver_path[1]);
        var universal_check = solver_path[1].match(/[a-z]{5}/g);
        var universal_check1 =solver_path[1].match(/[\{|\\|\[|=|-]/g);
        if (universal_check != null &&  universal_check1 == null) {
   universal(solver_path[1]);
            }
            else {
              parser_main();
              setTimeout(function(){
              document.getElementsByClassName("clicker")[0].getElementsByTagName("button")[0].focus();
            },600)
            }
  }}
 },1);
}



var parser_main     = function () {

                        var native;
                        $('.body').show();
                        $('#graph').hide();
                        $('#maxima_graph').hide();
                        $('.search_box').hide();
                        $('.clicker').html("");
                        $('.step_box').html("");
                        question =  $('#equ').val();
                        //a = question.match(int_reg).map(s => {return s.match(/[+-]?(\d+)/g)});
                        var iteration = question.split(/;/g); // find more than on equation
                        var match = question.match(/[a-z]\^?(\d+)/g);
                        var max = 0;
                                       if (match != null) {
                                         for (var i = 0; i < match.length; i++) {
                                           var currentValue = parseInt(match[i].substring(2));
                                           if(currentValue > max){max=currentValue;}
                                         }}

                      if (question != "") {
                    console.log(question)
                      switch (true) {
                        case ((iteration.length >1) && (iteration[1] != "")):
                                maxima(question).multiple();
                                native="multiple"
                            break;
                        case (!!question.match("int")):
                               maxima(question).int();
                               native="int"
                            break;
                        case (!!question.match(/\\frac[\{]((d)|(partial))/g)):
                          maxima(question).diff();
                               native="diff"
                            break;
                        case (!!question.match("lim")):
                          maxima(question).lim();
                                  native="limits"
                            break;
                        case (!!question.match(/sin|cos|tan|sec|cosec|cot/g)):
                            maxima(question).trig();
                              native="trig"
                            break;
                        case (!!question.match("matrix")):
                        maxima(question).matrix();
                              native="matrix"
                            break;
                        case (!question.match(/[a-z]/g)):
                            solver(question).normal();
                            native="normal_calc"
                            break;
                        case (max < 2):
                        if(question.match(/([+-]|\d+)([a-z])/g))
                             {
                              solver(question).linear();
                              native="linear"
                             }
                        else{
                           solver(question).normal();
                           native="normal_calc"
                            }
                            break;
                        case (max == 2):
                              solver(question).quad();
                              native="quad"
                            break;
                        case (max > 2):
                              maxima(question).algebra();
                              native="higher"
                            break;
                        default:
                          $('.step_box').append('<li class="sorry">I dont know how do solve this data .<i></li>');
                            native="other"
                      }
                    }
                console.log(native)
                  }


var selector = function (value) {select_value = value;parser_main();}
var colour   = function (colour) {return colour ="red";}

var tex      =  function (data) { var latex = data.replace(/\^/g, "");
                  	                 	   var latex_form = latex.replace(/([a-z])(\d+)\b/g,
                  	                 	   function myFunction(tot,c1,c2) {var tag=(c1 =='^'?'sup':'sup');return c1+'<'+tag+'>'+c2+'</'+tag+'>';});
 	                                       return latex_form;
 	                                     }
var fact     = function (k, n) { return k ? (n % k, k) : n;}
var parser   = {
      replace_add_before_plus  : function (data) { var str ='+'+data; if (!!str) { return  parser.replace_end_symbol(str.replace(/(\+\+)|([-+]-|-\+)/g, function(m, g1, g2) {return g1? "+" : "-";}));}},
      replace_double_to_single : function (data) { var str =data; if (!!str) { return str.replace(/(\+\+)|([-+]-|-\+)/g, function(m, g1, g2) {return g1? "+" : "-";});}},
      replace_plus_to_min      : function (data) { var str =data; if(!!str){return str.replace(/([+]|[-])\b/g, function(m) {return (m =="+")? "-" : "+" });}},
      replace_start_end_symbol : function (data) { var str =data; return str.replace(/(^[+])|([+-]$)/g ,"");},
      replace_end_symbol       : function (data) { var str =data; return str.replace(/([+-]$)/g ,"");},
      replace_zero             : function (data) { var str = data; return str.replace(/\b[+-]?([0])?[?=a-zA-Z]\b/g , "").replace(/\b[+-]?([0])?([?=a-zA-Z])(\d+)\b/g,"").replace(/\b[+-]?([0])\b/g,"");},
      number_check             : function (data) { var str = data; var match = str.match(/-?\b\d+\b/g);if (match != null) {return match.join('+');}else {return"0";}},
      number_replace           : function (data) { var str = data; return str.replace(/\b([+-])?(\d+)\b/g , "");},
      select_mode              : function (data) { var str = data; var matched_data = str.match(RegExp("[+-]?\\d+[(?=" + select_value+ "|$)]", "g"));
                                    if (!!matched_data) {
	                                                var remaining_data = str.replace(matched_data,"");
	                                 if (!!remaining_data) { return parser.replace_start_end_symbol(matched_data+'='+parser.replace_start_end_symbol(parser.replace_plus_to_min(parser.replace_add_before_plus (remaining_data))));}
	                                 else {return select_value+"=0";}
                                 }else {return select_value+'=0';} },
	    roundtwo                 : function (data) {return Math.round(100 * data) / 100},
      final_out                : function (data) {var str=data; var bot = str.match(/(-)?(\d+)(?=[?=a-z][=])/g);
                                  if (!!bot) {var up = str.split("=");return up[1]+'/'+bot; }
         								          else {return '0';}},

      valueadd                 : function (data) { text="";
                                                var string = data.string;
                                                var regex = data.reg;
                                                var key_need = data.key_need;
	             										res_data = regex.exec(string);
	             											while(res_data)
	             															{
          																		if(!store[res_data[3]])
           																		{store[res_data[3]] = [];}
          																		store[res_data[3]].push({
          																		sign: res_data[1] || '+',
          																		multiplier: (typeof res_data[2] != 'undefined') ? parseInt(res_data[2]) : 1
          																		});
          																		res_data = regex.exec(string);
      			 															}
     																					Object.keys(store).forEach(function(key){
          																			let val = 0;
          																			store[key].forEach(function(occ){
      																				if(occ.sign == '+')
          																				val += occ.multiplier;
      																				else
          																				val -= occ.multiplier;
          		 																	});
                                              text +='+'+val+key;
                                                if (key_need == 'true') {
                                                      for (var i=0; i<key.length; i++) {
                                                            re = new RegExp("[a-z]");
                     													if (re.test(key[i])) {
                     													keys=key[i];
                     													if (select_value == key[i]) {
                                                 document.getElementsByClassName('clicker')[0].innerHTML +='<button class="selector" onfocus="selector(this.innerHTML)" style="background-color:#099999;">'+key[i]+'</button>';
                     													}else {
 																					document.getElementsByClassName('clicker')[0].innerHTML +='<button class="selector" onfocus="selector(this.innerHTML)" tabindex="'+i+'">'+key[i]+'</button>';
                     													}
                     													}}}else {}
                     												});
                														store = [];
																			return parser.replace_add_before_plus (text).replace(/^([+])/g , "")},
           }

 var solver = function (data) {
               return {
                      main : function(){
                                        $('.step_box').append('<li class="line_remove">Step 1:</li>');
                                        $('.step_box').append('<li>'+tex(question)+'</li>');
                                        var equal_sep = data.split(/=/g);
                                        if((equal_sep[1] != "") && (equal_sep[1] != null))
                                          {
                                              if (equal_sep[1] == 0){combine = equal_sep[0];}
                                              else{
                                                var add_plus      =  parser.replace_plus_to_min(parser.replace_add_before_plus (equal_sep[1]));
                                                  combine   =  equal_sep[0]+add_plus;
                                                }
                                                combine =combine.replace(/\^/g,"");
                                                $('.step_box').append('<li class="line_remove">Step 2:</li>');
                                                $('.step_box').append('<li>All the datas of Right side move to left side</li>');
                                                $('.step_box').append('<li>'+tex(combine)+'=0</li>');
                                                num_add             =  parser.replace_end_symbol(parser.number_check(combine));
                                                num_rep             =  parser.replace_end_symbol(parser.number_replace(combine));
                                                num_add_full        =  parser.replace_end_symbol(parser.replace_zero(parser.replace_add_before_plus (eval(num_add))));
                                                alpha_numeric_power =  parser.replace_zero(parser.valueadd({ string :num_rep, reg:power_reg, key_need:'false'}));
                                                alpha_numeric_x     =  parser.replace_zero(parser.valueadd({ string :num_rep, reg:x_reg, key_need:'false'}));
                                                return true;
                                          }
                                          else {
                                            a=data+'=0';
                                            solver(a).main();

                                          }
                                        },
                     normal :function(){
                                          var rest = data.replace(/\\right(\]|\))/g,")").replace(/\\left(\(|\[)/g,"(").replace(/\\/g,"").replace("cdot","*").replace(/frac{/g,"").replace(/}}{|}{/g,"/").replace(/}/g,"")
                                          $('.step_box').append('<li>Total:'+eval(rest)+'</li>');
                                        },

 	                  linear :function (){
                                         solver(data).main();
                                         alpha_numeric_x = parser.replace_zero(parser.valueadd({ string :num_rep, reg:x_reg,key_need:'true'}));
                                         if (num_add != "") {
                                               $('.step_box').append('<li class="line_remove">Step 3:</li>');
                                               $('.step_box').append('<li>Add All numeric values</li>');
                                               $('.step_box').append('<li>'+num_rep+num_add_full+'=0</li>');
                                               $('.step_box').append('<li class="line_remove">Step 4:</li>');
                                               $('.step_box').append('<li>Add Same AlphaNumeric values</li>');
                                               over_all = alpha_numeric_x+num_add_full;
                                       }
                                       else {
                                               $('.step_box').append('<li class="line_remove">Step 4:</li>');
                                               $('.step_box').append('<li>Add Same AlphaNumeric values</li>');
                                               over_all = alpha_numeric_x;
                                             }
                                               $('.step_box').append('<li>'+over_all+'=0</li>');
                                               solver(over_all).select_variable();
                                        },
                  quad : function () {
                                            solver(data).main();
                                            var res_check = combine.match(/([a-z])(?!.*\1.*$)/g);
                                            if(res_check.length <= 1)
                                            {
                                              solver(data).quad_only_x();
                                            }
                                            else{
                                             maxima(data).algebra();
                                           }
                                         },
              quad_only_x : function () {

                                            alpha_numeric_power ="";alpha_numeric_x="";
                                            var string_data     = num_rep;
                                            console.log(num_rep)
                                            alpha_numeric_power = parser.replace_zero(parser.valueadd({ string :string_data, reg:power_reg, key_need:'false'}));
                                            alpha_numeric_x     = parser.replace_zero(parser.valueadd({ string :string_data, reg:x_reg, key_need:'false'}));
                                            $('.step_box').append('<li class="line_remove">Step 3:</li>');
                                            $('.step_box').append('<li>Add Same numeric values </li>');
                                            $('.step_box').append('<li>'+tex(num_rep)+num_add_full+'=0</li>');
                                            $('.step_box').append('<li class="line_remove">Step 4:</li>');
                                            $('.step_box').append('<li>Add same Alphanumeric values and power values</li>');
                                            var final_string = parser.replace_start_end_symbol(parser.replace_double_to_single(alpha_numeric_power +parser.replace_add_before_plus (alpha_numeric_x)+num_add_full));
                                            $('.step_box').append('<li>'+tex(final_string)+'=0</li>');
                                             solver(final_string).variable_values();
                                             select_value = final_string.match(/[a-z]/g)[0];
                                             if ((!!x2_condition) && (x_condition) && (num_condition)) {solver("").quadratic_formula();}
                                             else if ((!!x_condition) && (num_condition)) {solver(final_string).select_variable();}
                                             else if((!!x2_condition) && (!!x_condition))
                                             {
                                         	     var coman_factor = fact(x2_combine,x_combine);
                                               var x2_after_factor = eval(x2_combine/coman_factor);
                                               var x_after_factor = eval(x_combine/coman_factor);
                                               $('.step_box').append('<li>'+coman_factor+select_value+'('+x2_after_factor+select_value+parser.replace_add_before_plus (x_after_factor)+')=0</li>')
                                               $('.step_box').append('<li>'+coman_factor+select_value+'=0 &'+x2_after_factor+select_value+parser.replace_add_before_plus (x_after_factor)+'=0</li>')
                                               $('.step_box').append('<li>'+select_value+'=0 &'+select_value+'='+eval(parser.replace_plus_to_min(parser.replace_add_before_plus (x_after_factor))/x2_after_factor)+'</li>')
                                             }
                                            else if((!!x2_condition) && (!!num_condition))
                                            {
                                              var r_side = parser.replace_plus_to_min(parser.replace_add_before_plus (num_condition));
                                              $('.step_box').append('<li>'+tex(x2_condition[0])+'='+r_side+'</li>')
                                              $('.step_box').append('<li>'+tex(x2_condition[3])+'='+r_side +'/'+x2_condition[2]+'</li>')
                                              $('.step_box').append('<li>'+tex(x2_condition[3])+'='+eval((r_side) / (x2_condition[2]))+'</li>');
                                              var html = katex.renderToString(select_value+"=\\sqrt{"+eval(r_side / x2_condition[2])+"}");
                                              $('.step_box').append('<li>'+html+'</li>')
                                            }
                                            else{
                                              $('.step_box').append('<li>'+parser.select_mode(x2_condition[2])+'</li>')
                                            }
                                          },
                quadratic_formula : function () {
                                          	var a = parseInt(x2_combine);
                                         		var b = parseInt(parser.replace_start_end_symbol(x_combine));
                                         		var c = parseInt(num_condition);
                                         		  $('.step_box').append('<li class="line_remove">Step 5:</li>');
                                         		  $('.step_box').append("<li style='color:blue'>Apply the Quadratic formula:-</li>")
                                                                     $('.step_box').append("<li class='formulas'>"+ katex.renderToString("x\=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}")+"</li>")
                                                                     $('.step_box').append('<li class="line_remove">Step 6:</li>');
                                         								            $('.step_box').append("<li>"+katex.renderToString('x\=\\frac{-('+b+')\\pm\\sqrt{'+b+'^2-4('+a+')('+c+')}}{2('+a+')}')+"</li>")
                                         								                  var ac =Math.floor(4*a*c);
                                          							                    var sqr=Math.pow(b,2);
                                          							                    var down=Math.floor(2*a);
                                          							                    var sqr_in = Math.floor(Math.pow(b,2)-4*a*c);
                                          							             $('.step_box').append('<li class="line_remove">Step 7:</li>');
                                       	            	   	         $('.step_box').append("<li>"+katex.renderToString('x\=\\frac{-('+b+')\\pm\\sqrt{'+sqr+'-('+ac+')}}{'+down+'}')+"</li>");
                                       	            	   	         $('.step_box').append("<li>"+katex.renderToString('x\=\\frac{-('+b+')\\pm\\sqrt{'+sqr_in+'}}{'+down+'}')+"</li>");
                                       	            	   	               var sqr_in =sqr_in.toString();
                                       	            	   	               var bval =sqr_in.match(/[-]/g);
                                       	            	             if (bval == null){
                                          										              var x1 =parser.roundtwo(eval((-b-Math.sqrt(b*b-4*a*c))/(2*a)));
                                          											            var x2 =parser.roundtwo(eval((-b+Math.sqrt(b*b-4*a*c))/(2*a)));
                                          											            var up_right = Math.sqrt(b*b-4*a*c);
                                          											            $('.step_box').append('<li class="line_remove">Step 8:</li>');
                                          										              $('.step_box').append("<li>"+katex.renderToString('x_1\=\\frac{-('+b+')+'+up_right+'}{'+down+'}')+"</li>");
                                       	            	   	                $('.step_box').append("<li>"+katex.renderToString('x_2\=\\frac{-('+b+')-'+up_right+'}{'+down+'}')+"</li>");
                                          										              $('.step_box').append("<li class='answer'>x<sub>1</sub>="+x1+"<br><li class='answer'>x<sub>2</sub>="+x2+"</li></li>");;
                                          										              var center = eval(-b/(2*a))
                                          										              var x1_sub = parser.roundtwo(eval((a*center*center)+(b*center)+c));
                                          										              datapoints_quad.push({x:x1 ,y:0},{x:center, y:x1_sub},{x:x2, y:0})
                                          										              id('graph').show();
                                          										             graph();
                                          										            }
                                          										      else  {
                                          										   	         $('.step_box').append('<li class="line_remove">Step 8:</li>');
                                       	            	   	               $('.step_box').append("<li>"+katex.renderToString('x_1\=\\frac{-('+b+')+\\sqrt{'+sqr_in+'}}{'+down+'}')+"</li>");
                                       	            	   	               $('.step_box').append("<li>"+katex.renderToString('x_2\=\\frac{-('+b+')-\\sqrt{'+sqr_in+'}}{'+down+'}')+"</li>");
                                       	            	   	               $('.step_box').append("<li class='answer'>No real solution</li>");
                                       	            	   	              }
                                                                      },
                      select_variable : function () {
                                                          if (!!select_value) {
                                                                $('.step_box').append('<li class="line_remove">Step 5:</li>');
                                                                $('.step_box').append('<li>'+parser.select_mode(data)+'</li>');
                                                                var final_result = select_value+'='+parser.final_out(parser.select_mode(data))
                                                                var graph_check = data.replace(/[xy]/g,"").match(/[a-z]/g);
                                                            if (graph_check == null) {solver(data).graph()}
                                                          }
                                                        },

                        variable_values : function () {
                                          x2_condition=power_reg.exec(data);
                                          x_condition=x_reg.exec(data);
                                          num_condition=data.match(num_reg);
                                          if((!!x2_condition) && (!!x_condition)){
                                                x2_combine = x2_condition[1] ? x2_condition[1]+x2_condition[2] : x2_condition[2];
                                                x_combine = x_condition[1]  ? x_condition[1]+x_condition[2] : x_condition[2];}
                                                },
                                  graph : function(){
                                            select_value ="y";
                                            var y_solve = parser.final_out(parser.select_mode(data));
                                            select_value ="x";
                                            var x_solve = parser.final_out(parser.select_mode(data));
                                            x_val =  eval(x_solve.replace("y",'*0'));
                                            y_val = eval(y_solve.replace("x",'*0'));
                                            datapoints.push({x:x_val, y:0},{x:0 , y:y_val});
                                            id('graph').show();
                                            graph ();
                                                  },

         }

    }



var maxima = function (data) {
            return{
              main:function(){
                id('maxima_graph').html('<p id="loading"></p>');
                var d="";var select="";var after_convert="";var plot ="";
                id('maxima_graph').show();
                id('maxima_graph').html("");
                     $('.step_box').append('<li class="sorry"><i>--Solving the solution via Maxima--<i></li>');
                     $('.step_box').append('<li class="sorry"><i>--only Results are available--<i></li>');
                     $('.step_box').append('<li class="sorry"><i>--We will include the steps in future--<i></li>');
              },
              multiple :function (){
                solver(data).main();
                maxima(data).main()
                var res_check = data.match(/([a-z])(?!.*\1.*$)/g)
                var before_convert = data.replace(/([0-9]+)([a-zA-Z])/g,"$1*$2").replace(/([a-zA-Z])([0-9]+)/g,"$1^$2");
                after_convert= before_convert.replace(/(\+)/g,"%2B");
                after_convert = after_convert.replace(/(;)/g,",").replace(/(,)$/,"");
                select = res_check;
                $.ajax({
                        url: 'group/php/max_graph_circle.php?text='+after_convert,
                    success: function(result){maxima("").plot();}
                      });
                 setTimeout(function () {maxima("").solve(after_convert,select);},400);
              },
              algebra:function(){
                    solver(data).main();
                    maxima(data).main()
                     var res_check = combine.match(/([a-z])(?!.*\1.*$)/g)
                     var select_match = /([\-+])?\s*(\d+)?([a-zA-Z])/g;
                     parser.valueadd({ string :combine, reg:select_match, key_need:'true'});
                     select = select_value
                     var before_convert = combine.replace(/([0-9]+)([a-zA-Z])/g,"$1*$2").replace(/([a-zA-Z])([0-9]+)/g,"$1^$2");
                     after_convert= before_convert.replace(/(\+)/g,"%2B");
              if(res_check.length <= 1)
                      {plot = 'max_graph';}
              else{ plot ='max_graph_circle';}
              $.ajax({
                       url: 'group/php/'+plot+'.php?text='+after_convert+'&var='+res_check[0],
                   success: function(result){
                       maxima(data).plot();
                      }
                    });
                         setTimeout(function () {maxima("").solve(after_convert,select);},400);
              },
          int : function(){
                    maxima(data).main();
                     a = data.match(int_reg).map(s => {return s.match(/[+-]?(\d+)/g)});
                     var str = data.replace(int_reg_remove,"").replace(/[{}|[\]]/g,"").replace(/([0-9]+)([a-zA-Z])/g,"$1*$2").replace(/(\+)/g,"%2B");;
                     var select_match = /([\-+])?\s*(\d+)?([a-zA-Z])/g;
                     parser.valueadd({ string :str, reg:select_match, key_need:'true'});
                     var tex_form ="";
                     $('.step_box').append('<li id="maxima_result" ></li>');
                     id('maxima_result').html('<p id="smallloading"></p>');
                       id('maxima_graph').hide();
               $.ajax({
                 url: 'group/php/maxima_int.php?text='+str+'&var='+select_value+'&down='+a[0][0]+'&up='+a[1][0],
             success: function(result){

                  tex_form = result.replace("false","");
                  tex_form =tex_form.replace(/(\$)/g,"");
                  $('#maxima_result').html(katex.renderToString(tex_form));
                   }
               });
          },
          diff:function (){

          },
          lim:function (){
            maxima("").main()
                  limit_reg =/{(.*)[\\](.*)[\\](.*)}\b(.*)/g;
                  var str = limit_reg.exec(data);
                  var tex_form ="";
                  $('.step_box').append('<li id="maxima_result" ></li>');
                  id('maxima_result').html('<p id="smallloading"></p>');
                  var res =str[4].replace(/[{}|[\]]/g,"").replace(/([0-9]+)([a-zA-Z])/g,"$1*$2").replace(/(\+)/g,"%2B");
                  var to = (str[3] == 'infty') ? 'inf' : str[3];
                  id('maxima_graph').hide();
            $.ajax({
              url: 'group/php/maxima_lim.php?text='+res+'&var='+str[1]+'&down='+to,
          success: function(result){

               tex_form = result.replace("false","");
               tex_form =tex_form.replace(/(\$)/g,"");
               $('#maxima_result').html('Result='+katex.renderToString(tex_form));
                }
            });
          },
          trig:function(){
             maxima("").main();
             console.log(data)
            var before_convert = data.replace(/([0-9]+)([a-zA-Z])/g,"$1*$2").replace(/([a-zA-Z])([0-9]+)/g,"$1^$2").replace(/\\/g,"");
            var after_convert= before_convert.replace(/(\+)/g,"%2B");
            console.log(after_convert)
            $('.step_box').append('<li class="sorry">Note*:<i>Graph  not available <i></li>');
            maxima("").solve(after_convert,"x");
            id('maxima_graph').hide();
          },
          matrix:function(){

          },
          plot : function(){
                 $.ajax({url: './circle.html', success: function(result){id('maxima_graph').html(result);},error: function(data, errorThrown){
                if (errorThrown) {id('maxima_graph').html("");}
                }});

          },
          solve: function(str,select){
                    var tex_form ="";
                    $('.step_box').append('<li id="maxima_result" ></li>');
                    id('maxima_result').html('<p id="smallloading"></p>');
              $.ajax({
                url: 'group/php/maxima.php?text='+str+'&var='+select,
            success: function(result){
                 tex_form = result.replace("false","");
                 tex_form =tex_form.replace(/(\$)/g,"");
                 $('#maxima_result').html(katex.renderToString(tex_form));
                  }
              });

          },


            }

  }




function universal(data) {
    cls('clicker').html("");
	  cls('body').show();
	  cls('step_box').html("");
	  id('graph').hide();
	  id('maxima_graph').hide();
    $('.step_box').append('<li><i >Oops..!We are Creating New algoritham of search query</i></li>');
    $('.step_box').append('<li><i>They will update on future release</i></li>');
}


 var graph = function () {
    chart  = new CanvasJS.Chart("chartContainer", {
            zoomEnabled : true,
                  theme : "theme",
                  title : {
                        text: "Try Zooming And Panning"
                          },
                  axisY : {
  	                        gridColor:"#eee",
  	                        gridThickness:1,
                            includeZero:true,
                            stripLines:[{ value:0 ,color:"#000",thickness:1 }],
                          },
                  axisX :{
  	                        gridColor:"#eee",
  	                        gridThickness:1,
      	                    includeZero:true,
                            stripLines:[{ value:0 ,color:"#000",thickness:1}],
                        },
                  title : {
                            text: "Graph"
                          },
                    data: [{
                            lineThickness: 1.5,
                            type: "line",
                            color:"blue",
                            markerType:"circle",
                            markerSize :7,
                            dataPoints: datapoints
                          },
                          {
                            lineThickness: 1.5,
                            type: "spline",
                            color:"blue",
                            markerType:"circle",
                            markerSize :7,

                            dataPoints: datapoints_quad
                          }],
                legend: {
					             cursor    : "pointer",
                       itemclick : function (e) {
						                              if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
							                                     e.dataSeries.visible = false;
						                                           }
						                               else {
							                                        e.dataSeries.visible = true;
						                                    }
						                        chart.render();
					                             }
				                }
});
chart.render();
}


	var pdf_down = function () {
		              var datas = $('.step_box').text();
				          html2canvas(document.getElementById('graph')).then(function(canvas) {
                  getcanvas = canvas;
                });
                var imgData = getcanvas.toDataURL("image/jpeg", 1.0);
                var doc     = new jsPDF();
                doc.setFontSize(10);
                var doc = new jsPDF();
                var specialElementHandlers = {'#editor': function(element, renderer){return true; }};
                doc.fromHTML($('#step_box').get(0), 15, 15, {
	                            'width': 170,
	                            'hight':150,
	                             'elementHandlers': specialElementHandlers
                             });
                doc.addImage(imgData, 'JPEG', 20,160);
                doc.save("download.pdf");
}
