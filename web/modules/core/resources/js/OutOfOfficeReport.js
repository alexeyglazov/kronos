/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function OutOfOfficeReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "OutOfOfficeReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "offices" : [],
        "departments" : [],
        "subdepartments": []
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
OutOfOfficeReport.prototype.init = function() {
    this.loadInitialContent();
}
OutOfOfficeReport.prototype.loadInitialContent = function() {
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
            form.data.departmentId = null;
            form.data.subdepartmentId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfOfficeReport.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.data.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = result.subdepartments;
            form.data.departmentId = null;
            form.data.subdepartmentId = null;
            form.updateDepartmentView();
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
OutOfOfficeReport.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.data.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.data.subdepartmentId = null;
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
OutOfOfficeReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
OutOfOfficeReport.prototype.getHtml = function() {
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
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="outOfOfficeReportForm" value="">';
    html += '</form>';
    return html;
}
OutOfOfficeReport.prototype.makeDatePickers = function() {
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
OutOfOfficeReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
OutOfOfficeReport.prototype.officeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == '') {
        this.data.officeId = null;
    } else {
        this.data.officeId = parseInt(idTxt);
    }
    if(this.data.officeId == null) {
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.data.departmentId = null;
        this.data.subdepartmentId = null;
        this.updateDepartmentView();
        this.updateSubdepartmentView();
    } else {
        this.loadOfficeContent();
    }
}
OutOfOfficeReport.prototype.departmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == '') {
        this.data.departmentId = null;
    } else {
        this.data.departmentId = parseInt(idTxt);
    }
    if(this.data.departmentId == null) {
        this.loaded.subdepartments = [];
        this.data.subdepartmentId = null;
        this.updateSubdepartmentView();
    } else {
        this.loadDepartmentContent();
    }
}
OutOfOfficeReport.prototype.subdepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.data.subdepartmentId = null;
    } else {
        this.data.subdepartmentId = parseInt(idTxt);
    }
}
OutOfOfficeReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.processStartDateChanged(dateText);
}
OutOfOfficeReport.prototype.startDateTextChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    this.processStartDateChanged(dateText);
}
OutOfOfficeReport.prototype.processStartDateChanged = function(dateText) {
    if(dateText == null || jQuery.trim(dateText) == '') {
        this.data.startDate = null;
    } else {
        if(isDateValid(dateText)) {
            this.data.startDate = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
        }
    }
    this.updateStartDateView();
}
OutOfOfficeReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.processEndDateChanged(dateText);
}
OutOfOfficeReport.prototype.endDateTextChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    this.processEndDateChanged(dateText);
}
OutOfOfficeReport.prototype.processEndDateChanged = function(dateText) {
    if(dateText == null || jQuery.trim(dateText) == '') {
        this.data.endDate = null;
    } else {
        if(isDateValid(dateText)) {
            this.data.endDate = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
        }
    }
    this.updateEndDateView();
}
OutOfOfficeReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateStartDateView();
    this.updateEndDateView();
}
OutOfOfficeReport.prototype.updateOfficeView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.data.officeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
OutOfOfficeReport.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.data.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
OutOfOfficeReport.prototype.updateSubdepartmentView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.data.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.id +'" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
OutOfOfficeReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.data.startDate));
}
OutOfOfficeReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.data.endDate));
}
OutOfOfficeReport.prototype.validate = function(mode) {
    var errors = [];
    var warnings = [];
    if(this.data.startDate == null) {
        errors.push("Start date is not set");
    }
    if(this.data.endDate == null) {
        errors.push("End date is not set");
    }
    if(this.data.startDate != null && this.data.endDate != null && compareYearMonthDate(this.data.startDate, this.data.endDate) > 0) {
        errors.push("Start date is greater than end date");
    }
    return {
     "errors": errors,
     "warnings": warnings
    };
}
OutOfOfficeReport.prototype.startGenerating = function() {
    var mode = "HTML";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generate();
    }
}
OutOfOfficeReport.prototype.startGeneratingXLS = function() {
    var mode = "XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generateXLS();
    }
}
OutOfOfficeReport.prototype.generateXLS = function() {
    var serverFormatData = this.data;
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
OutOfOfficeReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = this.data;
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.outOfOfficeReportForm = getJSON(serverFormatData);
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
OutOfOfficeReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeaderView();
    this.updateBodyView();

}
OutOfOfficeReport.prototype.updateHeaderView = function() {
    var html = '';
    html += '<table class="datagrid">';  
    html += '<tr><td>Office</td><td>' + (this.report.formOffice != null ? this.report.formOffice.name : '') + '</td></tr>';
    html += '<tr><td>Department</td><td>' + (this.report.formDepartment != null ? this.report.formDepartment.name : '') + '</td></tr>';
    html += '<tr><td>Subdepartment</td><td>' + (this.report.formSubdepartment != null ? this.report.formSubdepartment.name : '') + '</td></tr>';
    html += '<tr><td>Start</td><td>' + calendarVisualizer.getHtml(this.report.formStartDate) + '</td></tr>';
    html += '<tr><td>End</td><td>' + calendarVisualizer.getHtml(this.report.formEndDate) + '</td></tr>';
    html += '<tr><td>Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    html += '</table>';    
    $('#' + this.htmlId + '_heading').html(html);    
}
OutOfOfficeReport.prototype.updateBodyView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="6">Out of office report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>First Name</td>';
    html += '<td>Last Name</td>';
    html += '<td>Task</td>';
    html += '<td>Business trip project</td>';
    html += '<td>Start date</td>';
    html += '<td>End date</td>';
    html += '</tr>';
      
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var task = null;
        var projectCode = null;
        var employee = null;
        if(row.taskId != null) {
            for(var key in this.report.tasks) {
                var tmpTask = this.report.tasks[key];
                if(tmpTask.id == row.taskId) {
                    task = tmpTask;
                    break;
                }
            }
        } else {
            for(var key in this.report.projectCodes) {
                var tmpProjectCode = this.report.projectCodes[key];
                if(tmpProjectCode.id == row.projectCodeId) {
                    projectCode = tmpProjectCode;
                    break;
                }
            }            
        }
        for(var key in this.report.employees) {
            var tmpEmployee = this.report.employees[key];
            if(tmpEmployee.id == row.employeeId) {
                employee = tmpEmployee;
                break;
            }
        }
        html += '<tr>';
        html += '<td>' + employee.firstName + '</td>';
        html += '<td>' + employee.lastName + '</td>';
        html += '<td>' + (task != null ? task.name : '') + '</td>';
        html += '<td>' + (projectCode != null ? projectCode.code : '') + '</td>';
        html += '<td>' + getStringFromYearMonthDate(row.startDate) + '</td>';
        html += '<td>' + getStringFromYearMonthDate(row.endDate) + '</td>';
        html += '</tr>';
    }
    html += '</table>';    
    $('#' + this.htmlId + '_body').html(html);
}