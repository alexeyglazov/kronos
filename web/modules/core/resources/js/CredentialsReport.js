/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CredentialsReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "CredentialsReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "activitySectorGroups" : [],
        "activitySectors": [],
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "activities": [],
        "groups": [],
        "clients": [],
        "countries": []
    }
    this.data = {
        "activitySectorGroup" : null,
        "activitySector" : null,
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null,
        "activityId": null,
        "groupId" : null,
        "clientId": null,
        "countryId": null
    }
    this.report = null;
}
CredentialsReport.prototype.init = function() {
    this.loadInitialContent();
}
CredentialsReport.prototype.loadInitialContent = function() {
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
            form.loaded.activitySectorGroups = result.activitySectorGroups;
            form.loaded.activitySectors = [];
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.activities = [];
            form.loaded.groups = result.groups;
            form.loaded.clients = result.clients;
            form.loaded.countries = result.countries;
            form.data.activitySectorGroup = null;
            form.data.activitySector = null;
            form.data.officeId = null;
            form.data.departmentId = null;
            form.data.subdepartmentId = null;
            form.data.activityId = null;
            form.data.groupId = null;
            form.data.clientId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CredentialsReport.prototype.loadOfficeContent = function() {
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
            form.loaded.subdepartments = [];
            form.loaded.activities = [];
            form.data.departmentId = null;
            form.data.subdepartmentId = null;
            form.data.activityId = null;
            form.updateDepartmentView();
            form.updateSubdepartmentView();
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CredentialsReport.prototype.loadDepartmentContent = function() {
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
            form.loaded.activities = [];
            form.data.subdepartmentId = null;
            form.data.activityId = null;
            form.updateSubdepartmentView();
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CredentialsReport.prototype.loadSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.subdepartmentId = this.data.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.activities = result.activities;
            form.data.activityId = null;
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CredentialsReport.prototype.loadGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getGroupContent";
    data.groupId = this.data.groupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.data.clientId = null;
            form.updateClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CredentialsReport.prototype.loadNullGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getNullGroupContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.data.clientId = null;
            form.updateClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CredentialsReport.prototype.loadActivitySectorGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getActivitySectorGroupContent";
    data.activitySectorGroupId = this.data.activitySectorGroupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.activitySectors = result.activitySectors;
            form.data.activitySectorId = null;
            form.updateActivitySectorView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CredentialsReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
CredentialsReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td><td><span class="label1">Activity</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office"></select></td><td><select id="' + this.htmlId + '_department"></select></td><td><select id="' + this.htmlId + '_subdepartment"></select></td><td><select id="' + this.htmlId + '_activity"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Group</span></td><td><span class="label1">Client</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_group"></select></td><td><select id="' + this.htmlId + '_client"></select></td></tr>';
    html += '</table>';
    html += '<table>';    
    html += '<tr><td><span class="label1">Activity Sector Group</span></td><td><span class="label1">Activity Sector</span></td><td><span class="label1">Country</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_activitySectorGroup"></select></td><td><select id="' + this.htmlId + '_activitySector"></select></td><td><select id="' + this.htmlId + '_country"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateHTMLBtn' + '" value="Show here"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="credentialsReportForm" value="">';
    html += '</form>';
    return html;
}
CredentialsReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_activity').bind("change", function(event) {form.activityChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activitySectorGroup').bind("change", function(event) {form.activitySectorGroupChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activitySector').bind("change", function(event) {form.activitySectorChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_country').bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
    $('#' + this.htmlId + '_generateHTMLBtn').bind("click", function(event) {form.startGeneratingHTML.call(form, event)});
}
CredentialsReport.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == '') {
        this.data.officeId = null;
    } else {
        this.data.officeId = parseInt(idTxt);
    }
    if(this.data.officeId == null) {
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.loaded.activities = [];
        this.data.departmentId = null;
        this.data.subdepartmentId = null;
        this.data.activityId = null;
        this.updateDepartmentView();
        this.updateSubdepartmentView();
        this.updateActivityView();
    } else {
        this.loadOfficeContent();
    }
}
CredentialsReport.prototype.departmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == '') {
        this.data.departmentId = null;
    } else {
        this.data.departmentId = parseInt(idTxt);
    }
    if(this.data.departmentId == null) {
        this.loaded.subdepartments = [];
        this.loaded.activities = [];
        this.data.subdepartmentId = null;
        this.data.activityId = null;
        this.updateSubdepartmentView();
        this.updateActivityView();        
    } else {
        this.loadDepartmentContent();
    }
}
CredentialsReport.prototype.subdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.data.subdepartmentId = null;
    } else {
        this.data.subdepartmentId = parseInt(idTxt);
    }
    if(this.data.subdepartmentId == null) {
        this.loaded.activities = [];
        this.data.activityId = null;
        this.updateActivityView();        
    } else {
        this.loadSubdepartmentContent();
    }
}
CredentialsReport.prototype.activityChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_activity').val();
    if(idTxt == '') {
        this.data.activityId = null;
    } else {
        this.data.activityId = parseInt(idTxt);
    }
}
CredentialsReport.prototype.groupChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_group').val();
    if(idTxt == '') {
        this.data.groupId = null;
    } else {
        this.data.groupId = parseInt(idTxt);
    }
    if(this.data.groupId == null) {
        this.loadNullGroupContent();
    } else {
        this.loadGroupContent();
    }
}
CredentialsReport.prototype.clientChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_client').val();
    if(idTxt == '') {
        this.data.clientId = null;
    } else {
        this.data.clientId = parseInt(idTxt);
    }
}
CredentialsReport.prototype.activitySectorGroupChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_activitySectorGroup').val();
    if(idTxt == '') {
        this.data.activitySectorGroupId = null;
    } else {
        this.data.activitySectorGroupId = parseInt(idTxt);
    }
    if(this.data.activitySectorGroupId == null) {
        this.loaded.activitySectors = [];
        this.data.activitySectorId = null;
        this.updateActivitySectorView();       
    } else {
        this.loadActivitySectorGroupContent();
    }
}
CredentialsReport.prototype.activitySectorChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_activitySector').val();
    if(idTxt == '') {
        this.data.activitySectorId = null;
    } else {
        this.data.activitySectorId = parseInt(idTxt);
    }
}
CredentialsReport.prototype.countryChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_country').val();
    if(idTxt == '') {
        this.data.countryId = null;
    } else {
        this.data.countryId = parseInt(idTxt);
    }
}

CredentialsReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateActivityView();
    this.updateActivitySectorGroupView();
    this.updateActivitySectorView();
    this.updateGroupView();
    this.updateClientView();
    this.updateCountryView();
}
CredentialsReport.prototype.updateOfficeView = function() {
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
CredentialsReport.prototype.updateDepartmentView = function() {
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
CredentialsReport.prototype.updateSubdepartmentView = function() {
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
CredentialsReport.prototype.updateActivityView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.activities) {
        var activity = this.loaded.activities[key];
        var isSelected = "";
        if(activity.id == this.data.activityId) {
           isSelected = "selected";
        }
        html += '<option value="'+ activity.id +'" ' + isSelected + '>' + activity.name + '</option>';
    }
    $('#' + this.htmlId + '_activity').html(html);
}
CredentialsReport.prototype.updateActivitySectorGroupView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.activitySectorGroups) {
        var activitySectorGroup = this.loaded.activitySectorGroups[key];
        var isSelected = "";
        if(activitySectorGroup.id == this.data.activitySectorGroupId) {
           isSelected = "selected";
        }
        html += '<option value="'+ activitySectorGroup.id +'" ' + isSelected + '>' + activitySectorGroup.name + '</option>';
    }
    $('#' + this.htmlId + '_activitySectorGroup').html(html);
}
CredentialsReport.prototype.updateActivitySectorView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.activitySectors) {
        var activitySector = this.loaded.activitySectors[key];
        var isSelected = "";
        if(activitySector.id == this.data.activitySectorId) {
           isSelected = "selected";
        }
        html += '<option value="'+ activitySector.id +'" ' + isSelected + '>' + activitySector.name + '</option>';
    }
    $('#' + this.htmlId + '_activitySector').html(html);
}
CredentialsReport.prototype.updateCountryView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.data.countryId) {
           isSelected = "selected";
        }
        html += '<option value="'+ country.id +'" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_country').html(html);
}

CredentialsReport.prototype.updateGroupView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var isSelected = "";
        if(group.id == this.data.groupId) {
           isSelected = "selected";
        }
        html += '<option value="' + group.id + '" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#' + this.htmlId + '_group').html(html);
}
CredentialsReport.prototype.updateClientView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var isSelected = "";
        if(client.id == this.data.clientId) {
           isSelected = "selected";
        }
        html += '<option value="' + client.id + '" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}
CredentialsReport.prototype.validate = function() {
    var errors = [];
    var warnings = []; 
    if(
            this.data.activitySectorGroupId == null &&
            this.data.activitySectorId == null &&
            this.data.officeId == null &&
            this.data.departmentId == null &&
            this.data.subdepartmentId == null &&
            this.data.activityId == null &&
            this.data.groupId == null &&
            this.data.clientId == null &&
            this.data.countryId == null            
            ) {
        warnings.push("You have not selected anything in the filter. Output can be too big.");
    }
    return {
     "errors": errors,
     "warnings": warnings
    };

}
CredentialsReport.prototype.startGeneratingXLS = function() {
    var result = this.validate();
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else if(result.warnings.length > 0) {
        showWarnings(result.warnings, this, this.generateXLSReports);
    } else {
        this.generateXLSReports();
    }
}
CredentialsReport.prototype.generateXLSReports = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}
CredentialsReport.prototype.startGeneratingHTML = function() {
    var result = this.validate();
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else if(result.warnings.length > 0) {
        showWarnings(result.warnings, this, this.generateHTML);
    } else {
        this.generateHTML();
    }    
}
CredentialsReport.prototype.generateHTML = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.credentialsReportForm = getJSON(this.data);
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

CredentialsReport.prototype.updateReportView = function(status, comment) {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeadingView();
    this.updateBodyView();
}
CredentialsReport.prototype.updateHeadingView = function() {  
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Office</td><td>' + this.report.formOfficeName + '</td></tr>';
    headingHtml += '<tr><td>Department</td><td>' + this.report.formDepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Subdepartment</td><td>' + this.report.formSubdepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Activity</td><td>' + this.report.formActivityName + '</td></tr>';
    headingHtml += '<tr><td>Group</td><td>' + this.report.formGroupName + '</td></tr>';
    headingHtml += '<tr><td>Client</td><td>' + this.report.formClientName + '</td></tr>';
    headingHtml += '<tr><td>Activity Sector Group</td><td>' + this.report.formActivitySectorGroupName + '</td></tr>';
    headingHtml += '<tr><td>Activity Sector</td><td>' + this.report.formActivitySectorName + '</td></tr>';
    headingHtml += '<tr><td>Country</td><td>' + this.report.formCountryName + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);
}
CredentialsReport.prototype.updateBodyView = function() { 
    var bodyHtml = '';
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="11">Credentials Report</td></tr>';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td>Group</td>';
    bodyHtml += '<td>Client</td>';
    bodyHtml += '<td>Activity Sector Group</td>';
    bodyHtml += '<td>Activity Sector</td>';
    bodyHtml += '<td>Office</td>';
    bodyHtml += '<td>Department</td>';
    bodyHtml += '<td>Subdepartment</td>';
    bodyHtml += '<td>Activity</td>';
    bodyHtml += '<td>Code</td>';
    bodyHtml += '<td>Description</td>';
    bodyHtml += '<td>Person in charge</td>';
    bodyHtml += '</tr>';
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var inChargePersonFullName = '';
        if(row.inChargePersonFirstName != null && row.inChargePersonLastName != null) {
            inChargePersonFullName = row.inChargePersonFirstName + ' ' + row.inChargePersonLastName;
        }
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + (row.groupName != null ? row.groupName : '') + '</td>';
        bodyHtml += '<td>' + row.clientName + '</td>';
        bodyHtml += '<td>' + row.activitySectorGroupName + '</td>';
        bodyHtml += '<td>' + row.activitySectorName + '</td>';
        bodyHtml += '<td>' + (row.officeName != null ? row.officeName : '') + '</td>';
        bodyHtml += '<td>' + (row.departmentName != null ? row.departmentName : '') + '</td>';
        bodyHtml += '<td>' + (row.subdepartmentName != null ? row.subdepartmentName : '') + '</td>';
        bodyHtml += '<td>' + (row.activityName != null ? row.activityName : '') + '</td>';
        bodyHtml += '<td>' + (row.projectCodeCode != null ? row.projectCodeCode : '') + '</td>';
        bodyHtml += '<td>' + (row.projectCodeDescription!= null ? row.projectCodeDescription : '') + '</td>';
        bodyHtml += '<td>' + inChargePersonFullName + '</td>';
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
}

