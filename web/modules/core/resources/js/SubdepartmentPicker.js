/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function SubdepartmentPicker(htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "SubdepartmentPicker.jsp"
    }
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.loaded = {
        "countries": [],
        "offices": [],
        "departments": [],
        "subdepartments": []
    }
    this.selected = {
        "countryId": null,
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null
    }
}
SubdepartmentPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
SubdepartmentPicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.countries = result.countries;
            form.loaded.offices = [];
            form.loaded.departments = [];
            form.loaded.subdepartments = [];

            form.selected.countryId = null;
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentPicker.prototype.loadCountryContent = function() {
    var form = this;
    var data = {};
    data.command = "getCountryContent";
    data.moduleName = this.moduleName;
    data.countryId = this.selected.countryId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];

            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentPicker.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.moduleName = this.moduleName;
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];

            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentPicker.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.moduleName = this.moduleName;
    data.departmentId = this.selected.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;

            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentPicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Country</span></td>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="subdepartmentPicker_country"></select></td>';
    html += '<td><select id="subdepartmentPicker_office"></select></td>';
    html += '<td><select id="subdepartmentPicker_department"></select></td>';
    html += '</tr>';

    html += '</table>';
    html += '<span class="label1">Subdepartment</span><br />';
    html += '<select id="subdepartmentPicker_subdepartment" size="5" style="width: 300px;"></select>';
    return html;
}
SubdepartmentPicker.prototype.updateView = function() {
    this.updateCountryView();
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
}
SubdepartmentPicker.prototype.updateCountryView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.selected.countryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#subdepartmentPicker_country').html(html);
}
SubdepartmentPicker.prototype.updateOfficeView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="' + office.id + '" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#subdepartmentPicker_office').html(html);
}
SubdepartmentPicker.prototype.updateDepartmentView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + department.id + '" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#subdepartmentPicker_department').html(html);
}
SubdepartmentPicker.prototype.updateSubdepartmentView = function() {
    var html = '';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + subdepartment.id + '" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#subdepartmentPicker_subdepartment').html(html);
}
SubdepartmentPicker.prototype.setHandlers = function() {
    var form = this;
    $("#subdepartmentPicker_country").bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $("#subdepartmentPicker_office").bind("change", function(event) {form.officeChangedHandle.call(form, event);});
    $("#subdepartmentPicker_department").bind("change", function(event) {form.departmentChangedHandle.call(form, event);});
    $("#subdepartmentPicker_subdepartment").bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event);});
}
SubdepartmentPicker.prototype.countryChangedHandle = function(event) {
    var htmlId = $("#subdepartmentPicker_country").val();
    if(htmlId == '') {
        this.selected.countryId = null;
    } else {
        this.selected.countryId = parseInt(htmlId);
    }
    if(this.selected.countryId == null) {
        this.loadInitialContent();
    } else {
        this.loadCountryContent();
    }
}
SubdepartmentPicker.prototype.officeChangedHandle = function(event) {
    var htmlId = $("#subdepartmentPicker_office").val();
    if(htmlId == '') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(htmlId);
    }
    if(this.selected.officeId == null) {
        this.loadCountryContent();
    } else {
        this.loadOfficeContent();
    }
}
SubdepartmentPicker.prototype.departmentChangedHandle = function(event) {
    var htmlId = $("#subdepartmentPicker_department").val();
    if(htmlId == '') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(htmlId);
    }
    if(this.selected.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
SubdepartmentPicker.prototype.subdepartmentChangedHandle = function(event) {
    var htmlId = $("#subdepartmentPicker_subdepartment").val();
    if(htmlId == null || htmlId == '') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(htmlId);
    }
}
SubdepartmentPicker.prototype.show = function() {
    var title = 'Pick Subdepartment'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        subdepartment: 'center',
        width: 600,
        height: 300,
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
}
SubdepartmentPicker.prototype.okClickHandle = function() {
    var subdepartment = null;
    if(this.selected.subdepartmentId != null) {
        for(var key in this.loaded.subdepartments) {
            if(this.loaded.subdepartments[key].id == this.selected.subdepartmentId) {
                subdepartment = this.loaded.subdepartments[key];
            }
        }
    }
    this.okHandler.call(this.okHandlerContext, subdepartment);
}