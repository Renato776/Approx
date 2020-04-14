const Printing = {
    printLog:function(text){
        console.log(text);
    }
};
const Approx = {
    equation:function(x) {
        return x + 5;
    },
    invalid:function(x){
        return isNaN(x)||x == Infinity||x == - Infinity;
    },
    express_interval:function(a,b){
        return "["+a+","+b+"]";
    },
    bisect:function(x0,gap){
        let MAX_INTENTS = 3000;
        let FATAL_FAILURE = 0;
        const exactitud = 0.00000000000000001;
        let a = x0;
        let y0 = this.equation(x0);
        while(this.invalid(y0)&&(FATAL_FAILURE!=MAX_INTENTS)){
            a -= gap;
            y0 = this.equation(a);
            FATAL_FAILURE++;
        }
        if(FATAL_FAILURE==MAX_INTENTS){
            Printing.printLog(this.express_interval(a,x0));
            return NaN;
        }
        let b = cuota/inicial - a;
        let error = 100;
        let f_a = equation(inicial,cuota,a,n);
        let f_b = equation(inicial,cuota,b,n);
        let x = (a+b)/2; //initial guess.
        let f_x = equation(inicial,cuota,x,n);
        Printing.printLog('f_a: '+f_a+"\nf_b: "+f_b);
        while (!(f_x==0 || error<exactitud )){
            if(sign_change(f_x,f_a)){
                b = x;
            }else{
                a = x;
            }
            x = (a+b)/2;
            f_x = equation(inicial,cuota,x,n);
            f_b = equation(inicial,cuota,b,n);
            f_a = equation(inicial,cuota,a,n);
            error = Math.abs(f_b - f_a);
        }
        Printing.printLog('error: '+error);
        Printing.printLog('result: '+x);
    },
    sign_change : function(a,b){
        if(a<0 && b <0) return false;
        if(a>0 && b>0) return false;
        return true;
    }
};