/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ContactsReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ContactsReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "activities": []
    }
    this.enums = {
        "normalPositions" : {
            "CEO": "CEO (Chief Executive Officer)",
            "CFO": "CFO (Chief Financial Officer)",
            "HR": "HR",
            "CIO": "CIO (IT)",
            "TAX_MANAGER": "Tax manager",
            "CA": "CA (Chief Accountant)",
            "OTHER": "Other"
        }
    }    
    this.data = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null,
        "activityId": null,
        "normalPosition" : null
    }
    this.report = null;
}
ContactsReport.prototype.init = function() {
    this.loadInitialContent();
}
ContactsReport.prototype.loadInitialContent = function() {
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
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.activities = [];
            form.data.officeId = null;
            form.data.departmentId = null;
            form.data.subdepartmentId = null;
            form.data.activityId = null;
            form.data.normalPosition = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactsReport.prototype.loadOfficeContent = function() {
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
ContactsReport.prototype.loadDepartmentContent = function() {
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
ContactsReport.prototype.loadSubdepartmentContent = function() {
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
ContactsReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
ContactsReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td><td><span class="label1">Activity</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office"></select></td><td><select id="' + this.htmlId + '_department"></select></td><td><select id="' + this.htmlId + '_subdepartment"></select></td><td><select id="' + this.htmlId + '_activity"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Normal position</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_normalPosition"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateHTMLBtn' + '" value="Show here"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="contactsReportForm" value="">';
    html += '</form>';
    return html;
}
ContactsReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_activity').bind("change", function(event) {form.activityChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_normalPosition').bind("change", function(event) {form.normalPositionChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
    $('#' + this.htmlId + '_generateHTMLBtn').bind("click", function(event) {form.startGeneratingHTML.call(form, event)});
}
ContactsReport.prototype.officeChangedHandle = function(event) {
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
ContactsReport.prototype.departmentChangedHandle = function(event) {
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
ContactsReport.prototype.subdepartmentChangedHandle = function(event) {
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
ContactsReport.prototype.activityChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_activity').val();
    if(idTxt == '') {
        this.data.activityId = null;
    } else {
        this.data.activityId = parseInt(idTxt);
    }
}
ContactsReport.prototype.normalPositionChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_normalPosition').val();
    if(idTxt == '') {
        this.data.normalPosition = null;
    } else {
        this.data.normalPosition = idTxt;
    }
}
ContactsReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateActivityView();
    this.updateNormalPositionView();
}
ContactsReport.prototype.updateOfficeView = function() {
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
ContactsReport.prototype.updateDepartmentView = function() {
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
ContactsReport.prototype.updateSubdepartmentView = function() {
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
ContactsReport.prototype.updateActivityView = function() {
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
ContactsReport.prototype.updateNormalPositionView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.enums.normalPositions) {
        var normalPosition = this.enums.normalPositions[key];
        var isSelected = "";
        if(key == this.data.normalPosition) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + normalPosition + '</option>';
    }
    $('#' + this.htmlId + '_normalPosition').html(html);
}
ContactsReport.prototype.validate = function() {
    var errors = [];
    var warnings = []; 
    if(
            this.data.officeId == null &&
            this.data.departmentId == null &&
            this.data.subdepartmentId == null &&
            this.data.activityId == null &&
            this.data.normalPosition == null       
            ) {
        warnings.push("You have not selected anything in the filter. Output can be too big.");
    }
    return {
     "errors": errors,
     "warnings": warnings
    };

}
ContactsReport.prototype.startGeneratingXLS = function() {
    var result = this.validate();
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else if(result.warnings.length > 0) {
        showWarnings(result.warnings, this, this.generateXLSReports);
    } else {
        this.generateXLSReports();
    }
}
ContactsReport.prototype.generateXLSReports = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}
ContactsReport.prototype.startGeneratingHTML = function() {
    var result = this.validate();
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else if(result.warnings.length > 0) {
        showWarnings(result.warnings, this, this.generateHTML);
    } else {
        this.generateHTML();
    }    
}
ContactsReport.prototype.generateHTML = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.contactsReportForm = getJSON(this.data);
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

ContactsReport.prototype.updateReportView = function(status, comment) {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeadingView();
    this.updateBodyView();
}
ContactsReport.prototype.updateHeadingView = function() {  
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Office</td><td>' + this.report.formOfficeName + '</td></tr>';
    headingHtml += '<tr><td>Department</td><td>' + this.report.formDepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Subdepartment</td><td>' + this.report.formSubdepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Activity</td><td>' + this.report.formActivityName + '</td></tr>';
    headingHtml += '<tr><td>Normal position</td><td>' + this.report.formNormalPosition + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);
}
ContactsReport.prototype.updateBodyView = function() { 
    var bodyHtml = '';
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="26">Contacts Report</td></tr>';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td>Group</td>';
    bodyHtml += '<td>Client</td>';
    bodyHtml += '<td>Leading subdepartments</td>';
    bodyHtml += '<td>Gender</td>';
    bodyHtml += '<td>Full name</td>';
    bodyHtml += '<td>Full name (local)</td>';
    bodyHtml += '<td>Direct phone</td>';
    bodyHtml += '<td>Mobile phone</td>';
    bodyHtml += '<td>Email</td>';
    bodyHtml += '<td>Client\'s postal address</td>';
    bodyHtml += '<td>Postal address, street</td>';
    bodyHtml += '<td>Postal address, ZIP code</td>';
    bodyHtml += '<td>Postal address, city</td>';
    bodyHtml += '<td>Postal address, country</td>';
    
    bodyHtml += '<td>Residential country</td>';
    bodyHtml += '<td>Personal contacts</td>';
    bodyHtml += '<td>Language</td>';
    bodyHtml += '<td>Classified position</td>';
    bodyHtml += '<td>Other classified position</td>';
    bodyHtml += '<td>Present type</td>';
    bodyHtml += '<td>Newsletters</td>';
    bodyHtml += '<td>Reminder</td>';
    bodyHtml += '<td>Active</td>';
    bodyHtml += '<td>Comment</td>';    
    bodyHtml += '</tr>';
    for(var key in this.report.rows) {
        var row = this.report.rows[key];

        var count1 = 0;
        var subdepartmentText = '';
        for(var key2 in row.subdepartmentIds) {
            var subdepartment = this.getSubdepartment(row.subdepartmentIds[key2]);
            subdepartmentText += subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName;
            if(count1 < row.subdepartmentIds.length - 1) {
                subdepartmentText += '; ';
            }
            count1++;                
        }
 
        var count2 = 0;
        var responsiblePersonsText = '';
        for(var key2 in row.contactResponsiblePersonIds) {
            var responsiblePerson = this.getResponsiblePerson(row.contactResponsiblePersonIds[key2]);
            responsiblePersonsText += responsiblePerson.firstName + ' ' + responsiblePerson.lastName;
            if(count2 < row.contactResponsiblePersonIds.length - 1) {
                responsiblePersonsText += '; ';
            }
            count2++;
        }
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + (row.groupName != null ? row.groupName : '') + '</td>';
        bodyHtml += '<td>' + row.clientName + '</td>';
        bodyHtml += '<td>' + subdepartmentText + '</td>';
        bodyHtml += '<td>' + row.contactGender + '</td>';
        bodyHtml += '<td>' + (row.contactFirstName + ' ' + row.contactLastName) + '</td>';
        bodyHtml += '<td>' + (row.contactFirstNameLocalLanguage + ' ' + row.contactLastNameLocalLanguage) + '</td>';
        bodyHtml += '<td>' + row.contactDirectPhone + '</td>';
        bodyHtml += '<td>' + row.contactMobilePhone + '</td>';
        bodyHtml += '<td>' + row.contactEmail + '</td>';
        bodyHtml += '<td>' + booleanVisualizer.getHtml(row.contactIsClientsAddressUsed) + '</td>';
        
        bodyHtml += '<td>' + row.contactStreet + '</td>';
        bodyHtml += '<td>' + row.contactZipCode + '</td>';
        bodyHtml += '<td>' + row.contactCity + '</td>';
        bodyHtml += '<td>' + (row.contactCountryName != null ? row.contactCountryName : '') + '</td>';
        
        bodyHtml += '<td>' + (row.contactResidencialCountryName != null ? row.contactResidencialCountryName : '' ) + '</td>';
        bodyHtml += '<td>' + responsiblePersonsText + '</td>';
        bodyHtml += '<td>' + row.contactLanguage + '</td>';
        bodyHtml += '<td>' + row.contactNormalPosition + '</td>';
        bodyHtml += '<td>' + (row.contactOtherNormalPosition != null ? row.contactOtherNormalPosition : '')+ '</td>';
        bodyHtml += '<td>' + row.contactPresentType + '</td>';
        bodyHtml += '<td>' + booleanVisualizer.getHtml(row.contactIsNewsletters) + '</td>';
        bodyHtml += '<td>' + booleanVisualizer.getHtml(row.contactIsReminder) + '</td>';
        bodyHtml += '<td>' + booleanVisualizer.getHtml(row.contactIsActive) + '</td>';
        bodyHtml += '<td>' + row.contactComment + '</td>';        
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
}
ContactsReport.prototype.getResponsiblePerson = function(id) {
    for(var key in this.report.responsiblePersons) {
        var employee = this.report.responsiblePersons[key];
        if(employee.id == id) {
            return employee;
        }
    }
    return null;
}
ContactsReport.prototype.getSubdepartment = function(id) {
    for(var key in this.report.subdepartments) {
        var subdepartment = this.report.subdepartments[key];
        if(subdepartment.subdepartmentId == id) {
            return subdepartment;
        }
    }
    return null;
}

