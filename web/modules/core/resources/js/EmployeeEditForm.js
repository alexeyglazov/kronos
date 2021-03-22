/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeeEditForm(formData, htmlId, successHandler, successContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = moduleName;
    this.picked = {
        "position": null
    };
    this.profiles = {
        "NON_USER": "Non User",
        "USER": "User",
        "SUPER_USER": "Super user",
        "COUNTRY_ADMINISTRATOR": "Country administrator"
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "externalId": formData.externalId,
        "positionId": formData.positionId,
        "userName": formData.userName,
        "firstName": formData.firstName,
        "lastName": formData.lastName,
        "firstNameLocalLanguage": formData.firstNameLocalLanguage,
        "lastNameLocalLanguage": formData.lastNameLocalLanguage,
        "maidenName": formData.maidenName,
        "email": formData.email,
        "profile": formData.profile,
        "isActive": formData.isActive,
        "isFuture": formData.isFuture,
        "contractType": formData.contractType,
        "partTimePercentage": formData.partTimePercentage

    }
    this.contractTypes = {
        "FULL_TIME": "Full Time",
        "PART_TIME": "Part Time",
        "TIME_SPENT": "Time Spent"
    }
}
EmployeeEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    
    if(this.data.mode == "UPDATE") {
        if(this.picked.position == null && this.data.positionId != null) {
            this.loadPosition();
        } else {
            this.show();
        }
        //this.checkDependencies();
    } else {
       this.show();
    }
    this.dataChanged(false);
}
EmployeeEditForm.prototype.loadPosition = function() {
    var form = this;
    var data = {};
    data.command = "getPosition";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            this.picked.position = result.position;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>External Id (1C)</td><td><input type="text" id="' + this.htmlId + '_externalId"></td></tr>';
    html += '<tr><td>User Name</td><td><input type="text" id="' + this.htmlId + '_userName"></td></tr>';
    html += '<tr><td>First Name</td><td><input type="text" id="' + this.htmlId + '_firstName"></td></tr>';
    html += '<tr><td>Last Name</td><td><input type="text" id="' + this.htmlId + '_lastName"></td></tr>';
    html += '<tr><td>First Name (Local Language)</td><td><input type="text" id="' + this.htmlId + '_firstNameLocalLanguage"></td></tr>';
    html += '<tr><td>Last Name (Local Language)</td><td><input type="text" id="' + this.htmlId + '_lastNameLocalLanguage"></td></tr>';
    html += '<tr><td>Maiden Name</td><td><input type="text" id="' + this.htmlId + '_maidenName"></td></tr>';
    html += '<tr><td>E-mail</td><td><input type="text" id="' + this.htmlId + '_email"></td></tr>';
    if(this.data.mode == "CREATE") {
        html += '<tr><td>Profile</td><td><select id="' + this.htmlId + '_profile"></select></td></tr>';
    }
    html += '<tr><td>Active</td><td><input type="checkbox" id="' + this.htmlId + '_isActive"></td></tr>';
    html += '<tr><td>Future</td><td><input type="checkbox" id="' + this.htmlId + '_isFuture"></td></tr>';
    if(this.data.mode == "CREATE") {
        html += '<tr><td>Position</td><td><input type="text" id="' + this.htmlId + '_position" disabled><span id="' + this.htmlId + '_positionPick" class="link">Pick</span></td></tr>';
    }
    if(this.data.mode == "CREATE") {
        html += '<tr><td>Contract Type</td><td><select id="' + this.htmlId + '_contractType"></select></td></tr>';
        html += '<tr><td>Part Time Percentage</td><td><input type="text" id="' + this.htmlId + '_partTimePercentage"></td></tr>';
    }
    html += '</table>';
    return html
}
EmployeeEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_externalId').bind("change", function(event) {form.externalIdChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_userName').bind("change", function(event) {form.userNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_firstName').bind("change", function(event) {form.firstNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_lastName').bind("change", function(event) {form.lastNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_firstNameLocalLanguage').bind("change", function(event) {form.firstNameLocalLanguageChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_lastNameLocalLanguage').bind("change", function(event) {form.lastNameLocalLanguageChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_maidenName').bind("change", function(event) {form.maidenNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_email').bind("change", function(event) {form.emailChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_profile').bind("change", function(event) {form.profileChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isFuture').bind("click", function(event) {form.isFutureChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_positionPick').bind("click", function(event) {form.openPositionPicker.call(form, event);});
    $('#' + this.htmlId + '_contractType').bind("change", function(event) {form.contractTypeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_partTimePercentage').bind("change", function(event) {form.partTimePercentageChangedHandle.call(form, event)});
}
EmployeeEditForm.prototype.externalIdChangedHandle = function(event) {
    this.data.externalId = jQuery.trim(event.currentTarget.value);
    this.updateExternalIdView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.userNameChangedHandle = function(event) {
    this.data.userName = jQuery.trim(event.currentTarget.value);
    this.updateUserNameView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.firstNameChangedHandle = function(event) {
    this.data.firstName = jQuery.trim(event.currentTarget.value);
    this.updateFirstNameView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.lastNameChangedHandle = function(event) {
    this.data.lastName = jQuery.trim(event.currentTarget.value);
    this.updateLastNameView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.firstNameLocalLanguageChangedHandle = function(event) {
    this.data.firstNameLocalLanguage = jQuery.trim(event.currentTarget.value);
    this.updateFirstNameLocalLanguageView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.lastNameLocalLanguageChangedHandle = function(event) {
    this.data.lastNameLocalLanguage = jQuery.trim(event.currentTarget.value);
    this.updateLastNameLocalLanguageView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.maidenNameChangedHandle = function(event) {
    this.data.maidenName = jQuery.trim(event.currentTarget.value);
    this.updateMaidenNameView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.emailChangedHandle = function(event) {
    this.data.email = jQuery.trim(event.currentTarget.value);
    this.updateEmailView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.profileChangedHandle = function(event) {
    this.data.profile = $(event.currentTarget).val();
    this.updateProfileView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $(event.currentTarget).is(':checked');
    this.updateIsActiveView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.isFutureChangedHandle = function(event) {
    this.data.isFuture = $(event.currentTarget).is(':checked');
    this.updateIsFutureView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.openPositionPicker = function(event) {
    if(this.data.mode == "CREATE") {
        var positionPicker = new PositionPicker("positionPicker", this.pickPosition, this, this.moduleName);
        positionPicker.init();
    } else {
        doAlert("Alert", "Position can not be changed. Use Carreer panel to set new Position", null, null);
    }
}
EmployeeEditForm.prototype.pickPosition = function(position) {
    this.picked.position = position;
    this.data.positionId = this.picked.position.id;
    this.updatePositionView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.contractTypeChangedHandle = function(event) {
    this.data.contractType = $('#' + this.htmlId + '_contractType').val();
    this.updatePartTimePercentageView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.partTimePercentageChangedHandle = function(event) {
    this.data.partTimePercentage = jQuery.trim(event.currentTarget.value);
    this.updatePartTimePercentageView();
    this.dataChanged(true);
}
EmployeeEditForm.prototype.updateView = function() {
    this.updateExternalIdView();
    this.updateUserNameView();
    this.updateFirstNameView();
    this.updateLastNameView();
    this.updateFirstNameLocalLanguageView();
    this.updateLastNameLocalLanguageView();
    this.updateMaidenNameView();
    this.updateEmailView();
    this.updateProfileView();
    this.updateIsActiveView();
    this.updateIsFutureView();
    this.updatePositionView();
    this.updateContractTypeView();
    this.updatePartTimePercentageView();
}
EmployeeEditForm.prototype.updateExternalIdView = function() {
    $('#' + this.htmlId + '_externalId').val(this.data.externalId);
    if(this.data.mode == "UPDATE") {
        $('#' + this.htmlId + '_externalId').attr("disabled", true);
    } else {
        $('#' + this.htmlId + '_externalId').attr("disabled", false);
    }
}
EmployeeEditForm.prototype.updateUserNameView = function() {
    $('#' + this.htmlId + '_userName').val(this.data.userName);
}
EmployeeEditForm.prototype.updateFirstNameView = function() {
    $('#' + this.htmlId + '_firstName').val(this.data.firstName);
}
EmployeeEditForm.prototype.updateLastNameView = function() {
    $('#' + this.htmlId + '_lastName').val(this.data.lastName);
}
EmployeeEditForm.prototype.updateFirstNameLocalLanguageView = function() {
    $('#' + this.htmlId + '_firstNameLocalLanguage').val(this.data.firstNameLocalLanguage);
}
EmployeeEditForm.prototype.updateLastNameLocalLanguageView = function() {
    $('#' + this.htmlId + '_lastNameLocalLanguage').val(this.data.lastNameLocalLanguage);
}
EmployeeEditForm.prototype.updateMaidenNameView = function() {
    $('#' + this.htmlId + '_maidenName').val(this.data.maidenName);
}
EmployeeEditForm.prototype.updateEmailView = function() {
    $('#' + this.htmlId + '_email').val(this.data.email);
}
EmployeeEditForm.prototype.updateProfileView = function() {
    var html = '';
    for(var key in this.profiles) {
        var profile = this.profiles[key];
        if(key == "SUPER_USER" && (currentUser.profile != "COUNTRY_ADMINISTRATOR")) {
            continue;
        }
        if(key == "COUNTRY_ADMINISTRATOR" && ! (currentUser.profile == "COUNTRY_ADMINISTRATOR" && currentUser.isAdministrator)) {
            continue;
        }
        var isSelected = "";
        if(key == this.data.profile) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + profile + '</option>';
    }
    $('#' + this.htmlId + '_profile').html(html);
}
EmployeeEditForm.prototype.updateIsActiveView = function() {
    $('#' + this.htmlId + '_isActive').attr("checked", this.data.isActive);
}
EmployeeEditForm.prototype.updateIsFutureView = function() {
    $('#' + this.htmlId + '_isFuture').attr("checked", this.data.isFuture);
}
EmployeeEditForm.prototype.updatePositionView = function() {
    if(this.picked.position == null) {
        $('#' + this.htmlId + '_position').val("");
    } else {
        $('#' + this.htmlId + '_position').val(this.picked.position.name);
    }
}
EmployeeEditForm.prototype.updateContractTypeView = function() {
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
EmployeeEditForm.prototype.updatePartTimePercentageView = function() {
    if(this.data.contractType == 'PART_TIME') {
        $('#' + this.htmlId + '_partTimePercentage').attr("disabled", false);
        $('#' + this.htmlId + '_partTimePercentage').val(this.data.partTimePercentage);
    } else {
        $('#' + this.htmlId + '_partTimePercentage').attr("disabled", true);
        $('#' + this.htmlId + '_partTimePercentage').val('');
    }
}
EmployeeEditForm.prototype.show = function() {
    var title = 'Update Employee'
    if(this.data.mode == 'CREATE') {
        title = 'Create Employee';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 500,
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
    this.updateView();
}
EmployeeEditForm.prototype.validate = function() {
    var errors = [];
    var userNameRE = /^[a-zA-Z0-9]*$/;
    var percentageRE = /^[0-9]{1,2}$/;
    if(this.data.userName == null || this.data.userName == "") {
        errors.push("User Name is not set");
    } else if(!userNameRE.test(this.data.userName)) {
        errors.push("User Name has incorrect format. Latin letters and digits are allowed only.");
    }
    if(this.data.firstName == null || this.data.firstName == "") {
        errors.push("First Name is not set");
    }
    if(this.data.lastName == null || this.data.lastName == "") {
        errors.push("Last Name is not set");
    }
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(this.data.email == null || this.data.email == "") {
        errors.push("E-mail is not set");
    } else if(!emailRE.test(this.data.email)) {
      errors.push("E-mail has incorrect format.");
    }
    if(this.data.profile == null) {
        errors.push("Profile is not set");
    }
    if(this.data.contractType == 'PART_TIME' && ! percentageRE.test(this.data.partTimePercentage)) {
        errors.push("Part Time Percentage can have one or two digits only");
    }

    return errors;
}
EmployeeEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    }
    if(this.data.contractType != 'PART_TIME') {
        this.data.partTimePercentage = null;
    }
    if(this.data.isFuture == null) {
       this.data.isFuture = false; 
    }
    var form = this;
    var data = {};
    data.command = "saveEmployee";
    data.employeeEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.data.id = result.id;
            doAlert("Info", "This Employee has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext, this.data.id);
}

EmployeeEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function EmployeeDeleteForm(employeeId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": employeeId
    }
}
EmployeeDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
EmployeeDeleteForm.prototype.checkDependencies = function() {
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
EmployeeDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.timeSpentItems == 0 && dependencies.createdProjectCodes == 0 && dependencies.closedProjectCodes == 0 && dependencies.clientHistoryItems == 0 && dependencies.salaries == 0 && dependencies.employeeSubdepartmentHistoryItems == 0 && dependencies.rightsItems == 0) {
        if(dependencies.employeePositionHistoryItems == 0) {
            this.show();
        } else {
            var html = 'This Employee has dependencies that will be deleted too<br />';
            html += 'EmployeePositionHistoryItems: ' + dependencies.employeePositionHistoryItems + '<br />';
            doConfirm("Delete Employee", html, this, this.show, null, null);
        }
    } else {
        var html = 'This Employee has dependencies and can not be deleted<br />';
        html += 'Time Spent Items: ' + dependencies.timeSpentItems + '<br />';
        html += 'Created Project Codes: ' + dependencies.createdProjectCodes + '<br />';
        html += 'Closed Project Codes: ' + dependencies.closedProjectCodes + '<br />';
        html += 'Client History Items: ' + dependencies.clientHistoryItems + '<br />';
        html += 'Salaries: ' + dependencies.salaries + '<br />';
        html += 'EmployeeSubdepartmentHistoryItems: ' + dependencies.employeeSubdepartmentHistoryItems + '<br />';
        html += 'RightsItems: ' + dependencies.rightsItems + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
EmployeeDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "You are about to delete this Employee. Proceed with it?", this, function() {this.doDeleteEmployee()}, null, null);
}
EmployeeDeleteForm.prototype.doDeleteEmployee = function() {
    var form = this;
    var data = {};
    data.command = "deleteEmployee";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Employee has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}



//==================================================

function EmployeeExternalIdEditForm(formData, htmlId, successHandler, successContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = moduleName;
    this.data = {
        "id": formData.id,
        "externalId": formData.externalId
    }
}
EmployeeExternalIdEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
    this.dataChanged(false);
}
EmployeeExternalIdEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>External Id (1C)</td><td><input type="text" id="' + this.htmlId + '_externalId"></td></tr>';
    html += '</table>';
    return html
}
EmployeeExternalIdEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_externalId').bind("change", function(event) {form.externalIdChangedHandle.call(form, event);});
}
EmployeeExternalIdEditForm.prototype.externalIdChangedHandle = function(event) {
    this.data.externalId = jQuery.trim(event.currentTarget.value);
    this.updateExternalIdView();
    this.dataChanged(true);
}
EmployeeExternalIdEditForm.prototype.updateView = function() {
    this.updateExternalIdView();
}
EmployeeExternalIdEditForm.prototype.updateExternalIdView = function() {
    $('#' + this.htmlId + '_externalId').val(this.data.externalId);
}
EmployeeExternalIdEditForm.prototype.show = function() {
    var title = 'Update Employee External ID'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 200,
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
    this.updateView();
}
EmployeeExternalIdEditForm.prototype.validate = function() {
    var errors = [];
    var userNameRE = /^[a-zA-Z0-9]*$/;
    var percentageRE = /^[0-9]{1,2}$/;
//    if(this.data.userName == null || this.data.userName == "") {
//        errors.push("User Name is not set");
//    } else if(!userNameRE.test(this.data.userName)) {
//        errors.push("User Name has incorrect format. Latin letters and digits are allowed only.");
//    }
    return errors;
}
EmployeeExternalIdEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    }
    var form = this;
    var data = {};
    data.command = "saveExternalId";
    data.id = this.data.id;
    data.externalId = this.data.externalId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.data.id = result.id;
            doAlert("Info", "Employee external ID has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeExternalIdEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext, this.data.id);
}

EmployeeExternalIdEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}
