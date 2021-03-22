/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function HRAdministrativeReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "HRAdministrativeReport.jsp"
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
HRAdministrativeReport.prototype.init = function() {
    this.show();
}
HRAdministrativeReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
HRAdministrativeReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td></tr>';
    html += '<tr><td><span class="label1">To</span></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="hrAdministrativeReportForm" value="">';
    html += '</form>';
    return html;
}
HRAdministrativeReport.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
HRAdministrativeReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
HRAdministrativeReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
HRAdministrativeReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
HRAdministrativeReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
HRAdministrativeReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
HRAdministrativeReport.prototype.updateView = function() {
    this.updateStartDateView();
    this.updateEndDateView();
}
HRAdministrativeReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
HRAdministrativeReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
HRAdministrativeReport.prototype.validate = function() {
    var errors = [];
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
    return errors;
}
HRAdministrativeReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
    } else {
      this.generateXLSReport();
    }
}
HRAdministrativeReport.prototype.generateXLSReport = function() {
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
HRAdministrativeReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
    } else {
      this.generateReport();
    }
}
HRAdministrativeReport.prototype.generateReport = function() {
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.hrAdministrativeReportForm = getJSON(serverFormatData);
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


HRAdministrativeReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);

    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Start Date</td><td>' + calendarVisualizer.getHtml(this.report.formStartDate) + '</td></tr>';
    headingHtml += '<tr><td>End Date</td><td>' + calendarVisualizer.getHtml(this.report.formEndDate) + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);

    var bodyHtml = "";
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="14">HR Administrative Report</td></tr>';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td>Office</td>';
    bodyHtml += '<td>Department</td>';
    bodyHtml += '<td>Sub department</td>';
    bodyHtml += '<td>Position</td>';
    bodyHtml += '<td>Standard Position</td>';
    bodyHtml += '<td>First Name</td>';
    bodyHtml += '<td>Last Name</td>';
    bodyHtml += '<td>Full Name (Local Language)</td>';
    bodyHtml += '<td>Start</td>';
    bodyHtml += '<td>End</td>';
    bodyHtml += '<td>Email</td>';
    bodyHtml += '<td>Active</td>';
    bodyHtml += '<td>Career Status</td>';
    bodyHtml += '<td>Time Status</td>';
    bodyHtml += '</tr>';
    for(var rowKey in this.report.rows) {
        var row = this.report.rows[rowKey];
        var employeeFullNameLocalLanguage = "";
        if(row.employeeLastNameLocalLanguage != null) {
            employeeFullNameLocalLanguage += row.employeeLastNameLocalLanguage;
        }
        if(row.employeeFirstNameLocalLanguage != null) {
            if(employeeFullNameLocalLanguage != "") {
                employeeFullNameLocalLanguage += " ";
            }
            employeeFullNameLocalLanguage += row.employeeFirstNameLocalLanguage;
        }
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + row.officeName + '</td>';
        bodyHtml += '<td>' + row.departmentName + '</td>';
        bodyHtml += '<td>' + row.subdepartmentName + '</td>';
        bodyHtml += '<td>' + row.positionName + '</td>';
        bodyHtml += '<td>' + row.standardPositionName + '</td>';
        bodyHtml += '<td>' + row.employeeFirstName + '</td>';
        bodyHtml += '<td>' + row.employeeLastName + '</td>';
        bodyHtml += '<td>' + employeeFullNameLocalLanguage + '</td>';
        bodyHtml += '<td>' + (row.employeePositionHistoryItemStart != null ? calendarVisualizer.getHtml(row.employeePositionHistoryItemStart) : '-') + '</td>';
        bodyHtml += '<td>' + (row.employeePositionHistoryItemEnd != null ? calendarVisualizer.getHtml(row.employeePositionHistoryItemEnd) : '-') + '</td>';
        bodyHtml += '<td>' + row.employeeEmail + '</td>';
        bodyHtml += '<td>' + booleanVisualizer.getHtml(row.employeeIsActive) + '</td>';
        bodyHtml += '<td>' + row.employeePositionHistoryItemCareerStatus + '</td>';
        bodyHtml += '<td>' + row.employeePositionHistoryItemTimeStatus + '</td>';
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
}

