/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CountryManagement(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "CountryManagement.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.moduleName = "Admin";
   this.countryInfo = new CountryInfo(this, "countryInfo", this.htmlId + '_content', {
        "country": {"edit": false},
        "offices": {
            "create": true,
            "delete": true
        }
   });
   this.officeInfo = new OfficeInfo(this, "officeInfo", this.htmlId + '_content', {
        "office": {"edit": true},
        "departments": {
            "create": true,
            "delete": true
        }
   });
   this.departmentInfo = new DepartmentInfo(this, "departmentInfo", this.htmlId + '_content', {
        "department": {"edit": true},
        "subdepartments": {
            "create": true,
            "delete": true
        }
   });
   this.subdepartmentInfo = new SubdepartmentInfo(this, "subdepartmentInfo", this.htmlId + '_content', {
        "subdepartment": {"edit": true},
        "positions": {
            "create": true,
            "sort": true,
            "delete": true
        },
       "taskTypes": {
            "create": true,
            "delete": true
        },
       "activities": {
            "create": true,
            "delete": true
        },
       "planningTypes": {
            "create": true,
            "delete": true
        },
        "projectCodeComments": {
            "create": true,
            "edit": true,
            "delete": true
        },
        "checkedSubdepartments": {
            "create": true,
            "edit": true,
            "delete": true
        },
        "checkingSubdepartments": {
            "create": true,
            "edit": true,
            "delete": true
        },
        "employeeSubdepartmentLinks": {
            "create": true,
            "edit": true,
            "delete": true
        },
       "projectCodes": true
   }, this.moduleName);
   this.positionInfo = new PositionInfo(this, "positionInfo", this.htmlId + '_content', {
        "position": {"edit": true},
        "employees": null
   });
   this.employeeInfo = new EmployeeInfo(this, "employeeInfo", this.htmlId + '_content', {
        "employee": {"edit": true},
        "subdepartments": {"mainPositions": false},
        "employeePositionHistoryItems": true
   });
   this.activityInfo = new ActivityInfo(this, "activityInfo", this.htmlId + '_content', {
        "activity": {"edit": true},
        "projectCodes": true
   });
   this.projectCodeInfo = new ProjectCodeInfo(this, "projectCodeInfo", this.htmlId + '_content', {
        "projectCode": {}
   });
   this.taskTypeInfo = new TaskTypeInfo(this, "taskTypeInfo", this.htmlId + '_content', {
        "taskType": {"edit": true},
        "tasks": {
            "create": true,
            "delete": true
        }
   }, this.moduleName);
   this.planningTypeInfo = new PlanningTypeInfo(this, "planningTypeInfo", this.htmlId + '_content', {
        "planningType": {"edit": true}
   }, this.moduleName);
   this.taskInfo = new TaskInfo(this, "taskInfo", this.htmlId + '_content', {
        "task": {"edit": true}
   });
}
CountryManagement.prototype.init = function() {
    this.makeLayout();
    this.showCurrentCountry();
}
CountryManagement.prototype.makeLayout = function() {
    var html = '<div id="' + this.htmlId + '_content"></div>';
    $('#' + this.containerHtmlId).html(html);
}

CountryManagement.prototype.countryClickHandle = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.showCountry(id);
}
CountryManagement.prototype.showCurrentCountry = function(id) {
    var form = this;
    var data = {};
    data.command = "getCurrentCountry";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            var country = result.country;
            if(country != null) {
                form.countryInfo.showInfo(country.id);
            } else {
                doAlert("Alert", "No current country for current user");
            }
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

CountryManagement.prototype.showCountry = function(id) {
    this.countryInfo.showInfo(id);
}
CountryManagement.prototype.showOffice = function(id) {
  this.officeInfo.showInfo(id);
}
CountryManagement.prototype.showTaskType = function(id) {
  this.taskTypeInfo.showInfo(id);
}
CountryManagement.prototype.showTask = function(id) {
  this.taskInfo.showInfo(id);
}
CountryManagement.prototype.showPlanningType = function(id) {
    this.planningTypeInfo.showInfo(id);
}
CountryManagement.prototype.showProjectCode = function(id) {
    this.projectCodeInfo.showInfo(id);  
}
CountryManagement.prototype.showPosition = function(id) {
  this.positionInfo.showInfo(id);
}
CountryManagement.prototype.showDepartment = function(id) {
  this.departmentInfo.showInfo(id);
}
CountryManagement.prototype.showSubdepartment = function(id) {
  this.subdepartmentInfo.showInfo(id);
}
CountryManagement.prototype.showEmployee = function(id) {
  this.employeeInfo.showInfo(id);
}
CountryManagement.prototype.showActivity = function(id) {
  this.activityInfo.showInfo(id);
}
CountryManagement.prototype.navigationClickHandle = function(type, id) {
    if(type == 'country') {
        this.showCountry(id);
    } else if(type == 'office') {
        this.showOffice(id);
    } else if(type == 'department') {
        this.showDepartment(id);
    } else if(type == 'subdepartment') {
        this.showSubdepartment(id);
    } else if(type == 'activity') {
        this.showActivity(id);
    } else if(type == 'taskType') {
        this.showTaskType(id);
    } else if(type == 'task') {
        this.showTask(id);
    } else if(type == 'planningType') {
        this.showPlanningType(id);
    };
}
