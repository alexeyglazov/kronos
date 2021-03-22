/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PlanningTool(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "PlanningTool.jsp",
        standardPositionCellHeight: 15,
        positionCellHeight: 15,
        mainCellHeight: 25,
        mainCellWidths: new Array(25, 50, 100)
    };
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.selected = {
        subdepartmentId: null
    }
    this.loaded = {
        "subdepartments": [],
        "writableSubdepartments": [],
        "planningToolInfo": []
    }
    this.info = new PlanningToolInfo();
    this.subdepartmentEditedInfo = [];
    this.selected = {
        key: null,
        cell: null       
    }
    this.months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    this.shortMonths = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    this.time = {
        cursor: null,
        scale: 1,
        displayPeriod: {start: null, end: null},
        dates: {
            structure: {},
            total: null
        }
    }
}
PlanningTool.prototype.init = function() {
    var now = new Date();
    this.time.cursor = {
        year: now.getFullYear(),
        month: now.getMonth(),
        dayOfMonth: now.getDate()        
    }
    
    this.showLayout();
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.calculateDisplayPeriod();
    this.loadInitialContent();
    this.dataChanged(false);
}
PlanningTool.prototype.calculateDisplayPeriod = function() {
    var displayDays = Math.floor(jQuery('#' + this.htmlId + '_planning').width() / this.config.mainCellWidths[this.time.scale]);
    this.time.displayPeriod = {
        start : this.time.cursor,
        end : getShiftedYearMonthDate(this.time.cursor, displayDays)
    }    
}
PlanningTool.prototype.getDatesStructure = function(start, end) {
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
PlanningTool.prototype.getTotal = function(structure) {
    var total = 0;
    for(var year in structure) {
        for(var month in structure[year]) {
            for(var day in structure[year][month]) {
                total++;
            }
        }
    }
    return total;
}
PlanningTool.prototype.getSubdepartment = function(subdepartmentId) {
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        if(subdepartmentId == subdepartment.subdepartmentId) {
            return subdepartment;
        }
    }
    return null;
}
PlanningTool.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.start = getJSON(this.time.displayPeriod.start);
    data.end = getJSON(this.time.displayPeriod.end);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.writableSubdepartments = result.writableSubdepartments;
            form.loaded.isWritable = result.isWritable;
            form.loaded.lockedBy = result.lockedBy;
            form.loaded.lockedAt = result.lockedAt;
            form.selected.subdepartmentId = result.selectedSubdepartmentId;
            form.info.pushPlanningToolInfo(result.planningToolInfo);
            form.info.sort();
            form.info.buildLevelInfo();
            form.loaded.freedays = result.freedays;
            form.time.dates.structure = form.getDatesStructure(this.time.displayPeriod.start, this.time.displayPeriod.end);
            form.time.dates.total = form.getTotal(this.time.dates.structure);
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningTool.prototype.loadContent = function() {
    var totalEditedInfo = new PlanningToolInfo();
    for(var key in this.subdepartmentEditedInfo) {
        totalEditedInfo.pushPlanningToolInfo(this.subdepartmentEditedInfo[key]);
    }
    var editedInfo = totalEditedInfo.getEditedInfoForSubdepartment(this.selected.subdepartmentId);
    
    var form = this;
    var data = {};
    data.command = "getContent";
    data.start = getJSON(this.time.displayPeriod.start);
    data.end = getJSON(this.time.displayPeriod.end);
    data.subdepartmentId = this.selected.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.isWritable = result.isWritable;
            form.loaded.lockedBy = result.lockedBy;
            form.loaded.lockedAt = result.lockedAt;
            form.info.resetInfo();
            form.info.pushPlanningToolInfo(result.planningToolInfo);
            form.info.pushPlanningToolInfo(editedInfo);
            form.info.sort();
            form.info.buildLevelInfo();
            form.loaded.freedays = result.freedays;
            form.time.dates.structure = form.getDatesStructure(this.time.displayPeriod.start, this.time.displayPeriod.end);
            form.time.dates.total = form.getTotal(this.time.dates.structure);
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningTool.prototype.loadEmployeeCarreerInfo = function(employeeIds, start, end) {
    var form = this;
    var data = {};
    data.command = "getEmployeeCarreerInfo";
    data.start = getJSON(start);
    data.end = getJSON(end);
    data.employeeIds = getJSON({"list": employeeIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.info.pushDescribedCarreersInfo(result.describedCarreersInfo);
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningTool.prototype.loadPlanningGroupInfo = function(planningGroupId) {
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
PlanningTool.prototype.saveEditedPlanningItems = function() {
    var planningToolInfo = new PlanningToolInfo();
    for(var subdepartmentId in this.subdepartmentEditedInfo) {
        var editedInfo = this.subdepartmentEditedInfo[subdepartmentId];
        planningToolInfo.pushPlanningToolInfo(editedInfo);
    }
    var planningToolForm = {
        planningItems: planningToolInfo.planningItems
    }
    var form = this;
    var data = {};
    data.command = "savePlanningItems";
    data.planningToolForm = getJSON(planningToolForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            $.sticky('Modified info has been successfully saved');
            form.info.clearEditedInfo();
            form.editedInfo = null;
            form.loadContent();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningTool.prototype.showLayout = function() {
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    $('#' + this.htmlId + '_planning').bind('scroll', function(event) {form.gridScrollHandle.call(form, event)});
    this.setHandlers();
    this.makeButtons();
    this.makeSliders();
    this.updateLayoutView();
    this.normalizeContentSize();
}

PlanningTool.prototype.show = function() {
    this.updateView();
}
PlanningTool.prototype.getHtml = function() {
    var html = '';  
    html += '<table>';
    html += '<tr>';
    html += '<td>';
    html += '<table><tr>';
    html += '<td><button id="' + this.htmlId + '_filterBtn">Filter</button></td>';
    html += '<td><button id="' + this.htmlId + '_colorBtn">Color</button></td>';
    html += '<td><button id="' + this.htmlId + '_seekPrevBtn">Prev</button></td>';
    html += '<td><button id="' + this.htmlId + '_seekNextBtn">Next</button></td>';
    html += '<td><select id="' + this.htmlId + '_year"></select></td>';
    html += '<td><select id="' + this.htmlId + '_month"></select></td>';
    html += '<td><div id="' + this.htmlId + '_scale" style="width:50px;"></div><div id="' + this.htmlId + '_scaleValue"></div></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartment"></select><div class="comment1" id="' + this.htmlId + '_subdepartmentInfo"></div></td>';
    html += '<td><button id="' + this.htmlId + '_lockBtn">Lock subdepartment</button></td>';
    html += '<td><button id="' + this.htmlId + '_initPlanningItemBatchCreationBtn">Planning group creation</button></td>';
    html += '<td><button id="' + this.htmlId + '_saveBtn">Save</button></td>';
    html += '</tr></table>';
    html += '</td>';
    html += '<td id="aaa">';
    html += '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>';

    html += '<table>';
    html += '<tr>';
    html += '<td style="height: 25px; padding: 0px;"></td>'
    html += '<td style="height: 25px; padding: 0px;" id="' + this.htmlId + '_layoutHeader">';
        html += '<div style="width: 200px; height: 30px; overflow: hidden;" id="' + this.htmlId + '_header" class="planning"></div>';
    html += '</td>';   
    html += '</tr>';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_layoutEmployees" style="padding: 0px;">';
        html += '<div style="width: 200px; height: 300px; overflow: hidden;" id="' + this.htmlId + '_employees" class="planning"></div>';
    html += '</td>'
    html += '<td id="' + this.htmlId + '_layoutPlanning" style="padding: 0px;">';
        html += '<div style="width: 300px; height: 300px; overflow-x: hidden; position: relative;" id="' + this.htmlId + '_planning" class="planning"></div>'
    html += '</td>';   
    html += '</tr>';
    html += '</table>';
    
    html += '</td>';
    html += '<td id="' + this.htmlId + '_layoutInfo">';
        html += '<div style="width: 100px; height: 300px; overflow: auto; position: relative;" id="' + this.htmlId + '_info"></div>'
    html += '</td>';
    html += '</tr>';
    html += '</table>';
    html += '<div id="bars"></div>';
    return html;
}
PlanningTool.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_filterBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function(event) {
          form.showFilter();
      });
      
    $('#' + this.htmlId + '_lockBtn')
      .button({
        icons: {
            primary: "ui-icon-locked"
        },
        text: false
        })
      .click(function(event) {
          form.lock();
      });

      $('#' + this.htmlId + '_initPlanningItemBatchCreationBtn')
      .button({
        icons: {
            primary: "ui-icon-copy"
        },
        text: false
        })
      .click(function(event) {
          form.initPlanningItemBatchCreation();
      });
      
      $('#' + this.htmlId + '_saveBtn')
      .button({
        icons: {
            primary: "ui-icon-disk"
        },
        text: false
        })
      .click(function(event) {
          form.save();
      });

    $('#' + this.htmlId + '_colorBtn')
      .button({
        icons: {
            primary: "ui-icon-bullet"
        },
        text: false
        })
      .click(function(event) {
          form.showColorMapperForm();
      });
      
    $('#' + this.htmlId + '_seekPrevBtn')
      .button({
        icons: {
            primary: "ui-icon-seek-prev"
        },
        text: false
        })
      .click(function(event) {
          form.seekPrev();
      });
      
    $('#' + this.htmlId + '_seekNextBtn')
      .button({
        icons: {
            primary: "ui-icon-seek-next"
        },
        text: false
        })
      .click(function(event) {
          form.seekNext();
      });        
}
PlanningTool.prototype.makeSliders = function() {
    var form = this;
    $('#' + this.htmlId + '_scale')
      .slider({
      min: 0,
      max: 2,
      step: 1,
      stop: function( event, ui ) {
        form.scaleChangedHandle.call(form, event, ui);
      },
      slide: function( event, ui ) {
        form.updateScaleValueView.call(form, ui.value);
      }              
    });      
}
PlanningTool.prototype.updateLayoutView = function() {
    this.updateScaleView();
    this.updateYearView();
    this.updateMonthView();
}

PlanningTool.prototype.updateView = function() {
    this.updateSubdepartmentView();
    this.updateHeaderView();
    this.updateEmployeesView();
    this.updateGridView();
    this.updateItemsView();
}
PlanningTool.prototype.updateSubdepartmentView = function() {
    var html = "";
    for(var key in this.loaded.subdepartments) {
        var item = this.loaded.subdepartments[key];
        var isSelected = "";
        if(item.subdepartmentId == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ item.subdepartmentId +'" ' + isSelected + '>' + item.officeName + ' / ' + item.departmentName + ' / ' +item.subdepartmentName + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
    var infoHtml = '';
    if(! this.loaded.isWritable) {
        infoHtml += 'Read only';
    } else if(this.loaded.lockedBy != null) {
        infoHtml += 'Locked: ' + this.loaded.lockedBy.firstName + ' ' + this.loaded.lockedBy.lastName;
        infoHtml += ', ' + getStringFromYearMonthDateTime(this.loaded.lockedAt);
    }
    $('#' + this.htmlId + '_subdepartmentInfo').html(infoHtml);
}
PlanningTool.prototype.updateHeaderView = function() {
    var width = this.config.mainCellWidths[this.time.scale] * this.time.dates.total;
    var html = '';
    html += '<table class="datagrid" style="width: ' + width + 'px;">';
    html += '<tr class="dgHeader">';
    for(var year in this.time.dates.structure) {
       for(var month in this.time.dates.structure[year]) {
           var days = this.time.dates.structure[year][month];
           html += '<td colspan="' + Object.keys(days).length + '">';
           if(Object.keys(days).length * this.config.mainCellWidths[this.time.scale] > 100 ) {
            html += year + ' ' +this.months[month];
           }
           html += '</td>';
       }
    }   
    html += '</tr>';
    html += '<tr class="dgHeader">';
    for(var year in this.time.dates.structure) {
       for(var month in this.time.dates.structure[year]) {
           for(var day in this.time.dates.structure[year][month]) {
               var dayObj = this.time.dates.structure[year][month][day];
               if(dayObj.isFreeday) {
                    html += '<td class="holyday">' + day + '</td>';
               } else {
                   html += '<td>' + day + '</td>';
               }
           }
       }
    }   
    html += '</tr>';
    html += '</table>';
    $('#' + this.htmlId + '_header').html(html);
}
PlanningTool.prototype.updateEmployeesView = function() {
    var html = '';
    html += '<table style="width: 500px;" class="datagrid">';
    for(var eKey in this.info.employees) {
        var employee = this.info.employees[eKey];
        var title = employee.userName;
        var trId = this.htmlId + '_employeeRow_' + employee.id;
        html += '<tr id="' + trId + '">';
        html += '<td title="' + title + '"><span class="link" id="' + this.htmlId + '_employee_' + employee.id + '">' + employee.firstName + ' ' + employee.lastName + '</span></td>';
        html += '</tr>';
    }   
    html += '</table>';   
    $('#' + this.htmlId + '_employees').html(html);
    for(var eKey in this.info.employees) {
        var employee = this.info.employees[eKey];
        var trId = this.htmlId + '_employeeRow_' + employee.id;
        var maxLevel = this.info.getMaxLevelOfEmployee(employee.id);
        var height = this.config.mainCellHeight * (1 + maxLevel);
        $('#' + trId).height(height);
    }
    var form = this;
    $('[id^="' + this.htmlId + '_employee_"]').bind("click", function(event) {form.employeeClickedHandle.call(form, event);});      
}
PlanningTool.prototype.updateGridView = function() {
    var width = this.config.mainCellWidths[this.time.scale] * this.time.dates.total;
    var html = '';
    html += '<table class="datagrid" style="width: ' + width + 'px;" id="' + this.htmlId + '_grid' + '">';
    for(var eKey in this.info.employees) {
        var employee = this.info.employees[eKey];
        var trId = this.htmlId + '_row_' + employee.id;
        html += '<tr id="' + trId + '">';
        for(var year in this.time.dates.structure) {
           for(var month in this.time.dates.structure[year]) {
               for(var day in this.time.dates.structure[year][month]) {
                   var dayObj = this.time.dates.structure[year][month][day];
                    var id = this.htmlId + '_cell_' + employee.id + '_' + year + '_' + month + '_' + day;
                    if(dayObj.isFreeday) {
                        html += '<td id="' + id +'" class="holyday"></td>';
                    } else {
                        html += '<td id="' + id +'"></td>';
                    }
               }
           }
        }
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_planning').html(html);
    var count = 0;
    for(var eKey in this.info.employees) {
        var employee = this.info.employees[eKey];
        var positionRanges = [];
        for(var key in employee.employeePositionHistoryItems) {
            var employeePositionHistoryItem = employee.employeePositionHistoryItems[key];
            var range = {
                start: employeePositionHistoryItem.startDate,
                end: employeePositionHistoryItem.endDate
            }
            if(employeePositionHistoryItem.endDate == null) {
                if(compareYearMonthDate(employeePositionHistoryItem.startDate, this.time.displayPeriod.end) > 0) {
                    range.end = employeePositionHistoryItem.startDate;
                } else {
                    range.end = this.time.displayPeriod.end;
                }
            }
            positionRanges.push(range);
        }
        var emptyIntervals = getSubtractionOfRangesFromRange(clone(this.time.displayPeriod), positionRanges);
        count++;
        for(var key in emptyIntervals) {
            var emptyInterval = emptyIntervals[key];
            var structure = this.getDatesStructure(emptyInterval.start, emptyInterval.end);
            for(var year in structure) {
               for(var month in structure[year]) {
                   for(var day in structure[year][month]) {
                       var dayObj = structure[year][month][day];
                        var id = this.htmlId + '_cell_' + employee.id + '_' + year + '_' + month + '_' + day;
                        $('#' + id).css('background-color', '#000000');
                   }
               }
            }            
        }
    }
    
    for(var eKey in this.info.employees) {
        var employee = this.info.employees[eKey];
        var trId = this.htmlId + '_row_' + employee.id;
        var maxLevel = this.info.getMaxLevelOfEmployee(employee.id);
        var height = this.config.mainCellHeight * (1 + maxLevel);
        $('#' + trId).height(height);
    }    
    var form = this;
    $('[id^="' + this.htmlId + '_cell_"]').bind("click", function(event) {form.cellClickedHandle.call(form, event);});      
}

PlanningTool.prototype.updateItemsView = function() {
    for(var key in this.info.planningItems) {
        var planningItem = this.info.planningItems[key];
        this.updateItemView(planningItem.id);
    }        
}
PlanningTool.prototype.updateEmployeeItemsView = function(employeeId) {
    for(var key in this.info.planningItems) {
        var planningItem = this.info.planningItems[key];
        if(planningItem.employeeId == employeeId) {
            this.updateItemView(planningItem.id);
        }
    }        
}
PlanningTool.prototype.removeItemView = function(planningItemId) {
    $('#' + this.htmlId + '_item_' + planningItemId).remove();    
}
PlanningTool.prototype.updateItemView = function(planningItemId) {
    this.removeItemView(planningItemId);
    var item = this.info.getPlanningItem(planningItemId);
    if(compareYearMonthDate(item.startDate, this.time.displayPeriod.end) > 0 || compareYearMonthDate(item.endDate, this.time.displayPeriod.start) < 0) {
        return;
    }    
    if(item == null) {
        return;
    }
    var title = '';
    var color = '#000000';
    var planningGroup = this.info.getPlanningGroup(item.planningGroupId);
    var cssClass = 'planningItem';
    if(planningGroup.isApproved == false) {
        cssClass += ' alert';
    }
    if(planningGroup.clientId != null) {
        var client = this.info.getClient(planningGroup.clientId);
        if(client.alias != null && client.alias != '') {
            title = client.alias;
        } else {
            title = client.name;
        }
        if(client.color != null) {
            color = client.color;
        }
    } else if(planningGroup.taskId != null) {
        var task = this.info.getTask(planningGroup.taskId);
        title = task.name;
        if(task.color != null) {
            color = task.color;
        }
    }

    var textColor = getContrastColor(color);
    var employeeId = item.employeeId;
    var display = {
        startDate: item.startDate,
        endDate: item.endDate
    }
    var editable = this.isEditable();
    if(compareYearMonthDate(item.startDate, this.time.displayPeriod.start) < 0) {
        display.startDate = this.time.displayPeriod.start;
        editable = false;
    }
    if(compareYearMonthDate(item.endDate, this.time.displayPeriod.end) > 0) {
        display.endDate = this.time.displayPeriod.end;
        editable = false;
    }
    
    
    var height = 25;
    var startCell = {
        employeeId: employeeId,
        day: display.startDate
    }
    var endCell = {
        employeeId: employeeId,
        day: display.endDate
    }
    var startGeom = this.getCellGeom(startCell);
    var endGeom = this.getCellGeom(endCell);
    var startOffset = {
        left: startGeom.left,
        top: startGeom.top        
    }
    startOffset.top += (item.level * height)
    var width = endGeom.left - startGeom.left + endGeom.width - 1;
    
    startOffset.left += $('#' + this.htmlId + '_planning').scrollLeft();
    startOffset.top += $('#' + this.htmlId + '_planning').scrollTop();
    
    var id = this.htmlId + '_item_' + planningItemId;
    var html = '<div id="' + id + '" style="width: ' + width + 'px; color: ' + textColor + '; background-color: ' + color + ';" class="' + cssClass + '">' + title + '</div>';
    $('#' + this.htmlId + '_planning').append(html);
    $('#' + id).offset(startOffset);
    var form = this;
    if(editable) {
        $('#' + id).draggable({
             containment: '#' + this.htmlId + '_grid',
             distance: 10,
             stop: function( event, ui ) {
                 form.planningItemMovedHandle(event, ui);
             }
        }).resizable({
            handles: "e, w",
            containment: '#' + this.htmlId + '_grid',
            distance: 10,
            stop: function( event, ui ) {
                form.planningItemResizedHandle(event, ui);
            }
        });
    }

    $('[id^="' + this.htmlId + '_item_"]').bind("click", function(event) {form.planningItemClickedHandle.call(form, event);});      
}
PlanningTool.prototype.makePlanningItemSelection = function(planningItemId) {
    if(this.selected.planningItemId != null) {
        $('#' + this.htmlId + '_item_' + this.selected.planningItemId).removeClass('shadow');
    }
    this.selected.planningItemId = planningItemId;
    this.updatePlanningItemInfo();
    var planningItemIds = this.info.getIntersectingPlanningItemIds(planningItemId);
    var maxZIndex = 0;
    for(var key in planningItemIds) {
        var planningItemIdTmp = planningItemIds[key];
        var zIndex = $('#' + this.htmlId + '_item_' + planningItemIdTmp).css('z-index');
        if(zIndex > maxZIndex) {
            maxZIndex = zIndex;
        }
    }
    $('#' + this.htmlId + '_item_' + planningItemId).css('z-index', maxZIndex + 1);
    $('#' + this.htmlId + '_item_' + planningItemId).addClass('shadow');
}

PlanningTool.prototype.updateYearView = function() {
    var html = '';
    for(var year =  this.time.cursor.year - 2; year < this.time.cursor.year + 3; year++) {
        var isSelected = "";
        if(this.time.cursor.year == year) {
           isSelected = "selected";
        }
        html += '<option value="' + year + '" ' + isSelected + '>' + year + '</option>'
    }
    $('#' + this.htmlId + '_year').html(html);
}
PlanningTool.prototype.updateMonthView = function() {
    var html = '';
    for(var key in this.shortMonths) {
        var month = this.shortMonths[key];
        var isSelected = "";
        if(this.time.cursor.month == key) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + month + '</option>'
    }
    $('#' + this.htmlId + '_month').html(html);    
}
PlanningTool.prototype.updateScaleView = function() {
    $('#' + this.htmlId + '_scale').slider( "value", this.time.scale);
    this.updateScaleValueView(this.time.scale);
}
PlanningTool.prototype.updateScaleValueView = function(value) {
    var labels = new Array('Small', 'Medium', 'Large');
    $('#' + this.htmlId + '_scaleValue').html(labels[value]);
}
PlanningTool.prototype.updatePlanningItemInfo = function() {
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
    if(this.isEditable()) {
        html += '<tr><td>';
        html += '<button id="' + this.htmlId + '_editPlanningItemBtn' + '">Edit</button>';
        html += '<button id="' + this.htmlId + '_clonePlanningItemBtn' + '">Clone</button>';
        html += '<button id="' + this.htmlId + '_removePlanningItemBtn' + '">Remove</button>';
        html += '</td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_info').html(html);
    
    var form = this;
    $('span[id^="' + this.htmlId + '_planningItemProperties_planningGroup_"]').bind('click', function(event) {form.planningGroupClickedHandle.call(form, event);});

    if(this.isEditable()) {
        $('#' + this.htmlId + '_removePlanningItemBtn')
          .button({
            icons: {
                primary: "ui-icon-trash"
            },
            text: false
            })
          .click(function(event) {
              form.removePlanningItem();
        });
        $('#' + this.htmlId + '_editPlanningItemBtn')
          .button({
            icons: {
                primary: "ui-icon-pencil"
            },
            text: false
            })
          .click(function(event) {
              form.editPlanningItem();
        });
        $('#' + this.htmlId + '_clonePlanningItemBtn')
          .button({
            icons: {
                primary: "ui-icon-plus"
            },
            text: false
            })
          .click(function(event) {
              form.editPlanningItem('CLONE');
        });        
    }
}
PlanningTool.prototype.updatePlanningGroupInfo = function() {
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
        html += '<tr><td><div class="comment1">Client details</div><a href="../client/index.jsp?clientId=' + client.id + '&subdepartmentId=' + planningGroup.targetSubdepartmentId + '">See more</a></td></tr>';
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
        html += '<span class="link" id="' + this.htmlId + '_planningGroupProperties_planningItem_' + planningItem.id + '">' + planningItem.description + '</span><br />';
        html += employee.firstName + ' ' + employee.lastName + '<br />';
        html += getStringFromRange(planningItem.startDate, planningItem.endDate) + '<br />';
        html += '</td></tr>'; 
    }
    if(this.isEditable()) {
        html += '<tr><td>';
        html += '<button id="' + this.htmlId + '_planningGroupProperties_editPlanningGroupBtn' + '">Edit</button>';
        html += '<button id="' + this.htmlId + '_planningGroupProperties_removePlanningGroupBtn' + '">Remove</button>';
        html += '<button id="' + this.htmlId + '_planningGroupProperties_clonePlanningGroupBtn' + '">Clone planning group</button>';
        html += '</td></tr>';
    }    
    html += '</table>';
    html += '</div>';
    $('#' + this.htmlId + '_info').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_planningGroupProperties_planningItem_"]').bind('click', function(event) {form.planningItemSpanClickHandle.call(form, event);});
    if(this.isEditable()) {
        $('#' + this.htmlId + '_planningGroupProperties_removePlanningGroupBtn')
          .button({
            icons: {
                primary: "ui-icon-trash"
            },
            text: false
            })
          .click(function(event) {
              form.removePlanningGroup();
        });
        
        $('#' + this.htmlId + '_planningGroupProperties_editPlanningGroupBtn')
          .button({
            icons: {
                primary: "ui-icon-pencil"
            },
            text: false
            })
          .click(function(event) {
              form.editPlanningGroup();
        });
        
        $('#' + this.htmlId + '_planningGroupProperties_clonePlanningGroupBtn')
          .button({
            icons: {
                primary: "ui-icon-plus"
            },
            text: false
            })
          .click(function(event) {
              form.editPlanningGroup('CLONE');
        });
    }
}
PlanningTool.prototype.updateCellInfo = function() {
    var cell = this.selected.cell;
    var employee = this.info.getEmployee(cell.employeeId);
    var employeePositionHistoryItem = this.info.getEmployeePositionHistoryItem(employee.employeePositionHistoryItems, cell.day);
    var position = null;
    var standardPosition = null;
    if(employeePositionHistoryItem != null) {
        position = this.info.getPosition(employeePositionHistoryItem.positionId);
        standardPosition = this.info.getStandardPosition(position.standardPositionId);
    }
    var planningItems = this.info.getPlanningItems(employee.id, cell.day);
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Cell</td></tr>';
    html += '<tr><td><div class="comment1">Employee</div>' + employee.firstName + ' ' + employee.lastName + '</td></tr>';
    html += '<tr><td><div class="comment1">Standard position</div>' + (standardPosition != null ? standardPosition.name : 'No standard position') + '</td></tr>';
    html += '<tr><td><div class="comment1">Position</div>' + (position != null ? position.name : 'No position') + '</td></tr>';
    html += '<tr><td><div class="comment1">Period</div>' + (employeePositionHistoryItem != null ? getStringFromRange(employeePositionHistoryItem.startDate, employeePositionHistoryItem.endDate) : '') + '</td></tr>';
    html += '</td></tr>';
    html += '<tr><td><div class="comment1">Day</div>' + getStringFromYearMonthDate(cell.day) + '</td></tr>';
    for(var key in planningItems) {
        var planningItem = planningItems[key];
        html += '<tr><td><span class="link" id="' + this.htmlId + '_cellProperties_planningItem_' + planningItem.id + '">' + planningItem.description + '</span></td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_info').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_cellProperties_planningItem_"]').bind('click', function(event) {form.planningItemSpanClickHandle.call(form, event);});
}
PlanningTool.prototype.updateEmployeeInfo = function() {
    var employee = this.info.getEmployee(this.selected.employeeId);
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Employee</td></tr>';
    html += '<tr><td><div class="comment1">Employee</div>' + employee.firstName + ' ' + employee.lastName + '</td></tr>';
    for(var key in employee.employeePositionHistoryItems) {
        var employeePositionHistoryItem = employee.employeePositionHistoryItems[key];
        var position = this.info.getPosition(employeePositionHistoryItem.positionId);
        var standardPosition = this.info.getStandardPosition(position.standardPositionId);
        html += '<tr><td>';
        html += '<div class="comment1">Standard position</div>';
        html += (standardPosition != null ? standardPosition.name : 'No standard position') + '<br />';
        html += '<div class="comment1">Position</div>';
        html += (position != null ? position.name : 'No position') + '<br />';
        html += '<div class="comment1">Period</div>';
        html += getStringFromRange(employeePositionHistoryItem.startDate, employeePositionHistoryItem.endDate);
        html += '</td></tr>';
    }
    html += '<tr><td><div class="comment1">Details</div><a href="../employee/index.jsp?employeeId=' + employee.id + '">See more</a></td></tr>';
    html += '</table>';
    $('#' + this.htmlId + '_info').html(html);
}
PlanningTool.prototype.clearInfo = function() {
    $('#' + this.htmlId + '_info').html('');
}

PlanningTool.prototype.planningItemSpanClickHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var planningItemId = parseInt(tmp[tmp.length - 1]);
    this.makePlanningItemSelection(planningItemId);    
}
PlanningTool.prototype.monthChangeHandle = function(event) {
    var month = parseInt($('#' + this.htmlId + '_month').val());
    var cursor = {
        year : this.time.cursor.year,
        month: month,
        dayOfMonth : 1
    };
    this.setCursor(cursor);
}    
PlanningTool.prototype.yearChangeHandle = function(event) {
    var year = parseInt($('#' + this.htmlId + '_year').val());
    var cursor = {
        year : year,
        month: this.time.cursor.month,
        dayOfMonth : 1
    };
    this.setCursor(cursor);
}
PlanningTool.prototype.subdepartmentChangeHandle = function(event) {
    this.subdepartmentEditedInfo[this.selected.subdepartmentId] = this.info.getEditedInfoForTargetSubdepartment(this.selected.subdepartmentId);
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(idTxt);
    }
    this.loadContent();
}
PlanningTool.prototype.removePlanningItem = function() {
    var planningItem = this.info.getPlanningItem(this.selected.planningItemId);
    var planningItemDeleteForm = new PlanningItemDeleteForm(planningItem.id, this.removePlanningItemOKHandle, this);
    planningItemDeleteForm.init();
}
PlanningTool.prototype.removePlanningItemOKHandle = function() {
    $('#' + this.htmlId + '_item_' + this.selected.planningItemId).remove();
    this.info.planningItems.splice(this.selected.planningItemId, 1);
    this.selected.planningItemId = null;
    $('#' + this.htmlId + '_info').html('');    
}
PlanningTool.prototype.editPlanningItem = function(mode) {
    var formMode = 'UPDATE';
    if(mode == 'CLONE') {
        formMode = 'CREATE';
    }
    var planningItem = this.info.getPlanningItem(this.selected.planningItemId);
    var employee = this.info.getEmployee(planningItem.employeeId);
    var planningGroup = this.info.getPlanningGroup(planningItem.planningGroupId);
    var targetSubdepartments = this.loaded.writableSubdepartments;
    var sourceSubdepartments = this.loaded.writableSubdepartments;
    var tsExists = false;
    for(var key in targetSubdepartments) {
        var subdepartment = targetSubdepartments[key];
        if(subdepartment.subdepartmentId == planningItem.targetSubdepartmentId) {
            tsExists = true;
            break;
        }
    }
    if(! tsExists) {
        for(var key in this.loaded.subdepartments) {
            var subdepartment = this.loaded.subdepartments[key];
            if(subdepartment.subdepartmentId == planningItem.targetSubdepartmentId) {
                targetSubdepartments.push(subdepartment);
                break;
            }
        }    
    }
    
    var ssExists = false;
    for(var key in sourceSubdepartments) {
        var subdepartment = sourceSubdepartments[key];
        if(subdepartment.subdepartmentId == planningItem.sourceSubdepartmentId) {
            ssExists = true;
            break;
        }
    }
    if(! ssExists) {
        for(var key in this.loaded.subdepartments) {
            var subdepartment = this.loaded.subdepartments[key];
            if(subdepartment.subdepartmentId == planningItem.sourceSubdepartmentId) {
                sourceSubdepartments.push(subdepartment);
                break;
            }
        }    
    }
    var formData = {
        mode: formMode,
        "id": planningItem.id,
        "startDate": planningItem.startDate,
        "endDate": planningItem.endDate,
        "description": planningItem.description,
        "location": planningItem.location,
        "employee": employee,
        "targetSubdepartmentId": planningItem.targetSubdepartmentId,
        "sourceSubdepartmentId": planningItem.sourceSubdepartmentId,
        "planningGroup": planningGroup,
        "planningGroupCreationType": 'EXISTING',
        "planningTypeId": null,
        "client": null,
        "activityId": null,
        "taskId": null,
        "inChargePerson": null,
        "planningGroupName": null,
        "planningGroupDescription": null
    };
    var options = {
        targetSubdepartments: targetSubdepartments,
        sourceSubdepartments: sourceSubdepartments
    }
    var planningItemEditForm = new PlanningItemEditForm(formData, this.htmlId + '_planningItemEditForm', this.planningItemBatchCreationOKHandle, this, options);
    planningItemEditForm.init();
}
PlanningTool.prototype.removePlanningGroup = function() {
    var planningGroup = this.info.getPlanningGroup(this.selected.planningGroupId);
    var planningGroupDeleteForm = new PlanningGroupDeleteForm(planningGroup.id, this.removePlanningGroupOKHandle, this);
    planningGroupDeleteForm.init();
}
PlanningTool.prototype.removePlanningGroupOKHandle = function() {
    this.info.resetInfo();
    this.clearInfo();
    this.loadContent();
}
PlanningTool.prototype.editPlanningGroup = function(mode) {
    var formMode = 'UPDATE';
    if(mode == 'CLONE') {
        formMode = 'CREATE';
    }
    var planningGroup = this.info.getPlanningGroup(this.selected.planningGroupId);
    var projectCodes = [];
    for(var key in planningGroup.projectCodeIds) {
        projectCodes.push(this.info.getProjectCode(planningGroup.projectCodeIds[key]))
    }
    var formData = {
        mode: formMode,
        "id": planningGroup.id,
        "planningTypeId": planningGroup.planningTypeId,
        "description": planningGroup.description,
        "isApproved": planningGroup.isApproved,
        "client": this.info.getClient(planningGroup.clientId),
        "projectCodes": projectCodes,
        "taskId": planningGroup.taskId,
        "inChargePerson": this.info.getInChargePerson(planningGroup.inChargePersonId),
        "targetSubdepartmentId": planningGroup.targetSubdepartmentId,
        "items": []
    };
    var planningItems = this.info.getPlanningItemsOfPlanningGroup(planningGroup.id);
    for(var key in planningItems) {
        var planningItem = planningItems[key];
        var employee = this.info.getEmployee(planningItem.employeeId);
        var item = {
            "id": planningItem.id,
            "startDate": planningItem.startDate,
            "endDate": planningItem.endDate,
            "sourceSubdepartmentId": planningItem.sourceSubdepartmentId,
            "employee": employee,
            "location": planningItem.location,
            "description": planningItem.description            
        }
        formData.items.push(item);
    }
    var targetSubdepartments = this.loaded.writableSubdepartments;
    var sourceSubdepartments = this.loaded.writableSubdepartments;
    var options = {
        targetSubdepartments: targetSubdepartments,
        sourceSubdepartments: sourceSubdepartments
    }
    var planningItemBatchCreationForm = new PlanningItemBatchCreationForm(formData, this.htmlId + '_planningItemBatchCreationForm', this.planningItemBatchCreationOKHandle, this, options);
    planningItemBatchCreationForm.init();
}
PlanningTool.prototype.initPlanningItemBatchCreation = function() {
    var targetSubdepartments = this.loaded.writableSubdepartments;
    var sourceSubdepartments = this.loaded.writableSubdepartments;
    var formData = {
        planningGroupCreationType: 'CREATE', // CREATE, EXISTING
        mode: 'CREATE',
        "id": null,
        "description": null,
        "isApproved": true,
        "planningTypeId": null,
        "client": null,
        "projectCodes": [],
        "taskId": null,
        "inChargePerson": null,
        "targetSubdepartmentId": this.selected.subdepartmentId,
        "items": []
    };
    var options = {
        targetSubdepartments: targetSubdepartments,
        sourceSubdepartments: sourceSubdepartments
    }
    var planningItemBatchCreationForm = new PlanningItemBatchCreationForm(formData, this.htmlId + '_planningItemBatchCreationForm', this.planningItemBatchCreationOKHandle, this, options);
    planningItemBatchCreationForm.init();
}
PlanningTool.prototype.planningItemBatchCreationOKHandle = function(planningToolInfo) {
    var toLoadEmployeeIds = [];
    var planningGroup = planningToolInfo.planningGroups[0];
    var oldPlanningItems = this.info.getPlanningItemsOfPlanningGroup(planningGroup.id);
    var newPlanningItems = planningToolInfo.planningItems;
    for(var key in oldPlanningItems) {
        var oldPlanningItem = oldPlanningItems[key];
        var found = false;
        for(var key2 in newPlanningItems) {
            var newPlanningItem = newPlanningItems[key2];
            if(oldPlanningItem.id == newPlanningItem.id) {
                found = true;
                break;
            }
        }
        if(! found) {
            this.removeItemView(oldPlanningItem.id);
            this.info.removePlanningItem(oldPlanningItem.id);
        }
    }
    for(var key in planningToolInfo.employees) {
        var employee = planningToolInfo.employees[key];
        var found = false;
        for(var key2 in this.info.employees) {
            var employee2 = this.info.employees[key2];
            if(employee2.id == employee.id) {
                found = true;
                break;
            }
        }
        if(! found) {
            toLoadEmployeeIds.push(employee.id);
        }
    }
    this.info.pushPlanningToolInfo(planningToolInfo);
    for(var key in planningToolInfo.employees) {
        var employee = planningToolInfo.employees[key];
        this.info.buildEmployeeLevelInfo(employee.id);
    }
    if(toLoadEmployeeIds.length > 0) {
        //this.info.resetInfo();
        this.loadEmployeeCarreerInfo(toLoadEmployeeIds, this.time.displayPeriod.start, this.time.displayPeriod.end);
    } else {
        this.clearInfo();
        this.show();    
    }
}
PlanningTool.prototype.gridScrollHandle = function(event) {
    var top = $(event.currentTarget).scrollTop();
    var left = $(event.currentTarget).scrollLeft();
    $('#' + this.htmlId + '_employees').scrollTop(top);    
    $('#' + this.htmlId + '_header').scrollLeft(left);    
}
PlanningTool.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_month').bind("change", function(event) {form.monthChangeHandle.call(form, event)});
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangeHandle.call(form, event)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangeHandle.call(form)});
}
PlanningTool.prototype.dataChanged = function(value) {
    dataChanged = value;
}
PlanningTool.prototype.normalizeContentSize = function() { 
    jQuery('#' + this.htmlId + '_header').width(contentWidth - 350);
    jQuery('#' + this.htmlId + '_header').height(35);

    jQuery('#' + this.htmlId + '_employees').width(150);
    jQuery('#' + this.htmlId + '_employees').height(contentHeight - 130);

    jQuery('#' + this.htmlId + '_planning').width(contentWidth - 350);
    jQuery('#' + this.htmlId + '_planning').height(contentHeight - 130);

    jQuery('#' + this.htmlId + '_info').width(160);
    jQuery('#' + this.htmlId + '_info').height(contentHeight - 110);
}
PlanningTool.prototype.showFilter = function() {
    doAlert('Filter', 'Filter is not yet implemented');
}
PlanningTool.prototype.lock = function() {
    var form = this;
    if(! this.loaded.isWritable) {
        doAlert('Lock', 'Current user can not write into this subdepartment', null, null);
        return;
    } 
    if(this.loaded.lockedBy == null) {
        doConfirm('Lock', 'Proceed with locking this subdepartment?', this, function() {form.setLock(true, false);}, null, null);
    } else {
        var locker = this.loaded.lockedBy;
        if(currentUser.id == locker.id) {
            doConfirm('Lock', 'Proceed with unlocking this subdepartment?', this, function() {form.setLock(false, true);}, null, null);
        } else {
            var message = 'Locked by ' + locker.firstName + ' ' + locker.lastName + '. Proceed with stealing lock?'
            doConfirm('Lock', message, this, function() {form.setLock(true, true);}, null, null);
        }
    }
}
PlanningTool.prototype.setLock = function(status, currentStatus) {
    var form = this;
    var data = {};
    data.command = "setLock";
    data.subdepartmentId = this.selected.subdepartmentId;
    data.lockStatus = status;
    data.currentLockStatus = currentStatus;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.lockedBy = result.lockedBy;                       
            form.loaded.lockedAt = result.lockedAt;                       
            form.show();
            form.clearInfo();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
PlanningTool.prototype.seekPrev = function() {
    var shifts = new Array(14, 7, 1);
    var cursor = getShiftedYearMonthDate(this.time.cursor, -shifts[this.time.scale]);
    this.setCursor(cursor);
}
PlanningTool.prototype.seekNext = function() {
    var shifts = new Array(14, 7, 1);
    var cursor = getShiftedYearMonthDate(this.time.cursor, shifts[this.time.scale]);
    this.setCursor(cursor);
}
PlanningTool.prototype.scaleChangedHandle = function(event, ui) {
    var scale = ui.value;
    this.setScale(scale);  
}
PlanningTool.prototype.setCursor = function(cursor) {
    this.subdepartmentEditedInfo[this.selected.subdepartmentId] = this.info.getEditedInfoForTargetSubdepartment(this.selected.subdepartmentId);

    this.time.cursor = cursor;
    this.calculateDisplayPeriod();
    this.updateYearView();
    this.updateMonthView();
    this.loadContent();
}
PlanningTool.prototype.setScale = function(scale) {
    this.time.scale = scale;
    this.calculateDisplayPeriod();
    this.loadContent();
}
PlanningTool.prototype.showColorMapperForm = function() {
    var colorMapperForm = new ColorMapperForm(this.htmlId + "colorMapperForm", this.init, this);
    colorMapperForm.init();
}
PlanningTool.prototype.findDayWithCell = function(left) {
    var day = null;
    $('tr[id^="' + this.htmlId + '_row_"]:first > td').each(function( index ) {
        var columnOffset = $( this ).offset();
        if(left - columnOffset.left < 0) {
            return false;
        }
        var id = $(this).attr("id");
        var tmp = id.split('_');
        var year = parseInt(tmp[tmp.length - 3]);
        var month = parseInt(tmp[tmp.length - 2]);
        var dayOfMonth = parseInt(tmp[tmp.length - 1]);
        day = {
            year: year,
            month: month,
            dayOfMonth: dayOfMonth
        }
    });
    return day;
}
PlanningTool.prototype.findEmployeeIdWithCell = function(top) {
    var employeeId = null;
    for(var eKey in this.info.employees) {
        var employee = this.info.employees[eKey];
        var rowOffset = $('#' + this.htmlId + '_row_' + employee.id).offset();
        if(top - rowOffset.top < 0) {
            break;
        }
        employeeId = employee.id;
    }
    return employeeId;
}
PlanningTool.prototype.findCell = function(offset) {
    return {
        employeeId: this.findEmployeeIdWithCell(offset.top),
        day: this.findDayWithCell(offset.left)
    }
}
PlanningTool.prototype.getCellGeom = function(cell) {
    var id = this.htmlId + '_cell_' + cell.employeeId + '_' + cell.day.year + '_' + cell.day.month + '_' + cell.day.dayOfMonth;
    var element = $('#' + id);
    var offset = element.offset();
    return {
        left: offset.left,
        top: offset.top,
        width: element.width()
    }
}
PlanningTool.prototype.planningItemMovedHandle = function(event, ui) {
    var id = ui.helper[0].id;
    var tmp = id.split("_");
    var planningItemId = parseInt(tmp[tmp.length - 1]);
    var planningItem = this.info.getPlanningItem(planningItemId);
    var days = getDaysInRange(planningItem.startDate, planningItem.endDate);
    var startOffset = ui.offset;
    var startCell = this.findCell(startOffset);
    var oldMaxLevel = this.info.getMaxLevelOfEmployee(startCell.employeeId);
    var oldEmployeeId = planningItem.employeeId;
    planningItem.startDate = startCell.day;
    planningItem.endDate = getShiftedYearMonthDate(startCell.day, days);
    planningItem.employeeId = startCell.employeeId;
    planningItem.status = 'EDITED';
    this.info.buildEmployeeLevelInfo(planningItem.employeeId);
    var maxLevel = this.info.getMaxLevelOfEmployee(planningItem.employeeId);
    var rowResized = false;
    if(oldMaxLevel != maxLevel) {
        rowResized = true;
    } 
    if(oldEmployeeId != planningItem.employeeId) {
        var oldEmployeeOldMaxLevel = this.info.getMaxLevelOfEmployee(oldEmployeeId);
        this.info.buildEmployeeLevelInfo(oldEmployeeId);
        var oldEmployeeMaxLevel = this.info.getMaxLevelOfEmployee(oldEmployeeId);
        if(oldEmployeeOldMaxLevel != oldEmployeeMaxLevel) {
            rowResized = true;
        }
    }
    if(rowResized) {
        this.show();
    } else if(oldEmployeeId != planningItem.employeeId) {
        this.updateEmployeeItemsView(oldEmployeeId);
        this.updateEmployeeItemsView(planningItem.employeeId);  
    } else {
        this.updateEmployeeItemsView(planningItem.employeeId);    
    }
    this.makePlanningItemSelection(planningItemId);
}
PlanningTool.prototype.planningItemResizedHandle = function(event, ui) {
    var id = ui.element[0].id;
    var tmp = id.split("_");
    var planningItemId = parseInt(tmp[tmp.length - 1]);
    var startPosition = ui.position;
    var rootOffset = $('#' + this.htmlId + '_grid').offset();
    var startOffset = {
        left: startPosition.left + rootOffset.left,
        top: startPosition.top + rootOffset.top        
    }
    var endOffset = {
        left: startOffset.left + ui.element.width(),
        top: startOffset.top
    }
    var startCell = this.findCell(startOffset);
    var endCell = this.findCell(endOffset);
    var planningItem = this.info.getPlanningItem(planningItemId);
    var oldMaxLevel = this.info.getMaxLevelOfEmployee(planningItem.employeeId);
    
    planningItem.startDate = startCell.day;
    planningItem.endDate = endCell.day;
    planningItem.status = 'EDITED';
    this.info.buildEmployeeLevelInfo(planningItem.employeeId);
    var maxLevel = this.info.getMaxLevelOfEmployee(planningItem.employeeId);
    if(oldMaxLevel != maxLevel) {
        this.show();
    } else {
        this.updateEmployeeItemsView(planningItem.employeeId);
    }
    this.makePlanningItemSelection(planningItemId);
}
PlanningTool.prototype.planningItemClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var planningItemId = parseInt(tmp[tmp.length - 1]);
    this.makePlanningItemSelection(planningItemId);
}
PlanningTool.prototype.planningGroupClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var planningGroupId = parseInt(tmp[tmp.length - 1]);
    this.selected.planningGroupId = planningGroupId;
    this.loadPlanningGroupInfo(planningGroupId);
}
PlanningTool.prototype.cellClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var employeeId = parseInt(tmp[tmp.length - 4]);
    var year = parseInt(tmp[tmp.length - 3]);
    var month = parseInt(tmp[tmp.length - 2]);
    var dayOfMonth = parseInt(tmp[tmp.length - 1]);
    var cell = {
        employeeId: employeeId,
        day: {
            year: year,
            month: month,
            dayOfMonth: dayOfMonth
        }
    }
    this.selected.cell = cell;
    this.updateCellInfo();
}
PlanningTool.prototype.employeeClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    this.selected.employeeId = parseInt(tmp[tmp.length - 1]);
    this.updateEmployeeInfo();
}
PlanningTool.prototype.save = function() {
    this.subdepartmentEditedInfo[this.selected.subdepartmentId] = this.info.getEditedInfoForTargetSubdepartment(this.selected.subdepartmentId);
    var count = 0;
    for(var key in this.subdepartmentEditedInfo) {
        count += this.subdepartmentEditedInfo[key].planningItems.lenght;
    }
    if(count == 0) {
        doAlert('Info', 'There is no modified content to save', null, null);
        return;
    }
    this.saveEditedPlanningItems();
}
PlanningTool.prototype.isEditable = function() {
    var editable = false;
    if(this.loaded.isWritable && this.loaded.lockedBy != null && this.loaded.lockedBy.id == currentUser.id) {
        editable = true;
    }
    return editable;
}
