/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function LeavesReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "LeavesReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
    }
    this.selected = {
    }
    this.data = {
        "date" : null,
        "isActive" : true
    }
    this.isActiveOptions = [];
    this.isActiveOptions.push({"value" : null, "htmlValue" : '', "htmlView": 'ALL', }); 
    this.isActiveOptions.push({"value" : true, "htmlValue" : 'true', "htmlView": 'Yes', }); 
    this.isActiveOptions.push({"value" : false, "htmlValue" : 'false', "htmlView": 'No', });
    this.reports = {};
}
LeavesReport.prototype.init = function() {
    this.show();
}
LeavesReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
LeavesReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">To</span></td><td><input type="text" id="' + this.htmlId + '_date' + '"></td></tr>';
    html += '<tr><td><span class="label1">Active</span></td><td><select id="' + this.htmlId + '_isActive' + '"></select></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="leavesReportForm" value="">';
    html += '</form>';
    return html;
}
LeavesReport.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
LeavesReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_isActive').bind("change", function(event) {form.isActiveChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
LeavesReport.prototype.dateChangedHandle = function(dateText, inst) {
    this.data.date = getYearMonthDateFromDateString(dateText);
    this.updateDateView();
}
LeavesReport.prototype.dateTextChangedHandle = function(event) {
    if(isDateValid(this.data.date)) {
        this.data.date = getYearMonthDateFromDateString(jQuery.trim(event.currentTarget.value));    
    }
    this.updateDateView();
}
LeavesReport.prototype.isActiveChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_isActive').val();
    if(idTxt == 'true'){
        this.data.isActive = true;
    } else if(idTxt == 'false'){
        this.data.isActive = false;
    } else {
        this.data.isActive = null;
    } 
    this.updateIsActiveView();
}

LeavesReport.prototype.updateView = function() {
    this.updateDateView();
    this.updateIsActiveView();
}
LeavesReport.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(getStringFromYearMonthDate(this.data.date));
}
LeavesReport.prototype.updateIsActiveView = function() {
   var html = "";
    for(var key in this.isActiveOptions) {
        var option = this.isActiveOptions[key];
        var isSelected = "";
        if(option.value == this.data.isActive) {
           isSelected = "selected";
        }
        html += '<option value="'+ option.htmlValue +'" ' + isSelected + '>' + option.htmlView + '</option>';
    }
    $('#' + this.htmlId + '_isActive').html(html);
}
LeavesReport.prototype.validate = function() {
    var errors = [];
    if(this.data.date == null) {
        errors.push("Date is not set");
    }
    return errors;
}
LeavesReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReport();
    }
}
LeavesReport.prototype.generateXLSReport = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}
LeavesReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateReport();
    }
}
LeavesReport.prototype.generateReport = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.leavesReportForm = getJSON(this.data);
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


LeavesReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);

    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Date</td><td>' + calendarVisualizer.getHtml(this.report.formDate) + '</td></tr>';
    headingHtml += '<tr><td>Active</td><td>' + booleanVisualizer.getHtml(this.report.formIsActive) + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);

    var bodyHtml = "";
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="13">Leaves Report</td></tr>';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td>Office</td>';
    bodyHtml += '<td>Department</td>';
    bodyHtml += '<td>Sub department</td>';
    bodyHtml += '<td>Position</td>';
    bodyHtml += '<td>Standard Position</td>';
    bodyHtml += '<td>First Name</td>';
    bodyHtml += '<td>Last Name</td>';
    bodyHtml += '<td>Full Name (Local Language)</td>';
    bodyHtml += '<td>Email</td>';
    bodyHtml += '<td>Active</td>';
    bodyHtml += '<td>Days</td>';
    bodyHtml += '<td>Spent</td>';
    bodyHtml += '<td>Balance</td>';   
    bodyHtml += '</tr>';
    for(var rowKey in this.report.rows) {
        var row = this.report.rows[rowKey];
        var totalDays = 0;
        var totalSpentDays = 0;
        if(row.leavesBalanceCalculatorResult != null) {
            for(var stageKey in row.leavesBalanceCalculatorResult.stages) {
                var stage = row.leavesBalanceCalculatorResult.stages[stageKey];
                totalDays += stage.days;
            }
            for(var spentLeaveItemKey in row.leavesBalanceCalculatorResult.spentLeaveItems) {
                var spentLeaveItem = row.leavesBalanceCalculatorResult.spentLeaveItems[spentLeaveItemKey];
                totalSpentDays += spentLeaveItem.days;
            }
        }
        var balance = totalDays - totalSpentDays;
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
        bodyHtml += '<td>' + row.employeeEmail + '</td>';
        bodyHtml += '<td>' + booleanVisualizer.getHtml(row.employeeIsActive) + '</td>';
        bodyHtml += '<td>' + decimalVisualizer.getHtml(totalDays) + '</td>';
        bodyHtml += '<td>' + decimalVisualizer.getHtml(totalSpentDays) + '</td>';
        bodyHtml += '<td>' + decimalVisualizer.getHtml(balance) + '</td>';
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
}

