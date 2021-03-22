/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeePositionHistoryItemEditForm(formData, htmlId, successHandler, successContext, dataTargetHandler, dataTargetContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeePositionHistoryItemEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.dataTargetHandler = dataTargetHandler;
    this.dataTargetContext = dataTargetContext;
    this.moduleName = moduleName;
    this.picked = {
        "position": null
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "employeeId": formData.employeeId,
        "positionId": formData.positionId,
        "start": calendarVisualizer.getHtml(formData.start),
        "end": calendarVisualizer.getHtml(formData.end),
        "contractType": formData.contractType,
        "partTimePercentage": formData.partTimePercentage
    }
    this.contractTypes = {
        "FULL_TIME": "Full Time",
        "PART_TIME": "Part Time",
        "TIME_SPENT": "Time Spent"
    }
}
EmployeePositionHistoryItemEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.loadPositionInfo();
        //this.checkDependencies();
    } else {
       this.show();
    }
    this.dataChanged(false);
}
EmployeePositionHistoryItemEditForm.prototype.loadPositionInfo = function() {
    var form = this;
    var data = {};
    data.command = "getPosition";
    data.positionId = this.data.positionId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            var position = result.position;
            form.pickPosition(position);
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeePositionHistoryItemEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkEmployeeDependencies";
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
EmployeePositionHistoryItemEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.timeSpentItems == 0 && dependencies.createdProjectCodes == 0 && dependencies.closedProjectCodes == 0 && dependencies.clientHistoryItems == 0) {
        this.show();
    } else {
        var html = 'This Employee has dependencies and can not be updated<br />';
        html += 'Time Spent Items: ' + dependencies.timeSpentItems + '<br />';
        html += 'Created Project Codes: ' + dependencies.createdProjectCodes + '<br />';
        html += 'Closed Project Codes: ' + dependencies.closedProjectCodes + '<br />';
        html += 'Client History Items: ' + dependencies.clientHistoryItems + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
EmployeePositionHistoryItemEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Position</td><td><input type="text" id="' + this.htmlId + '_position" disabled><span id="' + this.htmlId + '_positionPick" class="link">Pick</span></td></tr>';
    html += '<tr><td>Contract Type</td><td><select id="' + this.htmlId + '_contractType"></select></td></tr>';
    html += '<tr><td>Part Time Percentage</td><td><input type="text" id="' + this.htmlId + '_partTimePercentage" style="width: 30px;"></td></tr>';
    html += '<tr><td>Start</td><td><input type="text" id="' + this.htmlId + '_start"></td></tr>';
    html += '<tr><td>End</td><td><input type="text" id="' + this.htmlId + '_end"></td></tr>';
    html += '</table>';
    html += '<div id="' + this.htmlId + '_popup"></div>';
    return html
}
EmployeePositionHistoryItemEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_positionPick').bind("click", function(event) {form.openPositionPicker.call(form, event);});
    $('#' + this.htmlId + '_start').bind("change", function(event) {form.startTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_end').bind("change", function(event) {form.endTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_contractType').bind("change", function(event) {form.contractTypeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_partTimePercentage').bind("change", function(event) {form.partTimePercentageChangedHandle.call(form, event)});
}
EmployeePositionHistoryItemEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_start').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startChangedHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_end').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endChangedHandle(dateText, inst)}
    });
}
EmployeePositionHistoryItemEditForm.prototype.openPositionPicker = function(event) {
    var positionPicker = new PositionPicker("positionPicker", this.pickPosition, this, this.moduleName);
    positionPicker.init();
}
EmployeePositionHistoryItemEditForm.prototype.pickPosition = function(position) {
    this.picked.position = position;
    this.data.positionId = this.picked.position.id;
    this.updatePositionView();
    this.dataChanged(true);
}
EmployeePositionHistoryItemEditForm.prototype.startChangedHandle = function(dateText, inst) {
    this.data.start = dateText;
    this.dataChanged(true);
}
EmployeePositionHistoryItemEditForm.prototype.startTextChangedHandle = function(event) {
    this.data.start = jQuery.trim(event.currentTarget.value);
    this.updateStartView();
    this.dataChanged(true);
}
EmployeePositionHistoryItemEditForm.prototype.endChangedHandle = function(dateText, inst) {
    this.data.end = dateText;
    this.dataChanged(true);
}
EmployeePositionHistoryItemEditForm.prototype.endTextChangedHandle = function(event) {
    this.data.end = jQuery.trim(event.currentTarget.value);
    this.updateEndView();
    this.dataChanged(true);
}
EmployeePositionHistoryItemEditForm.prototype.contractTypeChangedHandle = function(event) {
    this.data.contractType = $('#' + this.htmlId + '_contractType').val();
    this.updatePartTimePercentageView();
    this.dataChanged(true);
}
EmployeePositionHistoryItemEditForm.prototype.partTimePercentageChangedHandle = function(event) {
    this.data.partTimePercentage = jQuery.trim(event.currentTarget.value);
    this.updatePartTimePercentageView();
    this.dataChanged(true);
}

EmployeePositionHistoryItemEditForm.prototype.updateView = function() {
    this.updatePositionView();
    this.updateStartView();
    this.updateEndView();
    this.updateContractTypeView();
    this.updatePartTimePercentageView();
}
EmployeePositionHistoryItemEditForm.prototype.updatePositionView = function() {
    if(this.picked.position == null) {
        $('#' + this.htmlId + '_position').val("");
    } else {
        $('#' + this.htmlId + '_position').val(this.picked.position.name);
    }
}
EmployeePositionHistoryItemEditForm.prototype.updateStartView = function() {
    $('#' + this.htmlId + '_start').val(this.data.start);
}
EmployeePositionHistoryItemEditForm.prototype.updateEndView = function() {
    $('#' + this.htmlId + '_end').val(this.data.end);
}
EmployeePositionHistoryItemEditForm.prototype.updateContractTypeView = function() {
    var html = '';
    for(var key in this.contractTypes) {
        var contractType = this.contractTypes[key];
        var isSelected = "";
        if(key == this.data.contractType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + contractType + '</option>';
    }
    $('#' + this.htmlId + '_contractType').html(html);
}
EmployeePositionHistoryItemEditForm.prototype.updatePartTimePercentageView = function() {
    if(this.data.contractType == 'PART_TIME') {
        $('#' + this.htmlId + '_partTimePercentage').attr("disabled", false);
        $('#' + this.htmlId + '_partTimePercentage').val(this.data.partTimePercentage);
    } else {
        $('#' + this.htmlId + '_partTimePercentage').attr("disabled", true);
        $('#' + this.htmlId + '_partTimePercentage').val('');
    }
}
EmployeePositionHistoryItemEditForm.prototype.show = function() {
    var title = 'Update Carreer'
    if(this.data.mode == 'CREATE') {
        title = 'Create Carreer';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 300,
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
    this.makeDatePickers();
    this.updateView();
}
EmployeePositionHistoryItemEditForm.prototype.validate = function() {
    var errors = [];
    var start = null;
    var end = null;
    var percentageRE = /^[0-9]{1,2}$/;
    if(this.data.positionId == null) {
        errors.push("Position is not set");
    }
    if(this.data.start == null || this.data.start == "") {
        errors.push("Start date is not set");
    } else if(! isDateValid(this.data.start)) {
        errors.push("Start date has incorrect format");
    } else {
        start = parseDateString(this.data.start);
    }
    if(this.data.end == null || this.data.end == "") {
    } else if(! isDateValid(this.data.end)) {
        errors.push("End date has incorrect format");
    } else {
        end = parseDateString(this.data.end);
    }
    if(start != null && end != null && start > end) {
        errors.push("End date is less than Start date");
    }
    if(this.data.contractType == 'PART_TIME' && ! percentageRE.test(this.data.partTimePercentage)) {
        errors.push("Part Time Percentage can have one or two digits only");
    }
    return errors;
}
EmployeePositionHistoryItemEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors)
        return;
    }
    var employeePositionHistoryItemEditForm = clone(this.data);
    employeePositionHistoryItemEditForm.start = getYearMonthDateFromDateString(this.data.start);
    employeePositionHistoryItemEditForm.end = getYearMonthDateFromDateString(this.data.end);
    if(this.data.contractType != 'PART_TIME') {
        employeePositionHistoryItemEditForm.partTimePercentage = null;
    }
    if(this.dataTargetHandler == null || this.dataTargetContext == null) {
        this.doSave(employeePositionHistoryItemEditForm);
    } else {
        this.dataTargetHandler.call(this.dataTargetContext, employeePositionHistoryItemEditForm);
        this.afterSave();
    }
}
EmployeePositionHistoryItemEditForm.prototype.doSave = function(employeePositionHistoryItemEditForm) {
    var form = this;
    var data = {};
    data.command = "saveEmployeePositionHistoryItem";
    data.employeePositionHistoryItemEditForm = getJSON(employeePositionHistoryItemEditForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "This Carreer Item has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeePositionHistoryItemEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    if(this.successHandler != null && this.successContext != null) {
        this.successHandler.call(this.successContext);
    }
}

EmployeePositionHistoryItemEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function EmployeePositionHistoryItemDeleteForm(employeePositionHistoryItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeePositionHistoryItemEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": employeePositionHistoryItemId
    }
}
EmployeePositionHistoryItemDeleteForm.prototype.start = function() {
        this.checkDependencies();
}
EmployeePositionHistoryItemDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkEmployeePositionHistoryItemDependencies";
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
EmployeePositionHistoryItemDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.employeePositionHistoryItems > 1) {
        this.show();
    } else {
        var html = 'This Employee Position History Item is the last one and can not be deleted<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
EmployeePositionHistoryItemDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Employee Position History Item", this, function() {this.doDeleteEmployeePositionHistoryItem()}, null, null);
}
EmployeePositionHistoryItemDeleteForm.prototype.doDeleteEmployeePositionHistoryItem = function() {
    var form = this;
    var data = {};
    data.command = "deleteEmployeePositionHistoryItem";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Employee Position History Item has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeePositionHistoryItemDeleteForm.prototype.afterSave = function() {
  if(this.successHandler != null && this.successContext != null) {
    this.successHandler.call(this.successContext);
  }
}