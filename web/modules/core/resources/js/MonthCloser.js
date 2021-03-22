/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MonthCloser(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "MonthCloser.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.popupContainerId = this.htmlId + "_popup";
   var date = new Date()
   this.loaded = {
       "unclosedMonths": [],
       "closedMonthIds": []
   }
   this.selected = {
       "year": date.getFullYear()
   }
   this.data = {
       "year": date.getFullYear(),
       "closedMonthIds": []
   }
   this.years = [];

   this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
}
MonthCloser.prototype.init = function() {
    this.loadAll();
    this.dataChanged(false);
}
MonthCloser.prototype.loadAll = function() {
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
            form.loaded.unclosedMonths = result.unclosedMonths;
            form.loaded.closedMonthIds = result.closedMonthIds;
            form.data.closedMonthIds = form.loaded.closedMonthIds;
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

MonthCloser.prototype.yearChangedHandle = function() {
    this.selected.year = parseInt($('#' + this.htmlId + '_year').val());
    this.data.year = this.selected.year;
    var form = this;
    var data = {};
    data.command = "getClosedMonthIds";
    data.year = this.data.year;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.unclosedMonths = result.unclosedMonths;
            form.loaded.closedMonthIds = result.closedMonthIds;
            form.data.closedMonthIds = form.loaded.closedMonthIds;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
MonthCloser.prototype.monthClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var month = parseInt(tmp[tmp.length - 1]);
    var index = jQuery.inArray(month, this.data.closedMonthIds) ;
    if(index == -1) {
        this.data.closedMonthIds.push(month);
    } else {
        this.data.closedMonthIds.splice(index, 1);
    }
    this.updateMonthsView();
    this.dataChanged(true);
}
MonthCloser.prototype.show = function() {
  $('#' + this.containerHtmlId).html(this.getHtml());
  this.updateView();
  this.setHandlers();
  if(this.loaded.unclosedMonths != null && this.loaded.unclosedMonths.length != 0) {
      var message = '';
      message += 'It is recommended to close the following months:<br />';
      for(var i in this.loaded.unclosedMonths) {
        var unclosedMonth = this.loaded.unclosedMonths[i];
        message += unclosedMonth.year + '.' + (unclosedMonth.month + 1) + '<br />';
      }    
      doAlert('Alert', message, null, null);
  }
}
MonthCloser.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Year</span></td><td><select id="' + this.htmlId + '_year"></select></td></tr>';
    html += '<tr><td><span class="label1">Months</span></td><td><div id="' + this.htmlId + '_months"></div></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_save" value="Save"></td></tr>';
    html += '</table>';
    return html;
}
MonthCloser.prototype.updateView = function() {
    this.updateYearView();
    this.updateMonthsView();
}
MonthCloser.prototype.updateYearView = function() {
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
MonthCloser.prototype.updateMonthsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Month</td><td>Closed</td></tr>';
    for(var key = 0; key < this.months.length; key++) {
        var month = this.months[key];
        var isChecked = "";
        if(jQuery.inArray(key, this.loaded.closedMonthIds) != -1) {
           isChecked = 'checked';
        }
        html += '<tr><td>' + month + '</td><td><input type="checkbox" id="' + this.htmlId + '_month_' + key + '" ' + isChecked + '></td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_months').html(html);
    var form = this;
    $('input[id^="' + this.htmlId + '_month_"]').bind("click", function(event) {form.monthClickedHandle(event);});
}
MonthCloser.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_save').bind("click", function(event) {form.save.call(form, event);});
}
MonthCloser.prototype.validate = function() {
    var errors = [];
    return errors;
}
MonthCloser.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    doConfirm("Confirm", "Do you really want to change status Open/Close for these months?", this, this.doSave, null, null);
}
MonthCloser.prototype.doSave = function() {
    var form = this;
    var data = {};
    data.command = "setClosedMonths";
    data.monthCloserForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Open/Close status has been successfully set", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

MonthCloser.prototype.dataChanged = function(value) {
    dataChanged = value;
}