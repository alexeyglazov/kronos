/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CodeListReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "CodeListReport.jsp"
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
CodeListReport.prototype.init = function() {
    this.show();
}
CodeListReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
CodeListReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"> <input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="codeListReportForm" value="">';
    html += '</form>';
    return html;
}
CodeListReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
CodeListReport.prototype.updateView = function() {   
}
CodeListReport.prototype.validate = function(mode) {
    var errors = [];
    var warnings = [];
    return {
     "errors": errors,
     "warnings": warnings
    };
}
CodeListReport.prototype.startGenerating = function() {
    var mode = "HTML";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generate();
    }
}
CodeListReport.prototype.startGeneratingXLS = function() {
    var mode = "XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generateXLS();
    }
}
CodeListReport.prototype.generateXLS = function() {
    var serverFormatData = {
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
CodeListReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = {
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.codeListReportForm = getJSON(serverFormatData);
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
CodeListReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeaderView();
    this.updateBodyView();

}
CodeListReport.prototype.updateHeaderView = function() {
    var html = '';
    html += '<table class="datagrid">';  
    html += '<tr><td>Report generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    html += '</table>';    
    $('#' + this.htmlId + '_heading').html(html);    
}
CodeListReport.prototype.updateBodyView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="3">Code List Report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Group</td>';
    html += '<td>Client</td>';
    html += '<td>Project code</td>';
    html += '</tr>';
          
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        html += '<tr>';       
        html += '<td>' + (row.groupName != null ? row.groupName : '' ) + '</td>';
        html += '<td>' + row.clientName + '</td>';
        html += '<td>' + row.projectCodeCode + '</td>';
        html += '</tr>';
    }
    html += '</table>';    
    $('#' + this.htmlId + '_body').html(html);
}