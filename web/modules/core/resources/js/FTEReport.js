/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function FTEReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "FTEReport.jsp"
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
FTEReport.prototype.init = function() {
    this.show();
}
FTEReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
FTEReport.prototype.getHtml = function() {
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
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="fteReportForm" value="">';
    html += '</form>';
    return html;
}
FTEReport.prototype.makeDatePickers = function() {
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
FTEReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
FTEReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
FTEReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
FTEReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
FTEReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
FTEReport.prototype.updateView = function() {
    this.updateStartDateView();
    this.updateEndDateView();
}
FTEReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
FTEReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
FTEReport.prototype.validate = function() {
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
FTEReport.prototype.startGeneratingXLS = function() {
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
FTEReport.prototype.generateXLSReport = function() {
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
FTEReport.prototype.startGenerating = function() {
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
FTEReport.prototype.generateReport = function() {
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.fteReportForm = getJSON(serverFormatData);
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

FTEReport.prototype.updateHeadingView = function() {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>From</td><td>' + calendarVisualizer.getHtml(this.report.startDate) + '</td></tr>';
    headingHtml += '<tr><td>To</td><td>' + calendarVisualizer.getHtml(this.report.endDate) + '</td></tr>';
    headingHtml += '<tr><td>Working Days</td><td>' + this.report.employeeFTEReport.workingDaysCount + '</td></tr>';
    headingHtml += '<tr><td>Generated at</td><td>' + yearMonthDateTimeVisualizer.getHtml(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);

}

FTEReport.prototype.updateEmployeeFTEView = function() {
    var bodyHtml = "";
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="13">FTE Report</td></tr>';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td>Office</td>';
    bodyHtml += '<td>Department</td>';
    bodyHtml += '<td>Sub department</td>';
    bodyHtml += '<td>Position</td>';
    bodyHtml += '<td>Standard Position</td>';
    bodyHtml += '<td>First Name</td>';
    bodyHtml += '<td>Last Name</td>';
    bodyHtml += '<td>Contract Type</td>';
    bodyHtml += '<td>Time Spent</td>';
    bodyHtml += '<td>Part Time</td>';
    bodyHtml += '<td>Working days</td>';
    bodyHtml += '<td>Position working days</td>';
    bodyHtml += '<td>FTE</td>';
    bodyHtml += '</tr>';
    for(var rowKey in this.report.employeeFTEReport.rows) {
        var row = this.report.employeeFTEReport.rows[rowKey];
        var fte;
        if('TIME_SPENT' == row.contractType) {
            fte = row.timeSpent / (this.report.employeeFTEReport.workingDaysCount * 8 * 60);
        } else if('PART_TIME' == row.contractType) {
            fte = (row.partTimePercentage / 100) * row.workingDaysCount / this.report.employeeFTEReport.workingDaysCount;
        } else if('FULL_TIME' == row.contractType) {
            fte = row.workingDaysCount / this.report.employeeFTEReport.workingDaysCount;
        }
        
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + row.officeName + '</td>';
        bodyHtml += '<td>' + row.departmentName + '</td>';
        bodyHtml += '<td>' + row.subdepartmentName + '</td>';
        bodyHtml += '<td>' + row.positionName + '</td>';
        bodyHtml += '<td>' + row.standardPositionName + '</td>';
        bodyHtml += '<td>' + row.employeeFirstName + '</td>';
        bodyHtml += '<td>' + row.employeeLastName + '</td>';
        bodyHtml += '<td>' + row.contractType + '</td>';
        if('TIME_SPENT' == row.contractType) {
            bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.timeSpent) + '</td>';
        } else {
            bodyHtml += '<td>-</td>';
        }
        if('PART_TIME' == row.contractType) {
            bodyHtml += '<td>' + row.partTimePercentage + '</td>';
        } else {
            bodyHtml += '<td>-</td>';
        }
        bodyHtml += '<td>' + row.workingDaysCount + '</td>';
        bodyHtml += '<td>' + row.positionWorkingDaysCount + '</td>';
        bodyHtml += '<td>' + getRoundHtml(fte) + '</td>';
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_employeeFTE').html(bodyHtml);
}
FTEReport.prototype.updateStandardPositionFTEView = function() {
    var bodyHtml = "";
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td colspan="' + (3 + this.report.standardPositionFTEReport.standardPositions.length) + '">FTE</td>';
    bodyHtml += '</tr>';    
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td>Office</td>';
    bodyHtml += '<td>Department</td>';
    bodyHtml += '<td>Subdepartment</td>';
    for(var key in this.report.standardPositionFTEReport.standardPositions) {
        var standardPosition = this.report.standardPositionFTEReport.standardPositions[key];
        bodyHtml += '<td>' + standardPosition.name + '</td>';
    }
    bodyHtml += '</tr>';
    for(var key in this.report.standardPositionFTEReport.subdepartments) {
        var subdepartment = this.report.standardPositionFTEReport.subdepartments[key];
        var subInfo = this.report.standardPositionFTEReport.info[subdepartment.subdepartmentId];
        
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + subdepartment.officeName + '</td>';
        bodyHtml += '<td>' + subdepartment.departmentName + '</td>';
        bodyHtml += '<td>' + subdepartment.subdepartmentName + '</td>';
        for(var spKey in this.report.standardPositionFTEReport.standardPositions) {
            var standardPosition = this.report.standardPositionFTEReport.standardPositions[spKey];
            var fte = null;
            if(subInfo != null) {
                fte = subInfo[standardPosition.id];
            }
            bodyHtml += '<td>' + ((fte != null && fte != 0) ? decimalVisualizer.getHtml(fte) : '') + '</td>';
        }
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table">';
    $('#' + this.htmlId + '_standardPositionFTE').html(bodyHtml);
}
FTEReport.prototype.updateOwnTimeFTEView = function() {
    var bodyHtml = "";
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td colspan="' + (3 + this.report.ownTimeFTEReport.standardPositions.length) + '">On-project time spent divided by FTE</td>';
    bodyHtml += '</tr>';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td>Office</td>';
    bodyHtml += '<td>Department</td>';
    bodyHtml += '<td>Subdepartment</td>';
    for(var key in this.report.ownTimeFTEReport.standardPositions) {
        var standardPosition = this.report.ownTimeFTEReport.standardPositions[key];
        bodyHtml += '<td>' + standardPosition.name + '</td>';
    }
    bodyHtml += '</tr>';
    for(var key in this.report.ownTimeFTEReport.subdepartments) {
        var subdepartment = this.report.ownTimeFTEReport.subdepartments[key];
        var subInfo = this.report.ownTimeFTEReport.info[subdepartment.subdepartmentId];
        
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + subdepartment.officeName + '</td>';
        bodyHtml += '<td>' + subdepartment.departmentName + '</td>';
        bodyHtml += '<td>' + subdepartment.subdepartmentName + '</td>';
        for(var spKey in this.report.ownTimeFTEReport.standardPositions) {
            var standardPosition = this.report.ownTimeFTEReport.standardPositions[spKey];
            var strTime = '';
            if(subInfo != null) {
                var cell = subInfo[standardPosition.id];
                if(cell != null) {
                    if(cell.timeSpent == null && cell.fte == null) {
                        strTime = '';
                    } else if(cell.timeSpent == null && cell.fte != null) {
                        strTime = 'No time/' + decimalVisualizer.getHtml(cell.fte);
                    } else if(cell.timeSpent != null && cell.fte == null) {
                        strTime = decimalVisualizer.getHtml(cell.timeSpent / 60) + '/No FTE';
                    } else if(cell.timeSpent != null && cell.fte != null) {
                        strTime = decimalVisualizer.getHtml(cell.timeSpent / (cell.fte * 60));    
                    }
                }
            }
            bodyHtml += '<td>' + strTime + '</td>';
        }
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table">';
    $('#' + this.htmlId + '_ownTimeFTE').html(bodyHtml);
}
FTEReport.prototype.updateReportView = function() {
    var html = '<div id="' + this.htmlId + '_heading"></div>';
    html += '<div id="' + this.htmlId + '_employeeFTE"></div>';
    html += '<div id="' + this.htmlId + '_standardPositionFTE"></div>';
    html += '<div id="' + this.htmlId + '_ownTimeFTE"></div>';
    $('#' + this.htmlId + '_report').html(html);
    
    this.updateHeadingView();
    this.updateEmployeeFTEView();
    this.updateStandardPositionFTEView();
    this.updateOwnTimeFTEView();    
}

