/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function AnnualPaidLeavesManager(htmlId, containerHtmlId) {
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.config = {
        endpointUrl: endpointsFolder+ "AnnualPaidLeavesManager.jsp"
    };
    this.loaded = {
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "positions": [],
        "annualPaidLeaves": [],
        "errors": []
    };
    this.selected = {
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null,
        "positionId": null
    }
}
AnnualPaidLeavesManager.prototype.init = function() {
    this.loadInitialContent();
}
AnnualPaidLeavesManager.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.positions = [];
            form.loaded.annualPaidLeaves = [];
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.positionId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AnnualPaidLeavesManager.prototype.loadOfficeContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.positions = [];
            form.loaded.annualPaidLeaves = [];
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.positionId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AnnualPaidLeavesManager.prototype.loadDepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.selected.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.positions = [];
            form.loaded.annualPaidLeaves = [];
            form.selected.subdepartmentId = null;
            form.selected.positionId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AnnualPaidLeavesManager.prototype.loadSubdepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.subdepartmentId = this.selected.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data) {
        ajaxResultHandle(data, form, function(result) {
            form.loaded.positions = result.positions;
            form.loaded.annualPaidLeaves = [];
            form.selected.positionId = null;
            form.updateView();
        })
     },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AnnualPaidLeavesManager.prototype.loadPositionContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getPositionContent";
    data.positionId = this.selected.positionId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.annualPaidLeaves = result.annualPaidLeaves;
            form.loaded.errors = result.errors;
            form.updateAnnualPaidLeavesInfoView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

AnnualPaidLeavesManager.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == '') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    if(this.selected.officeId == null) {
        this.loadInitialContent();
    } else {
        this.loadOfficeContent();
    }
}
AnnualPaidLeavesManager.prototype.departmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == '') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(idTxt);
    }
    if(this.selected.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
AnnualPaidLeavesManager.prototype.subdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(idTxt);
    }
    if(this.selected.subdepartmentId == null) {
        this.loadDepartmentContent();
    } else {
        this.loadSubdepartmentContent();
    }
}
AnnualPaidLeavesManager.prototype.positionChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_position').val();
    if(idTxt == '') {
        this.selected.positionId = null;
    } else {
        this.selected.positionId = parseInt(idTxt);
    }
    if(this.selected.positionId == null) {
        this.loadSubdepartmentContent();
    } else {
        this.loadPositionContent();
    }
}

AnnualPaidLeavesManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.makeElementsDroppable();
    this.updateView();
    this.setHandlers();
}
AnnualPaidLeavesManager.prototype.makeElementsDroppable = function() {
    var form = this;
    $( '#' + this.htmlId + '_nonUser').droppable({
            drop: function( event, ui ) {
                    form.employeeDropHandle.call(form, event, ui, "NON_USER");
            },
            activeClass: "ui-state-hover",
            accept: 'div[id^="' + this.htmlId + '_employee_USER_"], div[id^="' + this.htmlId + '_employee_SUPER_USER_"], div[id^="' + this.htmlId + '_employee_COUNTRY_ADMINISTRATOR_"]'
    });
    $( '#' + this.htmlId + '_user').droppable({
            drop: function( event, ui ) {
                    form.employeeDropHandle.call(form, event, ui, "USER");
            },
            activeClass: "ui-state-hover",
            accept: 'div[id^="' + this.htmlId + '_employee_NON_USER_"], div[id^="' + this.htmlId + '_employee_SUPER_USER_"], div[id^="' + this.htmlId + '_employee_COUNTRY_ADMINISTRATOR_"]'
    });
    if(currentUser.profile == "COUNTRY_ADMINISTRATOR") {
        $( '#' + this.htmlId + '_superUser').droppable({
                drop: function( event, ui ) {
                        form.employeeDropHandle.call(form, event, ui, "SUPER_USER");
                },
                activeClass: "ui-state-hover",
                accept: 'div[id^="' + this.htmlId + '_employee_NON_USER_"], div[id^="' + this.htmlId + '_employee_USER_"], div[id^="' + this.htmlId + '_employee_COUNTRY_ADMINISTRATOR_"]'
        });
    }
    if(currentUser.profile == "COUNTRY_ADMINISTRATOR" && currentUser.isAdministrator) {
        $( '#' + this.htmlId + '_countryAdministrator').droppable({
                drop: function( event, ui ) {
                        form.employeeDropHandle.call(form, event, ui, "COUNTRY_ADMINISTRATOR");
               },
                activeClass: "ui-state-hover",
                accept: 'div[id^="' + this.htmlId + '_employee_NON_USER_"], div[id^="' + this.htmlId + '_employee_USER_"], div[id^="' + this.htmlId + '_employee_SUPER_USER_"]'
        });
    }
}
AnnualPaidLeavesManager.prototype.clearEmployeeSelection = function() {
    this.selected.employeeId = null;
    this.updateView();
}
AnnualPaidLeavesManager.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td><td><span class="label1">Position</span></td></tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_office"></select></td>';
    html += '<td><select id="' + this.htmlId + '_department"></select></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartment"></select></td>';
    html += '<td><select id="' + this.htmlId + '_position"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<div class="comment1">Set annual paid leave durations for each position. It is recommended to make empty the end date of the last item.</div>';
    html += '<div id="' + this.htmlId + '_annualPaidLeaves_errors"></div>';
    html += '<div id="' + this.htmlId + '_annualPaidLeaves_FULLTIME"></div>';
    html += '<div id="' + this.htmlId + '_annualPaidLeaves_PARTTIME"></div>';
    html += '<div id="' + this.htmlId + '_annualPaidLeaves_TIMESPENT"></div>';
    return html;
}
AnnualPaidLeavesManager.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_position').bind("change", function(event) {form.positionChangedHandle.call(form, event);});
}
AnnualPaidLeavesManager.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updatePositionView();
    this.updateAnnualPaidLeavesInfoView();
}

AnnualPaidLeavesManager.prototype.updateOfficeView = function() {
    var html = '';
    html += '<option value="">...</option>';
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
AnnualPaidLeavesManager.prototype.updateDepartmentView = function() {
    var html = '';
    html += '<option value="">...</option>';
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
AnnualPaidLeavesManager.prototype.updateSubdepartmentView = function() {
    var html = '';
    html += '<option value="">...</option>';
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
AnnualPaidLeavesManager.prototype.updatePositionView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var isSelected = "";
        if(position.id == this.selected.positionId) {
           isSelected = "selected";
        }
        html += '<option value="' + position.id + '" ' + isSelected + '>' + position.name + '</option>';
    }
    $('#' + this.htmlId + '_position').html(html);
}
AnnualPaidLeavesManager.prototype.updateAnnualPaidLeavesInfoView = function() {
    if(this.selected.positionId == null) {
        $('#' + this.htmlId + '_annualPaidLeaves_errors').html('');
        $('#' + this.htmlId + '_annualPaidLeaves_FULLTIME').html('');
        $('#' + this.htmlId + '_annualPaidLeaves_PARTTIME').html('');
        $('#' + this.htmlId + '_annualPaidLeaves_TIMESPENT').html('');
        return;
    }
    var html = '';
    for(var key in this.loaded.errors) {
        var error = this.loaded.errors[key];
        html += error + '<br />';
    }
    $('#' + this.htmlId + '_annualPaidLeaves_errors').html(html);
    
    var fullTimeAnnualPaidLeaves = [];
    var partTimeAnnualPaidLeaves = [];
    var timeSpentAnnualPaidLeaves = [];
    for(var key in this.loaded.annualPaidLeaves) {
        var annualPaidLeave = this.loaded.annualPaidLeaves[key];
        if(annualPaidLeave.contractType == 'FULL_TIME') {
            fullTimeAnnualPaidLeaves.push(annualPaidLeave);
        } else if(annualPaidLeave.contractType == 'PART_TIME') {
            partTimeAnnualPaidLeaves.push(annualPaidLeave);
        } else if(annualPaidLeave.contractType == 'TIME_SPENT') {
            timeSpentAnnualPaidLeaves.push(annualPaidLeave);
        }
    }
    
    var fullTimeColumns = [];
    fullTimeColumns.push({"name": "Start", "property": "start", visualizer: calendarVisualizer});
    fullTimeColumns.push({"name": "End", "property": "end", visualizer: calendarVisualizer});
    fullTimeColumns.push({"name": "Duration", "property": "duration"});
    var fullTimeControls = [];
    fullTimeControls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addFullTimeAnnualLeave, "context": this}});
    var fullTimeExtraColumns = [];
    fullTimeExtraColumns.push({"name": "Update", "property": "update", "text": "Update",  "click": {"handler": this.updateFullTimeAnnualLeave, "context": this}});
    fullTimeExtraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteFullTimeAnnualLeave, "context": this}});
    var dataGrid = new DataGrid("fullTimeAnnualLeave", fullTimeAnnualPaidLeaves, fullTimeColumns, "Full time annual paid leaves", fullTimeControls, fullTimeExtraColumns, "id");
    dataGrid.show(this.htmlId + '_annualPaidLeaves_FULLTIME');

    var partTimeColumns = [];
    partTimeColumns.push({"name": "Start", "property": "start", visualizer: calendarVisualizer});
    partTimeColumns.push({"name": "End", "property": "end", visualizer: calendarVisualizer});
    partTimeColumns.push({"name": "Duration", "property": "duration"});
    var partTimeControls = [];
    partTimeControls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addPartTimeAnnualLeave, "context": this}});
    var partTimeExtraColumns = [];
    partTimeExtraColumns.push({"name": "Update", "property": "update", "text": "Update",  "click": {"handler": this.updatePartTimeAnnualLeave, "context": this}});
    partTimeExtraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deletePartTimeAnnualLeave, "context": this}});
    var dataGrid = new DataGrid("partTimeAnnualLeave", partTimeAnnualPaidLeaves, partTimeColumns, "Part time annual paid leaves", partTimeControls, partTimeExtraColumns, "id");
    dataGrid.show(this.htmlId + '_annualPaidLeaves_PARTTIME');

    var timeSpentColumns = [];
    timeSpentColumns.push({"name": "Start", "property": "start", visualizer: calendarVisualizer});
    timeSpentColumns.push({"name": "End", "property": "end", visualizer: calendarVisualizer});
    timeSpentColumns.push({"name": "Duration", "property": "duration"});
    var timeSpentControls = [];
    timeSpentControls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addTimeSpentAnnualLeave, "context": this}});
    var timeSpentExtraColumns = [];
    timeSpentExtraColumns.push({"name": "Update", "property": "update", "text": "Update",  "click": {"handler": this.updateTimeSpentAnnualLeave, "context": this}});
    timeSpentExtraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteTimeSpentAnnualLeave, "context": this}});
    var dataGrid = new DataGrid("timeSpentAnnualLeave", timeSpentAnnualPaidLeaves, timeSpentColumns, "Time spent annual paid leaves", timeSpentControls, timeSpentExtraColumns, "id");
    dataGrid.show(this.htmlId + '_annualPaidLeaves_TIMESPENT');

}

AnnualPaidLeavesManager.prototype.addFullTimeAnnualLeave = function() {
    var annualPaidLeaveEditForm = new AnnualPaidLeaveEditForm({
        "mode": 'CREATE',
        "id": null,
        "positionId": this.selected.positionId,
        "start": null,
        "end": null,
        "duration" : 35,
        "contractType" : 'FULL_TIME'
    }, "annualPaidLeaveEditForm", this.refreshInfo, this);
    annualPaidLeaveEditForm.init();
}
AnnualPaidLeavesManager.prototype.deleteFullTimeAnnualLeave = function() {
    var htmlId = event.currentTarget.id;
    var tmp = htmlId.split("_");
    var annualPaidLeaveId = tmp[tmp.length - 1];
    var annualPaidLeaveDeleteForm = new AnnualPaidLeaveDeleteForm(annualPaidLeaveId, this.refreshInfo, this);
    annualPaidLeaveDeleteForm.init();        
}
AnnualPaidLeavesManager.prototype.updateFullTimeAnnualLeave = function(event) {
    var htmlId = event.currentTarget.id;
    var tmp = htmlId.split("_");
    var annualPaidLeaveId = tmp[tmp.length - 1];
    var annualPaidLeave = null;
    for(var key in this.loaded.annualPaidLeaves) {
        var annualPaidLeaveTmp = this.loaded.annualPaidLeaves[key];
        if(annualPaidLeaveTmp.id == annualPaidLeaveId) {
            annualPaidLeave = annualPaidLeaveTmp;
            break;
        }
    }
    var annualPaidLeaveEditForm = new AnnualPaidLeaveEditForm({
        "mode": 'UPDATE',
        "id": annualPaidLeave.id,
        "positionId": this.selected.positionId,
        "start": annualPaidLeave.start,
        "end": annualPaidLeave.end,
        "duration" : annualPaidLeave.duration,
        "contractType" : 'FULL_TIME'
    }, "annualPaidLeaveEditForm", this.refreshInfo, this);
    annualPaidLeaveEditForm.init();
}

AnnualPaidLeavesManager.prototype.addPartTimeAnnualLeave = function() {
    var annualPaidLeaveEditForm = new AnnualPaidLeaveEditForm({
        "mode": 'CREATE',
        "id": null,
        "positionId": this.selected.positionId,
        "start": null,
        "end": null,
        "duration" : 35,
        "contractType" : 'PART_TIME'
    }, "annualPaidLeaveEditForm", this.refreshInfo, this);
    annualPaidLeaveEditForm.init();
}
AnnualPaidLeavesManager.prototype.deletePartTimeAnnualLeave = function() {
    var htmlId = event.currentTarget.id;
    var tmp = htmlId.split("_");
    var annualPaidLeaveId = tmp[tmp.length - 1];
    var annualPaidLeaveDeleteForm = new AnnualPaidLeaveDeleteForm(annualPaidLeaveId, this.refreshInfo, this);
    annualPaidLeaveDeleteForm.init();      
}
AnnualPaidLeavesManager.prototype.updatePartTimeAnnualLeave = function(event) {
    var htmlId = event.currentTarget.id;
    var tmp = htmlId.split("_");
    var annualPaidLeaveId = tmp[tmp.length - 1];
    var annualPaidLeave = null;
    for(var key in this.loaded.annualPaidLeaves) {
        var annualPaidLeaveTmp = this.loaded.annualPaidLeaves[key];
        if(annualPaidLeaveTmp.id == annualPaidLeaveId) {
            annualPaidLeave = annualPaidLeaveTmp;
            break;
        }
    }
    var annualPaidLeaveEditForm = new AnnualPaidLeaveEditForm({
        "mode": 'UPDATE',
        "id": annualPaidLeave.id,
        "positionId": this.selected.positionId,
        "start": annualPaidLeave.start,
        "end": annualPaidLeave.end,
        "duration" : annualPaidLeave.duration,
        "contractType" : 'PART_TIME'
    }, "annualPaidLeaveEditForm", this.refreshInfo, this);
    annualPaidLeaveEditForm.init();
   
}

AnnualPaidLeavesManager.prototype.addTimeSpentAnnualLeave = function() {
    var annualPaidLeaveEditForm = new AnnualPaidLeaveEditForm({
        "mode": 'CREATE',
        "id": null,
        "positionId": this.selected.positionId,
        "start": null,
        "end": null,
        "duration" : 35,
        "contractType" : 'TIME_SPENT'
    }, "annualPaidLeaveEditForm", this.refreshInfo, this);
    annualPaidLeaveEditForm.init();
}
AnnualPaidLeavesManager.prototype.deleteTimeSpentAnnualLeave = function(event) {
    var htmlId = event.currentTarget.id;
    var tmp = htmlId.split("_");
    var annualPaidLeaveId = tmp[tmp.length - 1];
    var annualPaidLeaveDeleteForm = new AnnualPaidLeaveDeleteForm(annualPaidLeaveId, this.refreshInfo, this);
    annualPaidLeaveDeleteForm.init();    
}
AnnualPaidLeavesManager.prototype.updateTimeSpentAnnualLeave = function(event) {
    var htmlId = event.currentTarget.id;
    var tmp = htmlId.split("_");
    var annualPaidLeaveId = tmp[tmp.length - 1];
    var annualPaidLeave = null;
    for(var key in this.loaded.annualPaidLeaves) {
        var annualPaidLeaveTmp = this.loaded.annualPaidLeaves[key];
        if(annualPaidLeaveTmp.id == annualPaidLeaveId) {
            annualPaidLeave = annualPaidLeaveTmp;
            break;
        }
    }
    var annualPaidLeaveEditForm = new AnnualPaidLeaveEditForm({
        "mode": 'UPDATE',
        "id": annualPaidLeave.id,
        "positionId": this.selected.positionId,
        "start": annualPaidLeave.start,
        "end": annualPaidLeave.end,
        "duration" : annualPaidLeave.duration,
        "contractType" : 'TIME_SPENT'
    }, "annualPaidLeaveEditForm", this.refreshInfo, this);
    annualPaidLeaveEditForm.init();
}

AnnualPaidLeavesManager.prototype.refreshInfo = function() {
    this.loadPositionContent();    
}
