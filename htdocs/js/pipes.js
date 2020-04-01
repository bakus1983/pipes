import pash from './libs/pash.js';

// start pipes.
var default_value = "anon@pipes$ ";
var psh = new pash(default_value, this);
var q;
var drawing;
var all;
var title;
var default_font_size = "1.5vh";
var title_ascii_art = (function() {/*
  ______   __     ______   ______     ______
 /\  == \ /\ \   /\  == \ /\  ___\   /\  ___\
 \ \  _-/ \ \ \  \ \  _-/ \ \  __\   \ \___  \
  \ \_\    \ \_\  \ \_\    \ \_____\  \/\_____\
   \/_/     \/_/   \/_/     \/_____/   \/_____/

                                  version 0.9.0
*/}).toString().match(/\/\*([^]*)\*\//)[1];

function Init(){

    init_all();
    init_drawing_area();
    init_title();
    init_input_area();
    set_theme();

};

var init_title = function (){
    drawing.innerText += title_ascii_art;
};

var set_theme = function (){

    const background_color = "#191919";
    const text_color = "#BFFF00";
    // set theme to body.
    document.body.style.backgroundColor = background_color;
    document.body.style.color = text_color;

    // set theme to input area
    q.style.backgroundColor = background_color;
    q.style.color = text_color;
};

var  init_all = function (){
    all = document.createElement('div');
    document.body.appendChild(all);
    all.style.overflowY  = "scroll";
    all.style.fontFamily = "Courier New, Courier, monospace";
    all.style.whiteSpace = "pre";
    all.style.fontSize   = default_font_size;
};

var init_drawing_area = function(){
    drawing = document.createElement('div');
    all.appendChild(drawing);
};

var init_input_area  =  function(){
    q      = document.createElement('input');
    all.appendChild(q);
    q.setAttribute('spellcheck',false);
    q.style.borderWidth  = "0px";
    q.style.bottom       = "5px";
    q.style.width        = "98%";
    q.style.fontFamily   = "Courier New, Courier, monospace";
    q.style.whiteSpace   = "pre";
    q.style.fontSize     = default_font_size;
    q.style.outlineWidth = "0px";
    q.style.outline      = "none";
    q.value = default_value;
    q.focus();
    // turn off cut action.
    document.addEventListener('cut', (event) => {
        event.preventDefault();
    }, {passive: false});
    q.addEventListener("paste", function(event){
      if ( q.selectionStart >= 0 || q.selectionEnd >= 0 ){
          set_text(event.target.value, q);
          return;
      }
    });
    // turn off several input of key
    document.addEventListener('keydown', (event) => {
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          q.focus();
          var keyName = event.key;
          setTimeout(post_keydown(event, q), 0);
        }
    }, {passive: false});

    document,addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          pressed_enter(q);
          return;
        }
    }, {passive: false});
};

var pressed_enter = function (q){

    std_out(psh.pash_proc(q.value) + "\r\n");

    q.value = default_value;
    q.focus();
    var element = document.documentElement;
    var bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);

};

var std_out = function(output){
    drawing.innerText += output;
};

var set_text = function (text,q) {
    var textEvent = document.createEvent('TextEvent');
    textEvent.initTextEvent ('textInput', true, true, null, text, 1, "en-US");
    document.getSelection().removeAllRanges();
    document.getSelection().empty();
    q.setSelectionRange(q.value.length, q.value.length);
    q.dispatchEvent( textEvent );
};

var post_keydown = function (event, q) {
    if(document.getSelection().toString() !== "" && document.activeElement === q){
      set_text(event.key, q);
      return;
    }
    if (event.keyCode == 8 || event.keyCode == 46){
      // check default value length.
      if (q.value.length <= default_value.length){
        console.log("hit");
        event.preventDefault();
        return false;
      }
    }
}

Init();
