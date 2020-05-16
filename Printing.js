const Printing = {
    table_size:100,
    output: "output",
    save_csv:function(){
        const text = document.getElementById(this.output).value;
        const data = new Blob([text], {type: 'text/csv'});
        const url = window.URL.createObjectURL(data);
        document.getElementById('download_link').href = url;
        document.getElementById('download_link').click();
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
    show_derivative:function(data){
        Printing.print_table_title("Derivative Approximation");
        Printing.print_object_header(data);
        for (let i = 0; i<data.x.length;i++){
            Printing.format_row([data.x[i].toString(),data.y[i].toString(),data.dy[i].toString(),data.m[i]]);
        }
    },
    csv:false,
    set_text:function(text){
        document.getElementById(this.output).value = text;
    },
    set_table_size:function(size){
        this.table_size = size;
    },
    format_cell: function (cell_width,entry){
        if(this.csv)return entry;
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
        if(this.csv){
            let ans = '';
            for (let i = 0; i<row.length;i++){
                ans+=row[i]+','
            }
            ans = ans.substr(0,ans.length-1);
            this.printLog(ans);
            return;
        }
        let size = this.table_size;
        if(!size) size = 500;
        let formatted_row = "";
        for (let i =0; i<row.length;i++){
            let entry = row[i];
            let formatted_entry = this.format_cell(Math.floor(size/row.length),entry);
            formatted_row+=formatted_entry;
        }
        this.printLog(formatted_row);
    },
    print_object_header: function (object){
        if(this.csv){
            let head = '';
            for	(let k = 0; k<Object.keys(object).length;k++){
                head+=Object.keys(object)[k]+',';
            }
            head = head.substring(0,head.length-1);
            Printing.printLog(head);
            return;
        }
        let size = this.table_size;
        let header = [];
        for	(let k = 0; k<Object.keys(object).length;k++){
            header.push(Object.keys(object)[k]);
        }
        this.format_row(header,size);
    },
    print_object_body: function (object){
        if(this.csv){
            let values = '';
            for (let j = 0; j<Object.keys(object).length;j++){
                values+= (object[Object.keys(object)[j]].toString())+',';
            } values = values.substring(0,values.length-1);
            Printing.printLog(values);
            return;
        }
        let size = this.table_size;
        const r = this.table_size;
        let entry_row = [];
        for (let j = 0; j<Object.keys(object).length;j++){
            if(Array.isArray(object[Object.keys(object)[j]]))this.table_size = undefined;
            entry_row.push(object[Object.keys(object)[j]].toString());
        }
        this.format_row(entry_row,size);
        this.table_size = r;
    },
    print_table_title: function (text){
        let size = this.table_size;
        this.printLog(this.fill_string(size,'-'));
        this.format_title(text);
        Printing.printLog(this.fill_string(size,'-'));
    },
    print_object_list: function (table){
        if(table.length==0)return;
        this.print_object_header(table[0],this.csv);
        for (let i = 0; i<table.length; i ++){
            this.print_object_body(table[i],this.csv);
        }
    },
    fill_string : function (size,content) {
        let s = "";
        for (let i = 0; i<size; i++){
            s+=content;
        }
        return s;
    },
    get_source:function(element){
        return editor.getValue();
    },
    printLog:function(text){
        let s = document.getElementById(this.output).value;
        s+=text+"\n";
        this.set_text(s);
    },
    errorLog:function (error_) {
        this.printLog("FATAL ERROR: "+error_);
    },
    separate(s) {
        this.printLog(this.fill_string(this.table_size,s));
    }
};