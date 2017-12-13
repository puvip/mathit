var math_reserv = ['\\sqrt','sin','cos','tan'];
var pm          = ['(\\+)\\*', '\\*(\\+)', '\\*(\\-)', '(\\-)\\*','(\\/)\\*','\\*(\\/)','(\\*)\\*'];
var front_end   = ['(^|\\()((\\s+)[*+]|[*+])','[*+-]($|\\))','[*+-]\\s+($|\\))'];
var non_graph   = ['limits','int','trig','diff'];
var select_Arr  = "";
var select      = select_Arr[0];// solving the equation by this variable(e.g:x,y etc)

//final output send to maxima via websocket
var to_maxima        = (data) => {

                                                select_value(data)

                                          switch (math_type(data)) { //find the type of math equation
                                              case "multiple":
                                                data = "solve(["+fullconverter(data)+"],["+select_Arr[0]+"])";
                                                break;
                                                case 'normal':
                                                  data = fullconverter(data);
                                                 break;
                                                case 'int':
                                                  data =int(data)
                                                 break;
                                                case 'limits':
                                                  data =lim(data);
                                                 break;
                                                 case "trig":

                                                   break;
                                                default:
                                                  data = "solve("+fullconverter(data)+",["+select_Arr[0]+"])";

                                              }
                                          return data;
                                }
//convert the latex format to maxima supporting format for algebra
var fullconverter    = (a) => {return front(star_pm(mul(brackets(frac(power_add(cdot(a)))))));}

//apply the bracket's in this equation
var clear_reserve    = (a) => {return brackets(frac(power_add(cdot(a))));}

//get the TeX  result from maxima output
var from_maxima      = (a) => {return katex.renderToString(a.replace("false","").replace(/(\$)/g,""))}

//change Latex fraction to normal fraction
var frac             = (a) => {return a = a.replace(/}{/g, "/").replace(/{/g, "(").replace(/}/g, ")");}

//prevent the `pi` `sqrt` values
var cdot             = (a) => {return a.replace(/[\\][a-z]*/g, (a, b, c) =>
                                                              {return a = a == '\\cdot' ? '*' :
                                                                            a == '\\sqrt' ? '√' :
                                                                             a == '\\pi'  ? 'π'  :
                                                                              a == '\\left' ? '(' :
                                                                                a == '\\right' ? ')' : '';
                                                                              }).replace(/[\\][a-z]*?[\)\(]/g, "")
                               }

//apply the brackets
var brackets         = (a) => {return a.replace(/[\)]?([+-]?\w+)[\\][a-z]*/g, "($1)"); }

//apply the `*` between variable and continuers string for maxima supporting
var mul              = (a) => {return a.replace(/(\w+)[\(]/,"$1*(").replace(/[\)](\w+)/g ,")*$1").replace(/([0-9]+)([a-zA-Z])|(\))(\()/g,"$1*$2").replace(/([a-z])(?=[a-z])/g, "$1*").replace(/[√]/g,"*sqrt").replace(/π/g, '*pi*');}

//remove the extra `*`,`+`,`-` from this equation
var front            = (a) => {return front_end.map((b) => {   return a= a.replace(new RegExp(b,'g'), '$1');}).slice(-1)[0]}
var star_pm          = (a) => {return pm.map((b) => {   return a= a.replace(new RegExp(b,'g'), '$1');}).slice(-1)[0]}

//Add power symbol of TeX code
var power_add        = (a) => {return a.replace(/([a-z])(\d+)\b/g, '$1^$2');}

//select value for solving from(solving the equation by this variable)
var select_value     = (a) => {return select_Arr = clear_reserve(a).match(/([a-z])(?!.*\1.*$)/g)}

//send to maxima for graph
var graph            = (a) => {
                                   plot="";
                                   if(select_value(a) && !graph_check(a)){
                                   if(select_value(a).length <= 1)
                                      {
                                         var data=fullconverter(a).split('=');
                                          var str = data.length > 1 ? data[0]+plus_to_mins(double_to_single(before_plus(data[1]))) : data[0];

                                          plot ="plot2d(["+str+"] ,["+select_Arr[0]+",-100,100],[gnuplot_term ,svg],[gnuplot_out_file ,  \""+html_path+"\"],[title, \""+fullconverter(a)+"\"],grid2d,[xlabel ,\"x\"],[ylabel ,\"y\"],[xy_scale, 0.95,0.95])";
                                       }
                                    else {
                                          plot ="load(implicit_plot);implicit_plot(["+fullconverter(a)+"],[x,-7,7],[y,-7,7],[gnuplot_term ,svg],[gnuplot_out_file ,\""+html_path+"\"],[title, \""+fullconverter(a)+"\"],grid2d)";
                                        }
                                      }
                                    return plot;

                                }
var before_plus      = (a) => { return '+'+a.replace(/(\+\+)|([-+]-|-\+)/g, (m, g1, g2) => {return g1 ? "+" : "-"; });}
var double_to_single = (a) => { return a.replace(/(\+\+)|([-+]-|-\+)/g, (m, g1, g2) => {return g1 ? "+" : "-";});}
var plus_to_mins     = (a) => { return a.replace(/([+]|[-])/g, (m) => {return (m == "+") ? "-" : "+"});}



//integral solving converstion latex to maxima
var int              = (a)  => { x = a.match(/[_^]({[+-]?(\d+)?}|[+-]?(\d{1}))/g).map(s => {return s.match(/[+-]?(\d+)/g)});
                              var str = a.replace(/(.*?)[\^]({[+-]?(\d+)?}|[+-]?(\d{1}))/,"");
                              return 'integrate('+fullconverter(str)+','+select_Arr[0]+','+x[0][0]+','+x[1][0]+')';
                               }
//limit solving converstion latex to maxima
var lim              = (a)  => {  var str = /{(.*)[\\](.*)[\\](.*)}\b(.*)/g.exec(a);
                                  var to = ((str[3] == 'infty') ? 'inf' : str[3]).trim();
                                  return 'limit('+fullconverter(str[4])+','+select_Arr[0]+','+to+')';
                                }

//check the graph is available or not in given equation.
var graph_check      = (a)   => {return non_graph.map((b) => { return math_type(a) == b ? false: '';}).join('').trim()}

//find the type of math equation
var math_type        = (data) =>  {
                                var iteration = data.split(","); // find more than on equation
                                data = power_add(data);
                                var clear= math_reserv.map((a) => {return data.replace(a,"");})[0];
                                var match = fullconverter(clear).match(/[a-z]\^?(\d+)/g);
                                var max = 0;
                                      if (match != null) {
                                        for (var i = 0; i < match.length; i++) {
                                          var currentValue = parseInt(match[i].substring(2));
                                          max = (currentValue > max) ?currentValue : max;
                                        }
                                      }

                                switch (true) {
                                  case ((iteration.length >1) && (iteration[1] != "")):
                                      native="multiple"
                                   break;
                                  case (!!data.match("int")):
                                      native="int"
                                   break;
                                  case (!!data.match(/\\frac[\{]((d)|(partial))/g)):
                                        native="diff"
                                    break;
                                  case (!!data.match("lim")):
                                        native="limits"
                                    break;
                                  case (!!data.match(/sin|cos|tan|sec|cosec|cot/g)):
                                        native="trig"
                                    break;
                                  case (!!data.match("matrix")):
                                        native="matrix"
                                    break;
                                  case (!clear_reserve(data).match(/[a-z]/g)):
                                        native="normal"
                                    break;
                                  case(!data.match(/(\d+)/g)):
                                       native="normal";
                                  break;
                                  case (max < 2):
                                        native="linear"
                                    break;
                                  case (max == 2):
                                        native="quad"
                                    break;
                                  case (max > 2):
                                        native="higher"
                                    break;
                                  default:
                                        native="other"
                                      }

                                  return native;

                                }
