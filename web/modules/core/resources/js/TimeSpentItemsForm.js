/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function TimeSpentItemsForm(mode, htmlId, projectCodeId, taskId, year, month, days, timeSheet, successContext, successHandler) {
    this.htmlId = htmlId;
    this.loaded = {
        "taskOffices": [],
        "taskDepartments": [],
        "taskSubdepartments": [],
        "projectCodeOffices": [],
        "projectCodeDepartments": [],
        "projectCodeSubdepartments": [],
        "taskTypes": [],
        "tasks": [],
        "clients": [],
        "projectCodes": [], 
        "isMonthClosed": false
    }
    this.selected = {
        "taskOfficeId": null,
        "taskDepartmentId": null,
        "taskSubdepartmentId": null,
        "projectCodeOfficeId": null,
        "projectCodeDepartmentId": null,
        "projectCodeSubdepartmentId": null,
        "clientId": null,
        "projectCodeId": null,
        "taskTypeId": null,
        "taskId": null
    }
    this.mode = mode;
    this.projectCodeId = projectCodeId;
    this.taskId = taskId;
    this.year = year;
    this.month = month;
    this.days = days;
    this.items = [];
    this.timeSheet = timeSheet;
    this.successContext = successContext;
    this.successHandler = successHandler;
    this.config = {
        endpointUrl: endpointsFolder + "TimeSheet.jsp"
    };
    this.dataUpdated = false;
}
TimeSpentItemsForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
TimeSpentItemsForm.prototype.loadInitialContent = function() {
    if(this.mode == "create") {
        this.loadAllToCreate();
    } else if(this.mode == "update") {
        this.loadAllToUpdate();
    }
}
TimeSpentItemsForm.prototype.loadAllToCreate = function(afterLoadContext, afterLoadHandler) {
    var form = this;
    var data = {};
    data.command = "getInitialContentToCreate";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.taskOffices = result.taskOffices;
            form.loaded.taskDepartments = result.taskDepartments;
            form.loaded.taskSubdepartments = result.taskSubdepartments;
            form.loaded.projectCodeOffices = result.projectCodeOffices;
            form.loaded.projectCodeDepartments = result.projectCodeDepartments;
            form.loaded.projectCodeSubdepartments = result.projectCodeSubdepartments;
            form.loaded.taskTypes = result.taskTypes;
            form.loaded.tasks = [];
            form.loaded.clients = [];
            form.loaded.projectCodes = [];
            if(form.loaded.taskOffices.length == 1) {
                form.selected.taskOfficeId = form.loaded.taskOffices[0].id;
            }
            if(form.loaded.taskDepartments.length == 1) {
                form.selected.taskDepartmentId = form.loaded.taskDepartments[0].id;
            }
            if(form.loaded.taskSubdepartments.length == 1) {
                form.selected.taskSubdepartmentId = form.loaded.taskSubdepartments[0].id;
            }
            if(form.loaded.projectCodeOffices.length == 1) {
                form.selected.projectCodeOfficeId = form.loaded.projectCodeOffices[0].id;
            }
            if(form.loaded.projectCodeDepartments.length == 1) {
                form.selected.projectCodeDepartmentId = form.loaded.projectCodeDepartments[0].id;
            }
            if(form.loaded.projectCodeSubdepartments.length == 1) {
                form.selected.projectCodeSubdepartmentId = form.loaded.projectCodeSubdepartments[0].id;
                form.loaded.clients = result.clients;
            }
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.selected.clientId = null;
            form.selected.projectCodeId = null;
            form.projectCodeId = form.selected.projectCodeId;
            form.taskId = form.selected.taskId;
            form.items.push({
                "id" : null,
                "description" : "",
                "timeSpent" : 0
            })
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TimeSpentItemsForm.prototype.loadAllToUpdate = function(afterLoadContext, afterLoadHandler) {
    var form = this;
    var data = {};
    data.command = "getInitialContentToUpdate";
    data.projectCodeId = this.projectCodeId;
    data.taskId = this.taskId;
    data.year = this.year;
    data.month = this.month;
    data.dayOfMonth = this.days[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = [];
            if(result.client != null) {
                form.loaded.clients.push(result.client);
            }

            form.loaded.projectCodes = [];
            if(result.projectCode != null) {
                form.loaded.projectCodes.push(result.projectCode);
            }
            form.loaded.taskSubdepartments = [];
            if(result.taskSubdepartment != null) {
                form.loaded.taskSubdepartments.push(result.taskSubdepartment);
            }
            form.loaded.taskDepartments = [];
            if(result.taskDepartment != null) {
                form.loaded.taskDepartments.push(result.taskDepartment);
            }
            form.loaded.taskOffice = [];
            if(result.taskOffice != null) {
                form.loaded.taskOffices.push(result.taskOffice);
            }
            form.loaded.projectCodeSubdepartments = [];
            if(result.projectCodeSubdepartment != null) {
                form.loaded.projectCodeSubdepartments.push(result.projectCodeSubdepartment);
            }
            form.loaded.projectCodeDepartments = [];
            if(result.projectCodeDepartment != null) {
                form.loaded.projectCodeDepartments.push(result.projectCodeDepartment);
            }
            form.loaded.projectCodeOffices = [];
            if(result.projectCodeOffice != null) {
                form.loaded.projectCodeOffices.push(result.projectCodeOffice);
            }
            form.loaded.taskTypes = [];
            form.loaded.taskTypes.push(result.taskType);
            form.loaded.tasks = [];
            form.loaded.tasks.push(result.task);
            form.loaded.timeSpentItems = result.timeSpentItems;
            form.loaded.isMonthClosed = result.isMonthClosed;
            if(form.loaded.clients.length > 0) {
                form.selected.clientId = form.loaded.clients[0].id;
            } else {
                form.selected.clientId = null;
            }
            if(form.loaded.projectCodes.length > 0) {
                form.selected.projectCodeId = form.loaded.projectCodes[0].id;
            } else {
                form.selected.projectCodeId = null;
            }
            if(form.loaded.taskSubdepartments.length > 0) {
                form.selected.taskSubdepartmentId = form.loaded.taskSubdepartments[0].id;
            } else {
                form.selected.taskSubdepartmentId = null;
            }
            if(form.loaded.taskDepartments.length > 0) {
                form.selected.taskDepartmentId = form.loaded.taskDepartments[0].id;
            } else {
                form.selected.taskDepartmentId = null;
            }
            if(form.loaded.taskOffices.length > 0) {
                form.selected.taskOfficeId = form.loaded.taskOffices[0].id;
            } else {
                form.selected.taskOfficeId = null;
            }
            if(form.loaded.projectCodeSubdepartments.length > 0) {
                form.selected.projectCodeSubdepartmentId = form.loaded.projectCodeSubdepartments[0].id;
            } else {
                form.selected.projectCodeSubdepartmentId = null;
            }
            if(form.loaded.projectCodeDepartments.length > 0) {
                form.selected.projectCodeDepartmentId = form.loaded.projectCodeDepartments[0].id;
            } else {
                form.selected.projectCodeDepartmentId = null;
            }
            if(form.loaded.projectCodeOffices.length > 0) {
                form.selected.projectCodeOfficeId = form.loaded.projectCodeOffices[0].id;
            } else {
                form.selected.projectCodeOfficeId = null;
            }
            if(form.loaded.taskTypes.length > 0) {
                form.selected.taskTypeId = form.loaded.taskTypes[0].id;
            } else {
                form.selected.taskTypeId = null;
            }
            if(form.loaded.tasks.length > 0) {
                form.selected.taskId = form.loaded.tasks[0].id;
            } else {
                form.selected.taskId = null;
            }
            for(var key in form.loaded.timeSpentItems) {
                var timeSpentItem = form.loaded.timeSpentItems[key];
                form.items.push({
                    "id" : timeSpentItem.id,
                    "description" : timeSpentItem.description,
                    "timeSpent" : timeSpentItem.timeSpent / 60
                })
            }
            form.show();
        })
     },
     error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
     }
    });
}
TimeSpentItemsForm.prototype.loadTaskOfficeContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getTaskOfficeContent";
    data.taskOfficeId = this.selected.taskOfficeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.taskDepartments = result.taskDepartments;
            form.loaded.taskSubdepartments = result.taskSubdepartments;
            form.loaded.taskTypes = result.taskTypes;
            form.loaded.tasks = [];
            if(form.loaded.taskDepartments.length == 1) {
                form.selected.taskDepartmentId = form.loaded.taskDepartments[0].id;
            }
            if(form.loaded.taskSubdepartments.length == 1) {
                form.selected.taskSubdepartmentId = form.loaded.taskSubdepartments[0].id;
            }
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.selected.clientId = null;
            form.selected.projectCodeId = null;
            form.projectCodeId = form.selected.projectCodeId;
            form.taskId = form.selected.taskId;
            form.updateView();
        })
    },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadTaskDepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getTaskDepartmentContent";
    data.taskDepartmentId = this.selected.taskDepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.taskSubdepartments = result.taskSubdepartments;
            form.loaded.taskTypes = result.taskTypes;
            form.loaded.tasks = [];
            if(form.loaded.taskSubdepartments.length == 1) {
                form.selected.taskSubdepartmentId = form.loaded.taskSubdepartments[0].id;
            }
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.selected.clientId = null;
            form.selected.projectCodeId = null;
            form.projectCodeId = form.selected.projectCodeId;
            form.taskId = form.selected.taskId;
            form.updateView();
        })
    },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadTaskSubdepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getTaskSubdepartmentContent";
    data.taskSubdepartmentId = this.selected.taskSubdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.taskTypes = result.taskTypes;
            form.loaded.tasks = [];
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.taskId = form.selected.taskId;
            form.updateView();
        })
    },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadNullTaskSubdepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getNullTaskSubdepartmentContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.taskTypes = result.taskTypes;
            form.loaded.tasks = [];
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.taskId = form.selected.taskId;
            form.updateView();
        })
    },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadProjectCodeOfficeContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getProjectCodeOfficeContent";
    data.projectCodeOfficeId = this.selected.projectCodeOfficeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCodeDepartments = result.projectCodeDepartments;
            form.loaded.projectCodeSubdepartments = result.projectCodeSubdepartments;
            form.loaded.clients = [];
            form.loaded.projectCodes = [];
            if(form.loaded.projectCodeDepartments.length == 1) {
                form.selected.projectCodeDepartmentId = form.loaded.projectCodeDepartments[0].id;
            }
            if(form.loaded.projectCodeSubdepartments.length == 1) {
                form.selected.projectCodeSubdepartmentId = form.loaded.projectCodeSubdepartments[0].id;
                form.loaded.clients = result.clients;
            }
            form.selected.clientId = null;
            form.selected.projectCodeId = null;
            form.projectCodeId = form.selected.projectCodeId;
            form.taskId = form.selected.taskId;
            form.updateView();
        })
    },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadProjectCodeDepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getProjectCodeDepartmentContent";
    data.projectCodeDepartmentId = this.selected.projectCodeDepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCodeSubdepartments = result.projectCodeSubdepartments;
            form.loaded.clients = [];
            form.loaded.projectCodes = [];
            if(form.loaded.projectCodeSubdepartments.length == 1) {
                form.selected.projectCodeSubdepartmentId = form.loaded.projectCodeSubdepartments[0].id;
                form.loaded.clients = result.clients;
            }
            form.selected.clientId = null;
            form.selected.projectCodeId = null;
            form.projectCodeId = form.selected.projectCodeId;
            form.taskId = form.selected.taskId;
            form.updateView();
        })
    },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadProjectCodeSubdepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getProjectCodeSubdepartmentContent";
    data.projectCodeSubdepartmentId = this.selected.projectCodeSubdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.loaded.projectCodes = [];
            form.selected.clientId = null;
            form.selected.projectCodeId = null;
            form.projectCodeId = form.selected.projectCodeId;
            form.updateView();
        })
    },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadTaskTypeContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getTaskTypeContent";
    data.taskTypeId = this.selected.taskTypeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.tasks = result.tasks;
            form.selected.taskId = null;
            form.taskId = form.selected.taskId;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadClientContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getClientContent";
    data.clientId = this.selected.clientId;
    data.projectCodeSubdepartmentId = this.selected.projectCodeSubdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCodes = result.projectCodes;
            form.selected.projectCodeId = null;
            form.projectCodeId = form.selected.projectCodeId;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.loadProjectCodeConflictsContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getProjectCodeConflictsContent";
    data.projectCodeId = this.selected.projectCodeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.conflictCheckBlock = result.conflictCheckBlock;
            form.showProjectCodeConflictsContent();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}

TimeSpentItemsForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_projectCode').bind("change", function(event) {form.projectCodeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_projectCode').bind("keyup", function(event) {form.projectCodeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_taskOffice').bind("change", function(event) {form.taskOfficeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_taskDepartment').bind("change", function(event) {form.taskDepartmentChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_taskSubdepartment').bind("change", function(event) {form.taskSubdepartmentChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_projectCodeOffice').bind("change", function(event) {form.projectCodeOfficeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_projectCodeDepartment').bind("change", function(event) {form.projectCodeDepartmentChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_projectCodeSubdepartment').bind("change", function(event) {form.projectCodeSubdepartmentChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_taskType').bind("change", function(event) {form.taskTypeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_task').bind("change", function(event) {form.taskChangedHandle.call(form, event)});
    $('textarea[id^="' + this.htmlId + '_description_"]').bind("change", function(event) {form.descriptionChangedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_day_"]').bind("click", function(event) {form.dayClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_clientFilter').bind("change", function(event) {form.clientFilterChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_helpLink').bind('click', function( event ) {form.helpHandle.call(form);});
}
TimeSpentItemsForm.prototype.taskOfficeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_taskOffice').val();
    if(idTxt == '') {
        this.selected.taskOfficeId = null;
    } else {
        this.selected.taskOfficeId = parseInt(idTxt);
    }
    if(this.selected.taskOfficeId == null) {
        this.loadInitialContent();
    } else {
        this.loadTaskOfficeContent();
    }
}
TimeSpentItemsForm.prototype.taskDepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_taskDepartment').val();
    if(idTxt == '') {
        this.selected.taskDepartmentId = null;
    } else {
        this.selected.taskDepartmentId = parseInt(idTxt);
    }
    if(this.selected.taskDepartmentId == null) {
        this.loadTaskOfficeContent();
    } else {
        this.loadTaskDepartmentContent();
    }
}
TimeSpentItemsForm.prototype.taskSubdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_taskSubdepartment').val();
    if(idTxt == '') {
        this.selected.taskSubdepartmentId = null;
    } else {
        this.selected.taskSubdepartmentId = parseInt(idTxt);
    }
    if(this.selected.taskSubdepartmentId == null) {
        this.loadNullTaskSubdepartmentContent();
    } else {
        this.loadTaskSubdepartmentContent();
    }
}
TimeSpentItemsForm.prototype.projectCodeOfficeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_projectCodeOffice').val();
    if(idTxt == '') {
        this.selected.projectCodeOfficeId = null;
    } else {
        this.selected.projectCodeOfficeId = parseInt(idTxt);
    }
    if(this.selected.projectCodeOfficeId == null) {
        this.loadInitialContent();
    } else {
        this.loadProjectCodeOfficeContent();
    }
}
TimeSpentItemsForm.prototype.projectCodeDepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_projectCodeDepartment').val();
    if(idTxt == '') {
        this.selected.projectCodeDepartmentId = null;
    } else {
        this.selected.projectCodeDepartmentId = parseInt(idTxt);
    }
    if(this.selected.projectCodeDepartmentId == null) {
        this.loadProjectCodeOfficeContent();
    } else {
        this.loadProjectCodeDepartmentContent();
    }
}
TimeSpentItemsForm.prototype.projectCodeSubdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_projectCodeSubdepartment').val();
    if(idTxt == '') {
        this.selected.projectCodeSubdepartmentId = null;
    } else {
        this.selected.projectCodeSubdepartmentId = parseInt(idTxt);
    }
    if(this.selected.projectCodeSubdepartmentId == null) {
        this.loaded.clients = [];
        this.loaded.projectCodes = [];
        this.selected.clientId = null;
        this.selected.projectCodeId = null;
        this.projectCodeId = this.selected.projectCodeId;
        this.updateView();
    } else {
        this.loadProjectCodeSubdepartmentContent();
    }
}
TimeSpentItemsForm.prototype.taskTypeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_taskType').val();
    if(idTxt == '') {
        this.selected.taskTypeId = null;
    } else {
        this.selected.taskTypeId = parseInt(idTxt);
    }
    if(this.selected.taskTypeId == null) {
        this.selected.taskTypeId = null;
        this.selected.taskId = null;
        this.taskId = this.selected.taskId;
        this.loaded.tasks = [];
        this.updateView();
    } else {
        this.loadTaskTypeContent();
    }
}
TimeSpentItemsForm.prototype.taskChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_task').val();
    if(idTxt == '') {
        this.selected.taskId = null;
    } else {
        this.selected.taskId = parseInt(idTxt);
    }
    this.updateTaskView();
    this.taskId = this.selected.taskId;
    this.updateItemsView();
    this.dataChanged(true);

}
TimeSpentItemsForm.prototype.taskAutocompleteSelected = function (value) {
    for(var key in this.loaded.tasks) {
        var task = this.loaded.tasks[key];
        if(task.name == value) {
            this.selected.taskId = task.id;
            this.taskId = this.selected.taskId;
            break;
        }
    }
    this.updateTaskView();
}
TimeSpentItemsForm.prototype.clientChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_client').val();
    if(idTxt == '') {
        this.selected.clientId = null;
    } else {
        this.selected.clientId = parseInt(idTxt);
    }
    if(this.selected.clientId == null) {
        this.selected.projectCodeId = null;
        this.projectCodeId = this.selected.projectCodeId;
        this.loaded.projectCodes = [];
        this.updateProjectCodeView();
    } else {
        this.loadClientContent();
    }
}
TimeSpentItemsForm.prototype.clientAutocompleteSelected = function (value) {
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        if(client.name == value) {
            this.selected.clientId = client.id;
            this.clientId = this.selected.clientId;
            break;
        }
    }
    this.updateClientView();
    if(this.selected.clientId == null) {
        this.selected.projectCodeId = null;
        this.projectCodeId = this.selected.projectCodeId;
        this.loaded.projectCodes = [];
        this.updateProjectCodeView();
    } else {
        this.loadClientContent();
    }    
}
TimeSpentItemsForm.prototype.projectCodeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_projectCode').val();
    if(idTxt == '') {
        this.selected.projectCodeId = null;
    } else {
        this.selected.projectCodeId = parseInt(idTxt);
    }
    this.updateProjectCodeView();
    this.projectCodeId = this.selected.projectCodeId;
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.dayClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var day = tmp[tmp.length - 1];
    var checked = $('#' + this.htmlId + '_day_' + day).is(':checked');
    var index = jQuery.inArray(day, this.days);
    if(checked) {
        if(index == -1) {
            this.days.push(day);
        }
    } else {
        if(index != -1) {
            this.days.splice(index, 1);
        }
    }
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.addItemHandle = function() {
    var additionalTimeSpentItem = {
            "id" : null,
            "description" : "",
            "timeSpent" : 0
    }
    this.items.push(additionalTimeSpentItem);
    this.makeEmptyView();
    this.setHandlers();
    this.makeButtons();
    this.makeSpinners();
    this.updateView();
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.helpHandle = function() {
    var html = '';
    html += '<div>Create one or more items. Time should be multiple of 0.25 hours.</div>';
    html += '<div>ArrowUp and ArrowDown keys change the time with 0.25 hours step, PageUp and PageDown keys change the time with 2 hours step.</div><br />';
    html += '<div>Zero value for time can be used to remove existing item.</div><br />';
    html += '<div>Items info will be applied to all selected days.</div>';
    showPopup('Help', html, 400, 250, null, null);    
}
TimeSpentItemsForm.prototype.descriptionChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.items[index].description = jQuery.trim(event.currentTarget.value);
    this.updateItemsView();
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.timeSpentChangedHandle = function(event) {
    var timeSpentRE = /^[0-9]*[\.]?[0-9]*$/;
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    var value = jQuery.trim(event.currentTarget.value);
    if(value == "") {
        this.items[index].timeSpent = 0;
    } else if(timeSpentRE.test(value)) {
        this.items[index].timeSpent = parseFloat(value);
        $('#' + this.htmlId + '_timeSpent_' + index).val(value);
    } else {
        $('#' + this.htmlId + '_timeSpent_' + index).val(this.items[index].timeSpent);
    }
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.deleteItem = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.items.splice(index, 1);
    this.makeEmptyView();
    this.setHandlers();
    this.makeButtons();
    this.makeSpinners();
    this.updateView();
    this.dataChanged(true);
}
TimeSpentItemsForm.prototype.makeEmptyView = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_warnings"></div>';
    html += '<fieldset>';
    html += '<legend>Task</legend>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_taskOffice" style="min-width: 100px;"></select></select></td>';
    html += '<td><select id="' + this.htmlId + '_taskDepartment" style="min-width: 100px;"></select></td>';
    html += '<td><select id="' + this.htmlId + '_taskSubdepartment" style="min-width: 100px;"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Task Type</span></td><td><span class="label1">Task</span> <input id="' + this.htmlId + '_taskAutocomplete"></td></tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_taskType" style="min-width: 100px;"></select></td>';
    html += '<td><select id="' + this.htmlId + '_task" style="min-width: 100px;"></select></td>';
    html += '</tr>';
    html += '<tr><td colspan="2" id="' + this.htmlId + '_task_info"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<fieldset>';
    html += '<legend>Project Code</legend>';
    html += '<div id="' + this.htmlId + '_projectCode_message" style="display: none;" class="comment1">Project Code selector is not applicable for Internal Task Types</div>';
    html += '<div id="' + this.htmlId + '_projectCode_selector">';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_projectCodeOffice" style="min-width: 150px;"></select></td>';
    html += '<td><select id="' + this.htmlId + '_projectCodeDepartment" style="min-width: 200px;"></select></td>';
    html += '<td><select id="' + this.htmlId + '_projectCodeSubdepartment" style="min-width: 100px;"></select></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Client</span> <input id="' + this.htmlId + '_clientAutocomplete"></td>';
    html += '<td><span class="label1">Code</span></td>';
    '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_client" style="min-width: 150px;"></select></td>';
    html += '<td><select id="' + this.htmlId + '_projectCode" style="min-width: 200px;"></select></td>';
    html += '</tr>';
    html += '<tr><td colspan="2" id="' + this.htmlId + '_projectCode_info"></td></tr>';
    html += '</table>';
    html += '</div>';
    html += '</fieldset>';
    
    html += '<table><tr>';
    html += '<td style="vertical-align: top;">';
    
    html += '<fieldset>';
    html += '<legend>Days of month</legend>';
    html += '<div id="' + this.htmlId + '_days"></div>';
    html += '</fieldset>';
    
    html += '</td><td style="vertical-align: top;">';
    
    html += '<button value="Add item" id="' + this.htmlId + '_addItemBtn">Add item(s)</button>';
    html += '<span class="link" id="' + this.htmlId + '_helpLink">Help</span><br />';
    if(this.items.length > 0) {
        html += '<table>';
        html += '<tr><td><span class="label1">Description</span> <span class="comment1" id="' + this.htmlId + '_descriptionIsOptionalComment"></span></td><td><span class="label1">Time, Hours</span></td></tr>';
        for(var key in this.items) {
            var timeSpentItem = this.items[key];
            html += '<tr>';
            html += '<td><textarea style="width: 300px; height: 80px;" id="' + this.htmlId + '_description_' + key + '"></textarea></td>';
            html += '<td style="vertical-align: top; width: 100px;">';
            html += '<input type="text" style="width: 50px;" value="0" id="' + this.htmlId + '_timeSpent_' + key + '">';
            html += '</td>';
            html += '<td style="vertical-align: top;">';
            html += '<button id="' + this.htmlId + '_delete_' + key + '">Delete</button>';
            html +='</td>';
            html += '</tr>';
        }
        html += '</table>';
    } else {
        html += '<br /><div class="label1">No time spent items for this day, task and project code</div>';
    }

    html += '</td>';
    html += '</tr></table>';
    $('#' + this.containerHtmlId).html(html);
    this.makeDaysView();
}
TimeSpentItemsForm.prototype.makeButtons = function () {
    var form = this;
    $('#' + this.htmlId + '_addItemBtn')
      .button({
      icons: {
        primary: "ui-icon-plus"
      },
      text: true
    })
      .click(function( event ) {
        form.addItemHandle.call(form);
    });
    
    $('button[id^="' + this.htmlId + '_delete_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteItem.call(form, event);
    });
}    
TimeSpentItemsForm.prototype.makeSpinners = function () {
    var form = this;
    $('input[id^="' + this.htmlId + '_timeSpent_"]')
      .spinner({
           min: 0,
           max: 24,
           step: 0.25,
           page: 8,
           change: function( event, ui ) {
               form.timeSpentChangedHandle.call(form, event);
           }
      }
    );
}
TimeSpentItemsForm.prototype.makeDaysView = function () {
    var html = this.getCalendar();
    $('#' + this.htmlId + '_days').html(html);
}
TimeSpentItemsForm.prototype.updateClientView = function () {
    var html = ''; 
    html += '<option value="">...</option>';
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];       
        var isSelected = "";
        if(client.id == this.selected.clientId) {
           isSelected = "selected";
        }
        html += '<option value="' + client.id + '" ' + isSelected + '>' + client.name + '</option>';
    }
    if(this.mode == "create") {
        $('#' + this.htmlId + '_client').attr("disabled", false);
    } else {
        $('#' + this.htmlId + '_client').attr("disabled", true);
    }
    $('#' + this.htmlId + '_client').html(html);
}
TimeSpentItemsForm.prototype.updateClientAutocompleteView = function () {
    if(this.loaded.clients == null || this.loaded.clients.length == 0) {
        $('#' + this.htmlId + '_clientAutocomplete').hide();
    } else {
        $('#' + this.htmlId + '_clientAutocomplete').show();
        var form = this;
        var availableTags = [];
        for(var key in this.loaded.clients) {
            availableTags.push(this.loaded.clients[key].name);
        }
        $('#' + this.htmlId + '_clientAutocomplete').autocomplete({
          source: availableTags,
          select: function( event, ui ) {
              form.clientAutocompleteSelected(ui.item.value);
          }
        });
    }
}
TimeSpentItemsForm.prototype.updateProjectCodeView = function () {
    var html = '';
    var comment = '';
    var description = '';
    var conflictStatus = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.projectCodes) {
        var projectCode = this.loaded.projectCodes[key];
        var isSelected = "";
        if(projectCode.id == this.selected.projectCodeId) {
           isSelected = "selected";
           comment = projectCode.comment;
           description = projectCode.description;
           conflictStatus = projectCode.conflictStatus;
        }
        html += '<option value="' + projectCode.id + '" ' + isSelected + '>' + projectCode.code + '</option>';
    }
    if(this.mode == "create") {
        $('#' + this.htmlId + '_projectCode').attr("disabled", false);
    } else {
        $('#' + this.htmlId + '_projectCode').attr("disabled", true);
    }
    $('#' + this.htmlId + '_projectCode').html(html);
    
    var projectCodeInfo = '<div class="comment4">' + comment + '</div>';
    if(comment != description) {
        projectCodeInfo += '<div class="comment4">' + description + '</div>';
    }
    if(conflictStatus == 'DETECTED') {
        projectCodeInfo += getErrorHtml('<strong>Attention</strong> A conflict with other subdepartment has been detected for this project code. <span class="link" id="' + this.htmlId + '_conflictStatusDetails1' + '">See details</span>');
    } else if(conflictStatus == 'IRRESOLVABLE') {
        projectCodeInfo += getErrorHtml('<strong>Attention</strong> This project code has an irresolvable conflict with other subdepartment. <span class="link" id="' + this.htmlId + '_conflictStatusDetails2' + '">See details</span>');
    }
    $('#' + this.htmlId + '_projectCode_info').html(projectCodeInfo);
    
    var form = this;
    $('#' + this.htmlId + '_conflictStatusDetails1').bind('click', function(event) {form.loadProjectCodeConflictsContent.call(form, event)});
    $('#' + this.htmlId + '_conflictStatusDetails2').bind('click', function(event) {form.loadProjectCodeConflictsContent.call(form, event)});
    
    var taskType = null;
    for(var key in this.loaded.taskTypes) {
        if(this.loaded.taskTypes[key].id == this.selected.taskTypeId) {
                    taskType = this.loaded.taskTypes[key];
                    break;
        }
    }
    if(taskType != null && taskType.isInternal) {
        $('#' + this.htmlId + '_projectCode_selector').hide();
        $('#' + this.htmlId + '_projectCode_message').show("slow");
    } else {
        $('#' + this.htmlId + '_projectCode_message').hide();
        $('#' + this.htmlId + '_projectCode_selector').show("slow");
    }
}
TimeSpentItemsForm.prototype.updateTaskOfficeView = function () {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.taskOffices) {
        var office = this.loaded.taskOffices[key];
        var isSelected = "";
        if(office.id == this.selected.taskOfficeId) {
           isSelected = "selected";
        }
        html += '<option value="' + office.id + '" ' + isSelected + '>' + office.name + '</option>';
    }
    if(this.mode == "update" || this.loaded.taskOffices.length == 1) {
        $('#' + this.htmlId + '_taskOffice').attr("disabled", true);
    } else {
        $('#' + this.htmlId + '_taskOffice').attr("disabled", false);
    }
    $('#' + this.htmlId + '_taskOffice').html(html);
}
TimeSpentItemsForm.prototype.updateTaskDepartmentView = function () {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.taskDepartments) {
        var department = this.loaded.taskDepartments[key];
        var isSelected = "";
        if(department.id == this.selected.taskDepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + department.id + '" ' + isSelected + '>' + department.name + '</option>';
    }
    if(this.mode == "update" || this.loaded.taskDepartments.length == 1) {
        $('#' + this.htmlId + '_taskDepartment').attr("disabled", true);
    } else {
        $('#' + this.htmlId + '_taskDepartment').attr("disabled", false);
    }
    $('#' + this.htmlId + '_taskDepartment').html(html);
}
TimeSpentItemsForm.prototype.updateTaskSubdepartmentView = function () {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.taskSubdepartments) {
        var subdepartment = this.loaded.taskSubdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.taskSubdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + subdepartment.id + '" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    if(this.mode == "update" || this.loaded.taskSubdepartments.length == 1) {
        $('#' + this.htmlId + '_taskSubdepartment').attr("disabled", true);
    } else {
        $('#' + this.htmlId + '_taskSubdepartment').attr("disabled", false);
    }
    $('#' + this.htmlId + '_taskSubdepartment').html(html);
}
TimeSpentItemsForm.prototype.updateProjectCodeOfficeView = function () {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.projectCodeOffices) {
        var office = this.loaded.projectCodeOffices[key];
        var isSelected = "";
        if(office.id == this.selected.projectCodeOfficeId) {
           isSelected = "selected";
        }
        html += '<option value="' + office.id + '" ' + isSelected + '>' + office.name + '</option>';
    }
    if(this.mode == "update" || this.loaded.projectCodeOffices.length == 1) {
        $('#' + this.htmlId + '_projectCodeOffice').attr("disabled", true);
    } else {
        $('#' + this.htmlId + '_projectCodeOffice').attr("disabled", false);
    }
    $('#' + this.htmlId + '_projectCodeOffice').html(html);
}
TimeSpentItemsForm.prototype.updateProjectCodeDepartmentView = function () {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.projectCodeDepartments) {
        var department = this.loaded.projectCodeDepartments[key];
        var isSelected = "";
        if(department.id == this.selected.projectCodeDepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + department.id + '" ' + isSelected + '>' + department.name + '</option>';
    }
    if(this.mode == "update" || this.loaded.projectCodeDepartments.length == 1) {
        $('#' + this.htmlId + '_projectCodeDepartment').attr("disabled", true);
    } else {
        $('#' + this.htmlId + '_projectCodeDepartment').attr("disabled", false);
    }
    $('#' + this.htmlId + '_projectCodeDepartment').html(html);
}
TimeSpentItemsForm.prototype.updateProjectCodeSubdepartmentView = function () {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.projectCodeSubdepartments) {
        var subdepartment = this.loaded.projectCodeSubdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.projectCodeSubdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + subdepartment.id + '" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    if(this.mode == "update" || this.loaded.projectCodeSubdepartments.length == 1) {
        $('#' + this.htmlId + '_projectCodeSubdepartment').attr("disabled", true);
    } else {
        $('#' + this.htmlId + '_projectCodeSubdepartment').attr("disabled", false);
    }
    $('#' + this.htmlId + '_projectCodeSubdepartment').html(html);
}
TimeSpentItemsForm.prototype.updateTaskTypeView = function () {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.taskTypes) {
        var taskType = this.loaded.taskTypes[key];
        var isSelected = "";
        if(taskType.id == this.selected.taskTypeId) {
           isSelected = "selected";
        }
        html += '<option value="' + taskType.id + '" ' + isSelected + '>' + taskType.name + '</option>';
    }
    if(this.mode == "create") {
        $('#' + this.htmlId + '_taskType').attr("disabled", false);
    } else {
        $('#' + this.htmlId + '_taskType').attr("disabled", true);
    }
    $('#' + this.htmlId + '_taskType').html(html);
}
TimeSpentItemsForm.prototype.updateTaskView = function () {
    var html = '';
    var description = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.tasks) {
        var task = this.loaded.tasks[key];
        var isSelected = "";
        if(task.id == this.selected.taskId) {
           isSelected = "selected";
           description = task.description;
        }
        html += '<option value="' + task.id + '" ' + isSelected + '>' + task.name + '</option>';
    }
    if(this.mode == "create") {
        $('#' + this.htmlId + '_task').attr("disabled", false);
    } else {
        $('#' + this.htmlId + '_task').attr("disabled", true);
    }
    $('#' + this.htmlId + '_task').html(html);
    if(description != null) {
        $('#' + this.htmlId + '_task_info').html('<div class="comment4">' + description + '</div>');
    } else {
        $('#' + this.htmlId + '_task_info').html('');
    }    
}
TimeSpentItemsForm.prototype.updateTaskAutocompleteView = function () {
    if(this.loaded.tasks == null || this.loaded.tasks.length == 0) {
        $('#' + this.htmlId + '_taskAutocomplete').hide();
    } else {
        $('#' + this.htmlId + '_taskAutocomplete').show();
        var form = this;
        var availableTags = [];
        for(var key in this.loaded.tasks) {
            availableTags.push(this.loaded.tasks[key].name);
        }
        $('#' + this.htmlId + '_taskAutocomplete').autocomplete({
          source: availableTags,
          select: function( event, ui ) {
              form.taskAutocompleteSelected(ui.item.value);
          }
        });
    }
}
TimeSpentItemsForm.prototype.updateDaysView = function () {
    for(var day = 1; day <= this.timeSheet.days; day++) {
        if(jQuery.inArray("" + day, this.days) == -1) {
            $('#' + this.htmlId + '_day_' + day).attr("checked", false);
        } else {
            $('#' + this.htmlId + '_day_' + day).attr("checked", true);
        }
        if(this.mode == "create") {
            $('#' + this.htmlId + '_day_' + day).attr("disabled", false);
        } else {
            $('#' + this.htmlId + '_day_' + day).attr("disabled", true);
        }
    }
}
TimeSpentItemsForm.prototype.updateItemsView = function () {
    for(var key in this.items) {
        var timeSpentItem = this.items[key];
        $('#' + this.htmlId + '_description_' + key).text(timeSpentItem.description);
        $('#' + this.htmlId + '_timeSpent_' + key).val(timeSpentItem.timeSpent);
    }

    var task = null;
    for(var key in this.loaded.tasks) {
        var taskTmp = this.loaded.tasks[key];
        if(taskTmp.id == this.selected.taskId) {
            task = taskTmp;
        }
    }
    var descriptionIsOptionalComment = "";
    if(task != null && task.isIdle == true) {
        descriptionIsOptionalComment = "(Optional)"
    }
    $('#' + this.htmlId + '_descriptionIsOptionalComment').html(descriptionIsOptionalComment);
}
TimeSpentItemsForm.prototype.updateWarningsView = function () {
    var html = '';
    if(this.loaded.isMonthClosed || this.isProjectCodeClosed(this.selected.projectCodeId)) {
        var message = '';
        if(this.loaded.isMonthClosed) {
            message += 'Month is closed. ';
        }
        if(this.isProjectCodeClosed(this.selected.projectCodeId)) {
            message += 'Project code is closed. ';
        }
        html += getErrorHtml(message);
    }
    $('#' + this.htmlId + '_warnings').html(html);
}
TimeSpentItemsForm.prototype.showProjectCodeConflictsContent = function () {
    var conflictCheckBlock = this.loaded.conflictCheckBlock;
    var message = '';
    message += '<table class="datagrid">';
    message += '<tr class="dgHeader">';
    message += '<td>Subdepartment</td>';
    message += '<td>Status</td>';
    message += '<td>Done at</td>';
    message += '<td>Done by</td>';
    message += '</tr>';
    for(var key in conflictCheckBlock.items) {
        var item = conflictCheckBlock.items[key];
        var checkingSubdepartment = item.checkingSubdepartment;
        
        message += '<tr>';
        message += '<td>' + checkingSubdepartment.officeName + ' / ' + checkingSubdepartment.departmentName + ' / ' + checkingSubdepartment.subdepartmentName + '</td>';
        message += '<td>' + item.status + '</td>';
        message += '<td>' + yearMonthDateTimeVisualizer.getHtml(item.modifiedAt) + '</td>';
        message += '<td>' + item.modifiedBy.firstName + ' ' + item.modifiedBy.lastName + '</td>';
        message += '</tr>';
    }
    message += '</table>';
    showPopup('Conflict check details', message, 600, 400, null, null);   
}
TimeSpentItemsForm.prototype.updateView = function() {
    this.updateTaskOfficeView();
    this.updateTaskDepartmentView();
    this.updateTaskSubdepartmentView();
    this.updateProjectCodeOfficeView();
    this.updateProjectCodeDepartmentView();
    this.updateProjectCodeSubdepartmentView();
    this.updateTaskTypeView();
    this.updateTaskView();
    this.updateTaskAutocompleteView();
    this.updateClientView();
    this.updateClientAutocompleteView();
    this.updateProjectCodeView();
    this.updateDaysView();
    this.updateItemsView();
    this.updateWarningsView();
}

TimeSpentItemsForm.prototype.show = function() {
    this.makeEmptyView();
    this.setHandlers();
    this.makeButtons();
    this.makeSpinners();
    this.updateView();
    var form = this;
    var title = "Create time spent items";
    if(this.mode == "update") {
        title = "Update time spent items";
    }
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 1000,
        height: 600,
        buttons: {
            Ok : function() {
                form.save();
            },
            Cancel : function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
        },
        close: function(event, ui) {
            releasePopupLayer();
            if(form.successHandler != null && form.successContext != null) {
                form.successHandler.call(form.successContext, form.dataUpdated);
            }            
        } 
    }
    );
}
TimeSpentItemsForm.prototype.validate = function() {
    var errors = [];
    var taskType = null;
    var task = null;
    for(var key in this.loaded.taskTypes) {
        var taskTypeTmp = this.loaded.taskTypes[key];
        if(taskTypeTmp.id == this.selected.taskTypeId) {
            taskType = taskTypeTmp;
            break;
        }
    }
    for(var key in this.loaded.tasks) {
        var taskTmp = this.loaded.tasks[key];
        if(taskTmp.id == this.selected.taskId) {
            task = taskTmp;
            break;
        }
    }
    if(taskType != null && ! taskType.isInternal) {
        if(this.projectCodeId == null) {
            errors.push("Project code is not set");
        }
    }
    if(this.loaded.isMonthClosed) {
        errors.push("Month is closed.");
    }
    if(this.isProjectCodeClosed(this.selected.projectCodeId)) {
        errors.push("Project Code is closed.");
    }
    if(this.taskId == null) {
        errors.push("Task is not set");
    }
    if(this.days == null || this.days.length == 0) {
        errors.push("Days list is empty");
    }
    if(this.mode == 'create' && this.items.length == 0) {
        errors.push("Items list is empty");
    }
    var timeSpentRE = /^-?[0-9]+[.]?[0-9]*$/;
    for(var key in this.items) {
        var item = this.items[key];
        if(task != null && task.isIdle != true && (item.description == null || item.description == "")) {
            errors.push('Item (' + key + ') has empty description');
        } else if(item.description.length > 500) {
            errors.push('Item (' + key + ') description exceeds the limit of 500 characters');
        }
        if(item.timeSpent === "") {
            errors.push('Item (' + key + ') has empty time field');
        } else if(! timeSpentRE.test(item.timeSpent)) {
            errors.push('Item (' + key + ') time field is not a number');
        } else {
            var time = parseFloat(item.timeSpent);
            if(this.mode == "create" && time == 0) {
                errors.push('Item (' + key + ') time field equals 0');
            }
            if(time < 0) {
                errors.push('Item (' + key + ') time field is negative');
            } else if(parseInt(time/0.25)!=parseFloat(time/0.25)) {
                errors.push('Item (' + key + ') time field is not multiple of 0.25');
            } else if(time > 24) {
                errors.push('Item (' + key + ') time field is greater than 24');
            }
        }
    }
    return errors;
}
TimeSpentItemsForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var timeSpentItemsForm = {
        "mode" : this.mode,
        "items" : this.getItemsInServerFormat(this.items),
        "year" : this.year,
        "month" : this.month,
        "days" : this.days,
        "projectCodeId" : this.projectCodeId,
        "taskId" : this.taskId
    };
    
    var data = {};
    data.command = "saveTimeSpentItems";
    data.timeSpentItemsForm = getJSON(timeSpentItemsForm);
    var form = this;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "post",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                //doAlert("Info", "Time spent info has been successfully saved", form, form.afterSave);
                form.dataChanged(false);
                form.dataUpdated = true;
                $.sticky('Time spent info has been successfully saved');
                form.afterSave();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
TimeSpentItemsForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
}
TimeSpentItemsForm.prototype.getItemsInServerFormat = function(clientItems) {
    var serverItems = [];
    for(var key in clientItems) {
        var clientItem = clientItems[key];
        var serverItem = {
            "id" : clientItem.id,
            "description" : clientItem.description,
            "timeSpent": clientItem.timeSpent * 60
        };
        serverItems.push(serverItem);
    }
    return serverItems;
}

TimeSpentItemsForm.prototype.getCalendar = function() {
    var year = this.year;
    var month = this.month;
    var days = getDays(year, month);
    var firstDay = 1;
    var lastDay = 0;
    var weekDays = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

    var start = new Date(year, month, 1, 12);
    var finish = new Date(year, month, days, 12);
    var startDelta = start.getDay() - firstDay;
    if(startDelta < 0) {
        startDelta = 7 + startDelta
    }
    var finishDelta = lastDay - finish.getDay();
    if(finishDelta < 0) {
        finishDelta = 7 + finishDelta
    }
    var realStart = new Date(start.getTime() - startDelta * 1000*60*60*24);
    var realFinish = new Date(finish.getTime() + finishDelta * 1000*60*60*24);
    var html = '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    for(var k=firstDay; k <= firstDay+6; k++) {
        var weekDay;
        if(k<7) {
            weekDay = weekDays[k];
        } else {
            weekDay = weekDays[k-7];
        }
        html += '<td>' + weekDay + '</td>';
    }
    html += '</tr>';
    var i = 0;
    var j = 0;
    do {
        var day = new Date(realStart.getTime() + i * 1000*60*60*24);
        if(j == 0) {
         html += '<tr>';
        }
        if(day.getMonth() == month) {
            html += '<td>' + day.getDate() + '<input type="checkbox" id="' + this.htmlId + '_day_' + day.getDate() + '"></td>';
        } else {
            html += '<td>' + day.getDate() + '</td>';
        }
        i++;
        if(j == 6) {
          html += '</tr>';
          j=0;
        } else {
                           j++;
        }
        var dayTmp = {
            "year": day.getFullYear(),
            "month": day.getMonth(),
            "dayOfMonth": day.getDate()
        }
        var realFinishTmp = {
            "year": realFinish.getFullYear(),
            "month": realFinish.getMonth(),
            "dayOfMonth": realFinish.getDate()
        }
    } while(compareYearMonthDate(dayTmp, realFinishTmp) == -1)
    html += '</table>';
    return html;
}
TimeSpentItemsForm.prototype.isProjectCodeClosed = function(projectCodeId) {
    if(projectCodeId == null) {
        return false;
    }
    for(var key in this.loaded.projectCodes) {
        var projectCode = this.loaded.projectCodes[key];
        if(projectCode.id == projectCodeId) {
            return projectCode.isClosed;
        }
    }
    return false;
}
TimeSpentItemsForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}