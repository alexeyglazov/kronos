/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MyCareerViewer(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "MyCareerViewer.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.moduleName = "Timesheets";
   this.loaded = {
       "employee": null,
       "employeePositionHistoryItems": [],
       "leavesItems": [],
       "holidays": []
   }
}
MyCareerViewer.prototype.init = function() {
    this.loadInitialContent();
}
MyCareerViewer.prototype.loadInitialContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employee = result.employee;
            form.loaded.employeePositionHistoryItems = result.employeePositionHistoryItems;
            form.loaded.leavesItems = result.leavesItems;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MyCareerViewer.prototype.show = function() {
  this.makeLayout();
  this.setHandlers();
  this.updateView();
}
MyCareerViewer.prototype.makeLayout = function() {
    var html = '';
    html += '<table>'
    html += '<tr><td id="' + this.htmlId + '_layout_employee" colspan="2"></td></tr>';
    html += '<tr><td id="' + this.htmlId + '_layout_employeePositionHistoryItems" colspan="2"></td></tr>';
    html += '<tr><td id="' + this.htmlId + '_layout_leavesItems"></td><td id="' + this.htmlId + '_layout_leavesBalanceCalculator"></td></tr>';
    html += '</table>';
    $('#' + this.containerHtmlId).html(html);
}
MyCareerViewer.prototype.updateView = function() {
    this.updateEmployeeView();
    this.updateEmployeePositionHistoryItemsView();
    this.updateLeavesItemsView();
    this.updateLeavesBalanceView();    
}
MyCareerViewer.prototype.updateEmployeeView = function() {
    if(this.loaded.employee == null) {
        $('#' + this.htmlId + "_layout_employee").html("");
        return;
    }
    var rows = [];
    rows.push({"name": "External Id (1C)", "property": "externalId"});
    rows.push({"name": "User name", "property": "userName"});
    rows.push({"name": "First Name", "property": "firstName"});
    rows.push({"name": "Last Name", "property": "lastName"});
    rows.push({"name": "First Name (Local Language)", "property": "firstNameLocalLanguage"});
    rows.push({"name": "Last Name (Local Language)", "property": "lastNameLocalLanguage"});
    rows.push({"name": "Maiden Name", "property": "maidenName"});
    rows.push({"name": "E-mail", "property": "email"});
    rows.push({"name": "Profile", "property": "profile"});
    rows.push({"name": "Active", "property": "isActive", visualizer: booleanVisualizer});
    rows.push({"name": "Future", "property": "isFuture", visualizer: booleanVisualizer});
    rows.push({"name": "Password To Be Changed", "property": "passwordToBeChanged", visualizer: booleanVisualizer});
    var controls = [];
    //controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editEmployee, "context": this}});
    var propertyGrid = new PropertyGrid("admin_employee", this.loaded.employee, rows, "Employee", controls);
    propertyGrid.show(this.htmlId + "_layout_employee");
}

MyCareerViewer.prototype.updateEmployeePositionHistoryItemsView = function() {
    if(this.loaded.employee == null) {
        $('#' + this.htmlId + "_layout_employeePositionHistoryItems").html("");
        return;
    }
    for(var key in this.loaded.employeePositionHistoryItems) {
        var employeePositionHistoryItem = this.loaded.employeePositionHistoryItems[key];
        if(employeePositionHistoryItem.contractType == 'PART_TIME') {
            employeePositionHistoryItem.contractTypeModified = employeePositionHistoryItem.contractType + '/' + employeePositionHistoryItem.partTimePercentage;
        } else {
            employeePositionHistoryItem.contractTypeModified = employeePositionHistoryItem.contractType;
        }
    }
    var columns = [];
    columns.push({"name": "Office", "property": "officeName"});
    columns.push({"name": "Department", "property": "departmentName"});
    columns.push({"name": "Subdepartment", "property": "subdepartmentName"});
    columns.push({"name": "Position", "property": "positionName"});
    columns.push({"name": "Standard Position", "property": "standardPositionName"});
    columns.push({"name": "Start", "property": "start", "visualizer": calendarVisualizer});
    columns.push({"name": "End", "property": "end", "visualizer": calendarVisualizer});
    columns.push({"name": "Contract", "property": "contractTypeModified"});
    columns.push({"name": "Career Status", "property": "careerStatus"});
    columns.push({"name": "Time Status", "property": "timeStatus"});
    var extraColumns = [];
    var controls = [];
    var dataGrid = new DataGrid("employeePositionHistoryItems", this.loaded.employeePositionHistoryItems, columns, "Carreer", controls, extraColumns, "id");
    dataGrid.show(this.htmlId + "_layout_employeePositionHistoryItems");
}
MyCareerViewer.prototype.updateLeavesItemsView = function() {
    if(this.loaded.employee == null) {
        $('#' + this.htmlId + "_layout_leavesItems").html("");
        return;
    }
    var leavesItems = [];
    for(var key in this.loaded.leavesItems) {
        var leavesItem = this.loaded.leavesItems[key];
        var days = getDaysInRange(leavesItem.start, leavesItem.end) + 1;
        var holidays = sliceDaysByRange(this.loaded.holidays, leavesItem.start, leavesItem.end);
        days = days - holidays.length;
        leavesItems.push({
            id: leavesItem.id,
            type: leavesItem.type,
            start: leavesItem.start,
            end: leavesItem.end,
            days: days
        });
    }
    var columns = [];
    columns.push({"name": "Leave Type", "property": "type"});
    columns.push({"name": "Start", "property": "start", "visualizer": calendarVisualizer});
    columns.push({"name": "End", "property": "end", "visualizer": calendarVisualizer});
    columns.push({"name": "Days w/o holidays", "property": "days"});
    var extraColumns = [];
    var controls = [];
    var dataGrid = new DataGrid("leavesItems", leavesItems, columns, "Leaves", controls, extraColumns, "id");
    dataGrid.show(this.htmlId + "_layout_leavesItems");
}
MyCareerViewer.prototype.updateLeavesBalanceView = function() {
    if(this.loaded.employee == null) {
        $('#' + this.htmlId + "_layout_leavesBalanceCalculator").html("");
        return;
    }
    var now = new Date();
    var date = {
        year: now.getFullYear(),
        month: now.getMonth(),
        dayOfMonth: now.getDate()
    }
    var formData = {
        "date": date,
        "employeeId": this.loaded.employee.id
    }
    this.leavesBalanceCalculator = new LeavesBalanceCalculator(formData, this.htmlId + '_leavesBalanceCalculator', this.htmlId + '_layout_leavesBalanceCalculator', this.moduleName);
    this.leavesBalanceCalculator.init();
}
MyCareerViewer.prototype.setHandlers = function() {
    var form = this;
}


