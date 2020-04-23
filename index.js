var echarts = require("echarts");
var Canvas = require("canvas-prebuilt");
var fs = require('fs');
var path = require('path');


/**
 * @param config = {
        width: 500 // Image width, type is number.
        height: 500 // Image height, type is number.
        option: {}, // Echarts configuration, type is Object.
        //If the path  is not set, return the Buffer of image.
        path:  '', // Path is filepath of the image which will be created.
    }

 *
 */
module.exports = function (config) {
    if (config.canvas) {
        Canvas = config.canvas;
    }

    var ctx = new Canvas(128, 128);
    if (config.font) {
        ctx.font = config.font;
    }

    echarts.setCanvasCreator(function () {
        return ctx;
    });

    var chart, option = {
        title: {
            text: 'test'
        },
        tooltip: {},
        legend: {
            data: ['test']
        },
        xAxis: {
            data: ["a", "b", "c", "d", "f", "g"]
        },
        yAxis: {},
        series: [{
            name: 'test',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    let defaultConfig = {
        width: 500,
        height: 500,
        option,
        enableAutoDispose: true
    }

    config = Object.assign({}, defaultConfig, config)

    config.option.animation = false;
    chart = echarts.init(new Canvas(parseInt(config.width, 10), parseInt(config.height, 10)));
    chart.setOption(config.option);
    const exportOpts = {
        backgroundColor: '#fff',
        ...config.exportOpts,
    };
    const dataURL = chart.getDataURL(exportOpts);
    const base64Image = dataURL.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
    if (config.path) {
        try {
            fs.writeFileSync(config.path, imageBuffer, { encoding: 'base64' });
            if (config.enableAutoDispose) {
                chart.dispose();
            }
            console.log("Create Img:" + config.path)
        } catch (err) {
            console.error("Error: Write File failed" + err.message)
        }

    } else {
        try {
            if (config.enableAutoDispose) {
                chart.dispose();
            }
        } catch (e) { }
        return imageBuffer;
    }
}
