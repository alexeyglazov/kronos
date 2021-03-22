/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function TimeSheet(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "TimeSheet.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.popupContainerId = "admin_popup";
    var date = new Date()
    this.year = date.getFullYear();
    this.month =  date.getMonth();
    this.days = getDays(this.year, this.month);
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.years = [];
}
TimeSheet.prototype.init = function() {
    this.getMinYear();
}
TimeSheet.prototype.getMinYear = function() {
    var form = this;
    var data = {};
    data.command = "getMinYear";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            var startYear = form.year;
            if(result.minYear != null && result.minYear < startYear) {
                startYear = result.minYear;
            }
            for(var i = startYear; i <= form.year + 1; i++) {
               form.years.push(i);
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TimeSheet.prototype.show = function() {
    $('#' + this.containerHtmlId ).html(this.getHtml());
    this.updateYearView();
    this.updateMonthView();
    this.setHandlers();
    this.standardTimeSheet = new StandardTimeSheet(this, "standardTimeSheet", this.htmlId + '_standardTimeSheet', this.year, this.month);
    this.standardTimeSheet.init();
}
TimeSheet.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Year</span></td><td><select id="' + this.htmlId + '_year"></select></td>';
    html += '<td style="padding-left: 20px;"><span class="label1">Month</span></td><td><select id="' + this.htmlId + '_month"></select></td></tr>';
    html += '</table>';
    html += '<div id="' + this.htmlId + '_standardTimeSheet"></div>';
    return html;
}
TimeSheet.prototype.updateYearView = function() {
    var html = '';
    for(var i in this.years) {
        var isSelected = "";
        if(this.years[i] == this.year) {
           isSelected = "selected";
        }
        html += '<option value="' + this.years[i] + '" ' + isSelected + '>' + this.years[i] + '</option>';
    }
    return $('#' + this.htmlId + '_year').html(html);
}
TimeSheet.prototype.updateMonthView = function() {
    var html = '';
    for(var i in this.months) {
        var isSelected = "";
        if(i == this.month) {
           isSelected = "selected";
        }
        html += '<option value="' + i + '" ' + isSelected + '>' + this.months[i] + '</option>';
    }
    return $('#' + this.htmlId + '_month').html(html);
}
TimeSheet.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_month').bind("change", function(event) {form.monthChangedHandle.call(form)});
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form)});
}
TimeSheet.prototype.monthChangedHandle = function() {
    this.month = parseInt($('#' + this.htmlId + '_month').val());
    this.days = getDays(this.year, this.month);
    this.show();
}
TimeSheet.prototype.yearChangedHandle = function() {
    this.year = parseInt($('#' + this.htmlId + '_year').val());
    this.days = getDays(this.year, this.month);
    this.show();
}