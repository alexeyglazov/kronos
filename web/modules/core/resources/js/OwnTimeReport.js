/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function OwnTimeReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "OwnTimeReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.views = {
        "TIME" : "Time",
        "PERCENT" : "Percent"
    }
    this.loaded = {
        "offices" : [],
        "departments" : [],
        "subdepartments": [],
        "internalTasks" :[]
    }
    this.selected = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null,
        "view": null
    }
    this.data = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null,
        "startDate" : null,
        "endDate" : null,
        "view": null
    }
    this.report = null;
}
OwnTimeReport.prototype.init = function() {
    this.loadInitialContent();
}
OwnTimeReport.prototype.loadInitialContent = function() {
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
            form.loaded.internalTasks = result.internalTasks;
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
OwnTimeReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
OwnTimeReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office' + '"></select></td><td><select id="' + this.htmlId + '_department' + '"></select></td><td><select id="' + this.htmlId + '_subdepartment' + '"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td></tr>';
    html += '<tr><td><span class="label1">To</span></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    html += '<tr><td><span class="label1">View</span></td><td><select id="' + this.htmlId + '_view' + '"></select></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="ownTimeReportForm" value="">';
    html += '</form>';
    return html;
}
OwnTimeReport.prototype.makeDatePickers = function() {
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
OwnTimeReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_view').bind("change", function(event) {form.viewChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
OwnTimeReport.prototype.officeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == 'ALL') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    this.data.officeId = this.selected.officeId;
    if(this.data.officeId == null) {
        this.loaded.offices = [];
        this.data.departmentId = null;
        this.data.subdepartmentId = null;
        this.selected.departmentId = this.data.departmentId;
        this.selected.subdepartmentId = this.data.subdepartmentId;
        this.updateDepartmentView();
        this.updateSubdepartmentView();
    } else {
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
                form.selected.departmentId = form.data.departmentId;
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
}
OwnTimeReport.prototype.departmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == 'ALL') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(idTxt);
    }
    this.data.departmentId = this.selected.departmentId;
    if(this.data.departmentId == null) {
        this.loaded.subdepartments = [];
        this.data.subdepartmentId = null;
        this.selected.subdepartmentId = this.data.subdepartmentId;
        this.updateSubdepartmentView();
    } else {
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
                form.selected.subdepartmentId = form.data.subdepartmentId;
                form.updateSubdepartmentView();
            })
          },
          error: function(jqXHR, textStatus, errorThrown) {
              ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
          }
      });
    }
}
OwnTimeReport.prototype.subdepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == 'ALL') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(idTxt);
    }
    this.data.subdepartmentId = this.selected.subdepartmentId;
}
OwnTimeReport.prototype.viewChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_view').val();
    if(idTxt == '') {
        this.selected.view = null;
    } else {
        this.selected.view = idTxt;
    }
    this.data.view = this.selected.view;
}
OwnTimeReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
OwnTimeReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
OwnTimeReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
OwnTimeReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
OwnTimeReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateViewView();
    this.updateStartDateView();
    this.updateEndDateView();
}
OwnTimeReport.prototype.updateOfficeView = function() {
   var html = "";
   html += '<option value="ALL">ALL</option>';
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
OwnTimeReport.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="ALL">ALL</option>';
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
OwnTimeReport.prototype.updateSubdepartmentView = function() {
    var html = "";
    html += '<option value="ALL">ALL</option>';
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
OwnTimeReport.prototype.updateViewView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.views) {
        var view = this.views[key];
        var isSelected = "";
        if(key == this.selected.view) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + view + '</option>';
    }
    $('#' + this.htmlId + '_view').html(html);
}
OwnTimeReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
OwnTimeReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
OwnTimeReport.prototype.validate = function() {
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
    if(this.data.view == null || this.data.view == "") {
        errors.push("View is not set");
    }
    return errors;
}
OwnTimeReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReports();
    }
}
OwnTimeReport.prototype.generateXLSReports = function() {
    var serverFormatData = {
        "officeId" : this.data.officeId,
        "departmentId" : this.data.departmentId,
        "subdepartmentId" : this.data.subdepartmentId,
        "view": this.data.view,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReports');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
OwnTimeReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateReports();
    }
}
OwnTimeReport.prototype.generateReports = function() {
    var serverFormatData = {
        "officeId" : this.data.officeId,
        "departmentId" : this.data.departmentId,
        "subdepartmentId" : this.data.subdepartmentId,
        "view": this.data.view,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReports";
    data.ownTimeReportForm = getJSON(serverFormatData);
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
OwnTimeReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeadingView();
    this.updateSubreportsView();
}
OwnTimeReport.prototype.updateHeadingView = function() {  
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Office</td><td>' + this.report.formOfficeName + '</td></tr>';
    headingHtml += '<tr><td>Department</td><td>' + this.report.formDepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Subdepartment</td><td>' + this.report.formSubdepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Start</td><td>' + calendarVisualizer.getHtml(this.report.formStartDate) + '</td></tr>';
    headingHtml += '<tr><td>End</td><td>' + calendarVisualizer.getHtml(this.report.formEndDate) + '</td></tr>';
    headingHtml += '<tr><td>Generated at</td><td>' + yearMonthDateTimeVisualizer.getHtml(this.report.createdAt) + '</td></tr>';
    headingHtml += '<tr><td>View</td><td>' + this.report.view + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);
}
OwnTimeReport.prototype.updateSubreportsView = function() {
    var html = '';
    for(var key in this.report.subreports) {
        html += '<div id="' + this.htmlId + '_subreport_' + key + '"></div>';
    } 
    $('#' + this.htmlId + '_body').html(html);
    var fullSubreport = null;
    if('PERCENT' == this.report.view) {
        for(var key in this.report.subreports) {
            var subreport = this.report.subreports[key];
            if(subreport.isInternal == null && subreport.task == null && subreport.isIdle == null) {
                fullSubreport = subreport;
                break
            }
        }
    }
    for(var key in this.report.subreports) {
        var subreport = this.report.subreports[key];
        if('TIME' == this.report.view) {
            this.updateSubreportTimeView(this.htmlId + '_subreport_' + key, subreport, this.report.standardPositions, this.report.subdepartments);
        } else {
            this.updateSubreportPercentView(this.htmlId + '_subreport_' + key, subreport, this.report.standardPositions, this.report.subdepartments, fullSubreport);            
        }
    }
}

OwnTimeReport.prototype.updateSubreportTimeView = function(containerHtmlId, subreport, standardPositions, subdepartments) {
    var taskTypeName;
    var taskName;
    if(subreport.isInternal == null) {
        taskTypeName = 'All';
    } else if(subreport.isInternal == false) {
        taskTypeName = 'Project';
    } else if(subreport.isInternal == true) {
        taskTypeName = 'Internal';
    }
    if(subreport.task == null) {
        taskName = 'All';
    } else {
        taskName = subreport.task.name;
    }
    var html = "";
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="' + (standardPositions.length + 4) + '">' + taskTypeName + ' / ' + taskName + '</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Office</td><td>Department</td><td>Sub department</td>';
    for(var standardPositionKey in standardPositions) {
        var standardPosition = standardPositions[standardPositionKey];
        html += '<td>' + standardPosition.name + '</td>';
    }
    html += '<td>&Sigma;</td>';
    html += '</tr>';
    for(var key in subdepartments) {
        var subdepartment = subdepartments[key];
        var subInfo = subreport.info[subdepartment.subdepartmentId];

        html += '<tr>';
        html += '<td>' + subdepartment.officeName + '</td>';
        html += '<td>' + subdepartment.departmentName + '</td>';
        html += '<td>' + subdepartment.subdepartmentName + '</td>';
        for(var standardPositionKey in standardPositions) {
            var standardPosition = standardPositions[standardPositionKey];
            var timeTmp = null;
            if(subInfo != null) {
                timeTmp = subInfo[standardPosition.id];
            }
            if(timeTmp == null) {
                html += '<td>&nbsp;</td>';
            } else {
                html += '<td>' + minutesAsHoursVisualizer.getHtml(timeTmp) + '</td>';
            }
        }
        html += '<td class="dgHighlight">' + minutesAsHoursVisualizer.getHtml(this.getTotalForSubdepartment(subreport, subdepartment.subdepartmentId)) + '</td>';
        html += '</tr>';
    }
    html += '<tr class="dgHighlight">';
    html += '<td colspan="3" style="text-align: center;">&Sigma;</td>';
    for(var standardPositionKey in standardPositions) {
        var standardPosition = standardPositions[standardPositionKey];
        html += '<td>' + minutesAsHoursVisualizer.getHtml(this.getTotalForStandardPosition(subreport, standardPosition.id)) + '</td>';
    }
    html += '<td>' + minutesAsHoursVisualizer.getHtml(this.getTotal(subreport)) + '</td>';
    html += '</tr>';
    html += '</table>';
    $('#' + containerHtmlId).html(html);
}

OwnTimeReport.prototype.updateSubreportPercentView = function(containerHtmlId, subreport, standardPositions, subdepartments, fullSubreport) {
    var taskTypeName;
    var taskName;
    if(subreport.isInternal == null) {
        taskTypeName = 'All';
    } else if(subreport.isInternal == false) {
        taskTypeName = 'Project';
    } else if(subreport.isInternal == true) {
        taskTypeName = 'Internal';
    }
    if(subreport.task == null) {
        taskName = 'All';
    } else {
        taskName = subreport.task.name;
    }
    var html = "";
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="' + (standardPositions.length + 4) + '">' + taskTypeName + ' / ' + taskName + '</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Office</td><td>Department</td><td>Sub department</td>';
    for(var standardPositionKey in standardPositions) {
        var standardPosition = standardPositions[standardPositionKey];
        html += '<td>' + standardPosition.name + '</td>';
    }
    html += '<td>&Sigma;</td>';
    html += '</tr>';
    for(var key in subdepartments) {
        var subdepartment = subdepartments[key];
        var subInfo = subreport.info[subdepartment.subdepartmentId];
        html += '<tr>';
        html += '<td>' + subdepartment.officeName + '</td>';
        html += '<td>' + subdepartment.departmentName + '</td>';
        html += '<td>' + subdepartment.subdepartmentName + '</td>';
        for(var standardPositionKey in standardPositions) {
            var standardPosition = standardPositions[standardPositionKey];
            var timeTmp = null;
            if(subInfo != null) {
                timeTmp = subInfo[standardPosition.id];
            }
            if(timeTmp == null) {
                html += '<td>&nbsp;</td>';
            } else {
                html += '<td>' + getPercentHtml(timeTmp/this.getTime(fullSubreport, subdepartment.subdepartmentId, standardPosition.id)) + '</td>';
            }
        }
        html += '<td class="dgHighlight">' + getPercentHtml(this.getTotalForSubdepartment(subreport, subdepartment.subdepartmentId)/this.getTotalForSubdepartment(fullSubreport, subdepartment.subdepartmentId)) + '</td>';
        html += '</tr>';
    }
    html += '<tr class="dgHighlight">';
    html += '<td colspan="3" style="text-align: center;">&Sigma;</td>';
    for(var standardPositionKey in standardPositions) {
        var standardPosition = standardPositions[standardPositionKey];
        html += '<td>' + getPercentHtml(this.getTotalForStandardPosition(subreport, standardPosition.id)/this.getTotalForStandardPosition(fullSubreport, standardPosition.id)) + '</td>';
    }
    html += '<td>' + getPercentHtml(this.getTotal(subreport)/this.getTotal(fullSubreport)) + '</td>';
    html += '</tr>';
    html += '</table>';
    $('#' + containerHtmlId).html(html);
}


OwnTimeReport.prototype.getTime = function(subreport, subdepartmentId, standardPositionId) {
    if(subreport.info[subdepartmentId] != null) {
        return subreport.info[subdepartmentId][standardPositionId];
    }
    return null;
}
OwnTimeReport.prototype.getTotalForSubdepartment = function(subreport, subdepartmentId) {
    var total = 0;
    var subInfo = subreport.info[subdepartmentId];
    if(subInfo != null) {
        for(var standardPositionId in subInfo) {
            total += subInfo[standardPositionId];
        }
    }
    return total;
}
OwnTimeReport.prototype.getTotalForStandardPosition = function(subreport, standardPositionId) {
    var total = 0;
    for(var subdepartmentId in subreport.info) {
        var subInfo = subreport.info[subdepartmentId];
        if(subInfo[standardPositionId] != null) {
            total += subInfo[standardPositionId];
        }
    }
    return total;
}
OwnTimeReport.prototype.getTotal = function(subreport) {
    var total = 0;
    for(var subdepartmentId in subreport.info) {
        var subInfo = subreport.info[subdepartmentId];
        for(var standardPositionId in subInfo) {
            total += subInfo[standardPositionId];
        }
    }
    return total;
}