/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PlanningGroupPicker(options) {
    //{
    //    htmlId
    //    okHandler
    //    okHandlerContext
    //    moduleName
    //    subdepartmentId
    //    startDate
    //    endDate
    //}
    this.config = {
        endpointUrl: endpointsFolder + "PlanningGroupPicker.jsp"
    }
    this.htmlId = options.htmlId;
    this.containerHtmlId = null;
    this.okHandler = options.okHandler;
    this.okHandlerContext = options.okHandlerContext;
    this.moduleName = options.moduleName;
    this.data = {
        subdepartmentIds: options.subdepartmentIds,
        descriptionPattern: options.descriptionPattern,
        startDate: options.startDate,
        endDate: options.endDate
    }
    this.loaded = {
        "planningGroups": [],
        "planningToolInfo": new PlanningToolInfo()
    }
    this.selected = {
        "planningGroupId": null
    }
}
PlanningGroupPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
PlanningGroupPicker.prototype.searchPlanningGroups = function() {
    var form = this;
    var data = {};
    data.command = "searchPlanningGroups";
    data.planningGroupPickerForm = getJSON(this.startDate);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.planningGroups = result.planningGroups;
            form.updatePlanningGroupView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningGroupPicker.prototype.loadPlanningGroupInfo = function() {
    var form = this;
    var data = {};
    data.command = "getPlanningGroupInfo";
    data.planningGroupId = this.selected.planningGroupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.planningToolInfo.resetInfo();
            form.loaded.planningToolInfo.pushPlanningToolInfo(result.planningToolInfo);
            form.updatePlanningGroupInfoView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

PlanningGroupPicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td style="vertical-align: top;">';
        html += '<table>';
        html += '<tr>';
        html += '<td><span class="label1">Description</span></td><td><input id="' + this.htmlId + '_descriptionPattern"></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td><span class="label1">Start</span></td><td><input id="' + this.htmlId + '_startDate"></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td><span class="label1">End</span></td><td><input id="' + this.htmlId + '_endDate"></td>';
        html += '</tr>';
        html += '</table>';
        html += '<button id="' + this.htmlId + '_searchBtn">Search</button>'
        html += '<table>';
        html += '<tr><td><span class="label1">Planning Group</span></td></tr>';
        html += '<tr><td><select id="' + this.htmlId + '_planningGroup" size="12" style="width: 400px;"></select></td></tr>';
        html += '</table>';
    html += '</td><td id="' + this.htmlId + '_planningGroupInfo" style="vertical-align: top;">';
    html += '</td>'
    html += '</table>';
    return html;
}
PlanningGroupPicker.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
PlanningGroupPicker.prototype.makeButtons = function() {
   var form = this;
   $('#' + this.htmlId + '_searchBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: true
        })
      .click(function( event ) {
        form.startSearch.call(form);
    });    
}
PlanningGroupPicker.prototype.updateView = function() {
    this.updateDescriptionPatternView();
    this.updateStartDateView();
    this.updateEndDateView();
    this.updatePlanningGroupView();
}
PlanningGroupPicker.prototype.updateDescriptionPatternView = function() {
    $('#' + this.htmlId + '_descriptionPattern').val(this.data.descriptionPattern);
}
PlanningGroupPicker.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.data.startDate));
}
PlanningGroupPicker.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.data.endDate));
}
PlanningGroupPicker.prototype.updatePlanningGroupView = function() {
    var html = '';
    for(var key in this.loaded.planningGroups) {
        var planningGroup = this.loaded.planningGroups[key];
        var isSelected = "";
        if(planningGroup.id == this.selected.planningGroupId) {
           isSelected = "selected";
        }
        html += '<option value="' + planningGroup.id + '" ' + isSelected + '>' + planningGroup.description + '</option>';
    }
    $('#' + this.htmlId + '_planningGroup').html(html);
}
PlanningGroupPicker.prototype.updatePlanningGroupInfoView = function() {
    var html = '';
    if(this.selected.planningGroupId != null) {
        var planningGroup = this.loaded.planningToolInfo.getPlanningGroup(this.selected.planningGroupId);
        var planningItems = this.loaded.planningToolInfo.getPlanningItemsOfPlanningGroup(this.selected.planningGroupId);
        var planningType = this.loaded.planningToolInfo.getPlanningType(planningGroup.planningTypeId);
        var html = '';
        html += '<table class="datagrid" id="' + this.htmlId + '_planningItemInfo' + '">';
        html += '<tr><td><div class="comment1">Description</div>' + planningGroup.description + '</td></tr>';
        html += '<tr><td><div class="comment1">Type</div>' + planningType.name + '</td></tr>';
        for(var key in planningItems) {
            var planningItem = planningItems[key];
            var employee = this.loaded.planningToolInfo.getEmployee(planningItem.employeeId);
            html += '<tr><td><div class="comment1">Item</div>';
            html += planningItem.description + '<br />';
            html += employee.firstName + ' ' + employee.lastName + '<br />';
            html += getStringFromRange(planningItem.startDate, planningItem.endDate) + '<br />';
            html += '</td></tr>'; 
        }  
        html += '</table>';
    }
    $('#' + this.htmlId + '_planningGroupInfo').html(html);
}
PlanningGroupPicker.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_descriptionPattern').bind("change", function(event) {form.descriptionPatternChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_planningGroup').bind("change", function(event) {form.planningGroupChangedHandle.call(form, event);});
}
PlanningGroupPicker.prototype.descriptionPatternChangedHandle = function(event) {
    this.data.descriptionPattern = jQuery.trim(event.currentTarget.value);
    this.updateDescriptionPatternView();
    this.clearPlanningGroups();
}
PlanningGroupPicker.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = getYearMonthDateFromDateString(dateText);
    this.updateStartDateView();
    this.clearPlanningGroups();
}
PlanningGroupPicker.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = getYearMonthDateFromDateString(jQuery.trim(event.currentTarget.value));
    this.updateStartDateView();
    this.clearPlanningGroups();
}
PlanningGroupPicker.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = getYearMonthDateFromDateString(dateText);
    this.updateEndDateView();
    this.clearPlanningGroups();
}
PlanningGroupPicker.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = getYearMonthDateFromDateString(jQuery.trim(event.currentTarget.value));
    this.updateEndDateView();
    this.clearPlanningGroups();
}
PlanningGroupPicker.prototype.planningGroupChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_planningGroup').val();
    if(htmlId == null || htmlId == '') {
        this.selected.planningGroupId = null;
    } else {
        this.selected.planningGroupId = parseInt(htmlId);
    }
    this.loadPlanningGroupInfo();
}
PlanningGroupPicker.prototype.clearPlanningGroups = function() {
    this.selected.planningGroupId = null;
    this.loaded.planningGroups = [];
    this.updatePlanningGroupView();
    this.updatePlanningGroupInfoView();
}
PlanningGroupPicker.prototype.show = function() {
    var title = 'Pick Planning Group'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.makeButtons();
    this.setHandlers();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 700,
        height: 500,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                form.okClickHandle();
            },
            Cancel: function() {
                $(this).dialog( "close" );
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.updateView();
}
PlanningGroupPicker.prototype.validate = function() {
    var errors = [];
    if(this.data.descriptionPattern == null || this.data.descriptionPattern == "") {
        errors.push("Description pattern is not set");
    }
    if(this.data.startDate == null) {
        errors.push("Start date is not set");
    }
    if(this.data.endDate == null) {
        errors.push("End date is not set");
    }
    if(this.data.startDate != null && this.data.endDate != null && compareYearMonthDate(this.data.startDate, this.data.endDate) > 0) {
        errors.push("End date is less than Start date");
    }
    return errors;
}
PlanningGroupPicker.prototype.startSearch = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    this.search();
}
PlanningGroupPicker.prototype.search = function()  {
    var serverFormatData = {
        "subdepartmentIds": this.data.subdepartmentIds,
        "startDate": this.data.startDate,
        "endDate": this.data.endDate,
        "descriptionPattern": this.data.descriptionPattern,
    }
    var form = this;
    var data = {};
    data.command = "searchPlanningGroups";
    data.planningGroupPickerForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.planningGroups = result.planningGroups;
            form.updatePlanningGroupView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
PlanningGroupPicker.prototype.okClickHandle = function() {
    var planningGroup = null;
    if(this.selected.planningGroupId != null) {
        for(var key in this.loaded.planningGroups) {
            if(this.loaded.planningGroups[key].id == this.selected.planningGroupId) {
                planningGroup = this.loaded.planningGroups[key];
                break;
            }
        }
    }
    this.okHandler.call(this.okHandlerContext, planningGroup);
}