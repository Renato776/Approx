const Printing = {
    table_size:80,
    set_table_size:function(size){
        this.table_size = size;
    },
    format_cell: function (cell_width,entry){
        cell_width = cell_width-2;
        let formatted_entry = "|";
        if(entry.length==cell_width){
            formatted_entry+=entry+"|";
        }else if(entry.length<cell_width){
            let filler_count = Math.floor((cell_width-entry.length)/2);
            formatted_entry += this.fill_string(filler_count,' ');
            formatted_entry += entry;
            formatted_entry += this.fill_string(cell_width - filler_count - entry.length,' ');
            formatted_entry+="|";
        }else{
            formatted_entry+=entry.substring(0,cell_width-1)+"-|";
        }
        return formatted_entry;
    },
    format_title:function (title) {
        this.printLog(this.format_cell(this.table_size,title));
    },
    format_row: function (row){
        let size = this.table_size;
        let formatted_row = "";
        for (let i =0; i<row.length;i++){
            let entry = row[i];
            let formatted_entry = this.format_cell(Math.floor(size/row.length),entry);
            formatted_row+=formatted_entry;
        }
        this.printLog(formatted_row);
    },
    print_object_header: function (object){
        let size = this.table_size;
        let header = [];
        for	(let k = 0; k<Object.keys(object).length;k++){
            header.push(Object.keys(object)[k]);
        }
        this.format_row(header,size);
    },
    print_object_body: function (object){
        let size = this.table_size;
        let entry_row = [];
        for (let j = 0; j<Object.keys(object).length;j++){
            entry_row.push(object[Object.keys(object)[j]].toString());
        }
        this.format_row(entry_row,size);
    },
    print_table_title: function (text){
        let size = this.table_size;
        this.printLog(fill_string(size,'-'));
        this.format_title(size,text);
        Printing.printLog(fill_string(size,'-'));
    },
    print_object_list: function (table){
        if(table.length==0)return;
        this.print_object_header(table[0]);
        for (let i = 0; i<table.length; i ++){
            this.print_object_body(table[i]);
        }
    },
    fill_string : function (size,content) {
        let s = "";
        for (let i = 0; i<size; i++){
            s+=content;
        }
        return s;
    },
    printLog:function(text){
        console.log(text);
    },
    errorLog:function (error_) {
        console.log("FATAL ERROR: "+error_);
    }
};
const Approx = {
    equation:function(x) {
        return Math.log(x)-1;
    },
    invalid:function(x){
        return isNaN(x)||x == Infinity||x == - Infinity;
    },
    express_interval:function(a,b){
        return "["+a+","+b+"]";
    },
    show_table:function(data){
        Printing.printLog(Printing.fill_string(Printing.table_size,'-'));
        Printing.format_row(["ti","wi"]);
        Printing.printLog(Printing.fill_string(Printing.table_size,'-'));
        let a = data.a;
        let h = data.h;
        let key_length = Object.keys(data).length - 2; //We have to remove a & h from the key count.
        for (let i = 0; i<key_length;i++){
            Printing.format_row([(a+i*h).toString(),data[i].toString()]);
        }
    },
    bisect:function(x0,gap,equation,debug = false){
        let MAX_INTENTS = 3000;
        let FATAL_FAILURE = 0;
        const exactitud = Math.pow(10,-6);
        let a = x0;
        let y0 = equation(x0);
        while(this.invalid(y0)&&(FATAL_FAILURE!=MAX_INTENTS)){
            a -= gap;
            y0 = equation(a);
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
        y1 = equation(b);
        while(!this.sign_change(y0,y1)&&FATAL_FAILURE!=MAX_INTENTS){
            b -= gap;
            y1 = equation(b);
            FATAL_FAILURE++;
        }
        if(FATAL_FAILURE==MAX_INTENTS){ //NO root found at the left of a. Let's search at the right.
            FATAL_FAILURE = 0;
            MAX_INTENTS = 10000;
            b = a + gap;
            y1 = equation(b);
            while(!this.sign_change(y0,y1)&&FATAL_FAILURE!=MAX_INTENTS){
                b += gap;
                y1 = equation(b);
                FATAL_FAILURE++;
            }
        }
        if(FATAL_FAILURE==MAX_INTENTS){
            if(debug)Printing.errorLog("NO root found anywhere within "+this.express_interval(a - gap*MAX_INTENTS,a+gap*MAX_INTENTS))
            return NaN;
        }
        FATAL_FAILURE = 0;
        MAX_INTENTS = 50000;
        let f_a = equation(a);
        let f_b = equation(b);
        let x = (a+b)/2; //initial guess.
        let f_x = equation(x);
        let error  = 1;
        while ((!(f_x==0 || error<exactitud ))&&FATAL_FAILURE!=MAX_INTENTS){
            if(this.sign_change(f_x,f_a)){
                b = x;
            }else{
                a = x;
            }
            x = (a+b)/2;
            f_x = equation(x);
            f_b = equation(b);
            f_a = equation(a);
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
    factorial:function(x){
        if (x === 0)
        {
            return 1;
        }
        return x * this.factorial(x-1);
    }   ,
    sign_change : function(a,b){
        if(this.invalid(a)||this.invalid(b))return false;
        if(a<0 && b <0) return false;
        if(a>0 && b>0) return false;
        return true;
    },
    euler:function(f,alpha,h,a,b){
        let n = Math.floor((b - a)/h);
        let w = {};
        w[0] = alpha;
        for (let i = 0; i<n;i++){
            w[i+1] = w[i] + h * f(a+h*i,w[i]);
        }
        return w[n];
    },
    taylor:function(functions,alpha,n,a,b,debug = false){
        function t(ti,wi){
            let ans = 0;
            for (let i = 1; i<functions.length+1;i++){
                ans += (Math.pow(h,i-1)/Approx.factorial(i))*
                    functions[i-1](ti,wi);
            }
            return ans;
        }
        let h = (b - a)/n;
        let w = {a:a,h:h};
        w[0] = alpha;
        for (let i = 0; i<n;i++){
            w[i+1] = w[i]+h*t(a+h*i,w[i]);
        }
        if(debug){
            this.show_table(w);
        }
        return w[n];
    }
};
//region Function definition & its derivatives up to N - 1; where N is the order.
function test(t,y){
    return y - t*t + 1;
}
function test1(t,y){
    return test(t,y) - 2*t;
}
function test2(t,y){
    return test1(t,y) - 2;
}
function test3(t,y){
    return test2(t,y);
}
Printing.set_table_size(80);
Approx.taylor([test,test1,test2,test3],0.5,10,0,2,true);