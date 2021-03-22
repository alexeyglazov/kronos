/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function StandardTimeSheet(mainAdmin, htmlId, containerHtmlId, year, month) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.year = year;
    this.month = month;

    this.days = getDays(this.year, this.month);
    this.config = {
        endpointUrl: endpointsFolder + "TimeSheet.jsp"
    }
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.years = [];
    var currentYear = (new Date()).getFullYear();
    for(var i = 1990; i <= currentYear + 1; i++) {
        this.years.push(i);
    }
    this.timeSpentIndex = {
    };
    this.timeSpentItemsInfo = {};
    this.businessTripItemsInfo = {};
    this.isBusinessTrippable = null;
    this.isMonthClosed = null;
    this.timeSpentItemsForm = null;
    this.businessTripItemsForm = null;
}
StandardTimeSheet.prototype.init = function() {
    this.loadAll();
}
StandardTimeSheet.prototype.loadAll = function() {
    var form = this;
    var data = {};
    data.command = "getInfo";
    data.year = this.year;
    data.month = this.month;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "post",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.timeSpentItemsInfo = result.timeSpentItemsInfo;
            form.businessTripItemsInfo = result.businessTripItemsInfo;
            form.isBusinessTrippable = result.isBusinessTrippable;
            form.isMonthClosed = result.isMonthClosed;
            form.freedays = result.freedays;
            form.emptyCareerRanges = result.emptyCareerRanges;
            form.buildTimeSpentIndex();
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardTimeSheet.prototype.buildTimeSpentIndex = function() {
    this.timeSpentIndex = {
        projectData: {
            projectCodes: {},
            times: {},
            sum: 0
        },
        internalData: {
            taskTypes: {},
            times: {},
            sum: 0    
        },
        times: {},
        sum: 0
    };
    var timeSpentIndex = this.timeSpentIndex;
    var indexProjectData = timeSpentIndex.projectData;
    var indexInternalData = timeSpentIndex.internalData;
    for(var projectCodeKey in this.timeSpentItemsInfo.projectData.projectCodes) {
        var projectCode = this.timeSpentItemsInfo.projectData.projectCodes[projectCodeKey];
        indexProjectData.projectCodes[projectCode.id] = {
            taskTypes: {},
            times: {},
            sum: 0
        };
        var indexProjectCode = indexProjectData.projectCodes[projectCode.id];
        for(var taskTypeKey in projectCode.taskTypes) {
            var taskType = projectCode.taskTypes[taskTypeKey];
            indexProjectCode.taskTypes[taskType.id] = {
                tasks: {},
                times: {},
                sum: 0
            };
            var indexTaskType = indexProjectCode.taskTypes[taskType.id];
            for(var taskKey in taskType.tasks) {
                var task = taskType.tasks[taskKey];
                indexTaskType.tasks[task.id] = {
                    times: {},
                    sum: 0
                };
                var indexTask = indexTaskType.tasks[task.id];
                for(var key in task.timeSpentItems) {
                    var timeSpentItem = task.timeSpentItems[key];
                    var day = timeSpentItem.day.dayOfMonth;
                    var time = timeSpentItem.timeSpent / 60.0;
                    
                    if(indexTask.times[day] == null) {
                        indexTask.times[day] = time;
                    } else {
                        indexTask.times[day] += time;
                    }
                    indexTask.sum += time;
                    if(indexTaskType.times[day] == null) {
                        indexTaskType.times[day] = time;
                    } else {
                        indexTaskType.times[day] += time;
                    }
                    indexTaskType.sum += time;
                    if(indexProjectCode.times[day] == null) {
                        indexProjectCode.times[day] = time;
                    } else {
                        indexProjectCode.times[day] += time;
                    }
                    indexProjectCode.sum += time;
                    if(indexProjectData.times[day] == null) {
                        indexProjectData.times[day] = time;
                    } else {
                        indexProjectData.times[day] += time;
                    }
                    indexProjectData.sum += time;
                    if(timeSpentIndex.times[day] == null) {
                        timeSpentIndex.times[day] = time;
                    } else {
                        timeSpentIndex.times[day] += time;
                    }
                    timeSpentIndex.sum += time;
                }
            }
        }
    }
    
    for(var taskTypeKey in this.timeSpentItemsInfo.internalData.taskTypes) {
        var taskType = this.timeSpentItemsInfo.internalData.taskTypes[taskTypeKey];
        indexInternalData.taskTypes[taskType.id] = {
            tasks: {},
            times: {},
            sum: 0
        };
        var indexTaskType = indexInternalData.taskTypes[taskType.id];
        for(var taskKey in taskType.tasks) {
            var task = taskType.tasks[taskKey];
            indexTaskType.tasks[task.id] = {
                times: {},
                sum: 0
            };
            var indexTask = indexTaskType.tasks[task.id];
            for(var key in task.timeSpentItems) {
                var timeSpentItem = task.timeSpentItems[key];
                var day = timeSpentItem.day.dayOfMonth;
                var time = timeSpentItem.timeSpent / 60.0;
                
                if(indexTask.times[day] == null) {
                    indexTask.times[day] = time;
                } else {
                    indexTask.times[day] += time;
                }
                indexTask.sum += time;
                if(indexTaskType.times[day] == null) {
                    indexTaskType.times[day] = time;
                } else {
                    indexTaskType.times[day] += time;
                }
                indexTaskType.sum += time;
                if(indexInternalData.times[day] == null) {
                    indexInternalData.times[day] = time;
                } else {
                    indexInternalData.times[day] += time;
                }
                indexInternalData.sum += time;
                if(timeSpentIndex.times[day] == null) {
                    timeSpentIndex.times[day] = time;
                } else {
                    timeSpentIndex.times[day] += time;
                }
                timeSpentIndex.sum += time;
            }
        }
    }
}
StandardTimeSheet.prototype.show = function() {
    var html = '';
    html += '<button id="' + this.htmlId + '_addActivityBtn">Add task</button>';
    if(this.isBusinessTrippable) {
        html += '<button id="' + this.htmlId + '_setBusinessTripItemsBtn">Business trips</button>';
    }
    html += '<br /><br />';
    if(this.emptyCareerRanges.length > 0) {
       html += '<div class="ui-widget"><div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>';
       html += 'You have empty period in your career in this month: ';
       for(var key in this.emptyCareerRanges) {
           html += getStringFromRange(this.emptyCareerRanges[key].start, this.emptyCareerRanges[key].end) + ' ';
       }
       html += '</p></div></div>';
       html += '<br />'
    }

    html += '<table id="' + this.htmlId + '" class="timeSheetGrid">';
    html += '<tr class="tsHeader">';
    html += '<td>Project code</td>';
    html += '<td class="sum">&Sigma;</td>';
    for(var day = 1; day <= this.days; day++) {
        var clazz = "";
        if(isOfficialFreeday(this.freedays, this.year, this.month, day)) {
            clazz = 'class="holyday"';
        }
        html += '<td ' + clazz + ' title="' + day + '">' + day + '</td>';
    }
    html += '</tr>';
    if(this.timeSpentItemsInfo.projectData.projectCodes.length == 0 && this.timeSpentItemsInfo.internalData.taskTypes.length == 0) {
       html += '<tr><td colspan="' + this.days + 2 + '">No reports done for this month</td></tr>';
    } else {
        if(this.timeSpentItemsInfo.projectData.projectCodes.length != 0) {
            for(var key in this.timeSpentItemsInfo.projectData.projectCodes) {
                var projectCode = this.timeSpentItemsInfo.projectData.projectCodes[key];
                html += this.getProjectCodeHtml(projectCode.id);
            }
        }
        if(this.timeSpentItemsInfo.internalData.taskTypes.length != 0) {
            html += this.getInternalDataHtml();          
        }
    }
    html += this.getTotalHtml();
    html += '</table>';
    $('#' + this.containerHtmlId).html(html);

    this.applyCss();
    this.setHandlers();
    this.makeButtons();
}
StandardTimeSheet.prototype.applyCss = function() {
    $('tr[id^="' + this.htmlId + '_pc_"]').addClass("pc");
    $('tr[id^="' + this.htmlId + '_tt_"]').addClass("tt");
    $('tr[id^="' + this.htmlId + '_t_"]').addClass("t");
}
StandardTimeSheet.prototype.getInternalDataHtml = function() {
    var indexInternalData = this.timeSpentIndex.internalData;
    var internalData = this.timeSpentItemsInfo.internalData;
    var title = "Internal tasks have no Project Code";
    var html = "";
    html += '<tr id="' + this.htmlId + '_pc_' + 0 + '">';
    html += '<td style="padding-left: 5px;"><span title="' + title + '">' + 'Internal' + '</span></td>';
    html += '<td class="sum">' + this.timeToString(indexInternalData.sum) + '</td>';
    for(var day = 1; day <= this.days; day++) {
        var clazz = "";
        if(isOfficialFreeday(this.freedays, this.year, this.month, day)) {
            clazz = 'class="holyday"';
        }
        html += '<td ' + clazz + ' title="' + day + '">' + this.timeToString(indexInternalData.times[day]) + '</td>';
    }
    html += '</tr>';
    for(var key in internalData.taskTypes) {
        var taskType = internalData.taskTypes[key];
        html += this.getTaskTypeHtml(null, taskType.id);
    }
    return html;
}
StandardTimeSheet.prototype.getProjectCodeHtml = function(projectCodeId) {
    var indexProjectCode = this.timeSpentIndex.projectData.projectCodes[projectCodeId];
    var projectCode = this.getProjectCode(projectCodeId);
    var title = projectCode.description;
    var html = "";
    html += '<tr id="' + this.htmlId + '_pc_' + projectCodeId + '">';
    html += '<td style="padding-left: 5px;"><span title="' + title + '">' + projectCode.code + '</span></td>';
    html += '<td class="sum">' + this.timeToString(indexProjectCode.sum) + '</td>';
    for(var day = 1; day <= this.days; day++) {
        var cssContent = "";
        var businessTripItem = this.getBusinessTripItemByProjectCodeIdDay(projectCode.id, day);
        if(isOfficialFreeday(this.freedays, this.year, this.month, day)) {
            if(businessTripItem == null) {
                cssContent = 'holyday';
            } else {
                cssContent = 'holyday businessTrip';
            }
        } else {
            if(businessTripItem != null) {
                cssContent = 'businessTrip';
            }
        }
        var clazz = (cssContent != '') ? 'class="' + cssContent + '"' : '';
        html += '<td ' + clazz + ' title="' + day + '">' + this.timeToString(indexProjectCode[day]) + '</td>';
    }
    html += '</tr>';
    for(var key in projectCode.taskTypes) {
        var taskType = projectCode.taskTypes[key];
        html += this.getTaskTypeHtml(projectCodeId, taskType.id);
    }
    return html;
}
StandardTimeSheet.prototype.getTaskTypeHtml = function(projectCodeId, taskTypeId) {
    var indexTaskType = null;
    var taskType = this.getTaskType(projectCodeId, taskTypeId);
    var projectCodeTxt = null;
    if(projectCodeId == null) {
        indexTaskType = this.timeSpentIndex.internalData.taskTypes[taskTypeId];
        projectCodeTxt = 0;
    } else {
        indexTaskType = this.timeSpentIndex.projectData.projectCodes[projectCodeId].taskTypes[taskTypeId];
        projectCodeTxt = projectCodeId;
    }
    var html = "";
    html += '<tr id="' + this.htmlId + '_tt_' + projectCodeTxt + '_' + taskTypeId + '">';
    html += '<td style="padding-left: 20px;">' + taskType.name + '</td>';
    html += '<td class="sum">' + this.timeToString(indexTaskType.sum) + '</td>';
    for(var day = 1; day <= this.days; day++) {
        var clazz = "";
        if(isOfficialFreeday(this.freedays, this.year, this.month, day)) {
            clazz = 'class="holyday"';
        }
        html += '<td ' + clazz + ' title="' + day + '">' + this.timeToString(indexTaskType.times[day]) + '</td>';
    }
    html += '</tr>';
    for(var key in taskType.tasks) {
        var task = taskType.tasks[key];
        html += this.getTaskHtml(projectCodeId, taskTypeId, task.id);
    }
    return html;
}
StandardTimeSheet.prototype.getTaskHtml = function(projectCodeId, taskTypeId, taskId) {
    var indexTask = null;
    var task = this.getTask(projectCodeId, taskTypeId, taskId);
    var projectCodeTxt = null;
    if(projectCodeId == null) {
        indexTask = this.timeSpentIndex.internalData.taskTypes[taskTypeId].tasks[taskId];
        projectCodeTxt = 0;
    } else {
        indexTask = this.timeSpentIndex.projectData.projectCodes[projectCodeId].taskTypes[taskTypeId].tasks[taskId];
        projectCodeTxt = projectCodeId;
    }
    var html = "";
    html += '<tr id="' + this.htmlId + '_t_' + projectCodeTxt + '_' + taskId + '">';
    html += '<td style="padding-left: 30px;">' + task.name + '</td>';
    html += '<td class="sum">' + this.timeToString(indexTask.sum) + '</td>';
    for(var day = 1; day <= this.days; day++) {
        var clazz = "";
        if(isOfficialFreeday(this.freedays, this.year, this.month, day)) {
            clazz = 'class="holyday"';
        }
        html += '<td ' + clazz + ' id="' + this.htmlId + '_pc_t_d_' + projectCodeTxt + '_' + taskId + '_' + day + '" title="' + day + '">' + this.timeToString(indexTask.times[day]) + '</td>';
    }
    html += '</tr>';
    return html;
}
StandardTimeSheet.prototype.getTotalHtml = function() {
    html = "";
    html += '<tr class="total">';
    html += '<td style="padding-left: 5px;">Total</td>';
    html += '<td class="sum">' + this.timeToString(this.timeSpentIndex.sum) +  '</td>';
    for(var day = 1; day <= this.days; day++) {
        var clazz = "";
        if(isOfficialFreeday(this.freedays, this.year, this.month, day)) {
            clazz = 'class="holyday"';
        }
        html += '<td ' + clazz + ' title="' + day + '">' + this.timeToString(this.timeSpentIndex.times[day]) + '</td>';
    }
    html += '</tr>';
    return html;
}
StandardTimeSheet.prototype.getProjectCode = function(projectCodeId) {
    var projectCode = null;
    for(var key in this.timeSpentItemsInfo.projectData.projectCodes) {
        if(this.timeSpentItemsInfo.projectData.projectCodes[key].id == projectCodeId) {
            projectCode = this.timeSpentItemsInfo.projectData.projectCodes[key];
            break;
        }
    }
    return projectCode;
}
StandardTimeSheet.prototype.getTaskType = function(projectCodeId, taskTypeId) {
    var taskType = null;
    if(projectCodeId == null) {
        for(var key in this.timeSpentItemsInfo.internalData.taskTypes) {
            if(this.timeSpentItemsInfo.internalData.taskTypes[key].id == taskTypeId) {
                taskType = this.timeSpentItemsInfo.internalData.taskTypes[key];
                break;
            }
        }        
    } else {
        var projectCode = this.getProjectCode(projectCodeId);
        for(var key in projectCode.taskTypes) {
            if(projectCode.taskTypes[key].id == taskTypeId) {
                taskType = projectCode.taskTypes[key];
                break;
            }
        }         
    }
    return taskType;
}
StandardTimeSheet.prototype.getTask = function(projectCodeId, taskTypeId, taskId) {
    var task = null;
    var taskType = this.getTaskType(projectCodeId, taskTypeId);
    for(var key in taskType.tasks) {
        if(taskType.tasks[key].id == taskId) {
            task = taskType.tasks[key];
            break;
        }
    }
    return task;
}
StandardTimeSheet.prototype.getBusinessTripItemByProjectCodeIdDay = function(projectCodeId, day) {
    for(var key in this.businessTripItemsInfo.projectCodes) {
        var projectCode = this.businessTripItemsInfo.projectCodes[key];
        if(projectCode.id != projectCodeId) {
            continue;
        }
        for(var key2 in projectCode.businessTripItems) {
            var businessTripItem = projectCode.businessTripItems[key2];
            if(businessTripItem.day.year == this.year && businessTripItem.day.dayOfMonth == day) {
                return businessTripItem;
            }
        }
    }
    return null;
}

StandardTimeSheet.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + ' td').bind("click", function(event) {form.cellClickedHandle.call(form, event)});
}
StandardTimeSheet.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_addActivityBtn')
      .button({
          icons: {
            primary: "ui-icon-clock"
          }
      })
      .click(function(event) {
          form.addActivityBtnClickedHandle.call(form);
      });
    $('#' + this.htmlId + '_setBusinessTripItemsBtn')
      .button({
          icons: {
            primary: "ui-icon-suitcase"
          }
      })
      .click(function(event) {
          form.setBusinessTripItemsBtnClickedHandle.call(form);
      });
}
StandardTimeSheet.prototype.timeToString = function(time) {
    if(time == null || time == 0) {
        return "";
    }
    return time;
}
StandardTimeSheet.prototype.cellClickedHandle = function(event) {
    var id = event.currentTarget.id;
    if(id == null) {
        return;
    } else if(id.startsWith(this.htmlId + '_pc_t_d_')) {
        var tmp = id.split("_");
        var projectCodeId = tmp[tmp.length - 3];
        var taskId = tmp[tmp.length - 2];
        var day = tmp[tmp.length - 1];
        
        this.startUpdatingActivity(projectCodeId, taskId, day);
    }
}
StandardTimeSheet.prototype.addActivityBtnClickedHandle = function() {
    if(! this.isMonthClosed) {
        this.startAddingActivity();
    } else {
        doAlert("Info", "This month is closed", null, null);
    }
}
StandardTimeSheet.prototype.setBusinessTripItemsBtnClickedHandle = function() {
    var formData = {
        "year": this.year,
        "month": this.month,
        "timeSpentItemsInfo": this.timeSpentItemsInfo,
        "businessTripItemsInfo": this.businessTripItemsInfo,
        "freedays": this.freedays,
        "isMonthClosed": this.isMonthClosed
    }
    this.businessTripItemsForm = new BusinessTripItemsForm(formData, 'businessTripItemsForm', this, this.businessTripItemsFormClosedHandler);
    this.businessTripItemsForm.init();
}
// is not used
StandardTimeSheet.prototype.checkMonthIsClosedForUpdate = function(projectCodeId, taskId, day) {
    var form = this;
    var data = {};
    data.command = "checkMonthIsClosed";
    data.year = this.year;
    data.month = this.month;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "post",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                if(! result.isMonthClosed) {
                    form.startUpdatingActivity(projectCodeId, taskId, day);
                } else {
                    doAlert("Info", "This month is closed", null, null);
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
// is not used
StandardTimeSheet.prototype.checkMonthIsClosedForAdd = function() {
    var form = this;
    var data = {};
    data.command = "checkMonthIsClosed";
    data.year = this.year;
    data.month = this.month;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "post",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                if(! result.isMonthClosed) {
                    form.startAddingActivity();
                } else {
                    doAlert("Info", "This month is closed", null, null);
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
StandardTimeSheet.prototype.startAddingActivity = function() {
    if(this.timeSpentItemsForm == null) {
        this.timeSpentItemsForm = new TimeSpentItemsForm("create", 'timeSpentItemsForm', null, null, this.year, this.month, new Array(), this, this, this.timeSpentItemsFormClosedHandler);
        this.timeSpentItemsForm.init();
    }
}
StandardTimeSheet.prototype.startUpdatingActivity = function(projectCodeId, taskId, day) {
    if(this.timeSpentItemsForm == null) {
        this.timeSpentItemsForm = new TimeSpentItemsForm("update", 'timeSpentItemsForm', projectCodeId, taskId, this.year, this.month, new Array(day), this, this, this.timeSpentItemsFormClosedHandler);
        this.timeSpentItemsForm.init();
    }
}
StandardTimeSheet.prototype.timeSpentItemsFormClosedHandler = function(dataUpdated) {
    this.timeSpentItemsForm = null;
    if(dataUpdated) {
        this.loadAll();
    }
}
StandardTimeSheet.prototype.businessTripItemsFormClosedHandler = function(dataUpdated) {
    this.businessTripItemsForm = null;
    if(dataUpdated) {
        this.loadAll();
    }
}
StandardTimeSheet.prototype.dataChanged = function(value) {
    dataChanged = value;
}

