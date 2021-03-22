/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeePlanningViewer(employeeId, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeePlanningViewer.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Planning Read";
    this.data = {
        startDate: null,
        endDate: null,
        employeeId: employeeId
    }
    var now = new Date();
    this.data.startDate = {
        year: now.getFullYear(),
        month: 8,
        dayOfMonth: 1
    }
    this.data.endDate = {
        year: now.getFullYear() + 1,
        month: 7,
        dayOfMonth: 31
    }
    this.selected = {
        planningItemId: null,
        planningGroupId: null,
    }
    this.picked = {
        "employee": null
    }
    this.months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    this.shortMonths = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    this.loaded = {
        freedays: []
    }
    this.info = new PlanningToolInfo();
}
EmployeePlanningViewer.prototype.init = function() {
    if(this.data.employeeId != null) {
        this.loadEmployeeInfo();
    } else {
        this.show();
        contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
        this.normalizeContentSize();        
    }
}
EmployeePlanningViewer.prototype.loadEmployeeInfo = function() {
    var form = this;
    var data = {};
    data.command = "getEmployeeInfo";
    data.employeeId = this.data.employeeId;
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.picked.employee = result.employee;
                form.show();
                contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
                form.normalizeContentSize();        
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
EmployeePlanningViewer.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
EmployeePlanningViewer.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td><td colspan="3"><span class="label1">Employee</span></td><td></td></tr>';
    html += '<tr>';
    html += '<td><input type="text" id="' + this.htmlId + '_startDate' + '"></td>';
    html += '<td><input type="text" id="' + this.htmlId + '_endDate' + '"></td>';
    html += '<td><div id="' + this.htmlId + '_employee' + '"></div></td>';
    html += '<td><button id="' + this.htmlId + '_employee_pick' + '">Pick</button></td>';
    html += '<td><button id="' + this.htmlId + '_employee_clear' + '">Clear</button></td>';
    html += '<td colspan="2"><button id="' + this.htmlId + '_showBtn' + '">Show</button></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table><tr>';
    html += '<td><div id="' + this.htmlId + '_layoutResult" style="overflow: auto;"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutInfo" style="overflow: auto;"></div></td>';
    html += '</tr></table>';
    return html;
}
EmployeePlanningViewer.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').datepicker({
        dateFormat: 'dd.mm.yy',
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText, inst) {
            form.startDateChangedHandle(dateText, inst)
        }
    });
    $('#' + this.htmlId + '_endDate').datepicker({
        dateFormat: 'dd.mm.yy',
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText, inst) {
            form.endDateChangedHandle(dateText, inst)
        }
    });
}
EmployeePlanningViewer.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_showBtn')
            .button({
                icons: {
                    primary: "ui-icon-document"
                },
                text: true
            })
            .click(function(event) {
                form.showPlanningInfo.call(form);
            });

    $('#' + this.htmlId + '_employee_pick')
            .button({
                icons: {
                    primary: "ui-icon-search"
                },
                text: false
            })
            .click(function(event) {
                form.employeePickHandle.call(form);
            });

    $('#' + this.htmlId + '_employee_clear')
            .button({
                icons: {
                    primary: "ui-icon-trash"
                },
                text: false
            })
            .click(function(event) {
                form.employeeClearHandle.call(form);
            });
}
EmployeePlanningViewer.prototype.updateView = function() {
    this.updateEmployeeView();
    this.updateStartDateView();
    this.updateEndDateView();
}
EmployeePlanningViewer.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {
        form.startDateTextChangedHandle.call(form, event);
    });
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {
        form.endDateTextChangedHandle.call(form, event);
    });
}

EmployeePlanningViewer.prototype.startDateChangedHandle = function(dateText, inst) {
    var date = dateText;
    this.startDateStringChangedHandle(date);
}
EmployeePlanningViewer.prototype.startDateTextChangedHandle = function(event) {
    var date = jQuery.trim(event.currentTarget.value);
    this.startDateStringChangedHandle(date);
}
EmployeePlanningViewer.prototype.startDateStringChangedHandle = function(date) {
    if(date == null || $.trim(date) == '') {
        this.data.startDate = null;
    } if (isDateValid(date)) {
        this.data.startDate = getYearMonthDateFromDateString(date);
    }
    this.updateStartDateView();
    this.clearView();
}

EmployeePlanningViewer.prototype.endDateChangedHandle = function(dateText, inst) {
    var date = dateText;
    this.endDateStringChangedHandle(date);
}
EmployeePlanningViewer.prototype.endDateTextChangedHandle = function(event) {
    var date = jQuery.trim(event.currentTarget.value);
    this.endDateStringChangedHandle(date);
}
EmployeePlanningViewer.prototype.endDateStringChangedHandle = function(date) {
    if(date == null || $.trim(date) == '') {
        this.data.endDate = null;
    } if (isDateValid(date)) {
        this.data.endDate = getYearMonthDateFromDateString(date);
    }
    this.updateEndDateView();
    this.clearView();
}

EmployeePlanningViewer.prototype.employeePickHandle = function(event) {
    this.employeePicker = new EmployeePicker("employeePicker", this.employeePicked, this, this.moduleName);
    this.employeePicker.init();
}
EmployeePlanningViewer.prototype.employeePicked = function(employee) {
    this.data.employeeId = employee.id;
    this.picked.employee = employee;
    this.updateEmployeeView();
    this.clearView();
}
EmployeePlanningViewer.prototype.employeeClearHandle = function(event) {
    this.data.employeeId = null;
    this.picked.employee = null;
    this.updateEmployeeView();
    this.clearView();
}

EmployeePlanningViewer.prototype.updateEmployeeView = function() {
    var employeeFullName = 'Undefined';
    if (this.picked.employee != null) {
        employeeFullName = this.picked.employee.firstName + ' ' + this.picked.employee.lastName;
    }
    $('#' + this.htmlId + '_employee').html(employeeFullName);
}
EmployeePlanningViewer.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.data.startDate));
}
EmployeePlanningViewer.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.data.endDate));
}
EmployeePlanningViewer.prototype.validate = function() {
    var errors = [];
    if(this.data.startDate == null) {
        errors.push("Start date is not set");
    }
    if(this.data.endDate == null) {
        errors.push("End date is not set");
    }
    if(this.data.startDate != null && this.data.endDate != null && compareYearMonthDate(this.data.startDate, this.data.endDate) > 0) {
        errors.push("End date is less than Start date");
    }
    if(this.data.startDate != null && this.data.endDate != null && (this.data.endDate.year - this.data.startDate.year) > 1) {
        errors.push("Period is too big");
    }
    if(this.data.employeeId == null) {
        errors.push("Employee is not set");
    }
    return errors;
}
EmployeePlanningViewer.prototype.showPlanningInfo = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
        this.getPlanningInfo();
    }
}
EmployeePlanningViewer.prototype.getPlanningInfo = function() {
    var serverFormatData = {
        "startDate" : this.data.startDate,
        "endDate" : this.data.endDate,
        "employeeId" : this.data.employeeId
    };
    var form = this;
    var data = {};
    data.command = "getPlanningInfo";
    data.employeePlanningViewerForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.loaded.freedays = result.freedays;
                form.info.resetInfo();
                form.info.pushPlanningToolInfo(result.planningToolInfo);
                form.updatePlanningInfoView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
EmployeePlanningViewer.prototype.clearView = function() {
    $('#' + this.htmlId + '_layoutResult').html('');
    $('#' + this.htmlId + '_layoutInfo').html('');
}    

EmployeePlanningViewer.prototype.updatePlanningInfoView = function() {
    this.calculateEmptyCareer();

    var datesStructure = this.getDatesStructure(this.data.startDate, this.data.endDate);
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>Date</td>';
    html += '<td>Type</td>';
    html += '<td>Client</td>';
    html += '<td>Location</td>';
    html += '<td>Task</td>';
    html += '<td>Description</td>';
    html += '<td style="width: 20px;">&nbsp;</td>';
    html += '</tr>';
    for(var year in datesStructure) {
       for(var month in datesStructure[year]) {
           for(var day in datesStructure[year][month]) {
               var dayObj = datesStructure[year][month][day];
               var date = {
                   year: parseInt(year),
                   month: parseInt(month),
                   dayOfMonth: parseInt(day)
               }
               var planningItems = this.info.getPlanningItems(this.data.employeeId, date);
               if(planningItems.length == 0) {
                    if(dayObj.isFreeday) {
                        html += '<tr class="holyday">';
                    } else {
                        html += '<tr>';
                    }
                    html += '<td><span class="link" id="' + this.htmlId + '_date_' + date.year + '_' + date.month + '_' + date.dayOfMonth + '">' + getStringFromYearMonthDate(date) + '</span></td>';
                    html += '<td></td><td></td><td></td><td></td><td></td>';
                    if(this.isDateInEmptyCareer(date)) {
                        html += '<td style="background-color: #000000;"></td>';
                    } else {
                        html += '<td></td>';
                    }
                    html += '</tr>';                    
               } else {
                   var count = 0;
                   for(var key in planningItems) {
                       var planningItem = planningItems[key];
                       var planningGroup = this.info.getPlanningGroup(planningItem.planningGroupId);
                       var planningType = this.info.getPlanningType(planningGroup.planningTypeId);
                       var client = this.info.getClient(planningGroup.clientId);
                       var task = this.info.getTask(planningGroup.taskId);
                        var clientColor = '#FFFFFF';
                        var taskColor = '#FFFFFF';
                        if(client != null && client.color != null) {
                           clientColor = client.color;
                        }
                        if(task != null && task.color != null) {
                           taskColor = task.color;
                        }
                        var clientTextColor = getContrastColor(clientColor);
                        var taskTextColor = getContrastColor(taskColor);
                        
                        if(dayObj.isFreeday) {
                            html += '<tr class="holyday">';
                        } else {
                            html += '<tr>';
                        }
                        if(planningItems.length == 1) {
                            html += '<td><span class="link" id="' + this.htmlId + '_date_' + date.year + '_' + date.month + '_' + date.dayOfMonth + '">' + getStringFromYearMonthDate(date) + '</span></td>';
                        } else {
                            if(count == 0) {
                                html += '<td rowspan="' + planningItems.length + '"><span class="link" id="' + this.htmlId + '_date_' + date.year + '_' + date.month + '_' + date.dayOfMonth + '">' + getStringFromYearMonthDate(date) + '</span></td>';
                            }
                        }
                        
                        html += '<td>' + (planningType != null ? ('<span class="link" id="' + this.htmlId + '_planningItem_' + planningItem.id + '">' + planningType.name) : '') + '</td>';
                        if(client != null) {
                            html += '<td style="color: ' + clientTextColor + '; background-color: ' + clientColor + ';">' + client.name + '</td>';
                        } else {
                            html += '<td></td>';
                        }
                        html += '<td>' + (planningItem.location != null ? planningItem.location : '') + '</td>';
                        if(task != null) {
                            html += '<td style="color: ' + taskTextColor + '; background-color: ' + taskColor + ';">' + task.name + '</td>';
                        } else {
                            html += '<td></td>';
                        }
                        html += '<td>' + (planningItem.description != null ? planningItem.description : '') + '</td>';

                        if(this.isDateInEmptyCareer(date)) {
                            html += '<td style="background-color: #000000;">';
                        } else {
                            html += '<td>';
                        }
                        if(planningGroup.isApproved == false) {
                            html += '<div class="alert">&nbsp;</div>';
                        }
                        html += '</td>';
                        html += '</tr>'; 
                        count++;
                   }
               }
              
           }
       }
    }
    html += '</table>';
    $('#' + this.htmlId + '_layoutResult').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_planningItem_"]').bind('click', function(event) {form.planningItemClickedHandle.call(form, event);});
    $('span[id^="' + this.htmlId + '_date_"]').bind('click', function(event) {form.dateClickedHandle.call(form, event);});
}
EmployeePlanningViewer.prototype.calculateEmptyCareer = function() {
    var positionRanges = [];
    var employee = this.info.employees[0];
    for(var key in employee.employeePositionHistoryItems) {
        var employeePositionHistoryItem = employee.employeePositionHistoryItems[key];
        var range = {
            start: employeePositionHistoryItem.startDate,
            end: employeePositionHistoryItem.endDate
        }
        if(employeePositionHistoryItem.endDate == null) {
            if(compareYearMonthDate(employeePositionHistoryItem.startDate, this.data.endDate) > 0) {
                range.end = employeePositionHistoryItem.startDate;
            } else {
                range.end = this.data.endDate;
            }
        }
        positionRanges.push(range);
    }
    var period = {
        start: this.data.startDate,
        end: this.data.endDate
    }
    this.emptyCareer = getSubtractionOfRangesFromRange(clone(period), positionRanges);
}
EmployeePlanningViewer.prototype.isDateInEmptyCareer = function(date) {
    for(var key in this.emptyCareer) {
        var period = this.emptyCareer[key];
        if(compareYearMonthDate(date, period.start) >= 0 && compareYearMonthDate(date, period.end) <= 0) {
           return true; 
        }
        return false;           
    }    
}
EmployeePlanningViewer.prototype.getDatesStructure = function(start, end) {
    var structure = {};
    for(var year = start.year; year <= end.year; year++) {
        structure[year] = {};
        var startMonth = start.month;
        var endMonth = end.month;
        if(year == start.year) {
            startMonth = start.month;
        } else {
            startMonth = 0;
        }
        if(year == end.year) {
            endMonth = end.month;
        } else {
            endMonth = 11;
        }
        for(var month = startMonth; month <= endMonth; month++) {
            structure[year][month] = {}
            var startDay = start.dayOfMonth;
            var endDay = end.dayOfMonth;
            if(year == start.year && month == start.month) {
                startDay = start.dayOfMonth;
            } else {
                startDay = 1;
            }
            if(year == end.year && month == end.month) {
                endDay = end.dayOfMonth;
            } else {
                endDay = getDays(year, month);
            }
            for(var day = startDay; day <= endDay; day++) {
                structure[year][month][day] = {
                    isFreeday: isOfficialFreeday(this.loaded.freedays, year, month, day)
                };
            }
        }
    }    
    return structure;
}
EmployeePlanningViewer.prototype.normalizeContentSize = function() { 
    jQuery('#' + this.htmlId + '_layoutResult').width(contentWidth - 350);
    jQuery('#' + this.htmlId + '_layoutResult').height(contentHeight - 90);

    jQuery('#' + this.htmlId + '_layoutInfo').width(270);
    jQuery('#' + this.htmlId + '_layoutInfo').height(contentHeight - 90);
}
EmployeePlanningViewer.prototype.dateClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var year = parseInt(tmp[tmp.length - 3]);
    var month = parseInt(tmp[tmp.length - 2]);
    var dayOfMonth = parseInt(tmp[tmp.length - 1]);
    var date = {
        year: year,
        month: month,
        dayOfMonth: dayOfMonth
    }
    this.selected.date = date;
    this.updateDateInfo();
}
EmployeePlanningViewer.prototype.planningItemClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var planningItemId = parseInt(tmp[tmp.length - 1]);
    this.selected.planningItemId = planningItemId;
    this.updatePlanningItemInfo();
}
EmployeePlanningViewer.prototype.planningGroupClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var planningGroupId = parseInt(tmp[tmp.length - 1]);
    this.selected.planningGroupId = planningGroupId;
    this.loadPlanningGroupInfo(planningGroupId);
}
EmployeePlanningViewer.prototype.loadPlanningGroupInfo = function(planningGroupId) {
    var form = this;
    var data = {};
    data.command = "getPlanningGroupInfo";
    data.planningGroupId = planningGroupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.info.pushPlanningToolInfo(result.planningToolInfo);
            form.selected.planningGroupId = planningGroupId;
            form.updatePlanningGroupInfo();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeePlanningViewer.prototype.updateDateInfo = function(event) {
    var date = this.selected.date;
    var employee = this.info.getEmployee(this.data.employeeId);
    var employeePositionHistoryItem = this.info.getEmployeePositionHistoryItem(employee.employeePositionHistoryItems, date);
    var position = null;
    var standardPosition = null;
    if(employeePositionHistoryItem != null) {
        position = this.info.getPosition(employeePositionHistoryItem.positionId);
        standardPosition = this.info.getStandardPosition(position.standardPositionId);
    }
    var planningItems = this.info.getPlanningItems(employee.id, date);
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Date</td></tr>';
    html += '<tr><td><div class="comment1">Employee</div>' + employee.firstName + ' ' + employee.lastName + '</td></tr>';
    html += '<tr><td><div class="comment1">Standard position</div>' + (standardPosition != null ? standardPosition.name : 'No standard position') + '</td></tr>';
    html += '<tr><td><div class="comment1">Position</div>' + (position != null ? position.name : 'No position') + '</td></tr>';
    html += '<tr><td><div class="comment1">Period</div>' + (employeePositionHistoryItem != null ? getStringFromRange(employeePositionHistoryItem.startDate, employeePositionHistoryItem.endDate) : '') + '</td></tr>';
    html += '</td></tr>';
    html += '<tr><td><div class="comment1">Day</div>' + getStringFromYearMonthDate(date) + '</td></tr>';
    for(var key in planningItems) {
        var planningItem = planningItems[key];
        html += '<tr><td><span class="link" id="' + this.htmlId + '_cellProperties_planningItem_' + planningItem.id + '">' + planningItem.description + '</span></td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_layoutInfo').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_cellProperties_planningItem_"]').bind('click', function(event) {form.planningItemClickedHandle.call(form, event);});
}
EmployeePlanningViewer.prototype.updatePlanningItemInfo = function() {
    var planningItem = this.info.getPlanningItem(this.selected.planningItemId);
    var clientName = '';
    var taskName = '';
    var clientColor = '#FFFFFF';
    var taskColor = '#FFFFFF';
    var client = null;
    var task = null;
    var planningGroup = this.info.getPlanningGroup(planningItem.planningGroupId);
    var planningType = this.info.getPlanningType(planningGroup.planningTypeId);
    if(planningGroup.clientId != null) {
        client = this.info.getClient(planningGroup.clientId);
        clientName = client.name;
        if(client.color != null) {
            clientColor = client.color;
        }
    } else if(planningGroup.taskId != null) {
        task = this.info.getTask(planningGroup.taskId);
        taskName = task.name;
        if(task.color != null) {
            taskColor = task.color;
        }
    }
    var planningGroupHtml = '<span class="link" id="' + this.htmlId + '_planningItemProperties_planningGroup_' + planningItem.planningGroupId + '">' + planningType.name + '</span><br />' + planningGroup.description;

    var clientTextColor = getContrastColor(clientColor);
    var taskTextColor = getContrastColor(taskColor);
    var employee = this.info.getEmployee(planningItem.employeeId);
    var targetSubdepartment = this.info.getSubdepartment(planningItem.targetSubdepartmentId);
    var sourceSubdepartment = this.info.getSubdepartment(planningItem.sourceSubdepartmentId);
    var targetSubdepartmentName = targetSubdepartment.officeName + ' / ' + targetSubdepartment.departmentName + ' / ' + targetSubdepartment.subdepartmentName;
    var sourceSubdepartmentName = sourceSubdepartment.officeName + ' / ' + sourceSubdepartment.departmentName + ' / ' + sourceSubdepartment.subdepartmentName;
    var html = '';
    html += '<table class="datagrid" id="' + this.htmlId + '_planningItemInfo' + '">';
    html += '<tr class="dgHeader"><td>Planning item</td></tr>';
    html += '<tr><td><div class="comment1">Planning group</div>';
    if(planningGroup.isApproved == false) {
        html += '<div class="alert">' + planningGroupHtml + '</div>';    
    } else {
        html += planningGroupHtml;
    }
    html += '</td></tr>'; 
    html += '<tr><td><div class="comment1">Description</div>' + planningItem.description + '</td></tr>'; 
    html += '<tr><td><div class="comment1">Location</div>' + planningItem.location + '</td></tr>'; 
    html += '<tr><td><div class="comment1">Period</div>' + getStringFromRange(planningItem.startDate, planningItem.endDate) + '</td></tr>'; 
    html += '<tr><td><div class="comment1">Employee</div>' + employee.firstName + ' ' + employee.lastName + '</td></tr>'; 
    if(client != null) {
        html += '<tr><td style="width: 10px; height: 10px; color: ' + clientTextColor + '; background-color: ' + clientColor + ';"><div class="comment1">Client</div>' + clientName + '</td></tr>'; 
    }
    if(task != null) {
        html += '<tr><td style="width: 10px; height: 10px; color: ' + taskTextColor + '; background-color: ' + taskColor + ';"><div class="comment1">Task</div>' + taskName + '</td></tr>'; 
    }
    html += '<tr><td><div class="comment1">Target</div>' + targetSubdepartmentName + '</td></tr>'; 
    html += '<tr><td><div class="comment1">Source</div>' + sourceSubdepartmentName + '</td></tr>'; 
    html += '</table>';
    $('#' + this.htmlId + '_layoutInfo').html(html);
    
    var form = this;
    $('span[id^="' + this.htmlId + '_planningItemProperties_planningGroup_"]').bind('click', function(event) {form.planningGroupClickedHandle.call(form, event);});
}
EmployeePlanningViewer.prototype.updatePlanningGroupInfo = function() {
    var planningGroup = this.info.getPlanningGroup(this.selected.planningGroupId);
    var inChargePerson = this.info.getInChargePerson(planningGroup.inChargePersonId);
    var targetSubdepartment = this.info.getSubdepartment(planningGroup.targetSubdepartmentId);
    var targetSubdepartmentName = targetSubdepartment.officeName + ' / ' + targetSubdepartment.departmentName + ' / ' + targetSubdepartment.subdepartmentName;
    var planningItems = this.info.getPlanningItemsOfPlanningGroup(this.selected.planningGroupId);
    
    var clientName = '';
    var taskName = '';
    var clientColor = '#FFFFFF';
    var taskColor = '#FFFFFF';
    var client = null;
    var task = null;
    var planningType = this.info.getPlanningType(planningGroup.planningTypeId);
    if(planningGroup.clientId != null) {
        client = this.info.getClient(planningGroup.clientId);
        clientName = client.name;
        if(client.color != null) {
            clientColor = client.color;
        }
    } else if(planningGroup.taskId != null) {
        task = this.info.getTask(planningGroup.taskId);
        taskName = task.name;
        if(task.color != null) {
            taskColor = task.color;
        }
    }
    var clientTextColor = getContrastColor(clientColor);
    var taskTextColor = getContrastColor(taskColor);
    
    var html = '';
    html += '<div style="overflow: auto">';
    html += '<table class="datagrid" id="' + this.htmlId + '_planningItemInfo' + '">';
    html += '<tr class="dgHeader"><td>Planning group</td></tr>';
    html += '<tr><td><div class="comment1">Type</div>' + planningType.name + '</td></tr>';
    html += '<tr><td><div class="comment1">Description</div>';
    if(planningGroup.isApproved == false) {
        html += '<div class="alert">' + planningGroup.description + '</div>';    
    } else {
        html += planningGroup.description;
    }
    html += '</td></tr>';
    if(client != null) {
        html += '<tr><td style="width: 10px; height: 10px; color: ' + clientTextColor + '; background-color: ' + clientColor + ';"><div class="comment1">Client</div>' + clientName + '</td></tr>'; 
    }
    
    if(planningType.isInternal != true) {
        html += '<tr><td><div class="comment1">Project code</div>';
        if(planningGroup.projectCodeIds.length > 0) {
            for(var key in planningGroup.projectCodeIds) {
                var projectCode = this.info.getProjectCode(planningGroup.projectCodeIds[key]);
                html += (projectCode.code) + '<div class="comment1">' + projectCode.description + '</div>'; 
            }
        } else {
            html += 'Not assigned';
        }
        html += '</td></tr>';
    }    
    
    if(task != null) {
        html += '<tr><td style="width: 10px; height: 10px; color: ' + taskTextColor + '; background-color: ' + taskColor + ';"><div class="comment1">Task</div>' + taskName + '</td></tr>'; 
    }
    html += '<tr><td><div class="comment1">Target</div>' + targetSubdepartmentName + '</td></tr>'; 
    html += '<tr><td><div class="comment1">Person in charge</div>' + (inChargePerson != null ? (inChargePerson.firstName + ' ' + inChargePerson.lastName) : '') + '</td></tr>'; 
    for(var key in planningItems) {
        var planningItem = planningItems[key];
        var employee = this.info.getEmployee(planningItem.employeeId);
        html += '<tr><td><div class="comment1">Item</div>';
        html += planningItem.description + '<br />';
        html += employee.firstName + ' ' + employee.lastName + '<br />';
        html += getStringFromRange(planningItem.startDate, planningItem.endDate) + '<br />';
        html += '</td></tr>'; 
    }   
    html += '</table>';
    html += '</div>';
    $('#' + this.htmlId + '_layoutInfo').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_planningGroupProperties_planningItem_"]').bind('click', function(event) {form.planningItemSpanClickHandle.call(form, event);});
}
