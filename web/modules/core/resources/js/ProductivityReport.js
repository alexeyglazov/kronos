/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProductivityReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ProductivityReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "offices" : [],
        "departments" : [],
        "subdepartments": []
    }
    this.selected = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null        
    }
    this.data = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null,
        "startDate" : null,
        "endDate" : null        
    }
    this.reports = {};
}
ProductivityReport.prototype.init = function() {
    this.loadInitialContent();
}
ProductivityReport.prototype.loadInitialContent = function() {
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
            form.loaded.offices = result.offices;
            form.data.officeId = null;
            form.selected.officeId = form.data.officeId;
            form.data.departmentId = null;
            form.selected.departmentId = form.data.departmentId;
            form.data.subdepartmentId = null;
            form.selected.subdepartmentId = form.data.subdepartmentId;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProductivityReport.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.data.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.data.departmentId = null;
            form.selected.departmentId = form.data.departmentId;
            form.data.subdepartmentId = null;
            form.selected.subdepartmentId = form.data.subdepartmentId;            
            form.updateDepartmentView();
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProductivityReport.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.data.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.data.subdepartmentId = null;
            form.selected.subdepartmentId = form.data.subdepartmentId;                
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProductivityReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
ProductivityReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office' + '"></select></td><td><select id="' + this.htmlId + '_department' + '"></select></td><td><select id="' + this.htmlId + '_subdepartment' + '"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td></tr>';
    html += '<tr><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"> <input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="productivityReportForm" value="">';
    html += '</form>';
    return html;
}
ProductivityReport.prototype.makeDatePickers = function() {
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
ProductivityReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
ProductivityReport.prototype.officeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == '') {
        this.data.officeId = null;
    } else {
        this.data.officeId = parseInt(idTxt);
    }
    if(this.data.officeId == null) {
        this.data.departmentId = null;
        this.data.subdepartmentId = null;
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.updateDepartmentView();
        this.updateSubdepartmentView();
    } else {
        this.loadOfficeContent();
    }
}
ProductivityReport.prototype.departmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == '') {
        this.data.departmentId = null;
    } else {
        this.data.departmentId = parseInt(idTxt);
    }
    if(this.data.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
ProductivityReport.prototype.subdepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.data.subdepartmentId = null;
    } else {
        this.data.subdepartmentId = parseInt(idTxt);
    }
    if(this.data.subdepartmentId == null) {
        //this.loadDepartmentContent();
    } else {
        //this.loadSubdepartmentContent();
    }
}
ProductivityReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
ProductivityReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
ProductivityReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
ProductivityReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
ProductivityReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();    
    this.updateStartDateView();
    this.updateEndDateView();
}
ProductivityReport.prototype.updateOfficeView = function() {
   var html = "";
   html += '<option value="">ALL</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
ProductivityReport.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="">ALL</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
ProductivityReport.prototype.updateSubdepartmentView = function() {
    var html = "";
    html += '<option value="">ALL</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.id +'" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
ProductivityReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
ProductivityReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
ProductivityReport.prototype.validate = function(mode) {
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
ProductivityReport.prototype.startGenerating = function() {
    var mode = "HTML";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generate();
    }
}
ProductivityReport.prototype.startGeneratingXLS = function() {
    var mode = "XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generateXLS();
    }
}
ProductivityReport.prototype.generateXLS = function() {
    var serverFormatData = {
        "officeId" : this.data.officeId,
        "departmentId" : this.data.departmentId,
        "subdepartmentId" : this.data.subdepartmentId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
ProductivityReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = {
        "officeId" : this.data.officeId,
        "departmentId" : this.data.departmentId,
        "subdepartmentId" : this.data.subdepartmentId,        
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.productivityReportForm = getJSON(serverFormatData);
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
ProductivityReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeaderView();
    this.updateBodyView();

}
ProductivityReport.prototype.updateHeaderView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr><td>Office</td><td>' + this.report.formOfficeName + '</td></tr>';
    html += '<tr><td>Department</td><td>' + this.report.formDepartmentName + '</td></tr>';
    html += '<tr><td>Subdepartment</td><td>' + this.report.formSubdepartmentName + '</td></tr>';    
    html += '<tr><td>Start</td><td>' + calendarVisualizer.getHtml(this.report.formStartDate) + '</td></tr>';
    html += '<tr><td>End</td><td>' + calendarVisualizer.getHtml(this.report.formEndDate) + '</td></tr>';
    html += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    html += '</table>';    
    $('#' + this.htmlId + '_heading').html(html);    
}
ProductivityReport.prototype.updateBodyView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="9">Productivity Report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Group</td>';
    html += '<td>Client</td>';
    html += '<td>Project Code</td>';
    html += '<td>Code created</td>';
    html += '<td>Code closed</td>';
    html += '<td>Fees (budget)</td>';
    html += '<td>Currency</td>';
    html += '<td>Timespent</td>';
    html += '<td>Closed</td>';
    html += '</tr>';
    var totalTimeSpent = 0;
      
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if(row.timeSpent != null) {
            totalTimeSpent += row.timeSpent;
        }
        html += '<tr>';
        html += '<td>' + (row.groupName != null ? row.groupName : 'NO GROUP') + '</td>';
        html += '<td>' + row.clientName + '</td>';
        html += '<td>' + row.projectCodeCode + '</td>';
        html += '<td>' + getStringFromYearMonthDate(row.projectCodeCreatedAt) + '</td>';
        html += '<td>' + getStringFromYearMonthDate(row.projectCodeClosedAt) + '</td>';
        html += '<td>' + ((row.feesValue != null) ? thousandSeparatorVisualizer.getHtml(row.feesValue) : '') + '</td>';
        html += '<td>' + ((row.feesCurrencyCode != null) ? row.feesCurrencyCode : '') + '</td>';
        html += '<td>' + ((row.timeSpent != null) ? minutesAsHoursVisualizer.getHtml(row.timeSpent) : '') + '</td>';
        html += '<td>' + booleanVisualizer.getHtml(row.projectCodeIsClosed) + '</td>';
        html += '</tr>';
    }
    html += '<tr class="dgHighlight">';
    html += '<td colspan="7">&nbsp;</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(totalTimeSpent) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '</tr>';
    html += '</table>';    
    $('#' + this.htmlId + '_body').html(html);
}