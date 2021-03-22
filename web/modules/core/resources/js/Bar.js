function Bar(id, options) {
    this.id = id;
    options = {
        "class" : "red" | "green",
        "color" : "#ffaaaa",
        "value" : "15%",
        "title" : "30/200",
        "width": 400,
        "height": 15,
    }
    this.id = id;
    this.options = options;
}
Bar.prototype.show = function(containerId) {
    var html = '';
    html += '<canvas id="' + this.id + '" title="Wow!!!"></canvas>';
    $('#' + containerId).html(html);
    var canvas = document.getElementById(this.id);
    canvas.width  = 500;
    canvas.height = 20;
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 1; // Ширина линии
    ctx.fillStyle = '#aa4643'; // Цвет заливки
    ctx.strokeStyle = "#ffffff";     
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur    = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(0, 5, 100, 10);
    
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText ('Hello world!', 75, 3);

}


