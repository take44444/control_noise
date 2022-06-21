import * as PIXI from 'pixi.js';
import * as FORM from './form.js';
import * as FIELD from './field.js'
import * as UTIL from './util.js'
import * as AUDIO from './audio.js';

let time;
let app;
let audio;
let form;
let perlinField;
let sphericalField;

function init() {
    time = 0;
    app = new PIXI.Application({
        width: 840,
        height: 1120,
        autoDensity: true,
    });
    document.getElementById('app').appendChild(app.view);
    app.stage.addChild(new PIXI.Graphics()
            .beginFill(0xD8D8FF)
            .drawRect(0, 0, app.screen.width, app.screen.height)
            .endFill());

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create form
    form = new FORM.Form({
        x: app.screen.width/2, y: app.screen.height/2, w: 226, h: 226,
        size: 2.5, div: [127, 127], color: 0x0A0A0A
    });
    perlinField = new FIELD.PerlinField({
        scale: 0.01, flow: [0, 2.0], evolution: 1.8, displace: 80.0
    });
    sphericalField = new FIELD.SphericalField({
        r: 280,
        strength: 107
    });
    form.pushField(perlinField.getFunc(0, time));
    form.pushField(sphericalField.getFunc());
    form.execute();
    form.container.filters = [UTIL.glowFilter(0x0A0A0A, 30)];
    app.stage.addChild(form.container);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create play button
    audio = new AUDIO.Audio(
        'bgm.mp3', app.screen.width/2-43.2, app.screen.height-100, 30
    );
    app.stage.addChild(audio.container);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // finalize
    app.ticker.add(animate);
    animate();
}

function animate() {
    time += app.ticker.deltaMS/1000;
    let audioData = audio.getAudio().slice(0, 8);
    let input = audioData.reduce((a, b) => a + b, 0) / audioData.length / 200; // (3+Math.sin(time))/3.5;
    form.pushField(perlinField.getFunc(input, time));
    form.pushField(sphericalField.getFunc());
    form.execute();
}

WebFont.load({
    google: { families: ['Noto Sans Mono'] },
    active: () => init(),
    inactive: () => alert('font loading failed')
});