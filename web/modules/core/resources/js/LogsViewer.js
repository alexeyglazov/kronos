/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function LogsViewer(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "LogsViewer.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   var date = new Date();
   this.loaded = {
       "actionBlocks": []
   }
   this.timer = null;
}
LogsViewer.prototype.init = function() {
    this.loadAll();
    this.dataChanged(false);
}
LogsViewer.prototype.loadAll = function() {
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
            form.loaded.actionBlocks = result.actionBlocks;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

LogsViewer.prototype.show = function() {
  $('#' + this.containerHtmlId).html(this.getHtml());
  this.updateView();
  this.setHandlers();
}
LogsViewer.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_actions"></div>';
    return html;
}
LogsViewer.prototype.updateView = function() {
    this.updateActionsView();
}
LogsViewer.prototype.updateActionsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="7">Actions</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Time</td>';
    html += '<td>Address</td>';
    html += '<td>Port</td>';
    html += '<td>Method</td>';
    html += '<td>URI</td>';
    html += '<td>Protocol</td>';
    html += '<td>Scheme</td>';
    html += '<td>User</td>';
    html += '</tr>';
    if(this.loaded.actionBlocks.length > 0) {
        for(var key in this.loaded.actionBlocks) {
            var actionBlock = this.loaded.actionBlocks[key];
            html += '<tr>';
            html += '<td>' + yearMonthDateTimeVisualizer.getHtml(actionBlock.time) + '</td>';
            html += '<td>' + actionBlock.remoteAddr + '</td>';
            html += '<td>' + actionBlock.remotePort + '</td>';
            html += '<td>' + actionBlock.method + '</td>';
            html += '<td>' + actionBlock.requestURI + '</td>';
            html += '<td>' + actionBlock.protocol + '</td>';
            html += '<td>' + actionBlock.scheme + '</td>';
            html += '<td>' + actionBlock.employee.firstName + ' ' + actionBlock.employee.lastName + '</td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="7">No actions</td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_actions').html(html);
}
LogsViewer.prototype.setHandlers = function() {
}
LogsViewer.prototype.loadJobResult = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var id = tmp[tmp.length - 1];
    var form = this;
    $('#' + this.htmlId + '_jobResultIdField').val(id);    
    $('#' + this.htmlId + '_loadJobResultForm').submit();    
}
LogsViewer.prototype.startDeletingJobResult = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var id = tmp[tmp.length - 1];
    var form = this;
    doConfirm('Confirm', 'Delete this job result?', form, function() {form.deleteJobResult(id);}, null, null);    
}
LogsViewer.prototype.deleteJobResult = function(id) {
    var form = this;
    var data = {};
    data.command = "deleteJobResult";
    data.jobResultId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loadAll();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
LogsViewer.prototype.dataChanged = function(value) {
    dataChanged = value;
}