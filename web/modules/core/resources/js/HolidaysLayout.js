/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function HolidaysLayout(htmlId, containerHtmlId) {
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.freedaysManager = null;
   this.holidaysManager = null;
}
HolidaysLayout.prototype.init = function() {
    this.show();
    this.holidaysManager = new HolidaysManager(this.htmlId + '_holidays', this.htmlId + '_holidaysTab');
    this.holidaysManager.init();
}
HolidaysLayout.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    var form = this;
    $('#' + this.htmlId + '_tabs').tabs({
        activate: function( event, ui ) {form.tabActivatedHandle(ui);}
    });
}
HolidaysLayout.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_tabs">';
    
    html += '<ul>';
    html += '<li><a href="#' + this.htmlId + '_holidaysTab">Public holidays</a></li>';
    html += '<li><a href="#' + this.htmlId + '_freedaysTab">Days-off</a></li>';
    html += '</ul>';
    
    html += '<div id="' + this.htmlId + '_holidaysTab">';
    html += '</div>';

    html += '<div id="' + this.htmlId + '_freedaysTab">';
    html += '</div>';

    html += '</div>';
    return html;    
}

HolidaysLayout.prototype.tabActivatedHandle = function(ui) {
    var idTxt = ui.newPanel[0].id;
    var parts = idTxt.split('_');
    var id = parts[parts.length - 1];
    if(id == 'freedaysTab') {
        this.freedaysManager = new FreedaysManager(this.htmlId + '_freedays', this.htmlId + '_freedaysTab');
        this.freedaysManager.init();
    } else if(id == 'holidaysTab') {
        this.holidaysManager = new HolidaysManager(this.htmlId + '_holidays', this.htmlId + '_holidaysTab');
        this.holidaysManager.init();
    }
}
