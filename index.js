const lib = require('./lib');
const Approx = lib.approx;
const Printing = lib.printing;


function test(t,y){
    return 1+y/t;
}
Approx.taylor(test,2,5,1,2);
Approx.adams_bashforth(test,2,5,1,2,4);
Approx.adams_moulton(test,2,5,1,2,3);
