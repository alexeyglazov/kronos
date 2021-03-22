/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ActualTimespentReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ActualTimespentReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "groups" : [],
        "clients" : [],
        "projectCodes": [],
        "minYear": []
    }
    this.years = [];
    this.data = {
        groupId: null,
        clientId: null,
        projectCodeId: null
    }
    this.reports = {};
}
ActualTimespentReport.prototype.init = function() {
    this.loadInitialContent();
}
ActualTimespentReport.prototype.loadInitialContent = function() {
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
            form.loaded.projectCodes = [];
            form.loaded.minYear = result.minYear;
            form.data.groupId = null;
            form.data.clientId = null;
            form.data.projectCodeId = null;
            var date = new Date()
            var year = date.getFullYear();
            for(var i = form.loaded.minYear; i <= year + 1; i++) {
               form.years.push(i);
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActualTimespentReport.prototype.loadGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getGroupContent";
    data.groupId = this.data.groupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.loaded.projectCodes = [];
            form.data.clientId = null;
            form.data.projectCodeId = null;
            form.updateClientView();
            form.updateProjectCodeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActualTimespentReport.prototype.loadNullGroupContent = function() {
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
            form.loaded.projectCodes = [];
            form.data.clientId = null;
            form.data.projectCodeId = null;
            form.updateClientView();
            form.updateProjectCodeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActualTimespentReport.prototype.loadClientContent = function() {
    var form = this;
    var data = {};
    data.command = "getClientContent";
    data.clientId = this.data.clientId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCodes = result.projectCodes;
            form.data.projectCodeId = null;
            form.updateProjectCodeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActualTimespentReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
ActualTimespentReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Group</span></td>';
    html += '<td><span class="label1">Client</span></td>';
    html += '<td><span class="label1">Project code</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_group' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_client' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_projectCode' + '"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Year</span></td><td><select id="' + this.htmlId + '_year' + '"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"> <input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="actualTimespentReportForm" value="">';
    html += '</form>';
    return html;
}
ActualTimespentReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form)});
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form)});
    $('#' + this.htmlId + '_projectCode').bind("change", function(event) {form.projectCodeChangedHandle.call(form)});
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
ActualTimespentReport.prototype.yearChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_year').val();
    if(idTxt == '') {
        this.data.year = null;
    } else {
        this.data.year = parseInt(idTxt);
    }
}
ActualTimespentReport.prototype.groupChangedHandle = function(event) {
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
ActualTimespentReport.prototype.clientChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_client').val();
    if(idTxt == '') {
        this.data.clientId = null;
    } else {
        this.data.clientId = parseInt(idTxt);
    }
    if(this.data.clientId == null) {
        this.loaded.projectCodes = [];
        this.data.projectCodeId = null;
        this.updateProjectCodeView();        
    } else {
        this.loadClientContent();
    }
}
ActualTimespentReport.prototype.projectCodeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_projectCode').val();
    if(idTxt == '') {
        this.data.projectCodeId = null;
    } else {
        this.data.projectCodeId = parseInt(idTxt);
    }
}
ActualTimespentReport.prototype.updateView = function() {
    this.updateGroupView();
    this.updateClientView();
    this.updateProjectCodeView();
    this.updateYearView();
}
ActualTimespentReport.prototype.updateYearView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.years) {
        var year = this.years[key];
        var isSelected = "";
        if(year == this.data.year) {
           isSelected = "selected";
        }
        html += '<option value="'+ year +'" ' + isSelected + '>' + year + '</option>';
    }
    $('#' + this.htmlId + '_year').html(html);
}
ActualTimespentReport.prototype.updateGroupView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var isSelected = "";
        if(group.id == this.data.groupId) {
           isSelected = "selected";
        }
        html += '<option value="'+ group.id +'" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#' + this.htmlId + '_group').html(html);
}
ActualTimespentReport.prototype.updateClientView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var isSelected = "";
        if(client.id == this.data.clientId) {
           isSelected = "selected";
        }
        html += '<option value="'+ client.id +'" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}
ActualTimespentReport.prototype.updateProjectCodeView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.projectCodes) {
        var projectCode = this.loaded.projectCodes[key];
        var isSelected = "";
        if(projectCode.id == this.data.projectCodeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ projectCode.id +'" ' + isSelected + '>' + projectCode.code+ '</option>';
    }
    $('#' + this.htmlId + '_projectCode').html(html);
}
ActualTimespentReport.prototype.validate = function() {
    var errors = [];
    if(this.data.year == null) {
        errors.push("Please select year");
    }
    return errors;
}
ActualTimespentReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generate();
    }
}
ActualTimespentReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLS();
    }
}
ActualTimespentReport.prototype.generateXLS = function() {
    var serverFormatData = this.data;
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
ActualTimespentReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = this.data;
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.actualTimespentReportForm = getJSON(serverFormatData);
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
ActualTimespentReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateReportHeaderView();
    this.updateReportBodyView();
}
ActualTimespentReport.prototype.updateReportHeaderView = function() {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Group</td><td>' + this.report.formGroupName + '</td></tr>';
    headingHtml += '<tr><td>Client</td><td>' + this.report.formClientName + '</td></tr>';
    headingHtml += '<tr><td>Project code</td><td>' + this.report.formProjectCodeCode + '</td></tr>';
    headingHtml += '<tr><td>Year</td><td>' + this.report.formYear + '</td></tr>';
    headingHtml += '<tr><td>Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);  
}
ActualTimespentReport.prototype.updateReportBodyView = function() {
    var bodyHtml = '';
    bodyHtml += '<table id="' + this.htmlId + '_table" class="datagrid">';
    bodyHtml += '<tr class="dgHeader" id="' + this.htmlId + '_tableHeader">';
    bodyHtml += '<td>Group</td>';
    bodyHtml += '<td>Client</td>';
    bodyHtml += '<td>Project Code</td>';
    bodyHtml += '<td>Employee</td>';
    bodyHtml += '<td>Timespent</td>';
    bodyHtml += '</tr>';
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + (row.groupName != null ? row.groupName : '') + '</td>';
        bodyHtml += '<td>' + row.clientName + '</td>';
        bodyHtml += '<td>' + row.projectCodeCode + '</td>';
        bodyHtml += '<td>' + (row.employeeFirstName + ' ' + row.employeeLastName) + '</td>';
        bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.timespent) + '</td>';
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
}
