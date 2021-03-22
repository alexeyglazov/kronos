/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function JobsManager(htmlId, containerHtmlId, moduleName) {
   this.config = {
        endpointUrl: endpointsFolder + "JobsManager.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   var date = new Date();
   this.moduleName = moduleName;
   this.loaded = {
       "jobResults": [],
       "runningJobs": []
   }
   this.timer = null;
}
JobsManager.prototype.init = function() {
    this.loadAll();
    this.dataChanged(false);
    var form = this;
    this.timer = window.setInterval(function(){ form.loadAll()}, 3000 );
}
JobsManager.prototype.loadAll = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.jobResults = result.jobResults;
            form.loaded.runningJobs = result.runningJobs;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

JobsManager.prototype.show = function() {
  $('#' + this.containerHtmlId).html(this.getHtml());
  this.updateView();
  this.setHandlers();
}
JobsManager.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_runningJobs"></div>';
    html += '<div id="' + this.htmlId + '_jobResults"></div>';
    html += '<form target="_blank" method="post" action="' + this.config.endpointUrl + '" id="' + this.htmlId + '_loadJobResultForm">';
    html += '<input type="hidden" name="command" value="loadJobResult">';
    html += '<input type="hidden" name="jobResultId" value="" id="' + this.htmlId + '_jobResultIdField">';
    html += '</form>';
    return html;
}
JobsManager.prototype.updateView = function() {
    this.updateRunningJobsView();
    this.updateJobResultsView();
}
JobsManager.prototype.updateRunningJobsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="4">Running jobs</td></tr>';
    html += '<tr class="dgHeader"><td>Name</td><td>Start</td><td>Part</td><td>Employee</td></tr>';
    if(this.loaded.runningJobs.length > 0) {
        for(var key in this.loaded.runningJobs) {
            var runningJob = this.loaded.runningJobs[key];
            html += '<tr><td>' + runningJob.name + '</td><td>' + getStringFromYearMonthDateTime(runningJob.startDate) + '</td><td><div style="width: 200px; height: 10px;" id="' + this.htmlId + '_runningJobs_part_' + key + '"></div></td><td>' + runningJob.employeeUserName + '</td></tr>';
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
JobsManager.prototype.updateJobResultsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="6">Job results</td></tr>';
    html += '<tr class="dgHeader"><td>Name</td><td>Size</td><td>Start</td><td>End</td><td>Employee</td><td>Delete</td></tr>';
    if(this.loaded.jobResults.length > 0) {
        for(var key in this.loaded.jobResults) {
            var jobResult = this.loaded.jobResults[key];
            html += '<tr>';
            html += '<td><span class="link" id="' + this.htmlId + '_loadJobResult_' + jobResult.id + '">' + jobResult.name + '</span></td>';
            html += '<td>' + memorySizeVisualizer.getHtml(jobResult.dataSize) + '</td>';
            html += '<td>' + getStringFromYearMonthDateTime(jobResult.startDate) + '</td>';
            html += '<td>' + getStringFromYearMonthDateTime(jobResult.endDate) + '</td>';
            html += '<td>' + jobResult.employeeUserName + '</td>';
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
JobsManager.prototype.setHandlers = function() {
}
JobsManager.prototype.loadJobResult = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var id = tmp[tmp.length - 1];
    var form = this;
    $('#' + this.htmlId + '_jobResultIdField').val(id);    
    $('#' + this.htmlId + '_loadJobResultForm').submit();    
}
JobsManager.prototype.startDeletingJobResult = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var id = tmp[tmp.length - 1];
    var form = this;
    doConfirm('Confirm', 'Delete this job result?', form, function() {form.deleteJobResult(id);}, null, null);    
}
JobsManager.prototype.deleteJobResult = function(id) {
    var form = this;
    var data = {};
    data.command = "deleteJobResult";
    data.moduleName = this.moduleName;
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
JobsManager.prototype.dataChanged = function(value) {
    dataChanged = value;
}