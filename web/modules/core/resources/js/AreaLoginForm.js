/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function AreaLoginForm(formData, htmlId, containerHtmlId) {
    this.config = {
        //endpointUrl: endpointsFolder+ "Login.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.areas = [];
    this.loginCheckUrl = "/modules/core/endpoints/Login.jsp";
    this.loginUrl = "/pages/en/localLogin.jsp";
    this.forgotPasswordUrl = "/pages/en/forgotPassword.jsp";
    this.areas.push({
        name: "Malta",
        application: "malta"
    });
    this.areas.push({
        name: "Qatar",
        application: "qatar"
    });    
    this.areas.push({
        name: "Russia",
        application: "russia"
    });
    this.areas.push({
        name: "Tunisia",
        application: "tunisia"
    });
    this.areas.push({
        name: "Ukraine",
        application: "ukraine"
    });
    this.data = {
        "login": formData.login,
        "password": formData.password,
        "areaId": formData.areaId
    }
    if(this.areas[this.data.areaId] == null) {
        this.data.areaId = null;
    }
}
AreaLoginForm.prototype.init = function() {
       this.show();
}
AreaLoginForm.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
AreaLoginForm.prototype.getHtml = function() {
    var html = '';
    html += '<form id="' + this.htmlId + '_loginForm" method="post">';
    html += '<table>';
    html += '<tr><td><span class="label1">Login</span></td><td><input type="text" id="' + this.htmlId + '_login" name="name" style="width: 200px;"></td></tr>';
    html += '<tr><td><span class="label1">Password</span></td><td><input type="password" id="' + this.htmlId + '_password" name="password" style="width: 200px;"></td></tr>';
    html += '<tr><td><span class="label1">Area</span></td><td><select id="' + this.htmlId + '_area" name="area"></select> <span class="link" id="' + this.htmlId + '_forgotPassword">Forgot password?</span></td></tr>';
    html += '<tr><td>&nbsp;</td><td><input id="' + this.htmlId + '_submit" type="button" value="Submit"></td></tr>';
    html += '</table>';
    html += '<input type="hidden" name="command" value="doLogin">';
    html += '</form>';
    return html
}
AreaLoginForm.prototype.updateView = function() {
    this.updateLoginView();
    this.updatePasswordView();
    this.updateAreaView();
}
AreaLoginForm.prototype.updateLoginView = function() {
    $('#' + this.htmlId + '_login').val(this.data.login);
}
AreaLoginForm.prototype.updatePasswordView = function() {
    $('#' + this.htmlId + '_password').val(this.data.password);
}
AreaLoginForm.prototype.updateAreaView = function() {
    var html = '';
    html += '<option value="ALL">...</option>';
    for(var key in this.areas) {
        var area = this.areas[key];
        var isSelected = "";
        if(key == this.data.areaId) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + area.name + '</option>';
    }
    $('#' + this.htmlId + '_area').html(html);
}
AreaLoginForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_login').bind("change", function(event) {form.loginChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_login').bind("blur", function(event) {form.loginChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_password').bind("change", function(event) {form.passwordChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_password').bind("blur", function(event) {form.passwordChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_area').bind("change", function(event) {form.areaChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_area').bind("blur", function(event) {form.areaChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_submit').bind("click", function(event) {form.checkLogin.call(form, event)});
    $('#' + this.htmlId + '_forgotPassword').bind("click", function(event) {form.forgotPassword.call(form, event)});
    $('#' + this.htmlId + '_login, #' + this.htmlId + '_password, #' + this.htmlId + '_area').bind("keyup", function(event) {form.keyupHandle.call(form, event);});
}
AreaLoginForm.prototype.loginChangedHandle = function(event) {
    this.data.login = jQuery.trim(event.currentTarget.value);
    this.updateLoginView();
}
AreaLoginForm.prototype.passwordChangedHandle = function(event) {
    this.data.password = jQuery.trim(event.currentTarget.value);
    this.updatePasswordView();
}
AreaLoginForm.prototype.areaChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_area').val();
    if(idTxt == 'ALL') {
        this.data.areaId = null;
    } else {
        this.data.areaId = parseInt(idTxt);
    }
}
AreaLoginForm.prototype.keyupHandle = function(event) {
    if(event.keyCode == '13') {
        this.checkLogin();
    }
}

AreaLoginForm.prototype.readLoginHandle = function() {
    this.data.login = jQuery.trim($('#' + this.htmlId + '_login').val());
    this.updateLoginView();
}
AreaLoginForm.prototype.readPasswordHandle = function() {
    this.data.password = jQuery.trim($('#' + this.htmlId + '_password').val());
    this.updatePasswordView();
}
AreaLoginForm.prototype.forgotPassword = function() {
    if(this.data.areaId == null) {
        doAlert("Alert", "Area is not selected");
    } else {
        var area = this.areas[this.data.areaId];
        var url = '/' + area.application + this.forgotPasswordUrl;
        location.href = url;
    }
}
AreaLoginForm.prototype.validate = function() {
    var errors = [];
    if(this.data.login == null || this.data.login == "") {
        errors.push("Login is not set");
    }
    if(this.data.password == null || this.data.password == "") {
        errors.push("Password is not set");
    }
    if(this.data.areaId === null || this.data.areaId === "") {
        errors.push("Area is not set");
    }
    return errors;
}
AreaLoginForm.prototype.checkLogin = function() {
    //to read data when filled by browser without events
    this.readLoginHandle();
    this.readPasswordHandle();

    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var form = this;
    var data = {};
    data.command = "checkLoginAndPassword";
    data.login = this.data.login;
    data.password = this.data.password;
    var area = this.areas[this.data.areaId];
    var url = '/' + area.application + this.loginCheckUrl;
    var loginUrl = '/' + area.application + this.loginUrl;
    $('#' + form.htmlId + '_loginForm').attr("action", loginUrl);
    $.ajax({
      url: url,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        var result = jQuery.parseJSON(data);
        if(result.status == "OK") {
            var expire = new Date();
            expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
            setCookie("areaId", form.data.areaId, expire.toGMTString(), null);
            $('#' + form.htmlId + '_loginForm').submit();
        } else {
            doAlert("Alert", "" + result.comment, null, null);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
