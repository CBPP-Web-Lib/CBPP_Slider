/*globals module, require, console*/
module.exports = function($) {
    "use strict";
    var CBPP_Slider = {};
    require("./node_modules/jquery-ui-dist/jquery-ui_commonJS.js")($);
    require("./node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch_commonJS.js")($);
    require("./cbpp_slider.css");
    require("jquery-ui/themes/base/base.css");
    CBPP_Slider.Slider = function(selector, options) {
        if (typeof(options)==="undefined") {
            options = {};
        }

        if (CBPP_Slider.ready === false) {
            console.error("CBPP_Slider library not ready yet");
            return false;
        }

        var s = this;

        s.options = {
            min:0,
            max:100,
            labeledValues: [],
            labelFormatter: function(n) {
                return n;
            },
            tickValues: [],
            lastLabelAlign: true,
            firstLabelAlign: true
        };

        s.selector = selector;
        $.extend(true,s.options,options);

        s.change = function(handler) {
            $(s.selector).slider({
                slide: function(e, v) {
                    var doChange = true;
                    if (typeof(s.options.allowedValues)!=="undefined") {
                        doChange = false;
                        e.preventDefault();
                        var startValue = $(selector).slider("values");
                        if (startValue.length === 0) {
                            startValue = $(selector).slider("value");
                        }
                        var value;
                        if (typeof(v.value)!=="undefined") {
                            value = [v.value];
                        }
                        if (typeof(v.values)!=="undefined") {
                            value = v.values;
                        }
                        for (var j = 0, jj = value.length; j<jj; j++) {
                            for (var i = 0, ii = s.options.allowedValues.length - 1; i<ii; i++) {
                                if (value[j] <= s.options.allowedValues[i]) {
                                    if (value[j] - s.options.allowedValues[i] < s.options.allowedValues[i+1] - value[j]) {
                                        value[j] = s.options.allowedValues[i];
                                    } else {
                                        value[j] = s.options.allowedValues[i+1];
                                    }
                                    break;
                                }
                            }
                        }
                        if (value.length === 1) {
                            v.value = value[0];
                            $(s.selector).slider("value", v.value);
                            doChange = v.value !== startValue;
                            delete(v.values);
                        } else {
                            v.values = value;
                            $(s.selector).slider("values", v.values);
                            doChange = (v.values[0] !== startValue[0] || v.values[1] !== startValue[1]);
                            delete(v.value);
                        }
                    }
                    if (doChange) {
                        handler.call(this, e, v);
                    }
                }
            });
            /*$(s.selector).slider({
                slide: handler
            });*/
        };

        s.makeTicks = function() {
            var toAppend = [], tick, perc;
            var alreadyDrawn = {};
            for (var i = 0,ii = s.options.labeledValues.length;i<ii;i++) {
                perc = Math.round((s.options.labeledValues[i] - s.options.min)/(s.options.max - s.options.min)*1000)/10;
                tick = $("<div class='tick' style='left:" + perc + "%' ><span class='label" + ((i===ii-1 && s.options.lastLabelAlign) ? ' last' : '') + ((i===0 && s.options.firstLabelAlign) ? ' first' : '') + "'>" + s.options.labelFormatter(s.options.labeledValues[i]) + "</span></div>");
                toAppend.push(tick);
                alreadyDrawn[s.options.labeledValues[i]] = true;
            }
            for (i = 0, ii = s.options.tickValues.length; i<ii; i++) {
                if (alreadyDrawn[s.options.tickValues[i]] !== true) {
                    perc = Math.round((s.options.tickValues[i] - s.options.min)/(s.options.max - s.options.min)*1000)/10;
                    tick = $("<div class='tick small' style='left:" + perc + "%' ></div>");
                    toAppend.push(tick);
                }

            }
            return toAppend;
        };
        s.destroy = function() {
            //console.log($(s.selector));
           // $(s.selector).slider("destroy");
            $(s.selector).empty();
            $(s.selector).unbind();
            delete(s.selector);
            delete(s.options);
            delete(s.ready);
        };

        $(s.selector).addClass("cbpp_slider");
        $(s.selector).append("<div class='main-line'></div>");
        if (typeof(s.ready)==="function") {
            s.ready();
        }

        if (typeof(s.options.labeledValues)==="object") {
            $(s.selector).append(s.makeTicks());
        }
        $(s.selector).slider(s.options);
        $(s.selector).find(".ui-slider-handle").append("<div class='cbpp-slider-handle'></div>");


    };
    return CBPP_Slider;

};
