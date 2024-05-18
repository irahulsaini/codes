/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Replace Classes as per your need
 * .input-text          = use for filter alphabets
 * .input-number        = use for filter numbers
 * .input-email         = use for filter emails
 * 
 * Get More Codes Logics: https://github.com/irahulsaini/codes
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

//alphabets
document.querySelectorAll('.input-text').forEach(function(element){
    element.addEventListener('input',function(){
        this.value = this.value.replace(/[^A-Z a-z]/g,'').trimStart();
    });
});
//numbers
document.querySelectorAll('.input-number').forEach(function(element){
    element.addEventListener('input',function(){
        this.value = this.value.replace(/[^0-9]/g,'').trimStart();
    });
});
//email
document.querySelectorAll('.input-email').forEach(function(element){
    element.addEventListener('input',function(){
        var value = this.value.replace(/\.\./g, ".");
        //remove .@
        value = value.replace(/\.@/g,"@");
        //remove extra chars
        value = value.replace(/[^A-Z a-z0-9.@_-]/g,'');
        //multiple @
        value = value.replace(/\@@/g,"@");
        
        //remove whitespace from start
        this.value = value.trimStart();
    });
    //remove . from the end
    element.addEventListener('change',function(){
        value = this.value;
        if( value[value.length-1] == '.'){
            value = value.substring(0,value.length-1)
        }        
        //remove whitespace from start
        this.value = value.trimStart()
    });
});
//more coming soon...