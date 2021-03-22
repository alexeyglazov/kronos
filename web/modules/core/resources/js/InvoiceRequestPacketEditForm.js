/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function InvoiceRequestPacketEditForm(formData, moduleName, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "InvoiceRequestPacketCreationForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = moduleName;
    this.enums = {
        "statuses": {
            "SUSPENDED": "Suspended",
            "ACTIVE": "Active",
            "LOCKED": "Locked",
            "CLOSED": "Closed"
        }
    }
    this.loaded = {
    }
    this.data = {
        "id": formData.id,
        "projectCodeId": formData.projectCodeId,
        "withVAT" : formData.withVAT,
        "comment" : formData.comment,
        "status": formData.status
    }
}
InvoiceRequestPacketEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
    this.dataChanged(false);
}
InvoiceRequestPacketEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr><td><label for="' + this.htmlId + '_withVAT">With VAT</label></td><td><input  type="checkbox" id="' + this.htmlId + '_withVAT"></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_comment">Internal comment</label></td><td><textarea id="' + this.htmlId + '_comment" style="width: 300px; height: 75px;"></textarea></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_status">Status</label></td><td><select id="' + this.htmlId + '_status"></select></td></tr>';
    html += '</table>';
    return html
}
InvoiceRequestPacketEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_withVAT').bind("click", function(event) {form.withVATClickedHandle.call(form, event);});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_status').bind("change", function(event) {form.statusChangedHandle.call(form, event);});
}
InvoiceRequestPacketEditForm.prototype.withVATClickedHandle = function(event) {
    this.data.withVAT = $(event.currentTarget).is(":checked");
    this.updateWithVATView();
    this.dataChanged(true);
}
InvoiceRequestPacketEditForm.prototype.commentChangedHandle = function(event) {
    this.data.comment = jQuery.trim(event.currentTarget.value);
    this.updateCommentView();
    this.dataChanged(true);
}
InvoiceRequestPacketEditForm.prototype.statusChangedHandle = function(event) {
    this.data.status = jQuery.trim(event.currentTarget.value);
    if(this.data.status == '') {
        this.data.status = null;
    }
    this.updateStatusView();
    this.dataChanged(true);
}
InvoiceRequestPacketEditForm.prototype.updateView = function(event) {
    this.updateWithVATView();
    this.updateCommentView();
    this.updateStatusView();
}
InvoiceRequestPacketEditForm.prototype.updateWithVATView = function() {
    $('#' + this.htmlId + '_withVAT').attr("checked", this.data.withVAT);
}
InvoiceRequestPacketEditForm.prototype.updateCommentView = function() {
    $('#' + this.htmlId + '_comment').val(this.data.comment);
}
InvoiceRequestPacketEditForm.prototype.updateStatusView = function() {
    var html = '';
    //html += '<option value="" >...</option>';
    for(var key in this.enums.statuses) {
        var status = this.enums.statuses[key];
        var isSelected = "";
        if(key == this.data.status) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + status + '</option>';
    }
    $('#' + this.htmlId + '_status').html(html);
}
InvoiceRequestPacketEditForm.prototype.show = function() {
    var title = 'Update Tax Invoice Request';
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 300,
        height: 250,
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
}
InvoiceRequestPacketEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]*$/;
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    //if(this.data.projectCodeId == null) {
    //    errors.push("Project Code is not set");
    //}
    if(this.data.status === null) {
        errors.push("Status is not set");
    } else if(this.data.status == 'CLOSED' || this.data.status == 'LOCKED') {
        errors.push("Saving request with LOCKED or CLOSED status is not allowed");
    } 
    return errors;
}
InvoiceRequestPacketEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    var form = this;
    var data = {};
    data.command = "saveEditedInvoiceRequestPacket";
    data.invoiceRequestPacketEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Data have been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
InvoiceRequestPacketEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
InvoiceRequestPacketEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}

