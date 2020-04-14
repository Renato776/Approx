const Printing = {
    printLog:function(text){
        console.log(text);
    },
    errorLog:function (error_) {
        console.log("FATAL ERROR: "+error_);
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
    bisect:function(x0,gap,debug = false){
        let MAX_INTENTS = 3000;
        let FATAL_FAILURE = 0;
        const exactitud = Math.pow(10,-6);
        let a = x0;
        let y0 = this.equation(x0);
        while(this.invalid(y0)&&(FATAL_FAILURE!=MAX_INTENTS)){
            a -= gap;
            y0 = this.equation(a);
            FATAL_FAILURE++;
        }
        if(FATAL_FAILURE==MAX_INTENTS){
            if(debug)Printing.printLog(this.express_interval(a,x0));
            return NaN;
        }
        if(y0==0)return a;
        let b;
        let y1;
        FATAL_FAILURE = 0;
        MAX_INTENTS = 10000;
        b = a - gap;  //We'll start looking for any root at the left of a.
        y1 = this.equation(b);
        while(!this.sign_change(y0,y1)&&FATAL_FAILURE!=MAX_INTENTS){
            b -= gap;
            y1 = this.equation(b);
            FATAL_FAILURE++;
        }
        if(FATAL_FAILURE==MAX_INTENTS){ //NO root found at the left of a. Let's search at the right.
            FATAL_FAILURE = 0;
            MAX_INTENTS = 10000;
            b = a + gap;
            y1 = this.equation(b);
            while(!this.sign_change(y0,y1)&&FATAL_FAILURE!=MAX_INTENTS){
                b += gap;
                y1 = this.equation(b);
                FATAL_FAILURE++;
            }
        }
        if(FATAL_FAILURE==MAX_INTENTS){
            if(debug)Printing.errorLog("NO root found anywhere within "+this.express_interval(a - gap*MAX_INTENTS,a+gap*MAX_INTENTS))
            return NaN;
        }
        FATAL_FAILURE = 0;
        MAX_INTENTS = 50000;
        let f_a = this.equation(a);
        let f_b = this.equation(b);
        let x = (a+b)/2; //initial guess.
        let f_x = this.equation(x);
        let error  = 1;
        while ((!(f_x==0 || error<exactitud ))&&FATAL_FAILURE!=MAX_INTENTS){
            if(this.sign_change(f_x,f_a)){
                b = x;
            }else{
                a = x;
            }
            x = (a+b)/2;
            f_x = this.equation(x);
            f_b = this.equation(b);
            f_a = this.equation(a);
            error = Math.abs(f_b - f_a);
            FATAL_FAILURE++;
        }
        if(FATAL_FAILURE==MAX_INTENTS){
            if(debug)Printing.errorLog("Couldn't find exact enough root for an exactness of: "+exactitud+" With a total of " +
                MAX_INTENTS+" tries.");
            return NaN;
        }
        if(debug) {
            Printing.printLog('error: ' + error);
            Printing.printLog('result: ' + x);
        }
        return x;
    },
    sign_change : function(a,b){
        if(this.invalid(a)||this.invalid(b))return false;
        if(a<0 && b <0) return false;
        if(a>0 && b>0) return false;
        return true;
    }
};