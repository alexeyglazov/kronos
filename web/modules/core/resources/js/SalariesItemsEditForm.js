/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function SalariesEditForm(employeeId, htmlId, successHandler, successContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder+ "SalariesEditForm.jsp"
    };
    this.employeeId = employeeId;
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = moduleName;
    this.loaded = {
        "employee": null,
        "salaries": []
    }
    this.data = {
        "employeeId": this.employeeId,
        "salaries": []
    }
    this.editedEmployeePositionHistoryItemIndex = null;
}
SalariesEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.dataChanged(false);
    this.loadInitialContent();
}
SalariesEditForm.prototype.loadInitialContent = function() {
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
            form.loaded.salaries = result.salaries;
            form.loaded.currencies = result.currencies;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SalariesEditForm.prototype.show = function() {
    var title = 'Edit Salaries'
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
SalariesEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>'
    html += '<tr><td id="' + this.htmlId + '_layout_salaries"></td></tr>';
    html += '</table>';
    return html
}
SalariesEditForm.prototype.updateView = function() {
    this.updateSalariesView();
}
SalariesEditForm.prototype.updateSalariesView = function(event) {
    var columns = [];
    columns.push({"name": "Value", "property": "value"});
    columns.push({"name": "Currency", "property": "currencyName"});
    columns.push({"name": "Start", "property": "start", "visualizer": calendarVisualizer});
    columns.push({"name": "End", "property": "end", "visualizer": calendarVisualizer});
    var extraColumns = [];
    extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editSalary, "context": this}});
    extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteSalary, "context": this}});
    var controls = [];
    controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.createSalary, "context": this}});
    var dataGrid = new DataGrid("salaries", this.loaded.salaries, columns, "Salaries", controls, extraColumns, null);
    dataGrid.show(this.htmlId + "_layout_salaries");
}
SalariesEditForm.prototype.normalizeData = function() {
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
SalariesEditForm.prototype.validate = function() {
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
SalariesEditForm.prototype.findPositionIntersections = function() {
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
SalariesEditForm.prototype.findPositionGaps = function() {
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
SalariesEditForm.prototype.isIntersected = function(start1, end1, start2, end2) {
    return isIntersected(start1, end1, start2, end2);
}
SalariesEditForm.prototype.getGap = function(start1, end1, start2, end2) {
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
SalariesEditForm.prototype.save = function() {
    this.normalizeData();
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveSalaries";
    data.SalariesEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Salaries data have been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SalariesEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
SalariesEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}
SalariesEditForm.prototype.getKeyOfFirstEmployeePositionHistoryItem = function(limitDay) {
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
SalariesEditForm.prototype.getKeyOfLastEmployeePositionHistoryItem = function(limitDay) {
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
SalariesEditForm.prototype.createEmployeePositionHistoryItem = function(event) {
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
SalariesEditForm.prototype.acceptEmployeePositionHistoryItem = function(data) {
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
SalariesEditForm.prototype.loadPositionInfo = function(employeePositionHistoryItemEditForm) {
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
SalariesEditForm.prototype.editEmployeePositionHistoryItem = function(event) {
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
SalariesEditForm.prototype.deleteEmployeePositionHistoryItem = function(event) {
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
SalariesEditForm.prototype.doDeleteEmployeePositionHistoryItem = function() {
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
SalariesEditForm.prototype.getEmployeePositionHistoryItemFullName = function(index) {
    var employeePositionHistoryItem = this.loaded.employeePositionHistoryItems[index];
    var name = '';
    name += '(' + calendarVisualizer.getHtml(employeePositionHistoryItem.start) + ') ';
    name += employeePositionHistoryItem.officeName;
    name += ' / ' + employeePositionHistoryItem.departmentName;
    name += ' / ' + employeePositionHistoryItem.subdepartmentName;
    name += ' / ' + employeePositionHistoryItem.positionName;
    
    return name;
}
