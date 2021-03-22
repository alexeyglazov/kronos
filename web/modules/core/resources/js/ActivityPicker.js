/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ActivityPicker(formData, htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "ActivityPicker.jsp"
    }
    this.mode = formData.mode;
    this.pickedActivities = [];
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.loaded = {
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "activities": []
    }
    this.selected = {
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null,
        "activityId": null,
        "pickedActivityId": null
    }
}
ActivityPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ActivityPicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.activities = [];

            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.activityId = null;
            form.show();
        })          
       },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActivityPicker.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.moduleName = this.moduleName;
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.activities = [];

            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.activityId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActivityPicker.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.moduleName = this.moduleName;
    data.departmentId = this.selected.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.activities = [];

            form.selected.subdepartmentId = null;
            form.selected.activityId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActivityPicker.prototype.loadSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.moduleName = this.moduleName;
    data.subdepartmentId = this.selected.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.activities = result.activities;

            form.selected.activityId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActivityPicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '<td><span class="label1">Subdepartment</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_office"></select></td>';
    html += '<td><select id="' + this.htmlId + '_department"></select></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartment"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<span class="label1">Activity</span><br />';
    html += '<table>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_activity" size="5" style="width: 300px;"></select></td>';
    if(this.mode == 'MULTIPLE') {
        html += '<td style="vertical-align: top;"><span id="' + this.htmlId + '_activity_pick" title="Pick selected">Pick</span></td>';
    }
    html += '</tr>';
    html += '</table>';
    
    if(this.mode == 'MULTIPLE') {
        html += '<span class="label1">Picked activities</span><br />';
        html += '<table>';
        html += '<tr>';
        html += '<td><select id="' + this.htmlId + '_pickedActivity" size="5" style="width: 500px; height: 150px;"></select></td>';
        html += '<td style="vertical-align: top;"><span id="' + this.htmlId + '_activity_clear" title="Remove selected">Remove</span></td>';
        html += '</tr>';
        html += '</table>';
    }
    return html;
}
ActivityPicker.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_activity_pick')
      .button()
      .click(function( event ) {
        form.pickActivity.call(form);
    });
    
    $('#' + this.htmlId + '_activity_clear')
      .button()
      .click(function( event ) {
        form.clearActivity.call(form);
    });
}    
ActivityPicker.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateActivityView();
}
ActivityPicker.prototype.updateOfficeView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="' + office.id + '" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
ActivityPicker.prototype.updateDepartmentView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + department.id + '" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
ActivityPicker.prototype.updateSubdepartmentView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + subdepartment.id + '" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
ActivityPicker.prototype.updateActivityView = function() {
    var html = '';
    for(var key in this.loaded.activities) {
        var activity = this.loaded.activities[key];
        var isSelected = "";
        if(activity.id == this.selected.activityId) {
           isSelected = "selected";
        }
        html += '<option value="' + activity.id + '" ' + isSelected + '>' + activity.name + '</option>';
    }
    $('#' + this.htmlId + '_activity').html(html);
}
ActivityPicker.prototype.updatePickedActivityView = function() {
    var html = '';
    for(var key in this.pickedActivities) {
        var activity = this.pickedActivities[key].activity;
        var path = this.pickedActivities[key].path;
        var isSelected = "";
        if(activity.id == this.selected.pickedActivityId) {
           isSelected = "selected";
        }
        html += '<option value="' + activity.id + '" ' + isSelected + '>' + path + '</option>';
    }
    $('#' + this.htmlId + '_pickedActivity').html(html);
}
ActivityPicker.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activity').bind("change", function(event) {form.activityChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_pickedActivity').bind("change", function(event) {form.pickedActivityChangedHandle.call(form, event);});
}
ActivityPicker.prototype.officeChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_office').val();
    if(htmlId == '') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(htmlId);
    }
    if(this.selected.officeId == null) {
        this.loadInitialContent();
    } else {
        this.loadOfficeContent();
    }
}
ActivityPicker.prototype.departmentChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_department').val();
    if(htmlId == '') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(htmlId);
    }
    if(this.selected.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
ActivityPicker.prototype.subdepartmentChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_subdepartment').val();
    if(htmlId == '') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(htmlId);
    }
    if(this.selected.subdepartmentId == null) {
        this.loadDepartmentContent();
    } else {
        this.loadSubdepartmentContent();
    }
}
ActivityPicker.prototype.activityChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_activity').val();
    if(htmlId == null || htmlId == '') {
        this.selected.activityId = null;
    } else {
        this.selected.activityId = parseInt(htmlId);
    }
}
ActivityPicker.prototype.pickedActivityChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_pickedActivity').val();
    if(htmlId == null || htmlId == '') {
        this.selected.pickedActivityId = null;
    } else {
        this.selected.pickedActivityId = parseInt(htmlId);
    }
}
ActivityPicker.prototype.pickActivity = function(event) {
    if(this.selected.activityId == null) {
        doAlert('Alert', 'Activity is not selected', null, null);
        return;
    }
    var activity = this.getActivity(this.selected.activityId);
    var activityTmp = jQuery.grep(this.pickedActivities, function(element, i) {
        return (activity.id == element.activity.id);
    });
    if(activityTmp.length == 0) {
        var path = this.getPath();
        this.pickedActivities.push({
            "activity": activity,
            "path": path
        });
        this.selected.pickedActivityId = null;
        this.sortPickedActivities();
        this.updatePickedActivityView();
    } else {
        doAlert('Alert', 'This activity is already picked', null, null);
    }
}
ActivityPicker.prototype.clearActivity = function(event) {
    if(this.selected.pickedActivityId == null) {
        doAlert('Alert', 'Activity is not selected', null, null);
        return;
    }
    var index = null;
    for(var key in this.pickedActivities) {
        if(this.pickedActivities[key].activity.id == this.selected.pickedActivityId) {
            index = key;
            break;
        }
    }
    if(index != null) {
        this.pickedActivities.splice(index, 1);
        this.selected.pickedActivityId = null;
        this.updatePickedActivityView();
    }
}
ActivityPicker.prototype.show = function() {
    var title = 'Pick Activity'
    var form = this;
    var height = 300;
    if(this.mode == 'MULTIPLE') {
        height = 450;
    }
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    this.makeButtons();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        activity: 'center',
        width: 600,
        height: height,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                form.okClickHandle();
            },
            Cancel: function() {
                $(this).dialog( "close" );
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
}
ActivityPicker.prototype.okClickHandle = function() {
    if(this.mode == 'MULTIPLE') {
        this.okHandler.call(this.okHandlerContext, this.pickedActivities);        
    } else {    
        var activity = this.getActivity(this.selected.activityId);
        this.okHandler.call(this.okHandlerContext, activity);
    }    
}
ActivityPicker.prototype.getActivity = function(id) {
    if(id == null) {
        return null;
    }    
    for(var key in this.loaded.activities) {
        if(this.loaded.activities[key].id == id) {
            return this.loaded.activities[key];
        }
    }
    return null;
}
ActivityPicker.prototype.getSubdepartment = function(id) {
    if(id == null) {
        return null;
    }    
    for(var key in this.loaded.subdepartments) {
        if(this.loaded.subdepartments[key].id == id) {
            return this.loaded.subdepartments[key];
        }
    }
    return null;
}
ActivityPicker.prototype.getDepartment = function(id) {
    if(id == null) {
        return null;
    }    
    for(var key in this.loaded.departments) {
        if(this.loaded.departments[key].id == id) {
            return this.loaded.departments[key];
        }
    }
    return null;
}
ActivityPicker.prototype.getOffice = function(id) {
    if(id == null) {
        return null;
    }    
    for(var key in this.loaded.offices) {
        if(this.loaded.offices[key].id == id) {
            return this.loaded.offices[key];
        }
    }
    return null;
}
ActivityPicker.prototype.getPath = function() {
    var office = this.getOffice(this.selected.officeId);
    var department = this.getDepartment(this.selected.departmentId);
    var subdepartment = this.getSubdepartment(this.selected.subdepartmentId);
    var activity = this.getActivity(this.selected.activityId);
    return office.name + ' / ' + department.name + ' / ' + subdepartment.name + ' / ' + activity.name;
}
ActivityPicker.prototype.sortPickedActivities = function() {
    this.pickedActivities.sort(function(o1, o2){
        if(o1.path == o2.path) return 0;
        return o1.path > o2.path ? 1: -1;
    }); 
}