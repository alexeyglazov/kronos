/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function HolidaysManager(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "HolidaysManager.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.popupContainerId = this.htmlId + "_popup";
   var date = new Date()
   this.selected = {
       "year": date.getFullYear()
   }
   this.data = {
       "year": date.getFullYear(),
       "holidays": []
   }
   this.years = [];
   this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   this.calendars = [];
}
HolidaysManager.prototype.init = function() {
    this.loadInitialContent();
    this.dataChanged(false);
}
HolidaysManager.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.year = this.data.year;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.data.holidays = result.holidays;
            var startYear = form.data.year;
            if(result.minYear != null && result.minYear < startYear) {
                startYear = result.minYear;
            }
            for(var i = startYear; i <= form.data.year + 1; i++) {
               form.years.push(i);
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
HolidaysManager.prototype.loadContentForYear = function() {
    var form = this;
    var data = {};
    data.command = "getContentForYear";
    data.year = this.data.year;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.data.holidays = result.holidays;
            form.updateCalendarsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
HolidaysManager.prototype.yearChangedHandle = function() {
    this.selected.year = parseInt($('#' + this.htmlId + '_year').val());
    this.data.year = this.selected.year;
    this.loadContentForYear();
}
HolidaysManager.prototype.calendarChangedHandle = function(year, month, days) {
    var newHolidays = [];
    for(var key in this.data.holidays) {
        var holiday = this.data.holidays[key];
        if(holiday.year == this.data.year && holiday.month != month) {
            newHolidays.push(holiday);
        }
    }
    for(var key in days) {
        var day = days[key];
        var holiday = {
            year: year,
            month: month,
            dayOfMonth: day
        }
        newHolidays.push(holiday);
    }
    this.data.holidays = newHolidays;
    this.dataChanged(true);
}
HolidaysManager.prototype.show = function() {
  $('#' + this.containerHtmlId).html(this.getHtml());
  this.updateView();
  this.setHandlers();
  this.makeButtons();
}
HolidaysManager.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_saveBtn')
      .button({
      icons: {
        primary: "ui-icon-plus"
      },
      text: true
    })
      .click(function( event ) {
        form.save.call(form);
    });    
}
HolidaysManager.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Year</span></td><td><select id="' + this.htmlId + '_year"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr>';
    html += '<td><div id="' + this.htmlId + '_layoutJanuary"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutFebruary"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutMarch"></div></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><div id="' + this.htmlId + '_layoutApril"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutMay"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutJune"></div></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><div id="' + this.htmlId + '_layoutJuly"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutAugust"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutSeptember"></div></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><div id="' + this.htmlId + '_layoutOctober"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutNovember"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutDecember"></div></td>';
    html += '</tr>';
    html += '</table>';

    html += '<button id="' + this.htmlId + '_saveBtn">Save</button>';
    return html;
}
HolidaysManager.prototype.updateView = function() {
    this.updateYearView();
    this.updateCalendarsView();
}
HolidaysManager.prototype.updateYearView = function() {
    var html = '';
    for(var key in this.years) {
        var year = this.years[key];
        var isSelected = "";
        if(year == this.selected.year) {
           isSelected = "selected";
        }
        html += '<option value="' + year + '" ' + isSelected + '>' + year + '</option>';
    }
    $('#' + this.htmlId + '_year').html(html);
}
HolidaysManager.prototype.updateCalendarsView = function() {
   for(var key in this.months) {
       var month = this.months[key];
       var calendar = new Calendar(this.htmlId + '_' + month.toLowerCase(), this.htmlId + '_layout' + month, this.data.year, key, this.getHolidaysInMonth(key), this, this.calendarChangedHandle);
       calendar.init();
       this.calendars.push(calendar);
   }
}
HolidaysManager.prototype.getHolidaysInMonth = function(month) {
    var days = [];
    for(var key in this.data.holidays) {
        var holiday = this.data.holidays[key];
        if(holiday.year == this.data.year && holiday.month == month) {
            days.push(holiday.dayOfMonth);
        }
    }
    return days;
}
HolidaysManager.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form, event);});
}
HolidaysManager.prototype.validate = function() {
    var errors = [];
    return errors;
}
HolidaysManager.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors();
        return;
    }
    this.doSave();
}
HolidaysManager.prototype.doSave = function() {
    var form = this;
    var data = {};
    data.command = "setHolidays";
    data.holidaysManagerForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Holidays info has been successfully saved", null, null);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

HolidaysManager.prototype.dataChanged = function(value) {
    dataChanged = value;
}