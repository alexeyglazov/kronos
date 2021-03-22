/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CurrencyBindForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "CurrencyBindForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        "currencies": []
    }
    this.selected = {
        "currencyId": null
    }
    this.data = {
        "countryId": formData.countryId,
        "currencyId": null
    }
}
CurrencyBindForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.getInitialContent();
    this.dataChanged(false);
}
CurrencyBindForm.prototype.getInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.currencies = result.currencies;
            if(form.loaded.currencies.length > 0) {
                form.selected.currencyId = form.loaded.currencies[0].id;
            } else {
                form.selected.currencyId = null;
            }
            form.data.currencyId = form.selected.currencyId;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CurrencyBindForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Currency</td><td><select id="' + this.htmlId + '_currency"></select></td></tr>';
    html += '</table>';
    html += '<div id="' + this.htmlId + '_popup"></div>';
    return html
}
CurrencyBindForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_currency').bind("change", function(event) {form.currencyChangedHandle.call(form, event);});
}
CurrencyBindForm.prototype.currencyChangedHandle = function(event) {
    this.data.currencyId = parseInt(event.currentTarget.value);
    this.updateCurrencyView();
    this.dataChanged(true);
}

CurrencyBindForm.prototype.updateView = function() {
    this.updateCurrencyView();
}
CurrencyBindForm.prototype.updateCurrencyView = function() {
    var html = '';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.currencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.name + '</option>';
    }
    $('#'+ this.htmlId + '_currency').html(html);
}
CurrencyBindForm.prototype.show = function() {
    var title = 'Bind Currency'
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
                $(this).dialog( "close" );
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
CurrencyBindForm.prototype.validate = function() {
    var errors = [];
    return errors;
}
CurrencyBindForm.prototype.save = function() {
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
    data.command = "bindCurrency";
    data.currencyBindForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "This Currency has been successfully bound to this Country", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CurrencyBindForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}

CurrencyBindForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function CurrencyUnbindForm(countryCurrencyId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "CurrencyBindForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": countryCurrencyId
    }
}
CurrencyUnbindForm.prototype.start = function() {
    this.checkDependencies();
}
CurrencyUnbindForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkCurrencyDependencies";
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
CurrencyUnbindForm.prototype.analyzeDependencies = function(dependencies) {
    if(! dependencies.isMain) {
        this.show();
    } else {
        var html = 'This Currency is marked as Main in this Country and can not be unbound';
        doAlert("Dependencies found", html, null, null);
    }
}
CurrencyUnbindForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to unbind this Currency", this, function() {this.doUnbindCurrency()}, null, null);
}
CurrencyUnbindForm.prototype.doUnbindCurrency = function() {
    var form = this;
    var data = {};
    data.command = "unbindCurrency";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Currency has been successfully unbound from this Country", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CurrencyUnbindForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}






//==================================================

function CurrencySetMainForm(htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "CurrencyBindForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        countryCurrencies: [],
        currencies: []
    }
    this.data = {
        "mainCountryCurrencyId": null
    }
}
CurrencySetMainForm.prototype.start = function() {
    // content is either loaded from server or set by caller
    if(this.loaded.countryCurrencies.length > 0 && this.loaded.currencies.length > 0) {
        for(var key in this.loaded.countryCurrencies) {
            var countryCurrency = this.loaded.countryCurrencies[key];
            if(countryCurrency.isMain) {
                this.data.mainCountryCurrencyId = countryCurrency.id;
            }
        }
        this.containerHtmlId = getNextPopupHtmlContainer();
        this.show();
    } else {
        this.loadInitialContent();
    }
}
CurrencySetMainForm.prototype.loadInitialContent = function() {
    // todo
    // show
    this.containerHtmlId = getNextPopupHtmlContainer();
}
CurrencySetMainForm.prototype.show = function() {
    var title = 'Set main Currency'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 300,
        height: 150,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                form.save();
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
CurrencySetMainForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Main Currency</td><td><select id="' + this.htmlId + '_mainCountryCurrency"></select></td></tr>';
    html += '</table>';
    return html;
}
CurrencySetMainForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_mainCountryCurrency').bind("change", function(event) {form.mainCountryCurrencyChangedHandle.call(form, event);});
}
CurrencySetMainForm.prototype.mainCountryCurrencyChangedHandle = function(event) {
    this.data.mainCountryCurrencyId = parseInt($(event.currentTarget).val());
    this.updateView();
}
CurrencySetMainForm.prototype.updateView = function() {
    this.updateMainCountryCurrencyView();
}
CurrencySetMainForm.prototype.updateMainCountryCurrencyView = function() {
    var data = [];
    for(var key in this.loaded.countryCurrencies) {
          var countryCurrency = this.loaded.countryCurrencies[key];
          var currency = null;
          for(var keyCurrency in this.loaded.currencies) {
              var currencyTmp = this.loaded.currencies[keyCurrency];
              if(currencyTmp.id == countryCurrency.currencyId) {
                  currency = currencyTmp;
                  break;
              }
          }
          data.push({
              "id": countryCurrency.id,
              "currencyName": currency.name,
              "currencyCode": currency.code,
              "countryCurrencyIsMain": countryCurrency.isMain
          });
      }
    var html = '';
    for(var key in data) {
        var row = data[key];
        var isSelected = "";
        if(row.id == this.data.mainCountryCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + row.id + '" ' + isSelected + '>' + row.currencyName + '</option>';
    }
    $('#' + this.htmlId + '_mainCountryCurrency').html(html);
}
CurrencySetMainForm.prototype.validate = function() {
    var errors = [];
    return errors;
}
CurrencySetMainForm.prototype.save = function() {
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
    data.command = "setMainCountryCurrency";
    data.mainCountryCurrencyId = this.data.mainCountryCurrencyId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Main Currency has been successfully set", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CurrencySetMainForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
