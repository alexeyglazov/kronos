/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MarginReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "MarginReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
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
}
MarginReport.prototype.init = function() {
    this.loadInitialContent();
}
MarginReport.prototype.loadInitialContent = function() {
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
MarginReport.prototype.loadGroupContent = function() {
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
MarginReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
MarginReport.prototype.getHtml = function() {
    var html = '';
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
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"> <input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"> </td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="marginReportForm" value="">';
    html += '</form>';
    return html;
}
MarginReport.prototype.makeDatePickers = function() {
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
MarginReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
MarginReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
MarginReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
MarginReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
MarginReport.prototype.updateView = function() {
    this.updateGroupView();
    this.updateClientView();
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateStartDateView();
    this.updateEndDateView();    
}
MarginReport.prototype.setHandlers = function() {
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
}
MarginReport.prototype.groupChangedHandle = function(event) {
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
MarginReport.prototype.updateGroupView = function() {
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
MarginReport.prototype.updateClientView = function() {
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
MarginReport.prototype.updateOfficeView = function() {
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
MarginReport.prototype.updateDepartmentView = function() {
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
MarginReport.prototype.updateSubdepartmentView = function() {
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
MarginReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
MarginReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
MarginReport.prototype.validate = function(mode) {
    var errors = [];
    var warnings = [];
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
     "warnings": warnings
    };
}
MarginReport.prototype.startGenerating = function() {
    var mode = "HTML";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generate();
    }
}
MarginReport.prototype.startGeneratingXLS = function() {
    var mode = "XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generateXLS();
    }
}
MarginReport.prototype.generateXLS = function() {
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
MarginReport.prototype.generate = function() {
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
    data.marginReportForm = getJSON(serverFormatData);
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
MarginReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body" style="padding-left: 15px;"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);

    var headingHtml = '';
    $('#' + this.htmlId + '_heading').html(headingHtml);

    var bodyHtml = '';
    bodyHtml += '<table id="' + this.htmlId + '_table">';
    bodyHtml += '<tr id="node-1"><td class="label1">Audit</td><td></td></tr>';
        bodyHtml += '<tr id="node-1a" class="child-of-node-1"><td>Ivanov</td><td><table class="bar"><tr><td style="width: 160px;" class="red">2</td><td style="width: 240px;" class="green">3</td></tr></table></td></tr>';
            bodyHtml += '<tr id="node-1a1" class="child-of-node-1a"><td>Peugeot Bank Finance</td><td></td></tr>';
                bodyHtml += '<tr id="node-1a1a" class="child-of-node-1a1"><td>M_CAS_AUDIT_BPF_2009_OTHER_3112</td><td id="bar_c-1a1a"></td></tr>';
                bodyHtml += '<tr id="node-1a1b" class="child-of-node-1a1"><td>M_CAS_AUDIT_BPF_2010_IFRS_3112</td><td><table class="bar"><tr><td style="width: 300px;" class="green">75%</td></tr></table></td></tr>';
            bodyHtml += '<tr id="node-1a2" class="child-of-node-1a"><td>Peugeot Citroen Avtomobili Rus</td><td></td></tr>';
                bodyHtml += '<tr id="node-1a2a" class="child-of-node-1a2"><td>M_CAS_AUDIT_PCA_2009_RAS_3112</td><td><table class="bar"><tr><td style="width: 40px;" class="red">10%</td></tr></table></td></tr>';
                bodyHtml += '<tr id="node-1a2b" class="child-of-node-1a2"><td>M_CAS_AUDIT_PCA_2010_RAS_3112</td><td><table class="bar"><tr><td style="width: 220px;" class="green">55%</td></tr></table></td></tr>';
                bodyHtml += '<tr id="node-1a2b" class="child-of-node-1a2"><td>M_CAS_AUDIT_PCA_2011_RAS_3112</td><td><table class="bar"><tr><td style="width: 320px;" class="green">80%</td></tr></table></td></tr>';
        bodyHtml += '<tr id="node-1b" class="child-of-node-1"><td>Petrov</td><td></td></tr>';
        bodyHtml += '<tr id="node-1c" class="child-of-node-1"><td>Sidorov</td><td></td></tr>';
    bodyHtml += '<tr id="node-2"><td>Outsoursing</td><td></td></tr>';
        bodyHtml += '<tr id="node-2a" class="child-of-node-2"><td>Ivanov</td><td></td></tr>';
            bodyHtml += '<tr id="node-2a1" class="child-of-node-2a"><td>EDF</td><td></td></tr>';
                bodyHtml += '<tr id="node-2a1a" class="child-of-node-2a1"><td>M_BAS_OUT_EDF_2009_ACCTG_Q3</td><td><table class="bar"><tr><td style="width: 120px;" class="red">30%</td></tr></table></td></tr>';
                bodyHtml += '<tr id="node-2a1b" class="child-of-node-2a1"><td>M_BAS_OUT_EDF_2009_ACCTG_Q4</td><td><table class="bar"><tr><td style="width: 240px;" class="green">60%</td></tr></table></td></tr>';
                bodyHtml += '<tr id="node-2a1c" class="child-of-node-2a1"><td>M_BAS_OUT_EDF_2009_OTHER_1</td><td><table class="bar"><tr><td style="width: 80px;" class="green">20%</td></tr></table></td></tr>';
        bodyHtml += '<tr id="node-2b" class="child-of-node-2"><td>Petrov</td><td></td></tr>';
    bodyHtml += '<tr id="node-3"><td>Tax & Legal</td><td></td></tr>';   
        bodyHtml += '<tr id="node-3a" class="child-of-node-3"><td>Ivanov</td><td></td></tr>';
        bodyHtml += '<tr id="node-3b" class="child-of-node-3"><td>Petrov</td><td></td></tr>';
    bodyHtml += '</tr>';
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
    $('#' + this.htmlId + '_table').treeTable({
        expandable: true
    });
    var bar = new Bar("bar-1a1a", null);
    bar.show("bar_c-1a1a");
}
