/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ForgotPasswordForm(formData, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ForgotPassword.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.identifierTypes = {
        "USER_NAME": "Login",
        "EMAIL": "E-mail"
    }
    this.data = {
        "identifierType": formData.identifierType,
        "identifier": formData.identifier
    }
}
ForgotPasswordForm.prototype.init = function() {
       this.show();
}
ForgotPasswordForm.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
ForgotPasswordForm.prototype.getHtml = function() {
    var html = '';
    html += '<form>';
    html += '<table>';
    html += '<tr><td><span class="label1">Identifier Type</span></td><td><select id="' + this.htmlId + '_identifierType"></select></td></tr>';
    html += '<tr><td><span class="label1">Identifier</span></td><td><input type="text" id="' + this.htmlId + '_identifier" style="width: 200px;"></td></tr>';
    html += '<tr><td>&nbsp;</td><td><input id="' + this.htmlId + '_button" type="button" value="Submit"></td></tr>';
    html += '</table>';
    html += '</form>';
    return html
}
ForgotPasswordForm.prototype.updateView = function() {
    this.updateIdentifierTypeView();
    this.updateIdentifierView();
}
ForgotPasswordForm.prototype.updateIdentifierTypeView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.identifierTypes) {
        var identifierType = this.identifierTypes[key];
        var isSelected = "";
        if(key == this.data.identifierType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + identifierType + '</option>';
    }
    $('#' + this.htmlId + '_identifierType').html(html);
}
ForgotPasswordForm.prototype.updateIdentifierView = function() {
    $('#' + this.htmlId + '_identifier').val(this.data.identifier);
}
ForgotPasswordForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_identifierType').bind("change", function(event) {form.identifierTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_identifier').bind("blur", function(event) {form.identifierChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_button').bind("click", function(event) {form.startCheckingRequest.call(form, event)});
}
ForgotPasswordForm.prototype.identifierTypeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_identifierType').val();
    if(idTxt == '') {
        this.data.identifierType = null;
    } else {
        this.data.identifierType = idTxt;
    }
}
ForgotPasswordForm.prototype.identifierChangedHandle = function(event) {
    this.data.identifier = jQuery.trim(event.currentTarget.value);
    this.updateIdentifierView();
}
ForgotPasswordForm.prototype.validate = function() {
    var errors = [];
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(this.data.identifierType == null) {
        errors.push("Identifier Type is not set");
    }
    if(this.data.identifier == null || this.data.identifier == "") {
        errors.push("Identifier is not set");
    }
    if(this.data.identifierType == "EMAIL" && !(this.data.identifier == null || this.data.identifier == "")) {
        if(!emailRE.test(this.data.identifier)) {
            errors.push("E-mail has incorrect format.");
        }
    }
    return errors;
}
ForgotPasswordForm.prototype.startCheckingRequest = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "checkRequest";
    data.forgotPasswordForm = getJSON(this.data);
    $.ajax({
      url:  this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        var result = jQuery.parseJSON(data);
        if(result.status == "OK") {
            doAlert("Info", "E-mail has been sent to you", form, form.afterCheckingRequest);
        } else {
            doAlert("Alert", "" + result.comment, null, null);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ForgotPasswordForm.prototype.afterCheckingRequest = function() {
    secretKeyForm = new SecretKeyForm({"secretKey": null, "userName": null}, "secretKeyForm", this.containerHtmlId);
    secretKeyForm.init();
}