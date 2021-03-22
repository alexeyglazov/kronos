/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function BusinessTripReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "BusinessTripReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
    }
    this.selected = {   
    }
    this.data = {
        "startDate" : null,
        "endDate" : null        
    }
    this.reports = {};
}
BusinessTripReport.prototype.init = function() {
    this.show();
}
BusinessTripReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
BusinessTripReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td></tr>';
    html += '<tr><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"> <input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="businessTripReportForm" value="">';
    html += '</form>';
    return html;
}
BusinessTripReport.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
BusinessTripReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
BusinessTripReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
BusinessTripReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
BusinessTripReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
BusinessTripReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
BusinessTripReport.prototype.updateView = function() {   
    this.updateStartDateView();
    this.updateEndDateView();
}
BusinessTripReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
BusinessTripReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
BusinessTripReport.prototype.validate = function(mode) {
    var errors = [];
    var warnings = [];
    var startDate = null;
    var endDate = null;
    if(this.data.startDate == null || this.data.startDate == "") {
        errors.push("Start date is not set");
    } else if(! isDateValid(this.data.startDate)) {
        errors.push("Start date has incorrect format");
    } else {
        startDate = parseDateString(this.data.startDate);
    }
    if(this.data.endDate == null || this.data.endDate == "") {
        errors.push("End date is not set");
    } else if(! isDateValid(this.data.endDate)) {
        errors.push("End date has incorrect format");
    } else {
        endDate = parseDateString(this.data.endDate);
    }
    if(startDate != null && endDate != null && startDate > endDate) {
        errors.push("End date is less than Start date");
    }
    return {
     "errors": errors,
     "warnings": warnings
    };
}
BusinessTripReport.prototype.startGenerating = function() {
    var mode = "HTML";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generate();
    }
}
BusinessTripReport.prototype.startGeneratingXLS = function() {
    var mode = "XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generateXLS();
    }
}
BusinessTripReport.prototype.generateXLS = function() {
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
BusinessTripReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.businessTripReportForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.report = result.report;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
BusinessTripReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeaderView();
    this.updateBodyView();

}
BusinessTripReport.prototype.updateHeaderView = function() {
    var html = '';
    html += '<table class="datagrid">';  
    html += '<tr><td>Start</td><td>' + calendarVisualizer.getHtml(this.report.formStartDate) + '</td></tr>';
    html += '<tr><td>End</td><td>' + calendarVisualizer.getHtml(this.report.formEndDate) + '</td></tr>';
    html += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    html += '</table>';    
    $('#' + this.htmlId + '_heading').html(html);    
}
BusinessTripReport.prototype.updateBodyView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="9">Business Trip Report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Project Code</td>';
    html += '<td>Client</td>';
    html += '<td>First Name</td>';
    html += '<td>Last Name</td>';
    html += '<td>First Name (local language)</td>';
    html += '<td>Last Name (local language)</td>';
    html += '<td>Days count</td>';
    html += '<td>Start date</td>';
    html += '<td>End date</td>';
    html += '</tr>';
    var totalBusinessTripDaysCount = 0;
      
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if(row.businessTripDaysCount != null) {
            totalBusinessTripDaysCount += row.businessTripDaysCount;
        }
        html += '<tr>';
        html += '<td>' + row.projectCodeCode + '</td>';
        html += '<td>' + row.clientName + '</td>';
        html += '<td>' + row.employeeFirstName + '</td>';
        html += '<td>' + row.employeeLastName + '</td>';
        html += '<td>' + row.employeeFirstNameLocalLanguage + '</td>';
        html += '<td>' + row.employeeLastNameLocalLanguage + '</td>';
        html += '<td>' + row.businessTripDaysCount + '</td>';
        html += '<td>' + getStringFromYearMonthDate(row.startDate) + '</td>';
        html += '<td>' + getStringFromYearMonthDate(row.endDate) + '</td>';
        html += '</tr>';
    }
    html += '<tr class="dgHighlight">';
    html += '<td colspan="6">&nbsp;</td>';
    html += '<td>' + totalBusinessTripDaysCount + '</td>';
    html += '<td colspan="2">&nbsp;</td>';
    html += '</tr>';
    html += '</table>';    
    $('#' + this.htmlId + '_body').html(html);
}