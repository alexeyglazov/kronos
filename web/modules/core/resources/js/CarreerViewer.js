/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CarreerViewer(employeePositionHistoryItems, leavesItems, htmlId, containerHtmlId) {
    this.employeePositionHistoryItems = employeePositionHistoryItems;
    this.leavesItems = leavesItems;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayRange = {
        "start": null,
        "end": null
    }
}
CarreerViewer.prototype.init = function() {
    this.calculateDisplayRange();
    this.show();
}
CarreerViewer.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.updateView();
}
CarreerViewer.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId +'_positions"></div>';
    return html;
}
CarreerViewer.prototype.updateView = function() {
    this.updatePositionsView();
}
CarreerViewer.prototype.updatePositionsView = function() {
    var width = 500;
    var html = '';
    var totalDays = getDaysInRange(this.displayRange.start, this.displayRange.end);
    html += '<table style="border: 1px solid #999999; border-collapse: collapse;">';
    html += '<tr><td colspan="2" style="border: 1px solid #999999;"><span class="label1">Positions</span></td></tr>';
    if(this.employeePositionHistoryItems.length > 0) {
        for(var key in this.employeePositionHistoryItems) {
            var employeePositionHistoryItem = this.employeePositionHistoryItems[key];
            var displayDays = this.getDisplayDays(employeePositionHistoryItem.start, employeePositionHistoryItem.end);
            html += '<tr>';
            html += '<td style="border-right: 1px solid #999999;">' + employeePositionHistoryItem.positionName + '</td>';
            html += '<td>';
            if(displayDays != null) {
                var before = Math.round(width*displayDays.before/totalDays);
                var between = Math.round(width*displayDays.between/totalDays);
                var after = Math.round(width*displayDays.after/totalDays);
                html += '<table><tr><td><img src="' + imagePath + '/transparent.gif" width="' + before + '" height="1"></td><td><img src="' + imagePath + '/grey.gif" title="' + getStringFromRange(employeePositionHistoryItem.start, employeePositionHistoryItem.end) + '" width="' + between + '" height="7"></td><td><img src="' + imagePath + '/transparent.gif" width="' + after + '" height="1"></td></tr></table>';
            }
            html += '</td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="2" style="border: 1px solid #999999;">No positions</td></tr>';
    }
    html += '<tr><td colspan="2" style="border: 1px solid #999999;"><span class="label1">Leaves</span></td></tr>';
    if(this.leavesItems.length > 0) {
        for(var key in this.leavesItems) {
            var leavesItem = this.leavesItems[key];
            var displayDays = this.getDisplayDays(leavesItem.start, leavesItem.end);
            html += '<tr>';
            html += '<td style="border-right: 1px solid #999999;">' + leavesItem.type + '</td>';
            html += '<td>';
            if(displayDays != null) {
                var before = Math.round(width*displayDays.before/totalDays);
                var between = Math.round(width*displayDays.between/totalDays);
                var after = Math.round(width*displayDays.after/totalDays);
                html += '<table><tr><td><img src="' + imagePath + '/transparent.gif" width="' + before + '" height="1"></td><td><img src="' + imagePath + '/grey.gif" title="' + getStringFromRange(leavesItem.start, leavesItem.end) + '" width="' + between + '" height="7"></td><td><img src="' + imagePath + '/transparent.gif" width="' + after + '" height="1"></td></tr></table>';
            }
            html += '</td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="2" style="border: 1px solid #999999;">No leaves</td></tr>';
    }
    html += '<tr>';
    html += '<td style="border-top: 1px solid #999999;"><input type="button"  id="' + this.htmlId +'_reset" value="Reset"></td>';
    html += '<td style="border-top: 1px solid #999999;">';
    html += '<input id="' + this.htmlId +'_displayRange_start">';
    html += '<input id="' + this.htmlId +'_displayRange_end">';
    html += '</td>';
    html += '</tr>';
    html += '</table>';
    $('#' + this.htmlId +'_positions').html(html);
    $('#' + this.htmlId +'_displayRange_start').val(getStringFromYearMonthDate(this.displayRange.start));
    $('#' + this.htmlId +'_displayRange_end').val(getStringFromYearMonthDate(this.displayRange.end));
    this.makeDatePickers();
    var form = this;
    $('#' + this.htmlId +'_reset').bind("click", function(event) {form.resetDisplayRange.call(form, event);});
}
CarreerViewer.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_displayRange_start' ).datepicker({
        dateFormat: 'dd.mm.yy',
        changeYear: true,
        onSelect: function(dateText, inst) {form.displayRangeStartDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_displayRange_end' ).datepicker({
        dateFormat: 'dd.mm.yy',
        changeYear: true,
        onSelect: function(dateText, inst) {form.displayRangeEndDateChangedHandle(dateText, inst)}
    });
}
CarreerViewer.prototype.calculateDisplayRange = function() {
    var currentRange = this.getCurrentRange();
    var start = currentRange.start;
    var end = currentRange.end;
    var optimizedRange = {};
    if(start != null && end != null) {
        optimizedRange = this.getOptimizedRange({
            "start": start,
            "end": end
        });
    } else if(start != null && end == null) {
        var now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        var startDate = new Date(start.year, start.month, start.dayOfMonth, 0, 0, 0, 0);
        if(startDate < now) {
            optimizedRange = this.getOptimizedRange({
                "start": start,
                "end": {
                    "year": now.getFullYear(),
                    "month": now.getMonth(),
                    "dayOfMonth": now.getDate()
                }
            });
        } else {
            optimizedRange = this.getOptimizedRange({
                "start": {
                    "year": now.getFullYear(),
                    "month": now.getMonth(),
                    "dayOfMonth": now.getDate()
                },
                "end": start
            });
        }
    } else {
        
    }
    this.displayRange.start = optimizedRange.start;
    this.displayRange.end = optimizedRange.end;
}
CarreerViewer.prototype.getCurrentRange = function() {
    var start = null;
    var end = null;
    for(var key in this.employeePositionHistoryItems) {
        var employeePositionHistoryItem = this.employeePositionHistoryItems[key];
        if(employeePositionHistoryItem.start != null) {
            if(start == null) {
                start = employeePositionHistoryItem.start;
            } else if(compareYearMonthDate(employeePositionHistoryItem.start, start) == -1) {
                start = employeePositionHistoryItem.start;
            }
        }
        if(employeePositionHistoryItem.end != null) {
            if(end == null) {
                end = employeePositionHistoryItem.end;
            } else if(compareYearMonthDate(employeePositionHistoryItem.end, end) == 1) {
                end = employeePositionHistoryItem.end;
            }
        }
    }
    for(var key in this.leavesItems) {
        var leavesItem = this.leavesItems[key];
        if(leavesItem.start != null) {
            if(start == null) {
                start = leavesItem.start;
            } else if(compareYearMonthDate(leavesItem.start, start) == -1) {
                start = leavesItem.start;
            }
        }
        if(leavesItem.end != null) {
            if(end == null) {
                end = leavesItem.end;
            } else if(compareYearMonthDate(leavesItem.end, end) == 1) {
                end = leavesItem.end;
            }
        }
    }
    return {
        "start": start,
        "end": end
    }
}
CarreerViewer.prototype.getOptimizedRange = function(range) {
    var start = range.start;
    var end = range.end;

    var startDate = new Date(start.year, start.month, start.dayOfMonth, 0, 0, 0, 0);
    var endDate = new Date(end.year, end.month, end.dayOfMonth, 0, 0, 0, 0);
    var days = (endDate.getTime() - startDate.getTime()) / (1000*60*60*24);
    if(days < 365) {
        var end2 = {
                "year": end.year,
                "month": end.month + 1,
                "dayOfMonth": 1
            }
        if(end.month == 11) {
            end2 = {
                "year": end.year + 1,
                "month": 0,
                "dayOfMonth": 1
            }
        }
        return {
            "start": {
                "year": start.year,
                "month": start.month,
                "dayOfMonth": 1
            },
            "end": end2
        }
    } else {
        return {
            "start": {
                "year": start.year,
                "month": 0,
                "dayOfMonth": 1
            },
            "end": {
                "year": end.year + 1,
                "month": 0,
                "dayOfMonth": 1
            }
        }
    }
}
CarreerViewer.prototype.displayRangeStartDateChangedHandle = function(dateText, inst) {
    var start = getYearMonthDateFromDateString(dateText);
    if(compareYearMonthDate(start, this.displayRange.end) == -1) {
        this.displayRange.start = start;
        this.updateView();
    } else {
        $('#' + this.htmlId +'_displayRange_start').val(getStringFromYearMonthDate(this.displayRange.start));
    }
}
CarreerViewer.prototype.displayRangeStartDateTextChangedHandle = function(event) {
    var dateText = jQuery.trim(event.currentTarget.value);
    if(isDateValid(dateText) && compareYearMonthDate(getYearMonthDateFromDateString(dateText), this.displayRange.end) == -1) {
        this.displayRange.start = getYearMonthDateFromDateString(dateText);
        this.updateView();
    } else {
        $('#' + this.htmlId +'_displayRange_start').val(getStringFromYearMonthDate(this.displayRange.start));
    }
}
CarreerViewer.prototype.displayRangeEndDateChangedHandle = function(dateText, inst) {
    var end = getYearMonthDateFromDateString(dateText);
    if(compareYearMonthDate(end, this.displayRange.start) == 1) {
        this.displayRange.end = end;
        this.updateView();
    } else {
        $('#' + this.htmlId +'_displayRange_end').val(getStringFromYearMonthDate(this.displayRange.end));
    }
}
CarreerViewer.prototype.displayRangeEndDateTextChangedHandle = function(event) {
    var dateText = jQuery.trim(event.currentTarget.value);
    if(isDateValid(dateText) && compareYearMonthDate(getYearMonthDateFromDateString(dateText), this.displayRange.start) == 1) {
        this.displayRange.end = getYearMonthDateFromDateString(dateText);
        this.updateView();
    } else {
        $('#' + this.htmlId +'_displayRange_end').val(getStringFromYearMonthDate(this.displayRange.end));
    }
}
CarreerViewer.prototype.resetDisplayRange = function(event) {
    this.init();
}
CarreerViewer.prototype.getDisplayDays = function(start, end) {
    if(! isIntersected(start, end, this.displayRange.start, this.displayRange.end)) {
        return null;
    } else {
        var beforeDays = 0;
        var betweenDays = 0;
        var afterDays = 0;
        beforeDays = getDaysInRange(this.displayRange.start, start);
        if(end == null) {
            if(compareYearMonthDate(this.displayRange.start, start) == -1) {
                betweenDays = getDaysInRange(start, this.displayRange.end);
            } else {
                betweenDays = getDaysInRange(this.displayRange.start,  this.displayRange.end);
            }
            afterDays = 0;
        } else {
            if(compareYearMonthDate(this.displayRange.start, start) == -1) {
                if(compareYearMonthDate(end, this.displayRange.end) == -1) {
                    betweenDays = getDaysInRange(start, end);
                } else {
                    betweenDays = getDaysInRange(start, this.displayRange.end);
                }
            } else {
                if(compareYearMonthDate(end, this.displayRange.end) == -1) {
                    betweenDays = getDaysInRange(this.displayRange.start, end);
                } else {
                    betweenDays = getDaysInRange(this.displayRange.start, this.displayRange.end);
                }
            }
            afterDays = getDaysInRange(end, this.displayRange.end);
        }
        return {
            "before": beforeDays,
            "between": betweenDays,
            "after": afterDays
        }
    }
}