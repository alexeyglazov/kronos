/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PeriodPicker(formData, htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "PeriodPicker.jsp"
    }
    this.mode = formData.mode;
    //{"type", "QUARTER", "path": "Quarter / First", "quarter": "FIRST", "month": null, "date": null, "counter": null}
    this.pickedPeriods = [];
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.types = {
        'QUARTER': 'Quarter',
        'MONTH': 'Month',
        'DATE': 'Date',
        'COUNTER': 'Counter'
    }
    this.quarters = {
        "FIRST" : "First",
        "SECOND" : "Second",
        "THIRD" : "Third",
        "FOURTH" : "Fourth"
    };
    this.quartersForCode = {
        "FIRST" : "1",
        "SECOND" : "2",
        "THIRD" : "3",
        "FOURTH" : "4"
    };
    this.months = {
        "JANUARY" : "January",
        "FEBRUARY" : "February",
        "MARCH" : "March",
        "APRIL" : "April",
        "MAY" : "May",
        "JUNE" : "June",
        "JULY" : "July",
        "AUGUST" : "August",
        "SEPTEMBER" : "September",
        "OCTOBER" : "October",
        "NOVEMBER" : "November",
        "DECEMBER" : "December"
    };
    this.monthsForCode = {
        "JANUARY" : "1",
        "FEBRUARY" : "2",
        "MARCH" : "3",
        "APRIL" : "4",
        "MAY" : "5",
        "JUNE" : "6",
        "JULY" : "7",
        "AUGUST" : "8",
        "SEPTEMBER" : "9",
        "OCTOBER" : "10",
        "NOVEMBER" : "11",
        "DECEMBER" : "12"
    };
    this.dates = {
        "D3101" : "3101",
        "D2802" : "2802",
        "D3103" : "3103",
        "D3004" : "3004",
        "D3105" : "3105",
        "D3006" : "3006",
        "D3107" : "3107",
        "D3108" : "3108",
        "D3009" : "3009",
        "D3110" : "3110",
        "D3011" : "3011",
        "D3112" : "3112"
    };    
    this.selected = {
        "type": 'QUARTER',
        "quarter": 'FIRST',
        "month": 'JANUARY',
        "date": 'D3101',
        "pickedPeriods": {
            "quarter": null,
            "month": null,
            "date": null,
            "counter": null
        }
    }
}
PeriodPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
PeriodPicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Type</span></td><td><span class="label1">Value</span></td><td></td></tr>';
    html += '<tr><td><select style="min-width: 100px;" id="' + this.htmlId + '_type"></select></td>';
    html += '<td>';

    html += '<select style="min-width: 100px; display: none;" id="' + this.htmlId + '_quarter"></select>';
    html += '<select style="min-width: 100px; display: none;" id="' + this.htmlId + '_month"></select>';
    html += '<select style="min-width: 100px; display: none;" id="' + this.htmlId + '_date"></select>';
    html += '<span style="min-width: 100px; display: none;" id="' + this.htmlId + '_counter">Auto</span>';

    html += '</td>';
    if(this.mode == 'MULTIPLE') {
        html += '<td style="vertical-align: top;"><span id="' + this.htmlId + '_period_pick" title="Pick selected">Pick</span></td>';
    } else {
        html += '<td></td>';
    }
    html += '</tr>';
    html += '</table>';
    
    if(this.mode == 'MULTIPLE') {
        html += '<span class="label1">Picked Periods</span><br />';
        html += '<table>';
        html += '<tr>';
        html += '<td><select id="' + this.htmlId + '_pickedPeriod" size="5" style="width: 300px; height: 150px;"></select></td>';
        html += '<td style="vertical-align: top;"><span id="' + this.htmlId + '_period_clear" title="Remove selected">Remove</span></td>';
        html += '</tr>';
        html += '</table>';
    }
    return html;
}
PeriodPicker.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_period_pick')
      .button()
      .click(function( event ) {
        form.pickPeriod.call(form);
    });
    
    $('#' + this.htmlId + '_period_clear')
      .button()
      .click(function( event ) {
        form.clearPeriod.call(form);
    });
}    
PeriodPicker.prototype.updateView = function() {
    this.updateTypeView();
}
PeriodPicker.prototype.updateTypeView = function() {
    var html = "";
    $('#' + this.htmlId + '_quarter').hide();
    $('#' + this.htmlId + '_month').hide();
    $('#' + this.htmlId + '_date').hide();
    $('#' + this.htmlId + '_counter').hide();
    for(var key in this.types) {
        var type = this.types[key];
        var isSelected = "";
        if(key == this.selected.type) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + type + '</option>';
    }
    $('#' + this.htmlId + '_type').html(html);  
    if(this.selected.type == "QUARTER") {
        this.updateQuartersView();
        $('#' + this.htmlId + '_quarter').show("slow");
    } else if(this.selected.type == "MONTH") {
        this.updateMonthsView();
        $('#' + this.htmlId + '_month').show("slow");
    } else if(this.selected.type == "DATE") {
        this.updateDatesView();
        $('#' + this.htmlId + '_date').show("slow");
    } else if(this.selected.type == "COUNTER") {
        $('#' + this.htmlId + '_counter').show("slow");
    }
}
PeriodPicker.prototype.updateQuartersView = function() {
    var html = "";
    for(var key in this.quarters) {
        var quarter = this.quarters[key];
        var isSelected = "";
        if(key == this.selected.quarter) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + quarter + '</option>';
    }
    $('#' + this.htmlId + '_quarter').html(html);
}
PeriodPicker.prototype.updateMonthsView = function() {
    var html = "";
    for(var key in this.months) {
        var month = this.months[key];
        var isSelected = "";
        if(key == this.selected.month) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + month + '</option>';
    }
    $('#' + this.htmlId + '_month').html(html);
}
PeriodPicker.prototype.updateDatesView = function() {
    var html = "";
    for(var key in this.dates) {
        var date = this.dates[key];
        var isSelected = "";
        if(key == this.selected.date) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + date + '</option>';
    }
    $('#' + this.htmlId + '_date').html(html);
}
PeriodPicker.prototype.updatePickedPeriodView = function() {
    var html = '';
    var i = 0;
    for(var key in this.pickedPeriods) {
        var pickedPeriod = this.pickedPeriods[key];
        var type = pickedPeriod.type;
        var path = pickedPeriod.path;
        var value = null;
        var isSelected = "";
        if(type == 'QUARTER') {
            value = pickedPeriod.quarter;
            if(value == this.selected.pickedPeriods.quarter) {
                isSelected = "selected";
            }
        } else if(type == 'MONTH') {
            value = pickedPeriod.month;
            if(value == this.selected.pickedPeriods.month) {
                isSelected = "selected";
            }
        } else if(type == 'DATE') {
            value = pickedPeriod.date;
            if(value == this.selected.pickedPeriods.date) {
                isSelected = "selected";
            }
        } else if(type == 'COUNTER') {
            value = i;
            if(value == this.selected.pickedPeriods.counter) {
                isSelected = "selected";
            }
            i++;
        }     
        html += '<option value="' + type + '_' + value + '" ' + isSelected + '>' + path + '</option>';
    }
    $('#' + this.htmlId + '_pickedPeriod').html(html);    
}
PeriodPicker.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_type').bind("change", function(event) {form.typeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_quarter').bind("change", function(event) {form.quarterChangedHandle.call(form)});
    $('#' + this.htmlId + '_month').bind("change", function(event) {form.monthChangedHandle.call(form)});
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateChangedHandle.call(form)});
    $('#' + this.htmlId + '_pickedPeriod').bind("change", function(event) {form.periodChangedHandle.call(form)});
}
PeriodPicker.prototype.typeChangedHandle = function(event) {
    this.selected.type = event.currentTarget.value;
    if(this.selected.type == 'QUARTER') {
        this.selected.quarter = 'FIRST';
    } else if(this.selected.type == 'MONTH') {
        this.selected.month = 'JANUARY';
    } else if(this.selected.type == 'DATE') {
        this.selected.date = 'D3101';
    } else if(this.selected.type == 'COUNTER') {
        //
    }
    this.updateTypeView();
}
PeriodPicker.prototype.quarterChangedHandle = function(event) {
    this.selected.quarter = $('#' + this.htmlId + '_quarter').val();
}
PeriodPicker.prototype.monthChangedHandle = function(event) {
    this.selected.month = $('#' + this.htmlId + '_month').val();
}
PeriodPicker.prototype.dateChangedHandle = function(event) {
    this.selected.date = $('#' + this.htmlId + '_date').val();
}
PeriodPicker.prototype.pickPeriod = function(event) {
    if(this.selected.type == null) {
        doAlert('Alert', 'Type is not selected', null, null);
        return;
    }
    var value = null;
    if(this.selected.type == 'QUARTER') {
        value = this.quarters[this.selected.quarter];
    } else if(this.selected.type == 'MONTH') {
        value = this.months[this.selected.month];
    } else if(this.selected.type == 'DATE') {
        value = this.dates[this.selected.date];
    } else if(this.selected.type == 'COUNTER') {
        value = 'Auto';
    }
    if(value == null) {
        doAlert('Alert', 'Value is not selected', null, null);
        return;
    }

    var pickedPeriod = {
        "type": this.selected.type,
        "path": this.getPath()
    };
    if(this.selected.type == 'QUARTER') {
        pickedPeriod.quarter = this.selected.quarter;
    } else if(this.selected.type == 'MONTH') {
        pickedPeriod.month = this.selected.month;
    } else if(this.selected.type == 'DATE') {
        pickedPeriod.date = this.selected.date;
    } else if(this.selected.type == 'COUNTER') {
        
    }
    var periodsTmp = jQuery.grep(this.pickedPeriods, function(element, i) {
        if(element.type == 'COUNTER') {
            return false;
        } else if(element.type == 'QUARTER') {
            if(element.quarter == pickedPeriod.quarter) {
                return true;
            }
        } else if(element.type == 'MONTH') {
            if(element.month == pickedPeriod.month) {
                return true;
            }
        } else if(element.type == 'DATE') {
            if(element.date == pickedPeriod.date) {
                return true;
            }
        }
        return false;
    });
    if(periodsTmp.length == 0) {
        this.pickedPeriods.push(pickedPeriod);
        this.sortPickedPeriods();
        this.updatePickedPeriodView();
    } else {
        doAlert('Alert', 'This period is already picked', null, null);
    }
}
PeriodPicker.prototype.periodChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_pickedPeriod').val();
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var valueTxt = tmp[tmp.length - 1];
    this.selected.pickedPeriods = {
        "quarter": null,
        "month": null,
        "date": null,
        "counter": null
    }
    if(type == 'QUARTER') {
        this.selected.pickedPeriods.quarter = valueTxt;
    } else if(type == 'MONTH') {
        this.selected.pickedPeriods.month = valueTxt;
    } else if(type == 'DATE') {
        this.selected.pickedPeriods.date = valueTxt;
    } else if(type == 'COUNTER') {
        this.selected.pickedPeriods.counter = valueTxt;
    }
    this.updatePickedPeriodView();
}
PeriodPicker.prototype.clearPeriod = function(event) {
    if(this.selected.pickedPeriods.quarter == null && this.selected.pickedPeriods.month == null && this.selected.pickedPeriods.date == null && this.selected.pickedPeriods.counter == null) {
        doAlert('Alert', 'Period is not selected', null, null);
        return;
    }
    var index = null;
    var i = 0;
    for(var key in this.pickedPeriods) {
        var period = this.pickedPeriods[key];
        if(period.type == 'QUARTER' && this.selected.pickedPeriods.quarter == period.quarter) {
            index = key;
            break;           
        }
        if(period.type == 'MONTH' && this.selected.pickedPeriods.month == period.month) {
            index = key;
            break;           
        }
        if(period.type == 'DATE' && this.selected.pickedPeriods.date == period.date) {
            index = key;
            break;           
        }
        if(period.type == 'COUNTER') { 
            if(parseInt(this.selected.pickedPeriods.counter) == i) {
                index = key;
                break;           
            }
            i++;
        }
    }
    if(index != null) {
        this.pickedPeriods.splice(index, 1);
    }
    this.sortPickedPeriods();
    this.selected.pickedPeriods = {
        "quarter": null,
        "month": null,
        "date": null,
        "counter": null
    }
    this.updatePickedPeriodView();
}
PeriodPicker.prototype.show = function() {
    var title = 'Pick Period'
    var form = this;
    var height = 200;
    if(this.mode == 'MULTIPLE') {
        height = 350;
    }
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    this.makeButtons();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        client: 'center',
        width: 400,
        height: height,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                form.okClickHandle();
            },
            Cancel: function() {
                $(this).dialog( "close" );
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
}
PeriodPicker.prototype.okClickHandle = function() {
    if(this.mode == 'MULTIPLE') {
        this.okHandler.call(this.okHandlerContext, this.pickedPeriods);        
    } else {  
        alert('to write correct handle of single choice for period picker');
        var period = this.getPeriod(this.selected.periodId);
        this.okHandler.call(this.okHandlerContext, period);
    }  
}
PeriodPicker.prototype.getValue = function() {
    var value = null;
    if(this.selected.type == 'QUARTER') {
        value = this.quarters[this.selected.quarter];
    } else if(this.selected.type == 'MONTH') {
        value = this.months[this.selected.month];
    } else if(this.selected.type == 'DATE') {
        value = this.dates[this.selected.date];
    } else if(this.selected.type == 'COUNTER') {
        value = 'Auto';
    }
    return value;
}
PeriodPicker.prototype.getPath = function() {
    var type = this.types[this.selected.type];
    var value = this.getValue();
    return type + ' / ' + value;
}
PeriodPicker.prototype.sortPickedPeriods = function() {
    var form = this;
    this.pickedPeriods.sort(function(o1, o2) {
        var typeIndex1 = form.getIndexOfKey(form.types, o1.type);
        var typeIndex2 = form.getIndexOfKey(form.types, o2.type);
        if(typeIndex1 > typeIndex2) {
            return 1;
        } else if(typeIndex1 < typeIndex2) {
            return -1;
        }
        var index1 = null;
        var index2 = null;
        if(o1.type == 'QUARTER') {
            index1 = form.getIndexOfKey(form.quarters, o1.quarter);
            index2 = form.getIndexOfKey(form.quarters, o2.quarter);
        } else if(o1.type == 'MONTH') {
            index1 = form.getIndexOfKey(form.months, o1.month);
            index2 = form.getIndexOfKey(form.months, o2.month);
        } else if(o1.type == 'DATE') {
            index1 = form.getIndexOfKey(form.dates, o1.date);
            index2 = form.getIndexOfKey(form.dates, o2.date);
        } else if(o1.type == 'COUNTER') {
            return 1;
        }
        if(index1 == index2) return 0;
        return index1 > index2 ? 1: -1;
    }); 
}
PeriodPicker.prototype.getIndexOfKey = function(a, key) {
    var i = 0;
    for(var key2 in a) {
        if(key2 == key) {
            return i;
        }
        i++;
    }
    return -1;
}