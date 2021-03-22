/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CRMClientReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "CRMClientReport.jsp"
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
CRMClientReport.prototype.init = function() {
    this.show();
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
}

CRMClientReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.normalizeContentSize();
    this.setHandlers();
}
CRMClientReport.prototype.getHtml = function() {
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
CRMClientReport.prototype.setHandlers = function() {
    var form = this;

    $('#' + this.htmlId + '_generateHTMLBtn').bind("click", function(event) {form.startGeneratingHTML.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
CRMClientReport.prototype.updateView = function() {
}
CRMClientReport.prototype.validate = function() {
    var errors = [];
    return errors;
}
CRMClientReport.prototype.startGeneratingXLS = function() {
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
CRMClientReport.prototype.generateXLS = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}
CRMClientReport.prototype.startGeneratingHTML = function() {
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
CRMClientReport.prototype.generateHTML = function() {
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

CRMClientReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);

    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Report Generated at</td><td>' + this.report.createdAt + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);
            
    this.updateReportBodyView(this.htmlId + '_body', this.report.rows, this.report.activitySectors);
}
CRMClientReport.prototype.updateReportBodyView = function(htmlContainerId, data, activitySectors) {
    var bodyHtml = '';
    bodyHtml += '<table id="' + this.htmlId + '_data"></table>';
    $('#' + htmlContainerId).html(bodyHtml);
    
    for(var key in data) {
        var row = data[key];
        var clientSubdepartmentNames = '';
        if(row.clientSubdepartments != null && row.clientSubdepartments.length > 0) {
            for(var key2 in row.clientSubdepartments) {
                var clientSubdepartment = row.clientSubdepartments[key2];
                clientSubdepartmentNames += clientSubdepartment.officeName + ' / ' + clientSubdepartment.departmentName + ' / ' + clientSubdepartment.subdepartmentName + '; ';
            }
        }
        row.clientSubdepartmentNames = clientSubdepartmentNames;
        var clientActivitySectorNames = '';
        for(var key2 in row.activitySectorIds) {
            var activitySectorId = row.activitySectorIds[key2];
            for(var key3 in activitySectors) {
                var activitySector = activitySectors[key3];
                if(activitySector.id == activitySectorId) {
                    clientActivitySectorNames += activitySector.name + '; ';
                    break;
                }
            }
        }
        row.clientActivitySectorNames = clientActivitySectorNames;
    }
    jQuery('#' + this.htmlId + '_data').jqGrid('clearGridData');
    jQuery('#' + this.htmlId + '_data').jqGrid({
        data: data,
        datatype: "local",
        height: '400',
        width: '600',
        colNames:['GroupId', 'Group Name', 'Group country', 'Group is listed', 'Group listing country', 'Group is referred', 'Group is Mazars audit',
            'ClientId', 'Name', 'Code name', 'Subdepartments', 'Client group', 'Country of origin', 'Postal street', 'Postal ZIP code', 'Postal city', 'Postal country', 'Postal address equals to legal', 'Legal street', 'Legal ZIP code', 'Legal city', 'Legal country',
            'Phone', 'Fax', 'Tax number', 'Activity Sectors', 'Listed', 'Listing country', 'CustomerType', 'Transnational', 'Referred', 
            'Channel type', 'Potential', 'External/Networking', 'Active'
        ],
        colModel:[
            {name:'groupId',index:'groupId', width: 80},
            {name:'groupName',index:'groupName', width: 80},
            {name:'groupCountryName',index:'groupCountryName', width: 80},
            {name:'groupIsListed',index:'groupIsListed', width: 80},
            {name:'groupListingCountry',index:'groupListingCountryName', width: 80},
            {name:'groupIsReferred',index:'groupIsReferred', width: 80},
            {name:'groupIsMazarsAudit',index:'groupIsMazarsAudit', width: 80},
            
            {name:'clientId',index:'clientId', width: 80},
            {name:'clientName',index:'clientName', width: 80},
            {name:'clientCodeName',index:'clientCodeName', width: 80},
            {name:'clientSubdepartmentNames',index:'clientSubdepartmentNames', width: 80},
            {name:'clientGroup',index:'clientGroup', width: 80},
            {name:'clientCountryName',index:'clientCountryName', width: 80},
            {name:'clientPostalStreet',index:'clientPostalStreet', width: 80},
            {name:'clientPostalZipCode',index:'clientPostalZipCode', width: 80},
            {name:'clientPostalCity',index:'clientPostalCity', width: 80},
            {name:'clientPostalCountryName',index:'clientPostalCountryName', width: 80},
            {name:'clientIsPostalAddressEqualToLegal',index:'clientIsPostalAddressEqualToLegal', width: 80},
            {name:'clientLegalStreet',index:'clientLegalStreet', width: 80},
            {name:'clientLegalZipCode',index:'clientLegalZipCode', width: 80},
            {name:'clientLegalCity',index:'clientLegalCity', width: 80},
            {name:'clientLegalCountryName',index:'clientLegalCountryName', width: 80},
            
            {name:'clientPhone',index:'clientPhone', width: 80},
            {name:'clientFax',index:'clientFax', width: 80},
            {name:'clientTaxNumber',index:'clientTaxNumber', width: 80},
            {name:'clientActivitySectorNames',index:'clientActivitySectorNames', width: 80},
            {name:'clientIsListed',index:'clientIsListed', width: 80},
            {name:'clientListingCountryName',index:'clientListingCountryName', width: 80},
            {name:'clientCustomerType',index:'clientCustomerType', width: 80},
            {name:'clientIsTransnational',index:'clientIsTransnational', width: 80},
            {name:'clientIsReferred',index:'clientIsReferred', width: 80},
            {name:'clientChannelType',index:'clientChannelType', width: 80},
            {name:'clientIsFuture',index:'clientIsFuture', width: 80},
            {name:'clientIsExternal',index:'clientIsExternal', width: 80},
            {name:'clientIsActive',index:'clientIsActive', width: 80}
        ],
        rowNum:5000,
        multiselect: false,
        shrinkToFit: false
        //caption: "CRM Clients"
    });
    this.normalizeContentSize();
}
CRMClientReport.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 10;
    var layoutHeight = contentHeight - 100;
    
    jQuery('#' + this.htmlId + '_data').jqGrid('setGridWidth', layoutWidth -50);
    jQuery('#' + this.htmlId + '_data').jqGrid('setGridHeight', layoutHeight - 75);
}