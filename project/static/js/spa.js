
//figure out whether selected items are called on the same url as color and what no
//-------------figure out what i want to do with selected choice on deletion
//---------write delete ajax request
//---------write code to remove element or just reload lmao
//--------------NETWORK FOR MODIFY ELEMENT
//-------------AJAX FOR MODIFY ELEMENT
//-------------auto fill form when clicking modify element
//---------make ajax for setting the preset
//-------------CHANGE DESCRIPTION When color is selected
//----------change rgb when changed

var sets={}
var query=1;
var width=document.documentElement.clientWidth
var red=255
var green=255
var blue=255
var color;
var current;
var selected;
var selobj;
var colorsel=null;
var pallet=[]
var mixsend={"final":[]}
var sum={
    types:"gradient",
    start:0,
    stop:3,
    values:[{red:123,green:12,blue:3}]
}
function touchHandler(event) {
    var touch = event.changedTouches[0];
    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, tou+ch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

jQuery(document).ready(function($){
    //sets fill as the current page with css color
    current=$("#color")
    current.css({"color":"white"})

    //makes square for color box in bottom right hand corner
    //also initially disables the second rgb boxes
    $("#view").css({"height":""+($(".colorWrapper").width()*(18/100))+"px"})
    $(".ion-wrap").css({"height":($(".color-text").css("height"))})
    $("#red2").val(null)
    $("#green2").val(null)
    $("#blue2").val(null)

    //create the value slider on first page
    function createSlider(val1=1,val2=150){
        $( "#slider-range" ).slider({
            range: true,
            min: 1,
            max: 167,
            values: [ val1, val2 ],
                slide: function( event, ui ) {
                    $("#range1").val(ui.values[0])
                    if (ui.values[1]>150){
                        event.preventDefault()
                        $( "#slider-range" ).slider( "values", 1,150 )
                        $("#range2").val($( "#slider-range" ).slider( "values", 1))
                    }
                    else{
                        console.log("sum")
                        $("#range2").val(ui.values[1])
                    }
                }
        });
    };createSlider()

    //initialize colorwheel object and on change method
    color = new iro.ColorPicker('#colorpicker',{width:$("#colorpicker").width()});
    color.on("color:change",(color)=>{
        red=color.rgb.r
        green=color.rgb.g
        blue=color.rgb.b
        $("#red").val(red)
        $("#green").val(green)
        $("#blue").val(blue)
        $("#view").css({"background-color":"rgb("+red+","+green+","+blue+")"})
    })
    //jquery methods
    $(".valset").change((e)=>{
        val1=Number($("#range1").val())
        val2=Number($("#range2").val())
        if(val1>val2 || val1<1 || val2>150){
            $("#range1").val(1)
            $("#range2").val(150)
            $("#slider-range").slider("destroy");
            createSlider()
            return
        }
        $("#slider-range").slider("destroy");
        createSlider(val1,val2)

        
    })
    $("#off").click((e)=>{
        $.ajax("/state",{
            method:"GET",
            success:(data,sum,sumelse)=>{
                console.log(data)
                if ($("#off").text()=="On"){
                    $("#off").css({"background-color":"red"})
                    $("#off").text("Off")
                }
                else{
                    $("#off").css({"background-color":"green"})
                    $("#off").text("On")
                    query=1
                }
            },
            error:(e,f,g)=>{
                console.log(e)
                //error text f
                console.log(f)
                console.log(g)
                $("#alert-name").text("Notification")
                $(".screen-on").addClass("hide")
                $("#alert").addClass("hide-alert")
                $("#abody").append('<p class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')

            }
        })

    })
    $("#super").click((e)=>{
        query=0
        var temp;
        if(query==1){
            temp=0
        }
        else{
            temp=1
        }
        $.ajax("/superfade",{
            method:"GET",
            success:(data,sum,sumelse)=>{
                console.log(data)
                
            },
            error:(e,f,g)=>{
                console.log(e)
                //error text f
                console.log(f)
                console.log(g)
                $("#alert-name").text("Notification")
                $(".screen-on").addClass("hide")
                $("#alert").addClass("hide-alert")
                $("#abody").append('<p class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')

            }
        })

    })
    $(".icon").click((e)=>{
        current.css({"color":"#979dac"})
        $(e.target).css({"color":"#ffffff"})
        current=$(e.target)
        $("h2").text(current.attr("text"))
        $(".totalwrap").css({"transform":"translateX("+current.attr("value")*-25+"%)"})
    })
    $("#set").click((e)=>{
        console.log("oofer")
        $.ajax("/set?types=color&values="+red+" "+green+" "+blue+"&start="+Number($("#range1").val())+"&stop="+Number($("#range2").val()),{
            method:"GET",
            success:(data,sum,sumelse)=>{
                console.log("passed")
            },
            error:(e,f,g)=>{
                console.log(e)
                //error text f
                console.log(f)
                console.log(g)
                $("#alert-name").text("Notification")
                $(".screen-on").addClass("hide")
                $("#alert").addClass("hide-alert")
                $("#abody").append('<p class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')

            }
        })
    })
    $("#red, #green, #blue").change((e)=>{
        red=$("#red").val()
        green=$("#green").val()
        blue=$("#blue").val()
        color.color.set({"r":red,"b":blue,"g":green})
    })
    $("#close").click((e)=>{
        if(colorsel){
            colorsel=null
        }
        $(".screen-on").removeClass("hide")
        $("#alert").removeClass("hide-alert")
        $("#abody").empty()
    })
    $("#save").click((e)=>{
        $("#alert-name").text("Save Color")
        $(".screen-on").addClass("hide")
        $("#alert").addClass("hide-alert")
        $("#abody").append("<p class='form-label'>Name</p>")
        $("#abody").append('<input id="save-name" class="numtext form-desc " type="text" >')
        $("#abody").append("<p class='form-label'>Description</p>")
        $("#abody").append('<textarea id="save-desc" class="numtext form-desc" type="text" ></textarea>')
        $("#abody").append("<p class='form-label'>Red</p>")
        $("#abody").append('<input id="red2" class="numtext form-rgb" type="number" max="255" min="0" value="255">')
        $("#abody").append("<p class='form-label'>Green</p>")
        $("#abody").append('<input id="green2" class="numtext form-rgb" type="number" max="255" min="0" value="255">')
        $("#abody").append("<p class='form-label'>Blue</p>")
        $("#abody").append('<input id="blue2" class="numtext form-rgb" type="number" max="255" min="0" value="255">')
        $("#abody").append('<a id="submit" class="text off close submit">Save</a>')
        $("#submit").click((e)=>{
            $("#input-error").remove()
            $("#submit").attr('style',"background-color : gray !important")
            sub={}
            sub.name=$("#save-name").val()
            sub.desc=$("#save-desc").val()
            sub.red=$("#red2").val()
            sub.types="color"
            sub.green=$("#green2").val()
            sub.blue=$("#blue2").val()
            for (var prop in sub){
                console.log(sub)
                if (sub[prop]==""){
                    $("#abody").append('<p id="input-error" class="input-error">Input Error</p>')
                    $("#submit").attr('style',"background-color : green !important")
                    return
                }
            }
            $.ajax("/save",{
                method:"POST",
                data:sub,
                success:(data,sum,sumelse)=>{
                    $("#submit").attr('style',"background-color : green !important")
                    data=data.split("   ")
                    console.log(data)
                    if(data[0]!="Success"){
                        $("#abody").append('<p id="input-error" style="color : red !important" class="input-error">'+data[0]+'</p>')
                        return
                    }
                    sets[sub.name]={"desc":sub.desc,"values":data[1],"types":sub.types}
                    $("#abody").append('<p id="input-error" style="color : green !important" class="alert-p font">Color Added Successfully</p>')
                    if($("#list").children().first().children().first().text()=="No Presets to display"){
                        var ele=$('<div class="color-item"></div>')
                        ele.attr("name",sub.name)
                        ele.append($('<div class="ion-wrap" style="height: 36.3px;"></div>'))
                        ele.children().first().append($('<ion-icon class="ion md hydrated" name="trash" role="img" aria-label="trash"></ion-icon>'))
                        ele.append($('<p class="color-text">'+sub.name+'</p>'))
                        $("#list").prepend(ele)
                        $("#list").children().last().remove()
                    }
                    else{
                        console.log($("#list").children().first().children().first().text())
                        $("#list").prepend($("#list").children().first()[0].outerHTML)
                        $("#list").children().first().attr("name",sub.name)
                        $("#list").children().first().children().last().text(sub.name)
                        $("#list").children().first().children().last().attr('style',"")
                    }
                    
                },
                error:(e,f,g)=>{
                    $("#submit").attr('style',"background-color : green !important")
                    $("#abody").empty()
                    console.log(e)
                    console.log(f)
                    console.log(g)
                    $("#alert-name").text("Notification")
                    $("#abody").append('<p id="input-error" class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')
    
                }
            })
        })
        $("#red2").val(red)
        $("#green2").val(green)
        $("#blue2").val(blue)
    })
    $("#list").on("click",".color-text",(e)=>{
        console.log(e)
        $(".color-text").css({"background-color":"#3470f0"})
        $(e.target).css({"background-color":"green"})
        selected=$(e.target)
        $(".desc").text(sets[selected.text()].desc)
        selobj=sets[$(selected).text()]
        if(selobj.types=="color"){
            
            $("#red2").val(Number(selobj.values.split(" ")[0]))
            $("#green2").val(Number(selobj.values.split(" ")[1]))
            $("#blue2").val(Number(selobj.values.split(" ")[2]))
            $("#red").val(Number(selobj.values.split(" ")[0]))
            $("#green").val(Number(selobj.values.split(" ")[1]))
            $("#blue").val(Number(selobj.values.split(" ")[2]))
            red=$("#red").val()
            green=$("#green").val()
            blue=$("#blue").val()
            color.color.set({"r":red,"b":blue,"g":green})
        }
        else{
            $("#red2").val(null)
            $("#green2").val(null)
            $("#blue2").val(null)
        }
    })
    $("#list").on("click",".ion-wrap",(e)=>{
        selected=$($(e.target).parent().parent().children().last())
        selected.click()
        $("#alert-name").text("Delete")
        $(".screen-on").addClass("hide")
        $("#alert").addClass("hide-alert")
        $("#abody").append('<p style="margin-bottom:3%;" class="alert-p font">This will permanantly delete the preset. Press Delete to Proceed</p>')
        $("#abody").append('<a style="float:left;" id="delete" class="text off close">Delete</a>')
    })
    $("#alert").on("click","#delete",(e)=>{
        $("#input-error").remove()
        $.ajax("/delete?values="+selobj.values,{
            method:"DELETE",
            success:(data,sum,sumelse)=>{
                if(data!="Success"){
                    $("#abody").append('<p id="input-error" style="color : red !important" class="input-error">'+data[0]+'</p>')
                    return
                }
                $("#abody").append('<p id="input-error" style="color : green !important" class="alert-p font">Set Removed Successfully</p>')
                $(selected).parent().remove()
                if($('#list').children().length==0){
                    $('#list').append('<div class="color-item"><p class="default">No Presets to display</p></div>')
                }
                selected=undefined;
                selobj=undefined;
                $('#red2').val(null)
                $('#green2').val(null)
                $('#blue2').val(null)
                $('.desc').text("")
                setTimeout(()=>{
                    $('#close').click()
                },100)
            },
            error:(e,f,g)=>{
                console.log(e)
                //error text f
                console.log(f)
                console.log(g)
                $("#alert-name").text("Notification")
                $(".screen-on").addClass("hide")
                $("#alert").addClass("hide-alert")
                $("#abody").append('<p class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')

            }
        })
    })
    $("body").on("click","#modify",(e)=>{
        if(selected==undefined || selected==null){
            console.log("pop")
            return
        }
        $("#alert-name").text("Modify Color")
        $(".screen-on").addClass("hide")
        $("#alert").addClass("hide-alert")
        $("#abody").append("<p class='form-label'>Name</p>")
        $("#abody").append('<input id="save-name" class="numtext form-desc " type="text" >')
        $("#abody").append("<p class='form-label'>Description</p>")
        $("#abody").append('<textarea id="save-desc" class="numtext form-desc" type="text" ></textarea>')
        $("#abody").append("<p class='form-label'>Red</p>")
        $("#abody").append('<input id="save-red" class="numtext form-rgb" type="number" max="255" min="0" value="255">')
        $("#abody").append("<p class='form-label'>Green</p>")
        $("#abody").append('<input id="save-green" class="numtext form-rgb" type="number" max="255" min="0" value="255">')
        $("#abody").append("<p class='form-label'>Blue</p>")
        $("#abody").append('<input id="save-blue" class="numtext form-rgb" type="number" max="255" min="0" value="255">')
        $("#abody").append('<a id="submit" class="text off close submit">Save</a>')
        $("#abody").append('<textarea disabled="True" id="valuetext" class="numtext form-desc" type="text" ></textarea>')
        
        $("#save-name").val(selected.text())
        $("#save-desc").val(selobj.desc)
        $("#save-red").val(Number(selobj.values.split(" ")[0]))
        $("#save-green").val(Number(selobj.values.split(" ")[1]))
        $("#save-blue").val(Number(selobj.values.split(" ")[2]))
        $("#valuetext").val(selobj.values)

        $("#submit").click((e)=>{
            $("#input-error").remove()
            $("#submit").attr('style',"background-color : gray !important")
            sub={}
            sub.types=selobj.types
            sub.name=$("#save-name").val()
            sub.desc=$("#save-desc").val()
            sub.red=$("#save-red").val()
            sub.green=$("#save-green").val()
            sub.blue=$("#save-blue").val()
            for (var prop in sub){
                console.log(sub)
                if (sub[prop]==""){
                    $("#abody").append('<p id="input-error" class="input-error">Input Error</p>')
                    $("#submit").attr('style',"background-color : green !important")
                    return
                }
            }
            $("#input-error").remove()
            $.ajax("/update?values="+selobj.values,{
                method:"PUT",
                data:sub,
                error:(e,f,g)=>{
                    $("#submit").attr('style',"background-color : green !important")
                    $("#abody").empty()
                    console.log(e)
                    console.log(f)
                    console.log(g)
                    $("#alert-name").text("Notification")
                    $("#abody").append('<p id="input-error" class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')
    
                },
                success:(data,sum,sumelse)=>{
                    console.log(data)
                    $("#submit").attr('style',"background-color : green !important")
                    console.log(data)
                    if(data!="Success"){
                        $("#abody").append('<p id="input-error" style="color : red !important" class="input-error">'+data+'</p>')
                        return
                    }
                    sets[selected.text()]=undefined
                    selected.text(sub.name)
                    selected.parent().parent().attr("name",selected.text())
                    sets[sub.name]={"desc":sub.desc,"values":sub.red+" "+sub.green+" "+sub.blue,"types":sub.types}
                    $("#abody").append('<p id="input-error" style="color : green !important" class="alert-p font">Preset Changed Successfully</p>')
                    selobj.desc=sub.desc
                    selobj.values=sub.red+" "+sub.green+" "+sub.blue
                    $("#red2").val(sub.red)
                    $("#green2").val(sub.green)
                    $("#blue2").val(sub.blue)
                    $("#red").val(Number(selobj.values.split(" ")[0]))
                    $("#green").val(Number(selobj.values.split(" ")[1]))
                    $("#blue").val(Number(selobj.values.split(" ")[2]))
                    red=$("#red").val()
                    green=$("#green").val()
                    blue=$("#blue").val()
                    color.color.set({"r":red,"b":blue,"g":green})
                }
            })
        })
    })
    $("body").on("click","#set2",(e)=>{
        if(selobj==undefined||selobj==null){
            return
        }
        $.ajax("/set?types="+selobj.types+"&values="+selobj.values+"&start="+Number($("#range1").val())+"&stop="+Number($("#range2").val()),{
            method:"GET",
            success:(data,sum,sumelse)=>{
                console.log("passed")
            },
            error:(e,f,g)=>{
                console.log(e)
                //error text f
                console.log(f)
                console.log(g)
                $("#alert-name").text("Notification")
                $(".screen-on").addClass("hide")
                $("#alert").addClass("hide-alert")
                $("#abody").append('<p class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')

            }
        })
    })
    $("body").on("click","#color-add",(e)=>{
        console.log("test")
        pallet.push({red:red,green:green,blue:blue})
        console.log(pallet.length)
        $("#pidx").append("<div class='ink' value='"+(pallet.length-1)+"'></div>")
        $("#pidx").children().last().css({"background-color":"rgb("+red+","+green+","+blue+")"})
        $("#pidx").children().last().attr("red",red)
        $("#pidx").children().last().attr("green",green)
        $("#pidx").children().last().attr("blue",blue)
    })
    $("body").on("click","#clearp",(e)=>{
        pallet=[]
        $("#pidx").empty()
    })
    $("#fill3").on("click",".ink",(e)=>{
        var colors=pallet[Number($(e.target).attr("value"))]
        $("#red").val(colors.red)
        $("#green").val(colors.green)
        $("#blue").val(colors.blue)
        red=colors.red
        green=colors.green
        blue=colors.blue
        color.color.set({"r":colors.red,"b":colors.blue,"g":colors.green})
    })
    $("body").on("click","#makep",(e)=>{
        enable_alert($,"Make Range",($)=>{
            $("#abody").append('<select class="options" id="options"><option class="option" value="none">None</option><option class="option" value="gradient">Gradient</option><option class="option" value="pattern">Pattern</option><option class="option" value="fill">Fill</option></select>')
            $("#abody").append("<div id='makebody' class='makebody'></div>")
            $("#abody").append("<p class='cpt'>Color Pallete</p>")
            $("#pidx").clone().appendTo("#abody")
        })
    })
    $("#alert").on("change","#options",(e)=>{
        $("#makebody").empty()
        text=$(e.target).val()
        console.log("first "+text)
        if(text=="gradient"){
            $("#makebody").append("<p class='range-text'>Total Colors In Gradient</p>")
            $("#makebody").append('<input id="pattern-range" class="numtext rangeipt" type="number" max="300" min="1" value="1">')
            $("#makebody").append("<div id='patternpallet' class='palletwrap'></div>")
            $("#patternpallet").append("<div class='selector-box'></div>")
            $("#makebody").append("<p class='range-text'>Light Range</p>")
            $("#makebody").append('<input class="numtext rangeipt" style="margin-right:30%"type="number" max="300" min="1" value="1">')
            $("#makebody").append('<input class="numtext rangeipt" type="number" max="300" min="1" value="1">')
            $("#makebody").append("<p class='finish'>Add Range</p>")
        }
        else if(text=="pattern"){
            $("#makebody").append("<p class='range-text'>Total Colors In Pattern</p>")
            $("#makebody").append('<input id="pattern-range" class="numtext rangeipt" type="number" max="300" min="1" value="1">')
            $("#makebody").append("<div id='patternpallet' class='palletwrap'></div>")
            $("#patternpallet").append("<div class='selector-box'></div>")
            $("#makebody").append("<p class='range-text'>Light Range</p>")
            $("#makebody").append('<input class="numtext rangeipt" style="margin-right:30%"type="number" max="300" min="1" value="1">')
            $("#makebody").append('<input class="numtext rangeipt" type="number" max="300" min="1" value="1">')
            $("#makebody").append("<p class='finish'>Add Range</p>")
        }
        else if(text=="fill"){
            $("#makebody").append("<p class='range-text'>Fill Color</p>")
            $("#makebody").append("<div class='selector-box'></div>")
            $("#makebody").append("<p class='range-text'>Light Range</p>")
            $("#makebody").append('<input class="numtext rangeipt" style="margin-right:30%"type="number" max="300" min="1" value="1">')
            $("#makebody").append('<input class="numtext rangeipt" type="number" max="300" min="1" value="1">')
            $("#makebody").append("<p class='finish'>Add Range</p>")
            $("#makebody").append("<p class='range-text range-error'>Sorry there was an error</p>")

        }
    })
    $("#alert").on("click",".selector-box",(e)=>{
        if(colorsel){
            return
        }
        colorsel=$(e.target)
        colorsel.css({"opacity":".5"})
        colorsel.css({"border-color":"green"})
        
        
    })
    $("#alert").on("click",".ink",(e)=>{
        if(colorsel!=null){
            colorsel.css({"opacity":"1"})
            colorsel.css({"background-color":"rgb("+$(e.target).attr("red")+","+$(e.target).attr("green")+","+$(e.target).attr("blue")+")"})
            colorsel.css({"border-color":"transparent"})
            colorsel.attr("red",$(e.target).attr("red"))
            colorsel.attr("green",$(e.target).attr("green"))
            colorsel.attr("blue",$(e.target).attr("blue"))
            colorsel=null
        }
    })
    $("#alert").on("change","#pattern-range",(e)=>{
        num=$(e.target).val()
        colorsel=null
        $("#patternpallet").empty()
        for(var x=0;x<num;x++){
            $("#patternpallet").append("<div class='selector-box'></div>")
        }
    })
    $("#alert").on("click",".finish",(e)=>{
        text=$(e.target).val()
        if(val1>val2){
            //do error
            return
        }
        if(text=="gradient"){
            
        }
        else if(text=="pattern"){

        }
        else if(text=="fill"){

        }
    })
    $("body").on("click","#musics",(e)=>{
        $.ajax("/music",{
            method:"GET",
            success:(data,sum,sumelse)=>{
                console.log("works")
            },
            error:(e,f,g)=>{
                console.log(e)
                //error text f
                console.log(f)
                console.log(g)
                $("#alert-name").text("Notification")
                $(".screen-on").addClass("hide")
                $("#alert").addClass("hide-alert")
                $("#abody").append('<p class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')

            }
        })
    })
    $("body").on("click","#stoppers",(e)=>{
        $.ajax("/music",{
            method:"GET",
            success:(data,sum,sumelse)=>{
                console.log("return successful")
            },
            error:(e,f,g)=>{
                console.log(e)
                //error text f
                console.log(f)
                console.log(g)
                $("#alert-name").text("Notification")
                $(".screen-on").addClass("hide")
                $("#alert").addClass("hide-alert")
                $("#abody").append('<p class="alert-p font">There has been an unforseen error<br>'+e.status+': '+e.statusText+'</p>')

            }
        })
    })
});
function enable_alert($,name,fun){
    fun($)
    $("#alert-name").text(name)
    $("#alert").addClass("hide-alert")
    $("#screen").addClass("hide")
}

