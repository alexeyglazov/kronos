/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProfitabilityReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ProfitabilityReport.jsp",
        jobsManagerEndpointUrl: endpointsFolder + "JobsManager.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = 'Financial Information Report';
    this.loaded = {
        "countries" : [],
        "offices" : [],
        "departments" : [],
        "subdepartments": []
    }
    this.selected = {
        "countryId" : null,
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null
    }
    this.data = {}
    this.reports = {};
    this.timer = null;
}
ProfitabilityReport.prototype.init = function() {
    this.loadInitialContent();
}
ProfitabilityReport.prototype.loadInitialContent = function() {
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
            form.loaded.groups = result.groups;
            form.loaded.clients = result.clients;
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.selected.groupId = null;
            form.selected.clientId = null;
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProfitabilityReport.prototype.loadJobsInfo = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    data.employeeId = currentUser.id;
    data.jobName = "Profitability report";
    $.ajax({
      url: this.config.jobsManagerEndpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.jobResults = result.jobResults;
            form.loaded.runningJobs = result.runningJobs;
            form.updateRunningJobsView();
            form.updateJobResultsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });  
}
ProfitabilityReport.prototype.loadNullGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getNullGroupContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.selected.clientId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProfitabilityReport.prototype.loadGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getGroupContent";
    data.groupId = this.selected.groupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.selected.clientId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProfitabilityReport.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProfitabilityReport.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.selected.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProfitabilityReport.prototype.loadJobResult = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var id = tmp[tmp.length - 1];
    var form = this;
    $('#' + this.htmlId + '_jobResultIdField').val(id);
    $('#' + this.htmlId + '_moduleName').val(this.moduleName);
    $('#' + this.htmlId + '_loadJobResultForm').submit();    
}
ProfitabilityReport.prototype.startDeletingJobResult = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var id = tmp[tmp.length - 1];
    var form = this;
    doConfirm('Confirm', 'Delete this job result?', form, function() {form.deleteJobResult(id);}, null, null);    
}
ProfitabilityReport.prototype.deleteJobResult = function(id) {
    var form = this;
    var data = {};
    data.command = "deleteJobResult";
    data.moduleName = this.moduleName;
    data.jobResultId = id;
    $.ajax({
      url: this.config.jobsManagerEndpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loadJobsInfo();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProfitabilityReport.prototype.show = function() {
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    $('#' + this.htmlId + '_tabs').tabs({
        activate: function( event, ui ) {
            var htmlId = ui.newPanel.selector;
            var tmp = htmlId.split("_");
            form.tabSwitchedHandler.call(form, tmp[tmp.length - 1]);
        }
    });
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
ProfitabilityReport.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_tabs">';
    html += '<ul>';
    html += '<li><a href="#' + this.htmlId + '_tabs-1">Form</a></li>';
    html += '<li><a href="#' + this.htmlId + '_tabs-2">Background reports</a></li>';
    html += '</ul>';
    
    html += '<div id="' + this.htmlId + '_tabs-1">';
    html += '<fieldset>'; 
    html += '<table>';
    html += '<tr><td><span class="label1">Group</span></td><td><span class="label1">Client</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_group' + '"></select></td><td><select id="' + this.htmlId + '_client' + '"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office' + '"></select></td><td><select id="' + this.htmlId + '_department' + '"></select></td><td><select id="' + this.htmlId + '_subdepartment' + '"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td></tr>';
    html += '<tr><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    html += '<tr><td colspan="2">';
    html += '<input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate">';
    html += '<input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS">';
    html += '<input type="button" id="' + this.htmlId + '_generateDividedXLSBtn' + '" value="Generate Divided XLS">';
    html += '</td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="profitabilityReportForm" value="">';
    html += '</form>';
    
    html += '</div>';
    html += '<div id="' + this.htmlId + '_tabs-2">';
   
    html += '<div id="' + this.htmlId + '_runningJobs"></div>';
    html += '<div id="' + this.htmlId + '_jobResults"></div>';
    html += '<form target="_blank" method="post" action="' + this.config.jobsManagerEndpointUrl + '" id="' + this.htmlId + '_loadJobResultForm">';
    html += '<input type="hidden" name="command" value="loadJobResult">';
    html += '<input type="hidden" name="jobResultId" value="" id="' + this.htmlId + '_jobResultIdField">';
    html += '<input type="hidden" name="moduleName" value="" id="' + this.htmlId + '_moduleName">';
    html += '</form>';
    html += '</div>';
    html += '</div>';
    return html;
}
ProfitabilityReport.prototype.makeDatePickers = function() {
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
ProfitabilityReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form)});
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form)});
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
    $('#' + this.htmlId + '_generateDividedXLSBtn').bind("click", function(event) {form.startGeneratingDividedXLS.call(form, event)});
}
ProfitabilityReport.prototype.groupChangedHandle = function(event) {
    
}
ProfitabilityReport.prototype.groupChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_group').val();
    if(idTxt == 'ALL') {
        this.selected.groupId = null;
    } else {
        this.selected.groupId = parseInt(idTxt);
    }
    if(this.selected.groupId == null) {
        this.loadNullGroupContent();
    } else {
        this.loadGroupContent();
    }
}
ProfitabilityReport.prototype.clientChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_client').val();
    if(idTxt == 'ALL') {
        this.selected.clientId = null;
    } else {
        this.selected.clientId = parseInt(idTxt);
    }
}
ProfitabilityReport.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == 'ALL') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    if(this.selected.officeId == null) {
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.selected.departmentId = null;
        this.selected.subdepartmentId = null;
        this.updateView();
    } else {
        this.loadOfficeContent();
    }
}
ProfitabilityReport.prototype.departmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == 'ALL') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(idTxt);
    }
    if(this.selected.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
ProfitabilityReport.prototype.subdepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == 'ALL') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(idTxt);
    }
}
ProfitabilityReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
ProfitabilityReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
ProfitabilityReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
ProfitabilityReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
ProfitabilityReport.prototype.tabSwitchedHandler = function(tabName) {
    if(tabName == "tabs-2") {
        this.loadJobsInfo();
        var form = this;
        this.timer = setInterval(function(){ form.loadJobsInfo()}, 10000 );
    } else {
        clearInterval(this.timer);
    }
}
ProfitabilityReport.prototype.updateView = function() {
    this.updateGroupView();
    this.updateClientView();
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateStartDateView();
    this.updateEndDateView();
}
ProfitabilityReport.prototype.updateGroupView = function() {
    var html = "";
    html += '<option value="ALL">ALL</option>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var isSelected = "";
        if(group.id == this.selected.groupId) {
           isSelected = "selected";
        }
        html += '<option value="'+ group.id +'" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#' + this.htmlId + '_group').html(html);
}
ProfitabilityReport.prototype.updateClientView = function() {
    var html = "";
    html += '<option value="ALL">ALL</option>';
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var isSelected = "";
        if(client.id == this.selected.clientId) {
           isSelected = "selected";
        }
        html += '<option value="'+ client.id +'" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}
ProfitabilityReport.prototype.updateOfficeView = function() {
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
ProfitabilityReport.prototype.updateDepartmentView = function() {
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
ProfitabilityReport.prototype.updateSubdepartmentView = function() {
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
ProfitabilityReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
ProfitabilityReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
ProfitabilityReport.prototype.updateRunningJobsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="4">Running jobs</td></tr>';
    html += '<tr class="dgHeader"><td>Name</td><td>Start</td><td>Part</td></tr>';
    if(this.loaded.runningJobs.length > 0) {
        for(var key in this.loaded.runningJobs) {
            var runningJob = this.loaded.runningJobs[key];
            html += '<tr><td>' + runningJob.name + '</td><td>' + getStringFromYearMonthDateTime(runningJob.startDate) + '</td><td><div style="width: 200px; height: 10px;" id="' + this.htmlId + '_runningJobs_part_' + key + '"></div></td></tr>';
        }
    } else {
        html += '<tr><td colspan="4">No running jobs</td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_runningJobs').html(html);
    if(this.loaded.runningJobs.length > 0) {
        for(var key in this.loaded.runningJobs) {
            var runningJob = this.loaded.runningJobs[key];
            $('#' + this.htmlId + '_runningJobs_part_' + key).progressbar({
                value: runningJob.part < 0.01 ? false : 100 * runningJob.part,
                max: 100
            });
        }
    }
}
ProfitabilityReport.prototype.updateJobResultsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="6">Job results</td></tr>';
    html += '<tr class="dgHeader"><td>Name</td><td>Size</td><td>Start</td><td>End</td><td>Delete</td></tr>';
    if(this.loaded.jobResults.length > 0) {
        for(var key in this.loaded.jobResults) {
            var jobResult = this.loaded.jobResults[key];
            html += '<tr>';
            html += '<td><span class="link" id="' + this.htmlId + '_loadJobResult_' + jobResult.id + '">' + jobResult.name + '</span></td>';
            html += '<td>' + memorySizeVisualizer.getHtml(jobResult.dataSize) + '</td>';
            html += '<td>' + getStringFromYearMonthDateTime(jobResult.startDate) + '</td>';
            html += '<td>' + getStringFromYearMonthDateTime(jobResult.endDate) + '</td>';
            html += '<td><span class="link" id="' + this.htmlId + '_deleteJobResult_' + jobResult.id + '">Delete</span></td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="6">No job results</td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_jobResults').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_loadJobResult_"]').bind('click', function(event) {form.loadJobResult.call(form, event)});
    $('span[id^="' + this.htmlId + '_deleteJobResult_"]').bind('click', function(event) {form.startDeletingJobResult.call(form, event)});
}

ProfitabilityReport.prototype.validate = function(mode) {
    var errors = [];
    var warnings = [];
    var type = 'ON_REQUEST';
    var startDate = null;
    var endDate = null;
    if(mode != "DIVIDED_XLS") {
        if(this.selected.groupId == null && this.selected.clientId == null) {
            errors.push("Group or Client filter is not set");
        }
    } else {
        if(this.selected.groupId == null && this.selected.clientId == null) {
            warnings.push("Group or Client filter is not set. So generation of the report may be too long.");
        }
        warnings.push("Generation will run in the background.");
        type = 'BACKGROUND';
    }
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
     "warnings": warnings,
     "type": type
    };
}
ProfitabilityReport.prototype.startGenerating = function() {
    var mode = "HTML";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generate();
    }
}
ProfitabilityReport.prototype.startGeneratingXLS = function() {
    var mode = "XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generateXLS();
    }
}
ProfitabilityReport.prototype.startGeneratingDividedXLS = function() {
    var mode = "DIVIDED_XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        if(result.warnings.length > 0) {
            if(result.type == 'ON_REQUEST') {
                showWarnings(result.warnings, this, this.generateDividedXLS);
            } else {
                showWarnings(result.warnings, this, this.runBackgroundProcess);
            }
        } else {
            if(result.type == 'ON_REQUEST') {
                this.generateDividedXLS();
            } else {
                this.runBackgroundProcess();
            }
        }
    }
}
ProfitabilityReport.prototype.generateXLS = function() {
    var serverFormatData = {
        "groupId" : this.selected.groupId,
        "clientId" : this.selected.clientId,
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
ProfitabilityReport.prototype.generateDividedXLS = function() {
    var serverFormatData = {
        "groupId" : this.selected.groupId,
        "clientId" : this.selected.clientId,
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateDividedXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
ProfitabilityReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = {
        "groupId" : this.selected.groupId,
        "clientId" : this.selected.clientId,
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.profitabilityReportForm = getJSON(serverFormatData);
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
ProfitabilityReport.prototype.runBackgroundProcess = function() {
    $('#' + this.htmlId + '_report').html("");
    var serverFormatData = {
        "groupId" : this.selected.groupId,
        "clientId" : this.selected.clientId,
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "runBackgroundProcess";
    data.profitabilityReportForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                doAlert('Running', 'Background process was launched', null, null);
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
ProfitabilityReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);

    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Group</td><td>' + this.report.formGroupName + '</td></tr>';
    headingHtml += '<tr><td>Client</td><td>' + this.report.formClientName + '</td></tr>';
    headingHtml += '<tr><td>Office</td><td>' + this.report.formOfficeName + '</td></tr>';
    headingHtml += '<tr><td>Department</td><td>' + this.report.formDepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Subdepartment</td><td>' + this.report.formSubdepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Start</td><td>' + calendarVisualizer.getHtml(this.report.formStartDate) + '</td></tr>';
    headingHtml += '<tr><td>End</td><td>' + calendarVisualizer.getHtml(this.report.formEndDate) + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + this.report.createdAt + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);

    var bodyHtml = '';
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="' + (9 + 4 * this.report.currencies.length)+ '">Profitability Report</td></tr>';
    bodyHtml += '<tr class="dgHeader"><td>Code</td><td>Client</td><td>First Name</td><td>Last Name</td><td>Position</td><td>Standard Position</td><td>Task</td><td>Task Type</td><td>Time Spent</td><td colspan="' + this.report.currencies.length + '">Standard Selling Rate</td><td colspan="' + this.report.currencies.length + '">Standard Cost</td><td colspan="' + this.report.currencies.length + '">Total Selling Rate</td><td colspan="' + this.report.currencies.length + '">Total Standard Cost</td></tr>';
    bodyHtml += '<tr class="dgHeader"><td colspan="9"></td>';
    for(var key in this.report.currencies) {
        var currency = this.report.currencies[key];
        bodyHtml += '<td>' + currency.code + '</td>';
    }
    for(var key in this.report.currencies) {
        var currency = this.report.currencies[key];
        bodyHtml += '<td>' + currency.code + '</td>';
    }
    for(var key in this.report.currencies) {
        var currency = this.report.currencies[key];
        bodyHtml += '<td>' + currency.code + '</td>';
    }
    for(var key in this.report.currencies) {
        var currency = this.report.currencies[key];
        bodyHtml += '<td>' + currency.code + '</td>';
    }
    bodyHtml += '</tr>';
    
    var grandTimeSpent = 0;
    var grandTotalSellings = [];
    var grandTotalCosts = [];
    for(var key in this.report.currencies) {
        var currency = this.report.currencies[key];
        grandTotalSellings[currency.id] = 0;
        grandTotalCosts[currency.id] = 0;
    }       
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        grandTimeSpent += row.timeSpent;
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + row.projectCodeCode + '</td>';
        bodyHtml += '<td>' + row.clientName + '</td>';
        bodyHtml += '<td>' + row.employeeFirstName + '</td>';
        bodyHtml += '<td>' + row.employeeLastName + '</td>';
        bodyHtml += '<td>' + row.positionName + '</td>';
        bodyHtml += '<td>' + row.standardPositionName + '</td>';
        bodyHtml += '<td>' + row.taskName + '</td>';
        bodyHtml += '<td>' + row.taskTypeName + '</td>';
        bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.timeSpent) + '</td>';

        for(var key in this.report.currencies) {
           var currency = this.report.currencies[key];
           if(currency.id == row.standardSellingRateCurrencyId) {
               bodyHtml += '<td>' + row.standardSellingRateAmount + '</td>';
           } else {
               bodyHtml += '<td>-</td>';
           }
        }
        for(var key in this.report.currencies) {
           var currency = this.report.currencies[key];
           if(currency.id == row.standardCostCurrencyId) {
                bodyHtml += '<td>' + row.standardCostAmount + '</td>';
           } else {
               bodyHtml += '<td>-</td>';
           }
        }
        for(var key in this.report.currencies) {
           var currency = this.report.currencies[key];
           if(currency.id == row.standardSellingRateCurrencyId) {
                var totalSelling = row.timeSpent * row.standardSellingRateAmount;
                grandTotalSellings[currency.id] += totalSelling;
                bodyHtml += '<td>' + totalSelling / 60 + '</td>';
           } else {
               bodyHtml += '<td>-</td>';
           }
        }
        for(var key in this.report.currencies) {
           var currency = this.report.currencies[key];
           if(currency.id == row.standardCostCurrencyId) {
                var totalCost = row.timeSpent * row.standardCostAmount;
                grandTotalCosts[currency.id] += totalCost;
                bodyHtml += '<td>' + totalCost / 60 + '</td>';
           } else {
               bodyHtml += '<td>-</td>';
           }
        }
    bodyHtml += '</tr>';
    }
    bodyHtml += '<tr class="dgHighlight">';
    bodyHtml += '<td colspan="8">&nbsp;</td>';
    bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(grandTimeSpent) + '</td>';
    bodyHtml += '<td colspan="' + (2 * this.report.currencies.length) +'"></td>';
    for(var key in this.report.currencies) {
        var currency = this.report.currencies[key];
        bodyHtml += '<td>' + grandTotalSellings[currency.id] / 60 + '</td>';
    }
    for(var key in this.report.currencies) {
        var currency = this.report.currencies[key];
        bodyHtml += '<td>' + grandTotalCosts[currency.id] / 60 + '</td>';
    }
    bodyHtml += '</tr>';

    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
}
