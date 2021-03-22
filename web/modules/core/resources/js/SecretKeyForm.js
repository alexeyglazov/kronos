/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function SecretKeyForm(formData, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ForgotPassword.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.data = {
        "userName": formData.userName,
        "secretKey": formData.secretKey
    }
}
SecretKeyForm.prototype.init = function() {
       this.show();
}
SecretKeyForm.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
SecretKeyForm.prototype.getHtml = function() {
    var html = '';
    html += '<form>';
    html += '<table>';
    html += '<tr><td><span class="label1">User Name</span></td><td><input type="text" id="' + this.htmlId + '_userName" style="width: 200px;"></td></tr>';
    html += '<tr><td><span class="label1">Secret Key</span></td><td><input type="text" id="' + this.htmlId + '_secretKey" style="width: 200px;"></td></tr>';
    html += '<tr><td>&nbsp;</td><td><input id="' + this.htmlId + '_button" type="button" value="Submit"></td></tr>';
    html += '</table>';
    html += '</form>';
    return html
}
SecretKeyForm.prototype.updateView = function() {
    this.updateUserNameView();
    this.updateSecretKeyView();
}
SecretKeyForm.prototype.updateUserNameView = function() {
    $('#' + this.htmlId + '_userName').val(this.data.userName);
}
SecretKeyForm.prototype.updateSecretKeyView = function() {
    $('#' + this.htmlId + '_secretKey').val(this.data.secretKey);
}
SecretKeyForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_userName').bind("blur", function(event) {form.userNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_secretKey').bind("blur", function(event) {form.secretKeyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_button').bind("click", function(event) {form.startChangingPassword.call(form, event)});
}
SecretKeyForm.prototype.userNameChangedHandle = function(event) {
    this.data.userName = jQuery.trim(event.currentTarget.value);
    this.updateUserNameView();
}
SecretKeyForm.prototype.secretKeyChangedHandle = function(event) {
    this.data.secretKey = jQuery.trim(event.currentTarget.value);
    this.updateSecretKeyView();
}
SecretKeyForm.prototype.validate = function() {
    var errors = [];
    if(this.data.userName == null || this.data.userName == "") {
        errors.push("User Name is not set");
    }
    if(this.data.secretKey == null || this.data.secretKey == "") {
        errors.push("Secret Key is not set");
    }
    return errors;
}
SecretKeyForm.prototype.startChangingPassword = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "changePassword";
    data.secretKeyForm = getJSON(this.data);
    $.ajax({
      url:  this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Your password has been changed. Check your e-mail", form, form.afterChangingPassword);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SecretKeyForm.prototype.afterChangingPassword = function() {
  location.href="/";
}