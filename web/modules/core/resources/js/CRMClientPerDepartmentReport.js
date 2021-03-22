/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CRMClientPerDepartmentReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "CRMClientPerDepartmentReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
    }
    this.selected = {
    }
    this.data = {
    }
    this.reports = {};
}
CRMClientPerDepartmentReport.prototype.init = function() {
    this.show();
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
}

CRMClientPerDepartmentReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.normalizeContentSize();
    this.setHandlers();
}
CRMClientPerDepartmentReport.prototype.getHtml = function() {
    var html = '';
    html += '<input type="button" id="' + this.htmlId + '_generateHTMLBtn' + '" value="Generate">';
    html += '<input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS">';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="data" value="">';
    html += '</form>';
    return html;
}
CRMClientPerDepartmentReport.prototype.setHandlers = function() {
    var form = this;

    $('#' + this.htmlId + '_generateHTMLBtn').bind("click", function(event) {form.startGeneratingHTML.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
CRMClientPerDepartmentReport.prototype.updateView = function() {
}
CRMClientPerDepartmentReport.prototype.validate = function() {
    var errors = [];
    return errors;
}
CRMClientPerDepartmentReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
    } else {
      this.generateXLS();
    }
}
CRMClientPerDepartmentReport.prototype.generateXLS = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}
CRMClientPerDepartmentReport.prototype.startGeneratingHTML = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
    } else {
      this.generateHTML();
    }
}
CRMClientPerDepartmentReport.prototype.generateHTML = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.form = getJSON(this.data);
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

CRMClientPerDepartmentReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);

    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Report Generated at</td><td>' + this.report.createdAt + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);
            
    this.updateReportBodyView(this.htmlId + '_body', this.report.rows, this.report.subdepartmentColumns, this.report.activitySectors);
}
CRMClientPerDepartmentReport.prototype.updateReportBodyView = function(htmlContainerId, data, subdepartmentColumns, activitySectors) {
    var bodyHtml = '';
    bodyHtml += '<table id="' + this.htmlId + '_data"></table>';
    $('#' + htmlContainerId).html(bodyHtml);
    
    var normalizedData = [];
    for(var key in data) {
        var item = data[key];
        var clientActivitySectorNames = '';
        for(var key2 in item.activitySectorIds) {
            var activitySectorId = item.activitySectorIds[key2];
            for(var key3 in activitySectors) {
                var activitySector = activitySectors[key3];
                if(activitySector.id == activitySectorId) {
                    clientActivitySectorNames += activitySector.name + '; ';
                    break;
                }
            }
        }
        item.clientActivitySectorNames = clientActivitySectorNames;
        var normalizedItem = {
            groupId: item.groupId,
            groupName: item.groupName,
            clientId: item.clientId,
            clientName: item.clientName,
            clientCustomerType: item.clientCustomerType,
            clientIsReferred: item.clientIsReferred,
            clientActivitySectorNames: item.clientActivitySectorNames
        }
        for(var key in item.subdepartmentIds) {
            var subdepartmentId = item.subdepartmentIds[key];
            normalizedItem[subdepartmentId] = true;
        }
        normalizedData.push(normalizedItem);
    }
    var colNames = [];
    for(var key in subdepartmentColumns) {
        var subdepartmentColumn = subdepartmentColumns[key];
        colNames.push('' + subdepartmentColumn.subdepartmentName + ' (<em>' + subdepartmentColumn.departmentName + ', ' + subdepartmentColumn.officeName + '</em>)');
    }
    colNames.push('GroupId', 'Group Name', 'ClientId', 'Client Name', 'customerType', 'isReferred', 'clientActivitySectorNames');
    
    var colModel = [];
    for(var key in subdepartmentColumns) {
        var subdepartmentColumn = subdepartmentColumns[key];
        colModel.push({
            name: subdepartmentColumn.subdepartmentId,
            index: subdepartmentColumn.subdepartmentId,
            width: 80
        });
    }
    colModel.push({name:'groupId',index:'groupId', width: 80});
    colModel.push({name:'groupName',index:'groupName', width: 100});
    colModel.push({name:'clientId',index:'clientId', width: 80});
    colModel.push({name:'clientName',index:'clientName', width: 100});
    colModel.push({name:'clientCustomerType',index:'clientCustomerType', width: 80});            
    colModel.push({name:'clientIsReferred',index:'clientIsReferred', width: 80});            
    colModel.push({name:'clientActivitySectorNames',index:'clientActivitySectorNames', width: 80});       

    jQuery('#' + this.htmlId + '_data').jqGrid('clearGridData');
    jQuery('#' + this.htmlId + '_data').jqGrid({
        data: normalizedData,
        datatype: "local",
        height: '400',
        width: '600',
        colNames: colNames,
        colModel: colModel,
        rowNum:5000,
        multiselect: false,
        shrinkToFit: false
        //caption: "CRM Clients per Department"
    });
    this.normalizeContentSize();
}
CRMClientPerDepartmentReport.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 10;
    var layoutHeight = contentHeight - 100;
    
    jQuery('#' + this.htmlId + '_data').jqGrid('setGridWidth', layoutWidth -50);
    jQuery('#' + this.htmlId + '_data').jqGrid('setGridHeight', layoutHeight - 75);
}