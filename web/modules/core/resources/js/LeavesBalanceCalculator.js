/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function LeavesBalanceCalculator(formData, htmlId, containerHtmlId, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder+ "LeavesBalanceCalculator.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = moduleName;
    this.data = {
        "employeeId": formData.employeeId,
        "date": formData.date
    }
    this.loaded = {
        leavesBalanceCalculatorResult: null
    }
}
LeavesBalanceCalculator.prototype.init = function() {
    if(this.data.date == null) {
        this.show();
    } else {
        this.loadInitialContent();
    }
}
LeavesBalanceCalculator.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "calculateBalance";
    data.moduleName = this.moduleName;
    data.leavesBalanceCalculatorForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.leavesBalanceCalculatorResult = result.leavesBalanceCalculatorResult;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
LeavesBalanceCalculator.prototype.show = function() {
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.makeDatePickers();
    this.updateView();
}
LeavesBalanceCalculator.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
LeavesBalanceCalculator.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Leaves balance</span></td></tr>';

    html += '<tr>';
    html += '<td>';
    
    html += '<table class="datagrid">';
    html += '<tr>';
    html += '<td><span class="label1">Date</span></td>';
    html += '<td><input id="' + this.htmlId + '_date"></td>';
    html += '</tr>';
    html += '</table>';
    
    html += '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>';   
    html += '<div id="' + this.htmlId + '_balance"></div>';
    html += '</td>';
    html += '</tr>';
    html += '</table>';
    
    return html;
}
LeavesBalanceCalculator.prototype.makeButtons = function() {
}    
LeavesBalanceCalculator.prototype.updateView = function() {
    this.updateDateView();
    this.updateBalanceView();
}
LeavesBalanceCalculator.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(getStringFromYearMonthDate(this.data.date));
}
LeavesBalanceCalculator.prototype.updateBalanceView = function() {
    var html = '';
    var result = this.loaded.leavesBalanceCalculatorResult;
    if(result != null) {
        var totalDays = 0;
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader"><td>Period</td><td>Annual Leave</td><td>Duration</td><td>Leaves Days</td></tr>';
        for(var key in result.stages) {
            var stage = result.stages[key];
            totalDays += stage.days;
            html += '<tr>';
            html += '<td>' + getStringFromRange(stage.period.start, stage.period.end) + '</td>';
            html += '<td>' + stage.annualPaidLeave + '</td>';
            html += '<td>' + stage.duration.months + 'm' + stage.duration.days + 'd' + '</td>';
            html += '<td>' + decimalVisualizer.getHtml(stage.days) + '</td>';
            html += '</tr>';            
        }
        html += '<tr><td colspan="3">Total</td><td>' + decimalVisualizer.getHtml(totalDays) + '</td></tr>';
        var totalSpentDays = 0;
        for(var key in result.spentLeaveItems) {
            var spentLeaveItem = result.spentLeaveItems[key];
            totalSpentDays += spentLeaveItem.days;
        }
        var balanceDays = totalDays - totalSpentDays;
        html += '<tr><td colspan="3">Spent</td><td>' + decimalVisualizer.getHtml(totalSpentDays) + '</td></tr>';
        html += '<tr class="dgHighlight"><td colspan="3">Balance</td><td>' + decimalVisualizer.getHtml(balanceDays) + '</td></tr>';
        html += '</table>';
    }
    $('#' + this.htmlId + '_balance').html(html);
}
LeavesBalanceCalculator.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event);});
}
LeavesBalanceCalculator.prototype.dateChangedHandle = function(dateText, inst) {
    this.dateHandle(dateText);
}
LeavesBalanceCalculator.prototype.dateTextChangedHandle = function(event) {
    this.dateHandle(jQuery.trim(event.currentTarget.value));
}
LeavesBalanceCalculator.prototype.dateHandle = function(dateTxt) {
    var errors = [];
    var date = null;
    if(dateTxt == null || dateTxt == "") {
        errors.push("Date is not set");
    } else if(! isDateValid(dateTxt)) {
        errors.push("Date has incorrect format");
    } else {
        date = parseDateString(dateTxt);
    }
    if(errors.length == 0) {
        this.data.date = getYearMonthDateFromDateString(dateTxt);
        this.loadInitialContent();
    } else {
        this.updateDateView();
        showErrors(errors);
    }
}


