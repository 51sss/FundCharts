import Config from '../config'
import { Animation } from '../utils/animate'
const pieColors = Config.pie.colors;

// special的饼图
export default class Pie {
    constructor(FundChart) {
        if (!FundChart) throw new Error('Error!no canvas element.(FundChart-draw)');
        this.chartjs = FundChart;
    }

    /*
     * 清理区域
     * @param {Boolean} lineCtnBool 是否只清理图形区域
     */
    clearCtn (lineCtnBool) {
        let ctx = this.chartjs.ctx;

        ctx.beginPath();
        if (lineCtnBool) ctx.rect(46, 0, this.chartjs._chart.width, this.chartjs._chart.height - 22);
        else ctx.rect(0, 0, this.chartjs._chart.width, this.chartjs._chart.height);
        ctx.fillStyle = Config.background;
        ctx.fill();
        ctx.closePath();
    }

    drawPie(data_arr, color_arr, annularRate = 0.6, process = 1) {
        color_arr = color_arr.concat(pieColors);
        this.clearCtn();
        
        let ctx = this.chartjs.ctx;
        annularRate = annularRate > 0.9 && 0.9 || annularRate;
        let radius = this.chartjs._chart.height / 2 - 20, //半径
            radiusWhite = radius * annularRate, // 白色覆盖半径
            ox = radius + 20,
            oy = radius + 20; //圆心


        let startAngle = -0.5 * Math.PI,
            endAngle = -0.5 * Math.PI; //起始、结束弧度
        for (let i in data_arr) {
            //绘制饼图
            endAngle += data_arr[i] * 2 * Math.PI * process;
            ctx.fillStyle = color_arr[i] && ~color_arr[i].indexOf('#') ? color_arr[i] : pieColors[i];
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            //console.log(`${startAngle}, ${endAngle}`)
            ctx.arc(ox, oy, radius, startAngle, endAngle, false);
            ctx.closePath();
            ctx.fill();
            startAngle = endAngle;
        }

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        if (radiusWhite) ctx.arc(ox, oy, radiusWhite, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }

    init () {
        let _opts = this.chartjs.opts
        Animation({
            timing: 'easeInOut',
            duration: 600,
            onProcess: process => {
                this.drawPie(_opts.datas, _opts.colors, _opts.annularRate, process);
            },
            onAnimationFinish: () => {
                console.log('pie chart finish');
            }
        });
    }
}