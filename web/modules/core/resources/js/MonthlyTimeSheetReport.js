/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MonthlyTimeSheetReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "MonthlyTimeSheetReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    this.years = [];
    var date = new Date();
    this.loaded = {
    }
    this.selected = {
        "year" : date.getFullYear(),
        "month" : date.getMonth()
    }
    this.data = {
        "year" : date.getFullYear(),
        "month" : date.getMonth()
    }
}
MonthlyTimeSheetReport.prototype.init = function() {
    this.loadInitialContent();
}
MonthlyTimeSheetReport.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
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
MonthlyTimeSheetReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
MonthlyTimeSheetReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Year</span></td><td><select id="' + this.htmlId + '_year"></select></td></tr>';
    html += '<tr><td><span class="label1">Month</span></td><td><select id="' + this.htmlId + '_month"></select></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="monthlyTimeSheetReportForm" value="">';
    html += '</form>';
    return html;
}
MonthlyTimeSheetReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_month').bind("change", function(event) {form.monthChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
MonthlyTimeSheetReport.prototype.yearChangedHandle = function(event) {
    this.data.year = parseInt($('#' + this.htmlId + '_year').val());
}
MonthlyTimeSheetReport.prototype.monthChangedHandle = function(event) {
    this.data.month = parseInt($('#' + this.htmlId + '_month').val());
}
MonthlyTimeSheetReport.prototype.updateView = function() {
    this.updateYearView();
    this.updateMonthView();
    this.updateButtonsView();
}
MonthlyTimeSheetReport.prototype.updateYearView = function() {
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
MonthlyTimeSheetReport.prototype.updateMonthView = function() {
    var html = '';
    for(var key in this.months) {
        var month = this.months[key];
        var isSelected = "";
        if(key == this.selected.month) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + month + '</option>';
    }
    $('#' + this.htmlId + '_month').html(html);
}
MonthlyTimeSheetReport.prototype.updateButtonsView = function() {
    $('#' + this.htmlId + '_generateXLSBtn').attr("disabled", false);
}
MonthlyTimeSheetReport.prototype.validate = function() {
    var errors = [];
    return errors;
}
MonthlyTimeSheetReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReports();
    }
}
MonthlyTimeSheetReport.prototype.generateXLSReports = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}

