/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PlanningItemBatchCreationForm(formData, htmlId, successHandler, successContext, options) {
    this.config = {
        endpointUrl: endpointsFolder+ "PlanningItemBatchCreationForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.options = options;
    this.picked = {
        projectCodes: []
    }
    this.selected = {
        projectCodeId: null
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "planningTypeId": formData.planningTypeId,
        "description": formData.description,
        "isApproved": formData.isApproved,
        "client": formData.client,
        "projectCodes": formData.projectCodes,
        "taskId": formData.taskId,
        "inChargePerson": formData.inChargePerson,
        "targetSubdepartmentId": formData.targetSubdepartmentId,
        "items": formData.items
//      item
//        "id": formData.id,
//        "startDate": formData.startDate,
//        "endDate": formData.endDate,
//        "sourceSubdepartmentId": formData.sourceSubdepartmentId,
//        "employee": formData.employee,
//        "location": formData.location
//        "description": formData.description
    }
    this.loaded = {}
}
PlanningItemBatchCreationForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
PlanningItemBatchCreationForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    if(this.data.mode == 'CREATE') {
        data.subdepartmentId = this.data.targetSubdepartmentId;
    } else {
        data.planningGroupId = this.data.id;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            if(form.data.mode == 'CREATE') {
                form.loaded.planningTypes = result.planningTypes;
                form.loaded.taskTypes = result.taskTypes;
            } else {
                form.loaded.planningTypes = result.planningTypes;
                form.loaded.taskTypes = result.taskTypes;
                form.data.taskTypeId = result.taskTypeId;
                form.loaded.tasks = result.tasks;
            }            
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemBatchCreationForm.prototype.loadTargetSubdepartmentContent = function() {
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
            form.loaded.taskTypes = result.taskTypes;            
            form.loaded.tasks = [];            
            form.data.planningTypeId = null;
            form.data.projectCodes = [];
            form.data.taskTypeId = null;
            form.data.taskId = null;
            form.updatePlanningTypeView();
            form.updateProjectCodesView();
            form.updateTaskTypeView();
            form.updateTaskView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemBatchCreationForm.prototype.loadTaskTypeContent = function() {
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
PlanningItemBatchCreationForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Group Description</span></td><td><input type="text" id="' + this.htmlId + '_description" style="width: 300px;"></td><td></td></tr>';
    html += '<tr><td><span class="label1">Subdepartment</span></td><td colspan="2"><select id="' + this.htmlId + '_targetSubdepartment' + '"></select></td></tr>';
    html += '<tr><td><span class="label1">Type</span></td><td colspan="2"><select id="' + this.htmlId + '_planningType' + '"></select></td></tr>';
    html += '</table>';
    
    html += '<table id="' + this.htmlId + '_planningGroupClientBlock">';
    html += '<tr><td><span class="label1">Client</span></td><td><span id="' + this.htmlId + '_client"></span></td>';
    html += '<td><button id="' + this.htmlId + '_client_pick">Pick</button><button id="' + this.htmlId + '_client_clear" title="Clear">Delete</button></td>';
    html += '</tr>';
    html += '<tr id="' + this.htmlId + '_projectCodes_block"><td style="vertical-align: top;"><span class="label1">Project code</span></td><td style="vertical-align: top;"><div class="selector" style="width: 500px; height: 60px;" id="' + this.htmlId + '_projectCodes"></div></td>';
    html += '<td style="vertical-align: top;"><button id="' + this.htmlId + '_projectCode_pick">Pick</button><button id="' + this.htmlId + '_projectCode_clear" title="Clear">Delete</button></td>';
    html += '</tr>';
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
    html += '<table>';   
    html += '<tr><td><span class="label1">Approved</span></td><td><input type="checkbox" id="' + this.htmlId + '_isApproved"></td></tr>';
    html += '</table>';   
   
    html += '<div id="' + this.htmlId + '_items"></div>'
    html += '<button id="' + this.htmlId + '_addItem">Add item</button>';
    return html;
}
PlanningItemBatchCreationForm.prototype.getItemsHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td><span class="label1">Start</span></td>';
    html += '<td><span class="label1">End</span></td>';
    html += '<td><span class="label1">Subdepartment / Employee</span></td>';
    html += '<td></td>';
    html += '<td></td>';
    html += '<td><span class="label1">Description</span></td>';
    html += '<td><span class="label1">Location</span></td>';
    html += '<td><span class="label1">Delete</span></td>';
    html += '</tr>';
    for(var key in this.data.items) {
        var item = this.data.items[key];
        html += '<tr>';
        html += '<td><input type="text" id="' + this.htmlId + '_startDate_' + key + '" style="width: 80px;"></td>';
        html += '<td><input type="text" id="' + this.htmlId + '_endDate_' + key + '" style="width: 80px;"></td>';
        html += '<td><select id="' + this.htmlId + '_sourceSubdepartment_' + key + '"></select>';
        html += '<span id="' + this.htmlId + '_employee_' + key + '"></span></td>';
        html += '<td><button id="' + this.htmlId + '_employee_pick_' + key + '">Pick</button></td>';
        html += '<td><button id="' + this.htmlId + '_employee_clear_' + key + '" title="Clear">Delete</button></td>';
        html += '<td><input type="text" id="' + this.htmlId + '_description_' + key + '"></td>';
        html += '<td><input type="text" id="' + this.htmlId + '_location_' + key + '"></td>';
        html += '<td><button id="' + this.htmlId + '_item_clear_' + key + '" title="Delete item">Delete</button></td>';
        html += '</tr>';
    }
    html += '</table>';
    return html;
}
PlanningItemBatchCreationForm.prototype.makeDatePickers = function() {
    var form = this;
}
PlanningItemBatchCreationForm.prototype.makeButtons = function()  {
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

   $('#' + this.htmlId + '_projectCode_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.projectCodePickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_projectCode_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.projectCodeClearHandle.call(form);
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
    
    $('#' + this.htmlId + '_addItem')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: false
        })
      .click(function( event ) {
        form.addItemHandle.call(form);
    });
}
PlanningItemBatchCreationForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_planningType').bind("change", function(event) {form.planningTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_taskType').bind("change", function(event) {form.taskTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_task').bind("change", function(event) {form.taskChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isApproved').bind("click", function(event) {form.isApprovedChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_targetSubdepartment').bind("change", function(event) {form.targetSubdepartmentChangedHandle.call(form, event);});
}

PlanningItemBatchCreationForm.prototype.clientPickHandle = function() {
    this.clientPicker = new ClientPicker({}, "clientPicker", this.clientPicked, this, 'Planning Write');
    this.clientPicker.init();
}
PlanningItemBatchCreationForm.prototype.clientPicked = function(client) {
    var isDifferent = false;
    if(this.data.client != null && this.data.client.id != client.id) {
        isDifferent = true;
    }
    this.data.client = client;
    this.updateClientView();
    if(isDifferent) {
    this.data.projectCodes = [];
    this.updateProjectCodesView();
    }
}
PlanningItemBatchCreationForm.prototype.clientClearHandle = function() {
    this.data.client = null;
    this.updateClientView();
    this.data.projectCodes = [];
    this.updateProjectCodesView();    
}




PlanningItemBatchCreationForm.prototype.projectCodePickHandle = function() {
    var options = {
        "mode": 'SINGLE',
        "restriction": {
            client: this.data.client,
            subdepartment: null
        }
    };
    for(var key in this.options.targetSubdepartments) {
        var subdepartmentTmp = this.options.targetSubdepartments[key];
        if(this.data.targetSubdepartmentId == subdepartmentTmp.subdepartmentId) {
           options.restriction.subdepartment = {
               id: subdepartmentTmp.subdepartmentId,
               name: subdepartmentTmp.subdepartmentName
           }
           options.restriction.office = {
               id: subdepartmentTmp.officeId,
               name: subdepartmentTmp.officeName
           }
           break;
        }
    }
    this.projectCodePicker = new ProjectCodePicker(options, "projectCodePicker", this.projectCodePicked, this, this.moduleName);
    this.projectCodePicker.init();
}
PlanningItemBatchCreationForm.prototype.projectCodePicked = function(pickedProjectCode) {
//    for(var key in pickedProjectCodes) {
//        var pickedProjectCode = pickedProjectCodes[key];
        var exists = false;
        for(var key2 in this.data.projectCodes) {
            var projectCode2 = this.data.projectCodes[key2];
            if(pickedProjectCode.id == projectCode2.id) {
                exists = true;
                break;
            }
        }
        if(! exists) {
            this.data.projectCodes.push(pickedProjectCode);
        }
//    }
    this.updateProjectCodesView();
}
PlanningItemBatchCreationForm.prototype.projectCodeClearHandle = function() {
    if(this.selected.projectCodeId == null) {
        doAlert('Alert', 'Project code is not selected', null, null);
        return;
    }
    var index = null;
    for(var key in this.data.projectCodes) {
        if(this.data.projectCodes[key].id == this.selected.projectCodeId) {
            index = key;
            break;
        }
    }
    if(index != null) {
        this.data.projectCodes.splice(index, 1);
        this.selected.projectCodeId = null;
        this.updateProjectCodesView();
    }
}
PlanningItemBatchCreationForm.prototype.projectCodeClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    this.selected.projectCodeId = parseInt(tmp[tmp.length - 1]);
    this.updateProjectCodesView();
}




PlanningItemBatchCreationForm.prototype.taskTypeChangedHandle = function(event) {
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
PlanningItemBatchCreationForm.prototype.taskChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_task').val();
    if(idTxt == '') {
        this.data.taskId = null;
    } else {
        this.data.taskId = parseInt(idTxt);
    }
    this.updateTaskView();
}

PlanningItemBatchCreationForm.prototype.employeePickHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);
    this.editedItemIndex = index;

    if(this.data.items[index].startDate == null || this.data.items[index].endDate == null) {
        doAlert('Alert', 'Start date and End date should be set', null, null);
        return;
    }
    var options = {
        htmlId: 'employeePicker',
        okHandler: this.employeePicked,
        okHandlerContext: this,
        moduleName: 'Planning Write',
        subdepartmentId: this.data.items[index].sourceSubdepartmentId,
        startDate: this.data.items[index].startDate,
        endDate: this.data.items[index].endDate
    }
    this.employeePicker = new EmployeeInSubdepartmentPicker(options);
    this.employeePicker.init();
}
PlanningItemBatchCreationForm.prototype.employeePicked = function(employee) {
    this.data.items[this.editedItemIndex].employee = employee;
    this.updateEmployeeView();
}
PlanningItemBatchCreationForm.prototype.employeeClearHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);
    
    this.data.items[index].employee = null;
    this.updateEmployeeView();
}
PlanningItemBatchCreationForm.prototype.itemClearHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);
    
    this.data.items.splice(index, 1);
    this.updateItemsView();
}

PlanningItemBatchCreationForm.prototype.inChargePersonPickHandle = function() {
    this.employeePicker = new EmployeePicker("employeePicker", this.inChargePersonPicked, this, 'Planning Write');
    this.employeePicker.init();
}
PlanningItemBatchCreationForm.prototype.inChargePersonPicked = function(employee) {
    this.data.inChargePerson = employee;
    this.updateInChargePersonView();
}
PlanningItemBatchCreationForm.prototype.inChargePersonClearHandle = function() {
    this.data.inChargePerson = null;
    this.updateInChargePersonView();
}
PlanningItemBatchCreationForm.prototype.addItemHandle = function() {
    if(this.options.sourceSubdepartments.length == 0) {
        doAlert('Alert', 'No subdepartments available', null, null);
        return;
    }
    var item = null;
    if(this.data.items.length > 0) {
        var itemTmp = this.data.items[this.data.items.length - 1];
        item = {
            "startDate": itemTmp.startDate,
            "endDate": itemTmp.endDate,
            "sourceSubdepartmentId":  itemTmp.sourceSubdepartmentId,
            "employee": itemTmp.employee,
            "description": itemTmp.description,
            "location": itemTmp.location             
        }
    } else {
        item = {
            "startDate": this.options.date,
            "endDate": this.options.date,
            "sourceSubdepartmentId":  this.options.sourceSubdepartmentId,
            "employee": null,
            "description": null,
            "location": null             
        }        
    }
    this.data.items.push(item);
    this.updateItemsView();
}

PlanningItemBatchCreationForm.prototype.startDateChangedHandle = function(dateText, inst) {
    var id = inst.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);
    
    this.data.items[index].startDate = getYearMonthDateFromDateString(dateText);
    this.updateStartDateView();
    if(this.data.items[index].endDate == null) {
        this.data.items[index].endDate = this.data.items[index].startDate;
    }
    this.updateEndDateView();
}
PlanningItemBatchCreationForm.prototype.startDateTextChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);

    this.data.items[index].startDate = getYearMonthDateFromDateString(jQuery.trim(event.currentTarget.value));
    this.updateStartDateView();
    if(this.data.items[index].endDate == null) {
        this.data.items[index].endDate = this.data.items[index].startDate;
    }
    this.updateEndDateView();
}
PlanningItemBatchCreationForm.prototype.endDateChangedHandle = function(dateText, inst) {
    var id = inst.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);
    
    this.data.items[index].endDate = getYearMonthDateFromDateString(dateText);
    this.updateEndDateView();
    if(this.data.items[index].startDate == null) {
        this.data.items[index].startDate = this.data.items[index].endDate;
    }
    this.updateStartDateView();
}
PlanningItemBatchCreationForm.prototype.endDateTextChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);

    this.data.items[index].endDate = getYearMonthDateFromDateString(jQuery.trim(event.currentTarget.value));
    this.updateEndDateView();
    if(this.data.items[index].startDate == null) {
        this.data.items[index].startDate = this.data.items[index].endDate;
    }    
    this.updateStartDateView();
}
PlanningItemBatchCreationForm.prototype.planningTypeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_planningType').val();
    if(idTxt == '') {
        this.data.planningTypeId = null;
    } else {
        this.data.planningTypeId = parseInt(idTxt);
    }
    
    this.updatePlanningTypeView();
}
PlanningItemBatchCreationForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateDescriptionView();
}
PlanningItemBatchCreationForm.prototype.isApprovedChangedHandle = function(event) {
    if($(event.currentTarget).is(':checked')) {
        this.data.isApproved = true;
    } else {
        this.data.isApproved = false;
    }
    this.updateIsApprovedView();
}
PlanningItemBatchCreationForm.prototype.itemDescriptionChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);
    
    this.data.items[index].description = jQuery.trim(event.currentTarget.value);
    this.updateItemDescriptionView();
}
PlanningItemBatchCreationForm.prototype.locationChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);
    
    this.data.items[index].location = jQuery.trim(event.currentTarget.value);
    this.updateLocationView();
}
PlanningItemBatchCreationForm.prototype.targetSubdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_targetSubdepartment').val();
    if(idTxt == '') {
        this.data.targetSubdepartmentId = null;
    } else {
        this.data.targetSubdepartmentId = parseInt(idTxt);
    }
    this.updateTargetSubdepartmentView();
    this.loadTargetSubdepartmentContent();
}
PlanningItemBatchCreationForm.prototype.sourceSubdepartmentChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = parseInt(tmp[tmp.length - 1]);

    var idTxt = $('#' + this.htmlId + '_sourceSubdepartment_' + index).val();
    if(idTxt == '') {
        this.data.items[index].sourceSubdepartmentId = null;
    } else {
        this.data.items[index].sourceSubdepartmentId = parseInt(idTxt);
    }
    this.data.items[index].employee = null;
    this.updateSourceSubdepartmentView();
    this.updateEmployeeView();
}
PlanningItemBatchCreationForm.prototype.updateView = function() {
    this.updateTargetSubdepartmentView();
    this.updateClientView();
    this.updateProjectCodesView();
    this.updateTaskTypeView();
    this.updateTaskView();
    this.updatePlanningTypeView();
    this.updateDescriptionView();
    this.updateIsApprovedView();
    this.updateInChargePersonView();
    this.updateItemsView();
}

PlanningItemBatchCreationForm.prototype.updateTargetSubdepartmentView = function() {
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
PlanningItemBatchCreationForm.prototype.updateSourceSubdepartmentView = function() {
    for(var key in this.data.items) {
        var item = this.data.items[key];
        var html = '';
        for(var key2 in this.options.sourceSubdepartments) {
            var subdepartment = this.options.sourceSubdepartments[key2];
            var isSelected = "";
            if(subdepartment.subdepartmentId == item.sourceSubdepartmentId) {
               isSelected = "selected";
            }
            html += '<option value="'+ subdepartment.subdepartmentId +'" ' + isSelected + '>' + subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName + '</option>';
        }
        $('#' + this.htmlId + '_sourceSubdepartment_' + key).html(html);
    }
}
PlanningItemBatchCreationForm.prototype.updateClientView = function() {
    if(this.data.client != null) {
        $('#' + this.htmlId + '_client').html(this.data.client.name);
        $('#' + this.htmlId + '_projectCodes_block').show('slow');
    } else {
        $('#' + this.htmlId + '_client').html('Undefined');
        $('#' + this.htmlId + '_projectCodes_block').hide('slow');
    }
}
PlanningItemBatchCreationForm.prototype.updateProjectCodesView = function() {
    var html = '';
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        var classSelected = "";
        if(projectCode.id == this.selected.projectCodeId) {
           classSelected = 'class="selected"';
        }
        html += '<div id="' + this.htmlId + '_projectCode_' + projectCode.id + '" ' + classSelected + '>' + projectCode.code + '</div>';
    }
    $('#' + this.htmlId + '_projectCodes').html(html);
    var form = this;
    $('div[id^="' + this.htmlId + '_projectCode_"]').bind("click", function(event) {form.projectCodeClickedHandle(event);});
}

PlanningItemBatchCreationForm.prototype.updateTaskTypeView = function() {
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
PlanningItemBatchCreationForm.prototype.updateTaskView = function() {
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
PlanningItemBatchCreationForm.prototype.updateEmployeeView = function() {
    for(var key in this.data.items) {
        var item = this.data.items[key];
        var html = '';
        if(item.employee != null) {
            html += item.employee.firstName + ' ' + item.employee.lastName + ' (' + item.employee.userName + ')';
        } else {
            html += 'Undefined';
        }
        $('#' + this.htmlId + '_employee_' + key).html(html);
    }    
}
PlanningItemBatchCreationForm.prototype.updatePlanningTypeView = function() {
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
PlanningItemBatchCreationForm.prototype.updateDescriptionView = function() {
    $('#' + this.htmlId + '_description').val(this.data.description);
}
PlanningItemBatchCreationForm.prototype.updateIsApprovedView = function() {
    $('#' + this.htmlId + '_isApproved').attr('checked', this.data.isApproved);
}
PlanningItemBatchCreationForm.prototype.updateItemDescriptionView = function() {
    for(var key in this.data.items) {
        var item = this.data.items[key];
        $('#' + this.htmlId + '_description_' + key).val(item.description);
    }    
}
PlanningItemBatchCreationForm.prototype.updateLocationView = function() {
    for(var key in this.data.items) {
        var item = this.data.items[key];
        $('#' + this.htmlId + '_location_' + key).val(item.location);
    }    
}
PlanningItemBatchCreationForm.prototype.updateStartDateView = function() {
    for(var key in this.data.items) {
        var item = this.data.items[key];
        $('#' + this.htmlId + '_startDate_' + key).val(getStringFromYearMonthDate(item.startDate));
    }    
}
PlanningItemBatchCreationForm.prototype.updateEndDateView = function() {
    for(var key in this.data.items) {
        var item = this.data.items[key];
        $('#' + this.htmlId + '_endDate_' + key).val(getStringFromYearMonthDate(item.endDate));
    }    
}
PlanningItemBatchCreationForm.prototype.updateInChargePersonView = function() {
    var html = '';
    if(this.data.inChargePerson != null) {
        html += this.data.inChargePerson.firstName + ' ' + this.data.inChargePerson.lastName + ' (' + this.data.inChargePerson.userName + ')';
    } else {
        html += 'Undefined';
    }
    $('#' + this.htmlId + '_inChargePerson').html(html);    
}
PlanningItemBatchCreationForm.prototype.updateItemsView = function() {
    $('#' + this.htmlId + '_items').html(this.getItemsHtml());

    var form = this;
    $('select[id^="' + this.htmlId + '_sourceSubdepartment_"]').bind("change", function(event) {form.sourceSubdepartmentChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_description_"]').bind("change", function(event) {form.itemDescriptionChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_location_"]').bind("change", function(event) {form.locationChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_startDate_"]').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_endDate_"]').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event);});

    $('input[id^="' + this.htmlId + '_startDate_"]').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $('input[id^="' + this.htmlId + '_endDate_"]').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
    
    $('button[id^="' + this.htmlId + '_employee_pick_"]')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.employeePickHandle.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_employee_clear_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.employeeClearHandle.call(form, event);
    });    

    $('button[id^="' + this.htmlId + '_item_clear_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.itemClearHandle.call(form, event);
    });
    
    this.updateEmployeeView();
    this.updateSourceSubdepartmentView();
    this.updateItemDescriptionView();
    this.updateLocationView();
    this.updateStartDateView();
    this.updateEndDateView();
}
PlanningItemBatchCreationForm.prototype.show = function() {
    var title = 'Update Planning group'
    if(this.data.mode == 'CREATE') {
        title = 'Create Planning group';
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
        width: 900,
        height: 500,
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
PlanningItemBatchCreationForm.prototype.validate = function() {
    var errors = [];
    var nameRE = /^[a-zA-Z0-9-+&]*/;
    var codeNameRE = /^[A-Z0-9-+&]*$/;
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
            if(this.data.inChargePerson == null) {
                errors.push('Person in charge is not set');
            }                
        }            
    }
    if(this.data.description == null || this.data.description == '') {
        errors.push('Group Description is not set');
    }
    if(this.data.targetSubdepartmentId == null) {
        errors.push('Subdepartment is not set');
    }

    if(this.data.items.length == 0) {
        errors.push('There must be created at least one item');
    } else {
        for(var key in this.data.items) {
            var item = this.data.items[key];
            if(item.description == null || item.description == '') {
                errors.push('Description is not set (Item ' + key + ')');
            }
            if(item.location == null || item.location == '') {
            } else if(item.location.length > 15) {
                errors.push('Location should not be longer then 15 characters (Item ' + key + ')');
            }
            if(item.employee == null) {
                errors.push('Employee is not set (Item ' + key + ')');
            }
            if(item.startDate == null) {
                errors.push('Start date is not set (Item ' + key + ')');
            }
            if(item.endDate == null) {
                errors.push('End date is not set (Item ' + key + ')');
            }
            if(item.startDate != null && item.endDate != null && compareYearMonthDate(item.startDate, item.endDate) > 0) {
                errors.push('End date is less than Start date (Item ' + key + ')');
            }
            if(item.sourceSubdepartmentId == null) {
                errors.push('Source Subdepartment is not set (Item ' + key + ')');
            }
        }
    }
    return errors;
}
PlanningItemBatchCreationForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = {
        "mode": this.data.mode,
        "id": this.data.id,
        "planningTypeId": this.data.planningTypeId,
        "description": this.data.description,
        "isApproved": this.data.isApproved,
        "clientId": this.data.client != null ? this.data.client.id : null,
        "projectCodeIds": [],
        "taskId": this.data.taskId,
        "inChargePersonId": this.data.inChargePerson != null ? this.data.inChargePerson.id : null,
        "targetSubdepartmentId": this.data.targetSubdepartmentId,
        "items": []
    }
    var type = null;
    for(var key in this.loaded.planningTypes) {
        var planningType = this.loaded.planningTypes[key];
        if(this.data.planningTypeId == planningType.id) {
            type = planningType;
            break;
        }
    }    
    if(type != null && type.isInternal != true) {
        for(var key in this.data.projectCodes) {
            var projectCode = this.data.projectCodes[key];
            serverFormatData.projectCodeIds.push(projectCode.id);
        }
    }
    for(var key in this.data.items) {
        var item = this.data.items[key];
        serverFormatData.items.push({
            "id": item.id,
            "startDate": item.startDate,
            "endDate": item.endDate,
            "sourceSubdepartmentId": item.sourceSubdepartmentId,
            "employeeId": item.employee != null ? item.employee.id : null,
            "description": item.description,
            "location": item.location
        });
    }
    var form = this;
    var data = {};
    data.command = "savePlanningItemBatch";
    data.planningItemsBatchCreationForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            $.sticky('Planning Items have been successfully saved');
            form.dataChanged(false);
            form.afterSave(result.planningToolInfo);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningItemBatchCreationForm.prototype.afterSave = function(planningToolInfo) {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext, planningToolInfo);
}
PlanningItemBatchCreationForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function PlanningGroupDeleteForm(planningItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "PlanningItemBatchCreationForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": planningItemId
    }
}
PlanningGroupDeleteForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.checkDependencies();
}
PlanningGroupDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkPlanningGroupDependencies";
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
PlanningGroupDeleteForm.prototype.analyzeDependencies = function(dependencies) {
  // there are no dependant entities now at all
    //if(true) {
    //    this.show();
    //} else {
    //    var html = 'This Planning Item has dependencies and can not be deleted<br />';
    //    doAlert("Dependencies found", html, null, null);
    //}
    this.data.dependentPlanningItemsCount = dependencies.planningItemsCount;
    this.show();
}
PlanningGroupDeleteForm.prototype.getHtml = function() {
    var html = '';
    html += 'Number of dependent Planning Items is <span id="' + this.htmlId + '_planningItemsCount' + '"></span><br />';
    html += 'Proceed to delete this Planning Group with all its items?';
    return html;
}
PlanningGroupDeleteForm.prototype.setHandlers = function() {
    var form = this;
}
PlanningGroupDeleteForm.prototype.updateView = function() {
    this.updatePlanningItemsCountView();
}
PlanningGroupDeleteForm.prototype.updatePlanningItemsCountView = function() {
    $('#' + this.htmlId + '_planningItemsCount').html(this.data.dependentPlanningItemsCount);
}

PlanningGroupDeleteForm.prototype.show = function() {
    var title = 'Confirm';
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 300,
        height: 200,
        buttons: {
            Ok: function() {
                form.doDeletePlanningGroup();
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
PlanningGroupDeleteForm.prototype.doDeletePlanningGroup = function() {
    var form = this;
    var data = {};
    data.command = "deletePlanningGroup";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            $.sticky('Planning Group has been successfully deleted');
            form.afterSave();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningGroupDeleteForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}