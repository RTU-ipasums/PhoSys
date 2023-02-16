import * as d3 from "d3";import * as mpld3 from 'mpld3';

mpld3.register_plugin("interactive_legend", InteractiveLegend);
InteractiveLegend.prototype = Object.create(mpld3.Plugin.prototype);
InteractiveLegend.prototype.constructor = InteractiveLegend;
InteractiveLegend.prototype.requiredProps = ["element_ids", "labels"];
InteractiveLegend.prototype.defaultProps = {"ax":null,
                                            "alpha_unsel":0.2,
                                            "alpha_over":1.0,
                                            "start_visible":true,
                                            "font_size": 10,
                                            "legend_offset": [0,0]}
function InteractiveLegend(fig, props){
    mpld3.Plugin.call(this, fig, props);
};

InteractiveLegend.prototype.draw = function(){
    var alpha_unsel = this.props.alpha_unsel;
    var alpha_over = this.props.alpha_over;
    var font_size = this.props.font_size;
    var legend_offset = this.props.legend_offset;

    var legendItems = new Array();
    for(var i=0; i<this.props.labels.length; i++){
        var obj = {};
        obj.label = this.props.labels[i];

        var element_id = this.props.element_ids[i];
        var mpld3_elements = [];
        for(var j=0; j<element_id.length; j++){
            var mpld3_element = mpld3.get_element(element_id[j], this.fig);

            // mpld3_element might be null in case of Line2D instances
            // for we pass the id for both the line and the markers. Either
            // one might not exist on the D3 side
            if(mpld3_element){
                mpld3_elements.push(mpld3_element);
            }
        }

        obj.mpld3_elements = mpld3_elements;
        obj.visible = this.props.start_visible[i]; // should become be setable from python side
        legendItems.push(obj);
        set_alphas(obj, false);
    }

    // determine the axes with which this legend is associated
    var ax = this.props.ax
    if(!ax){
        ax = this.fig.axes[0];
    } else{
        ax = mpld3.get_element(ax, this.fig);
    }

    // add a legend group to the canvas of the figure
    var legend = this.fig.canvas.append("svg:g")
                           .attr("class", "legend");

    // add the rectangles
    legend.selectAll("rect")
            .data(legendItems)
            .enter().append("rect")
            .attr("height", 0.7*font_size)
            .attr("width", 1.6*font_size)
            .attr("x", ax.width + ax.position[0] + 15 + legend_offset[0])
            .attr("y",function(d,i) {
                       return ax.position[1] + i * (font_size+5) + 10 + legend_offset[1];})
            .attr("stroke", get_color)
            .attr("class", "legend-box")
            .style("fill", function(d, i) {
                       return d.visible ? get_color(d) : "white";})
            .on("click", click).on('mouseover', over).on('mouseout', out);

    // add the labels
    legend.selectAll("text")
          .data(legendItems)
          .enter().append("text")
          .attr("font-size", font_size)
          .attr("x", function (d) {
                       return ax.width + ax.position[0] + (1.9*font_size+15) + legend_offset[0];})
          .attr("y", function(d,i) {
                       return ax.position[1] + i * (font_size+5) + 10 + (0.72*font_size-1) + legend_offset[1];})
          .text(function(d) { return d.label })
          .on('mouseover', over).on('mouseout', out);


    // specify the action on click
    function click(d,i){
        d.visible = !d.visible;
        d3.select(this)
          .style("fill",function(d, i) {
            return d.visible ? get_color(d) : "white";
          })
        set_alphas(d, false);

    };

    // specify the action on legend overlay 
    function over(d,i){
         set_alphas(d, true);
    };

    // specify the action on legend overlay 
    function out(d,i){
         set_alphas(d, false);
    };

    // helper function for setting alphas
    function set_alphas(d, is_over){
        for(var i=0; i<d.mpld3_elements.length; i++){
            var type = d.mpld3_elements[i].constructor.name;

            if(type =="mpld3_Line"){
                var current_alpha = d.mpld3_elements[i].props.alpha;
                var current_alpha_unsel = current_alpha * alpha_unsel;
                var current_alpha_over = current_alpha * alpha_over;
                d3.select(d.mpld3_elements[i].path.nodes()[0])
                    .style("stroke-opacity", is_over ? current_alpha_over :
                                            (d.visible ? current_alpha : current_alpha_unsel))
                    .style("stroke-width", is_over ?
                            alpha_over * d.mpld3_elements[i].props.edgewidth : d.mpld3_elements[i].props.edgewidth);
            } else if((type=="mpld3_PathCollection")||
                     (type=="mpld3_Markers")){
                var current_alpha = d.mpld3_elements[i].props.alphas[0];
                var current_alpha_unsel = current_alpha * alpha_unsel;
                var current_alpha_over = current_alpha * alpha_over;
                d.mpld3_elements[i].pathsobj
                    .style("stroke-opacity", is_over ? current_alpha_over :
                                            (d.visible ? current_alpha : current_alpha_unsel))
                    .style("fill-opacity", is_over ? current_alpha_over :
                                            (d.visible ? current_alpha : current_alpha_unsel));
            } else{
                console.log(type + " not yet supported");
            }
        }
    };


    // helper function for determining the color of the rectangles
    function get_color(d){
        var type = d.mpld3_elements[0].constructor.name;
        var color = "black";
        if(type =="mpld3_Line"){
            color = d.mpld3_elements[0].props.edgecolor;
        } else if((type=="mpld3_PathCollection")||
                  (type=="mpld3_Markers")){
            color = d.mpld3_elements[0].props.facecolors[0];
        } else{
            console.log(type + " not yet supported");
        }
        return color;
    };
};