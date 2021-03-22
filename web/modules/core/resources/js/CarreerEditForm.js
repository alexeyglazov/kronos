/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CarreerEditForm(employeeId, htmlId, successHandler, successContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder+ "CarreerEditForm.jsp"
    };
    this.employeeId = employeeId;
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = moduleName;
    this.loaded = {
        "employee": null,
        "employeePositionHistoryItems": [],
        "leavesItems": []
    }
    this.data = {
        "employeeId": this.employeeId,
        "employeePositionHistoryItems": [],
        "leavesItems": []
    }
    this.editedLeavesItemIndex = null;
    this.editedEmployeePositionHistoryItemIndex = null;
    this.carreerViewer = null;
}
CarreerEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.dataChanged(false);
    this.loadInitialContent();
}
CarreerEditForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.employeeId = this.employeeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employee = result.employee;
            form.loaded.employeePositionHistoryItems = result.employeePositionHistoryItems;
            form.loaded.leavesItems = result.leavesItems;
            form.carreerViewer = new CarreerViewer(form.loaded.employeePositionHistoryItems, form.loaded.leavesItems, form.htmlId + '_viewer', form.htmlId + '_viewerContainer')
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CarreerEditForm.prototype.show = function() {
    var title = 'Edit Carreer'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 700,
        height: 600,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
}
CarreerEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>'
    html += '<tr><td id="' + this.htmlId + '_layout_employeePositionHistoryItems"></td></tr>';
    html += '<tr><td id="' + this.htmlId + '_layout_leavesItems"></td></tr>';
    html += '</table>';
    html += '<div id="' + this.htmlId + '_viewerContainer"></div>';
    return html
}
CarreerEditForm.prototype.updateView = function() {
    this.updateEmployeePositionHistoryItemsView();
    this.updateLeavesItemsView();
    this.carreerViewer.init();
}
CarreerEditForm.prototype.updateEmployeePositionHistoryItemsView = function(event) {
    var columns = [];
    columns.push({"name": "Office", "property": "officeName"});
    columns.push({"name": "Department", "property": "departmentName"});
    columns.push({"name": "Subdepartment", "property": "subdepartmentName"});
    columns.push({"name": "Position", "property": "positionName"});
    columns.push({"name": "Standard Position", "property": "standardPositionName"});
    columns.push({"name": "Start", "property": "start", "visualizer": calendarVisualizer});
    columns.push({"name": "End", "property": "end", "visualizer": calendarVisualizer});
    columns.push({"name": "Contract", "property": "contractType"});
    columns.push({"name": "Percentage", "property": "partTimePercentage"});
    var extraColumns = [];
    extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editEmployeePositionHistoryItem, "context": this}});
    extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteEmployeePositionHistoryItem, "context": this}});
    var controls = [];
    controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.createEmployeePositionHistoryItem, "context": this}});
    var dataGrid = new DataGrid("employeePositionHistoryItems", this.loaded.employeePositionHistoryItems, columns, "Carreer", controls, extraColumns, null);
    dataGrid.show(this.htmlId + "_layout_employeePositionHistoryItems");
}
CarreerEditForm.prototype.updateLeavesItemsView = function(event) {
    var columns = [];
    columns.push({"name": "Leave Type", "property": "type"});
    columns.push({"name": "Start", "property": "start", "visualizer": calendarVisualizer});
    columns.push({"name": "End", "property": "end", "visualizer": calendarVisualizer});
    var extraColumns = [];
    extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editLeavesItem, "context": this}});
    extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteLeavesItem, "context": this}});
    var controls = [];
    controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.createLeavesItem, "context": this}});
    var dataGrid = new DataGrid("leavesItems", this.loaded.leavesItems, columns, "Leaves", controls, extraColumns, null);
    dataGrid.show(this.htmlId + "_layout_leavesItems");
}
CarreerEditForm.prototype.normalizeData = function() {
    this.data.employeePositionHistoryItems = [];
    for(var key in this.loaded.employeePositionHistoryItems) {
        var employeePositionHistoryItem = this.loaded.employeePositionHistoryItems[key];
        this.data.employeePositionHistoryItems.push({
            "id": employeePositionHistoryItem.id,
            "positionId": employeePositionHistoryItem.positionId,
            "start": employeePositionHistoryItem.start,
            "end": employeePositionHistoryItem.end,
            "contractType": employeePositionHistoryItem.contractType,
            "partTimePercentage": (employeePositionHistoryItem.contractType == 'PART_TIME') ? employeePositionHistoryItem.partTimePercentage : null
        });
    }
    this.data.leavesItems = [];
    for(var key in this.loaded.leavesItems) {
        var leavesItem = this.loaded.leavesItems[key];
        this.data.leavesItems.push({
            "id": leavesItem.id,
            "type": leavesItem.type,
            "start": leavesItem.start,
            "end": leavesItem.end
        });
    }
}
CarreerEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.employeePositionHistoryItems.length == 0) {
        errors.push("Employee should have at least one position");
    }
    var endNullCount = 0;
    for(var key in this.data.employeePositionHistoryItems) {
        var employeePositionHistoryItem = this.data.employeePositionHistoryItems[key];
        var start = employeePositionHistoryItem.start;
        var end = employeePositionHistoryItem.end;
        if(start == null) {
            errors.push('Start Date for position item ' + key + ' is not set');
        }
        if(end == null) {
            endNullCount++;
        }
    }
    if(endNullCount > 1) {
        errors.push('More than one position with End Date unset');
    }
    if(errors.length == 0) {
        var positionIntersections = this.findPositionIntersections();
        if(positionIntersections.length > 0) {
            var txt = '<div style="font-weight: bold;">Positions intersection</div>';
            for(var key in positionIntersections) {
                var pair = positionIntersections[key];
                txt += '<div>'+ this.getEmployeePositionHistoryItemFullName(pair.index1) + ' - ' + this.getEmployeePositionHistoryItemFullName(pair.index2) +'</div>';
            }
            errors.push(txt);
        }

        var leavesIntersections = this.findLeavesIntersections();
        if(leavesIntersections.length > 0) {
            var txt = '<div style="font-weight: bold;">Same type leaves intersection</div>';
            for(var key in leavesIntersections) {
                var pair = leavesIntersections[key];
                 txt += '<div>'+ this.getLeavesItemFullName(pair.index1) + ' - ' + this.getLeavesItemFullName(pair.index2) +'</div>';
           }
            errors.push(txt);
        }
    }
    if(errors.length == 0) {
        var positionGaps = this.findPositionGaps();
        var gaps = [];
        for(var key in positionGaps) {
            var gap = positionGaps[key];
            if(! this.isPositionGapCoveredByLeaves(gap)) {
                gaps.push(gap);
            }
        }
        if(gaps.length > 0) {
            var txt = '<div style="font-weight: bold;">Positions gap</div>';
            for(var key in gaps) {
                var pair = gaps[key];
                txt += '<div>'+ this.getEmployeePositionHistoryItemFullName(pair.index1) + ' - ' + this.getEmployeePositionHistoryItemFullName(pair.index2) +'</div>';
            }
            errors.push(txt);
        }
    }
    return errors;
}
CarreerEditForm.prototype.isPositionGapCoveredByLeaves = function(gap) {
    var daySpan = 1000 * 60 * 60 * 24;
    var start = new Date(gap.start.year, gap.start.month, gap.start.dayOfMonth, 0, 0, 0, 0);
    var end = new Date(gap.end.year, gap.end.month, gap.end.dayOfMonth, 0, 0, 0, 0);
    var currentTime  = new Date();
    currentTime.setTime(start.getTime());
    while(currentTime <= end) {
       var day = {
           "year": currentTime.getFullYear(),
           "month": currentTime.getMonth(),
           "dayOfMonth": currentTime.getDate()
       }
       if(! this.isDayInLeaves(day)) {
           return false;
       }
       currentTime.setTime(currentTime.getTime() + daySpan);
    }
    return true;
}
CarreerEditForm.prototype.isDayInLeaves = function(day) {
    for(var key in this.data.leavesItems) {
        var leavesItem = this.data.leavesItems[key];
        if(compareYearMonthDate(day, leavesItem.start) != -1 && (leavesItem.end == null || compareYearMonthDate(day, leavesItem.end) != 1)) {
            return true;
        }
    }
    return false;
}
CarreerEditForm.prototype.findPositionIntersections = function() {
    var intersections = [];
    for(var key1 in this.data.employeePositionHistoryItems) {
        var employeePositionHistoryItem1 = this.data.employeePositionHistoryItems[key1];
        var start1 = employeePositionHistoryItem1.start;
        var end1 = employeePositionHistoryItem1.end;
        for(var key2 in this.data.employeePositionHistoryItems) {
            if(key1 == key2) {
                continue;
            }
            var employeePositionHistoryItem2 = this.data.employeePositionHistoryItems[key2];
            var start2 = employeePositionHistoryItem2.start;
            var end2 = employeePositionHistoryItem2.end;
            if(this.isIntersected(start1, end1, start2, end2) ) {
                intersections.push({
                    "index1": key1,
                    "index2": key2
                });
            }
        }
    }
    return intersections;
}
CarreerEditForm.prototype.findLeavesIntersections = function() {
    var intersections = [];
    for(var key1 in this.data.leavesItems) {
        var leavesItem1 = this.data.leavesItems[key1];
        var start1 = leavesItem1.start;
        var end1 = leavesItem1.end;
        for(var key2 in this.data.leavesItems) {
            var leavesItem2 = this.data.leavesItems[key2];
            if(key1 == key2) {
                continue;
            }
            if(leavesItem1.type != leavesItem2.type) {
                continue;
            }
            var start2 = leavesItem2.start;
            var end2 = leavesItem2.end;
            if(this.isIntersected(start1, end1, start2, end2) ) {
                intersections.push({
                    "index1": key1,
                    "index2": key2
                });
            }
        }
    }
    return intersections;
}
CarreerEditForm.prototype.findPositionGaps = function() {
    var gaps = [];
    for(var key1 in this.data.employeePositionHistoryItems) {
        var employeePositionHistoryItem1 = this.data.employeePositionHistoryItems[key1];
        var start1 = employeePositionHistoryItem1.start;
        var end1 = employeePositionHistoryItem1.end;
        var lessKey = null;
        var moreKey = null;
        var lessValue = null;
        var moreValue = null;
        for(var key2 in this.data.employeePositionHistoryItems) {
            if(key1 == key2) {
                continue;
            }
            var employeePositionHistoryItem2 = this.data.employeePositionHistoryItems[key2];
            var start2 = employeePositionHistoryItem2.start;
            var end2 = employeePositionHistoryItem2.end;
            if(compareYearMonthDate(start1, start2) == 1) {
                if(lessKey == null) {
                    lessKey = key2;
                    lessValue = start2;
                } else if(compareYearMonthDate(lessValue, start2) == -1) {
                    lessKey = key2;
                    lessValue = start2;
                }
            }
            if(compareYearMonthDate(start1, start2) == -1) {
                if(moreKey == null) {
                        moreKey = key2;
                        moreValue = start2;
                } else if(compareYearMonthDate(moreValue, start2) == 1) {
                        moreKey = key2;
                        moreValue = start2;
                }
            }
        }
        if(lessKey != null) {
            var gap = this.getGap(start1, end1, this.data.employeePositionHistoryItems[lessKey].start, this.data.employeePositionHistoryItems[lessKey].end);
            if(gap != null) {
                gaps.push({
                    "index1": key1,
                    "index2": lessKey,
                    "start": gap.start,
                    "end": gap.end
                });
            }
        }
        if(moreKey != null) {
            var gap = this.getGap(start1, end1, this.data.employeePositionHistoryItems[moreKey].start, this.data.employeePositionHistoryItems[moreKey].end);
            if(gap != null) {
                gaps.push({
                    "index1": key1,
                    "index2": moreKey,
                    "start": gap.start,
                    "end": gap.end
                });
            }
        }
    }
    return gaps;
}
CarreerEditForm.prototype.isIntersected = function(start1, end1, start2, end2) {
    return isIntersected(start1, end1, start2, end2);
}
CarreerEditForm.prototype.getGap = function(start1, end1, start2, end2) {
    if(compareYearMonthDate(start1, start2) == 0 ) {
        return null;
    } else if(compareYearMonthDate(start1, start2) == -1){
        if(end1 == null) {
            return null;
        } else if(compareYearMonthDate(start2, end1) == 1) {
            var start2Date = new Date(start2.year, start2.month, start2.dayOfMonth, 0, 0, 0, 0);
            var end1Date = new Date(end1.year, end1.month, end1.dayOfMonth, 0, 0, 0, 0);
            if(start2Date.getTime() - end1Date.getTime() > 24*60*60*1000) {
                var shiftedEnd1 = new Date(end1.year, end1.month, end1.dayOfMonth + 1, 0, 0, 0, 0);
                var shiftedStart2 = new Date(start2.year, start2.month, start2.dayOfMonth - 1, 0, 0, 0, 0);
                return {
                    "start": {"year": shiftedEnd1.getFullYear(), "month": shiftedEnd1.getMonth(), "dayOfMonth": shiftedEnd1.getDate()},
                    "end": {"year": shiftedStart2.getFullYear(), "month": shiftedStart2.getMonth(), "dayOfMonth": shiftedStart2.getDate()}
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        if(end2 == null) {
            return null;
        } else if(compareYearMonthDate(start1, end2) == 1) {
            var start1Date = new Date(start1.year, start1.month, start1.dayOfMonth, 0, 0, 0, 0);
            var end2Date = new Date(end2.year, end2.month, end2.dayOfMonth, 0, 0, 0, 0);
            if(start1Date.getTime() - end2Date.getTime() > 24*60*60*1000) {
                var shiftedEnd2 = new Date(end2.year, end2.month, end2.dayOfMonth + 1, 0, 0, 0, 0);
                var shiftedStart1 = new Date(start1.year, start1.month, start1.dayOfMonth - 1, 0, 0, 0, 0);
                return {
                    "start": {"year": shiftedEnd2.getFullYear(), "month": shiftedEnd2.getMonth(), "dayOfMonth": shiftedEnd2.getDate()},
                    "end": {"year": shiftedStart1.getFullYear(), "month": shiftedStart1.getMonth(), "dayOfMonth": shiftedStart1.getDate()}
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    return null;
}
CarreerEditForm.prototype.save = function() {
    this.normalizeData();
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveCarreer";
    data.carreerEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Carreer data have been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CarreerEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    if(this.successHandler != null && this.successContext != null) {
        this.successHandler.call(this.successContext);
    }
}
CarreerEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}

CarreerEditForm.prototype.getKeyOfFirstEmployeePositionHistoryItem = function(limitDay) {
    var firstKey = null;
    var firstItem = null;
    for(var key in this.loaded.employeePositionHistoryItems) {
        var item = this.loaded.employeePositionHistoryItems[key];
        if(limitDay != null) {
            if(compareYearMonthDate(item.start, limitDay) != 1) {
                continue;
            }
        }
        if(firstItem == null) {
            firstKey = key;
            firstItem = item;
            continue;
        }
        if(compareYearMonthDate(item.start, firstItem.start) == -1) {
            firstKey = key;
            firstItem = item;
        }
    }
    return firstKey;
}
CarreerEditForm.prototype.getKeyOfLastEmployeePositionHistoryItem = function(limitDay) {
    var lastKey = null;
    var lastItem = null;
    for(var key in this.loaded.employeePositionHistoryItems) {
        var item = this.loaded.employeePositionHistoryItems[key];
        if(limitDay != null) {
            if(compareYearMonthDate(item.start, limitDay) != -1) {
                continue;
            }
        }
        if(lastItem == null) {
            lastKey = key;
            lastItem = item;
            continue;
        }
        if(compareYearMonthDate(item.start, lastItem.start) == 1) {
            lastKey = key;
            lastItem = item;
        }
    }
    return lastKey;
}
CarreerEditForm.prototype.createEmployeePositionHistoryItem = function(event) {
    var employeePositionHistoryItemEditForm = new EmployeePositionHistoryItemEditForm({
        "mode": 'CREATE',
        "id": null,
        "employeeId": this.data.employeeId,
        "positionId": null,
        "start": null,
        "end": null,
        "contractType": "FULL_TIME",
        "partTimePercentage": null

    }, "employeePositionHistoryItemEditForm", null, null, this.acceptEmployeePositionHistoryItem, this, this.moduleName);
    employeePositionHistoryItemEditForm.start();
}
CarreerEditForm.prototype.acceptEmployeePositionHistoryItem = function(data) {
    var errors = [];
    if(data.mode == 'CREATE') {
        var lastKey = this.getKeyOfLastEmployeePositionHistoryItem(null);
        if(lastKey != null) {
            var lastItem = this.loaded.employeePositionHistoryItems[lastKey];
            if(compareYearMonthDate(lastItem.start, data.start) == -1) {
                lastItem.end = getShiftedYearMonthDate(data.start, -1);
            } else {
                errors.push("Start date of added carreer should be greater than start date of any other carreers");
            }
        }
    } else {
        var toBeChangedItems = {};
        var currentItem = this.loaded.employeePositionHistoryItems[this.editedEmployeePositionHistoryItemIndex];
        var lastKey = this.getKeyOfLastEmployeePositionHistoryItem(currentItem.start);
        if(lastKey != null) {
            var lastItem = clone(this.loaded.employeePositionHistoryItems[lastKey]);
            if(compareYearMonthDate(lastItem.start, data.start) != -1) {
                errors.push("New start date of updated carreer should be greater than start date of previous carreers");
            } else {
                lastItem.end = getShiftedYearMonthDate(data.start, -1);
                toBeChangedItems[lastKey] = lastItem;
            }
        }
        var firstKey = this.getKeyOfFirstEmployeePositionHistoryItem(currentItem.start);
        if(firstKey != null) {
            var firstItem = clone(this.loaded.employeePositionHistoryItems[firstKey]);
            if(data.end == null) {
                errors.push("Only last position can have end date unset");
            } else {
                if(compareYearMonthDate(firstItem.start, data.start) != 1) {
                    errors.push("New start date of updated carreer should be less than start date of next carreer");
                } else if ((firstItem.end != null) && compareYearMonthDate(firstItem.end, data.end) != 1) {
                    errors.push("New end date of updated carreer should be less than end date of next carreer");
                } else {
                    firstItem.start = getShiftedYearMonthDate(data.end, 1);
                    toBeChangedItems[firstKey] = firstItem;
                }
            }
        }
    }
    if(errors.length == 0) {
        for(var key in toBeChangedItems) {
            this.loaded.employeePositionHistoryItems[key] = toBeChangedItems[key];
        } 
        this.loadPositionInfo(data);
    } else {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
}
CarreerEditForm.prototype.loadPositionInfo = function(employeePositionHistoryItemEditForm) {
    var form = this;
    var data = {};
    data.command = "getExtendedPosition";
    data.positionId = employeePositionHistoryItemEditForm.positionId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            var extendedPosition = result.extendedPosition;
            var item = clone(employeePositionHistoryItemEditForm);
            item.positionName = extendedPosition.name;
            item.officeName = extendedPosition.officeName;
            item.departmentName = extendedPosition.departmentName;
            item.subdepartmentName = extendedPosition.subdepartmentName;
            item.standardPositionName = extendedPosition.standardPositionName;
            if(employeePositionHistoryItemEditForm.mode == "CREATE") {
                form.loaded.employeePositionHistoryItems.push(item);
            } else {
                form.loaded.employeePositionHistoryItems[form.editedEmployeePositionHistoryItemIndex] = item;
            }
            form.updateEmployeePositionHistoryItemsView();
            form.carreerViewer.init();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CarreerEditForm.prototype.editEmployeePositionHistoryItem = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var employeePositionHistoryItemIndex = parseInt(tmp[tmp.length - 1]);
    var employeePositionHistoryItem = this.loaded.employeePositionHistoryItems[employeePositionHistoryItemIndex];
    var employeePositionHistoryItemEditForm = new EmployeePositionHistoryItemEditForm({
        "mode": 'UPDATE',
        "id": employeePositionHistoryItem.id,
        "employeeId": this.loaded.employee.id,
        "positionId": employeePositionHistoryItem.positionId,
        "start": employeePositionHistoryItem.start,
        "end": employeePositionHistoryItem.end,
        "contractType": employeePositionHistoryItem.contractType,
        "partTimePercentage": employeePositionHistoryItem.partTimePercentage
    }, "employeePositionHistoryItemEditForm", null, null, this.acceptEmployeePositionHistoryItem, this, this.moduleName);
    employeePositionHistoryItemEditForm.start();
    this.editedEmployeePositionHistoryItemIndex = employeePositionHistoryItemIndex;
}
CarreerEditForm.prototype.deleteEmployeePositionHistoryItem = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var employeePositionHistoryItemIndex = parseInt(tmp[tmp.length - 1]);
    this.editedEmployeePositionHistoryItemIndex = employeePositionHistoryItemIndex;
    if(this.loaded.employeePositionHistoryItems.length > 1) {
        doConfirm("Confirm", "Do you really want to delete this Employee Position History Item", this, function() {this.doDeleteEmployeePositionHistoryItem()});
    } else {
        doAlert("Alert", "You can not delete the last Employee Position History Item", null, null);
    }
}
CarreerEditForm.prototype.doDeleteEmployeePositionHistoryItem = function() {
    var item = this.loaded.employeePositionHistoryItems[this.editedEmployeePositionHistoryItemIndex];
    var lastKey = this.getKeyOfLastEmployeePositionHistoryItem(item.start);
    var firstKey = this.getKeyOfFirstEmployeePositionHistoryItem(item.start);
    if(lastKey != null && firstKey != null) {
        var lastItem = this.loaded.employeePositionHistoryItems[lastKey];
        var firstItem = this.loaded.employeePositionHistoryItems[firstKey];
        lastItem.end = getShiftedYearMonthDate(firstItem.start, -1);
    }
    this.loaded.employeePositionHistoryItems.splice(this.editedEmployeePositionHistoryItemIndex, 1);
    this.updateEmployeePositionHistoryItemsView();
    this.carreerViewer.init();
}
CarreerEditForm.prototype.createLeavesItem = function(event) {
    var leavesItemEditForm = new LeavesItemEditForm({
        "mode": 'CREATE',
        "id": null,
        "employeeId": this.data.employeeId,
        "type": null,
        "start": null,
        "end": null
    }, "leavesItemEditForm", null, null, this.acceptLeavesItem, this);
    leavesItemEditForm.start();
}
CarreerEditForm.prototype.acceptLeavesItem = function(data) {
    if(data.mode == "CREATE") {
        this.loaded.leavesItems.push(data);
    } else {
        this.loaded.leavesItems[this.editedLeavesItemIndex] = data;
    }
    this.updateLeavesItemsView();
    this.carreerViewer.init();
}
CarreerEditForm.prototype.editLeavesItem = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var leavesItemIndex = parseInt(tmp[tmp.length - 1]);
    var leavesItem = this.loaded.leavesItems[leavesItemIndex];
    var leavesItemEditForm = new LeavesItemEditForm({
        "mode": 'UPDATE',
        "id": leavesItem.id,
        "employeeId": this.loaded.employee.id,
        "type": leavesItem.type,
        "start": leavesItem.start,
        "end": leavesItem.end
    }, "leavesItemEditForm", null, null, this.acceptLeavesItem, this);
    leavesItemEditForm.start();
    this.editedLeavesItemIndex = leavesItemIndex;
}
CarreerEditForm.prototype.deleteLeavesItem = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var leavesItemIndex = parseInt(tmp[tmp.length - 1]);
    this.editedLeavesItemIndex = leavesItemIndex;
    doConfirm("Confirm", "Do you really want to delete this Leavees Item", this, function() {this.doDeleteLeavesItem()});
}
CarreerEditForm.prototype.doDeleteLeavesItem = function() {
    this.loaded.leavesItems.splice(this.editedLeavesItemIndex, 1);
    this.updateLeavesItemsView();
    this.carreerViewer.init();
}
CarreerEditForm.prototype.getEmployeePositionHistoryItemFullName = function(index) {
    var employeePositionHistoryItem = this.loaded.employeePositionHistoryItems[index];
    var name = '';
    name += '(' + calendarVisualizer.getHtml(employeePositionHistoryItem.start) + ') ';
    name += employeePositionHistoryItem.officeName;
    name += ' / ' + employeePositionHistoryItem.departmentName;
    name += ' / ' + employeePositionHistoryItem.subdepartmentName;
    name += ' / ' + employeePositionHistoryItem.positionName;
    
    return name;
}
CarreerEditForm.prototype.getLeavesItemFullName = function(index) {
    var leavesItem = this.loaded.leavesItems[index];
    var name = '';
    name += '(' + calendarVisualizer.getHtml(leavesItem.start) + ') ';
    name += leavesItem.type;
    return name;
}