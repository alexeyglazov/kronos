/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function Calendar(htmlId, containerHtmlId, year, month, days, changeContext, changeHandler) {
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.year = year;
    this.month = month;
    this.days = days;
    this.changeContext = changeContext;
    this.changeHandler = changeHandler;
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
}
Calendar.prototype.init = function() {
    this.show();
}
Calendar.prototype.setHandlers = function() {
    var form = this;
    $('input[id^="' + this.htmlId + '_day_"]').bind("click", function(event) {form.dayClickedHandle.call(form, event)});
}

Calendar.prototype.dayClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var day = parseInt(tmp[tmp.length - 1]);
    var checked = $('#' + this.htmlId + '_day_' + day).is(':checked');
    var index = jQuery.inArray(day, this.days);
    if(checked) {
        if(index == -1) {
            this.days.push(day);
        }
    } else {
        if(index != -1) {
            this.days.splice(index, 1);
        }
    }
    if(this.changeContext != null && this.changeHandler != null) {
        this.changeHandler.call(this.changeContext, this.year, this.month, this.days);
    }
}

Calendar.prototype.updateDaysView = function () {
    for(var day = 1; day <= getDays(this.year, this.month); day++) {
        if(jQuery.inArray(day, this.days) == -1) {
            $('#' + this.htmlId + '_day_' + day).attr("checked", false);
        } else {
            $('#' + this.htmlId + '_day_' + day).attr("checked", true);
        }
    }
}

Calendar.prototype.updateView = function() {
    this.updateDaysView();
}

Calendar.prototype.show = function() {
    this.makeEmptyView();
    this.setHandlers();
    this.updateView();
}

Calendar.prototype.makeEmptyView = function() {
    var year = this.year;
    var month = this.month;
    var days = getDays(year, month);
    var firstDay = 1;
    var lastDay = 0;
    var weekDays = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

    var start = new Date(year, month, 1, 12);
    var finish = new Date(year, month, days, 12);
    var startDelta = start.getDay() - firstDay;
    if(startDelta < 0) {
        startDelta = 7 + startDelta;
    }
    var finishDelta = lastDay - finish.getDay();
    if(finishDelta < 0) {
        finishDelta = 7 + finishDelta;
    }
    var realStart = new Date(start.getTime() - startDelta * 1000*60*60*24);
    var realFinish = new Date(finish.getTime() + finishDelta * 1000*60*60*24);
    var html = '';
    html += '<span class="label1">' + this.months[this.month] + '</span>';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    for(var k=firstDay; k <= firstDay+6; k++) {
        var weekDay;
        if(k<7) {
            weekDay = weekDays[k];
        } else {
            weekDay = weekDays[k-7];
        }
        html += '<td>' + weekDay + '</td>';
    }
    html += '</tr>';
    var i = 0;
    var j = 0;
    do {
        var day = new Date(realStart.getTime() + i * 1000*60*60*24);
        if(j == 0) {
         html += '<tr>';
        }
        if(day.getMonth() == month) {
            html += '<td>' + day.getDate() + '<input type="checkbox" id="' + this.htmlId + '_day_' + day.getDate() + '"></td>';
        } else {
            html += '<td>' + day.getDate() + '</td>';
        }
        i++;
        if(j == 6) {
          html += '</tr>';
          j=0;
        } else {
                           j++;
        }
        var dayTmp = {
            "year": day.getFullYear(),
            "month": day.getMonth(),
            "dayOfMonth": day.getDate()
        }
        var realFinishTmp = {
            "year": realFinish.getFullYear(),
            "month": realFinish.getMonth(),
            "dayOfMonth": realFinish.getDate()
        }
    } while(compareYearMonthDate(dayTmp, realFinishTmp) == -1)
    html += '</table>';
    $('#' + this.containerHtmlId).html(html);
}
