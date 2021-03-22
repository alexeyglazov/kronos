/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PlanningItemEditForm(formData, htmlId, successHandler, successContext, options) {
    this.config = {
        endpointUrl: endpointsFolder+ "PlanningItemEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.options = options;
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "startDate": formData.startDate,
        "endDate": formData.endDate,
        "description": formData.description,
        "employee": formData.employee,
        "location": formData.location,
        "sourceSubdepartmentId": formData.sourceSubdepartmentId,
        
        "planningGroupCreationType": formData.planningGroupCreationType,
        "planningTypeId": formData.planningTypeId,
        "planningGroupDescription": formData.planningGroupDescription,
        "client": formData.client,
        "planningGroup": formData.planningGroup,
        "activityId": formData.activityId,
        "taskId": formData.taskId,
        "inChargePerson": formData.inChargePerson,
        "targetSubdepartmentId": formData.targetSubdepartmentId
    }
    this.loaded = {}
    this.planningGroupCreationTypes = {
        'CREATE': 'Create',
        'EXISTING': 'Existing'
    }    
}
PlanningItemEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
PlanningItemEditForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.subdepartmentId = this.data.targetSubdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.planningTypes = result.planningTypes;
            form.loaded.activities = result.activities;
            form.loaded.taskTypes = result.taskTypes;            
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemEditForm.prototype.loadTargetSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getTargetSubdepartmentContent";
    data.subdepartmentId = this.data.targetSubdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.planningTypes = result.planningTypes;
            form.loaded.activities = result.activities;
            form.loaded.taskTypes = result.taskTypes;            
            form.loaded.tasks = [];            
            form.data.planningTypeId = null;
            form.data.activityId = null;
            form.data.taskTypeId = null;
            form.data.taskId = null;
            form.updatePlanningTypeView();
            form.updateActivityView();
            form.updateTaskTypeView();
            form.updateTaskView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemEditForm.prototype.loadTaskTypeContent = function() {
    var form = this;
    var data = {};
    data.command = "getTaskTypeContent";
    data.taskTypeId = this.data.taskTypeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.tasks = result.tasks;            
            form.data.taskId = null;
            form.updateTaskView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Planning group</span></td><td colspan="2"><select id="' + this.htmlId + '_planningGroupCreationType' + '"></select></td></tr>';
    html += '</table>';
    
    html += '<div id="' + this.htmlId + '_planningGroupCreateBlock">';
    html += '<table>';
    html += '<tr><td><span class="label1">Group Description</span></td><td><input type="text" id="' + this.htmlId + '_planningGroupDescription" style="width: 300px;"></td><td></td></tr>';
    html += '<tr><td><span class="label1">Subdepartment</span></td><td colspan="2"><select id="' + this.htmlId + '_targetSubdepartment' + '"></select></td></tr>';
    html += '<tr><td><span class="label1">Type</span></td><td colspan="2"><select id="' + this.htmlId + '_planningType' + '"></select></td></tr>';
    html += '</table>';
    
    html += '<table id="' + this.htmlId + '_planningGroupClientBlock">';
    html += '<tr><td><span class="label1">Client</span></td><td><span id="' + this.htmlId + '_client"></span></td>';
    html += ' <td><button id="' + this.htmlId + '_client_pick">Pick</button><button id="' + this.htmlId + '_client_clear" title="Clear">Delete</button></td>';
    html += '</tr>';
    html += '<tr><td><span class="label1">Activity</span></td><td><select id="' + this.htmlId + '_activity"></td></tr>';
    html += '</table>';
    
    html += '<table id="' + this.htmlId + '_planningGroupInternalBlock">';
    html += '<tr><td><span class="label1">Task type</span></td><td><span class="label1">Task</span></span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_taskType"></td><td><select id="' + this.htmlId + '_task"></td></tr>';
    html += '</table>';
    
    html += '<table>';
    html += '<tr><td><span class="label1">Person in charge</span></td><td><span id="' + this.htmlId + '_inChargePerson"></span></td>';
    html += ' <td><button id="' + this.htmlId + '_inChargePerson_pick">Pick</button><button id="' + this.htmlId + '_inChargePerson_clear" title="Clear">Delete</button></td>';
    html += '</tr>';
    html += '</table>';
    html += '</div>';
    
    html += '<div id="' + this.htmlId + '_planningGroupExistingBlock">';
    html += '<table>';
    html += '<tr id="' + this.htmlId + '_planningGroupBlock"><td><span class="label1">Picked planning group</span></td><td><span id="' + this.htmlId + '_planningGroup"></span></td>';
    html += '<td><button id="' + this.htmlId + '_planningGroup_pick">Pick</button><button id="' + this.htmlId + '_planningGroup_clear" title="Clear">Delete</button></td>';
    html += '</tr>';
    html += '</table>';
    html += '</div>';
    
    html += '<table>';
    html += '<tr><td><span class="label1">Description</span></td><td><input type="text" id="' + this.htmlId + '_description"></td><td></td></tr>';
    html += '<tr><td><span class="label1">Location</span></td><td><input type="text" id="' + this.htmlId + '_location"></td><td></td></tr>';
    html += '<tr><td><span class="label1">Start</span></td><td><input type="text" id="' + this.htmlId + '_startDate"></td><td></td></tr>';
    html += '<tr><td><span class="label1">End</span></td><td><input type="text" id="' + this.htmlId + '_endDate"></td><td></td></tr>';
    html += '<tr><td><span class="label1">Employee</span></td><td colspan="2"><select id="' + this.htmlId + '_sourceSubdepartment' + '"></select></td></tr>';
    html += '<tr><td></td><td><span id="' + this.htmlId + '_employee"></span></td>';
    html += ' <td><button id="' + this.htmlId + '_employee_pick">Pick</button><button id="' + this.htmlId + '_employee_clear" title="Clear">Delete</button></td>';
    html += '</tr>';
    html += '</table>';
    return html;
}
PlanningItemEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
PlanningItemEditForm.prototype.makeButtons = function()  {
    var form = this;
       $('#' + this.htmlId + '_planningGroup_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.planningGroupPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_planningGroup_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.planningGroupClearHandle.call(form);
    });    
    
   $('#' + this.htmlId + '_client_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.clientPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_client_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.clientClearHandle.call(form);
    });    

   $('#' + this.htmlId + '_employee_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.employeePickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_employee_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.employeeClearHandle.call(form);
    });    
      
   $('#' + this.htmlId + '_inChargePerson_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_inChargePerson_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonClearHandle.call(form);
    });    
}
PlanningItemEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_planningGroupCreationType').bind("change", function(event) {form.planningGroupCreationTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_planningType').bind("change", function(event) {form.planningTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activity').bind("change", function(event) {form.activityChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_taskType').bind("change", function(event) {form.taskTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_task').bind("change", function(event) {form.taskChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_planningGroupDescription').bind("change", function(event) {form.planningGroupDescriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_targetSubdepartment').bind("change", function(event) {form.targetSubdepartmentChangedHandle.call(form, event);});

    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_location').bind("change", function(event) {form.locationChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_sourceSubdepartment').bind("change", function(event) {form.sourceSubdepartmentChangedHandle.call(form, event);});
}

PlanningItemEditForm.prototype.planningTypeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_planningType').val();
    if(idTxt == '') {
        this.data.planningTypeId = null;
    } else {
        this.data.planningTypeId = parseInt(idTxt);
    }
    
    this.updatePlanningTypeView();
}

PlanningItemEditForm.prototype.planningGroupDescriptionChangedHandle = function(event) {
    this.data.planningGroupDescription = jQuery.trim(event.currentTarget.value);
    this.updatePlanningGroupDescriptionView();
}
PlanningItemEditForm.prototype.planningGroupPickHandle = function() {
    var subdepartmentIds = [];
    subdepartmentIds.push(this.data.targetSubdepartmentId);
    var options = {
        htmlId: 'planningGroupPicker',
        okHandler: this.planningGroupPicked,
        okHandlerContext: this,
        moduleName: 'Planning Write',
        subdepartmentIds: subdepartmentIds,
        startDate: this.data.startDate,
        endDate: this.data.endDate
    }
    this.planningGroupPicker = new PlanningGroupPicker(options);
    this.planningGroupPicker.init();
}
PlanningItemEditForm.prototype.planningGroupPicked = function(planningGroup) {
    this.data.planningGroup = planningGroup;
    this.updatePlanningGroupView();
}
PlanningItemEditForm.prototype.planningGroupClearHandle = function() {
    this.data.planningGroup = null;
    this.updatePlanningGroupView();
}

PlanningItemEditForm.prototype.clientPickHandle = function() {
    this.clientPicker = new ClientPicker({}, "clientPicker", this.clientPicked, this, 'Planning Write');
    this.clientPicker.init();
}
PlanningItemEditForm.prototype.clientPicked = function(client) {
    this.data.client = client;
    this.updateClientView();
    this.data.activity = null;
    this.updateActivityView();    
}
PlanningItemEditForm.prototype.clientClearHandle = function() {
    this.data.client = null;
    this.updateClientView();
    this.data.activity = null;
    this.updateActivityView();    
}

PlanningItemEditForm.prototype.activityChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_activity').val();
    if(idTxt == '') {
        this.data.activityId = null;
    } else {
        this.data.activityId = parseInt(idTxt);
    }
    this.updateActivityView();
}
PlanningItemEditForm.prototype.taskTypeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_taskType').val();
    if(idTxt == '') {
        this.data.taskTypeId = null;
    } else {
        this.data.taskTypeId = parseInt(idTxt);
    }
    if(this.data.taskTypeId == null) {
        this.data.taskId = null;
        this.loaded.tasks = [];
        this.updateTaskView();
    } else {
        this.loadTaskTypeContent();
    }
}
PlanningItemEditForm.prototype.taskChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_task').val();
    if(idTxt == '') {
        this.data.taskId = null;
    } else {
        this.data.taskId = parseInt(idTxt);
    }
    this.updateTaskView();
}
PlanningItemEditForm.prototype.employeePickHandle = function() {
    if(this.data.startDate == null || this.data.endDate == null) {
        doAlert('Alert', 'Start date and End date should be set', null, null);
        return;
    }
    var options = {
        htmlId: 'employeePicker',
        okHandler: this.employeePicked,
        okHandlerContext: this,
        moduleName: 'Planning Write',
        subdepartmentId: this.data.sourceSubdepartmentId,
        startDate: this.data.startDate,
        endDate: this.data.endDate
    }
    this.employeePicker = new EmployeeInSubdepartmentPicker(options);
    this.employeePicker.init();
}
PlanningItemEditForm.prototype.employeePicked = function(employee) {
    this.data.employee = employee;
    this.updateEmployeeView();
}
PlanningItemEditForm.prototype.employeeClearHandle = function() {
    this.data.employee = null;
    this.updateEmployeeView();
}

PlanningItemEditForm.prototype.inChargePersonPickHandle = function() {
    this.employeePicker = new EmployeePicker("employeePicker", this.inChargePersonPicked, this, 'Planning Write');
    this.employeePicker.init();
}
PlanningItemEditForm.prototype.inChargePersonPicked = function(employee) {
    this.data.inChargePerson = employee;
    this.updateInChargePersonView();
}
PlanningItemEditForm.prototype.inChargePersonClearHandle = function() {
    this.data.inChargePerson = null;
    this.updateInChargePersonView();
}

PlanningItemEditForm.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = getYearMonthDateFromDateString(dateText);
    this.updateStartDateView();
}
PlanningItemEditForm.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = getYearMonthDateFromDateString(jQuery.trim(event.currentTarget.value));
    this.updateStartDateView();
}
PlanningItemEditForm.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = getYearMonthDateFromDateString(dateText);
    this.updateEndDateView();
}
PlanningItemEditForm.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = getYearMonthDateFromDateString(jQuery.trim(event.currentTarget.value));
    this.updateEndDateView();
}
PlanningItemEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateDescriptionView();
}
PlanningItemEditForm.prototype.locationChangedHandle = function(event) {
    this.data.location = jQuery.trim(event.currentTarget.value);
    this.updateLocationView();
}
PlanningItemEditForm.prototype.targetSubdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_targetSubdepartment').val();
    if(idTxt == '') {
        this.data.targetSubdepartmentId = null;
    } else {
        this.data.targetSubdepartmentId = parseInt(idTxt);
    }
    this.updateTargetSubdepartmentView();
    this.loadTargetSubdepartmentContent();
}
PlanningItemEditForm.prototype.sourceSubdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_sourceSubdepartment').val();
    if(idTxt == '') {
        this.data.sourceSubdepartmentId = null;
    } else {
        this.data.sourceSubdepartmentId = parseInt(idTxt);
    }
    this.data.employee = null;
    this.updateSourceSubdepartmentView();
    this.updateEmployeeView();
}
PlanningItemEditForm.prototype.planningGroupCreationTypeChangedHandle = function(event) {
    var id = event.currentTarget.id;
    this.data.planningGroupCreationType = $('#' + id).val();
    if(this.data.planningGroupCreationType == 'CREATE') {
    } else if(this.data.planningGroupCreationType == 'EXISTING') {
    }
    this.updatePlanningGroupCreationTypeView();
}

PlanningItemEditForm.prototype.updateView = function() {
    this.updatePlanningGroupCreationTypeView();
    this.updateTargetSubdepartmentView();
    this.updateClientView();
    this.updateActivityView();
    this.updateTaskTypeView();    
    this.updateTaskView();
    this.updatePlanningGroupView();
    this.updatePlanningTypeView();
    this.updatePlanningGroupDescriptionView();
    this.updateInChargePersonView();

    this.updateSourceSubdepartmentView();
    this.updateEmployeeView();
    this.updateDescriptionView();
    this.updateLocationView();
    this.updateStartDateView();
    this.updateEndDateView();
}
PlanningItemEditForm.prototype.updatePlanningGroupCreationTypeView = function() {
    var html = '';
    for(var key in this.planningGroupCreationTypes) {
        var planningGroupCreationType = this.planningGroupCreationTypes[key];
        var isSelected = "";
        if(key == this.data.planningGroupCreationType) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + planningGroupCreationType + '</option>';
    }
    $('#' + this.htmlId + '_planningGroupCreationType').html(html);
    if(this.data.planningGroupCreationType == 'CREATE') {
        $('#' + this.htmlId + '_planningGroupCreateBlock').show();
        $('#' + this.htmlId + '_planningGroupExistingBlock').hide();
    } else if(this.data.planningGroupCreationType == 'EXISTING') {
        $('#' + this.htmlId + '_planningGroupCreateBlock').hide();
        $('#' + this.htmlId + '_planningGroupExistingBlock').show();       
    } else if(this.data.planningGroupCreationType == 'NONE') {
        $('#' + this.htmlId + '_planningGroupCreateBlock').hide();
        $('#' + this.htmlId + '_planningGroupExistingBlock').hide();
    }    
}
PlanningItemEditForm.prototype.updatePlanningGroupView = function() {
    var html = '';
    if(this.data.planningGroup != null) {
        html += this.data.planningGroup.description;
    } else {
        html += 'Undefined';
    }
    $('#' + this.htmlId + '_planningGroup').html(html);
}
PlanningItemEditForm.prototype.updateTargetSubdepartmentView = function() {
    var html = '';
    for(var key in this.options.targetSubdepartments) {
        var subdepartment = this.options.targetSubdepartments[key];
        var isSelected = "";
        if(subdepartment.subdepartmentId == this.data.targetSubdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.subdepartmentId +'" ' + isSelected + '>' + subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName + '</option>';
    }
    $('#' + this.htmlId + '_targetSubdepartment').html(html);
}
PlanningItemEditForm.prototype.updateSourceSubdepartmentView = function() {
    var html = '';
    for(var key in this.options.sourceSubdepartments) {
        var subdepartment = this.options.sourceSubdepartments[key];
        var isSelected = "";
        if(subdepartment.subdepartmentId == this.data.sourceSubdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.subdepartmentId +'" ' + isSelected + '>' + subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName + '</option>';
    }
    $('#' + this.htmlId + '_sourceSubdepartment').html(html);
}
PlanningItemEditForm.prototype.updateClientView = function() {
    if(this.data.client != null) {
        $('#' + this.htmlId + '_client').html(this.data.client.name);
    } else {
        $('#' + this.htmlId + '_client').html('Undefined');
    }
}
PlanningItemEditForm.prototype.updateActivityView = function() {
    var html = '';
    html += '<option value="" >...</option>';
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
PlanningItemEditForm.prototype.updateTaskTypeView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.taskTypes) {
        var taskType = this.loaded.taskTypes[key];
        var isSelected = "";
        if(taskType.id == this.data.taskTypeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ taskType.id +'" ' + isSelected + '>' + taskType.name + '</option>';
    }
    $('#' + this.htmlId + '_taskType').html(html);
}
PlanningItemEditForm.prototype.updateTaskView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.tasks) {
        var task = this.loaded.tasks[key];
        var isSelected = "";
        if(task.id == this.data.taskId) {
           isSelected = "selected";
        }
        html += '<option value="'+ task.id +'" ' + isSelected + '>' + task.name + '</option>';
    }
    $('#' + this.htmlId + '_task').html(html);
}

PlanningItemEditForm.prototype.updatePlanningTypeView = function() {
    var type = null;
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.planningTypes) {
        var planningType = this.loaded.planningTypes[key];
        var isSelected = "";
        if(planningType.id == this.data.planningTypeId) {
            type = planningType;
           isSelected = "selected";
        }
        html += '<option value="'+ planningType.id +'" ' + isSelected + '>' + planningType.name + '</option>';
    }
    $('#' + this.htmlId + '_planningType').html(html);
    if(type == null) {
        $('#' + this.htmlId + '_planningGroupClientBlock').hide();
        $('#' + this.htmlId + '_planningGroupInternalBlock').hide();        
    } else if(type.isInternal) {
        $('#' + this.htmlId + '_planningGroupClientBlock').hide();
        $('#' + this.htmlId + '_planningGroupInternalBlock').show();        
    } else {
        $('#' + this.htmlId + '_planningGroupClientBlock').show();
        $('#' + this.htmlId + '_planningGroupInternalBlock').hide();
    }
}
PlanningItemEditForm.prototype.updatePlanningGroupDescriptionView = function() {
    $('#' + this.htmlId + '_planningGroupDescription').val(this.data.planningGroupDescription);
}

PlanningItemEditForm.prototype.updateEmployeeView = function() {
    var html = '';
    if(this.data.employee != null) {
        html += this.data.employee.firstName + ' ' + this.data.employee.lastName + ' (' + this.data.employee.userName + ')';
    } else {
        html += 'Undefined';
    }
    $('#' + this.htmlId + '_employee').html(html);
}
PlanningItemEditForm.prototype.updateDescriptionView = function() {
    $('#' + this.htmlId + '_description').val(this.data.description);
}
PlanningItemEditForm.prototype.updateLocationView = function() {
    $('#' + this.htmlId + '_location').val(this.data.location);
}
PlanningItemEditForm.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.data.startDate));
}
PlanningItemEditForm.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.data.endDate));
}
PlanningItemEditForm.prototype.updateInChargePersonView = function() {
    var html = '';
    if(this.data.inChargePerson != null) {
        html += this.data.inChargePerson.firstName + ' ' + this.data.inChargePerson.lastName + ' (' + this.data.inChargePerson.userName + ')';
    } else {
        html += 'Undefined';
    }
    $('#' + this.htmlId + '_inChargePerson').html(html);    
}
PlanningItemEditForm.prototype.show = function() {
    var title = 'Update Planning item'
    if(this.data.mode == 'CREATE') {
        title = 'Create Planning item';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.makeButtons();
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 600,
        buttons: {
            Ok: function() {
                form.save();
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
PlanningItemEditForm.prototype.validate = function() {
    var errors = [];
    var nameRE = /^[a-zA-Z0-9-+&]*/;
    var codeNameRE = /^[A-Z0-9-+&]*$/;
    if(this.data.description == null || this.data.description == "") {
        errors.push("Description is not set");
    }
    if(this.data.location == null || this.data.location == "") {
    } else if(this.data.location.length > 15) {
        errors.push("Location should not be longer then 15 characters");
    }
    if(this.data.employee == null) {
        errors.push("Employee is not set");
    }
    if(this.data.startDate == null) {
        errors.push("Start date is not set");
    }
    if(this.data.endDate == null) {
        errors.push("End date is not set");
    }
    if(this.data.startDate != null && this.data.endDate != null && compareYearMonthDate(this.data.startDate, this.data.endDate) > 0) {
        errors.push("End date is less than Start date");
    }
    if(this.data.targetSubdepartmentId == null) {
        errors.push("Subdepartment is not set");
    }
    if(this.data.sourceSubdepartmentId == null) {
        errors.push("Source Subdepartment is not set");
    }
    if(this.data.planningGroupCreationType == 'EXISTING' && this.data.planningGroup == null) {
        errors.push("Group is not selected");
    }
    if(this.data.planningGroupCreationType == 'CREATE') {
        if(this.data.planningTypeId == null) {
            errors.push('Planning type is not set');
        } else {
            var type = null;
            for(var key in this.loaded.planningTypes) {
                var planningType = this.loaded.planningTypes[key];
                if(this.data.planningTypeId == planningType.id) {
                    type = planningType;
                    break;
                }
            }
            if(type.isInternal) {
                if(this.data.taskId == null) {
                    errors.push('Task is not set');
                }
            } else {
                if(this.data.client == null) {
                    errors.push('Client is not set');
                }            
            } 
        }
        if(this.data.planningGroupDescription == null || this.data.planningGroupDescription == '') {
            errors.push('Group Description is not set');
        }
        if(this.data.inChargePerson == null) {
            errors.push('Person in charge is not set');
        }
        if(this.data.targetSubdepartmentId == null) {
            errors.push('Subdepartment is not set');
        }
    }
    return errors;
}
PlanningItemEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = {
        "mode": this.data.mode,
        "id": this.data.id,
        "startDate": this.data.startDate,
        "endDate": this.data.endDate,
        "description": this.data.description,
        "location": this.data.location,
        "clientId": this.data.client != null ? this.data.client.id : null,
        "activityId": this.data.activityId,
        "taskId": this.data.taskId,
        "employeeId": this.data.employee != null ? this.data.employee.id : null,
        "inChargePersonId": this.data.inChargePerson != null ? this.data.inChargePerson.id : null,
        "planningGroupId": this.data.planningGroup != null ? this.data.planningGroup.id : null,
        "targetSubdepartmentId": this.data.targetSubdepartmentId,
        "sourceSubdepartmentId": this.data.sourceSubdepartmentId,
        "planningGroupCreationType": this.data.planningGroupCreationType,
        "planningGroupName": this.data.planningGroupName,
        "planningGroupDescription": this.data.planningGroupDescription,
        "planningTypeId": this.data.planningTypeId
    }
    var form = this;
    var data = {};
    data.command = "savePlanningItem";
    data.planningItemEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.data.id = result.id;
            $.sticky('Planning Item has been successfully saved');
            form.dataChanged(false);
            form.afterSave(result.planningToolInfo);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemEditForm.prototype.afterSave = function(planningToolInfo) {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext, planningToolInfo);
}
PlanningItemEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function PlanningItemDeleteForm(planningItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "PlanningItemEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": planningItemId
    }
}
PlanningItemDeleteForm.prototype.init = function() {
    this.checkDependencies();
}
PlanningItemDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkPlanningItemDependencies";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemDeleteForm.prototype.analyzeDependencies = function(dependencies) {
  // there are no dependant entities now at all
    if(true) {
        this.show();
    } else {
        var html = 'This Planning Item has dependencies and can not be deleted<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
PlanningItemDeleteForm.prototype.show = function() {
    doConfirm("Confirm", "Do you really want to delete this Planning Item", this, this.doDeletePlanningItem, null, null);
}
PlanningItemDeleteForm.prototype.doDeletePlanningItem = function() {
    var form = this;
    var data = {};
    data.command = "deletePlanningItem";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            $.sticky('Planning Item has been successfully deleted');
            form.afterSave();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}